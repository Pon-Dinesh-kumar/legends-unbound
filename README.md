# Legends Unbound

A portrait Expo showcase for three original collectible-card illustrations. No gameplay systems are included.

## Run

Install dependencies with `npm install`, then run `npx expo start`. Open the project in Expo Go on an iOS or Android device. Drag the selected card to tilt it subtly; Unbound also adds parallax to its artwork. Use the Flip Card button to see the shared Sherlock-inspired reverse and select a legend using the three tiles. Motion falls back to the accelerometer or touch when device motion is unavailable.

Select **Origin**, **Awakened**, or **Unbound** above the legend picker. All levels use the same artwork and border: Origin stays inside the frame, Awakened reveals the frame break, and Unbound enables parallax and available character animations. All levels support a slight card tilt. The three diamonds on the bottom frame edge show the current level. Sherlock and Dracula currently have one animated detail each; Tarzan does not yet have a character animation.

The artwork is composited from separate background, character, foreground, and effects PNGs. A shared transparent frame and image wordmarks are combined with native stat gems. See [ART_DIRECTION.md](ART_DIRECTION.md) for the locked collection style. Device motion and performance should be verified on actual iOS and Android hardware.

The asset contract, evolution rules, animation requirements, and future pipeline plan are in [Card asset generation and assembly](docs/CARD_ASSET_GUIDELINES.md). The level selector is implemented; a generic manifest-driven pipeline remains planned.


