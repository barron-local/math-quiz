/**
 * Universal Thai Speech Engine (หวาน ใส ธรรมชาติ ใช้งานได้ทุกอุปกรณ์ แม้ไม่ได้ติดตั้ง TTS ในเครื่อง)
 *
 * 1. Primary: High-fidelity sweet Thai female audio stream via Google Neural Voice (zero installation required, works on any Windows/Mac/iOS/Android/Linux)
 * 2. Fallback: Native Web Speech API with pitch & rate tuning for sweet kid-friendly cadence
 * 3. Pre-buffering & Memory caching for zero-latency instant replays
 */

// Active audio playback references
let currentAudio: HTMLAudioElement | null = null
let currentSequenceId = 0
let activeUtterance: SpeechSynthesisUtterance | null = null
let cachedVoices: SpeechSynthesisVoice[] = []
let isWarmedUp = false

// In-memory audio cache for instant playback of repeated phrases & numbers
const audioCache = new Map<string, HTMLAudioElement>()

/**
 * Pre-warm and unlock audio context for iOS Safari and mobile devices
 */
export function warmUpSpeech(): void {
  if (typeof window === 'undefined' || isWarmedUp) return
  isWarmedUp = true

  // 1. Warm up HTML5 Audio (bypasses mobile auto-play restrictions)
  try {
    const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAP8A')
    silentAudio.volume = 0.01
    const playPromise = silentAudio.play()
    if (playPromise !== undefined) {
      playPromise.then(() => silentAudio.pause()).catch(() => {})
    }
  } catch {
    // Ignore warmup error
  }

  // 2. Warm up SpeechSynthesis if available
  if ('speechSynthesis' in window) {
    try {
      const emptyUtterance = new SpeechSynthesisUtterance(' ')
      emptyUtterance.volume = 0.01
      window.speechSynthesis.speak(emptyUtterance)
      window.speechSynthesis.resume()
    } catch {
      // Ignore
    }
  }
}

// Global user gesture listeners to unlock audio as early as possible
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    warmUpSpeech()
    window.removeEventListener('touchstart', unlockAudio, true)
    window.removeEventListener('touchend', unlockAudio, true)
    window.removeEventListener('click', unlockAudio, true)
  }
  window.addEventListener('touchstart', unlockAudio, { capture: true, passive: true })
  window.addEventListener('touchend', unlockAudio, { capture: true, passive: true })
  window.addEventListener('click', unlockAudio, { capture: true, passive: true })

  // Pre-load voices if SpeechSynthesis exists
  if ('speechSynthesis' in window) {
    const loadVoices = () => {
      try {
        const v = window.speechSynthesis.getVoices()
        if (v && v.length > 0) {
          cachedVoices = v
        }
      } catch {
        // Ignore
      }
    }
    loadVoices()
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }
}

/**
 * Immediately stop any ongoing audio and speech
 */
export function stopSpeaking(): void {
  currentSequenceId++

  if (currentAudio) {
    try {
      currentAudio.pause()
      currentAudio.currentTime = 0
    } catch {
      // Ignore
    }
    currentAudio = null
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel()
    } catch {
      // Ignore
    }
    activeUtterance = null
  }
}

/**
 * Normalize Thai text for child-friendly natural cadence
 */
function normalizeThaiText(text: string): string {
  return text
    .replace(/สวัสดีครับ/g, 'สวัสดี')
    .replace(/ครับ/g, 'คับ')
    .replace(/คร้าบ/g, 'ค้าบ')
    .replace(/จ้า/g, '')
    .replace(/จ้ะ/g, '')
    .replace(/นะจ๊ะ/g, 'นะ')
    .replace(/\.\.\./g, ' ')
    .trim()
}

/**
 * Split text into safe chunks for online TTS (<160 chars per chunk)
 */
function splitTextIntoChunks(text: string, maxLen = 150): string[] {
  if (text.length <= maxLen) return [text]

  const chunks: string[] = []
  // Split by natural clause delimiters
  const segments = text.split(/([!?,;\n]|แล้ว|นะคะ|นะ)/g)
  let current = ''

  for (const seg of segments) {
    if (!seg) continue
    if ((current + seg).length <= maxLen) {
      current += seg
    } else {
      if (current.trim()) chunks.push(current.trim())
      current = seg
    }
  }
  if (current.trim()) {
    chunks.push(current.trim())
  }
  return chunks.length > 0 ? chunks : [text.slice(0, maxLen)]
}

