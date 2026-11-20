import React from 'react';
import { ImageSourcePropType, StyleSheet } from 'react-native';
import Animated, { SharedValue, useAnimatedProps } from 'react-native-reanimated';
import Svg, { Defs, Ellipse, G, Image as SvgImage, Mask, RadialGradient, Stop } from 'react-native-svg';

const AnimatedGroup = Animated.createAnimatedComponent(G);

// Animate illumination only over the original bright sunset pixels. This keeps
// the upper-left sun as the sole moving light source and leaves the painted
// scenery and the distant right-side shafts untouched.
export function SaborSunrays({ source, phase }: { source: ImageSourcePropType; phase: SharedValue<number> }) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const motion = useAnimatedProps(() => ({ transform: `rotate(${-7 + phase.value * 14} 250 345)` }));
  return <Svg testID="sabor-sunrays" pointerEvents="none" width="100%" height="100%" viewBox="0 0 1024 1536" preserveAspectRatio="xMidYMid slice" style={StyleSheet.absoluteFill}>
    <Defs>
      <RadialGradient id={`saborSunbeam${uid}`} cx="50%" cy="50%" rx="50%" ry="50%">
        <Stop offset="0" stopColor="#ffe6a0" stopOpacity=".32" />
        <Stop offset=".48" stopColor="#ffc769" stopOpacity=".12" />
        <Stop offset="1" stopColor="#ffc769" stopOpacity="0" />
      </RadialGradient>
      <Mask id={`saborOriginalLight${uid}`} maskUnits="userSpaceOnUse" x="80" y="170" width="440" height="340" maskType="luminance">
        <SvgImage href={source} x="0" y="0" width="1024" height="1536" preserveAspectRatio="none" />
      </Mask>
    </Defs>
    <G mask={`url(#saborOriginalLight${uid})`}>
      <AnimatedGroup testID="sabor-sunrays-motion" animatedProps={motion}>
        <G fill={`url(#saborSunbeam${uid})`}>
          <Ellipse cx="335" cy="270" rx="145" ry="20" transform="rotate(-28 335 270)" />
          <Ellipse cx="340" cy="340" rx="150" ry="15" />
          <Ellipse cx="330" cy="410" rx="125" ry="18" transform="rotate(28 330 410)" />
        </G>
      </AnimatedGroup>
    </G>
  </Svg>;
}
