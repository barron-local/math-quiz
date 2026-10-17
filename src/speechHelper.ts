/**
 * Helper to speak math problems and encouragement using Web Speech Synthesis.
 * Optimized for natural, cheerful kid-friendly Thai speech (pitch: 1.25, rate: 0.95).
 */

export function speakThaiText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.')
    return
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'th-TH'

  // Cheerful, cute child-friendly pitch & pacing
  utterance.pitch = 1.25 // Higher, cuter pitch
  utterance.rate = 0.92 // Slightly relaxed pacing so kids can listen clearly

  // Try to pick a Thai voice if available
  const voices = window.speechSynthesis.getVoices()
  const thaiVoice = voices.find((v) => v.lang.includes('th') || v.lang.includes('TH'))
  if (thaiVoice) {
    utterance.voice = thaiVoice
  }

  if (onStart) utterance.onstart = onStart
  if (onEnd) utterance.onend = onEnd
  utterance.onerror = () => {
    if (onEnd) onEnd()
  }

  window.speechSynthesis.speak(utterance)
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
}

export function formatProblemForSpeech(num1: number, operator: '+' | '-', num2: number): string {
  const word1 = THAI_NUMBER_WORDS[num1] || String(num1)
  const word2 = THAI_NUMBER_WORDS[num2] || String(num2)
  const opWord = operator === '+' ? 'บวก' : 'ลบ'

  return `${word1} ${opWord} ${word2} ได้เท่ากับเท่าไหร่เอ่ย`
}