/**
 * Generate Google TTS URL (Returns sweet neural Thai female voice)
 */
/**
 * Generate audio stream URL using our /api/tts proxy (works on any device, zero CORS/Referer issues)
 */
function getAudioUrl(text: string): string {
  return `/api/tts?text=${encodeURIComponent(text)}`
}

/**
 * Fallback to Web Speech API when offline or if audio stream fails
 */
function speakViaWebSpeech(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  customRate?: number
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd()
    return
  }

  try {
    window.speechSynthesis.cancel()
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }
  } catch {
    // Ignore
  }

  const utterance = new SpeechSynthesisUtterance(text)
  activeUtterance = utterance
  utterance.lang = 'th-TH'
  utterance.volume = 1.0

  let voices = window.speechSynthesis.getVoices()
  if (!voices || voices.length === 0) {
    voices = cachedVoices
  } else {
    cachedVoices = voices
  }

  const thaiVoices = voices.filter(
    (v) =>
      v.lang === 'th-TH' ||
      v.lang === 'th_TH' ||
      v.lang.toLowerCase().startsWith('th')
  )

  let isKnownMale = false
  if (thaiVoices.length > 0) {
    // Specifically prioritize female voices (Premwadee, Achara, Google Thai Female)
    const femaleVoice = thaiVoices.find((v) => {
      const name = v.name.toLowerCase()
      return (
        name.includes('premwadee') ||
        name.includes('achara') ||
        name.includes('kanya') ||
        (name.includes('google') && !name.includes('male'))
      )
    })

    // Filter out known male voices (Pattara, Niwat)
    const nonMaleVoice = thaiVoices.find((v) => {
      const name = v.name.toLowerCase()
      return !name.includes('pattara') && !name.includes('niwat') && !name.includes('male')
    })

    const preferredVoice = femaleVoice || nonMaleVoice || thaiVoices[0]

    if (preferredVoice) {
      utterance.voice = preferredVoice
      const lowName = preferredVoice.name.toLowerCase()
      if (lowName.includes('pattara') || lowName.includes('niwat') || lowName.includes('male')) {
        isKnownMale = true
      }
    }
  }

  // If only a male voice is installed on Windows, pitch it up to 1.35 to sound cute and friendly
  utterance.pitch = isKnownMale ? 1.35 : 1.15
  utterance.rate = typeof customRate === 'number' ? customRate : 1.05

  const cleanup = () => {
    if (activeUtterance === utterance) {
      activeUtterance = null
    }
    if (onEnd) onEnd()
  }

  utterance.onstart = () => {
    if (onStart) onStart()
  }
  utterance.onend = cleanup
  utterance.onerror = (e) => {
    if (e.error !== 'canceled' && e.error !== 'interrupted') {
      console.warn('SpeechSynthesis fallback error:', e.error)
    }
    cleanup()
  }

  try {
    window.speechSynthesis.speak(utterance)
  } catch {
    cleanup()
  }
}

/**
 * Universal speech player:
 * Plays sweet Thai female voice on ANY device (even without Thai TTS installed).
 */
