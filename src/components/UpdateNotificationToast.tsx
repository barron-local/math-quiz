interface UpdateNotificationToastProps {
  onUpdate: () => void
  onDismiss: () => void
  isUpdating: boolean
  isInQuiz: boolean
}

export function UpdateNotificationToast({
  onUpdate,
  onDismiss,
  isUpdating,
  isInQuiz,
}: UpdateNotificationToastProps) {
  return (
    <aside className="update-toast-container toast-spring-in" role="alert" aria-live="polite">
      <div className="notion-update-card">
        {/* Ambient Top Glow Line */}
        <div className="update-card-glow-bar" aria-hidden="true" />

        <div className="update-card-main">
          {/* Animated Mascot / Badge Icon */}
          <div className="update-icon-badge" aria-hidden="true">
            <div className="update-icon-halo" />
            <svg
              className={`update-icon-svg ${isUpdating ? 'pill-spin' : ''}`}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
          </div>

          {/* Text Content */}
          <div className="update-text-block">
            <div className="update-header-line">
              <span className="update-chip-badge">อัปเดตใหม่</span>
              <strong className="update-title-text">มีเวอร์ชันใหม่พร้อมใช้งาน</strong>
            </div>

            <div className="update-sub-desc">
              {isInQuiz ? (
                <span className="quiz-safe-pill">
                  <span className="green-pulse-dot" aria-hidden="true" />
                  <span>บันทึกข้อสอบไว้แล้ว อัปเดตแล้วทำต่อข้อเดิมได้ทันที</span>
                </span>
              ) : (
                <span className="general-desc">
                  ปรับปรุงระบบและเพิ่มความเสถียรในการใช้งาน
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="update-card-actions">
            <button
              type="button"
              className={`notion-btn-primary update-primary-btn ${isUpdating ? 'btn-loading' : ''}`}
              onClick={onUpdate}
              disabled={isUpdating}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{isUpdating ? 'กำลังอัปเดต...' : 'อัปเดตทันที'}</span>
            </button>

            <button
              type="button"
              className="update-dismiss-icon-btn"
              onClick={onDismiss}
              aria-label="ปิดการแจ้งเตือน"
              title="ไว้ทีหลัง"
              disabled={isUpdating}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="2" y1="2" x2="12" y2="12" />
                <line x1="12" y1="2" x2="2" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
