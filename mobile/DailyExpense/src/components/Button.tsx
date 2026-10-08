import {
  View,
  Pressable,
  ColorValue,
  ViewStyle,
  TouchableOpacity,
  StyleProp,
  GestureResponderEvent,
  TextStyle,
} from 'react-native';
import React, { ReactNode } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from './Text';
import AppIcon from './Icon';
import { colors } from '../theme/colors';

type AppButtonProps = {
  children: ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  width?: number;
  height?: number;
  fullWidth?: boolean;
  backgroundColor?: ColorValue;
  foregroundColor?: ColorValue;
  borderRadius?: number;
  gradientColors?: string[];
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const AppButton = ({
  children,
  onPress,
  width,
  height,
  fullWidth,
  backgroundColor,
  foregroundColor = 'white',
  borderRadius,
  gradientColors,
  disabled = false,
  style,
  buttonStyle,
  textStyle,
}: AppButtonProps) => {
  const { theme } = useTheme();

  const finalGradientColors = gradientColors ?? theme.colors.primaryGradient;
  const finalBorderRadius = borderRadius ?? theme.radius.md;
  const disabledColor = theme.colors.disabled;

  const content =
    typeof children == 'string' ? (
      <AppText
        style={[{ color: disabled ? colors.black : foregroundColor ?? 'white' }, textStyle]}
      >
        {children}
      </AppText>
    ) : (
      children
    );

  const internalButtonStyle: ViewStyle = {
    borderRadius: finalBorderRadius,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.5}
      style={[
        {
          width: fullWidth ? '100%' : width,
          height: height,
        },
        style,
      ]}
    >
      {!backgroundColor ? (
        <LinearGradient
          colors={
            (disabled ? [disabledColor, disabledColor] : finalGradientColors as [string, string, ...string[]])
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[internalButtonStyle, buttonStyle]}
        >
          {content}
        </LinearGradient>
      ) : (
        <View
          style={[
            internalButtonStyle,
            { backgroundColor: disabled ? disabledColor : backgroundColor },
            buttonStyle
          ]}
        >
          {content}
        </View>
      )}
    </TouchableOpacity>
  );
};

// IconButton
type AppIconButtonProps = React.ComponentProps<typeof AppIcon> & {
  onPress: (event: GestureResponderEvent) => void;
  buttonStyle?: StyleProp<ViewStyle>;
  rippleColor?: string; // Optional: custom flash color
};

const AppIconButton = ({
  onPress,
  buttonStyle,
  provider = 'Material', // Default to Material
  rippleColor, // = 'rgba(255, 255, 255, 0.3)',
  ...iconProps // Spreads name, size, color, iconSource, etc.
}: AppIconButtonProps) => {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={iconProps.disabled}
      style={({ pressed }) => [
        {
          borderRadius: '50%',
          padding: 10,
          alignSelf: 'flex-start',
          backgroundColor: pressed
            ? rippleColor ?? theme.colors.rippleColor
            : 'transparent',
        },
        buttonStyle,
      ]}
    >
      {/* We pass all remaining props directly to our universal AppIcon */}
      <AppIcon provider={provider} {...iconProps} />
    </Pressable>
  );
};

export default AppButton;
export { AppIconButton };
