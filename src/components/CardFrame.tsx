import React from 'react';
import { Image, Platform, StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Asset } from 'expo-asset';
import MaskedView from '@react-native-masked-view/masked-view';
import { Card } from '../types/card';
import { Evolution, evolutions } from '../data/evolutions';

const TitleMask = MaskedView as unknown as React.ComponentType<React.ComponentProps<typeof View> & { maskElement: React.ReactElement }>;
const frameAsset = require('../../assets/cards/shared/frame-legendary-v4.png');

export function CardFrame({ onLoad, onError, animated, shineStyle }: { onLoad: (layer: string) => void; onError: () => void; animated: boolean; shineStyle: StyleProp<AnimatedStyle<ViewStyle>> }) {
  const frameUri = Platform.OS === 'web' ? Asset.fromModule(frameAsset).uri : undefined;
  const shine = <Animated.View style={[styles.frameShine, shineStyle]}><LinearGradient colors={['transparent', '#fff1b3b0', 'transparent']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill} /></Animated.View>;
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <Image source={frameAsset} resizeMode="stretch" style={styles.frameImage} onLoad={() => onLoad('frame')} onError={onError} />
    {animated && <View style={styles.frameImage}>{Platform.OS === 'web' ? React.createElement('div', {
      'aria-hidden': true,
      style: { position: 'absolute', inset: 0, pointerEvents: 'none', maskImage: `url("${frameUri}")`, maskSize: '100% 100%', maskRepeat: 'no-repeat', WebkitMaskImage: `url("${frameUri}")`, WebkitMaskSize: '100% 100%', WebkitMaskRepeat: 'no-repeat' },
    }, shine) : <TitleMask style={StyleSheet.absoluteFill} maskElement={<Image source={frameAsset} resizeMode="stretch" style={styles.nameImage} />}>{shine}</TitleMask>}</View>}
  </View>;
}

export function EvolutionBadge({ level, animated, glowStyle, width }: { level: Evolution; animated: boolean; glowStyle: StyleProp<AnimatedStyle<ViewStyle>>; width: number }) {
  const filled = evolutions.indexOf(level) + 1;
  const side = width * .052;
  const centers = [419 / 1024, 512 / 1024, 608 / 1024];
  const top = width * 1.5 * (1.02 * (1475 / 1536) - .01) - side / 2;
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    {evolutions.map((item, index) => index < filled && <View key={item} style={[styles.diamondMount, { width: side, height: side, left: width * (1.02 * centers[index] - .01) - side / 2, top }]}>
      <View style={styles.diamond}>
        <LinearGradient colors={['#fff8c8', '#ffc437', '#a15b04']} start={{x:0,y:0}} end={{x:1,y:1}} style={StyleSheet.absoluteFill} />
        <View style={styles.diamondFacet} />
        <View style={styles.diamondHighlight} />
        {animated && <Animated.View style={[styles.diamondShine, glowStyle]} />}
      </View>
    </View>)}
  </View>;
}

export function CardDetails({ card, titleStyle, titleShineStyle, insideFrame, animated, onLoad, onError }: { card: Card; titleStyle: StyleProp<AnimatedStyle<ViewStyle>>; titleShineStyle: StyleProp<AnimatedStyle<ViewStyle>>; insideFrame: boolean; animated: boolean; onLoad: (layer: string) => void; onError: () => void }) {
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
  frameShine: { position: 'absolute', width: '35%', height: '160%', top: '-30%' },
  diamondMount: { position: 'absolute', transform: [{ rotate: '45deg' }], shadowColor: '#ffc44d', shadowOpacity: .85, shadowRadius: 3, shadowOffset: { width: 0, height: 0 } },
  diamond: { width: '100%', height: '100%', borderWidth: 1, borderColor: '#ffe59a', backgroundColor: '#d5901d', overflow: 'hidden' },
  diamondFacet: { position: 'absolute', top: '50%', bottom: 0, left: 0, right: 0, backgroundColor: '#b86705', opacity: .35 },
  diamondHighlight: { position: 'absolute', top: 1, left: 1, width: '45%', height: 2, backgroundColor: '#fffbe0', opacity: .9 },
  diamondShine: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: '#fff2b0' },
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



