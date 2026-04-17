import { Task } from '@/types'
import { Badge } from '@/components/ui'
import { useTaskStore } from '@/store/taskStore'
import { useUIStore } from '@/store/uiStore'
import { toast } from '@/components/ui/Toast'
import { formatDate, isOverdue } from '@/lib/utils'
import { Check, Edit2, Trash2, Star, Calendar, Bell, Flag } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface TaskItemProps {
  task: Task
}

export default function TaskItem({ task }: TaskItemProps) {
  const { toggleTaskStatus, deleteTask, setPriorityTask } = useTaskStore()
  const { openTaskModal } = useUIStore()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggle = async () => {
    try {
      await toggleTaskStatus(task.id)
      if (task.status !== 'completed') {
        toast.success('Task completed!')
      }
    } catch {
      toast.error('Failed to update task')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return

    setIsDeleting(true)
    try {
      await deleteTask(task.id)
      toast.success('Task deleted')
    } catch {
      toast.error('Failed to delete task')
      setIsDeleting(false)
    }
  }

  const handleSetPriority = async () => {
    try {
      await setPriorityTask(task.id)
      toast.success('Priority task updated!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to set priority')
    }
  }

  const overdue = isOverdue(task.deadline) && task.status !== 'completed'
  const hasEnabledFlags = task.reminderFlags?.some(flag => flag.enabled) || false
  const isCompleted = task.status === 'completed'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50, scale: 0.95 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className={`group relative bg-white dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 border transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.995] ${
          overdue
            ? 'border-red-200 dark:border-red-800/40 bg-red-50/30 dark:bg-red-900/5'
            : 'border-gray-100 dark:border-slate-700/50'
        } ${isCompleted ? 'opacity-60' : ''}`}
      >
        {/* Overdue indicator */}
        {overdue && (
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-rose-400 rounded-t-2xl" />
        )}

        <div className="flex items-start gap-3 sm:gap-4">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200 touch-target ${
              isCompleted
                ? 'border-emerald-500 bg-emerald-500'
                : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50 dark:border-gray-600 dark:hover:border-primary-500 dark:hover:bg-primary-900/20'
            }`}
            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
              </motion.div>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`text-base sm:text-lg font-semibold leading-tight ${
                  isCompleted
                    ? 'line-through text-gray-400 dark:text-gray-500'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {task.title}
              </h3>
              <Badge variant="priority" priority={task.priority} />
            </div>

            {task.description && (
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}

            <div className="mt-3 flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
                <span className={overdue ? 'text-red-500 font-semibold' : ''}>
                  {formatDate(task.deadline)}
                  {overdue && ' (Overdue)'}
                </span>
              </div>
              {task.frequentReminder && (
                <div className="flex items-center gap-1.5 text-primary-500" title={`Reminders every ${task.frequentReminderInterval} min`}>
                  <Bell className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">Every {task.frequentReminderInterval}m</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions - visible on hover (desktop) or always (mobile) */}
          <div className="flex gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
            <button
              onClick={() => openTaskModal(task.id)}
              className={`rounded-xl p-2 transition-all touch-target ${
                hasEnabledFlags
                  ? 'text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              aria-label="Configure reminder flags"
              title={
                hasEnabledFlags
                  ? `${task.reminderFlags.filter(f => f.enabled).length} flag(s) active`
                  : 'Set reminder flags'
              }
            >
              <Flag className="h-4 w-4" fill={hasEnabledFlags ? 'currentColor' : 'none'} />
            </button>
            {task.priority !== 'priority' && !isCompleted && (
              <button
                onClick={handleSetPriority}
                className="rounded-xl p-2 text-gray-400 hover:bg-accent-50 hover:text-accent-500 dark:hover:bg-accent-900/20 transition-all touch-target"
                aria-label="Set as priority"
                title="Set as priority task"
              >
                <Star className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => openTaskModal(task.id)}
              className="rounded-xl p-2 text-gray-400 hover:bg-primary-50 hover:text-primary-500 dark:hover:bg-primary-900/20 transition-all touch-target"
              aria-label="Edit task"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-all touch-target disabled:opacity-50"
              aria-label="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
