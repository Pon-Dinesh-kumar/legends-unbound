import React, { useEffect, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, SharedValue, useAnimatedStyle, useDerivedValue, useReducedMotion, useSharedValue, cancelAnimation, withRepeat, withSpring, withTiming } from 'react-native-reanimated';
import { Card } from '../types/card';
import { CardDetails, CardFrame, EvolutionBadge } from './CardFrame';
import { sherlockScarfBase, sherlockScarfFrames } from '../data/sherlockScarf';
import { draculaCapeBase, draculaCapeFrames } from '../data/draculaCape';
import { Evolution, evolutionPolicy } from '../data/evolutions';
import { FrameInterior } from './FrameInterior';

const limit = (n: number) => { 'worklet'; return Math.max(-1, Math.min(1, n)); };
const ScarfMask = MaskedView as unknown as React.ComponentType<React.ComponentProps<typeof View> & { maskElement: React.ReactElement }>;
export function LayeredCard({ card, width, tiltX, tiltY, selected, level, onLoad, onError }: { card: Card; width: number; tiltX: SharedValue<number>; tiltY: SharedValue<number>; selected: boolean; level: Evolution; onLoad: (layer: string) => void; onError: () => void }) {
  const [isBack, setIsBack] = useState(false);
  const reducedMotion = useReducedMotion();
  const { frameBreak } = evolutionPolicy[level];
  const motionEnabled = evolutionPolicy[level].motion && !reducedMotion;
  const tiltEnabled = !reducedMotion;
  const turn = useSharedValue(0);
  const dragX = useSharedValue(0), dragY = useSharedValue(0), shimmer = useSharedValue(0);
  const scarfPhase = useSharedValue(0);
  useEffect(() => {
    if (selected && motionEnabled) shimmer.value = withRepeat(withTiming(1, { duration: 5500, easing: Easing.inOut(Easing.sin) }), -1, true);
    else { cancelAnimation(shimmer); shimmer.value = 0; }
    return () => { cancelAnimation(shimmer); };
  }, [selected, motionEnabled, shimmer]);
  useEffect(() => {
    if ((card.id === 'sherlock' || card.id === 'dracula') && selected && !isBack && motionEnabled) {
      scarfPhase.value = withRepeat(withTiming(2, { duration: 5000, easing: Easing.inOut(Easing.sin) }), -1, true);
    } else {
      cancelAnimation(scarfPhase);
      scarfPhase.value = 0;
    }
    return () => { cancelAnimation(scarfPhase); };
  }, [card.id, selected, isBack, motionEnabled, scarfPhase]);
  useEffect(() => { dragX.value = 0; dragY.value = 0; }, [level, reducedMotion, dragX, dragY]);
  const pan = Gesture.Pan().enabled(tiltEnabled).onUpdate(e => {
    dragX.value = limit(e.translationX / (width * .35));
    dragY.value = limit(e.translationY / (width * .5));
  }).onFinalize(() => {
    dragX.value = withSpring(0, { damping: 20, stiffness: 140 });
    dragY.value = withSpring(0, { damping: 20, stiffness: 140 });
  });
  const flipCard = () => {
    const target = isBack ? 0 : 180;
    turn.value = motionEnabled ? withSpring(target, { damping: 20, stiffness: 115 }) : target;
    setIsBack(!isBack);
  };
  const cardTiltHorizontal = useDerivedValue(() => tiltEnabled ? limit(tiltX.value * .45 + dragX.value * .7) : 0);
  const tiltHorizontal = useDerivedValue(() => motionEnabled ? cardTiltHorizontal.value : 0);
  const tiltVertical = useDerivedValue(() => motionEnabled ? limit(tiltY.value * .45 + dragY.value * .7) : 0);
  const rotationX = useDerivedValue(() => -tiltVertical.value * 5);
  const rotationY = useDerivedValue(() => turn.value + cardTiltHorizontal.value * (motionEnabled ? 5 : 4));
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ perspective: 2400 }, { rotateX: `${rotationX.value}deg` }, { rotateY: `${rotationY.value}deg` }] }));
  const frontVisibility = useAnimatedStyle(() => ({ opacity: Math.cos(rotationY.value * Math.PI / 180) >= 0 ? 1 : 0 }));
  const backVisibility = useAnimatedStyle(() => ({ opacity: Math.cos(rotationY.value * Math.PI / 180) < 0 ? 1 : 0 }));
  const backStyle = useAnimatedStyle(() => ({ transform: [{ scale: 1.08 }, { translateX: -tiltHorizontal.value * 5 }, { translateY: -tiltVertical.value * 4 }] }));
  const heroStyle = useAnimatedStyle(() => ({ transform: [{ translateX: tiltHorizontal.value * 7 }, { translateY: tiltVertical.value * 6 }, { scale: frameBreak ? 1.08 : 1 }] }));
  const frontStyle = useAnimatedStyle(() => ({ transform: [{ translateX: tiltHorizontal.value * 12 }, { translateY: tiltVertical.value * 10 }, { scale: 1.08 }] }));
  const titleStyle = useAnimatedStyle(() => ({ transform: [{ translateX: tiltHorizontal.value * 3 }, { translateY: tiltVertical.value * 2 }] }));
  const cardHeight = width * 1.5;
  const scarfFrame1 = useAnimatedStyle(() => ({ opacity: Math.min(1, scarfPhase.value) }));
  const scarfFrame2 = useAnimatedStyle(() => ({ opacity: Math.max(0, scarfPhase.value - 1) }));
  const scarfWave = useAnimatedStyle(() => ({ transform: [{ translateY: -cardHeight * .035 }, { rotate: `${Math.sin(scarfPhase.value * Math.PI) * 1.5}deg` }] }));
  const capeWave = useAnimatedStyle(() => ({ transform: [{ rotate: `${Math.sin(scarfPhase.value * Math.PI) * 1.2}deg` }] }));
  const badgeGlowStyle = useAnimatedStyle(() => ({ opacity: .15 + shimmer.value * .55 }));
  const titleShineStyle = useAnimatedStyle(() => ({ transform: [{ translateX: (shimmer.value * 1.6 - .46 + tiltHorizontal.value * .2) * width }, { rotate: '25deg' }] }));
  const shineStyle = useAnimatedStyle(() => ({ opacity: .18 + Math.abs(tiltHorizontal.value) * .13, transform: [{ translateX: (shimmer.value * 1.6 - .55 + tiltHorizontal.value * .2) * width }, { rotate: '25deg' }] }));
  const scarfLayers = <Animated.View style={[StyleSheet.absoluteFill, { transformOrigin: [(width + 14) * .5, (cardHeight + 7) * .38, 0] }, scarfWave]}>
    <Image source={sherlockScarfFrames[0]} resizeMode="contain" style={styles.scarf} onLoad={() => onLoad('scarf-0')} onError={onError} />
    <Animated.View style={[StyleSheet.absoluteFill, scarfFrame1]}><Image source={sherlockScarfFrames[1]} resizeMode="contain" style={styles.image} onLoad={() => onLoad('scarf-1')} onError={onError} /></Animated.View>
    <Animated.View style={[StyleSheet.absoluteFill, scarfFrame2]}><Image source={sherlockScarfFrames[2]} resizeMode="contain" style={styles.image} onLoad={() => onLoad('scarf-2')} onError={onError} /></Animated.View>
  </Animated.View>;
  const renderHero = (left: number, top: number, heroWidth = width + 14, heroHeight = cardHeight + 7) => <Animated.View style={[{ position: 'absolute', left, top, width: heroWidth, height: heroHeight }, heroStyle]}>
    {card.id === 'dracula' && <Animated.View style={[StyleSheet.absoluteFill, { transformOrigin: [(width + 14) * .25, (cardHeight + 7) * .33, 0] }, capeWave]}>
      <Image source={draculaCapeFrames[0]} resizeMode="contain" style={styles.scarf} onLoad={() => onLoad('cape-0')} onError={onError} />
      <Animated.View style={[StyleSheet.absoluteFill, scarfFrame1]}><Image source={draculaCapeFrames[1]} resizeMode="contain" style={styles.image} onLoad={() => onLoad('cape-1')} onError={onError} /></Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, scarfFrame2]}><Image source={draculaCapeFrames[2]} resizeMode="contain" style={styles.image} onLoad={() => onLoad('cape-2')} onError={onError} /></Animated.View>
    </Animated.View>}
    <Image source={card.id === 'sherlock' ? sherlockScarfBase : card.id === 'dracula' ? draculaCapeBase : card.character} style={styles.image} resizeMode="contain" onLoad={() => onLoad('character')} onError={onError} />
    {card.id === 'sherlock' && (Platform.OS === 'web' ? React.createElement('div', {
      'aria-hidden': true,
      style: { position: 'absolute', inset: 0, pointerEvents: 'none', maskImage: 'linear-gradient(to right, transparent 43%, black 51%)', WebkitMaskImage: 'linear-gradient(to right, transparent 43%, black 51%)' },
    }, scarfLayers) : <ScarfMask style={StyleSheet.absoluteFill} maskElement={<LinearGradient colors={['transparent', 'transparent', '#fff', '#fff']} locations={[0, .43, .51, 1]} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill} />}>{scarfLayers}</ScarfMask>)}
  </Animated.View>;
  return <View style={styles.inspector}><GestureDetector gesture={pan}><View style={{ width, height: width * 1.5 }}>
    <Animated.View accessible accessibilityLabel={`${card.name}, ${evolutionPolicy[level].label}, level ${level === 'origin' ? 1 : level === 'awakened' ? 2 : 3} of 3, ${isBack ? 'card back' : 'card front'}.${tiltEnabled ? ' Drag to tilt.' : ''}`} style={[{ width, height: width * 1.5 }, cardStyle]}>
    <Animated.View pointerEvents="none" style={[styles.face, frontVisibility]}>
    <FrameInterior>
        <View style={[styles.artWindow, { backgroundColor: card.glow }]}><Animated.View style={[StyleSheet.absoluteFill, backStyle]}><Image source={card.background} style={styles.image} resizeMode="cover" onLoad={() => onLoad('background')} onError={onError} /></Animated.View></View>
        <View pointerEvents="none" style={styles.artWindow}><Animated.View style={[styles.overlay, frontStyle]}><Image source={card.foreground} style={styles.image} resizeMode="stretch" onLoad={() => onLoad('foreground')} onError={onError} /><View style={[StyleSheet.absoluteFill, { opacity: .8 }]}><Image source={card.effects} style={styles.image} resizeMode="stretch" onLoad={() => onLoad('effects')} onError={onError} /></View></Animated.View></View>
        {motionEnabled && <View pointerEvents="none" style={styles.lightClip}><Animated.View style={[styles.shine, shineStyle]}><LinearGradient colors={['transparent', '#fff7d4aa', 'transparent']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill} /></Animated.View></View>}
        {frameBreak ? <View pointerEvents="none" style={[styles.lowerHeroClip, { top: cardHeight * .75 }]}>{renderHero(-7, -cardHeight * .75 - 7)}</View> : <View pointerEvents="none" style={styles.artWindow}>{renderHero(8, cardHeight * .075, width - 26, cardHeight * .89)}</View>}
    </FrameInterior>
    <CardFrame onLoad={onLoad} onError={onError} animated={motionEnabled} shineStyle={shineStyle} />
    {frameBreak && <View pointerEvents="none" style={[styles.heroClip, { bottom: cardHeight * .25 }]}>{renderHero(53, 53)}</View>}
    <CardDetails card={card} titleStyle={titleStyle} titleShineStyle={titleShineStyle} insideFrame={!frameBreak} animated={motionEnabled} onLoad={onLoad} onError={onError} />
    <EvolutionBadge level={level} animated={motionEnabled} glowStyle={badgeGlowStyle} width={width} />
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





























