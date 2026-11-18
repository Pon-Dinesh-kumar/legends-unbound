# Card asset generation and assembly

This guide describes the current evolution behavior and the target asset contract for a reusable card-generation pipeline. The locked visual style and reusable prompt are in [ART_DIRECTION.md](../ART_DIRECTION.md). The level selector is implemented; the generic manifest-driven renderer, validation and asset pipeline remain future work.

## One character, three evolutions

Generate **one shared set of artwork per card**. Origin, Awakened and Unbound use the same character, costume, pose, environment, title, stats, palette and shared border. Do not generate separate character or background art for an evolution. The visual difference comes from clipping, frame break and motion.

| Level | Presentation |
| --- | --- |
| **Origin** | The character, environment and title stay inside the shared frame. The card itself can tilt slightly left and right; its layers stay flat together. No automatic animation, shimmer or parallax. The back opens immediately. |
| **Awakened** | The same character may break above and beside the frame; the environment remains clipped and the bottom quarter of the character stays behind the frame. The title may extend beyond the frame. The card itself can tilt slightly left and right; its layers stay flat together. No automatic animation, shimmer or parallax. The back opens immediately. |
| **Unbound** | The same frame break as Awakened, plus subtle interactive tilt, layered parallax, title/frame shimmer and any available character animation tracks. Character shimmer remains disabled. |

The same `frame-v3.png` is used at every level. Cost remains top-left, power top-right, and the large name bottom-center. A shared three-diamond marker is integrated directly into the center of the bottom frame edge, with no separate capsule: one filled for Origin, two for Awakened, and all three filled and gently shining for Unbound. The other diamonds remain dark, with visible outlines. The marker belongs to the card UI, above the art and title, and does not require new card-specific assets. In Awakened and Unbound the character is above the frame at the top and sides, while the lower quarter remains clipped behind it so the border is visible. Environment and foreground do not break the frame. The title may extend past the frame in Awakened and Unbound, but must stay inside in Origin.

All levels can show the shared back. Reduced-motion mode keeps a complete still pose and disables tilt, shimmer and character animation. Preserve access to the flip control. Changes apply to every existing card: Sherlock currently has a scarf animation, Dracula a cape animation, and Tarzan no character-specific animation. Only the active Unbound front runs its character track. The goal for **future complete Unbound cards** is two or three distinct, independently authored details; do not claim the current prototypes meet that target or fabricate missing assets.

## Current implementation

- `src/data/evolutions.ts` defines the level labels and the frame-break and motion policies. `App.tsx` owns the selected level and passes it to every card. The selection is shared across the current collection and defaults to Origin.
- `src/components/LayeredCard.tsx` composes the same art for all levels. Origin uses a rounded clip behind the frame; Awakened and Unbound use upper frame-break and lower clipped portions. All levels allow a small card-only horizontal tilt, but only Unbound adds independent gesture/gyro parallax and the selected front's existing scarf/cape track. Origin and Awakened flip without a turn animation.
- `src/components/CardFrame.tsx` keeps the shared frame and stat gems; Origin fits the same title inside the frame. Title and frame shimmer are enabled only for Unbound when reduced motion is off.
- `src/hooks/preloadCardAssets.ts` preloads the current collection, including the rest/animation images. `App.tsx` currently tracks the mounted image callbacks with a fixed count; a manifest-based readiness system remains planned. Keep all frame callbacks working when adding assets.

## Shared visual and technical contract

