# Tiny Chaos

A mobile-first Rube Goldberg puzzle prototype. Move and rotate the golden deflector to change the falling cake's path. Collisions trigger a chain of other events; ring the bakery's golden bell to solve the level.

**Play:** https://tiny-chaos-game.onrender.com

## Controls

- Drag the gold deflector in the game scene.
- Use the left/right buttons to adjust its angle.
- Select **Release the Cake** to start the physics simulation.
- Replay, reset, and try alternative collision paths.

## Deployment

This GitHub repository is connected to its own Render Static Site, **tiny-chaos-game**. The site serves the root `index.html` file with no build step; automatic deployment is enabled for updates to `main`.

## Current scope

Version 0.2 is a single-level prototype using a custom deterministic 2D collision simulation, Canvas illustration, and touch controls in a self-contained HTML page. It does **not yet** use Phaser or Matter.js and is not a finished iPhone App Store application.

The project has no backend, accounts, trading logic, credentials, or connection to The System/ATLAS.

## Next development milestones

1. Test on real iPhone Safari and fix any touch/viewport issues.
2. Refine collision feel and add replayable puzzles with distinct multi-step outcomes.
3. Move game code into modules and adopt a maintained physics engine if warranted.
4. Add levels, characters, feedback, progression, and polish.
