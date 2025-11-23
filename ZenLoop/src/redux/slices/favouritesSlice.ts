import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavouritesState, Exercise } from '../../types';
import { STORAGE_KEYS } from '../../constants';

const initialState: FavouritesState = {
  items: [],
};

export const loadFavourites = createAsyncThunk('favourites/load', async () => {
  try {
    const favouritesData = await AsyncStorage.getItem(STORAGE_KEYS.FAVOURITES);
    return favouritesData ? JSON.parse(favouritesData) : [];
  } catch (error) {
    return [];
  }
});

export const saveFavourites = createAsyncThunk(
  'favourites/save',
  async (favourites: Exercise[]) => {
    await AsyncStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(favourites));
    return favourites;
  }
);

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addFavourite: (state, action: PayloadAction<Exercise>) => {
      const exists = state.items.some((item) => item.name === action.payload.name);
      if (!exists) {
        state.items.push(action.payload);
        // Save to AsyncStorage immediately
        AsyncStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(state.items));
      }
    },
    removeFavourite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.name !== action.payload);
      // Save to AsyncStorage immediately
      AsyncStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(state.items));
    },
    toggleFavourite: (state, action: PayloadAction<Exercise>) => {
      const index = state.items.findIndex((item) => item.name === action.payload.name);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
      // Save to AsyncStorage immediately after toggle
      AsyncStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(state.items));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavourites.fulfilled, (state, action: PayloadAction<Exercise[]>) => {
        state.items = action.payload;
      })
      .addCase(saveFavourites.fulfilled, (state, action: PayloadAction<Exercise[]>) => {
        state.items = action.payload;
      });
  },
});

export const { addFavourite, removeFavourite, toggleFavourite } = favouritesSlice.actions;
export default favouritesSlice.reducer;
