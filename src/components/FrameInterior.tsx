import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import Svg, { Polygon } from 'react-native-svg';

const NativeMask = MaskedView as unknown as React.ComponentType<React.ComponentProps<typeof View> & { maskElement: React.ReactElement }>;

// This polygon follows the inside of frame-legendary-v6's beveled outline.
const points = '3.5,10.5 13,3.8 36,3.8 50,2.7 64,3.8 87,3.8 96.5,10.5 96.5,87.5 89,96.7 11,96.7 3.5,87.5';
const clipPath = `polygon(${points.split(' ').map(point => point.split(',').map(value => `${value}%`).join(' ')).join(', ')})`;

export function FrameInterior({ children }: { children: React.ReactNode }) {
  if (Platform.OS === 'web') return React.createElement('div', {
    'aria-hidden': true,
    style: { position: 'absolute', inset: 0, clipPath, pointerEvents: 'none' },
  }, children);
  return <NativeMask pointerEvents="none" style={StyleSheet.absoluteFill} maskElement={<Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><Polygon points={points} fill="white" /></Svg>}>{children}</NativeMask>;
}
