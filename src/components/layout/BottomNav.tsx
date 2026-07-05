import styles from './BottomNav.module.css';

export type MobileTab = 'home' | 'search' | 'library';

const items: { id: MobileTab; label: string; icon: typeof HomeIcon }[] = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'search', label: 'Search', icon: SearchIcon },
  { id: 'library', label: 'Your Library', icon: LibraryIcon },
];

interface BottomNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className={styles.nav} aria-label="Mobile navigation">
      {items.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            className={[styles.link, active && styles.active].filter(Boolean).join(' ')}
            aria-current={active ? 'page' : undefined}
            onClick={() => onTabChange(id)}
          >
            <Icon />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor" aria-hidden>
      <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-5.5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1V20H20V7.577z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor" aria-hidden>
      <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.921-2.062l4.207 4.207.625-.625-4.207-4.207A9.2 9.2 0 0 0 19.94 10.56c0-5.14-4.226-9.28-9.407-9.28m0 1.395c4.403 0 7.983 3.539 7.983 7.884s-3.58 7.884-7.983 7.884a7.86 7.86 0 0 1-5.567-2.297A7.86 7.86 0 0 1 2.55 10.56c0-4.345 3.58-7.884 7.983-7.884" />
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor" aria-hidden>
      <path d="M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6.5v-8.5a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1V22H3a1 1 0 0 1-1-1V6.464a1 1 0 0 1 .5-.866z" />
    </svg>
  );
}
