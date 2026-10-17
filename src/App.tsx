import { useState } from 'react'
import { generateQuestion, type Question } from './quizGenerator'
import './App.css'

type QuizState = 'start' | 'playing' | 'completed'

const TOTAL_QUESTIONS = 10

export default function App() {
  const [gameState, setGameState] = useState<QuizState>('start')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)

  // Start new game
  const handleStart = () => {
    setScore(0)
    setCurrentIndex(1)
    setCurrentQuestion(generateQuestion(1))
    setSelectedAnswer(null)
    setIsAnswered(false)
    setGameState('playing')
  }

  // Handle choice selection
  const handleSelectChoice = (choice: number) => {
    if (isAnswered || !currentQuestion) return

    setSelectedAnswer(choice)
    setIsAnswered(true)

    const isCorrect = choice === currentQuestion.correctAnswer
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }

    // Auto proceed to next question or finished screen
    setTimeout(() => {
      if (currentIndex < TOTAL_QUESTIONS) {
        const nextIndex = currentIndex + 1
        setCurrentIndex(nextIndex)
        setCurrentQuestion(generateQuestion(nextIndex))
        setSelectedAnswer(null)
        setIsAnswered(false)
      } else {
        setGameState('completed')
      }
    }, 850)
  }

  return (
    <main className="notion-container">
      {/* State: START SCREEN */}
      {gameState === 'start' && (
        <section aria-label="Start screen">
          <div className="title-tag">คณิตศาสตร์ประถม</div>
          <h1 className="page-title">Math Quiz</h1>
          <p className="page-subtitle">ฝึกคิดเลขเร็ว บวกและลบ 10 ข้อ</p>

          <button
            type="button"
            className="notion-btn-primary"
            onClick={handleStart}
            autoFocus
          >
            เริ่มทำแบบฝึกหัด (Start)
          </button>
        </section>
      )}

      {/* State: PLAYING */}
      {gameState === 'playing' && currentQuestion && (
        <section aria-label="Quiz question">
          <div className="quiz-top-bar">
            <span className="badge badge-tag">
              ข้อที่ {currentIndex} / {TOTAL_QUESTIONS}
            </span>
            <span className="badge badge-score">
              คะแนน: {score}
            </span>
          </div>

          {/* Progress Indicator */}
          <div className="progress-bar-bg" aria-hidden="true">
            <div
              className="progress-bar-fill"
              style={{ width: `${(currentIndex / TOTAL_QUESTIONS) * 100}%` }}
            />
          </div>

          <div className="math-card">
            <div className="math-formula">
              <span>{currentQuestion.num1}</span>
              <span className="math-operator">{currentQuestion.operator}</span>
              <span>{currentQuestion.num2}</span>
              <span>=</span>
              <span className="math-placeholder">?</span>
            </div>
          </div>

          <div className="choices-grid">
            {currentQuestion.choices.map((choice, index) => {
              let choiceClass = 'choice-btn'
              if (isAnswered) {
                if (choice === currentQuestion.correctAnswer) {
                  choiceClass += ' selected-correct'
                } else if (choice === selectedAnswer) {
                  choiceClass += ' selected-incorrect'
                }
              }

              return (
                <button
                  key={`${currentQuestion.id}-${index}-${choice}`}
                  type="button"
                  className={choiceClass}
                  disabled={isAnswered}
                  onClick={() => handleSelectChoice(choice)}
                >
                  {choice}
                </button>
              )
            })}
          </div>

          <div className="feedback-bar">
            {isAnswered && (
              selectedAnswer === currentQuestion.correctAnswer ? (
                <span className="feedback-text correct">ถูกต้อง</span>
              ) : (
                <span className="feedback-text incorrect">
                  คำตอบคือ {currentQuestion.correctAnswer}
                </span>
              )
            )}
          </div>
        </section>
      )}

      {/* State: COMPLETED */}
      {gameState === 'completed' && (
        <section aria-label="Results">
          <div className="title-tag">ผลการทดสอบ</div>
          <h1 className="page-title">สรุปคะแนน</h1>

          <div className="result-card">
            <div className="result-score">
              {score} / {TOTAL_QUESTIONS}
            </div>
            <p className="result-label">คะแนนรวม</p>

            <button
              type="button"
              className="notion-btn-primary"
              onClick={handleStart}
              autoFocus
            >
              ทำใหม่อีกครั้ง
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
