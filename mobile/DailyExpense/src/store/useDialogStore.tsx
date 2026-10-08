import { create } from 'zustand';

type DialogOptions = {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type DialogState = {
  isVisible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  isDestructive: boolean;
  onConfirmCallback: () => void;
  onCancelCallback: () => void;
  showDialog: (message: string, options?: DialogOptions) => void;
  hideDialog: () => void;
};

export const useDialogStore = create<DialogState>((set, get) => ({
  isVisible: false,
  title: 'Confirm Action',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  isDestructive: false,
  onConfirmCallback: () => {},
  onCancelCallback: () => {},

  showDialog: (message: string, options?: DialogOptions) =>
    set({
      isVisible: true,
      message,
      title: options?.title ?? 'Confirm Action',
      confirmText: options?.confirmText ?? 'Confirm',
      cancelText: options?.cancelText ?? 'Cancel',
      isDestructive: options?.isDestructive ?? false,
      onConfirmCallback: options?.onConfirm ?? (() => {}),
      onCancelCallback: options?.onCancel ?? (() => {}),
    }),

  hideDialog: () => {
    const { onCancelCallback } = get();
    set({ isVisible: false });
    onCancelCallback?.();
  },
}));
