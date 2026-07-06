import type { ReactNode } from 'react';
import type { PathType } from '../../types/track';
import { useQueue } from './QueueContext';
import { useDiscoveryDna } from './DiscoveryDnaContext';
import styles from './AiDebugPanel.module.css';

interface AiDebugToggleProps {
  variant?: 'sidebar' | 'footer';
}

export function AiDebugToggle({ variant = 'sidebar' }: AiDebugToggleProps) {
  const { debugPanelOpen, setDebugPanelOpen, signalOverrides } = useDiscoveryDna();
  const hasOverrides = Object.keys(signalOverrides).length > 0;

  if (debugPanelOpen) {
    return null;
  }

  if (variant === 'sidebar') {
    return (
      <div className={styles.sidebarToggle}>
        <Star className={styles.starChipLeft} delay={0} />
        <Star className={styles.starChipRight} delay={0.45} />
        <button
          type="button"
          className={[styles.sidebarChip, hasOverrides && styles.badgeActive].filter(Boolean).join(' ')}
          onClick={() => setDebugPanelOpen(true)}
          aria-label="Open Spotify Discovery DNA debug panel — click here"
          title="Spotify Discovery DNA"
        >
          <span className={styles.chipAi}>AI</span>
          <span className={styles.chipHint}>click here</span>
        </button>
      </div>
    );
  }

  return (
    <div className={[styles.badgeWrap, styles.badgeWrapFooter].join(' ')}>
      <Star className={styles.starTopLeft} delay={0} />
      <Star className={styles.starTopRight} delay={0.35} />
      <button
        type="button"
        className={[styles.badge, hasOverrides && styles.badgeActive].filter(Boolean).join(' ')}
        onClick={() => setDebugPanelOpen(true)}
        aria-label="Open Spotify Discovery DNA debug panel"
        title="Spotify Discovery DNA"
      >
        AI
        {hasOverrides && <span className={styles.badgeDot} aria-hidden />}
      </button>
      <span className={styles.clickHere}>click here</span>
    </div>
  );
}

const STRATEGIES: Record<
  PathType,
  {
    dot: string;
    title: string;
    subtitle: string;
    description: string;
    familiarity: number;
    novelty: number;
    goal: string;
    badge?: string;
    accent: 'vibe' | 'discover' | 'moment';
  }
> = {
  'stay-in-vibe': {
    dot: '🟢',
    title: 'Stay in the Vibe',
    subtitle: 'Preserve musical continuity',
    description:
      'Continue the current listening experience while reducing repetitive recommendations.',
    familiarity: 5,
    novelty: 1,
    goal: 'Maximize familiarity while minimizing repetition.',
    accent: 'vibe',
  },
  'discover-new': {
    dot: '🟣',
    title: 'Discover Something New',
    subtitle: "Expand the user's music taste",
    description:
      'Introduce carefully selected unfamiliar artists with a high likelihood of adoption.',
    familiarity: 3,
    novelty: 5,
    goal: 'Maximize meaningful discovery while maintaining high adoption probability.',
    accent: 'discover',
  },
  'fit-moment': {
    dot: '🟠',
    title: 'Fit This Moment',
    subtitle: 'Adapt to the current session',
    description:
      'Generate recommendations based on the inferred listening context rather than only historical preferences.',
    familiarity: 4,
    novelty: 3,
    goal: 'Maximize contextual relevance.',
    badge: 'Context Driven',
    accent: 'moment',
  },
};

const FLOW_STEPS = [
  'Spotify Signals',
  'Discovery DNA\n(AI Decision Layer)',
  'Current Session Understanding',
  'Generate Recommendation Strategies',
  'Spotify Recommendation Engine',
  'Updated Queue',
] as const;

