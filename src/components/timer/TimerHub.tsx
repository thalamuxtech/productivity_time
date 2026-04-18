import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Clock, ChevronDown } from 'lucide-react'
import Stopwatch from './Stopwatch'
import CountdownTimerStandalone from './CountdownTimerStandalone'

type TimerMode = 'stopwatch' | 'countdown'

export default function TimerHub() {
  const [mode, setMode] = useState<TimerMode>('stopwatch')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (isFullscreen) {
    return mode === 'stopwatch'
      ? <Stopwatch onFullscreenChange={setIsFullscreen} />
      : <CountdownTimerStandalone onFullscreenChange={setIsFullscreen} />
  }

  return (
    <div className="relative bg-white dark:bg-slate-800/80 rounded-3xl border border-gray-100 dark:border-slate-700/50 shadow-card overflow-hidden">
      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-premium opacity-60" />

      {/* Collapsible Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-4 pb-3 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-premium shadow-premium">
            <Timer className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold font-display text-gray-900 dark:text-white">
              Timer & Stopwatch
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              {isCollapsed ? 'Tap to expand' : `${mode === 'stopwatch' ? 'Stopwatch' : 'Countdown'} active`}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ duration: 0.3 }}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {/* Mode Selector */}
            <div className="px-4">
              <div className="flex gap-2 p-1 rounded-2xl bg-gray-100/80 dark:bg-slate-700/50">
                <button
                  onClick={() => setMode('stopwatch')}
                  className={`relative flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200`}
                >
                  {mode === 'stopwatch' && (
                    <motion.div
                      layoutId="timerModeTab"
                      className="absolute inset-0 rounded-xl bg-white shadow-card dark:bg-slate-600"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Timer className={`h-4 w-4 relative z-10 ${mode === 'stopwatch' ? 'text-primary-500' : 'text-gray-400'}`} />
                  <span className={`relative z-10 ${mode === 'stopwatch' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                    Stopwatch
                  </span>
                </button>
                <button
                  onClick={() => setMode('countdown')}
                  className={`relative flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200`}
                >
                  {mode === 'countdown' && (
                    <motion.div
                      layoutId="timerModeTab"
                      className="absolute inset-0 rounded-xl bg-white shadow-card dark:bg-slate-600"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Clock className={`h-4 w-4 relative z-10 ${mode === 'countdown' ? 'text-accent-500' : 'text-gray-400'}`} />
                  <span className={`relative z-10 ${mode === 'countdown' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                    Countdown
                  </span>
                </button>
              </div>
            </div>

            {/* Timer Content */}
            <div className="p-6 pt-4">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {mode === 'stopwatch' ? (
                  <Stopwatch onFullscreenChange={setIsFullscreen} />
                ) : (
                  <CountdownTimerStandalone onFullscreenChange={setIsFullscreen} />
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
