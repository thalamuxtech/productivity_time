import { useTaskStore } from '@/store/taskStore'
import CountdownTimer from '../countdown/CountdownTimer'
import ProgressRing from '../countdown/ProgressRing'
import { formatDate } from '@/lib/utils'
import { Calendar, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PriorityTaskCard() {
  const { getPriorityTask } = useTaskStore()
  const priorityTask = getPriorityTask()

  if (!priorityTask) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative overflow-hidden rounded-3xl border border-primary-200/50 dark:border-primary-800/30">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-accent-500/5 to-primary-500/5 dark:from-primary-500/10 dark:via-accent-500/10 dark:to-primary-500/10" />
        <div className="absolute inset-0 animated-gradient opacity-[0.03]" />

        {/* Content */}
        <div className="relative p-5 sm:p-8">
          {/* Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            className="mb-5 inline-flex items-center gap-2 rounded-xl bg-gradient-premium px-4 py-2 text-xs font-bold text-white uppercase tracking-wider shadow-premium"
          >
            <Zap className="h-3.5 w-3.5" fill="currentColor" />
            Priority Focus
          </motion.div>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Progress Ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-shrink-0"
            >
              <ProgressRing
                createdAt={priorityTask.createdAt}
                deadline={priorityTask.deadline}
                size={120}
              />
            </motion.div>

            {/* Task Info */}
            <div className="flex-1 min-w-0">
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl font-extrabold font-display text-gray-900 dark:text-white mb-2"
              >
                {priorityTask.title}
              </motion.h2>

              {priorityTask.description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base leading-relaxed"
                >
                  {priorityTask.description}
                </motion.p>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <CountdownTimer deadline={priorityTask.deadline} size="lg" />
                </div>

                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Due: {formatDate(priorityTask.deadline)}
                  </span>
                </div>
              </div>

              {priorityTask.estimatedDuration > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-slate-700/50 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
                  Est. {priorityTask.estimatedDuration} min
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
