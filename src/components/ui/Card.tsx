import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glass?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, glass = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl p-5 sm:p-6 transition-all duration-300',
          glass
            ? 'glass-card'
            : 'bg-white border border-gray-100 shadow-card dark:bg-slate-800/80 dark:border-slate-700/50',
          hover &&
            'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer active:scale-[0.99]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
