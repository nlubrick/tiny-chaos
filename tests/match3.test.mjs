// Run with: node tests/match3.test.mjs
import assert from "node:assert/strict";
import { rng } from "../src/art/svg.js";
import { makeBoard, findGroups, trySwap, findMove, findMoves, WARD_CELLS, shuffle, resolve, wardsLeft, KINDS } from "../src/puzzles/match3Logic.js";

let passed = 0; const test = (name, fn) => { fn(); passed++; console.log("ok  " + name); };
/** Builds a board from rows of digits; "." squares get kinds that never match anything nearby. */
function board(rows) {
  const b = { rows: rows.length, cols: rows[0].length, g: [], w: [], nextId: 1 };
  rows.forEach((row, r) => { b.g.push([]); b.w.push([]); [...row].forEach((ch, c) => { b.g[r].push({ id: b.nextId++, t: ch === "." ? 100 + r * 10 + c : +ch, s: null }); b.w[r].push(false); }); });
  return b;
}
const fixed = () => 0.999;   // refills are always kind 5

test("new boards start with no matches and at least one move", () => {
  for (let s = 1; s <= 200; s++) { const b = makeBoard(7, 7, rng(s)); assert.equal(findGroups(b).cells.size, 0); assert.ok(findMove(b)); }
});
test("a swap that makes nothing is refused and the board is unchanged", () => {
  const b = board(["....", "....", "...."]), before = JSON.stringify(b.g);
  assert.equal(trySwap(b, [0, 0], [0, 1], fixed), null); assert.equal(JSON.stringify(b.g), before);
});
test("three in a row clears three and leaves no charm", () => {
  const b = board(["....", "11.1", "...."]);
  const steps = trySwap(b, [1, 2], [1, 3], fixed);
  assert.equal(steps[0].cleared.length, 3); assert.equal(steps[0].created.length, 0);
});
test("four in a 2x2 square creates a Hex Bomb where the piece was moved to", () => {
  const b = board([".....", ".11..", ".1.1.", "....."]);
  const steps = trySwap(b, [2, 3], [2, 2], fixed);
  assert.ok(steps, "swap accepted");
  assert.deepEqual(steps[0].created.map(k => [k.r, k.c, k.s]), [[2, 2, "hex"]]);
  assert.equal(steps[0].cleared.length, 3, "the other three squares clear");
  assert.equal(b.g.flat().filter(p => p.s === "hex").length, 1);
});
test("moving a Hex Bomb blasts the 3x3 around where it lands", () => {
  const b = board([".....", ".....", ".....", ".....", "....."]);
  b.g[2][1].s = "hex";
  const steps = trySwap(b, [2, 1], [2, 2], fixed);
  assert.equal(steps[0].cleared.length, 9); assert.deepEqual(steps[0].fired.map(f => f.s), ["hex"]);
});
test("four in a line creates a line charm, and a line charm sweeps its row", () => {
  const b = board([".....", "11.1.", "..1..", "....."]);
  b.g[1][3].t = 1; b.g[1][4].t = 1; b.g[1][2].t = 9; b.g[2][2].t = 1;      // 1 1 x 1 1 with a 1 below the gap
  const steps = trySwap(b, [2, 2], [1, 2], fixed);
  assert.equal(steps[0].created[0].s, "lineV");
  const c = board(["....", "....", "...."]); c.g[1][0].s = "lineH";
  assert.equal(trySwap(c, [1, 0], [1, 1], fixed)[0].cleared.length, 4);
});
test("clearing a warded square breaks the ward", () => {
  const b = board(["....", "11.1", "...."]); b.w[1][0] = true; b.w[2][3] = true;
  const steps = trySwap(b, [1, 2], [1, 3], fixed);
  assert.deepEqual(steps[0].wards, [{ r: 1, c: 0 }]); assert.equal(wardsLeft(b), 1);
});
test("pieces fall and the board refills completely", () => {
  const b = makeBoard(7, 7, rng(4)), r = rng(99);
  for (let i = 0; i < 40; i++) { const m = findMove(b) || (shuffle(b, r), findMove(b)); trySwap(b, m[0], m[1], r); assert.ok(b.g.flat().every(p => p && p.t >= 0 && p.t < KINDS)); assert.equal(new Set(b.g.flat().map(p => p.id)).size, 49); assert.equal(findGroups(b).cells.size, 0); }
});
test("a stuck board can be shuffled into a playable one", () => {
  const b = makeBoard(7, 7, rng(8)); assert.ok(shuffle(b, rng(3))); assert.ok(findMove(b)); assert.equal(findGroups(b).cells.size, 0);
});
test("the ward puzzle is finished by a player who just plays random legal moves", () => {
  let worst = 0;
  for (let s = 1; s <= 40; s++) {
    const r = rng(s * 7), b = makeBoard(7, 7, r, WARD_CELLS);
    let moves = 0;
    while (wardsLeft(b) && moves < 400) { let ms = findMoves(b); if (!ms.length) { shuffle(b, r); ms = findMoves(b); } const m = ms[Math.floor(r() * ms.length)]; trySwap(b, m[0], m[1], r); moves++; }
    assert.equal(wardsLeft(b), 0, "seed " + s); worst = Math.max(worst, moves);
  }
  console.log("    (slowest random game: " + worst + " moves)");
});
console.log(passed + " tests passed");
