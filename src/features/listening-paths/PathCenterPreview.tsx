import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ListeningPath } from '../../types/listeningPath';
import { PathPreviewContent } from './PathPreviewContent';
import styles from './PathCenterPreview.module.css';

interface PathCenterPreviewProps {
  path: ListeningPath;
  isOpen: boolean;
  onClose: () => void;
  onChoosePath: (event: React.MouseEvent) => void;
  onSeeMore: (event: React.MouseEvent) => void;
  onHoverChange: (hovering: boolean) => void;
}

export function PathCenterPreview({
  path,
  isOpen,
  onClose,
  onChoosePath,
  onSeeMore,
  onHoverChange,
}: PathCenterPreviewProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} role="presentation">
      <div className={styles.backdrop} aria-hidden />
      <div
        ref={panelRef}
        className={styles.panel}
        data-path-type={path.type}
        role="dialog"
        aria-modal="false"
        aria-label={`${path.title} preview`}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
      >
        <PathPreviewContent
          path={path}
          onChoosePath={onChoosePath}
          onSeeMore={onSeeMore}
          showSeeMore
          variant="centered"
        />
      </div>
    </div>,
    document.body,
  );
}
