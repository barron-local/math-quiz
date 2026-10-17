/**
 * Web Audio API synthesized celebration fireworks (เสียงพลุฉลองเพราะๆ นุ่มนวลสดใสสำหรับเด็ก)
 * Zero external audio files required, instant playback, warm pops, and magical stardust bell chimes.
 */

class SoundEffectsManager {
  private ctx: AudioContext | null = null

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
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
   * Play a single magical firework with warm pop & sparkling stardust chimes
   */
  public playSingleFirework(delayMs = 0, chordNotes: number[] = [1046, 1318, 1568]): void {
    setTimeout(() => {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime

      // 1. Soft rising whoosh (airy, gentle, not piercing)
      this.playWhoosh(ctx, now)

      // 2. Warm Pop/Thump at +0.26s
      const popTime = now + 0.26
      this.playWarmPop(ctx, popTime)

      // 3. Stardust sparkling chimes & soft crackles
      this.playSparkleChimes(ctx, popTime, chordNotes)
      this.playSoftCrackle(ctx, popTime)
    }, delayMs)
  }

  // Soft whoosh (gentle warm sweep)
  private playWhoosh(ctx: AudioContext, time: number): void {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(260, time)
    osc.frequency.exponentialRampToValueAtTime(720, time + 0.24)

    gain.gain.setValueAtTime(0.001, time)
    gain.gain.linearRampToValueAtTime(0.06, time + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.26)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(time)
    osc.stop(time + 0.28)
  }

  // Warm round pop (clean, punchy, no harsh distortion)
  private playWarmPop(ctx: AudioContext, time: number): void {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(130, time)
    osc.frequency.exponentialRampToValueAtTime(36, time + 0.35)

    gain.gain.setValueAtTime(0.28, time)
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.36)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(time)
    osc.stop(time + 0.38)
  }

  // Sparkling golden bell chimes (magical stardust notes in pentatonic harmony)
  private playSparkleChimes(ctx: AudioContext, time: number, notes: number[]): void {
    notes.forEach((freq, idx) => {
      const noteTime = time + idx * 0.04 + Math.random() * 0.015
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, noteTime)

      gain.gain.setValueAtTime(0.001, noteTime)
      gain.gain.linearRampToValueAtTime(0.11, noteTime + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.42)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(noteTime)
      osc.stop(noteTime + 0.45)
    })
  }

  // Soft sparkle crackle (gentle glittering stardust shower)
  private playSoftCrackle(ctx: AudioContext, time: number): void {
    const bufferSize = Math.floor(ctx.sampleRate * 0.45)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      // Gentle random sparkle impulses
      data[i] = Math.random() > 0.88 ? (Math.random() * 2 - 1) * 0.4 : 0
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(3400, time)
    filter.Q.setValueAtTime(2.8, time)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.001, time)
    gain.gain.linearRampToValueAtTime(0.09, time + 0.025)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.42)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    noise.start(time)
    noise.stop(time + 0.45)
  }

  /**
   * Grand finale celebratory fireworks:
   * Plays a joyful, harmonious progression that sounds magical and delightful for kids
   */
  public playGrandFireworks(): void {
    // Musical pentatonic chords (C major progression: C -> E -> G -> High C -> Grand Cascade)
    const bursts = [
      { delay: 0, notes: [1046, 1318, 1568] },         // C6, E6, G6 (Joyful triad)
      { delay: 360, notes: [1318, 1568, 2093] },       // E6, G6, C7 (Brighter upward lift)
      { delay: 760, notes: [1568, 2093, 2637] },       // G6, C7, E7 (High sparkle)
      { delay: 1220, notes: [2093, 2637, 3136] },      // C7, E7, G7 (Stardust crescendo)
      { delay: 1680, notes: [1046, 1318, 1568, 2093, 2637] }, // Grand full celebratory chord cascade!
    ]

    bursts.forEach(({ delay, notes }) => {
      this.playSingleFirework(delay, notes)
    })
  }
}

export const soundEffects = new SoundEffectsManager()
