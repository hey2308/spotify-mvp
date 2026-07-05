import type {
  ContextSignals,
  DeviceType,
  DiscoverySignals,
  SignalOverrides,
  TimeOfDayPreset,
} from './types';

function detectDeviceType(): DeviceType {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) return 'tablet';
  if (/mobi|android|iphone/.test(ua)) return 'mobile';
  return 'desktop';
}

function hourFromPreset(preset: TimeOfDayPreset): number {
  switch (preset) {
    case 'morning':
      return 8;
    case 'afternoon':
      return 14;
    case 'evening':
      return 19;
    case 'late-night':
      return 23;
  }
}

function resolveContextSignals(overrides: SignalOverrides): ContextSignals {
  const now = new Date();
  const hour = overrides.timeOfDayPreset
    ? hourFromPreset(overrides.timeOfDayPreset)
    : now.getHours();

  let dayOfWeek = now.getDay();
  if (overrides.dayType === 'weekday') {
    dayOfWeek = dayOfWeek === 0 || dayOfWeek === 6 ? 2 : dayOfWeek;
  } else if (overrides.dayType === 'weekend') {
    dayOfWeek = dayOfWeek === 0 || dayOfWeek === 6 ? dayOfWeek : 6;
  }

  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  let locationCategory: ContextSignals['locationCategory'] = 'home';
  if (overrides.locationCategory) {
    locationCategory = overrides.locationCategory;
  } else if (hour >= 7 && hour <= 9 && !isWeekend) {
    locationCategory = 'commute';
  } else if (hour >= 17 && hour <= 19 && !overrides.weather) {
    locationCategory = 'home';
  }

  const weather = overrides.weather ?? (hour >= 18 ? 'rainy' : 'clear');

  let usualActivity = 'Evening relaxation at home';
  if (locationCategory === 'commute') usualActivity = 'Morning commute';
  else if (locationCategory === 'gym') usualActivity = 'Workout session';
  else if (isWeekend && hour >= 10 && hour <= 16) usualActivity = 'Weekend browsing';
  else if (hour >= 9 && hour <= 17) usualActivity = 'Light activity (browsing)';

  return {
    timeOfDayHour: hour,
    dayOfWeek,
    weather,
    deviceType: detectDeviceType(),
    locationCategory,
    usualActivity,
  };
}

function resolveBehaviourSignals(
  context: ContextSignals,
  overrides: SignalOverrides,
): DiscoverySignals['behaviour'] {
  if (overrides.discoveryReadiness !== undefined) {
    const score = overrides.discoveryReadiness;
    return {
      discoveryReadiness: score,
      noveltyTolerance: score / 100,
      familiarityPreference: 1 - score / 100,
      explorationHistory: score >= 70 ? 'high' : score >= 40 ? 'moderate' : 'low',
    };
  }

  const { timeOfDayHour, locationCategory, weather } = context;
  let score = 55;

  if (locationCategory === 'gym') score += 15;
  if (weather === 'rainy') score -= 10;
  if (timeOfDayHour >= 22 || timeOfDayHour < 6) score -= 15;
  if (timeOfDayHour >= 10 && timeOfDayHour <= 16) score += 10;

  score = Math.max(15, Math.min(92, score));

  return {
    discoveryReadiness: score,
    noveltyTolerance: score / 100,
    familiarityPreference: 1 - score / 100,
    explorationHistory: score >= 70 ? 'high' : score >= 40 ? 'moderate' : 'low',
  };
}

export function buildDiscoverySignals(
  currentSongId: string,
  overrides: SignalOverrides = {},
): DiscoverySignals {
  const context = resolveContextSignals(overrides);
  const behaviour = resolveBehaviourSignals(context, overrides);

  return {
    user: {
      currentSongId,
      listeningHistoryArtistIds: ['billie-eilish', 'chappell-roan', 'gracie-abrams'],
      savedSongIds: ['lunch', 'birds-of-a-feather', 'good-luck-babe'],
      followedArtistIds: ['billie-eilish', 'chappell-roan'],
      genreAffinities: { pop: 0.85, indie: 0.7, electronic: 0.45 },
    },
    session: {
      recentlyPlayedIds: ['lunch', 'birds-of-a-feather'],
      sessionDurationMinutes: 28,
      skipRate: 0.12,
      repeatRate: 0.08,
      searchQueries: ['billie eilish', 'chappell roan'],
      queueInteractions: 2,
    },
    context,
    behaviour,
  };
}
