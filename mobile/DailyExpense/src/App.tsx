import { StatusBar } from 'react-native';
import { ThemeProvider, useTheme } from './theme/index';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GlobalSnackbar from '@components/GlobalSnackbar';
import AppNavigator from './navigation/AppNavigator';
import React, { useEffect } from 'react';
import { userStore } from './store/userStore';
import { useKeepAwake } from '@thehale/react-native-keep-awake';
import SocketManager from '@components/SocketManager';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GlobalDialog } from '@components/GlobalDialog';
import NetInfo from '@react-native-community/netinfo';
// import DatabaseProviderOriginal from '@nozbe/watermelondb/DatabaseProvider';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import database from './db';
import { runInitialSync } from './services/sync.service';
import { initializeAppSubscriptions } from './store/useAppInitStore';
import { registerRootComponent } from 'expo';


// const DatabaseProvider = (DatabaseProviderOriginal as any) as React.ComponentType<{
//   database: typeof database;
//   children: React.ReactNode;
// }>;


function AppContent() {
  const token = userStore(s => s.token);

  useEffect(() => {
    if (!token) return;

    const unsubscribe = initializeAppSubscriptions();

    const syncInBackground = async () => {
      const network = await NetInfo.fetch();
      // Get User from Server if Connected to Wifi
      if (network.isConnected) {
        userStore.getState().getUser();
        console.log(`Network is Connected | Getting User from the Api in background`);
      }

      // Run local sync (Cat / Wallets / Txs)
      await runInitialSync();
    };

    syncInBackground().catch(err => {
      console.log('Background sync skipped/failed:', err.message);
    });

    // Clean up RxJS subscriptions on unmount or logout (token change)
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [token]);

  return (
    <SocketManager>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GlobalSnackbar />
        <GlobalDialog />

        <AppNavigator />
      </GestureHandlerRootView>
    </SocketManager>
  );
}


function AppStatusBar() {
  useKeepAwake();

  const { isLight } = useTheme();

  return (
    <StatusBar
      barStyle={isLight ? 'dark-content' : 'light-content'}
      translucent
      backgroundColor="transparent"
    />
  );
}


function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AppStatusBar />

        <DatabaseProvider database={database}>
          <AppContent />
        </DatabaseProvider>

        {/* <KeepAwake /> */}
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

// export default App;
registerRootComponent(App);