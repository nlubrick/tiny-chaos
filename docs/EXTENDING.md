# Adding to Mystery Manor

Most additions are data. Nothing here needs a build step; edit, reload.

## A new line of dialogue or a new conversation
`src/data/story.js` → add an entry to `SCRIPTS`. Use the helpers at the top: `M()` Mallow, `F()` Fern, `W()` Miss Wisp, `N()` narration. Play it from any `run` list with `["say", "yourId"]`.

A new speaker needs a portrait: the strip `assets/mystery_manor_witnesses.webp` holds three 160 x 228 faces side by side and `face` is the index. Add a face to the strip, change `background-size` in `#dlg-portrait` (`src/ui.css`) from `300%` to `400%`, and change the `* 50` in `Dialogue._show` to `* 100 / (faces - 1)`.

## Something new to interact with
`src/data/world.js` → add to `INTERACTABLES`:

```js
{ id: "piano", room: "hall", x: 520, range: 140, states: [
  { when: "!heardPiano", label: "Press a key", run: [["sfx", "chime"], ["say", "piano"], ["set", "heardPiano"]] },
  { when: "heardPiano",  label: "Look at the piano", run: [["say", "pianoAgain"]] } ] }
```
`x` is measured from the room's left edge. The first state whose `when` holds is offered; a state with `label: null` hides the prompt.

## Something that happens by itself
Add to `TRIGGERS`. It fires once Mallow is between `from` and `to` in that room and `when` holds. End its `run` with a `["set", flag]` that makes `when` false, or it will fire again.

## Blocking the way until something is solved
Add `{ room, x, until: flag }` to `BLOCKERS` in `src/data/world.js`. Mallow stops short of `x` until the flag is set.

## The installed app cache
`service-worker.js` serves files cache-first. When you add a module, add it to `CORE` **and change the `CACHE` name**, or installed copies keep running the old files.

## A new room
1. `src/art/rooms.js`: write a function like `hall()` that returns `{ body, defs }` using `shell(palette, [windowX...], extraSvg)` and the furniture helpers (`bookshelf`, `portrait`, `sconce`, `doorway`, `arch`, `rug`, `windowFrame`), and add it to `ROOM_SVG`.
2. `src/data/world.js`: add `{ id, name, x0, start }` to `ROOMS` with `x0` 2200 past the last room; list its windows in `WINDOWS`, its candles in `LIGHTS`, and add door interactables in both directions using `["go", roomId, x]`.

`BootScene` and `WorldScene` pick the room up from those lists.

## A new character in the world
Write an SVG function in `src/art/characters.js`, register the texture in `BootScene.create`, add the sprite in `WorldScene.create` next to Fern and Miss Wisp, and give them an interactable. For an animated character, generate several frames from one function with a phase parameter, as `mallowSvg` and `wispSvg` do.

## A new puzzle of an existing type
Add an entry to `PUZZLES` in `src/data/world.js` pointing at the same scene with a different `config`, a new `solved` flag and an `after` list, then start it with `["puzzle", "yourId"]`. (Match3 reads `config.title`; the ward layout is `WARD_CELLS` in `match3Logic.js`. HiddenObject's targets are the `TARGETS` table at the top of its file. To run several different boards or desks, move those tables into `config`.)

## A new puzzle type
1. Create `src/puzzles/PinPuzzle.js`:

```js
import { BasePuzzle } from "./BasePuzzle.js";
export class PinPuzzle extends BasePuzzle {
  constructor() { super("Pin"); }
  build(config) { /* draw it, wire this.input; call this.solved() when the win check passes */ }
}
```
2. Add the class to the `scene` array in `src/main.js`.
3. Register it in `PUZZLES`: `pin: { scene: "Pin", solved: "pinSolved", after: [["say", "pinDone"]], config: {...} }`.

Keep rules that can be tested without a screen in their own file, as `match3Logic.js` does, and add a test beside `tests/match3.test.mjs`.

## Making the world react to a solved puzzle
`WorldScene._storyChanged(flag)` is the single place: swap a texture, start a tween, show a sprite. Also set the same thing from the flag in `create()` so a reloaded game looks right.

## Sounds
`AudioManager.sfx(name)`: add a `case` built from `_tone` and `_hush`. Music is not synthesised and must not be; to change the soundtrack edit `MUSIC_TRACKS` in `src/config.js` and the credits in `index.html` together.

## Replacing drawn art with painted art
Every texture is registered by key in `BootScene`. To swap one for an image, load it in `preload()` under the same key and delete the matching `add(...)` line. Sizes and anchor points are listed in `docs/ART_STATUS.md`.
