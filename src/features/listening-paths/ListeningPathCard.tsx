import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import type { PathType } from '../../types/track';
import type { ListeningPath } from '../../types/listeningPath';
import { AlbumArt } from '../../components/player/AlbumArt';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useQueue } from './QueueContext';
import { useDiscoveryDna } from './DiscoveryDnaContext';
import { PathCenterPreview } from './PathCenterPreview';
import { PathIcon } from './PathIcon';
import { PathPreviewContent } from './PathPreviewContent';
import { PathPreviewModal } from './PathPreviewModal';
import styles from './ListeningPathCard.module.css';

interface ListeningPathCardProps {
  path: ListeningPath;
  layout: 'stack' | 'sidebar';
  isSelected?: boolean;
  isDimmed?: boolean;
}

const PATH_LABELS: Record<PathType, string> = {
  'stay-in-vibe': 'Stay in the Vibe path',
  'discover-new': 'Discover Something New path',
  'fit-moment': 'Fit This Moment path',
};

const HOVER_OPEN_DELAY_MS = 450;
const HOVER_CLOSE_DELAY_MS = 150;
const REOPEN_COOLDOWN_MS = 300;
const SCROLL_IDLE_MS = 180;

function getScrollParent(element: HTMLElement | null): HTMLElement | null {
  let node = element?.parentElement ?? null;

  while (node) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return node;
    }
    node = node.parentElement;
  }

  return null;
}

