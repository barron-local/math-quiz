import type { Question, ProblemType } from './quizGenerator'

export interface ActiveQuizSession {
  kidName: string
  problemType: ProblemType
  totalQuestions: number
  currentIndex: number
  currentQuestion: Question
  askedQuestions: string[]
  score: number
  hasUsedLifeline: boolean
  eliminatedChoices: number[]
  timeLeft: number
  savedAt: number
}

const SESSION_KEY = 'math_quiz_active_session'
const MAX_SESSION_AGE_MS = 24 * 60 * 60 * 1000 // 24 hours validity

/**
 * Persists ongoing quiz progress into localStorage
 */
export function saveQuizSession(session: Omit<ActiveQuizSession, 'savedAt'>): void {
  try {
    const data: ActiveQuizSession = {
      ...session,
      savedAt: Date.now(),
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(data))
  } catch (err) {
    console.warn('Failed to save quiz session:', err)
  }
}

/**
 * Retrieves saved quiz progress if available and not expired
 */
export function loadQuizSession(): ActiveQuizSession | null {
  try {
    if (typeof localStorage === 'undefined') return null
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ActiveQuizSession
    if (!parsed || !parsed.currentQuestion || typeof parsed.currentIndex !== 'number') return null

    // Ignore sessions older than 24 hours
    if (Date.now() - parsed.savedAt > MAX_SESSION_AGE_MS) {
      clearQuizSession()
      return null
    }

    return parsed
  } catch (err) {
    console.warn('Failed to load quiz session:', err)
    return null
  }
}

/**
 * Clears saved session when quiz completes or user exits to home
 */
export function clearQuizSession(): void {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.removeItem(SESSION_KEY)
  } catch (err) {
    console.warn('Failed to clear quiz session:', err)
  }
}
