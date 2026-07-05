import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { ListeningPath } from '../../types/listeningPath';
import type { PathType, Track } from '../../types/track';

interface QueueState {
  currentTrack: Track;
  queue: Track[];
  /** Tracks played before the current track (for skip previous). */
  history: Track[];
  /** Snapshot of the full queue before the first path selection (single-level undo). */
  preSelectionSnapshot: Track[] | null;
  selectedPathId: string | null;
  selectedPathTitle: string | null;
  selectedPathType: PathType | null;
}

type QueueAction =
  | { type: 'CHOOSE_PATH'; path: ListeningPath }
  | { type: 'UNDO' }
  | { type: 'PLAY_NEXT' }
  | { type: 'PLAY_PREVIOUS' };

interface QueueContextValue extends QueueState {
  hasPathSelection: boolean;
  canPlayNext: boolean;
  canPlayPrevious: boolean;
  choosePath: (path: ListeningPath) => void;
  undoPathSelection: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

const QueueContext = createContext<QueueContextValue | null>(null);

/**
 * Rebuilds upcoming recommendations from a chosen path.
 * Path tracks replace the default queue — no pinned "next in queue" carryover.
 */
function applyPathToQueue(_currentQueue: Track[], path: ListeningPath): Track[] {
  return [...path.upcomingTracks];
}

function queueReducer(state: QueueState, action: QueueAction): QueueState {
  switch (action.type) {
    case 'CHOOSE_PATH': {
      const snapshot = state.preSelectionSnapshot ?? [...state.queue];
      return {
        ...state,
        queue: applyPathToQueue(state.queue, action.path),
        preSelectionSnapshot: snapshot,
        selectedPathId: action.path.id,
        selectedPathTitle: action.path.title,
        selectedPathType: action.path.type,
      };
    }
    case 'UNDO': {
      if (!state.preSelectionSnapshot) {
        return state;
      }
      return {
        ...state,
        queue: [...state.preSelectionSnapshot],
        preSelectionSnapshot: null,
        selectedPathId: null,
        selectedPathTitle: null,
        selectedPathType: null,
      };
    }
    case 'PLAY_NEXT': {
      const [nextTrack, ...remainingQueue] = state.queue;
      if (!nextTrack) {
        return state;
      }
      return {
        ...state,
        currentTrack: nextTrack,
        history: [...state.history, state.currentTrack],
        queue: remainingQueue,
      };
    }
    case 'PLAY_PREVIOUS': {
      const previousTrack = state.history[state.history.length - 1];
      if (!previousTrack) {
        return state;
      }
      return {
        ...state,
        currentTrack: previousTrack,
        history: state.history.slice(0, -1),
        queue: [state.currentTrack, ...state.queue],
      };
    }
    default:
      return state;
  }
}

export function QueueProvider({
  initialQueue,
  initialCurrentTrack,
  children,
}: {
  initialQueue: Track[];
  initialCurrentTrack: Track;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(queueReducer, {
    currentTrack: initialCurrentTrack,
    queue: initialQueue,
    history: [],
    preSelectionSnapshot: null,
    selectedPathId: null,
    selectedPathTitle: null,
    selectedPathType: null,
  });

  const choosePath = useCallback((path: ListeningPath) => {
    dispatch({ type: 'CHOOSE_PATH', path });
  }, []);

  const undoPathSelection = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const playNext = useCallback(() => {
    dispatch({ type: 'PLAY_NEXT' });
  }, []);

  const playPrevious = useCallback(() => {
    dispatch({ type: 'PLAY_PREVIOUS' });
  }, []);

  const value = useMemo<QueueContextValue>(
    () => ({
      ...state,
      hasPathSelection: state.selectedPathId !== null,
      canPlayNext: state.queue.length > 0,
      canPlayPrevious: state.history.length > 0,
      choosePath,
      undoPathSelection,
      playNext,
      playPrevious,
    }),
    [state, choosePath, undoPathSelection, playNext, playPrevious],
  );

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
}

export function useQueue(): QueueContextValue {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within QueueProvider');
  }
  return context;
}
