import type { Track } from '../../types/track';
import { QueuePanel } from '../queue/QueuePanel';
import styles from './QueueSidebar.module.css';

interface QueueSidebarProps {
  currentTrack: Track;
  onClose: () => void;
}

export function QueueSidebar({ currentTrack, onClose }: QueueSidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="Queue">
      <header className={styles.header}>
        <h1 className={styles.title}>Queue</h1>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close queue">
          <CloseIcon />
        </button>
      </header>

      <div className={styles.content}>
        <QueuePanel currentTrack={currentTrack} variant="web" />
      </div>
    </aside>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" width={20} height={20} fill="currentColor" aria-hidden>
      <path d="M3.8 3.8a.75.75 0 0 1 1.06 0L8 6.94l3.14-3.14a.75.75 0 1 1 1.06 1.06L9.06 8l3.14 3.14a.75.75 0 0 1-1.06 1.06L8 9.06l-3.14 3.14a.75.75 0 0 1-1.06-1.06L6.94 8 3.8 4.86a.75.75 0 0 1 0-1.06" />
    </svg>
  );
}
