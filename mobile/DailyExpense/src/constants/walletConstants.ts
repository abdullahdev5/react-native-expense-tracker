import { View } from "react-native";
import { AllWalletProviders, Wallet, WalletCardProvider, WalletDigitalProvider, WalletType } from "../types/wallet";
import { DropdownItem } from "@components/Dropdown";
import { mapWallet } from "../utils/mapper";

/* Wallet Types */
export const walletTypes: DropdownItem<WalletType>[] = [
    { label: 'Cash', value: "cash", data: 'cash', icon: 'cash' },
    { label: 'Bank', value: "bank", data: 'bank', icon: 'bank' },
    { label: 'Card', value: "card", data: 'card', icon: 'card' },
    { label: 'Digital', value: "digital", data: 'digital', icon: 'digital' },
] as const;

/* Wallet Card Providers */
export const walletCardProviders: DropdownItem<WalletCardProvider>[] = [
    { label: 'Visa', value: "visa", data: 'visa', icon: 'visa' },
    { label: 'Mastercard', value: "mastercard", data: 'mastercard', icon: 'mastercard' },
    { label: 'Amex', value: "amex", data: 'amex', icon: 'amex' },
    { label: 'Discover', value: "discover", data: 'discover', icon: 'discover' },
] as const;

/* Wallet Digital Providers */
export const walletDigitalProviders: DropdownItem<WalletDigitalProvider>[] = [
    { label: 'Jazzcash', value: "jazzcash", data: 'jazzcash', icon: 'jazzcash' },
    { label: 'Sadapay', value: "sadapay", data: 'sadapay', icon: 'sadapay' },
    { label: 'Easypaisa', value: "easypaisa", data: 'easypaisa', icon: 'easypaisa' },
    { label: 'Paypal', value: "paypal", data: 'paypal', icon: 'paypal' },
    { label: 'GooglePay', value: "googlepay", data: 'googlepay', icon: 'googlepay' },
    { label: 'ApplePay', value: "applepay", data: 'applepay', icon: 'applepay' },
] as const;



export const fakeWalletsData: Wallet[] = [
  mapWallet({
    id: 'w1',
    name: 'Main Cash',
    type: 'cash',
    currency: 'USD',
    balance: 450.50,
    createdAt: '2023-10-01T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  }),
  mapWallet({
    id: 'w2',
    name: 'HBL Savings',
    type: 'bank',
    provider: 'hbl' as AllWalletProviders, // Cast to match your enum/type
    currency: 'PKR',
    balance: 250000,
    createdAt: '2023-08-15T08:00:00Z',
    updatedAt: '2024-02-01T09:15:00Z',
  }),
  mapWallet({
    id: 'w3',
    name: 'Visa Credit Card',
    type: 'card',
    provider: 'visa' as AllWalletProviders,
    currency: 'USD',
    balance: -120.75, // Negative balance for credit cards
    createdAt: '2023-11-20T12:00:00Z',
    updatedAt: '2024-02-10T20:45:00Z',
  }),
  mapWallet({
    id: 'w4',
    name: 'Digital Wallet',
    type: 'digital',
    provider: 'paypal' as AllWalletProviders,
    currency: 'EUR',
    balance: 15.00,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-02-12T11:00:00Z',
  }),
];