export function ListeningPathCard({
  path,
  layout,
  isSelected = false,
  isDimmed = false,
}: ListeningPathCardProps) {
  const isMobile = layout === 'stack';
  const isWeb = layout === 'sidebar';
  const reducedMotion = usePrefersReducedMotion();
  const { choosePath } = useQueue();
  const { setHoveredPathType } = useDiscoveryDna();

  const cardRef = useRef<HTMLElement>(null);
  const hoverOpenTimerRef = useRef<number | null>(null);
  const hoverCloseTimerRef = useRef<number | null>(null);
  const scrollIdleTimerRef = useRef<number | null>(null);
  const previewPanelHoveredRef = useRef(false);
  const suppressHoverUntilRef = useRef(0);
  const isScrollingRef = useRef(false);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isCenterPreviewOpen, setIsCenterPreviewOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showInlinePreview = isMobile && isExpanded;

  const clearHoverOpenTimer = useCallback(() => {
    if (hoverOpenTimerRef.current !== null) {
      window.clearTimeout(hoverOpenTimerRef.current);
      hoverOpenTimerRef.current = null;
    }
  }, []);

  const clearHoverCloseTimer = useCallback(() => {
    if (hoverCloseTimerRef.current !== null) {
      window.clearTimeout(hoverCloseTimerRef.current);
      hoverCloseTimerRef.current = null;
    }
  }, []);

  const closeCenterPreview = useCallback(() => {
    clearHoverOpenTimer();
    clearHoverCloseTimer();
    previewPanelHoveredRef.current = false;
    setHoveredPathType(null);
    setIsCenterPreviewOpen((open) => {
      if (open) {
        suppressHoverUntilRef.current = Date.now() + REOPEN_COOLDOWN_MS;
      }
      return false;
    });
  }, [clearHoverCloseTimer, clearHoverOpenTimer, setHoveredPathType]);

  const scheduleCloseCenterPreview = useCallback(() => {
    clearHoverCloseTimer();
    hoverCloseTimerRef.current = window.setTimeout(() => {
      if (!previewPanelHoveredRef.current) {
        closeCenterPreview();
      }
    }, HOVER_CLOSE_DELAY_MS);
  }, [clearHoverCloseTimer, closeCenterPreview]);

  const handlePreviewPanelHover = useCallback(
    (hovering: boolean) => {
      previewPanelHoveredRef.current = hovering;
      if (hovering) {
        clearHoverCloseTimer();
        return;
      }
      scheduleCloseCenterPreview();
    },
    [clearHoverCloseTimer, scheduleCloseCenterPreview],
  );

  const handleChoosePath = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      choosePath(path);
      setIsModalOpen(false);
      closeCenterPreview();
      setIsExpanded(false);
    },
    [choosePath, closeCenterPreview, path],
  );

  const handleSeeMore = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      closeCenterPreview();
      setIsModalOpen(true);
    },
    [closeCenterPreview],
  );

  const handleCardClick = useCallback(() => {
    if (isMobile) {
      setIsExpanded((expanded) => {
        const next = !expanded;
        setHoveredPathType(next ? path.type : null);
        return next;
      });
    }
  }, [isMobile, path.type, setHoveredPathType]);

  const handleWebMouseEnter = useCallback(() => {
    if (!isWeb || isModalOpen) return;
    if (isScrollingRef.current || Date.now() < suppressHoverUntilRef.current) return;

    setHoveredPathType(path.type);
    clearHoverCloseTimer();
    clearHoverOpenTimer();

    hoverOpenTimerRef.current = window.setTimeout(() => {
      if (isScrollingRef.current || Date.now() < suppressHoverUntilRef.current) return;
      setIsCenterPreviewOpen(true);
    }, HOVER_OPEN_DELAY_MS);
  }, [clearHoverCloseTimer, clearHoverOpenTimer, isModalOpen, isWeb, path.type, setHoveredPathType]);

  const handleWebMouseLeave = useCallback(() => {
    if (!isWeb) return;
    clearHoverOpenTimer();
    setHoveredPathType(null);
    scheduleCloseCenterPreview();
  }, [clearHoverOpenTimer, isWeb, scheduleCloseCenterPreview, setHoveredPathType]);

  const handleWebCardClick = useCallback(() => {
    if (isWeb) {
      closeCenterPreview();
      setIsModalOpen(true);
    }
  }, [closeCenterPreview, isWeb]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setIsExpanded(false);
        setIsModalOpen(false);
        closeCenterPreview();
        return;
      }

      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (isMobile) {
        setIsExpanded((expanded) => !expanded);
        return;
      }

      closeCenterPreview();
      setIsModalOpen(true);
    },
    [closeCenterPreview, isMobile],
  );

  useEffect(() => {
    if (!isWeb) return;

    const scrollParent = getScrollParent(cardRef.current);
    if (!scrollParent) return;

    const handleScroll = () => {
      isScrollingRef.current = true;
      closeCenterPreview();

      if (scrollIdleTimerRef.current !== null) {
        window.clearTimeout(scrollIdleTimerRef.current);
      }

      scrollIdleTimerRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
      }, SCROLL_IDLE_MS);
    };

    scrollParent.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollParent.removeEventListener('scroll', handleScroll);
      if (scrollIdleTimerRef.current !== null) {
        window.clearTimeout(scrollIdleTimerRef.current);
      }
    };
  }, [closeCenterPreview, isWeb]);

  useEffect(
    () => () => {
      clearHoverOpenTimer();
      clearHoverCloseTimer();
    },
    [clearHoverCloseTimer, clearHoverOpenTimer],
  );

  return (
    <>
      <article
        ref={cardRef}
        className={[
          styles.card,
          isMobile ? styles.stack : styles.sidebar,
          showInlinePreview && styles.expanded,
          isSelected && styles.selected,
          isDimmed && styles.dimmed,
          reducedMotion && styles.reducedMotion,
        ]
          .filter(Boolean)
          .join(' ')}
        data-path-type={path.type}
        aria-label={PATH_LABELS[path.type]}
        aria-expanded={isMobile ? isExpanded : isCenterPreviewOpen || isModalOpen}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleWebMouseEnter}
        onMouseLeave={handleWebMouseLeave}
        onClick={isMobile ? handleCardClick : handleWebCardClick}
      >
        <div className={styles.collapsed}>
          <div className={styles.content}>
            <div className={styles.header}>
              <PathIcon type={path.type} />
              <div className={styles.headerText}>
                <h3 className={styles.title}>{path.title}</h3>
                <p className={styles.description}>{path.description}</p>
              </div>
            </div>

            <ul className={styles.tags} aria-label="Path tags">
              {path.tags.map((tag) => (
                <li key={tag} className={styles.tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          {!showInlinePreview && (
            <div className={styles.nextUp}>
              <span className={styles.nextUpLabel}>Next up</span>
              <div className={styles.nextUpTrack}>
                <AlbumArt track={path.previewTrack} size="sm" />
                <div className={styles.nextUpMeta}>
                  <p className={styles.nextUpTitle}>{path.previewTrack.title}</p>
                  <p className={styles.nextUpArtist}>{path.previewTrack.artist}</p>
                </div>
                {isMobile && (
                  <span className={styles.playBtn} aria-hidden>
                    <PlayIcon />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {showInlinePreview && (
          <div
            className={[styles.previewPanel, styles.previewPanelOpen].join(' ')}
            aria-hidden={false}
          >
            <PathPreviewContent
              path={path}
              onChoosePath={handleChoosePath}
            />
          </div>
        )}
      </article>

      {isWeb && (
        <>
          <PathCenterPreview
            path={path}
            isOpen={isCenterPreviewOpen && !isModalOpen}
            onClose={closeCenterPreview}
            onChoosePath={handleChoosePath}
            onSeeMore={handleSeeMore}
            onHoverChange={handlePreviewPanelHover}
          />
          <PathPreviewModal
            path={path}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onChoosePath={handleChoosePath}
          />
        </>
      )}
    </>
  );
}
function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" width={14} height={14} fill="currentColor" aria-hidden>
      <path d="M3 1.715a.75.75 0 0 1 1.05-.073l8.25 6.5a.75.75 0 0 1 0 1.186l-8.25 6.5A.75.75 0 0 1 3 15.25V1.715z" />
    </svg>
  );
}

