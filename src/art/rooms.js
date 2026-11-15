import { lin, rad, rng } from "./svg.js";

/* Room backdrops. Each room is one 2200 x 720 painting built from the furniture functions below.
   Windows are real holes, so the storm layer behind the wall shows through and drifts as the camera moves. */
export const RW = 2200, RH = 720, WALL_B = 610, WAINS = 452;

const DEFS = (pal) =>
  lin("wall", [[0, pal.wallTop], [1, pal.wallBot]]) + lin("wains", [[0, "#4a2418"], [.5, "#34170f"], [1, "#1f0d08"]]) +
  lin("floor", [[0, "#2a160e"], [1, "#0d0705"]]) + lin("wood", [[0, "#6a3a22"], [1, "#2c140c"]]) + lin("woodH", [[0, "#2c140c"], [.5, "#6a3a22"], [1, "#2c140c"]], 1, 0) +
  lin("gold", [[0, "#f0d08a"], [.5, "#c2933f"], [1, "#6e4f1a"]]) + lin("stone", [[0, "#6f6a70"], [1, "#35323a"]]) + lin("stoneD", [[0, "#4a464e"], [1, "#232128"]]) +
  lin("moonshaft", [[0, "#9db8ff", .16], [1, "#9db8ff", 0]]) + rad("fireglow", [[0, "#ffb050", .5], [.5, "#ff7a28", .16], [1, "#ff7a28", 0]]) +
  rad("candle", [[0, "#ffd890", .3], [1, "#ffd890", 0]]) + rad("shade", [[0, "#000", 0], [.7, "#000", .25], [1, "#000", .62]], .5, .45, .75) +
  lin("glass", [[0, "#0a1230", .25], [1, "#0a1230", .05]]) + lin("cloth", [[0, pal.cloth], [1, pal.clothD]]) +
  `<pattern id="dam" width="84" height="120" patternUnits="userSpaceOnUse"><g fill="${pal.motif}" opacity=".13"><path d="M42 8c12 14 18 26 0 46c-18-20-12-32 0-46zM42 60c7 9 9 15 0 26c-9-11-7-17 0-26zM0 68c12 14 18 26 0 46M84 68c-12 14-18 26 0 46M20 40q8 6 4 16q-10-4-4-16zM64 40q-8 6-4 16q10-4 4-16z"/></g><path d="M0 0v120" stroke="${pal.motif}" stroke-width="1" opacity=".07"/></pattern>` +
  `<filter id="blur6"><feGaussianBlur stdDeviation="6"/></filter><filter id="blur2"><feGaussianBlur stdDeviation="2"/></filter>`;

