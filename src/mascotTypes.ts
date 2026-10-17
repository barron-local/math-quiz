export type MascotType = 'boy' | 'girl' | 'cat' | 'bear' | 'bunny' | 'robot'

export interface MascotConfig {
  type: MascotType
  skinColor: string
  shirtColor: string
}

export interface MascotOption {
  id: MascotType
  name: string
  tag: string
  defaultSkin: string
  defaultShirt: string
}

export const MASCOT_OPTIONS: MascotOption[] = [
  {
    id: 'boy',
    name: 'น้องบอย',
    tag: 'นักคิดตัวน้อย',
    defaultSkin: '#FFDCB2',
    defaultShirt: '#2383E2',
  },
  {
    id: 'girl',
    name: 'น้องมินิ',
    tag: 'สาวน้อยสดใส',
    defaultSkin: '#FFDCB2',
    defaultShirt: '#F06595',
  },
  {
    id: 'cat',
    name: 'น้องเหมียว',
    tag: 'แมวน้อยแสนซน',
    defaultSkin: '#FFE082',
    defaultShirt: '#FF922B',
  },
  {
    id: 'bear',
    name: 'พี่หมีเท็ดดี้',
    tag: 'พี่หมีใจดี',
    defaultSkin: '#845338',
    defaultShirt: '#2F9E44',
  },
  {
    id: 'bunny',
    name: 'น้องต่ายน้อย',
    tag: 'กระต่ายหูยาว',
    defaultSkin: '#F8F9FA',
    defaultShirt: '#845EF7',
  },
  {
    id: 'robot',
    name: 'น้องโรโบ้',
    tag: 'หุ่นยนต์อัจฉริยะ',
    defaultSkin: '#CFD8DC',
    defaultShirt: '#12B886',
  },
]

export const PRESET_SKIN_COLORS = [
  { name: 'ผิวเนื้ออ่อน', color: '#FFDCB2' },
  { name: 'ผิวสองสี', color: '#F3C088' },
  { name: 'ผิวแทน', color: '#D69B60' },
  { name: 'ผิวเข้ม', color: '#8D5524' },
  { name: 'ขาวปุยฝ้าย', color: '#F8F9FA' },
  { name: 'ครีมทอง', color: '#FFE082' },
  { name: 'ช็อกโกแลต', color: '#845338' },
  { name: 'ชมพูพาสเทล', color: '#FFD1DC' },
  { name: 'ฟ้ามิ้นต์', color: '#B2EBF2' },
  { name: 'ม่วงลาเวนเดอร์', color: '#E0BBE4' },
  { name: 'เทาโรบอท', color: '#CFD8DC' },
]

export const PRESET_SHIRT_COLORS = [
  { name: 'น้ำเงินคลาสสิก', color: '#2383E2' },
  { name: 'แดงเชอร์รี่', color: '#E03E3E' },
  { name: 'ส้มสดใส', color: '#FF922B' },
  { name: 'เหลืองสว่าง', color: '#FAB005' },
  { name: 'เขียวมรกต', color: '#2F9E44' },
  { name: 'มิ้นต์สดชื่น', color: '#12B886' },
  { name: 'ชมพูหวาน', color: '#F06595' },
  { name: 'ม่วงแฟนตาซี', color: '#845EF7' },
  { name: 'ฟ้าน้ำทะเล', color: '#20C997' },
  { name: 'คอรัลพีช', color: '#FF6B6B' },
  { name: 'สเลทเท่ๆ', color: '#495057' },
  { name: 'เขียวมะนาว', color: '#94D82D' },
]

export const DEFAULT_MASCOT_CONFIG: MascotConfig = {
  type: 'boy',
  skinColor: '#FFDCB2',
  shirtColor: '#2383E2',
}

const STORAGE_KEY = 'math_quiz_mascot_config'

export function loadSavedMascotConfig(): MascotConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed.type === 'string' && typeof parsed.skinColor === 'string' && typeof parsed.shirtColor === 'string') {
        return parsed as MascotConfig
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_MASCOT_CONFIG
}

export function saveMascotConfig(config: MascotConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch {
    // ignore
  }
}
