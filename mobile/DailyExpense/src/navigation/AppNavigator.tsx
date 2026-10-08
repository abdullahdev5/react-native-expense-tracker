import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import MainTabs from '../screens/app/tabs/MainTabs';
import { navigationRef } from './navigationRef';
import { APP_ROUTES, AUTH_ROUTES, ROUTES } from './routes';
import {
  AppStackParamList,
  AuthStackParamList,
  RootStackParamList,
} from './types';
import { getToken } from '../storage/auth.storage';
import { userStore } from '../store/userStore';
import AppScreen from '../components/AppScreen';
import AppActivityLoader from '../components/Loader';
import AddTransactionScreen from '../screens/app/AddTransactionScreen';
import SetBaseCurrencyScreen from '../screens/SetBaseCurrencyScreen';
import { useEffect } from 'react';
import AddCategoryScreen from '../screens/app/AddCategoryScreen';
import CategoriesScreen from '../screens/app/CategoriesScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

function AppNavigator() {
  const isLoading = userStore(s => s.isLoading);
  const token = userStore(s => s.token);

  if (isLoading) {
    return (
      <AppScreen style={{ justifyContent: 'center', alignItems: 'center' }}>
        <AppActivityLoader />
      </AppScreen>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <RootStack.Screen
              name={ROUTES.app}
              component={AppStackScreens}
              options={{ headerShown: false }} 
            />
          // user.baseCurrency ? (
          //   <RootStack.Screen
          //     name={ROUTES.app}
          //     component={AppStackScreens}
          //     options={{ headerShown: false }} 
          //   />
          // ) : (
          //   <RootStack.Screen
          //     name={ROUTES.setBaseCurrency}
          //     component={SetBaseCurrencyScreen}
          //     options={{ headerShown: false }}
          //   />
          // )
        ) : (
          <RootStack.Screen
            name={ROUTES.auth}
            component={AuthStackScreens}
          />
        )}
        {/* <RootStack.Screen name={ROUTES.app} component={AppStackScreens} /> */}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function AuthStackScreens() {
  return (
    <AuthStack.Navigator
      initialRouteName={AUTH_ROUTES.login}
      screenOptions={{ headerShown: false }}
    >
      <AuthStack.Screen 
        name={AUTH_ROUTES.login}
        component={LoginScreen}
      />

      <AuthStack.Screen
        name={AUTH_ROUTES.register}
        component={RegisterScreen}
      />
    </AuthStack.Navigator>
  );
}

function AppStackScreens() {
  return (
    // <AppStack.Navigator initialRouteName={APP_ROUTES.mainTabs} screenOptions={{ headerShown: false }}>
    <AppStack.Navigator initialRouteName={APP_ROUTES.mainTabs} screenOptions={{ headerShown: false }}>
      
      {/* Main Tabs */}
      <AppStack.Screen 
        name={APP_ROUTES.mainTabs}
        component={MainTabs}
        options={{ headerShown: false }} />

      {/* Add Transaction */}
      <AppStack.Screen
        name={APP_ROUTES.addTransaction}
        component={AddTransactionScreen}
        options={{ headerShown: false }}
      />

      {/* Add Category */}
      <AppStack.Screen
        name={APP_ROUTES.addCategory}
        component={AddCategoryScreen}
        options={{ headerShown: false }}
      />

      {/* Categories */}
      <AppStack.Screen
        name={APP_ROUTES.categories}
        component={CategoriesScreen}
        options={{ headerShown: false }}
      />

    </AppStack.Navigator>
  );
}

export default AppNavigator;
