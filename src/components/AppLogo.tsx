import React from 'react'

interface AppLogoProps {
  size?: 'normal' | 'large'
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 'normal' }) => {
  return (
    <div className={`app-brand-logo ${size === 'large' ? 'logo-large' : ''}`}>
      <div className="logo-sparkle-container">
        {/* Playful Floating SVG Badges around the title */}
        <span className="logo-floating-badge badge-math-plus" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>

        <span className="logo-floating-badge badge-math-star" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </span>

        <span className="logo-floating-badge badge-math-multiply" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>

        {/* Main Logo Text with 3D Pop Kid-Friendly Styling */}
        <h1 className="logo-title-group">
          <span className="logo-word logo-word-math">MATH</span>
          <span className="logo-word logo-word-quiz">QUIZ</span>
        </h1>
      </div>

      <div className="logo-tagline-pill">
        <span className="tagline-dot" aria-hidden="true" />
        <span>เกมคณิตคิดเร็วแสนสนุกสำหรับเด็กๆ</span>
      </div>
    </div>
  )
}
