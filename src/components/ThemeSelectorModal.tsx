import React from 'react'
import { type QuizTheme, QUIZ_THEMES } from '../themeTypes'
import { KidMascot } from './KidMascot'
import { ThemeFrameDecorations } from './ThemeFrameDecorations'
import type { MascotConfig } from '../mascotTypes'

interface ThemeSelectorModalProps {
  isOpen: boolean
  currentTheme: QuizTheme
  onSelectTheme: (theme: QuizTheme) => void
  onClose: () => void
  mascotConfig?: MascotConfig
  kidName?: string
}

const THEME_PREVIEWS: Record<QuizTheme, { quote: string }> = {
  classic: {
    quote: 'สบายตา เรียบง่าย สมาธิเต็มร้อย พร้อมลุยทุกโจทย์!',
  },
  halloween: {
    quote: 'กุ๊กกู๋! ฟักทองกับผีน้อยมาส่งพลังใจให้คนเก่งนะ 👻',
  },
  christmas: {
    quote: 'สุขสันต์วันคริสต์มาส! เกล็ดหิมะโปรยปรายแล้วจ้า ❄️',
  },
  space: {
    quote: '3.. 2.. 1.. ทะยานสู่อวกาศ พิชิตโจทย์เลขกันเลย! 🚀',
  },
  candyland: {
    quote: 'หวานเจี๊ยบ! คิดเลขสนุกเหมือนกินขนมหวานเลย 🍭',
  },
}

/**
 * Kid-friendly interactive Theme Selector Modal.
 * Displays preview cards with cheerful icons, colors, and live theme selection with instant preview.
 */
export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  currentTheme,
  onSelectTheme,
  onClose,
  mascotConfig,
  kidName,
}) => {
  if (!isOpen) return null

  const childGreeting = kidName?.trim() ? `น้อง${kidName.trim()}` : 'คนเก่ง'

  return (
    <div className="mascot-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="theme-picker-modal pop-in" onClick={(e) => e.stopPropagation()}>
        {/* Modal Corner Close Button */}
        <button
          type="button"
          className="modal-corner-close-btn"
          onClick={onClose}
          aria-label="ปิดหน้าต่างเลือกธีม"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="2" y1="2" x2="12" y2="12" />
            <line x1="12" y1="2" x2="2" y2="12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="theme-picker-header">
          <div className="theme-header-icon" aria-hidden="true">🎨</div>
          <div>
            <h2 className="theme-picker-title">เลือกธีมและกรอบรูปที่ชอบ</h2>
            <p className="theme-picker-desc">ตกแต่งบรรยากาศรอบๆ ตัวการ์ตูนให้สดใสตามเทศกาล</p>
          </div>
        </div>

        {/* Live Interactive Preview Stage (กรอบแสดงตัวอย่างจริงแบบสดๆ) */}
        <div className="theme-preview-stage-wrapper">
          <div className={`mascot-status-area theme-preview-card theme-${currentTheme}`}>
            <ThemeFrameDecorations theme={currentTheme} />

            <div className="mascot-mini">
              <KidMascot
                mood="happy"
                size={70}
                config={mascotConfig}
              />
            </div>

            <div className="mascot-speech-bubble pop-in" key={currentTheme}>
              <div className="mascot-bubble-text theme-preview-bubble-text">
                {THEME_PREVIEWS[currentTheme]?.quote.replace('คนเก่ง', childGreeting)}
              </div>
            </div>
          </div>
        </div>

        {/* Themes Grid */}
        <div className="themes-selector-grid">
          {QUIZ_THEMES.map((theme) => {
            const isSelected = currentTheme === theme.id
            return (
              <button
                key={theme.id}
                type="button"
                className={`theme-card-option ${isSelected ? 'active' : ''} theme-card-${theme.id}`}
                onClick={() => {
                  onSelectTheme(theme.id)
                }}
              >
                <div className="theme-card-icon-bubble" aria-hidden="true">
                  {theme.icon}
                </div>
                <div className="theme-card-content">
                  <div className="theme-card-top-row">
                    <span className="theme-card-title">{theme.name}</span>
                    {isSelected && <span className="theme-active-tag">กำลังใช้งาน</span>}
                  </div>
                  <span className="theme-card-tagline">{theme.tagline}</span>
                </div>
                <div className="theme-card-indicator" aria-hidden="true">
                  {isSelected ? (
                    <div className="theme-check-circle">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  ) : (
                    <div className="theme-empty-circle" />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Modal Footer */}
        <div className="theme-picker-footer">
          <button
            type="button"
            className="notion-btn-primary theme-confirm-btn pulse-btn"
            onClick={onClose}
          >
            <span>เสร็จสิ้น พร้อมลุยต่อ!</span>
          </button>
        </div>
      </div>
    </div>
  )
}
