import { useEffect } from 'react'
import { useTaskStore } from '@/store/taskStore'
import { useUIStore } from '@/store/uiStore'
import { Task } from '@/types'
import { PRIORITY_CONFIG } from '@/constants'
import { isOverdue } from '@/lib/utils'

export function useTasks() {
  const { tasks, loading, loadTasks, getFilteredTasks } = useTaskStore()
  const { filter, sortBy, sortOrder, activeTab } = useUIStore()

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  // Get filtered tasks
  const filteredTasks = getFilteredTasks(filter)

  // Filter by active tab
  const tabFilteredTasks = filteredTasks.filter(task => {
    switch (activeTab) {
      case 'active':
        return task.status !== 'completed' && !isOverdue(task.deadline)
      case 'completed':
        return task.status === 'completed'
      case 'overdue':
        return task.status !== 'completed' && isOverdue(task.deadline)
      default:
        return true
    }
  })

  // Sort tasks
  const sortedTasks = [...tabFilteredTasks].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'deadline':
        comparison = a.deadline - b.deadline
        break
      case 'priority':
        comparison =
          PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order
        break
      case 'createdAt':
        comparison = a.createdAt - b.createdAt
        break
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  // Calculate counts for each tab
  const activeTasks = tasks.filter(
    t => t.status !== 'completed' && !isOverdue(t.deadline)
  )
  const completedTasks = tasks.filter(t => t.status === 'completed')
  const overdueTasks = tasks.filter(
    t => t.status !== 'completed' && isOverdue(t.deadline)
  )

  return {
    tasks: sortedTasks,
    allTasks: tasks,
    loading,
    counts: {
      active: activeTasks.length,
      completed: completedTasks.length,
      overdue: overdueTasks.length,
    },
  }
}

export function useTask(id: string): Task | undefined {
  const { tasks } = useTaskStore()
  return tasks.find(t => t.id === id)
}
