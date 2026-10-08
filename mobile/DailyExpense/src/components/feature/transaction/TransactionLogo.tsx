import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Transaction } from '../../../types/transaction';
import { colors } from '../../../theme/colors';
import { CategoryColor } from '../../../types/category';
import { getCategoryColor } from '../../../utils/category.utils';
import AppText from '@components/Text';

const TransactionLogo = ({ transaction }: { transaction: Transaction }) => {
  const [imageError, setImageError] = useState(false);

  // Check if logo exists and has not encountered a 404/network error
  const shouldShowImage =
    Boolean(transaction.merchantLogo?.trim()) && !imageError;

  if (shouldShowImage) {
    return (
      <Image
        source={{
          uri: transaction.merchantLogo!,
          headers: { 'User-Agent': 'Mozilla/5.0' },
        }}
        style={styles.merchantImageContainer}
        resizeMode="contain"
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <NoTransactionLogo
      merchantName={transaction.merchantName}
      categoryColor={transaction.category?.color}
    />
  );
};

export default TransactionLogo;


export const NoTransactionLogo = (props: {
  merchantName: string;
  categoryColor?: CategoryColor;
}): React.JSX.Element => {
  return (
    <View
      style={[
        styles.merchantImageContainer,
        {
          backgroundColor: props.categoryColor ? getCategoryColor(props.categoryColor) : colors.white,
        },
      ]}
    >
      <AppText color={colors.black}>{props.merchantName.at(0)}</AppText>
    </View>
  );
};


const styles = StyleSheet.create({
  merchantImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
