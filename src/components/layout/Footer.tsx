import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="relative py-8 mt-8"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4">
          {/* Divider */}
          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent" />

          {/* Built by */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-widest">
              Built by
            </p>
            <a
              href="https://thalamux-tech.web.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 hover:border-primary-200 dark:hover:border-primary-700/50 hover:shadow-glass transition-all duration-300"
            >
              <img
                src="https://thalamux-tech.web.app/favicon.ico"
                alt="ThalamuxTech"
                className="h-6 w-6 rounded-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-gradient transition-colors">
                ThalamuxTech
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-gray-400 group-hover:text-primary-500 transition-colors" />
            </a>
          </div>

          {/* App info */}
          <p className="text-[11px] text-gray-400 dark:text-gray-600">
            Productivity Time &middot; Focus. Execute. Achieve.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
