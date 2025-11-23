// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token?: string;
  image?: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Exercise Types
export interface Exercise {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

export interface ExercisesState {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  selectedExercise: Exercise | null;
}

// Favourites Types
export interface FavouritesState {
  items: Exercise[];
}

// Theme Types
export interface ThemeState {
  isDarkMode: boolean;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Favourites: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  ExerciseList: undefined;
  ExerciseDetails: { exercise: Exercise };
};
