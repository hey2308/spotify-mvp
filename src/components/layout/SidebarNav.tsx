import { useCallback, useEffect, useRef, useState } from 'react';
import { MOCK_ARTISTS } from '../../mocks/artists';
import { ALBUM_ART } from '../../mocks/albumArt';
import { AiDebugToggle } from '../../features/listening-paths';
import styles from './SidebarNav.module.css';

const FILTER_CHIPS = ['Playlists', 'Artists', 'Albums', 'Podcasts'] as const;
type LibraryFilter = (typeof FILTER_CHIPS)[number];
const PLAYLISTS = [
  { id: 'liked-songs', name: 'Liked Songs', subtitle: 'Playlist', variant: 'liked' as const },
  {
    id: 'discover-weekly',
    name: 'Discover Weekly',
    subtitle: 'Playlist',
    thumbnailUrl: ALBUM_ART.goodLuckBabeSingle,
  },
  {
    id: 'chill-vibes',
    name: 'Chill Vibes',
    subtitle: 'Playlist',
    thumbnailUrl: ALBUM_ART.sunsetLoverEp,
  },
  {
    id: 'workout-mix',
    name: 'Workout Mix',
    subtitle: 'Playlist',
    thumbnailUrl: ALBUM_ART.loseControlSingle,
  },
  {
    id: 'evening-acoustic',
    name: 'Evening Acoustic',
    subtitle: 'Playlist',
    thumbnailUrl: ALBUM_ART.beautifulThingsSingle,
  },
] as const;

interface SidebarNavProps {
  embedded?: boolean;
  hideDebugToggle?: boolean;
}

