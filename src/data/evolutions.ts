export const evolutions = ['origin', 'awakened', 'unbound'] as const;
export type Evolution = typeof evolutions[number];

// Evolution changes presentation only; all levels use the same card assets.
export const evolutionPolicy: Record<Evolution, { label: string; frameBreak: boolean; motion: boolean }> = {
  origin: { label: 'Origin', frameBreak: false, motion: false },
  awakened: { label: 'Awakened', frameBreak: true, motion: false },
  unbound: { label: 'Unbound', frameBreak: true, motion: true },
};
