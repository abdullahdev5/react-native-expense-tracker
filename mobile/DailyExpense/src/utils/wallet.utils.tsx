import { AllWalletProviders, AllWalletTypesAndProviders, WalletCardProvider, WalletDigitalProvider, WalletType, WalletVisuals } from "../types/wallet";
// Wallet Types Icons
import CashIcon from '@assets/icons/wallet/types/cash.svg';
import BankIcon from '@assets/icons/wallet/types/bank.svg';
import CardIcon from '@assets/icons/wallet/types/card.svg';
import DigitalIcon from '@assets/icons/wallet/types/digital.svg';
// Wallet Provider Icons
// Card Provider Icons
import VisaIcon from '@assets/icons/wallet/providers/card/visa.svg';
import MasterCardIcon from '@assets/icons/wallet/providers/card/mastercard.svg';
import AmexIcon from '@assets/icons/wallet/providers/card/amex.svg';
import DiscoverIcon from '@assets/icons/wallet/providers/card/discover.svg';
// Digital Provider Icons
import JazzcashIcon from '@assets/icons/wallet/providers/digital/jazzcash.svg';
import EasypaisaIcon from '@assets/icons/wallet/providers/digital/easypaisa.svg';
import SadapayIcon from '@assets/icons/wallet/providers/digital/sadapay.svg';
import PaypalIcon from '@assets/icons/wallet/providers/digital/paypal.svg';
import GooglePayIcon from '@assets/icons/wallet/providers/digital/googlepay.svg';
import ApplePayIcon from '@assets/icons/wallet/providers/digital/applepay.svg';

import { JSX, ReactNode } from "react";
import AppSvgIcon from "@components/SvgIcon";
import { useTheme } from "../theme/ThemeProvider";
import { ColorValue } from "react-native";



const ICON_MAP: Record<AllWalletTypesAndProviders, any> = {
    // Wallet Types
    cash: CashIcon,
    bank: BankIcon,
    card: CardIcon,
    digital: DigitalIcon,
    // Wallet Card Providers
    visa: VisaIcon,
    mastercard: MasterCardIcon,
    amex: AmexIcon,
    discover: DiscoverIcon,
    // Wallet Digital Providers
    jazzcash: JazzcashIcon,
    easypaisa: EasypaisaIcon,
    sadapay: SadapayIcon,
    paypal: PaypalIcon,
    googlepay: GooglePayIcon,
    applepay: ApplePayIcon
}

const STROKE_ICONS: AllWalletTypesAndProviders[] = ['digital'];

export const WALLET_GRADIENT_MAP: Record<AllWalletTypesAndProviders, string[]> = {
    // Wallet Types (Neutral/Modern)
    cash: ['#11998e', '#38ef7d'],      // Fresh Green
    bank: ['#2c3e50', '#000000'],      // Dark Professional
    card: ['#4b6cb7', '#182848'],      // Deep Blue
    digital: ['#8e2de2', '#4a00e0'],   // Modern Purple

    // Card Providers (Premium Metallic)
    visa: ['#1a1f71', '#00579f'],      // Visa Blue
    mastercard: ['#ff5f00', '#eb001b'], // Mastercard Orange/Red
    amex: ['#007bc1', '#016fd0'],      // Amex Bright Blue
    discover: ['#ff6000', '#ffcc00'],   // Discover Sunset

    // Digital Providers (Brand Specific)
    jazzcash: ['#fbc02d', '#f57f17'],  // JazzCash Gold/Orange
    sadapay: ['#00d7bc', '#00a896'],   // SadaPay Teal
    easypaisa: ['#10b981', '#059669'], // Easypaisa Green
    paypal: ['#003087', '#009cde'],    // PayPal Blue
    googlepay: ['#4285f4', '#34a853'], // Google Colors
    applepay: ['#000000', '#434343'],  // Apple Black
};

// Fallback gradient if something goes wrong
const DEFAULT_GRADIENT = ['#64748b', '#334155'];

export const getWalletIcon = (iconKey: AllWalletTypesAndProviders, textColor: ColorValue, size?: number): JSX.Element | null => {
    const IconComponent = ICON_MAP[iconKey];

    const isStrokeIcon = STROKE_ICONS.includes(iconKey);

    return IconComponent ? (
        <AppSvgIcon
            icon={IconComponent}
            fill={isStrokeIcon ? 'none' : textColor}
            color={undefined}
            stroke={isStrokeIcon ? textColor : 'none'}
            size={size}
        />
    ) : null;
}


export const getWalletVisuals = (
    type: WalletType, 
    provider?: AllWalletProviders | null
): WalletVisuals => {
    // 1. Check if we have a specific provider (JazzCash, Visa, etc.)
    const providerKey = provider?.toLowerCase();
    const typeKey = type?.toLowerCase();

    // 2. Select the gradient colors
    const colors = WALLET_GRADIENT_MAP[providerKey as AllWalletTypesAndProviders] 
                || WALLET_GRADIENT_MAP[typeKey as AllWalletTypesAndProviders] 
                || DEFAULT_GRADIENT;

    // 3. Determine Text/Icon Color
    // JazzCash and Discover are usually bright, so black text looks better
    const darkTextProviders = ['jazzcash', 'discover'];
    const textColor = providerKey && darkTextProviders.includes(providerKey) 
        ? '#000000' 
        : '#FFFFFF';

    return { colors, textColor };
};