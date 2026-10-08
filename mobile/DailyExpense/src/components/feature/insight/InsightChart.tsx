// import React from 'react';
// import { StyleSheet, View, Text, Dimensions } from 'react-native';
// import { LineChart } from 'react-native-gifted-charts';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// const backendResponse = {
//   chartData: [
//     { index: 1, label: 'Sun', value: 300 },
//     { index: 2, label: 'Mon', value: 700 },
//     { index: 3, label: 'Tue', value: 450 },
//     { index: 4, label: 'Wed', value: 400 },
//     { index: 5, label: 'Thu', value: 995 },
//     { index: 6, label: 'Fri', value: 650 },
//     { index: 7, label: 'Sat', value: 850 },
//   ],
// };

// export default function CustomInsightChart() {
//   const chartData = backendResponse.chartData.map((item) => ({
//     value: item.value,
//     label: item.label,
//   }));

//   return (
//     <View style={styles.container}>
//       <LineChart
//         data={chartData}

//         // --- PROPER FULL-WIDTH SYSTEM (Fixes the Right & Left Space) ---
//         width={SCREEN_WIDTH - 20}  // Accounts for minimal outer padding
//         adjustToWidth={true}       // Dynamically expands spacing
//         initialSpacing={12}        // ⚠️ FIXED: Keeps Sun touchable so the tooltip triggers
//         endSpacing={12}            // Matches initialSpacing perfectly to keep layout symmetric

//         // --- STYLING & AREA VISUALS ---
//         curved
//         curvature={0.2}
//         thickness={3}
//         color="#FFC736"
//         areaChart
//         startFillColor="#FFC736"
//         endFillColor="#12111A"
//         startOpacity={0.8}
//         endOpacity={0.01}

//         // --- COMPLETELY HIDE INTERNAL GRID ELEMENTS ---
//         hideRules
//         hideYAxisText
//         yAxisThickness={0}
//         xAxisThickness={0}

//         // --- FIXED LABEL STYLING ---
//         xAxisLabelTextStyle={styles.xAxisLabel}
//         xAxisLabelsVerticalShift={10}

//         // --- THE PERFECTED POINTER CONFIG ---
//         pointerConfig={{
//           pointerColor: '#FFC736',
//           radius: 5,
//           persistPointer: true,
//           initialPointerIndex: 2, // Highlight Tuesday on mount

//           // Custom vertical dashed line strip parameters
//           pointerStripColor: '#FFC736',
//           pointerStripWidth: 1.5,
//           strokeDashArray: [4, 4],

//           // ⚠️ FIXES THE EMPTY CONTAINER BOX BUG:
//           // We define exact dimensions for the label box so the library accommodates your view bounds.
//           pointerLabelWidth: 80,
//           pointerLabelHeight: 40,
//           pointerStripHeight: 45,
//           // pointerLabelHeightInXaxis: 45, // Moves the label context vertical offset point safely upward

//           pointerLabelComponent: (items: any) => {
//             if (!items || items.length === 0) return null;

//             return (
//               <View style={styles.tooltipContainer}>
//                 <View style={styles.tooltipWrapper}>
//                   <View style={styles.redDot} />
//                   {/* Dynamic binding to get your backend's aggregated transaction sums */}
//                   <Text style={styles.tooltipText}>-{items[0].value}</Text>
//                 </View>
//               </View>
//             );
//           },
//         }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#12111A',
//     width: SCREEN_WIDTH,
//     paddingTop: 50,
//     paddingBottom: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   xAxisLabel: {
//     color: '#7C7B84',
//     fontSize: 12,
//     fontWeight: '500',
//     textAlign: 'center',
//   },
//   tooltipContainer: {
//     backgroundColor: '#221614',
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderWidth: 1,
//     borderColor: '#3D201A',
//     width: 80, // Matches pointerLabelWidth precisely
//     alignItems: 'center',
//     justifyContent: 'center',
//     // Slight offset to reposition away from overlapping with your finger touch radius
//     transform: [{ translateY: -15 }],
//   },
//   tooltipWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   redDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: '#FF3B30',
//     marginRight: 6,
//   },
//   tooltipText: {
//     color: '#FFC736',
//     fontWeight: '700',
//     fontSize: 13,
//   },
// });

