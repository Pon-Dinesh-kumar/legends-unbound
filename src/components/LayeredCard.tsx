import React, { useEffect, useState } from 'react';
import { AppState, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, SharedValue, useAnimatedStyle, useDerivedValue, useReducedMotion, useSharedValue, cancelAnimation, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { Card } from '../types/card';
import { CardDetails, CardFrame, EvolutionBadge, FrameSparkles, FrameStatCorners } from './CardFrame';
import { sherlockScarfBase, sherlockScarfFrames } from '../data/sherlockScarf';
import { draculaCapeBase, draculaCapeFrames } from '../data/draculaCape';
import { Evolution, evolutionPolicy } from '../data/evolutions';
import { FrameInterior } from './FrameInterior';
import { TarzanWaterfall } from './TarzanWaterfall';
import { TarzanCharacter } from './TarzanCharacter';
import { SherlockLens } from './SherlockLens';
import { JaneScarf } from './JaneScarf';

const limit = (n: number) => { 'worklet'; return Math.max(-1, Math.min(1, n)); };
const twinkle = (phase: number, center: number) => { 'worklet'; const t = Math.max(0, 1 - Math.abs(phase - center) / .065); return t * t * (3 - 2 * t); };
const ScarfMask = MaskedView as unknown as React.ComponentType<React.ComponentProps<typeof View> & { maskElement: React.ReactElement }>;
export function LayeredCard({ card, width, tiltX, tiltY, selected, level, onLoad, onError }: { card: Card; width: number; tiltX: SharedValue<number>; tiltY: SharedValue<number>; selected: boolean; level: Evolution; onLoad: (layer: string) => void; onError: () => void }) {
  const [isBack, setIsBack] = useState(false);
  const [appForeground, setAppForeground] = useState(AppState.currentState !== 'background' && AppState.currentState !== 'inactive');
  const reducedMotion = useReducedMotion();
  const { frameBreak } = evolutionPolicy[level];
  const motionEnabled = evolutionPolicy[level].motion && !reducedMotion;
  const frameMotionEnabled = !reducedMotion;
  const tiltEnabled = !reducedMotion;
  const turn = useSharedValue(0);
  const dragX = useSharedValue(0), dragY = useSharedValue(0), shimmer = useSharedValue(0);
  const scarfPhase = useSharedValue(0), tarzanClothPhase = useSharedValue(0), lensPhase = useSharedValue(0);
  const janeScarfPhase = useSharedValue(0), janeHairPhase = useSharedValue(0);
  const breath = useSharedValue(0), sparklePhase = useSharedValue(0), gemPhase = useSharedValue(0), reveal = useSharedValue(0);
  useEffect(() => {
    if (selected && frameMotionEnabled && !isBack) {
      breath.value = withRepeat(withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.sin) }), -1, true);
      sparklePhase.value = 0;
      sparklePhase.value = withRepeat(withTiming(1, { duration: 11000, easing: Easing.linear }), -1, false);
      gemPhase.value = 0;
      gemPhase.value = withRepeat(withTiming(1, { duration: 7500, easing: Easing.linear }), -1, false);
      reveal.value = withSequence(withTiming(1, { duration: 220, easing: Easing.out(Easing.quad) }), withTiming(0, { duration: 1600, easing: Easing.out(Easing.cubic) }));
    } else {
      cancelAnimation(breath); cancelAnimation(sparklePhase); cancelAnimation(gemPhase); cancelAnimation(reveal);
      breath.value = 0; sparklePhase.value = 0; gemPhase.value = 0; reveal.value = 0;
    }
    return () => { cancelAnimation(breath); cancelAnimation(sparklePhase); cancelAnimation(gemPhase); cancelAnimation(reveal); };
  }, [selected, frameMotionEnabled, isBack, card.id, level, breath, sparklePhase, gemPhase, reveal]);
  useEffect(() => {
    if (selected && frameMotionEnabled) shimmer.value = withRepeat(withTiming(1, { duration: 5500, easing: Easing.inOut(Easing.sin) }), -1, true);
    else { cancelAnimation(shimmer); shimmer.value = 0; }
    return () => { cancelAnimation(shimmer); };
  }, [selected, frameMotionEnabled, shimmer]);
  useEffect(() => {
    if ((card.id === 'sherlock' || card.id === 'dracula') && selected && !isBack && motionEnabled) {
      scarfPhase.value = withRepeat(withTiming(2, { duration: 5000, easing: Easing.inOut(Easing.sin) }), -1, true);
    } else {
      cancelAnimation(scarfPhase);
      scarfPhase.value = 0;
    }
    return () => { cancelAnimation(scarfPhase); };
  }, [card.id, selected, isBack, motionEnabled, scarfPhase]);
  useEffect(() => {
    if (card.id !== 'tarzan' && card.id !== 'sherlock' && card.id !== 'jane') return;
    const listener = AppState.addEventListener('change', state => setAppForeground(state === 'active'));
    return () => listener.remove();
  }, [card.id]);
  useEffect(() => {
    if (card.id === 'tarzan' && selected && !isBack && motionEnabled && appForeground) {
      tarzanClothPhase.value = withRepeat(withTiming(Math.PI * 2, { duration: 6000, easing: Easing.linear }), -1, false);
    } else {
      cancelAnimation(tarzanClothPhase);
      tarzanClothPhase.value = 0;
    }
    return () => { cancelAnimation(tarzanClothPhase); };
  }, [card.id, selected, isBack, motionEnabled, appForeground, tarzanClothPhase]);
  useEffect(() => {
    if ((card.id === 'sherlock' || card.id === 'jane') && selected && !isBack && motionEnabled && appForeground) {
      lensPhase.value = withRepeat(withTiming(1, { duration: card.id === 'jane' ? 4500 : 5000, easing: Easing.inOut(Easing.sin) }), -1, true);
    } else {
      cancelAnimation(lensPhase);
      lensPhase.value = 0;
    }
    return () => { cancelAnimation(lensPhase); };
  }, [card.id, selected, isBack, motionEnabled, appForeground, lensPhase]);
  useEffect(() => {
    if (card.id === 'jane' && selected && !isBack && motionEnabled && appForeground) {
      janeScarfPhase.value = withRepeat(withTiming(Math.PI * 2, { duration: 5700, easing: Easing.linear }), -1, false);
    } else { cancelAnimation(janeScarfPhase); janeScarfPhase.value = 0; }
    return () => { cancelAnimation(janeScarfPhase); };
  }, [card.id, selected, isBack, motionEnabled, appForeground, janeScarfPhase]);
  useEffect(() => {
    if (card.id === 'jane' && selected && !isBack && motionEnabled && appForeground) {
      janeHairPhase.value = withRepeat(withTiming(Math.PI * 2, { duration: 6800, easing: Easing.linear }), -1, false);
    } else { cancelAnimation(janeHairPhase); janeHairPhase.value = 0; }
    return () => { cancelAnimation(janeHairPhase); };
  }, [card.id, selected, isBack, motionEnabled, appForeground, janeHairPhase]);
  useEffect(() => { dragX.value = 0; dragY.value = 0; }, [level, reducedMotion, dragX, dragY]);
  const pan = Gesture.Pan().enabled(tiltEnabled).onUpdate(e => {
    dragX.value = limit(e.translationX / (width * .20));
    dragY.value = limit(e.translationY / (width * .28));
  }).onFinalize(() => {
    dragX.value = withSpring(0, { damping: 20, stiffness: 140 });
    dragY.value = withSpring(0, { damping: 20, stiffness: 140 });
  });
  const flipCard = () => {
    const target = isBack ? 0 : 180;
    turn.value = motionEnabled ? withSpring(target, { damping: 20, stiffness: 115 }) : target;
    setIsBack(!isBack);
  };
  const cardTiltHorizontal = useDerivedValue(() => tiltEnabled ? limit(tiltX.value * .75 + dragX.value * .8) : 0);
  const tiltHorizontal = useDerivedValue(() => motionEnabled ? cardTiltHorizontal.value : 0);
  const tiltVertical = useDerivedValue(() => motionEnabled ? limit(tiltY.value * .75 + dragY.value * .8) : 0);
  const rotationX = useDerivedValue(() => -tiltVertical.value * 15);
  const rotationY = useDerivedValue(() => turn.value + cardTiltHorizontal.value * (motionEnabled ? 17 : 15));
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ perspective: 2400 }, { rotateX: `${rotationX.value}deg` }, { rotateY: `${rotationY.value}deg` }] }));
  const frontVisibility = useAnimatedStyle(() => ({ opacity: Math.cos(rotationY.value * Math.PI / 180) >= 0 ? 1 : 0 }));
  const backVisibility = useAnimatedStyle(() => ({ opacity: Math.cos(rotationY.value * Math.PI / 180) < 0 ? 1 : 0 }));
  const backStyle = useAnimatedStyle(() => ({ transform: [{ scale: motionEnabled ? 1.16 : 1.08 }, { translateX: -tiltHorizontal.value * 12 }, { translateY: -tiltVertical.value * 10 }] }));
  const heroStyle = useAnimatedStyle(() => ({ transform: [{ translateX: tiltHorizontal.value * 16 }, { translateY: tiltVertical.value * 13 }, { scale: frameBreak ? 1.08 : 1 }] }));
  const frontStyle = useAnimatedStyle(() => ({ transform: [{ translateX: tiltHorizontal.value * 26 }, { translateY: tiltVertical.value * 22 }, { scale: motionEnabled ? 1.16 : 1.08 }] }));
  const titleStyle = useAnimatedStyle(() => ({ transform: [{ translateX: tiltHorizontal.value * 7 }, { translateY: tiltVertical.value * 5 }] }));
  const cardHeight = width * 1.5;
  const scarfFrame1 = useAnimatedStyle(() => ({ opacity: Math.min(1, scarfPhase.value) }));
  const scarfFrame2 = useAnimatedStyle(() => ({ opacity: Math.max(0, scarfPhase.value - 1) }));
  const scarfWave = useAnimatedStyle(() => ({ transform: [{ translateY: -cardHeight * .035 }, { rotate: `${Math.sin(scarfPhase.value * Math.PI) * 1.5}deg` }] }));
  const capeWave = useAnimatedStyle(() => ({ transform: [{ rotate: `${Math.sin(scarfPhase.value * Math.PI) * 1.2}deg` }] }));
  const edgeSweepStyle = useAnimatedStyle(() => ({ opacity: (card.rarity === 'EPIC' ? .48 : .68) + breath.value * .22 + reveal.value * .1, transform: [{ translateY: ((card.rarity === 'EPIC' ? 1 - shimmer.value : shimmer.value) * 1.42 - .34) * cardHeight }] }));
  const topSweepStyle = useAnimatedStyle(() => ({ opacity: (card.rarity === 'EPIC' ? .48 : .68) + breath.value * .22 + reveal.value * .1, transform: [{ translateX: ((card.rarity === 'EPIC' ? 1 - shimmer.value : shimmer.value) * .92 - .4) * width }] }));
  const badgeGlowStyle = useAnimatedStyle(() => ({ opacity: .12 + breath.value * .6 + reveal.value * .25 }));
  const sparkle1 = useAnimatedStyle(() => { const a = Math.max(twinkle(sparklePhase.value, .14), reveal.value * .95); return { opacity: a, transform: [{ scale: .55 + a * .65 }] }; });
  const sparkle2 = useAnimatedStyle(() => { const a = Math.max(twinkle(sparklePhase.value, .37), reveal.value * .85); return { opacity: a, transform: [{ scale: .55 + a * .65 }] }; });
  const sparkle3 = useAnimatedStyle(() => { const a = Math.max(twinkle(sparklePhase.value, .63), reveal.value * .85); return { opacity: a, transform: [{ scale: .55 + a * .65 }] }; });
  const sparkle4 = useAnimatedStyle(() => { const a = Math.max(twinkle(sparklePhase.value, .85), reveal.value * .95); return { opacity: a, transform: [{ scale: .55 + a * .65 }] }; });
  const titleShineStyle = useAnimatedStyle(() => ({ transform: [{ translateX: (shimmer.value * 1.6 - .46 + tiltHorizontal.value * .2) * width }, { rotate: '25deg' }] }));
  const shineStyle = useAnimatedStyle(() => ({ opacity: .18 + Math.abs(tiltHorizontal.value) * .13 + reveal.value * .15, transform: [{ translateX: (shimmer.value * 1.6 - .55 + tiltHorizontal.value * .2) * width }, { rotate: '25deg' }] }));
  // Keep the idle sweep independent so a held tilt creates a stable, responsive highlight.
  const interactiveStrength = useDerivedValue(() => Math.min(1, Math.sqrt(tiltHorizontal.value ** 2 + tiltVertical.value ** 2) * 1.25));
  const interactiveShineStyle = useAnimatedStyle(() => ({ opacity: interactiveStrength.value * .42, transform: [{ translateX: (.32 + tiltHorizontal.value * .38 + tiltVertical.value * .08) * width }, { translateY: tiltVertical.value * cardHeight * .12 }, { rotate: `${25 + tiltVertical.value * 8}deg` }] }));
  const interactiveTitleShineStyle = useAnimatedStyle(() => ({ opacity: interactiveStrength.value * .8, transform: [{ translateX: (.36 + tiltHorizontal.value * .42 + tiltVertical.value * .1) * width }, { rotate: `${25 + tiltVertical.value * 8}deg` }] }));
  const scarfLayers = <Animated.View style={[StyleSheet.absoluteFill, { transformOrigin: [(width + 14) * .5, (cardHeight + 7) * .38, 0] }, scarfWave]}>
    <Image source={sherlockScarfFrames[0]} resizeMode="contain" style={styles.scarf} onLoad={() => onLoad('scarf-0')} onError={onError} />
    <Animated.View style={[StyleSheet.absoluteFill, scarfFrame1]}><Image source={sherlockScarfFrames[1]} resizeMode="contain" style={styles.image} onLoad={() => onLoad('scarf-1')} onError={onError} /></Animated.View>
    <Animated.View style={[StyleSheet.absoluteFill, scarfFrame2]}><Image source={sherlockScarfFrames[2]} resizeMode="contain" style={styles.image} onLoad={() => onLoad('scarf-2')} onError={onError} /></Animated.View>
  </Animated.View>;
  // The lower copy is clipped to the bottom quarter. Jane's hair, scarf and
  // compass are all above that clip even at tilt extremes, so only the upper
  // copy needs their SVG rig. Revisit this if Jane gains motion in the lower art.
  const renderHero = (left: number, top: number, heroWidth = width + 14, heroHeight = cardHeight + 7, showUpperDetails = true) => <Animated.View style={[{ position: 'absolute', left, top, width: heroWidth, height: heroHeight }, heroStyle]}>
    {card.id === 'dracula' && <Animated.View style={[StyleSheet.absoluteFill, { transformOrigin: [(width + 14) * .25, (cardHeight + 7) * .33, 0] }, capeWave]}>
      <Image source={draculaCapeFrames[0]} resizeMode="contain" style={styles.scarf} onLoad={() => onLoad('cape-0')} onError={onError} />
      <Animated.View style={[StyleSheet.absoluteFill, scarfFrame1]}><Image source={draculaCapeFrames[1]} resizeMode="contain" style={styles.image} onLoad={() => onLoad('cape-1')} onError={onError} /></Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, scarfFrame2]}><Image source={draculaCapeFrames[2]} resizeMode="contain" style={styles.image} onLoad={() => onLoad('cape-2')} onError={onError} /></Animated.View>
    </Animated.View>}
    {card.id === 'tarzan' ? <TarzanCharacter source={card.character} phase={tarzanClothPhase} onLoad={() => onLoad('character')} onError={onError} /> : card.id === 'jane' && showUpperDetails ? <JaneScarf source={card.character} phase={janeScarfPhase} hairPhase={janeHairPhase} active={motionEnabled && selected && !isBack && appForeground} onLoad={() => onLoad('character')} onError={onError} /> : <Image source={card.id === 'sherlock' ? sherlockScarfBase : card.id === 'dracula' ? draculaCapeBase : card.character} style={styles.image} resizeMode="contain" onLoad={() => onLoad('character')} onError={onError} />}
    {card.id === 'sherlock' && showUpperDetails && motionEnabled && selected && !isBack && appForeground && <SherlockLens width={heroWidth} height={heroHeight} phase={lensPhase} />}
    {card.id === 'jane' && showUpperDetails && motionEnabled && selected && !isBack && appForeground && <SherlockLens width={heroWidth} height={heroHeight} phase={lensPhase} bounds={[124, 530, 185, 175]} subtleBoost />}
    {card.id === 'sherlock' && (Platform.OS === 'web' ? React.createElement('div', {
      'aria-hidden': true,
      style: { position: 'absolute', inset: 0, pointerEvents: 'none', maskImage: 'linear-gradient(to right, transparent 43%, black 51%)', WebkitMaskImage: 'linear-gradient(to right, transparent 43%, black 51%)' },
    }, scarfLayers) : <ScarfMask style={StyleSheet.absoluteFill} maskElement={<LinearGradient colors={['transparent', 'transparent', '#fff', '#fff']} locations={[0, .43, .51, 1]} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill} />}>{scarfLayers}</ScarfMask>)}
  </Animated.View>;
  return <View style={styles.inspector}><GestureDetector gesture={pan}><View style={{ width, height: width * 1.5 }}>
    <Animated.View accessible accessibilityLabel={`${card.name}, ${evolutionPolicy[level].label}, level ${level === 'origin' ? 1 : level === 'awakened' ? 2 : 3} of 3, ${isBack ? 'card back' : 'card front'}.${tiltEnabled ? ' Drag to tilt.' : ''}`} style={[{ width, height: width * 1.5 }, cardStyle]}>
    <Animated.View pointerEvents="none" style={[styles.face, frontVisibility]}>
    <FrameInterior>
        <View style={[styles.artWindow, { backgroundColor: card.glow }]}><Animated.View style={[StyleSheet.absoluteFill, backStyle]}><Image source={card.background} style={styles.image} resizeMode="cover" onLoad={() => onLoad('background')} onError={onError} />{card.id === 'tarzan' && <TarzanWaterfall source={card.background} width={width} active={motionEnabled && selected && !isBack} onError={onError} />}</Animated.View></View>
        <View pointerEvents="none" style={styles.artWindow}><Animated.View style={[styles.overlay, frontStyle]}><Image source={card.foreground} style={styles.image} resizeMode="stretch" onLoad={() => onLoad('foreground')} onError={onError} /><View style={[StyleSheet.absoluteFill, { opacity: .8 }]}><Image source={card.effects} style={styles.image} resizeMode="stretch" onLoad={() => onLoad('effects')} onError={onError} /></View></Animated.View></View>
        {motionEnabled && <View pointerEvents="none" style={styles.lightClip}><Animated.View testID="background-idle-shine" style={[styles.shine, shineStyle]}><LinearGradient colors={['transparent', '#fff7d4aa', 'transparent']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill} /></Animated.View><Animated.View testID="background-tilt-shine" style={[styles.shine, interactiveShineStyle]}><LinearGradient colors={['transparent', '#fff7d4bb', 'transparent']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill} /></Animated.View></View>}
        {frameBreak ? <View pointerEvents="none" style={[styles.lowerHeroClip, { top: cardHeight * .75 }]}>{renderHero(-7, -cardHeight * .75 - 7, width + 14, cardHeight + 7, false)}</View> : <View pointerEvents="none" style={styles.artWindow}>{renderHero(8, cardHeight * .075, width - 26, cardHeight * .89)}</View>}
    </FrameInterior>
    <CardFrame rarity={card.rarity} onLoad={onLoad} onError={onError} animated={frameMotionEnabled && selected && !isBack} edgeSweepStyle={edgeSweepStyle} topSweepStyle={topSweepStyle} />
    {card.rarity !== 'EPIC' && frameMotionEnabled && selected && !isBack && <FrameSparkles rarity={card.rarity} width={width} sparkleStyles={[sparkle1, sparkle2, sparkle3, sparkle4]} />}
    {frameBreak && <View pointerEvents="none" style={[styles.heroClip, { bottom: cardHeight * .25 }]}>{renderHero(53, 53)}</View>}
    <FrameStatCorners width={width} rarity={card.rarity} />
    <CardDetails card={card} width={width} titleStyle={titleStyle} titleShineStyle={titleShineStyle} interactiveTitleShineStyle={interactiveTitleShineStyle} insideFrame={!frameBreak} animated={motionEnabled} onLoad={onLoad} onError={onError} />
    <EvolutionBadge rarity={card.rarity} level={level} animated={frameMotionEnabled && selected && !isBack} glowStyle={badgeGlowStyle} gemPhase={gemPhase} width={width} onLoad={onLoad} onError={onError} />
    </Animated.View>
    <Animated.View pointerEvents="none" style={[styles.face, styles.backFace, backVisibility]}>
      <Image source={require('../../assets/cards/shared/back-sherlock.png')} style={styles.image} resizeMode="cover" onLoad={() => onLoad('back')} onError={onError} />
      <View style={styles.backRim} />
      {motionEnabled && <View style={styles.lightClip}><Animated.View style={[styles.shine, shineStyle]}><LinearGradient colors={['transparent', '#fff7d488', 'transparent']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill} /></Animated.View></View>}
    </Animated.View>
  </Animated.View></View></GestureDetector>
  <Pressable accessibilityRole="button" accessibilityLabel={isBack ? 'Show card front' : 'Show card back'} onPress={flipCard} style={styles.turnButton}>
    <Text style={styles.turnText}>↻  {isBack ? 'SHOW FRONT' : 'FLIP CARD'}</Text>
  </Pressable></View>;
}
const styles = StyleSheet.create({
  inspector: { alignItems: 'center' },
  face: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  backFace: { transform: [{ rotateY: '180deg' }], borderRadius: 20, overflow: 'hidden', backgroundColor: '#101b25' },
  backRim: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: 20, borderWidth: 2, borderColor: '#d5b677' },
  turnButton: { paddingVertical: 10, paddingHorizontal: 20, marginTop: 7 },
  turnText: { color: '#d6c39e', fontSize: 10, fontWeight: '700', letterSpacing: 1.8 },
  artWindow: { position: 'absolute', top: 5, right: 5, bottom: 5, left: 5, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  scarf: { position: 'absolute', width: '100%', height: '100%' },
  heroClip: { position: 'absolute', left: -60, right: -60, top: -60, overflow: 'hidden' },
  lowerHeroClip: { position: 'absolute', left: 0, right: 0, bottom: 0, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden' },
  overlay: { position: 'absolute', left: -10, right: -10, top: -10, bottom: -5 },
  lightClip: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: 28, overflow: 'hidden' },
  shine: { position: 'absolute', width: '35%', height: '160%', top: '-30%' },
});





























