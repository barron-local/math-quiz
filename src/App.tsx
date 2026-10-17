import { useState, useEffect, type FormEvent } from 'react'
import { generateQuestion, type Question } from './quizGenerator'
import { KidMascot } from './components/KidMascot'
import { ConfettiEffect } from './components/ConfettiEffect'
import {
  getRandomCorrectMessage,
  getRandomEncouragingMessage,
  getCompletionMessage,
  getRandomWelcomeMessage,
  getRandomPokeMessage,
} from './encouragements'
import { speakThaiText, formatProblemForSpeech } from './speechHelper'
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
  const [isFromQr, setIsFromQr] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      return params.get('source') === 'qrcode'
    }
    return false
  })
  const [showQrModal, setShowQrModal] = useState(false)
  const [welcomeMessage, setWelcomeMessage] = useState(() => getRandomWelcomeMessage())
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [hasSpokenWelcome, setHasSpokenWelcome] = useState(false)
  const [isPoked, setIsPoked] = useState(false)

  // Interactive mascot poke handler (child taps the mascot)
  const handlePokeMascot = () => {
    setIsPoked(true)
    const pokeMsg = getRandomPokeMessage()
    setWelcomeMessage(pokeMsg)
    setIsSpeaking(true)
    speakThaiText(
      pokeMsg,
      () => setIsSpeaking(true),
      () => {
        setIsSpeaking(false)
        setIsPoked(false)
      }
    )
    setTimeout(() => setIsPoked(false), 600)
  }

  // Welcome speech intro text (cheerful & cute for children, guiding them on what to do)
  const welcomeSpeechText = isFromQr
    ? 'เย้! สแกนคิวอาร์โค้ดเข้ามาแล้ว ยินดีต้อนรับนะคนเก่ง! หนูพิมพ์ชื่อเล่นหรือฉายาเท่ๆ ลงในช่องด้านล่าง แล้วกดปุ่มเริ่มเล่นได้เลยจ้า!'
    : 'สวัสดีครับเพื่อนคนเก่ง! ยินดีต้อนรับนะคร้าบ ให้หนูพิมพ์ชื่อเล่นหรือฉายาเท่ๆ ลงในช่องด้านล่าง แล้วกดปุ่มเริ่มเล่นเพื่อไปลุยโจทย์เลขด้วยกันได้เลยจ้า!'

  const handleSpeakWelcome = () => {
    setIsSpeaking(true)
    speakThaiText(
      welcomeSpeechText,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    )
  }


  // Auto-speak cute welcome message on first entry or user click
  useEffect(() => {
    if (gameState !== 'name-input' || hasSpokenWelcome) return

    const tryAutoSpeak = () => {
      if (!hasSpokenWelcome) {
        setHasSpokenWelcome(true)
        handleSpeakWelcome()
      }
    }

    // Try speaking after short gentle delay
    const timer = setTimeout(() => {
      tryAutoSpeak()
    }, 600)

    // Browsers require a user gesture if auto-speech is blocked: listen to first click/tap
    const handleFirstGesture = () => {
      tryAutoSpeak()
      window.removeEventListener('click', handleFirstGesture)
      window.removeEventListener('touchstart', handleFirstGesture)
    }

    window.addEventListener('click', handleFirstGesture, { once: true })
    window.addEventListener('touchstart', handleFirstGesture, { once: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('click', handleFirstGesture)
      window.removeEventListener('touchstart', handleFirstGesture)
    }
  }, [gameState, hasSpokenWelcome])

  // Read math problem aloud with cheerful Thai speech
  const handleSpeakProblem = (questionToSpeak = currentQuestion) => {
    if (!questionToSpeak) return
    const textToSpeak = formatProblemForSpeech(
      questionToSpeak.num1,
      questionToSpeak.operator,
      questionToSpeak.num2
    )
    setIsSpeaking(true)
    speakThaiText(
      textToSpeak,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    )
  }

  // Automatically read the math problem aloud when a new question appears
  useEffect(() => {
    if (gameState === 'playing' && currentQuestion && !isAnswered) {
      // Small pause (350ms) for smooth visual transition before voice begins
      const timer = setTimeout(() => {
        handleSpeakProblem(currentQuestion)
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [currentQuestion?.id, gameState])



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
      {/* Cute Welcome Banner for QR Scanners */}
      {isFromQr && (
        <aside className="qr-welcome-banner pop-in" role="status">
          <div className="qr-welcome-badge">ยินดีต้อนรับเพื่อนใหม่</div>
          <div className="qr-welcome-text">
            <strong>เย้! สแกน QR Code เข้ามาสำเร็จแล้วนะ!</strong>
            <p>ยินดีต้อนรับสู่อาณาจักรคณิตคิดเร็ว วันนี้มาโชว์พลังสมองประลองความไวกันเถอะ!</p>
          </div>
          <button
            type="button"
            className="qr-banner-close"
            onClick={() => setIsFromQr(false)}
            aria-label="ปิดการแจ้งเตือน"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="2" x2="10" y2="10" />
              <line x1="10" y1="2" x2="2" y2="10" />
            </svg>
          </button>
        </aside>
      )}

      {/* State 1: NAME INPUT & WELCOME */}
      {gameState === 'name-input' && (
        <section aria-label="Welcome and name input" className="screen-center">
          <div className="top-actions-bar">
            <button
              type="button"
              className="view-qr-btn"
              onClick={() => setShowQrModal(true)}
            >
              ดู QR Code สำหรับแชร์
            </button>
          </div>

          <div className="mascot-wrapper mascot-float">
            <KidMascot
              mood="happy"
              size={140}
              onClick={handlePokeMascot}
              isPoked={isPoked}
            />
          </div>

          {/* Cute mascot dialogue bubble for normal visitors (clickable to replay speech) */}
          <div
            className={`mascot-home-speech pop-in ${isSpeaking ? 'speech-bubble-speaking' : ''}`}
            onClick={handleSpeakWelcome}
            title="กดเพื่อฟังเสียงแนะนำอีกครั้ง"
            role="button"
            tabIndex={0}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="speech-icon" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <span className="mascot-speech-text">{welcomeMessage}</span>
          </div>

          <h1 className="page-title">Math Quiz</h1>
          <p className="page-subtitle">เกมคณิตคิดเร็วแสนสนุก 10 ข้อ</p>

          <form onSubmit={handleStart} className="name-form">
            <label htmlFor="kidNameInput" className="name-label">
              ชื่อเล่น หรือ ฉายาของหนู
            </label>
            <input
              id="kidNameInput"
              type="text"
              className="name-input"
              placeholder="พิมพ์ชื่อตรงนี้ (หรือไม่พิมพ์ก็ได้จ้า)"
              value={kidName}
              onChange={(e) => setKidName(e.target.value)}
              maxLength={15}
              autoFocus
            />

            <button type="submit" className="notion-btn-primary pulse-btn kid-big-btn">
              เริ่มเล่นเลย (Start)
            </button>
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
              <KidMascot
                mood={mascotMood}
                size={82}
                onClick={handlePokeMascot}
                isPoked={isPoked}
              />
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

            {/* Read aloud / replay button for kids */}
            <button
              type="button"
              className={`speak-problem-btn ${isSpeaking ? 'speaking-active' : ''}`}
              onClick={() => handleSpeakProblem(currentQuestion)}
              title="กดเพื่อฟังเสียงอ่านโจทย์ซ้ำอีกครั้ง"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <span>{isSpeaking ? 'กำลังอ่านโจทย์...' : 'กดฟังเสียงซ้ำ'}</span>
            </button>
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
      {/* QR Code Modal Dialog */}
      {showQrModal && (
        <div className="modal-backdrop" onClick={() => setShowQrModal(false)}>
          <div className="notion-modal pop-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="badge badge-tag">สแกนเพื่อเข้าเล่น</span>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowQrModal(false)}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="2" y1="2" x2="12" y2="12" />
                  <line x1="12" y1="2" x2="2" y2="12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <img
                src="/qrcode/qrcode.png"
                alt="QR Code สำหรับเข้าเล่น Math Quiz"
                className="qr-image"
              />
              <p className="qr-link-text">
                https://math-quiz-two-livid.vercel.app/
              </p>
              <p className="qr-hint">
                เปิดกล้องมือถือหรือแท็บเล็ตแล้วสแกนเพื่อเข้าเล่นพร้อมลูกเล่นต้อนรับได้ทันที!
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
