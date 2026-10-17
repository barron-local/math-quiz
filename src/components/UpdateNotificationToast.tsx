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
    <div className="update-toast-container pop-in" role="alert" aria-live="polite">
      <div className="update-toast-card">
        <div className="update-toast-icon-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
        </div>

        <div className="update-toast-content">
          <div className="update-toast-title">
            มีการอัปเดตเวอร์ชันใหม่
          </div>
          <div className="update-toast-subtext">
            {isInQuiz
              ? 'กดเพื่ออัปเดตทันที (ระบบจะจำข้อปัจจุบันไว้ให้ ทำต่อได้เลยไม่ต้องเริ่มใหม่)'
              : 'มีฟีเจอร์และการปรับปรุงใหม่พร้อมใช้งานแล้ว'}
          </div>
        </div>

        <div className="update-toast-actions">
          <button
            type="button"
            className="notion-btn-primary update-btn"
            onClick={onUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? 'กำลังโหลด...' : 'อัปเดตเลย'}
          </button>

          <button
            type="button"
            className="update-dismiss-btn"
            onClick={onDismiss}
            title="ไว้ทีหลัง"
            disabled={isUpdating}
          >
            ไว้ก่อน
          </button>
        </div>
      </div>
    </div>
  )
}
