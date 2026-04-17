import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Maximize2, Minimize2, Plus, Minus } from 'lucide-react'

interface CountdownTimerStandaloneProps {
  onFullscreenChange?: (isFullscreen: boolean) => void
}

export default function CountdownTimerStandalone({ onFullscreenChange }: CountdownTimerStandaloneProps) {
  const [totalTime, setTotalTime] = useState(300000) // 5 min default
  const [timeLeft, setTimeLeft] = useState(300000)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isEditing, setIsEditing] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const endTimeRef = useRef<number>(0)

  const start = useCallback(() => {
    if (timeLeft <= 0) return
    endTimeRef.current = Date.now() + timeLeft
    intervalRef.current = setInterval(() => {
      const remaining = endTimeRef.current - Date.now()
      if (remaining <= 0) {
        setTimeLeft(0)
        setIsRunning(false)
        setIsFinished(true)
        if (intervalRef.current) clearInterval(intervalRef.current)
        // Play alarm sound
        try {
          const audio = new Audio('/sounds/alarm1.wav')
          audio.play().catch(() => {})
        } catch {}
      } else {
        setTimeLeft(remaining)
      }
    }, 50)
    setIsRunning(true)
    setIsEditing(false)
    setIsFinished(false)
  }, [timeLeft])

  const pause = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setTimeLeft(totalTime)
    setIsRunning(false)
    setIsFinished(false)
    setIsEditing(true)
  }, [totalTime])

  const adjustTime = (amount: number) => {
    if (!isEditing) return
    const newTime = Math.max(0, Math.min(86400000, totalTime + amount))
    setTotalTime(newTime)
    setTimeLeft(newTime)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    onFullscreenChange?.(!isFullscreen)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0
  const circumference = 2 * Math.PI * 90

  const presets = [
    { label: '1m', ms: 60000 },
    { label: '5m', ms: 300000 },
    { label: '10m', ms: 600000 },
    { label: '15m', ms: 900000 },
    { label: '25m', ms: 1500000 },
    { label: '30m', ms: 1800000 },
    { label: '45m', ms: 2700000 },
    { label: '1h', ms: 3600000 },
  ]

  const content = (
    <div className={`flex flex-col items-center ${isFullscreen ? 'justify-center min-h-screen p-8' : ''}`}>
      {/* Fullscreen close */}
      {isFullscreen && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={toggleFullscreen}
          className="absolute top-6 right-6 p-3 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-50"
        >
          <Minimize2 className="h-6 w-6" />
        </motion.button>
      )}

      {/* Timer Display */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className={`relative flex items-center justify-center rounded-full ${
          isFullscreen ? 'w-80 h-80 sm:w-96 sm:h-96' : 'w-56 h-56 sm:w-64 sm:h-64'
        }`}>
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100" cy="100" r="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-200 dark:text-slate-700"
            />
            <motion.circle
              cx="100" cy="100" r="90"
              fill="none"
              stroke={isFinished ? '#EF4444' : 'url(#countdownGradient)'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="countdownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6C5CE7" />
                <stop offset="100%" stopColor="#FF2D8A" />
              </linearGradient>
            </defs>
          </svg>

          <div className="text-center">
            {/* Time Adjustment Controls (when editing) */}
            {isEditing && (
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => adjustTime(-60000)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Minus className="h-5 w-5" />
                </motion.button>
                <div>
                  <motion.span
                    key={timeLeft}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className={`font-mono font-bold tracking-tight ${
                      isFullscreen ? 'text-5xl sm:text-6xl' : 'text-3xl sm:text-4xl'
                    } text-gray-900 dark:text-white`}
                  >
                    {formatTime(timeLeft)}
                  </motion.span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => adjustTime(60000)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </motion.button>
              </div>
            )}

            {!isEditing && (
              <motion.span
                key={Math.floor(timeLeft / 1000)}
                className={`font-mono font-bold tracking-tight ${
                  isFullscreen ? 'text-5xl sm:text-6xl' : 'text-3xl sm:text-4xl'
                } ${isFinished ? 'text-red-500 animate-pulse' : isRunning ? 'text-gradient' : 'text-gray-900 dark:text-white'}`}
              >
                {formatTime(timeLeft)}
              </motion.span>
            )}

            <p className="text-xs text-gray-400 mt-2 font-medium uppercase tracking-widest">
              {isFinished ? 'Time Up!' : 'Countdown'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Preset Buttons (when editing) */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap justify-center gap-2 mb-6 max-w-xs"
          >
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => { setTotalTime(preset.ms); setTimeLeft(preset.ms) }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  totalTime === preset.ms
                    ? 'bg-gradient-premium text-white shadow-premium'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Reset */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={reset}
          disabled={isEditing && !isFinished}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <RotateCcw className="h-5 w-5" />
        </motion.button>

        {/* Play / Pause */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={isRunning ? pause : start}
          disabled={timeLeft === 0 && isEditing}
          className={`flex h-18 w-18 items-center justify-center rounded-2xl shadow-fab transition-all ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
              : isFinished
                ? 'bg-gradient-premium hover:shadow-fab-hover'
                : 'bg-gradient-premium hover:shadow-fab-hover'
          } disabled:opacity-50`}
        >
          {isRunning ? (
            <Pause className="h-7 w-7 text-white" fill="currentColor" />
          ) : (
            <Play className="h-7 w-7 text-white ml-1" fill="currentColor" />
          )}
        </motion.button>

        {/* Fullscreen */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleFullscreen}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
        >
          <Maximize2 className="h-5 w-5" />
        </motion.button>
      </div>
    </div>
  )

  if (isFullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-white dark:bg-[#0A0A18] flex items-center justify-center"
      >
        {content}
      </motion.div>
    )
  }

  return content
}
