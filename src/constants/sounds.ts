export interface ReminderSound {
  id: string
  name: string
  description: string
  file: string
}

export const REMINDER_SOUNDS: ReminderSound[] = [
  {
    id: 'alarm-clock-beep',
    name: 'Alarm Clock Beep',
    description: 'Classic alarm clock beep',
    file: '/sounds/mixkit-alarm-clock-beep-988.wav',
  },
  {
    id: 'digital-clock-beep',
    name: 'Digital Clock Beep',
    description: 'Digital clock alert',
    file: '/sounds/mixkit-alarm-digital-clock-beep-989.wav',
  },
  {
    id: 'alert-alarm',
    name: 'Alert Alarm',
    description: 'Sharp alert alarm',
    file: '/sounds/mixkit-alert-alarm-1005.wav',
  },
  {
    id: 'classic-alarm',
    name: 'Classic Alarm',
    description: 'Traditional alarm tone',
    file: '/sounds/mixkit-classic-alarm-995.wav',
  },
  {
    id: 'critical-alarm',
    name: 'Critical Alarm',
    description: 'Urgent warning alarm',
    file: '/sounds/mixkit-critical-alarm-1004.wav',
  },
  {
    id: 'digital-alarm-buzzer',
    name: 'Digital Alarm Buzzer',
    description: 'Buzzy digital alarm',
    file: '/sounds/mixkit-digital-clock-digital-alarm-buzzer-992.wav',
  },
  {
    id: 'emergency-alert',
    name: 'Emergency Alert',
    description: 'Emergency warning siren',
    file: '/sounds/mixkit-emergency-alert-alarm-1007.wav',
  },
  {
    id: 'facility-alarm',
    name: 'Facility Alarm',
    description: 'Facility alarm tone',
    file: '/sounds/mixkit-facility-alarm-908.wav',
  },
  {
    id: 'morning-clock-alarm',
    name: 'Morning Clock Alarm',
    description: 'Morning clock alarm',
    file: '/sounds/mixkit-morning-clock-alarm-1003.wav',
  },
  {
    id: 'vintage-warning',
    name: 'Vintage Warning',
    description: 'Vintage warning alarm',
    file: '/sounds/mixkit-vintage-warning-alarm-990.wav',
  },
]

export const DEFAULT_REMINDER_SOUND = 'alarm-clock-beep'

// Generate simple beep sounds using Web Audio API as fallback
export function generateBeepSound(frequency: number = 800, duration: number = 200): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration / 1000)
  } catch (error) {
    console.error('Failed to generate beep sound:', error)
  }
}

// Play reminder sound
export function playReminderSound(soundId: string): void {
  const sound = REMINDER_SOUNDS.find(s => s.id === soundId)
    || REMINDER_SOUNDS.find(s => s.id === DEFAULT_REMINDER_SOUND)

  if (!sound) {
    // Fallback to generated beep
    generateBeepSound()
    return
  }

  const audio = new Audio(sound.file)
  audio.volume = 0.5

  audio.play().catch(error => {
    console.error('Failed to play audio file:', error)
    // Fallback to generated beep if file fails to load
    generateBeepSound()
  })
}

// Map sound IDs to frequencies for fallback beeps
export const SOUND_FREQUENCIES: Record<string, number> = {
  'alarm-clock-beep': 700,
  'digital-clock-beep': 900,
  'alert-alarm': 1100,
  'classic-alarm': 800,
  'critical-alarm': 1200,
  'digital-alarm-buzzer': 1000,
  'emergency-alert': 1250,
  'facility-alarm': 950,
  'morning-clock-alarm': 650,
  'vintage-warning': 1050,
}
