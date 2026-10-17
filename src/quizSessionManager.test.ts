import { describe, expect, it, beforeEach } from 'bun:test'
import { saveQuizSession, loadQuizSession, clearQuizSession } from './quizSessionManager'

describe('quizSessionManager', () => {
  // Mock localStorage for test environment
  const mockStorage: Record<string, string> = {}
  globalThis.localStorage = {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, val: string) => { mockStorage[key] = val },
    removeItem: (key: string) => { delete mockStorage[key] },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]) },
    length: 0,
    key: () => null,
  } as any

  beforeEach(() => {
    clearQuizSession()
  })

  it('saves and loads active quiz session accurately', () => {
    const mockQuestion = {
      id: 5,
      problemType: 'add-sub-2' as const,
      num1: 8,
      operator: '+' as const,
      num2: 4,
      correctAnswer: 12,
      choices: [10, 11, 12, 13],
      explanationSteps: ['8 + 4 = 12'],
    }

    saveQuizSession({
      kidName: 'บอส',
      problemType: 'add-sub-2',
      totalQuestions: 10,
      currentIndex: 5,
      currentQuestion: mockQuestion,
      askedQuestions: ['1', '2', '3', '4', '5'],
      score: 4,
      hasUsedLifeline: true,
      eliminatedChoices: [10, 13],
      timeLeft: 45,
    })

    const loaded = loadQuizSession()
    expect(loaded).not.toBeNull()
    expect(loaded?.currentIndex).toBe(5)
    expect(loaded?.score).toBe(4)
    expect(loaded?.kidName).toBe('บอส')
    expect(loaded?.currentQuestion.correctAnswer).toBe(12)
    expect(loaded?.hasUsedLifeline).toBe(true)
    expect(loaded?.eliminatedChoices).toEqual([10, 13])
    expect(loaded?.timeLeft).toBe(45)
  })

  it('clears session when requested', () => {
    saveQuizSession({
      kidName: 'บอส',
      problemType: 'add-sub-2',
      totalQuestions: 10,
      currentIndex: 2,
      currentQuestion: {
        id: 2,
        problemType: 'add-sub-2' as const,
        num1: 3,
        operator: '+' as const,
        num2: 2,
        correctAnswer: 5,
        choices: [4, 5, 6, 7],
        explanationSteps: ['3 + 2 = 5'],
      },
      askedQuestions: ['q-1', 'q-2'],
      score: 1,
      hasUsedLifeline: false,
      eliminatedChoices: [],
      timeLeft: 60,
    })

    clearQuizSession()
    expect(loadQuizSession()).toBeNull()
  })
})
