import { z } from 'zod'
import { DEFAULT_REMINDER_SOUND } from '@/constants/sounds'

const reminderFlagSchema = z.object({
  id: z.string(),
  label: z.string(),
  minutesBefore: z.number().min(0),
  enabled: z.boolean(),
})

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .default(''),
  priority: z.enum(['priority', 'high', 'medium', 'low']),
  deadline: z.number(),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed').optional().default([]),
  estimatedDuration: z.number().min(0).optional().default(0),
  notes: z.string().optional().default(''),
  frequentReminder: z.boolean().optional().default(false),
  frequentReminderInterval: z.number().min(1).max(1440).optional().default(30),
  reminderSound: z.string().optional().default(DEFAULT_REMINDER_SOUND),
  reminderFlags: z.array(reminderFlagSchema).optional().default([]),
  status: z.enum(['todo', 'in-progress', 'completed']).optional(),
})

export type TaskFormData = z.infer<typeof taskSchema>
