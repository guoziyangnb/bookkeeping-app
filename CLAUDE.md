# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Vue 3 bookkeeping/expense tracking application with a glassmorphism UI design. The app is a single-page application that targets mobile/web environments and can be packaged as an APK using webview containers.

**Tech Stack:**

- Vue 3 (Composition API with `<script setup>`)
- Pinia for state management
- Vue Router for routing
- ECharts for data visualization
- Vite for build tooling

## Development Commands

```bash
# Development server (runs at http://localhost:3000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Architecture

### State Management with Pinia

The app uses two Pinia stores located in `src/stores/`:

1. **`records.js`** - Manages financial records data
   - `state.records`: Array of transaction records
   - `state.idCounter`: Auto-increment ID counter
   - **Important**: Data is loaded from localStorage during store initialization, not in component lifecycle hooks. This ensures data is available before route navigation completes.

2. **`ui.js`** - Manages UI state
   - Theme (light/dark)
   - Current tab selection
   - Modal state (add/edit record)

### Storage Pattern

All data persistence uses the `src/utils/storage.js` utilities which wrap localStorage with:

- Error handling
- `bookkeeping_` prefix for all keys
- JSON serialization

Stored data:

- `records`: Array of transaction records
- `idCounter`: Counter for generating unique IDs
- `theme`: Current theme preference

### Routing

Routes are lazy-loaded in `src/router/index.js`:

- `/` - Home (wallet overview with balance, charts, recent transactions)
- `/calendar` - Calendar view of transactions
- `/stats` - Statistics and charts
- `/settings` - Settings page

**Note**: Due to lazy loading, ensure any data needed by views is available before route navigation. The records store handles this by loading data in its `state()` function.

### Component Structure

```
src/
├── components/
│   ├── layout/          # Header, TabBar
│   ├── features/        # Business logic components (BalanceCard, LineChart, etc.)
│   └── common/          # Reusable UI components (DatePicker)
├── views/               # Page-level components (Home, Calendar, Stats, Settings)
├── stores/              # Pinia stores
└── utils/               # Utility functions (storage, format, date)
```

### Record Data Model

Each record has the structure:

```javascript
{
  id: string,           // Unique ID
  type: 'expense' | 'income',
  amount: number,       // Negative for expense, positive for income
  category: string,     // From categories in store
  note: string,
  date: ISO string,     // Transaction date
  createdAt: ISO string // Record creation timestamp
}
```

## Common Patterns

### Accessing Store Data

```javascript
import { useRecordsStore } from '@/stores/records'
const recordsStore = useRecordsStore()
// Data is automatically available, loaded during store initialization
```

### Adding/Editing Records

The `AddRecordModal` component handles both adding and editing:

- Use `uiStore.openModal(type)` to add a new record
- Use `uiStore.openEditModal(record)` to edit an existing record
- The modal is rendered in `App.vue` globally

## Important Considerations

1. **Mobile-First**: The UI is designed for mobile with glassmorphism effects. Test on mobile viewports or actual devices.

2. **Data Loading Timing**: When adding new features that consume record data, remember that data is loaded in the store's `state()` function, not in `onMounted` hooks.

3. **Chart Updates**: Charts (LineChart, PieChart) use ECharts and watch the records store for changes to update automatically.

4. **Theme System**: The app uses CSS variables for theming. Theme is applied via `data-theme` attribute on `documentElement`.

5. **Path Alias**: `@` is aliased to `src/` directory in imports.
