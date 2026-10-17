// Encouragement messages for individual correct answers
const CORRECT_TEMPLATES = [
  (name: string) => `เก่งมากเลยน้อง${name}! คิดเลขได้ไวสุดๆ`,
  (name: string) => `ถูกต้องนะคร้าบ! ยอดเยี่ยมมากน้อง${name}`,
  (name: string) => `ว้าว น้อง${name} ตอบเป๊ะมาก! ปรบมือรัวๆ`,
  (name: string) => `สุดยอดเลยน้อง${name}! ข้อนี้ไม่ยากสำหรับเราเลย`,
  (name: string) => `น้อง${name} ทำได้ดีมาก! กำลังมาแรงเลย`,
  (name: string) => `ตอบถูกอีกแล้ว! น้อง${name} สุดยอดนักคิดเลข`,
  (name: string) => `เท่มากน้อง${name}! สมาธิดีมากๆ`,
]

// Encouragement messages for when answered incorrect (to motivate them)
const TRY_AGAIN_TEMPLATES = [
  (name: string) => `ไม่เป็นไรนะน้อง${name} ข้อนี้เกือบถูกแล้ว ลองลุยข้อถัดไปกัน!`,
  (name: string) => `ฝึกฝนเรื่อยๆ นะน้อง${name} ค่อยๆ คิด เดี๋ยวก็เก่งขึ้นแน่นอน`,
  (name: string) => `สู้ๆ ครับน้อง${name} ตั้งสมาธิแล้วไปลุยข้อใหม่ด้วยกัน!`,
]

// Completion messages based on score
export function getCompletionMessage(name: string, score: number, total: number): {
  headline: string
  subtext: string
  mood: 'celebrate' | 'happy' | 'cheer'
} {
  const safeName = name.trim() || 'คนเก่ง'
  if (score === total) {
    return {
      headline: `สมบูรณ์แบบมากน้อง${safeName}! ได้คะแนนเต็มสิบเลย!`,
      subtext: `น้อง${safeName} เก่งคณิตศาสตร์มากๆ เลยครับ วันนี้พร้อมลุยโจทย์ใหม่ๆ อีกรอบไหมเอ่ย?`,
      mood: 'celebrate',
    }
  }

  if (score >= 8) {
    return {
      headline: `สุดยอดไปเลยน้อง${safeName}! ทำได้ยอดเยี่ยมมากๆ`,
      subtext: `คิดเลขได้แม่นยำและคล่องแคล่วมาก ฝึกบ่อยๆ แบบนี้รับรองเก่งขึ้นทุกวันแน่นอน!`,
      mood: 'celebrate',
    }
  }

  if (score >= 5) {
    return {
      headline: `ทำได้ดีมากครับน้อง${safeName}! ผ่านเกณฑ์สบายๆ`,
      subtext: `น้อง${safeName} เก่งมากแล้วนะ ลองเล่นอีกรอบเพื่อเก็บคะแนนเต็มสิบกันเลยดีไหม!`,
      mood: 'cheer',
    }
  }

  return {
    headline: `เก่งมากที่พยายามจนจบนะน้อง${safeName}!`,
    subtext: `คณิตศาสตร์ต้องค่อยๆ ฝึกฝนนะคนเก่ง ลองเล่นใหม่อีกสักรอบ รับรองว่าจะทำได้ดีขึ้นแน่นอนครับ!`,
    mood: 'happy',
  }
}

export function getRandomCorrectMessage(name: string): string {
  const safeName = name.trim() || 'คนเก่ง'
  const index = Math.floor(Math.random() * CORRECT_TEMPLATES.length)
  return CORRECT_TEMPLATES[index](safeName)
}

export function getRandomEncouragingMessage(name: string): string {
  const safeName = name.trim() || 'คนเก่ง'
  const index = Math.floor(Math.random() * TRY_AGAIN_TEMPLATES.length)
  return TRY_AGAIN_TEMPLATES[index](safeName)
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
