import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { AllWalletTypesAndProviders } from '../../../types/wallet';
import { DropdownItem } from '@components/Dropdown';
import { Column, Row } from '@components/Layout';
import AppText from '@components/Text';
import { getWalletIcon } from '../../../utils/wallet.utils';
import { useTheme } from '../../../theme/ThemeProvider';
import { colors } from '../../../theme/colors';
import WalletIconRenderer from './WalletIconRenderer';

type AddWalletDropdownItemProps = {
  item: DropdownItem<AllWalletTypesAndProviders>;
  selected: boolean | undefined;
};

const AddWalletDropdownItem = ({ item, selected }: AddWalletDropdownItemProps) => {
  const { theme } = useTheme();

  return (
    <Column
      crossAxisAlignment="flex-start"
      style={{
        padding: 10,
        borderBottomWidth: selected ? 1 : 0,
        borderBottomColor: theme.colors.outline,
      }}
    >
      {selected && (
        <AppText 
            color={colors.grey}
            fontSize={theme.fontSize.xSmall}
            style={{ paddingBottom: 5 }}>selected:</AppText>
      )}

      <Row spacing={20}>
        {item.icon && (<WalletIconRenderer iconKey={item.icon as AllWalletTypesAndProviders} />)}
        <AppText>{item.label}</AppText>
      </Row>
    </Column>
  );
};

export default AddWalletDropdownItem;
