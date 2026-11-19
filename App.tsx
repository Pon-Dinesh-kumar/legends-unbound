import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { cards } from './src/data/cards';
import { LayeredCard } from './src/components/LayeredCard';
import { useDeviceTilt } from './src/hooks/useDeviceTilt';
import { preloadCardAssets } from './src/hooks/preloadCardAssets';
import { Card } from './src/types/card';
import { SharedValue } from 'react-native-reanimated';
import { Evolution, evolutions, evolutionPolicy } from './src/data/evolutions';

// Wait for the actual mounted layers, not a fixed total that can be satisfied by
// an unrelated or duplicated load callback.
const baseLayers = ['background', 'foreground', 'effects', 'character', 'title', 'frame', 'back'];
const extraLayers: Record<string, string[]> = {
  sherlock: ['scarf-0', 'scarf-1', 'scarf-2'],
  dracula: ['cape-0', 'cape-1', 'cape-2'],
};
const requiredLayers = cards.flatMap(card => [...baseLayers, ...(extraLayers[card.id] ?? [])].map(layer => `${card.id}:${layer}`));

function CardSlot({ card, width, tiltX, tiltY, selected, level, onLoad, onError }: { card: Card; width: number; tiltX: SharedValue<number>; tiltY: SharedValue<number>; selected: boolean; level: Evolution; onLoad: (layer: string) => void; onError: () => void }) {
  const opacity = useSharedValue(selected ? 1 : 0);
  useEffect(() => { opacity.value = withTiming(selected ? 1 : 0, { duration: 200 }); }, [opacity, selected]);
  const fade = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View pointerEvents={selected ? 'auto' : 'none'} aria-hidden={!selected} accessibilityElementsHidden={!selected} importantForAccessibility={selected ? 'auto' : 'no-hide-descendants'} style={[styles.cardSlot, fade]}>
    <LayeredCard card={card} width={width} tiltX={tiltX} tiltY={tiltY} selected={selected} level={level} onLoad={onLoad} onError={onError} />
  </Animated.View>;
}

