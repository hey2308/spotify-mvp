# AI Listening Paths — MVP Prototype

Spotify-inspired prototype for **AI Listening Paths**: queue-integrated path cards, mock Discovery DNA, path selection with undo, and explainability modals. All AI outputs are mocked — no real Spotify API or ML.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

| Viewport | Breakpoint | Wireframe reference |
|----------|------------|---------------------|
| **Website / desktop** | ≥ 1024px | [`docs/wireframes/web_wireframes.png`](docs/wireframes/web_wireframes.png) |
| **Mobile** | < 1024px | [`docs/wireframes/mobile_wireframe.png`](docs/wireframes/mobile_wireframe.png) |

Resize the browser (or use DevTools device mode) to switch layouts. Each viewport uses its own wireframe — layouts are not hybridized.

### Production build

```bash
npm run build
npm run preview
```

Deploy to Vercel: see [`docs/vercelDeployment.md`](docs/vercelDeployment.md). GitHub repo: [hey2308/spotify-mvp](https://github.com/hey2308/spotify-mvp).

---

## Demo script (~5 minutes)

Use this flow for stakeholder demos:

1. **Start playing** — *LUNCH* by Billie Eilish is mocked as now playing.
2. **Open the queue**
   - **Desktop:** queue sidebar is open by default (right panel).
   - **Mobile:** tap **Queue** below the player.
3. **Wait for paths** — skeleton cards appear briefly (~650ms), then three AI Listening Paths load.
4. **Preview a path**
   - **Desktop:** hover a card for inline preview, or click for the 4-song modal.
   - **Mobile:** tap a card to expand; use **Choose this path**.
5. **Choose a path** — queue updates; banner shows **You chose: …** with **Undo**.
6. **Why this Path?** — open from the expanded preview, modal, or selection banner.
7. **Undo** — restores the original default queue.
8. **No thanks** — dismisses the paths section; queue unchanged.
9. **AI Debug Panel** (prototype only) — click the **AI** badge (bottom-left) or press `Ctrl+Shift+D`.
   - Change time, weather, location, or readiness → paths regenerate after a short load.
   - Toggle **Simulate DNA failure** → paths section hides; default queue remains.

---

## Signal overrides (Debug Panel)

| Control | Effect |
|---------|--------|
| Time of day | Morning / afternoon / evening / late night |
| Day type | Weekday vs weekend |
| Weather | Clear, rainy, cloudy |
| Location | Home, commute, gym |
| Discovery readiness | Slider 0–100 |
| Simulate DNA failure | Hides paths; shows default queue only |

Press **Reset overrides** to return to auto-detected signals.

---

## Project structure

```
src/
  components/          # Layout, player, queue UI
  discoveryDna/        # Mock context engine & path generator
  features/
    listening-paths/   # Paths, selection, modals, debug panel
  hooks/               # Breakpoint & reduced-motion hooks
  mocks/               # Tracks, queue, album art
  styles/              # Design tokens & global CSS
  types/               # TypeScript interfaces
docs/
  mvpDevelopmentPlan.md
  problemStatement.md
  wireframes/
```

---

## Manual test checklist

- [ ] Open queue → three paths visible below **Next in queue** (layout matches viewport wireframe)
- [ ] **Website:** hover path → preview; queue unchanged
- [ ] **Mobile:** tap to expand → **Choose this path** visible; touch targets feel comfortable (≥ 44px)
- [ ] Choose path → queue updates; banner with **Undo**
- [ ] Undo → original queue restored
- [ ] **No thanks** → paths hidden; default queue unchanged
- [ ] **Why this Path?** → context breakdown (modal on desktop, bottom sheet on mobile)
- [ ] AI Debug Panel → override signals; paths regenerate after skeleton
- [ ] Simulate DNA failure → paths hidden; playback UI unchanged
- [ ] Keyboard: Tab through controls; Enter on focused card opens preview; Escape closes modals/expand
- [ ] Ignore paths entirely → listening continues normally

---

## Docs

- [MVP Development Plan](./docs/mvpDevelopmentPlan.md)
- [Problem Statement / PRD](./docs/problemStatement.md)
- [Wireframes](./docs/wireframes/)

---

## Stack

Vite · React · TypeScript · CSS Modules · no backend

Currently playing and queue data are static mocks aligned with wireframe seed tracks (*LUNCH*, *BIRDS OF A FEATHER*, *Good Luck, Babe!*, *Sunset Lover*, etc.).
