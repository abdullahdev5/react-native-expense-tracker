
export const ROUTES = {
    auth: 'auth',
    app: 'app',
    setBaseCurrency: 'set-base-currency',
} as const;

export const AUTH_ROUTES = {
    login: 'login',
    register: 'register'
} as const;

export const APP_ROUTES = {
    mainTabs: 'mainTabs',
    addTransaction: 'add_transaction',
    addCategory: 'add_category',
    categories: 'categories'
} as const;

export const MAIN_TABS_ROUTES = {
    home: 'home',
    wallet: 'wallet',
    insight: 'insight',
    profile: 'profile'
} as const;