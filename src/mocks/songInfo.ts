import type { Track } from '../types/track';

export interface SongInfoDetails {
  releaseDate: string;
  label: string;
  songwriters: string[];
  producers: string[];
  aboutArtist: string;
}

const SONG_INFO_BY_TRACK: Record<string, SongInfoDetails> = {
  lunch: {
    releaseDate: 'May 17, 2024',
    label: 'Darkroom / Interscope Records',
    songwriters: ['Billie Eilish', 'Finneas'],
    producers: ['Finneas'],
    aboutArtist:
      'Billie Eilish pairs whisper-soft vocals with bold production on HIT ME HARD AND SOFT — intimate, cinematic pop built for late-night listening.',
  },
  'birds-of-a-feather': {
    releaseDate: 'May 17, 2024',
    label: 'Darkroom / Interscope Records',
    songwriters: ['Billie Eilish', 'Finneas'],
    producers: ['Finneas'],
    aboutArtist:
      'Billie Eilish pairs whisper-soft vocals with bold production on HIT ME HARD AND SOFT — intimate, cinematic pop built for late-night listening.',
  },
  'good-luck-babe': {
    releaseDate: 'April 5, 2024',
    label: 'Amusement Records / Island Records',
    songwriters: ['Chappell Roan', 'Dan Nigro', 'Justin Tranter'],
    producers: ['Dan Nigro'],
    aboutArtist:
      'Chappell Roan brings theatrical pop and unapologetic storytelling — big hooks, camp energy, and songs that feel like a night out with your closest friends.',
  },
};

function defaultSongInfo(track: Track): SongInfoDetails {
  return {
    releaseDate: '2024',
    label: 'Major Label',
    songwriters: [track.artist],
    producers: [track.artist],
    aboutArtist: `${track.artist} — featured on ${track.album}.`,
  };
}

export function getSongInfo(track: Track): SongInfoDetails {
  return SONG_INFO_BY_TRACK[track.id] ?? defaultSongInfo(track);
}
