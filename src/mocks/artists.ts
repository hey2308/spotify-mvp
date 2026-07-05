import { ARTIST_ART } from './albumArt';

export interface LibraryArtist {
  id: string;
  name: string;
  imageUrl: string;
}

/** Your Library — Artists filter (Spotify-style mock list). */
export const MOCK_ARTISTS: LibraryArtist[] = [
  {
    id: 'taylor-swift',
    name: 'Taylor Swift',
    imageUrl: ARTIST_ART.taylorSwift,
  },
  {
    id: 'papon',
    name: 'Papon',
    imageUrl: ARTIST_ART.papon,
  },
  {
    id: 'ed-sheeran',
    name: 'Ed Sheeran',
    imageUrl: ARTIST_ART.edSheeran,
  },
  {
    id: 'katy-perry',
    name: 'Katy Perry',
    imageUrl: ARTIST_ART.katyPerry,
  },
  {
    id: 'ariana-grande',
    name: 'Ariana Grande',
    imageUrl: ARTIST_ART.arianaGrande,
  },
  {
    id: 'billie-eilish',
    name: 'Billie Eilish',
    imageUrl: ARTIST_ART.billieEilish,
  },
  {
    id: 'chappell-roan',
    name: 'Chappell Roan',
    imageUrl: ARTIST_ART.chappellRoan,
  },
];
