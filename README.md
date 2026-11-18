# Mohalla Studio — Cinematic v3

A standalone **Three.js 3D Indian mohalla** prototype with a 2.5D illustrated character, cinematic camera and storyboard tools. This is a **separate project** from `boidbit/insta-shorts`.

## Features
- Reusable Indian neighborhood environment with shops, street objects, NPCs and day/night lighting.
- Layered character puppet (head, torso, animated arms and legs).
- Smoother walking/running, acceleration and braking, turning, dust and foot-contact shadows.
- Cinematic tracking, wide and close-up camera shots with basic obstruction avoidance.
- Script timeline preview, 9:16 / 16:9 formats, voiceover upload and browser WebM recording.

## Run locally

```bash
git clone https://github.com/boidbit/mohalla-studio.git
cd mohalla-studio
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in Chrome or Edge. Three.js loads from jsDelivr and needs internet.

## Project files

- `index.html` — Three.js world, studio UI, animation and camera logic.
- `assets/head.png`, `assets/torso.png`, `assets/leg_left.png`, `assets/leg_right.png` — original character's sprite layers.

## Current limitations
Character is a 2.5D paper puppet, not a fully rigged 3D humanoid. Walking physics and camera collision are approximations. MP4 conversion requires FFmpeg; the in-browser recorder produces WebM. Script parser supports predefined actions, not arbitrary AI-directed acting yet.

## Next focus
Polish character movement, interaction with the ground, camera composition, lighting and mohalla detail before building automatic script-to-video generation.
