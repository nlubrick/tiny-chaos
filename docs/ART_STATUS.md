# Art status: what is finished and what is not

Plain statement: **none of the new art in this branch is final painted artwork.** Every new texture is vector art generated in code (`src/art/*.js`) and rasterised at start-up. It is consistent, lit, animated and free of emoji or geometric stand-ins, but it is flatter than the three painted images already in `assets/`, and it reads as illustrated vector, not as the "realistic-cute" painted look the brief asks for. Treat it as a complete first pass and a working pipeline, not as shipped art.

## Painted art reused from the repo (finished)
| File | Used for |
|---|---|
| `assets/mystery_manor_icon_atlas.webp` | The six match-3 pieces and the Hex Bomb |
| `assets/mystery_manor_witnesses.webp` | Dialogue portraits: Mallow, Fern, Miss Wisp |

`assets/mystery_manor_library_bg.webp` and the two `audio/*.adp` files are left in place and are not used by this build.

## Vector first pass (replace with painted art)
| Texture key | Size | Anchor | What it is | Honest assessment |
|---|---|---|---|---|
| `mallow-w0..7`, `mallow-i0..5` | 250 x 170 | feet at (125, 158) | Mallow walk cycle (8 frames) and idle with tail sway and blink (6 frames) | Proportions and gait are believable; shading is two-tone with a rim light. Legs are single tapered shapes with no paw articulation. No turn, sit, jump or pounce animation. Does not match the painted dialogue portrait closely. |
| `fern` | 260 x 400 | feet at (130, 392) | Fern standing with coat, scarf, cap, beard | One static pose facing left. Breathing is a scale tween. No talking or gesture frames. |
| `lantern` | 70 x 110 | top centre | Fern's lantern | Simple. |
| `wisp0..3` | 300 x 440 | centre | Miss Wisp, drifting hem and hair | Four frames. Reads as a ghost; face is minimal. Does not resemble the portrait used for her in dialogue (see below). |
| `room-library`, `room-hall`, `room-gallery`, `room-attic` | 2200 x 720 | top-left | Room backdrops with furniture painted in | Flat-shaded furniture, generated book spines, generic sitters in the wall portraits. Lighting is baked gradients plus live additive glows. |
| `sky`, `rain`, `curtain`, `flame0..3`, `glow`, `vignette`, `plant` | various | | Storm, curtains, fire, light, foreground silhouettes | Serviceable effects. |
| `door-closed`, `door-open`, `runes`, `panel`, `clockface`, `pendulum` | various | | Things that change with the story | Simple but clear. The door "opens" by swapping to an open-door image; there is no swing animation. |
| `desk-bg`, `ho-key`, `ho-letter`, `ho-seal`, `ho-watch`, `ho-specs`, `ho-cover` | 1560 x 720 and small | | Hidden-object scene | Top-down desk. Five targets, one partly covered. Easy to read; not richly cluttered like a commercial hidden-object scene. |
| Clock puzzle gears, face, buttons | drawn with Phaser Graphics | | | Functional. The arrow buttons are plain text boxes. |
| Match-3 board frame, ward overlay, line-charm marker | drawn with Phaser Graphics / `glow` | | | Functional. The line charm is a tinted piece with a glow bar, not its own painted icon. |

## Known mismatches and gaps
- **Miss Wisp's dialogue portrait** is the third face on the existing witness strip: a dark-haired living woman. It was the only third portrait available. She needs a ghost portrait that matches her world sprite.
- **Mallow and Fern** in the world do not closely match their painted portraits.
- **No librarian art.** She is never shown, which suits the chapter, but the portrait over the library fireplace is a generic sitter.
- **Wall portraits** are procedurally generated generic figures.
- **No character shadows cast by firelight**; Mallow has a simple contact shadow only.
- **Title screen** has no illustration, only type on a gradient.
- **Sound effects are synthesised placeholders** (footsteps, chimes, stone, thunder, purr-less mew). Music is the real licensed soundtrack and is untouched.

## Swapping in painted art
Keep the key, size and anchor from the table and load an image under the same key in `BootScene.preload()`, then delete the matching `add(...)` line in `BootScene.create()`. Walk and idle frames can be supplied as individual images with the same keys or as a sprite sheet with the animation definitions adjusted.
