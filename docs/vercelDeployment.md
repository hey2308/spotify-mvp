# Frontend Deployment Plan — Vercel

This MVP is a **static frontend only** (Vite + React). No backend, database, or API keys are required for deployment. Vercel hosts the production build from the `dist/` folder.

**Related docs:** [MVP development plan](./mvpDevelopmentPlan.md) · [README](../README.md)

---

## What gets deployed

| Included | Not included (out of MVP scope) |
|----------|----------------------------------|
| Queue UI, AI Listening Paths, mock Discovery DNA | Spotify Web API / OAuth |
| Client-side path selection & undo | Real ML recommendations |
| AI Debug Panel (presenter tool) | User accounts or cloud sync |
| Static assets (album art URLs, mocks) | Server-side rendering |

All “AI” behavior runs in the browser using mocked data under `src/mocks/` and `src/discoveryDna/`.

---

## Prerequisites

1. **Git repository** — code pushed to GitHub, GitLab, or Bitbucket (Vercel connects via Git).
2. **Vercel account** — [vercel.com](https://vercel.com) (free Hobby tier is sufficient for demos).
3. **Local build passes** — from the project root:

   ```bash
   npm install
   npm run build
   npm run preview
   ```

   Open the preview URL and walk through the [demo script in the README](../README.md#demo-script-5-minutes).

---

## Vercel project settings

When importing the repo, use these values (Vercel usually auto-detects Vite):

| Setting | Value |
|---------|--------|
| Framework Preset | **Vite** |
| Root Directory | `.` (repository root) |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Node.js Version | **20.x** (Project Settings → General) |

**Environment variables:** none required for this MVP.

---

## Deployment paths

### Option A — Git integration (recommended)

Best for ongoing demos: every push to `main` can auto-deploy.

1. Push the project to a remote Git repository.
2. In Vercel: **Add New → Project** → import the repository.
3. Confirm the build settings in the table above → **Deploy**.
4. Wait for the build log to finish (`tsc -b && vite build` should succeed).
5. Copy the production URL (e.g. `https://ai-listening-paths.vercel.app`).

**Preview deployments:** Each pull request gets a unique preview URL — useful for stakeholder review before merging.

### Option B — Vercel CLI (one-off or manual)

```bash
npm install -g vercel
vercel login
vercel
```

Follow prompts (link to existing project or create new). For production:

```bash
vercel --prod
```

---

## Optional: `vercel.json`

Not required today — the app has no client-side routes (no React Router). Add this file at the repo root only if you later introduce URL-based routing and need SPA fallback:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Post-deploy verification checklist

Run through this on the **live URL** (desktop width ≥ 1024px and mobile &lt; 1024px):

- [ ] App loads; no blank screen or console errors
- [ ] Now playing shows *LUNCH*; footer player controls work (next/previous)
- [ ] Queue sidebar opens; AI Listening Paths section loads after skeleton (~650ms)
- [ ] Path preview (hover desktop / tap mobile) and **Choose this path** update the queue
- [ ] Selection banner + **Undo** restore the default queue
- [ ] **AI** toggle in Your Library header opens Discovery DNA panel (desktop)
- [ ] External images load (Spotify CDN, YouTube thumbnails for artist avatars)
- [ ] Resize browser: desktop vs mobile layouts match wireframes

---

## Custom domain (optional)

1. Vercel project → **Settings → Domains**
2. Add your domain and follow DNS instructions (CNAME to `cname.vercel-dns.com` or Vercel nameservers).
3. HTTPS is provisioned automatically.

---

## Troubleshooting

| Issue | Likely cause | Fix |
|-------|----------------|-----|
| Build fails on `tsc -b` | TypeScript errors | Run `npm run build` locally; fix errors before pushing |
| Blank page after deploy | Wrong output directory | Set **Output Directory** to `dist`, not `build` |
| Images missing | External CDN blocked/offline | Check browser network tab; mocks use public URLs |
| Old version showing | CDN cache | Hard refresh; or redeploy from Vercel dashboard |
| 404 on refresh (future routes) | SPA routing | Add `vercel.json` rewrites (see above) |

---

## Rollback

- **Dashboard:** Deployments → select a previous successful deployment → **Promote to Production**
- **Git:** Revert the commit on `main`; Vercel redeploys automatically if Git integration is enabled

---

## Security notes for demos

- Do not add `.env` files with secrets to the repo — this MVP has none.
- The AI Debug Panel is intentional for presentations; it is not part of a production Spotify UX.
- `vercel.json` and build settings do not expose server-side logic because there is no backend.

---

## Summary

| Step | Action |
|------|--------|
| 1 | `npm run build` passes locally |
| 2 | Push to Git |
| 3 | Import repo in Vercel with **Vite** preset, output `dist` |
| 4 | Verify with post-deploy checklist |
| 5 | Share production URL for demos |

No backend deployment is needed for this MVP phase.
