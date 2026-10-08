import React, { ReactNode, useMemo } from 'react';
import {
  View,
  ViewStyle,
  StyleProp,
  Platform,
  TouchableOpacity,
  GestureResponderEvent,
  ColorValue,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type AppCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  shadow?: boolean;
  shadowColor?: ColorValue;
  elevation?: number; // Android shadow
  onPress?: (event: GestureResponderEvent) => void;
  backgroundColor?: string;
  padding?: number;
  margin?: number;
} & React.ComponentProps<typeof View>;

const AppCard: React.FC<AppCardProps> = ({
  children,
  style,
  borderRadius,
  shadow = false,
  shadowColor,
  elevation,
  onPress,
  backgroundColor,
  padding = 10,
  margin = 0,
  ...props
}) => {
  const { theme } = useTheme();

  // Memoize shadow style for performance
  const shadowStyle: ViewStyle = useMemo(() => {
    if (!shadow) return {};

    return Platform.select({
      ios: {
        shadowColor: shadowColor ?? theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
      },
      android: {
        shadowColor: shadowColor ?? theme.colors.primary,
        elevation: elevation ?? 10,
      },
    }) as ViewStyle;
  }, [shadow, elevation, theme.colors.black]);

  const cardStyle: ViewStyle = {
    borderRadius: borderRadius ?? theme.radius.md,
    backgroundColor: backgroundColor ?? theme.colors.secondaryBackground,
    padding,
    margin,
    ...shadowStyle,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={[cardStyle, style]}
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[cardStyle, style]} {...props}>
        {children}
    </View>
  );
};

export default AppCard;
