export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArtUrl: string;
  /** Secondary URL tried if albumArtUrl fails to load */
  albumArtFallbackUrl?: string;
  /** Fallback when all image URLs fail to load */
  albumArtGradient: [string, string];
  durationMs: number;
}

export type PathType = 'stay-in-vibe' | 'discover-new' | 'fit-moment';

/** Display order for listening path cards (queue UI + debug panel). */
export const PATH_DISPLAY_ORDER: readonly PathType[] = [
  'fit-moment',
  'stay-in-vibe',
  'discover-new',
];
