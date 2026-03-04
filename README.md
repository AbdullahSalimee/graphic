# Graphy AI — Merged Project

This is the merged Next.js project combining the **landing page** (`/`) and the **graph maker app** (`/app`).

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              ← Root layout (no global CSS here)
│   ├── page.tsx                ← Landing page at /
│   └── app/
│       ├── layout.tsx          ← Graph app layout (loads graph CSS only)
│       └── page.tsx            ← Graph maker at /app
├── components/
│   ├── landing/                ← All landing page components (isolated)
│   │   ├── LandingPage.jsx
│   │   ├── Hero.jsx
│   │   ├── Nav.jsx
│   │   └── ... (all other landing components)
│   └── graph/                  ← All graph app components (isolated)
│       ├── GraphApp.jsx
│       ├── ChatArea.jsx
│       ├── InputBar.jsx
│       └── ... (all other graph components)
└── styles/
    ├── landing.css             ← Landing page CSS (Tailwind v4, Chakra Petch font)
    └── graph.css               ← Graph app CSS (DM Sans, scoped to .graph-app-root)
```

## How CSS Isolation Works

The key fix to prevent styles from bleeding between pages:

- **`landing.css`** is imported only by `src/app/page.tsx` (the `/` route)
- **`graph.css`** is imported only by `src/app/app/layout.tsx` (the `/app` route)
- The graph app CSS uses `.graph-app-root` as a scope prefix for all rules that could conflict
- The `font-family: 'Chakra Petch' !important` from the landing page is overridden inside `.graph-app-root` with `!important` on the graph fonts

## Setup

```bash
npm install
npm run dev
```

> **Note:** Copy your `icon.png` and any other public assets into the `/public` folder.

## Routes

| Route | What it shows |
|-------|--------------|
| `/`   | Landing page (marketing site) |
| `/app`| Graph maker app |

The "Launch App →" button on the landing page navigates to `/app`.
The back navigation in the graph app can link back to `/`.

## Deployment

Deploy to Vercel as a standard Next.js project. No additional configuration needed.
