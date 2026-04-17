import { useEffect, useRef } from 'react'
import { useTaskStore } from '@/store/taskStore'
import { DEFAULT_REMINDER_SOUND, playReminderSound } from '@/constants/sounds'
import { Task } from '@/types'
import { useSettingsStore } from '@/store/settingsStore'

interface ReminderState {
  [taskId: string]: number // timestamp of last reminder
}

export function useTaskReminders() {
  const { tasks } = useTaskStore()
  const { settings } = useSettingsStore()
  const lastRemindersRef = useRef<ReminderState>({})
  const flagRemindersRef = useRef<Record<string, Record<string, number>>>({})
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Request notification permission on mount
    if (
      settings?.notifications !== false &&
      'Notification' in window &&
      Notification.permission === 'default'
    ) {
      Notification.requestPermission()
    }

    // Check for reminders every 30 seconds
    intervalRef.current = setInterval(() => {
      checkAndTriggerReminders()
    }, 30000) // Check every 30 seconds

    // Initial check
    checkAndTriggerReminders()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [settings, tasks])

  const checkAndTriggerReminders = () => {
    const now = Date.now()
    const activeTasks = tasks.filter(
      (task) => task.status !== 'completed'
    )

    activeTasks.forEach((task) => {
      if (task.frequentReminder) {
        const lastReminder = lastRemindersRef.current[task.id] || 0
        const intervalMs = task.frequentReminderInterval * 60 * 1000 // Convert minutes to ms
        const timeSinceLastReminder = now - lastReminder

        // Trigger reminder if enough time has passed
        if (intervalMs > 0 && timeSinceLastReminder >= intervalMs) {
          triggerReminder(task)
          lastRemindersRef.current[task.id] = now
        }
      }

      const enabledFlags = task.reminderFlags?.filter(flag => flag.enabled) || []
      if (enabledFlags.length === 0 || task.deadline <= now) {
        return
      }

      enabledFlags.forEach((flag) => {
        const triggerTime = task.deadline - flag.minutesBefore * 60 * 1000
        if (now < triggerTime) return

        const intervalMinutes = task.frequentReminderInterval || 30
        const intervalMs = Math.max(intervalMinutes, 1) * 60 * 1000
        const lastFlagReminder = flagRemindersRef.current[task.id]?.[flag.id] || 0
        const timeSinceLast = now - lastFlagReminder

        if (timeSinceLast >= intervalMs) {
          triggerReminder(task)
          if (!flagRemindersRef.current[task.id]) {
            flagRemindersRef.current[task.id] = {}
          }
          flagRemindersRef.current[task.id][flag.id] = now
        }
      })
    })
  }

  const triggerReminder = (task: Task) => {
    const soundId = task.reminderSound || settings?.defaultReminderSound || DEFAULT_REMINDER_SOUND

    if (settings?.soundEnabled !== false) {
      // Play sound
      playReminderSound(soundId)
    }

    // Show browser notification
    if (
      settings?.notifications !== false &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      const timeUntilDeadline = task.deadline - Date.now()
      const hoursLeft = Math.floor(timeUntilDeadline / (1000 * 60 * 60))
      const minutesLeft = Math.floor((timeUntilDeadline % (1000 * 60 * 60)) / (1000 * 60))

      new Notification(`⏰ Reminder: ${task.title}`, {
        body: `Due in ${hoursLeft}h ${minutesLeft}m\n${task.description || 'No description'}`,
        icon: '/vite.svg',
        tag: task.id,
        requireInteraction: false,
      })
    }

    // Log to console for debugging
    console.log(`🔔 Reminder triggered for task: ${task.title}`)
  }

  return null
}
