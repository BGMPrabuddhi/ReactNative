import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import exercisesReducer from './slices/exercisesSlice';
import favouritesReducer from './slices/favouritesSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exercises: exercisesReducer,
    favourites: favouritesReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/loadUser/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
