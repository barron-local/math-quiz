// Helper to format child's title naturally (never awkward 'น้องคนเก่ง' or 'น้องน้อง...')
export function formatChildName(name: string): string {
  const trimmed = name.trim()
  if (!trimmed || trimmed === 'คนเก่ง') return 'คนเก่ง'
  if (trimmed.startsWith('น้อง')) return trimmed
  return `น้อง${trimmed}`
}

// Encouragement messages for individual correct answers
const CORRECT_TEMPLATES = [
  (child: string) => `เก่งมากเลย${child}! คิดเลขได้ไวสุดๆ`,
  (child: string) => `ถูกต้องนะคร้าบ! ยอดเยี่ยมมาก${child}`,
  (child: string) => `ว้าว ${child} ตอบเป๊ะมาก! ปรบมือรัวๆ`,
  (child: string) => `สุดยอดเลย${child}! ข้อนี้ไม่ยากสำหรับเราเลย`,
  (child: string) => `${child} ทำได้ดีมาก! กำลังมาแรงเลย`,
  (child: string) => `ตอบถูกอีกแล้ว! ${child} สุดยอดนักคิดเลข`,
  (child: string) => `เท่มาก${child}! สมาธิดีมากๆ`,
]

// Encouragement messages for when answered incorrect (to motivate them)
const TRY_AGAIN_TEMPLATES = [
  (child: string) => `ไม่เป็นไรนะ${child} ข้อนี้เกือบถูกแล้ว ลองลุยข้อถัดไปกัน!`,
  (child: string) => `ฝึกฝนเรื่อยๆ นะ${child} ค่อยๆ คิด เดี๋ยวก็เก่งขึ้นแน่นอน`,
  (child: string) => `สู้ๆ ครับ${child} ตั้งสมาธิแล้วไปลุยข้อใหม่ด้วยกัน!`,
]

// Completion messages based on score and total questions
export function getCompletionMessage(name: string, score: number, total: number): {
  headline: string
  subtext: string
  mood: 'celebrate' | 'happy' | 'cheer'
} {
  const child = formatChildName(name)
  const safeTotal = Math.max(1, total)
  const percent = score / safeTotal

  if (score >= safeTotal) {
    const fullScoreDesc = safeTotal === 1 ? 'ตอบถูกเป๊ะ ได้คะแนนเต็มเลย!' : `ได้คะแนนเต็ม ${safeTotal} คะแนนเลย!`
    return {
      headline: `สมบูรณ์แบบมาก${child}! ${fullScoreDesc}`,
      subtext: `${child} เก่งคณิตศาสตร์มากๆ เลยครับ วันนี้พร้อมลุยโจทย์ใหม่ๆ อีกรอบไหมเอ่ย?`,
      mood: 'celebrate',
    }
  }

  if (percent >= 0.8) {
    return {
      headline: `สุดยอดไปเลย${child}! ทำได้ยอดเยี่ยมมากๆ`,
      subtext: `คิดเลขได้แม่นยำและคล่องแคล่วมาก ฝึกบ่อยๆ แบบนี้รับรองเก่งขึ้นทุกวันแน่นอน!`,
      mood: 'celebrate',
    }
  }

  if (percent >= 0.5) {
    return {
      headline: `ทำได้ดีมากครับ${child}! ผ่านเกณฑ์สบายๆ`,
      subtext: `${child} เก่งมากแล้วนะ ลองเล่นอีกรอบเพื่อเก็บคะแนนเต็มกันเลยดีไหม!`,
      mood: 'cheer',
    }
  }

  return {
    headline: `เก่งมากที่พยายามจนจบนะ${child}!`,
    subtext: `คณิตศาสตร์ต้องค่อยๆ ฝึกฝนนะคนเก่ง ลองเล่นใหม่อีกสักรอบ รับรองว่าจะทำได้ดีขึ้นแน่นอนครับ!`,
    mood: 'happy',
  }
}

export function getRandomCorrectMessage(name: string): string {
  const child = formatChildName(name)
  const index = Math.floor(Math.random() * CORRECT_TEMPLATES.length)
  return CORRECT_TEMPLATES[index](child)
}

export function getRandomEncouragingMessage(name: string): string {
  const child = formatChildName(name)
  const index = Math.floor(Math.random() * TRY_AGAIN_TEMPLATES.length)
  return TRY_AGAIN_TEMPLATES[index](child)
}

// Welcoming messages for standard visits
export const GENERAL_WELCOME_MESSAGES = [
  'สวัสดีครับคนเก่ง! พิมพ์ชื่อเล่นหรือฉายาในช่องด้านล่าง แล้วกดปุ่มเริ่มเล่นได้เลยนะ!',
  'ยินดีต้อนรับนะ! พิมพ์ชื่อของหนู แล้วมากดปุ่มเริ่มคิดเลขสนุกๆ ไปด้วยกันนะ!',
  'เย้ ดีใจจังที่ได้เจอกัน! บอกชื่อเล่นหนูหน่อยนะ แล้วกดปุ่มเริ่มเล่นกันเลยครับ!',
  'สวัสดีเพื่อนใหม่! พิมพ์ชื่อเล่นหรือฉายาเท่ๆ แล้วกดปุ่มเริ่มเล่นได้เลยนะ!',
]

export function getRandomWelcomeMessage(): string {
  const index = Math.floor(Math.random() * GENERAL_WELCOME_MESSAGES.length)
  return GENERAL_WELCOME_MESSAGES[index]
}

// Fun kid-friendly reactions when tapping/poking the mascot
export const MASCOT_POKE_REACTIONS = [
  'จั๊กจี้จังเลย ฮ่าๆ! พร้อมลุยคิดเลขหรือยังเอ่ย?',
  'ฮิๆ สะกิดเค้าเหรอ! สู้ๆ นะคนเก่ง เค้าคอยเชียร์อยู่นะ!',
  'เย้! แตะตัวเค้าแล้ว ขอส่งพลังคณิตศาสตร์ให้หนูนะ!',
  'จุ๊ๆ สมาธิดีมากๆ เลย ลุยข้อนี้กันต่อเลยครับ!',
  'ฮ่าๆๆ จั๊กจี้จัง! หนูเก่งที่สุดเลยนะ!',
]

export function getRandomPokeMessage(): string {
  const index = Math.floor(Math.random() * MASCOT_POKE_REACTIONS.length)
  return MASCOT_POKE_REACTIONS[index]
}
