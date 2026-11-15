/**
 * Match-3 rules with no drawing in them, so they can be tested in Node.
 * A board is { rows, cols, g, w, nextId }: g[r][c] is a piece { id, t, s } (t = kind 0..5, s = null | "hex" | "lineH" | "lineV"),
 * w[r][c] is true where a ward still stands.
 *
 *   three or more in a line  -> cleared
 *   four in a line           -> leaves a line charm that sweeps its whole row or column
 *   four in a 2 x 2 square   -> leaves a Hex Bomb that blasts the 3 x 3 around it
 */
export const KINDS = 6;
/** Where the door's wards sit on the 7 x 7 board: kept off the corners, where matches are hardest to make. */
export const WARD_CELLS = [[1, 1], [1, 3], [1, 5], [2, 2], [2, 4], [3, 1], [3, 3], [3, 5], [4, 3], [5, 1], [5, 3], [5, 5]];
const key = (r, c) => r * 100 + c;

export function makeBoard(rows, cols, rand, wardCells = []) {
  for (let tries = 0; tries < 500; tries++) {
    const b = { rows, cols, g: [], w: [], nextId: 1 };
    for (let r = 0; r < rows; r++) { b.g.push([]); b.w.push([]); for (let c = 0; c < cols; c++) { b.g[r].push({ id: b.nextId++, t: Math.floor(rand() * KINDS), s: null }); b.w[r].push(false); } }
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { let n = 0; while (formsGroupAt(b, r, c) && n++ < 20) b.g[r][c].t = (b.g[r][c].t + 1) % KINDS; }
    if (findGroups(b).cells.size === 0 && findMove(b)) { for (const [r, c] of wardCells) b.w[r][c] = true; return b; }
  }
  throw new Error("could not build a board");
}
function formsGroupAt(b, r, c) {
  const t = b.g[r][c].t, at = (rr, cc) => rr >= 0 && cc >= 0 && rr < b.rows && cc < b.cols && b.g[rr][cc] && b.g[rr][cc].t === t;
  if (at(r, c - 1) && at(r, c - 2)) return true;
  if (at(r - 1, c) && at(r - 2, c)) return true;
  if (at(r - 1, c) && at(r, c - 1) && at(r - 1, c - 1)) return true;
  return false;
}

/** Every line of 3+ and every 2 x 2 square currently on the board. */
export function findGroups(b) {
  const lines = [], squares = [], cells = new Set(), T = (r, c) => { const p = b.g[r][c]; return p && !p.s ? p.t : -1 - r * 100 - c; };
  for (let r = 0; r < b.rows; r++) for (let c = 0; c < b.cols;) {
    let e = c + 1; while (e < b.cols && T(r, e) === T(r, c)) e++;
    if (e - c >= 3) lines.push({ dir: "H", cells: Array.from({ length: e - c }, (_, i) => [r, c + i]) });
    c = e;
  }
  for (let c = 0; c < b.cols; c++) for (let r = 0; r < b.rows;) {
    let e = r + 1; while (e < b.rows && T(e, c) === T(r, c)) e++;
    if (e - r >= 3) lines.push({ dir: "V", cells: Array.from({ length: e - r }, (_, i) => [r + i, c]) });
    r = e;
  }
  for (let r = 0; r < b.rows - 1; r++) for (let c = 0; c < b.cols - 1; c++) {
    const t = T(r, c); if (t >= 0 && T(r, c + 1) === t && T(r + 1, c) === t && T(r + 1, c + 1) === t) squares.push({ cells: [[r, c], [r, c + 1], [r + 1, c], [r + 1, c + 1]] });
  }
  for (const g of lines.concat(squares)) for (const [r, c] of g.cells) cells.add(key(r, c));
  return { lines, squares, cells };
}

function blastCells(b, r, c, s) {
  const out = [];
  if (s === "hex") { for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const rr = r + dr, cc = c + dc; if (rr >= 0 && cc >= 0 && rr < b.rows && cc < b.cols) out.push([rr, cc]); } }
  else if (s === "lineH") for (let cc = 0; cc < b.cols; cc++) out.push([r, cc]);
  else if (s === "lineV") for (let rr = 0; rr < b.rows; rr++) out.push([rr, c]);
  return out;
}

