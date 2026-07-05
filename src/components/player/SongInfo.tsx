import { getSongInfo } from '../../mocks/songInfo';
import type { Track } from '../../types/track';
import styles from './SongInfo.module.css';

interface SongInfoProps {
  track: Track;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function SongInfo({ track }: SongInfoProps) {
  const info = getSongInfo(track);

  return (
    <section className={styles.songInfo} aria-label="Song information">
      <dl className={styles.details}>
        <div className={styles.row}>
          <dt>Duration</dt>
          <dd>{formatDuration(track.durationMs)}</dd>
        </div>
        <div className={styles.row}>
          <dt>Release date</dt>
          <dd>{info.releaseDate}</dd>
        </div>
        <div className={styles.row}>
          <dt>Album</dt>
          <dd>{track.album}</dd>
        </div>
        <div className={styles.row}>
          <dt>Label</dt>
          <dd>{info.label}</dd>
        </div>
      </dl>

      <div className={styles.credits}>
        <h2 className={styles.sectionTitle}>Credits</h2>
        <dl className={styles.details}>
          <div className={styles.row}>
            <dt>Written by</dt>
            <dd>{info.songwriters.join(', ')}</dd>
          </div>
          <div className={styles.row}>
            <dt>Produced by</dt>
            <dd>{info.producers.join(', ')}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.about}>
        <h2 className={styles.sectionTitle}>About the artist</h2>
        <p className={styles.aboutText}>{info.aboutArtist}</p>
      </div>
    </section>
  );
}
