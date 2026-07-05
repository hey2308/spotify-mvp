import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ListeningPath } from '../../types/listeningPath';
import { AlbumArt } from '../../components/player/AlbumArt';
import { PathIcon } from './PathIcon';
import styles from './PathPreviewModal.module.css';

interface PathPreviewModalProps {
  path: ListeningPath;
  isOpen: boolean;
  onClose: () => void;
  onChoosePath: (event: React.MouseEvent) => void;
}

export function PathPreviewModal({
  path,
  isOpen,
  onClose,
  onChoosePath,
}: PathPreviewModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const carouselTracks = path.upcomingTracks.slice(0, 4);

  useEffect(() => {
    if (!isOpen) return;

    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        className={styles.dialog}
        data-path-type={path.type}
        role="dialog"
        aria-modal="true"
        aria-labelledby="path-preview-modal-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <PathIcon type={path.type} size="lg" />
            <div>
              <h2 id="path-preview-modal-title" className={styles.title}>
                {path.title}
              </h2>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close preview">
            <CloseIcon />
          </button>
        </header>

        <ul className={styles.tags} aria-label="Path tags">
          {path.tags.map((tag) => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>

        <p className={styles.sampleLabel}>Sample of what plays next</p>

        <div className={styles.carousel} aria-label="Sample upcoming songs in this path">
          {carouselTracks.map((track, index) => (
            <div key={`${track.id}-${index}`} className={styles.carouselItem}>
              <AlbumArt track={track} size="md" />
              <p className={styles.carouselTitle}>{track.title}</p>
              <p className={styles.carouselArtist}>{track.artist}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          className={styles.chooseBtn}
          data-path-type={path.type}
          onClick={onChoosePath}
        >
          Choose this path
        </button>
      </div>
    </div>,
    document.body,
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" width={20} height={20} fill="currentColor" aria-hidden>
      <path d="M3.8 3.8a.75.75 0 0 1 1.06 0L8 6.94l3.14-3.14a.75.75 0 1 1 1.06 1.06L9.06 8l3.14 3.14a.75.75 0 0 1-1.06 1.06L8 9.06l-3.14 3.14a.75.75 0 0 1-1.06-1.06L6.94 8 3.8 4.86a.75.75 0 0 1 0-1.06" />
    </svg>
  );
}
