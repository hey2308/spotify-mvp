import type { ListeningPath } from '../types/listeningPath';
import type { Track } from '../types/track';
import { hydrateCatalogArt, MOCK_CATALOG } from './catalog';
import { generateListeningPaths } from './generateListeningPaths';
import { inferSessionContext } from './inferContext';
import { buildDiscoverySignals } from './mockSignals';
import type {
  DiscoverySignals,
  SessionContext,
  SignalOverrides,
  WhyThisPathExplanation,
} from './types';
import type { PathType } from '../types/track';
import { buildWhyExplanation } from './generateListeningPaths';

export interface DiscoveryDnaResult {
  signals: DiscoverySignals;
  sessionContext: SessionContext;
  listeningPaths: ListeningPath[];
}

export function runDiscoveryDna(
  currentTrack: Track,
  catalogTracks: Track[],
  overrides: SignalOverrides = {},
): DiscoveryDnaResult {
  const catalog = hydrateCatalogArt(MOCK_CATALOG, catalogTracks);
  const signals = buildDiscoverySignals(currentTrack.id, overrides);
  const sessionContext = inferSessionContext(signals);
  const listeningPaths = generateListeningPaths(sessionContext, signals, currentTrack, catalog);

  return { signals, sessionContext, listeningPaths };
}

export function getWhyThisPath(
  pathType: PathType,
  result: DiscoveryDnaResult,
): WhyThisPathExplanation {
  return buildWhyExplanation(pathType, result.sessionContext, result.signals);
}

export { buildDiscoverySignals, inferSessionContext, generateListeningPaths };
