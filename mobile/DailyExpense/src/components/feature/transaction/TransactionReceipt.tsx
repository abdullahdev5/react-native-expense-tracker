import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Transaction } from "@/types/transaction";
import { toFormattedDateTime } from "@/utils/date";

type TransactionReceiptProps = {
  transaction: Transaction;
};

const TransactionReceipt = ({ transaction }: TransactionReceiptProps) => {
  return (
    <View style={styles.receiptCard}>
      <Text style={styles.merchant}>{transaction.merchantName}</Text>
      <Text style={styles.title}>{transaction.title}</Text>

      <View style={styles.amountBox}>
        <Text style={styles.amountText}>
          {transaction.amount.toFixed(2)}{" "}
          <Text style={styles.currencyText}>{transaction.currency}</Text>
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Transaction ID</Text>
        <Text style={styles.value}>{transaction.id}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>{toFormattedDateTime(transaction.date, { format: 'h:mm a.m/p.m. | MMM dd, yyyy' })}</Text>
      </View>

      <View style={styles.divider} />
      <Text style={styles.descriptionText}>{transaction.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  receiptCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  merchant: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  amountBox: {
    backgroundColor: "#F8FAFC",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
  },
  amountText: { fontSize: 28, fontWeight: "800", color: "#4F46E5" },
  currencyText: { fontSize: 15, fontWeight: "500", color: "#6B7280" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: { fontSize: 13, color: "#6B7280" },
  value: { fontSize: 13, fontWeight: "500", color: "#1F2937" },
  divider: { borderTopWidth: 1, borderColor: "#E5E7EB", marginVertical: 12 },
  descriptionText: {
    fontSize: 12,
    color: "#4B5563",
    lineHeight: 16,
    backgroundColor: "#F9FAFB",
    padding: 8,
    borderRadius: 4,
  },
});

export default TransactionReceipt;
