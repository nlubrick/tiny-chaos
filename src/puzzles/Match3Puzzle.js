import { ctx } from "../ctx.js";
import { BasePuzzle } from "./BasePuzzle.js";
import { makeBoard, trySwap, findMove, shuffle, wardsLeft, WARD_CELLS } from "./match3Logic.js";

const N = 7, CELL = 86, X0 = 150, Y0 = 96, HEX_FRAME = "p8";
const frameOf = t => "p" + t;
const cx = c => X0 + c * CELL + CELL / 2, cy = r => Y0 + r * CELL + CELL / 2;

/** "Break the Enchantment": the drawing and touch handling for the rules in match3Logic.js. */
export class Match3Puzzle extends BasePuzzle {
  constructor() { super("Match3"); }
  build() {
    // The painted atlas is a 3 x 3 sheet of 150px tiles; cut each one slightly inside its edge so neighbours never bleed in.
    const tex = this.textures.get("icons"); if (!tex.has("p0")) for (let i = 0; i < 9; i++) tex.add("p" + i, 0, (i % 3) * 150 + 6, Math.floor(i / 3) * 150 + 6, 138, 138);
    this.board = makeBoard(N, N, Math.random, WARD_CELLS);
    this.total = wardsLeft(this.board); this.locked = false; this.sel = null; this.idle = 0; this.sprites = new Map(); this.wardImgs = new Map();

    const g = this.add.graphics();
    g.fillStyle(0x120d1a, 1).fillRoundedRect(X0 - 16, Y0 - 16, N * CELL + 32, N * CELL + 32, 18);
    g.lineStyle(3, 0x8a6a2c, 1).strokeRoundedRect(X0 - 16, Y0 - 16, N * CELL + 32, N * CELL + 32, 18);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) g.fillStyle((r + c) % 2 ? 0x1c1526 : 0x231a30, 1).fillRoundedRect(X0 + c * CELL + 2, Y0 + r * CELL + 2, CELL - 4, CELL - 4, 10);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      if (this.board.w[r][c]) { const w = this.add.graphics({ x: cx(c), y: cy(r) }).setDepth(4); w.fillStyle(0xb070ff, .3).fillRoundedRect(-CELL / 2 + 2, -CELL / 2 + 2, CELL - 4, CELL - 4, 12); w.lineStyle(5, 0xd9a8ff, 1).strokeRoundedRect(-CELL / 2 + 3, -CELL / 2 + 3, CELL - 6, CELL - 6, 12); this.tweens.add({ targets: w, alpha: .5, duration: 900 + Math.random() * 500, yoyo: true, repeat: -1 }); this.wardImgs.set(r * 100 + c, w); }
      this.spawn(this.board.g[r][c], r, c);
    }
    this.ring = this.add.graphics().setDepth(6).setVisible(false);
    this.ring.lineStyle(5, 0xffe7a8, 1).strokeRoundedRect(-CELL / 2 + 3, -CELL / 2 + 3, CELL - 6, CELL - 6, 12);

    // side panel
    const px = 880;
    this.add.image(px + 520, 420, "door-closed").setScale(1.25).setAlpha(.9); this.doorRunes = this.add.image(px + 520, 420, "runes").setScale(1.25).setBlendMode(Phaser.BlendModes.ADD);
    this.label(px, 110, "The door is held shut by the librarian's wards.", 26);
    this.count = this.label(px, 206, "", 38, "#d9b0ff");
    this.label(px, 276, "Swap two neighbours to line up three or more. Every match on a glowing square breaks its ward.", 22, "#b7a487");
    this.label(px, 420, "Hex Bomb", 28, "#d9b46a");
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) this.add.image(px + 30 + dx * 54, 500 + dy * 54, "icons", "p2").setDisplaySize(50, 50);
    this.add.text(px + 128, 510, "→", { fontSize: "40px", color: "#d9b46a" }); this.add.image(px + 216, 527, "icons", HEX_FRAME).setDisplaySize(84, 84);
    this.label(px, 596, "Match four in a square to forge one. Move it to blast everything around it.", 22, "#b7a487");
    this.refreshCount();

    this.input.on("pointerdown", p => this.down(p));
    this.input.on("pointermove", p => this.move(p));
    this.input.on("pointerup", () => { this.drag = null; });
  }
  spawn(piece, r, c, fromRow) {
    const s = this.add.image(cx(c), cy(fromRow != null ? fromRow : r), "icons", piece.s === "hex" ? HEX_FRAME : frameOf(piece.t)).setDisplaySize(CELL - 8, CELL - 8).setDepth(3);
    s.baseScale = s.scale; this.sprites.set(piece.id, s); return s;
  }
  cellAt(p) { const c = Math.floor((p.x - X0) / CELL), r = Math.floor((p.y - Y0) / CELL); return r >= 0 && c >= 0 && r < N && c < N ? [r, c] : null; }
  select(cell) { this.sel = cell; this.ring.setVisible(!!cell); if (cell) this.ring.setPosition(cx(cell[1]), cy(cell[0])); }

  down(p) {
    if (this.locked || this.done) return; this.idle = 0; this.clearHint();
    const cell = this.cellAt(p); if (!cell) { this.select(null); return; }
    if (this.sel && Math.abs(this.sel[0] - cell[0]) + Math.abs(this.sel[1] - cell[1]) === 1) { const a = this.sel; this.select(null); this.swap(a, cell); return; }
    this.select(cell); this.drag = { cell, x: p.x, y: p.y };
  }
  move(p) {
    if (!this.drag || this.locked || !p.isDown) return;
    const dx = p.x - this.drag.x, dy = p.y - this.drag.y; if (Math.max(Math.abs(dx), Math.abs(dy)) < CELL * .38) return;
    const [r, c] = this.drag.cell, to = Math.abs(dx) > Math.abs(dy) ? [r, c + Math.sign(dx)] : [r + Math.sign(dy), c];
    this.drag = null; this.select(null);
    if (to[0] >= 0 && to[1] >= 0 && to[0] < N && to[1] < N) this.swap([r, c], to);
  }

  tw(config) { return new Promise(res => this.tweens.add({ ...config, onComplete: res })); }
  async swap(a, z) {
    this.locked = true;
    const B = this.board, sa = this.sprites.get(B.g[a[0]][a[1]].id), sz = this.sprites.get(B.g[z[0]][z[1]].id);
    const steps = trySwap(B, a, z, Math.random);
    ctx.audio.sfx("swap");
    await Promise.all([this.tw({ targets: sa, x: cx(z[1]), y: cy(z[0]), duration: 150 }), this.tw({ targets: sz, x: cx(a[1]), y: cy(a[0]), duration: 150 })]);
    if (!steps) { ctx.audio.sfx("nope"); await Promise.all([this.tw({ targets: sa, x: cx(a[1]), y: cy(a[0]), duration: 150 }), this.tw({ targets: sz, x: cx(z[1]), y: cy(z[0]), duration: 150 })]); this.locked = false; return; }
    for (let i = 0; i < steps.length; i++) await this.play(steps[i], i);
    if (wardsLeft(B) === 0) { this.win(); return; }
    if (!findMove(B)) { shuffle(B, Math.random); ctx.audio.sfx("whisper"); await Promise.all(B.g.flatMap((row, r) => row.map((p, c) => this.tw({ targets: this.sprites.get(p.id), x: cx(c), y: cy(r), duration: 420, ease: "Cubic.inOut" })))); }
    this.locked = false; this.idle = 0;
  }
  async play(step, chain) {
    if (step.fired.length) { ctx.audio.sfx("hex"); this.cameras.main.shake(220, .006); for (const f of step.fired) { const b = this.add.image(cx(f.c), cy(f.r), "glow").setTint(f.s === "hex" ? 0xc070ff : 0x8fd0ff).setBlendMode(Phaser.BlendModes.ADD).setDepth(8).setDisplaySize(60, 60); this.tweens.add({ targets: b, displayWidth: f.s === "lineV" ? 120 : f.s === "hex" ? 420 : 1400, displayHeight: f.s === "lineH" ? 120 : f.s === "hex" ? 420 : 1400, alpha: 0, duration: 420, onComplete: () => b.destroy() }); } }
    else ctx.audio.sfx("match", chain);
    for (const k of step.created) { const s = this.sprites.get(k.id); if (k.s === "hex") { s.setFrame(HEX_FRAME); ctx.audio.sfx("ward"); } else this.markLine(s, k.s); this.tweens.add({ targets: s, scale: s.baseScale * 1.35, duration: 160, yoyo: true }); }
    for (const w of step.wards) { const img = this.wardImgs.get(w.r * 100 + w.c); if (img) { this.wardImgs.delete(w.r * 100 + w.c); this.tweens.killTweensOf(img); this.tweens.add({ targets: img, scale: 1.6, alpha: 0, duration: 420, onComplete: () => img.destroy() }); ctx.audio.sfx("ward"); } }
    if (step.wards.length) this.refreshCount();
    await Promise.all(step.cleared.map(k => { const s = this.sprites.get(k.id); this.sprites.delete(k.id); if (s.mark) s.mark.destroy(); return this.tw({ targets: s, scale: 0, alpha: 0, angle: 40, duration: 190 }).then(() => s.destroy()); }));
    const moves = step.falls.map(f => this.tw({ targets: this.sprites.get(f.id), y: cy(f.r), duration: 130 + 40 * Math.abs(f.r), ease: "Quad.in" }));
    for (const n of step.spawns) { const s = this.spawn({ id: n.id, t: n.t }, n.r, n.c, n.from); moves.push(this.tw({ targets: s, y: cy(n.r), duration: 170 + 45 * (n.r - n.from), ease: "Quad.in" })); }
    await Promise.all(moves);
  }
  markLine(s, kind) { s.setTint(0xbfe8ff); s.mark = this.add.image(s.x, s.y, "glow").setTint(0x8fd0ff).setBlendMode(Phaser.BlendModes.ADD).setDepth(5).setDisplaySize(kind === "lineH" ? CELL * 1.5 : 30, kind === "lineH" ? 30 : CELL * 1.5); }
  refreshCount() { const left = wardsLeft(this.board); this.count.setText(left ? "Wards left: " + left + " of " + this.total : "The wards are broken"); this.doorRunes.setAlpha(left / this.total); }
  win() { this.ring.setVisible(false); for (const s of this.sprites.values()) this.tweens.add({ targets: s, alpha: 0, scale: 0, duration: 500, delay: Math.random() * 300 }); this.solved(1000); }

  clearHint() { if (this.hintTw) { this.hintTw.forEach(t => t.stop()); this.hintTw = null; for (const s of this.sprites.values()) if (s.active) s.setScale(s.baseScale); } }
  update(t, dms) {
    for (const s of this.sprites.values()) if (s.mark) s.mark.setPosition(s.x, s.y);
    if (this.locked || this.done) return;
    this.idle += dms;
    if (this.idle > 6000 && !this.hintTw) { const m = findMove(this.board); if (m) this.hintTw = m.map(([r, c]) => { const s = this.sprites.get(this.board.g[r][c].id); return this.tweens.add({ targets: s, scale: s.baseScale * 1.14, duration: 380, yoyo: true, repeat: -1 }); }); }
  }
}
