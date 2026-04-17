import { create } from 'zustand'
import { Task, CreateTaskDTO, TaskFilter, TaskStats, PriorityLevel } from '@/types'
import { DEFAULT_REMINDER_SOUND } from '@/constants/sounds'
import { db } from '@/lib/db'
import { generateId, isOverdue } from '@/lib/utils'

interface TaskStore {
  tasks: Task[]
  loading: boolean
  error: string | null

  // Actions
  loadTasks: () => Promise<void>
  createTask: (dto: CreateTaskDTO) => Promise<Task>
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task>
  deleteTask: (id: string) => Promise<void>
  toggleTaskStatus: (id: string) => Promise<Task>
  setPriorityTask: (id: string) => Promise<Task>
  getPriorityTask: () => Task | null
  autoPromotePriorityTask: () => Promise<void>
  getFilteredTasks: (filter?: TaskFilter) => Task[]
  getTaskStats: () => TaskStats
  exportTasks: () => Promise<string>
  importTasks: (json: string) => Promise<number>
  clearCompleted: () => Promise<number>
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  loadTasks: async () => {
    set({ loading: true, error: null })
    try {
      const tasks = await db.tasks.toArray()
      set({ tasks, loading: false })
      // Auto-promote next priority task if current one is overdue
      await get().autoPromotePriorityTask()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load tasks',
        loading: false,
      })
    }
  },

  createTask: async (dto: CreateTaskDTO) => {
    const { tasks } = get()

    // Check if setting as priority and demote existing priority
    if (dto.priority === 'priority') {
      const currentPriority = tasks.find(t => t.priority === 'priority')
      if (currentPriority) {
        await get().updateTask(currentPriority.id, { priority: 'high' })
      }
    }

    const newTask: Task = {
      id: generateId(),
      title: dto.title,
      description: dto.description || '',
      priority: dto.priority,
      status: 'todo',
      deadline: dto.deadline,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      completedAt: null,
      tags: dto.tags || [],
      estimatedDuration: dto.estimatedDuration || 0,
      notes: dto.notes || '',
      frequentReminder: dto.frequentReminder || false,
      frequentReminderInterval: dto.frequentReminderInterval || 30,
      reminderSound: dto.reminderSound || DEFAULT_REMINDER_SOUND,
      reminderFlags: dto.reminderFlags || [],
    }

    await db.tasks.add(newTask)
    set({ tasks: [...tasks, newTask] })

    // Backup to localStorage
    localStorage.setItem('todoapp_backup', JSON.stringify([...tasks, newTask]))

    return newTask
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    const { tasks } = get()
    const taskIndex = tasks.findIndex(t => t.id === id)

    if (taskIndex === -1) {
      throw new Error('Task not found')
    }

    // If changing to priority, demote current priority
    if (updates.priority === 'priority') {
      const currentPriority = tasks.find(
        t => t.priority === 'priority' && t.id !== id
      )
      if (currentPriority) {
        await db.tasks.update(currentPriority.id, { priority: 'high' })
        const updatedTasks = tasks.map(t =>
          t.id === currentPriority.id ? { ...t, priority: 'high' as PriorityLevel } : t
        )
        set({ tasks: updatedTasks })
      }
    }

    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: Date.now(),
    }

    await db.tasks.update(id, updatedTask)

    const newTasks = [...tasks]
    newTasks[taskIndex] = updatedTask
    set({ tasks: newTasks })

    // Backup to localStorage
    localStorage.setItem('todoapp_backup', JSON.stringify(newTasks))

    return updatedTask
  },

  deleteTask: async (id: string) => {
    const { tasks } = get()
    await db.tasks.delete(id)
    const newTasks = tasks.filter(t => t.id !== id)
    set({ tasks: newTasks })

    // Backup to localStorage
    localStorage.setItem('todoapp_backup', JSON.stringify(newTasks))
  },

  toggleTaskStatus: async (id: string) => {
    const { tasks } = get()
    const task = tasks.find(t => t.id === id)

    if (!task) {
      throw new Error('Task not found')
    }

    const newStatus = task.status === 'completed' ? 'todo' : 'completed'
    const updates: Partial<Task> = {
      status: newStatus,
      completedAt: newStatus === 'completed' ? Date.now() : null,
    }

    return get().updateTask(id, updates)
  },

  setPriorityTask: async (id: string) => {
    const { tasks } = get()
    const task = tasks.find(t => t.id === id)

    if (!task) {
      throw new Error('Task not found')
    }

    if (task.status === 'completed') {
      throw new Error('Cannot set completed task as priority')
    }

    return get().updateTask(id, { priority: 'priority' })
  },

  getPriorityTask: () => {
    const { tasks } = get()
    return tasks.find(t => t.priority === 'priority' && t.status !== 'completed') || null
  },

  autoPromotePriorityTask: async () => {
    const { tasks } = get()
    const currentPriority = get().getPriorityTask()

    // If priority task is overdue, demote it and promote the next best task
    if (currentPriority && isOverdue(currentPriority.deadline)) {
      // Demote current priority task to high
      await get().updateTask(currentPriority.id, { priority: 'high' })

      // Find next best task: non-completed, non-overdue, highest priority, closest deadline
      const candidates = tasks
        .filter(
          t =>
            t.id !== currentPriority.id &&
            t.status !== 'completed' &&
            !isOverdue(t.deadline)
        )
        .sort((a, b) => {
          // First by priority (high > medium > low)
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          const priorityA = priorityOrder[a.priority as 'high' | 'medium' | 'low'] ?? 3
          const priorityB = priorityOrder[b.priority as 'high' | 'medium' | 'low'] ?? 3

          if (priorityA !== priorityB) {
            return priorityA - priorityB
          }

          // Then by closest deadline
          return a.deadline - b.deadline
        })

      // Promote the best candidate
      if (candidates.length > 0) {
        await get().updateTask(candidates[0].id, { priority: 'priority' })
      }
    }
  },

  getFilteredTasks: (filter?: TaskFilter) => {
    const { tasks } = get()

    if (!filter) return tasks

    return tasks.filter(task => {
      // Status filter
      if (filter.status) {
        const statuses = Array.isArray(filter.status)
          ? filter.status
          : [filter.status]
        if (!statuses.includes(task.status)) {
          return false
        }
      }

      // Priority filter
      if (filter.priority) {
        const priorities = Array.isArray(filter.priority)
          ? filter.priority
          : [filter.priority]
        if (!priorities.includes(task.priority)) {
          return false
        }
      }

      // Tags filter
      if (filter.tags && filter.tags.length > 0) {
        if (!filter.tags.some(tag => task.tags.includes(tag))) {
          return false
        }
      }

      // Search term
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase()
        if (
          !task.title.toLowerCase().includes(searchLower) &&
          !task.description.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }

      // Deadline filters
      if (filter.deadlineBefore && task.deadline > filter.deadlineBefore) {
        return false
      }

      if (filter.deadlineAfter && task.deadline < filter.deadlineAfter) {
        return false
      }

      return true
    })
  },

  getTaskStats: () => {
    const { tasks } = get()

    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'completed').length
    const active = tasks.filter(t => t.status !== 'completed').length
    const overdue = tasks.filter(
      t => t.deadline < Date.now() && t.status !== 'completed'
    ).length

    const completionRate = total > 0 ? (completed / total) * 100 : 0

    const completedTasks = tasks.filter(t => t.completedAt !== null)
    const averageCompletionTime =
      completedTasks.length > 0
        ? completedTasks.reduce(
            (acc, t) => acc + (t.completedAt! - t.createdAt),
            0
          ) / completedTasks.length
        : 0

    const tasksByPriority: Record<PriorityLevel, number> = {
      priority: tasks.filter(t => t.priority === 'priority').length,
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    }

    return {
      total,
      completed,
      active,
      overdue,
      completionRate,
      averageCompletionTime,
      tasksByPriority,
    }
  },

  exportTasks: async () => {
    const { tasks } = get()
    return JSON.stringify(tasks, null, 2)
  },

  importTasks: async (json: string) => {
    try {
      const importedTasks = JSON.parse(json) as Task[]

      // Validate tasks
      if (!Array.isArray(importedTasks)) {
        throw new Error('Invalid format: expected array of tasks')
      }

      // Add tasks to database
      await db.tasks.bulkAdd(importedTasks)

      // Reload tasks
      await get().loadTasks()

      return importedTasks.length
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to import tasks'
      )
    }
  },

  clearCompleted: async () => {
    const { tasks } = get()
    const completedIds = tasks
      .filter(t => t.status === 'completed')
      .map(t => t.id)

    await db.tasks.bulkDelete(completedIds)
    await get().loadTasks()

    return completedIds.length
  },
}))
