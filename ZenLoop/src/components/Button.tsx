import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isDarkMode?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'right',
  fullWidth = true,
  style,
  textStyle,
  isDarkMode = false,
}) => {
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  const getBackgroundColor = () => {
    if (disabled || loading) return colors.border;
    
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'danger':
        return colors.error;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled || loading) return colors.textSecondary;
    
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return '#FFFFFF';
      case 'outline':
      case 'ghost':
        return colors.primary;
      default:
        return '#FFFFFF';
    }
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return { height: 40, paddingHorizontal: 16, fontSize: 14 };
      case 'large':
        return { height: 56, paddingHorizontal: 24, fontSize: 18 };
      case 'medium':
      default:
        return { height: 50, paddingHorizontal: 20, fontSize: 16 };
    }
  };

  const sizeConfig = getSize();
  const backgroundColor = getBackgroundColor();
  const textColor = getTextColor();

  const buttonStyle: ViewStyle = {
    ...styles.button,
    backgroundColor,
    height: sizeConfig.height,
    paddingHorizontal: sizeConfig.paddingHorizontal,
    width: fullWidth ? '100%' : 'auto',
    borderWidth: variant === 'outline' ? 2 : 0,
    borderColor: variant === 'outline' ? colors.primary : 'transparent',
    opacity: disabled || loading ? 0.6 : 1,
  };

  const renderIcon = () => {
    if (!icon) return null;
    return (
      <Feather 
        name={icon} 
        size={sizeConfig.fontSize + 2} 
        color={textColor} 
        style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight}
      />
    );
  };

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <View style={styles.content}>
          <ActivityIndicator color={textColor} size="small" />
          <Text style={[styles.text, { color: textColor, fontSize: sizeConfig.fontSize, marginLeft: 8 }, textStyle]}>
            {title}
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && renderIcon()}
          <Text style={[styles.text, { color: textColor, fontSize: sizeConfig.fontSize }, textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && renderIcon()}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
