# Final player-perspective card review

- Choose character scale and composition for the source and unique identity of each card; do not default to an oversized character, and keep the setting visible where it serves the scene.
- Plan the actual frame-break silhouette and depth around Cost and Power badges before generating art; avoid badge collisions and do not hide them with a foreground overlay that cuts the character apart. Check rest, motion and tilt extremes.

Run this review as the final stage of the [name-to-card workflow](CARD_GENERATION_PIPELINE.md), after implementation and technical checks. Review the actual running card and evidence, not just its prompt, code or a still mockup. Use the prompt below as a strict review instruction; do not treat it as proof that an independent reviewer or player has tested the result.

## Reviewer prompt

> Act as an exacting first-time player inspecting this card on a small phone and on desktop. Judge whether the card is immediately recognizable from its researched source, visually distinctive, polished and exciting to collect and upgrade. The established collection art style must hold, but subject scale, pose, scene, title and all three animations must suit this character rather than copy a previous card.
>
> Ask whether the pose and framing express this character or a specific story moment rather than repeating a generic formula, and whether every major light source belongs naturally to the setting. Sunlight is neither required nor forbidden. Flag choices repeated by habit when they weaken the card; require a more distinctive, coherent choice without imposing an arbitrary creative pose or lighting rule.
>
> Inspect the running card at actual display size and in close-up. Compare Origin, Awakened and Unbound, with neutral tilt and at both drag limits. Check that the scene is legible, resting background and foreground crops stay consistent, the character breaks the frame naturally without colliding with or being sliced by Cost or Power, the bottom frame and evolution diamonds are readable, and the title and numbers remain clear. Character or environment edges must not leak outside their intended clips.
>
> Check all feet, hands and props against their physical supports. If the pose floats or a contact point misses its branch, ground or seat, fail it and adjust the background scale, crop or composition as necessary while keeping that card's rest framing consistent across evolutions.
>
> Watch all three independently planned Unbound animations through complete loops and their handoffs. Each must be recognizable and worth the player's attention at phone size; reject imperceptible motion, rigid or detached parts, visible cuts, seams, ghosts, flicker, cropping, popping or a detail appearing from nowhere. Verify the same details remain naturally present in the two still levels. Check rarity-specific border behavior, drag/tilt, flip, selection, loading, reduced motion and the responsiveness of the experience without accepting reduced visual quality.
>
> Audit the planner's pre-base gate for all three tracks: identify the specific character-driven purpose, chosen technique, actual asset and mask paths, registration and underpaint, working loop and recorded prototype evidence. Watch each motion in isolation and together in the actual card. A stated plan, changing numeric property or still screenshot is not proof of a visible, polished loop. Fail a missing, generic, hidden or defective track; record unverified checks separately and return the card for rework. Judge whether the motion feels distinctive to this character instead of being a recycled effects checklist.
>
> Compare the chosen motions and techniques with the alternatives considered and the current collection. Check that each is selected for the character, not because a previous mask, sprite, movement or effect was convenient. For a new card, inspect the unique wordmark for convincing 3D material depth and mobile readability; do not treat an accepted existing title as a required redesign.
>
> Give a clear PASS or FAIL for every item with observed evidence, list exact reproduction steps and player-visible defects, and propose fixes. Missing video, actual-device evidence or an untested interaction is **unverified**, never a pass. Fail the card if a required quality gate is broken, motion cannot be perceived, or the result feels generic. Send actionable failures back to implementation and repeat the checks until the defects are resolved; do not ship a known bad cut, badge collision or misleading success claim to meet a deadline.
>
> Finish with an honest assessment of the remaining limitations and present the card for the actual user's feedback. An assistant's review cannot establish that the user is happy or impressed; incorporate their corrections and repeat the review until the user accepts the result. Do not invent player feedback or block independent fixes while waiting for it.

## Evidence and outcome

Record the tested viewport/device, level and tilt states, motion captures or frames, performance/interaction observations and any unresolved failure in the card's plan. A browser preview does not certify real-device sensors, memory or frame pacing. If a required check or piece cannot be validated, mark the card incomplete and state exactly what remains. Follow existing user instructions about when to build or test an APK.
