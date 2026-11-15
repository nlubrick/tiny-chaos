import { lin, rad } from "./svg.js";

/* Match-3 pieces. Each kind has its own colour AND its own silhouette, on a tile tinted to match,
   so they can be told apart at phone size and without relying on colour alone. 128 x 128 each. */
const tile = (a, b) => `<rect x="4" y="4" width="120" height="120" rx="22" fill="url(#t)" stroke="${b}" stroke-width="4"/><rect x="10" y="9" width="108" height="50" rx="18" fill="#fff" opacity=".07"/>`;
const defs = (bg1, bg2, c1, c2) => lin("t", [[0, bg1], [1, bg2]]) + lin("m", [[0, c1], [1, c2]]) + `<filter id="s" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="4" stdDeviation="2.5" flood-opacity=".6"/></filter>`;
const P = (bg1, bg2, edge, c1, c2, shape) => () => ({ defs: defs(bg1, bg2, c1, c2), body: tile(bg1, edge) + `<g filter="url(#s)">${shape}</g>` });

export const PIECES = {
  // 0 gold key
  pc0: P("#4a3608", "#231803", "#e8b93a", "#fff0a8", "#d99a12",
    `<g transform="rotate(-38 64 64)" fill="url(#m)" stroke="#5a3c00" stroke-width="3" stroke-linejoin="round"><circle cx="34" cy="64" r="21"/><circle cx="34" cy="64" r="8" fill="#231803"/><rect x="52" y="57" width="58" height="14" rx="4"/><path d="M84 71v19h11v-10h7v14h11V71z"/></g>`),
  // 1 blue crescent moon
  pc1: P("#0c2a5c", "#061533", "#58a6ff", "#e4f3ff", "#4a9cff",
    `<path d="M80 18a48 48 0 1 0 28 76a40 40 0 1 1 -28 -76z" fill="url(#m)" stroke="#0a2f66" stroke-width="3" stroke-linejoin="round"/><path d="M96 30l3 8l8 3l-8 3l-3 8l-3 -8l-8 -3l8 -3z" fill="#e4f3ff"/>`),
  // 2 green potion
  pc2: P("#0f4a1e", "#06260e", "#4fe07a", "#d6ffd8", "#24c452",
    `<rect x="52" y="12" width="24" height="12" rx="4" fill="#b98a4a" stroke="#4a2e0c" stroke-width="3"/><path d="M54 24h20v20q28 12 28 40a38 30 0 0 1 -76 0q0 -28 28 -40z" fill="#eafff0" fill-opacity=".28" stroke="#0a3a16" stroke-width="3" stroke-linejoin="round"/><path d="M31 76q33 -12 66 0q4 34 -33 36q-37 -2 -33 -36z" fill="url(#m)"/><circle cx="52" cy="88" r="6" fill="#eafff0" opacity=".8"/><circle cx="74" cy="96" r="4" fill="#eafff0" opacity=".7"/>`),
  // 3 red wax seal
  pc3: P("#5c0f14", "#2e0609", "#ff5a5a", "#ff9a8a", "#d81e2c",
    `<path d="M64 12q12 -5 20 6q14 -1 16 13q12 7 7 20q7 12 -3 21q1 14 -13 16q-6 12 -19 8q-11 9 -22 0q-13 4 -19 -8q-14 -2 -13 -16q-10 -9 -3 -21q-5 -13 7 -20q2 -14 16 -13q8 -11 20 -6z" fill="url(#m)" stroke="#5a0a10" stroke-width="3"/><circle cx="62" cy="64" r="27" fill="none" stroke="#7a0e16" stroke-width="4"/><path d="M62 44l5.5 13h13.5l-11 9l4.5 14l-12.5 -9l-12.5 9l4.5 -14l-11 -9h13.5z" fill="#7a0e16"/>`),
  // 4 white feather
  pc4: P("#3a3f4c", "#1a1d26", "#e8ecf4", "#ffffff", "#b9c2d4",
    `<path d="M104 14q10 44 -22 72q-18 16 -44 14q-6 -26 12 -48q22 -28 54 -38z" fill="url(#m)" stroke="#4a5468" stroke-width="3" stroke-linejoin="round"/><path d="M100 20L22 112" stroke="#4a5468" stroke-width="4" stroke-linecap="round"/><path d="M84 40l-22 4M72 56l-24 4M60 72l-20 2M90 46l2 -18M76 64l8 -16" stroke="#7a859c" stroke-width="2.5" stroke-linecap="round"/>`),
  // 5 purple crystal
  pc5: P("#3c1466", "#1c0833", "#c58aff", "#f0d8ff", "#9a3cf0",
    `<path d="M64 10l34 34l-34 74l-34 -74z" fill="url(#m)" stroke="#3a0e6a" stroke-width="3" stroke-linejoin="round"/><path d="M30 44h68M64 10l-14 34l14 74l14 -74z" fill="none" stroke="#3a0e6a" stroke-width="2.5" stroke-linejoin="round"/><path d="M64 10l-14 34h-20z" fill="#fff" opacity=".35"/>`),
  // Hex Bomb
  "pc-hex": () => ({ defs: rad("t", [[0, "#3a2a00"], [1, "#0c0800"]]) + rad("m", [[0, "#5a5a66"], [.6, "#1c1c24"], [1, "#000"]], .38, .34, .7) + rad("g", [[0, "#ffe27a", .9], [1, "#ff8a00", 0]]),
    body: `<rect x="4" y="4" width="120" height="120" rx="22" fill="url(#t)" stroke="#ffb020" stroke-width="5"/><circle cx="64" cy="64" r="56" fill="url(#g)" opacity=".5"/><circle cx="60" cy="72" r="38" fill="url(#m)" stroke="#000" stroke-width="3"/><rect x="74" y="26" width="18" height="16" rx="3" transform="rotate(35 83 34)" fill="#3a3a44" stroke="#000" stroke-width="2"/><path d="M90 28q10 -14 20 -8" stroke="#c8a060" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M112 8l3 9l9 3l-9 3l-3 9l-3 -9l-9 -3l9 -3z" fill="#fff2a0" stroke="#ff8a00" stroke-width="1.5"/><path d="M60 46l22.5 39h-45zM60 98l-22.5 -39h45z" fill="none" stroke="#ffb020" stroke-width="4" stroke-linejoin="round"/><circle cx="46" cy="56" r="7" fill="#fff" opacity=".25"/>` })
};
