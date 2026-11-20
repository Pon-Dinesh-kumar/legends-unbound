# Kala — Common card production plan

## Source and identity

Source: Edgar Rice Burroughs, *Tarzan of the Apes* (1912 magazine, 1914 book), [Project Gutenberg text](https://www.gutenberg.org/ebooks/78), consulted 20 November 2026. Kala is Tarzan's adoptive ape mother, described as powerful, intelligent, and protective. Base the character on this early novel, not any later film's distinctive design. Gutenberg identifies the text as public domain in the US; rights and trademarks elsewhere require separate review. Proposed stats: 2 cost, 3 power, subject to game design.

## Composition and package

Create an original, muscular adult female great ape with an expressive protective gaze and realistic fur, poised across a mossy branch in a protective gesture, not a reaching-hand pose. Use a distinct, misty high-canopy nest and cool morning lighting, with visible environment and badge-safe top corners. Match the collection's painterly animated-feature finish. Source canvas 1024×1536; no baked UI. Source-coordinate registered opaque environment, transparent complete character, transparent independent foreground, atmosphere and unique title, plus additional registered moving parts and finished underpaint as needed. Keep all environment inside frame. Design the silhouette to permit top/side frame break without collision with either badge; bottom remains clipped. Same rest scene, character, title and light-blue Common frame in every evolution; Origin static and clipped, Awakened static with character frame break, Unbound enables parallax and three tracks. Common border is shared, simple light blue, no border animation; retain stat readability and three integrated evolution gems.

## Three planned independent animation tracks

1. **Blink (revised):** a brief, independent eyelid close and open, with the face and body fixed. The original protective-hand concept was rejected after the composition review: the raised title obscures the hand, and the attempted underpaint did not preserve the wrist. Check the eyelids against the actual eye placement at full size and phone size; reject a flat patch or off-target closure.
2. **Canopy leaves:** independently painted leaf cluster anchored to the scene behind Kala, swaying in a slow breeze; overlapping painted branch beneath, no whole-background movement. Distinct period from hand motion; maintain the exact same rest position in all evolutions.
3. **Mist through the canopy:** localized continuous flowing mist, constrained to an existing bright opening behind the ape, with seamless repeating coverage and no hard edges, source appearing from nowhere or competing light sources. Same still rest appearance in lower evolutions. Not global zoom or an opacity-only flash.

Plan each loop's anchors, occlusion, underpainting and endpoint inspection before accepting art. If source registration or natural motion cannot be achieved, revise or mark the track incomplete; never substitute a visible seam or count imperceptible motion as finished.

## Integration and review

Register all required assets in the existing card catalog and preload graph; preserve selection, loading, flip, reduced motion and lifecycle. Verify every evolution at 320/390 px and desktop, inspect badge clearance and background coverage at drag extremes, capture loop endpoints and real-time player-sized motion, and run TypeScript checks. Review the assembled result for readable identity, unique scene, clean layering, no cropped face or gaps, meaningful three-track motion, frame visibility and smooth performance. Physical Android and sensor validation remains unverified until device access is available. Record selected generation prompts and assets and explicitly identify any unfinished gate.

## Prototype status — not complete

Initial art, unique title, Common frame and gem were generated with the built-in image generation tool and are integrated for preview. After user feedback the character and title were raised and the active gem was scaled to fit its socket. Prototype blink, independently anchored canopy leaves, and drifting mist have been added; the leaf and mist assets appear at rest in every level, with motion gated to Unbound. The hand underpaint candidate changed the wrist and was rejected. These are prototypes, not quality-approved tracks: full-loop, eye alignment and actual-device visibility/performance still need review. The current figure remains largely within the frame when Awakened, so the intended frame break is not yet achieved. A physical device and full-loop review remain outstanding.

Motion asset prompts, built-in image generation: (1) edit the exact ape character to close only her eyes naturally, preserving pose, scale and transparent canvas; (2) create a separate transparent jungle leaf cluster anchored at a short vine; (3) create a separate transparent soft cool-blue canopy mist wisp. The eye artwork is clipped to the eyes; the other two images are independent background layers. The rejected hand underpaint is not bundled. Browser checks observed all three tracks activating in Unbound and stopping under reduced motion, and the closed-eye composite was inspected; this does not substitute for full-loop or phone review.
