import type { Track } from '../types/track';
import { ALBUM_ART, getBillieTrackArt } from './albumArt';

export const CURRENT_TRACK: Track = {
  id: 'lunch',
  title: 'LUNCH',
  artist: 'Billie Eilish',
  album: 'HIT ME HARD AND SOFT',
  ...getBillieTrackArt('lunch'),
  albumArtGradient: ['#5c7a99', '#c45c6e'],
  durationMs: 179_000,
};

/** Default queue — aligned with wireframe flow (Screen 2–4). */
export const MOCK_QUEUE: Track[] = [
  {
    id: 'birds-of-a-feather',
    title: 'BIRDS OF A FEATHER',
    artist: 'Billie Eilish',
    album: 'HIT ME HARD AND SOFT',
    ...getBillieTrackArt('birds-of-a-feather'),
    albumArtGradient: ['#3d5a3a', '#8fad7a'],
    durationMs: 210_000,
  },
  {
    id: 'good-luck-babe',
    title: 'Good Luck, Babe!',
    artist: 'Chappell Roan',
    album: 'Good Luck, Babe!',
    albumArtUrl: ALBUM_ART.goodLuckBabeSingle,
    albumArtGradient: ['#e879a9', '#7c3aed'],
    durationMs: 218_000,
  },
  {
    id: 'i-love-you-im-sorry',
    title: "I Love You, I'm Sorry",
    artist: 'Gracie Abrams',
    album: 'The Secret of Us',
    albumArtUrl: ALBUM_ART.secretOfUs,
    albumArtGradient: ['#64748b', '#334155'],
    durationMs: 157_000,
  },
  {
    id: 'flowers',
    title: 'Flowers',
    artist: 'Miley Cyrus',
    album: 'Endless Summer Vacation',
    albumArtUrl: ALBUM_ART.endlessSummerVacation,
    albumArtGradient: ['#f472b6', '#fb923c'],
    durationMs: 200_000,
  },
  {
    id: 'sunset-lover',
    title: 'Sunset Lover',
    artist: 'Petit Biscuit',
    album: 'Petit Biscuit',
    albumArtUrl: ALBUM_ART.sunsetLoverEp,
    albumArtGradient: ['#f97316', '#fbbf24'],
    durationMs: 223_000,
  },
  {
    id: 'wildflower',
    title: 'WILDFLOWER',
    artist: 'Billie Eilish',
    album: 'HIT ME HARD AND SOFT',
    ...getBillieTrackArt('wildflower'),
    albumArtGradient: ['#c4785a', '#e8b86d'],
    durationMs: 261_000,
  },
  {
    id: 'chihiro',
    title: 'CHIHIRO',
    artist: 'Billie Eilish',
    album: 'HIT ME HARD AND SOFT',
    ...getBillieTrackArt('chihiro'),
    albumArtGradient: ['#1a1a2e', '#6b21a8'],
    durationMs: 303_000,
  },
  {
    id: 'espresso',
    title: 'Espresso',
    artist: 'Sabrina Carpenter',
    album: "Short n' Sweet",
    albumArtUrl: ALBUM_ART.shortNSweet,
    albumArtGradient: ['#fcd34d', '#f59e0b'],
    durationMs: 175_000,
  },
];
