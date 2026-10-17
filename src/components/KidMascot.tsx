import React from 'react'
import { type MascotConfig, DEFAULT_MASCOT_CONFIG } from '../mascotTypes'

interface CharacterProps {
  mood?: 'happy' | 'celebrate' | 'cheer' | 'think'
  size?: number
  onClick?: () => void
  isPoked?: boolean
  config?: MascotConfig
  showShadow?: boolean
}

export const KidMascot: React.FC<CharacterProps> = ({
  mood = 'happy',
  size = 110,
  onClick,
  isPoked = false,
  config = DEFAULT_MASCOT_CONFIG,
  showShadow = true,
}) => {
  const { type = 'boy', skinColor = '#FFDCB2', shirtColor = '#2383E2' } = config

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`mascot-svg mood-${mood} mascot-type-${type} ${isPoked ? 'mascot-poked-bounce' : ''} ${onClick ? 'mascot-clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `กดเพื่อทักทายตัวการ์ตูน` : undefined}
    >
      <defs>
        {/* Sparkle star for celebrations */}
        <g id="sparkle-star">
          <path
            d="M0 -6 C0.5 -1.5 1.5 -0.5 6 0 C1.5 0.5 0.5 1.5 0 6 C-0.5 1.5 -1.5 0.5 -6 0 C-1.5 -0.5 -0.5 -1.5 0 -6 Z"
            fill="#E9B949"
          />
        </g>
      </defs>

      {/* Dynamic Floor Shadow */}
      {showShadow && (
        <ellipse className="mascot-shadow" cx="60" cy="112" rx="34" ry="6" fill="rgba(0,0,0,0.08)" />
      )}

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
        {/* Body / Hoodie / Shirt */}
        <path
          d="M38 88C38 74 46 66 60 66C74 66 82 74 82 88L84 106C84 108 82 110 80 110H40C38 110 36 108 36 106L38 88Z"
          fill={shirtColor}
        />

        {/* Body Details depending on Character Type */}
        {type === 'robot' ? (
          // Robot screen & chest meters
          <g className="robot-chest">
            <rect x="48" y="74" width="24" height="18" rx="4" fill="#212529" opacity="0.6" />
            <circle cx="54" cy="83" r="2.5" fill="#4DABF7" />
            <circle cx="60" cy="83" r="2.5" fill="#FFD43B" />
            <circle cx="66" cy="83" r="2.5" fill="#69DB7C" />
          </g>
        ) : type === 'cat' || type === 'bunny' || type === 'bear' ? (
          // Cute animal chest collar / cute badge
          <g className="animal-collar">
            <ellipse cx="60" cy="69" rx="10" ry="4" fill="rgba(255,255,255,0.7)" />
            <circle cx="60" cy="74" r="3.5" fill="#FFD43B" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
          </g>
        ) : (
          // Kid Hoodie Collar Strings
          <path
            d="M52 68L60 78L68 68"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Arms and Hands */}
        {mood === 'celebrate' ? (
          // Two raised celebratory waving arms
          <g className="celebrate-arms">
            <g className="arm-left-celebrate">
              <path d="M38 76C30 68 24 52 20 42" stroke={shirtColor} strokeWidth="9" strokeLinecap="round" />
              <circle cx="20" cy="40" r="6" fill={skinColor} />
            </g>
            <g className="arm-right-celebrate">
              <path d="M82 76C90 68 96 52 100 42" stroke={shirtColor} strokeWidth="9" strokeLinecap="round" />
              <circle cx="100" cy="40" r="6" fill={skinColor} />
            </g>
          </g>
        ) : mood === 'cheer' ? (
          // Cheering waving arm
          <g className="cheer-arm-waving">
            <path d="M82 80C92 74 96 62 98 52" stroke={shirtColor} strokeWidth="9" strokeLinecap="round" />
            <circle cx="98" cy="50" r="6" fill={skinColor} />
            <path d="M38 82C34 88 32 94 34 100" stroke={shirtColor} strokeWidth="8" strokeLinecap="round" />
            <circle cx="34" cy="100" r="5" fill={skinColor} />
          </g>
        ) : mood === 'think' ? (
          // Thinking pose: Hand resting at cheek/chin, other hand casually by hip
          <g className="think-arm">
            <path d="M38 80C34 86 33 92 35 98" stroke={shirtColor} strokeWidth="8" strokeLinecap="round" />
            <circle cx="35" cy="98" r="5" fill={skinColor} />
            <path d="M82 80C88 78 86 68 72 58" stroke={shirtColor} strokeWidth="8" strokeLinecap="round" />
            <circle cx="70" cy="56" r="6" fill={skinColor} />
          </g>
        ) : (
          // Idle arms resting naturally by side
          <g className="idle-arms">
            <path d="M38 80C33 86 33 92 35 98" stroke={shirtColor} strokeWidth="8" strokeLinecap="round" />
            <circle cx="35" cy="98" r="5" fill={skinColor} />
            <path d="M82 80C87 86 87 92 85 98" stroke={shirtColor} strokeWidth="8" strokeLinecap="round" />
            <circle cx="85" cy="98" r="5" fill={skinColor} />
          </g>
        )}

        {/* Head Group */}
        <g className="mascot-head-group">
          {/* ================= CHARACTER-SPECIFIC EARS / BACKGROUND ================= */}
          {type === 'cat' && (
            // Kitty pointy ears
            <g className="cat-ears">
              {/* Left ear */}
              <polygon points="34,36 30,12 52,24" fill={skinColor} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
              <polygon points="36,32 33,17 48,25" fill="#FFAAA6" />
              {/* Right ear */}
              <polygon points="86,36 90,12 68,24" fill={skinColor} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
              <polygon points="84,32 87,17 72,25" fill="#FFAAA6" />
            </g>
          )}

          {type === 'bear' && (
            // Teddy bear round ears
            <g className="bear-ears">
              {/* Left ear */}
              <circle cx="36" cy="22" r="11" fill={skinColor} />
              <circle cx="36" cy="22" r="6.5" fill="rgba(0,0,0,0.12)" />
              {/* Right ear */}
              <circle cx="84" cy="22" r="11" fill={skinColor} />
              <circle cx="84" cy="22" r="6.5" fill="rgba(0,0,0,0.12)" />
            </g>
          )}

          {type === 'bunny' && (
            // Long floppy bunny ears
            <g className="bunny-ears">
              {/* Left tall ear */}
              <g transform="rotate(-9 44 22)">
                <ellipse cx="44" cy="14" rx="8" ry="18" fill={skinColor} />
                <ellipse cx="44" cy="14" rx="4.5" ry="13" fill="#FFC0CB" />
              </g>
              {/* Right tall ear */}
              <g transform="rotate(9 76 22)">
                <ellipse cx="76" cy="14" rx="8" ry="18" fill={skinColor} />
                <ellipse cx="76" cy="14" rx="4.5" ry="13" fill="#FFC0CB" />
              </g>
            </g>
          )}

          {type === 'robot' && (
            // Robot Antenna & Side Bolt Ears
            <g className="robot-antenna">
              <line x1="60" y1="20" x2="60" y2="9" stroke="#78909C" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="60" cy="7" r="5" fill="#FFD600" className="sparkle-1" />
              {/* Side bolt ears */}
              <rect x="28" y="38" width="6" height="12" rx="3" fill="#78909C" />
              <rect x="86" y="38" width="6" height="12" rx="3" fill="#78909C" />
            </g>
          )}

          {/* ================= HEAD BASE ================= */}
          {type === 'robot' ? (
            // Robot rounded square head
            <rect x="34" y="20" width="52" height="48" rx="14" fill={skinColor} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
          ) : (
            // Round head base for humans & animals
            <circle cx="60" cy="44" r="28" fill={skinColor} />
          )}

          {/* Human ears for Boy & Girl */}
          {(type === 'boy' || type === 'girl') && (
            <g className="human-ears">
              <circle cx="32" cy="45" r="5" fill={skinColor} />
              <circle cx="88" cy="45" r="5" fill={skinColor} />
            </g>
          )}

          {/* ================= HAIR & HEAD ACCESSORIES ================= */}
          {type === 'boy' && (
            // Boy short styled hair
            <path
              d="M32 40C32 24 44 16 60 16C76 16 88 24 88 40C88 42 86 43 85 40C83 34 76 28 68 28C63 28 58 31 56 34C52 30 44 30 38 34C35 36 33 40 32 40Z"
              fill="#37352F"
            />
          )}

          {type === 'girl' && (
            // Girl cute side buns / pigtails & bangs
            <g className="girl-hair">
              {/* Left high hair bun with cute ribbon */}
              <circle cx="28" cy="23" r="11" fill="#493829" />
              <circle cx="34" cy="30" r="4.5" fill={shirtColor} />

              {/* Right high hair bun with cute ribbon */}
              <circle cx="92" cy="23" r="11" fill="#493829" />
              <circle cx="86" cy="30" r="4.5" fill={shirtColor} />

              {/* Front Bangs & curved hair */}
              <path
                d="M32 42C31 25 44 16 60 16C76 16 89 25 88 42C86 38 81 32 72 32C66 32 62 34 60 36C58 34 54 32 48 32C39 32 34 38 32 42Z"
                fill="#493829"
              />
            </g>
          )}

          {/* ================= ROBOT SCREEN VISOR ================= */}
          {type === 'robot' && (
            <rect x="42" y="29" width="36" height="28" rx="7" fill="#1A202C" />
          )}

          {/* ================= ANIMAL SNOUT / MUZZLE ================= */}
          {type === 'bear' && (
            <g className="bear-muzzle">
              {/* Chubby lighter snout */}
              <ellipse cx="60" cy="49" rx="14" ry="9" fill="rgba(255,255,255,0.75)" />
              {/* Cute dark bear nose */}
              <ellipse cx="60" cy="44" rx="4.5" ry="3.2" fill="#2B1810" />
            </g>
          )}

          {type === 'cat' && (
            <g className="cat-details">
              {/* Tiny pink cat triangle nose */}
              <polygon points="57,44 63,44 60,47" fill="#E03E3E" />
              {/* Whiskers */}
              <line x1="26" y1="46" x2="38" y2="48" stroke="#37352F" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="25" y1="52" x2="38" y2="52" stroke="#37352F" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="94" y1="46" x2="82" y2="48" stroke="#37352F" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="95" y1="52" x2="82" y2="52" stroke="#37352F" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          )}

          {type === 'bunny' && (
            <g className="bunny-details">
              {/* Tiny pink bunny nose */}
              <polygon points="57,45 63,45 60,48" fill="#FF69B4" />
            </g>
          )}

          {/* ================= EYES & EXPRESSIONS ================= */}
          {type === 'robot' ? (
            // Digital glowing visor eyes
            mood === 'celebrate' || mood === 'cheer' ? (
              <g className="robot-joy-eyes">
                <path d="M47 41C48 37 53 37 54 41" stroke="#38D9A9" strokeWidth="3" strokeLinecap="round" />
                <path d="M66 41C67 37 72 37 73 41" stroke="#38D9A9" strokeWidth="3" strokeLinecap="round" />
              </g>
            ) : mood === 'think' ? (
              <g className="robot-think-eyes">
                <circle cx="50" cy="38" r="3.5" fill="#38D9A9" />
                <circle cx="69" cy="38" r="3.5" fill="#38D9A9" />
              </g>
            ) : (
              <g className="robot-normal-eyes">
                <circle className="eye-pupil" cx="50" cy="40" r="3.5" fill="#38D9A9" />
                <circle className="eye-pupil" cx="69" cy="40" r="3.5" fill="#38D9A9" />
              </g>
            )
          ) : mood === 'celebrate' || mood === 'cheer' ? (
            // Curved joyful squint eyes
            <g className="joyful-eyes">
              <path d="M48 41C50 36 54 36 56 41" stroke="#37352F" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M64 41C66 36 70 36 72 41" stroke="#37352F" strokeWidth="3.2" strokeLinecap="round" />
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

          {/* Cheerful Blushing Cheeks (except robot) */}
          {type !== 'robot' && (
            <>
              <circle cx="43" cy="48" r="4.5" fill="#FFAAA6" opacity="0.8" className="blush-cheek" />
              <circle cx="77" cy="48" r="4.5" fill="#FFAAA6" opacity="0.8" className="blush-cheek" />
            </>
          )}

          {/* ================= MOUTH ================= */}
          {type === 'robot' ? (
            // Robot LED smile
            <path
              d={mood === 'celebrate' || mood === 'cheer' ? 'M53 47C56 52 64 52 67 47' : 'M54 48H66'}
              stroke="#38D9A9"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ) : type === 'cat' ? (
            // Cute cat :3 mouth
            mood === 'celebrate' || mood === 'cheer' ? (
              <path
                className="joyful-mouth"
                d="M52 48C52 56 68 56 68 48Z"
                fill="#E03E3E"
                stroke="#37352F"
                strokeWidth="2"
              />
            ) : (
              <path
                d="M54 50C57 52 60 51 60 49C60 51 63 52 66 50"
                stroke="#37352F"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            )
          ) : mood === 'celebrate' || mood === 'cheer' ? (
            <path
              className="joyful-mouth"
              d="M52 48C52 57 68 57 68 48Z"
              fill="#E03E3E"
              stroke="#37352F"
              strokeWidth="2"
            />
          ) : mood === 'think' ? (
            <path
              d="M54 50C57 53 63 53 66 49"
              stroke="#37352F"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
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
