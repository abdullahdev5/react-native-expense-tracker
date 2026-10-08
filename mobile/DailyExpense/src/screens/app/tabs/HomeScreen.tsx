import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import AppScreen from "../../../components/AppScreen";
import AppText from "../../../components/Text";
import AppBar from "../../../components/AppBar";
import { TopDashboardCategory } from "../../../types/dashboard";
import { useSnackbarStore } from "../../../store/snackbarStore";
import { AppIconButton } from "@components/Button";
import { Column, Row } from "@components/Layout";
import { useTheme } from "../../../theme/ThemeProvider";
import { colors } from "../../../theme/colors";
import { ThemeType } from "../../../theme";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as Progress from "react-native-progress";
import { getCategoryColor } from "../../../utils/category.utils";
import { CategoryColor } from "../../../types/category";
import AppActivityLoader from "@components/Loader";
import { useDashboardStore } from "../../../store/useDashboardStore";
import BalanceComponent from "@components/feature/wallet/BalanceComponent";
import { useTransactionStore } from "../../../store/useTransactionStore";
import RecentTransactionsList from "@components/feature/transaction/RecentTransactionsList";
import AppDrawer from "@components/AppDrawer";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as DocumentPicker from 'expo-document-picker';


const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HEADER_MAX_HEIGHT = 180;
const HEADER_MIN_HRIGHT = 60;
const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HRIGHT;
const DRAWER_WIDTH = 250;

const HomeScreen = () => {
  const { theme } = useTheme();
  const showSnackbar = useSnackbarStore((s) => s.showSnackbar);
  const dashboardData = useDashboardStore((s) => s.data);

  const totalBalance = dashboardData?.totalBalance ?? 0;
  const baseCurrency = dashboardData?.baseCurrency ?? "PKR";
  const topCategories = dashboardData?.topCategories ?? [];

  const subscribeToTransactions = useTransactionStore(
    (s) => s.subscribeToTransactions,
  );
  const unsubscribeFromTransactions = useTransactionStore(
    (s) => s.unsubscribeFromTransactions,
  );
  const transactions = useTransactionStore((s) => s.transactions);
  const loadMore = useTransactionStore((s) => s.loadMore);
  const hasMore = useTransactionStore((s) => s.hasMore);
  const error = useTransactionStore((s) => s.error);
  const isLoading = useTransactionStore((s) => s.isLoading);

  useEffect(() => {
    subscribeToTransactions(10);

    return () => {
      unsubscribeFromTransactions();
    };
  }, []);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HRIGHT],
      Extrapolation.CLAMP,
    );

    return { height };
  });

  const animatedAvailableBalanceTextStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [theme.fontSize.small, theme.fontSize.xSmall],
      Extrapolation.CLAMP,
    );

    return { fontSize };
  });

  const animatedTotalBalanceValueTextStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [theme.fontSize.xLarge, theme.fontSize.small],
      Extrapolation.CLAMP,
    );

    return { fontSize };
  });

  const animatedTopCategoriesWrapperStyle = useAnimatedStyle(() => {
    // Instead of scrolling up by the full SCROLL_DISTANCE, we lift it slightly less
    // to force it to position itself INSIDE the header bar frame boundaries.
    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      // [0, -135], // Tucks the smaller items safely inside the header height limits
      [0, -155], // Tucks the smaller items safely inside the header height limits
      Extrapolation.CLAMP,
    );

    // Slide left to clear space for the right-aligned balance text
    const translateX = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      // [0, -SCREEN_WIDTH * 0.28], // Dynamically shifts left based on device screen width
      [0, -SCREEN_WIDTH * 0], // Dynamically shifts left based on device screen width
      Extrapolation.CLAMP,
    );

    // Shrink the item sizes down cleanly
    const scale = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [1, 0.45],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }, { translateX }, { scale }],
    };
  });

  const animatedBalanceContainerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [0, SCREEN_WIDTH * 0.28], // Shifts to the right at the exact same speed categories shift left
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [0, 0], // Vertically aligns text box directly within the collapsed space
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateX }, { translateY }],
    };
  });

  // Drawer Related fields
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const translateX = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ translateX: translateX.value }] };
  });
  const toggleDrawer = () => {
    if (isDrawerOpen) {
      translateX.value = withTiming(0);
      setIsDrawerOpen(false);
    } else {
      translateX.value = withTiming(DRAWER_WIDTH);
      setIsDrawerOpen(true);
    }
  };
  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .onStart(() => {
      toggleDrawer();
    });


  const importTRansactions = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'text/csv',
        'application/json',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/pdf'
      ],
      multiple: true
    });

    if (result.canceled) return;

    const formData = new FormData();

    result.assets.forEach((file) => {
      formData.append('statements', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream'
      } as any);
    });

    // send data to backend
    
  }


  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <AppScreen>
          <AppBar
            title="Welcome"
            showBackButton={false}
            height={80}
            leading={
              <AppIconButton
                size={30}
                onPress={() => {
                  toggleDrawer();
                }}
                name="menu"
              />
            }
          />

          {/* Header */}
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.secondaryBackground,
              justifyContent: "center",
            }}
          >
            {isLoading && (
              <AppActivityLoader
                color={colors.white}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            )}

            <RecentTransactionsList
              transactions={transactions}
              scrollHandler={scrollHandler}
              headerMaxHeight={HEADER_MAX_HEIGHT}
              onLoadMore={() => {
                // if (!hasMore || isLoading) return;

                loadMore();
              }}
            />

            {/* {transactions.length === 0 ? (
          <AppText style={{ textAlign: 'center' }}>
            No transactions yet!
          </AppText>
        ) : (
          <Animated.FlatList
            data={transactions}
            keyExtractor={t => `transaction-${t.id}`}
            scrollEventThrottle={16}
            onScroll={scrollHandler}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: HEADER_MAX_HEIGHT + 60,
              paddingBottom: 30,
            }}
            renderItem={({ item: transaction }) => (
              <TransactionTile
                transaction={transaction}
                style={{ marginHorizontal: 10, marginVertical: 5 }}
              />
            )}
            // Native threshold tracking now fires reliably
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              loadMoreTransactions();
            }}
            // Section headers reside cleanly inside the viewport layer
            ListHeaderComponent={() => (
              <AppText
                fontSize={theme.fontSize.medium}
                style={{ marginLeft: 10, marginBottom: 10 }}
              >
                My transactions
              </AppText>
            )}
          />
        )} */}

            {/* Header */}
            <Animated.View style={[styles.header, animatedHeaderStyle]}>
              {/* Wrap inside a row structure to support horizontal splitting when collapsed */}
              <View style={styles.headerRowStructure}>
                {/* Balance Group shifting to the Right */}
                <Animated.View
                  style={[
                    styles.balanceTextWrapper,
                    animatedBalanceContainerStyle,
                  ]}
                >
                  <Column crossAxisAlignment="center">
                    <Animated.Text
                      style={[
                        { color: theme.colors.primary },
                        animatedAvailableBalanceTextStyle,
                      ]}
                    >
                      Available Balance
                    </Animated.Text>
                    <BalanceComponent
                      balance={totalBalance}
                      currency={baseCurrency}
                      animatedTextStyle={animatedTotalBalanceValueTextStyle}
                    />
                  </Column>
                </Animated.View>
              </View>
            </Animated.View>

            {/* Top Categories */}
            {topCategories.length > 1 && (
              <>
                <Animated.View
                  style={[
                    styles.topCategoriesWrapper,
                    animatedTopCategoriesWrapperStyle,
                  ]}
                >
                  <Row spacing={10} style={[styles.topCategoriesContainer]}>
                    {topCategories.map((value, index) => (
                      <TopCategoryContainer
                        key={index}
                        topCategory={value}
                        theme={theme}
                      />
                    ))}
                  </Row>
                </Animated.View>
              </>
            )}
          </View>

          <AppDrawer isOpen={isDrawerOpen} />
        </AppScreen>
      </Animated.View>
    </GestureDetector>
  );
};

