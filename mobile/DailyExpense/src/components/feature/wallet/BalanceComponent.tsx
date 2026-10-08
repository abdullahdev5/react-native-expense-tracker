import { View, Text, StyleProp, TextStyle, ViewStyle } from 'react-native'
import React from 'react'
import { CurrencyCode } from '../../../types/types';
import AppText from '@components/Text';
import { useTheme } from '../../../theme/ThemeProvider';
import { colors } from '../../../theme/colors';
import { getCurrencySymbol } from '../../../utils/currency';
import Animated, { AnimatedStyle, StyleProps } from 'react-native-reanimated';

type Props = {
    balance: number;
    currency: CurrencyCode;
    textStyle?: StyleProp<TextStyle>;
    showRedColorIfNegative?: boolean;
    shouldSpaceBetweenCurrencyAndBalance?: boolean;
    animatedTextStyle?: AnimatedStyle<TextStyle>;
}

const BalanceComponent = ({
  balance,
  currency,
  textStyle,
  showRedColorIfNegative = true,
  shouldSpaceBetweenCurrencyAndBalance = true,
  animatedTextStyle,
}: Props) => {
  const { theme } = useTheme();
  const isNegative = balance < 0;

  // Format the number to always show 2 decimals and use commas
  const formattedAmount = Math.abs(balance).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const symbol = getCurrencySymbol(currency);
  const space = shouldSpaceBetweenCurrencyAndBalance ? ' ' : '';
  
  // Example: "- Rs. 1,250.50"
  const balanceDisplay = `${isNegative ? '- ' : ''}${symbol}${space}${formattedAmount}`;

  return (
    <Animated.Text
      style={[
        {
          color: (isNegative && showRedColorIfNegative)
            ? colors.red // Using a bright Red for negative
            : (textStyle as any)?.color || theme.colors.text,

          fontSize: theme.fontSize.xLarge
        },
        textStyle,
        animatedTextStyle
      ]}
    >
      {balanceDisplay}
    </Animated.Text>
  );
}

export default BalanceComponent