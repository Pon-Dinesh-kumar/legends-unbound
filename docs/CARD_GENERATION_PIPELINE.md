# Card generation pipeline: name to validated card

- Choose character scale and composition for the source and unique identity of each card; do not default to an oversized character, and keep the setting visible where it serves the scene.
- Plan the actual frame-break silhouette and depth around Cost and Power badges before generating art; avoid badge collisions and do not hide them with a foreground overlay that cuts the character apart. Check rest, motion and tilt extremes.

This is the required production workflow when a request supplies only a character name. Read [the locked art direction](../ART_DIRECTION.md), [public-domain character research workflow](PUBLIC_DOMAIN_CHARACTER_RESEARCH.md), [asset contract](CARD_ASSET_GUIDELINES.md), [animation techniques and implementation notes](CARD_ANIMATION_TECHNIQUES.md), [Jane Porter lessons](JANE_PORTER_LESSONS.md), and [Marvel Snap CAT research and our proposed pipeline improvements](MARVEL_SNAP_CAT_RESEARCH.md) first. These instructions describe the workflow to carry out, not an assertion that this repository already has an automated generator, generic manifest renderer, validator, or device farm. Those pieces are future work; until then perform the steps explicitly, document evidence, and be candid about anything not verified.

## Single-name execution contract

A future request containing only a character's name authorizes the complete **base-card** workflow: research the character's original public-domain source and version, prepare and record the three-track plan, generate and assemble the layered assets, integrate the card into the existing showcase, and perform the applicable checks. Carry out the work rather than stopping after a concept or asking for routine design choices. Ask a focused question only if the intended identity or a genuinely blocking source/version fact remains unresolved after research. Stay within the card-art showcase; do not add gameplay or a skin system. Build an APK, commit or push only when separately requested or already authorized for that task.

The current repository is a working showcase with manual card definitions, **not** an automated one-name generator, generic manifest renderer or device farm. Until those are implemented, perform each step explicitly. Adding a fourth or later card includes updating the card type and registry, required preloaded/mounted layers and error handling, selection/navigation and any hard-coded collection counts or mobile layout, without regressing the existing three. Keep the user-visible card ready before reveal. No new per-card frame, different base-card style or new evolution artwork. Use the shared gold Legendary, purple Epic, amber-yellow Rare or simple light-blue Common border selected by rarity. All three original cards are Legendary.

The original project brief is historical; later accepted user corrections and the current guides govern conflicts: same shared frame per rarity, cost top left and power top right, large bottom title without extra card text, only character frame break above/beside the frame, environment clipped, bottom quarter behind the frame, no character-wide shimmer or ambient whole-image movement, and the current three evolution policies. Reuse the approved frame, motion and preloading behavior rather than reverting to older prompt suggestions.

## Character-specific art and animation choices

- Professor Porter review: avoid unsupported cropped standing figures, detached furniture or props during parallax, and title decoration that overwhelms a clear character-specific wordmark. Verify feet, contact shadows and supports at neutral and both drag extremes. Build moving curtains and other fabric with stable attachments, complete underpaint and full-loop evidence; do not count a barely visible or rigid motion as a pass.
- Check the actual silhouette of each shared rarity frame against the artwork mask on both native and web. The Common frame's top rail and side contours differ from Legendary: inspect closely beneath both stat badges for narrow leaked strips and preserve the intended character frame break independently of the environment clip.

- Plan and produce at least one character-specific intermediate or foreground parallax plane for every new card, and a second where the composition benefits. Give each a clear depth purpose and original artwork; keep attached objects on the same transform as their supports, add overscan, and verify visibility and seams at both tilt extremes. Do not add decorative layers that obscure the scene or make contact points drift.
- Show a convincing support or deliberate crop for the character; never leave a standing figure visibly floating. Check the feet, contact shadow and support together at rest and under parallax. A distinctive title needs intentional typography, clean alignment and visual relevance to the character; avoid piling on unrelated materials and ornaments to manufacture complexity.

