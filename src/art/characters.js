import { lin, rad } from "./svg.js";

/* ---------------- Mallow: a parametric side-view cat rig ----------------
   Legs are two-segment limbs driven by a gait phase, so a walk cycle is just the same drawing at eight phases. */
export const MALLOW = { w: 250, h: 170, originX: .5, originY: 158 / 170, walkFrames: 8, idleFrames: 6 };

export function mallowSvg({ phase = 0, moving = false, tail = 0, blink = false }) {
  const bob = moving ? Math.sin(phase * 2) * 1.6 : Math.sin(phase) * .7;
  const leg = (hx, off, far) => {
    const a = moving ? Math.sin(phase + off) * .62 : (far ? .07 : -.05);
    const lift = moving ? Math.max(0, Math.cos(phase + off)) : 0;
    const hy = 112 + bob, kx = hx + Math.sin(a) * 24, ky = hy + Math.cos(a) * 24;
    const b = a * .35 - lift * .95;
    const px = kx + Math.sin(b) * 26, py = Math.min(158, ky + Math.cos(b) * 26);
    const c = far ? "#0b0a10" : "#17141d";
    return `<path d="M${hx - 10} ${hy - 6} Q${kx - 9} ${ky} ${px - 6} ${py - 2} L${px + 7} ${py - 2} Q${kx + 9} ${ky} ${hx + 11} ${hy - 6}Z" fill="${c}"/><ellipse cx="${px + 3}" cy="${py - 1}" rx="9" ry="4.4" fill="${c}"/>`;
  };
  const t = tail, hb = bob * .6;
  const eye = blink
    ? `<path d="M200 ${64 + hb} Q208 ${67 + hb} 216 ${63 + hb}M184 ${64 + hb} Q190 ${67 + hb} 196 ${64 + hb}" stroke="#3b3348" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="207" cy="${64 + hb}" rx="13" ry="10" fill="#f4c531" opacity=".14"/>
       <ellipse cx="207.5" cy="${64 + hb}" rx="7.4" ry="6.8" fill="url(#eye)" stroke="#07060a" stroke-width="1.2"/><ellipse cx="208.6" cy="${64 + hb}" rx="2.1" ry="5.4" fill="#0a0808"/><circle cx="205.6" cy="${61.4 + hb}" r="1.7" fill="#fffbe6"/>
       <ellipse cx="189.5" cy="${64.6 + hb}" rx="5.8" ry="6.2" fill="url(#eye)" stroke="#07060a" stroke-width="1.2"/><ellipse cx="190.6" cy="${64.6 + hb}" rx="1.7" ry="4.8" fill="#0a0808"/><circle cx="188.2" cy="${62.2 + hb}" r="1.3" fill="#fffbe6"/>`;
  const defs = lin("fur", [[0, "#24202d"], [.55, "#16131c"], [1, "#0c0b11"]]) + lin("eye", [[0, "#ffe27a"], [1, "#e0a31a"]]);
  const body = `
    <path d="M72 ${104 + bob} C44 ${108 + bob} 24 ${88 + t * 7} 29 ${60 + t * 11} C31 ${44 + t * 9} 44 ${36 + t * 7} 52 ${46 + t * 5}" stroke="#121017" stroke-width="12.5" fill="none" stroke-linecap="round"/>
    ${leg(172, Math.PI, true)}${leg(84, .35, true)}
    <path d="M62 ${98 + bob} C59 ${72 + bob} 98 ${66 + bob} 140 ${70 + bob} C166 ${71 + bob} 184 ${70 + bob} 194 ${82 + bob} C202 ${98 + bob} 192 ${120 + bob} 170 ${123 + bob} C140 ${129 + bob} 96 ${129 + bob} 78 ${123 + bob} C66 ${119 + bob} 62 ${110 + bob} 62 ${98 + bob}Z" fill="url(#fur)"/>
    <path d="M70 ${84 + bob} C98 ${68 + bob} 140 ${69 + bob} 182 ${72 + bob}" stroke="#7f8fd0" stroke-width="2" fill="none" opacity=".4" stroke-linecap="round"/>
    <path d="M168 ${78 + bob} Q176 ${60 + hb} 190 ${58 + hb} L206 ${92 + hb} Q190 ${110 + bob} 172 ${104 + bob}Z" fill="#16131c"/>
    <path d="M178 ${54 + hb} L181 ${25 + hb} L198 ${47 + hb}Z M201 ${46 + hb} L217 ${26 + hb} L221 ${55 + hb}Z" fill="#16131c"/>
    <path d="M183 ${48 + hb} L184 ${34 + hb} L193 ${46 + hb}Z M206 ${46 + hb} L215 ${35 + hb} L217 ${50 + hb}Z" fill="#3a2f45"/>
    <ellipse cx="197" cy="${68 + hb}" rx="25.5" ry="23" fill="url(#fur)"/>
    <path d="M176 ${60 + hb} Q186 ${44 + hb} 204 ${46 + hb}" stroke="#7f8fd0" stroke-width="1.8" fill="none" opacity=".4" stroke-linecap="round"/>
    <ellipse cx="212" cy="${78 + hb}" rx="11.5" ry="8.2" fill="#1e1a26"/>
    <path d="M218.5 ${73.5 + hb} l6 0 l-3 3.6z" fill="#6a5560"/><path d="M221.5 ${77 + hb} q-2 4 -6 3.4" stroke="#07060a" stroke-width="1" fill="none"/>
    ${eye}
    <path d="M219 ${78 + hb} l23 -6 M219 ${80.5 + hb} l24 1.5 M218 ${83 + hb} l21 8" stroke="#a09bb8" stroke-width=".8" opacity=".75"/>
    <path d="M176 ${86 + hb} Q186 ${97 + hb} 200 ${93 + hb}" stroke="#7a4a24" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="188" cy="${98 + hb}" r="5.2" fill="#d9a441" stroke="#7a5a18" stroke-width="1"/>
    ${leg(84, Math.PI + .35, false)}${leg(172, 0, false)}`;
  return { body, defs };
}