// import React from 'react';
// import { StyleSheet, View, Text, Dimensions } from 'react-native';
// import { LineChart } from 'react-native-gifted-charts';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// const backendResponse = {
//   chartData: [
//     { index: 1, label: 'Sun', value: 300 },
//     { index: 2, label: 'Mon', value: 700 },
//     { index: 3, label: 'Tue', value: 450 },
//     { index: 4, label: 'Wed', value: 400 },
//     { index: 5, label: 'Thu', value: 995 },
//     { index: 6, label: 'Fri', value: 650 },
//     { index: 7, label: 'Sat', value: 850 },
//   ],
// };

// export default function CustomInsightChart() {
//   const chartData = backendResponse.chartData.map((item) => ({
//     value: item.value,
//     label: item.label,
//   }));

//   return (
//     <View style={styles.container}>
//       <LineChart
//         data={chartData}

//         // --- TRUE FULL WIDTH (Forces zero margins on sides) ---
//         width={SCREEN_WIDTH}       // Full width
//         adjustToWidth={true}       // Stretches layout smoothly
//         initialSpacing={0}         // Snaps Sun right to the edge
//         endSpacing={20}            // Adds a safe buffer ONLY for Saturday so it doesn't cut off

//         // --- STYLING & AREA VISUALS ---
//         curved
//         curvature={0.2}
//         thickness={3}
//         color="#FFC736"
//         areaChart
//         startFillColor="#FFC736"
//         endFillColor="#12111A"
//         startOpacity={0.8}
//         endOpacity={0.01}

//         // --- REMOVE NATIVE AXIS EMBEDDED LEFT PADDING ---
//         hideRules
//         hideYAxisText
//         yAxisThickness={0}
//         xAxisThickness={0}

//         // --- LABEL FIX FOR EDGE CUTOFF ---
//         xAxisLabelTextStyle={styles.xAxisLabel}
//         xAxisLabelsVerticalShift={10}

//         // --- THE PERFECTED POINTER CONFIG ---
//         pointerConfig={{
//           pointerColor: '#FFC736',
//           radius: 5,
//           persistPointer: true,
//           initialPointerIndex: 2,

//           // Dotted Indicator Line Properties
//           pointerStripColor: '#FFC736',
//           pointerStripWidth: 1.5,
//           strokeDashArray: [4, 4],

//           // Tooltip container sizing definitions
//           pointerLabelWidth: 80,
//           pointerLabelHeight: 40,
//           pointerStripHeight: 45,

//           // ⚠️ THE ULTIMATE FIXES TO CLEAR RED/YELLOW DOTS:
//           // Forcing these styles to transparent stops the library from drawing its fallback layout items!
//           pointerComponent: () => <View style={{ backgroundColor: 'transparent' }} />,
//           // secondaryPointerComponent: () => <View style={{ backgroundColor: 'transparent' }} />,

//           pointerLabelComponent: (items: any) => {
//             if (!items || items.length === 0) return null;

//             return (
//               <View style={styles.tooltipContainer}>
//                 <View style={styles.tooltipWrapper}>
//                   {/* Your custom styled red dot from the picture */}
//                   <View style={styles.redDot} />
//                   <Text style={styles.tooltipText}>-{items[0].value}</Text>
//                 </View>
//               </View>
//             );
//           },
//         }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#12111A',
//     width: SCREEN_WIDTH,
//     paddingTop: 50,
//     paddingBottom: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   xAxisLabel: {
//     color: '#7C7B84',
//     fontSize: 12,
//     fontWeight: '500',
//     textAlign: 'center',
//   },
//   tooltipContainer: {
//     backgroundColor: '#221614',
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderWidth: 1,
//     borderColor: '#3D201A',
//     width: 80,
//     alignItems: 'center',
//     justifyContent: 'center',
//     transform: [{ translateY: -15 }],
//   },
//   tooltipWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   redDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: '#FF3B30',
//     marginRight: 6,
//   },
//   tooltipText: {
//     color: '#FFC736',
//     fontWeight: '700',
//     fontSize: 13,
//   },
// });

import AppText from '@components/Text';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  StyleProp,
  ViewStyle,
  InteractionManager,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { colors } from '../../../theme/colors';
