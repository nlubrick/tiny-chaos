// Run with: node tests/chapter2.test.mjs
import assert from "node:assert/strict";
import { AISLE, solve as solveBlocks, slide, solved, range, grid } from "../src/puzzles/blockLogic.js";
import { fresh, pull } from "../src/puzzles/pinLogic.js";
import { start, tap, allLit, solve as solveStars, STARS } from "../src/puzzles/chainLogic.js";
let passed = 0; const test = (name, fn) => { fn(); passed++; console.log("ok  " + name); };
const run = order => { const s = fresh(); let last; for (const p of order) last = pull(s, p); return last; };

test("blocks: the aisle starts unsolved, with no overlaps, and can be solved", () => {
  const b = AISLE(); assert.equal(solved(b), false); assert.equal(grid(b).flat().filter(x => x !== null).length, b.reduce((n, x) => n + x.len, 0));
  const path = [], n = solveBlocks(b, path); assert.ok(n > 0); console.log("    (fewest moves: " + n + ")");
  for (const [id, d] of path) assert.ok(slide(b, id, d)); assert.ok(solved(b));
});
test("blocks: a block cannot pass through another or leave the board", () => {
  const b = AISLE(); assert.equal(slide(b, 0, 1), false); assert.equal(slide(b, 1, -1), false); assert.deepEqual(range(b, 1), { min: 0, max: 3 });
});
test("pins: water first, then the lower pin, then the channel opens the gate", () => {
  assert.equal(run(["A", "B", "D"]).status, "win"); assert.equal(run(["A", "D", "B"]).status, "win"); assert.equal(run(["D", "A", "B"]).status, "win");
});
test("pins: dropping hot coals burns the rope", () => { assert.equal(run(["B"]).status, "fail"); assert.equal(run(["D", "B"]).status, "fail"); });
test("pins: the stone always jams the float", () => { assert.equal(run(["C"]).status, "fail"); assert.equal(run(["A", "B", "C"]).status, "fail"); });
test("pins: nothing happens after the puzzle has ended, and a pin pulls once", () => { const s = fresh(); pull(s, "A"); assert.deepEqual(pull(s, "A").events, []); pull(s, "C"); assert.deepEqual(pull(s, "B").events, []); });
test("stars: the opening sky is dark in places and solvable in a few taps", () => {
  const s = start(); assert.equal(allLit(s), false); const sol = solveStars(s); assert.ok(sol && sol.length >= 3 && sol.length <= 5); for (const i of sol) tap(s, i); assert.ok(allLit(s));
  console.log("    (fewest taps: " + sol.length + ")");
});
test("stars: however the player taps, the sky can still be finished", () => { const s = start(); let x = 7; for (let n = 0; n < 500; n++) { x = (x * 31 + 11) % 97; tap(s, x % STARS.length); assert.ok(solveStars(s) !== null); } });
console.log(passed + " tests passed");
