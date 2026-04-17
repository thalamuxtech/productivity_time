import { Clock } from 'lucide-react'
import { useCountdown } from '@/hooks'
import { formatTimeRemaining, getCountdownColor } from '@/lib/utils'
import { motion } from 'framer-motion'

interface CountdownTimerProps {
  deadline: number
  size?: 'sm' | 'md' | 'lg'
}

export default function CountdownTimer({
  deadline,
  size = 'md',
}: CountdownTimerProps) {
  const timeRemaining = useCountdown(deadline)

  if (!timeRemaining) {
    return null
  }

  const color = getCountdownColor(timeRemaining)
  const formattedTime = formatTimeRemaining(timeRemaining)

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        <Clock
          className={`${size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6'}`}
          style={{ color }}
        />
      </motion.div>
      <motion.span
        key={timeRemaining.seconds}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`font-mono font-semibold ${sizeClasses[size]}`}
        style={{ color }}
      >
        {formattedTime}
      </motion.span>
    </motion.div>
  )
}
