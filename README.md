# Mohalla Studio — Cinematic v5

An independent Three.js **Indian mohalla video studio** (not the `insta-shorts` project). Reusable 3D environment with procedural 2.5D Toon Stickman and original Raju sprite, timeline preview and browser WebM export.

## Live site and GitHub Pages setup

**Expected project URL after Pages is enabled:** https://boidbit.github.io/mohalla-studio/

This repository has a workflow at `.github/workflows/pages.yml`. Every push to `main` updating `index.html`, `src/`, or `assets/` automatically tests and publishes the static site. **One-time GitHub setting:** visit [Settings → Pages](https://github.com/boidbit/mohalla-studio/settings/pages), under **Build and deployment** select **Source: GitHub Actions**. GitHub may require this manual authorization; the workflow's token cannot always create the Pages site. Then rerun the workflow from the [Actions tab](https://github.com/boidbit/mohalla-studio/actions/workflows/pages.yml) if the initial run failed. The site isn't considered live until the deploy job succeeds.

## v5 changes

- Continuous ray-versus-building collision checks for cinematic camera clearance.
- Tracking camera angle follows walking direction, cinematic framing transitions retained.
- Route look-ahead predicts bends, giving body lean and eye glance ahead of corners.
- Calibrated step stride, preserving existing analytic two-bone IK and deterministic distance-based gait.
- Fixed non-walking scene orientation to use the last segment of the previous route.
- Added **Turn Test** next to Walk Test.
- Dependency-free Node tests for corner anticipation and camera collision run before deployment.

## Run locally

```bash
git clone https://github.com/boidbit/mohalla-studio.git
cd mohalla-studio
python -m http.server 8000
# open http://localhost:8000
```

Requires internet to download Three.js from jsDelivr. No build step required. For tests:

```bash
npm test
```

## Project structure

- `index.html`: Studio UI, scene compiler, Three.js world, movement, camera, export
- `src/toon-stickman.js`: JavaScript procedural 2.5D stickman inspired by *insta-shorts* body proportions and action poses
- `src/cinematic-motion.js`: deterministic turn and camera-collision utilities
- `assets/*.png`: original Raju cut-out sprite layers
- `tests/*.test.mjs`: test cases (run on each Pages deployment)
- `.github/workflows/pages.yml`: live preview deployment to Pages

## Limitations

- This is **2.5D** acting in a Three.js 3D environment, not a fully skeletal 3D humanoid.
- Foot planting and turn lean are stylized approximations; no rigid-body simulation.
- No fully automatic voice synthesis or arbitrary AI-driven script action yet.
- In-browser export produces WebM, not MP4; automatic MP4 rendering will require FFmpeg.
- Visual browser testing still recommended: a Node syntax/test pass does not verify the GPU output.

The separate `boidbit/insta-shorts` repository was not modified.