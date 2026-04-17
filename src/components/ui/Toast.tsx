import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Info, AlertCircle, X } from 'lucide-react'
import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>(set => ({
  toasts: [],
  addToast: toast =>
    set(state => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: `${Date.now()}-${Math.random()}` },
      ],
    })),
  removeToast: id =>
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id),
    })),
}))

export function toast(
  message: string,
  type: ToastType = 'info',
  duration = 3000
) {
  useToastStore.getState().addToast({ message, type, duration })
}

toast.success = (message: string, duration?: number) =>
  toast(message, 'success', duration)
toast.error = (message: string, duration?: number) =>
  toast(message, 'error', duration)
toast.info = (message: string, duration?: number) =>
  toast(message, 'info', duration)
toast.warning = (message: string, duration?: number) =>
  toast(message, 'warning', duration)

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertCircle,
}

const styles = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    text: 'text-emerald-800 dark:text-emerald-200',
    icon: 'text-emerald-500',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/30',
    border: 'border-red-200 dark:border-red-800/50',
    text: 'text-red-800 dark:text-red-200',
    icon: 'text-red-500',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    border: 'border-blue-200 dark:border-blue-800/50',
    text: 'text-blue-800 dark:text-blue-200',
    icon: 'text-blue-500',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    border: 'border-amber-200 dark:border-amber-800/50',
    text: 'text-amber-800 dark:text-amber-200',
    icon: 'text-amber-500',
  },
}

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToastStore()
  const Icon = icons[toast.type]
  const style = styles[toast.type]

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        removeToast(toast.id)
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, removeToast])

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-glass backdrop-blur-xl ${style.bg} ${style.border}`}
    >
      <Icon className={`h-5 w-5 flex-shrink-0 ${style.icon}`} />
      <p className={`flex-1 text-sm font-medium ${style.text}`}>{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

export default function ToastContainer() {
  const { toasts } = useToastStore()

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none sm:top-6 sm:right-6">
      <div className="pointer-events-auto">
        <AnimatePresence>
          {toasts.map(toast => (
            <div key={toast.id} className="mb-2">
              <ToastItem toast={toast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
