import React, { useState } from 'react'
import {
  type MascotConfig,
  type MascotType,
  MASCOT_OPTIONS,
  PRESET_SKIN_COLORS,
  PRESET_SHIRT_COLORS,
  DEFAULT_MASCOT_CONFIG,
} from '../mascotTypes'
import { KidMascot } from './KidMascot'

interface MascotCustomizerModalProps {
  isOpen: boolean
  currentConfig: MascotConfig
  onSave: (config: MascotConfig) => void
  onClose: () => void
}

export const MascotCustomizerModal: React.FC<MascotCustomizerModalProps> = ({
  isOpen,
  currentConfig,
  onSave,
  onClose,
}) => {
  const [config, setConfig] = useState<MascotConfig>(currentConfig)
  const [previewMood, setPreviewMood] = useState<'happy' | 'celebrate' | 'cheer' | 'think'>('happy')
  const [isPoked, setIsPoked] = useState(false)

  // Sync state if opened with updated config
  React.useEffect(() => {
    if (isOpen) {
      setConfig(currentConfig)
      setPreviewMood('happy')
    }
  }, [isOpen, currentConfig])

  if (!isOpen) return null

  const handleSelectType = (type: MascotType) => {
    setConfig((prev) => ({
      ...prev,
      type,
    }))
  }

  const handleSelectSkinColor = (color: string) => {
    setConfig((prev) => ({ ...prev, skinColor: color }))
  }

  const handleSelectShirtColor = (color: string) => {
    setConfig((prev) => ({ ...prev, shirtColor: color }))
  }

  const handleRandomize = () => {
    const randomOption = MASCOT_OPTIONS[Math.floor(Math.random() * MASCOT_OPTIONS.length)]
    const randomSkin = PRESET_SKIN_COLORS[Math.floor(Math.random() * PRESET_SKIN_COLORS.length)].color
    const randomShirt = PRESET_SHIRT_COLORS[Math.floor(Math.random() * PRESET_SHIRT_COLORS.length)].color

    setConfig({
      type: randomOption.id,
      skinColor: randomSkin,
      shirtColor: randomShirt,
    })
    setIsPoked(true)
    setTimeout(() => setIsPoked(false), 500)
  }

  const handleReset = () => {
    setConfig(DEFAULT_MASCOT_CONFIG)
  }

  const handleSave = () => {
    onSave(config)
    onClose()
  }

  const handlePokePreview = () => {
    setIsPoked(true)
    setTimeout(() => setIsPoked(false), 550)
  }

  const activeOption = MASCOT_OPTIONS.find((o) => o.id === config.type) || MASCOT_OPTIONS[0]

  return (
    <div
      className="mascot-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="customizer-title"
    >
      <div className="mascot-modal-card pop-in" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header in Notion Style */}
        <div className="mascot-modal-header">
          <div className="mascot-modal-title-group">
            <span className="notion-tag-pill">ตั้งค่าตัวละคร</span>
            <h2 id="customizer-title" className="mascot-modal-title">
              ห้องแต่งตัวมาสคอต
            </h2>
          </div>
          <button
            type="button"
            className="mascot-modal-close"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
            title="ปิด"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body: Responsive Layout (Desktop: Stage + Controls, Mobile: Stacked) */}
        <div className="mascot-modal-content">
          {/* Live Mascot Stage */}
          <div className="mascot-stage">
            <div className="mascot-stage-bubble">
              <span className="mascot-stage-name">{activeOption.name}</span>
              <p className="mascot-stage-hint">แตะตัวเค้าเพื่อดูท่าทางตอบรับ</p>
            </div>

            <div className="mascot-preview-box" onClick={handlePokePreview} role="button" tabIndex={0} aria-label="แตะตัวมาสคอต">
              <KidMascot
                mood={previewMood}
                size={120}
                config={config}
                isPoked={isPoked}
              />
            </div>

            {/* Test Mood Notion Segmented Control */}
            <div className="mascot-mood-pills">
              <span className="mascot-mood-label">ทดสอบท่าทาง</span>
              <div className="mood-buttons-row" role="group" aria-label="ทดสอบอารมณ์มาสคอต">
                <button
                  type="button"
                  className={`mood-pill-btn ${previewMood === 'happy' ? 'active' : ''}`}
                  onClick={() => setPreviewMood('happy')}
                >
                  ยิ้ม
                </button>
                <button
                  type="button"
                  className={`mood-pill-btn ${previewMood === 'think' ? 'active' : ''}`}
                  onClick={() => setPreviewMood('think')}
                >
                  คิดเลข
                </button>
                <button
                  type="button"
                  className={`mood-pill-btn ${previewMood === 'cheer' ? 'active' : ''}`}
                  onClick={() => setPreviewMood('cheer')}
                >
                  เชียร์
                </button>
                <button
                  type="button"
                  className={`mood-pill-btn ${previewMood === 'celebrate' ? 'active' : ''}`}
                  onClick={() => setPreviewMood('celebrate')}
                >
                  ดีใจ
                </button>
              </div>
            </div>

            {/* Notion Style Randomizer Button */}
            <button
              type="button"
              className="mascot-random-btn"
              onClick={handleRandomize}
              title="สุ่มคู่สีและตัวละคร"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
              </svg>
              <span>สุ่มสีและตัวละคร</span>
            </button>
          </div>

          {/* Controls Column */}
          <div className="mascot-controls-area">
            {/* Step 1: Select Character */}
            <section className="custom-section">
              <div className="custom-section-header">
                <span className="section-step-num">1</span>
                <div>
                  <h3 className="custom-section-title">เลือกตัวละคร</h3>
                  <p className="custom-section-desc">เลือกเพื่อนคู่ใจที่ต้องการ</p>
                </div>
              </div>

              <div className="mascot-grid">
                {MASCOT_OPTIONS.map((opt) => {
                  const isSelected = config.type === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`mascot-card-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => handleSelectType(opt.id)}
                      aria-pressed={isSelected}
                    >
                      <div className="mascot-card-mini-preview">
                        <KidMascot
                          size={46}
                          mood="happy"
                          config={{
                            type: opt.id,
                            skinColor: isSelected ? config.skinColor : opt.defaultSkin,
                            shirtColor: isSelected ? config.shirtColor : opt.defaultShirt,
                          }}
                          showShadow={false}
                        />
                      </div>
                      <div className="mascot-card-text">
                        <span className="card-name">{opt.name}</span>
                        <span className="card-tag">{opt.tag}</span>
                      </div>
                      {isSelected && (
                        <span className="card-check" aria-hidden="true">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Step 2: Skin / Fur Color */}
            <section className="custom-section">
              <div className="custom-section-header">
                <span className="section-step-num">2</span>
                <div>
                  <h3 className="custom-section-title">
                    {config.type === 'cat' || config.type === 'bear' || config.type === 'bunny'
                      ? 'สีขนและสีตัว'
                      : config.type === 'robot'
                      ? 'สีบอดี้หุ่นยนต์'
                      : 'สีผิว'}
                  </h3>
                  <p className="custom-section-desc">แตะเลือกสีที่ชอบ</p>
                </div>
              </div>

              <div className="color-swatches-grid">
                {PRESET_SKIN_COLORS.map((item) => {
                  const isSelected = config.skinColor.toLowerCase() === item.color.toLowerCase()
                  return (
                    <button
                      key={item.color}
                      type="button"
                      className={`color-swatch-circle ${isSelected ? 'active' : ''}`}
                      style={{ backgroundColor: item.color }}
                      onClick={() => handleSelectSkinColor(item.color)}
                      title={item.name}
                      aria-label={item.name}
                    >
                      {isSelected && (
                        <span className="swatch-check" aria-hidden="true">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Step 3: Shirt / Hoodie Color */}
            <section className="custom-section">
              <div className="custom-section-header">
                <span className="section-step-num">3</span>
                <div>
                  <h3 className="custom-section-title">สีเสื้อและชุด</h3>
                  <p className="custom-section-desc">แตะเลือกสีเสื้อตัวโปรด</p>
                </div>
              </div>

              <div className="color-swatches-grid">
                {PRESET_SHIRT_COLORS.map((item) => {
                  const isSelected = config.shirtColor.toLowerCase() === item.color.toLowerCase()
                  return (
                    <button
                      key={item.color}
                      type="button"
                      className={`color-swatch-circle ${isSelected ? 'active' : ''}`}
                      style={{ backgroundColor: item.color }}
                      onClick={() => handleSelectShirtColor(item.color)}
                      title={item.name}
                      aria-label={item.name}
                    >
                      {isSelected && (
                        <span className="swatch-check" aria-hidden="true">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </section>
          </div>
        </div>

        {/* Modal Footer in Notion Style */}
        <div className="mascot-modal-footer">
          <button
            type="button"
            className="mascot-btn-secondary"
            onClick={handleReset}
            title="กลับไปใช้ค่าเริ่มต้น"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>รีเซ็ตค่าเริ่มต้น</span>
          </button>
          <button
            type="button"
            className="mascot-btn-primary"
            onClick={handleSave}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>บันทึกตัวละคร</span>
          </button>
        </div>
      </div>
    </div>
  )
}
