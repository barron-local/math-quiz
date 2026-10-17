import { useState, useEffect, useRef, type FormEvent } from 'react'
import { generateQuestion, type Question, type ProblemType } from './quizGenerator'
import { KidMascot } from './components/KidMascot'
import { ConfettiEffect } from './components/ConfettiEffect'
import {
  getRandomCorrectMessage,
  getRandomEncouragingMessage,
  getCompletionMessage,
  getRandomWelcomeMessage,
} from './encouragements'
import { speakThaiText, formatProblemForSpeech } from './speechHelper'
import { soundEffects } from './soundEffects'
import './App.css'

type QuizState = 'name-input' | 'playing' | 'completed'

export default function App() {
  const [gameState, setGameState] = useState<QuizState>('name-input')
  const [kidName, setKidName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('math_quiz_kid_name') || ''
    }
    return ''
  })
  // Quiz configuration states
  const [questionCountChoice, setQuestionCountChoice] = useState<10 | 20 | 30 | 'custom'>(10)
  const [customQuestionCount, setCustomQuestionCount] = useState('')
  const [totalQuestions, setTotalQuestions] = useState(10)
  const [problemType, setProblemType] = useState<ProblemType>('add-sub-2')
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('math_quiz_voice_enabled')
      return saved !== null ? saved === 'true' : true
    }
    return true
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [hasEvaluated, setHasEvaluated] = useState(false)
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
  const [welcomeMessage] = useState(() => getRandomWelcomeMessage())
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [hasSpokenWelcome, setHasSpokenWelcome] = useState(false)
  const [isPoked, setIsPoked] = useState(false)
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(() => new Set())
  const QUESTION_TIME_SECONDS = 60 // 1 minute per question
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SECONDS)
  const hasWarnedTimeRef = useRef(false)

  // Interactive mascot poke handler (child taps the mascot - animation only, no voice)
  const handlePokeMascot = () => {
    setIsPoked(false)
    // Small timeout to allow re-triggering animation on multiple rapid clicks
    setTimeout(() => {
      setIsPoked(true)
      setTimeout(() => setIsPoked(false), 550)
    }, 10)
  }

  // Welcome speech intro text (personalized with kidName if already entered/saved)
  const welcomeSpeechText = isFromQr
    ? kidName.trim()
      ? `เย้! สแกนคิวอาร์โค้ดเข้ามาแล้ว ยินดีต้อนรับน้อง${kidName.trim()}นะคร้าบ! เลือกลักษณะโจทย์ แล้วกดปุ่มเริ่มเล่นได้เลยจ้า!`
      : 'เย้! สแกนคิวอาร์โค้ดเข้ามาแล้ว ยินดีต้อนรับนะคนเก่ง! หนูพิมพ์ชื่อเล่นหรือฉายาเท่ๆ เลือกลักษณะโจทย์ แล้วกดปุ่มเริ่มเล่นได้เลยจ้า!'
    : kidName.trim()
    ? `สวัสดีครับน้อง${kidName.trim()}! ยินดีต้อนรับนะคร้าบ เลือกลักษณะโจทย์ที่ชอบ แล้วกดปุ่มเริ่มเล่นเพื่อไปลุยด้วยกันได้เลยจ้า!`
    : 'สวัสดีครับเพื่อนคนเก่ง! ยินดีต้อนรับนะคร้าบ ให้หนูพิมพ์ชื่อเล่น เลือกลักษณะโจทย์ที่ชอบ แล้วกดปุ่มเริ่มเล่นเพื่อไปลุยด้วยกันได้เลยจ้า!'

  const handleSpeakWelcome = () => {
    if (!isVoiceEnabled) return
    setIsSpeaking(true)
    speakThaiText(
      welcomeSpeechText,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    )
  }

  // Auto-speak cute welcome message on first entry or user click
  useEffect(() => {
    if (gameState !== 'name-input' || hasSpokenWelcome || !isVoiceEnabled) return

    const tryAutoSpeak = () => {
      if (!hasSpokenWelcome && isVoiceEnabled) {
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
  }, [gameState, hasSpokenWelcome, isVoiceEnabled])

  // Read math problem aloud with cheerful Thai speech
  const handleSpeakProblem = (questionToSpeak = currentQuestion) => {
    if (!questionToSpeak || !isVoiceEnabled) return
    const textToSpeak = formatProblemForSpeech(
      questionToSpeak.num1,
      questionToSpeak.operator,
      questionToSpeak.num2,
      questionToSpeak.num3
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
    if (gameState === 'playing' && currentQuestion && !isAnswered && isVoiceEnabled) {
      // Small pause (250ms) before voice begins
      const timer = setTimeout(() => {
        handleSpeakProblem(currentQuestion)
      }, 250)
      return () => clearTimeout(timer)
    }
  }, [currentQuestion?.id, gameState, isVoiceEnabled])

  // Reset time warning flag when a new question starts
  useEffect(() => {
    hasWarnedTimeRef.current = false
  }, [currentIndex, currentQuestion?.id])

  // Spoken voice warning when time is running low (10 seconds remaining)
  useEffect(() => {
    if (gameState === 'playing' && !isAnswered && timeLeft === 10 && !hasWarnedTimeRef.current && isVoiceEnabled) {
      hasWarnedTimeRef.current = true
      setIsSpeaking(true)
      const warningText = `เหลือเวลาอีกสิบวินาทีแล้วนะน้อง${kidName || 'คนเก่ง'} สู้ๆ จ้า!`
      speakThaiText(
        warningText,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      )
    }
  }, [timeLeft, gameState, isAnswered, kidName, isVoiceEnabled])

  // Play grand celebration fireworks sound when completing the quiz
  useEffect(() => {
    if (gameState === 'completed') {
      soundEffects.playGrandFireworks()
    }
  }, [gameState])

  // 1-minute (60s) countdown timer per question
  useEffect(() => {
    if (gameState !== 'playing' || isAnswered) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          // Time expired for this question: treat as unanswered/timeout and proceed
          handleTimeExpired()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState, isAnswered, currentIndex])

  // Handle timeout for a question
  const handleTimeExpired = () => {
    setIsAnswered(true)
    setIsCalculating(false)
    setHasEvaluated(true)
    setCurrentFeedback({
      isCorrect: false,
      text: `หมดเวลาข้อนี้แล้วนะน้อง${kidName}! ไปลุยข้อถัดไปกันเลย!`,
    })
    setMascotMood('cheer')

    setTimeout(() => {
      if (currentIndex < totalQuestions) {
        const nextIndex = currentIndex + 1
        setCurrentIndex(nextIndex)
        setTimeLeft(QUESTION_TIME_SECONDS)
        const nextQ = generateQuestion(nextIndex, problemType, askedQuestions)
        setCurrentQuestion(nextQ)
        setSelectedAnswer(null)
        setIsAnswered(false)
        setIsCalculating(false)
        setHasEvaluated(false)
        setCurrentFeedback(null)
        setMascotMood('think')
      } else {
        setGameState('completed')
      }
    }, 1400)
  }

  // Start new game
  const handleStart = (e?: FormEvent) => {
    if (e) e.preventDefault()
    const nameToUse = kidName.trim() || 'คนเก่ง'
    setKidName(nameToUse)
    if (typeof window !== 'undefined' && kidName.trim()) {
      localStorage.setItem('math_quiz_kid_name', kidName.trim())
    }

    // Calculate effective total questions
    const activeTotal = questionCountChoice === 'custom'
      ? Math.max(1, Number(customQuestionCount) || 10)
      : questionCountChoice
    setTotalQuestions(activeTotal)

    setScore(0)
    setTimeLeft(QUESTION_TIME_SECONDS)
    setCurrentIndex(1)
    const newAskedSet = new Set<string>()
    const firstQ = generateQuestion(1, problemType, newAskedSet)
    setAskedQuestions(newAskedSet)
    setCurrentQuestion(firstQ)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setIsCalculating(false)
    setHasEvaluated(false)
    setCurrentFeedback(null)
    setShowConfetti(false)
    setMascotMood('think')
    setGameState('playing')
  }

  // Handle choice selection with 2-step calculation animation
  const handleSelectChoice = (choice: number) => {
    if (isAnswered || !currentQuestion) return

    // Phase 1: Lock answering immediately, put selected choice into the slot, and start calculation animation
    setSelectedAnswer(choice)
    setIsAnswered(true)
    setIsCalculating(true)
    setHasEvaluated(false)
    setMascotMood('think')

    // Phase 2: After 850ms of calculation animation, evaluate and reveal the result (green or red)
    setTimeout(() => {
      setIsCalculating(false)
      setHasEvaluated(true)

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

      // Phase 3: Give children plenty of comfortable time (1600ms) to read and see the result before proceeding
      setTimeout(() => {
        setShowConfetti(false)
        if (currentIndex < totalQuestions) {
          const nextIndex = currentIndex + 1
          setCurrentIndex(nextIndex)
          setTimeLeft(QUESTION_TIME_SECONDS)
          // Ensure no repeat question in this round
          const nextQ = generateQuestion(nextIndex, problemType, askedQuestions)
          setCurrentQuestion(nextQ)
          setSelectedAnswer(null)
          setIsAnswered(false)
          setIsCalculating(false)
          setHasEvaluated(false)
          setCurrentFeedback(null)
          setMascotMood('think')
        } else {
          setGameState('completed')
        }
      }, 1600)
    }, 850)
  }

  // Change kid name / reset
  const handleReset = () => {
    setScore(0)
    setCurrentIndex(0)
    setCurrentQuestion(null)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setIsCalculating(false)
    setHasEvaluated(false)
    setCurrentFeedback(null)
    setShowConfetti(false)
    setMascotMood('happy')
    setGameState('name-input')
  }

  return (
    <main className="notion-container">
      {/* Cute Welcome Banner for QR Scanners (Only on Home/First page) */}
      {isFromQr && gameState === 'name-input' && (
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
            <span className="mascot-speech-text">
              {kidName.trim()
                ? `สวัสดีครับน้อง${kidName.trim()}! ยินดีต้อนรับกลับมานะคร้าบ เลือกลักษณะโจทย์แล้วกดเริ่มเล่นได้เลย!`
                : welcomeMessage}
            </span>
          </div>

          <h1 className="page-title">Math Quiz</h1>
          <p className="page-subtitle">เกมคณิตคิดเร็วแสนสนุกสำหรับเด็กๆ</p>

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

            {/* Quiz Configuration Settings */}
            <div className="quiz-config-section">
              {/* Question Count Selector */}
              <div className="config-group">
                <div className="config-label-row">
                  <span className="config-title">จำนวนข้อ</span>
                </div>
                <div className="config-options-row">
                  <button
                    type="button"
                    className={`config-chip-btn ${questionCountChoice === 10 ? 'active' : ''}`}
                    onClick={() => setQuestionCountChoice(10)}
                  >
                    <span>10 ข้อ</span>
                    <span className="chip-desc">ด่วนเร็ว</span>
                  </button>
                  <button
                    type="button"
                    className={`config-chip-btn ${questionCountChoice === 20 ? 'active' : ''}`}
                    onClick={() => setQuestionCountChoice(20)}
                  >
                    <span>20 ข้อ</span>
                    <span className="chip-desc">มาตรฐาน</span>
                  </button>
                  <button
                    type="button"
                    className={`config-chip-btn ${questionCountChoice === 30 ? 'active' : ''}`}
                    onClick={() => setQuestionCountChoice(30)}
                  >
                    <span>30 ข้อ</span>
                    <span className="chip-desc">จัดเต็ม</span>
                  </button>
                  <button
                    type="button"
                    className={`config-chip-btn ${questionCountChoice === 'custom' ? 'active' : ''}`}
                    onClick={() => setQuestionCountChoice('custom')}
                  >
                    <span>กำหนดเอง</span>
                    <span className="chip-desc">เลือกเอง</span>
                  </button>
                </div>

                {/* Custom count input if custom is chosen */}
                {questionCountChoice === 'custom' && (
                  <div className="custom-count-wrapper pop-in">
                    <label htmlFor="customCountInput" className="custom-count-label">
                      ใส่จำนวนข้อ:
                    </label>
                    <input
                      id="customCountInput"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="custom-count-input"
                      placeholder="เช่น 15"
                      value={customQuestionCount}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '')
                        setCustomQuestionCount(val)
                      }}
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Problem Type Selector */}
              <div className="config-group">
                <div className="config-label-row">
                  <span className="config-title">ประเภทโจทย์</span>
                </div>
                <div className="config-types-row">
                  <button
                    type="button"
                    className={`config-chip-btn ${problemType === 'add-sub-2' ? 'active' : ''}`}
                    onClick={() => setProblemType('add-sub-2')}
                  >
                    <span>บวก / ลบ 2 จำนวน</span>
                    <span className="chip-desc">เช่น 7 + 2 หรือ 8 - 3</span>
                  </button>
                  <button
                    type="button"
                    className={`config-chip-btn ${problemType === 'add-3' ? 'active' : ''}`}
                    onClick={() => setProblemType('add-3')}
                  >
                    <span>บวก 3 จำนวน</span>
                    <span className="chip-desc">พร้อมเส้นโยงขั้นตอน</span>
                  </button>
                </div>
              </div>

              {/* Voice Setting Toggle */}
              <div className="config-group">
                <div className="config-label-row">
                  <span className="config-title">เสียงพูดอ่านโจทย์และเตือนเวลา</span>
                </div>
                <div className="config-types-row">
                  <button
                    type="button"
                    className={`config-chip-btn ${isVoiceEnabled ? 'active' : ''}`}
                    onClick={() => {
                      setIsVoiceEnabled(true)
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('math_quiz_voice_enabled', 'true')
                      }
                    }}
                  >
                    <span>เปิดเสียงพูด</span>
                    <span className="chip-desc">อ่านโจทย์และเตือนเวลา</span>
                  </button>
                  <button
                    type="button"
                    className={`config-chip-btn ${!isVoiceEnabled ? 'active' : ''}`}
                    onClick={() => {
                      setIsVoiceEnabled(false)
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('math_quiz_voice_enabled', 'false')
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel()
                        }
                      }
                      setIsSpeaking(false)
                    }}
                  >
                    <span>ปิดเสียงพูด</span>
                    <span className="chip-desc">คิดเลขเงียบๆ มีสมาธิ</span>
                  </button>
                </div>
              </div>
            </div>

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
              <span className={`badge badge-timer ${timeLeft <= 10 ? 'timer-urgent' : ''}`}>
                เวลา: {timeLeft} วิ
              </span>
              <span className="badge badge-tag">
                ข้อที่ {currentIndex} / {totalQuestions}
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
              style={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
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

          <div className={`math-card ${hasEvaluated ? (currentFeedback?.isCorrect ? 'card-pulse-success' : 'card-shake') : ''}`}>
            {currentQuestion.problemType === 'add-3' && typeof currentQuestion.num3 === 'number' ? (
              /* 3-number addition with step-by-step connection lines */
              <div className="addition-3-container">
                <div className="step-flow-banner">
                  <span>คิดทีละคู่: บวก 2 ตัวแรกก่อน แล้วบวกตัวที่สาม</span>
                </div>
                <div className="addition-guide-svg-wrapper">
                  <svg
                    viewBox="0 0 380 120"
                    className="addition-guide-svg"
                    role="img"
                    aria-label={`โจทย์เลข 3 จำนวน: ${currentQuestion.num1} บวก ${currentQuestion.num2} บวก ${currentQuestion.num3}`}
                  >
                    {/* Top Connecting Arc: Linking Num1 (x=36) and Num2 (x=116) from above */}
                    <path
                      d="M 36 46 C 36 18, 76 16, 76 6 C 76 16, 116 18, 116 46"
                      fill="none"
                      stroke="var(--notion-blue)"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />

                    {/* Step Guide label on top: indicate adding first pair without giving answer */}
                    <g transform="translate(54, -2)">
                      <rect
                        width="44"
                        height="20"
                        rx="10"
                        fill="var(--notion-blue-bg)"
                        stroke="var(--notion-blue)"
                        strokeWidth="1.5"
                      />
                      <text
                        x="22"
                        y="14"
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="700"
                        fill="var(--notion-blue)"
                      >
                        คู่ที่ 1
                      </text>
                    </g>

                    {/* Main Formula Row (y=92) */}
                    {/* Num1 */}
                    <text x="36" y="92" textAnchor="middle" fontSize="42" fontWeight="700" fill="var(--notion-text)" fontFamily="var(--font-mono)">
                      {currentQuestion.num1}
                    </text>
                    {/* Operator 1 */}
                    <text x="76" y="90" textAnchor="middle" fontSize="34" fontWeight="700" fill="var(--notion-blue)">
                      +
                    </text>
                    {/* Num2 */}
                    <text x="116" y="92" textAnchor="middle" fontSize="42" fontWeight="700" fill="var(--notion-text)" fontFamily="var(--font-mono)">
                      {currentQuestion.num2}
                    </text>
                    {/* Operator 2 */}
                    <text x="156" y="90" textAnchor="middle" fontSize="34" fontWeight="700" fill="var(--notion-blue)">
                      +
                    </text>
                    {/* Num3 */}
                    <text x="196" y="92" textAnchor="middle" fontSize="42" fontWeight="700" fill="var(--notion-text)" fontFamily="var(--font-mono)">
                      {currentQuestion.num3}
                    </text>
                    {/* Equals */}
                    <text x="246" y="90" textAnchor="middle" fontSize="38" fontWeight="700" fill="var(--notion-text)">
                      =
                    </text>

                    {/* Placeholder / Answer Slot (renders pure number text cleanly without box or dashed border) */}
                    {selectedAnswer === null ? (
                      <text x="296" y="92" textAnchor="middle" fontSize="42" fontWeight="700" fill="var(--notion-text-muted)" fontFamily="var(--font-mono)">
                        ?
                      </text>
                    ) : (
                      <text
                        x="296"
                        y="92"
                        textAnchor="middle"
                        fontSize="42"
                        fontWeight="700"
                        fontFamily="var(--font-mono)"
                        fill={
                          !hasEvaluated
                            ? 'var(--notion-blue)'
                            : selectedAnswer === currentQuestion.correctAnswer
                            ? 'var(--notion-green)'
                            : 'var(--notion-red)'
                        }
                      >
                        {selectedAnswer}
                      </text>
                    )}
                  </svg>
                </div>
                {isCalculating && (
                  <div className="calculating-subtext pop-in">
                    <span>กำลังตรวจคำตอบ...</span>
                  </div>
                )}
              </div>
            ) : (
              /* Standard 2-number formula with dynamic answer slot */
              <div className="math-formula-wrapper">
                <div className="math-formula">
                  <span>{currentQuestion.num1}</span>
                  <span className="math-operator">{currentQuestion.operator}</span>
                  <span>{currentQuestion.num2}</span>
                  <span>=</span>
                  {selectedAnswer === null ? (
                    <span className="math-placeholder">?</span>
                  ) : (
                    <span
                      className={`math-slot ${
                        !hasEvaluated
                          ? 'math-slot-calculating'
                          : selectedAnswer === currentQuestion.correctAnswer
                          ? 'math-slot-correct'
                          : 'math-slot-incorrect'
                      }`}
                    >
                      {selectedAnswer}
                    </span>
                  )}
                </div>
                {isCalculating && (
                  <div className="calculating-subtext pop-in">
                    <span>กำลังตรวจคำตอบ...</span>
                  </div>
                )}
              </div>
            )}

            {/* Read aloud / replay button for kids (Only shown when voice is enabled) */}
            {isVoiceEnabled && (
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
            )}
          </div>

          <div className="choices-grid">
            {currentQuestion.choices.map((choice, index) => {
              let choiceClass = 'choice-btn'
              if (isAnswered) {
                if (isCalculating && choice === selectedAnswer) {
                  choiceClass += ' selected-calculating'
                } else if (hasEvaluated) {
                  if (choice === currentQuestion.correctAnswer) {
                    choiceClass += ' selected-correct pop-success'
                  } else if (choice === selectedAnswer) {
                    choiceClass += ' selected-incorrect shake-error'
                  }
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
        </section>
      )}

      {/* State 3: COMPLETED RESULTS */}
      {gameState === 'completed' && (() => {
        const resultMsg = getCompletionMessage(kidName, score, totalQuestions)
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
                {score} / {totalQuestions}
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
