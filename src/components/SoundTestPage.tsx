import { useState } from 'react'
import { soundEffects } from '../soundEffects'
import { ConfettiEffect } from './ConfettiEffect'

interface SoundTestPageProps {
  onBack: () => void
}

export function SoundTestPage({ onBack }: SoundTestPageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)
  const [activeBurstCount, setActiveBurstCount] = useState(0)

  const handlePlayGrandFinale = () => {
    setIsPlaying(true)
    setActiveBurstCount((prev) => prev + 5)
    soundEffects.playGrandFireworks()

    setTimeout(() => {
      setIsPlaying(false)
    }, 2400)
  }

  const handlePlaySingle = () => {
    soundEffects.playSingleFirework(0, [1046, 1318, 1568])
    setActiveBurstCount((prev) => prev + 1)
  }

  const handlePlayTriple = () => {
    soundEffects.playSingleFirework(0, [1046, 1318, 1568])
    soundEffects.playSingleFirework(320, [1318, 1568, 2093])
    soundEffects.playSingleFirework(640, [1568, 2093, 2637])
    setActiveBurstCount((prev) => prev + 3)
  }

  const handlePlayHighShimmer = () => {
    soundEffects.playSingleFirework(0, [2093, 2637, 3136])
    soundEffects.playSingleFirework(300, [1046, 1318, 1568, 2093, 2637])
    setActiveBurstCount((prev) => prev + 2)
  }

  return (
    <div className="sound-test-container pop-in">
      {showConfetti && isPlaying && <ConfettiEffect />}

      <header className="sound-test-header">
        <button
          type="button"
          onClick={onBack}
          className="notion-btn-back"
          title="กลับสู่หน้าหลักควิซ"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>กลับไปหน้าควิซ</span>
        </button>

        <div className="sound-test-badge">Sound Test Lab (/test)</div>
      </header>

      <main className="sound-test-card">
        <div className="sound-test-title-group">
          <h1 className="sound-test-title">ทดสอบระบบเสียงพลุเฉลิมฉลอง</h1>
          <p className="sound-test-desc">
            หน้านี้สร้างขึ้นเพื่อให้ทดลองฟังเสียงพลุ (Web Audio Synthesis) ที่ใช้ในฉากจบเกมเมื่อทำครบ 10 ข้อ
          </p>
        </div>

        {/* Primary Action: Exact Ending Sequence */}
        <div className="test-primary-box">
          <div className="test-primary-label">เสียงที่ใช้จริงตอนจบเกม (Grand Finale)</div>
          <button
            type="button"
            className={`notion-btn-primary test-grand-btn ${isPlaying ? 'pulse-active' : ''}`}
            onClick={handlePlayGrandFinale}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>{isPlaying ? 'กำลังยิงพลุฉลอง...' : 'กดฟังเสียงพลุชุดจบเกม (5 ลูกต่อเนื่อง)'}</span>
          </button>
          <div className="test-hint">
            ประกอบด้วยเสียงพุ่งนุ่มนวล + เสียงแตกตัวแน่นกลมกล่อม + เสียงกระดิ่งระยิบระยับ C Major Pentatonic
          </div>
        </div>

        {/* Individual Sound Variations */}
        <div className="test-section-heading">ทดสอบเสียงแยกแต่ละลูก</div>
        <div className="test-buttons-grid">
          <button
            type="button"
            className="test-sub-btn"
            onClick={handlePlaySingle}
          >
            <span className="btn-main-text">พลุเดี่ยว (Single Burst)</span>
            <span className="btn-sub-text">1 ลูก คอร์ดเสียงประสาน Do-Mi-Sol</span>
          </button>

          <button
            type="button"
            className="test-sub-btn"
            onClick={handlePlayTriple}
          >
            <span className="btn-main-text">พลุ 3 ลูก (Triple Burst)</span>
            <span className="btn-sub-text">3 ลูก ยิงต่อเนื่องไล่ระดับเสียง</span>
          </button>

          <button
            type="button"
            className="test-sub-btn"
            onClick={handlePlayHighShimmer}
          >
            <span className="btn-main-text">พลุละอองดาว (Stardust Cascade)</span>
            <span className="btn-sub-text">เสียงกระดิ่งประกายทองชุดใหญ่</span>
          </button>
        </div>

        {/* Settings Toggle */}
        <div className="test-options-row">
          <label className="test-checkbox-label">
            <input
              type="checkbox"
              checked={showConfetti}
              onChange={(e) => setShowConfetti(e.target.checked)}
            />
            <span>แสดงเอฟเฟกต์กระดาษโปรย (Confetti) ร่วมด้วย</span>
          </label>

          <span className="burst-counter-pill">
            ยิงไปแล้ว: {activeBurstCount} ครั้ง
          </span>
        </div>

        {/* Audio Engine Technical Spec */}
        <div className="sound-spec-box">
          <div className="spec-title">ข้อมูลเทคนิคระบบเสียง (Sound Engine Specs)</div>
          <ul className="spec-list">
            <li><strong>เทคโนโลยี:</strong> Web Audio API (Native Browser Synthesis - 0kb audio downloads)</li>
            <li><strong>ส่วนประกอบเสียง:</strong> Soft Launch Sweep + Low-Sine Pop (130Hz &rarr; 36Hz) + Golden Bell Chimes (1046Hz &ndash; 3136Hz) + Bandpass Stardust Crackle</li>
            <li><strong>ความเข้ากันได้:</strong> รองรับ 100% บนมือถือ iOS/Android, Chrome, Safari, Edge โดยไม่ต้องติดตั้งไฟล์เสียง</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
