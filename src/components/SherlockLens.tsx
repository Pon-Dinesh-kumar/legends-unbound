import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Ellipse } from 'react-native-svg';

const NativeMask = MaskedView as unknown as React.ComponentType<React.ComponentProps<typeof View> & { maskElement: React.ReactElement }>;

// Bounds are registered to the glass inside the painted rim of the existing
// 1024 x 1536 character image; the reflection never moves the lens or hand.
export function SherlockLens({ width, height, phase }: { width: number; height: number; phase: SharedValue<number> }) {
  const scale = Math.min(width / 1024, height / 1536);
  const lensWidth = 142 * scale, lensHeight = 132 * scale;
  const left = (width - 1024 * scale) / 2 + 309 * scale;
  const top = (height - 1536 * scale) / 2 + 432 * scale;
  const reflection = useAnimatedStyle(() => ({
    transform: [{ translateX: (phase.value * 2.15 - .8) * lensWidth }, { rotate: '20deg' }],
  }));
  const glint = <Animated.View testID="sherlock-lens-reflection" style={[{ position: 'absolute', top: -lensHeight * .3, left: 0, width: lensWidth * .3, height: lensHeight * 1.6 }, reflection]}>
    <LinearGradient colors={['transparent', '#d7efff33', '#fff8dfbb', '#d7efff33', 'transparent']} locations={[0, .27, .5, .73, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
  </Animated.View>;
  return <View pointerEvents="none" style={{ position: 'absolute', left, top, width: lensWidth, height: lensHeight }}>
    {Platform.OS === 'web' ? React.createElement('div', {
      'aria-hidden': true,
      style: { position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', pointerEvents: 'none' },
    }, glint) : <NativeMask style={StyleSheet.absoluteFill} maskElement={<Svg width="100%" height="100%" viewBox="0 0 142 132" preserveAspectRatio="none"><Ellipse cx="71" cy="66" rx="71" ry="66" fill="white" /></Svg>}>{glint}</NativeMask>}
  </View>;
}
