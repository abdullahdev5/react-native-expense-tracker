import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { ThemeType } from '../../../theme'; // Adjust path to your theme index file

interface UserPreferencesCardProps {
  theme: ThemeType;
  style?: ViewStyle | ViewStyle[];
  currentCurrency: string;
  onPressCurrencySettings: () => void;
}

export const UserPreferencesCard: React.FC<UserPreferencesCardProps> = ({
  theme,
  style,
  currentCurrency,
  onPressCurrencySettings,
}) => {
  const { colors, radius } = theme;

  return (
    <View 
      style={[
        styles.card, 
        { 
          backgroundColor: colors.secondaryBackground, 
          borderRadius: radius?.md || 12 
        }, 
        style
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>Preferences</Text>
      
      <Pressable 
        style={({ pressed }) => [
          styles.row, 
          pressed && { opacity: 0.7 }
        ]} 
        onPress={onPressCurrencySettings}
      >
        <Text style={[styles.label, { color: colors.text }]}>Base Currency</Text>
        <View style={styles.rightContainer}>
          {/* Dynamically uses your system primary token */}
          <Text style={[styles.currencyText, { color: colors.primary }]}>
            {currentCurrency}
          </Text>
          <Text style={[styles.chevron, { color: colors.outline || colors.text }]}>➔</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 15,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  chevron: {
    fontSize: 14,
  },
});