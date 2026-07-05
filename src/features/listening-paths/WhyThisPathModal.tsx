import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ListeningPath } from '../../types/listeningPath';
import { useIsDesktop } from '../../hooks/useMediaQuery';
import { useDiscoveryDna } from './DiscoveryDnaContext';
import { PathIcon } from './PathIcon';
import styles from './WhyThisPathModal.module.css';

interface WhyThisPathModalProps {
  path: Pick<ListeningPath, 'type' | 'title'>;
  isOpen: boolean;
  onClose: () => void;
}

const EXPLANATION_FIELDS = [
  { key: 'currentMood' as const, label: 'Current Mood / Session Context' },
  { key: 'listeningHistoryInsight' as const, label: 'Listening History' },
  { key: 'activity' as const, label: 'Activity' },
  { key: 'discoveryReadiness' as const, label: 'Discovery Readiness' },
];

export function WhyThisPathModal({ path, isOpen, onClose }: WhyThisPathModalProps) {
  const isDesktop = useIsDesktop();
  const dialogRef = useRef<HTMLDivElement>(null);
  const { getPathExplanation } = useDiscoveryDna();
  const explanation = getPathExplanation(path.type);

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
    <div
      className={[styles.overlay, !isDesktop && styles.overlaySheet].filter(Boolean).join(' ')}
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={[styles.dialog, !isDesktop && styles.sheet].filter(Boolean).join(' ')}
        data-path-type={path.type}
        role="dialog"
        aria-modal="true"
        aria-labelledby="why-this-path-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        {!isDesktop && <div className={styles.sheetHandle} aria-hidden />}

        <header className={styles.header}>
          <div className={styles.headerMain}>
            <PathIcon type={path.type} size="lg" />
            <div>
              <p className={styles.eyebrow}>Why this Path?</p>
              <h2 id="why-this-path-title" className={styles.title}>
                {path.title}
              </h2>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </header>

        <dl className={styles.explanationList}>
          {EXPLANATION_FIELDS.map(({ key, label }) => (
            <div key={key} className={styles.explanationItem}>
              <dt className={styles.explanationLabel}>{label}</dt>
              <dd className={styles.explanationValue}>{explanation[key]}</dd>
            </div>
          ))}
        </dl>

        <p className={styles.footer}>
          Spotify uses your listening signals and session context to suggest this path. You can always
          undo or let Spotify decide instead.
        </p>
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
