import { View, Text, StyleSheet, ViewStyle, ColorValue } from 'react-native';
import React, { useEffect } from 'react';
import { useSnackbarStore } from '../store/snackbarStore';
import { useTheme } from '../theme/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from './Text';
import { Row } from './Layout';
import AppIcon from './Icon';
import { colors } from '../theme/colors';
import { AppIconButton } from './Button';
import Animated, {
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  SlideOutUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GlobalSnackbar = () => {
  const isVisible = useSnackbarStore(s => s.isVisible);
  const message = useSnackbarStore(s => s.message);
  const type = useSnackbarStore(s => s.type);
  const dismissButtonShown = useSnackbarStore(s => s.dismissButtonShown);
  const duration = useSnackbarStore(s => s.duration);
  const position = useSnackbarStore(s => s.position);
  const autoDismiss = useSnackbarStore(s => s.autoDismiss);
  const hideSnackbar = useSnackbarStore(s => s.hideSnackbar);

  const { theme, isLight } = useTheme();
  const insets = useSafeAreaInsets();
  let backgroundColor = undefined;

  if (type == 'error') {
    backgroundColor = theme.colors.error;
  } else if (type == 'info') {
    backgroundColor = theme.colors.text;
  }

  useEffect(() => {
    if (!isVisible) return;
    if (!autoDismiss) return;

    const timer = setTimeout(() => {
      hideSnackbar();
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, autoDismiss, hideSnackbar]);

  const containerStyle: ViewStyle = {
    position: 'absolute',
    ...(position === 'bottom' && { bottom: 20 + insets.bottom }),
    ...(position === 'top' && { top: 20 + insets.top }),
    right: 10,
    left: 10,

    zIndex: 999,

    elevation: 3, // Android
    shadowColor: theme.colors.text,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },

    borderRadius: theme.radius.sm,
  };

  //   if (!isVisible) return null;

  return isVisible ? (
    <Animated.View
      entering={position === 'bottom' ? SlideInDown : SlideInUp}
      exiting={position === 'bottom' ? SlideOutDown : SlideOutUp}
      style={[containerStyle]}
      //   pointerEvents={isVisible ? 'auto' : 'none'}
    >
      <LinearGradient
        colors={
          (backgroundColor
            ? [backgroundColor, backgroundColor]
            : theme.colors.primaryGradient) as [string, string, ...string[]]
        }
        // colors={theme.colors.primaryGradient}
        start={!backgroundColor ? { x: 0, y: 0 } : undefined}
        // start={{ x: 0, y: 0 }}
        end={!backgroundColor ? { x: 1, y: 0 } : undefined}
        // end={{ x: 1, y: 0 }}
        style={{
          borderRadius: theme.radius.sm,
          paddingHorizontal: 10,
          paddingVertical: (dismissButtonShown || !autoDismiss) ? 0 : 10,
        }}
      >
        <Row fullWidth spacing={10}>
          {(type == 'error' || type == 'info') && (
            <AppIcon
              style={{ alignSelf: 'center' }}
              name={type == 'error' ? 'error' : 'info'}
              color={
                type === 'info'
                  ? theme.colors.info
                  : colors.white
              }
            />
          )}
          <AppText
            style={{ flex: 1 }}
            color={
              type === 'info'
                ? isLight
                  ? colors.white
                  : colors.black
                : colors.white
            }
          >
            {message}
          </AppText>
          {(dismissButtonShown || !autoDismiss) && (
            <AppIconButton
              name="close"
              color={
                type === 'info'
                  ? isLight
                    ? colors.white
                    : colors.black
                  : colors.white
              }
              onPress={hideSnackbar}
            />
          )}
        </Row>
      </LinearGradient>
    </Animated.View>
  ) : null;
};

export default GlobalSnackbar;
