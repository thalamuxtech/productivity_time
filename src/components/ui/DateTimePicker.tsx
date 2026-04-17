import { useState } from 'react'
import { Calendar, Clock } from 'lucide-react'
import DatePicker from './DatePicker'
import AnalogClock from './AnalogClock'

interface DateTimePickerProps {
  value: number // timestamp
  onChange: (timestamp: number) => void
  minDate?: Date
}

export default function DateTimePicker({ value, onChange, minDate }: DateTimePickerProps) {
  const [activeTab, setActiveTab] = useState<'date' | 'time'>('date')
  const currentDate = new Date(value)

  const handleDateChange = (newDate: Date) => {
    // Preserve the time, update only the date
    const updated = new Date(currentDate)
    updated.setFullYear(newDate.getFullYear())
    updated.setMonth(newDate.getMonth())
    updated.setDate(newDate.getDate())
    onChange(updated.getTime())
  }

  const handleHoursChange = (hours: number) => {
    const updated = new Date(currentDate)
    updated.setHours(hours)
    onChange(updated.getTime())
  }

  const handleMinutesChange = (minutes: number) => {
    const updated = new Date(currentDate)
    updated.setMinutes(minutes)
    onChange(updated.getTime())
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="space-y-4">
      {/* Current Selection Display */}
      <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
        <div className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">
          Selected Deadline
        </div>
        <div className="text-lg font-semibold text-gray-900 dark:text-white">
          {formatDate(currentDate)}
        </div>
        <div className="text-md text-gray-700 dark:text-gray-300">
          {formatTime(currentDate)}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setActiveTab('date')}
          className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'date'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Date
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('time')}
          className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'time'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Clock className="h-4 w-4" />
          Time
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[320px]">
        {activeTab === 'date' ? (
          <DatePicker
            value={currentDate}
            onChange={handleDateChange}
            minDate={minDate}
          />
        ) : (
          <AnalogClock
            hours={currentDate.getHours()}
            minutes={currentDate.getMinutes()}
            onHoursChange={handleHoursChange}
            onMinutesChange={handleMinutesChange}
          />
        )}
      </div>
    </div>
  )
}
