import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ExercisesState, Exercise } from '../../types';
import { exercisesAPI } from '../../services/api';

const initialState: ExercisesState = {
  exercises: [],
  loading: false,
  error: null,
  selectedExercise: null,
};

export const fetchExercises = createAsyncThunk(
  'exercises/fetch',
  async (muscle: string | undefined, { rejectWithValue }) => {
    try {
      const response = await exercisesAPI.getExercises(muscle);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch exercises');
    }
  }
);

const exercisesSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    setSelectedExercise: (state, action: PayloadAction<Exercise>) => {
      state.selectedExercise = action.payload;
    },
    clearSelectedExercise: (state) => {
      state.selectedExercise = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExercises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExercises.fulfilled, (state, action: PayloadAction<Exercise[]>) => {
        state.loading = false;
        state.exercises = action.payload;
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedExercise, clearSelectedExercise, clearError } = exercisesSlice.actions;
export default exercisesSlice.reducer;
