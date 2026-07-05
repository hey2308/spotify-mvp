# Wireframes

Two viewport-specific design files. **Do not mix them** — each is the strict UI reference for its breakpoint.

| File | Viewport | When to use |
|------|----------|-------------|
| [web_wireframes.png](./web_wireframes.png) | **Website / desktop** | Layout ≥ `1024px` (or project breakpoint): 3-column shell, right queue sidebar, hover preview, desktop modals |
| [mobile_wireframe.png](./mobile_wireframe.png) | **Mobile** | Layout &lt; `1024px`: Now Playing screen, full-width queue sheet, stacked path cards, tap preview, bottom nav |

Shared across both: same three paths, same mock tracks, same selection banner + Undo, same "No thanks, let Spotify decide."

## Web-only UI ([web_wireframes.png](./web_wireframes.png))

- Left nav + center content + **right queue sidebar**
- Path cards inside queue panel (compact / vertical cards in sidebar)
- **Hover** to expand path preview
- Expanded path preview **modal** (4-song carousel)
- **"Why this Path?"** explanation modal

## Mobile-only UI ([mobile_wireframe.png](./mobile_wireframe.png))

- **Now Playing** full-screen player
- Queue as scrollable content below Now Playing
- Path cards **stacked vertically** (full width)
- **Tap** to expand preview (no hover)
- Bottom tab bar (Home, Search, Your Library)

## Cross-reference

- [MVP Development Plan](../mvpDevelopmentPlan.md)
- [Problem Statement / PRD](../problemStatement.md)
