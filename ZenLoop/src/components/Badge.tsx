import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface BadgeProps {
  text: string;
  color: string;
  icon?: keyof typeof Feather.glyphMap;
  variant?: 'filled' | 'outline';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ 
  text, 
  color, 
  icon, 
  variant = 'filled',
  size = 'medium',
  style 
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: 8, paddingVertical: 4, fontSize: 10, iconSize: 10 };
      case 'large':
        return { paddingHorizontal: 14, paddingVertical: 8, fontSize: 14, iconSize: 16 };
      case 'medium':
      default:
        return { paddingHorizontal: 10, paddingVertical: 6, fontSize: 12, iconSize: 14 };
    }
  };

  const sizeConfig = getSize();

  const badgeStyle: ViewStyle = {
    ...styles.badge,
    backgroundColor: variant === 'filled' ? `${color}20` : 'transparent',
    borderWidth: variant === 'outline' ? 1 : 0,
    borderColor: color,
    paddingHorizontal: sizeConfig.paddingHorizontal,
    paddingVertical: sizeConfig.paddingVertical,
  };

  return (
    <View style={[badgeStyle, style]}>
      {icon && (
        <Feather 
          name={icon} 
          size={sizeConfig.iconSize} 
          color={color} 
          style={styles.icon}
        />
      )}
      <Text style={[styles.text, { color, fontSize: sizeConfig.fontSize }]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '600',
  },
});
