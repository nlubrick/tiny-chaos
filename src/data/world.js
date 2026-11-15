/**
 * The manor as data. Add a room, a thing to look at, or a moment that fires when Mallow walks past
 * by adding entries here; WorldScene reads these lists and needs no changes.
 *
 * x positions are measured from the left edge of the room (0..2200).
 * `when` is a story condition: "flag", "!flag", or an array that must all hold.
 * `run` is a list of steps:  ["say", scriptId]  ["puzzle", puzzleId]  ["set", flag]  ["sfx", name]
 *                            ["go", roomId, x]  ["cutscene", name]  ["card", cardId]  ["toast", text]
 */
export const ROOMS = [
  { id: "library", name: "The Library",      x0: 0,    start: 560 },
  { id: "hall",    name: "The West Hall",    x0: 2200, start: 300 },
  { id: "gallery", name: "Portrait Gallery", x0: 4400, start: 300 },
  { id: "attic",   name: "Attic Landing",    x0: 6600, start: 300 }
];
export const WALK_MIN = 120, WALK_MAX = 2090;

/** Things Mallow can use. The first state whose `when` holds is the one offered. */
export const INTERACTABLES = [
  { id: "fireplace", room: "library", x: 400, states: [
    { when: "!clockSolved", label: "Sniff the hearth", run: [["say", "hearth"]] },
    { when: "clockSolved", label: "Warm your paws", run: [["say", "hearthAfter"]] } ] },
  { id: "passage", room: "library", x: 676, states: [
    { when: ["clockSolved", "!endingSeen"], label: "Look inside", run: [["say", "passage"], ["set", "endingSeen"], ["card", "ending"]] },
    { when: "endingSeen", label: "Look inside", run: [["say", "passageAgain"]] } ] },
  { id: "desk", room: "library", x: 1640, states: [
    { when: "!introDone", label: null },
    { when: "!deskSolved", label: "Search the desk", run: [["say", "deskBefore"], ["puzzle", "desk"]] },
    { when: "deskSolved", label: "Look at the desk", run: [["say", "deskAfter"]] } ] },
  { id: "libDoor", room: "library", x: 2040, states: [
    { when: "!deskSolved", label: "Try the door", run: [["sfx", "nope"], ["say", "doorLocked"]] },
    { when: "!doorOpen", label: "Use the strange key", run: [["say", "doorWard"], ["puzzle", "ward"]] },
    { when: "doorOpen", label: "West Hall", run: [["go", "hall", 300]] } ] },

  { id: "hallDoor", room: "hall", x: 180, states: [{ label: "Library", run: [["go", "library", 1920]] }] },
  { id: "frontDoor", room: "hall", x: 760, states: [{ label: "Inspect the seal", run: [["say", "frontDoor"]] }] },
  { id: "catPortrait", room: "hall", x: 990, range: 90, states: [{ label: "Admire the portrait", run: [["say", "catPortrait"]] }] },
  { id: "fern", room: "hall", x: 1110, range: 150, states: [
    { when: "!metFern", label: "Talk to Fern", run: [["say", "fernMeet"], ["set", "metFern"]] },
    { when: "!clockSolved", label: "Talk to Fern", run: [["say", "fernHint"]] },
    { when: "clockSolved", label: "Talk to Fern", run: [["say", "fernAfter"]] } ] },
  { id: "clock", room: "hall", x: 1780, states: [
    { when: "!metFern", label: "Look at the clock", run: [["say", "clockEarly"]] },
    { when: "!clockSolved", label: "Open the clock", run: [["say", "clockBefore"], ["puzzle", "clock"]] },
    { when: "clockSolved", label: "Listen to the clock", run: [["say", "clockAfter"]] } ] },
  { id: "hallArch", room: "hall", x: 2040, states: [{ label: "Portrait Gallery", run: [["go", "gallery", 300]] }] },

  { id: "galArch", room: "gallery", x: 180, states: [{ label: "West Hall", run: [["go", "hall", 1920]] }] },
  { id: "wisp", room: "gallery", x: 1150, range: 190, states: [
    { when: "!metWisp", label: "Talk to the ghost", run: [["say", "wispMeet"], ["set", "metWisp"]] },
    { when: "!clockSolved", label: "Talk to Miss Wisp", run: [["say", "wispHint"]] },
    { when: "clockSolved", label: "Talk to Miss Wisp", run: [["say", "wispAfter"]] } ] },
  { id: "slashed", room: "gallery", x: 1815, states: [{ label: "Study the portrait", run: [["say", "slashed"]] }] },
  { id: "galDoor", room: "gallery", x: 2040, states: [{ label: "Attic stairs", run: [["go", "attic", 300]] }] },

  { id: "atticDoor", room: "attic", x: 180, states: [{ label: "Back downstairs", run: [["go", "gallery", 1920]] }] },
  { id: "chart", room: "attic", x: 1560, range: 190, states: [{ label: "Study the frame", run: [["say", "chart"]] }] },
  { id: "scope", room: "attic", x: 1960, states: [{ label: "Peer through", run: [["say", "scope"]] }] }
];

