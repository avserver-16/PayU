/**
 * TimelineBarChart.jsx
 * React Native component — 5-bar timeline chart
 *
 * Dependencies:
 *   expo-linear-gradient   →  expo install expo-linear-gradient
 *   OR
 *   react-native-linear-gradient  →  npm install react-native-linear-gradient
 *
 * Swap the import below depending on your setup:
 *   Expo:       import { LinearGradient } from 'expo-linear-gradient';
 *   Bare RN:    import LinearGradient from 'react-native-linear-gradient';
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // ← swap if needed

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Configurable defaults ────────────────────────────────────────────────────
const BAR_COUNT = 5;
const CHART_HEIGHT = 100;
const BAR_RADIUS = 8;
const ANIMATION_DURATION = 800;
const ANIMATION_STAGGER = 120;

// Gradient stops for the filled bar (bottom → top)
const GRADIENT_COLORS = ['#F6D2B3', '#3FB9A2'];
const GRADIENT_START = { x: 0, y: 1 };
const GRADIENT_END = { x: 0, y: 0 };

// ─── Default dataset ──────────────────────────────────────────────────────────
const DEFAULT_DATA = [
  { label: '1', value: 65, max: 100 },
  { label: '2', value: 82, max: 100 },
  { label: '3', value: 45, max: 100 },
  { label: '4', value: 91, max: 100 },
  { label: '5', value: 58, max: 100 },
];


// ─── Single animated bar ──────────────────────────────────────────────────────
const Bar = ({ item, barWidth, delay, chartHeight }: { item: any; barWidth: number; delay: number; chartHeight: number }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      delay,
      useNativeDriver: false, // height animation requires false
    }).start();
  }, []);

  const ratio = Math.min(Math.max(item.value / item.max, 0), 1);

  const fillHeight = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, chartHeight * ratio],
  });

  return (
    <View style={[styles.barColumn, { width: barWidth }]}>
      {/* Value label */}
      <Text style={styles.valueLabel}>{item.value}</Text>

      {/* Track (gray background up to max) */}
      <View
        style={[
          styles.track,
          { height: chartHeight, borderRadius: BAR_RADIUS },
        ]}
      >
        {/* Animated fill */}
        <Animated.View
          style={[
            styles.fillWrapper,
            {
              height: fillHeight,
              borderRadius: BAR_RADIUS,
              overflow: 'hidden',
            },
          ]}
        >
          <LinearGradient
            colors={GRADIENT_COLORS as [string, string, ...string[]]}
            start={GRADIENT_START}
            end={GRADIENT_END}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>

      {/* Time label */}
      <Text style={styles.timeLabel}>{item.label}</Text>
    </View>
  );
};

// ─── Main chart component ─────────────────────────────────────────────────────
const TimelineBarChart = ({
  data = DEFAULT_DATA,
  title = 'Weekly Overview',
  subtitle = 'Activity this week',
  containerStyle = {},
  chartHeight = CHART_HEIGHT,
  gradientColors = GRADIENT_COLORS,
}) => {
  const containerPadding = 48;
  const gapBetweenBars = 48;
  const availableWidth = SCREEN_WIDTH - containerPadding * 1.5;
  const barWidth =
    (availableWidth - gapBetweenBars * (BAR_COUNT - 1)) / BAR_COUNT;

  return (
    <View style={[styles.container, containerStyle]}>

      {/* Chart area */}
      <View style={[styles.chartRow, { gap: gapBetweenBars }]}>
        {data.slice(0, BAR_COUNT).map((item, index) => (
          <Bar
            key={item.label ?? index}
            item={item}
            barWidth={barWidth}
            delay={index * ANIMATION_STAGGER}
            chartHeight={chartHeight}
          />
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#262626' }]} />
          <Text style={styles.legendText}>Max capacity(100)</Text>
        </View>
        <View style={styles.legendItem}>
          <LinearGradient
            colors={gradientColors as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.legendDot, { borderRadius: 4 }]}
          />
          <Text style={styles.legendText}>Actual value</Text>
        </View>
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#13131F',
    borderRadius: 24,
    // padding: 24,
    // marginHorizontal: 16,
    alignItems: 'center',
    marginTop:24
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: '#F0EEFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: '#6B6B8A',
    fontSize: 13,
    marginTop: 4,
    letterSpacing: 0.2,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  barColumn: {
    alignItems: 'center',
  },
  valueLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    marginBottom: 12,
  },
  track: {
    width: '100%',
    backgroundColor: '#2C2C3E',
    justifyContent: 'flex-end', // fill rises from bottom
    overflow: 'hidden',
  },
  fillWrapper: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  timeLabel: {
    color: '#6B6B8A',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1E1E2E',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  legendText: {
    color: '#6B6B8A',
    fontSize: 12,
  },
});

export default TimelineBarChart;