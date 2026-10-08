import { View, Text, ViewStyle, TouchableOpacity } from 'react-native'
import React, { ReactNode } from 'react'
import { useTheme } from '../theme/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

type FABPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

type FABRadius = 'small' | 'medium' | 'circular';

type AppFABProps = {
  onPress?: () => void;
  size?: number;
  position?: FABPosition;
  borderRadius?: FABRadius;
  disabled?: boolean;

  offsetX?: number;
  offsetY?: number;

  backgroundColor?: string;
  gradientColors?: string[];

  style?: ViewStyle;
  children: ReactNode;
};

const AppFAB = ({
  onPress,
  size = 60,
  position = 'bottom-right',
  borderRadius = 'circular',
  disabled = false,
  offsetX = 16,
  offsetY = 16,
  backgroundColor,
  gradientColors,
  style,
  children,
}: AppFABProps) => {
  const { theme } = useTheme();

  const finalGradient = gradientColors ?? theme.colors.primaryGradient;
  const disabledColor = theme.colors.disabled;


  // Border Radius
  const getRadius = () => {
    switch (borderRadius) {
      case 'small':
        return theme.radius.sm;
      case 'medium':
        return theme.radius.md;
      case 'circular':
      default:
        return size / 2;
    }
  };

  // Position
  const getPositionStyle = (): ViewStyle => {
    const base: ViewStyle = { position: 'absolute' };

    switch (position) {
      case 'top-left':
        return { ...base, top: offsetY, left: offsetX };

      case 'top-center':
        return {
          ...base,
          top: offsetY,
          left: 0,
          right: 0,
          alignItems: 'center',
        };

      case 'top-right':
        return { ...base, top: offsetY, right: offsetX };

      case 'center':
        return {
          ...base,
          top: '50%',
          left: '50%',
          transform: [
            { translateX: -size / 2 },
            { translateY: -size / 2 },
          ],
        };

      case 'bottom-left':
        return { ...base, bottom: offsetY, left: offsetX };

      case 'bottom-center':
        return {
          ...base,
          bottom: offsetY,
          left: 0,
          right: 0,
          alignItems: 'center',
        };

      case 'bottom-right':
      default:
        return { ...base, bottom: offsetY, right: offsetX };
    }
  };

  // Shared container style
  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: getRadius(),
    justifyContent: 'center',
    alignItems: 'center',

    overflow: 'hidden',

    // Shadow
    elevation: 8,
    shadowColor: colors.black,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 6,
  };

  const internalGradientColors: [string, string, ...string[]] = disabled 
  ? [disabledColor, disabledColor] 
  : (finalGradient as [string, string, ...string[]]);

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      disabled={disabled}
      style={[getPositionStyle(), style]}
    >
      {backgroundColor ? (
        <View
          style={[
            containerStyle,
            { backgroundColor: disabled ? disabledColor : backgroundColor },
          ]}
        >
          {children}
        </View>
      ) : (
        <LinearGradient
          colors={internalGradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={containerStyle}
        >
          {children}
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

export default AppFAB;