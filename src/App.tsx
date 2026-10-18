import { useState, useEffect, useRef, type FormEvent } from 'react'
import { generateQuestion, type Question, type ProblemType } from './quizGenerator'
import { KidMascot } from './components/KidMascot'
import { ConfettiEffect } from './components/ConfettiEffect'
import { MascotCustomizerModal } from './components/MascotCustomizerModal'
import { type MascotConfig, loadSavedMascotConfig, saveMascotConfig } from './mascotTypes'
import {
  getRandomCorrectMessage,
  getRandomEncouragingMessage,
  getCompletionMessage,
  formatChildName,
} from './encouragements'
import { speakThaiText, stopSpeaking, formatProblemForSpeech, getAddition3StepSpeech } from './speechHelper'
import { soundEffects } from './soundEffects'
import { useAppUpdate } from './useAppUpdate'
import { UpdateNotificationToast } from './components/UpdateNotificationToast'
import { saveQuizSession, loadQuizSession, clearQuizSession } from './quizSessionManager'
import { MysteriousHand, type HandStyle } from './components/MysteriousHand'
import { ThemeFrameDecorations } from './components/ThemeFrameDecorations'
import { ThemeSelectorModal } from './components/ThemeSelectorModal'
import { InlineVisualCounter } from './components/InlineVisualCounter'
import { type QuizTheme, loadSavedTheme, saveTheme } from './themeTypes'
import './App.css'

type QuizState = 'name-input' | 'playing' | 'completed'

