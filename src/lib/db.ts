import Dexie, { Table } from 'dexie'
import { Task } from '@/types'
import { DEFAULT_REMINDER_SOUND } from '@/constants/sounds'

export interface AppSettings {
  id: string
  theme: 'light' | 'dark' | 'system'
  sortBy: 'deadline' | 'priority' | 'createdAt'
  sortOrder: 'asc' | 'desc'
  defaultView: 'all' | 'active' | 'completed'
  notifications: boolean
  soundEnabled: boolean
  defaultReminderSound: string
}

export class TodoDatabase extends Dexie {
  tasks!: Table<Task, string>
  settings!: Table<AppSettings, string>

  constructor() {
    super('TodoAppDB')

    this.version(1).stores({
      tasks: 'id, priority, status, deadline, createdAt, *tags',
      settings: 'id',
    })
  }
}

export const db = new TodoDatabase()

// Initialize default settings
export async function initializeSettings() {
  const existing = await db.settings.get('app-settings')

  const defaults: AppSettings = {
    id: 'app-settings',
    theme: 'system',
    sortBy: 'deadline',
    sortOrder: 'asc',
    defaultView: 'all',
    notifications: true,
    soundEnabled: true,
    defaultReminderSound: DEFAULT_REMINDER_SOUND,
  }

  if (!existing) {
    await db.settings.add(defaults)
    return
  }

  const updates: Partial<AppSettings> = {}
  if (!existing.defaultReminderSound) {
    updates.defaultReminderSound = DEFAULT_REMINDER_SOUND
  }
  if (existing.soundEnabled === undefined) {
    updates.soundEnabled = defaults.soundEnabled
  }
  if (existing.notifications === undefined) {
    updates.notifications = defaults.notifications
  }

  if (Object.keys(updates).length > 0) {
    await db.settings.update('app-settings', updates)
  }
}

// Initialize DB
initializeSettings().catch(console.error)