- Use [ART_DIRECTION.md](../ART_DIRECTION.md) for the fixed collection style, character inspiration and approval criteria. Follow it for backgrounds, character parts and animation frames alike.
- Work in portrait **2:3**, preferably **1024 × 1536** pixels. Backgrounds are opaque; character, foreground, effect, title and animation overlays are transparent RGBA PNGs. Do not bake borders, UI, text, cost or power into the art.
- Register every layer, underpainting and animation frame to the same card coordinate space. Plan top/side overflow with transparent padding and explicit placement; never let an environment layer overflow. Preserve the original shared character and setting across levels.
- Each independently moving detail needs a finished base beneath it, a clean isolated rest pose and a smooth registered loop or authored rig. Keep faces and hands fixed where they are not intended to move. Do not animate a translucent duplicate over a baked-in moving piece. Preserve silhouette, lighting and attachment throughout the loop; inspect for ghosting, seams and flicker.
- Keep attachment depth explicit: for example, Dracula's cape belongs behind his body and hand, while Sherlock's scarf lies in front of his coat. Attached pieces must follow the character transform, obey the level's clip, stop on the back and respect reduced motion.
- Reuse the same shared front frame and current shared back. Preload and decode needed assets before showing a card, handle load errors, and stop unused animation. Verify performance and memory on real target devices; an export is not a device test.

## Proposed plug-and-play package

The following layout and manifest are a **future pipeline design**, not current runtime behavior. The package has one set of still artwork, not one folder of different artwork per level. A track can contain as many frames as needed for a clean loop.

```text
assets/cards/<card-id>/
  card.ts                      # future static registry entry
  background.png
  character.png               # complete still artwork, or the composited rest pose
  character-base.png          # finished underpainting if a track needs it
  foreground.png
  effects.png
  title.png
  animation/
    <track-id>/
      rest.png
      frame-00.png
      frame-01.png
      frame-02.png
assets/cards/shared/
  frame-v3.png
  back-sherlock.png
```

The future typed registry should declare card metadata, stat values, each shared layer, canvas dimensions, placement and clipping, plus optional animation tracks with depth, anchors, masks, rest pose, ordered frames, timing and loop behavior. Evolution behavior should come from a shared policy, not duplicated card art or per-card rendering branches. Expo's Metro bundler requires statically analyzable `require('literal/path.png')` calls; generate a static TypeScript registry from validated source manifests rather than using dynamic runtime `require()` paths.

The renderer should derive readiness from each package's actual required assets, deduplicate repeated mounts, and provide loading, ready and error states. A new card should be added by supplying validated art and a registry entry, without editing compositor logic. This is not yet implemented.

## Generation and review workflow

1. Prepare one card brief covering source inspiration, identity, palette, setting and signature details. Follow the locked collection style. Design one composition that works both inside the Origin frame and with Awakened/Unbound top and side frame break.
2. Generate and register one set of background, character, foreground, effects and title assets. Separate any desired Unbound moving pieces from the static character and finish the underpainting. Keep prompts and source files with the production record.
3. For future complete Unbound cards, plan two or three distinct details. Supply aligned rest poses and loop frames or a rig with explicit anchors and depth. A foil sweep or a drifting full illustration is not a character animation detail. Do not require additional artwork for the three levels themselves.
4. Validate asset references, dimensions, alpha, shared coordinate space, attachment, loop timing and clipping. Check for no text or frame baked into the art and for a shared border. Reject detached or duplicated pieces and inconsistent frame shapes.
5. Preview all levels at phone card size: verify Origin stays inside the frame; Awakened only unlocks frame break; Unbound adds motion without moving the whole image or changing the art. Check title/stat readability, the bottom-quarter border, all loop poses, card switching, flip, loading/error behavior and reduced motion.
6. Test on representative iOS and Android devices as well as web. Measure frame pacing, memory and load time; verify tracks pause on inactive cards and on the back. Record budgets based on device measurements before scaling the catalog.

## Next pipeline work

1. Replace the hard-coded card-specific scarf/cape branches and fixed preload count with a typed package registry and generic compositor; keep the implemented shared evolution policies.
2. Migrate Sherlock and Dracula's existing artwork and animation tracks into the registry without regenerating level artwork. Review the current three-frame cross-fades for visual artifacts.
3. Add missing independently authored details only when creating or improving an Unbound card; the current two prototype tracks and Tarzan's static art are valid existing content, not a completed two-to-three-track catalog.
4. Add package validation, generated static imports, tests for level policy and asset lifecycle, and an actual device performance review before scaling production.
