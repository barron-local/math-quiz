import { useState, type FormEvent } from 'react'
import { generateQuestion, type Question } from './quizGenerator'
import { KidMascot } from './components/KidMascot'
import { ConfettiEffect } from './components/ConfettiEffect'
import {
  getRandomCorrectMessage,
  getRandomEncouragingMessage,
  getCompletionMessage,
} from './encouragements'
import './App.css'

type QuizState = 'name-input' | 'playing' | 'completed'

const TOTAL_QUESTIONS = 10

export default function App() {
  const [gameState, setGameState] = useState<QuizState>('name-input')
  const [kidName, setKidName] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null)
  const [mascotMood, setMascotMood] = useState<'happy' | 'celebrate' | 'cheer' | 'think'>('happy')
  const [showConfetti, setShowConfetti] = useState(false)

  // Start new game
  const handleStart = (e?: FormEvent) => {
    if (e) e.preventDefault()
    const nameToUse = kidName.trim() || 'คนเก่ง'
    setKidName(nameToUse)
    setScore(0)
    setCurrentIndex(1)
    setCurrentQuestion(generateQuestion(1))
    setSelectedAnswer(null)
    setIsAnswered(false)
    setCurrentFeedback(null)
    setShowConfetti(false)
    setMascotMood('think')
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
      setCurrentFeedback({
        isCorrect: true,
        text: getRandomCorrectMessage(kidName),
      })
      setMascotMood('celebrate')
      setShowConfetti(true)
    } else {
      setCurrentFeedback({
        isCorrect: false,
        text: getRandomEncouragingMessage(kidName),
      })
      setMascotMood('cheer')
      setShowConfetti(false)
    }

    // Auto proceed to next question or finished screen
    setTimeout(() => {
      setShowConfetti(false)
      if (currentIndex < TOTAL_QUESTIONS) {
        const nextIndex = currentIndex + 1
        setCurrentIndex(nextIndex)
        setCurrentQuestion(generateQuestion(nextIndex))
        setSelectedAnswer(null)
        setIsAnswered(false)
        setCurrentFeedback(null)
        setMascotMood('think')
      } else {
        setGameState('completed')
      }
    }, 1300)
  }

  // Change kid name / reset
  const handleReset = () => {
    setScore(0)
    setCurrentIndex(0)
    setCurrentQuestion(null)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setCurrentFeedback(null)
    setShowConfetti(false)
    setMascotMood('happy')
    setGameState('name-input')
  }

  return (
    <main className="notion-container">
      {/* State 1: NAME INPUT & WELCOME */}
      {gameState === 'name-input' && (
        <section aria-label="Welcome and name input" className="screen-center">
          <div className="mascot-wrapper mascot-float">
            <KidMascot mood="happy" size={130} />
          </div>
          <div className="title-tag">แบบฝึกหัดคณิตคิดเร็ว</div>
          <h1 className="page-title">Math Quiz</h1>
          <p className="page-subtitle">ยินดีต้อนรับเพื่อนคนเก่ง มาฝึกคิดเลขเร็วสนุกๆ กันนะ!</p>

          <form onSubmit={handleStart} className="name-form">
            <label htmlFor="kidNameInput" className="name-label">
              อยากให้ระบบเรียกว่าอะไรดีเอ่ย?
            </label>
            <input
              id="kidNameInput"
              type="text"
              className="name-input"
              placeholder="พิมพ์ชื่อเล่น หรือฉายาเท่ๆ ได้เลย..."
              value={kidName}
              onChange={(e) => setKidName(e.target.value)}
              maxLength={15}
              autoFocus
            />

            {/* Quick cool title chips for fun */}
            <div className="quick-titles-row">
              <span className="quick-title-label">หรือเลือกฉายา:</span>
              {['คนเก่ง', 'ยอดนักสืบจิ๋ว', 'กัปตัน', 'ฮีโร่'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="quick-tag-btn"
                  onClick={() => setKidName(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>

            <button type="submit" className="notion-btn-primary pulse-btn">
              เริ่มทำแบบฝึกหัด (Start)
            </button>

            <p className="privacy-note">
              ใช้เพื่อแสดงผลให้กำลังใจบนหน้าจอนี้เท่านั้น ไม่มีการส่งหรือบันทึกข้อมูลส่วนตัวใดๆ
            </p>
          </form>
        </section>
      )}

      {/* State 2: PLAYING QUESTION */}
      {gameState === 'playing' && currentQuestion && (
        <section aria-label="Quiz question" className="quiz-section">
          {/* Confetti particle shower on correct answer */}
          {showConfetti && <ConfettiEffect />}

          <div className="quiz-top-bar">
            <div className="kid-greeting">
              สวัสดีน้อง <span className="highlight-name">{kidName}</span>
            </div>
            <div className="stats-badges">
              <span className="badge badge-tag">
                ข้อที่ {currentIndex} / {TOTAL_QUESTIONS}
              </span>
              <span className="badge badge-score">
                คะแนน: {score}
              </span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="progress-bar-bg" aria-hidden="true">
            <div
              className="progress-bar-fill"
              style={{ width: `${(currentIndex / TOTAL_QUESTIONS) * 100}%` }}
            />
          </div>

          {/* Character and Speech feedback bubble with interactive animations */}
          <div className="mascot-status-area">
            <div className="mascot-mini">
              <KidMascot mood={mascotMood} size={82} />
            </div>
            <div className={`mascot-speech-bubble ${currentFeedback ? (currentFeedback.isCorrect ? 'bubble-correct pop-in' : 'bubble-try pop-in') : ''}`}>
              {currentFeedback ? (
                <span>{currentFeedback.text}</span>
              ) : (
                <span>ข้อนี้ตอบเท่าไหร่ดีนะน้อง{kidName}? ค่อยๆ คิดนะ!</span>
              )}
            </div>
          </div>

          <div className={`math-card ${isAnswered ? (currentFeedback?.isCorrect ? 'card-pulse-success' : 'card-shake') : ''}`}>
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
                  choiceClass += ' selected-correct pop-success'
                } else if (choice === selectedAnswer) {
                  choiceClass += ' selected-incorrect shake-error'
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

          {/* Explicit solution hint after answer */}
          <div className="feedback-bar">
            {isAnswered && !currentFeedback?.isCorrect && (
              <span className="feedback-answer-hint pop-in">
                คำตอบที่ถูกต้องคือ {currentQuestion.correctAnswer}
              </span>
            )}
          </div>
        </section>
      )}

      {/* State 3: COMPLETED RESULTS */}
      {gameState === 'completed' && (() => {
        const resultMsg = getCompletionMessage(kidName, score, TOTAL_QUESTIONS)
        return (
          <section aria-label="Results" className="screen-center">
            {/* Grand Confetti shower on completion */}
            <ConfettiEffect />

            <div className="mascot-wrapper celebrate-bounce">
              <KidMascot mood={resultMsg.mood} size={140} />
            </div>

            <div className="title-tag">ผลการทำแบบฝึกหัด</div>
            <h1 className="page-title">{resultMsg.headline}</h1>

            <div className="result-card pop-in">
              <div className="result-score">
                {score} / {TOTAL_QUESTIONS}
              </div>
              <p className="result-label">คะแนนรวมของน้อง{kidName}</p>
              <p className="result-subtext">{resultMsg.subtext}</p>

              <div className="result-actions">
                <button
                  type="button"
                  className="notion-btn-primary pulse-btn"
                  onClick={() => handleStart()}
                  autoFocus
                >
                  เล่นใหม่อีกรอบ (Play Again)
                </button>
                <button
                  type="button"
                  className="notion-btn-secondary"
                  onClick={handleReset}
                >
                  เปลี่ยนชื่อผู้เล่น
                </button>
              </div>
            </div>
          </section>
        )
      })()}
    </main>
  )
}
