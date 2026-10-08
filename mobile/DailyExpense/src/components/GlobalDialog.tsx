import React from 'react';
import { Modal, View, StyleSheet, Pressable } from 'react-native';
import { useDialogStore } from '../store/useDialogStore';
import { useTheme } from '../theme/ThemeProvider';
import { colors } from '../theme/colors';
import AppText from './Text';
import { Row } from './Layout';

export const GlobalDialog = () => {
  const { theme } = useTheme();
  const isVisible = useDialogStore(s => s.isVisible);
  const title = useDialogStore(s => s.title);
  const message = useDialogStore(s => s.message);
  const confirmText = useDialogStore(s => s.confirmText);
  const cancelText = useDialogStore(s => s.cancelText);
  const isDestructive = useDialogStore(s => s.isDestructive);
  const onConfirmCallback = useDialogStore(s => s.onConfirmCallback);
  const hideDialog = useDialogStore(s => s.hideDialog);

  const handleConfirm = () => {
    // Hide the state layer before firing consumer callbacks
    useDialogStore.setState({ isVisible: false }); 
    onConfirmCallback?.();
  };

  if (!isVisible) return null;

  return (
    <Modal transparent visible={isVisible} animationType="fade" onRequestClose={hideDialog}>
      <Pressable style={styles.overlay} onPress={hideDialog}>
        {/* Prevent clicks inside the dialog from closing it */}
        <Pressable style={[styles.dialogBox, { backgroundColor: colors.dark, borderRadius: theme.radius.md }]}>
          <AppText fontWeight="bold" fontSize={theme.fontSize.large} style={{ marginBottom: 8 }}>
            {title}
          </AppText>
          
          <AppText color={colors.grey} fontSize={14} style={{ marginBottom: 24 }}>
            {message}
          </AppText>

          <Row mainAxisAlignment="flex-end" spacing={12} style={{ width: '100%' }}>
            <Pressable onPress={hideDialog} style={styles.button}>
              <AppText color={colors.grey} fontWeight="600">
                {cancelText}
              </AppText>
            </Pressable>

            <Pressable 
              onPress={handleConfirm} 
              style={[
                styles.button, 
                styles.confirmButton, 
                { backgroundColor: isDestructive ? colors.red : theme.colors.primary }
              ]}
            >
              <AppText color={colors.white} fontWeight="600">
                {confirmText}
              </AppText>
            </Pressable>
          </Row>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialogBox: {
    width: '100%',
    maxWidth: 340,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    minWidth: 90,
  }
});