export function SidebarNav({ embedded = false, hideDebugToggle = false }: SidebarNavProps) {
  const filtersRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<LibraryFilter>('Playlists');
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const isArtistView = activeFilter === 'Artists';

  const updateScrollState = useCallback(() => {
    const el = filtersRef.current;
    if (!el) return;
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    setCanScrollPrev(el.scrollLeft > 0);
  }, []);

  useEffect(() => {
    const el = filtersRef.current;
    if (!el || isArtistView) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState, isArtistView]);

  const scrollFiltersNext = () => {
    const container = filtersRef.current;
    if (!container) return;

    const scrollRight = container.scrollLeft + container.clientWidth;
    const chips = container.querySelectorAll<HTMLButtonElement>('button');

    for (const chip of chips) {
      if (chip.offsetLeft + chip.offsetWidth > scrollRight + 1) {
        container.scrollTo({ left: chip.offsetLeft, behavior: 'smooth' });
        return;
      }
    }

    container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
  };

  const scrollFiltersPrev = () => {
    const container = filtersRef.current;
    if (!container) return;

    const chips = container.querySelectorAll<HTMLButtonElement>('button');

    for (let index = chips.length - 1; index >= 0; index -= 1) {
      const chip = chips[index];
      if (chip.offsetLeft < container.scrollLeft - 1) {
        container.scrollTo({ left: chip.offsetLeft, behavior: 'smooth' });
        return;
      }
    }

    container.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const filterMaskClass = [
    canScrollPrev && styles.filtersCanScrollPrev,
    canScrollNext && styles.filtersCanScrollNext,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav
      className={[styles.nav, embedded && styles.navEmbedded].filter(Boolean).join(' ')}
      aria-label="Your Library"
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Your Library</h2>
        <div className={styles.headerActions}>
          <button type="button" className={styles.iconBtn} aria-label="Create playlist or folder">
            <Icon path={ICON.create} />
          </button>
          <button type="button" className={styles.iconBtn} aria-label="Expand library">
            <Icon path={ICON.expand} />
          </button>
          {!hideDebugToggle && <AiDebugToggle variant="sidebar" />}
        </div>
      </div>

      {isArtistView ? (
        <div className={styles.filterActiveBar}>
          <button
            type="button"
            className={styles.closeFilterBtn}
            aria-label="Close filter"
            onClick={() => setActiveFilter('Playlists')}
          >
            <Icon path={ICON.close} />
          </button>
          <span className={styles.filterActivePill}>Artists</span>
        </div>
      ) : (
        <div className={styles.filtersRow}>
          {canScrollPrev && (
            <button
              type="button"
              className={styles.filterNav}
              aria-label="Show earlier filters"
              onClick={scrollFiltersPrev}
            >
              <Icon path={ICON.chevronLeft} />
            </button>
          )}
          <div
            ref={filtersRef}
            className={[styles.filters, filterMaskClass].filter(Boolean).join(' ')}
            role="tablist"
            aria-label="Library filters"
          >
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                role="tab"
                aria-selected={chip === activeFilter}
                className={[styles.chip, chip === activeFilter && styles.chipActive].filter(Boolean).join(' ')}
                onClick={() => setActiveFilter(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
          {canScrollNext && (
            <button
              type="button"
              className={styles.filterNav}
              aria-label="Show more filters"
              onClick={scrollFiltersNext}
            >
              <Icon path={ICON.chevronRight} />
            </button>
          )}
        </div>
      )}

      {!isArtistView && (
        <div className={styles.toolbar}>
          <button type="button" className={styles.searchBtn} aria-label="Search in Your Library">
            <Icon path={ICON.search} />
          </button>
          <div className={styles.sortGroup}>
            <span className={styles.sortLabel}>Recents</span>
            <button type="button" className={styles.listViewBtn} aria-label="Change list view">
              <Icon path={ICON.listView} />
            </button>
          </div>
        </div>
      )}

      {isArtistView ? (
        <ul className={styles.artistList}>
          {MOCK_ARTISTS.map((artist) => (
            <li key={artist.id}>
              <a href="#" className={styles.artistItem}>
                <img
                  className={styles.artistAvatar}
                  src={artist.imageUrl}
                  alt=""
                  loading="lazy"
                  draggable={false}
                />
                <span className={styles.artistName}>{artist.name}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <ul className={styles.playlistList}>
          {PLAYLISTS.map((playlist) => (
            <li key={playlist.id}>
              <a href="#" className={styles.playlistItem}>
                <PlaylistArt playlist={playlist} />
                <span className={styles.playlistMeta}>
                  <span className={styles.playlistName}>{playlist.name}</span>
                  <span className={styles.playlistSubtitle}>{playlist.subtitle}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

function PlaylistArt({ playlist }: { playlist: (typeof PLAYLISTS)[number] }) {
  if ('variant' in playlist && playlist.variant === 'liked') {
    return (
      <span className={[styles.playlistArt, styles.likedArt].join(' ')} aria-hidden>
        <Icon path={ICON.heart} size={14} />
      </span>
    );
  }

  if (!('thumbnailUrl' in playlist)) {
    return <span className={styles.playlistArt} aria-hidden />;
  }

  return (
    <img
      className={styles.playlistArt}
      src={playlist.thumbnailUrl}
      alt=""
      loading="lazy"
      draggable={false}
    />
  );
}

function Icon({ path, size = 16 }: { path: string; size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor" aria-hidden>
      <path d={path} />
    </svg>
  );
}

const ICON = {
  create:
    'M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75',
  expand:
    'M1 2.75A.75.75 0 0 1 1.75 2H7v1.5H2.5v11h11V10H15v5.25a.75.75 0 0 1-.75.75H1.75a.75.75 0 0 1-.75-.75zM15 1v4.993a.75.75 0 1 1-1.5 0V3.56L8.78 8.28a.75.75 0 0 1-1.06-1.06l4.72-4.72h-2.433a.75.75 0 0 1 0-1.5z',
  chevronLeft:
    'M9.978 3.626a.75.75 0 0 0-1.06 0L4.624 7.919a.75.75 0 0 0 0 1.06l4.294 4.294a.75.75 0 0 0 1.06-1.061L6.186 8l3.792-3.313a.75.75 0 0 0 0-1.061',
  chevronRight: 'M6.022 3.626a.75.75 0 0 1 1.06 0l4.294 4.293a.75.75 0 0 1 0 1.06l-4.294 4.294a.75.75 0 1 1-1.06-1.061L9.814 8 6.022 4.687a.75.75 0 0 1 0-1.061',
  close:
    'M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 0 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06',
  search:
    'M11.618 11.532A5.589 5.589 0 0013.22 7.61a5.61 5.61 0 10-5.61 5.61 5.58 5.58 0 003.246-1.04l2.912 3.409.76-.649-2.91-3.408zm-4.008.688C5.068 12.22 3 10.152 3 7.61S5.068 3 7.61 3s4.61 2.068 4.61 4.61-2.068 4.61-4.61 4.61z',
  listView: 'M1 3h1V2H1v1zm3-1v1h11V2H4zM1 9h1V8H1v1zm3 0h11V8H4v1zm0 6h11v-1H4v1zm-3 0h1v-1H1v1z',
  heart:
    'M13.764 2.727a4.057 4.057 0 00-5.488-.253.558.558 0 01-.31.112.531.531 0 01-.311-.112 4.054 4.054 0 00-5.487.253A4.05 4.05 0 00.974 5.61c0 1.089.424 2.113 1.168 2.855l4.462 5.223a1.791 1.791 0 002.726 0l4.435-5.195A4.052 4.052 0 0014.96 5.61a4.057 4.057 0 00-1.196-2.883z',
};
