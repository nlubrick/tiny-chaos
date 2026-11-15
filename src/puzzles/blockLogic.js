/**
 * Sliding-block rules (no drawing). The board is SIZE x SIZE. A block is { id, r, c, len, dir, key }:
 * "H" blocks slide left and right, "V" blocks slide up and down, nothing turns or jumps.
 * The puzzle is solved when the key block's right end reaches the right edge of its row.
 */
export const SIZE = 6;
export function grid(blocks) {
  const g = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  for (const b of blocks) for (let i = 0; i < b.len; i++) g[b.dir === "H" ? b.r : b.r + i][b.dir === "H" ? b.c + i : b.c] = b.id;
  return g;
}
/** How far block `id` can slide: { min, max } in squares (negative = left/up). */
export function range(blocks, id) {
  const g = grid(blocks), b = blocks.find(x => x.id === id); let min = 0, max = 0;
  if (b.dir === "H") { while (b.c + min - 1 >= 0 && g[b.r][b.c + min - 1] === null) min--; while (b.c + b.len + max < SIZE && g[b.r][b.c + b.len + max] === null) max++; }
  else { while (b.r + min - 1 >= 0 && g[b.r + min - 1][b.c] === null) min--; while (b.r + b.len + max < SIZE && g[b.r + b.len + max][b.c] === null) max++; }
  return { min, max };
}
/** Slides a block by `d` squares if the way is clear. Returns true if it moved. */
export function slide(blocks, id, d) {
  const { min, max } = range(blocks, id); if (!d || d < min || d > max) return false;
  const b = blocks.find(x => x.id === id); if (b.dir === "H") b.c += d; else b.r += d; return true;
}
export const solved = blocks => { const k = blocks.find(b => b.key); return k.c + k.len === SIZE; };
/** Fewest moves to solve from here (breadth-first), or -1. `path` receives the moves as [id, d]. */
export function solve(start, path = []) {
  const enc = bs => bs.map(b => b.r * SIZE + b.c).join(","), seen = new Map([[enc(start), null]]); let q = [start.map(b => ({ ...b }))];
  while (q.length) {
    const next = [];
    for (const s of q) {
      if (solved(s)) { let k = enc(s); const out = []; while (seen.get(k)) { const p = seen.get(k); out.unshift(p.m); k = p.from; } path.push(...out); return out.length; }
      for (const b of s) { const { min, max } = range(s, b.id); for (let d = min; d <= max; d++) { if (!d) continue; const t = s.map(x => ({ ...x })); slide(t, b.id, d); const k = enc(t); if (!seen.has(k)) { seen.set(k, { from: enc(s), m: [b.id, d] }); next.push(t); } } }
    }
    q = next;
  }
  return -1;
}
/** The archive aisle: the trolley (key) has to reach the right-hand edge of row 2. */
export const AISLE = () => [
  { id: 0, r: 2, c: 1, len: 2, dir: "H", key: true },
  { id: 1, r: 0, c: 0, len: 2, dir: "H" }, { id: 2, r: 0, c: 5, len: 3, dir: "V" }, { id: 3, r: 1, c: 0, len: 3, dir: "V" },
  { id: 4, r: 1, c: 3, len: 3, dir: "V" }, { id: 5, r: 4, c: 0, len: 2, dir: "V" }, { id: 6, r: 4, c: 4, len: 2, dir: "H" }, { id: 7, r: 5, c: 2, len: 3, dir: "H" }
];
