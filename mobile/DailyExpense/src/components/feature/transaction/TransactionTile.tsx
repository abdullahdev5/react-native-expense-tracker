import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, { useMemo } from 'react';
import { Column, Row } from '@components/Layout';
import { useTheme } from '../../../theme/ThemeProvider';
import { colors } from '../../../theme/colors';
import { Transaction } from '../../../types/transaction';
import { getCategoryColor } from '../../../utils/category.utils';
import { CategoryColor } from '../../../types/category';
import AppText from '@components/Text';
import { categoryColorsDropdownData } from '../../../constants/categoryConstants';
import { toFormattedDateTime } from '../../../utils/date';
import { getCurrencySymbol } from '../../../utils/currency';
import AmountComponent from './AmountComponent';
import TransactionLogo from '@components/feature/transaction/TransactionLogo';

export type TransactionTileProps = {
  transaction: Transaction;
  onItemClick?: (transaction: Transaction) => void;
  style?: StyleProp<ViewStyle>;
};

const TransactionTile = ({
  transaction,
  onItemClick,
  style,
}: TransactionTileProps) => {
  const { theme } = useTheme();

  const containerStyle: ViewStyle = {
    borderTopLeftRadius: theme.radius.lg,
    borderBottomLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.sm,
    borderBottomRightRadius: theme.radius.sm,
    backgroundColor: colors.dark
  }

  return (
    <TouchableOpacity
    activeOpacity={0.9}
      onPress={() => onItemClick?.(transaction)}
      disabled={!onItemClick}
      style={[
        containerStyle,
        style,
      ]}
    >
      <Row
        style={containerStyle}
      >
        <Row
          spacing={10}
          crossAxisAlignment='center'
          style={{
            flex: 1,
            padding: 15
          }}
        >
          <TransactionLogo
            transaction={transaction}
          />
          {/* {transaction.merchantLogo ? (
            <Image
              source={{ uri: transaction.merchantLogo, headers: { 'User-Agent': 'Mozilla/5.0' } }}
              style={[styles.merchantImageContainer]}
              resizeMode='contain'
              onError={() => (
                <NoMerchantLogo
                  merchantName={transaction.merchantName}
                  categoryColor={transaction.category?.color}
                />
              )}
            />
          ) : (
            <NoMerchantLogo
              merchantName={transaction.merchantName}
              categoryColor={transaction.category?.color}
            />
          )} */}

          <Column spacing={5}>
            <AppText
                color={colors.white}
                fontSize={theme.fontSize.small}
                fontWeight={'bold'}
            >
              {transaction.title}
            </AppText>

            <AppText color={colors.white} fontSize={theme.fontSize.xSmall}>
              {toFormattedDateTime(transaction.date)}
            </AppText>
          </Column>

          {/* Flex */}
          <View style={{ flex: 1 }} />

          <View
            style={[
              styles.amountContainer,
              {
                borderColor: theme.colors.outline,
                borderRadius: theme.radius.lg,
              },
            ]}
          >
            <AmountComponent
              amount={transaction.amount}
              currency={transaction.currency}
              type={transaction.type}
            />
          </View>
        </Row>

        {transaction.category && (
          <View
            style={{
              marginLeft: 5,
              backgroundColor: getCategoryColor(transaction.category.color),
              width: 10,
              height: '100%',
              borderTopRightRadius: theme.radius.lg,
              borderBottomRightRadius: theme.radius.lg
            }}
          />
        )}
      </Row>
    </TouchableOpacity>
  );
};

// export const NoMerchantLogo = (props: {
//   merchantName: string;
//   categoryColor?: CategoryColor;
// }): React.JSX.Element => {
//   return (
//     <View
//       style={[
//         styles.merchantImageContainer,
//         {
//           backgroundColor: props.categoryColor ? getCategoryColor(props.categoryColor) : colors.white,
//         },
//       ]}
//     >
//       <AppText color={colors.black}>{props.merchantName.at(0)}</AppText>
//     </View>
//   );
// };

const styles = StyleSheet.create({
  // merchantImageContainer: {
  //   width: 50,
  //   height: 50,
  //   borderRadius: 40,
  //   backgroundColor: colors.white,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  amountContainer: {
    // borderColor: colors.white,
    borderWidth: 1,

    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TransactionTile;
