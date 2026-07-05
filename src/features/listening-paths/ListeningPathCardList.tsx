import { useDiscoveryDna } from './DiscoveryDnaContext';
import { useQueue } from './QueueContext';
import { ListeningPathCard } from './ListeningPathCard';
import styles from './ListeningPathCardList.module.css';

interface ListeningPathCardListProps {
  layout: 'stack' | 'sidebar';
}

export function ListeningPathCardList({ layout }: ListeningPathCardListProps) {
  const { listeningPaths } = useDiscoveryDna();
  const { selectedPathId, hasPathSelection } = useQueue();

  return (
    <div
      className={[styles.list, layout === 'sidebar' && styles.sidebar].filter(Boolean).join(' ')}
      role="list"
      aria-label="Listening path options"
    >
      {listeningPaths.map((path) => (
        <div key={path.id} role="listitem">
          <ListeningPathCard
            path={path}
            layout={layout}
            isSelected={selectedPathId === path.id}
            isDimmed={hasPathSelection && selectedPathId !== path.id}
          />
        </div>
      ))}
    </div>
  );
}
