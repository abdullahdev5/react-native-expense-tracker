import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ColorValue,
  Pressable,
} from "react-native";
import React from "react";
import { colors } from "@/theme/colors";
import { useTheme } from "@/theme";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import AppIcon from "./Icon";

type AppCheckBoxProps = {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

const AppCheckBox = ({
  value,
  onValueChange,
  color,
  style,
}: AppCheckBoxProps) => {
  const { theme } = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    const targetColor = value ? (color ?? theme.colors.primary) : colors.transparent;
    return {
        backgroundColor: withTiming(targetColor, { duration: 200 }),
    };
  }, [value, color, theme]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const opacity = value ? 1 : 0;
    return {
        opacity: withTiming(opacity, { duration: 200 })
    };
  }, [value, color, theme]);

  return (
    <Pressable onPress={() => onValueChange && onValueChange(!value)}>
      <Animated.View
        style={[
          styles.box,
          {
            borderColor: theme.colors.secondary,
          },
          animatedStyle,
          style,
        ]}
      >
        <Animated.View style={animatedIconStyle}>
          <AppIcon name="check" provider="Entypo" color={colors.white} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  box: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default AppCheckBox;
