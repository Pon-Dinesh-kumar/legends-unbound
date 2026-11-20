# Showcase web performance notes

## 2026-11-20 investigation

The user reported web UI and animation lag. A headless Edge CPU profile of Jane Unbound identified React Native Reanimated DOM/style and SVG attribute updates among the sampled JavaScript work. The profile is a diagnostic sample, not a device benchmark.

The current optimization retains the full collection's preload and mounted-layer readiness checks. Once warm, web hides an inactive slot from layout and painting after its existing 200 ms fade; the component stays mounted, retaining its flip state and warmed assets. Reselecting it makes it renderable immediately. Native slot behavior is unchanged until it can be assessed on devices. Card slots are memoized with stable load callbacks so selecting one card does not re-render every unaffected slot. Repeated asset module IDs are decoded only once during preload.

Jane's frame-breaking card used to mount the complete hair-and-scarf SVG rig twice: once above the frame and once in the lower-quarter clip. The hair, scarf and compass are entirely above that lower clip at the existing motion and tilt ranges, so the lower copy now displays the original still character image. The upper rig, motion, artwork and clipping stay the same. This reduces Jane's active rig count from two to one. Reassess the lower copy if any Jane motion is added near the lower quarter or its geometry/range changes.

In a same-session headless Edge test at 390 × 844, alternately forcing hidden slots to render versus suppressing them produced overlapping and noisy three-second frame-interval results. The test did **not** establish a reliable frame-rate improvement. It ran before the duplicate Jane rig was removed, and is not representative of a physical phone or normal GPU-accelerated browser. The changes remove identifiable duplicate work, but further profiling on the affected browser and hardware is required to determine remaining causes of lag.

For regression checks, wait for the preload overlay to clear; confirm inactive slots become hidden only after their fade, all cards reappear immediately, and flip state survives switching. Check active and reduced-motion evolutions, drag, startup and errors. Record frame times, dropped frames, interaction latency, image decode and GPU/memory use on representative hardware. Never trade away artwork, animation quality, preloading, lifecycle handling or the user's requested interactions for a benchmark number.
