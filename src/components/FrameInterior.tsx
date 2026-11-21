import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import Svg, { Polygon } from 'react-native-svg';

const NativeMask = MaskedView as unknown as React.ComponentType<React.ComponentProps<typeof View> & { maskElement: React.ReactElement }>;

// This polygon follows the inside of frame-legendary-v6's beveled outline.
const points = '3.5,10.5 13,3.8 36,3.8 50,2.7 64,3.8 87,3.8 96.5,10.5 96.5,87.5 89,96.7 11,96.7 3.5,87.5';
// The Common rail dips between the shields and centre crest. Keep the scene
// behind that rail instead of using the higher Legendary silhouette there.
const commonPoints = '5.3,10.5 13,3.8 21.5,4.6 25.5,5.9 29,6.2 31.5,5.9 35,4.7 37,4.4 63,4.4 65,4.7 68.5,5.9 71,6.2 74.5,5.9 78.5,4.6 87,3.8 94.7,10.5 94.7,87.5 89,96.7 11,96.7 5.3,87.5';

export function FrameInterior({ children, common = false }: { children: React.ReactNode; common?: boolean }) {
  const outline = common ? commonPoints : points;
  const clipPath = `polygon(${outline.split(' ').map(point => point.split(',').map(value => `${value}%`).join(' ')).join(', ')})`;
  if (Platform.OS === 'web') return React.createElement('div', {
    'aria-hidden': true,
    style: { position: 'absolute', inset: 0, clipPath, pointerEvents: 'none' },
  }, children);
  return <NativeMask pointerEvents="none" style={StyleSheet.absoluteFill} maskElement={<Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><Polygon points={outline} fill="white" /></Svg>}>{children}</NativeMask>;
}
