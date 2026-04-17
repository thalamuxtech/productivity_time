import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface Tab {
  id: string
  label: string
  count?: number
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-2 p-1 rounded-2xl bg-gray-100/80 dark:bg-slate-800/80 backdrop-blur-sm">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200 touch-target',
              isActive
                ? 'text-primary-600 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl bg-white shadow-card dark:bg-slate-700"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
            {tab.count !== undefined && (
              <motion.span
                key={tab.count}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={cn(
                  'relative z-10 min-w-[20px] rounded-full px-1.5 py-0.5 text-[11px] font-bold text-center',
                  isActive
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300'
                    : 'bg-gray-200 text-gray-500 dark:bg-slate-700 dark:text-gray-400'
                )}
              >
                {tab.count}
              </motion.span>
            )}
          </button>
        )
      })}
    </div>
  )
}
