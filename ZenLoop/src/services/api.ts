import axios from 'axios';
import { API_CONFIG } from '../constants';
import { User, Exercise } from '../types';

// Auth API
export const authAPI = {
  login: async (credentials: { username: string; password: string }): Promise<User> => {
    try {
      // Try DummyJSON API first (for demo users like 'emilys')
      const response = await axios.post(`${API_CONFIG.AUTH_API}/login`, credentials);
      return response.data;
    } catch (error: any) {
      // If API login fails, check for locally registered users
      try {
        const registeredUsers = await import('@react-native-async-storage/async-storage').then(m => m.default);
        const storedUsers = await registeredUsers.getItem('@zenloop_registered_users');
        
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const user = users.find(
            (u: any) => u.username === credentials.username && u.password === credentials.password
          );
          
          if (user) {
            // Generate a mock token for local user
            const mockToken = `local_${Date.now()}_${Math.random().toString(36)}`;
            return {
              id: user.id,
              username: user.username,
              email: user.email,
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              token: mockToken,
            };
          }
        }
      } catch (localError) {
        console.warn('Local user check failed:', localError);
      }
      
      throw new Error(error.response?.data?.message || 'Invalid username or password');
    }
  },

  register: async (userData: any): Promise<User> => {
    try {
      // Store user locally for future login
      const AsyncStorage = await import('@react-native-async-storage/async-storage').then(m => m.default);
      const storedUsers = await AsyncStorage.getItem('@zenloop_registered_users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Check if username or email already exists
      const existingUser = users.find(
        (u: any) => u.username === userData.username || u.email === userData.email
      );
      
      if (existingUser) {
        throw new Error('Username or email already exists');
      }
      
      // Create new user object
      const newUser = {
        id: users.length + 1,
        username: userData.username,
        email: userData.email,
        password: userData.password, // In real app, this would be hashed
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
      };
      
      // Store in local array
      users.push(newUser);
      await AsyncStorage.setItem('@zenloop_registered_users', JSON.stringify(users));
      
      // Also try DummyJSON API (won't persist but returns success)
      try {
        const response = await axios.post(`${API_CONFIG.USERS_API}/add`, userData);
        return response.data;
      } catch (apiError) {
        // If API fails, return our local user
        return newUser;
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  },
};

// Exercises API
export const exercisesAPI = {
  getExercises: async (muscle?: string, limit: number = 10): Promise<Exercise[]> => {
    try {
      const params: any = { offset: 0 };
      
      if (muscle) {
        params.muscle = muscle;
      }
      
      // Note: You need to get a free API key from https://api-ninjas.com
      // and update API_CONFIG.EXERCISES_API_KEY
      const response = await axios.get(API_CONFIG.EXERCISES_API, {
        params,
        headers: {
          'X-Api-Key': API_CONFIG.EXERCISES_API_KEY,
        },
      });

      // Return limited results
      return response.data.slice(0, limit);
    } catch (error: any) {
      // Fallback to dummy data if API fails
      console.warn('API call failed, using dummy data:', error.message);
      return getDummyExercises(muscle);
    }
  },
};

// Dummy data for development/testing
function getDummyExercises(muscle?: string): Exercise[] {
  const dummyData: Exercise[] = [
    {
      name: 'Push-ups',
      type: 'strength',
      muscle: 'chest',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Start in a plank position with hands shoulder-width apart. Lower your body until chest nearly touches the floor. Push back up to starting position.',
    },
    {
      name: 'Squats',
      type: 'strength',
      muscle: 'quadriceps',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Stand with feet shoulder-width apart. Lower your body by bending knees and hips. Keep back straight. Return to starting position.',
    },
    {
      name: 'Plank',
      type: 'strength',
      muscle: 'abdominals',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Hold a push-up position with forearms on the ground. Keep body straight from head to heels. Hold for 30-60 seconds.',
    },
    {
      name: 'Bicep Curls',
      type: 'strength',
      muscle: 'biceps',
      equipment: 'dumbbells',
      difficulty: 'beginner',
      instructions: 'Stand with dumbbells in hands, arms fully extended. Curl weights up to shoulders, keeping elbows stationary. Lower back down.',
    },
    {
      name: 'Lunges',
      type: 'strength',
      muscle: 'quadriceps',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Step forward with one leg, lowering hips until both knees are at 90 degrees. Push back to starting position. Alternate legs.',
    },
    {
      name: 'Shoulder Press',
      type: 'strength',
      muscle: 'shoulders',
      equipment: 'dumbbells',
      difficulty: 'intermediate',
      instructions: 'Hold dumbbells at shoulder height. Press weights overhead until arms are fully extended. Lower back to shoulders.',
    },
    {
      name: 'Deadlifts',
      type: 'strength',
      muscle: 'hamstrings',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Stand with barbell over feet. Bend at hips and knees to grip bar. Lift by extending hips and knees. Lower bar to ground.',
    },
    {
      name: 'Tricep Dips',
      type: 'strength',
      muscle: 'triceps',
      equipment: 'body_only',
      difficulty: 'intermediate',
      instructions: 'Position hands on parallel bars. Lower body by bending elbows until shoulders are below elbows. Push back up.',
    },
    {
      name: 'Pull-ups',
      type: 'strength',
      muscle: 'lats',
      equipment: 'pull_up_bar',
      difficulty: 'intermediate',
      instructions: 'Hang from bar with overhand grip. Pull body up until chin is above bar. Lower back down with control.',
    },
    {
      name: 'Burpees',
      type: 'cardio',
      muscle: 'abdominals',
      equipment: 'body_only',
      difficulty: 'expert',
      instructions: 'From standing, drop into squat, kick feet back to plank, do push-up, return to squat, jump up. Repeat.',
    },
  ];

  if (muscle) {
    return dummyData.filter((ex) => ex.muscle.toLowerCase() === muscle.toLowerCase());
  }

  return dummyData;
}
