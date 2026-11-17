import { useEffect } from 'react';
import { Accelerometer, DeviceMotion } from 'expo-sensors';
import { useSharedValue, withTiming } from 'react-native-reanimated';

const clamp = (n: number) => Math.max(-1, Math.min(1, n));
export function useDeviceTilt() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  useEffect(() => {
    let mounted = true;
    let subscription: { remove: () => void } | undefined;
    let origin: { x: number; y: number } | undefined;
    const update = (horizontal: number, vertical: number, sensitivity: number) => {
      if (!Number.isFinite(horizontal) || !Number.isFinite(vertical)) return;
      origin ??= { x: horizontal, y: vertical };
      x.value = withTiming(clamp((horizontal - origin.x) * sensitivity), { duration: 180 });
      y.value = withTiming(clamp((vertical - origin.y) * sensitivity), { duration: 180 });
    };
    const start = async () => {
      // DeviceMotion fuses gyroscope and accelerometer readings into orientation.
      if (await DeviceMotion.isAvailableAsync()) {
        if (!mounted) return;
        DeviceMotion.setUpdateInterval(50);
        subscription = DeviceMotion.addListener(({ rotation }) => {
          if (rotation) update(rotation.gamma, rotation.beta, 2);
        });
      } else if (await Accelerometer.isAvailableAsync()) {
        if (!mounted) return;
        Accelerometer.setUpdateInterval(50);
        subscription = Accelerometer.addListener((v) => update(v.x, v.y, 1.5));
      }
    };
    start().catch(() => {}); // Touch remains available if sensors are denied or absent.
    return () => { mounted = false; subscription?.remove(); };
  }, [x, y]);
  return { x, y };
}
