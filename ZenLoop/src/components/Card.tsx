import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  isDarkMode?: boolean;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  onPress, 
  isDarkMode = false,
  elevated = true 
}) => {
  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  
  const cardStyle: ViewStyle = {
    ...styles.card,
    backgroundColor: colors.card,
    borderColor: colors.border,
    ...(elevated && styles.elevated),
  };

  if (onPress) {
    return (
      <TouchableOpacity 
        style={[cardStyle, style]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});
