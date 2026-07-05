import type { Track } from '../../types/track';
import {
  ListeningPathsSection,
  PathSelectionBanner,
  useListeningPathsSession,
  useQueue,
} from '../../features/listening-paths';
import { NowPlayingView } from '../player/NowPlayingView';
import { QueueTrackList } from './QueueTrackList';
import styles from './QueuePanel.module.css';

interface QueuePanelProps {
  currentTrack: Track;
  variant: 'web' | 'mobile';
  showNowPlaying?: boolean;
}

export function QueuePanel({
  currentTrack,
  variant,
  showNowPlaying = true,
}: QueuePanelProps) {
  const { pathsDismissed } = useListeningPathsSession();
  const {
    queue,
    selectedPathTitle,
    selectedPathType,
    hasPathSelection,
    undoPathSelection,
  } = useQueue();
  const pathsLayout = variant === 'web' ? 'sidebar' : 'stack';

  const selectionBanner =
    hasPathSelection && selectedPathTitle && selectedPathType ? (
      <PathSelectionBanner
        pathTitle={selectedPathTitle}
        pathType={selectedPathType}
        onUndo={undoPathSelection}
      />
    ) : null;

  if (pathsDismissed) {
    return (
      <div className={styles.panel}>
        {showNowPlaying && variant === 'web' && (
          <section className={styles.block}>
            <p className={styles.sectionLabel}>Now playing</p>
            <NowPlayingView track={currentTrack} compact />
          </section>
        )}

        {selectionBanner}
        <QueueTrackList tracks={queue} title="Next in queue" />
      </div>
    );
  }

  const nextTrack = queue[0];
  const upcomingTracks = queue.slice(1);

  return (
    <div className={styles.panel}>
      {showNowPlaying && variant === 'web' && (
        <section className={styles.block}>
          <p className={styles.sectionLabel}>Now playing</p>
          <NowPlayingView track={currentTrack} compact />
        </section>
      )}

      {!hasPathSelection && <ListeningPathsSection layout={pathsLayout} />}

      {!hasPathSelection && nextTrack && (
        <section className={styles.block} aria-labelledby="next-in-queue-heading">
          <h2 id="next-in-queue-heading" className={styles.sectionTitle}>
            Next in queue
          </h2>
          <QueueTrackList tracks={[nextTrack]} title="" showDragHandle={false} />
        </section>
      )}

      {selectionBanner}

      {hasPathSelection ? (
        queue.length > 0 && (
          <section className={styles.block} aria-labelledby="path-queue-heading">
            <h2 id="path-queue-heading" className={styles.sectionTitle}>
              Up next
            </h2>
            <QueueTrackList tracks={queue} title="" />
          </section>
        )
      ) : (
        upcomingTracks.length > 0 && (
          <section className={styles.block} aria-labelledby="default-queue-heading">
            <h2 id="default-queue-heading" className={styles.sectionTitle}>
              Default Spotify Queue
            </h2>
            <QueueTrackList tracks={upcomingTracks} title="" />
          </section>
        )
      )}
    </div>
  );
}
