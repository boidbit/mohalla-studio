# Mohalla Studio — Cinematic v4

Independent **Three.js Indian mohalla video studio**, separate from `boidbit/insta-shorts`.

## Changes in v4

- Added a **Toon Stickman** character inspired by the procedural body proportions, facial expressions and pose animation of `boidbit/insta-shorts/studio/characters.py` and `studio/actions.py`. The character was **ported to JavaScript/Canvas2D**, not cloned as a 3D model.
- Original Raju character is retained. Use the **Character style** switch to compare both character designs.
- Distance-driven walk/run cycles, two-bone leg IK and an approximate fixed floor contact through each stance phase.
- Toon character now supports talk, wave, look, dance and jump with animated arms and expressions.
- Cinematic camera gets subtle horizontal rule-of-thirds composition for medium/close-up shots.
- Preserved the original storyboard, time scrubbing, Three.js neighborhood, day/night lighting and WebM recording.

## Run

```bash
git clone https://github.com/boidbit/mohalla-studio.git
cd mohalla-studio
python -m http.server 8000
```

Open **http://localhost:8000** in Chrome/Edge. Internet is needed for the Three.js CDN. In Studio choose **Toon Stickman** or **Original Raju**, press **Walk Test**, and compare **Cinematic** vs **Steady Follow** shots.

## Files

- `index.html`: Three.js mohalla, storyboard UI, camera and export.
- `src/toon-stickman.js`: JS procedural character and animation based on the *insta-shorts* style.
- `assets/head.png`, `torso.png`, `leg_left.png`, `leg_right.png`: original illustrated Raju sprite layers.

## Limits

This is **2.5D** character animation inside a 3D world; it is not a fully rigged 3D humanoid. Foot planting and camera occlusion are approximations, not rigid-body physics. Hindi speech synthesis and arbitrary AI-written actions are not yet implemented. The browser exporter records WebM (not native MP4). Rendering has not been visually verified against an online Three.js runtime in this environment.

The separate `insta-shorts` repository was **not modified**.
