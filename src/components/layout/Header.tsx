import { Moon, Sun, Sparkles, Settings, Timer, Menu, X } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useTaskStore } from '@/store/taskStore'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/Toast'
import { seedDummyTasks } from '@/lib/seedTasks'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function Header() {
  const { theme, toggleTheme, openSettingsModal } = useUIStore()
  const { loadTasks } = useTaskStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSeedTasks = async () => {
    if (confirm('This will replace all existing tasks with 12 dummy tasks. Continue?')) {
      try {
        await seedDummyTasks()
        await loadTasks()
        toast.success('Successfully loaded demo tasks!')
      } catch {
        toast.error('Failed to seed tasks')
      }
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Glassmorphism backdrop */}
      <div className="absolute inset-0 glass" />

      <div className="relative container mx-auto flex h-16 sm:h-18 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-premium shadow-premium">
              <Timer className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="absolute -inset-1 rounded-xl bg-gradient-premium opacity-20 blur-md -z-10" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold font-display text-gradient">
              Productivity Time
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
              Focus. Execute. Achieve.
            </p>
          </div>
        </motion.div>

        {/* Desktop Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden sm:flex items-center gap-2"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSeedTasks}
            className="!rounded-xl !px-4 gap-2"
            title="Load demo tasks"
          >
            <Sparkles className="h-4 w-4 text-accent-500" />
            <span className="text-sm font-medium">Demo</span>
          </Button>
          <div className="w-px h-6 bg-gray-200 dark:bg-slate-700 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={openSettingsModal}
            className="!p-2.5 !rounded-xl"
            aria-label="Open settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="!p-2.5 !rounded-xl"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-amber-400" />
                ) : (
                  <Moon className="h-5 w-5 text-primary-500" />
                )}
              </motion.div>
            </AnimatePresence>
          </Button>
        </motion.div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="!p-2.5 !rounded-xl"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-primary-500" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="!p-2.5 !rounded-xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden relative glass border-t border-gray-200/50 dark:border-slate-700/50"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { handleSeedTasks(); setMobileMenuOpen(false) }}
                className="!rounded-xl !justify-start gap-3 !px-4"
              >
                <Sparkles className="h-4 w-4 text-accent-500" />
                <span>Load Demo Tasks</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { openSettingsModal(); setMobileMenuOpen(false) }}
                className="!rounded-xl !justify-start gap-3 !px-4"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
