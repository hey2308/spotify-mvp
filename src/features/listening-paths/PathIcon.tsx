import type { PathType } from '../../types/track';
import styles from './PathIcon.module.css';

interface PathIconProps {
  type: PathType;
  size?: 'sm' | 'md' | 'lg';
}

export function PathIcon({ type, size = 'md' }: PathIconProps) {
  const sizeClass = size === 'lg' ? styles.lg : size === 'sm' ? styles.sm : styles.md;

  return (
    <span className={[styles.icon, sizeClass].join(' ')} data-path-type={type} aria-hidden>
      {type === 'stay-in-vibe' && <VibeIcon />}
      {type === 'discover-new' && <DiscoverIcon />}
      {type === 'fit-moment' && <MomentIcon />}
    </span>
  );
}

function VibeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
      <path d="M12 3c-1.5 2.5-4 4.2-4 7.5a4 4 0 0 0 8 0c0-3.3-2.5-5-4-7.5zm0 14.5c-3.5 0-6.5 2-8 5h16c-1.5-3-4.5-5-8-5z" />
    </svg>
  );
}

function DiscoverIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
      <path d="M12 2l1.8 5.5L19 9.3l-5.2 1.8L12 16l-1.8-5-5.2-1.8L10.2 7.5 12 2zm-7 13 1.2 3.6L9.7 19l-3.6-1.2L5 14.2l3.6 1.2zm14 0 1.2-3.6 3.6 1.2-3.6 1.2-1.2 3.6-1.2-3.6z" />
    </svg>
  );
}

function MomentIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
      <path d="M12 2a1 1 0 0 1 1 1v1.07a7.001 7.001 0 0 1 5.93 5.93H20a1 1 0 1 1 0 2h-1.07A7.001 7.001 0 0 1 13 17.93V19a1 1 0 1 1-2 0v-1.07A7.001 7.001 0 0 1 5.07 12H4a1 1 0 1 1 0-2h1.07A7.001 7.001 0 0 1 11 4.07V3a1 1 0 0 1 1-1zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
    </svg>
  );
}
