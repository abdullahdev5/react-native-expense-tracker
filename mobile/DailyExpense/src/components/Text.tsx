import { View, Text, ColorValue, TextProps, TextStyle, StyleProp } from 'react-native';
import React, { Children, ReactNode } from 'react';
import { FontWeight, TextDecoration } from '../types/styles';
import { useTheme } from '../theme/ThemeProvider';

type AppTextProps = TextProps & {
  children: ReactNode;
  color?: ColorValue;
  fontSize?: number;
  fontWeight?: FontWeight;
  textDecoration?: TextDecoration;
  textDecorationColor?: ColorValue;
  style?: StyleProp<TextStyle | TextStyle[]>;
};

const AppText = ({
  children,
  color,
  fontSize,
  fontWeight,
  textDecoration,
  textDecorationColor,
  style,

  ...props
}: AppTextProps) => {
  const { theme } = useTheme();

  const finalColor = color ?? theme.colors.text;
  const finalFontSize = fontSize ?? theme.fontSize.small;
  const finalFontWeight = fontWeight ?? 'medium';

  return (
    <Text
      style={[
        {
          color: finalColor,
          fontSize: finalFontSize,
          fontWeight: finalFontWeight,
          textDecorationLine: textDecoration,
          textDecorationColor: textDecorationColor
        },
        style,
      ]}
      
      {...props}
    >
      {children}
    </Text>
  );
};

export default AppText;