export default function App() {
  const [initialSession] = useState(() => {
    const session = loadQuizSession()
    if (session) {
      clearQuizSession()
    }
    return session
  })
  const { hasUpdate, isUpdating, dismissed, applyUpdate, dismissUpdate, checkNow } = useAppUpdate()

  const [gameState, setGameState] = useState<QuizState>(() => {
    return initialSession ? 'playing' : 'name-input'
  })

  const [kidName, setKidName] = useState(() => {
    if (initialSession?.kidName) return initialSession.kidName
    if (typeof window !== 'undefined') {
      return localStorage.getItem('math_quiz_kid_name') || ''
    }
    return ''
  })
  // Quiz configuration states (Default always to 10 questions on home screen, custom input starts completely empty)
  const [questionCountChoice, setQuestionCountChoice] = useState<10 | 20 | 30 | 'custom'>(() => {
    if (initialSession?.totalQuestions) {
      const t = initialSession.totalQuestions
      if (t === 10 || t === 20 || t === 30) return t
    }
    return 10
  })
  const [customQuestionCount, setCustomQuestionCount] = useState('')
  const [totalQuestions, setTotalQuestions] = useState(() => {
    return initialSession?.totalQuestions || 10
  })
  const [problemType, setProblemType] = useState<ProblemType>(() => {
    return initialSession?.problemType || 'add-sub-2'
  })
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('math_quiz_voice_enabled')
      return saved !== null ? saved === 'true' : true
    }
    return true
  })
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('math_quiz_theme')
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  // Apply data-theme attribute on document root and persist in localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('math_quiz_theme', theme)
    } catch {
      // ignore storage errors
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  const [currentIndex, setCurrentIndex] = useState(() => {
    return initialSession?.currentIndex || 0
  })
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(() => {
    return initialSession?.currentQuestion || null
  })
  const [score, setScore] = useState(() => {
    return initialSession?.score || 0
  })
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
  const [copiedLink, setCopiedLink] = useState(false)
  const [showInstallModal, setShowInstallModal] = useState(false)
  const [showQuitModal, setShowQuitModal] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isAppInstalled, setIsAppInstalled] = useState(false)

  const handleCopyLink = () => {
    const url = 'https://math-quiz-two-livid.vercel.app/'
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
      }).catch(() => {
        // Fallback
        prompt('คัดลอกลิงก์:', url)
      })
    } else {
      prompt('คัดลอกลิงก์:', url)
    }
  }

  // Listen for beforeinstallprompt event for PWA installation
  useEffect(() => {
    // Check if already launched in standalone mode
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone
      if (isStandalone) {
        setIsAppInstalled(true)
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    const handleAppInstalled = () => {
      setIsAppInstalled(true)
      setDeferredPrompt(null)
      setShowInstallModal(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt()
        const choiceResult = await deferredPrompt.userChoice
        if (choiceResult.outcome === 'accepted') {
          setIsAppInstalled(true)
        }
        setDeferredPrompt(null)
      } catch (err) {
        console.warn('Install prompt error:', err)
      }
    } else {
      // If browser doesn't support deferred prompt (e.g. iOS Safari), show the manual guide modal
      setShowInstallModal(true)
    }
  }

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPoked, setIsPoked] = useState(false)
  const [mascotConfig, setMascotConfig] = useState<MascotConfig>(() => loadSavedMascotConfig())
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false)

  const handleSaveMascotConfig = (newConfig: MascotConfig) => {
    setMascotConfig(newConfig)
    saveMascotConfig(newConfig)
  }
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(() => {
    return initialSession?.askedQuestions ? new Set(initialSession.askedQuestions) : new Set()
  })
  const [lifelineUses, setLifelineUses] = useState(() => {
    return initialSession?.lifelineUses ?? 0
  })
  const [counterUses, setCounterUses] = useState(() => {
    return initialSession?.counterUses ?? 0
  })
  // Track whether lifeline was used on this specific question
  const [usedLifelineOnCurrentQ, setUsedLifelineOnCurrentQ] = useState(false)
  const [showVisualCounter, setShowVisualCounter] = useState(false)
  const [eliminatedChoices, setEliminatedChoices] = useState<number[]>(() => {
    return initialSession?.eliminatedChoices || []
  })
  const [snatchingMap, setSnatchingMap] = useState<Record<number, { side: 'left' | 'right'; active: boolean }>>({})
  const [handStyle, setHandStyle] = useState<HandStyle>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('math_quiz_hand_style') as HandStyle
      if (saved === 'cartoon-glove' || saved === 'monster-paw' || saved === 'robot-claw') {
        return saved
      }
    }
    return 'cartoon-glove'
  })
  const [quizTheme, setQuizTheme] = useState<QuizTheme>(() => loadSavedTheme())
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false)

  const handleSelectTheme = (newTheme: QuizTheme) => {
    setQuizTheme(newTheme)
    saveTheme(newTheme)
  }
  const [demoStep, setDemoStep] = useState<0 | 1 | 2 | 3>(0) // 0: off, 1: pair 1, 2: add 3rd, 3: completed reveal
  const [isDemoRunning, setIsDemoRunning] = useState(false)
  const [isExplained, setIsExplained] = useState(false) // Question was answered via explanation / demo
  const demoTimeoutRefs = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const QUESTION_TIME_SECONDS = 60 // 1 minute per question
  const [timeLeft, setTimeLeft] = useState(() => {
    return initialSession?.timeLeft || QUESTION_TIME_SECONDS
  })
  const hasWarnedTimeRef = useRef(false)
  const questionSpeechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lifelineSpeechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (questionSpeechTimerRef.current) {
        clearTimeout(questionSpeechTimerRef.current)
      }
      if (lifelineSpeechTimerRef.current) {
        clearTimeout(lifelineSpeechTimerRef.current)
      }
      stopSpeaking()
    }
  }, [])

  // Interactive mascot poke handler (child taps the mascot - animation only, no voice)
  const handlePokeMascot = () => {
    setIsPoked(false)
    // Small timeout to allow re-triggering animation on multiple rapid clicks
    setTimeout(() => {
      setIsPoked(true)
      setTimeout(() => setIsPoked(false), 550)
    }, 10)
  }

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
      if (questionSpeechTimerRef.current) {
        clearTimeout(questionSpeechTimerRef.current)
      }
      // Small pause (250ms) before voice begins
      questionSpeechTimerRef.current = setTimeout(() => {
        handleSpeakProblem(currentQuestion)
      }, 250)
      return () => {
        if (questionSpeechTimerRef.current) {
          clearTimeout(questionSpeechTimerRef.current)
          questionSpeechTimerRef.current = null
        }
      }
    }
  }, [currentQuestion?.id, gameState, isVoiceEnabled])

  // Reset time warning flag & solution demonstration when a new question starts
  useEffect(() => {
    hasWarnedTimeRef.current = false
    setDemoStep(0)
    setIsExplained(false)
    clearDemoTimeouts()
  }, [currentIndex, currentQuestion?.id])

  // Spoken voice warning when time is running low (10 seconds remaining)
  useEffect(() => {
    if (gameState === 'playing' && !isAnswered && timeLeft === 10 && !hasWarnedTimeRef.current && isVoiceEnabled) {
      hasWarnedTimeRef.current = true
      setIsSpeaking(true)
      const warningText = 'เหลือเวลาอีก 10 วินาที'
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

  // 1-minute (60s) countdown timer per question (paused during step-by-step solution demo)
  useEffect(() => {
    if (gameState !== 'playing' || isAnswered || isDemoRunning) return

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
    if (questionSpeechTimerRef.current) {
      clearTimeout(questionSpeechTimerRef.current)
      questionSpeechTimerRef.current = null
    }
    if (lifelineSpeechTimerRef.current) {
      clearTimeout(lifelineSpeechTimerRef.current)
      lifelineSpeechTimerRef.current = null
    }
    stopSpeaking()
    setIsSpeaking(false)

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
        setEliminatedChoices([])
        setCurrentFeedback(null)
        setMascotMood('happy')
        setShowVisualCounter(false)
        setUsedLifelineOnCurrentQ(false)
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

    if (questionSpeechTimerRef.current) {
      clearTimeout(questionSpeechTimerRef.current)
      questionSpeechTimerRef.current = null
    }
    if (lifelineSpeechTimerRef.current) {
      clearTimeout(lifelineSpeechTimerRef.current)
      lifelineSpeechTimerRef.current = null
    }
    stopSpeaking()
    setIsSpeaking(false)

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
    setLifelineUses(0)
    setCounterUses(0)
    setUsedLifelineOnCurrentQ(false)
    setShowVisualCounter(false)
    setEliminatedChoices([])
    setCurrentFeedback(null)
    setShowConfetti(false)
    setMascotMood('happy')
    setGameState('playing')
  }

  // Handle choice selection with 2-step calculation animation
  const handleSelectChoice = (choice: number) => {
    if (isAnswered || !currentQuestion) return
    // Check for realtime updates in background
    checkNow().catch(() => {})

    // Cancel any pending speeches when choice is clicked
    if (questionSpeechTimerRef.current) {
      clearTimeout(questionSpeechTimerRef.current)
      questionSpeechTimerRef.current = null
    }
    if (lifelineSpeechTimerRef.current) {
      clearTimeout(lifelineSpeechTimerRef.current)
      lifelineSpeechTimerRef.current = null
    }
    stopSpeaking()
    setIsSpeaking(false)

    // Phase 1: Lock answering immediately, put selected choice into the slot, and start calculation animation
    setSelectedAnswer(choice)
    setIsAnswered(true)
    setIsCalculating(true)
    setHasEvaluated(false)
    setMascotMood('happy')

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
          setEliminatedChoices([])
          setCurrentFeedback(null)
          setMascotMood('happy')
          setShowVisualCounter(false)
          setUsedLifelineOnCurrentQ(false)
        } else {
          setGameState('completed')
        }
      }, 1600)
    }, 850)
  }

  // Dynamic Skill quota: 1 use per 10 questions (e.g. 10 questions = 1 use, 20 questions = 2 uses)
  const maxSkillUses = Math.max(1, Math.round(totalQuestions / 10))

  // Handle special booster lifeline (50-50: cut 2 incorrect choices with mysterious cartoon hand)
  const handleUseLifeline = () => {
    if (
      lifelineUses >= maxSkillUses ||
      usedLifelineOnCurrentQ ||
      isAnswered ||
      !currentQuestion ||
      eliminatedChoices.length > 0 ||
      Object.keys(snatchingMap).length > 0
    )
      return

    // Find all incorrect choices in current question
    const incorrectChoices = currentQuestion.choices.filter(
      (c) => c !== currentQuestion.correctAnswer
    )

    // Pick 2 random incorrect choices to eliminate
    const shuffledIncorrect = [...incorrectChoices].sort(() => Math.random() - 0.5)
    const toEliminate = shuffledIncorrect.slice(0, 2)
    if (toEliminate.length < 2) return

    const [firstChoice, secondChoice] = toEliminate

    // Immediately stop pending question speech & any active voice playback!
    if (questionSpeechTimerRef.current) {
      clearTimeout(questionSpeechTimerRef.current)
      questionSpeechTimerRef.current = null
    }
    if (lifelineSpeechTimerRef.current) {
      clearTimeout(lifelineSpeechTimerRef.current)
      lifelineSpeechTimerRef.current = null
    }
    stopSpeaking()
    setIsSpeaking(false)

    setLifelineUses((prev) => prev + 1)
    setUsedLifelineOnCurrentQ(true)
    setMascotMood('cheer')

    // Determine direction for each choice based on its position in the 2x2 grid
    // index 0 (top-left), index 1 (top-right), index 2 (bottom-left), index 3 (bottom-right)
    const getSideForChoice = (choiceVal: number): 'left' | 'right' => {
      const idx = currentQuestion.choices.indexOf(choiceVal)
      return idx % 2 === 0 ? 'left' : 'right'
    }

    const firstSide = getSideForChoice(firstChoice)
    const secondSide = getSideForChoice(secondChoice)

    // Staggered Snatch Animation (Gentle & fun pace for kids):
    // 1. Hand 1 swoops in and snatches the first incorrect choice!
    soundEffects.playYoink(70)
    setSnatchingMap({ [firstChoice]: { side: firstSide, active: true } })

    // 2. Hand 2 swoops in and snatches the second incorrect choice!
    setTimeout(() => {
      soundEffects.playYoink(70)
      setSnatchingMap((prev) => ({
        ...prev,
        [secondChoice]: { side: secondSide, active: true },
      }))
    }, 450)

    // 3. Mark both as eliminated once snatching animations finish
    setTimeout(() => {
      setEliminatedChoices(toEliminate)
      setSnatchingMap({})
    }, 1280)
  }

  // Handle special booster skill: Visual Counters (ลูกคิดวิเศษ & นิ้วช่วยนับ)
  const handleUseVisualCounter = () => {
    if (isAnswered || !currentQuestion || isDemoRunning) return
    if (!showVisualCounter) {
      // If not yet opened on this question, check quota
      if (counterUses >= maxSkillUses) return
      setShowVisualCounter(true)
      setCounterUses((prev) => prev + 1)
      if (isVoiceEnabled) {
        speakThaiText('แตะที่ลูกแอปเปิลเพื่อนับได้เลยนะ!')
      }
    } else {
      setShowVisualCounter(false)
    }
  }

  // Clear running demo timeouts when changing questions or unmounting
  const clearDemoTimeouts = () => {
    demoTimeoutRefs.current.forEach((t) => clearTimeout(t))
    demoTimeoutRefs.current = []
    setIsDemoRunning(false)
    stopSpeaking()
    setIsSpeaking(false)
  }

  // Advance to the next question or complete game
  const advanceToNextQuestion = () => {
    if (questionSpeechTimerRef.current) {
      clearTimeout(questionSpeechTimerRef.current)
      questionSpeechTimerRef.current = null
    }
    if (lifelineSpeechTimerRef.current) {
      clearTimeout(lifelineSpeechTimerRef.current)
      lifelineSpeechTimerRef.current = null
    }
    stopSpeaking()
    setIsSpeaking(false)
    clearDemoTimeouts()
    setShowConfetti(false)
    checkNow().catch(() => {})
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
      setEliminatedChoices([])
      setSnatchingMap({})
      setCurrentFeedback(null)
      setMascotMood('happy')
      setDemoStep(0)
      setIsExplained(false)
      setShowVisualCounter(false)
      setUsedLifelineOnCurrentQ(false)
    } else {
      setGameState('completed')
    }
  }

  // Step-by-step solution demonstration with animation and cheerful Thai voice
  const handleExplainSolution = () => {
    if (!currentQuestion || currentQuestion.problemType !== 'add-3' || typeof currentQuestion.num3 !== 'number' || isAnswered || isDemoRunning) return

    clearDemoTimeouts()
    setIsDemoRunning(true)
    setIsAnswered(true) // Lock answering
    setIsExplained(true) // Mark as revealed/explained (no score)
    setHasEvaluated(true) // Evaluated as incorrect / skipped for score
    setCurrentFeedback({
      isCorrect: false,
      text: `ดูเฉลยและวิธีทำข้อนี้แล้วนะ${kidName.trim() ? `น้อง${kidName.trim()}` : ''}! ข้อนี้ไม่คิดคะแนนนะ ตั้งใจดูแล้วลุยข้อถัดไปกันเลย!`,
    })

    const { num1, num2, num3 } = currentQuestion

    // Step 1: Animate pair 1 (num1 + num2) and speak clearly with the mascot voice
    setDemoStep(1)
    setMascotMood('think')

    const speakStep1 = () => {
      const step1Text = getAddition3StepSpeech(1, num1, num2, num3, kidName)
      speakThaiText(
        step1Text,
        () => setIsSpeaking(true),
        () => {
          setIsSpeaking(false)
          // Snappy transition (350ms) after Step 1 before moving to Step 2
          const t1 = setTimeout(() => {
            // Step 2: Animate adding intermediate sum with num3
            setDemoStep(2)
            setMascotMood('cheer')

            const step2Text = getAddition3StepSpeech(2, num1, num2, num3, kidName)
            speakThaiText(
              step2Text,
              () => setIsSpeaking(true),
              () => {
                setIsSpeaking(false)
                // Snappy transition (350ms) after Step 2 before revealing final answer
                const t2 = setTimeout(() => {
                  setDemoStep(3)
                  setMascotMood('cheer')

                  const step3Text = getAddition3StepSpeech(3, num1, num2, num3, kidName)
                  speakThaiText(
                    step3Text,
                    () => setIsSpeaking(true),
                    () => {
                      setIsSpeaking(false)
                      setIsDemoRunning(false)
                    },
                    1.18
                  )
                }, 350)
                demoTimeoutRefs.current.push(t2)
              },
              1.18
            )
          }, 350)
          demoTimeoutRefs.current.push(t1)
        },
        1.18
      )
    }

    // Quick initial pause (180ms) before voice begins
    const initialT = setTimeout(speakStep1, 180)
    demoTimeoutRefs.current.push(initialT)
  }

  // Only save quiz session when update notification is showing, so that normal refreshes return to start
  useEffect(() => {
    if (hasUpdate && !dismissed && gameState === 'playing' && currentQuestion) {
      saveQuizSession({
        kidName,
        problemType,
        totalQuestions,
        currentIndex,
        currentQuestion,
        askedQuestions: Array.from(askedQuestions),
        score,
        lifelineUses,
        counterUses,
        eliminatedChoices,
        timeLeft,
      })
    } else {
      clearQuizSession()
    }
  }, [
    hasUpdate,
    dismissed,
    gameState,
    currentIndex,
    currentQuestion,
    score,
    lifelineUses,
    counterUses,
    eliminatedChoices,
    totalQuestions,
    problemType,
    kidName,
    askedQuestions,
    timeLeft,
  ])

  // Change kid name / reset
  const handleReset = () => {
    clearQuizSession()
    setScore(0)
    setCurrentIndex(0)
    setCurrentQuestion(null)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setIsCalculating(false)
    setHasEvaluated(false)
    setLifelineUses(0)
    setCounterUses(0)
    setUsedLifelineOnCurrentQ(false)
    setShowVisualCounter(false)
    setEliminatedChoices([])
    setSnatchingMap({})
    setCurrentFeedback(null)
    setShowConfetti(false)
    setMascotMood('happy')
    setGameState('name-input')
  }

  // Confirm exit from ongoing quiz
  const handleConfirmQuit = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    clearDemoTimeouts()
    clearQuizSession()
    setShowQuitModal(false)
    handleReset()
  }


  return (
    <main className="notion-container">
      {/* Realtime Version Update Toast Banner */}
      {hasUpdate && !dismissed && (
        <UpdateNotificationToast
          onUpdate={() => {
            applyUpdate(() => {
              if (gameState === 'playing' && currentQuestion) {
                saveQuizSession({
                  kidName,
                  problemType,
                  totalQuestions,
                  currentIndex,
                  currentQuestion,
                  askedQuestions: Array.from(askedQuestions),
                  score,
                  lifelineUses,
                  counterUses,
                  eliminatedChoices,
                  timeLeft,
                })
              }
            })
          }}
          onDismiss={dismissUpdate}
          isUpdating={isUpdating}
        />
      )}
      {/* Header Actions Bar (Theme, Install, QR) */}
      <header className="global-top-bar">
        <div className="top-actions-left">
          {gameState === 'playing' && (
            <button
              type="button"
              className="exit-quiz-btn"
              onClick={() => setShowQuitModal(true)}
              title="ออกจากแบบฝึกหัด กลับสู่หน้าหลัก"
              aria-label="ออกจากแบบฝึกหัด"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>ออกจากแบบฝึกหัด</span>
            </button>
          )}
        </div>

        <div className="top-actions-right">
          {gameState === 'name-input' && !isAppInstalled && (
            <button
              type="button"
              className="install-app-btn"
              onClick={handleInstallClick}
              title="ติดตั้ง Math Quiz ไว้บนหน้าจอมือถือเพื่อเข้าเล่นได้สะดวกรวดเร็ว"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>ติดตั้ง App</span>
            </button>
          )}

          {gameState === 'name-input' && (
            <button
              type="button"
              className="view-qr-btn"
              onClick={() => setShowQrModal(true)}
              title="ดู QR Code สำหรับแชร์"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>QR Code</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'เปลี่ยนเป็นธีมสว่าง (Light Mode)' : 'เปลี่ยนเป็นธีมมืด (Dark Mode)'}
            aria-label={theme === 'dark' ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมมืด'}
          >
            <span className="theme-toggle-icon" aria-hidden="true">
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </span>
            <span className="theme-toggle-label">{theme === 'dark' ? 'สว่าง' : 'มืด'}</span>
          </button>
        </div>
      </header>

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

          <div className="mascot-wrapper mascot-float">
            <KidMascot
              mood="happy"
              size={140}
              onClick={handlePokeMascot}
              isPoked={isPoked}
              config={mascotConfig}
            />
          </div>

          {/* Mascot & Theme Customization Buttons Row */}
          <div className="home-custom-pills-row">
            <button
              type="button"
              className="mascot-customize-pill pop-in"
              onClick={() => setIsCustomizerOpen(true)}
              title="กดเพื่อแต่งตัวมาสคอต"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a7 7 0 0 1 7 7c0 2-1 3.5-2 4.5s-1.5 2-1 3.5a1.5 1.5 0 0 1-2.5 1.5c-1-.5-2.5-1-4.5-1A7 7 0 0 1 12 2z" />
              </svg>
              <span>แต่งตัวการ์ตูน</span>
            </button>

            <button
              type="button"
              className="theme-select-home-pill pop-in"
              onClick={() => setIsThemeModalOpen(true)}
              title="กดเพื่อเลือกธีมและกรอบรูป"
            >
              <span className="theme-home-icon" aria-hidden="true">🎨</span>
              <span>เลือกธีม</span>
            </button>
          </div>


          <form onSubmit={handleStart} className="name-form">
            <label htmlFor="kidNameInput" className="name-label">
              ชื่อเล่น หรือ ฉายาของหนู
            </label>
            <input
              id="kidNameInput"
              type="text"
              className="name-input"
              placeholder="พิมพ์ชื่อตรงนี้ (หรือไม่พิมพ์ก็ได้นะ)"
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
                    onClick={() => {
                      setQuestionCountChoice(10)
                      setCustomQuestionCount('')
                    }}
                  >
                    <span className="chip-main-text">10 ข้อ</span>
                  </button>
                  <button
                    type="button"
                    className={`config-chip-btn ${questionCountChoice === 20 ? 'active' : ''}`}
                    onClick={() => {
                      setQuestionCountChoice(20)
                      setCustomQuestionCount('')
                    }}
                  >
                    <span className="chip-main-text">20 ข้อ</span>
                  </button>
                  <button
                    type="button"
                    className={`config-chip-btn ${questionCountChoice === 30 ? 'active' : ''}`}
                    onClick={() => {
                      setQuestionCountChoice(30)
                      setCustomQuestionCount('')
                    }}
                  >
                    <span className="chip-main-text">30 ข้อ</span>
                  </button>
                  <button
                    type="button"
                    className={`config-chip-btn ${questionCountChoice === 'custom' ? 'active' : ''}`}
                    onClick={() => {
                      setQuestionCountChoice('custom')
                      setCustomQuestionCount('')
                    }}
                  >
                    <span className="chip-main-text">กำหนดเอง</span>
                  </button>
                </div>

                {/* Custom count input only if custom is chosen */}
                {questionCountChoice === 'custom' && (
                  <div className="custom-count-wrapper pop-in">
                    <span className="custom-count-title">ระบุจำนวนข้อ:</span>
                    <div className="custom-stepper-box">
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() => {
                          const current = parseInt(customQuestionCount, 10) || 10
                          setCustomQuestionCount(String(Math.max(1, current - 1)))
                        }}
                        title="ลด 1 ข้อ"
                        aria-label="ลด 1 ข้อ"
                      >
                        −
                      </button>
                      <input
                        id="customCountInput"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="custom-count-input"
                        value={customQuestionCount}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '')
                          setCustomQuestionCount(val)
                        }}
                        autoFocus
                      />
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() => {
                          const current = parseInt(customQuestionCount, 10) || 10
                          setCustomQuestionCount(String(Math.min(100, current + 1)))
                        }}
                        title="เพิ่ม 1 ข้อ"
                        aria-label="เพิ่ม 1 ข้อ"
                      >
                        +
                      </button>
                      <span className="custom-count-unit">ข้อ</span>
                    </div>
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
                    className={`config-chip-btn config-type-card ${problemType === 'add-sub-2' ? 'active' : ''}`}
                    onClick={() => setProblemType('add-sub-2')}
                  >
                    <span className="chip-main-text">บวก-ลบ 2 ตัว</span>
                    <span className="chip-example-badge">7 + 2 หรือ 8 - 3</span>
                  </button>
                  <button
                    type="button"
                    className={`config-chip-btn config-type-card ${problemType === 'add-3' ? 'active' : ''}`}
                    onClick={() => setProblemType('add-3')}
                  >
                    <span className="chip-main-text">บวก 3 ตัว</span>
                    <span className="chip-example-badge">2 + 3 + 4</span>
                  </button>
                </div>
              </div>

              {/* Voice Setting Toggle */}
              <div className="config-group">
                <div className="config-label-row">
                  <span className="config-title">เสียงอ่านโจทย์</span>
                </div>
                <div className="config-types-row">
                  <button
                    type="button"
                    className={`config-chip-btn config-voice-card ${isVoiceEnabled ? 'active' : ''}`}
                    onClick={() => {
                      setIsVoiceEnabled(true)
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('math_quiz_voice_enabled', 'true')
                      }
                    }}
                  >
                    <span className="chip-main-text">🔊 เปิดเสียง</span>
                  </button>
                  <button
                    type="button"
                    className={`config-chip-btn config-voice-card ${!isVoiceEnabled ? 'active' : ''}`}
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
                    <span className="chip-main-text">🔇 ปิดเสียง</span>
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
              {/* Kid-friendly, easy-to-read Notion Timer Badge */}
              {(() => {
                const timerState = timeLeft <= 10 ? 'urgent' : timeLeft <= 25 ? 'warning' : 'normal'
                return (
                  <div
                    className={`badge badge-timer badge-timer-${timerState}`}
                    title={`เวลาที่เหลือ: ${timeLeft} วินาที`}
                    role="timer"
                    aria-label={`เหลือเวลา ${timeLeft} วินาที`}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="timer-badge-icon"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="timer-badge-number">{timeLeft}</span>
                    <span className="timer-badge-unit">วิ</span>
                  </div>
                )
              })()}

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

          {/* Character and Speech feedback bubble with custom themes and frame decorations */}
          <div className={`mascot-status-area theme-${quizTheme}`}>
            {/* Thematic frame decorations & vector art (Halloween, Christmas, Space, CandyLand) */}
            <ThemeFrameDecorations theme={quizTheme} />

            <div className="mascot-mini">
              <KidMascot
                mood={mascotMood}
                size={82}
                onClick={handlePokeMascot}
                isPoked={isPoked}
                config={mascotConfig}
              />
            </div>
            <div className={`mascot-speech-bubble ${currentFeedback ? (currentFeedback.isCorrect ? 'bubble-correct pop-in' : 'bubble-try pop-in') : ''}`}>
              {currentFeedback ? (
                <span>{currentFeedback.text}</span>
              ) : (
                <span>ข้อนี้ตอบเท่าไหร่ดีนะ{formatChildName(kidName)}? ค่อยๆ คิดนะ!</span>
              )}
            </div>
          </div>

          <div className={`math-card ${hasEvaluated && !isExplained ? (currentFeedback?.isCorrect ? 'card-pulse-success' : 'card-shake') : ''}`}>
            {currentQuestion.problemType === 'add-3' && typeof currentQuestion.num3 === 'number' ? (
              /* 3-number addition with step-by-step connection lines & walkthrough demonstration */
              <div className="addition-3-container">
                {demoStep !== 3 && !isExplained && (
                  <div className={`step-flow-banner ${demoStep > 0 ? 'step-flow-active' : ''}`}>
                    {demoStep === 1 ? (
                      <span>ขั้นที่ 1: นำ {currentQuestion.num1} + {currentQuestion.num2} = {currentQuestion.num1 + currentQuestion.num2}</span>
                    ) : demoStep === 2 ? (
                      <span>ขั้นที่ 2: นำผลลัพธ์ {currentQuestion.num1 + currentQuestion.num2} + {currentQuestion.num3} = {currentQuestion.correctAnswer}</span>
                    ) : (
                      <span>คิดทีละคู่: บวก 2 ตัวแรกก่อน แล้วบวกตัวที่สาม</span>
                    )}
                  </div>
                )}
                <div className="addition-guide-svg-wrapper">
                  <svg
                    viewBox="0 0 420 180"
                    className="addition-guide-svg"
                    role="img"
                    aria-label={`โจทย์เลข 3 จำนวน: ${currentQuestion.num1} บวก ${currentQuestion.num2} บวก ${currentQuestion.num3}`}
                  >
                    <defs>
                      <filter id="demoGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="var(--notion-blue)" floodOpacity="0.4" />
                      </filter>
                      <filter id="sumBubbleShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.14)" />
                      </filter>
                      <marker id="arrowGreen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--notion-green)" />
                      </marker>
                    </defs>

                    {/* Step 1 Connecting Arc: Linking Num1 (x=45) and Num2 (x=135) from above */}
                    <path
                      d="M 45 60 C 45 26, 90 22, 90 12 C 90 22, 135 26, 135 60"
                      fill="none"
                      stroke={demoStep === 1 ? 'var(--notion-blue)' : demoStep > 1 ? 'var(--notion-green)' : 'var(--notion-blue)'}
                      strokeWidth={demoStep >= 1 ? '3.5' : '2.8'}
                      strokeLinecap="round"
                      className={demoStep === 1 ? 'guide-arc-pulsing' : ''}
                    />

                    {/* Step 1 Guide Label on top of Pair 1 */}
                    <g transform="translate(64, 2)">
                      <rect
                        width="52"
                        height="22"
                        rx="11"
                        fill={demoStep >= 1 ? 'var(--notion-blue)' : 'var(--notion-blue-bg)'}
                        stroke="var(--notion-blue)"
                        strokeWidth="1.5"
                      />
                      <text
                        x="26"
                        y="15"
                        textAnchor="middle"
                        fontSize="12.5"
                        fontWeight="700"
                        fill={demoStep >= 1 ? '#ffffff' : 'var(--notion-blue)'}
                      >
                        คู่ที่ 1
                      </text>
                    </g>

                    {/* Intermediate Sum (Result of Pair 1) below num1 & num2 */}
                    {demoStep >= 1 && (
                      <g className="intermediate-badge-group pop-in">
                        {/* Connecting bracket down from num1 & num2 */}
                        <path
                          d="M 48 116 C 48 136, 90 134, 90 140 C 90 134, 132 136, 132 116"
                          fill="none"
                          stroke="var(--notion-blue)"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                        />
                        {/* Intermediate sum pill bubble */}
                        <rect
                          x="65"
                          y="136"
                          width="50"
                          height="28"
                          rx="14"
                          fill="var(--notion-blue)"
                          filter="url(#sumBubbleShadow)"
                        />
                        <text
                          x="90"
                          y="155"
                          textAnchor="middle"
                          fontSize="17"
                          fontWeight="800"
                          fill="#ffffff"
                          fontFamily="var(--font-mono)"
                        >
                          {currentQuestion.num1 + currentQuestion.num2}
                        </text>
                      </g>
                    )}

                    {/* Step 2 Arc: Smooth flowing path from intermediate sum (x=115, y=150) to num3 bottom (x=225, y=120) */}
                    {demoStep >= 2 && (
                      <g className="step2-arc-group pop-in">
                        <path
                          d="M 116 150 C 160 156, 195 152, 222 124"
                          fill="none"
                          stroke="var(--notion-green)"
                          strokeWidth="3.2"
                          strokeDasharray="5 4"
                          strokeLinecap="round"
                          className="step2-arc-pulse"
                          markerEnd="url(#arrowGreen)"
                        />
                        {/* Step 2 Badge neatly centered above the connecting path */}
                        <g transform="translate(142, 156)">
                          <rect
                            width="60"
                            height="20"
                            rx="10"
                            fill="var(--notion-green-bg)"
                            stroke="var(--notion-green)"
                            strokeWidth="1.4"
                          />
                          <text
                            x="30"
                            y="14"
                            textAnchor="middle"
                            fontSize="11.5"
                            fontWeight="700"
                            fill="var(--notion-green)"
                          >
                            + ตัวที่ 3
                          </text>
                        </g>
                      </g>
                    )}

                    {/* Main Formula Row (y=100) */}
                    {/* Num1 */}
                    <g className={demoStep === 1 ? 'num-highlight-static' : ''}>
                      {demoStep === 1 && (
                        <circle cx="45" cy="88" r="28" fill="var(--notion-blue-bg)" opacity="0.65" />
                      )}
                      <text
                        x="45"
                        y="100"
                        textAnchor="middle"
                        fontSize="44"
                        fontWeight="700"
                        fill={demoStep === 1 ? 'var(--notion-blue)' : 'var(--notion-text)'}
                        fontFamily="var(--font-mono)"
                      >
                        {currentQuestion.num1}
                      </text>
                    </g>

                    {/* Operator 1 */}
                    <text x="90" y="98" textAnchor="middle" fontSize="36" fontWeight="700" fill="var(--notion-blue)">
                      +
                    </text>

                    {/* Num2 */}
                    <g className={demoStep === 1 ? 'num-highlight-static' : ''}>
                      {demoStep === 1 && (
                        <circle cx="135" cy="88" r="28" fill="var(--notion-blue-bg)" opacity="0.65" />
                      )}
                      <text
                        x="135"
                        y="100"
                        textAnchor="middle"
                        fontSize="44"
                        fontWeight="700"
                        fill={demoStep === 1 ? 'var(--notion-blue)' : 'var(--notion-text)'}
                        fontFamily="var(--font-mono)"
                      >
                        {currentQuestion.num2}
                      </text>
                    </g>

                    {/* Operator 2 */}
                    <text x="180" y="98" textAnchor="middle" fontSize="36" fontWeight="700" fill="var(--notion-blue)">
                      +
                    </text>

                    {/* Num3 */}
                    <g className={demoStep === 2 ? 'num-highlight-static' : ''}>
                      {demoStep === 2 && (
                        <circle cx="225" cy="88" r="28" fill="var(--notion-green-bg)" opacity="0.65" />
                      )}
                      <text
                        x="225"
                        y="100"
                        textAnchor="middle"
                        fontSize="44"
                        fontWeight="700"
                        fill={demoStep === 2 ? 'var(--notion-green)' : 'var(--notion-text)'}
                        fontFamily="var(--font-mono)"
                      >
                        {currentQuestion.num3}
                      </text>
                    </g>

                    {/* Equals */}
                    <text x="275" y="98" textAnchor="middle" fontSize="38" fontWeight="700" fill="var(--notion-text)">
                      =
                    </text>

                    {/* Placeholder / Answer Slot */}
                    {demoStep === 3 || isExplained ? (
                      <text
                        x="335"
                        y="100"
                        textAnchor="middle"
                        fontSize="44"
                        fontWeight="700"
                        fontFamily="var(--font-mono)"
                        fill="var(--notion-blue)"
                        className="pop-success"
                      >
                        {currentQuestion.correctAnswer}
                      </text>
                    ) : selectedAnswer === null ? (
                      <text x="335" y="100" textAnchor="middle" fontSize="44" fontWeight="700" fill="var(--notion-text-muted)" fontFamily="var(--font-mono)">
                        ?
                      </text>
                    ) : (
                      <text
                        x="335"
                        y="100"
                        textAnchor="middle"
                        fontSize="44"
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

            {/* Inline Visual Counter Panel (นิ้วช่วยนับใต้โจทย์ แสดงแอปเปิลให้นับได้โดยตรง) */}
            {showVisualCounter && (
              <InlineVisualCounter
                num1={currentQuestion.num1}
                operator={currentQuestion.operator}
                num2={currentQuestion.num2}
                num3={currentQuestion.num3}
                onClose={() => setShowVisualCounter(false)}
              />
            )}

            {/* Action buttons row under math card: Solution walkthrough & Voice replay */}
            <div className="math-card-actions-row">
              {/* Show step-by-step solution walkthrough button for 3-number addition */}
              {currentQuestion.problemType === 'add-3' && typeof currentQuestion.num3 === 'number' && !isAnswered && (
                <button
                  type="button"
                  className={`explain-solution-btn ${isDemoRunning ? 'demo-active' : ''}`}
                  onClick={handleExplainSolution}
                  disabled={isDemoRunning}
                  title="กดดูวิธีคิดทีละขั้นตอนพร้อมเสียงอธิบายแอนิเมชัน"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>{isDemoRunning ? 'กำลังสาธิตวิธีทำ...' : 'กดดูวิธีทำและเฉลย'}</span>
                </button>
              )}

              {/* Read aloud / replay button for kids (Only shown when voice is enabled and not during explanation) */}
              {isVoiceEnabled && !isDemoRunning && !isExplained && (
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

          </div>

          {/* Either show Next Question button (if solution was viewed/explained) OR regular choices grid */}
          {isExplained ? (
            <div className="explained-next-action-card pop-in">
              <button
                type="button"
                className="notion-btn-primary next-question-after-demo-btn pulse-btn"
                onClick={advanceToNextQuestion}
                disabled={isDemoRunning}
              >
                <span>{currentIndex < totalQuestions ? 'ไปข้อถัดไป' : 'ดูสรุปผลคะแนน'}</span>
              </button>
            </div>
          ) : (
            <div className="choices-grid">
              {currentQuestion.choices.map((choice, index) => {
                const isEliminated = eliminatedChoices.includes(choice)
                const snatchData = snatchingMap[choice]
                const isBeingSnatched = !!snatchData?.active

                let choiceClass = 'choice-btn'
                if (isEliminated) {
                  choiceClass += ' choice-eliminated'
                }
                if (isBeingSnatched) {
                  choiceClass += snatchData.side === 'left' ? ' card-snatched-left' : ' card-snatched-right'
                }
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
                  <div
                    key={`${currentQuestion.id}-${index}-${choice}`}
                    className="choice-slot-wrapper"
                  >
                    <button
                      type="button"
                      className={choiceClass}
                      disabled={isAnswered || isEliminated || isBeingSnatched}
                      onClick={() => handleSelectChoice(choice)}
                    >
                      {choice}
                    </button>

                    {isBeingSnatched && (
                      <MysteriousHand
                        side={snatchData.side}
                        style={handStyle}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Floating Skill Boosters: 50-50 Lifeline & Visual Counters Button */}
          <aside className="skill-floating-pod pop-in" aria-label="สกิลพิเศษ">
            {/* Skill 1: Cut 2 choices */}
            {(() => {
              const remainingLifeline = Math.max(0, maxSkillUses - lifelineUses)
              const isLifelineDepleted = remainingLifeline === 0
              const isLifelineDisabled = isLifelineDepleted || usedLifelineOnCurrentQ || isAnswered
              return (
                <button
                  type="button"
                  className={`skill-btn ${isLifelineDepleted ? 'skill-used' : ''}`}
                  disabled={isLifelineDisabled}
                  onClick={handleUseLifeline}
                  title={
                    isLifelineDepleted
                      ? `ใช้สิทธิ์ตัดชอยส์ครบโควตาแล้ว (${maxSkillUses}/${maxSkillUses} ครั้ง)`
                      : usedLifelineOnCurrentQ
                      ? 'ข้อนี้ใช้สกิลตัดชอยส์ไปแล้ว'
                      : `กดเพื่อตัดตัวเลือกที่ผิดออก 2 ข้อ (เหลือ ${remainingLifeline}/${maxSkillUses} ครั้ง)`
                  }
                  aria-label="สกิลพิเศษ ตัด 2 ตัวเลือก"
                >
                  <div className="skill-icon-gem" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <div className="skill-info">
                    <div className="skill-name-row">
                      <span className="skill-name">ตัด 2 ชอยส์</span>
                      <span className="skill-badge">{remainingLifeline}/{maxSkillUses}</span>
                    </div>
                    <span className="skill-desc">ดึงคำตอบที่ไม่ใช่ออก</span>
                  </div>
                </button>
              )
            })()}

            {/* Skill 2: Visual Counters (ลูกคิดวิเศษ & นิ้วช่วยนับ) */}
            {(() => {
              const remainingCounter = Math.max(0, maxSkillUses - counterUses)
              const isCounterDepleted = remainingCounter === 0 && !showVisualCounter
              const isCounterDisabled = isAnswered || (isCounterDepleted && !showVisualCounter)
              return (
                <button
                  type="button"
                  className={`skill-btn skill-btn-counter ${isCounterDepleted ? 'skill-used' : ''}`}
                  disabled={isCounterDisabled}
                  onClick={handleUseVisualCounter}
                  title={
                    isCounterDepleted
                      ? `ใช้สิทธิ์นิ้วช่วยนับครบโควตาแล้ว (${maxSkillUses}/${maxSkillUses} ครั้ง)`
                      : `กดเพื่อเปิดนิ้วช่วยนับ แตะลูกแอปเปิลเพื่อนับ (เหลือ ${remainingCounter}/${maxSkillUses} ครั้ง)`
                  }
                  aria-label="สกิลพิเศษ นิ้วช่วยนับ"
                >
                  <div className="skill-icon-gem" aria-hidden="true">
                    🍎
                  </div>
                  <div className="skill-info">
                    <div className="skill-name-row">
                      <span className="skill-name">นิ้วช่วยนับ</span>
                      <span className="skill-badge">{remainingCounter}/{maxSkillUses}</span>
                    </div>
                    <span className="skill-desc">แตะรูปเพื่อนับ</span>
                  </div>
                </button>
              )
            })()}
          </aside>
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
              <KidMascot mood={resultMsg.mood} size={140} config={mascotConfig} />
            </div>

            <div className="title-tag">ผลการทำแบบฝึกหัด</div>
            <h1 className="page-title">{resultMsg.headline}</h1>

            <div className="result-card pop-in">
              <div className="result-score">
                {score} / {totalQuestions}
              </div>
              <p className="result-label">คะแนนรวมของ{formatChildName(kidName)}</p>
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
            {/* Top-Right Dedicated Floating Close Button */}
            <button
              type="button"
              className="modal-corner-close-btn"
              onClick={() => setShowQrModal(false)}
              aria-label="ปิดหน้าต่าง"
              title="ปิดหน้าต่าง"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="2" y1="2" x2="12" y2="12" />
                <line x1="12" y1="2" x2="2" y2="12" />
              </svg>
            </button>

            <div className="modal-header">
              <span className="badge badge-tag">สแกนเพื่อเข้าเล่น</span>
            </div>
            <div className="modal-body">
              {/* Clean QR Photo Frame */}
              <div className="qr-photo-frame-container">
                <div className="qr-image-wrapper">
                  <img
                    src="/qrcode/qrcode.png"
                    alt="QR Code สำหรับเข้าเล่น Math Quiz"
                    className="qr-image"
                  />
                </div>
              </div>

              <div className="qr-actions-row">
                <button
                  type="button"
                  className={`qr-copy-btn ${copiedLink ? 'copied' : ''}`}
                  onClick={handleCopyLink}
                >
                  {copiedLink ? (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>คัดลอกลิงก์สำเร็จแล้ว!</span>
                    </>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      <span>คัดลอกลิงก์ (Copy URL)</span>
                    </>
                  )}
                </button>
              </div>

              <p className="qr-hint">
                เปิดกล้องมือถือหรือแท็บเล็ตแล้วสแกนเพื่อเข้าเล่นได้ทันที!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PWA Install Modal Dialog */}
      {showInstallModal && (
        <div className="modal-backdrop" onClick={() => setShowInstallModal(false)}>
          <div className="notion-modal pwa-modal-card pop-in" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-corner-close-btn"
              onClick={() => setShowInstallModal(false)}
              aria-label="ปิดหน้าต่าง"
              title="ปิดหน้าต่าง"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="2" y1="2" x2="12" y2="12" />
                <line x1="12" y1="2" x2="2" y2="12" />
              </svg>
            </button>

            <div className="modal-header">
              <span className="badge badge-tag">ติดตั้งลงบนมือถือ</span>
            </div>
            <div className="modal-body">
              <div className="pwa-app-preview">
                <img
                  src="/pwa-192x192.png"
                  alt="Math Quiz Icon"
                  className="pwa-preview-icon"
                />
                <div className="pwa-preview-info">
                  <span className="pwa-preview-title">Math Quiz</span>
                  <span className="pwa-preview-desc">เกมคณิตคิดเร็วสำหรับเด็กๆ</span>
                </div>
              </div>

              <div className="pwa-steps-list">
                <div className="pwa-step-item">
                  <div className="pwa-step-num">1</div>
                  <div>
                    <strong>สำหรับ iPhone / iPad (Safari):</strong>
                    <br />
                    แตะปุ่มแชร์ <span className="pwa-highlight-tag">Share</span> ที่แถบเมนูด้านล่าง แล้วเลือก <span className="pwa-highlight-tag">เพิ่มไปยังหน้าจอโฮม (Add to Home Screen)</span>
                  </div>
                </div>

                <div className="pwa-step-item">
                  <div className="pwa-step-num">2</div>
                  <div>
                    <strong>สำหรับ Android (Chrome):</strong>
                    <br />
                    แตะจุดสามจุด <span className="pwa-highlight-tag">...</span> มุมบนขวา แล้วเลือก <span className="pwa-highlight-tag">ติดตั้งแอป (Install App)</span> หรือ <span className="pwa-highlight-tag">เพิ่มลงในหน้าจอหลัก</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="notion-btn-primary pwa-install-cta-btn"
                onClick={() => setShowInstallModal(false)}
              >
                เข้าใจแล้ว พร้อมใช้งาน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quit Quiz Confirmation Modal */}
      {showQuitModal && (
        <div className="modal-backdrop" onClick={() => setShowQuitModal(false)}>
          <div className="notion-modal quit-modal-card pop-in" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-corner-close-btn"
              onClick={() => setShowQuitModal(false)}
              aria-label="ปิดหน้าต่าง"
              title="ปิดหน้าต่าง"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="2" y1="2" x2="12" y2="12" />
                <line x1="12" y1="2" x2="2" y2="12" />
              </svg>
            </button>

            <div className="modal-header">
              <h2>ต้องการออกจากแบบฝึกหัดใช่ไหม?</h2>
            </div>

            <div className="modal-body">
              <p style={{ margin: '0 0 20px 0', color: 'var(--notion-text-muted)', fontSize: '14px', lineHeight: 1.5 }}>
                หากออกตอนนี้ คะแนนและความคืบหน้าของรอบนี้จะถูกยกเลิก และกลับสู่หน้าเริ่มต้น
              </p>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="notion-btn-primary"
                  onClick={() => setShowQuitModal(false)}
                  autoFocus
                >
                  ทำแบบฝึกหัดต่อ
                </button>
                <button
                  type="button"
                  className="notion-btn-secondary danger-hover-btn"
                  onClick={handleConfirmQuit}
                >
                  ยืนยันออกจากแบบฝึกหัด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mascot Customizer Modal */}
      <MascotCustomizerModal
        isOpen={isCustomizerOpen}
        currentConfig={mascotConfig}
        onSave={handleSaveMascotConfig}
        onClose={() => setIsCustomizerOpen(false)}
        handStyle={handStyle}
        onSelectHandStyle={(style) => {
          setHandStyle(style)
          try {
            localStorage.setItem('math_quiz_hand_style', style)
          } catch {}
        }}
      />

      {/* Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        currentTheme={quizTheme}
        onSelectTheme={handleSelectTheme}
        onClose={() => setIsThemeModalOpen(false)}
        mascotConfig={mascotConfig}
        kidName={kidName}
      />
    </main>
  )
}
