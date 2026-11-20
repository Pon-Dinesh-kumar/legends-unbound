# Public-domain character research for a name-only card

- Choose character scale and composition for the source and unique identity of each card; do not default to an oversized character, and keep the setting visible where it serves the scene.
- Plan the actual frame-break silhouette and depth around Cost and Power badges before generating art; avoid badge collisions and do not hide them with a foreground overlay that cuts the character apart. Check rest, motion and tilt extremes.

This is the required first research step for the [name-to-card pipeline](CARD_GENERATION_PIPELINE.md). It is a workflow for documenting sources and uncertainty, not an automatic legal clearance or a substitute for checking the intended market. Do not generate character art or animation assets until the identity, source version, visual boundaries and three animation plans are documented.

## 1. Identify the original work and character

When the user supplies a name, research it rather than inventing a themed identity. Find the earliest relevant original book, story, comic, cartoon or other work and its creator, title, original publication/release date, country and the specific version or edition being used. If the character appears in a series, check the actual appearance and distinguish original traits from traits added in later books, comics, cartoons, games, films or adaptations. If several unrelated characters share the name, use context and reputable evidence; do not silently substitute a different character. Ask only if the intended identity remains materially ambiguous after research.

Consult the source text or a reliable catalog/scan when available, plus authoritative creator, publisher, archive or library records. Record direct links, access date and publication evidence. Describe the source character's recognized name and aliases, physical description, personality, clothing, signature props, abilities, relationships and setting, distinguishing what the chosen version actually says or shows from our interpretation. Research multiple original-source works if needed to understand the character, but document which particular material informs the card.

## 2. Verify the particular public-domain material

Check the **specific source work, edition and elements used**, not just a claim that a name or character is public domain. Record when and where it was published, authorship and any facts needed to evaluate the status in the intended release jurisdictions. Public-domain status can differ between countries and can change over time; do not hard-code a cutoff year or claim worldwide clearance from a single source. If the target markets are unknown, state that in the record, use an explicitly identified jurisdiction as a research baseline, and do not present that as a global determination. The [U.S. Copyright Office's overview](https://www.copyright.gov/what-is-copyright/) explains public-domain works and different duration rules, and [Project Gutenberg's policy](https://www.gutenberg.org/policy/permission.html) notes that U.S. public-domain status can differ elsewhere.

A later adaptation, translated edition, illustration or other derivative work can contain new expression even when its underlying source is public domain. Separate the original version's documented traits from later additions; use only the verified source material as character inspiration. Do not copy a protected actor likeness, recognizable modern adaptation's distinctive costume/design, proprietary logo, or a modern illustration as a production asset. The [U.S. Copyright Office's derivative-work circular](https://www.copyright.gov/circs/circ14.pdf) explains that protection for a derivative work concerns its new material. Where a relevant name or logo raises a material branding issue, document the issue and source rather than assuming copyright and trademark are the same; the [USPTO trademark search guidance](https://www.uspto.gov/trademarks/search/federal-trademark-searching) is a starting point.

If the public-domain version, source or rights status cannot be reasonably established after research, record what is known and uncertain, continue any independent planning, and ask a focused question only where the missing fact actually blocks the card. Do not invent proof, silently adopt a protected modern portrayal, or present an unverified status as certain.

## 3. Translate source identity into our existing collection

Create an original character interpretation recognizably grounded in the researched source, using [our locked base-card art direction](../ART_DIRECTION.md) and the current Tarzan, Sherlock Holmes and Dracula cards as visual references. Match the same hand-painted animated-feature finish, stylized anatomy, line/edge treatment, dimensional painterly shading, material rendering, lighting, detail density, depth and mobile-size clarity. A character may use a source-appropriate palette and distinctive silhouette while remaining in the same collection style. Do not turn the source's original medium, a modern adaptation's style or a random theme into a new base-card style. Skins are a separate future feature and must not be introduced as part of this base card or used as its evolution levels.

Record source facts separately from design decisions. Plan a 2:3 shared composition, the existing rarity frame, top-left cost, top-right power and large bottom title. Design one shared rest artwork for Origin, Awakened and Unbound. Only character portions may break the top and side of the frame in the latter two levels; environment remains inside and the bottom quarter of the character stays behind the border. Plan exactly three distinct animation pieces together before generating any assets, with stable rest shapes across all levels and motion only on the active Unbound front. Refer to the [animation techniques and quality gates](CARD_ANIMATION_TECHNIQUES.md).

## Research record to keep with each future card

```text
Requested name / resolved character / aliases:
Original work(s) and exact version or edition used:
Creator(s), first publication or release date, country, character appearance:
Primary text / official archive / library catalog / other corroboration (direct links and access dates):
Target release jurisdiction(s), public-domain status and evidence for the specific work and elements:
Later adaptations or later-added traits explicitly excluded:
Known uncertainties, source-image rights / material branding issues, and any required follow-up:
Source-supported character appearance, personality, costume, signature object and setting:
Our original interpretation and reason it stays recognizable:
Comparison references: Tarzan / Sherlock / Dracula, matching style and finish:
Three animation plans and source-coordinate layer / underpaint / occlusion plan:
```

A source record and legal research do not mean the app's automatic card generation, package validation, native renderer, or device test farm already exists. Follow the pipeline manually where needed and report actual verification and any remaining limitations.
