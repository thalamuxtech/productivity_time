import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-target select-none'

    const variants = {
      primary:
        'bg-gradient-premium text-white shadow-premium hover:shadow-premium-hover hover:scale-[1.02] active:scale-[0.97] focus:ring-primary-500 dark:focus:ring-offset-slate-900',
      secondary:
        'border-2 border-primary-200 text-primary-600 bg-primary-50/50 hover:bg-primary-100/80 hover:border-primary-300 hover:shadow-glass focus:ring-primary-500 dark:border-primary-700/50 dark:text-primary-300 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 hover:scale-[1.02] active:scale-[0.97]',
      ghost:
        'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white hover:scale-[1.02] active:scale-[0.97]',
      danger:
        'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg focus:ring-red-500 active:scale-[0.97] hover:scale-[1.02]',
    }

    const sizes = {
      sm: 'px-3.5 py-2 text-sm',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
