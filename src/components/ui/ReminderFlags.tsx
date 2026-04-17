import { useState } from 'react'
import { Plus, X, Flag, Clock } from 'lucide-react'
import { ReminderFlag } from '@/types'
import { generateId } from '@/lib/utils'
import { Button } from '@/components/ui'

interface ReminderFlagsProps {
  value: ReminderFlag[]
  onChange: (flags: ReminderFlag[]) => void
}

const PRESET_REMINDERS = [
  { label: '15 minutes before', minutesBefore: 15 },
  { label: '30 minutes before', minutesBefore: 30 },
  { label: '1 hour before', minutesBefore: 60 },
  { label: '2 hours before', minutesBefore: 120 },
  { label: '1 day before', minutesBefore: 1440 },
  { label: '2 days before', minutesBefore: 2880 },
  { label: '1 week before', minutesBefore: 10080 },
]

export default function ReminderFlags({ value, onChange }: ReminderFlagsProps) {
  const [showPresets, setShowPresets] = useState(false)
  const [customMinutes, setCustomMinutes] = useState('')
  const [customLabel, setCustomLabel] = useState('')

  const addPresetReminder = (preset: { label: string; minutesBefore: number }) => {
    // Check if this reminder time already exists
    const exists = value.some(flag => flag.minutesBefore === preset.minutesBefore)
    if (exists) return

    const newFlag: ReminderFlag = {
      id: generateId(),
      label: preset.label,
      minutesBefore: preset.minutesBefore,
      enabled: true,
    }

    onChange([...value, newFlag])
    setShowPresets(false)
  }

  const addCustomReminder = () => {
    const minutes = parseInt(customMinutes)
    if (isNaN(minutes) || minutes < 0) return

    const label = customLabel.trim() || `${minutes} minutes before`

    const newFlag: ReminderFlag = {
      id: generateId(),
      label,
      minutesBefore: minutes,
      enabled: true,
    }

    onChange([...value, newFlag])
    setCustomMinutes('')
    setCustomLabel('')
    setShowPresets(false)
  }

  const toggleFlag = (id: string) => {
    onChange(
      value.map(flag =>
        flag.id === id ? { ...flag, enabled: !flag.enabled } : flag
      )
    )
  }

  const removeFlag = (id: string) => {
    onChange(value.filter(flag => flag.id !== id))
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`
    if (minutes < 10080) return `${Math.floor(minutes / 1440)}d`
    return `${Math.floor(minutes / 10080)}w`
  }

  return (
    <div className="space-y-3">
      {/* Existing Flags */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map(flag => (
            <div
              key={flag.id}
              className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                flag.enabled
                  ? 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20'
                  : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <button
                  type="button"
                  onClick={() => toggleFlag(flag.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    flag.enabled
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {flag.enabled && (
                    <Flag className="h-3 w-3 text-white" fill="currentColor" />
                  )}
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {flag.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(flag.minutesBefore)} before deadline
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFlag(flag.id)}
                className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Reminder Button */}
      {!showPresets && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setShowPresets(true)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder Flag
        </Button>
      )}

      {/* Preset Selection */}
      {showPresets && (
        <div className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Add Reminder
            </h4>
            <button
              type="button"
              onClick={() => setShowPresets(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Preset Options */}
          <div className="grid grid-cols-2 gap-2">
            {PRESET_REMINDERS.map(preset => {
              const exists = value.some(
                flag => flag.minutesBefore === preset.minutesBefore
              )
              return (
                <button
                  key={preset.minutesBefore}
                  type="button"
                  onClick={() => addPresetReminder(preset)}
                  disabled={exists}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    exists
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {preset.label}
                </button>
              )
            })}
          </div>

          {/* Custom Time Input */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Custom Reminder
            </p>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Minutes before deadline"
                value={customMinutes}
                onChange={e => setCustomMinutes(e.target.value)}
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <input
                type="text"
                placeholder="Label (optional)"
                value={customLabel}
                onChange={e => setCustomLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <Button
                type="button"
                size="sm"
                onClick={addCustomReminder}
                disabled={!customMinutes || parseInt(customMinutes) < 0}
                className="w-full"
              >
                Add Custom Reminder
              </Button>
            </div>
          </div>
        </div>
      )}

      {value.length === 0 && !showPresets && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
          No reminder flags set. Add flags to get notified before the deadline.
        </p>
      )}
    </div>
  )
}
