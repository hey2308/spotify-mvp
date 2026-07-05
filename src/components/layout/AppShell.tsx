import { CURRENT_TRACK, MOCK_QUEUE } from '../../mocks';
import {
  AiDebugPanel,
  AiDebugToggle,
  DiscoveryDnaProvider,
  ListeningPathsProvider,
  QueueProvider,
  useQueue,
} from '../../features/listening-paths';
import { useIsDesktop } from '../../hooks/useMediaQuery';
import { MobileLayout } from './MobileLayout';
import { WebLayout } from './WebLayout';

function AppShellContent() {
  const isDesktop = useIsDesktop();
  const { currentTrack } = useQueue();

  return (
    <DiscoveryDnaProvider currentTrack={currentTrack} catalog={MOCK_QUEUE}>
      <ListeningPathsProvider>
        {isDesktop ? (
          <WebLayout currentTrack={currentTrack} />
        ) : (
          <MobileLayout currentTrack={currentTrack} />
        )}
        <AiDebugToggle variant="footer" />
        <AiDebugPanel />
      </ListeningPathsProvider>
    </DiscoveryDnaProvider>
  );
}

export function AppShell() {
  return (
    <QueueProvider initialQueue={MOCK_QUEUE} initialCurrentTrack={CURRENT_TRACK}>
      <AppShellContent />
    </QueueProvider>
  );
}
