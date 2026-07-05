import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { runDiscoveryDna, getWhyThisPath, type DiscoveryDnaResult } from '../../discoveryDna';
import type { SignalOverrides } from '../../discoveryDna/types';
import type { ListeningPath } from '../../types/listeningPath';
import type { Track } from '../../types/track';
import type { PathType } from '../../types/track';
import type { WhyThisPathExplanation } from '../../discoveryDna/types';

/** Simulated network delay for path generation (Phase 7 loading skeleton). */
const PATHS_FETCH_DELAY_MS = 650;

export type PathsStatus = 'loading' | 'ready' | 'error';

interface DiscoveryDnaContextValue {
  pathsStatus: PathsStatus;
  signals: DiscoveryDnaResult['signals'];
  sessionContext: DiscoveryDnaResult['sessionContext'];
  listeningPaths: ListeningPath[];
  signalOverrides: SignalOverrides;
  setSignalOverrides: (overrides: SignalOverrides) => void;
  updateSignalOverride: <K extends keyof SignalOverrides>(
    key: K,
    value: SignalOverrides[K],
  ) => void;
  resetSignalOverrides: () => void;
  getPathExplanation: (pathType: PathType) => WhyThisPathExplanation;
  debugPanelOpen: boolean;
  setDebugPanelOpen: (open: boolean) => void;
  toggleDebugPanel: () => void;
  simulateDnaFailure: boolean;
  setSimulateDnaFailure: (simulate: boolean) => void;
}

const DiscoveryDnaContext = createContext<DiscoveryDnaContextValue | null>(null);

interface DiscoveryDnaProviderProps {
  currentTrack: Track;
  catalog: Track[];
  children: ReactNode;
}

export function DiscoveryDnaProvider({
  currentTrack,
  catalog,
  children,
}: DiscoveryDnaProviderProps) {
  const [signalOverrides, setSignalOverrides] = useState<SignalOverrides>({});
  const [debugPanelOpen, setDebugPanelOpen] = useState(false);
  const [simulateDnaFailure, setSimulateDnaFailure] = useState(false);
  const [pathsStatus, setPathsStatus] = useState<PathsStatus>('loading');
  const [activeDna, setActiveDna] = useState<DiscoveryDnaResult | null>(null);

  const computedDna = useMemo(
    () => runDiscoveryDna(currentTrack, catalog, signalOverrides),
    [currentTrack, catalog, signalOverrides],
  );

  useEffect(() => {
    setPathsStatus('loading');

    const timer = window.setTimeout(() => {
      if (simulateDnaFailure) {
        setActiveDna(null);
        setPathsStatus('error');
        return;
      }

      try {
        setActiveDna(computedDna);
        setPathsStatus('ready');
      } catch {
        setActiveDna(null);
        setPathsStatus('error');
      }
    }, PATHS_FETCH_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [computedDna, simulateDnaFailure]);

  const updateSignalOverride = useCallback(
    <K extends keyof SignalOverrides>(key: K, value: SignalOverrides[K]) => {
      setSignalOverrides((prev) => {
        const next = { ...prev };
        if (value === undefined) {
          delete next[key];
        } else {
          next[key] = value;
        }
        return next;
      });
    },
    [],
  );

  const resetSignalOverrides = useCallback(() => {
    setSignalOverrides({});
  }, []);

  const toggleDebugPanel = useCallback(() => {
    setDebugPanelOpen((open) => !open);
  }, []);

  const getPathExplanation = useCallback(
    (pathType: PathType) => {
      const source = activeDna ?? computedDna;
      return getWhyThisPath(pathType, source);
    },
    [activeDna, computedDna],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        toggleDebugPanel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDebugPanel]);

  const resolvedDna = activeDna ?? computedDna;

  const value = useMemo(
    (): DiscoveryDnaContextValue => ({
      pathsStatus,
      signals: resolvedDna.signals,
      sessionContext: resolvedDna.sessionContext,
      listeningPaths: pathsStatus === 'ready' ? resolvedDna.listeningPaths : [],
      signalOverrides,
      setSignalOverrides,
      updateSignalOverride,
      resetSignalOverrides,
      getPathExplanation,
      debugPanelOpen,
      setDebugPanelOpen,
      toggleDebugPanel,
      simulateDnaFailure,
      setSimulateDnaFailure,
    }),
    [
      pathsStatus,
      resolvedDna,
      signalOverrides,
      updateSignalOverride,
      resetSignalOverrides,
      getPathExplanation,
      debugPanelOpen,
      toggleDebugPanel,
      simulateDnaFailure,
    ],
  );

  return (
    <DiscoveryDnaContext.Provider value={value}>{children}</DiscoveryDnaContext.Provider>
  );
}

export function useDiscoveryDna(): DiscoveryDnaContextValue {
  const context = useContext(DiscoveryDnaContext);
  if (!context) {
    throw new Error('useDiscoveryDna must be used within DiscoveryDnaProvider');
  }
  return context;
}
