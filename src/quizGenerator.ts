export interface Question {
  id: number
  num1: number
  num2: number
  operator: '+' | '-'
  correctAnswer: number
  choices: number[]
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Generate a dynamic single-digit math problem (addition or subtraction).
 * Single digit: 1 to 9.
 * Subtraction ensures num1 >= num2 so the answer is never negative.
 * @param id Question sequence number (1 to 10)
 * @param existingKeys Set of question signature strings (e.g. "3+4", "7-2") already used in this round
 */
export function generateQuestion(id: number, existingKeys?: Set<string>): Question {
  let operator: '+' | '-' = '+'
  let num1 = 0
  let num2 = 0
  let correctAnswer = 0
  let key = ''

  let attempts = 0
  do {
    operator = Math.random() < 0.5 ? '+' : '-'
    if (operator === '+') {
      num1 = getRandomInt(1, 9)
      num2 = getRandomInt(1, 9)
      correctAnswer = num1 + num2
    } else {
      num1 = getRandomInt(1, 9)
      num2 = getRandomInt(1, num1) // num1 >= num2 to keep result >= 0
      correctAnswer = num1 - num2
    }

    key = `${num1}${operator}${num2}`
    attempts++
  } while (existingKeys && existingKeys.has(key) && attempts < 100)

  // Track the unique question
  if (existingKeys) {
    existingKeys.add(key)
  }

  // Generate 3 plausible distractors (choices)
  const distractors = new Set<number>()
  
  // Single-digit friendly offsets: +/- 1, +/- 2, +/- 3
  const candidateOffsets = [-1, 1, -2, 2, -3, 3]
  const shuffledOffsets = shuffleArray(candidateOffsets)

  for (const offset of shuffledOffsets) {
    const candidate = correctAnswer + offset
    if (candidate >= 0 && candidate !== correctAnswer) {
      distractors.add(candidate)
      if (distractors.size >= 3) break
    }
  }

  // Fallback in case set is not yet 3 items
  let fallbackDelta = 4
  while (distractors.size < 3) {
    const candidate1 = correctAnswer + fallbackDelta
    const candidate2 = correctAnswer - fallbackDelta
    if (candidate1 !== correctAnswer) distractors.add(candidate1)
    if (distractors.size < 3 && candidate2 >= 0 && candidate2 !== correctAnswer) {
      distractors.add(candidate2)
    }
    fallbackDelta++
  }

  const choices = shuffleArray([correctAnswer, ...Array.from(distractors)])

  return {
    id,
    num1,
    num2,
    operator,
    correctAnswer,
    choices,
  }
}
