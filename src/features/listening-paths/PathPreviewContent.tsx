import type { ListeningPath } from '../../types/listeningPath';
import { AlbumArt } from '../../components/player/AlbumArt';
import styles from './PathPreviewContent.module.css';

interface PathPreviewContentProps {
  path: ListeningPath;
  onChoosePath: (event: React.MouseEvent) => void;
  onSeeMore?: (event: React.MouseEvent) => void;
  showSeeMore?: boolean;
  variant?: 'inline' | 'centered';
}

export function PathPreviewContent({
  path,
  onChoosePath,
  onSeeMore,
  showSeeMore = false,
  variant = 'inline',
}: PathPreviewContentProps) {
  const previewTracks = path.upcomingTracks.slice(0, 3);

  return (
    <div
      className={[styles.preview, variant === 'centered' && styles.centered].filter(Boolean).join(' ')}
      data-path-type={path.type}
    >
      <p className={styles.sampleLabel}>Sample of what plays next</p>
      <ul className={styles.trackList} aria-label="Sample upcoming songs in this path">
        {previewTracks.map((track, index) => (
          <li key={`${track.id}-${index}`} className={styles.trackItem}>
            <AlbumArt track={track} size="sm" />
            <div className={styles.trackMeta}>
              <p className={styles.trackTitle}>{track.title}</p>
              <p className={styles.trackArtist}>{track.artist}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.chooseBtn}
          data-path-type={path.type}
          onClick={onChoosePath}
        >
          Choose this path
        </button>
        {showSeeMore && onSeeMore && (
          <button type="button" className={styles.seeMoreBtn} onClick={onSeeMore}>
            See full preview
          </button>
        )}
      </div>
    </div>
  );
}
