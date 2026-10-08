// import { StyleSheet, View } from 'react-native';
// import WalletCard from './WalletCard';
// import { Wallet } from '../../../types/wallet';

// const WalletStack = ({ wallets }: { wallets: Wallet[] }) => {
//   if (wallets.length === 0) return null;

//   // We take the first two wallets to show the stack
//   const frontWallet = wallets[0];
//   const backWallet = wallets[1];
//   const lastBackWallet = wallets[2];

//   return (
//     <View style={styles.stackWrapper}>
//       {lastBackWallet && (
//         <View style={styles.lastBackCardPosition}>
//           <WalletCard wallet={lastBackWallet} isBackCard={true} />
//         </View>
//       )}

//       {backWallet && (
//         <View style={styles.backCardPosition}>
//           <WalletCard wallet={backWallet} isBackCard={true} />
//         </View>
//       )}

//       <View style={styles.frontCardPosition}>
//         <WalletCard wallet={frontWallet} isBackCard={false} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   stackWrapper: {
//     height: 260, // Total height of the stacked UI
//     width: '100%',
//     alignItems: 'center',
//     marginVertical: 20,
//     // marginHorizontal: 20,
//   },
//   lastBackCardPosition: {
//     position: 'absolute',
//     top: 0,
//     transform: [{ scaleX: 0.8 }],
//     zIndex: 1,
//   },
//   backCardPosition: {
//     position: 'absolute',
//     top: 15,
//     transform: [{ scaleX: 0.9 }],
//     zIndex: 2,
//   },
//   frontCardPosition: {
//     position: 'absolute',
//     top: 30, // This creates the "reveal" of the back card
//     zIndex: 3,
//   },
// });

// export default WalletStack;

import { Dimensions, StyleSheet, View } from 'react-native';
import WalletCard from './WalletCard';
import { Wallet } from '../../../types/wallet';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import { memo, useEffect, useState } from 'react';
import { runOnJS } from 'react-native-worklets';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.35;

const SwipableCardWrapper = memo(
  ({
    wallet,
    isFront,
    isBack,
    isLastBack,
    dragX,
    onSwipeComplete,
  }: {
    wallet: Wallet;
    isFront: boolean;
    isBack: boolean;
    isLastBack: boolean;
    dragX: SharedValue<number>;
    onSwipeComplete: (directionX: number) => void;
  }) => {
    // Every individual card in memory tracks its own coordinates permanently
    const localTranslateX = useSharedValue(0);

    const gesture = usePanGesture({
      enabled: isFront,
      onUpdate: event => {
        localTranslateX.value = event.translationX;
        dragX.value = event.translationX;
      },
      onDeactivate: event => {
        if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
          const flyAwayX =
            event.translationX > 0 ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;

          // Match the background card transition speed
          dragX.value = withTiming(flyAwayX, { duration: 250 });

          // Throw the card off screen natively
          localTranslateX.value = withTiming(
            flyAwayX,
            { duration: 250 },
            finished => {
              if (finished) {
                // Signal back to parent layout to update index array pointers
                runOnJS(onSwipeComplete)(event.translationX);
              }
            },
          );
        } else {
          localTranslateX.value = withSpring(0, { damping: 15, stiffness: 100 });
          dragX.value = withSpring(0, { damping: 15, stiffness: 100 });
        }
      },
    });

    const animatedStyle = useAnimatedStyle(() => {
      if (isFront) {
        return {
          transform: [
            { translateX: localTranslateX.value },
            { rotate: `${localTranslateX.value / 18}deg` },
          ],
          zIndex: 999,
          elevation: 999,
        };
      }

          const dragProgress = Math.abs(dragX.value);

    if (isBack) {
      // Scale from 0.9 to 1.0, and move from top: 15 down to top: 30
      const scaleX = interpolate(dragProgress, [0, SWIPE_THRESHOLD], [0.9, 1.0], Extrapolation.CLAMP);
      const topPosition = interpolate(dragProgress, [0, SWIPE_THRESHOLD], [15, 30], Extrapolation.CLAMP);
      
      return {
        transform: [{ scaleX }],
        top: topPosition,
        zIndex: 2,
        elevation: 2,
      };
    }

    if (isLastBack) {
      // Scale from 0.8 to 0.9, and move from top: 0 down to top: 15
      const scaleX = interpolate(dragProgress, [0, SWIPE_THRESHOLD], [0.8, 0.9], Extrapolation.CLAMP);
      const topPosition = interpolate(dragProgress, [0, SWIPE_THRESHOLD], [0, 15], Extrapolation.CLAMP);

      return {
        transform: [{ scaleX }],
        top: topPosition,
        zIndex: 1,
        elevation: 1,
      };
    }

      return {};
    });

    let cardPositionStyle = styles.frontCardPosition;
    if (isBack) cardPositionStyle = styles.backCardPosition;
    if (isLastBack) cardPositionStyle = styles.lastBackCardPosition;

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[cardPositionStyle, animatedStyle]}>
          <WalletCard wallet={wallet} isBackCard={!isFront} />
        </Animated.View>
      </GestureDetector>
    );
  },
);

