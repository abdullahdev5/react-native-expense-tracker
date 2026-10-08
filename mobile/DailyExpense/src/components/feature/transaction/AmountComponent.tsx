import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import AppText from '@components/Text';
import { useTheme } from '../../../theme/ThemeProvider';
import { getCurrencySymbol } from '../../../utils/currency';
import { colors } from '../../../theme/colors';
import { TransactionType } from '../../../types/transaction';

type AmountType = TransactionType;

type AmountProps = {
    amount: number;
    currency: string;
    type: AmountType;
    textStyle?: StyleProp<TextStyle>;
    showPrefix?: boolean;
    changeColorBasedOnType?: boolean
};

const AmountComponent = ({
    amount,
    currency,
    type,
    textStyle,
    showPrefix = true,
    changeColorBasedOnType = true,
}: AmountProps) => {
    const { theme } = useTheme();

    // Formatting: 5000 -> 5,000.00
    const formattedValue = Math.abs(amount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const symbol = getCurrencySymbol(currency);
    
    // Determine Prefix and Color
    let prefix = '';
    let amountColor = theme.colors.text;

    if (type === 'income') {
        if (showPrefix) prefix = '+ ';
        if (changeColorBasedOnType) amountColor = colors.green; // Success/Green
    } else if (type === 'expense') {
        if (showPrefix) prefix = '- ';
        if (changeColorBasedOnType) amountColor = colors.red; // Error/Red
    }

    return (
        <AppText
            style={[
                {
                    color: amountColor,
                    fontWeight: '600',
                    fontSize: theme.fontSize.xxSmall
                },
                textStyle,
            ]}
        >
            {prefix}
            {symbol}
            {formattedValue}
        </AppText>
    );
};

export default AmountComponent;