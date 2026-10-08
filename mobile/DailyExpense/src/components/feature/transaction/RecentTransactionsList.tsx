import React from 'react';
import { Transaction } from '../../../types/transaction';
import Animated from 'react-native-reanimated';
import TransactionTile from './TransactionTile';
import AppText from '@components/Text';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = {
  transactions: Transaction[];
  scrollHandler: any;
  headerMaxHeight: number;
  onLoadMore: () => void;
};

const RecentTransactionsList: React.FC<Props> = ({
  transactions,
  scrollHandler,
  headerMaxHeight,
  onLoadMore,
}) => {
  if (transactions.length === 0) {
    return (
      <AppText style={{ textAlign: 'center', marginTop: headerMaxHeight + 40 }}>
        No transactions yet!
      </AppText>
    );
  }

  const { theme } = useTheme();

  return (
    <Animated.FlatList
      data={transactions}
      keyExtractor={t => `transaction-${t.id}`}
      scrollEventThrottle={16}
      onScroll={scrollHandler}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: headerMaxHeight + 60,
        paddingBottom: 30,
      }}
      renderItem={({ item: transaction }) => (
        <TransactionTile
          transaction={transaction}
          style={{ marginHorizontal: 10, marginVertical: 5 }}
        />
      )}
      // Native threshold tracking now fires reliably
      onEndReachedThreshold={0.2}
      onEndReached={() => {
        onLoadMore();
      }}
      // Section headers reside cleanly inside the viewport layer
      ListHeaderComponent={() => (
        <AppText
          fontSize={theme.fontSize.medium}
          style={{ marginLeft: 10, marginBottom: 10 }}
        >
          My transactions
        </AppText>
      )}
    />
  );
};

export default RecentTransactionsList;
