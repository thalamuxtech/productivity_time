import { useState, useEffect } from 'react'
import { TimeRemaining } from '@/types'
import { calculateTimeRemaining } from '@/lib/utils'

export function useCountdown(deadline: number | null): TimeRemaining | null {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(
    deadline ? calculateTimeRemaining(deadline) : null
  )

  useEffect(() => {
    if (!deadline) {
      setTimeRemaining(null)
      return
    }

    // Initial calculation
    setTimeRemaining(calculateTimeRemaining(deadline))

    // Update every second
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(deadline)
      setTimeRemaining(remaining)

      // Stop updating if overdue
      if (remaining.isOverdue) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [deadline])

  return timeRemaining
}
