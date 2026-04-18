# Productivity Time

Premium task management PWA with focus timers, smart reminders, and a beautiful animated UI.

**Live:** https://productivity-time.web.app

## Features

- **Task management** — priority levels, deadlines, tags, notes, status tracking
- **Priority Focus** — pin one task as your priority with live countdown and progress ring
- **Stopwatch** — lap tracking, fullscreen mode, best/worst lap highlighting
- **Countdown Timer** — presets, fullscreen mode, alarm on finish using your chosen sound
- **Smart reminders** — frequent interval reminders, time-based reminder flags, 18 alarm sounds
- **Offline-first** — IndexedDB storage via Dexie, localStorage backup, full PWA support
- **Dark mode** — system / light / dark with smooth transitions
- **Mobile-first** — drawer-style modals, touch-friendly controls, responsive layout
- **Glassmorphism UI** — premium animations via Framer Motion, gradient accents

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS (custom design system)
- Zustand (state) + Dexie (IndexedDB)
- React Hook Form + Zod (forms/validation)
- Framer Motion (animations)
- Firebase (hosting + analytics)

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build to dist/
npm run preview    # preview production build
npm run type-check # TypeScript check
npm run lint       # ESLint
```

## Deployment

Auto-deploys to Firebase Hosting on every push to `main` via GitHub Actions.

**Manual deploy:**
```bash
npm run build
firebase deploy
```

**Required GitHub Secret:** `FIREBASE_SERVICE_ACCOUNT_PRODUCTIVITY_TIME` (Firebase service account JSON)

## Project Structure

```
src/
├── components/
│   ├── dashboard/    # Dashboard, TaskSummary
│   ├── layout/       # Header, Footer
│   ├── tasks/        # Task CRUD components
│   ├── timer/        # Stopwatch, Countdown, TimerHub
│   ├── settings/     # Settings page
│   ├── countdown/    # Priority task countdown widgets
│   └── ui/           # Reusable primitives (Button, Modal, Toast...)
├── hooks/            # useTasks, useCountdown, useTaskReminders
├── lib/              # db (Dexie), firebase, utils, validation
├── store/            # Zustand stores (tasks, settings, ui)
├── constants/        # priorities, sounds, colors
├── types/            # TypeScript types
└── styles/           # Tailwind globals + custom CSS
```

## Built By

[ThalamuxTech](https://thalamux-tech.web.app)
