import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loadUser } from '../redux/slices/authSlice';
import { loadTheme } from '../redux/slices/themeSlice';
import { RootStackParamList } from '../types';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  useEffect(() => {
    // Load user session and theme on app start
    dispatch(loadUser());
    dispatch(loadTheme());
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RootNavigator;
