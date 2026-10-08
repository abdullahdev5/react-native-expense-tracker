import { View, Text, FlatList, Platform } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import AppScreen from "@components/AppScreen";
import AppSearchBar from "@components/AppSearchBar";
import {
  generateTransactionsCSV,
  getTransactionsService,
  searchTransactions,
} from "@/services/transaction.service";
import { Transaction } from "@/types/transaction";
import { filter } from "rxjs";
import AppText from "@components/Text";
import TransactionTile from "@components/feature/transaction/TransactionTile";
import { Row } from "@components/Layout";
import AppCheckBox from "@components/AppCheckBox";
import { File, Directory, Paths } from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system/legacy";
import Sharing from "expo-sharing";
import { useSnackbarStore } from "@/store/snackbarStore";
import AppButton from "@components/Button";
import { useTransactionStore } from "@/store/useTransactionStore";
import { writeFileExternallyAndroidOnly } from "@/utils/file";
import AppActivityLoader from "@components/Loader";

const ExportTransactionsScreen = () => {
  const showSnackbar = useSnackbarStore((S) => S.showSnackbar);
  const transactions = useTransactionStore((s) => s.transactions);

  const [selectedTransactions, setSelectedTransactions] = useState<
    Transaction[]
  >([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filterTransactions = async (query: string) => {
    if (searchTimeoutRef) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSearching(true); // loading: START
        const transactions = await searchTransactions(query);

        setFilteredTransactions(transactions);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsSearching(false); // loading: END
      }
    }, 1000);
  };

  const selectedIds = useMemo(
    () => new Set(selectedTransactions.map((ts) => ts.id)),
    [selectedTransactions],
  );

  const selectedTransactionsDisplay = useMemo(() => {
    return selectedTransactions.map((ts) => ({
      transaction: ts,
      isSelected: true,
    }));
  }, [selectedTransactions]);

  const unselectedTransactionsDisplay = useMemo(() => {
    return (filteredTransactions ?? transactions)
      .filter((ts) => !selectedIds.has(ts.id))
      .map((ts) => ({
        transaction: ts,
        isSelected: false,
      }));
  }, [transactions, filterTransactions, selectedIds]);

  const handleToggleTransaction = (
    transaction: Transaction,
    isChecking: boolean,
  ) => {
    if (isChecking) {
      setSelectedTransactions((prev) => [transaction, ...prev]);
    } else {
      setSelectedTransactions((prev) =>
        prev.filter((ts) => ts.id != transaction.id),
      );
    }
  };

  const exportTransactionsFile = async (transactions: Transaction[]) => {
    try {
      const csvData = await generateTransactionsCSV(transactions);
      const filename = "dailyexpense_transactions.csv";

      const documentDirectory = new Directory(Paths.document);

      if (!documentDirectory.exists) {
        documentDirectory.create();
      }

      const internalFile = new File(documentDirectory, filename);
      internalFile.write(csvData);

      try {
        if (Platform.OS === "android") {
          writeFileExternallyAndroidOnly(csvData, {
            filename,
            mimeType: "text/csv",
          });

          // Inform User
          showSnackbar(
            "Transactions exported Successfully to your phone's directory",
            {
              type: "success",
            },
          );
        } else {
          Sharing.shareAsync(internalFile.uri);
        }
      } catch (e) {
        Sharing.shareAsync(internalFile.uri);
      }
    } catch (e: any) {
      showSnackbar(e.message, { type: "error" });
    }
  };

  return (
    <AppScreen>
      <AppSearchBar
        onTextChange={async (query) => {
          await filterTransactions(query);
        }}
      />

      <AppButton
        fullWidth={true}
        onPress={async () => {
          await exportTransactionsFile(selectedTransactions);
        }}
      >
        Export Transactions
      </AppButton>

      {isSearching ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <AppActivityLoader />
        </View>
      ) : (
        <>
          {selectedTransactions.length != 0 && <AppText>selected:</AppText>}
          <FlatList
            data={selectedTransactionsDisplay}
            renderItem={({ item }) => (
              <Row spacing={20} style={{ paddingHorizontal: 20 }}>
                <AppCheckBox
                  value={item.isSelected}
                  onValueChange={(value) =>
                    handleToggleTransaction(item.transaction, value)
                  }
                />
                <TransactionTile transaction={item.transaction} />
              </Row>
            )}
          />

          {selectedTransactions.length != 0 && <AppText>unselected:</AppText>}
          <FlatList
            data={unselectedTransactionsDisplay}
            renderItem={({ item }) => (
              <Row spacing={20} style={{ paddingHorizontal: 20 }}>
                <AppCheckBox
                  value={item.isSelected}
                  onValueChange={(value) =>
                    handleToggleTransaction(item.transaction, value)
                  }
                />
                <TransactionTile transaction={item.transaction} />
              </Row>
            )}
          />
        </>
      )}
    </AppScreen>
  );
};

export default ExportTransactionsScreen;
