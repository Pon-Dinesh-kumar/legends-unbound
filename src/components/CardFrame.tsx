import React from 'react';
import { Image, Platform, StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Asset } from 'expo-asset';
import MaskedView from '@react-native-masked-view/masked-view';
import { Card } from '../types/card';
import { Evolution, evolutions } from '../data/evolutions';

const TitleMask = MaskedView as unknown as React.ComponentType<React.ComponentProps<typeof View> & { maskElement: React.ReactElement }>;

export function CardFrame({ onLoad, onError, glowStyle }: { onLoad: (layer: string) => void; onError: () => void; glowStyle: StyleProp<AnimatedStyle<ViewStyle>> }) {
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <Image source={require('../../assets/cards/shared/frame-v3.png')} resizeMode="stretch" style={styles.frameImage} onLoad={() => onLoad('frame')} onError={onError} />
    <Animated.View style={[styles.frameGlow, glowStyle]} />
  </View>;
}

export function EvolutionBadge({ level, animated, glowStyle }: { level: Evolution; animated: boolean; glowStyle: StyleProp<AnimatedStyle<ViewStyle>> }) {
  const filled = evolutions.indexOf(level) + 1;
  return <View pointerEvents="none" style={styles.levelBadge}>
    <View style={styles.levelRail} />
    {evolutions.map((item, index) => <View key={item} style={[styles.diamond, index < filled ? styles.diamondFilled : styles.diamondEmpty]}>
      {index < filled && <LinearGradient colors={['#fff3b4', '#d6a23a', '#7b5019']} start={{x:0,y:0}} end={{x:1,y:1}} style={StyleSheet.absoluteFill} />}
      {index < filled && <View style={styles.diamondHighlight} />}
      {animated && <Animated.View style={[styles.diamondShine, glowStyle]} />}
    </View>)}
  </View>;
}

export function CardDetails({ card, titleStyle, titleShineStyle, insideFrame, animated, onLoad, onError }: { card: Card; titleStyle: StyleProp<AnimatedStyle<ViewStyle>>; titleShineStyle: StyleProp<AnimatedStyle<ViewStyle>>; insideFrame: boolean; animated: boolean; onLoad: (layer: string) => void; onError: () => void }) {
  const titleUri = Platform.OS === 'web' ? Asset.fromModule(card.titleImage).uri : undefined;
  const shine = <Animated.View style={[styles.titleShine, titleShineStyle]}><LinearGradient colors={['transparent', '#fff5d6bb', 'transparent']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill} /></Animated.View>;
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <LinearGradient colors={['transparent', '#101113aa']} style={styles.titleShade} />
    <Animated.View style={[styles.nameArt, insideFrame && styles.nameArtInside, titleStyle]}>
      <Image source={card.titleImage} resizeMode="contain" style={styles.nameImage} onLoad={() => onLoad('title')} onError={onError} />
      {animated && (Platform.OS === 'web' ? React.createElement('div', {
        'aria-hidden': true,
        style: { position: 'absolute', inset: 0, pointerEvents: 'none', maskImage: `url("${titleUri}")`, maskSize: 'contain', maskPosition: 'center', maskRepeat: 'no-repeat', WebkitMaskImage: `url("${titleUri}")`, WebkitMaskSize: 'contain', WebkitMaskPosition: 'center', WebkitMaskRepeat: 'no-repeat' },
      }, shine) : <TitleMask style={StyleSheet.absoluteFill} maskElement={<Image source={card.titleImage} resizeMode="contain" style={styles.nameImage} />}>{shine}</TitleMask>)}
    </Animated.View>
    <View style={[styles.gemRim, styles.energy]}>
      <LinearGradient colors={['#52798a', '#162f42', '#0b1b26']} style={styles.gemFace}>
        <Text style={styles.gemText}>{card.energy}</Text>
      </LinearGradient>
    </View>
    <View style={[styles.gemRim, styles.power]}>
      <LinearGradient colors={['#9c6b48', '#612d29', '#30191b']} style={styles.gemFace}>
        <Text style={styles.gemText}>{card.power}</Text>
      </LinearGradient>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  frameImage: { position: 'absolute', top: '-1%', left: '-1%', width: '102%', height: '102%' },
  frameGlow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 28, borderWidth: 1, borderColor: '#ffe4a0', shadowColor: '#ffbe42', shadowOpacity: 1, shadowRadius: 7, shadowOffset: { width: 0, height: 0 } },
  levelBadge: { position: 'absolute', bottom: -4, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, height: 20 },
  levelRail: { position: 'absolute', left: -8, right: -8, height: 2, top: 9, backgroundColor: '#c89a4b' },
  diamond: { width: 14, height: 14, borderRadius: 1, borderWidth: 1, transform: [{ rotate: '45deg' }], overflow: 'hidden' },
  diamondFilled: { borderColor: '#ffe7a2', backgroundColor: '#d4a344' },
  diamondEmpty: { borderColor: '#8c6c39', backgroundColor: '#281e15' },
  diamondHighlight: { position: 'absolute', top: 1, left: 1, width: 6, height: 2, backgroundColor: '#fff6ce', opacity: .85 },
  diamondShine: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: '#fff2b0' },
  titleShade: { position: 'absolute', left: 8, right: 8, bottom: 8, height: '24%', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  nameArt: { position: 'absolute', width: '118%', height: '30%', bottom: '-2%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' },
  nameArtInside: { width: '94%', height: '25%', bottom: '1%' },
  nameImage: { width: '100%', height: '100%' },
  titleShine: { position: 'absolute', width: '30%', height: '200%', top: '-50%' },
  gemRim: { position: 'absolute', width: 46, height: 46, borderRadius: 23, padding: 3, backgroundColor: '#bb965c', borderWidth: 1, borderColor: '#f3dcaa', shadowColor: '#000', shadowOpacity: .85, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 5 },
  gemFace: { flex: 1, borderRadius: 20, borderWidth: 1, borderColor: '#f9e4b577', alignItems: 'center', justifyContent: 'center' },
  energy: { top: 7, left: 7 },
  power: { top: 7, right: 7 },
  gemText: { color: '#fff3d4', fontFamily: 'serif', fontWeight: '700', fontSize: 24, textShadowColor: '#000', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
});