function Showcase({ onLoaded, onError }: { onLoaded: () => void; onError: () => void }) {
  const [selected, setSelected] = useState(0);
  const [level, setLevel] = useState<Evolution>('origin');
  const loadedLayers = useRef(new Set<string>());
  const reportedReady = useRef(false);
  const { width, height } = useWindowDimensions();
  const tilt = useDeviceTilt();
  const cardWidth = Math.min(width * .72, Math.max(160, (height - 430) / 1.5), 350);
  const markLoaded = (cardId: string, layer: string) => {
    loadedLayers.current.add(`${cardId}:${layer}`);
    if (!reportedReady.current && requiredLayers.every(key => loadedLayers.current.has(key))) {
      reportedReady.current = true;
      onLoaded();
    }
  };
  return <LinearGradient colors={['#111c20', '#0c1013', '#161216']} style={styles.screen}>
    <StatusBar style="light" />
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}><Text style={styles.brand}>LEGENDS <Text style={styles.brandAccent}>UNBOUND</Text></Text><Text style={styles.brandSub}>A COLLECTION OF EXTRAORDINARY STORIES</Text></View>
      <View style={styles.intro}><Text style={styles.eyebrow}>THE FIRST COLLECTION  /  001—003</Text><Text style={styles.heading}>Legends come to life.</Text><Text style={styles.caption}>Drag or tilt to explore · tap below to flip.</Text></View>
      <View style={styles.stage}>{cards.map((item, i) => <CardSlot key={item.id} card={item} width={cardWidth} tiltX={tilt.x} tiltY={tilt.y} selected={i === selected} level={level} onLoad={layer => markLoaded(item.id, layer)} onError={onError} />)}</View>
      <View style={styles.evolutionHeader}><Text style={styles.selectorLabel}>EVOLUTION</Text><Text style={styles.evolutionHint}>{level === 'origin' ? 'WITHIN THE FRAME' : level === 'awakened' ? 'FRAME BREAK' : 'LIVING ART'}</Text></View>
      <View accessibilityRole="radiogroup" accessibilityLabel="Card evolution" style={styles.evolutions}>{evolutions.map((item, i) => <Pressable key={item} accessibilityRole="radio" accessibilityLabel={`${evolutionPolicy[item].label} evolution`} accessibilityState={{ checked: level === item }} aria-checked={level === item} onPress={() => setLevel(item)} style={[styles.evolution, level === item && styles.evolutionSelected]}><Text style={[styles.evolutionNumber, level === item && styles.evolutionTextSelected]}>0{i + 1}</Text><Text style={[styles.evolutionText, level === item && styles.evolutionTextSelected]}>{evolutionPolicy[item].label.toUpperCase()}</Text></Pressable>)}</View>
      <View style={styles.selectorHeader}><Text style={styles.selectorLabel}>CHOOSE YOUR LEGEND</Text><Text style={styles.count}>0{selected + 1} <Text style={styles.muted}>/ 03</Text></Text></View>
      <View style={styles.selector}>{cards.map((item, i) => <Pressable accessibilityRole="button" accessibilityLabel={`Inspect ${item.name}`} accessibilityState={{ selected: i === selected }} key={item.id} onPress={() => setSelected(i)} style={[styles.choice, i === selected && { borderColor: item.accent }]}>
        <ImageBackground source={item.background} resizeMode="cover" style={styles.choiceImage} imageStyle={{ opacity: .48 }}><LinearGradient colors={['transparent', '#101315eF']} style={styles.choiceShade}><Text numberOfLines={1} style={[styles.choiceName, i === selected && { color: '#f9e5bb' }]}>{item.name}</Text><Text style={styles.choiceRarity}>{item.rarity}</Text></LinearGradient></ImageBackground>
      </Pressable>)}</View>
      <Text style={styles.footer}>✦   AN ILLUSTRATED COLLECTION   ✦</Text>
    </SafeAreaView>
  </LinearGradient>;
}
export default function App() {
  const [loading, setLoading] = useState<'loading' | 'warming' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading('loading');
    preloadCardAssets().then(() => { if (active) setLoading('warming'); }).catch(() => { if (active) setLoading('error'); });
    return () => { active = false; };
  }, [attempt]);
  return <GestureHandlerRootView style={{ flex: 1 }}>
    {(loading === 'warming' || loading === 'ready') && <Showcase key={attempt} onLoaded={() => setLoading('ready')} onError={() => setLoading('error')} />}
    {loading !== 'ready' && <LinearGradient colors={['#111c20', '#0c1013', '#161216']} style={[styles.loadingScreen, StyleSheet.absoluteFill]}>
      <Text style={styles.brand}>LEGENDS <Text style={styles.brandAccent}>UNBOUND</Text></Text>
      <Text accessibilityLiveRegion="polite" style={styles.loadingText}>{loading === 'error' ? 'The card art could not be loaded.' : 'Preparing your collection…'}</Text>
      {loading === 'error' && <Pressable accessibilityRole="button" onPress={() => setAttempt(value => value + 1)} style={styles.retry}><Text style={styles.retryText}>TRY AGAIN</Text></Pressable>}
    </LinearGradient>}
  </GestureHandlerRootView>;
}
const styles = StyleSheet.create({
  loadingScreen: { flex: 1, alignItems: 'center', justifyContent: 'center' }, loadingText: { color: '#b2aa99', fontFamily: 'serif', fontSize: 14, marginTop: 18 }, retry: { marginTop: 18, padding: 12 }, retryText: { color: '#d9bd82', fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  screen: { flex: 1 }, safe: { flex: 1, paddingHorizontal: 22 },
  header: { alignItems: 'center', paddingTop: 18 }, brand: { color: '#f5e7ca', fontFamily: 'serif', fontSize: 17, fontWeight: '700', letterSpacing: 3 }, brandAccent: { color: '#c9ab73' }, brandSub: { color: '#a29b8a', fontSize: 7, letterSpacing: 2, marginTop: 5 },
  intro: { alignItems: 'center', marginTop: 23 }, eyebrow: { color: '#c3a979', fontSize: 8, letterSpacing: 2.2, fontWeight: '700' }, heading: { color: '#f8edda', fontFamily: 'serif', fontSize: 25, marginTop: 7 }, caption: { color: '#a6aaa5', fontSize: 11, marginTop: 5 },
  stage: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 250, marginTop: 14 },
  evolutionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  evolutionHint: { color: '#8f846e', fontSize: 8, letterSpacing: 1.1 },
  evolutions: { flexDirection: 'row', gap: 6, marginBottom: 13 },
  evolution: { flex: 1, minHeight: 34, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#4c483c', borderRadius: 4, backgroundColor: '#161c1d' },
  evolutionSelected: { borderColor: '#d2ad67', backgroundColor: '#30291d' },
  evolutionNumber: { color: '#817763', fontSize: 8, fontFamily: 'serif' },
  evolutionText: { color: '#a7a093', fontSize: 8, fontWeight: '700', letterSpacing: .7 },
  evolutionTextSelected: { color: '#f1d69c' },
  cardSlot: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, justifyContent: 'center', alignItems: 'center' },
  selectorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 }, selectorLabel: { color: '#c2b496', fontSize: 9, letterSpacing: 1.8, fontWeight: '700' }, count: { color: '#d8c49f', fontFamily: 'serif', fontSize: 12 }, muted: { color: '#6c6d65' },
  selector: { flexDirection: 'row', gap: 8, height: 59 }, choice: { flex: 1, borderWidth: 1, borderColor: '#494b42', borderRadius: 6, overflow: 'hidden' }, choiceImage: { flex: 1 }, choiceShade: { flex: 1, justifyContent: 'flex-end', padding: 7 }, choiceName: { color: '#c8c4b8', fontFamily: 'serif', fontSize: 10, fontWeight: '700' }, choiceRarity: { color: '#ac9a77', fontSize: 6, letterSpacing: 1, marginTop: 2 }, footer: { color: '#6d716b', fontSize: 8, letterSpacing: 2, textAlign: 'center', marginTop: 16, marginBottom: 12 },
});




