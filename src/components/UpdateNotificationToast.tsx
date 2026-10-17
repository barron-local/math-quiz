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
    <aside className="update-toast-container pop-in" role="alert" aria-live="polite">
      <div className="notion-update-pill">
        <div className="update-pill-lead">
          <span className="update-pill-icon-wrap" aria-hidden="true">
            <svg
              className={`update-pill-icon ${isUpdating ? 'pill-spin' : ''}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
          </span>

          <span className="update-pill-text">
            <span className="update-pill-title">มีอัปเดตใหม่</span>
            {isInQuiz && (
              <span className="update-pill-hint"> (ทำต่อข้อเดิมได้เลย)</span>
            )}
          </span>
        </div>

        <div className="update-pill-btns">
          <button
            type="button"
            className="notion-btn-primary update-action-btn"
            onClick={onUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? 'กำลังโหลด...' : 'อัปเดตทันที'}
          </button>

          <button
            type="button"
            className="update-close-btn"
            onClick={onDismiss}
            aria-label="ปิดการแจ้งเตือน"
            title="ไว้ทีหลัง"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="2" y1="2" x2="12" y2="12" />
              <line x1="12" y1="2" x2="2" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
