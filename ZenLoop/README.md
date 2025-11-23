# ZenLoop - Health & Wellness Mobile App

A cross-platform mobile application built with React Native and Expo for tracking exercises and wellness activities.

## 📱 Features

### ✅ Implemented Features

1. **User Authentication**
   - Registration with comprehensive validation (email, username, password strength)
   - Login functionality with DummyJSON API
   - Secure token storage using AsyncStorage
   - Session persistence across app restarts
   - Demo credentials provided on login screen

2. **Navigation Structure**
   - Stack Navigation for auth flow
   - Bottom Tab Navigation for main app
   - Protected routes based on authentication state
   - Smooth transitions between screens

3. **Home Screen**
   - Dynamic exercise list fetched from API
   - Exercise cards with image/icon, title, difficulty, and muscle group
   - Search functionality
   - Filter by muscle group
   - Pull-to-refresh
   - User greeting with profile initial

4. **Exercise Details**
   - Comprehensive exercise information
   - Instructions display
   - Equipment and difficulty indicators
   - Type and muscle group badges
   - Safety tips

5. **Favourites System**
   - Toggle exercises as favourites
   - Dedicated favourites screen
   - AsyncStorage persistence
   - Remove from favourites functionality
   - Favourites count badge

6. **State Management**
   - Redux Toolkit for global state
   - Separate slices for auth, exercises, favourites, and theme
   - Async thunks for API calls
   - Type-safe Redux with TypeScript

7. **Styling & UI**
   - Consistent, clean design
   - Feather Icons throughout
   - Responsive design for various screen sizes
   - Color-coded difficulty levels
   - Card-based layouts with elevation

8. **Dark Mode (Bonus)**
   - Toggle between light and dark themes
   - Theme persistence using AsyncStorage
   - Consistent color schemes
   - Smooth theme transitions

9. **Best Practices**
   - TypeScript for type safety
   - Feature-based folder structure
   - Reusable components
   - Proper validation with Yup
   - Secure credential storage
   - Error handling
   - Loading states

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd {path}
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

Other DummyJSON test users also work. See: https://dummyjson.com/users

## 📁 Project Structure

```
ZenLoop/
├── assets/                 # Images and static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── constants/         # App constants, colors, API config
│   ├── navigation/        # Navigation configuration
│   │   ├── AuthNavigator.tsx
│   │   ├── HomeNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── RootNavigator.tsx
│   ├── redux/            # Redux store and slices
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── exercisesSlice.ts
│   │   │   ├── favouritesSlice.ts
│   │   │   └── themeSlice.ts
│   │   ├── hooks.ts
│   │   └── store.ts
│   ├── screens/          # App screens
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ExerciseDetailsScreen.tsx
│   │   ├── FavouritesScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/         # API services
│   │   └── api.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   └── utils/            # Utility functions
│       └── validation.ts
├── App.tsx              # Root component
├── package.json
└── tsconfig.json
```

## 🎨 Color Scheme

### Light Mode
- Primary: `#6C63FF` (Purple)
- Secondary: `#4CAF50` (Green)
- Background: `#F5F5F5`
- Card: `#FFFFFF`
- Accent: `#FF6B6B` (Red)

### Dark Mode
- Primary: `#8B83FF`
- Secondary: `#66BB6A`
- Background: `#121212`
- Card: `#1E1E1E`
- Accent: `#FF8A80`

### Difficulty Colors
- Beginner: Green `#4CAF50`
- Intermediate: Orange `#FF9800`
- Expert: Red `#F44336`

## 🔌 APIs Used

1. **Authentication:** [DummyJSON Auth API](https://dummyjson.com/docs/auth)
2. **Exercises:** [API Ninjas Exercises API](https://api-ninjas.com/api/exercises)
   - Falls back to dummy data if API unavailable

## 📦 Dependencies

### Core
- `react` & `react-native` - Framework
- `expo` - Development platform
- `typescript` - Type safety

### Navigation
- `@react-navigation/native` - Navigation library
- `@react-navigation/stack` - Stack navigation
- `@react-navigation/bottom-tabs` - Tab navigation

### State Management
- `@reduxjs/toolkit` - State management
- `react-redux` - React bindings for Redux

### Storage & API
- `@react-native-async-storage/async-storage` - Persistent storage
- `axios` - HTTP client

### Forms & Validation
- `yup` - Schema validation

### UI
- `@expo/vector-icons` - Feather icons

## 🧪 Testing the App

1. **Login Flow:**
   - Use demo credentials: `emilys` / `emilyspass`
   - Try invalid credentials to test validation
   - Navigate to registration

2. **Registration:**
   - Test form validation (email, password strength, etc.)
   - Try creating an account (note: won't persist with DummyJSON)

3. **Home Screen:**
   - View exercise list
   - Filter by muscle groups
   - Search exercises
   - Pull to refresh

4. **Favourites:**
   - Add exercises to favourites (heart icon)
   - View favourites screen
   - Remove from favourites
   - Check persistence (close and reopen app)

5. **Dark Mode:**
   - Toggle dark mode in Profile screen
   - Verify theme persists across app restarts

6. **Exercise Details:**
   - Tap any exercise card
   - Review instructions and details
   - Navigate back

## 🔒 Security Practices

- User tokens stored securely in AsyncStorage
- Password validation requires uppercase and numbers
- No sensitive data in source code
- Proper error handling for API failures
 

## 📝 Development Notes

- **Feature-based commits:** Each major feature committed separately
- **Validation:** Comprehensive input validation on all forms
- **Code Quality:** TypeScript, proper typing, reusable components
- **Best Practices:** Following React Native and Redux best practices
- **API Key:** Get your own from api-ninjas.com for production use

## 🐛 Troubleshooting

**Issue: "Cannot find module '@react-navigation/native'"**
- Solution: Run `npm install` again

**Issue: "API returns no data"**
- Solution: App uses dummy data fallback automatically

**Issue: "Dark mode doesn't persist"**
- Solution: Clear app data and try again

**Issue: TypeScript errors**
- Solution: Run `npm start -- --reset-cache`

## 📄 License

This project is created for educational purposes as part of IN3210 Mobile Applications Development course assignment.

## 👨‍💻 Author

Student Project - ZenLoop Health & Wellness App

---

**Note:** This app uses dummy APIs for demonstration.