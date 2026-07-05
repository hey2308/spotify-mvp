import type { Track } from '../../types/track';
import { AlbumArt } from '../player/AlbumArt';
import styles from './QueueTrackList.module.css';

interface QueueTrackListProps {
  tracks: Track[];
  title?: string;
  showDragHandle?: boolean;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function QueueTrackList({
  tracks,
  title = 'Next in queue',
  showDragHandle = true,
}: QueueTrackListProps) {
  return (
    <section className={styles.section} aria-label={title}>
      {title && <h2 className={styles.heading}>{title}</h2>}
      <ul className={styles.list}>
        {tracks.map((track) => (
          <li key={track.id} className={styles.item}>
            <AlbumArt track={track} size="sm" />
            <div className={styles.info}>
              <p className={styles.title}>{track.title}</p>
              <p className={styles.artist}>{track.artist}</p>
            </div>
            <span className={styles.duration}>{formatDuration(track.durationMs)}</span>
            {showDragHandle && (
              <button type="button" className={styles.dragHandle} aria-label={`Reorder ${track.title}`}>
                <DragIcon />
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function DragIcon() {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} fill="currentColor" aria-hidden>
      <path d="M4 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2m0 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2m0 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2m4-7a1 1 0 1 1 0-2 1 1 0 0 1 0 2m0 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2m0 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
    </svg>
  );
}
