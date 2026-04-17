import { useUIStore } from '@/store/uiStore'
import { Select } from '@/components/ui'
import { Search, SortAsc, SortDesc, X, SlidersHorizontal } from 'lucide-react'
import { TaskStatus, PriorityLevel } from '@/types'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TaskFilters() {
  const { filter, sortBy, sortOrder, setSortBy, toggleSortOrder, setFilter, clearFilter, setSearchTerm } =
    useUIStore()
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setSearchTerm(value)
  }

  const handleClearFilters = () => {
    clearFilter()
    setSearch('')
  }

  const hasActiveFilters = Object.keys(filter).length > 0 || search !== ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-3"
    >
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-12 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder-gray-500 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-colors touch-target ${
            showFilters || hasActiveFilters
              ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Expandable Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 flex-wrap p-3 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50">
              {/* Status Filter */}
              <Select
                value={(filter.status as TaskStatus) || 'all'}
                onChange={e => {
                  const value = e.target.value
                  if (value === 'all') {
                    const { status, ...rest } = filter
                    setFilter(rest)
                  } else {
                    setFilter({ status: value as TaskStatus })
                  }
                }}
                className="!w-auto min-w-[120px] !rounded-xl !text-sm !py-2"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </Select>

              {/* Priority Filter */}
              <Select
                value={(filter.priority as PriorityLevel) || 'all'}
                onChange={e => {
                  const value = e.target.value
                  if (value === 'all') {
                    const { priority, ...rest } = filter
                    setFilter(rest)
                  } else {
                    setFilter({ priority: value as PriorityLevel })
                  }
                }}
                className="!w-auto min-w-[120px] !rounded-xl !text-sm !py-2"
              >
                <option value="all">All Priorities</option>
                <option value="priority">Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>

              {/* Sort By */}
              <Select
                value={sortBy}
                onChange={e =>
                  setSortBy(e.target.value as 'deadline' | 'priority' | 'createdAt')
                }
                className="!w-auto min-w-[140px] !rounded-xl !text-sm !py-2"
              >
                <option value="deadline">By Deadline</option>
                <option value="priority">By Priority</option>
                <option value="createdAt">By Created</option>
              </Select>

              {/* Sort Order Toggle */}
              <button
                onClick={toggleSortOrder}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-white hover:text-gray-700 dark:hover:bg-slate-700 dark:hover:text-gray-300 transition-colors touch-target"
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </button>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="ml-auto flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-white dark:hover:bg-slate-700 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
