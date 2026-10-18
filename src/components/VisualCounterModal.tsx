import React, { useState } from 'react'

export type CounterIconType = 'apple' | 'star' | 'candy'

interface VisualCounterModalProps {
  isOpen: boolean
  onClose: () => void
  num1: number
  operator: '+' | '-'
  num2: number
  num3?: number
  correctAnswer: number
}

const ICONS_CONFIG: Record<CounterIconType, { emoji: string; label: string; bg: string }> = {
  apple: { emoji: '🍎', label: 'แอปเปิล', bg: 'rgba(224, 49, 49, 0.12)' },
  star: { emoji: '⭐', label: 'ดวงดาว', bg: 'rgba(245, 159, 0, 0.14)' },
  candy: { emoji: '🍬', label: 'ลูกกวาด', bg: 'rgba(240, 101, 149, 0.14)' },
}

export const VisualCounterModal: React.FC<VisualCounterModalProps> = ({
  isOpen,
  onClose,
  num1,
  operator,
  num2,
  num3,
  correctAnswer,
}) => {
  const [selectedIcon, setSelectedIcon] = useState<CounterIconType>('apple')
  const [tappedItems, setTappedItems] = useState<Set<string>>(new Set())

  if (!isOpen) return null

  const handleToggleItem = (key: string) => {
    setTappedItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
        // Play soft tap sound effect using Web Audio API
        try {
          if (typeof window !== 'undefined') {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
            if (AudioCtx) {
              const ctx = new AudioCtx()
              const osc = ctx.createOscillator()
              const gain = ctx.createGain()
              const now = ctx.currentTime
              osc.type = 'sine'
              osc.frequency.setValueAtTime(540, now)
              osc.frequency.exponentialRampToValueAtTime(780, now + 0.08)
              gain.gain.setValueAtTime(0.18, now)
              gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
              osc.connect(gain)
              gain.connect(ctx.destination)
              osc.start(now)
              osc.stop(now + 0.12)
            }
          }
        } catch {}
      }
      return next
    })
  }

  const currentIcon = ICONS_CONFIG[selectedIcon].emoji

  // Renders a group of interactive counters
  const renderItemCluster = (count: number, prefix: string, colorLabel: string, bgTint: string) => {
    return (
      <div className="counter-cluster-box" style={{ backgroundColor: bgTint }}>
        <div className="counter-cluster-header">
          <span className="counter-cluster-badge">{colorLabel}</span>
          <span className="counter-cluster-count">{count} ชิ้น</span>
        </div>
        <div className="counter-items-grid">
          {Array.from({ length: count }).map((_, idx) => {
            const key = `${prefix}-${idx}`
            const isTapped = tappedItems.has(key)
            return (
              <button
                key={key}
                type="button"
                className={`counter-item-btn pop-in ${isTapped ? 'counter-item-tapped' : ''}`}
                onClick={() => handleToggleItem(key)}
                title={`ชิ้นที่ ${idx + 1} (กดเพื่อนับ)`}
                aria-label={`นับชิ้นที่ ${idx + 1}`}
              >
                <span className="counter-item-emoji" aria-hidden="true">{currentIcon}</span>
                <span className="counter-item-num">{idx + 1}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const isSub = operator === '-'

  return (
    <div className="mascot-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="visual-counter-modal pop-in" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="modal-corner-close-btn"
          onClick={onClose}
          aria-label="ปิดหน้านิ้วช่วยนับ"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="2" y1="2" x2="12" y2="12" />
            <line x1="12" y1="2" x2="2" y2="12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="visual-counter-header">
          <div className="visual-counter-header-icon" aria-hidden="true">🧮</div>
          <div>
            <h2 className="visual-counter-title">ลูกคิดวิเศษ &amp; นิ้วช่วยนับ</h2>
            <p className="visual-counter-desc">แตะที่รูปภาพเพื่อนับทีละชิ้นตามใจชอบได้เลย!</p>
          </div>
        </div>

        {/* Icon Type Switcher Pills */}
        <div className="counter-icon-switcher">
          {(['apple', 'star', 'candy'] as CounterIconType[]).map((type) => (
            <button
              key={type}
              type="button"
              className={`counter-icon-pill ${selectedIcon === type ? 'active' : ''}`}
              onClick={() => setSelectedIcon(type)}
            >
              <span aria-hidden="true">{ICONS_CONFIG[type].emoji}</span>
              <span>{ICONS_CONFIG[type].label}</span>
            </button>
          ))}
        </div>

        {/* Counter Stage */}
        <div className="visual-counter-stage">
          {/* Group 1 */}
          <div className="counter-group-wrapper">
            <span className="counter-op-title">จำนวนแรก ({num1})</span>
            {renderItemCluster(num1, 'g1', 'กลุ่มที่ 1', 'rgba(35, 131, 226, 0.06)')}
          </div>

          {/* Operator sign */}
          <div className="counter-operator-divider" aria-hidden="true">
            <span className="counter-op-symbol">{operator}</span>
          </div>

          {/* Group 2 */}
          <div className="counter-group-wrapper">
            <span className="counter-op-title">
              {isSub ? `หักออก (${num2})` : `จำนวนที่สอง (${num2})`}
            </span>
            {renderItemCluster(
              num2,
              'g2',
              isSub ? 'หักออก' : 'กลุ่มที่ 2',
              isSub ? 'rgba(224, 49, 49, 0.08)' : 'rgba(43, 138, 62, 0.06)'
            )}
          </div>

          {/* Optional Group 3 for 3-number addition */}
          {typeof num3 === 'number' && (
            <>
              <div className="counter-operator-divider" aria-hidden="true">
                <span className="counter-op-symbol">+</span>
              </div>
              <div className="counter-group-wrapper">
                <span className="counter-op-title">จำนวนที่สาม ({num3})</span>
                {renderItemCluster(num3, 'g3', 'กลุ่มที่ 3', 'rgba(151, 117, 250, 0.08)')}
              </div>
            </>
          )}
        </div>

        {/* Live Counting Summary Bar */}
        <div className="counter-status-bar">
          <div className="counter-tapped-info">
            <span className="counter-info-text">
              หนูนับไปแล้ว: <strong>{tappedItems.size}</strong> ชิ้น
            </span>
            {tappedItems.size > 0 && (
              <button
                type="button"
                className="counter-reset-tap-btn"
                onClick={() => setTappedItems(new Set())}
              >
                ล้างรอยนับ
              </button>
            )}
          </div>

          <div className="counter-helper-hint">
            {isSub ? (
              <span>💡 คำตอบคือจำนวนที่เหลือหลังจากหักออกนะ!</span>
            ) : (
              <span>💡 รวมทั้งหมดได้ {correctAnswer} ชิ้นพอดีเลย!</span>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="visual-counter-footer">
          <button
            type="button"
            className="notion-btn-primary visual-counter-done-btn pulse-btn"
            onClick={onClose}
          >
            <span>เข้าใจแล้ว พร้อมตอบเลย! ✨</span>
          </button>
        </div>
      </div>
    </div>
  )
}
