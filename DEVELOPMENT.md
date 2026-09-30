# Codex Masterclass

An English, single-page scrolling session companion. This first version emphasizes the proposed learning arc, section goals, outcomes, and timing rather than a finished lecture.

## Preview

Run `python3 -m http.server 8000` in this directory and open http://localhost:8000. There is no build step or package installation.

## Files

- `index.html`: all session content and resource links; fully readable without JavaScript
- `styles.css`: responsive layout, CSS illustration, reduced-motion and print styles
- `app.js`: active-section navigation indicator only
- `.nojekyll`: direct static publishing on GitHub Pages

The page uses six sections totaling 60 minutes. All anchors work natively and support browser Back/Forward. No slide-navigation keys or presenter controls are used. Fonts are requested from Google Fonts, with local sans-serif fallbacks.

## Before teaching

Confirm the timing, exact pet exercise, dots/Space walkthrough, DIY app example, and free non-wagering card game. Verify demo-account feature availability and prepare a recording fallback. Official guide links are included, but this draft deliberately does not fix current model pricing or account-specific availability.

## Hosting

Publish the selected branch's root with GitHub Pages. All asset references are relative and work at `/codex-masterclass/`. No runtime secrets, server, analytics, third-party scripts, or build services are needed. Repository and Pages changes require separate publication coordination.
