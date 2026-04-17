import { create } from 'zustand'
import { TaskFilter } from '@/types'

interface UIStore {
  theme: 'light' | 'dark' | 'system'
  isTaskModalOpen: boolean
  isSettingsModalOpen: boolean
  editingTaskId: string | null
  filter: TaskFilter
  sortBy: 'deadline' | 'priority' | 'createdAt'
  sortOrder: 'asc' | 'desc'
  searchTerm: string
  activeTab: 'active' | 'completed' | 'overdue'

  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleTheme: () => void
  openTaskModal: (taskId?: string) => void
  closeTaskModal: () => void
  openSettingsModal: () => void
  closeSettingsModal: () => void
  setFilter: (filter: Partial<TaskFilter>) => void
  clearFilter: () => void
  setSortBy: (sortBy: 'deadline' | 'priority' | 'createdAt') => void
  toggleSortOrder: () => void
  setSearchTerm: (term: string) => void
  setActiveTab: (tab: 'active' | 'completed' | 'overdue') => void
}

export const useUIStore = create<UIStore>((set, get) => ({
  theme: 'system',
  isTaskModalOpen: false,
  isSettingsModalOpen: false,
  editingTaskId: null,
  filter: {},
  sortBy: 'deadline',
  sortOrder: 'asc',
  searchTerm: '',
  activeTab: 'active',

  setTheme: (theme: 'light' | 'dark' | 'system') => {
    set({ theme })
    localStorage.setItem('theme', theme)

    // Apply theme to document
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },

  toggleTheme: () => {
    const { theme } = get()
    const newTheme = theme === 'light' ? 'dark' : 'light'
    get().setTheme(newTheme)
  },

  openTaskModal: (taskId?: string) => {
    set({ isTaskModalOpen: true, editingTaskId: taskId || null })
  },

  closeTaskModal: () => {
    set({ isTaskModalOpen: false, editingTaskId: null })
  },

  openSettingsModal: () => {
    set({ isSettingsModalOpen: true })
  },

  closeSettingsModal: () => {
    set({ isSettingsModalOpen: false })
  },

  setFilter: (filter: Partial<TaskFilter>) => {
    set(state => ({ filter: { ...state.filter, ...filter } }))
  },

  clearFilter: () => {
    set({ filter: {}, searchTerm: '' })
  },

  setSortBy: (sortBy: 'deadline' | 'priority' | 'createdAt') => {
    set({ sortBy })
  },

  toggleSortOrder: () => {
    set(state => ({ sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' }))
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term, filter: { ...get().filter, searchTerm: term } })
  },

  setActiveTab: (tab: 'active' | 'completed' | 'overdue') => {
    set({ activeTab: tab })
  },
}))

// Initialize theme from localStorage or system preference
const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
if (savedTheme) {
  useUIStore.getState().setTheme(savedTheme)
} else {
  useUIStore.getState().setTheme('system')
}
