# App Split Plan: Relationships + Redpill → Standalone App with IAP

## 1. Scope: What Goes Into the App

**“Relationships and redpill”** in the current site maps to the **relational** tools in the Tools menu:

| Feature | HTML | Engine | Data / assets |
|--------|------|--------|----------------|
| **Relationships** | `relationship.html` | `relationship-engine.js` | `relationship-data/` (6 files; engine also references `relationship-material.js` — confirm if exists or optional) |
| **Polarity / Temperament** | `temperament.html` | `temperament-engine.js` | `temperament-data/` (6 files) |
| **Modern Archetype (redpill)** | `archetype.html` | `archetype-engine.js` | `archetype-data/` (4 JS files + 1 MD) |
| **Attraction, Status & Selection** | `attraction.html` | `attraction-engine.js` | `attraction-data.js` (single file) |

**“All four”** = these four assessments. Unlock model = **one app, one paywall** that gates the **report** (results screen) for each assessment; questions can stay free.

---

## 2. One App vs Multiple Apps

| Approach | Pros | Cons |
|----------|------|------|
| **One app, paywall per report** | Single codebase, one store listing, one install; user gets “Belief Mastery Relational” with 4 tools; can do “unlock all reports” or “unlock this report” IAP. | Slightly larger app; need clear in-app UX for which report is locked. |
| **Four separate apps** | Each app is minimal; possible to price differently per tool. | 4× store maintenance, 4× updates, 4× support; users who want more than one must install multiple apps; harder to bundle “unlock all.” |

**Recommendation: one app with in-app purchase to unlock reports.**  
- Keeps one repo, one build, one support surface.  
- IAP can be: “Unlock this report” (per assessment) and/or “Unlock all reports” (bundle).  
- Fits “relationships and redpill” as a single product: Relationships, Temperament, Archetype, Attraction.

---

## 3. Do You Need a Separate Folder Before a New Repo?

**Yes.** A dedicated folder (e.g. `app-relational/` or `app/`) in this repo is useful to:

1. **Define the boundary** of what will move (files that belong only to the app).
2. **Allow copy-or-move to a new repo** later without guessing.
3. **Keep the main site working** while you build the app (e.g. app folder has its own `index.html` and entry points; site keeps current structure).

**Suggested layout:**

```
BeliefMastery/
  app/                          # New: everything that will become the app repo
    index.html                  # App shell / hub (list of 4 tools)
    relationship.html
    temperament.html
    archetype.html
    attraction.html
    js/                         # Engines (copy or symlink initially)
      relationship-engine.js
      temperament-engine.js
      archetype-engine.js
      attraction-engine.js
    data/                       # All data the app needs
      relationship-data/
      temperament-data/
      archetype-data/
      attraction-data.js
    shared/                     # Minimal shared runtime (see below)
    css/                        # App-specific or extracted slice of style.css
    images/                     # Only images used by the 4 tools
  relationship.html             # Stays on site but can redirect or “Get the app”
  ...
  shared/                       # Stays on site; app gets its own copy in app/shared
  style.css
  ...
```

**Alternative:** skip the folder and create the new repo from scratch, then copy in only the files listed in **Section 5**. The folder approach is still recommended so you can test “app” build in-place before the repo split.

---

## 4. What Must Happen to the Remaining Site

After the app is split (either into `app/` or into a new repo):

1. **Navigation**
   - **Tools menu** (e.g. in `index.html`, `tools.html`, any shared nav): remove or replace links to the four tools with a single “Relationships & Status — Get the app” (or similar) that points to store link or landing page.
   - **tools.html** grid: remove or replace the four tool cards (Relationships, Temperament, Archetype, Attraction) with one card for the app + store/landing link.

2. **HTML files**
   - **Option A (soft):** Keep `relationship.html`, `temperament.html`, `archetype.html`, `attraction.html` on the site but replace content with a CTA: “This assessment has moved to the Belief Mastery Relational app” + store buttons.
   - **Option B (hard):** Remove those four HTML files and all direct links; 404 or redirect to `tools.html` or app landing.

3. **Assets**
   - **Engines and data:** Remove or stop serving from the site repo: `relationship-engine.js`, `temperament-engine.js`, `archetype-engine.js`, `attraction-engine.js`, `relationship-data/`, `temperament-data/`, `archetype-data/`, `attraction-data.js` (so the site doesn’t bundle or link to them).
   - **style.css:** Keep on site for other tools. For the app, use a **copy** or an extracted slice (only rules used by the four tools + shared layout) so site CSS doesn’t depend on app.

4. **Images**
   - **On site:** In `index.html` and `tools.html`, the four tools use: `relationship-optimization-cover.jpg`, `temperament-analysis-cover.jpg`, `redpill-cover.jpg`, `attraction-cover.jpg`. After split, either remove those cards or replace with one “App” card and one app image (e.g. `app-relational-cover.jpg`).
   - **In app:** Copy into app’s `images/` only what the app needs: those four hero/cover images, plus any images referenced inside the four HTML pages or engines (favicon, etc.). Reconsider size/format (e.g. WebP, responsive sizes) for app performance.

