import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import AppText from "./Text";
import AppButton, { AppIconButton } from "./Button";
import { userStore } from "@/store/userStore";
import { colors } from "@/theme/colors";
import { Column, Row } from "./Layout";
import AppIcon from "./Icon";
import { useTheme } from "@/theme";
import ProfilePicture from "./ProfilePicture";
import AppSvgIcon from "./SvgIcon";
import WalletIcon from '@assets/icons/wallet.svg';

const DRAWER_WIDTH = 250;

type AppDrawerProps = {
  isOpen: boolean;
};

const AppDrawer = (props: AppDrawerProps) => {
  const user = userStore((s) => s.user);
  const { theme } = useTheme();

  // Animate Custom Drawer variables
  const translateX = useSharedValue(-DRAWER_WIDTH);

  const toggleDrawer = () => {
    if (props.isOpen) {
      translateX.value = withTiming(-DRAWER_WIDTH);
    } else {
      translateX.value = withTiming(0);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  useEffect(() => {
    toggleDrawer();
  }, [props.isOpen]);

  return (
    <Animated.View style={[styles.darwer, animatedStyle]}>
      {/* User Details */}
      <View style={styles.userDetailsContainer}>
        {/* Picture */}
        {user?.picture ? (
          <Image style={styles.userImage} src={user.picture}></Image>
        ) : (
          <ProfilePicture style={styles.userImage} imageUrl={null} />
        )}
        {/* Name, email */}
        <Column>
            <AppText fontSize={theme.fontSize.large} color={theme.colors.secondary}>{user?.name ?? ''}</AppText>
            <AppText fontSize={theme.fontSize.small} color={colors.lightGrey}>{user?.email ?? ''}</AppText>
        </Column>
        {/* Edit Icon */}
        <AppIconButton
            style={styles.editProfileIcon}
            name="edit"
            onPress={() => {
                // todo
            }}
        />
      </View>

      {/* Drawer Items */}
      <Row style={styles.drawerItem} spacing={30}>
        <AppIcon name="export" provider="Entypo" color={theme.colors.primary} />
        <AppText>Exports</AppText>
      </Row>

      <Row style={styles.drawerItem} spacing={30}>
        <AppIcon name="import" provider="AntDesign" color={theme.colors.primary} />
        <AppText>Imports</AppText>
      </Row>

      <Row style={styles.drawerItem} spacing={30}>
        <AppIcon name="receipt-outline" provider="Ionicons" color={theme.colors.primary} />
        <AppText>Receipts</AppText>
      </Row>

      <Row style={styles.drawerItem} spacing={30}>
        <AppIcon name="add-circle-outline" provider="Ionicons" color={theme.colors.primary} />
        <AppText>Set Budget</AppText>
      </Row>

      <Row style={styles.drawerItem} spacing={30}>
        <AppSvgIcon icon={WalletIcon} color={theme.colors.primary} />
        <AppText>Wallets</AppText>
      </Row>

      <Row style={styles.drawerItem} spacing={30}>
        <AppIcon name="category" provider="Material" color={theme.colors.secondary} />
        <AppText>Categories</AppText>
      </Row>

      <Row style={styles.drawerItem} spacing={30}>
        <AppIcon name="settings-outline" provider="Ionicons" color={theme.colors.secondary} />
        <AppText>Settings</AppText>
      </Row>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  darwer: {
    width: DRAWER_WIDTH,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    paddingTop: 60,
    zIndex: 99,
  },
  drawerItem: {
    padding: 20,
  },
  userDetailsContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 20,
    rowGap: 10,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    outlineWidth: 2,
    outlineColor: colors.yellow,
  },
  editProfileIcon: {
    flex: 1,
    justifyContent: 'flex-end'
  }
});

export default AppDrawer;
