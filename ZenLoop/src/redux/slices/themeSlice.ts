import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeState } from '../../types';
import { STORAGE_KEYS } from '../../constants';

const initialState: ThemeState = {
  isDarkMode: false,
};

export const loadTheme = createAsyncThunk('theme/load', async () => {
  try {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    return theme === 'dark';
  } catch (error) {
    return false;
  }
});

export const saveTheme = createAsyncThunk('theme/save', async (isDarkMode: boolean) => {
  await AsyncStorage.setItem(STORAGE_KEYS.THEME, isDarkMode ? 'dark' : 'light');
  return isDarkMode;
});

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTheme.fulfilled, (state, action) => {
        state.isDarkMode = action.payload;
      })
      .addCase(saveTheme.fulfilled, (state, action) => {
        state.isDarkMode = action.payload;
      });
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
