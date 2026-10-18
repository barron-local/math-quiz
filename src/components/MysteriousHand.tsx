import React from 'react'

export type HandStyle = 'cartoon-glove' | 'monster-paw' | 'robot-claw'

interface MysteriousHandProps {
  side?: 'left' | 'right'
  style?: HandStyle
}

/**
 * Cartoon Mysterious Hand that grabs the incorrect math choice card and pulls it away
 */
export const MysteriousHand: React.FC<MysteriousHandProps> = ({
  side = 'right',
  style = 'cartoon-glove',
}) => {
  const isLeft = side === 'left'

  return (
    <div
      className={`mysterious-hand-wrapper hand-${side} hand-style-${style}`}
      aria-hidden="true"
    >
      {/* Cartoon Speed Dust / Motion Swoosh Lines */}
      <svg
        className="hand-speed-lines"
        viewBox="0 0 100 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={isLeft ? "M80 15 C50 12, 30 18, 5 20" : "M20 15 C50 12, 70 18, 95 20"}
          stroke="#2383E2"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="8 6"
          opacity="0.85"
        />
        <path
          d={isLeft ? "M85 32 C60 30, 40 35, 10 38" : "M15 32 C40 30, 60 35, 90 38"}
          stroke="#E03E3E"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="6 5"
          opacity="0.75"
        />
        <path
          d={isLeft ? "M75 48 C50 46, 35 52, 15 54" : "M25 48 C50 46, 65 52, 85 54"}
          stroke="#F39C12"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="5 4"
          opacity="0.7"
        />
      </svg>

      {/* Hand SVG illustration */}
      {style === 'cartoon-glove' && (
        <svg
          className="mysterious-hand-svg"
          viewBox="0 0 160 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: isLeft ? 'scaleX(-1)' : 'none' }}
        >
          {/* Extended Stretchy Arm / Sleeve */}
          <path
            d="M85 52 C115 50, 140 52, 170 54 L170 82 C140 80, 115 82, 85 80 Z"
            fill="#2383E2"
            stroke="#1D2125"
            strokeWidth="3.5"
          />
          {/* Arm stripe accent */}
          <path
            d="M120 52 L120 81"
            stroke="#ffffff"
            strokeWidth="3"
            strokeDasharray="3 3"
          />

          {/* Glove Cuff */}
          <rect
            x="76"
            y="44"
            width="18"
            height="44"
            rx="9"
            fill="#F4F5F7"
            stroke="#1D2125"
            strokeWidth="3.5"
          />

          {/* Glove Palm Base */}
          <path
            d="M36 50 C44 42, 64 42, 78 48 C82 56, 82 72, 78 80 C64 86, 44 86, 36 78 C30 70, 30 58, 36 50 Z"
            fill="#FFFFFF"
            stroke="#1D2125"
            strokeWidth="3.5"
          />

          {/* 3 Glove Back Stitch Lines (Classic Cartoon Glove style) */}
          <line x1="58" y1="54" x2="68" y2="58" stroke="#1D2125" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="56" y1="64" x2="69" y2="64" stroke="#1D2125" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="58" y1="74" x2="68" y2="70" stroke="#1D2125" strokeWidth="2.5" strokeLinecap="round" />

          {/* Top Thumb Clamping down onto card edge */}
          <path
            d="M50 44 C42 34, 30 36, 26 44 C22 52, 32 58, 42 54 Z"
            fill="#FFFFFF"
            stroke="#1D2125"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Index Finger gripping card */}
          <path
            d="M38 52 C26 48, 12 52, 8 60 C4 68, 16 72, 28 68 C34 66, 38 62, 38 52 Z"
            fill="#FFFFFF"
            stroke="#1D2125"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Middle Finger gripping card firmly */}
          <path
            d="M36 64 C22 62, 10 68, 8 76 C6 84, 18 86, 28 82 C34 79, 38 74, 36 64 Z"
            fill="#FFFFFF"
            stroke="#1D2125"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Ring / Pinky Finger curled below */}
          <path
            d="M38 76 C26 76, 16 82, 16 88 C16 94, 26 95, 36 90 C42 86, 44 80, 38 76 Z"
            fill="#FFFFFF"
            stroke="#1D2125"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Cartoon Sweat / Action Drop for comical intensity */}
          <path
            d="M62 30 C62 30, 68 36, 68 40 C68 43, 65 46, 62 46 C59 46, 56 43, 56 40 C56 36, 62 30, 62 30 Z"
            fill="#339AF0"
            opacity="0.9"
          />
        </svg>
      )}

      {/* Alternative Style: Cute Fluffy Monster Paw */}
      {style === 'monster-paw' && (
        <svg
          className="mysterious-hand-svg"
          viewBox="0 0 160 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: isLeft ? 'scaleX(-1)' : 'none' }}
        >
          {/* Furry Monster Arm */}
          <path
            d="M75 50 C110 46, 135 48, 170 50 L170 86 C135 84, 110 88, 75 84 Z"
            fill="#845EF7"
            stroke="#1D2125"
            strokeWidth="3.5"
          />
          {/* Fur tufts */}
          <path
            d="M100 48 L95 42 L105 47 L102 39 L112 47"
            stroke="#1D2125"
            strokeWidth="2.5"
            fill="#845EF7"
          />

          {/* Monster Paw Main Pad */}
          <ellipse
            cx="58"
            cy="66"
            rx="26"
            ry="22"
            fill="#9775FA"
            stroke="#1D2125"
            strokeWidth="3.5"
          />

          {/* Cute Pink Claws / Toe Pads */}
          <circle cx="28" cy="46" r="10" fill="#FF8787" stroke="#1D2125" strokeWidth="3" />
          <circle cx="22" cy="66" r="10" fill="#FF8787" stroke="#1D2125" strokeWidth="3" />
          <circle cx="28" cy="86" r="10" fill="#FF8787" stroke="#1D2125" strokeWidth="3" />
          <circle cx="48" cy="40" r="9" fill="#FF8787" stroke="#1D2125" strokeWidth="3" />
        </svg>
      )}

      {/* Alternative Style: Toy Robot Claw */}
      {style === 'robot-claw' && (
        <svg
          className="mysterious-hand-svg"
          viewBox="0 0 160 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: isLeft ? 'scaleX(-1)' : 'none' }}
        >
          {/* Mechanical Arm with Joint */}
          <rect x="90" y="56" width="75" height="18" rx="4" fill="#CED4DA" stroke="#1D2125" strokeWidth="3" />
          <circle cx="85" cy="65" r="14" fill="#495057" stroke="#1D2125" strokeWidth="3" />
          <circle cx="85" cy="65" r="5" fill="#FAB005" />

          {/* Upper Pincer Claw */}
          <path
            d="M80 54 C65 42, 40 40, 22 50 C18 52, 24 58, 32 56 C44 54, 60 58, 72 65 Z"
            fill="#FFD43B"
            stroke="#1D2125"
            strokeWidth="3.5"
          />
          {/* Lower Pincer Claw */}
          <path
            d="M80 76 C65 88, 40 90, 22 80 C18 78, 24 72, 32 74 C44 76, 60 72, 72 65 Z"
            fill="#FFD43B"
            stroke="#1D2125"
            strokeWidth="3.5"
          />
        </svg>
      )}
    </div>
  )
}
