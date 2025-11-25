export * from './colors';
export * from './theme';

export const API_CONFIG = {
  EXERCISES_API: 'https://api.api-ninjas.com/v1/exercises',
  EXERCISES_API_KEY: 'lQrWJ8XQ16VNVRyrXQ4UcAasQ4zoRDqiIva0bFwV', // Get from https://api-ninjas.com
  AUTH_API: 'https://dummyjson.com/auth',
  USERS_API: 'https://dummyjson.com/users',
};

export const STORAGE_KEYS = {
  USER_TOKEN: '@zenloop_user_token',
  USER_DATA: '@zenloop_user_data',
  FAVOURITES: '@zenloop_favourites',
  THEME: '@zenloop_theme',
  REGISTERED_USERS: '@zenloop_registered_users',
};

export const MUSCLE_GROUPS = [
  'abdominals',
  'abductors',
  'adductors',
  'biceps',
  'calves',
  'chest',
  'forearms',
  'glutes',
  'hamstrings',
  'lats',
  'lower_back',
  'middle_back',
  'neck',
  'quadriceps',
  'traps',
  'triceps',
];

export const EXERCISE_TYPES = [
  'cardio',
  'olympic_weightlifting',
  'plyometrics',
  'powerlifting',
  'strength',
  'stretching',
  'strongman',
];

export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'expert'];

