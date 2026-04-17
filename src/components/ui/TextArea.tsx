import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            'w-full rounded-lg border-2 border-gray-200 px-4 py-2 text-gray-900 transition-colors resize-none',
            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            'dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:focus:border-primary-500',
            'disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-slate-900',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'

export default TextArea
