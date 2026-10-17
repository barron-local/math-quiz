import React from 'react'

interface CharacterProps {
  mood?: 'happy' | 'celebrate' | 'cheer' | 'think'
  size?: number
  onClick?: () => void
  isPoked?: boolean
}

export const KidMascot: React.FC<CharacterProps> = ({
  mood = 'happy',
  size = 110,
  onClick,
  isPoked = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`mascot-svg mood-${mood} ${isPoked ? 'mascot-poked-bounce' : ''} ${onClick ? 'mascot-clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? 'กดเพื่อทักทายตัวการ์ตูน' : undefined}
    >
      <defs>
        {/* Sparkle star for celebrations */}
        <g id="sparkle-star">
          <path d="M0 -6 C0.5 -1.5 1.5 -0.5 6 0 C1.5 0.5 0.5 1.5 0 6 C-0.5 1.5 -1.5 0.5 -6 0 C-1.5 -0.5 -0.5 -1.5 0 -6 Z" fill="#E9B949" />
        </g>
      </defs>

      {/* Dynamic Floor Shadow */}
      <ellipse className="mascot-shadow" cx="60" cy="112" rx="34" ry="6" fill="rgba(0,0,0,0.08)" />

      {/* Celebration floating sparkles around */}
      {mood === 'celebrate' && (
        <g className="sparkles-group">
          <use href="#sparkle-star" x="18" y="32" className="sparkle-1" />
          <use href="#sparkle-star" x="100" y="28" className="sparkle-2" />
          <use href="#sparkle-star" x="22" y="76" className="sparkle-3" />
          <use href="#sparkle-star" x="98" y="74" className="sparkle-4" />
        </g>
      )}

      {/* Main Body Character Group for Bobbing / Waving */}
      <g className="mascot-character-body">
        {/* Body / Hoodie */}
        <path
          d="M38 88C38 74 46 66 60 66C74 66 82 74 82 88L84 106C84 108 82 110 80 110H40C38 110 36 108 36 106L38 88Z"
          fill="#2383E2"
        />
        {/* Hoodie Collar Strings */}
        <path d="M52 68L60 78L68 68" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Arms */}
        {mood === 'celebrate' ? (
          // Two raised celebratory waving arms
          <g className="celebrate-arms">
            <g className="arm-left-celebrate">
              <path d="M38 76C30 68 24 52 20 42" stroke="#2383E2" strokeWidth="9" strokeLinecap="round" />
              <circle cx="20" cy="40" r="6" fill="#FFDCB2" />
            </g>
            <g className="arm-right-celebrate">
              <path d="M82 76C90 68 96 52 100 42" stroke="#2383E2" strokeWidth="9" strokeLinecap="round" />
              <circle cx="100" cy="40" r="6" fill="#FFDCB2" />
            </g>
          </g>
        ) : mood === 'cheer' ? (
          // Cheering waving arm
          <g className="cheer-arm-waving">
            <path d="M82 80C92 74 96 62 98 52" stroke="#2383E2" strokeWidth="9" strokeLinecap="round" />
            <circle cx="98" cy="50" r="6" fill="#FFDCB2" />
            <path d="M38 82C34 88 32 94 34 100" stroke="#2383E2" strokeWidth="8" strokeLinecap="round" />
          </g>
        ) : mood === 'think' ? (
          // Thinking pose arm under chin
          <g className="think-arm">
            <path d="M80 82C84 76 80 66 68 60" stroke="#2383E2" strokeWidth="8" strokeLinecap="round" />
            <circle cx="68" cy="60" r="6" fill="#FFDCB2" />
            <path d="M38 82C34 88 32 94 34 100" stroke="#2383E2" strokeWidth="8" strokeLinecap="round" />
          </g>
        ) : (
          // Gentle idle hands
          <g className="idle-arms">
            <path d="M38 82C33 88 32 94 34 100" stroke="#2383E2" strokeWidth="8" strokeLinecap="round" />
            <path d="M82 82C87 88 88 94 86 100" stroke="#2383E2" strokeWidth="8" strokeLinecap="round" />
          </g>
        )}

        {/* Head Group */}
        <g className="mascot-head-group">
          {/* Head Base */}
          <circle cx="60" cy="44" r="28" fill="#FFDCB2" />

          {/* Hair */}
          <path
            d="M32 40C32 24 44 16 60 16C76 16 88 24 88 40C88 42 86 43 85 40C83 34 76 28 68 28C63 28 58 31 56 34C52 30 44 30 38 34C35 36 33 40 32 40Z"
            fill="#37352F"
          />

          {/* Eyes & Eyebrows with blinking/animating */}
          {mood === 'celebrate' || mood === 'cheer' ? (
            // Curved joyful squint eyes
            <g className="joyful-eyes">
              <path d="M48 42C50 37 54 37 56 42" stroke="#37352F" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M64 42C66 37 70 37 72 42" stroke="#37352F" strokeWidth="3.2" strokeLinecap="round" />
            </g>
          ) : mood === 'think' ? (
            // Looking up/thinking eyes
            <g className="think-eyes">
              <circle cx="51" cy="40" r="3.5" fill="#37352F" />
              <circle cx="69" cy="40" r="3.5" fill="#37352F" />
              <path d="M47 34L55 37" stroke="#37352F" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M65 37L73 34" stroke="#37352F" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ) : (
            // Cute blinking eyes
            <g className="blinking-eyes">
              <circle className="eye-pupil eye-left" cx="51" cy="42" r="3.5" fill="#37352F" />
              <circle className="eye-pupil eye-right" cx="69" cy="42" r="3.5" fill="#37352F" />
              <path d="M47 36C50 34 54 35 55 36" stroke="#37352F" strokeWidth="2" strokeLinecap="round" />
              <path d="M65 36C66 35 70 34 73 36" stroke="#37352F" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {/* Cheerful Blushing Cheeks */}
          <circle cx="43" cy="48" r="4.5" fill="#FFAAA6" opacity="0.8" className="blush-cheek" />
          <circle cx="77" cy="48" r="4.5" fill="#FFAAA6" opacity="0.8" className="blush-cheek" />

          {/* Mouth */}
          {mood === 'celebrate' || mood === 'cheer' ? (
            <path
              className="joyful-mouth"
              d="M52 48C52 57 68 57 68 48Z"
              fill="#E03E3E"
              stroke="#37352F"
              strokeWidth="2"
            />
          ) : mood === 'think' ? (
            <circle cx="62" cy="51" r="2.5" fill="#37352F" />
          ) : (
            <path
              d="M53 50C56 55 64 55 67 50"
              stroke="#37352F"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
        </g>
      </g>
    </svg>
  )
}