const winPath = (x, y, w, h) => `M${x} ${y + 70} Q${x} ${y} ${x + w / 2} ${y - 12} Q${x + w} ${y} ${x + w} ${y + 70} V${y + h} H${x}Z`;
function windowFrame(x, y = 96, w = 190, h = 330) {
  return `<path d="${winPath(x, y, w, h)}" fill="url(#glass)"/>
    <path d="M${x + w / 2} ${y - 10} V${y + h} M${x} ${y + 70} H${x + w} M${x} ${y + 190} H${x + w}" stroke="#1c0d08" stroke-width="7"/>
    <path d="M${x + w / 2} ${y - 10} V${y + h} M${x} ${y + 70} H${x + w} M${x} ${y + 190} H${x + w}" stroke="#5a3220" stroke-width="2"/>
    <path d="${winPath(x, y, w, h)}" fill="none" stroke="#1c0d08" stroke-width="16"/><path d="${winPath(x, y, w, h)}" fill="none" stroke="url(#wood)" stroke-width="10"/>
    <rect x="${x - 22}" y="${y + h}" width="${w + 44}" height="14" rx="3" fill="url(#wood)" stroke="#1c0d08" stroke-width="2"/>
    <path d="M${x - 34} ${y - 34} H${x + w + 34}" stroke="url(#gold)" stroke-width="7" stroke-linecap="round"/><circle cx="${x - 36}" cy="${y - 34}" r="7" fill="url(#gold)"/><circle cx="${x + w + 36}" cy="${y - 34}" r="7" fill="url(#gold)"/>
    <path d="M${x - 8} ${y + h + 14} L${x + w + 8} ${y + h + 14} L${x + w + 250} ${RH} L${x + 70} ${RH}Z" fill="url(#moonshaft)"/>`;
}
function shell(pal, windows, extra = "") {
  const holes = windows.map(w => `<path d="${winPath(w, 96, 190, 330)}" fill="#000"/>`).join("");
  let boards = "";
  for (let i = 0; i < 5; i++) { const y = WALL_B + 8 + i * i * 5.2 + i * 9; boards += `<path d="M0 ${y}H${RW}" stroke="#000" stroke-width="${1 + i * .5}" opacity=".5"/>`; }
  const r = rng(pal.seed);
  for (let i = 0; i < 46; i++) { const x = r() * RW, row = Math.floor(r() * 4), y0 = WALL_B + 8 + row * row * 5.2 + row * 9, y1 = WALL_B + 8 + (row + 1) * (row + 1) * 5.2 + (row + 1) * 9; boards += `<path d="M${x} ${y0}V${y1}" stroke="#000" stroke-width="1.4" opacity=".45"/>`; }
  let panels = "";
  for (let x = 14; x < RW; x += 170) panels += `<rect x="${x}" y="${WAINS + 26}" width="142" height="${WALL_B - WAINS - 52}" rx="3" fill="none" stroke="#150806" stroke-width="3"/><rect x="${x + 4}" y="${WAINS + 30}" width="134" height="${WALL_B - WAINS - 60}" rx="2" fill="#000" opacity=".12"/><path d="M${x + 3} ${WALL_B - 28}V${WAINS + 29}H${x + 139}" stroke="#7a4a30" stroke-width="1.2" fill="none" opacity=".6"/>`;
  return `<mask id="holes"><rect width="${RW}" height="${RH}" fill="#fff"/>${holes}</mask>
  <g mask="url(#holes)">
    <rect width="${RW}" height="${WALL_B}" fill="url(#wall)"/><rect width="${RW}" height="${WAINS}" fill="url(#dam)"/>
    <rect y="0" width="${RW}" height="44" fill="#1a0c08"/><path d="M0 44H${RW}" stroke="url(#gold)" stroke-width="3" opacity=".55"/><path d="M0 54H${RW}" stroke="#000" stroke-width="6" opacity=".25"/>
    <rect y="${WAINS}" width="${RW}" height="${WALL_B - WAINS}" fill="url(#wains)"/><rect y="${WAINS}" width="${RW}" height="12" fill="#5a2e1c"/><path d="M0 ${WAINS + 12}H${RW}" stroke="#120604" stroke-width="3"/>${panels}
    <rect y="${WALL_B - 18}" width="${RW}" height="18" fill="#1c0c07"/><path d="M0 ${WALL_B - 18}H${RW}" stroke="#6a3a22" stroke-width="1.5" opacity=".7"/>
    ${extra}
  </g>
  <rect y="${WALL_B}" width="${RW}" height="${RH - WALL_B}" fill="url(#floor)"/>${boards}
  <rect y="${WALL_B}" width="${RW}" height="16" fill="#000" opacity=".4"/>`;
}
function bookshelf(x, w, seed, top = 120) {
  const r = rng(seed), cols = ["#5a1e2a", "#243a5a", "#2f4a34", "#6a4a1c", "#3a2440", "#1e2a34", "#703a22", "#4a4436"];
  let s = `<rect x="${x - 12}" y="${top - 18}" width="${w + 24}" height="${WALL_B - top + 18}" fill="#1a0b07"/><rect x="${x - 18}" y="${top - 30}" width="${w + 36}" height="20" rx="3" fill="url(#wood)" stroke="#120604" stroke-width="2"/><rect x="${x}" y="${top}" width="${w}" height="${WALL_B - top - 14}" fill="#0c0504"/>`;
  for (let y = top; y < WALL_B - 90; y += 82) {
    let bx = x + 5;
    while (bx < x + w - 14) {
      const bw = 11 + r() * 15, bh = 50 + r() * 22, c = cols[Math.floor(r() * cols.length)];
      if (r() < .08) { bx += bw + 6; continue; }
      const lean = r() < .07 ? 7 : 0;
      s += `<g transform="rotate(${lean} ${bx} ${y + 72})"><rect x="${bx}" y="${y + 72 - bh}" width="${bw}" height="${bh}" rx="1.5" fill="${c}" stroke="#000" stroke-opacity=".5"/><rect x="${bx + 1.5}" y="${y + 72 - bh}" width="2" height="${bh}" fill="#fff" opacity=".1"/>${r() < .6 ? `<rect x="${bx + 2}" y="${y + 80 - bh}" width="${bw - 4}" height="3" fill="#d9b46a" opacity=".6"/><rect x="${bx + 2}" y="${y + 60}" width="${bw - 4}" height="2" fill="#d9b46a" opacity=".45"/>` : ""}</g>`;
      bx += bw + 1 + lean;
    }
    s += `<rect x="${x - 4}" y="${y + 72}" width="${w + 8}" height="10" fill="url(#wood)" stroke="#120604"/><rect x="${x}" y="${y}" width="${w}" height="16" fill="#000" opacity=".5"/>`;
  }
  return s + `<rect x="${x - 12}" y="${top - 12}" width="12" height="${WALL_B - top}" fill="url(#woodH)"/><rect x="${x + w}" y="${top - 12}" width="12" height="${WALL_B - top}" fill="url(#woodH)"/><rect x="${x - 16}" y="${WALL_B - 30}" width="${w + 32}" height="30" fill="url(#wood)" stroke="#120604" stroke-width="2"/>`;
}
const sconce = (x, y) => `<circle cx="${x}" cy="${y - 30}" r="120" fill="url(#candle)"/><path d="M${x} ${y + 34} q0 -22 -18 -22 M${x} ${y + 34} q0 -22 18 -22" stroke="url(#gold)" stroke-width="5" fill="none"/><ellipse cx="${x}" cy="${y + 38}" rx="10" ry="14" fill="url(#gold)" stroke="#3a2a0c"/><rect x="${x - 24}" y="${y - 8}" width="12" height="22" rx="2" fill="#efe6d0"/><rect x="${x + 12}" y="${y - 8}" width="12" height="22" rx="2" fill="#efe6d0"/><path d="M${x - 28} ${y + 14}h20M${x + 8} ${y + 14}h20" stroke="url(#gold)" stroke-width="4" stroke-linecap="round"/>`;
function portrait(x, y, w, h, seed, blank) {
  const r = rng(seed), bg = ["#2a1c1a", "#1c2430", "#2a2418", "#241a2a"][Math.floor(r() * 4)], coat = ["#3a1420", "#1a2a3a", "#24341f", "#3a2f1a", "#1a1a22"][Math.floor(r() * 5)], cx = x + w / 2, hr = w * .15;
  const sitter = blank ? `<path d="M${x + 14} ${y + 14}L${x + w - 14} ${y + h - 14}M${x + w - 14} ${y + 14}L${x + 14} ${y + h - 14}" stroke="#000" opacity=".25" stroke-width="2"/><path d="M${x + w * .3} ${y + h * .25} l${w * .14} ${h * .5} l${w * .1} -${h * .2} l${w * .16} ${h * .24}" stroke="#0a0606" stroke-width="5" fill="none" opacity=".7"/>`
    : `<path d="M${cx - w * .36} ${y + h - 12} Q${cx - w * .34} ${y + h * .56} ${cx} ${y + h * .52} Q${cx + w * .34} ${y + h * .56} ${cx + w * .36} ${y + h - 12}Z" fill="${coat}"/><path d="M${cx - hr * .6} ${y + h * .5} l${hr * .6} ${h * .1} l${hr * .6} -${h * .1}z" fill="#d8d0c0" opacity=".85"/><ellipse cx="${cx}" cy="${y + h * .36}" rx="${hr}" ry="${hr * 1.22}" fill="#c79a78"/><path d="M${cx - hr * 1.1} ${y + h * .36} Q${cx - hr * 1.1} ${y + h * .36 - hr * 1.7} ${cx} ${y + h * .36 - hr * 1.6} Q${cx + hr * 1.1} ${y + h * .36 - hr * 1.7} ${cx + hr * 1.1} ${y + h * .36} Q${cx} ${y + h * .36 - hr * 1.1} ${cx - hr * 1.1} ${y + h * .36}Z" fill="${["#2a1a12", "#8a8478", "#4a2a16", "#161216"][Math.floor(r() * 4)]}"/><path d="M${cx - hr * .5} ${y + h * .35}h${hr * .3}M${cx + hr * .2} ${y + h * .35}h${hr * .3}" stroke="#2a1a12" stroke-width="2"/><rect x="${x + 10}" y="${y + 10}" width="${w - 20}" height="${h - 20}" fill="url(#shade)"/>`;
  return `<rect x="${x - 4}" y="${y + 6}" width="${w + 8}" height="${h + 8}" fill="#000" opacity=".4" filter="url(#blur6)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="url(#gold)" stroke="#3a2a0c" stroke-width="2"/><rect x="${x + 10}" y="${y + 10}" width="${w - 20}" height="${h - 20}" fill="${bg}" stroke="#3a2a0c" stroke-width="2"/>${sitter}<rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 10}" rx="2" fill="none" stroke="#fff2c0" stroke-width="1" opacity=".35"/>`;
}
const rug = (x, w, c1, c2) => `<path d="M${x + 40} ${WALL_B + 22}H${x + w - 40}L${x + w} ${RH - 18}H${x}Z" fill="${c1}" stroke="#d9b46a" stroke-opacity=".5" stroke-width="2"/><path d="M${x + 62} ${WALL_B + 32}H${x + w - 62}L${x + w - 34} ${RH - 30}H${x + 34}Z" fill="none" stroke="${c2}" stroke-width="6" opacity=".8"/><path d="M${x + 100} ${WALL_B + 46}H${x + w - 100}L${x + w - 86} ${RH - 44}H${x + 86}Z" fill="${c2}" opacity=".28"/>`;
const doorway = (x, label = true) => `<rect x="${x - 96}" y="196" width="192" height="${WALL_B - 196}" fill="#1a0b07"/><rect x="${x - 110}" y="176" width="220" height="24" rx="4" fill="url(#wood)" stroke="#120604" stroke-width="2"/><rect x="${x - 104}" y="196" width="16" height="${WALL_B - 196}" fill="url(#woodH)"/><rect x="${x + 88}" y="196" width="16" height="${WALL_B - 196}" fill="url(#woodH)"/>`;
const arch = (x) => `<path d="M${x - 110} ${WALL_B} V260 Q${x - 110} 150 ${x} 150 Q${x + 110} 150 ${x + 110} 260 V${WALL_B}Z" fill="#050308"/><path d="M${x - 70} ${WALL_B} V300 Q${x - 70} 220 ${x} 220 Q${x + 70} 220 ${x + 70} 300 V${WALL_B}Z" fill="#0d0a18"/><path d="M${x - 110} ${WALL_B} V260 Q${x - 110} 150 ${x} 150 Q${x + 110} 150 ${x + 110} 260 V${WALL_B}" fill="none" stroke="#120604" stroke-width="24"/><path d="M${x - 110} ${WALL_B} V260 Q${x - 110} 150 ${x} 150 Q${x + 110} 150 ${x + 110} 260 V${WALL_B}" fill="none" stroke="url(#wood)" stroke-width="16"/><path d="M${x - 14} 142 h28 l-6 30 h-16z" fill="url(#gold)" stroke="#3a2a0c"/>`;

