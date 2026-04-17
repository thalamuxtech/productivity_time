import { motion } from 'framer-motion'
import { getProgressPercentage } from '@/lib/utils'

interface ProgressRingProps {
  createdAt: number
  deadline: number
  size?: number
  strokeWidth?: number
}

export default function ProgressRing({
  createdAt,
  deadline,
  size = 120,
  strokeWidth = 8,
}: ProgressRingProps) {
  const progress = getProgressPercentage(createdAt, deadline)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  // Color based on progress
  const getColor = () => {
    if (progress < 50) return '#10B981' // green
    if (progress < 75) return '#F59E0B' // amber
    if (progress < 90) return '#F97316' // orange
    return '#EF4444' // red
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>

      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          key={progress}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold"
          style={{ color: getColor() }}
        >
          {progress}%
        </motion.span>
      </div>
    </div>
  )
}
