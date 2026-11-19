import React, { useEffect, useState } from 'react';
import { AppState, Image, ImageSourcePropType, Platform, StyleSheet, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

const NativeMask = MaskedView as unknown as React.ComponentType<React.ComponentProps<typeof View> & { maskElement: React.ReactElement }>;

// Registered to the existing 1024 x 1536 background. Only the interior of the
// painted waterfall moves; the feather blends it back into its still rest pose.
// Overlapping feathered ellipses trace the waterfall's broad upper flow and
// narrowing lower stream. The same SVG mask is used on web and native.
const mainCascades = [
  { cx: 851, cy: 420, rx: 80, ry: 135 },
  { cx: 821, cy: 525, rx: 86, ry: 160 },
  { cx: 799, cy: 625, rx: 82, ry: 145 },
  { cx: 730, cy: 590, rx: 48, ry: 110 },
  { cx: 735, cy: 782, rx: 93, ry: 82 },
];
const lowerCascades = [
  { cx: 714, cy: 867, rx: 17, ry: 78 },
  { cx: 746, cy: 871, rx: 17, ry: 72 },
  { cx: 780, cy: 875, rx: 23, ry: 80 },
];
const waterfallMaskSvg = (cascades: typeof mainCascades) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1536" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="w"><stop offset="0" stop-color="white"/><stop offset=".38" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient></defs>${cascades.map(({cx, cy, rx, ry}) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#w)"/>`).join('')}</svg>`;
function WaterMask({ children, cascades, id }: { children: React.ReactNode; cascades: typeof mainCascades; id: string }) {
  if (Platform.OS === 'web') {
    const mask = `url("data:image/svg+xml,${encodeURIComponent(waterfallMaskSvg(cascades))}")`;
    return React.createElement('div', {
      'aria-hidden': true,
      style: { position: 'absolute', inset: 0, pointerEvents: 'none', maskImage: mask, maskSize: '100% 100%', maskRepeat: 'no-repeat', WebkitMaskImage: mask, WebkitMaskSize: '100% 100%', WebkitMaskRepeat: 'no-repeat' },
    }, children);
  }
  return <NativeMask pointerEvents="none" style={StyleSheet.absoluteFill} maskElement={
    <Svg width="100%" height="100%" viewBox="0 0 1024 1536" preserveAspectRatio="xMidYMid slice">
      <Defs><RadialGradient id={id} cx="50%" cy="50%" r="50%"><Stop offset="0" stopColor="white" /><Stop offset=".38" stopColor="white" /><Stop offset="1" stopColor="white" stopOpacity="0" /></RadialGradient></Defs>
      {cascades.map(({ cx, cy, rx, ry }, index) => <Ellipse key={index} cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id})`} />)}
    </Svg>
  }>{children}</NativeMask>;
}

export function TarzanWaterfall({ source, width, active, onError }: { source: ImageSourcePropType; width: number; active: boolean; onError: () => void }) {
  const [foreground, setForeground] = useState(AppState.currentState !== 'background' && AppState.currentState !== 'inactive');
  const phase = useSharedValue(0);
  useEffect(() => {
    const listener = AppState.addEventListener('change', state => setForeground(state === 'active'));
    return () => listener.remove();
  }, []);
  const running = active && foreground;
  useEffect(() => {
    if (running) phase.value = withRepeat(withTiming(1, { duration: 5000, easing: Easing.linear }), -1, false);
    else { cancelAnimation(phase); phase.value = 0; }
    return () => { cancelAnimation(phase); };
  }, [running, phase]);
  // The lower pass is always opaque. It wraps only when the upper pass fully
  // covers it; the upper pass wraps only when its own opacity is zero. Keeping
  // total coverage constant avoids exposing the still background at handoff.
  const below = useAnimatedStyle(() => ({ transform: [{ translateY: (phase.value - .5) * width * .18 }] }));
  const above = useAnimatedStyle(() => ({ opacity: Math.cos(Math.PI * phase.value) ** 2, transform: [{ translateY: (((phase.value + .5) % 1) - .5) * width * .18 }] }));
  // The more distant, shorter falls need a smaller displacement to keep their
  // sources and mist anchored while still moving continuously.
  const smallBelow = useAnimatedStyle(() => ({ transform: [{ translateY: (phase.value - .5) * width * .06 }] }));
  const smallAbove = useAnimatedStyle(() => ({ opacity: Math.cos(Math.PI * phase.value) ** 2, transform: [{ translateY: (((phase.value + .5) % 1) - .5) * width * .06 }] }));
  if (!running) return null;
  return <>
    <WaterMask cascades={mainCascades} id="tarzanMainWaterMask">
      <Animated.View testID="tarzan-waterfall-lower" style={[StyleSheet.absoluteFill, below]}><Image source={source} resizeMode="cover" style={styles.image} onError={onError} /></Animated.View>
      <Animated.View testID="tarzan-waterfall-upper" style={[StyleSheet.absoluteFill, above]}><Image source={source} resizeMode="cover" style={styles.image} onError={onError} /></Animated.View>
    </WaterMask>
    <WaterMask cascades={lowerCascades} id="tarzanLowerWaterMask">
      <Animated.View testID="tarzan-waterfall-small-lower" style={[StyleSheet.absoluteFill, smallBelow]}><Image source={source} resizeMode="cover" style={styles.image} onError={onError} /></Animated.View>
      <Animated.View testID="tarzan-waterfall-small-upper" style={[StyleSheet.absoluteFill, smallAbove]}><Image source={source} resizeMode="cover" style={styles.image} onError={onError} /></Animated.View>
    </WaterMask>
  </>;
}
const styles = StyleSheet.create({ image: { width: '100%', height: '100%' } });
