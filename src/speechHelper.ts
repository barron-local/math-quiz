/**
 * Helper to speak math problems and encouragement using Web Speech Synthesis.
 * Optimized for natural, cheerful kid-friendly Thai speech (pitch: 1.25, rate: 0.95).
 */

// Keep a global reference to the active utterance so browser garbage collection doesn't cancel audio prematurely
let activeUtterance: SpeechSynthesisUtterance | null = null
let cachedVoices: SpeechSynthesisVoice[] = []

let isWarmedUp = false

// Helper called on user touch to unlock iOS Safari and mobile speech synthesis
export function warmUpSpeech(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || isWarmedUp) return
  isWarmedUp = true
  try {
    const emptyUtterance = new SpeechSynthesisUtterance(' ')
    emptyUtterance.volume = 0.01
    window.speechSynthesis.speak(emptyUtterance)
    window.speechSynthesis.resume()
  } catch {
    // Ignore warmup error
  }
}

// Pre-warm and cache voices as soon as possible
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    try {
      const v = window.speechSynthesis.getVoices()
      if (v && v.length > 0) {
        cachedVoices = v
      }
    } catch {
      // Ignore errors on restricted environments
    }
  }

  loadVoices()
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices
  }

  // Also hook into touchstart/click globally once to ensure mobile speech audio context is unlocked
  const unlockAudio = () => {
    warmUpSpeech()
    window.removeEventListener('touchstart', unlockAudio, true)
    window.removeEventListener('touchend', unlockAudio, true)
    window.removeEventListener('click', unlockAudio, true)
  }
  window.addEventListener('touchstart', unlockAudio, { capture: true, passive: true })
  window.addEventListener('touchend', unlockAudio, { capture: true, passive: true })
  window.addEventListener('click', unlockAudio, { capture: true, passive: true })
}

export function speakThaiText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  customRate?: number
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.')
    if (onEnd) onEnd()
    return
  }

  try {
    // 1. Cancel previous utterance and resume synthesis queue (fixes frozen/stuck state in Chrome/Safari)
    window.speechSynthesis.cancel()
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }
  } catch (e) {
    console.warn('Could not reset speechSynthesis state', e)
  }

  // Normalize phonetic Thai text to avoid robotic TTS quirks (e.g. "สวัสดีครับ" being mispronounced as "สวัสดีขอรับ", or "แล้วนะ" sounding unnatural)
  const normalizedText = text
    .replace(/สวัสดีครับ/g, 'สวัสดีจ้า')
    .replace(/ครับ/g, 'คับ')
    .replace(/คร้าบ/g, 'ค้าบ')
    .replace(/แล้วนะ/g, 'แล้วจ้า')
    .replace(/แล้วน้า/g, 'แล้วจ้า')

  const utterance = new SpeechSynthesisUtterance(normalizedText)
  activeUtterance = utterance

  // Standard Thai language code
  utterance.lang = 'th-TH'

  // Soft, warm, and gentle kid-friendly speech tuning
  utterance.volume = 0.95 // Clear volume
  utterance.pitch = 1.08 // Warm, friendly, and natural pitch (not shrill)
  utterance.rate = typeof customRate === 'number' ? customRate : 0.9 // Comfortable pacing for young ears

  // Get freshest voices list, falling back to cached voices
  let voices = window.speechSynthesis.getVoices()
  if (!voices || voices.length === 0) {
    voices = cachedVoices
  } else {
    cachedVoices = voices
  }

  // Look for Thai voices
  const thaiVoices = voices.filter(
    (v) =>
      v.lang === 'th-TH' ||
      v.lang === 'th_TH' ||
      v.lang.toLowerCase().startsWith('th')
  )

  if (thaiVoices.length > 0) {
    // Prioritize natural/neural Thai voices if available (e.g., Premwadee, Niwat, Achara, Google Thai)
    const preferredVoice =
      thaiVoices.find((v) => {
        const name = v.name.toLowerCase()
        return name.includes('natural') || name.includes('online') || name.includes('neural')
      }) ||
      thaiVoices.find((v) => {
        const name = v.name.toLowerCase()
        return name.includes('premwadee') || name.includes('achara') || name.includes('niwat')
      }) ||
      thaiVoices.find((v) => v.name.toLowerCase().includes('google')) ||
      thaiVoices[0]

    if (preferredVoice) {
      utterance.voice = preferredVoice
    }
  }

  const cleanup = () => {
    if (activeUtterance === utterance) {
      activeUtterance = null
    }
    if (onEnd) {
      onEnd()
    }
  }

  utterance.onstart = () => {
    if (onStart) onStart()
  }

  utterance.onend = cleanup

  utterance.onerror = (event) => {
    // Ignore harmless 'canceled' or 'interrupted' errors when another sound starts
    if (event.error !== 'canceled' && event.error !== 'interrupted') {
      console.warn('SpeechSynthesis error:', event.error)
    }
    cleanup()
  }

  // Periodic resume heartbeat for long speech (Chromium bug where speech pauses after ~15s)
  const resumeInterval = setInterval(() => {
    if (!window.speechSynthesis.speaking) {
      clearInterval(resumeInterval)
    } else if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }
  }, 3000)

  try {
    window.speechSynthesis.speak(utterance)
    // Extra kick in case browser starts in paused state
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }
  } catch (err) {
    console.error('Speech speak error:', err)
    cleanup()
  }
}

/**
 * Format math formula into natural Thai speech for children
 * e.g., "7 + 2 = ?" -> "เจ็ด บวก สอง ได้เท่าไหร่ครับ"
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
  kidName?: string
): string {
  const n1 = formatThaiNumber(num1)
  const n2 = formatThaiNumber(num2)
  const n3 = formatThaiNumber(num3)
  const step1Sum = num1 + num2
  const step1SumWord = formatThaiNumber(step1Sum)
  const finalSum = step1Sum + num3
  const finalSumWord = formatThaiNumber(finalSum)
  const nameSuffix = kidName ? `น้อง${kidName}` : 'คนเก่ง'

  if (step === 1) {
    return `ขั้นที่หนึ่งจ้า... เรามาจับคู่สองตัวแรกกันก่อนนะ... นำ ${n1}... บวกกับ ${n2}... ได้ผลบวกเท่ากับ ${step1SumWord} จ้า`
  }
  if (step === 2) {
    return `ขั้นที่สองจ้า... นำ ${step1SumWord} ที่เราบวกได้ตะกี้... ไปบวกเพิ่มกับตัวเลขที่สาม... คือบวกอีก ${n3} นะจ๊ะ`
  }
  return `ดังนั้น... ${n1}... บวก ${n2}... บวก ${n3}... ได้คำตอบเท่ากับ ${finalSumWord} จ้า! จำวิธีคิดทีละคู่นี้ไว้นะน้อง${nameSuffix}... เก่งมากๆ เลย!`
}
