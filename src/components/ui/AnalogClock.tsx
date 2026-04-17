import { useState, useRef } from 'react'

interface AnalogClockProps {
  hours: number // 0-23
  minutes: number // 0-59
  onHoursChange: (hours: number) => void
  onMinutesChange: (minutes: number) => void
}

export default function AnalogClock({
  hours,
  minutes,
  onHoursChange,
  onMinutesChange,
}: AnalogClockProps) {
  const [mode, setMode] = useState<'hours' | 'minutes'>('hours')
  const clockRef = useRef<HTMLDivElement>(null)

  // Convert 24-hour to 12-hour for display
  const displayHours = hours % 12 || 12
  const isPM = hours >= 12

  // Calculate angles
  const hourAngle = ((hours % 12) * 30 + minutes * 0.5) % 360
  const minuteAngle = (minutes * 6) % 360

  const handleClockClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!clockRef.current) return

    const rect = clockRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const x = e.clientX - rect.left - centerX
    const y = e.clientY - rect.top - centerY

    // Calculate angle from center
    let angle = Math.atan2(y, x) * (180 / Math.PI)
    angle = (angle + 90 + 360) % 360

    if (mode === 'hours') {
      // Convert angle to hour (0-11)
      let hour = Math.round(angle / 30) % 12
      if (hour === 0) hour = 12

      // Apply AM/PM
      const newHours = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour)
      onHoursChange(newHours)

      // Auto-switch to minutes after selecting hour
      setTimeout(() => setMode('minutes'), 200)
    } else {
      // Convert angle to minute (0-59)
      const minute = Math.round(angle / 6) % 60
      onMinutesChange(minute)
    }
  }

  const toggleAMPM = () => {
    const newHours = isPM ? hours - 12 : hours + 12
    onHoursChange(Math.max(0, Math.min(23, newHours)))
  }

  return (
    <div className="space-y-4">
      {/* Mode Selector */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setMode('hours')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'hours'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {displayHours.toString().padStart(2, '0')}
        </button>
        <span className="text-2xl font-bold text-gray-400">:</span>
        <button
          type="button"
          onClick={() => setMode('minutes')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'minutes'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {minutes.toString().padStart(2, '0')}
        </button>
        <button
          type="button"
          onClick={toggleAMPM}
          className="ml-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors"
        >
          {isPM ? 'PM' : 'AM'}
        </button>
      </div>

      {/* Analog Clock Face */}
      <div className="flex justify-center">
        <div
          ref={clockRef}
          onClick={handleClockClick}
          className="relative w-48 h-48 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-4 border-gray-200 dark:border-gray-700 cursor-pointer shadow-lg"
        >
          {/* Clock center dot */}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20" />

          {/* Hour markers or Minute markers based on mode */}
          {mode === 'hours' ? (
            // Hour markers (1-12)
            Array.from({ length: 12 }).map((_, i) => {
              const hour = i + 1
              const angle = (hour * 30 - 90) * (Math.PI / 180)
              const radius = 75
              const x = Math.cos(angle) * radius + 96
              const y = Math.sin(angle) * radius + 96

              return (
                <div
                  key={i}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}px`, top: `${y}px` }}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      displayHours === hour
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {hour}
                  </div>
                </div>
              )
            })
          ) : (
            // Minute markers (0, 5, 10, ..., 55)
            Array.from({ length: 12 }).map((_, i) => {
              const minute = i * 5
              const angle = (minute * 6 - 90) * (Math.PI / 180)
              const radius = 75
              const x = Math.cos(angle) * radius + 96
              const y = Math.sin(angle) * radius + 96

              return (
                <div
                  key={i}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}px`, top: `${y}px` }}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                      minutes === minute
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {minute.toString().padStart(2, '0')}
                  </div>
                </div>
              )
            })
          )}

          {/* Hour hand (shorter, thicker) */}
          <div
            className="absolute top-1/2 left-1/2 origin-bottom bg-gray-700 dark:bg-gray-300 rounded-full z-10 transition-transform duration-300"
            style={{
              width: '5px',
              height: '38px',
              transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
            }}
          />

          {/* Minute hand (longer, thinner) */}
          <div
            className="absolute top-1/2 left-1/2 origin-bottom bg-primary-500 rounded-full z-10 transition-transform duration-300"
            style={{
              width: '3px',
              height: '53px',
              transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
            }}
          />
        </div>
      </div>

      {/* Current selection hint */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        {mode === 'hours' ? 'Click to select hour' : 'Click to select minute'}
      </p>
    </div>
  )
}
