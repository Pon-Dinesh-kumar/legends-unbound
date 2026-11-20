import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

// Motion studies are retained as distinct, shared-cacheable assets; these are
// provisional until the composition and loops pass the player review.
export const laWheel = require('../../assets/cards/la/studies/sun-wheel.png');
export const laFlame = require('../../assets/cards/la/studies/flame-sheet.png');
export const laPendant = require('../../assets/cards/la/studies/pendant.png');

type Layers = { onLoad: (name: string) => void; onError: () => void };

export function LaEnvironment({ wheel, fire, width, onLoad, onError }: Layers & { wheel: SharedValue<number>; fire: SharedValue<number>; width: number }) {
  const side = (width - 10) * .18;
  const wheelStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${wheel.value * 360}deg` }] }));
  const fireStyle = useAnimatedStyle(() => {
    const frame = Math.floor(fire.value) % 8;
    return { transform: [{ translateX: -(frame % 4) * side }, { translateY: -Math.floor(frame / 4) * side }] };
  });
  return <>
    <Animated.View testID="la-sun-wheel" style={[styles.wheel, wheelStyle]}><Image source={laWheel} resizeMode="contain" style={styles.fill} onLoad={() => onLoad('la-wheel')} onError={onError} /></Animated.View>
    <View style={[styles.fireWindow, { width: side, height: side }]}><Animated.View testID="la-sacred-flame" style={[{ position: 'absolute', width: side * 4, height: side * 2 }, fireStyle]}><Image source={laFlame} resizeMode="stretch" style={styles.fill} onLoad={() => onLoad('la-flame')} onError={onError} /></Animated.View></View>
  </>;
}

export function LaPendant({ phase, onLoad, onError }: Layers & { phase: SharedValue<number> }) {
  const motion = useAnimatedStyle(() => ({ transform: [{ rotate: `${phase.value * 6}deg` }] }));
  return <Animated.View testID="la-pendant" style={[styles.pendant, motion]}><Image source={laPendant} resizeMode="contain" style={styles.fill} onLoad={() => onLoad('la-pendant')} onError={onError} /></Animated.View>;
}

const styles = StyleSheet.create({
  fill: { width: '100%', height: '100%' },
  wheel: { position: 'absolute', left: '0%', top: '4.7%', width: '54%', height: '36%' },
  fireWindow: { position: 'absolute', left: '79%', top: '41%', overflow: 'hidden' },
  // Keep the suspended ornament above the forearm and anchor it at the collar.
  pendant: { position: 'absolute', left: '47.5%', top: '21.5%', width: '10%', height: '10%', transformOrigin: '50% 7%' },
});
