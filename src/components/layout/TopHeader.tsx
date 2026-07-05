import styles from './TopHeader.module.css';

const ICON = {
  spotify:
    'M8 0a8 8 0 100 16A8 8 0 008 0zm3.669 11.539a.498.498 0 01-.686.166c-1.878-1.148-4.243-1.408-7.028-.772a.499.499 0 01-.222-.972c3.048-.696 5.662-.396 7.77.892a.5.5 0 01.166.686zm.979-2.178a.624.624 0 01-.858.205c-2.15-1.322-5.428-1.705-7.972-.932a.624.624 0 11-.362-1.194c2.905-.882 6.517-.455 8.987 1.063a.624.624 0 01.205.858zm.084-2.269C10.153 5.561 5.9 5.42 3.438 6.167a.748.748 0 11-.434-1.432c2.826-.857 7.523-.692 10.492 1.07a.748.748 0 01-.764 1.287z',
  home: 'M8.015 1.696 1.555 5.425V14.5h4.255V9.826h4.38V14.5h4.255V5.425z',
  search:
    'M11.618 11.532A5.589 5.589 0 0013.22 7.61a5.61 5.61 0 10-5.61 5.61 5.58 5.58 0 003.246-1.04l2.912 3.409.76-.649-2.91-3.408zm-4.008.688C5.068 12.22 3 10.152 3 7.61S5.068 3 7.61 3s4.61 2.068 4.61 4.61-2.068 4.61-4.61 4.61z',
  library:
    'M8.375 1.098a.75.75 0 01.75 0l5.5 3.175a.75.75 0 01.375.65V15.25a.75.75 0 01-.75.75h-5.5a.75.75 0 01-.75-.75V1.747a.75.75 0 01.375-.65zM9.5 3.046V14.5h4V5.356l-4-2.31zM1 1.75a.75.75 0 011.5 0v13.5a.75.75 0 01-1.5 0V1.75zm3.5 0a.75.75 0 011.5 0v13.5a.75.75 0 01-1.5 0V1.75z',
  download:
    'M7.999 9.657V4h-1v5.65L5.076 7.414l-.758.651 3.183 3.701 3.193-3.7-.758-.653-1.937 2.244zM7.5 0a7.5 7.5 0 100 15 7.5 7.5 0 000-15zm0 14C3.916 14 1 11.084 1 7.5S3.916 1 7.5 1 14 3.916 14 7.5 11.084 14 7.5 14z',
  whatsNew:
    'M8 1.5a4 4 0 00-4 4v3.27a.75.75 0 01-.1.373L2.255 12h11.49L12.1 9.142a.75.75 0 01-.1-.374V5.5a4 4 0 00-4-4m-5.5 4a5.5 5.5 0 0111 0v3.067l2.193 3.809a.75.75 0 01-.65 1.124H10.5a2.5 2.5 0 01-5 0H.957a.75.75 0 01-.65-1.124L2.5 8.569zm4.5 8a1 1 0 110 2 0z',
  friendActivity:
    'M3.849 10.034c-.021-.465.026-.93.139-1.381H1.669c.143-.303.375-.556.665-.724l.922-.532a1.63 1.63 0 00.436-2.458 1.8 1.8 0 01-.474-1.081q-.014-.287.057-.563a1.12 1.12 0 01.627-.7 1.2 1.2 0 01.944 0q.225.1.392.281c.108.12.188.263.237.417q.074.276.057.561a1.8 1.8 0 01-.475 1.084 1.6 1.6 0 00-.124 1.9c.36-.388.792-.702 1.272-.927v-.015c.48-.546.768-1.233.821-1.958a3.2 3.2 0 00-.135-1.132 2.657 2.657 0 00-5.04 0c-.111.367-.157.75-.135 1.133.053.724.341 1.41.821 1.955A.13.13 0 012.565 6a.13.13 0 01-.063.091l-.922.532A3.2 3.2 0 00-.004 9.396v.75h3.866c.001-.033-.01-.071-.013-.112m10.568-3.401c.48-.546.768-1.233.822-1.957a3.2 3.2 0 00-.135-1.132 2.657 2.657 0 00-5.04 0 3.2 3.2 0 00-.135 1.132c.053.724.341 1.411.821 1.957a.13.13 0 01-.107.218l-.922.532a3.197 3.197 0 00-1.585 3.169h7.977v-.75a3.2 3.2 0 00-1.584-2.773l-.922-.532a.13.13 0 01-.063-.091.13.13 0 01.031-.112.12.12 0 01.013-.018l.003-.002a1.6 1.6 0 00-.124-1.9c.379.227.72.472 1.01.791a3.66 3.66 0 01.934 2.087h3.855v-.75a3.2 3.2 0 00-1.584-2.773l-.922-.532a.13.13 0 01-.032-.2',
  user: 'M8 8a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5M2.25 13.25a5.75 5.75 0 0011.5 0 .75.75 0 00-.75-.75H3a.75.75 0 00-.75.75',
} as const;

interface HeaderIconProps {
  path: string;
  size?: number;
}

function HeaderIcon({ path, size = 16 }: HeaderIconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor" aria-hidden>
      <path d={path} />
    </svg>
  );
}

export function TopHeader({ queueOpen }: { queueOpen: boolean }) {
  const actions = (
    <div className={styles.actions}>
      <button type="button" className={styles.installBtn}>
        <HeaderIcon path={ICON.download} />
        <span>Install App</span>
      </button>
      <button type="button" className={styles.iconBtn} aria-label="Notifications">
        <HeaderIcon path={ICON.whatsNew} />
      </button>
      <button type="button" className={styles.iconBtn} aria-label="Friend activity">
        <HeaderIcon path={ICON.friendActivity} />
      </button>
      <button type="button" className={styles.profileBtn} aria-label="Profile menu">
        <HeaderIcon path={ICON.user} />
      </button>
    </div>
  );

  return (
    <header
      className={[styles.header, queueOpen && styles.headerWithQueue].filter(Boolean).join(' ')}
      aria-label="Top navigation"
    >
      <a href="#" className={styles.logo} aria-label="Spotify home">
        <HeaderIcon path={ICON.spotify} size={32} />
      </a>

      <div className={styles.mainCol}>
        <button type="button" className={styles.homeBtn} aria-label="Home">
          <HeaderIcon path={ICON.home} />
        </button>

        <label className={styles.search}>
            <span className={styles.searchIcon} aria-hidden>
              <HeaderIcon path={ICON.search} />
            </span>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="What do you want to play?"
              aria-label="Search"
            />
            <span className={styles.searchDivider} aria-hidden />
            <button type="button" className={styles.browseBtn} aria-label="Browse">
              <HeaderIcon path={ICON.library} />
            </button>
          </label>

        {!queueOpen && actions}
      </div>

      {queueOpen && <div className={styles.queueCol}>{actions}</div>}
    </header>
  );
}
