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
 * Generate a dynamic grade-school math problem (addition or subtraction).
 * Addition: sum <= 100, nice grade school numbers (e.g. 1 to 50 + 1 to 49).
 * Subtraction: num1 >= num2 to keep answer positive and natural.
 */
export function generateQuestion(id: number): Question {
  const operator: '+' | '-' = Math.random() < 0.5 ? '+' : '-'
  let num1 = 0
  let num2 = 0
  let correctAnswer = 0

  if (operator === '+') {
    num1 = getRandomInt(3, 48)
    num2 = getRandomInt(2, 45)
    correctAnswer = num1 + num2
  } else {
    num1 = getRandomInt(10, 85)
    num2 = getRandomInt(2, num1 - 1)
    correctAnswer = num1 - num2
  }

  // Generate 3 plausible distractors (choices)
  const distractors = new Set<number>()
  
  // Possible common mistakes: +/- 1, +/- 10, +/- 2, off-by-one in tens/ones
  const candidateOffsets = [-1, 1, -2, 2, -10, 10, -5, 5, -3, 3]
  const shuffledOffsets = shuffleArray(candidateOffsets)

  for (const offset of shuffledOffsets) {
    const candidate = correctAnswer + offset
    if (candidate >= 0 && candidate !== correctAnswer) {
      distractors.add(candidate)
      if (distractors.size >= 3) break
    }
  }

  // Fallback in case set is not yet 3 items
  while (distractors.size < 3) {
    const fallback = Math.max(0, correctAnswer + getRandomInt(-12, 12))
    if (fallback !== correctAnswer) {
      distractors.add(fallback)
    }
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
