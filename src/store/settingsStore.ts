import { create } from 'zustand'
import { db, AppSettings } from '@/lib/db'
import { DEFAULT_REMINDER_SOUND } from '@/constants/sounds'

interface SettingsStore {
  settings: AppSettings | null
  loading: boolean
  error: string | null
  loadSettings: () => Promise<void>
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>
}

const defaultSettings: AppSettings = {
  id: 'app-settings',
  theme: 'system',
  sortBy: 'deadline',
  sortOrder: 'asc',
  defaultView: 'all',
  notifications: true,
  soundEnabled: true,
  defaultReminderSound: DEFAULT_REMINDER_SOUND,
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: null,
  loading: false,
  error: null,

  loadSettings: async () => {
    set({ loading: true, error: null })
    try {
      const existing = await db.settings.get('app-settings')
      if (!existing) {
        await db.settings.add(defaultSettings)
        set({ settings: defaultSettings, loading: false })
        return
      }

      const normalized: AppSettings = {
        ...defaultSettings,
        ...existing,
      }

      if (!existing.defaultReminderSound) {
        await db.settings.update('app-settings', {
          defaultReminderSound: DEFAULT_REMINDER_SOUND,
        })
      }

      set({ settings: normalized, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load settings',
        loading: false,
      })
    }
  },

  updateSettings: async (updates: Partial<AppSettings>) => {
    const current = get().settings || defaultSettings
    const updated = { ...current, ...updates }
    await db.settings.update('app-settings', updates)
    set({ settings: updated })
  },
}))
