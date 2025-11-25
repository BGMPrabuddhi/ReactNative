# ZenLoop - Health & Wellness Mobile App

A cross-platform mobile application built with React Native and Expo for tracking exercises and managing your fitness journey.

## 📱 Features

- ✅ **User Authentication** - Secure login/register with form validation
- 🏋️ **Exercise Browser** - Browse exercises with search and filters
- 📋 **Exercise Details** - View comprehensive instructions and information
- ❤️ **Favourites System** - Save favourite exercises with local persistence
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 🔄 **State Management** - Redux Toolkit with TypeScript
- 🎨 **Modern UI** - Clean, responsive design with Feather icons

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Navigate to project directory
cd ZenLoop

# Install dependencies
npm install

# Start development server
npx expo start

# Run on platform
# Press 'a' for Android
# Press 'i' for iOS
# Press 'w' for Web
# Or scan QR code with Expo Go app
```

### API Configuration (Optional)

The app works with dummy data by default. To use real exercise data:

1. Get a free API key from [API-Ninjas.com](https://api-ninjas.com)
2. Open `src/constants/index.ts`
3. Replace the `EXERCISES_API_KEY` value with your key
4. Restart the development server

## 🔐 Demo Credentials

Test the login with these credentials:

**Demo User (DummyJSON API):**
- Username: `emilys`
- Password: `emilyspass`

**Or create your own account** using the registration flow.

## 📁 Project Structure

```
ZenLoop/
├── src/
│   ├── components/          # Reusable UI components (8 components)
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── SearchBar.tsx
│   │
│   ├── constants/           # App configuration & theme
│   │   ├── colors.ts        # Light/dark color schemes
│   │   ├── theme.ts         # Spacing, fonts, shadows
│   │   └── index.ts         # API config, constants
│   │
│   ├── navigation/          # Navigation structure
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── HomeNavigator.tsx
│   │
│   ├── redux/              # Redux Toolkit state management
│   │   ├── store.ts
│   │   ├── hooks.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── exercisesSlice.ts
│   │       ├── favouritesSlice.ts
│   │       └── themeSlice.ts
│   │
│   ├── screens/            # App screens (6 screens)
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ExerciseDetailsScreen.tsx
│   │   ├── FavouritesScreen.tsx
│   │   └── ProfileScreen.tsx
│   │
│   ├── services/           # API integration
│   │   └── api.ts
│   │
│   ├── types/             # TypeScript definitions
│   │   └── index.ts
│   │
│   └── utils/             # Helper functions
│       └── validation.ts
│
├── assets/                # Images & icons
├── App.tsx               # Root component
└── package.json
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React Native 0.81.5 |
| **Platform** | Expo ~54.0.25 |
| **Language** | TypeScript 5.9.2 |
| **State Management** | Redux Toolkit |
| **Navigation** | React Navigation (Stack + Tabs) |
| **Storage** | AsyncStorage |
| **Validation** | Custom validators |
| **HTTP Client** | Axios |
| **Icons** | Feather Icons (@expo/vector-icons) |

## 🔌 APIs Used

**Authentication API:**
- [DummyJSON Auth API](https://dummyjson.com/docs/auth)
- Used for demo user authentication
- Local storage fallback for registered users

**Exercise Data API:**
- [API-Ninjas Exercises API](https://api-ninjas.com/api/exercises)
- 1000+ exercises with instructions
- Free tier: 10 exercises per request
- Automatic fallback to dummy data

## 🎯 Key Features Explained

### Authentication System
- **Registration:** First name, last name, username, email, password
- **Validation:** Email format, password strength, confirm password
- **Security:** Token-based auth, AsyncStorage for persistence
- **Local Storage:** Registered users saved locally

### Exercise Browser
- **Search:** Real-time search with recent history
- **Filters:** Filter by difficulty level and muscle group
- **Cards:** Icon, title, difficulty badge, equipment badge
- **Animations:** Smooth card entry with spring animations

### State Management
- **Redux Toolkit:** 4 slices (auth, exercises, favourites, theme)
- **Typed Hooks:** Custom useAppDispatch & useAppSelector
- **Async Thunks:** API calls with loading states
- **Persistence:** AsyncStorage integration

### Dark Mode
- **Toggle:** Profile screen switch
- **Persistence:** Saved to AsyncStorage
- **Theme:** Complete light/dark color schemes
- **Smooth:** Animated transitions

## 🧪 Testing Guide

**1. Authentication Flow:**
   - Test login with demo credentials
   - Try invalid credentials (error handling)
   - Register new account with validation
   - Logout and verify token removal

**2. Home Screen:**
   - Browse exercise list
   - Use search with recent history
   - Apply difficulty filters
   - Pull to refresh data
   - Check search term highlighting

**3. Exercise Details:**
   - Tap any exercise card
   - View full instructions
   - Toggle favourite button
   - Navigate back

**4. Favourites:**
   - Add exercises to favourites
   - View favourites screen
   - Remove from favourites
   - Restart app (persistence check)

**5. Dark Mode:**
   - Toggle dark mode in Profile
   - Navigate through screens
   - Restart app (persistence check)
     

**API Integration:** Using recommended API-Ninjas Exercises API  
**Best Practices:** TypeScript, reusable components, proper validation  
**Code Quality:** Clean, maintainable, production-ready code  

## 🐛 Troubleshooting

**Dependencies Error:**
```bash
npm install
npx expo start --clear
```

**API Not Working:**
- App automatically falls back to dummy data
- Check API key in `src/constants/index.ts`
- Verify internet connection

**TypeScript Errors:**
```bash
npx tsc --noEmit
```

**Cache Issues:**
```bash
npx expo start --clear
```

**AsyncStorage Issues:**
```bash
# Clear app data from device/simulator
# Or uninstall and reinstall the app
```

## 📱 Platform Support

- ✅ **iOS** - iPhone & iPad
- ✅ **Android** - Phone & Tablet
- ✅ **Web** - Desktop browsers

## 🔄 Updates & Maintenance

**Current Version:** 1.0.0  
**Last Updated:** November 25, 2025  
**Status:** Production Ready  

## 📄 License

This project is created for educational purposes as part of Mobile Applications Development coursework.

## 👨‍💻 Author

**BGMPrabuddhi**  
Repository: [ReactNative](https://github.com/BGMPrabuddhi/ReactNative)

---

**Made with ❤️ using React Native and Expo**
