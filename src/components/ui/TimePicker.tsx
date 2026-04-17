import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimePickerProps {
  value: number // minutes
  onChange: (minutes: number) => void
  className?: string
}

export default function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [hours, setHours] = useState(Math.floor(value / 60))
  const [minutes, setMinutes] = useState(value % 60)

  useEffect(() => {
    setHours(Math.floor(value / 60))
    setMinutes(value % 60)
  }, [value])

  const handleHoursChange = (newHours: number) => {
    setHours(newHours)
    onChange(newHours * 60 + minutes)
  }

  const handleMinutesChange = (newMinutes: number) => {
    setMinutes(newMinutes)
    onChange(hours * 60 + newMinutes)
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4 text-gray-400" />
      </div>

      {/* Hours */}
      <div className="flex items-center gap-1">
        <input
          type="number"
          min="0"
          max="23"
          value={hours}
          onChange={(e) => handleHoursChange(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
          className="w-16 rounded-lg border-2 border-gray-200 px-2 py-1.5 text-center text-gray-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
          placeholder="0"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">h</span>
      </div>

      {/* Minutes */}
      <div className="flex items-center gap-1">
        <input
          type="number"
          min="0"
          max="59"
          value={minutes}
          onChange={(e) => handleMinutesChange(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
          className="w-16 rounded-lg border-2 border-gray-200 px-2 py-1.5 text-center text-gray-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
          placeholder="0"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">m</span>
      </div>

      {/* Quick presets */}
      <div className="ml-2 flex gap-1">
        {[15, 30, 60, 120].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className="rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {preset < 60 ? `${preset}m` : `${preset / 60}h`}
          </button>
        ))}
      </div>
    </div>
  )
}
