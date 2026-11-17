# Card asset generation and assembly

This guide defines the **target contract** for a reusable card-generation pipeline. The current Expo showcase is a prototype: its three cards are registered in `src/data/cards.ts`, and the Sherlock scarf and Dracula cape have card-specific code. Evolution variants, a manifest-driven renderer, and automated validation described below still need to be built. See [Rollout plan](#rollout-plan).

## One character, three evolutions

Every card family has three visually distinct versions of the same recognizable character. Preserve identity, palette, silhouette and story across the versions; increase costume detail, lighting, pose, environment and sense of power deliberately rather than merely recoloring the same image. Each evolution has its own complete, registered artwork. Shared assets may be referenced when they actually fit.

| Level | Art direction | Frame and movement |
| --- | --- | --- |
| **Origin** | Establish the character and setting in a clear, restrained composition. | All content, including the character and title, stays inside the frame. No idle animation, shimmer, glow pulse, parallax, gyro or drag tilt. The card back can be shown with an immediate state change. |
| **Awakened** | A more confident pose, stronger lighting and richer costume or environmental details. | The character may break the top and side edges of the frame. The character stays within the frame along the bottom quarter so the border is visible. No idle animation, shimmer, parallax, gyro or drag tilt; switching to the back is immediate. |
| **Unbound** | The most dramatic, fully realized version, still recognizable as the same character. | Character frame break follows the Awakened rule. Enable subtle interactive card tilt and layered parallax, plus **two or three independently authored, slow animation details per card**. Keep the approved title and frame shimmer; do not apply shimmer to the character. |

The large centered bottom title, top-left cost, top-right power and **one shared gold frame** are consistent across the collection. For Awakened and Unbound, a title may extend past the frame as in the approved prototype; it must not make the stats unreadable. Environment and decorative foreground remain clipped to the card. The character is drawn over the frame where frame break is allowed; in the bottom quarter the frame is drawn over the character. Do not generate a different border for each card.

Only Unbound has animation tracks. Each card family must supply two or three distinct, purposeful Unbound details, such as Sherlock's scarf and lens glint, Dracula's cape and a bat, or Tarzan's hair and a leaf. A foil sweep, moving the entire illustration, or duplicated translucent artwork does not count as a character or environmental animation detail. Origin and Awakened do not play these tracks. Reduced-motion mode displays a complete still pose and disables tilt, shimmer and animated tracks; interaction must remain usable.

## Shared visual and technical contract

- Follow the locked style, reusable prompt and approval checks in [ART_DIRECTION.md](../ART_DIRECTION.md) for every layer and evolution. Interpret original stories, comics or cartoons without copying existing logos or actor likenesses. Match the existing cards' illustrated finish rather than changing art styles per character.
- Compose in a portrait **2:3** reference space, preferably **1024 × 1536** pixels for generated source layers. Keep the camera, horizon, lighting direction and character proportions aligned for all layers of one evolution. Export transparent overlays as RGBA PNG with clean alpha; backgrounds are opaque PNGs. Do not bake the frame, title, cost, power, other text or UI into character/environment assets.
- Plan overflow before generation. Supply an explicit canvas-to-card transform and any extra transparent padding needed for top/side frame break. Do not stretch or crop independent layers differently. Record normalized placement, pivot and clipping bounds in the manifest, and preview at the final card size. The 2:3 reference rectangle is the card face; overflow lies outside it, not in an environment layer.
- Use a single consistent coordinate system per evolution. Every base, animation frame, mask and underpainting must register exactly at the declared dimensions and anchor. Avoid opaque backgrounds, accidental colored halos, baked checkerboards, shadows outside the intended silhouette, inconsistent edges, text and watermarks.
- A character and its animation pieces must form a complete image at every frame. Provide an underpainted base where a piece was removed, plus independently isolated moving pieces. Finish the surfaces that motion reveals. Keep faces, hands and other still details stable. Do not leave a hidden copy of the moving part behind it.
- Keep animation layers separated by depth: an item behind the character, an item in front, and effects behind the title are distinct layers when necessary. Character-attached animation inherits the character transform and clipping; environment details stay inside the frame. Do not move the whole card to simulate cloth or hair.
- Prefer small, seamless cycles with coherent silhouettes and consistent anchor points. Supply a still/rest frame and a loop that returns smoothly to it. Use either registered frame sequences or an explicitly authored deformable mesh/rig. Do not assume AI-generated frames are aligned: compare their attachment points, shapes, alpha, lighting and revealed underpainting. Avoid dissolve ghosting between visibly different silhouettes. Use separate frames where image blending creates doubles.
- Optimize and profile final assets on target devices. Reuse the shared frame and back; decode and load only what the active card/evolution needs while warming assets before display. Define a fallback still image, handle load failures, pause tracks for hidden cards and backs, and release resources when no longer needed. The current prototype eagerly preloads all cards; replacing that is planned work.

## Card package layout

This is the proposed source layout, not a claim about the current directory structure. Names are stable identifiers; file names are examples. A track can contain more than three frames when needed for a smooth result.

```text
assets/cards/<card-id>/
  card.ts                         # generated/maintained static registry entry
  title.png                       # shared if the title fits all levels
  origin/
    background.png
    character.png
    foreground.png                # transparent; may be an empty transparent asset
    effects.png                   # static visual accents only
  awakened/
    background.png
    character.png
    foreground.png
    effects.png
  unbound/
    background.png
    character-base.png            # completed beneath removed moving pieces
    foreground.png
    effects.png
    animation/
      scarf/
        rest.png
        frame-00.png
        frame-01.png
        frame-02.png
      lens-glint/
        rest.png
        frame-00.png
        frame-01.png
        frame-02.png
assets/cards/shared/
  frame-v3.png                    # same front frame for every card and level
  back-sherlock.png               # current shared prototype back
```

Each evolution needs a background, character, foreground and effects layer, even if a transparent layer has no visible content. Its manifest must describe the canvas size, layer asset references, order, fit and placement, overflow/clipping rules, and title placement. Each Unbound animation track must also specify a unique id, kind (frame sequence or rig), depth relative to the character and frame, rest pose, ordered frames, timing and loop behavior, anchor/registration and any mask. Animation layers are transparent, registered to the same canvas, and stay together with their owning layer during tilt and flip.

## Manifest contract and insertion

Use a typed **static TypeScript registry** for bundled Expo assets: Metro needs statically analyzable `require('literal/path.png')` calls. The schema below is illustrative; the types, fields, and generic renderer are **not implemented yet**. A future external pipeline can generate this registry from a validated source manifest. Do not rely on dynamic string-based `require()` paths at runtime.

```ts
// Proposed shape, abbreviated: all three evolution entries are required.
const card = {
  id: 'sherlock',
  name: 'SHERLOCK HOLMES',
  energy: 3,
  power: 4,
  rarity: 'EPIC',
  title: require('./title.png'),
  evolutions: {
    origin: {
      canvas: { width: 1024, height: 1536 },
      layers: {
        background: require('./origin/background.png'),
        character: require('./origin/character.png'),
        foreground: require('./origin/foreground.png'),
        effects: require('./origin/effects.png'),
      },
      // Include normalized transforms and clipping policy in the real schema.
      animations: [],
    },
    awakened: { /* same required layer and placement fields; no animation tracks */ },
    unbound: { /* same fields; two or three complete animation tracks */ },
  },
};
```

In the target pipeline, adding a card should require supplying its package and registry entry, then running validation and adding the entry to the catalog—not adding `if (card.id === ...)` branches to rendering or preload code. The renderer chooses a level policy, builds the shared composition from the registry, and derives readiness from the assets actually needed for that package. It must not use a fixed global count of loaded layers. Define explicit `loading`, `ready`, and `error` states; count each required asset once even if mounted in multiple clips, and never reveal a half-loaded character or animation.

## Layer order and frame break

Render each face in this order, with layers sharing their declared coordinate space:

1. Card backing, clipped environment background and clipped foreground/effects.
2. Character portions and their animation pieces that belong behind the frame, including the bottom quarter.
3. The shared frame and its permitted Unbound treatment.
4. Character portions and attached animation pieces allowed to break the top and side edges. Keep the lower quarter clipped and behind the frame.
5. Large title, cost and power. Keep the numbers readable; the title remains above the art. Apply the approved Unbound title shimmer to the title itself.

Place animation pieces at the correct depth within this order. A cape behind a body is rendered behind the body, not on top of a hand; a scarf in front of a coat is above it. The character and its pieces move together with interactive parallax. The back is a separate face and must not leak front layers during flip. Origin/Awakened use their static policies and never run the Unbound animation clock.

## Generation and review workflow

1. Create a character brief covering source inspiration, identity, costume, palette, setting, signature details and the intended visual progression across all three levels. Select two or three Unbound actions before generating assets; identify their layer depth and where revealed art must be completed.
2. Establish a full composition and register each level's separate background, character, foreground, effects and title. Supply each generator the fixed 2:3 framing, lighting, coordinates, transparency and no-UI constraints. Keep original sources and prompts alongside deliverables or in the production record.
3. For every animated piece, prepare a clean base with the moving part removed and finish anything revealed. Produce the separate rest pose and aligned loop frames, or an authored rig. Compare anchors against the base in each frame and inspect alpha against light and dark backgrounds. Avoid adding an animated overlay on top of a baked-in copy.
4. Add the package to the static registry. Validate complete required levels and fields, valid asset references, expected dimensions and alpha, exactly two or three Unbound tracks, nonempty frames, valid timing, consistent registration and allowed frame-break region. Report actionable errors before a card enters the catalog.
5. Render the three evolutions at actual phone card size and inspect corners, character/title/stat layering, bottom-quarter clipping and face/back transition. Inspect the entire loop, not just the first frame; check for seams, duplicates, detached fabric, flicker, inconsistent shapes and overly subtle movement. Verify tilt, preloading, errors and reduced motion.
6. Test on representative iOS and Android devices as well as web: measure frame pacing, memory and load time with one and multiple cards, confirm only the selected Unbound front animates, and confirm switching levels/cards and flipping pause/resume cleanly. Set and record device-specific budgets based on measurements before scaling content. Bundle/export success alone is not a device performance test.

## Rollout plan

1. **Define the contract:** add typed card-family, evolution, layer and animation definitions; specify coordinates, frame-break limits, rest poses, required fields and validation errors. Treat this document as the acceptance criteria, not the current implementation.
2. **Build the shared renderer:** replace card-id-specific branches and the fixed preload count with a manifest-driven compositor and asset readiness tracking. Preserve the existing shared frame, frame-break ordering, title shimmer, stats and back. Implement the three interaction policies and a reduced-motion still fallback.
3. **Migrate Sherlock first:** preserve the accepted Unbound scarf as one track, prepare a second distinct detail such as a restrained lens glint, then create visually evolved Origin and Awakened artwork and their manifest entries. Inspect the registered frames and attachment at phone size before declaring the package reusable.
4. **Migrate Dracula next:** adapt the cape prototype as one Unbound track, add one or two separately authored details, and produce Origin and Awakened artwork. Verify the cape remains behind the hand/body and the lower frame remains visible.
5. **Migrate Tarzan:** create all three levels and two or three Unbound tracks, such as hair and a separate leaf, with completed underpainting and independent depth. Register him using the same contract without modifying renderer logic.
6. **Automate the pipeline:** add a package validator and a registry generator for static `require` calls, plus a preview/review flow for each level and animation. Add meaningful tests for schema rejection, policy selection, load/error states, clipping and track lifecycle. Then profile representative devices and refine asset budgets before generating more cards.

The existing scarf and cape are early prototypes with three cross-faded overlays each, not finished examples of the full contract. Neither has yet been validated as a complete two- or three-track Unbound card, and the existing cards do not yet have Origin/Awakened variants.