type TopCategoryContainerProps = {
  topCategory: TopDashboardCategory;
  theme: ThemeType;
};
const TopCategoryContainer = ({
  topCategory,
  theme,
}: TopCategoryContainerProps): React.JSX.Element => {
  // const animatedPercentage = useSharedValue(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // animatedPercentage.value = (topCategory.percentage / 100);
    setProgress(topCategory.percentage / 100);
  }, [topCategory.percentage]);

  return (
    <View
      style={[
        styles.topCategoryContainer,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <Progress.Circle
        borderWidth={0}
        size={80} // Slightly larger for better visual
        color={getCategoryColor(topCategory.color as CategoryColor)}
        progress={progress}
        showsText={false} // Disable internal text
        thickness={13}
        strokeCap="round"
        animated={true}
      />
      {/* Manually absolute center the text */}
      <View
        style={[StyleSheet.absoluteFill, styles.centerTopCategoryPercentage]}
      >
        <AppText
          style={{
            fontSize: theme.fontSize.small,
            textAlign: "center",
          }}
        >
          {`${topCategory.percentage}%`}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: colors.dark,
    // elevation: 4,
    // justifyContent: 'flex-end', // Keeps content aligned to bottom as it shrinks
    // paddingBottom: 15,
    // paddingHorizontal: 20,
    // height: 180,
    // alignItems: 'center',
  },
  headerRowStructure: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  balanceTextWrapper: {
    flex: 1,
    alignItems: "center", // Starts centered, moves right via translateX [1]
  },
  topCategoriesWrapper: {
    position: "absolute",
    top: HEADER_MAX_HEIGHT - 50,
    // top: 105,
    right: 0,
    left: 0,
    overflow: "visible",
    zIndex: 20,
    height: 100,
    transformOrigin: "left center",
  },
  // topCategoriesContainer: {
  //   // flex: 1,
  //   justifyContent: 'space-evenly',
  //   overflow: 'visible',
  //   position: 'absolute',
  //   right: 0,
  //   left: 0,
  //   top: -50,
  //   zIndex: 10,
  // },
  topCategoriesContainer: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  topCategoryContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  centerTopCategoryPercentage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
