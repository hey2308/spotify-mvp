import type { Track } from '../../types/track';
import { AlbumArt } from '../player/AlbumArt';
import { PlaybackControls } from '../player/PlaybackControls';
import styles from './NowPlayingView.module.css';

interface NowPlayingViewProps {
  track: Track;
  compact?: boolean;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function NowPlayingView({ track, compact = false }: NowPlayingViewProps) {
  if (compact) {
    return (
      <section className={styles.compact} aria-label="Now playing">
        <AlbumArt track={track} size="md" />
        <div className={styles.compactInfo}>
          <p className={styles.title}>{track.title}</p>
          <p className={styles.artist}>{track.artist}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.nowPlaying} aria-label="Now playing">
      <AlbumArt track={track} size="xl" className={styles.art} />
      <div className={styles.meta}>
        <h1 className={styles.title}>{track.title}</h1>
        <p className={styles.artist}>{track.artist}</p>
        <p className={styles.album}>{track.album}</p>
      </div>
      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: '38%' }} />
        </div>
        <div className={styles.progressTimes}>
          <span>1:08</span>
          <span>{formatDuration(track.durationMs)}</span>
        </div>
      </div>
      <PlaybackControls variant="large" />
    </section>
  );
}
