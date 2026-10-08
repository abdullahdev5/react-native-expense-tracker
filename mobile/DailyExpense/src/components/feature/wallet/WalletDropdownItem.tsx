import { View, Text } from 'react-native'
import React, { useMemo } from 'react'
import { DropdownItem } from '@components/Dropdown'
import { AllWalletProviders, AllWalletTypesAndProviders, Wallet, WalletType } from '../../../types/wallet'
import { Column, Row } from '@components/Layout'
import WalletIconRenderer from './WalletIconRenderer'
import AppText from '@components/Text'
import { colors } from '../../../theme/colors'
import { useTheme } from '../../../theme/ThemeProvider'

type WalletDropdownItem = {
    item: DropdownItem<Wallet>;
    selected?: boolean | undefined;
}

const WalletDropdownItem = ({ item, selected }: WalletDropdownItem) => {
  const { theme } = useTheme();

  const icon = useMemo<AllWalletTypesAndProviders | null>(() => {
    const data = item.data;
    if (data.type !== 'card' && data.type !== 'digital') {
        return data.type as AllWalletTypesAndProviders;
    } else {
        return data.provider as AllWalletTypesAndProviders;
    }
  }, [item.data])

  return (
    <Column spacing={10} style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
        <Row spacing={20}>
            {icon && (<WalletIconRenderer iconKey={icon} />)}

            <AppText>{item.label}</AppText>
        </Row>

        {selected && (
            <View
                style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: theme.colors.outline,
                }}
            />
        )}
    </Column>
  )
}

export default WalletDropdownItem