export function speakThaiText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  customRate?: number
): void {
  if (!text || typeof window === 'undefined') {
    if (onEnd) onEnd()
    return
  }

  // 1. Immediately cancel previous playback
  stopSpeaking()

  const seqId = currentSequenceId
  const normalized = normalizeThaiText(text)
  const chunks = splitTextIntoChunks(normalized)

  let chunkIndex = 0
  let hasStarted = false

  const playNextChunk = () => {
    // If user clicked another action, abort obsolete sequence
    if (seqId !== currentSequenceId) return

    if (chunkIndex >= chunks.length) {
      currentAudio = null
      if (onEnd) onEnd()
      return
    }

    const chunk = chunks[chunkIndex]
    const url = getAudioUrl(chunk)

    // Check memory cache or create new Audio element
    let audio = audioCache.get(chunk)
    if (!audio) {
      audio = new Audio(url)
      // Cache small common phrases for instant replay
      if (chunk.length < 50) {
        audioCache.set(chunk, audio)
      }
    } else {
      audio.currentTime = 0
    }

    currentAudio = audio
    audio.playbackRate = typeof customRate === 'number' ? customRate : 1.15

    audio.onplay = () => {
      if (!hasStarted) {
        hasStarted = true
        if (onStart) onStart()
      }
    }

    audio.onended = () => {
      chunkIndex++
      playNextChunk()
    }

    audio.onerror = () => {
      // If online stream fails (e.g. offline device), seamlessly fallback to Web Speech
      console.warn('Online Thai audio stream unreachable, falling back to Web Speech API.')
      speakViaWebSpeech(normalized, onStart, onEnd, customRate)
    }

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Auto-play was blocked or network interrupted: try fallback
        console.warn('Audio play promise caught:', err.name)
        if (err.name === 'NotAllowedError') {
          // Awaiting user gesture
          if (onEnd) onEnd()
        } else {
          speakViaWebSpeech(normalized, onStart, onEnd, customRate)
        }
      })
    }
  }

  playNextChunk()
}

/**
 * Format math formula into natural Thai speech for children
 * e.g., "7 + 2 = ?" -> "เจ็ด บวก สอง ได้เท่ากับเท่าไหร่เอ่ย"
 */
const THAI_NUMBER_WORDS: Record<number, string> = {
  0: 'ศูนย์',
  1: 'หนึ่ง',
  2: 'สอง',
  3: 'สาม',
  4: 'สี่',
  5: 'ห้า',
  6: 'หก',
  7: 'เจ็ด',
  8: 'แปด',
  9: 'เก้า',
  10: 'สิบ',
  11: 'สิบเอ็ด',
  12: 'สิบสอง',
  13: 'สิบสาม',
  14: 'สิบสี่',
  15: 'สิบห้า',
  16: 'สิบหก',
  17: 'สิบเจ็ด',
  18: 'สิบแปด',
  19: 'สิบเก้า',
  20: 'ยี่สิบ',
  21: 'ยี่สิบเอ็ด',
  22: 'ยี่สิบสอง',
  23: 'ยี่สิบสาม',
  24: 'ยี่สิบสี่',
  25: 'ยี่สิบห้า',
  26: 'ยี่สิบหก',
  27: 'ยี่สิบเจ็ด',
  28: 'ยี่สิบแปด',
  29: 'ยี่สิบเก้า',
  30: 'สามสิบ',
}

export function formatThaiNumber(n: number): string {
  return THAI_NUMBER_WORDS[n] || String(n)
}

export function formatProblemForSpeech(
  num1: number,
  operator: '+' | '-',
  num2: number,
  num3?: number
): string {
  const word1 = formatThaiNumber(num1)
  const word2 = formatThaiNumber(num2)
  const opWord = operator === '+' ? 'บวก' : 'ลบ'

  if (typeof num3 === 'number') {
    const word3 = formatThaiNumber(num3)
    return `${word1} บวก ${word2} แล้วบวกอีก ${word3} ได้เท่ากับเท่าไหร่เอ่ย`
  }

  return `${word1} ${opWord} ${word2} ได้เท่ากับเท่าไหร่เอ่ย`
}

/**
 * Step explanation text for 3-number addition
 */
export function getAddition3StepSpeech(
  step: 1 | 2 | 3,
  num1: number,
  num2: number,
  num3: number,
  _kidName?: string
): string {
  const n1 = formatThaiNumber(num1)
  const n2 = formatThaiNumber(num2)
  const n3 = formatThaiNumber(num3)
  const step1Sum = num1 + num2
  const step1SumWord = formatThaiNumber(step1Sum)
  const finalSum = step1Sum + num3
  const finalSumWord = formatThaiNumber(finalSum)
  if (step === 1) {
    return `ขั้นที่หนึ่ง จับคู่ ${n1} บวก ${n2} ได้ ${step1SumWord}`
  }
  if (step === 2) {
    return `ขั้นที่สอง นำ ${step1SumWord} บวกอีก ${n3}`
  }
  return `คำตอบคือ ${finalSumWord}`
}
