import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { PriorityLevel } from '@/types'
import { PRIORITY_CONFIG } from '@/constants'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'priority'
  priority?: PriorityLevel
}

const priorityStyles: Record<string, string> = {
  priority: 'bg-gradient-to-r from-accent-500 to-primary-500 text-white shadow-sm',
  high: 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50',
  medium: 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50',
  low: 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50',
}

export default function Badge({
  className,
  variant = 'default',
  priority,
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase'

  if (variant === 'priority' && priority) {
    const config = PRIORITY_CONFIG[priority]
    return (
      <span
        className={cn(baseStyles, priorityStyles[priority] || config.badgeColor, className)}
        {...props}
      >
        {children || config.label}
      </span>
    )
  }

  return (
    <span
      className={cn(
        baseStyles,
        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
