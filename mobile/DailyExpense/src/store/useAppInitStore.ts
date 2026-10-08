import { useCategoryStore } from "./useCategoryStore"
import { useTransactionStore } from "./useTransactionStore";
import { useWalletStore } from "./useWalletStore";


export const initializeAppSubscriptions = () => {
    console.log(`Initialize App Subscriptions`);

    // Categories Subscription
    const categoriesSub = useCategoryStore.getState().subscribeToCategories();

    // Wallets Subscription
    const walletsSub = useWalletStore.getState().subscribeToWallets();

    return () => {
        categoriesSub.unsubscribe();
        walletsSub.unsubscribe();
    };
};