/** Clears `seed` cells (plus anything their charms set off), drops the board, refills it. Returns one step. */
function clearStep(b, seedCells, created, rand) {
  const gone = new Map(), queue = seedCells.slice(), fired = [], keep = new Set(created.map(k => key(k.r, k.c)));
  while (queue.length) {
    const [r, c] = queue.pop(), k = key(r, c); if (gone.has(k) || keep.has(k) || !b.g[r][c]) continue;
    const p = b.g[r][c]; gone.set(k, { id: p.id, r, c });
    if (p.s) { fired.push({ r, c, s: p.s }); for (const cell of blastCells(b, r, c, p.s)) queue.push(cell); }
  }
  const wards = [];
  for (const k of [...gone.keys(), ...keep]) { const r = Math.floor(k / 100), c = k % 100; if (b.w[r][c]) { b.w[r][c] = false; wards.push({ r, c }); } }
  for (const k of created) { b.g[k.r][k.c].s = k.s; k.id = b.g[k.r][k.c].id; }
  for (const v of gone.values()) b.g[v.r][v.c] = null;
  const falls = [], spawns = [];
  for (let c = 0; c < b.cols; c++) {
    let write = b.rows - 1;
    for (let r = b.rows - 1; r >= 0; r--) if (b.g[r][c]) { const p = b.g[r][c]; if (write !== r) { b.g[write][c] = p; b.g[r][c] = null; falls.push({ id: p.id, r: write, c }); } write--; }
    for (let r = write, n = 1; r >= 0; r--, n++) { const p = { id: b.nextId++, t: Math.floor(rand() * KINDS), s: null }; b.g[r][c] = p; spawns.push({ id: p.id, t: p.t, r, c, from: r - write - 1 }); }
  }
  return { cleared: [...gone.values()], created, fired, wards, falls, spawns };
}

/** Resolves every match on the board, cascades included. `prefer` is where a new charm should appear if possible. */
export function resolve(b, rand, prefer = []) {
  const steps = [];
  for (let guard = 0; guard < 60; guard++) {
    const G = findGroups(b); if (!G.cells.size) break;
    const created = [], used = new Set();
    const pick = cells => { const p = prefer.find(q => cells.some(([r, c]) => r === q[0] && c === q[1] && !used.has(key(r, c)))); const [r, c] = p || cells.find(([rr, cc]) => !used.has(key(rr, cc))) || cells[0]; used.add(key(r, c)); return { r, c }; };
    for (const s of G.squares) { if (s.cells.some(([r, c]) => used.has(key(r, c)))) continue; created.push({ ...pick(s.cells), s: "hex" }); for (const [r, c] of s.cells) used.add(key(r, c)); }
    for (const l of G.lines) if (l.cells.length >= 4 && !l.cells.some(([r, c]) => used.has(key(r, c)))) created.push({ ...pick(l.cells), s: l.dir === "H" ? "lineV" : "lineH" });
    steps.push(clearStep(b, [...G.cells].map(k => [Math.floor(k / 100), k % 100]), created, rand));
    prefer = [];
  }
  return steps;
}

/** Tries to swap two neighbouring cells. Returns the list of steps to animate, or null if the swap does nothing. */
export function trySwap(b, a, z, rand) {
  if (Math.abs(a[0] - z[0]) + Math.abs(a[1] - z[1]) !== 1) return null;
  const pa = b.g[a[0]][a[1]], pz = b.g[z[0]][z[1]];
  b.g[a[0]][a[1]] = pz; b.g[z[0]][z[1]] = pa;
  if (pa.s || pz.s) {                                   // moving a charm sets it off
    const seeds = []; if (pa.s) seeds.push(z); if (pz.s) seeds.push(a);
    return [clearStep(b, seeds, [], rand)].concat(resolve(b, rand));
  }
  const steps = resolve(b, rand, [z, a]);
  if (!steps.length) { b.g[a[0]][a[1]] = pa; b.g[z[0]][z[1]] = pz; return null; }
  return steps;
}

/** Every swap that would do something. */
export function findMoves(b) {
  const out = [];
  for (let r = 0; r < b.rows; r++) for (let c = 0; c < b.cols; c++) for (const [dr, dc] of [[0, 1], [1, 0]]) {
    const r2 = r + dr, c2 = c + dc; if (r2 >= b.rows || c2 >= b.cols) continue;
    const p = b.g[r][c], q = b.g[r2][c2];
    if (p.s || q.s) { out.push([[r, c], [r2, c2]]); continue; }
    b.g[r][c] = q; b.g[r2][c2] = p; const ok = findGroups(b).cells.size > 0; b.g[r][c] = p; b.g[r2][c2] = q;
    if (ok) out.push([[r, c], [r2, c2]]);
  }
  return out;
}
/** A swap that would do something, as [[r,c],[r,c]], or null when the board is stuck. */
export function findMove(b) {
  for (let r = 0; r < b.rows; r++) for (let c = 0; c < b.cols; c++) for (const [dr, dc] of [[0, 1], [1, 0]]) {
    const r2 = r + dr, c2 = c + dc; if (r2 >= b.rows || c2 >= b.cols) continue;
    const p = b.g[r][c], q = b.g[r2][c2];
    if (p.s || q.s) return [[r, c], [r2, c2]];
    b.g[r][c] = q; b.g[r2][c2] = p; const ok = findGroups(b).cells.size > 0; b.g[r][c] = p; b.g[r2][c2] = q;
    if (ok) return [[r, c], [r2, c2]];
  }
  return null;
}

/** Rearranges a stuck board into one with a move and no ready-made matches. Pieces keep their ids. */
export function shuffle(b, rand) {
  const all = b.g.flat();
  for (let tries = 0; tries < 300; tries++) {
    for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
    all.forEach((p, i) => { b.g[Math.floor(i / b.cols)][i % b.cols] = p; });
    if (!findGroups(b).cells.size && findMove(b)) return true;
  }
  return false;
}
export const wardsLeft = b => b.w.flat().filter(Boolean).length;
