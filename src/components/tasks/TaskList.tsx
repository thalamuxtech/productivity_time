import { useTasks } from '@/hooks'
import TaskItem from './TaskItem'
import { motion, AnimatePresence } from 'framer-motion'
import { Inbox } from 'lucide-react'

export default function TaskList() {
  const { tasks, loading } = useTasks()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-primary-200 dark:border-primary-800" />
          <div className="absolute inset-0 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">Loading tasks...</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100 dark:bg-slate-800"
        >
          <Inbox className="h-10 w-10 text-gray-300 dark:text-gray-600" />
        </motion.div>
        <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">
          No tasks yet
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
          Tap the + button to create your first task and start being productive!
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.25,
              delay: index * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <TaskItem task={task} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
