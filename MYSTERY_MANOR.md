# Mystery Manor: The Vanishing at Thorne House

Chapters One and Two, built on the `mystery-manor-preview` line. (`README.md` still describes Tiny Chaos, the separate game on `main`, and is deliberately untouched.)

**Play locally:** `python3 tests/serve.py` then open http://localhost:8765. It is a static site: `index.html` at the repo root, no build step.

- Walk: hold the on-screen arrows, or arrow keys / A and D.
- Interact: the button that appears near things, or E / Enter / Space.
- Settings (top right): music on/off, music volume, sound-effect volume, credits, restart.

## What is in Chapter One
Library → search the librarian's desk (hidden objects) → break the ward on the door (match-3) → West Hall, meet Fern → free and set the grandfather clock (mechanical) → thirteen chimes, the panel beside the library fireplace opens → the passage and the Collector's card. The Portrait Gallery (Miss Wisp) and the Attic Landing (the empty star-chart frame) are open to explore once the door is unlocked.

## What is in Chapter Two: Beneath the Hearth
Down the passage beside the fireplace → the Hidden Stair → work the sluice (pull-the-pin) to lift the gate → the Undercroft, the Collector's camp, Miss Wisp names him → clear the archive aisle (sliding blocks) → the Star Vault, the librarian's note → wake the orrery (chain reaction) → it points at the garden observatory, and the Collector has been waiting for exactly that.

## Documents
- `docs/ARCHITECTURE.md`: how it is put together
- `docs/EXTENDING.md`: how to add rooms, characters, dialogue and puzzles
- `docs/TESTING.md`: what was tested, results, known issues
- `docs/ART_STATUS.md`: which art is finished and which is a first pass
- `docs/AUDIT_SUMMARY.md`: short summary for code review

`prototype-v0.html` is the earlier single-file prototype, kept for reference. It is not loaded by the game.

## Music
"Sneaky Adventure", "Some Amount of Evil" and "Machinations" by Kevin MacLeod (incompetech.com), unmodified, played in that order. Licensed under Creative Commons Attribution 4.0: https://creativecommons.org/licenses/by/4.0/

Phaser 3.90.0 is vendored under `vendor/` (MIT licence, see `vendor/PHASER-LICENSE.md`).
