import React from 'react'
import type { QuizTheme } from '../themeTypes'

interface ThemeFrameDecorationsProps {
  theme: QuizTheme
}

/**
 * Vector illustrations & corner frame embellishments for thematic backgrounds.
 * Crafted with exact pixel coordinates, positioned outside of text to never obstruct content.
 */
export const ThemeFrameDecorations: React.FC<ThemeFrameDecorationsProps> = ({ theme }) => {
  if (theme === 'classic') return null

  return (
    <div className={`theme-frame-decorations-layer theme-${theme}`} aria-hidden="true">
      {/* 1. HALLOWEEN THEME */}
      {theme === 'halloween' && (
        <>
          {/* Subtle Ambient Background Watermark (Non-obtrusive silhouettes) */}
          <svg className="theme-bg-ambient" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Soft moonlight crescent */}
            <path
              d="M 520 20 C 500 20, 480 36, 480 60 C 480 84, 500 100, 520 100 C 508 92, 502 78, 502 60 C 502 42, 508 28, 520 20 Z"
              fill="#FFD43B"
              opacity="0.16"
            />
            {/* Distant flying bat silhouettes */}
            <path
              d="M 120 40 Q 128 32, 134 38 Q 140 32, 148 40 Q 140 43, 134 40 Q 128 43, 120 40 Z"
              fill="#7048E8"
              opacity="0.22"
            />
            <path
              d="M 280 25 Q 286 18, 292 23 Q 298 18, 304 25 Q 298 27, 292 25 Q 286 27, 280 25 Z"
              fill="#7048E8"
              opacity="0.18"
            />
            {/* Cute candy corn silhouette */}
            <polygon points="45,150 55,170 35,170" fill="#F76707" opacity="0.14" />
            <polygon points="540,140 550,160 530,160" fill="#F76707" opacity="0.14" />
          </svg>

          {/* Top-Right Corner Frame: Smiling Pumpkin + Friendly Ghost + Bat */}
          <div className="theme-corner-badge corner-top-right">
            <svg width="105" height="90" viewBox="0 0 105 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Cute Little Flying Ghost */}
              <g className="theme-anim-float-gentle">
                <path
                  d="M 22 22 C 22 10, 42 10, 42 22 C 42 34, 38 38, 42 42 C 38 40, 36 44, 32 40 C 28 44, 26 40, 22 42 C 26 38, 22 34, 22 22 Z"
                  fill="#FFFFFF"
                  stroke="#1D2125"
                  strokeWidth="2.2"
                />
                {/* Ghost Eyes & Blush */}
                <circle cx="28" cy="20" r="1.8" fill="#1D2125" />
                <circle cx="36" cy="20" r="1.8" fill="#1D2125" />
                <circle cx="26" cy="24" r="2" fill="#FFA8A8" opacity="0.75" />
                <circle cx="38" cy="24" r="2" fill="#FFA8A8" opacity="0.75" />
                {/* Ghost Waving Hand */}
                <path d="M 42 24 C 47 22, 50 25, 49 28 C 47 29, 44 27, 42 27" fill="#FFFFFF" stroke="#1D2125" strokeWidth="2" />
              </g>

              {/* Smiling Pumpkin (Jack-o'-lantern) */}
              <g transform="translate(42, 30)">
                {/* Stem */}
                <path d="M 30 14 C 30 8, 36 6, 38 4" stroke="#2B8A3E" strokeWidth="3.5" strokeLinecap="round" />
                {/* Pumpkin Ribs & Body */}
                <ellipse cx="30" cy="34" rx="28" ry="22" fill="#F76707" stroke="#1D2125" strokeWidth="2.4" />
                <ellipse cx="30" cy="34" rx="16" ry="22" fill="#FF922B" stroke="#1D2125" strokeWidth="1.8" />
                {/* Carved Eyes (Cute friendly triangles) */}
                <polygon points="21,26 27,26 24,20" fill="#1D2125" />
                <polygon points="33,26 39,26 36,20" fill="#1D2125" />
                <polygon points="28,31 32,31 30,28" fill="#1D2125" />
                {/* Smiling Mouth */}
                <path d="M 20 36 Q 30 46, 40 36 Q 35 41, 30 41 Q 25 41, 20 36 Z" fill="#1D2125" />
                {/* Cute Cheek Blush */}
                <circle cx="16" cy="33" r="3" fill="#E8590C" opacity="0.6" />
                <circle cx="44" cy="33" r="3" fill="#E8590C" opacity="0.6" />
              </g>

              {/* Flapping Purple Bat */}
              <g transform="translate(10, 52)" className="theme-anim-wing-flap">
                <path
                  d="M 0 8 Q 8 0, 14 6 Q 20 0, 28 8 Q 20 12, 14 8 Q 8 12, 0 8 Z"
                  fill="#7048E8"
                  stroke="#1D2125"
                  strokeWidth="1.8"
                />
                <circle cx="12" cy="7" r="1.2" fill="#FFD43B" />
                <circle cx="16" cy="7" r="1.2" fill="#FFD43B" />
              </g>
            </svg>
          </div>

          {/* Top-Left Corner Frame: Cute Spiderweb & Spider */}
          <div className="theme-corner-badge corner-top-left">
            <svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Spiderweb strands */}
              <path d="M 0 0 L 55 0" stroke="#CED4DA" strokeWidth="1.6" strokeDasharray="3 3" />
              <path d="M 0 0 L 0 55" stroke="#CED4DA" strokeWidth="1.6" strokeDasharray="3 3" />
              <path d="M 0 0 L 45 45" stroke="#CED4DA" strokeWidth="1.6" />
              {/* Web arcs */}
              <path d="M 20 0 Q 15 15, 0 20" stroke="#ADB5BD" strokeWidth="1.6" fill="none" />
              <path d="M 40 0 Q 30 30, 0 40" stroke="#ADB5BD" strokeWidth="1.6" fill="none" />
              <path d="M 55 0 Q 42 42, 0 55" stroke="#ADB5BD" strokeWidth="1.6" fill="none" />
              {/* Hanging Spider Thread */}
              <line x1="32" y1="20" x2="32" y2="48" stroke="#868E96" strokeWidth="1.4" />
              {/* Little Cute Spider */}
              <ellipse cx="32" cy="54" rx="6" ry="5" fill="#1D2125" />
              <circle cx="32" cy="49" r="3.5" fill="#1D2125" />
              {/* Spider Eyes */}
              <circle cx="30.5" cy="48" r="0.9" fill="#FFFFFF" />
              <circle cx="33.5" cy="48" r="0.9" fill="#FFFFFF" />
              {/* Spider Legs */}
              <path d="M 28 52 C 24 50, 22 55, 20 56" stroke="#1D2125" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M 28 55 C 24 55, 23 60, 21 62" stroke="#1D2125" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M 36 52 C 40 50, 42 55, 44 56" stroke="#1D2125" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M 36 55 C 40 55, 41 60, 43 62" stroke="#1D2125" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
        </>
      )}

      {/* 2. CHRISTMAS THEME */}
      {theme === 'christmas' && (
        <>
          {/* Subtle Falling Snow Pattern */}
          <svg className="theme-bg-ambient" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="80" cy="30" r="3" fill="#74C0FC" opacity="0.3" />
            <circle cx="160" cy="70" r="2" fill="#74C0FC" opacity="0.25" />
            <circle cx="240" cy="35" r="3.5" fill="#74C0FC" opacity="0.2" />
            <circle cx="380" cy="45" r="2.5" fill="#74C0FC" opacity="0.25" />
            <circle cx="480" cy="65" r="3" fill="#74C0FC" opacity="0.3" />
            <circle cx="530" cy="25" r="2" fill="#74C0FC" opacity="0.2" />
            {/* Subtle snowflake star */}
            <path d="M 320 20 L 320 36 M 312 28 L 328 28" stroke="#74C0FC" strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />
          </svg>

          {/* Top-Right Corner Frame: Pine Branch + Holly Berries + Gold Bell + Gift Box */}
          <div className="theme-corner-badge corner-top-right">
            <svg width="105" height="90" viewBox="0 0 105 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Pine Needle Sprays */}
              <g stroke="#2B8A3E" strokeWidth="3" strokeLinecap="round">
                <line x1="55" y1="15" x2="85" y2="10" />
                <line x1="68" y1="12" x2="72" y2="4" />
                <line x1="75" y1="11" x2="82" y2="3" />
                <line x1="65" y1="13" x2="62" y2="6" />
                <line x1="72" y1="18" x2="95" y2="25" />
                <line x1="80" y1="20" x2="85" y2="14" />
                <line x1="88" y1="22" x2="96" y2="17" />
              </g>

              {/* Gold Jingle Bell with Ribbon */}
              <g transform="translate(62, 16)">
                <path d="M 12 6 C 12 2, 22 2, 22 6 L 25 18 C 26 21, 8 21, 9 18 Z" fill="#FAB005" stroke="#1D2125" strokeWidth="2.2" />
                <ellipse cx="17" cy="19" rx="9" ry="3" fill="#F59F00" stroke="#1D2125" strokeWidth="2" />
                <circle cx="17" cy="20" r="2.5" fill="#E67700" />
                {/* Red Bow on Top of Bell */}
                <circle cx="17" cy="5" r="3" fill="#E03131" stroke="#1D2125" strokeWidth="1.8" />
                <path d="M 17 5 C 10 0, 8 8, 15 6 Z" fill="#FA5252" stroke="#1D2125" strokeWidth="1.6" />
                <path d="M 17 5 C 24 0, 26 8, 19 6 Z" fill="#FA5252" stroke="#1D2125" strokeWidth="1.6" />
              </g>

              {/* Holly Leaves and Red Berries */}
              <g transform="translate(35, 12)">
                <circle cx="14" cy="18" r="4.5" fill="#E03131" stroke="#1D2125" strokeWidth="1.8" />
                <circle cx="20" cy="15" r="4.5" fill="#FA5252" stroke="#1D2125" strokeWidth="1.8" />
                <circle cx="17" cy="22" r="4" fill="#C92A2A" stroke="#1D2125" strokeWidth="1.8" />
                {/* Berry highlights */}
                <circle cx="13" cy="16.5" r="1.2" fill="#FFFFFF" />
                <circle cx="19" cy="13.5" r="1.2" fill="#FFFFFF" />
              </g>

              {/* Cute Red & Green Gift Box */}
              <g transform="translate(56, 42)">
                <rect x="10" y="8" width="28" height="24" rx="4" fill="#E03131" stroke="#1D2125" strokeWidth="2.2" />
                {/* Green Ribbon */}
                <rect x="21" y="8" width="6" height="24" fill="#2B8A3E" stroke="#1D2125" strokeWidth="1.8" />
                <rect x="10" y="17" width="28" height="6" fill="#2B8A3E" stroke="#1D2125" strokeWidth="1.8" />
                {/* Gift Box Lid */}
                <rect x="8" y="5" width="32" height="6" rx="2" fill="#C92A2A" stroke="#1D2125" strokeWidth="2.2" />
                {/* Yellow Bow on Box */}
                <circle cx="24" cy="5" r="2.5" fill="#FAB005" stroke="#1D2125" strokeWidth="1.5" />
                <path d="M 24 5 C 18 1, 16 7, 22 5" fill="#FFD43B" stroke="#1D2125" strokeWidth="1.5" />
                <path d="M 24 5 C 30 1, 32 7, 26 5" fill="#FFD43B" stroke="#1D2125" strokeWidth="1.5" />
              </g>
            </svg>
          </div>

          {/* Top-Left Corner Frame: Cute Santa Hat & Sparkly Snowflakes */}
          <div className="theme-corner-badge corner-top-left">
            <svg width="85" height="85" viewBox="0 0 85 85" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Cozy Santa Hat - shifted left and up to hug the frame corner */}
              <g transform="translate(-4, 0) rotate(-12)">
                {/* Red Cone */}
                <path d="M 14 36 C 18 16, 36 10, 48 18 C 42 16, 26 18, 22 28 Z" fill="#C92A2A" />
                <path d="M 12 36 C 18 14, 40 12, 48 20 C 44 26, 30 32, 12 36 Z" fill="#E03131" stroke="#1D2125" strokeWidth="2.2" />
                {/* White Pompom */}
                <circle cx="50" cy="22" r="6" fill="#FFFFFF" stroke="#1D2125" strokeWidth="2.2" />
                {/* White Fur Brim */}
                <rect x="8" y="34" width="34" height="10" rx="5" fill="#FFFFFF" stroke="#1D2125" strokeWidth="2.2" />
              </g>

              {/* Sparkling Snowflakes */}
              <g transform="translate(26, 42)">
                <path d="M 8 0 L 8 16 M 0 8 L 16 8 M 2 2 L 14 14 M 2 14 L 14 2" stroke="#74C0FC" strokeWidth="2" strokeLinecap="round" />
                <circle cx="8" cy="8" r="2.5" fill="#E7F5FF" />
              </g>
              <g transform="translate(4, 46)">
                <path d="M 6 0 L 6 12 M 0 6 L 12 6" stroke="#4DABF7" strokeWidth="1.6" strokeLinecap="round" />
              </g>
            </svg>
          </div>
        </>
      )}

      {/* 3. SPACE GALAXY THEME */}
      {theme === 'space' && (
        <>
          {/* Subtle Starry Nebula Pattern */}
          <svg className="theme-bg-ambient" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="120" cy="50" r="1.5" fill="#FFD43B" opacity="0.4" />
            <circle cx="180" cy="25" r="2.5" fill="#FFFFFF" opacity="0.3" />
            <circle cx="260" cy="65" r="1.8" fill="#4DABF7" opacity="0.35" />
            <circle cx="340" cy="30" r="2" fill="#FFD43B" opacity="0.3" />
            <circle cx="440" cy="60" r="1.5" fill="#FFFFFF" opacity="0.4" />
            {/* Small planet silhouette */}
            <circle cx="510" cy="40" r="10" fill="#9775FA" opacity="0.18" />
            <ellipse cx="510" cy="40" rx="16" ry="4" stroke="#9775FA" strokeWidth="1.5" opacity="0.22" />
          </svg>

          {/* Top-Right Corner Frame: Saturn Planet + Twinkling Stars */}
          <div className="theme-corner-badge corner-top-right">
            <svg width="105" height="90" viewBox="0 0 105 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Saturn with Ring */}
              <g transform="translate(45, 14)">
                {/* Back of ring */}
                <path d="M 6 24 C 6 14, 52 14, 52 24" stroke="#FAB005" strokeWidth="4.5" strokeLinecap="round" opacity="0.6" />
                {/* Planet Sphere */}
                <circle cx="29" cy="24" r="18" fill="#FFA94D" stroke="#1D2125" strokeWidth="2.4" />
                {/* Surface stripes */}
                <path d="M 13 22 Q 29 27, 45 22" stroke="#F76707" strokeWidth="2.5" />
                <path d="M 15 28 Q 29 33, 43 28" stroke="#FFE066" strokeWidth="2" />
                {/* Front of ring */}
                <ellipse cx="29" cy="24" rx="26" ry="7" fill="none" stroke="#FFD43B" strokeWidth="4.5" strokeDasharray="38 45" />
                <ellipse cx="29" cy="24" rx="26" ry="7" fill="none" stroke="#1D2125" strokeWidth="1.6" />
              </g>

              {/* Twinkling 4-Point Stars */}
              <g transform="translate(24, 15)">
                <path d="M 8 0 Q 8 8, 16 8 Q 8 8, 8 16 Q 8 8, 0 8 Q 8 8, 8 0 Z" fill="#FFD43B" stroke="#1D2125" strokeWidth="1.5" />
              </g>
              <g transform="translate(80, 52)">
                <path d="M 6 0 Q 6 6, 12 6 Q 6 6, 6 12 Q 6 6, 0 6 Q 6 6, 6 0 Z" fill="#69DB7C" stroke="#1D2125" strokeWidth="1.4" />
              </g>
              <g transform="translate(26, 60)">
                <path d="M 5 0 Q 5 5, 10 5 Q 5 5, 5 10 Q 5 5, 0 5 Q 5 5, 5 0 Z" fill="#4DABF7" stroke="#1D2125" strokeWidth="1.2" />
              </g>
            </svg>
          </div>

          {/* Top-Left Corner Frame: Friendly Retro Cartoon Rocket Ship */}
          <div className="theme-corner-badge corner-top-left">
            <svg width="85" height="85" viewBox="0 0 85 85" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(18, 12) rotate(35)">
                {/* Rocket Exhaust Fire */}
                <path d="M 12 36 Q 16 48, 16 48 Q 20 48, 20 36 Z" fill="#FF922B" />
                <path d="M 14 36 Q 16 43, 16 43 Q 18 43, 18 36 Z" fill="#FFD43B" />
                {/* Left & Right Fins */}
                <path d="M 10 26 L 4 34 L 11 33 Z" fill="#E03131" stroke="#1D2125" strokeWidth="1.8" />
                <path d="M 22 26 L 28 34 L 21 33 Z" fill="#E03131" stroke="#1D2125" strokeWidth="1.8" />
                {/* Rocket Body */}
                <path d="M 10 32 C 10 16, 16 6, 16 6 C 16 6, 22 16, 22 32 Z" fill="#FFFFFF" stroke="#1D2125" strokeWidth="2.2" />
                {/* Red Nose Cone */}
                <path d="M 12 14 C 14 9, 16 6, 16 6 C 16 6, 18 9, 20 14 Z" fill="#E03131" stroke="#1D2125" strokeWidth="1.8" />
                {/* Porthole Window */}
                <circle cx="16" cy="20" r="4.5" fill="#4DABF7" stroke="#1D2125" strokeWidth="1.8" />
                <circle cx="15" cy="18.5" r="1.3" fill="#FFFFFF" />
              </g>
            </svg>
          </div>
        </>
      )}

      {/* 4. CANDY LAND THEME */}
      {theme === 'candyland' && (
        <>
          {/* Subtle Confetti Sprinkles Pattern */}
          <svg className="theme-bg-ambient" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="70" y="30" width="8" height="3" rx="1.5" fill="#F06595" opacity="0.3" transform="rotate(25 70 30)" />
            <rect x="180" y="55" width="8" height="3" rx="1.5" fill="#22B8CF" opacity="0.3" transform="rotate(-35 180 55)" />
            <rect x="310" y="25" width="8" height="3" rx="1.5" fill="#FAB005" opacity="0.3" transform="rotate(45 310 25)" />
            <rect x="420" y="60" width="8" height="3" rx="1.5" fill="#51CF66" opacity="0.3" transform="rotate(-15 420 60)" />
            <rect x="520" y="35" width="8" height="3" rx="1.5" fill="#845EF7" opacity="0.3" transform="rotate(30 520 35)" />
          </svg>

          {/* Top-Right Corner Frame: Rainbow Swirl Lollipop + Wrapped Candy */}
          <div className="theme-corner-badge corner-top-right">
            <svg width="105" height="90" viewBox="0 0 105 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Swirly Rainbow Lollipop */}
              <g transform="translate(48, 12)">
                {/* Stick */}
                <line x1="20" y1="36" x2="10" y2="64" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="20" y1="36" x2="10" y2="64" stroke="#1D2125" strokeWidth="1.8" strokeLinecap="round" />
                {/* Candy Disc with Swirl */}
                <circle cx="28" cy="24" r="18" fill="#FF8787" stroke="#1D2125" strokeWidth="2.4" />
                <path d="M 28 6 C 38 6, 46 14, 46 24 C 46 34, 38 42, 28 42" fill="none" stroke="#FFD43B" strokeWidth="4" />
                <path d="M 28 12 C 34 12, 40 18, 40 24 C 40 30, 34 36, 28 36" fill="none" stroke="#69DB7C" strokeWidth="4" />
                <path d="M 28 18 C 31 18, 34 21, 34 24" fill="none" stroke="#4DABF7" strokeWidth="3.5" />
                <circle cx="28" cy="24" r="3.5" fill="#F06595" />
              </g>

              {/* Wrapped Bonbon Candy */}
              <g transform="translate(18, 36) rotate(-20)">
                {/* Candy Wrapper Wraps */}
                <polygon points="6,12 0,6 0,18" fill="#F06595" stroke="#1D2125" strokeWidth="1.8" />
                <polygon points="26,12 32,6 32,18" fill="#F06595" stroke="#1D2125" strokeWidth="1.8" />
                {/* Candy Body */}
                <ellipse cx="16" cy="12" rx="10" ry="8" fill="#FCC2D7" stroke="#1D2125" strokeWidth="2" />
                <path d="M 10 12 L 22 12" stroke="#F06595" strokeWidth="2.5" />
              </g>
            </svg>
          </div>

          {/* Top-Left Corner Frame: Sweet Cupcake with Cherry */}
          <div className="theme-corner-badge corner-top-left">
            <svg width="85" height="85" viewBox="0 0 85 85" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(14, 15)">
                {/* Cupcake Base */}
                <polygon points="6,24 24,24 21,42 9,42" fill="#FFE066" stroke="#1D2125" strokeWidth="2.2" />
                {/* Cupcake lines */}
                <line x1="12" y1="26" x2="13" y2="40" stroke="#FAB005" strokeWidth="1.6" />
                <line x1="18" y1="26" x2="17" y2="40" stroke="#FAB005" strokeWidth="1.6" />
                {/* Strawberry Frosting Swirl */}
                <ellipse cx="15" cy="22" rx="13" ry="8" fill="#FF8787" stroke="#1D2125" strokeWidth="2.2" />
                <ellipse cx="15" cy="16" rx="9" ry="6" fill="#FFA8A8" stroke="#1D2125" strokeWidth="2" />
                {/* Sprinkles on Frosting */}
                <circle cx="11" cy="20" r="1.2" fill="#4DABF7" />
                <circle cx="19" cy="20" r="1.2" fill="#51CF66" />
                <circle cx="15" cy="16" r="1.2" fill="#FFD43B" />
                {/* Red Cherry on Top */}
                <circle cx="15" cy="9" r="4.5" fill="#E03131" stroke="#1D2125" strokeWidth="2" />
                <circle cx="14" cy="7.5" r="1" fill="#FFFFFF" />
                {/* Cherry Stem */}
                <path d="M 16 6 C 18 2, 22 2, 24 4" stroke="#2B8A3E" strokeWidth="1.8" strokeLinecap="round" />
              </g>
            </svg>
          </div>
        </>
      )}
    </div>
  )
}
