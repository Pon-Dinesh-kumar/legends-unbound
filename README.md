# Legends Unbound

A portrait Expo showcase for three original collectible-card illustrations. No gameplay systems are included.

## Run

Install dependencies with `npm install`, then run `npx expo start`. Open the project in Expo Go on an iOS or Android device. Drag the selected card to tilt it subtly, and use the Flip Card button to see the reverse. On supported devices, motion also changes the perspective and layered artwork. Select a legend using the three tiles. The Sherlock-inspired reverse is shared across the showcase. Motion falls back to the accelerometer or touch when device motion is unavailable.

The artwork is composited from separate background, character, foreground, and effects PNGs. A shared transparent frame PNG is combined with native gems, plaques, and typography. See `ART_DIRECTION.md` for the shared visual brief. Device motion and performance should be verified on actual iOS and Android hardware.

The proposed reusable asset contract, evolution levels, animation requirements, and implementation plan are in [Card asset generation and assembly](docs/CARD_ASSET_GUIDELINES.md). The manifest-driven pipeline and evolution levels are planned, not yet implemented.


