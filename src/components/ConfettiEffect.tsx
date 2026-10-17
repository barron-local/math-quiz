import React, { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  size: number
  delay: number
  duration: number
  rotation: number
}

const COLORS = ['#2383E2', '#0F7B6C', '#E9B949', '#E03E3E', '#9B51E0', '#FF7369']

export const ConfettiEffect: React.FC = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const generated: ConfettiPiece[] = Array.from({ length: 32 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage of screen width
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.floor(Math.random() * 6) + 7, // 7px to 13px
      delay: Math.random() * 0.4,
      duration: Math.random() * 1.5 + 1.8,
      rotation: Math.floor(Math.random() * 360),
    }))
    setPieces(generated)
  }, [])

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size * 1.4}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  )
}
