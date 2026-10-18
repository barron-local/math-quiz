export type QuizTheme = 'classic' | 'halloween' | 'christmas' | 'space' | 'candyland'

export interface ThemeMeta {
  id: QuizTheme
  name: string
  icon: string
  shortName: string
  tagline: string
  previewColor: string
  borderColor: string
  accentColor: string
}

export const QUIZ_THEMES: ThemeMeta[] = [
  {
    id: 'classic',
    name: 'คลาสสิก คลีน',
    shortName: 'คลาสสิก',
    icon: '✏️',
    tagline: 'เรียบง่าย สบายตา สมาธิเต็มร้อย',
    previewColor: '#2383E2',
    borderColor: 'var(--notion-border)',
    accentColor: '#2383E2',
  },
  {
    id: 'halloween',
    name: 'ฮาโลวีนแฟนตาซี',
    shortName: 'ฮาโลวีน',
    icon: '🎃',
    tagline: 'ฟักทอง ผีน้อยน่ารัก และค้างคาวเริงร่า',
    previewColor: '#F76707',
    borderColor: '#F76707',
    accentColor: '#7048E8',
  },
  {
    id: 'christmas',
    name: 'คริสต์มาสสุขสันต์',
    shortName: 'คริสต์มาส',
    icon: '🎄',
    tagline: 'เกล็ดหิมะ กิ่งสน และกล่องของขวัญ',
    previewColor: '#E03131',
    borderColor: '#E03131',
    accentColor: '#2B8A3E',
  },
  {
    id: 'space',
    name: 'ท่องอวกาศกาแล็กซี',
    shortName: 'อวกาศ',
    icon: '🚀',
    tagline: 'ดวงดาวระยิบระยับ จรวดจิ๋ว และดาวเคราะห์',
    previewColor: '#4C6EF5',
    borderColor: '#4C6EF5',
    accentColor: '#9775FA',
  },
  {
    id: 'candyland',
    name: 'ดินแดนขนมหวาน',
    shortName: 'ขนมหวาน',
    icon: '🍭',
    tagline: 'สายรุ้ง อมยิ้ม และเค้กแสนหวาน',
    previewColor: '#F06595',
    borderColor: '#F06595',
    accentColor: '#22B8CF',
  },
]

const THEME_STORAGE_KEY = 'math_quiz_active_theme'

export function loadSavedTheme(): QuizTheme {
  try {
    if (typeof window === 'undefined') return 'classic'
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as QuizTheme
    if (saved && QUIZ_THEMES.some((t) => t.id === saved)) {
      return saved
    }
  } catch {}
  return 'classic'
}

export function saveTheme(theme: QuizTheme): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    }
  } catch {}
}
