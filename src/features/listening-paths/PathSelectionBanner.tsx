import type { PathType } from '../../types/track';
import styles from './PathSelectionBanner.module.css';

interface PathSelectionBannerProps {
  pathTitle: string;
  pathType: PathType;
  onUndo: () => void;
}

export function PathSelectionBanner({
  pathTitle,
  pathType,
  onUndo,
}: PathSelectionBannerProps) {
  return (
    <div className={styles.banner} role="status" aria-live="polite" data-path-type={pathType}>
      <div className={styles.content}>
        <p className={styles.choice}>
          You chose: <strong>{pathTitle}</strong>
        </p>
        <p className={styles.status}>Listening Path Updated ✓</p>
      </div>
      <button type="button" className={styles.undoBtn} onClick={onUndo}>
        Undo
      </button>
    </div>
  );
}
