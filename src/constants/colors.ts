export const THEME_COLORS = {
  light: {
    background: '#F9FAFB',
    surface: '#FFFFFF',
    primary: '#6366F1',
    accent: '#EC4899',
    text: '#111827',
    textSecondary: '#4B5563',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    primary: '#6366F1',
    accent: '#EC4899',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
  },
} as const

export const COUNTDOWN_COLORS = {
  safe: '#10B981', // > 24 hours
  warning: '#F59E0B', // 6-24 hours
  urgent: '#F97316', // 1-6 hours
  danger: '#EF4444', // < 1 hour or overdue
} as const
