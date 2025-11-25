import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle, ImageStyle, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  isDarkMode?: boolean;
  style?: ViewStyle;
  onPress?: () => void;
  showEditBadge?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name = 'U',
  size = 'medium',
  isDarkMode = false,
  style,
  onPress,
  showEditBadge = false,
}) => {
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { dimension: 36, fontSize: 14, badgeSize: 20 };
      case 'large':
        return { dimension: 80, fontSize: 32, badgeSize: 28 };
      case 'xlarge':
        return { dimension: 100, fontSize: 40, badgeSize: 32 };
      case 'medium':
      default:
        return { dimension: 50, fontSize: 20, badgeSize: 24 };
    }
  };

  const sizeConfig = getSizeConfig();
  const initial = (name?.[0] || 'U').toUpperCase();

  const avatarImageStyle: ImageStyle = {
    width: sizeConfig.dimension,
    height: sizeConfig.dimension,
    borderRadius: sizeConfig.dimension / 2,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  };

  const avatarViewStyle: ViewStyle = {
    width: sizeConfig.dimension,
    height: sizeConfig.dimension,
    borderRadius: sizeConfig.dimension / 2,
  };

  const renderAvatar = () => (
    <View style={[styles.container, style]}>
      {source ? (
        <Image 
          source={{ uri: source }} 
          style={avatarImageStyle}
        />
      ) : (
        <View style={[styles.placeholder, avatarViewStyle, { backgroundColor: colors.primary }]}>
          <Text style={[styles.initial, { fontSize: sizeConfig.fontSize }]}>
            {initial}
          </Text>
        </View>
      )}
      {showEditBadge && (
        <View 
          style={[
            styles.editBadge, 
            { 
              backgroundColor: colors.primary,
              width: sizeConfig.badgeSize,
              height: sizeConfig.badgeSize,
              borderRadius: sizeConfig.badgeSize / 2,
            }
          ]}
        >
          <Feather name="camera" size={sizeConfig.badgeSize * 0.5} color="#fff" />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {renderAvatar()}
      </TouchableOpacity>
    );
  }

  return renderAvatar();
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  initial: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
});
