# Todo List Web App

A beautiful, interactive, and modern todo list application built with React, TypeScript, and Tailwind CSS.

## Features

- ✨ Beautiful and intuitive UI/UX
- 🎯 Priority task system with live countdown timer
- ⚡ Real-time updates and animations
- 🎨 Dark mode support
- 📱 Fully responsive design
- 💾 Local data persistence with IndexedDB
- 🔍 Advanced filtering and sorting
- 📊 Task statistics and insights
- 🚫 No login required - works offline

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: IndexedDB (Dexie.js)
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/      # React components
│   ├── ui/         # Reusable UI components
│   ├── layout/     # Layout components
│   ├── dashboard/  # Dashboard components
│   ├── tasks/      # Task-related components
│   └── countdown/  # Countdown timer components
├── hooks/          # Custom React hooks
├── store/          # Zustand state stores
├── lib/            # Utilities and database
├── types/          # TypeScript type definitions
├── constants/      # Constants and configurations
└── styles/         # Global styles
```

## Key Features Explained

### Priority Task System
- Only one task can be marked as "priority" at a time
- Priority tasks are highlighted with a special card
- Live countdown timer shows time remaining
- Visual progress ring indicates deadline proximity

### Task Management
- Create, edit, and delete tasks
- Mark tasks as complete
- Set deadlines, priorities, and add notes
- Filter by status, priority, or search
- Sort by deadline, priority, or creation date

### Data Persistence
- All data is stored locally in IndexedDB
- Automatic backup to localStorage
- Export/import tasks as JSON
- Works completely offline

### Theme System
- Light and dark modes
- System preference detection
- Smooth theme transitions
- Persistent theme selection

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT

## Author

Built with ❤️ using Claude Code
