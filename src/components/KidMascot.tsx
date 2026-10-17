import React from 'react'

interface CharacterProps {
  mood?: 'happy' | 'celebrate' | 'cheer' | 'think'
  size?: number
}

export const KidMascot: React.FC<CharacterProps> = ({ mood = 'happy', size = 110 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`mascot-svg mood-${mood}`}
      aria-hidden="true"
    >
      {/* Soft warm shadow */}
      <ellipse cx="60" cy="112" rx="34" ry="6" fill="rgba(0,0,0,0.06)" />

      {/* Body / Hoodie */}
      <path
        d="M38 88C38 74 46 66 60 66C74 66 82 74 82 88L84 106C84 108 82 110 80 110H40C38 110 36 108 36 106L38 88Z"
        fill="#2383E2"
      />
      {/* Hoodie Collar/Details */}
      <path d="M52 68L60 78L68 68" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Raised Arm on celebrate/cheer */}
      {mood === 'celebrate' && (
        <>
          <path d="M38 78C30 70 24 56 22 48" stroke="#2383E2" strokeWidth="9" strokeLinecap="round" />
          <circle cx="22" cy="46" r="6" fill="#FFDCB2" />
          <path d="M82 78C90 70 96 56 98 48" stroke="#2383E2" strokeWidth="9" strokeLinecap="round" />
          <circle cx="98" cy="46" r="6" fill="#FFDCB2" />
        </>
      )}

      {/* Cheering Arm on cheer */}
      {mood === 'cheer' && (
        <>
          <path d="M82 80C92 74 96 64 96 56" stroke="#2383E2" strokeWidth="8" strokeLinecap="round" />
          <circle cx="96" cy="54" r="6" fill="#FFDCB2" />
        </>
      )}

      {/* Head */}
      <circle cx="60" cy="44" r="28" fill="#FFDCB2" />

      {/* Hair (clean Notion-style) */}
      <path
        d="M32 40C32 24 44 16 60 16C76 16 88 24 88 40C88 42 86 43 85 40C83 34 76 28 68 28C63 28 58 31 56 34C52 30 44 30 38 34C35 36 33 40 32 40Z"
        fill="#37352F"
      />

      {/* Eyes & Eyebrows */}
      {mood === 'celebrate' || mood === 'cheer' ? (
        // Happy curved eyes ^^
        <>
          <path d="M48 42C50 38 54 38 56 42" stroke="#37352F" strokeWidth="3" strokeLinecap="round" />
          <path d="M64 42C66 38 70 38 72 42" stroke="#37352F" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : mood === 'think' ? (
        // Thinking eyes
        <>
          <circle cx="51" cy="42" r="3.5" fill="#37352F" />
          <circle cx="69" cy="42" r="3.5" fill="#37352F" />
          <path d="M47 36L55 38" stroke="#37352F" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M65 36L73 35" stroke="#37352F" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        // Normal happy dots
        <>
          <circle cx="51" cy="42" r="3.5" fill="#37352F" />
          <circle cx="69" cy="42" r="3.5" fill="#37352F" />
          <path d="M47 36C50 34 54 35 55 36" stroke="#37352F" strokeWidth="2" strokeLinecap="round" />
          <path d="M65 36C66 35 70 34 73 36" stroke="#37352F" strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {/* Cheerful Blushing Cheeks */}
      <circle cx="43" cy="48" r="4.5" fill="#FFAAA6" opacity="0.8" />
      <circle cx="77" cy="48" r="4.5" fill="#FFAAA6" opacity="0.8" />

      {/* Mouth */}
      {mood === 'celebrate' || mood === 'cheer' ? (
        // Big open smile
        <path
          d="M52 49C52 56 68 56 68 49Z"
          fill="#E03E3E"
          stroke="#37352F"
          strokeWidth="2"
        />
      ) : (
        // Gentle warm smile
        <path
          d="M53 50C56 55 64 55 67 50"
          stroke="#37352F"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}
