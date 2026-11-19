# Dracula animation redesign

## Status and goal

The bat and crimson spell experiments were removed: their compositing and motion did not belong to the illustration. Dracula currently has **one** card-specific animated piece, the existing cape; the required three-piece standard is not yet met. The work below is a design and production plan, not an implemented animation or an approved visual result.

## First cuff prototype: rejected

An image-generation edit produced an underpaint candidate (rejected and not included in the runtime) using the prompt: “Remove only the dangling white ruffled fabric beneath the outstretched hand and continue the dark crimson cape behind it; keep the hand, character, original placement and transparent alpha unchanged.” Two attempts to extract the original ruffle as a separately registered transparent image changed its shape and placement and added a visible glow, so neither is usable. A browser-only mask-and-shear proof using the original painted cuff and the underpaint was also rejected: the [rest composite](prototypes/dracula-cuff/rest-composite.png) has a fine seam and the [moving composite](prototypes/dracula-cuff/moving-composite-rejected.png) exposes cut edges and red slivers. These artifacts are not loaded by the game.

The next attempt needs an accurately isolated original cuff and a seamless painted base at its attachment; a loose polygon, independently regenerated cutout or simple shear cannot meet the acceptance gate. Do not advance to the hair or add either track to the renderer until the cuff composite and loop pass the visual checks below.

Build two more motions from details already painted on Dracula. Their resting pose must exist in Origin, Awakened and Unbound in the same place **relative to the character**. Only their motion unlocks in Unbound. The character is intentionally fitted differently between Origin and the frame-breaking levels, so the artwork and every attached piece must share the exact same character transform; fixed screen or card coordinates would make the pieces detach when the level changes.

## Two proposed pieces

1. **Hair lock:** isolate a visible outer lock at the left edge of his swept hair, behind the head. Its root stays fixed at the scalp while its free end bends a few pixels. Keep the face, eyes, head and collar still. Confirm the chosen lock is readable at the smallest target card size before production; do not animate the whole head or hair mass.
2. **Outstretched-hand cuff:** isolate the loose lower portion of the white ruffled cuff on his extended hand. Anchor the fabric at the wrist and let the free tip flex gently, with a slight delayed response to the cape. Keep fingers and hand completely still; preserve their overlap in front of the cloth. Choose the exact seam only after inspecting the full-resolution original and occlusion.

These are independent of the cape and each other. They are not floating effects, whole-card motion, an opacity flash, a single-image scale, or a sequence of independently generated shapes cross-faded over the original artwork. If either candidate cannot be isolated cleanly or read at mobile size, revise the choice before implementation; do not ship a barely visible or detached detail.

## Technique comparison and recommendation

| Technique | Fit for this card | Decision |
| --- | --- | --- |
| Registered hand-authored frame loop | Painterly material and precise occlusion; higher asset and authoring cost. Proper in-betweens can bend individual strands and folds. | **First prototype:** isolated cuff, finished underpainting, and a registered 12–24-pose loop authored from the same rest art. Start at 12 fps, then judge motion rather than treating frame count as a quality guarantee. |
| Segmented transforms in the existing React Native/Reanimated stack | Native interpolation and a modest runtime footprint; rigid pieces cannot convincingly bend soft fabric or hair. | Use for anchors, timing and small supporting motion only; do not substitute scaling or rotating the entire image for cloth deformation. |
| Textured mesh / bone rig | Continuous deformation and reusable controls; requires careful weights, seams, runtime support and a real authoring workflow. | Investigate for the hair only after the cuff proves the asset separation. Build and measure a small cross-platform spike before adding a dependency. |
| Rive raster mesh and bones | Dedicated rig authoring and runtimes, but adds tooling, native dependencies and a separate web integration to validate. | Candidate for the pipeline, not an automatic dependency. Verify feature support, web/Expo integration and device performance first. |

Reanimated already runs the current card interactions and supports animating non-layout properties; its [performance guidance](https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/) recommends preferring transforms and opacity to layout changes. [Rive's character-animation documentation](https://rive.app/use-cases/character-animation) describes its mesh and bone tools, and its [React Native runtime documentation](https://rive.app/docs/runtimes/react-native/react-native) lists additional platform and dependency requirements. Neither reference establishes that a particular runtime will work in this project without a spike.

## Asset and renderer contract

- Work from Dracula's existing 1024 × 1536 character composition and the actual `character-cape-base.png` / cape stack. Preserve the approved identity, silhouette, color and lighting. Never regenerate a different Dracula for an evolution.
- For each piece, deliver a registered transparent rest image, an editable mask and a finished character base with the moving piece removed and the exposed coat/hair/background fully painted. Deliver an explicit foreground occlusion layer where a hand or other feature must cover the animated piece. The rest composite must match the existing character at the same coordinates without doubled edges, holes, color jumps or blurry joins.
- Author distinct in-between drawings or a real weighted mesh from the same separated artwork. Keep the attachment region pinned and deform the free end; interpolate the underlying shape, not unrelated generated silhouettes or duplicate transparent images. Use a loop that returns to the same pose and velocity with no end-frame pop. Record frame timing, anchors, layer order and the editable source.
- Mount each piece **inside the same `renderHero` coordinate space and transform as the character**, including both its Origin and frame-break render paths and the lower-quarter clipping. Define anchors in source-image coordinates, not viewport coordinates. Respect the current cape's behind-body ordering and the front-of-frame character rule; background and effects never break out of the border.
- Draw the same rest pose in every level and under reduced motion. Animate only on the selected Unbound front; stop and reset safely on level change, selection change, back face, unmount and reduced motion. Preload and decode the base, rest, occlusion and all required frames before displaying the collection. Extend the current readiness accounting rather than relying on images first mounted after selecting Unbound.
- Preserve flip, tilt, parallax, frame/gem effects, title/stat readability and other cards. No shimmer over Dracula's character and no rectangular shadows or unintended scenery outside the border.

## Production and acceptance gates

1. Capture a baseline for all three levels at desktop and mobile card size. Annotate the chosen cuff and hair attachment points on the actual character artwork, then prepare clean underpainting and a rest composite. Compare rest composites against the existing art before animating.
2. Produce **only the cuff** first. Scrub each pose on a contrasting temporary backdrop and on the real artwork at 200–400% zoom. Check the wrist anchor, hand occlusion, no doubling, no cut line, no stretching of the hand and no uncovered gap. Review the loop in real time and frame by frame, including the loop boundary.
3. Mount the cuff in the shared hero space. Compare Origin, Awakened and Unbound rest poses at the same character-relative location; test drag, frame break, flip, card switch, preload failure and reduced motion. Show a recorded loop and inspect the actual render at a narrow mobile viewport, then test on real iOS and Android hardware for frame pacing, memory and startup.
4. Only after the cuff passes, repeat the same isolation, underpainting and loop checks for one hair lock. Tune both pieces together with the cape so their timing feels related without moving the face or body. Repeat the complete device and accessibility checks with all three tracks active.
5. Mark Dracula complete only after all three tracks and their asset sources pass review. Sherlock and Tarzan still need their own missing tracks. No replacement bat, detached particle, temporary stand-in, unreviewed cross-fade or unsupported quality claim belongs in the shipping card.
