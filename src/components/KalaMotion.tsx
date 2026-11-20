import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, { SharedValue, useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { ClipPath, Defs, Ellipse, G, Image as SvgImage } from 'react-native-svg';

export const kalaLeaves = require('../../assets/cards/kala/canopy-leaves.png');
export const kalaMist = require('../../assets/cards/kala/mist.png');
export const kalaBlinkClosed = require('../../assets/cards/kala/blink-closed.png');
const AnimatedGroup = Animated.createAnimatedComponent(G);

// The layers are present at rest in every evolution. Only Unbound drives them.
export function KalaEnvironment({ leafPhase, mistPhase, onLoad, onError }: { leafPhase: SharedValue<number>; mistPhase: SharedValue<number>; onLoad: (name: string) => void; onError: () => void }) {
  const leaf = useAnimatedStyle(() => ({ transform: [{ rotate: `${leafPhase.value * 5}deg` }] }));
  const mist = useAnimatedStyle(() => ({ transform: [{ translateX: mistPhase.value * 9 }] }));
  return <>
    <Animated.View testID="kala-mist" style={[styles.mist, mist]}><Image source={kalaMist} resizeMode="stretch" style={styles.image} onLoad={() => onLoad('kala-mist')} onError={onError} /></Animated.View>
    <Animated.View testID="kala-leaves" style={[styles.leaves, leaf]}><Image source={kalaLeaves} resizeMode="contain" style={styles.image} onLoad={() => onLoad('kala-leaves')} onError={onError} /></Animated.View>
  </>;
}

// A brief lid closes over each eye, leaving the surrounding face and pose fixed.
export function KalaBlink({ phase }: { phase: SharedValue<number> }) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const lids = useAnimatedProps(() => ({ opacity: phase.value }));
  return <Svg pointerEvents="none" style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 1024 1536" preserveAspectRatio="xMidYMid meet">
    <Defs><ClipPath id={`kalaEyes${uid}`}><Ellipse cx="663" cy="594" rx="45" ry="31" /><Ellipse cx="752" cy="594" rx="45" ry="31" /></ClipPath></Defs>
    <AnimatedGroup testID="kala-blink" animatedProps={lids}>
      <SvgImage href={kalaBlinkClosed} x="0" y="0" width="1024" height="1536" preserveAspectRatio="none" clipPath={`url(#kalaEyes${uid})`} />
    </AnimatedGroup>
  </Svg>;
}

const styles = StyleSheet.create({
  image: { width: '100%', height: '100%' },
  leaves: { position: 'absolute', left: '-10%', top: '1%', width: '44%', height: '25%', transformOrigin: '28% 12%' },
  mist: { position: 'absolute', left: '16%', top: '30%', width: '72%', height: '15%', opacity: .13 },
});
