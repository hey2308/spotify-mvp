import { useEffect, useMemo, useState } from 'react';
import type { Track } from '../../types/track';
import styles from './AlbumArt.module.css';

interface AlbumArtProps {
  track: Track;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClass = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
} as const;

export function AlbumArt({ track, size = 'md', className }: AlbumArtProps) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [from, to] = track.albumArtGradient;

  const sources = useMemo(
    () => [track.albumArtUrl, track.albumArtFallbackUrl].filter(Boolean) as string[],
    [track.albumArtUrl, track.albumArtFallbackUrl],
  );

  useEffect(() => {
    setSourceIndex(0);
    setImageError(false);
  }, [track.id, track.albumArtUrl, track.albumArtFallbackUrl]);

  const activeSrc = sources[sourceIndex];

  if (!imageError && activeSrc) {
    return (
      <img
        key={activeSrc}
        src={activeSrc}
        alt={`${track.album} cover`}
        className={[styles.art, styles.image, sizeClass[size], className].filter(Boolean).join(' ')}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => {
          if (sourceIndex < sources.length - 1) {
            setSourceIndex((index) => index + 1);
            return;
          }
          setImageError(true);
        }}
      />
    );
  }

  return (
    <div
      className={[styles.art, styles.fallback, sizeClass[size], className].filter(Boolean).join(' ')}
      style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
      role="img"
      aria-label={`${track.album} album art`}
    >
      <span className={styles.artLabel} aria-hidden="true">
        {track.album.slice(0, 2)}
      </span>
    </div>
  );
}
