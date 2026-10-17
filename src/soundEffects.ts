/**
 * Sound Effects Manager:
 * Uses real web-optimized celebration sounds (Party Popper, Confetti Pop, Ta-da, Victory fanfare)
 * Friendly, cheerful, and delighting for kids without loud frightening blasts.
 */

class SoundEffectsManager {
  private audioCache = new Map<string, HTMLAudioElement>()

  private getAudio(src: string): HTMLAudioElement {
    let audio = this.audioCache.get(src)
    if (!audio) {
      audio = new Audio(src)
      audio.preload = 'auto'
      this.audioCache.set(src, audio)
    }
    return audio
  }

  private playSound(src: string, volume = 0.8, delayMs = 0): void {
    setTimeout(() => {
      try {
        const audio = this.getAudio(src)
        audio.currentTime = 0
        audio.volume = Math.max(0, Math.min(1, volume))
        audio.play().catch(() => {
          // Autoplay policy or user hasn't interacted yet
        })
      } catch {
        // Fallback gracefully
      }
    }, delayMs)
  }

  /**
   * Real website Confetti / Party Popper sound (เสียงพลุเปเปอร์ชู้ต/ปาร์ตี้ป็อปเปอร์ที่เว็บนิยมใช้)
   */
  public playConfettiPop(delayMs = 0, volume = 0.85): void {
    this.playSound('/sounds/confetti.mp3', volume, delayMs)
  }

  /**
   * Cheerful Ta-da celebration fanfare (เสียงแต๊นแต้นฉลองชัยชนะ สดใส นุ่มนวล)
   */
  public playTada(delayMs = 0, volume = 0.45): void {
    this.playSound('/sounds/tada.mp3', volume, delayMs)
  }

  /**
   * Full victory fanfare (เสียงดนตรีฉลองชัยชนะ)
   */
  public playVictory(delayMs = 0, volume = 0.45): void {
    this.playSound('/sounds/victory.mp3', volume, delayMs)
  }

  /**
   * Web animation firework burst (from fireworks-js library)
   */
  public playWebFirework(burstIndex = 0, delayMs = 0, volume = 0.45): void {
    const files = [
      '/sounds/explosion0.mp3',
      '/sounds/explosion1.mp3',
      '/sounds/explosion2.mp3',
    ]
    const file = files[burstIndex % files.length]
    this.playSound(file, volume, delayMs)
  }

  /**
   * Grand finale celebration sound played when finishing the quiz (ฉากจบเกมเมื่อทำครบ 10 ข้อ):
   * Uses Victory Fanfare alone at a gentle, comfortable volume (0.42) that is pleasant and not too loud.
   */
  public playGrandFireworks(): void {
    this.playVictory(0, 0.42)
  }

  /**
   * Alternative: Fireworks-JS 4-burst sequence
   */
  public playWebFireworksShow(): void {
    this.playWebFirework(0, 0, 0.6)
    this.playWebFirework(1, 400, 0.6)
    this.playWebFirework(2, 850, 0.65)
    this.playConfettiPop(1300, 0.85)
  }
}

export const soundEffects = new SoundEffectsManager()
