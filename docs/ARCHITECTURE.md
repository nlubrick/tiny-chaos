# Mystery Manor: architecture

Phaser 3.90 (vendored in `vendor/`, MIT), plain ES modules, no build step. Any static host serves it; open `index.html`.

## The split

| Layer | Where | What it owns |
|---|---|---|
| Page and HUD | `index.html`, `src/ui.css` | Arrow buttons, interaction button, dialogue box, title, settings, story cards. These are DOM elements on top of the canvas, so touch handling is ordinary browser pointer events and text is crisp at any size. |
| Game bootstrap | `src/main.js` | Creates the services, the Phaser game, title screen and settings wiring. |
| Shared services | `src/ctx.js` | One object every scene imports: `state`, `input`, `audio`, `dialogue`, `puzzles`, `ui`, `game`. |
| Systems | `src/systems/` | `StoryState` (flags + save), `Input`, `Dialogue`, `AudioManager`, `PuzzleManager`, `UI`. None of them know about any specific room or puzzle. |
| Content | `src/data/world.js`, `src/data/story.js` | Rooms, interactables, triggers, lights, puzzle registry, every line of dialogue, story cards. |
| World | `src/scenes/WorldScene.js` | Player movement, camera, parallax, lighting, proximity prompts, the step interpreter that runs content, and `_storyChanged`, the one place where a flag changes what the manor looks like. |
| Puzzles | `src/puzzles/` | `BasePuzzle` plus one scene per puzzle type. Match-3 rules live in `match3Logic.js` with no drawing in them. |
| Art | `src/art/` | Functions that return SVG. `BootScene` rasterises each once into a Phaser texture. |

## Stage and scaling

The game is drawn on a fixed 1560 x 720 stage (`config.js`) and scaled with `Phaser.Scale.FIT`. `#stage-wrap` keeps that aspect ratio in CSS, so the DOM HUD lines up with the canvas. In portrait the stage sits at the top and the controls move underneath it. Safe-area insets are applied to every HUD element.

Each room is 2200 wide. The camera is bounded to the current room and eases toward a point slightly ahead of Mallow. Doors are interactables that fade to the next room (`["go", room, x]`).

## Input

`Input.js` is the only source of movement. Direction comes from the two arrow buttons or the keyboard, never from the canvas, so touching the scene cannot move Mallow. Each button captures its pointer on press and releases on `pointerup`, `pointercancel`, `lostpointercapture` and `pointerleave`; the window also releases everything on `touchend` with no touches left, `touchcancel`, `blur`, `pagehide` and when the tab is hidden. `touchstart` on the buttons is cancelled and CSS removes selection and the iOS callout. `Input.setEnabled(false)` hides the controls and zeroes the axis during dialogue, cutscenes, puzzles and the menu.

## Story state

`StoryState` is a set of named flags saved to `localStorage` (`mystery-manor-ch1-v1`) together with Mallow's position. Conditions are `"flag"`, `"!flag"` or an array of those. Everything that depends on progress (which prompt an object offers, whether a trigger fires, whether a door is open after a reload) reads flags, so progress survives a reload.

## Content steps

Interactables and triggers carry a `run` list. `WorldScene.run` executes it in order and returns control to the player at the end:

`["say", scriptId]` `["puzzle", puzzleId]` `["set", flag]` `["sfx", name]` `["go", roomId, x]` `["cutscene", name]` `["card", cardId]` `["toast", text]`

## Puzzle lifecycle

1. **Initialise**: a step `["puzzle", id]` calls `PuzzleManager.start(id)`. It pauses the world, hides the controls, shows "Step back", and launches the scene named in `PUZZLES[id]` with that entry's `config`.
2. **Play**: the scene extends `BasePuzzle`, draws itself in `build(config)` and handles its own touches.
3. **Validate**: the scene decides when it is solved and calls `this.solved()` once.
4. **Complete**: `PuzzleManager.finish(true)` stops the scene, resumes the world, sets `PUZZLES[id].solved`.
5. **Return**: the world runs `PUZZLES[id].after` and then the rest of the step list, with Mallow standing where the puzzle was started. "Step back" calls `finish(false)`: nothing is set and the puzzle can be reopened.

The manager never looks inside a puzzle, and puzzles never touch the world. That is what lets pull-the-pin, block and chain-reaction puzzles be added later as new scenes without editing the three that exist.

## Audio

Music is a single `<audio>` element owned by `AudioManager`, outside every scene, streaming the three Kevin MacLeod recordings from incompetech in the original order and advancing on `ended`. Rooms and puzzles never touch it, so it does not restart. It starts on the "Begin" tap, which satisfies iOS. Sound effects are separate Web Audio one-shots with their own gain; fire and rain are two quiet looping noise beds. There is no generated music anywhere in the code.

## Rendering budget

Per frame: four room images (only one on screen), one sky image, one rain tile sprite, about 20 additive glow sprites, a dozen small animated sprites, one particle emitter, one vignette. Textures total roughly 30 MB of GPU memory, dominated by the four 2200 x 720 room paintings.
