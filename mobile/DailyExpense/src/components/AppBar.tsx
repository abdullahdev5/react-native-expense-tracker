import {
  View,
  ColorValue,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Platform,
  TextStyle,
} from 'react-native';
import React, { ReactNode } from 'react';
import { Row } from './Layout';
import { useTheme } from '../theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import AppIcon from './Icon';
import { AppIconButton } from './Button';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import AppText from './Text';
import { AuthNavigation } from '../navigation/types';
import LinearGradient from 'react-native-linear-gradient';

type AppBarProps = {
  title?: string;
  height?: number;
  centerTitle?: boolean;
  backgroundColor?: ColorValue;
  foregroundColor?: ColorValue;
  leading?: ReactNode;
  actions?: ReactNode;
  showBackButton?: boolean;
  titleSize?: 'small' | 'medium' | 'large';
  onBack?: () => void;
  titleStyle?: TextStyle;
  style?: StyleProp<ViewStyle>;
};

function AppBar({
  title,
  style,
  titleStyle,
  height = 70,
  centerTitle = true,
  backgroundColor = colors.transparent,
  foregroundColor,
  leading,
  actions,
  showBackButton = true,
  titleSize = 'large',
  onBack,
}: AppBarProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const finalForegroundColor = foregroundColor ?? theme.colors.text;
  let finalTitleSize = theme.fontSize.large;

  if (titleSize === 'small') {
    finalTitleSize = theme.fontSize.medium;
  } else if (titleSize === 'medium') {
    finalTitleSize = theme.fontSize.large;
  } else if (titleSize === 'large') {
    finalTitleSize = theme.fontSize.xLarge;
  }

  const canGoBackInStack = useNavigationState(state => state.routes.length > 1);

  const goBack = () => {
    if (!canGoBackInStack) return;

    navigation.goBack();
    onBack?.();
  };

  return (
    <View
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      <Row
        crossAxisAlignment="center"
        spacing={15}
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            height: height,
          },
          style
        ]}
      >
        {/* Leading */}
        {showBackButton && canGoBackInStack && !leading ? (
          <AppIconButton
            name="arrow-back-ios"
            color={finalForegroundColor}
            onPress={goBack}
          />
        ) : (
          <View style={{ alignItems: 'center', minWidth: 20 }}>
            {leading && leading}
          </View>
        )}

        {/* Title */}
        {title ? (
          <AppText
            color={finalForegroundColor}
            fontWeight={'bold'}
            fontSize={finalTitleSize}
            style={[
              {
                flex: 1,
                lineHeight: finalTitleSize + 4,
                alignItems: 'center',
                ...(centerTitle && {
                  textAlign: 'center',
                }),
              },
              titleStyle ?? {},
            ]}
          >
            {title}
          </AppText>
        ) : (<View style={{ flex: 1 }} />)}

        {/* Actions */}
        <View style={{ alignItems: 'center', minWidth: 20 }}>
          {actions && actions}
        </View>
      </Row>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
});

export default AppBar;
