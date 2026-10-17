import { useState } from 'react'
import { soundEffects } from '../soundEffects'
import { ConfettiEffect } from './ConfettiEffect'

interface SoundTestPageProps {
  onBack: () => void
}

export function SoundTestPage({ onBack }: SoundTestPageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)
  const [lastPlayedName, setLastPlayedName] = useState<string>('ยังไม่ได้กด')

  const handlePlayGrandFinale = () => {
    setIsPlaying(true)
    setLastPlayedName('เสียงฉลองจบเกม (Confetti Pop + Ta-da)')
    soundEffects.playGrandFireworks()

    setTimeout(() => {
      setIsPlaying(false)
    }, 2000)
  }

  const handlePlayConfetti = () => {
    setLastPlayedName('พลุกระดาษ Confetti Pop')
    soundEffects.playConfettiPop()
  }

  const handlePlayTada = () => {
    setLastPlayedName('เสียงแตรฉลอง Ta-da')
    soundEffects.playTada()
  }

  const handlePlayVictory = () => {
    setLastPlayedName('เสียงดนตรีฉลองชัยชนะ Victory Fanfare')
    soundEffects.playVictory()
  }

  const handlePlayWebFireworkShow = () => {
    setIsPlaying(true)
    setLastPlayedName('ชุดพลุ Web Fireworks Show (Fireworks-js)')
    soundEffects.playWebFireworksShow()
    setTimeout(() => {
      setIsPlaying(false)
    }, 2200)
  }

  const handlePlaySingleWebBurst = (idx: number) => {
    setLastPlayedName(`เสียงพลุเว็บแบบที่ ${idx + 1} (explosion${idx}.mp3)`)
    soundEffects.playWebFirework(idx)
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
          <h1 className="sound-test-title">ทดสอบเสียงฉลองพลุบนเว็บไซต์</h1>
          <p className="sound-test-desc">
            เสียงสไตล์เว็บไซต์และแอพเพื่อการศึกษา (เช่น Duolingo / Khan Academy) สดใส เป็นมิตร เด็กไม่ตกใจ
          </p>
        </div>

        {/* Primary Action: Default Ending Sequence */}
        <div className="test-primary-box">
          <div className="test-primary-label">เสียงที่ใช้จริงตอนจบเกม (Current Default)</div>
          <button
            type="button"
            className={`notion-btn-primary test-grand-btn ${isPlaying ? 'pulse-active' : ''}`}
            onClick={handlePlayGrandFinale}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>{isPlaying ? 'กำลังเล่นเสียงฉลอง...' : 'กดฟังเสียงฉลองตอนจบเกม (Confetti + Ta-da)'}</span>
          </button>
          <div className="test-hint">
            เสียงพลุกระดาษ Party Popper / Confetti Pop นุ่มนวลร่าเริง + เสียงแตรเฉลิมฉลอง Ta-da ชัยชนะ
          </div>
        </div>

        {/* Individual Web Audio Options */}
        <div className="test-section-heading">เลือกทดสอบเสียงสไตล์ต่างๆ ที่เว็บนิยมใช้</div>
        <div className="test-buttons-grid">
          <button
            type="button"
            className="test-sub-btn"
            onClick={handlePlayConfetti}
          >
            <span className="btn-main-text">Confetti Pop (ยอดนิยม)</span>
            <span className="btn-sub-text">เสียงป๊อปพลุกระดาษปาร์ตี้ สดใส สบายหู</span>
          </button>

          <button
            type="button"
            className="test-sub-btn"
            onClick={handlePlayTada}
          >
            <span className="btn-main-text">Ta-da Fanfare</span>
            <span className="btn-sub-text">เสียงแต๊นแต้นเฉลิมฉลอง ชัยชนะ สนุกสนาน</span>
          </button>

          <button
            type="button"
            className="test-sub-btn"
            onClick={handlePlayVictory}
          >
            <span className="btn-main-text">Victory Fanfare</span>
            <span className="btn-sub-text">เสียงดนตรีฉลองแบบเกม ผ่านด่านสำเร็จ</span>
          </button>

          <button
            type="button"
            className="test-sub-btn"
            onClick={handlePlayWebFireworkShow}
          >
            <span className="btn-main-text">Web Fireworks Show</span>
            <span className="btn-sub-text">ชุดพลุเสียงแตกตัวจาก library fireworks-js</span>
          </button>

          <button
            type="button"
            className="test-sub-btn"
            onClick={() => handlePlaySingleWebBurst(0)}
          >
            <span className="btn-main-text">พลุดอกไม้ไฟเว็บ 1</span>
            <span className="btn-sub-text">เสียงพลุแตกตัวแบบที่ 1 (explosion0.mp3)</span>
          </button>

          <button
            type="button"
            className="test-sub-btn"
            onClick={() => handlePlaySingleWebBurst(1)}
          >
            <span className="btn-main-text">พลุดอกไม้ไฟเว็บ 2</span>
            <span className="btn-sub-text">เสียงพลุแตกตัวแบบที่ 2 (explosion1.mp3)</span>
          </button>
        </div>

        {/* Options & Status */}
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
            เล่นล่าสุด: {lastPlayedName}
          </span>
        </div>

        {/* Safety Note for Kids */}
        <div className="sound-spec-box">
          <div className="spec-title">ความปลอดภัยต่อการได้ยินของเด็ก (Kid-Friendly Audio)</div>
          <ul className="spec-list">
            <li><strong>ไม่ใช้เสียงระเบิดจริง:</strong> ตัดเสียงตูมหรือเสียงระเบิดกระแทกหู เพื่อป้องกันไม่ให้เด็กตกใจหรือตกใจกลัว</li>
            <li><strong>เสียงแบบ Website Celebration:</strong> ใช้เสียงพลุกระดาษ Confetti Pop ผสานเสียง Ta-da คอร์ดสดใสที่เด็กคุ้นเคยในแอพชั้นนำ</li>
            <li><strong>ระดับเสียงนุ่มนวล:</strong> ปรับ Volume Normalization ให้อยู่ในระดับพอเหมาะ ไม่ดังแผดหรือแตกพร่าในหูฟังหรือลำโพงมือถือ</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
