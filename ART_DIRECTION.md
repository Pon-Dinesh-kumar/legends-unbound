# Legends Unbound — locked collection art direction

This is the **style source of truth** for every future card and all three evolutions. Pair it with the [asset and assembly contract](docs/CARD_ASSET_GUIDELINES.md). The existing Tarzan, Sherlock and Dracula cards are visual references for the intended finish, not templates to copy literally. When an asset conflicts with the locked style, revise the asset; do not change the shared style for an individual card.

## Fixed visual style

Create premium, illustrated fantasy-adventure collectible cards with the polished look of a hand-painted animated feature. Forms have a subtle 2.5D sense of depth: modeled volumes, convincing materials and dimensional lighting, while the result remains clearly illustrated. Use clean, purposeful silhouettes, controlled painterly brushwork, fine material texture and soft transitions between light and shadow. Keep the character immediately readable at phone card size.

- **Characters:** expressive, appealing, anatomically believable stylized proportions with clear eyes and distinctive silhouettes. Human characters should look like illustrated people, not photographs; adapt anatomy appropriately for creatures. Define the face, hair, hands and signature costume with care. Avoid grotesque distortion, exaggerated cartoon caricature and generic faces.
- **Materials and detail:** render cloth folds, hair, leather, metal and stone with tactile but restrained texture. Prioritize broad readable shapes first, then selective fine detail around the face, hands and signature object. Avoid noise, plastic gloss, flat vector fills, heavy comic halftones and busy edge detail.
- **Light and color:** use cinematic, directional key light, softly modeled shadows and a controlled warm/cool contrast, with a narrow rim light to separate the subject from the setting. Record the chosen light direction and palette in each card brief and keep them consistent across that card's layers and animation frames. Use rich, coherent colors and deep but readable shadows; reserve the brightest highlights for the focal subject and shared gold frame. Do not apply a blanket gold tint, neon glow or washed-out filter.
- **Composition and depth:** use a portrait 2:3 card face and a clear single-subject focal hierarchy, with a readable foreground character, supporting midground and atmospheric background. Keep the face and signature object unobstructed by stats and the large bottom title. Frame-break character portions are planned as separate transparent artwork; scenery and visual effects remain inside the card. Avoid baked-in perspective card mockups or cropped hands/faces.
- **Finish:** subtle cinematic depth and atmospheric separation, crisp important edges and softly painted background detail. Do not switch between anime, photorealism, pixel art, chibi, flat vector, comic-ink or a different 3D-render style from one card to another. Do not over-sharpen or render an image as a photograph of a physical card.

Interpret identifiable characters using the original stories, comics or cartoons as inspiration, with an original visual treatment and no actor likeness or reproduced logo. Names should be recognizable to the source, not invented themes. Use the existing approved color identities as references: Tarzan—emerald and sunlit gold; Sherlock—smoky blue and amber; Dracula—midnight violet and crimson. Other characters may have their own coherent palette while retaining the same finish, contrast and material rendering.

## Shared frame, title and evolution consistency

Use the same shared gold frame asset for every card and level, not generated character-specific borders. Keep cost at top left, power at top right and a large, legible character-specific title at bottom center. Wordmarks may draw on the source's visual history while retaining the collection's dimensional illustrated finish; do not reproduce an existing logo. Do not add other text inside the card. Frame, numbers and title are independent layers, never baked into character/environment art. The current front frame is `assets/cards/shared/frame-legendary-v4.png`; the Sherlock-inspired back is a shared prototype, not a per-character requirement.

Origin, Awakened and Unbound use **the same character, costume, pose, environment, title and shared frame artwork**. Do not generate different character art for an evolution. Origin is entirely inside the frame. Awakened reveals the same character beyond the top and side edges. Both allow a slight card-only left-right tilt, with no independent layer motion. Unbound retains that frame break and enables interactive parallax and the card's existing animation details; the bottom quarter of the character remains behind the frame. The shared frame's bottom-center three-diamond marker fills one, two or three cells for Origin, Awakened and Unbound respectively, with a gentle shine for Unbound. Two or three independently authored Unbound animation details per future card are a content target, not a claim that all current cards have them. The full behavior, title overflow and reduced-motion rules are defined in [the asset contract](docs/CARD_ASSET_GUIDELINES.md#one-character-three-evolutions).

## Reusable generation prompt

Use this fixed style block in every character, environment, foreground and animation-asset prompt. Add a card-specific brief after it; do not replace the style block with a different aesthetic.

> Legends Unbound collectible-card illustration, premium hand-painted animated-feature fantasy adventure, coherent stylized anatomy and expressive faces, clean readable silhouette, dimensional painterly shading, fine tactile material detail, cinematic directional light and restrained rim highlights, rich controlled color, readable deep shadows, atmospheric layered depth, polished 2.5D illustrated finish. Portrait 2:3 card composition, no card border, no text, no logos, no UI, no watermark; not a photo, anime, pixel art, flat vector, chibi, heavily inked comic or physical-card mockup.

Append: **character and source inspiration**, signature pose/costume/object, card-specific palette and light direction, asset role, crop/anchor, and whether the background must be opaque or genuinely transparent. Design one shared composition for all three levels. For an animation frame, also include the fixed reference canvas, unchanged attachment position, exact rest-frame registration and the one specific moving piece. Generate separate underpainting and animation pieces as described in the asset contract; a prompt alone does not guarantee alignment or clean transparency.

Before approving a new family, compare the assembled card side by side with the existing three at the same card size. Check silhouette and face readability, character identity across evolutions, brushwork and material finish, light direction across layers, color/contrast balance, title and stat readability, and clean frame edges. Inspect every animation pose and the entire loop for detached pieces, inconsistent texture, ghosting or a style shift. Reject and revise mismatches before adding the package to the catalog. Device checks and pipeline validation remain required by the asset contract.

## Existing prototype generation notes

The current core art and transparent overlays were generated individually with the built-in image generation tool. The shared front frame is an image; the gems and their numbers are React Native components, and character titles are separate image assets. The existing characters use the same artwork across the implemented evolution levels.

The early card concepts used these directions:

- **Tarzan:** heroic jungle adventurer with long dark hair, a three-quarter leap, green and gold rim lighting, and an emerald jungle with a waterfall and sun shafts.
- **Sherlock Holmes:** Victorian detective with a tailored dark coat, windblown scarf and magnifying glass, with cool blue shadows and warm amber light against London rooftops and gas lamps.
- **Dracula:** vampire aristocrat with a black and crimson cape, expressive outstretched hand, violet and crimson light, and a moonlit gothic castle and storm clouds.

Foreground and effect assets were generated separately. The current shared frame is sculpted polished gold with angular beveled corners, a transparent center and three integrated obsidian sockets, without character-specific motifs. Active gems are overlaid on those same sockets. It sits above the environment; the character can appear above it only where the evolution's frame-break rule permits.

The current shared reverse is a text-free Victorian detective design with a central magnifying glass, clue motifs, brass engraving and a midnight-blue palette. It is a shared prototype back for all three cards, not a requirement to generate a new back for each character.
