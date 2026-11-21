import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { ClipPath, Defs, Image as SvgImage, Rect } from 'react-native-svg';

export const professorClock = require('../../assets/cards/professor/studies/clock-face.png');
export const professorPost = require('../../assets/cards/professor/studies/post-underpaint-v1.png');
export const professorSheet = require('../../assets/cards/professor/studies/botanical-sheet-v1.png');
export const professorCurtain = require('../../assets/cards/professor/studies/curtain-v1.png');

// The clock and its hand live inside the cabin's parallax transform. The hand
// has a fixed centre in both resting and animated states.
export function ProfessorClock({ phase, onLoad, onError }: { phase: SharedValue<number>; onLoad: (name: string) => void; onError: () => void }) {
  const hand = useAnimatedStyle(() => ({ transform: [{ rotate: `${phase.value * 360}deg` }] }));
  return <View pointerEvents="none" style={styles.clock}>
    <Image source={professorClock} style={{ width: '100%', height: '100%' }} resizeMode="stretch" onLoad={() => onLoad('professor-clock')} onError={onError} />
    <Animated.View style={[styles.handPivot, hand]}><View style={styles.hand} /></Animated.View>
  </View>;
}

export function ProfessorCurtain({ phase, onLoad, onError }: { phase: SharedValue<number>; onLoad: (name: string) => void; onError: () => void }) {
  const sway = useAnimatedStyle(() => ({ transform: [{ skewX: `${phase.value * 5}deg` }] }));
  return <Animated.View pointerEvents="none" style={[styles.curtain, sway]}>
    <Image source={professorCurtain} style={styles.fill} resizeMode="stretch" onLoad={() => onLoad('professor-curtain')} onError={onError} />
  </Animated.View>;
}

export function ProfessorFieldPost({ phase, onLoad, onError }: { phase: SharedValue<number>; onLoad: (name: string) => void; onError: () => void }) {
  const paper = useAnimatedStyle(() => ({ transform: [{ rotate: `${phase.value * 6}deg` }] }));
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <Svg width="100%" height="100%" viewBox="0 0 1024 1536" preserveAspectRatio="none">
      <Defs><ClipPath id={`professorPost${uid}`}><Rect x="820" y="0" width="204" height="1536" /></ClipPath></Defs>
      <SvgImage href={professorPost} x="0" y="0" width="1024" height="1536" preserveAspectRatio="none" clipPath={`url(#professorPost${uid})`} onLoad={() => onLoad('professor-post')} />
    </Svg>
    <Animated.View style={[StyleSheet.absoluteFill, styles.sheet, paper]}><Image source={professorSheet} style={styles.fill} resizeMode="stretch" onLoad={() => onLoad('professor-sheet')} onError={onError} /></Animated.View>
  </View>;
}


const styles = StyleSheet.create({
  clock: { position: 'absolute', left: '68%', top: '17.3%', width: '17%', height: '11.33%' },
  handPivot: { position: 'absolute', left: '18%', top: '18%', width: '64%', height: '64%' },
  hand: { position: 'absolute', left: '48%', top: 0, width: '4%', height: '50%', backgroundColor: '#392719' },
  curtain: { position: 'absolute', left: '9%', top: '17%', width: '24%', height: '31%', transformOrigin: 'top left' },
  sheet: { transformOrigin: '88% 26%' },
  fill: { width: '100%', height: '100%' },
});

