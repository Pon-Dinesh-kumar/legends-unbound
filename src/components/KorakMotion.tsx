import React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

export const korakRope = require('../../assets/cards/korak/studies/rope.png');
export const korakRain = require('../../assets/cards/korak/studies/rain-bright.png');
export const korakLightning = require('../../assets/cards/korak/studies/lightning.png');
type Layers = { onLoad: (name: string) => void; onError: () => void };
const NativeMask = MaskedView as unknown as React.ComponentType<React.ComponentProps<typeof View> & { maskElement: React.ReactElement }>;

function RainMask({ children }: { children: React.ReactNode }) {
  if (Platform.OS === 'web') return React.createElement('div', { style: { position: 'absolute', inset: 0, pointerEvents: 'none', maskImage: 'linear-gradient(to bottom, transparent, white 18%, white 82%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, white 18%, white 82%, transparent)' } }, children);
  return <NativeMask style={StyleSheet.absoluteFill} maskElement={<LinearGradient colors={['transparent', '#fff', '#fff', 'transparent']} locations={[0, .18, .82, 1]} style={StyleSheet.absoluteFill} />}>{children}</NativeMask>;
}

function RainTiles({ onLoad, onError, report }: Layers & { report: boolean }) {
  return <View style={styles.fill}>{[0, 1, 2, 3].map(index => <Image key={index} source={korakRain} resizeMode="stretch" style={[styles.rainTile, { left: index % 2 ? '50%' : '0%', top: index >= 2 ? '50%' : '0%' }]} onLoad={report && index === 0 ? () => onLoad('korak-rain') : undefined} onError={onError} />)}</View>;
}

export function KorakEnvironment({ rain, lightning, width, onLoad, onError }: Layers & { rain: SharedValue<number>; lightning: SharedValue<number>; width: number }) {
  const boltHeight = (width - 10) * 1.5 * .34;
  const windowHeight = (width - 10) * 1.5 * .72;
  // Rain is transparent, unlike the opaque waterfall. Both passes must fade
  // out at their own wrap; an opaque lower pass exposes its jump through the
  // transparent upper pass. Complementary weights keep coverage steady.
  const under = useAnimatedStyle(() => ({ opacity: Math.sin(Math.PI * rain.value) ** 2, transform: [{ translateY: (rain.value - .5) * windowHeight * .3 }] }));
  const over = useAnimatedStyle(() => ({ opacity: Math.cos(Math.PI * rain.value) ** 2, transform: [{ translateY: (((rain.value + .5) % 1) - .5) * windowHeight * .3 }] }));
  // A faint fixed channel is present at rest. In Unbound a brighter copy grows
  // down that same channel and fades, instead of spawning unrelated bolts.
  const boltReveal = useAnimatedStyle(() => ({ height: boltHeight * Math.min(1, lightning.value), opacity: lightning.value <= 1 ? Math.min(1, lightning.value * 4) : Math.max(0, 2 - lightning.value) }));
  return <>
    <View pointerEvents="none" style={styles.rainWindow}><RainMask><Animated.View testID="korak-rain-under" style={[styles.rainImage, under]}><RainTiles onLoad={onLoad} onError={onError} report /></Animated.View><Animated.View testID="korak-rain-over" style={[styles.rainImage, over]}><RainTiles onLoad={onLoad} onError={onError} report={false} /></Animated.View></RainMask></View>
    <View pointerEvents="none" style={[styles.bolt, { height: boltHeight }]}><Image source={korakLightning} resizeMode="stretch" style={[styles.fill, { opacity: .2 }]} onLoad={() => onLoad('korak-lightning')} onError={onError} /><Animated.View testID="korak-lightning" style={[styles.boltReveal, boltReveal]}><Image source={korakLightning} resizeMode="stretch" style={{ width: '100%', height: boltHeight }} onError={onError} /></Animated.View></View>
  </>;
}

export function KorakRope({ phase, onLoad, onError }: Layers & { phase: SharedValue<number> }) {
  const motion = useAnimatedStyle(() => ({ transform: [{ rotate: `${phase.value * 7}deg` }] }));
  return <Animated.View testID="korak-rope" style={[styles.rope, motion]}><Image source={korakRope} resizeMode="contain" style={styles.fill} onLoad={() => onLoad('korak-rope')} onError={onError} /></Animated.View>;
}

const styles = StyleSheet.create({
  fill: { width: '100%', height: '100%' },
  rainWindow: { position: 'absolute', left: '7%', right: '7%', top: '8%', bottom: '20%', opacity: .22, overflow: 'hidden' },
  rainImage: { position: 'absolute', top: '-20%', left: 0, width: '100%', height: '140%' },
  rainTile: { position: 'absolute', width: '50%', height: '50%' },
  bolt: { position: 'absolute', left: '58%', top: '13%', width: '30%' },
  boltReveal: { position: 'absolute', left: 0, top: 0, width: '100%', overflow: 'hidden' },
  rope: { position: 'absolute', left: '66%', top: '62%', width: '18%', height: '18%', transformOrigin: '50% 2%' },
});
