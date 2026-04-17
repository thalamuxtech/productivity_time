import { Volume2 } from 'lucide-react'
import { REMINDER_SOUNDS, playReminderSound } from '../../constants/sounds'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface SoundSelectorProps {
  value: string
  onChange: (soundId: string) => void
}

export default function SoundSelector({ value, onChange }: SoundSelectorProps) {
  const [playingSound, setPlayingSound] = useState<string | null>(null)

  const handlePreview = (soundId: string) => {
    setPlayingSound(soundId)
    playReminderSound(soundId)
    setTimeout(() => setPlayingSound(null), 1000)
  }

  return (
    <div className="space-y-2">
      {REMINDER_SOUNDS.map((sound, index) => (
        <motion.div
          key={sound.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer hover:scale-[1.02] ${
            value === sound.id
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
          }`}
          onClick={() => onChange(sound.id)}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="reminderSound"
                value={sound.id}
                checked={value === sound.id}
                onChange={() => onChange(sound.id)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {sound.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {sound.description}
                </p>
              </div>
            </div>
          </div>
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handlePreview(sound.id)
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={
              playingSound === sound.id
                ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }
                : {}
            }
            transition={{ duration: 0.3 }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={`Preview ${sound.name}`}
          >
            <Volume2 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </motion.button>
        </motion.div>
      ))}
    </div>
  )
}
