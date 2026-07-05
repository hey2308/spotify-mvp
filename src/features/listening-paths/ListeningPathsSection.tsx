import { ShuffleIcon } from '../../components/icons/ShuffleIcon';
import { useDiscoveryDna } from './DiscoveryDnaContext';
import { useListeningPathsSession } from './ListeningPathsContext';
import { ListeningPathCardList } from './ListeningPathCardList';
import { PathCardSkeletonList } from './PathCardSkeleton';
import styles from './ListeningPathsSection.module.css';

interface ListeningPathsSectionProps {
  layout: 'stack' | 'sidebar';
}

export function ListeningPathsSection({ layout }: ListeningPathsSectionProps) {
  const { pathsDismissed, dismissPaths } = useListeningPathsSession();
  const { pathsStatus } = useDiscoveryDna();

  if (pathsDismissed || pathsStatus === 'error') {
    return null;
  }

  const isSidebar = layout === 'sidebar';
  const isLoading = pathsStatus === 'loading';

  return (
    <div className={styles.featureWrap}>
      <span className={styles.newTag}>NEW</span>
      <div className={styles.highlightWrap}>
        <section className={styles.section} aria-labelledby="listening-paths-heading">
          <div className={styles.header}>
            <div className={styles.titleRow}>
              <h2 id="listening-paths-heading" className={styles.title}>
                AI Listening Paths
              </h2>
              <span className={styles.beta}>(BETA)</span>
            </div>
            {isSidebar && (
              <button
                type="button"
                className={styles.closeBtn}
                onClick={dismissPaths}
                aria-label="Dismiss AI Listening Paths"
              >
                <CloseIcon />
              </button>
            )}
          </div>

          <p className={styles.subtitle}>
            An alternative to the default queue — pick how upcoming songs should feel.
          </p>

          {isLoading ? (
            <PathCardSkeletonList layout={layout} />
          ) : (
            <ListeningPathCardList layout={layout} />
          )}

          <button
            type="button"
            className={styles.dismiss}
            onClick={dismissPaths}
            disabled={isLoading}
            aria-label="No thanks, let Spotify decide. We'll keep playing the best queue for you."
          >
            <span className={styles.dismissCopy}>
              <span className={styles.dismissTitle}>No thanks, let Spotify decide</span>
              <span className={styles.dismissCaption}>We&apos;ll keep playing the best queue for you.</span>
            </span>
            <ShuffleIcon />
          </button>
        </section>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} fill="currentColor" aria-hidden>
      <path d="M3.8 3.8a.75.75 0 0 1 1.06 0L8 6.94l3.14-3.14a.75.75 0 1 1 1.06 1.06L9.06 8l3.14 3.14a.75.75 0 0 1-1.06 1.06L8 9.06l-3.14 3.14a.75.75 0 0 1-1.06-1.06L6.94 8 3.8 4.86a.75.75 0 0 1 0-1.06" />
    </svg>
  );
}