- Sabor review: check character scale and centering at actual phone size, and adjust toward the badge clearance limit only after inspecting both drag extremes. Keep the scene's resting crop identical across evolution levels. Never add a second, conflicting light source to animate an existing one: isolate the intended original light region and inspect the complete loop for visibility, hard edges and visual continuity.
- Research and choose each character's own recognizable source-appropriate pose; do not default to a reaching hand. Plan how the actual pose provides a clear silhouette, top/side frame break and depth for parallax.
- Compare multiple source-specific moments, poses or actions before choosing the silhouette. An expressive action or quiet story beat can be more distinctive than a frontal standing portrait; do not reuse a pose simply because it worked on another card. Record the chosen moment and why it fits the character.
- Plan lighting for this particular setting and scene before generation; record its source, direction, color and mood across all layers. Sunlight is welcome when it fits; there is no mandate to use or avoid sunbeams. Moonlight, firelight, lanterns, overcast light, darkness and other approaches are equally available. Choose the light that serves this character and story, not a recurring formula.
- Keep creative pose, framing, camera angle, subject scale and composition open. Compare several interpretations of the source and choose the one that communicates this card best; there is no fixed creative pose or framing rule. The shared canvas, frame, legibility and evolution mechanics remain implementation requirements.
- The user appreciated La of Opar's inventive motion design. Preserve the underlying method: research story details, brainstorm distinct actions, create and test separate motion studies and required underpaint before the final base, inspect them in composition, and revise visible defects. Her flame, sun wheel and pendant are examples, not a reusable formula. Her full-loop and device gates remain unverified until evidence exists.
- Create card-specific background, foreground, particles, effects, props and other artwork; do not reuse another character's scene layers. The rarity frame, evolution gems, back and shared UI are reusable. There is no preset cap on generated images: plan and create all layers needed for depth, occlusion and the three animations, then optimize and verify actual runtime performance.
- Before generating anything, plan exactly three character-specific tracks together. Prefer varied, character-driven animation ideas and suitable techniques across the collection; do not routinely repeat scarf motion and prop glints as a template. For female characters, assess whether expressive hair movement is feasible; it is optional, never forced or exempt from the clean-motion quality gate.
- Brainstorm several distinct candidate motions and techniques for this specific story before choosing the three. Compare the proposed visual effect, subject, technique, rhythm and pose with current cards; record alternatives and why the chosen combination is appropriate and distinctive. Stay open to custom masks, weighted rigs, procedural simulations, authored frames, sprite sheets, light interactions, flow and other techniques supported by evidence. A previously successful effect or sprite sheet is an option, not a default or prohibition. Do not force novelty at the expense of the character or quality.
- For each future title, design a unique wordmark with readable dimensional 3D depth, materials and bevel appropriate to the character. Inspect it at mobile card size and within the frame; preserve the existing titles, which the user said are fine.
- Set and verify an observable motion range at actual phone card size. Each track must be individually identifiable while watching a complete idle loop. Tune intensity and timing for the character without introducing seams, ghosting, unnatural rigidity, distractions or whole-image movement; an imperceptible track fails even if its values change.
- Before generating the composition, design each moving part for its intended visible range, including separate registered artwork, completed hidden surfaces, overlap/occlusion and a suitable weighted rig or authored poses. Jane's enlarged hair and scarf rotations revealed cuts; simply turning up a cutout rig is not an acceptable substitute for motion-ready assets. Test the planned endpoints early and revise the asset or technique if joins show.

## Non-negotiable gates

