import React from 'react';
import { ColorValue, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type AppSvgComponent = React.FC<any>;

type AppSvgIconProps = {
  icon: AppSvgComponent;
  size?: number;
  color?: ColorValue;
  fill?: ColorValue | null | 'auto';
  stroke?: ColorValue | null | 'auto';
  style?: StyleProp<ViewStyle>;
};

const AppSvgIcon = ({
  icon: Svg,
  size = 24,
  color,
  fill = 'auto',   // default behavior
  stroke = 'auto',
  style,
}: AppSvgIconProps) => {
  const { theme } = useTheme();

  const defaultColor = color ?? theme.colors.text;

  const svgProps: any = {
    width: size,
    height: size,
    style,
    color: defaultColor,
  };

  // FILL LOGIC
  if (fill === 'auto') {
    svgProps.fill = defaultColor; // use theme
  } else if (fill === null || fill === undefined) {
    // don't pass fill → SVG decides (e.g., fill="none")
  } else {
    svgProps.fill = fill; // custom
  }

  // STROKE LOGIC
  if (stroke === 'auto') {
    svgProps.stroke = defaultColor;
  } else if (stroke === null || stroke === undefined) {
    // don't pass stroke
  } else {
    svgProps.stroke = stroke;
  }

  return <Svg {...svgProps} />;
};

export default AppSvgIcon;