import React from 'react';
import { Image, ImageSourcePropType, StyleSheet } from 'react-native';
import Animated, { SharedValue, useAnimatedProps } from 'react-native-reanimated';
import Svg, { ClipPath, Defs, G, Image as SvgImage, LinearGradient, Mask, Path, Rect, Stop } from 'react-native-svg';

const AnimatedGroup = Animated.createAnimatedComponent(G);
// The outer tail sits over transparent space. Keep the cut at the attachment
// and use the original illustration at rest for every evolution.
const tail = 'M 671 554 L 716 550 L 765 514 L 820 490 L 879 487 L 930 513 L 976 565 L 1015 644 L 1021 716 L 1008 778 L 981 843 L 952 906 L 910 909 L 865 876 L 824 826 L 831 777 L 856 742 L 831 708 L 790 676 L 740 654 L 704 652 L 671 642 Z';
// The outward hair lock is isolated against transparency, clear of the face.
const hair = 'M 607 287 L 660 300 L 705 322 L 753 315 L 803 277 L 850 270 L 892 294 L 915 338 L 905 385 L 880 413 L 841 414 L 793 392 L 748 380 L 708 383 L 671 370 L 633 345 Z';

export function JaneScarf({ source, phase, hairPhase, active, onLoad, onError }: { source: ImageSourcePropType; phase: SharedValue<number>; hairPhase: SharedValue<number>; active: boolean; onLoad: () => void; onError: () => void }) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [ready, setReady] = React.useState(false);
  const parts = React.useRef(new Set<number>());
  React.useEffect(() => {
    if (!active) { parts.current.clear(); setReady(false); }
  }, [active]);
  const loaded = (part: number) => { parts.current.add(part); if (parts.current.size === 3) setReady(true); };
  const base = `janeScarfBase${uid}`, clip = `janeScarfTail${uid}`, root = `janeScarfRoot${uid}`;
  const motion = useAnimatedProps(() => ({ transform: `rotate(${Math.sin(phase.value) * 2.6} 680 600)` }));
  const hairMotion = useAnimatedProps(() => ({ transform: `rotate(${Math.sin(hairPhase.value) * 3.8} 620 315)` }));
  return <>
    <Image source={source} resizeMode="contain" style={[StyleSheet.absoluteFill, { width: '100%', height: '100%', opacity: active && ready ? 0 : 1 }]} onLoad={onLoad} onError={onError} />
    {active && <Svg testID="jane-scarf-rig" pointerEvents="none" width="100%" height="100%" viewBox="0 0 1024 1536" preserveAspectRatio="xMidYMid meet" style={[StyleSheet.absoluteFill, { opacity: ready ? 1 : 0 }]}>
      <Defs>
        <LinearGradient id={`baseFade${uid}`} gradientUnits="userSpaceOnUse" x1="730" y1="0" x2="760" y2="0"><Stop offset="0" stopColor="white" /><Stop offset="1" stopColor="black" /></LinearGradient>
        <LinearGradient id={`tailFade${uid}`} gradientUnits="userSpaceOnUse" x1="671" y1="0" x2="735" y2="0"><Stop offset="0" stopColor="black" /><Stop offset="1" stopColor="white" /></LinearGradient>
        <LinearGradient id={`hairBaseFade${uid}`} gradientUnits="userSpaceOnUse" x1="665" y1="0" x2="705" y2="0"><Stop offset="0" stopColor="white" /><Stop offset="1" stopColor="black" /></LinearGradient>
        <LinearGradient id={`hairFade${uid}`} gradientUnits="userSpaceOnUse" x1="610" y1="0" x2="675" y2="0"><Stop offset="0" stopColor="black" /><Stop offset="1" stopColor="white" /></LinearGradient>
        <Mask id={base} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536"><Rect width="1024" height="1536" fill="white" /><Path d={tail} fill={`url(#baseFade${uid})`} /><Path d={hair} fill={`url(#hairBaseFade${uid})`} /></Mask>
        <Mask id={root} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536"><Rect width="1024" height="1536" fill={`url(#tailFade${uid})`} /></Mask>
        <Mask id={`janeHairRoot${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536"><Rect width="1024" height="1536" fill={`url(#hairFade${uid})`} /></Mask>
        <ClipPath id={clip}><Path d={tail} /></ClipPath>
        <ClipPath id={`janeHairClip${uid}`}><Path d={hair} /></ClipPath>
      </Defs>
      <SvgImage href={source} x="0" y="0" width="1024" height="1536" preserveAspectRatio="none" mask={`url(#${base})`} onLoad={() => loaded(0)} />
      <AnimatedGroup animatedProps={motion}><G mask={`url(#${root})`}><SvgImage href={source} x="0" y="0" width="1024" height="1536" preserveAspectRatio="none" clipPath={`url(#${clip})`} onLoad={() => loaded(1)} /></G></AnimatedGroup>
      <AnimatedGroup testID="jane-hair-motion" animatedProps={hairMotion}><G mask={`url(#janeHairRoot${uid})`}><SvgImage href={source} x="0" y="0" width="1024" height="1536" preserveAspectRatio="none" clipPath={`url(#janeHairClip${uid})`} onLoad={() => loaded(2)} /></G></AnimatedGroup>
    </Svg>}
  </>;
}