const WalletStack = ({ wallets }: { wallets: Wallet[] }) => {
  if (wallets.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const dragX = useSharedValue(0);

  const totalWallets = wallets.length;

  const handleSwipeComplete = () => {
    // Simply increment the index pointer tracker layer.
    // ZERO shared values are cleared out manually here.
    setCurrentIndex(prev => prev + 1);
  };

  useEffect(() => {
    dragX.value = 0;
  }, [currentIndex]);

  // Safe window slice logic preventing element array mapping memory overlap leaks
  const frontWallet = wallets[currentIndex % totalWallets];
  const backWallet = wallets[(currentIndex + 1) % totalWallets];
  const lastBackWallet = wallets[(currentIndex + 2) % totalWallets];

  return (
    <View style={styles.stackWrapper}>
      {/* Render back-to-front to guarantee exact UI layer stacks */}
      {lastBackWallet && (
        <SwipableCardWrapper
          key={`last-back-${lastBackWallet.id}-${currentIndex + 2}`}
          wallet={lastBackWallet}
          isFront={false}
          isBack={false}
          isLastBack={true}
          dragX={dragX}
          onSwipeComplete={handleSwipeComplete}
        />
      )}

      {backWallet && (
        <SwipableCardWrapper
          key={`back-${backWallet.id}-${currentIndex + 1}`}
          wallet={backWallet}
          isFront={false}
          isBack={true}
          isLastBack={false}
          dragX={dragX}
          onSwipeComplete={handleSwipeComplete}
        />
      )}

      {frontWallet && (
        <SwipableCardWrapper
          key={`front-${frontWallet.id}-${currentIndex}`}
          wallet={frontWallet}
          isFront={true}
          isBack={false}
          isLastBack={false}
          dragX={dragX}
          onSwipeComplete={handleSwipeComplete}
        />
      )}
    </View>
  );
};

// const WalletStack = ({ wallets }: { wallets: Wallet[] }) => {
//   if (wallets.length === 0) return null;

//   const [currentIndex, setCurrentIndex] = useState(0);

//   const initialTranslateX = useSharedValue(0);
//   const initialTranslateY = useSharedValue(0);

//   const translateX = useSharedValue(0);
//   const translateY = useSharedValue(0);
//   // Shared value to smoothly transition the background card scale
//   const backCardAnimatedProgress = useSharedValue(0);

//   // const frontCardOpacity = useSharedValue(1);

//   const updateIndexAndReset = () => {
//     // 3. React updates indices first
//     setCurrentIndex(prev => prev + 1);

//     // 4. Instantly reset layout positions natively AFTER state has processed
//     translateX.value = 0;
//     translateY.value = 0;
//     backCardAnimatedProgress.value = 0;
//   };

//   const handleSwipeComplete = (directionX: number) => {
//     'worklet';

//     // 1. Throw the card fully off-screen horizontally based on swipe direction
//     const flyAwayX = directionX > 0 ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;

//     // Smoothly animate the background card scaling up at the same time
//     backCardAnimatedProgress.value = withTiming(1, { duration: 350 });

//     translateX.value = withTiming(flyAwayX, { duration: 350 }, isFinished => {
//       if (isFinished) {
//         // 2. Hand off control safely back to React thread
//         runOnJS(updateIndexAndReset)();
//       }
//     });
//   };

//   // const handleSwipeComplete = () => {
//   //   frontCardOpacity.value = withTiming(0, { duration: 700 });

//   //   setTimeout(() => {
//   //     translateX.value = withSpring(0, { damping: 15, stiffness: 100 });
//   //     translateY.value = withSpring(0, { damping: 15, stiffness: 100 });

//   //     console.log('SWIPE_THREESHOLD Trigerred!');

//   //     setCurrentIndex(prev => prev + 1);

//   //     frontCardOpacity.value = 1;
//   //   }, 1000);
//   // };

//   // const gesture = usePanGesture({
//   //   onActivate: () => {
//   //     initialTranslateX.value = translateX.value;
//   //     initialTranslateY.value = translateY.value;
//   //   },
//   //   onUpdate: event => {
//   //     translateX.value = initialTranslateX.value + event.translationX;
//   //     translateY.value = initialTranslateY.value + event.translationY;
//   //   },
//   //   onDeactivate: event => {
//   //     if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
//   //       runOnJS(handleSwipeComplete)();
//   //     } else {
//   //       translateX.value = withSpring(0, { damping: 15, stiffness: 100 });
//   //       translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
//   //     }
//   //   },
//   // });

//   const gesture = usePanGesture({
//     onActivate: () => {
//       initialTranslateX.value = translateX.value;
//       // initialTranslateY.value = translateY.value;
//     },
//     onUpdate: event => {
//       translateX.value = initialTranslateX.value + event.translationX;
//       // translateY.value = initialTranslateY.value + event.translationY;

//       // Dynamic scaling: make background card grow slightly as user pulls front card
//       backCardAnimatedProgress.value = interpolate(
//         Math.abs(translateX.value),
//         [0, SWIPE_THRESHOLD],
//         [0, 0.5],
//         Extrapolation.CLAMP,
//       );
//     },
//     onDeactivate: event => {
//       if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
//         handleSwipeComplete(event.translationX);
//       } else {
//         // Spring back if gesture was abandoned
//         translateX.value = withSpring(0, { damping: 15, stiffness: 100 });
//         translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
//         backCardAnimatedProgress.value = withSpring(0, {
//           damping: 15,
//           stiffness: 100,
//         });
//       }
//     },
//   });

//   const animatedFrontCardStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         { translateX: translateX.value },
//         { translateY: translateY.value },
//         { rotate: `${translateX.value / 18}deg` },
//       ],
//       // elevation: 0,
//       // opacity: frontCardOpacity.value,
//     };
//   });

//   // Back Card Styling: Smoothly scales up and matches opacity targets
//   const animatedBackCardStyle = useAnimatedStyle(() => {
//     const scale = interpolate(
//       backCardAnimatedProgress.value,
//       [0, 1],
//       [0.92, 1],
//     );
//     // const opacity = interpolate(backCardAnimatedProgress.value, [0, 1], [0.8, 1]);
//     const bottomOffset = interpolate(
//       backCardAnimatedProgress.value,
//       [0, 1],
//       [-15, 0],
//     );

//     return {
//       transform: [{ scale }, { translateY: bottomOffset }],
//       // opacity,
//     };
//   });

//   const totalWallets = wallets.length;

//   const frontWallet = wallets[currentIndex % totalWallets];
//   const backWallet = wallets[(currentIndex + 1) % totalWallets];
//   const lastBackWallet = wallets[(currentIndex + 2) % totalWallets];

//   return (
//     <View style={styles.stackWrapper}>
//       {lastBackWallet && (
//         <View
//           key={`last-back-${lastBackWallet.id}`}
//           style={styles.lastBackCardPosition}
//         >
//           <WalletCard wallet={lastBackWallet} isBackCard={true} />
//         </View>
//       )}

//       {backWallet && (
//         <Animated.View
//           key={`back-${backWallet.id}`}
//           style={[styles.backCardPosition, animatedBackCardStyle]}
//         >
//           <WalletCard wallet={backWallet} isBackCard={true} />
//         </Animated.View>
//       )}

//       {frontWallet && (
//         <View key={`front-${frontWallet.id}`} style={styles.frontCardPosition}>
//           <GestureDetector gesture={gesture}>
//             <Animated.View style={[animatedFrontCardStyle]}>
//               <WalletCard wallet={frontWallet} isBackCard={false} />
//             </Animated.View>
//           </GestureDetector>
//         </View>
//       )}
//     </View>
//   );
// };

const styles = StyleSheet.create({
  stackWrapper: {
    height: 280, // Total height of the stacked UI
    // height: 260, // Total height of the stacked UI
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
    // marginHorizontal: 20,
    position: 'relative',
  },
  lastBackCardPosition: {
    position: 'absolute',
    top: 0,
    transform: [{ scaleX: 0.8 }],
    // transform: [{ translateY: 0 }, { scale: 0.88 }],
    zIndex: 1,
    elevation: 1,
  },
  backCardPosition: {
    position: 'absolute',
    top: 15,
    // top: 0,
    transform: [{ scaleX: 0.9 }],
    // transform: [{ translateY: 12 }, { scale: 0.94 }],
    zIndex: 2,
    elevation: 2,
  },
  frontCardPosition: {
    position: 'absolute',
    // transform: [{ translateY: 24 }],
    top: 30, // This creates the "reveal" of the back card
    // top: 0, // This creates the "reveal" of the back card
    zIndex: 999,
    elevation: 999,
  },
});

export default WalletStack;
