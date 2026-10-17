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

  // Soft, warm, and gentle kid-friendly speech tuning
  utterance.volume = 0.78 // Soften volume slightly (not too loud)
  utterance.pitch = 1.08 // Warm, friendly, and natural pitch (not shrill)
  utterance.rate = 0.88 // Gentle, comfortable pacing for young ears

  // Select the smoothest/most natural Thai voice available (e.g., Premwadee, Niwat, Achara, Google Thai)
  const voices = window.speechSynthesis.getVoices()
  const thaiVoices = voices.filter((v) => v.lang.includes('th') || v.lang.includes('TH'))
  
  // Prioritize premium/natural neural voices if available
  const preferredVoice =
    thaiVoices.find((v) => v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('online')) ||
    thaiVoices.find((v) => v.name.includes('Premwadee') || v.name.includes('Achara')) ||
    thaiVoices[0]

  if (preferredVoice) {
    utterance.voice = preferredVoice
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

export function formatProblemForSpeech(
  num1: number,
  operator: '+' | '-',
  num2: number,
  num3?: number
): string {
  const word1 = THAI_NUMBER_WORDS[num1] || String(num1)
  const word2 = THAI_NUMBER_WORDS[num2] || String(num2)
  const opWord = operator === '+' ? 'บวก' : 'ลบ'

  if (typeof num3 === 'number') {
    const word3 = THAI_NUMBER_WORDS[num3] || String(num3)
    return `${word1} บวก ${word2} แล้วบวกอีก ${word3} ได้เท่ากับเท่าไหร่เอ่ย`
  }

  return `${word1} ${opWord} ${word2} ได้เท่ากับเท่าไหร่เอ่ย`
}
