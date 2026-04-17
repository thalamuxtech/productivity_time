import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { TimeRemaining } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateTimeRemaining(deadline: number): TimeRemaining {
  const now = Date.now()
  const diff = deadline - now

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      total: 0,
      isOverdue: true,
    }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return {
    days,
    hours,
    minutes,
    seconds,
    total: diff,
    isOverdue: false,
  }
}

export function formatTimeRemaining(timeRemaining: TimeRemaining): string {
  if (timeRemaining.isOverdue) {
    return 'Overdue'
  }

  const { days, hours, minutes, seconds } = timeRemaining

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }

  return `${seconds}s`
}

export function getCountdownColor(timeRemaining: TimeRemaining): string {
  if (timeRemaining.isOverdue) {
    return '#EF4444' // danger
  }

  const totalHours = timeRemaining.total / (1000 * 60 * 60)

  if (totalHours > 24) {
    return '#10B981' // safe
  }

  if (totalHours > 6) {
    return '#F59E0B' // warning
  }

  if (totalHours > 1) {
    return '#F97316' // urgent
  }

  return '#EF4444' // danger
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )

  if (targetDate.getTime() === today.getTime()) {
    return `Today, ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`
  }

  if (targetDate.getTime() === tomorrow.getTime()) {
    return `Tomorrow, ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`
  }

  if (targetDate.getTime() === yesterday.getTime()) {
    return `Yesterday, ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year:
      date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function isOverdue(deadline: number): boolean {
  return deadline < Date.now()
}

export function getProgressPercentage(
  createdAt: number,
  deadline: number
): number {
  const now = Date.now()
  const total = deadline - createdAt
  const elapsed = now - createdAt

  if (elapsed >= total) {
    return 100
  }

  if (elapsed <= 0) {
    return 0
  }

  return Math.round((elapsed / total) * 100)
}
