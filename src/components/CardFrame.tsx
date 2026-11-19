import React from 'react';
import { Image, Platform, StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Asset } from 'expo-asset';
import MaskedView from '@react-native-masked-view/masked-view';
import Svg, { Circle, ClipPath, Defs, Image as SvgImage, Path, RadialGradient, Stop } from 'react-native-svg';
import { Card } from '../types/card';
import { Evolution, evolutions } from '../data/evolutions';

const TitleMask = MaskedView as unknown as React.ComponentType<React.ComponentProps<typeof View> & { maskElement: React.ReactElement }>;
const frameAsset = require('../../assets/cards/shared/frame-legendary-v6.png');
const activeGemAsset = require('../../assets/cards/shared/evolution-gem-active-v1.png');

type FrameMotionStyle = StyleProp<AnimatedStyle<ViewStyle>>;

function FrameShine({ shineStyle, pulseStyle, edgeSweepStyle, topSweepStyle }: { shineStyle: FrameMotionStyle; pulseStyle: FrameMotionStyle; edgeSweepStyle: FrameMotionStyle; topSweepStyle: FrameMotionStyle }) {
  const frameUri = Platform.OS === 'web' ? Asset.fromModule(frameAsset).uri : undefined;
  const shine = <Animated.View style={[styles.frameShine, shineStyle]}><LinearGradient colors={['transparent', '#fff1b3b0', 'transparent']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill} /></Animated.View>;
  const effects = <><Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#ffe09a' }, pulseStyle]} />{shine}<Animated.View style={[styles.edgeSweep, edgeSweepStyle]}><LinearGradient colors={['transparent', '#ffb72cbb', '#fffde8ff', '#ffb72cbb', 'transparent']} locations={[0, .3, .5, .7, 1]} style={StyleSheet.absoluteFill} /></Animated.View><View style={styles.topSweepClip}><Animated.View style={[styles.topSweep, topSweepStyle]}><LinearGradient colors={['transparent', '#ffc64baa', '#fffef2ff', '#ffc64baa', 'transparent']} locations={[0, .3, .5, .7, 1]} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill} /></Animated.View></View></>;
  return Platform.OS === 'web' ? React.createElement('div', {
    'aria-hidden': true,
    style: { position: 'absolute', inset: 0, pointerEvents: 'none', maskImage: `url("${frameUri}")`, maskSize: '100% 100%', maskRepeat: 'no-repeat', WebkitMaskImage: `url("${frameUri}")`, WebkitMaskSize: '100% 100%', WebkitMaskRepeat: 'no-repeat' },
  }, effects) : <TitleMask style={StyleSheet.absoluteFill} maskElement={<Image source={frameAsset} resizeMode="stretch" style={styles.nameImage} />}>{effects}</TitleMask>;
}

export function CardFrame({ onLoad, onError, animated, shineStyle, pulseStyle, edgeSweepStyle, topSweepStyle }: { onLoad: (layer: string) => void; onError: () => void; animated: boolean; shineStyle: FrameMotionStyle; pulseStyle: FrameMotionStyle; edgeSweepStyle: FrameMotionStyle; topSweepStyle: FrameMotionStyle }) {
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <Image source={frameAsset} resizeMode="stretch" style={styles.frameImage} onLoad={() => onLoad('frame')} onError={onError} />
    {animated && <View style={styles.frameImage}><FrameShine shineStyle={shineStyle} pulseStyle={pulseStyle} edgeSweepStyle={edgeSweepStyle} topSweepStyle={topSweepStyle} /></View>}
  </View>;
}

// Redraw only the integrated stat corners over the frame-breaking character.
export function FrameStatCorners({ width }: { width: number }) {
  const height = width * 1.5;
  const cropWidth = width * .27;
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    {[false, true].map(right => {
      const placement = { position: 'absolute' as const, width: width * 1.02, height: height * 1.02, top: -height * .01, left: right ? -width * .74 : -width * .01 };
      return <View key={String(right)} style={[styles.cornerClip, { width: cropWidth, height: height * .205 }, right ? { right: 0 } : { left: 0 }]}>
        <Image source={frameAsset} resizeMode="stretch" style={placement} />
      </View>;
    })}
  </View>;
}

