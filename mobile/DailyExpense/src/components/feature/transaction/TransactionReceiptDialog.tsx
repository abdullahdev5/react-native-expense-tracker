import React, { useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import Sharing from "expo-sharing";
import ViewShot, { ViewShotRef } from "react-native-view-shot";
import { Transaction } from "@/types/transaction";
import TransactionReceipt from "./TransactionReceipt";
import {
  convertImageToPDF,
  writeFileExternallyAndroidOnly,
} from "@/utils/file";
import { useSnackbarStore } from "@/store/snackbarStore";

type TransactionReceiptDialogProps = {
  visible: boolean;
  onClose: () => void;
  transaction: Transaction;
};

const TransactionReceiptDialog = ({
  visible,
  onClose,
  transaction,
}: TransactionReceiptDialogProps) => {
  const showSnackbar = useSnackbarStore((s) => s.showSnackbar);

  const viewShotRef = useRef<ViewShotRef>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper function to capture the screenshot of the receipt container
  const captureReceiptImage = async (): Promise<string | null> => {
    try {
      if (!viewShotRef.current?.capture) {
        throw new Error("Receipt reference is not ready yet.");
      }
      return await viewShotRef.current.capture();
    } catch (error) {
      console.error("Capture Error:", error);
      showSnackbar("Failed to capture the receipt canvas.", { type: "error" });
      return null;
    }
  };

  // Action: Share Receipt Image
  const handleShare = async () => {
    setIsProcessing(true);
    const uri = await captureReceiptImage();

    if (!uri) {
      setIsProcessing(false);
      return;
    }

    try {
      const filename = `Receipt_${transaction.id}.pdf`;
      const pdfFilePath = await convertImageToPDF(uri, filename);

      await Sharing.shareAsync(pdfFilePath);
    } catch (error) {
      showSnackbar("Could not complete sharing.", { type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Convert Captured Image to PDF and trigger saving/sharing
  const handleExportPDF = async () => {
    setIsProcessing(true);
    const imageUri = await captureReceiptImage();

    if (!imageUri) {
      setIsProcessing(false);
      return;
    }

    try {
      const filename = `Receipt_${transaction.id}.pdf`;

      const pdfFilePath = convertImageToPDF(imageUri, filename);

      if (Platform.OS === "android") {
        try {
          await writeFileExternallyAndroidOnly(pdfFilePath, {
            filename,
            mimeType: "application/pdf",
            isLocalFilePath: true,
          });

          // Inform User
          showSnackbar(
            "Receipt is saved Successfully to your phone's directory",
            {
              type: "success",
            },
          );
        } catch (e) {
          await Sharing.shareAsync(pdfFilePath);
        }
      } else {
        await Sharing.shareAsync(pdfFilePath);
      }
    } catch (error) {
      console.error("PDF Export Error:", error);
      showSnackbar("Failed to generate PDF document.", { type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Click background to close */}
        <TouchableOpacity
          style={styles.absoluteClose}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.dialogContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Transaction Receipt</Text>
            <TouchableOpacity onPress={onClose} accessibilityRole="button">
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Capture Area wrapping your exact receipt component */}
          <View style={styles.receiptWrapper}>
            <ViewShot
              ref={viewShotRef}
              options={{ format: "png", quality: 0.95, result: "tmpfile" }}
              style={styles.viewShotCanvas}
            >
              <TransactionReceipt transaction={transaction} />
            </ViewShot>
          </View>

          {/* Bottom Action Tray */}
          <View style={styles.actionTray}>
            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary]}
              onPress={handleShare}
              disabled={isProcessing}
            >
              <Text style={styles.btnSecondaryText}>Share Image</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary]}
              onPress={handleExportPDF}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.btnPrimaryText}>Export PDF</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  absoluteClose: {
    ...StyleSheet.absoluteFill,
  },
  dialogContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    width: "100%",
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  closeText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  receiptWrapper: {
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  viewShotCanvas: {
    backgroundColor: "#FFF", // Crucial background color preservation inside capturing bounds
  },
  actionTray: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#F3F4F6",
    gap: 12,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  btnPrimary: {
    backgroundColor: "#4F46E5",
  },
  btnSecondary: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  btnPrimaryText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  btnSecondaryText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default TransactionReceiptDialog;
