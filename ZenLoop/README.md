# ZenLoop - Health & Wellness Mobile App

A cross-platform mobile application built with React Native and Expo for tracking exercises and wellness activities.

## 📱 Features

- **User Authentication** - Login/register with validation, secure token storage
- **Exercise Browser** - Browse exercises with search, muscle group filters, and pull-to-refresh
- **Exercise Details** - View comprehensive exercise information with instructions
- **Favourites System** - Save favourite exercises with AsyncStorage persistence
- **Dark Mode** - Toggle theme with persistent preference
- **Redux Toolkit** - Global state management with TypeScript
- **Responsive UI** - Clean design with Feather icons and card layouts

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd ZenLoop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API Key (Optional):**
   - Get a free API key from [API Ninjas](https://api-ninjas.com)
   - Open `src/constants/index.ts`
   - Replace `YOUR_API_KEY_HERE` with your actual API key
   - Note: The app includes dummy data fallback if API fails

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Run on your device:**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app on your phone

## 🔐 Demo Credentials

Use these credentials to test the login functionality:

- **Username:** `emilys`
- **Password:** `emilyspass`

Other DummyJSON test users also work: https://dummyjson.com/users

## 📁 Project Structure

```
ZenLoop/
├── assets/                 # Images and static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── constants/         # App constants, colors, API config
│   ├── navigation/        # Navigation configuration
│   ├── redux/            # Redux store and slices
│   │   └── slices/       # Auth, exercises, favourites, theme
│   ├── screens/          # App screens
│   ├── services/         # API services
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── App.tsx              # Root component
├── package.json
└── tsconfig.json
```

## 🎨 Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Navigation:** React Navigation (Stack + Bottom Tabs)
- **Storage:** AsyncStorage
- **Validation:** Yup
- **Icons:** Feather Icons
- **HTTP Client:** Axios

## 🔌 APIs Used

1. **Authentication:** [DummyJSON Auth API](https://dummyjson.com/docs/auth)
2. **Exercises:** [API Ninjas Exercises API](https://api-ninjas.com/api/exercises)
   - Falls back to dummy data if API unavailable

## 🧪 Testing the App

1. **Login Flow** - Use demo credentials or test validation with invalid inputs
2. **Home Screen** - Browse exercises, use search and filters, pull to refresh
3. **Favourites** - Add/remove exercises, verify persistence after app restart
4. **Dark Mode** - Toggle in Profile screen, verify persistence after app restart
5. **Exercise Details** - Tap any exercise to view full information

## 🐛 Troubleshooting

**Issue: Dependencies error**
- Solution: Run `npm install` again

**Issue: API returns no data**
- Solution: App uses dummy data fallback automatically

**Issue: Dark mode doesn't persist**
- Solution: Clear app data and try again

**Issue: TypeScript errors**
- Solution: Run `npm start -- --reset-cache`

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Student Project - ZenLoop Health & Wellness App