// Small vector glints sit on the metal itself, without rectangular shadow layers.
export function FrameSparkles({ width, sparkleStyles }: { width: number; sparkleStyles: StyleProp<AnimatedStyle<ViewStyle>>[] }) {
  const size = Math.max(12, Math.min(21, width * .06));
  const points = [[.32, .035], [.68, .035], [.075, .925], [.925, .925]];
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    {points.map(([x, y], index) => <Animated.View key={index} style={[{ position: 'absolute', left: width * x - size / 2, top: width * 1.5 * y - size / 2, width: size, height: size }, sparkleStyles[index]]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100">
        <Path d="M50 0 Q56 42 100 50 Q56 56 50 100 Q44 56 0 50 Q44 44 50 0 Z" fill="#ffd564" />
        <Path d="M50 17 Q54 45 83 50 Q54 54 50 83 Q46 54 17 50 Q46 46 50 17 Z" fill="#fffbea" />
      </Svg>
    </Animated.View>)}
  </View>;
}

const crystalPulse = (phase: number, index: number, offset: number) => {
  'worklet';
  const cycle = (phase - index * .17 - offset + 2) % 1;
  const t = Math.max(0, 1 - Math.abs(cycle - .1) / .1);
  return t * t * (3 - 2 * t);
};

function CrystalTwinkle({ gradientId }: { gradientId: string }) {
  return <Svg width="100%" height="100%" viewBox="0 0 100 100">
    <Defs><RadialGradient id={gradientId} cx="50%" cy="50%" r="50%"><Stop offset="0" stopColor="#fffbd7" stopOpacity=".85" /><Stop offset=".42" stopColor="#ffdc74" stopOpacity=".35" /><Stop offset="1" stopColor="#ffc346" stopOpacity="0" /></RadialGradient></Defs>
    <Circle cx="50" cy="50" r="50" fill={`url(#${gradientId})`} />
    <Path d="M50 1 C54 34 56 44 99 50 C56 56 54 66 50 99 C46 66 44 56 1 50 C44 44 46 34 50 1 Z" fill="#fff9da" />
    <Path d="M50 20 L53 47 L80 50 L53 53 L50 80 L47 53 L20 50 L47 47 Z" fill="#ffffff" />
    <Path d="M29 29 L44 45 M56 55 L71 71 M71 29 L56 45 M44 55 L29 71" stroke="#fff3bd" strokeWidth="1.5" opacity=".9" />
  </Svg>;
}

function GemShine({ side, index, phase }: { side: number; index: number; phase: SharedValue<number> }) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const sweep = useAnimatedStyle(() => {
    const p = phase.value * 1.7 - index * .25;
    const visible = p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0;
    return { opacity: visible * .85, transform: [{ translateX: (p * 1.65 - .42) * side }, { rotate: '22deg' }] };
  });
  const glint = useAnimatedStyle(() => {
    const p = phase.value * 1.7 - index * .25;
    const t = Math.max(0, 1 - Math.abs(p - .5) / .18);
    const a = t * t * (3 - 2 * t);
    return { opacity: a * .95, transform: [{ scale: .65 + a * .35 }] };
  });
  const twinkleA = useAnimatedStyle(() => {
    const a = crystalPulse(phase.value, index, .06);
    return { opacity: a, transform: [{ scale: .55 + a * .5 }] };
  });
  const twinkleB = useAnimatedStyle(() => {
    const a = crystalPulse(phase.value, index, .51);
    return { opacity: a, transform: [{ scale: .55 + a * .5 }] };
  });
  const content = <>
    <Animated.View testID={`gem-shine-${index}`} style={[styles.gemSweep, sweep]}>
      <LinearGradient colors={['transparent', '#fff3be88', '#fffef4ee', '#fff3be88', 'transparent']} locations={[0, .3, .5, .7, 1]} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill} />
    </Animated.View>
    <Animated.View style={[styles.gemGlint, glint]}><Svg width="100%" height="100%" viewBox="0 0 100 100"><Path d="M50 0 Q56 43 100 50 Q56 56 50 100 Q44 56 0 50 Q44 44 50 0 Z" fill="#fffbea" /></Svg></Animated.View>
    <Animated.View testID={`gem-twinkle-${index}-a`} style={[styles.crystalTwinkleA, twinkleA]}><CrystalTwinkle gradientId={`crystal${uid}a`} /></Animated.View>
    <Animated.View testID={`gem-twinkle-${index}-b`} style={[styles.crystalTwinkleB, twinkleB]}><CrystalTwinkle gradientId={`crystal${uid}b`} /></Animated.View>
  </>;
  return Platform.OS === 'web' ? React.createElement('div', {
    'aria-hidden': true,
    style: { position: 'absolute', inset: 0, pointerEvents: 'none', clipPath: 'polygon(50% 6%, 94% 50%, 50% 94%, 6% 50%)' },
  }, content) : <TitleMask style={StyleSheet.absoluteFill} maskElement={<Svg width="100%" height="100%" viewBox="0 0 100 100"><Path d="M50 6 L94 50 L50 94 L6 50 Z" fill="#fff" /></Svg>}>{content}</TitleMask>;
}

