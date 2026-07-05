import { useState } from 'react';
import type { Track } from '../../types/track';
import { NowPlayingView } from '../player/NowPlayingView';
import { QueuePanel } from '../queue/QueuePanel';
import { SidebarNav } from './SidebarNav';
import { BottomNav, type MobileTab } from './BottomNav';
import { MobileSearchScreen } from './MobileSearchScreen';
import styles from './MobileLayout.module.css';

interface MobileLayoutProps {
  currentTrack: Track;
}

export function MobileLayout({ currentTrack }: MobileLayoutProps) {
  const [activeTab, setActiveTab] = useState<MobileTab>('home');

  return (
    <div className={styles.shell}>
      <div className={styles.scroll}>
        {activeTab === 'home' && (
          <>
            <NowPlayingView track={currentTrack} />
            <div className={styles.queueSection}>
              <QueuePanel currentTrack={currentTrack} variant="mobile" showNowPlaying={false} />
            </div>
          </>
        )}

        {activeTab === 'search' && <MobileSearchScreen />}

        {activeTab === 'library' && (
          <div className={styles.library}>
            <SidebarNav embedded hideDebugToggle />
          </div>
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
