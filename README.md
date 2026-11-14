# Tiny Chaos — The Town Effect

**Play the current mobile prototype:** https://tiny-chaos-game.onrender.com

Tiny Chaos is a branching butterfly-effect game about the people in a small town. One seemingly minor change to a resident's morning reshapes other people's destinations, schedules, relationships, and opportunities.

## Version 0.3: Maplewood
- Eight named residents with daily plans, an illustrated town map, and a moving bus.
- Choose whether to jostle Leo, warn him, distract a cyclist, or let the day unfold.
- Watch cascading consequences as characters change destinations and the live story feed traces causes.
- Tap residents to learn who they are and what changed for them.
- Pause, replay, speed up, and compare different timelines.

**Important:** This is a branching-story prototype with authored event chains and a lightweight movement simulation. It is **not yet** an open-ended, autonomous citizen simulation or a full AI-generated narrative. The next major iteration should use state-dependent event rules, multiple interventions during a day, and independent resident schedules to allow emergent outcomes.

## Deployment

This repository owns its own Render Static Site, `tiny-chaos-game`, automatically deploying from `main`. There is no dependency on The System or ATLAS and no server-side credentials.

## Next
1. Test real iPhone touch interactions and improve scene legibility.
2. Replace authored chains with a stateful world simulation and an event-causality engine.
3. Give every resident independent relationships, routines, needs, and goals.
4. Allow interventions at different moments instead of only at 8:15.
5. Introduce mysteries and goals that encourage replay without a simplistic right/wrong ending.