export function AiDebugPanel() {
  const { currentTrack } = useQueue();
  const {
    debugPanelOpen,
    setDebugPanelOpen,
    pathsStatus,
    sessionContext,
    signals,
    signalOverrides,
    updateSignalOverride,
    resetSignalOverrides,
    simulateDnaFailure,
    setSimulateDnaFailure,
    hoveredPathType,
  } = useDiscoveryDna();

  const hasOverrides = Object.keys(signalOverrides).length > 0;
  const hasHover = hoveredPathType !== null;
  const isActive = pathsStatus === 'ready';

  if (!debugPanelOpen) {
    return null;
  }

  const timeLabel = formatTimeLabel(signals.context.timeOfDayHour);
  const dayLabel = signals.context.dayOfWeek === 0 || signals.context.dayOfWeek === 6 ? 'Weekend' : 'Weekday';
  const weatherLabel = formatWeather(signals.context.weather, signals.context.temperatureCelsius);
  const genreChips = ['Indie Pop', 'Acoustic', 'Singer-Songwriter'];

  return (
    <aside className={styles.panel} aria-label="Spotify Discovery DNA debug panel">
      <header className={styles.panelHeader}>
        <div className={styles.panelHeaderText}>
          <h2 className={styles.panelTitle}>🧠 Spotify Discovery DNA</h2>
          <p className={styles.panelSubtitle}>Developer View • MVP Only • Hidden in Production</p>
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => setDebugPanelOpen(false)}
          aria-label="Close debug panel"
        >
          ×
        </button>
      </header>

      <div className={styles.panelBody}>
        <div className={styles.statusBar}>
          <span className={styles.statusDot} aria-hidden />
          <div className={styles.statusCopy}>
            <p className={styles.statusTitle}>Discovery DNA Active</p>
            <p className={styles.statusMeta}>Session analyzed in 0.8s</p>
          </div>
        </div>

        {hasOverrides && (
          <p className={styles.overrideNotice}>Demo overrides active — paths regenerate on change.</p>
        )}
        {pathsStatus === 'loading' && <p className={styles.statusNotice}>Regenerating strategies…</p>}
        {pathsStatus === 'error' && (
          <p className={styles.errorNotice}>DNA error — paths hidden; default queue only.</p>
        )}

        <section className={styles.section} aria-labelledby="session-understanding-heading">
          <h3 id="session-understanding-heading" className={styles.sectionHeading}>
            Current Session Understanding
          </h3>
          <div className={styles.sessionGrid}>
            <SessionCard
              icon="🚗"
              title="Current Session Context"
              value={sessionContext.label}
              helper="AI infers the current listening context using multiple real-time and historical signals."
            >
              <div className={styles.confidenceRow}>
                <span className={styles.confidenceLabel}>Confidence</span>
                <span className={styles.confidenceValue}>{sessionContext.contextConfidence}%</span>
              </div>
            </SessionCard>

            <SessionCard
              icon="🎯"
              title="Current Listening Intent"
              value={sessionContext.listeningIntentLabel}
              helper="Represents what the user is most likely trying to achieve during this listening session."
            />

            <div className={styles.sessionCard}>
              <div className={styles.sessionCardHeader}>
                <span className={styles.sessionIcon} aria-hidden>
                  ✨
                </span>
                <span className={styles.sessionCardTitle}>Discovery Confidence</span>
              </div>
              <div className={styles.ringWrap}>
                <CircularProgress value={sessionContext.discoveryReadiness} />
                <span className={styles.ringValue}>{sessionContext.discoveryReadiness}%</span>
              </div>
              <p className={styles.sessionHelper}>
                AI&apos;s confidence that the user is ready to explore new music in the current session.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="signals-heading">
          <h3 id="signals-heading" className={styles.sectionHeading}>
            Signals Used
          </h3>
          <div className={styles.signalChips}>
            <SignalChip icon="🕒" label="Time" value={`${dayLabel} • ${timeLabel}`} />
            <SignalChip icon="🌦️" label="Weather" value={weatherLabel} />
            <SignalChip icon="📍" label="Usual Activity" value={signals.context.usualActivity} />
            <SignalChip
              icon="🎵"
              label="Current Song"
              value={`${currentTrack.title} • ${currentTrack.artist}`}
            />
            <SignalChip
              icon="🎧"
              label="Current Session"
              value={[
                `${signals.session.sessionDurationMinutes} min session`,
                signals.session.skipRate < 0.15 ? 'Low skip rate' : 'Moderate skip rate',
                `${Math.max(1, Math.round(signals.session.repeatRate * 10))} repeated songs`,
              ]}
            />
            <SignalChip icon="📚" label="Listening History" value={genreChips} />
            <SignalChip
              icon="🔍"
              label="Discovery Behaviour"
              value="Usually discovers new music during evening sessions."
            />
          </div>
        </section>

        <div className={styles.divider} aria-hidden>
          <span>↓</span>
        </div>
        <p className={styles.dividerCaption}>
          Discovery DNA generates recommendation strategies—not playlists.
        </p>

        <section className={styles.section} aria-labelledby="strategies-heading">
          <h3 id="strategies-heading" className={styles.sectionHeading}>
            Generated Listening Strategies
          </h3>
          <div className={styles.strategyList}>
            {(Object.keys(STRATEGIES) as PathType[]).map((type) => (
              <StrategyCard
                key={type}
                type={type}
                config={STRATEGIES[type]}
                isHighlighted={hasHover && hoveredPathType === type}
                isDimmed={hasHover && hoveredPathType !== type}
                animateBars={hasHover && hoveredPathType === type}
              />
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="flow-heading">
          <h3 id="flow-heading" className={styles.sectionHeading}>
            Recommendation Generation Flow
          </h3>
          <div className={styles.flow}>
            {FLOW_STEPS.map((step, index) => (
              <div key={step} className={styles.flowStepWrap}>
                <div
                  className={[
                    styles.flowStep,
                    index === 1 && styles.flowStepAccent,
                    isActive && styles.flowStepActive,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {step.split('\n').map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </div>
                {index < FLOW_STEPS.length - 1 && <span className={styles.flowArrow} aria-hidden>↓</span>}
              </div>
            ))}
          </div>
        </section>

        <div className={styles.callout}>
          <p>
            Discovery DNA is an AI decision layer added above Spotify&apos;s existing recommendation
            engine. It does not generate playlists. Instead, it determines the recommendation
            strategy for the current session, while Spotify&apos;s recommendation engine assembles the
            final queue within those AI-generated constraints.
          </p>
        </div>

        <details className={styles.devControls}>
          <summary>Developer Controls</summary>
          <div className={styles.devControlsBody}>
            <label className={styles.toggleField}>
              <input
                type="checkbox"
                checked={simulateDnaFailure}
                onChange={(e) => setSimulateDnaFailure(e.target.checked)}
              />
              <span>Simulate DNA failure</span>
            </label>

            <label className={styles.field}>
              <span>Discovery readiness</span>
              <input
                type="range"
                min={0}
                max={100}
                value={signalOverrides.discoveryReadiness ?? sessionContext.discoveryReadiness}
                onChange={(e) => updateSignalOverride('discoveryReadiness', Number(e.target.value))}
                className={styles.range}
              />
            </label>

            <label className={styles.field}>
              <span>Time of day</span>
              <select
                value={signalOverrides.timeOfDayPreset ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  updateSignalOverride(
                    'timeOfDayPreset',
                    val ? (val as 'morning' | 'afternoon' | 'evening' | 'late-night') : undefined,
                  );
                }}
              >
                <option value="">Auto (demo default)</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="late-night">Late night</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>Weather</span>
              <select
                value={signalOverrides.weather ?? signals.context.weather}
                onChange={(e) =>
                  updateSignalOverride('weather', e.target.value as typeof signals.context.weather)
                }
              >
                <option value="clear">Clear</option>
                <option value="rainy">Rainy</option>
                <option value="cloudy">Cloudy</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>Location</span>
              <select
                value={signalOverrides.locationCategory ?? signals.context.locationCategory}
                onChange={(e) =>
                  updateSignalOverride(
                    'locationCategory',
                    e.target.value as typeof signals.context.locationCategory,
                  )
                }
              >
                <option value="home">Home</option>
                <option value="commute">Commute</option>
                <option value="gym">Gym</option>
              </select>
            </label>

            <button type="button" className={styles.resetBtn} onClick={resetSignalOverrides}>
              Reset overrides
            </button>
          </div>
        </details>

        <p className={styles.footerNote}>
          This panel is not a consumer-facing feature. It exists solely to demonstrate how Spotify
          Discovery DNA interprets user context and generates AI-powered recommendation strategies
          during the MVP presentation.
        </p>
      </div>
    </aside>
  );
}

function SessionCard({
  icon,
  title,
  value,
  helper,
  children,
}: {
  icon: string;
  title: string;
  value: string;
  helper: string;
  children?: ReactNode;
}) {
  return (
    <div className={styles.sessionCard}>
      <div className={styles.sessionCardHeader}>
        <span className={styles.sessionIcon} aria-hidden>
          {icon}
        </span>
        <span className={styles.sessionCardTitle}>{title}</span>
      </div>
      <p className={styles.sessionValue}>{value}</p>
      {children}
      <p className={styles.sessionHelper}>{helper}</p>
    </div>
  );
}

function SignalChip({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | string[];
}) {
  const lines = Array.isArray(value) ? value : [value];
  return (
    <div className={styles.signalChip}>
      <span className={styles.signalIcon} aria-hidden>
        {icon}
      </span>
      <div className={styles.signalCopy}>
        <span className={styles.signalLabel}>{label}</span>
        {lines.map((line) => (
          <span key={line} className={styles.signalValue}>
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}

function StrategyCard({
  type,
  config,
  isHighlighted,
  isDimmed,
  animateBars,
}: {
  type: PathType;
  config: (typeof STRATEGIES)[PathType];
  isHighlighted: boolean;
  isDimmed: boolean;
  animateBars: boolean;
}) {
  return (
    <article
      className={[
        styles.strategyCard,
        styles[`strategy${capitalize(config.accent)}`],
        isHighlighted && styles.strategyHighlighted,
        isDimmed && styles.strategyDimmed,
      ]
        .filter(Boolean)
        .join(' ')}
      data-path-type={type}
    >
      <div className={styles.strategyHeader}>
        <span className={styles.strategyDot} aria-hidden>
          {config.dot}
        </span>
        <div>
          <h4 className={styles.strategyTitle}>{config.title}</h4>
          <p className={styles.strategySubtitle}>{config.subtitle}</p>
        </div>
        {config.badge && <span className={styles.strategyBadge}>{config.badge}</span>}
      </div>
      <p className={styles.strategyDescription}>{config.description}</p>
      <MetricBar label="Familiarity" filled={config.familiarity} animate={animateBars} />
      <MetricBar label="Novelty" filled={config.novelty} animate={animateBars} />
      <p className={styles.strategyGoal}>
        <span className={styles.strategyGoalLabel}>Optimization Goal</span>
        {config.goal}
      </p>
    </article>
  );
}

function MetricBar({
  label,
  filled,
  animate,
}: {
  label: string;
  filled: number;
  animate: boolean;
}) {
  return (
    <div className={styles.metricBar}>
      <span className={styles.metricLabel}>{label}</span>
      <div className={styles.metricTrack} aria-hidden>
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className={[
              styles.metricSegment,
              index < filled && styles.metricSegmentFilled,
              animate && index < filled && styles.metricSegmentAnimate,
            ]
              .filter(Boolean)
              .join(' ')}
            style={animate ? { animationDelay: `${index * 60}ms` } : undefined}
          />
        ))}
      </div>
    </div>
  );
}

function CircularProgress({ value }: { value: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg className={styles.ring} viewBox="0 0 72 72" aria-hidden>
      <circle className={styles.ringTrack} cx="36" cy="36" r={radius} />
      <circle
        className={styles.ringProgress}
        cx="36"
        cy="36"
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

function formatTimeLabel(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  const minutes = hour === 18 ? '15' : '00';
  return `${h}:${minutes} ${period}`;
}

function formatWeather(weather: string, temp: number): string {
  const label =
    weather === 'rainy' ? 'Light Rain' : weather === 'cloudy' ? 'Cloudy' : 'Clear';
  return `${label} • ${temp}°C`;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function Star({ className, delay }: { className: string; delay: number }) {
  return (
    <span className={className} style={{ animationDelay: `${delay}s` }} aria-hidden>
      <svg viewBox="0 0 16 16" width={12} height={12} fill="currentColor">
        <path d="M8 0.5l1.55 5.7L15 7.2l-4.7 1.35L8 14.5 5.7 8.55 1 7.2l5.45-1z" />
      </svg>
    </span>
  );
}
