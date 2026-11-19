import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { Accelerometer, DeviceMotion } from 'expo-sensors';
import { useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

const clamp = (n: number) => Math.max(-1, Math.min(1, n));
const deadZone = (n: number) => Math.abs(n) < .018 ? 0 : clamp(n);
const angleDelta = (value: number, origin: number) => Math.atan2(Math.sin(value - origin), Math.cos(value - origin));

export function useDeviceTilt() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion) { x.value = 0; y.value = 0; return; }
    let mounted = true;
    let generation = 0;
    let subscription: { remove: () => void } | undefined;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    let origin: { x: number; y: number } | undefined;
    const stop = () => {
      generation++;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      fallbackTimer = undefined;
      subscription?.remove();
      subscription = undefined;
      origin = undefined;
      x.value = 0; y.value = 0;
    };
    const start = async () => {
      const current = ++generation;
      const valid = () => mounted && generation === current && AppState.currentState !== 'background';
      const update = (horizontal: number, vertical: number, sensitivity: number, radians: boolean) => {
        if (!valid() || !Number.isFinite(horizontal) || !Number.isFinite(vertical)) return;
        origin ??= { x: horizontal, y: vertical };
        const dx = radians ? angleDelta(horizontal, origin.x) : horizontal - origin.x;
        const dy = radians ? angleDelta(vertical, origin.y) : vertical - origin.y;
        x.value = withTiming(deadZone(dx * sensitivity), { duration: 180 });
        y.value = withTiming(deadZone(dy * sensitivity), { duration: 180 });
      };
      const startAccelerometer = async () => {
        if (!valid()) return;
        if (fallbackTimer) clearTimeout(fallbackTimer);
        fallbackTimer = undefined;
        subscription?.remove(); subscription = undefined; origin = undefined;
        try {
          if (!(await Accelerometer.isAvailableAsync()) || !valid()) return;
          Accelerometer.setUpdateInterval(50);
          subscription = Accelerometer.addListener(v => update(v.x, v.y, 2.5, false));
        } catch { /* Touch tilt remains available. */ }
      };
      if (Platform.OS === 'web') {
        // Expo's web motion event does not expose a rotation vector. Read the
        // browser's orientation event directly; touch remains the fallback.
        const onOrientation = (event: DeviceOrientationEvent) => {
          if (event.gamma == null || event.beta == null) return;
          update(event.gamma * Math.PI / 180, event.beta * Math.PI / 180, 3.5, true);
        };
        window.addEventListener('deviceorientation', onOrientation);
        subscription = { remove: () => window.removeEventListener('deviceorientation', onOrientation) };
        return;
      }
      try {
        if (!(await DeviceMotion.isAvailableAsync()) || !valid()) { await startAccelerometer(); return; }
        DeviceMotion.setUpdateInterval(50);
        // Some Android devices expose motion but never deliver a rotation vector.
        fallbackTimer = setTimeout(() => { fallbackTimer = undefined; void startAccelerometer(); }, 1500);
        subscription = DeviceMotion.addListener(({ rotation }) => {
          if (!rotation || !Number.isFinite(rotation.gamma) || !Number.isFinite(rotation.beta)) return;
          if (fallbackTimer) { clearTimeout(fallbackTimer); fallbackTimer = undefined; }
          update(rotation.gamma, rotation.beta, 3.5, true);
        });
      } catch { await startAccelerometer(); }
    };
    if (AppState.currentState !== 'background') void start();
    const stateListener = AppState.addEventListener('change', state => {
      if (state === 'active') { stop(); void start(); } else if (state === 'background') stop();
    });
    return () => { mounted = false; stop(); stateListener?.remove(); };
  }, [x, y, reducedMotion]);
  return { x, y };
}
