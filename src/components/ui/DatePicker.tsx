import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DatePickerProps {
  value: Date
  onChange: (date: Date) => void
  minDate?: Date
}

export default function DatePicker({ value, onChange, minDate }: DatePickerProps) {
  const [viewMonth, setViewMonth] = useState(value.getMonth())
  const [viewYear, setViewYear] = useState(value.getFullYear())

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(value)
    newDate.setFullYear(viewYear)
    newDate.setMonth(viewMonth)
    newDate.setDate(day)
    onChange(newDate)
  }

  const isSelectedDate = (day: number) => {
    return (
      value.getDate() === day &&
      value.getMonth() === viewMonth &&
      value.getFullYear() === viewYear
    )
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === viewMonth &&
      today.getFullYear() === viewYear
    )
  }

  const isPastDate = (day: number) => {
    if (!minDate) return false
    const date = new Date(viewYear, viewMonth, day)
    return date < minDate
  }

  // Generate calendar days
  const calendarDays = []

  // Empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-10" />)
  }

  // Actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected = isSelectedDate(day)
    const isTodayDate = isToday(day)
    const isPast = isPastDate(day)

    calendarDays.push(
      <button
        key={day}
        type="button"
        onClick={() => !isPast && handleDateClick(day)}
        disabled={isPast}
        className={`h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
          isSelected
            ? 'bg-primary-500 text-white'
            : isTodayDate
            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
            : isPast
            ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        {day}
      </button>
    )
  }

  return (
    <div className="space-y-3">
      {/* Month/Year Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="font-semibold text-gray-900 dark:text-white">
          {monthNames[viewMonth]} {viewYear}
        </div>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map(day => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-semibold text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays}
      </div>
    </div>
  )
}