/* ---------------- Fern: the groundskeeper, facing left toward the library ---------------- */
export const FERN = { w: 260, h: 400, originX: .5, originY: 392 / 400 };
export function fernSvg() {
  const defs = lin("coat", [[0, "#56553a"], [.5, "#3f3f2b"], [1, "#26261a"]]) + lin("coatS", [[0, "#000", 0], [1, "#000", .45]], 1, 0)
    + lin("skin", [[0, "#dcae86"], [1, "#a8734f"]]) + lin("trs", [[0, "#3a332e"], [1, "#1c1816"]]) + lin("cap", [[0, "#6b5a45"], [1, "#3d3226"]])
    + lin("warm", [[0, "#ffb45a", 0], [1, "#ffb45a", .34]], 1, 0);
  const body = `
    <ellipse cx="130" cy="392" rx="76" ry="7" fill="#000" opacity=".4"/>
    <path d="M92 300 L98 372 L124 372 L128 306Z M134 306 L138 372 L166 372 L170 300Z" fill="url(#trs)"/>
    <path d="M86 372 Q84 390 96 392 L128 392 L126 372Z M136 372 L134 392 L170 392 Q180 390 172 372Z" fill="#1a1411" stroke="#0c0907" stroke-width="1.2"/>
    <path d="M82 132 Q70 220 78 318 L124 322 L130 250 L138 322 L184 318 Q192 220 178 132 Q130 112 82 132Z" fill="url(#coat)" stroke="#1a190f" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M82 132 Q70 220 78 318 L124 322 L130 250 L138 322 L184 318 Q192 220 178 132 Q130 112 82 132Z" fill="url(#coatS)"/>
    <path d="M130 140 L130 318" stroke="#1a190f" stroke-width="1.4"/><circle cx="124" cy="176" r="3" fill="#8a7a4a"/><circle cx="124" cy="212" r="3" fill="#8a7a4a"/><circle cx="124" cy="248" r="3" fill="#8a7a4a"/>
    <path d="M96 222 h22 v20 h-22z M146 222 h24 v20 h-24z" fill="none" stroke="#1a190f" stroke-width="1.2" opacity=".7"/>
    <path d="M84 134 Q60 180 62 246 Q62 262 74 262 Q84 262 86 246 Q88 190 100 148Z" fill="url(#coat)" stroke="#1a190f" stroke-width="1.5"/>
    <path d="M64 258 q-4 14 6 20 q10 2 12 -8 l0 -12z" fill="url(#skin)" stroke="#6b4630" stroke-width="1"/>
    <path d="M176 134 Q204 170 206 214 Q206 232 196 236 Q184 236 184 222 Q180 186 164 152Z" fill="url(#coat)" stroke="#1a190f" stroke-width="1.5"/>
    <path d="M186 228 q-2 14 8 16 q12 0 12 -12 l-4 -8z" fill="url(#skin)" stroke="#6b4630" stroke-width="1"/>
    <path d="M96 118 Q130 138 164 118 L168 136 Q130 158 92 136Z" fill="#6a1f2c" stroke="#3a0f18" stroke-width="1.3"/>
    <path d="M108 136 L102 196 L122 198 L124 142Z" fill="#7a2634" stroke="#3a0f18" stroke-width="1.3"/><path d="M104 180 h18 M103 188 h19" stroke="#3a0f18" stroke-width="1"/>
    <path d="M112 96 h36 v26 h-36z" fill="#b07a56"/>
    <ellipse cx="128" cy="78" rx="27" ry="32" fill="url(#skin)" stroke="#6b4630" stroke-width="1.2"/>
    <ellipse cx="156" cy="80" rx="5" ry="9" fill="#b98560" stroke="#6b4630" stroke-width="1"/>
    <path d="M102 84 Q100 122 128 126 Q156 122 155 86 Q146 100 128 100 Q110 100 102 84Z" fill="#cfcac0" stroke="#8d887e" stroke-width="1"/>
    <path d="M108 100 q6 14 20 16 M150 98 q-6 16 -22 18 M118 106 q4 10 10 12" stroke="#a9a49a" stroke-width="1.1" fill="none"/>
    <path d="M106 90 Q116 82 126 89 Q136 82 148 90 Q138 97 126 93 Q114 97 106 90Z" fill="#e0dcd2" stroke="#8d887e" stroke-width="1"/>
    <path d="M122 70 q-5 12 -1 17 q5 3 9 0" fill="#c4906a" stroke="#8a5a3c" stroke-width="1"/>
    <path d="M106 66 q7 -6 15 -2 M132 64 q8 -5 16 0" stroke="#bdb8ae" stroke-width="4" stroke-linecap="round" fill="none"/>
    <ellipse cx="114" cy="72" rx="3.6" ry="2.4" fill="#fff"/><ellipse cx="140" cy="71" rx="3.6" ry="2.4" fill="#fff"/><circle cx="113.2" cy="72.2" r="1.8" fill="#3a2c20"/><circle cx="139.2" cy="71.2" r="1.8" fill="#3a2c20"/>
    <path d="M104 78 q4 3 9 2 M134 77 q5 3 10 1 M110 58 q14 -4 30 -1" stroke="#8a5a3c" stroke-width=".9" fill="none" opacity=".7"/>
    <path d="M98 58 Q96 30 128 28 Q160 28 160 56 Q130 46 98 58Z" fill="url(#cap)" stroke="#2a2118" stroke-width="1.4"/>
    <path d="M100 56 Q84 56 76 64 Q90 68 104 62Z" fill="#3d3226" stroke="#2a2118" stroke-width="1.2"/>
    <path d="M108 40 l44 6 M104 48 l52 4 M118 32 l8 22 M138 30 l6 24" stroke="#2a2118" stroke-width=".8" opacity=".45"/>
    <path d="M150 60 Q190 150 186 318 L138 322 L130 250 Q150 180 150 60Z" fill="url(#warm)"/>`;
  return { body, defs };
}
export const LANTERN = { w: 70, h: 110 };
export function lanternSvg() {
  const defs = rad("lg", [[0, "#fff6d0"], [.45, "#ffc45a"], [1, "#b05a10"]]) + lin("brass", [[0, "#e0b860"], [1, "#7a5a1c"]]);
  const body = `<path d="M35 2 q-12 0 -12 12" stroke="#8a6a2c" stroke-width="3" fill="none"/><path d="M23 14 h24 l5 10 h-34z" fill="url(#brass)" stroke="#4a3610" stroke-width="1.2"/>
    <rect x="17" y="24" width="36" height="58" rx="5" fill="url(#lg)" stroke="#4a3610" stroke-width="1.6"/><path d="M29 24 v58 M41 24 v58" stroke="#4a3610" stroke-width="1.4"/>
    <path d="M35 40 q8 12 0 24 q-8 -12 0 -24z" fill="#fff8e0"/><rect x="13" y="82" width="44" height="10" rx="3" fill="url(#brass)" stroke="#4a3610" stroke-width="1.2"/>`;
  return { body, defs };
}

