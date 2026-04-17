import SoundSelector from '@/components/ui/SoundSelector'
import { useSettingsStore } from '@/store/settingsStore'
import { Bell, BellOff, Volume2, VolumeX } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const { settings, updateSettings, loading } = useSettingsStore()

  if (loading || !settings) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Loading settings...</p>
  }

  const toggleNotifications = () => {
    updateSettings({ notifications: !settings.notifications })
  }

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled })
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 dark:border-slate-700/50 dark:bg-slate-800/50">
        <h3 className="text-base font-bold font-display text-gray-900 dark:text-white">
          Notifications
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Control reminder alerts and sound behavior.
        </p>

        <div className="mt-4 space-y-3">
          <label className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-700/50 transition-colors cursor-pointer -mx-1">
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${settings.notifications ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-gray-100 dark:bg-slate-700'}`}>
                {settings.notifications ? (
                  <Bell className="h-4 w-4 text-primary-500" />
                ) : (
                  <BellOff className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Browser notifications
              </span>
            </div>
            <button
              type="button"
              onClick={toggleNotifications}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
                settings.notifications ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-pressed={settings.notifications}
            >
              <motion.span
                layout
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </label>

          <label className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-700/50 transition-colors cursor-pointer -mx-1">
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${settings.soundEnabled ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-gray-100 dark:bg-slate-700'}`}>
                {settings.soundEnabled ? (
                  <Volume2 className="h-4 w-4 text-primary-500" />
                ) : (
                  <VolumeX className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Play alarm sounds
              </span>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
                settings.soundEnabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-pressed={settings.soundEnabled}
            >
              <motion.span
                layout
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 dark:border-slate-700/50 dark:bg-slate-800/50">
        <h3 className="text-base font-bold font-display text-gray-900 dark:text-white">
          Default Alarm Sound
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Applies to newly created tasks.
        </p>
        <div className="mt-4">
          <SoundSelector
            value={settings.defaultReminderSound}
            onChange={(soundId) => updateSettings({ defaultReminderSound: soundId })}
          />
        </div>
      </div>
    </div>
  )
}
