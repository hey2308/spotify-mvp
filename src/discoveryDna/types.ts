export type LocationCategory = 'home' | 'commute' | 'gym';
export type WeatherCondition = 'clear' | 'rainy' | 'cloudy';
export type DeviceType = 'desktop' | 'mobile' | 'tablet';
export type ListeningIntent = 'familiar' | 'balanced' | 'exploratory';
export type TimeOfDayPreset = 'morning' | 'afternoon' | 'evening' | 'late-night';

export interface UserSignals {
  currentSongId: string;
  listeningHistoryArtistIds: string[];
  savedSongIds: string[];
  followedArtistIds: string[];
  genreAffinities: Record<string, number>;
}

export interface SessionSignals {
  recentlyPlayedIds: string[];
  sessionDurationMinutes: number;
  skipRate: number;
  repeatRate: number;
  searchQueries: string[];
  queueInteractions: number;
}

export interface ContextSignals {
  timeOfDayHour: number;
  dayOfWeek: number;
  weather: WeatherCondition;
  deviceType: DeviceType;
  locationCategory: LocationCategory;
  usualActivity: string;
  temperatureCelsius: number;
}

export interface BehaviourSignals {
  discoveryReadiness: number;
  noveltyTolerance: number;
  familiarityPreference: number;
  explorationHistory: 'low' | 'moderate' | 'high';
}

export interface DiscoverySignals {
  user: UserSignals;
  session: SessionSignals;
  context: ContextSignals;
  behaviour: BehaviourSignals;
}

export interface SessionContext {
  label: string;
  /** Presenter confidence in inferred session context (0–100). */
  contextConfidence: number;
  discoveryReadiness: number;
  preferredListeningIntent: ListeningIntent;
  /** Human-readable intent for the debug panel. */
  listeningIntentLabel: string;
  primarySignals: string[];
  mood: string;
  activity: string;
}

/** Partial overrides used by the debug panel (Phase 4 stub, expanded in Phase 6). */
export interface SignalOverrides {
  timeOfDayPreset?: TimeOfDayPreset;
  dayType?: 'weekday' | 'weekend';
  weather?: WeatherCondition;
  locationCategory?: LocationCategory;
  discoveryReadiness?: number;
}

export interface WhyThisPathExplanation {
  currentMood: string;
  listeningHistoryInsight: string;
  activity: string;
  discoveryReadiness: string;
}