import { ChartData } from '../../../types/insight';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// const backendResponse = {
//   chartData: [
//     { index: 1, label: 'Sun', value: 300 },
//     { index: 2, label: 'Mon', value: 700 },
//     { index: 3, label: 'Tue', value: 450 },
//     { index: 4, label: 'Wed', value: 400 },
//     { index: 5, label: 'Thu', value: 995 },
//     { index: 6, label: 'Fri', value: 650 },
//     { index: 7, label: 'Sat', value: 850 },
//   ],
// };

type Props = {
  chartData: ChartData[];
  style?: StyleProp<ViewStyle>;
};

export default function CustomInsightChart({ chartData, style }: Props) {
  const initialFocusIndex = useMemo(() => {
    const index = chartData.findIndex(item => item.isCurrent);

    return index !== -1 ? index : 0;
  }, [chartData]);

  const [selectedIndex, setSelectedIndex] = useState<number>(initialFocusIndex);

  useEffect(() => {
    setSelectedIndex(initialFocusIndex);
  }, [initialFocusIndex]);

  // useEffect(() => {
  //   setTimeout(() => updateLabelStyles(initialFocusIndex), 100);
  // }, [initialFocusIndex]);

  // 1. Maintain a reference tracking system for text objects
  // const labelRefs = useRef<any[]>([]);

  // 2. Build our helper styling action
  // const updateLabelStyles = (activeIndex: number) => {
  //   chartData.forEach((_, idx) => {
  //     const labelInstance = labelRefs.current[idx];
  //     if (labelInstance) {
  //       // Direct, synchronous property updates bypass the library's internal cache limits
  //       labelInstance.setNativeProps({
  //         style: [
  //           styles.xAxisLabel,
  //           idx === activeIndex && {
  //             color: '#FFC736',    // Changes font color to yellow
  //             fontWeight: 'bold',  // Changes font weight to bold
  //           }
  //         ]
  //       });
  //     }
  //   });
  // };

  // Dynamically calculate a max value buffer to prevent the tooltip from clipping at the top
  const chartMaxBuffer = useMemo(() => {
    if (!chartData || chartData.length === 0) return 100;
    const highestValue = Math.max(...chartData.map(d => d.value));
    // Adds a 25% height safety buffer above the highest peak
    return highestValue > 0 ? highestValue * 1.25 : 100;
  }, [chartData]);

  const chartDataDisplay = useMemo(() => {
    return chartData.map((item, index) => {
      const isSelected = selectedIndex === index;
      // labelRefs.current = []; // Clear old references on rebuild

      return {
        value: item.value,
        focused: isSelected,
        labelComponent: () => {
          //   let edgeStyle = {};
          // if (index === 0) {
          //   // Push Monday slightly to the right so it doesn't clip on the left wall
          //   edgeStyle = { alignItems: 'flex-start', paddingLeft: 10 };
          // } else if (index === chartData.length - 1) {
          //   // Pull Sunday slightly to the left so it doesn't clip on the right wall
          //   edgeStyle = { alignItems: 'flex-end', paddingRight: 10 };
          // }

          return (
            <TouchableOpacity
              style={[styles.xAxisLabelWrapper]}
              onPress={() => {
                console.log(`Pressed Chart Item: ${JSON.stringify(item)}`);
                console.log(
                  `Pressed Chart Item Index: ${JSON.stringify(index)}`,
                );

                setSelectedIndex(index);
              }}
            >
              <Text
                // ref={(el) => {
                //   labelRefs.current[index] = el
                // }}
                style={[
                  styles.xAxisLabel,
                  // The library updates item.focused dynamically when clicked
                  isSelected && {
                    color: '#FFC736', // Highlight yellow
                    fontWeight: 'bold', // Highlight bold
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
            // <View style={{ alignItems: 'center', width: 30 }}>

            // </View>
          );
        },
      };
    });
  }, [chartData, selectedIndex]);

  // const chartData = backendResponse.chartData.map((item, index) => ({
  //   value: item.value,
  //   label: item.label,
  //   // dataIndex: index
  // }));

  return (
    <View style={[styles.container, style]}>
      <LineChart
        key={`insight-chart`}
        // key={`static-insight-chart`}
        isAnimated // Animation
        animationDuration={1000}
        animateOnDataChange
        onDataChangeAnimationDuration={300}

        maxValue={chartMaxBuffer}

        data={chartDataDisplay}
        width={SCREEN_WIDTH - (16 * 2)} // Full width
        height={200}
        adjustToWidth={true} // Stretches layout smoothly
        initialSpacing={10} // Snaps Sun right to the edge
        endSpacing={10} // Adds a safe buffer ONLY for Saturday so it doesn't cut off
        // spacing={5}

        curved
        curvature={0.2}
        thickness={3}
        color="#FFC736"
        areaChart
        startFillColor="#FFC736"
        endFillColor="#12111A"
        startOpacity={0.8}
        endOpacity={0.01}
        hideRules
        hideYAxisText

        yAxisThickness={1} // 0
        xAxisThickness={1} // 0

        // --- LABEL FIX FOR EDGE CUTOFF ---
        xAxisLabelTextStyle={styles.xAxisLabel}
        xAxisLabelsVerticalShift={0}
        /* Data Point Label */
        showDataPointLabelOnFocus={true}
        // dataPointsWidth={10}
        // dataPointsHeight={10}
        // dataPointLabelWidth={50}
        // showDataPointLabelOnFocus
        focusedDataPointIndex={selectedIndex}
        focusEnabled={true}
        dataPointLabelShiftY={-10}
        unFocusOnPressOut={false}
        focusedDataPointLabelComponent={(item: any, index: number) => {
          return (
            <View style={styles.dataPointLabelContainer}>
              <AppText style={styles.dataPointLabel} numberOfLines={1}>{item.value}</AppText>
            </View>
          );
        }}
        // onPress={(item: any, index: number) => {
        //   console.log(`Pressed Chart Item: ${JSON.stringify(item)}`);
        //   console.log(`Pressed Chart Item Index: ${JSON.stringify(index)}`);
        //   // chartDataDisplay.forEach((d: any) => (d.focused = false));
        //   // if (chartDataDisplay[index]) {
        //   //   chartDataDisplay[index].focused = true;
        //   // }
        //   setSelectedIndex(index);
        //   // updateLabelStyles(index);
        // }}
        /* Strip */
        showStripOnFocus={true}
        stripColor={colors.white}
        stripWidth={2}

        // pointerConfig={{
        //   pointerStripUptoDataPoint: true,
        //   pointerStripColor: 'rgba(235, 87, 87, 0.5)', // Red dashed color indicator
        //   pointerStripWidth: 1.5,
        //   strokeDashArray: [4, 4], // Creates the perfect vertical dash look
        //   pointerColor: '#FFC736',
        //   // pointerRadius: 4,
        //   activatePointersOnLongPress: false,
        //   // autoDelay: 0,
        //   // hidePointer: false,
        // }}
        onFocus={(item: any, index: number) => {
          setSelectedIndex(index);
        }}
        // pointerConfig={{
        //   strokeDashArray: [4, 4],
        //   onPointerEnter: (item: any, index: number) => {
        //     setSelectedIndex(index);
        //   },
        //   onTouchStart: (item: any, index: number) => {
        //     setSelectedIndex(index);
        //   },
        //   onTouchEnd: (item: any, index: number) => {
        //     setSelectedIndex(index);
        //   }
        // }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // width: SCREEN_WIDTH - (16 * 2),
    paddingHorizontal: 16,
  },
  // xAxisLabelWrapper: {
  //   width: 40, // Gives a safe target box footprint
  //   alignItems: 'center', // Vertically stacks center under the line point
  //   marginLeft: -20, // Anchors the exact center of text component directly to node coordinates
  //   marginTop: 12,
  // },
  xAxisLabelWrapper: {
    // width: (SCREEN_WIDTH - 40) / 7,
    // alignItems: 'center',
    // justifyContent: 'center',
    marginTop: 0,
  },
  xAxisLabel: {
    color: '#7C7B84',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  dataPointLabelContainer: {
    backgroundColor: '#221614',
    width: 60,
    height: 40,

    borderRadius: 12,
    // paddingVertical: 5,
    // paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataPointLabel: {
    color: colors.yellow,
    fontSize: 12,
  },
});