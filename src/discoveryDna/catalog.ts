import type { Track } from '../types/track';
import { ALBUM_ART, getBillieTrackArt } from '../mocks/albumArt';

export type FamiliarityLevel = 'high' | 'medium' | 'low';
export type EnergyLevel = 'low' | 'medium' | 'high';

export interface CatalogTrack extends Track {
  artistId: string;
  genres: string[];
  familiarity: FamiliarityLevel;
  energy: EnergyLevel;
  moods: string[];
}

export const MOCK_CATALOG: CatalogTrack[] = [
  {
    id: 'lunch',
    title: 'LUNCH',
    artist: 'Billie Eilish',
    artistId: 'billie-eilish',
    album: 'HIT ME HARD AND SOFT',
    ...getBillieTrackArt('lunch'),
    albumArtGradient: ['#4a6fa5', '#c45c6e'],
    durationMs: 179_000,
    genres: ['pop', 'alternative'],
    familiarity: 'high',
    energy: 'medium',
    moods: ['focused', 'cool'],
  },
  {
    id: 'birds-of-a-feather',
    title: 'BIRDS OF A FEATHER',
    artist: 'Billie Eilish',
    artistId: 'billie-eilish',
    album: 'HIT ME HARD AND SOFT',
    ...getBillieTrackArt('birds-of-a-feather'),
    albumArtGradient: ['#4a6fa5', '#c45c6e'],
    durationMs: 210_000,
    genres: ['pop', 'alternative'],
    familiarity: 'high',
    energy: 'medium',
    moods: ['warm', 'familiar'],
  },
  {
    id: 'wildflower',
    title: 'WILDFLOWER',
    artist: 'Billie Eilish',
    artistId: 'billie-eilish',
    album: 'HIT ME HARD AND SOFT',
    ...getBillieTrackArt('wildflower'),
    albumArtGradient: ['#4a6fa5', '#c45c6e'],
    durationMs: 261_000,
    genres: ['pop', 'indie'],
    familiarity: 'high',
    energy: 'low',
    moods: ['calm', 'evening'],
  },
  {
    id: 'chihiro',
    title: 'CHIHIRO',
    artist: 'Billie Eilish',
    artistId: 'billie-eilish',
    album: 'HIT ME HARD AND SOFT',
    ...getBillieTrackArt('chihiro'),
    albumArtGradient: ['#4a6fa5', '#c45c6e'],
    durationMs: 303_000,
    genres: ['pop', 'electronic'],
    familiarity: 'high',
    energy: 'low',
    moods: ['atmospheric', 'evening'],
  },
  {
    id: 'good-luck-babe',
    title: 'Good Luck, Babe!',
    artist: 'Chappell Roan',
    artistId: 'chappell-roan',
    album: 'Good Luck, Babe!',
    albumArtUrl: ALBUM_ART.goodLuckBabeSingle,
    albumArtGradient: ['#e879a9', '#7c3aed'],
    durationMs: 218_000,
    genres: ['pop', 'indie pop'],
    familiarity: 'medium',
    energy: 'high',
    moods: ['upbeat', 'discovery'],
  },
  {
    id: 'i-love-you-im-sorry',
    title: "I Love You, I'm Sorry",
    artist: 'Gracie Abrams',
    artistId: 'gracie-abrams',
    album: 'The Secret of Us',
    albumArtUrl: ALBUM_ART.secretOfUs,
    albumArtGradient: ['#64748b', '#334155'],
    durationMs: 157_000,
    genres: ['pop', 'indie'],
    familiarity: 'medium',
    energy: 'low',
    moods: ['introspective', 'discovery'],
  },
  {
    id: 'flowers',
    title: 'Flowers',
    artist: 'Miley Cyrus',
    artistId: 'miley-cyrus',
    album: 'Endless Summer Vacation',
    albumArtUrl: ALBUM_ART.endlessSummerVacation,
    albumArtGradient: ['#f472b6', '#fb923c'],
    durationMs: 200_000,
    genres: ['pop'],
    familiarity: 'medium',
    energy: 'medium',
    moods: ['empowered', 'discovery'],
  },
  {
    id: 'espresso',
    title: 'Espresso',
    artist: 'Sabrina Carpenter',
    artistId: 'sabrina-carpenter',
    album: "Short n' Sweet",
    albumArtUrl: ALBUM_ART.shortNSweet,
    albumArtGradient: ['#fcd34d', '#f59e0b'],
    durationMs: 175_000,
    genres: ['pop'],
    familiarity: 'medium',
    energy: 'high',
    moods: ['playful', 'discovery'],
  },
  {
    id: 'sunset-lover',
    title: 'Sunset Lover',
    artist: 'Petit Biscuit',
    artistId: 'petit-biscuit',
    album: 'Petit Biscuit',
    albumArtUrl: ALBUM_ART.sunsetLoverEp,
    albumArtGradient: ['#f97316', '#fbbf24'],
    durationMs: 223_000,
    genres: ['electronic', 'chill'],
    familiarity: 'low',
    energy: 'low',
    moods: ['calm', 'evening', 'rainy'],
  },
];

export function hydrateCatalogArt(catalog: CatalogTrack[], tracks: Track[]): CatalogTrack[] {
  const trackById = new Map(tracks.map((t) => [t.id, t]));
  return catalog.map((item) => {
    const track = trackById.get(item.id);
    return {
      ...item,
      albumArtUrl: track?.albumArtUrl ?? item.albumArtUrl,
      albumArtFallbackUrl: track?.albumArtFallbackUrl ?? item.albumArtFallbackUrl,
      albumArtGradient: track?.albumArtGradient ?? item.albumArtGradient,
    };
  });
}
