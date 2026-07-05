import { useState } from 'react';
import type { Track } from '../../types/track';
import { AlbumArt } from '../player/AlbumArt';
import { SongInfo } from '../player/SongInfo';
import { PlayerBar } from './PlayerBar';
import { QueueSidebar } from './QueueSidebar';
import { SidebarNav } from './SidebarNav';
import { TopHeader } from './TopHeader';
import styles from './WebLayout.module.css';

interface WebLayoutProps {
  currentTrack: Track;
}

export function WebLayout({ currentTrack }: WebLayoutProps) {
  const [queueOpen, setQueueOpen] = useState(true);

  const toggleQueue = () => setQueueOpen((open) => !open);

  return (
    <div className={styles.shell}>
      <TopHeader queueOpen={queueOpen} />
      <div className={[styles.body, queueOpen && styles.bodyWithQueue].filter(Boolean).join(' ')}>
        <aside className={styles.sidebar}>
          <SidebarNav />
        </aside>

        <main className={styles.main} aria-label="Now playing">
          <div className={styles.playerView}>
            <AlbumArt track={currentTrack} size="lg" className={styles.heroArt} />
            <div className={styles.trackMeta}>
              <h1 className={styles.title}>{currentTrack.title}</h1>
              <p className={styles.artist}>{currentTrack.artist}</p>
              <p className={styles.album}>{currentTrack.album}</p>
            </div>
            <SongInfo track={currentTrack} />
          </div>
        </main>

        {queueOpen && (
          <QueueSidebar currentTrack={currentTrack} onClose={() => setQueueOpen(false)} />
        )}
      </div>

      <PlayerBar track={currentTrack} queueOpen={queueOpen} onQueueToggle={toggleQueue} />
    </div>
  );
}