5. **Sitemap / SEO**
   - If you have a sitemap, remove URLs for the four tool pages (or replace with the single app/landing URL).
   - Update any internal links (books, about, framework-atlas, etc.) that point to the four tools.

6. **No backend dependency**
   - The four tools appear to be client-side only (no server endpoints). So “remaining site” does not need API or auth changes; only links, nav, and optional removal of app-related files.

---

## 5. Checklist: What to Move (or Copy) Into the App

Use this as the “record of what goes to the app” and, in reverse, what to remove or redirect on the site.

### 5.1 HTML (4)

- `relationship.html`
- `temperament.html`
- `archetype.html`
- `attraction.html`

### 5.2 Engines (4)

- `relationship-engine.js`
- `temperament-engine.js`
- `archetype-engine.js`
- `attraction-engine.js`

### 5.3 Data

- `relationship-data/`: `index.js`, `stage-questions.js`, `archetypal-insights.js`, `compatibility-points.js`, `action-strategies.js`, `relationship-modules.js` (and `relationship-material.js` if present)
- `temperament-data/`: `index.js`, `temperament-orientation.js`, `temperament-dimensions.js`, `intimate-dynamics.js`, `attraction-responsiveness.js`, `temperament-scoring.js`
- `archetype-data/`: `archetypes.js`, `archetype-questions.js`, `archetype-spread.js`, `BRUTAL-TRUTH.js`
- `attraction-data.js` (root)

### 5.4 Shared (copy into app; do not rely on site path)

- `shared/data-loader.js`
- `shared/debug-reporter.js`
- `shared/utils.js`
- `shared/export-utils.js`
- `shared/engine-ui-controller.js`
- `shared/performance-monitor.js`
- `shared/background.js` (if app uses same background)
- `shared/background.css`
- `shared/accessibility.js` (if used by these engines)

Engines use `./shared/...` and `./archetype-data/...` etc.; in the app repo, keep the same relative paths (e.g. `app/shared/`, `app/archetype-data/`) or update imports once.

### 5.5 Styles

- Copy the **relevant parts** of `style.css` into the app (or a single `app.css`). “Relevant” = layout, components, and media queries used by the four tools and shared layout. Option: start with full `style.css` and trim unused rules later.

### 5.6 Images (to reconsider)

- **Hero/cover (required for each tool):**
  - `images/relationship-optimization-cover.jpg`
  - `images/temperament-analysis-cover.jpg`
  - `images/redpill-cover.jpg`
  - `images/attraction-cover.jpg`
- **App icon / store:** Create or choose an icon and optional “app cover” for the store listing.
- **Reconsider:** Format (e.g. WebP), size (e.g. 2x for retina), and lazy-loading so the app stays fast. Remove any image not referenced by the four tools.

---

## 6. Paywall / IAP Integration (High Level)

- **Where to gate:** After the user completes an assessment, when navigating to the **results/report** view, check entitlement (e.g. “has unlocked this report” or “has unlocked all”).
- **If not unlocked:** Show a “Report locked” screen with short explanation and a button to purchase “Unlock this report” or “Unlock all reports.”
- **If unlocked:** Show the report as today.
- **Implementation:** Depends on platform (e.g. Capacitor/Cordova for Web→native, or PWA with payment provider). Keep the “show report” function in one place and call it only when `isUnlocked(assessmentId)` is true; the same engine and HTML can stay, with a thin paywall layer.

---

## 7. Optimal Outcome (Vision)

- **One “Belief Mastery Relational” (or similar) app** in the store(s), containing Relationships, Temperament, Archetype, and Attraction.
- **Free:** Run each assessment (questions, progress, state).
- **Paid (IAP):** Unlock the report for each assessment (and optionally “Unlock all” bundle).
- **Site:** Cleanly separated: no duplicate logic, no broken links; Tools page and nav point to the app or a single landing page; remaining tools (Diagnosis, Coaching, Needs-Dependency, Sovereignty, Paradigm, etc.) stay on the site.
- **Maintainability:** App lives in its own repo (or `app/` folder until then) with its own shared copy, so you can evolve app and site independently; images and CSS reconsidered for app size and clarity.

---

## 8. Suggested Order of Work

1. **Create `app/` (or equivalent) and copy** the four HTML files, four engines, and all data + shared files listed in Section 5. Fix paths so the app runs standalone (e.g. open `app/relationship.html` locally and complete a run).
2. **Add an app hub** `app/index.html` that lists the four tools and links to each assessment.
3. **Reconsider images:** Copy only needed images; optionally convert/optimize for app.
4. **Extract or copy CSS** so the app has its own styles and doesn’t depend on site `style.css`.
5. **Implement paywall:** After results are computed, show “Unlock report” or report based on entitlement (stub first, then plug in real IAP).
6. **Site cleanup:** Update nav and tools grid; remove or replace the four tool links; optionally remove the four HTML files and their engines/data from the site repo (or leave HTML as CTA-only).
7. **Sitemap and links:** Update sitemap and any remaining links to the four tools.
8. **New repo (optional):** When ready, create the new repo and move `app/` contents into it; add app build (e.g. Capacitor), store assets, and IAP.

This plan gives you a clear “what to put in a folder / new repo,” “what to do to the remaining site,” “what to do with images,” and “one app with paywall” as the target.
