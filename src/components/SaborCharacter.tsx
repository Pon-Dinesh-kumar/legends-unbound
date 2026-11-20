import React from 'react';
import { Image, ImageSourcePropType, StyleSheet } from 'react-native';
import Animated, { SharedValue, useAnimatedProps } from 'react-native-reanimated';
import Svg, { ClipPath, Defs, G, Image as SvgImage, LinearGradient, Mask, Path, Rect, Stop } from 'react-native-svg';
import { saborEarUnderpaint } from '../data/sabor';

const AnimatedGroup = Animated.createAnimatedComponent(G);
// Only the free upper tail and outer ear are isolated. The attachment zones
// overlap the unchanged source and fade smoothly back into the still body.
const tail = 'M 0 0 L 460 0 L 460 255 L 225 255 L 190 330 L 175 410 L 0 410 Z';
const ear = 'M 466 155 L 557 155 L 629 195 L 662 245 L 627 296 L 567 365 L 520 352 L 470 301 Z';

type Props = { source: ImageSourcePropType; active: boolean; tailPhase: SharedValue<number>; earPhase: SharedValue<number>; onLoad: (layer: string) => void; onError: () => void };

export function SaborCharacter({ source, active, tailPhase, earPhase, onLoad, onError }: Props) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [ready, setReady] = React.useState(false);
  const loadedParts = React.useRef(new Set<number>());
  React.useEffect(() => { if (!active) { loadedParts.current.clear(); setReady(false); } }, [active]);
  const part = (n: number) => { loadedParts.current.add(n); if (loadedParts.current.size === 5) setReady(true); };
  const tailMotion = useAnimatedProps(() => ({ transform: `rotate(${Math.sin(tailPhase.value) * 2.2} 150 405)` }));
  const tuftMotion = useAnimatedProps(() => ({ transform: `rotate(${Math.sin(tailPhase.value) * .7 + Math.sin(tailPhase.value * 2) * .7} 240 155)` }));
  const earMotion = useAnimatedProps(() => ({ transform: `rotate(${earPhase.value * -3.5} 560 330)` }));
  return <>
    <Image source={saborEarUnderpaint} resizeMode="contain" style={[StyleSheet.absoluteFill, { width: '100%', height: '100%', opacity: 0 }]} onLoad={() => onLoad('ear-base')} onError={onError} />
    <Image source={source} resizeMode="contain" style={[StyleSheet.absoluteFill, { width: '100%', height: '100%', opacity: active && ready ? 0 : 1 }]} onLoad={() => onLoad('character')} onError={onError} />
    {active && <Svg testID="sabor-character-rig" pointerEvents="none" width="100%" height="100%" viewBox="0 0 1024 1536" preserveAspectRatio="xMidYMid meet" style={[StyleSheet.absoluteFill, { opacity: ready ? 1 : 0 }]}>
      <Defs>
        <LinearGradient id={`saborTailBase${uid}`} gradientUnits="userSpaceOnUse" x1="0" y1="330" x2="0" y2="340"><Stop offset="0" stopColor="black" /><Stop offset="1" stopColor="white" /></LinearGradient>
        <LinearGradient id={`saborTailRoot${uid}`} gradientUnits="userSpaceOnUse" x1="0" y1="340" x2="0" y2="375"><Stop offset="0" stopColor="white" /><Stop offset="1" stopColor="black" /></LinearGradient>
        <LinearGradient id={`saborTuftBase${uid}`} gradientUnits="userSpaceOnUse" x1="220" y1="0" x2="250" y2="0"><Stop offset="0" stopColor="white" /><Stop offset="1" stopColor="black" /></LinearGradient>
        <LinearGradient id={`saborTuftFade${uid}`} gradientUnits="userSpaceOnUse" x1="185" y1="0" x2="220" y2="0"><Stop offset="0" stopColor="black" /><Stop offset="1" stopColor="white" /></LinearGradient>
        <LinearGradient id={`saborEarBase${uid}`} gradientUnits="userSpaceOnUse" x1="0" y1="285" x2="0" y2="305"><Stop offset="0" stopColor="black" /><Stop offset="1" stopColor="white" /></LinearGradient>
        <LinearGradient id={`saborEarPaint${uid}`} gradientUnits="userSpaceOnUse" x1="0" y1="285" x2="0" y2="305"><Stop offset="0" stopColor="white" /><Stop offset="1" stopColor="black" /></LinearGradient>
        <LinearGradient id={`saborEarRoot${uid}`} gradientUnits="userSpaceOnUse" x1="0" y1="305" x2="0" y2="340"><Stop offset="0" stopColor="white" /><Stop offset="1" stopColor="black" /></LinearGradient>
        <Mask id={`saborBase${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536"><Rect width="1024" height="1536" fill="white" /><Path d={tail} fill={`url(#saborTailBase${uid})`} /><Path d={ear} fill={`url(#saborEarBase${uid})`} /></Mask>
        <Mask id={`saborTailMask${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536"><Rect width="1024" height="1536" fill={`url(#saborTailRoot${uid})`} /></Mask>
        <Mask id={`saborTuftBaseMask${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536"><Rect width="1024" height="1536" fill={`url(#saborTuftBase${uid})`} /></Mask>
        <Mask id={`saborTuftMask${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536"><Rect width="1024" height="1536" fill={`url(#saborTuftFade${uid})`} /></Mask>
        <Mask id={`saborEarMask${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536"><Rect width="1024" height="1536" fill={`url(#saborEarRoot${uid})`} /></Mask>
        <Mask id={`saborEarPaintMask${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536"><Rect width="1024" height="1536" fill={`url(#saborEarPaint${uid})`} /></Mask>
        <ClipPath id={`saborTailClip${uid}`}><Path d={tail} /></ClipPath><ClipPath id={`saborEarClip${uid}`}><Path d={ear} /></ClipPath>
      </Defs>
      <SvgImage href={source} x="0" y="0" width="1024" height="1536" preserveAspectRatio="none" mask={`url(#saborBase${uid})`} onLoad={() => part(0)} />
      <SvgImage href={saborEarUnderpaint} x="0" y="0" width="1024" height="1536" preserveAspectRatio="none" clipPath={`url(#saborEarClip${uid})`} mask={`url(#saborEarPaintMask${uid})`} onLoad={() => part(1)} />
      <AnimatedGroup testID="sabor-tail" animatedProps={tailMotion}><G mask={`url(#saborTailMask${uid})`}>
        <G mask={`url(#saborTuftBaseMask${uid})`}><SvgImage href={source} x="0" y="0" width="1024" height="1536" preserveAspectRatio="none" clipPath={`url(#saborTailClip${uid})`} onLoad={() => part(2)} /></G>
        <AnimatedGroup testID="sabor-tuft" animatedProps={tuftMotion}><G mask={`url(#saborTuftMask${uid})`}><SvgImage href={source} x="0" y="0" width="1024" height="1536" preserveAspectRatio="none" clipPath={`url(#saborTailClip${uid})`} onLoad={() => part(3)} /></G></AnimatedGroup>
      </G></AnimatedGroup>
      <AnimatedGroup testID="sabor-ear" animatedProps={earMotion}><G mask={`url(#saborEarMask${uid})`}><SvgImage href={source} x="0" y="0" width="1024" height="1536" preserveAspectRatio="none" clipPath={`url(#saborEarClip${uid})`} onLoad={() => part(4)} /></G></AnimatedGroup>
    </Svg>}
  </>;
}
