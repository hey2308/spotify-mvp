import type { PathType, Track } from './track';

export type PathTag = string;

export interface ListeningPath {
  id: string;
  type: PathType;
  title: string;
  description: string;
  tags: PathTag[];
  previewTrack: Track;
  /** Sample of upcoming recommendations — the path continues like the default queue. */
  upcomingTracks: Track[];
  aiExplanation: string;
}
