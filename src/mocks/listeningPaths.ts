import { CURRENT_TRACK, MOCK_QUEUE } from './queue';
import { runDiscoveryDna } from '../discoveryDna';

/** Static snapshot for tests — generated from default Discovery DNA signals. */
export const MOCK_LISTENING_PATHS = runDiscoveryDna(
  CURRENT_TRACK,
  MOCK_QUEUE,
).listeningPaths;
