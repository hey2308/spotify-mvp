import { ShuffleIcon } from '../../components/icons/ShuffleIcon';
import { useQueue } from '../../features/listening-paths';
import styles from './PlaybackControls.module.css';

interface PlaybackControlsProps {
  variant?: 'default' | 'large';
}

export function PlaybackControls({ variant = 'default' }: PlaybackControlsProps) {
  const isLarge = variant === 'large';
  const { playNext, playPrevious, canPlayNext, canPlayPrevious } = useQueue();

  return (
    <div className={[styles.controls, isLarge && styles.large].filter(Boolean).join(' ')}>
      <button type="button" className={styles.secondary} aria-label="Shuffle">
        <ShuffleIcon />
      </button>
      <button
        type="button"
        className={styles.secondary}
        aria-label="Previous"
        disabled={!canPlayPrevious}
        onClick={playPrevious}
      >
        <PrevIcon />
      </button>
      <button type="button" className={styles.play} aria-label="Pause">
        <PauseIcon />
      </button>
      <button
        type="button"
        className={styles.secondary}
        aria-label="Next"
        disabled={!canPlayNext}
        onClick={playNext}
      >
        <NextIcon />
      </button>
      <button type="button" className={styles.secondary} aria-label="Repeat">
        <RepeatIcon />
      </button>
    </div>
  );
}

function PrevIcon() {
  return (
    <svg viewBox="0 0 16 16" width={20} height={20} fill="currentColor" aria-hidden>
      <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" width={24} height={24} fill="currentColor" aria-hidden>
      <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 16 16" width={20} height={20} fill="currentColor" aria-hidden>
      <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.106A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z" />
    </svg>
  );
}

function RepeatIcon() {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} fill="currentColor" aria-hidden>
      <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v3a.75.75 0 0 1-1.5 0z" />
    </svg>
  );
}
