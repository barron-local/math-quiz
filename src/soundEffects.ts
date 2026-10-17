/**
 * Web Audio API synthesized celebration fireworks (เสียงพลุฉลอง)
 * Zero external audio files required, instant playback, works on all modern browsers & mobile.
 */

class SoundEffectsManager {
  private ctx: AudioContext | null = null

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  /**
   * Single firework rocket sound:
   * 1. Whistle/lift whoosh rising into the sky
   * 2. Loud satisfying "BOOM!" blast
   * 3. Sparkling crackles/rumble decay
   */
  public playSingleFirework(delayMs = 0, pitchVariation = 1.0): void {
    setTimeout(() => {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime

      // 1. Whistle rocket rising (0 to 0.4s)
      const osc = ctx.createOscillator()
      const oscGain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(320 * pitchVariation, now)
      osc.frequency.exponentialRampToValueAtTime(1100 * pitchVariation, now + 0.35)

      oscGain.gain.setValueAtTime(0.001, now)
      oscGain.gain.linearRampToValueAtTime(0.12, now + 0.1)
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38)

      osc.connect(oscGain)
      oscGain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.4)

      // 2. Main Explosive Boom at 0.35s
      const boomTime = now + 0.35
      const boomOsc = ctx.createOscillator()
      const boomGain = ctx.createGain()
      boomOsc.type = 'sine'
      boomOsc.frequency.setValueAtTime(160 * pitchVariation, boomTime)
      boomOsc.frequency.exponentialRampToValueAtTime(32, boomTime + 0.5)

      boomGain.gain.setValueAtTime(0.45, boomTime)
      boomGain.gain.exponentialRampToValueAtTime(0.001, boomTime + 0.6)

      boomOsc.connect(boomGain)
      boomGain.connect(ctx.destination)
      boomOsc.start(boomTime)
      boomOsc.stop(boomTime + 0.65)

      // 3. Crackling Noise Burst (white noise buffer through bandpass filter)
      const bufferSize = Math.floor(ctx.sampleRate * 0.9)
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }

      const whiteNoise = ctx.createBufferSource()
      whiteNoise.buffer = noiseBuffer

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(1200, boomTime)
      filter.frequency.exponentialRampToValueAtTime(200, boomTime + 0.8)

      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.35, boomTime)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, boomTime + 0.85)

      whiteNoise.connect(filter)
      filter.connect(noiseGain)
      noiseGain.connect(ctx.destination)

      whiteNoise.start(boomTime)
      whiteNoise.stop(boomTime + 0.9)
    }, delayMs)
  }

  /**
   * Grand finale fireworks show (ชุดพลุเฉลิมฉลองต่อเนื่องเมื่อจบเกม)
   * Shoots 5 multi-burst fireworks with alternating pitch and spatial delay
   */
  public playGrandFireworks(): void {
    const bursts = [
      { delay: 0, pitch: 1.0 },
      { delay: 420, pitch: 1.25 },
      { delay: 850, pitch: 0.9 },
      { delay: 1350, pitch: 1.15 },
      { delay: 1800, pitch: 1.05 },
    ]

    bursts.forEach(({ delay, pitch }) => {
      this.playSingleFirework(delay, pitch)
    })
  }
}

export const soundEffects = new SoundEffectsManager()
