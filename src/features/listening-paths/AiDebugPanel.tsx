import { useDiscoveryDna } from './DiscoveryDnaContext';
import styles from './AiDebugPanel.module.css';

const INTENT_LABELS: Record<string, string> = {
  familiar: 'Stay familiar',
  balanced: 'Balanced mix',
  exploratory: 'Open to discovery',
};

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
          aria-label="Open AI Debug Panel — click here"
          title="AI Debug Panel"
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
        aria-label="Open AI Debug Panel"
        title="AI Debug Panel"
      >
        AI
        {hasOverrides && <span className={styles.badgeDot} aria-hidden />}
      </button>
      <span className={styles.clickHere}>click here</span>
    </div>
  );
}

export function AiDebugPanel() {
  const {
    debugPanelOpen,
    setDebugPanelOpen,
    pathsStatus,
    sessionContext,
    signals,
    listeningPaths,
    signalOverrides,
    updateSignalOverride,
    resetSignalOverrides,
    simulateDnaFailure,
    setSimulateDnaFailure,
  } = useDiscoveryDna();

  const hasOverrides = Object.keys(signalOverrides).length > 0;

  if (!debugPanelOpen) {
    return null;
  }

  return (
    <aside className={styles.panel} aria-label="AI Debug Panel">
      <header className={styles.header}>
        <h2 className={styles.title}>Discovery DNA</h2>
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
        <p className={styles.presentationNote}>
          The AI Debug Panel is included only in this MVP to visualize how Spotify Discovery DNA
          generates contextual listening paths. It is a developer-facing aid and would not be part
          of the production experience.
        </p>

      {hasOverrides && (
        <p className={styles.overrideNotice}>Demo overrides active — paths regenerate on change.</p>
      )}

      {pathsStatus === 'loading' && (
        <p className={styles.statusNotice}>Regenerating paths…</p>
      )}

      {pathsStatus === 'error' && (
        <p className={styles.errorNotice}>DNA error — paths hidden; default queue only.</p>
      )}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Current Context</h3>
        <p className={styles.value}>{sessionContext.label}</p>
        <p className={styles.meta}>Mood: {sessionContext.mood}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Discovery Readiness</h3>
        <p className={styles.value}>{sessionContext.discoveryReadiness}%</p>
        <input
          type="range"
          min={0}
          max={100}
          value={signalOverrides.discoveryReadiness ?? sessionContext.discoveryReadiness}
          onChange={(e) => updateSignalOverride('discoveryReadiness', Number(e.target.value))}
          className={styles.range}
          aria-label="Discovery readiness override"
        />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Preferred Listening Intent</h3>
        <p className={styles.value}>
          {INTENT_LABELS[sessionContext.preferredListeningIntent] ??
            sessionContext.preferredListeningIntent}
        </p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Primary Signals</h3>
        <ul className={styles.checklist}>
          {sessionContext.primarySignals.map((signal) => (
            <li key={signal}>✓ {signal}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Live Signals</h3>
        <ul className={styles.metaList}>
          <li>Device: {signals.context.deviceType}</li>
          <li>Weather: {signals.context.weather}</li>
          <li>Location: {signals.context.locationCategory}</li>
          <li>Activity: {sessionContext.activity}</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Demo Controls</h3>
        <label className={styles.toggleField}>
          <input
            type="checkbox"
            checked={simulateDnaFailure}
            onChange={(e) => setSimulateDnaFailure(e.target.checked)}
          />
          <span>Simulate DNA failure</span>
        </label>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Overrides</h3>

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
            <option value="">Auto (device clock)</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="late-night">Late night</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>Day type</span>
          <select
            value={signalOverrides.dayType ?? ''}
            onChange={(e) =>
              updateSignalOverride(
                'dayType',
                e.target.value ? (e.target.value as 'weekday' | 'weekend') : undefined,
              )
            }
          >
            <option value="">Auto</option>
            <option value="weekday">Weekday</option>
            <option value="weekend">Weekend</option>
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
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Generated Paths</h3>
        <ul className={styles.pathList}>
          {listeningPaths.map((path) => (
            <li key={path.id}>✓ {path.title}</li>
          ))}
        </ul>
      </section>
      </div>
    </aside>
  );
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
