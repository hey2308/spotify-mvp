import styles from './PathCardSkeleton.module.css';

interface PathCardSkeletonProps {
  layout: 'stack' | 'sidebar';
}

export function PathCardSkeleton({ layout }: PathCardSkeletonProps) {
  const isStack = layout === 'stack';

  return (
    <div
      className={[styles.card, isStack ? styles.stack : styles.sidebar].filter(Boolean).join(' ')}
      aria-hidden
    >
      <div className={styles.header}>
        <div className={styles.icon} />
        <div className={styles.textBlock}>
          <div className={[styles.line, styles.titleLine].join(' ')} />
          <div className={[styles.line, styles.descLine].join(' ')} />
        </div>
      </div>
      <div className={styles.tags}>
        <div className={styles.tag} />
        <div className={styles.tag} />
        <div className={styles.tag} />
      </div>
      {!isStack && (
        <div className={styles.nextUp}>
          <div className={[styles.line, styles.nextUpLine].join(' ')} />
        </div>
      )}
    </div>
  );
}

interface PathCardSkeletonListProps {
  layout: 'stack' | 'sidebar';
  count?: number;
}

export function PathCardSkeletonList({ layout, count = 3 }: PathCardSkeletonListProps) {
  return (
    <div
      className={styles.list}
      aria-busy="true"
      aria-label="Loading listening paths"
      role="status"
    >
      {Array.from({ length: count }, (_, index) => (
        <PathCardSkeleton key={index} layout={layout} />
      ))}
    </div>
  );
}
