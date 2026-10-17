export type ProblemType = 'add-sub-2' | 'add-3'

export interface Question {
  id: number
  problemType: ProblemType
  num1: number
  operator: '+' | '-'
  num2: number
  // For 3-number addition: num1 + num2 + num3
  num3?: number
  operator2?: '+'
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
 * Generate a math problem according to selected problemType:
 * - 'add-sub-2': single-digit 1-9 addition or subtraction (non-negative)
 * - 'add-3': single-digit 1-9 addition of 3 numbers (num1 + num2 + num3)
 * @param id Question sequence number
 * @param problemType 'add-sub-2' | 'add-3'
 * @param existingKeys Set of question signature strings to prevent duplicates in the same round
 */
export function generateQuestion(
  id: number,
  problemType: ProblemType = 'add-sub-2',
  existingKeys?: Set<string>
): Question {
  let operator: '+' | '-' = '+'
  let num1 = 0
  let num2 = 0
  let num3: number | undefined = undefined
  let operator2: '+' | undefined = undefined
  let correctAnswer = 0
  let key = ''

  let attempts = 0
  do {
    if (problemType === 'add-3') {
      operator = '+'
      operator2 = '+'
      // Kid-friendly easier 3-number addition: numbers 1 to 5, total sum capped at 15
      num1 = getRandomInt(1, 5)
      num2 = getRandomInt(1, 5)
      num3 = getRandomInt(1, 4)
      correctAnswer = num1 + num2 + num3
      key = `${num1}+${num2}+${num3}`
    } else {
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
    }
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
    const high = correctAnswer + fallbackDelta
    const low = correctAnswer - fallbackDelta
    if (high >= 0 && high !== correctAnswer) distractors.add(high)
    if (distractors.size < 3 && low >= 0 && low !== correctAnswer) distractors.add(low)
    fallbackDelta++
  }

  // Final choices list of 4 options shuffled
  const choices = shuffleArray([correctAnswer, ...Array.from(distractors).slice(0, 3)])

  return {
    id,
    problemType,
    num1,
    operator,
    num2,
    num3,
    operator2,
    correctAnswer,
    choices,
  }
}
