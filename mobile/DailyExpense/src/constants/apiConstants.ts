

export const REQUEST_URL_CONSTANTS = {
    // Auth
    register: 'auth/register',
    login: 'auth/login',
    googleAuth: 'auth/google',
    facebookAuth: 'auth/facebook',

    // Dashboard
    getDashboard: 'dashboard',

    // User
    user: 'user',
    setBaseCurrency: 'user/base-currency',
    updateProfile: 'user/profile/update',

    // Wallet
    createWallet: 'wallets/create',
    getWallets: 'wallets',
    

    // Category
    createCategory: 'categories/create',
    getCategories: 'categories',
    deleteCategory: 'categories/delete',

    // Transaction
    createTransaction: 'transactions/create',
    getTransactions: 'transactions',

    // Insight
    getInsights: 'insights'
};