import type { ListeningPath } from '../types/listeningPath';
import type { PathType, Track } from '../types/track';
import type { CatalogTrack } from './catalog';
import type { DiscoverySignals, SessionContext } from './types';

const PATH_META: Record<
  PathType,
  { title: string; description: string; tags: string[] }
> = {
  'stay-in-vibe': {
    title: 'Stay in the Vibe',
    description: 'Swap default upcoming songs for familiar picks that match what you’re enjoying now.',
    tags: ['Familiar', 'Comfortable', 'Safe'],
  },
  'discover-new': {
    title: 'Discover Something New',
    description: 'Swap default upcoming songs for fresh picks we think you’ll love.',
    tags: ['New', 'Exciting', 'High discovery'],
  },
  'fit-moment': {
    title: 'Fit This Moment',
    description:
      'Swap default upcoming songs based on your mood, activity, and time of day.',
    tags: ['Mood-based', 'Contextual', 'Personal'],
  },
};

function toTrack(catalogTrack: CatalogTrack): Track {
  const { artistId: _artistId, genres: _genres, familiarity: _f, energy: _e, moods: _m, ...track } =
    catalogTrack;
  return track;
}

function pickTracks(
  catalog: CatalogTrack[],
  filter: (track: CatalogTrack) => boolean,
  count: number,
  seed: string,
): CatalogTrack[] {
  const pool = catalog.filter(filter);
  const seedNum = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const sorted = [...pool].sort((a, b) => {
    const aScore = (a.id.charCodeAt(0) + seedNum) % pool.length;
    const bScore = (b.id.charCodeAt(0) + seedNum) % pool.length;
    return aScore - bScore;
  });
  return sorted.slice(0, Math.min(count, sorted.length));
}

function vibeTracks(catalog: CatalogTrack[], currentArtistId: string): CatalogTrack[] {
  const pool = catalog.filter(
    (t) => t.artistId === currentArtistId || t.familiarity === 'high',
  );
  return pool.length > 0
    ? pool
    : pickTracks(catalog, (t) => t.familiarity !== 'low', pool.length || catalog.length, 'vibe');
}

function discoverTracks(catalog: CatalogTrack[], currentArtistId: string): CatalogTrack[] {
  const pool = catalog.filter(
    (t) => t.artistId !== currentArtistId && t.familiarity !== 'high',
  );
  return pool.length > 0
    ? pool
    : pickTracks(catalog, (t) => t.familiarity !== 'high', catalog.length, 'discover');
}

function momentTracks(catalog: CatalogTrack[], contextLabel: string): CatalogTrack[] {
  if (contextLabel === 'Workout') {
    return pickTracks(catalog, (t) => t.energy === 'high', catalog.length, 'workout');
  }

  const moodMap: Record<string, string[]> = {
    'Morning Commute': ['upbeat', 'focused'],
    'Rainy Evening': ['calm', 'evening', 'rainy'],
    'Evening Relaxation': ['calm', 'evening'],
    'Weekend Exploration': ['discovery', 'playful'],
    'Deep Focus': ['focused', 'cool'],
    'Late-night Chill': ['calm', 'atmospheric', 'evening'],
  };

  const targetMoods = moodMap[contextLabel] ?? ['calm', 'evening'];

  const matched = catalog.filter((t) => t.moods.some((m) => targetMoods.includes(m)));
  if (matched.length > 0) return matched;
  return pickTracks(catalog, () => true, catalog.length, contextLabel);
}

function buildExplanation(
  pathType: PathType,
  context: SessionContext,
  signals: DiscoverySignals,
): string {
  const { weather, locationCategory } = signals.context;

  switch (pathType) {
    case 'stay-in-vibe':
      return `Familiar picks that match your current sound — keeps going like your queue.`;
    case 'discover-new':
      return `Fresh picks for ${context.label.toLowerCase()} — keeps going as you listen.`;
    case 'fit-moment': {
      const weatherNote = weather === 'rainy' ? "today's weather, " : '';
      const locationNote =
        locationCategory === 'commute'
          ? 'your commute'
          : locationCategory === 'gym'
            ? 'your workout'
            : 'your current session';
      return `Built for ${weatherNote}${locationNote} — keeps going like your queue.`;
    }
  }
}

function buildPath(
  type: PathType,
  tracks: CatalogTrack[],
  context: SessionContext,
  signals: DiscoverySignals,
): ListeningPath {
  const meta = PATH_META[type];
  const trackList = tracks.map(toTrack);

  return {
    id: `path-${type}`,
    type,
    title: meta.title,
    description: meta.description,
    tags: meta.tags,
    previewTrack: trackList[0],
    upcomingTracks: trackList,
    aiExplanation: buildExplanation(type, context, signals),
  };
}

export function generateListeningPaths(
  sessionContext: SessionContext,
  signals: DiscoverySignals,
  currentTrack: Track,
  catalog: CatalogTrack[],
): ListeningPath[] {
  const currentArtistId =
    catalog.find((t) => t.id === currentTrack.id)?.artistId ?? 'billie-eilish';

  const stayTracks = vibeTracks(catalog, currentArtistId);
  const discoverTrackList = discoverTracks(catalog, currentArtistId);
  const momentTrackList = momentTracks(catalog, sessionContext.label);

  return [
    buildPath('stay-in-vibe', stayTracks, sessionContext, signals),
    buildPath('discover-new', discoverTrackList, sessionContext, signals),
    buildPath('fit-moment', momentTrackList, sessionContext, signals),
  ];
}

export function buildWhyExplanation(
  pathType: PathType,
  sessionContext: SessionContext,
  _signals: DiscoverySignals,
): {
  currentMood: string;
  listeningHistoryInsight: string;
  activity: string;
  discoveryReadiness: string;
} {
  const readinessLabel =
    sessionContext.discoveryReadiness >= 70
      ? 'High'
      : sessionContext.discoveryReadiness >= 40
        ? 'Moderate'
        : 'Low';

  const historyInsight =
    pathType === 'stay-in-vibe'
      ? 'You enjoy soft pop and introspective artists.'
      : pathType === 'discover-new'
        ? 'Your taste overlaps with indie pop and fresh chart picks.'
        : 'You often listen to calm, atmospheric tracks in similar moments.';

  return {
    currentMood: sessionContext.label,
    listeningHistoryInsight: historyInsight,
    activity: sessionContext.activity,
    discoveryReadiness: `${readinessLabel} / ${sessionContext.discoveryReadiness}%`,
  };
}
