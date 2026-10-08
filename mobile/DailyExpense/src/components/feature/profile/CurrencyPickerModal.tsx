import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { CurrencyBase, CurrencyCode } from '../../../types/types';
import { currencies } from '../../../constants/currencies'; 
import { ThemeType } from '../../../theme';

interface CurrencyPickerModalProps {
  theme: ThemeType;
  currentCurrency?: string;
  onSelectCurrency: (code: CurrencyCode) => void | Promise<void>;
  onDismiss: () => void;
}

export const CurrencyPickerModal: React.FC<CurrencyPickerModalProps> = ({
  theme,
  currentCurrency,
  onSelectCurrency,
  onDismiss,
}) => {
  const { colors, radius } = theme;

  return (
    <Pressable style={styles.overlay} onPress={onDismiss}>
      <Pressable 
        style={[
          styles.modalContainer, 
          { 
            backgroundColor: colors.background,
            borderTopLeftRadius: radius?.lg || 20,
            borderTopRightRadius: radius?.lg || 20 
          }
        ]}
      >
        <Text style={[styles.headline, { color: colors.text }]}>Select Base Currency</Text>
        
        <FlatList
          data={currencies as unknown as CurrencyBase[]}
          keyExtractor={(item) => item.code}
          renderItem={({ item }: { item: CurrencyBase }) => {
            const isSelected = item.code === currentCurrency;
            return (
              <Pressable
                style={[
                  styles.currencyItem, 
                  { backgroundColor: colors.secondaryBackground },
                  isSelected && { borderColor: colors.primary, borderWidth: 1 }
                ]}
                onPress={() => onSelectCurrency(item.code as CurrencyCode)}
              >
                <Text style={[styles.itemText, { color: colors.text }]}>
                  {item.symbol}  {item.code} — {item.name}
                </Text>
                {isSelected && <Text style={[styles.checkMark, { color: colors.primary }]}>✓</Text>}
              </Pressable>
            );
          }}
        />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    padding: 24,
    maxHeight: '50%',
  },
  headline: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  currencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 15,
  },
  checkMark: {
    fontWeight: 'bold',
  },
});