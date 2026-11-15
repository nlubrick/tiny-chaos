/**
 * "The Star Vault" rules (no drawing). Seven stars joined by threads. Waking a star flips it and every
 * star tied to it. The orrery turns when all seven are lit.
 */
export const STARS = [[0, -1], [-.9, -.45], [.9, -.45], [0, 0], [-.9, .55], [.9, .55], [0, 1]];   // positions on a unit layout
export const LINKS = [[0, 1], [0, 2], [1, 3], [2, 3], [1, 4], [2, 5], [3, 6], [4, 6], [5, 6]];
export const neighbours = i => LINKS.filter(l => l.includes(i)).map(l => l[0] === i ? l[1] : l[0]);
export function tap(state, i) { state[i] = !state[i]; for (const n of neighbours(i)) state[n] = !state[n]; return state; }
export const allLit = state => state.every(Boolean);
/** The stars to tap (each once, any order) to light everything, fewest first; null if impossible. */
export function solve(state) {
  let best = null;
  for (let m = 0; m < 1 << STARS.length; m++) { const s = state.slice(), set = []; for (let i = 0; i < STARS.length; i++) if (m >> i & 1) { tap(s, i); set.push(i); } if (allLit(s) && (!best || set.length < best.length)) best = set; }
  return best;
}
/** The chapter's starting sky: built by tapping from the solved state, so it can always be finished. */
export const start = () => { const s = STARS.map(() => true); for (const i of [0, 4, 5]) tap(s, i); return s; };
