# Card asset generation and assembly

This guide describes the current evolution behavior and the target asset contract for a reusable card-generation pipeline. For a name-only request follow the complete [card generation pipeline](CARD_GENERATION_PIPELINE.md), including planning all three animations before generating any art. The locked visual style and reusable prompt are in [ART_DIRECTION.md](../ART_DIRECTION.md). The level selector is implemented; the generic manifest-driven renderer, validation and asset pipeline remain future work.

## Legendary border, rarity and effects

- Plan for four rarities. Legendary is the rarest and is identified by its universal polished gold border. The other three rarities and their borders are not designed or named yet.
- The border alone communicates rarity. Do not use different character art, costumes, colors, titles, stats, character animation, evolution behavior or a separate rarity label to signal rarity. Reuse one border per rarity across characters and evolutions; never generate a border for each character. Evolution is independent of rarity and is shown by the frame's three diamond sockets.
- The approved Legendary frame is `assets/cards/shared/frame-legendary-v5.png`: sculpted layered gold, beveled corners, integrated blue Cost and crimson Power shields, and three integrated bottom-center diamond sockets. Use separate white stat numbers and active gem overlays, registered to the frame. Only the evolution gems animate; keep the Cost and Power shields and their numerals free of frame effects.
- On the selected card front at **every** evolution level, use a clearly visible but smooth breathing gold reflection, a horizontal sweep across the top rail, a brighter sweep down the side edges, occasional star-like glints and gently pulsing faceted reflections on filled gems. Play a short brighter reveal on selection, evolution change or return to the front. Keep the effects on the metal or gems, with the top sweep behind any frame-breaking character; avoid rectangular glow, character shimmer, or outside background/shadow. Pause them on inactive cards and the back, and disable them for reduced motion.
- Origin and Awakened retain static character/environment layers; Unbound unlocks character animation and parallax. Legendary frame animation is shared UI, not a character animation track, and does not count toward the required three authored details per complete Unbound card.

**Prototype limitation:** the current renderer always uses the Legendary gold frame, even though Sherlock's existing data and selection label say `EPIC`. Additional rarity borders and border-based selection are not implemented. The selector currently displays rarity text; remove that indicator when the border-only rarity system is implemented. Do not infer the final non-Legendary rarity names or visual designs from this placeholder.

## One character, three evolutions

Generate **one shared set of artwork per card**. Origin, Awakened and Unbound use the same character, costume, pose, environment, title, stats, palette and shared border. Do not generate separate character or background art for an evolution. The visual difference comes from clipping, frame break and motion.

| Level | Presentation |
| --- | --- |
| **Origin** | The character, environment and title stay inside the shared frame. The card itself can tilt slightly left and right; its layers stay flat together. No character, environment or title animation or parallax; the shared Legendary frame and active gems animate. The back opens immediately. |
| **Awakened** | The same character may break above and beside the frame; the environment remains clipped and the bottom quarter of the character stays behind the frame. The title may extend beyond the frame. The card itself can tilt slightly left and right; its layers stay flat together. No character, environment or title animation or parallax; the shared Legendary frame and active gems animate. The back opens immediately. |
| **Unbound** | The same frame break as Awakened, plus subtle interactive tilt, layered parallax, title/frame shimmer and any available character animation tracks. Character shimmer remains disabled. |

The shared Legendary frame at every level has a slow gold breathing reflection, separate top-rail and side-edge light sweeps, occasional corner glints, and a gentle pulse over the active faceted gems. A brief brighter accent plays when the active card is selected, its evolution changes, or the front returns after a flip. Keep the effects on the frame and sockets, without a rectangular glow or character shimmer. Stop the idle and reveal effects for a hidden card or back face and respect reduced motion. The blue Cost and red Power shields remain free of these effects; the top sweep stays behind any frame-breaking character. These shared UI effects do not replace authored character animation details.

The same `frame-legendary-v5.png` is used at every level. Cost remains top-left, power top-right, and the large name bottom-center. The shared frame has integrated matching gold-rimmed shields, blue for cost and crimson for power; render the white stat values separately over their centers and keep the shields above frame-breaking characters. Frame and active evolution-gem effects run at every level and honor reduced motion; the Cost and Power shields remain static. Three faceted diamond sockets are built into the bottom frame edge: one filled for Origin, two for Awakened, and all three filled for Unbound; active gems gently shine at every level. The other sockets remain dark obsidian with gold outlines. Active gem overlays and stat values must register exactly to the shared frame's sockets; if the frame image or its fit changes, update and verify their coordinates together. The marker belongs to the shared card UI, above the art and title, and does not require new card-specific assets. In Awakened and Unbound the character is above the frame at the top and sides, while the lower quarter remains clipped behind it so the border is visible. Environment and foreground do not break the frame. The title may extend past the frame in Awakened and Unbound, but must stay inside in Origin.

All levels can show the shared back. Reduced-motion mode keeps a complete still pose and disables tilt, shimmer and character animation. Preserve access to the flip control. Changes apply to every existing card: Sherlock currently has a scarf animation, Dracula a cape animation, and Tarzan no card-specific animation. Only the active Unbound front runs its card-specific tracks. Every complete card must have **exactly three distinct, independently authored animated pieces** for Unbound. They may be clothing, hair, a prop, a localized magical effect or a specific environmental element. Existing incomplete prototypes are not exempt from the requirement and must not be described as complete.

An animated detail's rest pose must be part of the same artwork at every evolution level, anchored to the same source-image coordinates and character transform. Motion unlocks in Unbound; pieces must not appear from nowhere, detach, jump or reveal a duplicated painted piece. Dracula's specific candidates, techniques and review gates are in [the redesign plan](DRACULA_ANIMATION_REDESIGN.md).

