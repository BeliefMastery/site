# UI and platform architecture

This document describes cross-cutting presentation and navigation mechanisms for BeliefMastery v2.0 planning.

It is split into two tracks:

- **Implemented in this repo now**: the current production shell behavior and platform model.
- **Planned parity modules**: optional v2.0 additions inspired by related product architecture.

Assessment-specific scoring remains in `*-engine.js` and `*-data*` modules. This file focuses on shell behavior: themes, motion, gestures, question controls, modals, suite chrome, and platform packaging.

---

## 1. Tech model

- **Vanilla** HTML, CSS, and ES modules (no framework, no bundler required for authoring).
- **State** is primarily browser-side (`localStorage` and in a few places `sessionStorage`).
- **No backend by default** in the web product.

### Current BeliefMastery status

- This repository currently targets static web deployment.
- There is no in-repo Capacitor Android wrapper, no `www/` copy step, and no billing plugin wiring at present.

### Planned parity (optional v2.0+)

- If Android packaging is enabled later, add explicit Capacitor and billing sections beside current web architecture instead of blending the two models.

---

## 2. Global styling and themes

### Base stylesheet

- **`style.css`**: Universal layout, components, shell and page systems.
- **`fonts/fonts.css`**: v2 local font entrypoint for self-hosted typography.

### Theme system (BeliefMastery current)

- **Mechanism:** pages load `<link id="bm-theme-base" rel="stylesheet" href="style.css">` and `shared/theme-prefs.js` injects/removes variant overlays using `#bm-theme-variant`.
- **Script:** `shared/theme-prefs.js` (non-module IIFE):
  - Reads/writes `localStorage` keys `bm_site_theme` and `bm_font_scale`.
  - Supports themes: `cosmic`, `light`, `forge`, `neomorphism`.
  - Writes `data-bm-theme` on `<html>`.
  - Provides footer controls (theme + text size) when a `<footer>` exists.
- **Font scaling:** updates CSS variable `--font-scale`.

### BeliefMastery mappings (legacy reference translation)

- `style-switcher.js` -> `shared/theme-prefs.js`
- `redpill-style-overlay` -> `bm_site_theme`
- `redpill-font-scale` -> `bm_font_scale`
- `style-overlay` link id -> `bm-theme-variant`

### Background

- **`shared/background.js`**: WebGL nebula on `#nebula-canvas`.
- Falls back to CSS gradient when reduced-motion, unsupported WebGL, or low-power/coarse-pointer conditions are detected.
- `theme-prefs.js` and `background.js` are plain script tags and run without import maps.

---

## 3. Swipe navigation

### Current BeliefMastery status

- Not part of the current production shell.

### Planned parity module (v2)

- `shared/swipe-nav.js` (ES module) can provide horizontal gesture navigation between configured pages.
- Should include reduced-motion fallback and input/scroll guards.

---

## 4. Sliders, scales, and value allocation

The engines support multiple question types. Numeric scales are heavily used across tools.

### Legacy 1–10 (and similar)

- Many items use a **single numeric** answer (often 1–10) stored as a number in the engine’s `answers` / `responses` map.

### Structured response payloads (v2 guidance)

- Keep canonical answer payloads synchronized with reporting/export in `shared/export-utils.js`.
- If multi-allocation sliders are introduced to BeliefMastery tools, define one schema and shared normalization helpers before rollout.

---

## 5. Engine UI state machine

- **`shared/engine-ui-controller.js`**: Small class that toggles visibility using **`hidden`** (and optional `active` class) on configured selectors for states like **`idle`**, **`assessment`**, **`results`**.
- Each `*-engine.js` constructs an `EngineUIController` with a map of which sections to show/hide (intro, action buttons, questionnaire, results).

---

## 6. Modals and alerts

- **`shared/confirm-modal.js`**: **Promise-based** `showConfirm` / `showAlert` with in-DOM styled boxes (avoids native `alert`/`confirm` branding on hosted domains). Used for gates, errors, and post-restore messaging.

---

## 7. Suite progression, nav locks, and home progress

### Current BeliefMastery status

- No centralized suite-gating module is currently part of the shell.

### Planned parity module set (v2)

- `shared/suite-completion.js`: derive progress state from tool completion signals.
- `shared/suite-nav-gates.js`: apply lock attributes/tooltips/styles to gated links.
- `shared/suite-index.js`: render progress summary list on home page.

---

## 8. Android monetization (optional v2.0+)

### Current BeliefMastery status

- No in-repo Android premium entitlement/paywall module is active.

### Planned parity module (if Android scope is approved)

- Add `shared/premium-entitlement.js` with platform checks, entitlement cache, paywall hooks, restore flow, and refresh events.
- See `docs/ANDROID_PLATFORM_SCOPE.md` for current scope gates and sequencing.

---

## 9. Build and asset pipeline

### Current BeliefMastery status

- Static web layout without an in-repo `copy-to-www`/`cap:sync` pipeline.

### Planned parity module (if platform expansion is approved)

- Add `scripts/copy-to-www.js`, `npm run copy:www`, and `npm run cap:sync` only after Android packaging decisions are finalized.

---

## 10. Performance and diagnostics

- **`shared/performance-monitor.js`**: Optional instrumentation (where included).
- **`shared/debug-reporter.js`**: Engine-attachable logging hooks.

---

## 11. v2 implementation checklist (BeliefMastery)

1. Keep `style.css` + `style/` overlays + `shared/theme-prefs.js` as the baseline theme stack.
2. Use `fonts/fonts.css` as the single font entrypoint for local hosting.
3. Keep `#nebula-canvas` + `shared/background.js` for ambient shell motion with reduced-motion fallback.
4. Reuse `shared/confirm-modal.js` and `shared/engine-ui-controller.js` across tool pages.
5. Add `shared/swipe-nav.js` with guarded auto-init for page-cycle gestures.
6. Add suite progression modules (`suite-completion`, `suite-nav-gates`, `suite-index`) with safe defaults.
7. Keep Android/IAP and Capacitor pipeline work as explicit optional scope until product decision.

For the broader docs map, see [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md).