/* ---------------- The four rooms of Chapter One ---------------- */
function library() {
  const pal = { wallTop: "#3a1420", wallBot: "#24101a", motif: "#e0a070", cloth: "#6a1f2c", clothD: "#2c0c14", seed: 11 };
  const F = 400;   // fireplace centre
  const fire = `
    <rect x="${F - 250}" y="44" width="640" height="${WALL_B - 44}" fill="url(#stoneD)"/><path d="M${F - 250} 44V${WALL_B}M${F + 390} 44V${WALL_B}" stroke="#000" stroke-width="5" opacity=".5"/>
    ${[110, 180, 250, 320, 390, 460, 530].map((y, i) => `<path d="M${F - 250} ${y}H${F + 390}" stroke="#000" opacity=".28" stroke-width="2"/>` + [0, 1, 2, 3, 4].map(k => `<path d="M${F - 250 + k * 150 + (i % 2) * 75} ${y}v70" stroke="#000" opacity=".22" stroke-width="2"/>`).join("")).join("")}
    ${portrait(F - 92, 84, 184, 176, 7)}
    <rect x="${F - 196}" y="282" width="392" height="26" rx="4" fill="url(#wood)" stroke="#120604" stroke-width="2.5"/><rect x="${F - 178}" y="308" width="356" height="14" fill="#2c140c" stroke="#120604" stroke-width="2"/>
    <rect x="${F - 170}" y="322" width="340" height="${WALL_B - 322}" fill="url(#stone)" stroke="#1a181e" stroke-width="3"/>
    <path d="M${F - 170} 380H${F + 170}M${F - 170} 450H${F - 96}M${F + 96} 450H${F + 170}M${F - 170} 530H${F - 96}M${F + 96} 530H${F + 170}M${F - 60} 322v58M${F + 60} 322v58M${F} 322v40" stroke="#1a181e" stroke-width="2" opacity=".7"/>
    <path d="M${F - 96} ${WALL_B} V450 Q${F - 96} 386 ${F} 386 Q${F + 96} 386 ${F + 96} 450 V${WALL_B}Z" fill="#08050a" stroke="#1a181e" stroke-width="4"/>
    <ellipse cx="${F}" cy="${WALL_B - 30}" rx="150" ry="120" fill="url(#fireglow)"/>
    <path d="M${F - 70} ${WALL_B - 12} l40 -16 l50 6 l48 -12 l-6 22z" fill="#1c0f0a" stroke="#000"/><path d="M${F - 56} ${WALL_B - 26} l92 -10" stroke="#3a1c10" stroke-width="12" stroke-linecap="round"/><path d="M${F - 40} ${WALL_B - 16} l84 4" stroke="#2c140c" stroke-width="13" stroke-linecap="round"/>
    <path d="M${F - 80} ${WALL_B} v-34 M${F + 80} ${WALL_B} v-34 M${F - 80} ${WALL_B - 30} h160" stroke="#0c0a0c" stroke-width="5"/>
    <rect x="${F - 146}" y="264" width="12" height="20" fill="#efe6d0"/><rect x="${F + 134}" y="264" width="12" height="20" fill="#efe6d0"/><path d="M${F - 152} 284h24M${F + 128} 284h24" stroke="url(#gold)" stroke-width="5"/>
    <circle cx="${F - 140}" cy="246" r="80" fill="url(#candle)"/><circle cx="${F + 140}" cy="246" r="80" fill="url(#candle)"/>
    <!-- the hidden way: a black gap normally covered by the stone panel sprite -->
    <rect x="${F + 196}" y="340" width="160" height="${WALL_B - 340}" fill="#040308"/><path d="M${F + 196} ${WALL_B} v-60 h40 v-50 h44 v-50 h76 V${WALL_B}Z" fill="#0c0c1e"/><path d="M${F + 236} ${WALL_B - 60}h120M${F + 280} ${WALL_B - 110}h76" stroke="#2a3060" stroke-width="2"/><ellipse cx="${F + 320}" cy="430" rx="60" ry="80" fill="#5a7ad0" opacity=".14" filter="url(#blur6)"/>
    <path d="M${F + 190} 332 H${F + 362} V${WALL_B} " fill="none" stroke="#1a181e" stroke-width="6"/>
    <rect x="${F - 220}" y="${WALL_B - 6}" width="600" height="16" fill="#3a363e" stroke="#1a181e" stroke-width="2"/>`;
  const desk = 1640;
  const furniture = `
    ${bookshelf(820, 330, 3)}
    ${sconce(1250, 250)} ${sconce(1790, 250)}
    <!-- wing chair by the fire -->
    <g transform="translate(790 0)"><path d="M-4 ${WALL_B + 30} v-150 q0 -70 50 -78 q52 -6 62 46 l6 96 h44 q16 0 16 18 v68z" fill="url(#cloth)" stroke="#16060a" stroke-width="3"/><path d="M40 ${WALL_B - 60} q46 -14 80 4" stroke="#16060a" stroke-width="2" fill="none"/><circle cx="46" cy="430" r="3" fill="#d9b46a"/><circle cx="74" cy="420" r="3" fill="#d9b46a"/><circle cx="60" cy="470" r="3" fill="#d9b46a"/><path d="M4 ${WALL_B + 30}v14M166 ${WALL_B + 30}v14" stroke="#1c0c07" stroke-width="9" stroke-linecap="round"/></g>
    <!-- the librarian's desk -->
    <g transform="translate(${desk} 0)">
      <rect x="-150" y="474" width="300" height="18" rx="4" fill="url(#wood)" stroke="#120604" stroke-width="2.5"/><rect x="-138" y="492" width="92" height="${WALL_B + 34 - 492}" fill="url(#wains)" stroke="#120604" stroke-width="2.5"/><rect x="46" y="492" width="92" height="${WALL_B + 34 - 492}" fill="url(#wains)" stroke="#120604" stroke-width="2.5"/>
      <rect x="-128" y="504" width="72" height="36" fill="none" stroke="#120604" stroke-width="2"/><rect x="-128" y="548" width="72" height="36" fill="none" stroke="#120604" stroke-width="2"/><rect x="56" y="504" width="72" height="36" fill="none" stroke="#120604" stroke-width="2"/><rect x="56" y="548" width="72" height="36" fill="none" stroke="#120604" stroke-width="2"/>
      <circle cx="-92" cy="522" r="4" fill="url(#gold)"/><circle cx="-92" cy="566" r="4" fill="url(#gold)"/><circle cx="92" cy="522" r="4" fill="url(#gold)"/><circle cx="92" cy="566" r="4" fill="url(#gold)"/><rect x="-46" y="492" width="92" height="22" fill="#2c140c" stroke="#120604" stroke-width="2"/>
      <circle cx="-86" cy="410" r="100" fill="url(#candle)"/><path d="M-100 474 v-34 h28 v34" fill="url(#gold)" stroke="#3a2a0c"/><path d="M-118 440 q32 -52 64 0z" fill="#2f5a40" stroke="#12261a" stroke-width="2"/><path d="M-112 438 q26 -40 52 0" fill="#ffe9a0" opacity=".3"/>
      <rect x="-30" y="462" width="70" height="12" rx="2" fill="#5a1e2a" stroke="#16060a"/><rect x="-22" y="452" width="60" height="10" rx="2" fill="#243a5a" stroke="#0a1220"/><path d="M60 474 l8 -30 l34 4 l-4 26z" fill="#e8dcc0" stroke="#8a7a5a"/><path d="M112 474 v-38 q8 -12 16 0 v38z" fill="#1a1620" stroke="#000"/><path d="M120 436 q14 -40 4 -64" stroke="#3a2f45" stroke-width="3" fill="none"/>
    </g>
    <path d="M${F + 20} ${WALL_B + 38} q16 -8 30 2 q-10 10 -30 -2z M${F + 90} ${WALL_B + 56} q16 -8 30 2 q-10 10 -30 -2z M${F + 170} ${WALL_B + 40} q16 -8 30 2 q-10 10 -30 -2z M${F + 250} ${WALL_B + 60} q16 -8 30 2 q-10 10 -30 -2z" fill="#4a3420" opacity=".75"/>
    ${rug(990, 590, "#3a121c", "#b8863a")}`;
  const body = shell(pal, [1340], fire) + windowFrame(1340) + doorway(2040) + furniture + `<ellipse cx="${F}" cy="${WALL_B + 40}" rx="420" ry="90" fill="url(#fireglow)" opacity=".7"/>`;
  return { body, defs: DEFS(pal) };
}

