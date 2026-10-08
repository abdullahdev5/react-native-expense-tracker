import React, { ReactNode } from 'react';
import AppScreen from '@components/AppScreen';
import { useTheme } from '../../../theme/ThemeProvider';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MAIN_TABS_ROUTES } from '../../../navigation/routes';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import HomeScreen from './HomeScreen';
import WalletScreen from './WalletScreen';
import InsightScreen from './InsightScreen';
import ProfileScreen from './ProfileScreen';
import HomeIcon from '@assets/icons/home.svg';
import WalletIcon from '@assets/icons/wallet.svg';
import InsightIcon from '@assets/icons/insight.svg';
import ProfileIcon from '@assets/icons/profile.svg';
import AppIcon from '@components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppFAB from '@components/FAB';
import { colors } from '../../../theme/colors';
import { AppGlowEffect } from '../../../components/GlowEffect';
import { AppNavigation, MainTabsStackParamList } from '../../../navigation/types';
import AppSvgIcon from '@components/SvgIcon';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator<MainTabsStackParamList>();

const MainTabs = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const appNavigation = useNavigation<AppNavigation>();

  return (
    <AppScreen>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            height: 60 + insets.bottom,
            overflow: 'visible',
          },
          tabBarItemStyle: {
            paddingTop: 10,
          },
          tabBarShowLabel: false,
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.text,
          tabBarIcon({ color, size, focused }) {
            const glowColor = theme.colors.primary;
            let icon: ReactNode;

            if (route.name === MAIN_TABS_ROUTES.home) {

              icon = (
                <AppSvgIcon
                  icon={HomeIcon}
                  size={size}
                  color={color}
                  fill={null}
                  stroke={null}
                />
              );

            } else if (route.name === MAIN_TABS_ROUTES.wallet) {

              icon = (
                <AppSvgIcon
                  icon={WalletIcon}
                  size={size}
                  color={color}
                  fill={null}
                  stroke={null}
                />
              );

            } else if (route.name === MAIN_TABS_ROUTES.insight) {

              icon = (
                <AppSvgIcon
                  icon={InsightIcon}
                  size={size}
                  color={color}
                  fill={null}
                  stroke={null}
                />
              );

            } else if (route.name === MAIN_TABS_ROUTES.profile) {

              icon = (
                <AppSvgIcon
                  icon={ProfileIcon}
                  size={size}
                  color={color}
                  fill={null}
                  stroke={null}
                />
              );
              
            }

            return (
              <AppGlowEffect
                width={size}
                height={size}
                color={glowColor}
                active={focused}
                glowIntensity={15}
              >
                {icon}
              </AppGlowEffect>
            );
          },
        })}
      >
        <Tab.Screen name={MAIN_TABS_ROUTES.home} component={HomeScreen} />
        <Tab.Screen name={MAIN_TABS_ROUTES.wallet} component={WalletScreen} />

        {/* Add Transaction Button */}
        <Tab.Screen
          name={"Add" as any}
          component={View}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
            }
          }}
          options={({ navigation }) => ({
            tabBarIcon: props => (
              <View style={{ flex: 1 }}>
                <AppFAB 
                  position="bottom-center"
                  offsetY={10}
                  onPress={() => {
                    // navigate to add transaction screen
                    appNavigation.navigate('add_transaction');
                  }}
                >
                  <AppIcon name="add" color={colors.white} size={30} />
                </AppFAB>
              </View>
            ),
          })}
        />

        <Tab.Screen name={MAIN_TABS_ROUTES.insight} component={InsightScreen} />
        <Tab.Screen name={MAIN_TABS_ROUTES.profile} component={ProfileScreen} />
      </Tab.Navigator>
    </AppScreen>
  );
};

export default MainTabs;
