import type { DiscoverySignals, ListeningIntent, SessionContext } from './types';

const INTENT_LABELS: Record<ListeningIntent, string> = {
  familiar: 'Relax & Unwind',
  balanced: 'Stay Engaged',
  exploratory: 'Explore & Discover',
};

export function inferSessionContext(signals: DiscoverySignals): SessionContext {
  const { context, behaviour, session } = signals;
  const { timeOfDayHour, dayOfWeek, weather, locationCategory, usualActivity } = context;
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  let label = 'Evening Relaxation';
  let mood = 'Relaxed';
  let activity = usualActivity;
  let contextConfidence = 88;

  if (locationCategory === 'gym') {
    label = 'Workout';
    mood = 'Energized';
    activity = 'High-intensity workout';
    contextConfidence = 94;
  } else if (locationCategory === 'commute') {
    if (timeOfDayHour >= 16) {
      label = 'Evening Commute';
      mood = 'Relaxed';
      activity = 'Evening commute';
      contextConfidence = 91;
    } else {
      label = 'Morning Commute';
      mood = 'Alert';
      activity = 'Commute listening';
      contextConfidence = 89;
    }
  } else if (weather === 'rainy' && timeOfDayHour >= 17) {
    label = 'Rainy Evening';
    mood = 'Cozy';
    activity = 'Unwinding at home';
    contextConfidence = 87;
  } else if (isWeekend && timeOfDayHour >= 10 && timeOfDayHour <= 18) {
    label = 'Weekend Exploration';
    mood = 'Curious';
    activity = 'Casual weekend listening';
    contextConfidence = 85;
  } else if (timeOfDayHour >= 9 && timeOfDayHour <= 12) {
    label = 'Deep Focus';
    mood = 'Focused';
    activity = 'Light work or study';
    contextConfidence = 86;
  } else if (timeOfDayHour >= 22 || timeOfDayHour < 6) {
    label = 'Late-night Chill';
    mood = 'Calm';
    activity = 'Late-night wind-down';
    contextConfidence = 84;
  }

  const primarySignals: string[] = [];
  if (weather === 'rainy') primarySignals.push('Rainy weather');
  if (isWeekend) primarySignals.push('Weekend session');
  else primarySignals.push('Weekday evening');
  if (session.skipRate < 0.2) primarySignals.push('Low skip rate');
  if (locationCategory === 'commute') primarySignals.push('Commute pattern');
  if (locationCategory === 'gym') primarySignals.push('Workout detected');
  primarySignals.push('Acoustic-leaning session');

  let preferredListeningIntent: ListeningIntent = 'balanced';
  if (behaviour.discoveryReadiness >= 70) preferredListeningIntent = 'exploratory';
  else if (behaviour.discoveryReadiness <= 35) preferredListeningIntent = 'familiar';
  else if (label === 'Evening Commute' || label === 'Rainy Evening') {
    preferredListeningIntent = 'familiar';
  }

  return {
    label,
    contextConfidence,
    discoveryReadiness: behaviour.discoveryReadiness,
    preferredListeningIntent,
    listeningIntentLabel: INTENT_LABELS[preferredListeningIntent],
    primarySignals,
    mood,
    activity,
  };
}
