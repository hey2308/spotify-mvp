import type { Track } from '../../types/track';
import { AlbumArt } from '../player/AlbumArt';
import { PlaybackControls } from '../player/PlaybackControls';
import styles from './PlayerBar.module.css';

interface PlayerBarProps {
  track: Track;
  queueOpen?: boolean;
  onQueueToggle?: () => void;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function PlayerBar({ track, queueOpen = false, onQueueToggle }: PlayerBarProps) {
  return (
    <footer className={styles.bar} aria-label="Player controls">
      <div className={styles.trackInfo}>
        <AlbumArt track={track} size="md" />
        <div className={styles.meta}>
          <p className={styles.title}>{track.title}</p>
          <p className={styles.artist}>{track.artist}</p>
        </div>
        <button type="button" className={styles.likeBtn} aria-label="Save to Liked Songs">
          <HeartIcon />
        </button>
      </div>

      <div className={styles.center}>
        <PlaybackControls />
        <div className={styles.progress}>
          <span className={styles.time}>1:08</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: '38%' }} />
          </div>
          <span className={styles.time}>{formatDuration(track.durationMs)}</span>
        </div>
      </div>

      <div className={styles.extra}>
        <button
          type="button"
          className={[styles.extraBtn, queueOpen && styles.extraBtnActive].filter(Boolean).join(' ')}
          aria-label="Queue"
          aria-pressed={queueOpen}
          onClick={onQueueToggle}
        >
          <QueueIcon />
        </button>
        <button type="button" className={styles.extraBtn} aria-label="Volume">
          <VolumeIcon />
        </button>
      </div>
    </footer>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} fill="currentColor" aria-hidden>
      <path d="M7.999 3.939 6.825 2.765a4.151 4.151 0 0 0-5.87 5.87L7.999 15.47l7.044-7.044a4.151 4.151 0 0 0-5.87-5.87z" />
    </svg>
  );
}

function QueueIcon() {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} fill="currentColor" aria-hidden>
      <path d="M15 15H1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1M3 5.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} fill="currentColor" aria-hidden>
      <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-4.875-3.25H1.75A.75.75 0 0 1 1 11.25V4.75a.75.75 0 0 1 .75-.75H4.99z" />
    </svg>
  );
}