function hall() {
  const pal = { wallTop: "#18203c", wallBot: "#0e1226", motif: "#d9b46a", cloth: "#1c2c4a", clothD: "#0a1020", seed: 23 };
  const D = 760;
  const extra = `
    <!-- the sealed front door -->
    <path d="M${D - 170} ${WALL_B} V240 Q${D - 170} 110 ${D} 110 Q${D + 170} 110 ${D + 170} 240 V${WALL_B}Z" fill="#120604"/>
    <path d="M${D - 150} ${WALL_B} V244 Q${D - 150} 132 ${D} 132 Q${D + 150} 132 ${D + 150} 244 V${WALL_B}Z" fill="url(#wood)" stroke="#120604" stroke-width="3"/>
    <path d="M${D} 132V${WALL_B}" stroke="#120604" stroke-width="5"/>
    ${[-1, 1].map(s => `<rect x="${D + (s < 0 ? -128 : 22)}" y="270" width="106" height="130" rx="4" fill="none" stroke="#1c0c07" stroke-width="4"/><rect x="${D + (s < 0 ? -128 : 22)}" y="424" width="106" height="150" rx="4" fill="none" stroke="#1c0c07" stroke-width="4"/><path d="M${D + s * 148} 300h${-s * 34}M${D + s * 148} 520h${-s * 34}" stroke="#0c0a0c" stroke-width="9" stroke-linecap="round"/>`).join("")}
    <path d="M${D - 120} 232 Q${D} 150 ${D + 120} 232Z" fill="#0c1230" stroke="#120604" stroke-width="4"/><path d="M${D} 162V232M${D - 60} 190L${D - 40} 232M${D + 60} 190L${D + 40} 232" stroke="#120604" stroke-width="4"/>
    <circle cx="${D - 22}" cy="420" r="8" fill="url(#gold)" stroke="#3a2a0c"/><circle cx="${D + 22}" cy="420" r="8" fill="url(#gold)" stroke="#3a2a0c"/>
    <path d="M${D - 44} 356 q44 -14 88 0 l-2 14 q-42 -12 -84 0z" fill="#d8ccb0" stroke="#8a7a5a"/>
    <path d="M${D - 20} 348 q6 -12 20 -10 q16 -4 22 10 q10 10 0 22 q-6 12 -22 10 q-14 4 -22 -10 q-8 -10 2 -22z" fill="#9a1c28" stroke="#4a0a12" stroke-width="2"/><circle cx="${D + 1}" cy="362" r="11" fill="#b82a36" stroke="#6a0f1a"/><path d="M${D - 5} 362 l4 5 l8 -10" stroke="#5a0a14" stroke-width="2.5" fill="none"/>
    ${portrait(1050, 150, 130, 170, 31)}
    ${sconce(1250, 250)}
    <!-- hall table and mirror -->
    <g transform="translate(430 0)"><rect x="-90" y="150" width="180" height="230" rx="90" fill="url(#gold)" stroke="#3a2a0c" stroke-width="2"/><rect x="-76" y="164" width="152" height="202" rx="76" fill="#1a2440"/><path d="M-50 200 q30 -30 70 -20" stroke="#8fa8e0" stroke-width="4" fill="none" opacity=".35"/>
      <rect x="-110" y="480" width="220" height="14" rx="3" fill="url(#wood)" stroke="#120604" stroke-width="2"/><path d="M-96 494 q8 60 -6 ${WALL_B + 26 - 494}M96 494 q-8 60 6 ${WALL_B + 26 - 494}" stroke="#2c140c" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-30 480 q4 -40 30 -44 q26 4 30 44z" fill="#243a5a" stroke="#0a1220" stroke-width="2"/><path d="M0 436 q-24 -40 -6 -70 M0 436 q20 -30 12 -64 M0 436 q-4 -40 -30 -50" stroke="#2f5a40" stroke-width="4" fill="none"/></g>
    <!-- grandfather clock case: face, hands and pendulum are separate moving sprites -->
    <g transform="translate(1780 0)"><rect x="-74" y="${WALL_B - 2}" width="148" height="22" fill="#1c0c07" stroke="#120604" stroke-width="2"/><rect x="-62" y="330" width="124" height="${WALL_B - 330}" fill="url(#wood)" stroke="#120604" stroke-width="3"/><rect x="-44" y="350" width="88" height="200" rx="6" fill="#0a0608" stroke="#120604" stroke-width="3"/><rect x="-44" y="350" width="88" height="200" rx="6" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity=".7"/>
      <rect x="-78" y="150" width="156" height="184" rx="6" fill="url(#wood)" stroke="#120604" stroke-width="3"/><path d="M-84 150 Q0 80 84 150Z" fill="url(#wood)" stroke="#120604" stroke-width="3"/><circle cx="0" cy="118" r="10" fill="url(#gold)" stroke="#3a2a0c"/><rect x="-86" y="326" width="172" height="12" rx="3" fill="#2c140c" stroke="#120604" stroke-width="2"/><rect x="-86" y="146" width="172" height="10" rx="3" fill="#2c140c" stroke="#120604" stroke-width="2"/>
      <circle cx="0" cy="240" r="66" fill="url(#gold)" stroke="#3a2a0c" stroke-width="2"/></g>
    <!-- coat stand -->
    <g transform="translate(1320 0)"><path d="M0 ${WALL_B + 22}V190" stroke="#2c140c" stroke-width="9" stroke-linecap="round"/><path d="M-34 ${WALL_B + 26}Q0 ${WALL_B - 10} 34 ${WALL_B + 26}" stroke="#2c140c" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M0 214 q-30 -4 -34 -26 M0 214 q30 -4 34 -26" stroke="#2c140c" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-36 190 q-26 40 -22 190 q20 12 44 4 q-4 -140 -8 -180z" fill="#3a3324" stroke="#16130c" stroke-width="2"/><path d="M24 186 q22 -16 34 4 q-10 12 -34 -4z" fill="#241a12" stroke="#000"/></g>
    ${arch(2040)}`;
  const mud = [0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${880 + i * 92} ${WALL_B + 40 + (i % 2) * 22} q22 -10 40 2 q-14 14 -40 -2z" fill="#4a3420" opacity="${.8 - i * .07}"/>`).join("");
  const body = shell(pal, [1450], extra) + windowFrame(1450) + doorway(180) + mud + rug(980, 560, "#141c38", "#b8863a");
  return { body, defs: DEFS(pal) };
}

function gallery() {
  const pal = { wallTop: "#2c1420", wallBot: "#190c16", motif: "#d9b46a", cloth: "#5a1e2a", clothD: "#22090f", seed: 41 };
  const extra = `${arch(180)}
    ${portrait(420, 130, 170, 230, 51)} ${portrait(660, 170, 120, 160, 53)} ${portrait(1040, 120, 200, 260, 59)}
    ${portrait(1730, 130, 170, 230, 67, true)}
    ${sconce(880, 260)}
    <rect x="1752" y="372" width="126" height="22" rx="3" fill="url(#gold)" stroke="#3a2a0c"/>
    <g transform="translate(1080 0)"><rect x="-150" y="540" width="300" height="20" rx="6" fill="url(#cloth)" stroke="#16060a" stroke-width="2"/><rect x="-156" y="558" width="312" height="14" rx="4" fill="url(#wood)" stroke="#120604" stroke-width="2"/><path d="M-136 572v${WALL_B + 30 - 572}M136 572v${WALL_B + 30 - 572}" stroke="#2c140c" stroke-width="10" stroke-linecap="round"/></g>
    ${doorway(2040)}`;
  const body = shell(pal, [1420], extra) + windowFrame(1420) + rug(560, 1100, "#2c0f18", "#8a6a2c");
  return { body, defs: DEFS(pal) };
}

function attic() {
  const pal = { wallTop: "#231a16", wallBot: "#120d0c", motif: "#3a2a20", cloth: "#243a5a", clothD: "#0a1220", seed: 71 };
  let planks = "";
  for (let x = 0; x < RW; x += 74) planks += `<path d="M${x} 0V${WALL_B}" stroke="#000" stroke-width="3" opacity=".4"/><path d="M${x + 3} 0V${WALL_B}" stroke="#5a4030" stroke-width="1" opacity=".3"/>`;
  let beams = "";
  for (let x = -200; x < RW; x += 440) beams += `<path d="M${x} 300 L${x + 330} 0 h70 L${x + 70} 300z" fill="#1a0f0a" stroke="#000" stroke-width="2"/><path d="M${x + 440} 300 L${x + 110} 0 h-70 L${x + 370} 300z" fill="#20130c" stroke="#000" stroke-width="2" opacity=".85"/>`;
  const extra = `<rect width="${RW}" height="${WALL_B}" fill="#1c1410"/>${planks}${beams}<rect y="0" width="${RW}" height="70" fill="#000" opacity=".5"/>
    ${doorway(180)}
    <!-- trunks and covered furniture -->
    <g transform="translate(560 0)"><rect x="-110" y="510" width="220" height="${WALL_B + 30 - 510}" rx="8" fill="url(#wood)" stroke="#120604" stroke-width="3"/><path d="M-110 546h220" stroke="#120604" stroke-width="3"/><path d="M-70 510v130M70 510v130" stroke="url(#gold)" stroke-width="10" opacity=".8"/><rect x="-14" y="536" width="28" height="26" rx="4" fill="url(#gold)" stroke="#3a2a0c"/></g>
    <path d="M800 ${WALL_B + 30} q-10 -200 60 -230 q70 -30 120 10 q50 40 46 220z" fill="#b8b4ae" stroke="#5a5650" stroke-width="2" opacity=".85"/><path d="M850 420 q10 100 -10 210 M930 400 q8 120 20 230" stroke="#5a5650" stroke-width="2" fill="none" opacity=".6"/>
    <!-- the star-chart table with its empty frame -->
    <g transform="translate(1560 0)"><ellipse cx="0" cy="330" rx="230" ry="200" fill="#5a7ad0" opacity=".12" filter="url(#blur6)"/>
      <rect x="-150" y="170" width="300" height="210" rx="4" fill="url(#gold)" stroke="#3a2a0c" stroke-width="2"/><rect x="-136" y="184" width="272" height="182" fill="#0c0f24" stroke="#3a2a0c" stroke-width="2"/>
      <path d="M-136 184 l60 0 l-20 30 l30 26 l-40 34 l14 40 l-44 52z" fill="#141a3c"/><circle cx="-112" cy="214" r="2" fill="#cfe0ff"/><circle cx="-96" cy="262" r="1.6" fill="#cfe0ff"/><circle cx="-118" cy="320" r="2" fill="#cfe0ff"/><path d="M-112 214L-96 262L-118 320" stroke="#8fa8e0" stroke-width="1" opacity=".7"/>
      <path d="M-76 184 l-20 30 l30 26 l-40 34 l14 40 l-44 52" stroke="#e8dcc0" stroke-width="2" fill="none" opacity=".7"/>
      <rect x="-170" y="500" width="340" height="16" rx="3" fill="url(#wood)" stroke="#120604" stroke-width="2"/><path d="M-150 516L-164 ${WALL_B + 30}M150 516L164 ${WALL_B + 30}" stroke="#2c140c" stroke-width="11" stroke-linecap="round"/>
      <path d="M-120 500 l10 -22 l70 6 l-6 16z" fill="#e8dcc0" stroke="#8a7a5a"/><circle cx="60" cy="478" r="22" fill="none" stroke="url(#gold)" stroke-width="5"/><path d="M60 456v44M38 478h44" stroke="url(#gold)" stroke-width="2"/></g>
    <!-- telescope -->
    <g transform="translate(1960 0)"><path d="M0 470 L-46 ${WALL_B + 30} M0 470 L46 ${WALL_B + 30} M0 470 L6 ${WALL_B + 20}" stroke="#2c140c" stroke-width="8" stroke-linecap="round"/><g transform="rotate(-32 0 460)"><rect x="-120" y="444" width="200" height="30" rx="8" fill="url(#gold)" stroke="#3a2a0c" stroke-width="2"/><rect x="74" y="438" width="40" height="42" rx="8" fill="url(#gold)" stroke="#3a2a0c" stroke-width="2"/><rect x="-150" y="450" width="34" height="18" rx="4" fill="#2c140c"/></g></g>`;
  const body = shell(pal, [1130], extra) + windowFrame(1130) + rug(1300, 560, "#141c38", "#5a7ad0");
  return { body, defs: DEFS(pal) };
}
export const ROOM_SVG = { library, hall, gallery, attic };

/* ---------------- Shared pieces ---------------- */
export function skySvg() {   // 1100 x 520, drawn large behind every window
  const r = rng(5); let stars = "", trees = "";
  for (let i = 0; i < 90; i++) stars += `<circle cx="${r() * 1100}" cy="${r() * 300}" r="${.6 + r() * 1.2}" fill="#dfe8ff" opacity="${.3 + r() * .6}"/>`;
  for (let x = -20; x < 1100; x += 46 + r() * 40) { const h = 120 + r() * 150; trees += `<path d="M${x} 520 L${x + 8} ${520 - h} l-26 ${h * .3} l22 -6 l-30 ${h * .34} l28 -8 l-34 ${h * .36} h92 l-34 -${h * .36} l28 8 l-30 -${h * .34} l22 6 l-26 -${h * .3} L${x + 20} 520z" fill="#05060f"/>`; }
  const defs = lin("sky", [[0, "#070a1e"], [.6, "#16204a"], [1, "#2a3260"]]) + rad("moon", [[0, "#f4f6ff"], [.8, "#cfd8ff"], [1, "#9fb0f0"]]) + rad("halo", [[0, "#b8c8ff", .5], [1, "#b8c8ff", 0]]) + `<filter id="b"><feGaussianBlur stdDeviation="9"/></filter>`;
  const body = `<rect width="1100" height="520" fill="url(#sky)"/>${stars}<circle cx="640" cy="150" r="150" fill="url(#halo)"/><circle cx="640" cy="150" r="44" fill="url(#moon)"/><circle cx="626" cy="140" r="8" fill="#aab8ec" opacity=".5"/><circle cx="654" cy="166" r="5" fill="#aab8ec" opacity=".5"/>
    <g filter="url(#b)" fill="#0c1230" opacity=".9"><ellipse cx="200" cy="120" rx="220" ry="34"/><ellipse cx="760" cy="210" rx="260" ry="30"/><ellipse cx="980" cy="90" rx="180" ry="30"/><ellipse cx="480" cy="250" rx="200" ry="24"/></g>${trees}`;
  return { body, defs };
}
export function rainSvg() {  // 256 x 256 tile
  const r = rng(9); let s = "";
  for (let i = 0; i < 46; i++) { const x = r() * 256, y = r() * 256, l = 14 + r() * 20; s += `<path d="M${x} ${y} l${-l * .22} ${l}" stroke="#b8c8ff" stroke-width="1.2" opacity="${.18 + r() * .3}" stroke-linecap="round"/>`; }
  return { body: s, defs: "" };
}
export function glowSvg() { return { body: `<circle cx="128" cy="128" r="128" fill="url(#g)"/>`, defs: rad("g", [[0, "#fff", .9], [.35, "#fff", .32], [1, "#fff", 0]]) }; }
export function flameSvg(f) {  // 4 frames, 60 x 90
  const a = [0, 5, -4, 2][f], b = [0, -3, 4, -2][f];
  return { body: `<path d="M30 88 Q4 70 ${16 + a} 44 Q${22 + b} 24 ${32 + a} 4 Q${38 + b} 30 ${46 + b} 46 Q56 70 30 88Z" fill="url(#f1)"/><path d="M30 86 Q16 72 ${24 + b} 54 Q${28 + a} 42 ${31 + b} 30 Q${36 + a} 46 ${39 + a} 58 Q44 74 30 86Z" fill="url(#f2)"/>`, defs: lin("f1", [[0, "#ffe07a", .95], [.6, "#ff8a2a", .9], [1, "#c8361a", .6]]) + lin("f2", [[0, "#fffbe0"], [1, "#ffc040"]]) };
}
export function vignetteSvg() { return { body: `<rect width="780" height="360" fill="url(#v)"/><rect width="780" height="70" fill="url(#t)"/>`, defs: rad("v", [[0, "#000", 0], [.62, "#04030a", .1], [1, "#04030a", .78]], .5, .52, .72) + lin("t", [[0, "#000", .5], [1, "#000", 0]]) }; }
export function curtainSvg() {  // 110 x 400, hangs left of a window; flipped for the right side
  return { body: `<path d="M8 0 H104 Q96 120 70 200 Q50 280 58 392 Q30 400 6 388 Q14 200 8 0Z" fill="url(#c)" stroke="#16060a" stroke-width="2"/><path d="M30 4 Q34 200 22 386 M56 4 Q56 160 40 388 M82 4 Q78 120 56 240" stroke="#16060a" stroke-width="2.5" fill="none" opacity=".55"/><path d="M42 4 Q46 180 30 388 M70 4 Q66 140 48 300" stroke="#c0606e" stroke-width="1.5" fill="none" opacity=".3"/><path d="M40 212 q24 10 44 -8" stroke="#d9b46a" stroke-width="5" fill="none"/>`, defs: lin("c", [[0, "#7a2434"], [.5, "#4a1420"], [1, "#2a0a12"]], 1, 0) };
}
export function doorSvg(open) {  // 200 x 414 leaf that fills a doorway
  const defs = lin("dw", [[0, "#6a3a22"], [1, "#2c140c"]]) + lin("dg", [[0, "#f0d08a"], [1, "#6e4f1a"]]) + lin("dk", [[0, "#0a0812"], [1, "#161228"]]);
  if (open) return { defs, body: `<rect x="4" y="0" width="176" height="414" fill="url(#dk)"/><path d="M40 414 L60 300 H130 L160 414Z" fill="#2a2a4a" opacity=".5"/><path d="M4 0 L62 26 V414 H4Z" fill="url(#dw)" stroke="#120604" stroke-width="3"/><path d="M14 40 L50 54 V190 L14 184Z M14 214 L50 218 V392 L14 398Z" fill="none" stroke="#1c0c07" stroke-width="3"/>` };
  return { defs, body: `<rect x="4" y="0" width="176" height="414" fill="url(#dw)" stroke="#120604" stroke-width="3"/><rect x="22" y="22" width="140" height="160" rx="4" fill="none" stroke="#1c0c07" stroke-width="4"/><rect x="22" y="206" width="140" height="186" rx="4" fill="none" stroke="#1c0c07" stroke-width="4"/><path d="M26 180V26H158" stroke="#8a5a3a" stroke-width="1.5" fill="none" opacity=".6"/><rect x="142" y="196" width="26" height="56" rx="6" fill="url(#dg)" stroke="#3a2a0c" stroke-width="1.5"/><circle cx="155" cy="212" r="8" fill="url(#dg)" stroke="#3a2a0c"/><path d="M155 230 v12" stroke="#1a1208" stroke-width="4" stroke-linecap="round"/>` };
}
export function runesSvg() {  // 200 x 414 ward drawn over the enchanted door
  const defs = rad("rg", [[0, "#c9a0ff", .6], [1, "#7a3ad0", 0]]);
  return { defs, body: `<circle cx="92" cy="200" r="150" fill="url(#rg)"/><g fill="none" stroke="#e2c8ff" stroke-width="3" stroke-linecap="round"><circle cx="92" cy="200" r="62"/><circle cx="92" cy="200" r="48" stroke-width="1.5"/><path d="M92 138 L146 231 H38Z M92 262 L38 169 H146Z"/><path d="M82 198 a14 14 0 1 0 18 14 a10 10 0 1 1 -18 -14z" fill="#e2c8ff"/><path d="M40 60 l10 16 l10 -16 M124 60 v18 m-8 -9 h16 M44 330 h18 l-9 16z M126 328 q10 10 0 20 q-10 -10 0 -20z"/></g>` };
}
export function panelSvg() {  // 172 x 278 stone slab that hides the passage
  return { body: `<rect width="172" height="278" fill="url(#s)" stroke="#1a181e" stroke-width="3"/><path d="M0 70H172M0 150H172M0 220H172M60 0v70M120 70v80M50 150v70M110 220v58" stroke="#1a181e" stroke-width="2" opacity=".7"/><path d="M76 96 a12 12 0 1 0 16 12 a9 9 0 1 1 -16 -12z" fill="#15131a" opacity=".55"/><path d="M96 92 l2 6 l6 0 l-5 4 l2 6 l-5 -4 l-5 4 l2 -6 l-5 -4 l6 0z" fill="#15131a" opacity=".5"/>`, defs: lin("s", [[0, "#6f6a70"], [1, "#35323a"]]) };
}
export function clockFaceSvg() {  // 132 x 132
  let n = ""; const R = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
  R.forEach((t, i) => { const a = i / 12 * Math.PI * 2; n += `<text x="${66 + Math.sin(a) * 47}" y="${70 - Math.cos(a) * 47}" font-family="Georgia,serif" font-size="11" text-anchor="middle" fill="#2a1a0c">${t}</text>`; });
  return { body: `<circle cx="66" cy="66" r="62" fill="url(#f)" stroke="#3a2a0c" stroke-width="2.5"/><circle cx="66" cy="66" r="36" fill="none" stroke="#8a6a2c" stroke-width="1"/>${n}`, defs: rad("f", [[0, "#fbf3dc"], [1, "#d8c59a"]]) };
}
export function pendulumSvg() { return { body: `<path d="M20 0V150" stroke="url(#p)" stroke-width="4"/><circle cx="20" cy="158" r="19" fill="url(#p)" stroke="#3a2a0c" stroke-width="2"/><circle cx="14" cy="152" r="5" fill="#fff6d0" opacity=".5"/>`, defs: lin("p", [[0, "#f0d08a"], [1, "#8a6a2c"]]) }; }
export function plantSvg() {  // 300 x 420 dark foreground fern
  let s = ""; const r = rng(3);
  for (let i = 0; i < 11; i++) { const a = -1.25 + i * .25, l = 220 + r() * 120, ex = 150 + Math.sin(a) * l, ey = 330 - Math.cos(a) * l * .9; s += `<path d="M150 330 Q${150 + Math.sin(a) * l * .4} ${330 - l * .8} ${ex} ${ey}" stroke="#06050a" stroke-width="16" fill="none" stroke-linecap="round" stroke-dasharray="3 9"/><path d="M150 330 Q${150 + Math.sin(a) * l * .4} ${330 - l * .8} ${ex} ${ey}" stroke="#06050a" stroke-width="3" fill="none"/>`; }
  return { body: s + `<path d="M96 330 h108 l-14 90 h-80z" fill="#06050a"/>`, defs: "" };
}
