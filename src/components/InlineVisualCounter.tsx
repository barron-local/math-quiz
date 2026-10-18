import React, { useState } from 'react'

interface InlineVisualCounterProps {
  num1: number
  operator: '+' | '-'
  num2: number
  num3?: number
  onClose?: () => void
}

export const InlineVisualCounter: React.FC<InlineVisualCounterProps> = ({
  num1,
  operator,
  num2,
  num3,
  onClose,
}) => {
  // Set of tapped item keys, e.g. "g1-0", "g2-1"
  const [tappedKeys, setTappedKeys] = useState<Set<string>>(new Set())

  const handleTap = (key: string) => {
    setTappedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
        // Soft, friendly audio pop using Web Audio API
        try {
          if (typeof window !== 'undefined') {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
            if (AudioCtx) {
              const ctx = new AudioCtx()
              const osc = ctx.createOscillator()
              const gain = ctx.createGain()
              const now = ctx.currentTime
              osc.type = 'sine'
              osc.frequency.setValueAtTime(560, now)
              osc.frequency.exponentialRampToValueAtTime(820, now + 0.08)
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

  const renderItemRow = (count: number, prefix: string, isSubGroup = false) => {
    return (
      <div className={`inline-counter-group ${isSubGroup ? 'is-sub-group' : ''}`}>
        <div className="inline-counter-items">
          {Array.from({ length: count }).map((_, idx) => {
            const key = `${prefix}-${idx}`
            const isTapped = tappedKeys.has(key)
            return (
              <button
                key={key}
                type="button"
                className={`inline-counter-apple-btn pop-in ${isTapped ? 'is-tapped' : ''}`}
                onClick={() => handleTap(key)}
                title={`ชิ้นที่ ${idx + 1} (แตะเพื่อนับ)`}
                aria-label={`นับชิ้นที่ ${idx + 1}`}
              >
                <span className="apple-emoji" aria-hidden="true">🍎</span>
                <span className="apple-badge">{idx + 1}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const isSub = operator === '-'
  const totalTapped = tappedKeys.size

  return (
    <div className="inline-visual-counter pop-in" role="region" aria-label="แผงนิ้วช่วยนับ">
      <div className="inline-counter-header">
        <div className="inline-counter-title-wrap">
          <span className="inline-counter-title">นิ้วช่วยนับ (แตะลูกแอปเปิลเพื่อนับได้เลย)</span>
        </div>
        <div className="inline-counter-actions">
          {totalTapped > 0 && (
            <button
              type="button"
              className="inline-counter-reset-btn"
              onClick={() => setTappedKeys(new Set())}
              title="ล้างรอยนับทั้งหมด"
            >
              รีเซ็ต
            </button>
          )}
          {onClose && (
            <button
              type="button"
              className="inline-counter-close-btn"
              onClick={onClose}
              title="ซ่อนนิ้วช่วยนับ"
              aria-label="ซ่อนนิ้วช่วยนับ"
            >
              ✕ ซ่อน
            </button>
          )}
        </div>
      </div>

      <div className="inline-counter-body">
        {/* Group 1 */}
        <div className="inline-counter-section">
          <span className="inline-section-label">มี {num1} ลูก</span>
          {renderItemRow(num1, 'g1')}
        </div>

        {/* Operator Divider */}
        <div className="inline-counter-op" aria-hidden="true">
          <span>{operator}</span>
        </div>

        {/* Group 2 */}
        <div className="inline-counter-section">
          <span className="inline-section-label">
            {isSub ? `หักออก ${num2} ลูก` : `เพิ่มอีก ${num2} ลูก`}
          </span>
          {renderItemRow(num2, 'g2', isSub)}
        </div>

        {/* Group 3 if 3-number addition */}
        {typeof num3 === 'number' && (
          <>
            <div className="inline-counter-op" aria-hidden="true">
              <span>+</span>
            </div>
            <div className="inline-counter-section">
              <span className="inline-section-label">เพิ่มอีก {num3} ลูก</span>
              {renderItemRow(num3, 'g3')}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
