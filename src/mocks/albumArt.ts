/** Spotify CDN album art URLs (300×300 via oEmbed thumbnails). */
export const ALBUM_ART = {
  hitMeHardAndSoft:
    'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0271d62ea7ea8a5be92d3c1f62',
  goodLuckBabeSingle:
    'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0291b4bc7c88d91a42e0f3a8b7',
  midwestPrincess:
    'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0296fa88fb1789be437d5cb4b6',
  sunsetLoverEp:
    'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e027397ce261b3db6910d8376ca',
  secretOfUs:
    'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e026e2101520787791370f4a96b',
  endlessSummerVacation:
    'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0266fd0917f38d472c8576754e',
  shortNSweet:
    'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02fd8d7a8d96871e791cb1f626',
  loseControlSingle:
    'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02ebea8d4457c4db5b2088f287',
  beautifulThingsSingle:
    'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02831949037a1db10b87b005fa',
} as const;

/** Shared album cover fallback for HIT ME HARD AND SOFT tracks. */
export const BILLIE_ALBUM_ART = ALBUM_ART.hitMeHardAndSoft;

function youtubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Per-track artwork for Billie Eilish songs on the same album.
 * Official music video stills — distinct thumbnail per song.
 */
export const TRACK_ART: Record<string, string> = {
  lunch: youtubeThumbnail('MB3VkzPdgLA'),
  'birds-of-a-feather': youtubeThumbnail('V9PVRfjEBTI'),
  wildflower: youtubeThumbnail('IWKyykQBRKo'),
  chihiro: youtubeThumbnail('BY_XwvKogC8'),
};

/** Artist avatars — Spotify album art (reliable CDN hotlinks). */
export const ARTIST_ART = {
  taylorSwift: ALBUM_ART.shortNSweet,
  papon: ALBUM_ART.beautifulThingsSingle,
  edSheeran: ALBUM_ART.loseControlSingle,
  katyPerry: ALBUM_ART.endlessSummerVacation,
  arianaGrande: ALBUM_ART.goodLuckBabeSingle,
  billieEilish: TRACK_ART.lunch,
  chappellRoan: ALBUM_ART.midwestPrincess,
} as const;

export function getTrackArtUrl(trackId: string, fallback: string = BILLIE_ALBUM_ART): string {
  return TRACK_ART[trackId] ?? fallback;
}

export function getBillieTrackArt(
  trackId: 'lunch' | 'birds-of-a-feather' | 'wildflower' | 'chihiro',
): { albumArtUrl: string; albumArtFallbackUrl: string } {
  return {
    albumArtUrl: getTrackArtUrl(trackId),
    albumArtFallbackUrl: BILLIE_ALBUM_ART,
  };
}