## Current implementation

- `src/data/evolutions.ts` defines the level labels and the frame-break and motion policies. `App.tsx` owns the selected level and passes it to every card. The selection is shared across the current collection and defaults to Origin.
- `src/components/LayeredCard.tsx` composes the same art for all levels. `FrameInterior` follows the shared frame's beveled outline to clip the background, foreground and lower character without a rectangular shadow or scenery outside the frame. The title has no separate dark shading layer over the border. Origin fits the character inside that outline with enough headroom; Awakened and Unbound use upper frame-break and lower clipped portions. All levels allow a small card-only horizontal tilt, but only Unbound adds independent gesture/gyro parallax and the selected front's existing card-specific tracks. Origin and Awakened flip without a turn animation. Recheck the interior mask whenever the shared frame changes.
- `src/components/CardFrame.tsx` keeps the shared frame and stat gems; Origin fits the same title inside the frame. Frame and active evolution-gem effects run on the selected front at every level; title shimmer is limited to Unbound. All respect reduced motion, and stat shields remain static.
- `src/hooks/preloadCardAssets.ts` preloads the current collection, including the rest/animation images. `App.tsx` waits for the named required mounted layers of each card rather than a fixed count. Add new animation layers to both lists until a unified manifest-based readiness system is implemented; keep all image callbacks working.

## Shared visual and technical contract

- Use [ART_DIRECTION.md](../ART_DIRECTION.md) for the fixed collection style, character inspiration and approval criteria. Follow it for backgrounds, character parts and animation frames alike.
- Work in portrait **2:3**, preferably **1024 × 1536** pixels. Backgrounds are opaque; character, foreground, effect, title and animation overlays are transparent RGBA PNGs. Do not bake borders, UI, text, cost or power into the art.
- Register every layer, underpainting and animation frame to the same card coordinate space. Plan top/side overflow with transparent padding and explicit placement; never let an environment layer overflow. Preserve the original shared character and setting across levels.
- Each independently moving detail needs a finished base beneath it, a clean isolated rest pose and a smooth registered loop or authored rig. Keep faces and hands fixed where they are not intended to move. Do not animate a translucent duplicate over a baked-in moving piece. Preserve silhouette, lighting and attachment throughout the loop; inspect for ghosting, seams and flicker.
- Keep attachment depth explicit: for example, Dracula's cape belongs behind his body and hand, while Sherlock's scarf lies in front of his coat. Attached pieces must follow the character transform, obey the level's clip, stop on the back and respect reduced motion.
- Reuse the shared front frame for the card's rarity and the current shared back. The prototype currently provides only the Legendary frame. Preload and decode needed assets before showing a card, handle load errors, and stop unused animation. Verify performance and memory on real target devices; an export is not a device test.

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
  frame-legendary-v5.png
  back-sherlock.png
```

The future typed registry should declare card metadata, rarity, stat values, each shared layer, canvas dimensions, placement and clipping, plus three required animation tracks with depth, anchors, masks, rest pose, ordered frames, timing and loop behavior for a complete card. Select a shared frame by rarity and evolution behavior from a shared policy, not duplicated card art or per-card rendering branches. Expo's Metro bundler requires statically analyzable `require('literal/path.png')` calls; generate a static TypeScript registry from validated source manifests rather than using dynamic runtime `require()` paths.

The renderer should derive readiness from each package's actual required assets, deduplicate repeated mounts, and provide loading, ready and error states. A new card should be added by supplying validated art and a registry entry, without editing compositor logic. This is not yet implemented.

## Generation and review workflow

1. Before any generation, complete the full brief, layer map, test plan and exactly three distinct Unbound animation plans in the [pipeline](CARD_GENERATION_PIPELINE.md#2-plan-all-three-animations-before-generating-assets). Design one composition that works inside Origin and with Awakened/Unbound top and side frame break.
2. Generate and register one set of background, character, foreground, effects and title assets. Separate all three planned pieces from the static character and finish the underpainting. Keep prompts and source files with the production record.
3. Supply the three aligned rest poses and authored loops or rigs with explicit anchors and depth. A localized authored magical or environmental effect can count as a piece; a shared border/title foil sweep or a drifting full illustration cannot. Do not require additional artwork for the three levels themselves.
4. Validate asset references, dimensions, alpha, shared coordinate space, attachment, loop timing and clipping. Check for no text or frame baked into the art and for a shared border. Reject detached or duplicated pieces and inconsistent frame shapes.
5. Preview all levels at phone card size: verify Origin stays inside the frame; Awakened only unlocks frame break; Unbound adds motion without moving the whole image or changing the art. Check title/stat readability, the bottom-quarter border, all loop poses, card switching, flip, loading/error behavior and reduced motion.
6. Test on representative iOS and Android devices as well as web. Measure frame pacing, memory and load time; verify tracks pause on inactive cards and on the back. Record budgets based on device measurements before scaling the catalog.

## Next pipeline work

1. Replace the hard-coded card-specific scarf/cape branches and separate preload/readiness lists with a typed package registry and generic compositor; keep the implemented shared evolution policies.
2. Migrate Sherlock and Dracula's existing artwork and animation tracks into the registry without regenerating level artwork. Review the current three-frame cross-fades for visual artifacts.
3. Complete the three-piece requirement for every card; Sherlock and Tarzan remain incomplete until their missing tracks are implemented and reviewed.
4. Add package validation, generated static imports, tests for level policy and asset lifecycle, and an actual device performance review before scaling production.
