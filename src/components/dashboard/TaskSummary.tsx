import { useTaskStore } from '@/store/taskStore'
import { CheckCircle2, Circle, AlertCircle, ListTodo } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TaskSummary() {
  const { getTaskStats } = useTaskStore()
  const stats = getTaskStats()

  const cards = [
    {
      title: 'Total',
      value: stats.total,
      icon: ListTodo,
      gradient: 'from-blue-500 to-cyan-400',
      bgGlow: 'bg-blue-500',
      iconBg: 'bg-blue-50 dark:bg-blue-900/30',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Active',
      value: stats.active,
      icon: Circle,
      gradient: 'from-amber-500 to-orange-400',
      bgGlow: 'bg-amber-500',
      iconBg: 'bg-amber-50 dark:bg-amber-900/30',
      iconColor: 'text-amber-500',
    },
    {
      title: 'Done',
      value: stats.completed,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-green-400',
      bgGlow: 'bg-emerald-500',
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      gradient: 'from-red-500 to-rose-400',
      bgGlow: 'bg-red-500',
      iconBg: 'bg-red-50 dark:bg-red-900/30',
      iconColor: 'text-red-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.4 }}
        >
          <div className="relative group bg-white dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-slate-700/50 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
            {/* Subtle gradient accent */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-80`} />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {card.title}
                </p>
                <motion.div
                  key={card.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl sm:text-3xl font-extrabold font-display text-gray-900 dark:text-white"
                >
                  {card.value}
                </motion.div>
              </div>
              <div className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl ${card.iconBg}`}>
                <card.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${card.iconColor}`} />
              </div>
            </div>

            {/* Hover glow */}
            <div className={`absolute -bottom-8 -right-8 w-24 h-24 ${card.bgGlow} opacity-0 group-hover:opacity-5 rounded-full blur-2xl transition-opacity duration-500`} />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
