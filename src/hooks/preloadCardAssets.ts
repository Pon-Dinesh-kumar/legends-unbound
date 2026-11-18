import { Asset } from 'expo-asset';
import { Image, Platform } from 'react-native';
import { cards } from '../data/cards';
import { sherlockScarfBase, sherlockScarfFrames } from '../data/sherlockScarf';
import { draculaCapeBase, draculaCapeFrames } from '../data/draculaCape';

const cardImages = [
  ...cards.flatMap(card => [card.background, card.character, card.foreground, card.effects, card.titleImage]),
  sherlockScarfBase, ...sherlockScarfFrames,
  draculaCapeBase, ...draculaCapeFrames,
  require('../../assets/cards/shared/frame-legendary-v4.png'),
  require('../../assets/cards/shared/back-sherlock.png'),
];

// Keep decoded browser images alive for the lifetime of the showcase.
const decodedWebImages: HTMLImageElement[] = [];

export async function preloadCardAssets() {
  const assets = await Asset.loadAsync(cardImages);
  const decoded = await Promise.all(assets.map(async asset => {
    const uri = asset.localUri ?? asset.uri;
    if (Platform.OS === 'web') {
      const image = new window.Image();
      image.src = uri;
      await image.decode();
      return image;
    } else if (/^https?:\/\//i.test(uri)) {
      // Bundled files are already local; their mounted Image onLoad events
      // below the loading screen are the readiness check for those assets.
      const cached = await Image.prefetch(uri);
      if (!cached) throw new Error('Could not preload a card image');
    }
  }));
  if (Platform.OS === 'web') {
    decodedWebImages.splice(0, decodedWebImages.length, ...decoded.filter((image): image is HTMLImageElement => !!image));
  }
}