/* ---------------- Miss Wisp: three frames of the same drawing with the hem and hair drifting ---------------- */
export const WISP = { w: 300, h: 440, originX: .5, originY: .5, frames: 4 };
export function wispSvg(f = 0) {
  const s = Math.sin(f / WISP.frames * Math.PI * 2), c = Math.cos(f / WISP.frames * Math.PI * 2);
  const defs = lin("gown", [[0, "#f4fbff", .95], [.5, "#cfe6ff", .8], [.85, "#9cc4f0", .28], [1, "#9cc4f0", 0]])
    + rad("aura", [[0, "#bfe0ff", .5], [.6, "#8fb8f0", .16], [1, "#8fb8f0", 0]]) + lin("hair", [[0, "#eef6ff"], [1, "#a9c8ee"]])
    + `<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.1"/></filter>`;
  const body = `
    <ellipse cx="150" cy="210" rx="140" ry="200" fill="url(#aura)"/>
    <g filter="url(#soft)">
    <path d="M150 128 Q112 130 104 170 Q98 200 120 214 Q84 300 ${62 + s * 10} ${396 + c * 6} Q${96 + c * 8} ${372 - s * 8} ${122 + s * 6} ${410 + c * 5} Q${150 + c * 6} ${380 + s * 8} ${178 - s * 6} ${414 - c * 5} Q${206 - c * 8} ${376 + s * 6} ${240 - s * 10} ${398 - c * 6} Q216 300 182 214 Q204 198 198 170 Q190 130 150 128Z" fill="url(#gown)" stroke="#bfe0ff" stroke-width="1.2" stroke-opacity=".7"/>
    <path d="M130 216 Q150 226 172 216 M124 250 Q150 262 178 250 M150 222 L${150 + s * 4} 372" stroke="#ffffff" stroke-width="1" opacity=".45" fill="none"/>
    <path d="M108 164 Q78 176 72 214 Q70 232 84 236 Q98 236 100 220 Q104 196 122 186Z" fill="#e4f1ff" opacity=".9" stroke="#bfe0ff" stroke-width="1"/>
    <path d="M192 162 Q226 150 232 112 Q234 92 222 88 Q208 88 206 104 Q204 132 180 150Z" fill="#e4f1ff" opacity=".9" stroke="#bfe0ff" stroke-width="1"/>
    <path d="M214 92 q-16 -8 -30 -2 q-6 6 2 10 q14 2 26 -2z" fill="#f6fbff" stroke="#bfe0ff" stroke-width="1"/>
    <path d="M138 108 h24 v24 q-12 8 -24 0z" fill="#eaf4ff"/>
    <path d="M132 124 Q150 138 168 124 L170 136 Q150 148 130 136Z" fill="#ffffff" opacity=".9" stroke="#bfe0ff" stroke-width="1"/><ellipse cx="150" cy="138" rx="5" ry="6.5" fill="#9cc4f0" stroke="#fff" stroke-width="1"/>
    <path d="M150 28 Q${106 - s * 4} 28 108 76 Q${96 + c * 5} ${92 + s * 4} ${90 - s * 6} ${116 + c * 4} M150 28 Q${196 + s * 4} 28 192 74 Q${206 - c * 5} ${94 - s * 4} ${212 + s * 6} ${112 + c * 4}" stroke="url(#hair)" stroke-width="9" fill="none" stroke-linecap="round" opacity=".85"/>
    <ellipse cx="150" cy="80" rx="27" ry="33" fill="#f8fcff" stroke="#bfe0ff" stroke-width="1.2"/>
    <path d="M122 70 Q120 36 150 34 Q182 36 178 72 Q168 52 150 52 Q132 52 122 70Z" fill="url(#hair)"/>
    <ellipse cx="150" cy="30" rx="19" ry="13" fill="url(#hair)" stroke="#bfe0ff" stroke-width="1"/>
    <path d="M134 82 q6 -4 12 0 M154 82 q6 -4 12 0" stroke="#5f7fb0" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M132 74 q8 -5 14 -2 M154 72 q8 -3 14 2" stroke="#8fa9d0" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <path d="M150 86 q-3 8 0 10 q3 1 4 -1" stroke="#9fb6d8" stroke-width="1" fill="none"/><path d="M143 103 q7 4 14 0" stroke="#7f98c0" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    </g>`;
  return { body, defs };
}
