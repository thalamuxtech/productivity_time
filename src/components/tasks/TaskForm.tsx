import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema, TaskFormData } from '@/lib/validation'
import { useTaskStore } from '@/store/taskStore'
import { useUIStore } from '@/store/uiStore'
import { Button, Input, TextArea, Select } from '@/components/ui'
import TimePicker from '@/components/ui/TimePicker'
import SoundSelector from '@/components/ui/SoundSelector'
import AnalogClock from '@/components/ui/AnalogClock'
import ReminderFlags from '@/components/ui/ReminderFlags'
import { toast } from '@/components/ui/Toast'
import { PRIORITY_OPTIONS } from '@/constants'
import { DEFAULT_REMINDER_SOUND } from '@/constants/sounds'
import { useTask } from '@/hooks'
import { useSettingsStore } from '@/store/settingsStore'
import { Bell, BellOff, Clock, Tag, FileText, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TaskForm() {
  const { editingTaskId, closeTaskModal } = useUIStore()
  const { createTask, updateTask, getPriorityTask } = useTaskStore()
  const { settings } = useSettingsStore()
  const existingTask = useTask(editingTaskId || '')

  const defaultDeadline = Date.now() + 24 * 60 * 60 * 1000

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: existingTask
      ? {
          title: existingTask.title,
          description: existingTask.description,
          priority: existingTask.priority,
          deadline: existingTask.deadline,
          tags: existingTask.tags,
          estimatedDuration: existingTask.estimatedDuration || 0,
          notes: existingTask.notes,
          frequentReminder: existingTask.frequentReminder || false,
          frequentReminderInterval: existingTask.frequentReminderInterval || 30,
          reminderSound: existingTask.reminderSound || DEFAULT_REMINDER_SOUND,
          reminderFlags: existingTask.reminderFlags || [],
          status: existingTask.status,
        }
      : {
          title: '',
          description: '',
          priority: 'medium',
          deadline: defaultDeadline,
          tags: [],
          estimatedDuration: 0,
          notes: '',
          frequentReminder: false,
          frequentReminderInterval: 30,
          reminderSound: settings?.defaultReminderSound || DEFAULT_REMINDER_SOUND,
          reminderFlags: [],
          status: 'todo',
        },
  })

  const frequentReminder = watch('frequentReminder')
  const selectedSound = watch('reminderSound')
  const priorityTask = getPriorityTask()

  useEffect(() => {
    if (!existingTask && settings?.defaultReminderSound && selectedSound === DEFAULT_REMINDER_SOUND) {
      setValue('reminderSound', settings.defaultReminderSound, { shouldDirty: false })
    }
  }, [existingTask, selectedSound, setValue, settings?.defaultReminderSound])

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (existingTask) {
        await updateTask(existingTask.id, data)
        toast.success('Task updated successfully!')
      } else {
        await createTask(data)
        toast.success('Task created successfully!')
      }
      closeTaskModal()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save task'
      )
    }
  }

  const SectionHeader = ({ icon: Icon, title }: { icon: typeof Clock; title: string }) => (
    <div className="flex items-center gap-2 mb-3 mt-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/20">
        <Icon className="h-3.5 w-3.5 text-primary-500" />
      </div>
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</span>
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
      <div>
        <Input
          id="title"
          {...register('title')}
          placeholder="What needs to be done?"
          error={errors.title?.message}
          className="!text-lg !font-semibold !rounded-xl !py-3"
        />
      </div>

      {/* Description */}
      <div>
        <TextArea
          id="description"
          {...register('description')}
          placeholder="Add a description (optional)"
          rows={2}
          error={errors.description?.message}
          className="!rounded-xl"
        />
      </div>

      {/* Priority and Status */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Priority
          </label>
          <Select id="priority" {...register('priority')} error={errors.priority?.message} className="!rounded-xl">
            {PRIORITY_OPTIONS.map(option => (
              <option
                key={option.value}
                value={option.value}
                disabled={
                  option.value === 'priority' &&
                  !!priorityTask &&
                  priorityTask.id !== editingTaskId
                }
              >
                {option.label}
                {option.value === 'priority' &&
                  priorityTask &&
                  priorityTask.id !== editingTaskId &&
                  ' (Already set)'}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Status
          </label>
          <Select id="status" {...register('status')} className="!rounded-xl">
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
        </div>
      </div>

      {/* Deadline Section */}
      <div className="rounded-2xl bg-gray-50 dark:bg-slate-800/50 p-4 border border-gray-100 dark:border-slate-700/50">
        <SectionHeader icon={Clock} title="Deadline" />

        <div className="space-y-3">
          {/* Date Input */}
          <Controller
            name="deadline"
            control={control}
            render={({ field }) => {
              const currentDate = new Date(field.value || defaultDeadline)
              const dateValue = currentDate.toISOString().split('T')[0]

              return (
                <Input
                  type="date"
                  value={dateValue}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value)
                    newDate.setHours(currentDate.getHours())
                    newDate.setMinutes(currentDate.getMinutes())
                    field.onChange(newDate.getTime())
                  }}
                  className="!rounded-xl"
                />
              )
            }}
          />

          {/* Time Input - Analog Clock */}
          <Controller
            name="deadline"
            control={control}
            render={({ field }) => {
              const currentDate = new Date(field.value || defaultDeadline)

              return (
                <AnalogClock
                  hours={currentDate.getHours()}
                  minutes={currentDate.getMinutes()}
                  onHoursChange={(hours) => {
                    const newDate = new Date(field.value || defaultDeadline)
                    newDate.setHours(hours)
                    field.onChange(newDate.getTime())
                  }}
                  onMinutesChange={(minutes) => {
                    const newDate = new Date(field.value || defaultDeadline)
                    newDate.setMinutes(minutes)
                    field.onChange(newDate.getTime())
                  }}
                />
              )
            }}
          />

          {errors.deadline && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              {errors.deadline.message}
            </p>
          )}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Estimated Duration
        </label>
        <Controller
          name="estimatedDuration"
          control={control}
          render={({ field }) => (
            <TimePicker
              value={field.value || 0}
              onChange={field.onChange}
            />
          )}
        />
        {errors.estimatedDuration && (
          <p className="mt-1 text-sm text-red-500">{errors.estimatedDuration.message}</p>
        )}
      </div>

      {/* Reminder Section */}
      <div className="rounded-2xl bg-gray-50 dark:bg-slate-800/50 p-4 border border-gray-100 dark:border-slate-700/50">
        <SectionHeader icon={Bell} title="Reminders" />

        {/* Frequent Reminder Toggle */}
        <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700/50 transition-colors -mx-2">
          <input
            type="checkbox"
            {...register('frequentReminder')}
            className="hidden"
          />
          <div
            onClick={() => setValue('frequentReminder', !frequentReminder)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
              frequentReminder
                ? 'bg-primary-500'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <motion.span
              layout
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ${
                frequentReminder ? 'translate-x-6' : 'translate-x-1'
              }`}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </div>
          <div className="flex items-center gap-2">
            {frequentReminder ? (
              <Bell className="h-4 w-4 text-primary-500" />
            ) : (
              <BellOff className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Frequent Reminders
            </span>
          </div>
        </label>

        {/* Reminder Interval */}
        {frequentReminder && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-3"
          >
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Interval (minutes)
              </label>
              <Input
                type="number"
                min="1"
                max="1440"
                placeholder="30"
                {...register('frequentReminderInterval', { valueAsNumber: true })}
                error={errors.frequentReminderInterval?.message}
                className="!rounded-xl"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Sound
              </label>
              <Controller
                name="reminderSound"
                control={control}
                render={({ field }) => (
                  <SoundSelector
                    value={field.value || DEFAULT_REMINDER_SOUND}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Reminder Flags */}
      <div>
        <SectionHeader icon={Tag} title="Reminder Flags" />
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
          Get notified at specific times before the deadline
        </p>
        <Controller
          name="reminderFlags"
          control={control}
          render={({ field }) => (
            <ReminderFlags
              value={field.value || []}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Notes */}
      <div>
        <SectionHeader icon={FileText} title="Notes" />
        <TextArea
          id="notes"
          {...register('notes')}
          placeholder="Additional notes..."
          rows={2}
          error={errors.notes?.message}
          className="!rounded-xl"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2 sticky bottom-0 bg-white dark:bg-slate-800 pb-1 -mx-1 px-1">
        <Button
          type="button"
          variant="ghost"
          onClick={closeTaskModal}
          disabled={isSubmitting}
          className="flex-1 !rounded-xl"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 !rounded-xl"
        >
          {isSubmitting
            ? 'Saving...'
            : existingTask
              ? 'Update Task'
              : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}
