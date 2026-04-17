import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Flag, Maximize2, Minimize2 } from 'lucide-react'

interface Lap {
  id: number
  time: number
  delta: number
}

interface StopwatchProps {
  onFullscreenChange?: (isFullscreen: boolean) => void
}

export default function Stopwatch({ onFullscreenChange }: StopwatchProps) {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<Lap[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const accumulatedRef = useRef<number>(0)

  const start = useCallback(() => {
    startTimeRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      setTime(accumulatedRef.current + (Date.now() - startTimeRef.current))
    }, 10)
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    accumulatedRef.current += Date.now() - startTimeRef.current
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setTime(0)
    setIsRunning(false)
    setLaps([])
    accumulatedRef.current = 0
  }, [])

  const addLap = useCallback(() => {
    const lastLapTime = laps.length > 0 ? laps[0].time : 0
    setLaps(prev => [{
      id: prev.length + 1,
      time,
      delta: time - lastLapTime,
    }, ...prev])
  }, [time, laps])

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
    const centiseconds = Math.floor((ms % 1000) / 10)

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
  }

  const formatLapTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const centiseconds = Math.floor((ms % 1000) / 10)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
  }

  const content = (
    <div className={`flex flex-col items-center ${isFullscreen ? 'justify-center min-h-screen p-8' : ''}`}>
      {/* Fullscreen close button */}
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
        {/* Glow ring */}
        <div className={`absolute inset-0 rounded-full ${isRunning ? 'animate-pulse-glow' : ''}`} />

        <div className={`relative flex items-center justify-center rounded-full ${
          isFullscreen ? 'w-80 h-80 sm:w-96 sm:h-96' : 'w-56 h-56 sm:w-64 sm:h-64'
        }`}>
          {/* Background ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100" cy="100" r="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-200 dark:text-slate-700"
            />
            {isRunning && (
              <motion.circle
                cx="100" cy="100" r="90"
                fill="none"
                stroke="url(#stopwatchGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={565.48}
                initial={{ strokeDashoffset: 565.48 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              />
            )}
            <defs>
              <linearGradient id="stopwatchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6C5CE7" />
                <stop offset="100%" stopColor="#FF2D8A" />
              </linearGradient>
            </defs>
          </svg>

          <div className="text-center">
            <motion.span
              key={Math.floor(time / 10)}
              className={`font-mono font-bold tracking-tight ${
                isFullscreen
                  ? 'text-5xl sm:text-6xl'
                  : 'text-3xl sm:text-4xl'
              } ${isRunning ? 'text-gradient' : 'text-gray-900 dark:text-white'}`}
            >
              {formatTime(time)}
            </motion.span>
            <p className="text-xs text-gray-400 mt-2 font-medium uppercase tracking-widest">
              Stopwatch
            </p>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Reset / Lap */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={isRunning ? addLap : reset}
          disabled={time === 0}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isRunning ? <Flag className="h-5 w-5" /> : <RotateCcw className="h-5 w-5" />}
        </motion.button>

        {/* Play / Pause */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={isRunning ? pause : start}
          className={`flex h-18 w-18 items-center justify-center rounded-2xl shadow-fab transition-all ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
              : 'bg-gradient-premium hover:shadow-fab-hover'
          }`}
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

      {/* Laps */}
      {laps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 w-full ${isFullscreen ? 'max-w-md' : 'max-w-sm'}`}
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Laps</span>
            <span className="text-xs text-gray-400">{laps.length} total</span>
          </div>
          <div className={`space-y-1.5 overflow-y-auto scrollbar-hide ${isFullscreen ? 'max-h-48' : 'max-h-36'}`}>
            <AnimatePresence>
              {laps.map((lap) => {
                const isBest = laps.length > 1 && lap.delta === Math.min(...laps.map(l => l.delta))
                const isWorst = laps.length > 1 && lap.delta === Math.max(...laps.map(l => l.delta))
                return (
                  <motion.div
                    key={lap.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm ${
                      isBest
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                        : isWorst
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                          : 'bg-gray-50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="font-medium">Lap {lap.id}</span>
                    <div className="flex gap-6">
                      <span className="font-mono text-xs opacity-60">+{formatLapTime(lap.delta)}</span>
                      <span className="font-mono font-semibold">{formatLapTime(lap.time)}</span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
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
