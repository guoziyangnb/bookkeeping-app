# Bookkeeping App

A personal bookkeeping application built with Vue 3, offering comprehensive features for income and expense tracking, statistical analysis, and data backup.

## Features

### 💰 Bookkeeping
- Quickly add income or expense records
- Support for category management (e.g., dining, transportation, shopping)
- Select date and time
- Add notes or descriptions
- Support for image attachments

### 📊 Data Statistics
- Daily/weekly/monthly income and expense overviews
- Balance card display
- Line chart trend analysis
- Pie chart category breakdown

### 📅 Calendar View
- View daily records by month
- Quick date selection
- Daily spending indicators

### ⚙️ Additional Features
- Dark/light theme toggle
- Local data storage
- Data backup and restore
- User authentication

## Technology Stack

- **Frontend Framework**: Vue 3  
- **State Management**: Pinia  
- **Routing**: Vue Router  
- **Build Tool**: Vite  
- **UI Components**: Custom CSS (glassmorphism design)

## Project Structure

```
src/
├── assets/styles/      # Global styles
├── components/
│   ├── common/         # Common components
│   │   ├── BackNavBar.vue
│   │   ├── DatePicker.vue
│   │   ├── DateSelectModal.vue
│   │   ├── FormSection.vue
│   │   ├── ImageUpload.vue
│   │   └── Toast.vue
│   ├── features/       # Feature components
│   │   ├── AddRecordModal.vue
│   │   ├── BalanceCard.vue
│   │   ├── LineChart.vue
│   │   ├── PieChart.vue
│   │   ├── QuickActions.vue
│   │   └── TransactionItem.vue
│   └── layout/         # Layout components
│       ├── Header.vue
│       └── TabBar.vue
├── router/             # Routing configuration
├── stores/             # Pinia state management
│   ├── records.js      # Record data
│   ├── ui.js           # UI state
│   └── user.js         # User data
├── utils/              # Utility functions
│   ├── date.js
│   ├── format.js
│   ├── message.js
│   └── storage.js
└── views/              # Page views
    ├── Auth.vue
    ├── Backup.vue
    ├── Calendar.vue
    ├── FieldEditPage.vue
    ├── Home.vue
    ├── Profile.vue
    ├── Settings.vue
    ├── Stats.vue
    └── Welcome.vue
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

The app will start at http://localhost:3000.

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage Instructions

1. **First Use**: Complete registration or login on the welcome page.
2. **Add Record**: Click the "+" button in the bottom tab bar or use quick actions on the home page.
3. **View Statistics**: Navigate to the "Stats" page to analyze income and expenses.
4. **Calendar View**: Go to the "Calendar" page to browse records by date.
5. **Data Backup**: Access the "Profile" page to perform data backup.

## Storage Method

- Local data persistence using localStorage
- Support for exporting data in JSON format
- Support for importing and restoring data

## License

MIT License