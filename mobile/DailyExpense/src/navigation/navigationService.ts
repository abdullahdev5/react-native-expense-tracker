import { navigationRef } from './navigationRef';
import { APP_ROUTES, AUTH_ROUTES, MAIN_TABS_ROUTES, ROUTES } from './routes';
import { AppStackParamList, AuthStackParamList, MainTabsStackParamList, RootStackParamList } from './types';

export const navigateAuth = <T extends keyof AuthStackParamList>(
    screen: T,
    params?: AuthStackParamList[T]
) => {
    if (!navigationRef.isReady()) return;

    navigationRef.navigate({
        name: ROUTES.auth,
        params: { screen, params }
    });
}

export const navigateApp = <T extends keyof AppStackParamList>(
    screen: T,
    params?: AppStackParamList[T]
) => {
    if (!navigationRef.isReady()) return;

    navigationRef.navigate(ROUTES.app, {
      screen,
      params
    } as any);
}

export const navigateMainTabs = <T extends keyof MainTabsStackParamList>(
  screen: T,
  params?: MainTabsStackParamList[T]
) => {
  if (!navigationRef.isReady()) return;

  navigationRef.navigate(ROUTES.app, {
    screen: APP_ROUTES.mainTabs,
    params: { screen, params }
  })
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function resetToLogin() {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ 
        name: ROUTES.auth,
        params: {
          screen: AUTH_ROUTES.login
        }
      }],
    });
  }
}

export function resetToMain() {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{
        name: ROUTES.app,
        params: {
          screen: APP_ROUTES.mainTabs
        }
      }]
    })
  }
}