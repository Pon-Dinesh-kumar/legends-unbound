import React from 'react';
import { Image, ImageSourcePropType, StyleSheet } from 'react-native';
import Animated, { SharedValue, useAnimatedProps } from 'react-native-reanimated';
import Svg, { ClipPath, Defs, G, Image as SvgImage, Mask, Path, Rect } from 'react-native-svg';

const AnimatedGroup = Animated.createAnimatedComponent(G);
// The strip lies in transparent space behind the knife and beside the thigh.
// This contour is registered to character.png's 1024 x 1536 source coordinates.
const strip = 'M 687 800 L 704 800 L 734 826 L 748 844 L 828 903 L 833 943 L 828 985 L 813 1012 L 808 1060 L 753 1060 L 750 1010 L 742 969 L 720 908 L 712 870 L 698 846 L 685 830 Z';

type Props = { source: ImageSourcePropType; phase: SharedValue<number>; onLoad: () => void; onError: () => void };

// Preserve the original pixels at rest: remove only the strip from the base,
// then redraw that exact source in two slightly overlapping, anchored pieces.
export function TarzanCharacter({ source, phase, onLoad, onError }: Props) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [rigReady, setRigReady] = React.useState(false);
  const loadedParts = React.useRef(new Set<number>());
  const markPartLoaded = (part: number) => {
    loadedParts.current.add(part);
    if (loadedParts.current.size === 3) setRigReady(true);
  };
  const baseMask = `tarzanBase${uid}`, stripClip = `tarzanStrip${uid}`, upperClip = `tarzanUpper${uid}`, lowerClip = `tarzanLower${uid}`;
  const upper = useAnimatedProps(() => ({ transform: `rotate(${Math.sin(phase.value) * 2.2} 690 800)` }));
  const lower = useAnimatedProps(() => ({ transform: `rotate(${Math.sin(phase.value) * 3.5 + Math.sin(phase.value * 2) * .5} 785 900)` }));
  return <>
    {/* Keep the original visible until every SVG image has loaded. */}
    <Image source={source} resizeMode="contain" style={[StyleSheet.absoluteFill, { width: '100%', height: '100%', opacity: rigReady ? 0 : 1 }]} onLoad={onLoad} onError={onError} />
    <Svg testID="tarzan-character-rig" pointerEvents="none" width="100%" height="100%" viewBox="0 0 1024 1536" preserveAspectRatio="xMidYMid meet" style={[StyleSheet.absoluteFill, { opacity: rigReady ? 1 : 0 }]}>
      <Defs>
        <Mask id={baseMask} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536"><Rect width="1024" height="1536" fill="white" /><Path d={strip} fill="black" /></Mask>
        <ClipPath id={stripClip}><Path d={strip} /></ClipPath>
        <ClipPath id={upperClip}><Rect x="0" y="0" width="1024" height="905" /></ClipPath>
        <ClipPath id={lowerClip}><Rect x="0" y="900" width="1024" height="636" /></ClipPath>
      </Defs>
      <SvgImage href={source} x="0" y="0" width="1024" height="1536" preserveAspectRatio="none" mask={`url(#${baseMask})`} onLoad={() => markPartLoaded(0)} />
      <AnimatedGroup testID="tarzan-cloth-anchor" animatedProps={upper}>
        <G clipPath={`url(#${upperClip})`}><SvgImage href={source} x="0" y="0" width="1024" height="1536" preserveAspectRatio="none" clipPath={`url(#${stripClip})`} onLoad={() => markPartLoaded(1)} /></G>
        <AnimatedGroup testID="tarzan-cloth-tip" animatedProps={lower}>
          <G clipPath={`url(#${lowerClip})`}><SvgImage href={source} x="0" y="0" width="1024" height="1536" preserveAspectRatio="none" clipPath={`url(#${stripClip})`} onLoad={() => markPartLoaded(2)} /></G>
        </AnimatedGroup>
      </AnimatedGroup>
    </Svg>
  </>;
}
