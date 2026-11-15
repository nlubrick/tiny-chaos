# Testing

## How to run
```
python3 tests/serve.py &                 # static server on http://localhost:8765
node tests/match3.test.mjs               # rules, no browser
PUPPETEER=/path/to/node_modules/puppeteer-core node tests/smoke.cjs   # full play-through in headless Chrome
```

## What kind of testing this is
- **Emulated touch, not a real iPhone.** The play-through runs in headless desktop Chrome with a 844 x 390 touch viewport (iPhone landscape), a 390 x 844 touch viewport (portrait), and a 1280 x 720 keyboard viewport. Nothing here was run on a physical iPhone or in iOS Safari.
- The play-through uses Phaser's Canvas renderer (`?canvas`), because headless Chrome has no GPU and its software WebGL manages about 6 frames a second. The default WebGL renderer is separately booted through to the first dialogue to confirm it starts without errors. **Frame rate on a real phone is unmeasured.**
- **Music playback is unverified.** The test sandbox cannot reach incompetech.com, so those requests are blocked in the test. What is verified: the player element points at the original track URLs in the original order, it is one element that survives rooms and puzzles, on/off and volume work, and credits are shown.

## Results (last run: 15 Nov 2026)

`tests/match3.test.mjs`: 10 of 10 passed.
- New boards start with no matches and at least one move (200 seeds)
- A swap that makes nothing is refused and leaves the board unchanged
- Three in a row clears three
- **Four in a 2 x 2 square creates a Hex Bomb** at the moved piece, and the other three clear
- Moving a Hex Bomb blasts the 3 x 3 around it
- Four in a line creates a line charm; a line charm sweeps its row
- Clearing a warded square breaks the ward
- Gravity and refill keep the board full with unique pieces (40 moves)
- A stuck board can be shuffled into a playable one
- The ward objective is always reachable (40 seeds of random legal play; slowest took 38 moves)

`tests/smoke.cjs`: 59 of 59 passed. (Board is now 6 x 6 with 112-unit squares; a check confirms each square is at least 56 CSS pixels at iPhone landscape size.)

| Brief item | Check | Result |
|---|---|---|
| Movement left and right | Hold arrow via touch; D and ArrowLeft on desktop | Pass |
| No text selection | Long press leaves the selection empty; controls are `user-select: none`; context menu cancelled | Pass |
| Releasing stops Mallow | Velocity is zero and position stable after release | Pass |
| Touching scenery does not move Mallow | Two taps mid-scene, position unchanged | Pass |
| No stuck controls | Window blur while holding releases the direction | Pass |
| Camera follow | Camera stays inside the current room's bounds | Pass |
| Room transitions | Library ↔ West Hall ↔ Gallery ↔ Attic, all walked | Pass |
| Dialogue triggers | Intro, scraping noise, Fern's call, Fern, Miss Wisp, passage | Pass |
| Hidden-object puzzle | Wrong tap finds nothing; five finds complete it; flag set | Pass |
| Match-3 | Dud swap slides back; play to zero wards (37 moves in the last run) | Pass |
| 2 x 2 makes a Hex Bomb | Arranged on the live board, swapped with real taps, bomb appears | Pass |
| Mechanical puzzle | Hands locked until gears aligned; set to 12:12; thirteen chimes | Pass |
| World changes | Library door texture is open; fireplace panel is retracted | Pass |
| Control returns near the object | Beside the desk; beside the clock | Pass |
| Chapter ending | Collector card shown, no "level complete"; exploration continues | Pass |
| State preserved | Reload offers Continue; flags, door and panel restored | Pass |
| Music preserved | Three original tracks in order, one persistent element, credits and licence link | Pass (playback itself unverified, see above) |
| Music and effects controls | Toggle pauses; two independent volumes | Pass |
| Portrait fallback | Arrows on screen and at least 44px; walking works | Pass |
| Console errors | None in any run | Pass |

## Known issues and limits
1. Not tested on a real iPhone. The things most likely to differ there: Safari's handling of long-press on the canvas, safe-area spacing with the home indicator, audio start after the first tap, and start-up time while roughly 45 SVG textures are rasterised.
2. Real-device frame rate unknown. If it is low, the first things to cut are the dust particles and the number of additive glows (`LIGHTS` in `src/data/world.js`).
3. Music streams from incompetech.com. If that host is unreachable the game still runs; the settings panel says the music could not be reached and retries when music is switched on again. The tracks are not bundled in the repo.
4. Portrait is a fallback: the stage is letterboxed to the top of the screen and is small. Landscape is the intended way to play.
5. Art is a vector first pass. See `docs/ART_STATUS.md`.
6. Sound effects are synthesised.
7. The match-3 has no move limit and cannot be failed. That is a deliberate choice for a story chapter, not an omission.
8. The clock's minute hand moves one minute per tap (holding repeats and speeds up). From 3:53 to 12:12 the short way is 3 hour taps and 41 minute steps.
9. Saving uses `localStorage`; private browsing on iOS may not keep progress between visits.
10. `prototype-v0.html` and the two unused `audio/*.adp` files are still in the repo.
