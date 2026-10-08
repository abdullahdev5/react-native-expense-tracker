import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface AppGlowEffectProps {
  children: React.ReactNode;
  color: string;
  active?: boolean;
  width?: number; // Width of the icon/content being wrapped
  height?: number; // Height of the icon/content being wrapped
  glowIntensity?: number; // Spread of the glow
}

export const AppGlowEffect: React.FC<AppGlowEffectProps> = ({
  children,
  color,
  active = true,
  width = 24,
  height = 24,
  glowIntensity = 20,
}) => {
  if (!active) return <>{children}</>;

  return (
    <View style={[styles.container, { width: width, height: height }]}>
      {/* The Glow Source: A tiny view centered behind the children */}
      <View
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          borderRadius: 1,
          backgroundColor: colors.transparent,
          // Using boxShadow (RN 0.76+) for cross-platform bloom
          boxShadow: `0 0 ${glowIntensity * 2}px ${glowIntensity / 2}px ${color}`,
        }}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