/** Moments that fire by themselves, once, when Mallow is in the right place. */
export const TRIGGERS = [
  { id: "intro", room: "library", from: 0, to: 2200, when: "!introDone", run: [["sfx", "thunder"], ["say", "intro"], ["set", "introDone"], ["toast", "Hold the arrows to walk"]] },
  { id: "scrape", room: "library", from: 1000, to: 2200, when: ["introDone", "!heardScrape"], run: [["sfx", "scrape"], ["say", "scrape"], ["set", "heardScrape"]] },
  { id: "hallFirst", room: "hall", from: 0, to: 2200, when: "!sawHall", run: [["say", "hallFirst"], ["set", "sawHall"]] },
  { id: "galFirst", room: "gallery", from: 700, to: 2200, when: "!sawWisp", run: [["sfx", "whisper"], ["say", "galFirst"], ["set", "sawWisp"]] },
  { id: "afterClock", room: "hall", from: 0, to: 2200, when: ["clockSolved", "!passageShown"], run: [["cutscene", "passage"], ["set", "passageShown"], ["say", "afterClock"]] }
];

/** Light sources: a soft glow, and a live flame where there is one. */
export const LIGHTS = [
  { room: "library", x: 400, y: 560, kind: "fire" },
  { room: "library", x: 260, y: 252, kind: "candle" }, { room: "library", x: 540, y: 252, kind: "candle" },
  { room: "library", x: 1232, y: 230, kind: "candle" }, { room: "library", x: 1268, y: 230, kind: "candle" },
  { room: "library", x: 1772, y: 230, kind: "candle" }, { room: "library", x: 1808, y: 230, kind: "candle" },
  { room: "library", x: 1554, y: 420, kind: "lamp" },
  { room: "hall", x: 1232, y: 230, kind: "candle" }, { room: "hall", x: 1268, y: 230, kind: "candle" },
  { room: "gallery", x: 862, y: 240, kind: "candle" }, { room: "gallery", x: 898, y: 240, kind: "candle" },
  { room: "attic", x: 1560, y: 300, kind: "blue" }
];
export const WINDOWS = { library: [1340], hall: [1450], gallery: [1420], attic: [1130] };
export const FOREGROUND = [
  { room: "library", x: 40 }, { room: "library", x: 1180 }, { room: "hall", x: 560 }, { room: "hall", x: 1880 },
  { room: "gallery", x: 300 }, { room: "gallery", x: 1380 }, { room: "attic", x: 420 }
];

/** Puzzles by id: which scene runs them, what it is given, and the flag set when it is solved. */
export const PUZZLES = {
  desk:  { scene: "HiddenObject", solved: "deskSolved",  after: [["say", "deskFound"]], config: { title: "The Librarian's Desk" } },
  ward:  { scene: "Match3",       solved: "doorOpen",    after: [["sfx", "unlock"], ["say", "doorOpens"]], config: { title: "Break the Enchantment" } },
  clock: { scene: "Clock",        solved: "clockSolved", after: [], config: { title: "The Grandfather Clock" } }
};
