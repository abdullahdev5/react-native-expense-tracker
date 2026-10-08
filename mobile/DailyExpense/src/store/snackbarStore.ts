import { create } from 'zustand';

type SnackbarType = 'success' | 'error' | 'info';
type SnackbarPosition = 'bottom' | 'top';

type SnackbarOptions = {
    type?: SnackbarType;
    duration?: number;
    position?: SnackbarPosition;
    dismissButtonShown?: boolean;
    autoDismiss?: boolean;
    onHide?: () => void;
}

type SnackbarState = {
  isVisible: boolean;
  message: string;
  type: SnackbarType;
  showSnackbar: (
    message: string,
    options?: SnackbarOptions
  ) => void;
  hideSnackbar: () => void;
  dismissButtonShown: boolean;
  duration: number;
  position: SnackbarPosition;
  autoDismiss: boolean;
  onHide: () => void;
};

export const useSnackbarStore = create<SnackbarState>((set, get) => ({
  isVisible: false,
  message: '',
  type: 'info',
  dismissButtonShown: true,
  duration: 3000,
  position: 'bottom',
  autoDismiss: true,

  onHide: () => {},

  showSnackbar: (
    message: string,
    options?: SnackbarOptions
  ) =>
    set({
      isVisible: true,
      message,
      type: options?.type ?? 'info',
      duration: options?.duration ?? 3000,
      position: options?.position ?? 'top',
      dismissButtonShown: options?.dismissButtonShown ?? true,
      autoDismiss: options?.autoDismiss ?? true,
      onHide: options?.onHide ?? (() => {}),
    }),

  hideSnackbar: () => {
    const { onHide } = get();

    set({
      isVisible: false,
      message: '',

    });

    onHide?.();
  }
}));