export function EvolutionBadge({ level, animated, glowStyle, gemPhase, width, onLoad, onError }: { level: Evolution; animated: boolean; glowStyle: StyleProp<AnimatedStyle<ViewStyle>>; gemPhase: SharedValue<number>; width: number; onLoad: (layer: string) => void; onError: () => void }) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const filled = evolutions.indexOf(level) + 1;
  const side = width * .105;
  const centers = [419 / 1024, 512 / 1024, 608 / 1024];
  const top = width * 1.5 * (1.02 * (1475 / 1536) - .01) - side / 2;
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    {evolutions.map((item, index) => {
      const left = width * (1.02 * centers[index] - .01) - side / 2;
      const clipId = `socket${uid}${index}`;
      return <View key={item} style={[styles.diamondMount, { width: side, height: side, left, top }]}>
        {index < filled ? <>
          <Image source={activeGemAsset} resizeMode="contain" style={styles.nameImage} onLoad={() => onLoad('gem')} onError={onError} />
          {animated && <Animated.View style={[StyleSheet.absoluteFill, glowStyle]}><Svg width="100%" height="100%" viewBox="0 0 100 100"><Path d="M50 12 L87 49 L50 49 Z" fill="#fffef0" opacity=".9" /><Path d="M13 51 L50 51 L50 87 Z" fill="#ffdd75" opacity=".65" /><Path d="M50 20 L53 45 L78 50 L53 54 L50 80 L47 54 L22 50 L47 45 Z" fill="#fffdf0" opacity=".8" /></Svg></Animated.View>}
          {animated && <GemShine side={side} index={index} phase={gemPhase} />}
        </> : <Svg width="100%" height="100%" viewBox="0 0 100 100">
          <Defs><ClipPath id={clipId}><Path d="M50 3 L97 50 L50 97 L3 50 Z" /></ClipPath></Defs>
          <SvgImage href={frameAsset} x={(-width * .01 - left) / side * 100} y={(-width * 1.5 * .01 - top) / side * 100} width={width * 1.02 / side * 100} height={width * 1.5 * 1.02 / side * 100} preserveAspectRatio="none" clipPath={`url(#${clipId})`} />
        </Svg>}
      </View>;
    })}
  </View>;
}

export function CardDetails({ card, width, titleStyle, titleShineStyle, insideFrame, animated, onLoad, onError }: { card: Card; width: number; titleStyle: StyleProp<AnimatedStyle<ViewStyle>>; titleShineStyle: StyleProp<AnimatedStyle<ViewStyle>>; insideFrame: boolean; animated: boolean; onLoad: (layer: string) => void; onError: () => void }) {
  const titleUri = Platform.OS === 'web' ? Asset.fromModule(card.titleImage).uri : undefined;
  const shine = <Animated.View style={[styles.titleShine, titleShineStyle]}><LinearGradient colors={['transparent', '#fff5d6bb', 'transparent']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill} /></Animated.View>;
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <Animated.View style={[styles.nameArt, insideFrame && styles.nameArtInside, titleStyle]}>
      <Image source={card.titleImage} resizeMode="contain" style={styles.nameImage} onLoad={() => onLoad('title')} onError={onError} />
      {animated && (Platform.OS === 'web' ? React.createElement('div', {
        'aria-hidden': true,
        style: { position: 'absolute', inset: 0, pointerEvents: 'none', maskImage: `url("${titleUri}")`, maskSize: 'contain', maskPosition: 'center', maskRepeat: 'no-repeat', WebkitMaskImage: `url("${titleUri}")`, WebkitMaskSize: 'contain', WebkitMaskPosition: 'center', WebkitMaskRepeat: 'no-repeat' },
      }, shine) : <TitleMask style={StyleSheet.absoluteFill} maskElement={<Image source={card.titleImage} resizeMode="contain" style={styles.nameImage} />}>{shine}</TitleMask>)}
    </Animated.View>
    {[{ value: card.energy, x: 155 / 1024 }, { value: card.power, x: 869 / 1024 }].map(({ value, x }) => {
      const size = width * .15;
      return <View key={x} style={[styles.statValue, { width: size, height: size, left: width * (1.02 * x - .01) - size / 2, top: width * 1.5 * (1.02 * (155 / 1536) - .01) - size / 2 }]}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.statText, { fontSize: width * (value >= 100 ? .065 : value >= 10 ? .083 : .105) }]}>{value}</Text>
      </View>;
    })}
  </View>;
}

const styles = StyleSheet.create({
  frameImage: { position: 'absolute', top: '-1%', left: '-1%', width: '102%', height: '102%' },
  cornerClip: { position: 'absolute', top: 0, overflow: 'hidden' },
  frameShine: { position: 'absolute', width: '35%', height: '160%', top: '-30%' },
  edgeSweep: { position: 'absolute', left: 0, width: '100%', height: '25%', top: 0 },
  topSweepClip: { position: 'absolute', top: 0, left: '27%', width: '46%', height: '13%', overflow: 'hidden' },
  topSweep: { position: 'absolute', top: 0, left: 0, width: '65%', height: '100%' },
  diamondMount: { position: 'absolute' },
  gemSweep: { position: 'absolute', top: '-30%', left: 0, width: '32%', height: '160%' },
  gemGlint: { position: 'absolute', top: '17%', left: '33%', width: '34%', height: '34%' },
  crystalTwinkleA: { position: 'absolute', top: '8%', left: '25%', width: '50%', height: '50%' },
  crystalTwinkleB: { position: 'absolute', top: '35%', left: '43%', width: '42%', height: '42%' },
  statValue: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  statText: { color: '#fffdf7', fontFamily: 'serif', fontWeight: '700', includeFontPadding: false, textShadowColor: '#151018', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  nameArt: { position: 'absolute', width: '118%', height: '30%', bottom: '-2%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' },
  nameArtInside: { width: '94%', height: '25%', bottom: '1%' },
  nameImage: { width: '100%', height: '100%' },
  titleShine: { position: 'absolute', width: '30%', height: '200%', top: '-50%' },
});



