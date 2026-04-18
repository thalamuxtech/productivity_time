import { db } from './db'
import { Task, PriorityLevel, ReminderFlag } from '@/types'
import { generateId } from './utils'

const sampleTasks: Array<{
  title: string
  description: string
  priority: PriorityLevel
  hoursFromNow: number
  estimatedDuration?: number
}> = [
  {
    title: 'Complete Q4 Financial Report',
    description: 'Prepare and submit the quarterly financial report with all necessary documentation and analysis.',
    priority: 'priority',
    hoursFromNow: 4,
    estimatedDuration: 180,
  },
  {
    title: 'Review Code Pull Requests',
    description: 'Review and approve pending pull requests from the development team. Focus on security and performance.',
    priority: 'high',
    hoursFromNow: 2,
    estimatedDuration: 60,
  },
  {
    title: 'Client Meeting - Project Kickoff',
    description: 'Initial meeting with new client to discuss project scope, timeline, and deliverables.',
    priority: 'high',
    hoursFromNow: 24,
    estimatedDuration: 90,
  },
  {
    title: 'Update Documentation',
    description: 'Update API documentation with new endpoints and authentication methods.',
    priority: 'medium',
    hoursFromNow: 48,
    estimatedDuration: 120,
  },
  {
    title: 'Team Stand-up Meeting',
    description: 'Daily team sync to discuss progress, blockers, and priorities.',
    priority: 'medium',
    hoursFromNow: 16,
    estimatedDuration: 15,
  },
  {
    title: 'Fix Critical Bug in Production',
    description: 'Address the authentication timeout issue reported by multiple users.',
    priority: 'high',
    hoursFromNow: 6,
    estimatedDuration: 120,
  },
  {
    title: 'Respond to Customer Support Tickets',
    description: 'Review and respond to pending support tickets in the queue.',
    priority: 'medium',
    hoursFromNow: 72,
    estimatedDuration: 45,
  },
  {
    title: 'Schedule Team Building Event',
    description: 'Plan and organize next month\'s team building activity. Get input from team members.',
    priority: 'low',
    hoursFromNow: 168,
    estimatedDuration: 30,
  },
  {
    title: 'Database Performance Optimization',
    description: 'Analyze slow queries and implement indexing improvements.',
    priority: 'medium',
    hoursFromNow: 96,
    estimatedDuration: 240,
  },
  {
    title: 'Prepare Monthly Newsletter',
    description: 'Draft and design the monthly company newsletter with team updates and announcements.',
    priority: 'low',
    hoursFromNow: 120,
    estimatedDuration: 60,
  },
  {
    title: 'Security Audit Review',
    description: 'Review security audit findings and create action plan for addressing vulnerabilities.',
    priority: 'high',
    hoursFromNow: 36,
    estimatedDuration: 180,
  },
  {
    title: 'Update Project Dependencies',
    description: 'Update all npm packages to latest stable versions and test for compatibility.',
    priority: 'low',
    hoursFromNow: 240,
    estimatedDuration: 90,
  },
]

export async function clearAllTasks() {
  try {
    await db.tasks.clear()
    localStorage.removeItem('todoapp_backup')
    console.log('✅ Cleared all tasks')
  } catch (error) {
    console.error('Failed to clear tasks:', error)
    throw error
  }
}

export async function seedDummyTasks() {
  try {
    // Clear existing tasks
    await db.tasks.clear()

    const now = Date.now()
    const reminderSounds = [
      'alarm-clock-beep',
      'digital-clock-beep',
      'alert-alarm',
      'classic-alarm',
      'critical-alarm',
      'digital-alarm-buzzer',
      'emergency-alert',
      'facility-alarm',
      'morning-clock-alarm',
      'vintage-warning',
    ]

    // Helper function to generate reminder flags for a task
    const generateReminderFlags = (index: number): ReminderFlag[] => {
      const flags: ReminderFlag[] = []

      // First task: priority with multiple reminders
      if (index === 0) {
        flags.push(
          { id: generateId(), label: '1 hour before', minutesBefore: 60, enabled: true },
          { id: generateId(), label: '30 minutes before', minutesBefore: 30, enabled: true },
          { id: generateId(), label: '15 minutes before', minutesBefore: 15, enabled: true }
        )
      }
      // High priority tasks: 1-2 reminders
      else if (index === 1 || index === 2) {
        flags.push(
          { id: generateId(), label: '2 hours before', minutesBefore: 120, enabled: true },
          { id: generateId(), label: '30 minutes before', minutesBefore: 30, enabled: true }
        )
      }
      // Some tasks with single reminder
      else if (index === 5 || index === 10) {
        flags.push(
          { id: generateId(), label: '1 day before', minutesBefore: 1440, enabled: true }
        )
      }
      // Some tasks with custom reminders
      else if (index === 8) {
        flags.push(
          { id: generateId(), label: '2 days before', minutesBefore: 2880, enabled: true },
          { id: generateId(), label: '4 hours before', minutesBefore: 240, enabled: false }
        )
      }

      return flags
    }

    const tasks: Task[] = sampleTasks.map((task, index) => ({
      id: generateId(),
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: 'todo',
      deadline: now + task.hoursFromNow * 60 * 60 * 1000,
      createdAt: now - Math.random() * 24 * 60 * 60 * 1000, // Random time in last 24h
      updatedAt: now,
      completedAt: null,
      tags: [],
      estimatedDuration: task.estimatedDuration || 0,
      notes: '',
      frequentReminder: index < 3, // First 3 tasks have frequent reminders
      frequentReminderInterval: index === 0 ? 15 : index === 1 ? 30 : 60, // Different intervals for variety
      reminderSound: reminderSounds[index % reminderSounds.length], // Distribute different sounds
      reminderFlags: generateReminderFlags(index),
    }))

    // Add all tasks
    await db.tasks.bulkAdd(tasks)

    // Also save to localStorage backup
    localStorage.setItem('todoapp_backup', JSON.stringify(tasks))

    console.log(`✅ Successfully seeded ${tasks.length} dummy tasks!`)
    return tasks.length
  } catch (error) {
    console.error('Failed to seed tasks:', error)
    throw error
  }
}
