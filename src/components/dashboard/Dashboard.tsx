import { useUIStore } from '@/store/uiStore'
import { Tabs } from '@/components/ui/Tabs'
import { Plus } from 'lucide-react'
import TaskSummary from './TaskSummary'
import PriorityTaskCard from '../tasks/PriorityTaskCard'
import TaskFilters from '../tasks/TaskFilters'
import TaskList from '../tasks/TaskList'
import TimerHub from '../timer/TimerHub'
import { useTasks } from '@/hooks'
import { useAutoPriorityPromotion } from '@/hooks/useAutoPriorityPromotion'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const { openTaskModal, activeTab, setActiveTab } = useUIStore()
  const { counts } = useTasks()

  useAutoPriorityPromotion()

  const tabs = [
    { id: 'active', label: 'Active', count: counts.active },
    { id: 'completed', label: 'Completed', count: counts.completed },
    { id: 'overdue', label: 'Overdue', count: counts.overdue },
  ]

  return (
    <div className="relative min-h-screen">
      {/* Background mesh gradient */}
      <div className="fixed inset-0 bg-gradient-mesh dark:bg-gradient-mesh-dark pointer-events-none" />
      <div className="fixed inset-0 bg-dot-pattern bg-dot-pattern opacity-30 dark:opacity-10 pointer-events-none" />

      <div className="relative container mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24">
        <div className="space-y-6 sm:space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pt-2"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-gray-900 dark:text-white">
              Your Workspace
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
              Stay focused. Track progress. Get things done.
            </p>
          </motion.div>

          {/* Task Summary */}
          <TaskSummary />

          {/* Priority Task */}
          <PriorityTaskCard />

          {/* Timer Hub */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <TimerHub />
          </motion.div>

          {/* Filters */}
          <TaskFilters />

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={(tab) => setActiveTab(tab as 'active' | 'completed' | 'overdue')}
            />
          </motion.div>

          {/* Task List */}
          <div>
            <TaskList />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-30"
      >
        <button
          onClick={() => openTaskModal()}
          className="group relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-premium shadow-fab hover:shadow-fab-hover transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Plus className="h-6 w-6 sm:h-7 sm:w-7 text-white transition-transform group-hover:rotate-90 duration-300" />
          <div className="absolute -inset-2 rounded-3xl bg-gradient-premium opacity-20 blur-xl -z-10 group-hover:opacity-30 transition-opacity" />
        </button>
      </motion.div>
    </div>
  )
}
