import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div>
        <select
          ref={ref}
          className={cn(
            'w-full rounded-lg border-2 border-gray-200 px-4 py-2 text-gray-900 transition-colors',
            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            'dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:focus:border-primary-500',
            'disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-slate-900',
            'cursor-pointer',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
