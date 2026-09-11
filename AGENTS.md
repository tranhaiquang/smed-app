# SMED Hub

Vanilla JS single-page demo app for tracking SMED (Single-Minute Exchange of Die) changeovers. No build step, no bundler, no Node.js required. All data is dummy data stored in code — no backend.

## Run

Open `index.html` in a browser, or use any static file server (e.g. VS Code Live Server). No `npm install` needed.

## Architecture

- `index.html` → redirects to `dashboard.html`
- `dashboard.html` → dashboard with time/area filters, double-bar chart (count & duration by area), pie chart (Planned vs Unplanned)
- `changeover.html` → changeover request list with search/filter
- `new-request.html` → form to create a changeover request
- `checklist.html` → changeover checklist per area with role-based task completion
- `script.js` — single JS file, all logic (i18n, CRUD, validation, rendering)
- `styles.css` — dark/light theme, responsive

## Key conventions

- **No npm/node.** Pure vanilla JS. Do not add package.json or node_modules.
- **ES modules.** HTML files use `<script type="module" src="script.js">`. All imports are ESM.
- **No backend.** All data is generated in code (`generateSampleData()` + `testChecklistRecords`). CRUD operates on in-memory arrays. Drafts saved to localStorage (`smed_draft_requests`).
- **i18n.** Three languages (EN, VI, KO) defined in `translations` object in `script.js`. Persisted to localStorage (`smed_language`).
- **Theme.** Dark/light toggle persisted to localStorage (`smed_theme`).
- **Icons.** Lucide loaded via CDN `<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js">`. Re-init with `window.lucide?.createIcons()` after DOM changes.
- **Auto status.** Request status is computed from `time` + `duration` at runtime: `Submitted` → `In Progress` → `Cancelled`. Only `Completed` is set manually.
- **Process areas:** HF, Silk Screen, Autocut, SEMI Cut, GBOS Cut, Atom Cut.
- **Classification:** Only `Planned` and `Unplanned` (no Delayed).
- **Checklist.** Each area has a task checklist (External/Internal/Run steps). Role-based: only the assigned role can check off tasks. State saved to localStorage (`smed_checklist_state`). Records shown as clickable cards with progress bars.
- **Warning popup.** When changeovers are in progress, a red warning bar appears at top of dashboard/changeover pages. Clicking redirects to checklist.
