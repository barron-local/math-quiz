import { describe, expect, it } from 'bun:test'
import { formatChildName, getCompletionMessage } from './encouragements'

describe('formatChildName', () => {
  it('formats empty or "คนเก่ง" as "คนเก่ง"', () => {
    expect(formatChildName('')).toBe('คนเก่ง')
    expect(formatChildName('   ')).toBe('คนเก่ง')
    expect(formatChildName('คนเก่ง')).toBe('คนเก่ง')
  })

  it('prefixes "น้อง" when child name does not have it', () => {
    expect(formatChildName('บอส')).toBe('น้องบอส')
    expect(formatChildName('  มะลิ  ')).toBe('น้องมะลิ')
  })

  it('does NOT add double "น้อง" if user already typed "น้อง"', () => {
    expect(formatChildName('น้องบอส')).toBe('น้องบอส')
    expect(formatChildName('น้องปุณณ์')).toBe('น้องปุณณ์')
  })
})

describe('getCompletionMessage', () => {
  it('displays "ได้คะแนนเต็มเลย!" for 1 / 1 without saying "เต็มสิบ"', () => {
    const res = getCompletionMessage('น้องบอส', 1, 1)
    expect(res.headline).toBe('สมบูรณ์แบบมากน้องบอส! ตอบถูกเป๊ะ ได้คะแนนเต็มเลย!')
    expect(res.headline).not.toContain('เต็มสิบ')
  })

  it('displays "ได้คะแนนเต็ม 20 คะแนนเลย!" for 20 / 20 without saying "เต็มสิบ"', () => {
    const res = getCompletionMessage('บอส', 20, 20)
    expect(res.headline).toBe('สมบูรณ์แบบมากน้องบอส! ได้คะแนนเต็ม 20 คะแนนเลย!')
    expect(res.headline).not.toContain('เต็มสิบ')
  })

  it('handles empty name cleanly as "คนเก่ง"', () => {
    const res = getCompletionMessage('', 1, 1)
    expect(res.headline).toBe('สมบูรณ์แบบมากคนเก่ง! ตอบถูกเป๊ะ ได้คะแนนเต็มเลย!')
    expect(res.headline).not.toContain('น้องคนเก่ง')
  })

  it('calculates score based on percentage (80% and 50%)', () => {
    // 8 out of 10 = 80%
    const res80 = getCompletionMessage('บอส', 8, 10)
    expect(res80.headline).toContain('สุดยอดไปเลยน้องบอส')

    // 16 out of 20 = 80%
    const res80_20 = getCompletionMessage('บอส', 16, 20)
    expect(res80_20.headline).toContain('สุดยอดไปเลยน้องบอส')

    // 5 out of 10 = 50%
    const res50 = getCompletionMessage('บอส', 5, 10)
    expect(res50.headline).toContain('ทำได้ดีมากครับน้องบอส')

    // 10 out of 20 = 50%
    const res50_20 = getCompletionMessage('บอส', 10, 20)
    expect(res50_20.headline).toContain('ทำได้ดีมากครับน้องบอส')
  })
})
