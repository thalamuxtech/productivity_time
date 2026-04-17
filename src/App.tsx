import { useEffect } from 'react'
import { useUIStore } from './store/uiStore'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Dashboard from './components/dashboard/Dashboard'
import Modal from './components/ui/Modal'
import ToastContainer from './components/ui/Toast'
import TaskForm from './components/tasks/TaskForm'
import SettingsPage from './components/settings/SettingsPage'
import { useSettingsStore } from './store/settingsStore'
import { useTaskReminders } from './hooks/useTaskReminders'

function App() {
  const { isTaskModalOpen, closeTaskModal, isSettingsModalOpen, closeSettingsModal } = useUIStore()
  const { loadSettings } = useSettingsStore()

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  useTaskReminders()

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-[#0A0A18] transition-colors duration-300">
      <Header />
      <main>
        <Dashboard />
      </main>
      <Footer />

      {/* Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        title="Task Details"
        size="lg"
      >
        <TaskForm />
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={closeSettingsModal}
        title="Settings"
        size="lg"
      >
        <SettingsPage />
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}

export default App
