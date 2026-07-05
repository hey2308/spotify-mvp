import styles from './MobileSearchScreen.module.css';

export function MobileSearchScreen() {
  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1 className={styles.title}>Search</h1>
      </header>

      <label className={styles.search}>
        <span className={styles.searchIcon} aria-hidden>
          <SearchIcon />
        </span>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="What do you want to listen to?"
          aria-label="Search"
        />
      </label>

      <section className={styles.section} aria-labelledby="browse-heading">
        <h2 id="browse-heading" className={styles.sectionTitle}>
          Browse all
        </h2>
        <div className={styles.grid}>
          {BROWSE_TILES.map((tile) => (
            <div key={tile.id} className={styles.tile} style={{ background: tile.color }}>
              <span>{tile.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const BROWSE_TILES = [
  { id: 'new', label: 'New Releases', color: '#27856a' },
  { id: 'charts', label: 'Charts', color: '#8d67ab' },
  { id: 'mood', label: 'Mood', color: '#ba5d07' },
  { id: 'pop', label: 'Pop', color: '#477d95' },
] as const;

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" aria-hidden>
      <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.921-2.062l4.207 4.207.625-.625-4.207-4.207A9.2 9.2 0 0 0 19.94 10.56c0-5.14-4.226-9.28-9.407-9.28m0 1.395c4.403 0 7.983 3.539 7.983 7.884s-3.58 7.884-7.983 7.884a7.86 7.86 0 0 1-5.567-2.297A7.86 7.86 0 0 1 2.55 10.56c0-4.345 3.58-7.884 7.983-7.884" />
    </svg>
  );
}
