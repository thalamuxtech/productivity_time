import { PriorityLevel } from '@/types'

export const PRIORITY_CONFIG = {
  priority: {
    label: 'Priority',
    color: 'text-accent-500',
    bgColor: 'bg-accent-50',
    borderColor: 'border-accent-500',
    badgeColor: 'bg-accent-500 text-white',
    darkBgColor: 'dark:bg-accent-900/20',
    order: 0,
  },
  high: {
    label: 'High',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    badgeColor: 'bg-red-500 text-white',
    darkBgColor: 'dark:bg-red-900/20',
    order: 1,
  },
  medium: {
    label: 'Medium',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-500',
    badgeColor: 'bg-amber-500 text-white',
    darkBgColor: 'dark:bg-amber-900/20',
    order: 2,
  },
  low: {
    label: 'Low',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    badgeColor: 'bg-blue-500 text-white',
    darkBgColor: 'dark:bg-blue-900/20',
    order: 3,
  },
} as const

export const PRIORITY_OPTIONS: Array<{
  value: PriorityLevel
  label: string
}> = [
  { value: 'priority', label: 'Priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export const STATUS_CONFIG = {
  todo: {
    label: 'To Do',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    badgeColor: 'bg-gray-500 text-white',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    badgeColor: 'bg-blue-500 text-white',
  },
  completed: {
    label: 'Completed',
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    badgeColor: 'bg-green-500 text-white',
  },
} as const
