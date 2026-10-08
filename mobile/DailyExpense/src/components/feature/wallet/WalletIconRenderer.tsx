import { useTheme } from '../../../theme/ThemeProvider';
import {
  AllWalletProviders,
  AllWalletTypesAndProviders,
  WalletType,
} from '../../../types/wallet';
import { getWalletIcon } from '../../../utils/wallet.utils';

type WalletIconRendererProps = {
  iconKey: AllWalletTypesAndProviders;
  color?: string;
  size?: number;
};

const WalletIconRenderer = ({
  iconKey,
  color,
  size,
}: WalletIconRendererProps) => {
  const { theme } = useTheme();
  const finalColor = color ?? theme.colors.text;

  return getWalletIcon(iconKey, finalColor, size);
};

export default WalletIconRenderer;