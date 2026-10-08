import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { APP_ROUTES, AUTH_ROUTES, MAIN_TABS_ROUTES, ROUTES } from "./routes"
import { NavigatorScreenParams } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";

export type RootStackParamList = {
    [ROUTES.auth]: NavigatorScreenParams<AuthStackParamList>;
    [ROUTES.app]: NavigatorScreenParams<AppStackParamList>;
    [ROUTES.setBaseCurrency]: undefined;
}

export type AuthStackParamList = {
    [AUTH_ROUTES.login]: undefined;
    [AUTH_ROUTES.register]: undefined;
}

export type AppStackParamList = {
    [APP_ROUTES.mainTabs]: NavigatorScreenParams<MainTabsStackParamList>;
    [APP_ROUTES.addTransaction]: undefined;
    [APP_ROUTES.addCategory]: undefined;
    [APP_ROUTES.categories]: undefined;
}

export type MainTabsStackParamList = {
    [MAIN_TABS_ROUTES.home]: undefined;
    [MAIN_TABS_ROUTES.wallet]: undefined;
    [MAIN_TABS_ROUTES.insight]: undefined;
    [MAIN_TABS_ROUTES.profile]: undefined;
}

export type AuthNavigation = NativeStackNavigationProp<AuthStackParamList>;
export type AppNavigation = NativeStackNavigationProp<AppStackParamList>;
export type MainTabsNavigation = BottomTabNavigationProp<MainTabsStackParamList>;