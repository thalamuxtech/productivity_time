export type PriorityLevel = 'priority' | 'high' | 'medium' | 'low'
export type TaskStatus = 'todo' | 'in-progress' | 'completed'

export interface ReminderFlag {
  id: string
  label: string
  minutesBefore: number
  enabled: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  priority: PriorityLevel
  status: TaskStatus
  deadline: number
  createdAt: number
  updatedAt: number
  completedAt: number | null
  tags: string[]
  estimatedDuration: number
  notes: string
  frequentReminder: boolean
  frequentReminderInterval: number
  reminderSound: string
  reminderFlags: ReminderFlag[]
}

export interface CreateTaskDTO {
  title: string
  description?: string
  priority: PriorityLevel
  deadline: number
  tags?: string[]
  estimatedDuration?: number
  notes?: string
  frequentReminder?: boolean
  frequentReminderInterval?: number
  reminderSound?: string
  reminderFlags?: ReminderFlag[]
}

export interface TaskFilter {
  status?: TaskStatus | TaskStatus[]
  priority?: PriorityLevel | PriorityLevel[]
  tags?: string[]
  searchTerm?: string
  deadlineBefore?: number
  deadlineAfter?: number
}

export interface TaskStats {
  total: number
  completed: number
  active: number
  overdue: number
  completionRate: number
  averageCompletionTime: number
  tasksByPriority: Record<PriorityLevel, number>
}

export interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
  isOverdue: boolean
}
