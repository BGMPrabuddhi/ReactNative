import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeStackParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import ExerciseDetailsScreen from '../screens/ExerciseDetailsScreen';

const Stack = createStackNavigator<HomeStackParamList>();

const HomeNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ExerciseList" component={HomeScreen} />
      <Stack.Screen name="ExerciseDetails" component={ExerciseDetailsScreen} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