- **Animation-first production gate:** after research and before final base-card generation, complete the three-track planning and feasibility table below; produce and test the motion-ready layer studies, masks, attachment/occlusion and finished hidden art required by each chosen track. Record actual asset paths, target registration and a visible prototype or motion capture for all three. Concept studies may be generated to establish composition and registration, but they are not an approved final base card. If any motion cannot be executed cleanly and visibly, revise the animation and composition, generate or repair the necessary layers, and repeat the gate. Never proceed with a static final illustration and hope to invent animations later.
- **No placeholder passes:** three named ideas or three changing transform values do not meet the three-animation requirement. Each track must have its planned assets, a working integrated loop, and player-size visual evidence before it can pass. Fail or mark unverified every missing, hidden, generic, imperceptible, cut or untested track. Fix independently possible failures and rerun review before declaring the card complete.
- **Plan before generating anything.** Create the complete card brief, layer/occlusion map, evolution map, exactly three distinct animation plans, asset list, integration plan, and test plan before the first image-generation call. Resolve source identity and any blocking ambiguity; make routine choices without interrupting the user. Record sources, decisions and assumptions.
- Every complete card requires **exactly three independently authored, observable card-specific animations**, planned together. Clothing, hair, props, a specific effect or environmental detail can qualify. Shared frame/title effects, parallax, global image drifting and an opacity-only flash do not qualify. All three have the same registered rest pose in every evolution; only the active Unbound front animates.
- Never trade quality for track count. Reject and repair seams, double images, ghosts, cuts, holes, detached anchors, wrong depth, pops, flicker, unconvincing rigid scaling and invisible motion. An unfinished card must be marked incomplete, not declared done. The rejected [Dracula cuff experiment](DRACULA_ANIMATION_REDESIGN.md#first-cuff-prototype-rejected) is an example.
- Use the same approved character, pose, costume, environment, name and frame art for all levels. Origin stays inside the frame; Awakened unlocks top/side character frame-break; Unbound adds the same frame-break, parallax and the three animations. Bottom quarter of the character remains behind the border. Environments never break the frame. The rest placement of every moving piece follows the character or its intended parent, not screen coordinates.
- Preserve the same background and foreground crop at rest across evolution levels; do not add an Unbound-only zoom. Plan size-aware overscan for the existing interactive parallax range, and verify no exposed edges at tilt extremes. Retain intentionally unlocked Unbound motion and shimmer.
- Fit the background size, crop and geometry to the specific card when needed, especially where feet, hands, objects or a seat must meet the environment. Identical rest framing across a card's three levels does not forbid per-card scene scaling or composition changes. Inspect all contact points, the full setting and drag extremes; reject floating characters or mismatched supports.
- The four rarities are Common, Rare, Epic and Legendary. Legendary is rarest and uses the shared gold frame; Epic uses the shared purple frame; Rare uses the shared simpler amber-yellow frame with no border or gem animation. Common uses a simple light-blue frame with no border animation. **Only the border defines rarity.** Never invent per-character borders or new evolution artwork. Stat shields, frame and evolution diamonds follow the [asset contract](CARD_ASSET_GUIDELINES.md#legendary-border-rarity-and-effects).

## Required workflow

### 1. Resolve the name and prepare the brief

**Always research first.** Follow [public-domain character research](PUBLIC_DOMAIN_CHARACTER_RESEARCH.md): resolve the original comic, cartoon, book or other work, creator, publication/appearance, exact source version, name, appearance, personality and signature details. Check and record public-domain evidence for the specific version and intended jurisdictions, with direct links and dates; distinguish original material from later adaptations and any still-protected additions. Identify uncertainties and avoid actor likenesses, modern protected character designs and copied logos. Base the recognizable name and identity on the researched work, never on a random invented theme. Ask only if a material identity or source-version ambiguity remains blocking after research.

Record a stable card ID, source inspiration, recognizable name, proposed rarity and cost/power (mark gameplay values as proposals unless supplied), personality, pose, costume, signature object, setting, palette, light direction, composition and emotional focal point. Use the collection's locked painterly 2.5D animated-feature style, not a new per-card style. Plan the phone-size silhouette, clear face and hand, title and stat clearance, and a 2:3 composition that works inside Origin and as an Awakened/Unbound top-and-side frame break.

### 2. Plan all three animations before generating assets

For each of the three distinct pieces, write: visual reason tied to this character; exact attachment and parent; intended depth and occlusion; static rest shape shared by all levels; moving region versus fixed face/body; motion path and loop timing; source-size anchor and overflow limits; required underpainting, foreground cover and masks; choice of registered authored frames or a proven deformable rig; mobile visibility; and interaction with the other two loops. Plan natural motion with no synchronized mechanical pulsing. Declare the fallback if separation or registration cannot be achieved: **revise the plan or leave the card incomplete**, not a fake effect or a badly cut sprite.

For each track fill in and execute this table **before final base art**; link actual studies and record findings in the card plan rather than filling it with intentions only:

| Gate | Track 1 | Track 2 | Track 3 |
| --- | --- | --- | --- |
| Character-specific story and observable action | required | required | required |
| Alternatives considered and chosen technique, including custom masks or other suitable methods | required | required | required |
| Independent layers, mask maps, authored poses, hidden/underpaint art, anchors and occlusion | required | required | required |
| Asset paths, registration and preload plan | required | required | required |
| Motion study evidence at intended range, loop boundary and actual card size | required | required | required |
| Feasibility, quality defects, performance risks and result (pass/fail/unverified) | required | required | required |

Use distinct, original visual ideas suited to the character and scene rather than defaulting to a blink, scarf, glint, leaves or mist. Explore creative layered and masked motion as a storytelling opportunity, not a fixed recipe. Evaluate alternatives for visual quality, portability and cost; do not assume a shader or a tool exists in the current renderer. A prototype asset or concept can establish a moving part and be iterated alongside the other layers, but the final coherent base art must not be approved until the three motion-ready studies pass the design feasibility gate.

Make an asset list and layer order for opaque environment, separated character base, each of the three resting pieces and its finished underpainting, any foreground occluders, authored frames/rig, foreground/effects and transparent name art. Record exact canvas, offsets, masks and attachment coordinates. Plan the shared border, stat values, evolution marker, shared back, readiness/error handling, reduced motion, and web/iOS/Android checks before generating.

### 2a. Plan variable layers and the renderer before generating

Build a card-specific, ordered layer and occlusion map: identify which background planes, body parts, frame-breaking pieces, props, title parts and effect regions actually need independent depth or motion. Record source-coordinate canvas and image fit, parent/anchor, visible and hidden contours, finished underpainting, per-plane overscan, depth, clip, all-level rest appearance, and each of the three planned track links. Do not require a fixed image count: more layers only help when they preserve meaningful depth or motion without seams or unacceptable device cost.

For each track, compare separated authored frames, an anchored/weighted rig, localized flowing imagery and mask/shader techniques against the current renderer and quality gates. Paint independent, registered height, motion, emission or occlusion maps only where the chosen technique needs them; these do not replace source artwork or hidden paint. Record mask color-space, range, alpha semantics and sampling. Packed RGBA maps, shader features, particles and an artist preview are proposed optimizations, not implemented tools or assumed Marvel Snap internals. Retain editable independent masks, and only pack after a measured, cross-platform validation.

Add the intended package graph, complete required/preloaded assets and failure fallback to the brief. Validate layer/track IDs and references, three-track completeness, matte/alpha, dimensions, pixel registration, frame clipping and underpaint before building motion. Prototype the hardest occlusion or joint first and compare the resulting rest composite to the approved original. Require captured loop-boundary and actual-phone-size evidence, then device timing/memory checks; if a track looks wrong or is invisible, revise it or leave the card incomplete. The detailed [CAT-inspired package, preview and benchmark plan](MARVEL_SNAP_CAT_RESEARCH.md) is a design target, not a promise of an available tool.

### 3. Generate and inspect the base composition

Generate a coherent character/setting direction using the locked prompt, the verified source-version brief and the current Tarzan, Sherlock and Dracula cards as visual references. All base cards must share their collection's established art style, material rendering, shape language, detail and lighting treatment. Source-appropriate palette and character identity may vary; a skin is a separate future feature, not a new base-card style or evolution. Compare each candidate with all three existing cards at the same size before accepting it. Preserve source prompts, model/tool, generation references and selected version. Reject output with identity drift, cut-off face/hands, illegible silhouette, baked borders, logos, stats, titles, text or watermarks. Confirm the composition can support all three preplanned moving pieces before generating the final layer set.

### 4. Produce registered layers and underpainting

Produce one consistent 1024 × 1536 source-coordinate composition: opaque background and transparent character, foreground, effects and title layers. Isolate each preplanned moving piece at its exact rest location and paint a finished, plausible base beneath it. Add the necessary foreground occlusion (for example, a hand over a cuff). Keep original attachment, lighting, palette and edges. Assemble each rest pose over its base and compare at full size and 200–400% zoom. Reject seams, halos, duplicate contours, missing paint, color shifts and any alteration to other body parts. Do not begin loop generation until all three rest composites pass.

### 5. Author and inspect three real loops

For each piece, create registered in-between drawings, a properly weighted deformable rig, or another locally justified motion method with fixed anchors and finished rest/underpaint. For periodic flow, maintain complete moving coverage at all handoffs and inspect multiple loop boundaries, rather than accepting a mathematically continuous parameter alone. Animate the intended shape, not a whole image or unrelated AI poses cross-faded together. Keep loops continuous in both position and velocity. Scrub all poses and the loop boundary frame by frame on a contrasting backdrop and the assembled card; review in real time at target size. Verify attachment, hand/face occlusion, readable motion, absence of cuts, ghosting, jitter, pops and clipping. Tune the three motions together; do not count a failed or imperceptible piece.

### 6. Assemble all levels through shared layers

Register the art using the current catalog and shared compositor until the planned generic package/manifest exists. Mount character-attached details in the same source-coordinate transform as the character, including the Origin, upper frame-break and lower clipped paths. Keep environment and effects clipped, bottom border clear, character frame-break above the frame, shields and numbers legible, and title size/overflow consistent with level. Keep three rest pieces present across every level. Do not bake UI into art or create separate evolutionary illustrations.

### 7. Preload and implement lifecycle

List all actually required background, character, base, rest, frames/rig, occluders, effects, title, frame and back assets. Preload and decode or warm them as supported by each platform before revealing the card. Readiness must track distinct required layers, not a guessed count; support load failure and retry. Reuse cached assets and stop unused tracks on card switch, back face, backgrounding, unmount and reduced motion. Avoid excessive simultaneous images, GPU overdraw and oversized textures; measure rather than guessing device budgets.

For every card and renderer change, review rendering and memory costs without lowering art quality, removing requested effects, or skipping required preload. Reuse decoded copies of identical assets, avoid needless component updates and inactive-card painting, and preserve transition, flip state and readiness. Profile the active card and card switching with representative workload and record repeatable measurements and device limitations. Browser microbenchmarks alone do not establish physical-device performance or a guaranteed frame-rate improvement. See [web performance notes](WEB_PERFORMANCE.md) for the current investigation and regression checks.

### 8. Verify visually and functionally

Inspect Origin, Awakened and Unbound at desktop and narrow phone card sizes, including all three animation loops, every loop boundary, all clipping edges and level transitions. Confirm the same rest placement, frame break, lower border, gems, names and stats; test drag, sensor tilt and parallax, flip/back, switching cards while moving, startup/loading, retry, offline bundled assets and reduced motion. Check that frame glow does not touch stat shields or shimmer across the character. Record screenshots plus moving capture; a still screenshot alone cannot establish animation quality.

### 9. Validate builds and physical devices

Run relevant type checks, automated behavior tests and web/Android builds. Install a standalone APK on a representative real Android phone, check gyroscope/accelerometer tilt, touch fallback, background/resume recentering, asset loading, responsiveness, thermal behavior and frame pacing. Check iOS on a representative device when available. Record device models, OS versions, results and measurements. A web preview, Android bundle or emulator does not prove physical sensor behavior or performance; report untested devices honestly.

### 10. Final strict player-perspective review

Run [the player review prompt](PLAYER_REVIEW_PROMPT.md) against the running card and its evidence, at phone and desktop sizes. Judge source identity, unique composition, badge clearance, frame break, title and stat readability, all three full animation loops, responsiveness and the upgrade experience as an exacting player. Record each pass, failure and unverified item; fix actionable defects and repeat until the quality gates pass. An assistant cannot claim the actual user is happy or impressed without their feedback. Present the result honestly and incorporate any user corrections, continuing the review cycle until the user accepts it.

### 11. Final audit and handoff

Verify the brief, sources, layer manifest, three-track plan, source artwork, all three completed loops, shared rarity frame, evolution states, preload/error behavior, visual evidence and test results. Record unresolved failures and mark the card **incomplete** if any mandatory gate is unmet. Deliver asset paths, provenance, limitations and reproducible build/test instructions. Do not claim that a future pipeline is already automated or that a check ran when it did not.

## Card brief template

```text
Requested name / resolved character / aliases / stable ID:
Original creator, source work, publication, exact edition/character appearance, source links and access dates:
Target jurisdictions / public-domain evidence / excluded later adaptation traits / unresolved uncertainties:
Rarity (existing supported frame) / proposed cost and power:
Pose / silhouette / clothing / signature prop / expression:
Setting / palette / light direction / style comparison against Tarzan, Sherlock and Dracula:
Frame-break silhouette / Origin fit / lower-quarter occlusion:
Animation 1: piece, parent, anchor, depth, rest, underpaint, loop, visibility:
Animation 2: piece, parent, anchor, depth, rest, underpaint, loop, visibility:
Animation 3: piece, parent, anchor, depth, rest, underpaint, loop, visibility:
Complete layers / asset sizes / generation prompts / source and license notes:
Runtime and preload integration / failure and reduced-motion behavior:
Web, iOS, Android, visual and performance verification plan:
```
