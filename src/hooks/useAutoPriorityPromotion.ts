import { useEffect } from 'react'
import { useTaskStore } from '@/store/taskStore'

export function useAutoPriorityPromotion() {
  const { autoPromotePriorityTask } = useTaskStore()

  useEffect(() => {
    // Check every 10 seconds if priority task is overdue and needs promotion
    const interval = setInterval(() => {
      autoPromotePriorityTask()
    }, 10000)

    return () => clearInterval(interval)
  }, [autoPromotePriorityTask])
}
