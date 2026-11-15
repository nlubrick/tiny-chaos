# Summary for code audit

**Branch:** `claude/mystery-manor-chapter-1`, based on `mystery-manor-preview`. **Target:** `mystery-manor-preview`. `main` (Tiny Chaos) is not touched. Nothing has been merged or deployed.

## What changed
- `index.html` (the old single-file prototype) was renamed to `prototype-v0.html` and is no longer loaded.
- New `index.html`, `src/` (about 20 modules), `vendor/phaser.min.js` (Phaser 3.90.0, MIT), `docs/`, `tests/`, `MYSTERY_MANOR.md`.
- `README.md`, `assets/` and `audio/` are unchanged.

## Where to look first
| Concern | File |
|---|---|
| Touch and keyboard input, stuck-control handling | `src/systems/Input.js` |
| Music: original tracks, order, persistence, iOS start | `src/systems/AudioManager.js`, `src/config.js` |
| Save data and conditions | `src/systems/StoryState.js` |
| Puzzle lifecycle | `src/systems/PuzzleManager.js`, `src/puzzles/BasePuzzle.js` |
| Match-3 rules, including 2 x 2 → Hex Bomb | `src/puzzles/match3Logic.js` (tests: `tests/match3.test.mjs`) |
| All chapter content | `src/data/world.js`, `src/data/story.js` |
| World scene: movement, camera, step interpreter, cutscene | `src/scenes/WorldScene.js` |

## Things worth a reviewer's scepticism
1. **Not run on a real iPhone.** All touch testing is Chrome emulation.
2. **Music playback could not be exercised** from the build sandbox (no route to incompetech.com). URLs, order, attribution and the player logic are carried over from the prototype; hearing it play needs a real browser.
3. **WebGL performance is unmeasured.** The automated play-through uses the Canvas renderer.
4. **Art is generated vector, not painted.** `docs/ART_STATUS.md` lists every texture and its shortcomings.
5. `WorldScene.js` is the largest file and mixes scene set-up with story reactions (`_storyChanged`, `_cut_passage`). It is readable at this size; a second chapter would be the time to split set-up per room.
6. `window.__mm` exposes the service object for the tests. Harmless on a static game, but remove it if that matters.
7. HiddenObject targets and the match-3 ward layout are constants in their files, not yet in `PUZZLES[id].config`.
8. No dependency on a network at start-up other than the music stream. No analytics, no external scripts.

## Requirements trace
| Brief | Status |
|---|---|
| Side-scrolling manor with Library, West Hall, Portrait Gallery, Attic Landing | Done |
| Smooth movement, camera easing, parallax, lighting, proximity prompts, dialogue | Done |
| Hidden objects: The Librarian's Desk | Done |
| Match-3: Break the Enchantment, cascades, specials, 2 x 2 → Hex Bomb | Done |
| Mechanical: The Grandfather Clock, thirteen chimes | Done |
| Later puzzle types not built, but addable independently | Not built, by design; see `docs/EXTENDING.md` |
| Chapter One flow start to finish, ending on a new mystery | Done |
| State preserved; control returns beside the object | Done |
| Mallow, Fern, Miss Wisp and the story facts preserved | Done; the later revelation about the librarian is only hinted (Miss Wisp cuts herself off; the star chart was cut out with the librarian's own scissors) |
| Hold-to-move, no tap-to-walk, no selection, cancellation handling | Done (emulated) |
| Original three tracks, order, CC BY 4.0 credit, on/off, volume, no synthesised music | Done (playback unverified) |
| Separate sound-effect volume | Done |
| Modular, data-driven, Phaser 3, static-site compatible | Done |
| Professional painted art | **Not done.** Vector first pass only |
| Real iPhone verification | **Not done** |
