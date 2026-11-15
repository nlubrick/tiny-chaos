import { ctx } from "../ctx.js";
import { BasePuzzle } from "./BasePuzzle.js";
import { fresh, pull } from "./pinLogic.js";

const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };
// Geometry of the sluice works (stage units)
const SH = { x: 250, w: 250 }, TOP = 70, A_Y = 240, B_Y = 410, LOW_B = 610, CH = { x: 500, w: 180, y: 520 }, FL = { x: 680, w: 220, y: 300 }, C_Y = 300;

/** "The Sluice Gate": pull the pins in an order that gets water to the float. Rules live in pinLogic.js. */
export class PinPuzzle extends BasePuzzle {
  constructor() { super("Pin"); }
  build() {
    this.bannerAt = { x: 1240, y: 34 };
    this.note = this.add.text(980, 110, "", { ...serif, fontSize: "30px", color: "#e6d8bd", wordWrap: { width: 520 }, lineSpacing: 8 });
    this.layer = this.add.container(0, 0);
    this.reset();
  }
  reset() {
    this.layer.removeAll(true); this.tweens.killAll(); this.s = fresh(); this.locked = false;
    this.note.setText("Pull the pins.\nGet the water down to the float and the gate will lift.\n\nMind the hot coals, and the stone.").setColor("#e6d8bd");
    const L = this.layer, g = this.add.graphics(); L.add(g);
    // stonework
    g.fillStyle(0x3a3b46, 1).fillRoundedRect(SH.x - 40, TOP - 30, 720, LOW_B - TOP + 70, 16);
    g.fillStyle(0x0c0c12, 1).fillRect(SH.x, TOP, SH.w, LOW_B - TOP).fillRect(CH.x, CH.y, CH.w, LOW_B - CH.y).fillRect(FL.x, FL.y - 190, FL.w, LOW_B - FL.y + 190);
    g.lineStyle(4, 0x000000, .6).strokeRect(SH.x, TOP, SH.w, LOW_B - TOP).strokeRect(FL.x, FL.y - 190, FL.w, LOW_B - FL.y + 190);
    // winch rope in the bottom chamber
    this.rope = this.add.graphics(); L.add(this.rope); this.drawRope(0xc8a878);
    // water, coals, stone, float
    this.water = this.add.rectangle(SH.x + 6, TOP + 20, SH.w - 12, A_Y - TOP - 26, 0x3a8ad8, .9).setOrigin(0, 0); L.add(this.water);
    this.coals = this.add.container(SH.x + SH.w / 2, B_Y - 30); for (const [dx, dy, r] of [[-70, 4, 22], [-28, -6, 26], [18, 2, 24], [62, -2, 22], [-6, -34, 20], [40, -30, 18]]) this.coals.add(this.add.circle(dx, dy, r, 0xff6a1a).setStrokeStyle(3, 0xffc84a)); L.add(this.coals);
    this.coalGlow = this.tweens.add({ targets: this.coals, alpha: .75, duration: 420, yoyo: true, repeat: -1 });
    this.stone = this.add.graphics({ x: FL.x + FL.w / 2, y: C_Y - 62 }); this.stone.fillStyle(0x7a7c88, 1).fillRoundedRect(-80, -56, 160, 112, 18).lineStyle(4, 0x1a1b20, 1).strokeRoundedRect(-80, -56, 160, 112, 18); L.add(this.stone);
    this.float = this.add.container(FL.x + FL.w / 2, LOW_B - 44); const fg = this.add.graphics(); fg.fillStyle(0xd9b46a, 1).fillRoundedRect(-70, -34, 140, 68, 30).lineStyle(4, 0x6e4f1a, 1).strokeRoundedRect(-70, -34, 140, 68, 30); this.float.add(fg); L.add(this.float);
    // gate indicator
    this.gate = this.add.image(1440, 560, "gate").setScale(.42).setOrigin(.5, 1); L.add(this.gate); const arch = this.add.graphics(); arch.lineStyle(10, 0x6f6a70, 1).strokeRoundedRect(1384, 360, 112, 206, { tl: 50, tr: 50, bl: 0, br: 0 }); L.add(arch);
    // pins: a bar and a big round handle
    this.pins = {};
    this.pin("A", SH.x - 12, A_Y, SH.w + 24, 0, SH.x - 80, A_Y, -1, 0);
    this.pin("B", SH.x - 12, B_Y, SH.w + 24, 0, SH.x - 80, B_Y, -1, 0);
    this.pin("C", FL.x - 12, C_Y, FL.w + 24, 0, FL.x + FL.w + 80, C_Y, 1, 0);
    this.pin("D", CH.x + CH.w / 2, CH.y - 14, 0, LOW_B - CH.y + 28, CH.x + CH.w / 2, CH.y - 80, 0, -1);
  }
  drawRope(col) { const g = this.rope; g.clear(); g.lineStyle(12, col, 1); for (let i = 0; i < 4; i++) g.strokeEllipse(SH.x + SH.w / 2, LOW_B - 30 - i * 16, 150 - i * 8, 26); }
  pin(id, bx, by, bw, bh, hx, hy, dx, dy) {
    const c = this.add.container(0, 0), g = this.add.graphics();
    g.fillStyle(0xc9ccd6, 1).fillRoundedRect(bw ? bx : bx - 9, bh ? by : by - 9, bw || 18, bh || 18, 8); g.lineStyle(3, 0x1a1b20, 1).strokeRoundedRect(bw ? bx : bx - 9, bh ? by : by - 9, bw || 18, bh || 18, 8);
    g.lineStyle(14, 0xc9ccd6, 1).lineBetween(bw ? (dx < 0 ? bx : bx + bw) : bx, bh ? by : by, hx, hy);
    g.fillStyle(0xd8263a, 1).fillCircle(hx, hy, 40).lineStyle(6, 0xffffff, 1).strokeCircle(hx, hy, 40); g.fillStyle(0x07060c, 1).fillCircle(hx, hy, 14);
    c.add(g); c.add(this.add.text(hx + (dx ? dx * 62 : 62), hy + (dy ? -4 : -62), id, { ...serif, fontSize: "30px", color: "#ffffff" }).setOrigin(.5));
    const zone = this.add.zone(hx, hy, 130, 130).setInteractive({ useHandCursor: true }); zone.on("pointerdown", () => this.pull(id)); c.add(zone);
    this.layer.add(c); this.pins[id] = { c, dx, dy };
  }
  tw(o) { return new Promise(r => this.tweens.add({ ...o, onComplete: r })); }
  steam(x, y) { for (let i = 0; i < 9; i++) { const p = this.add.circle(x + (Math.random() - .5) * 180, y, 16 + Math.random() * 16, 0xe8eef8, .7); this.layer.add(p); this.tweens.add({ targets: p, y: y - 120 - Math.random() * 90, alpha: 0, scale: 2, duration: 900 + Math.random() * 500, onComplete: () => p.destroy() }); } }
  async pull(id) {
    if (this.locked || this.done || this.s.pulled[id]) return;
    this.locked = true; const res = pull(this.s, id), P = this.pins[id];
    ctx.audio.sfx("gear"); await this.tw({ targets: P.c, x: P.dx * 300, y: P.dy * 260, alpha: 0, duration: 320, ease: "Cubic.in" });
    for (const e of res.events) {
      if (e === "quench") { ctx.audio.sfx("whisper"); await this.tw({ targets: this.water, y: A_Y + 16, height: B_Y - A_Y - 22, duration: 420, ease: "Quad.in" }); this.coalGlow.stop(); this.coals.setAlpha(1); this.coals.iterate(c => c.setFillStyle(0x3a3a40).setStrokeStyle(3, 0x1a1a20)); this.steam(SH.x + SH.w / 2, B_Y - 60); }
      else if (e === "toLow") { ctx.audio.sfx("whisper"); await Promise.all([this.tw({ targets: this.water, y: B_Y + 60, height: LOW_B - B_Y - 66, duration: 420, ease: "Quad.in" }), this.tw({ targets: this.coals, y: LOW_B - 30, duration: 420, ease: "Quad.in" })]); }
      else if (e === "toFloat") { ctx.audio.sfx("whisper"); await this.tw({ targets: this.water, x: SH.x + 6, width: FL.x + FL.w - SH.x - 12, y: CH.y + 10, height: LOW_B - CH.y - 16, duration: 600 }); ctx.audio.sfx("unlock"); await Promise.all([this.tw({ targets: this.float, y: FL.y + 60, duration: 900, ease: "Sine.out" }), this.tw({ targets: this.gate, scaleY: .06, duration: 900, ease: "Sine.out" })]); }
      else if (e === "burn") { await this.tw({ targets: this.coals, y: LOW_B - 40, duration: 380, ease: "Quad.in" }); ctx.audio.sfx("hex"); this.drawRope(0xd8263a); this.cameras.main.shake(260, .006); this.steam(SH.x + SH.w / 2, LOW_B - 60); }
      else if (e === "stone") { await this.tw({ targets: this.stone, y: LOW_B - 62, duration: 360, ease: "Quad.in" }); ctx.audio.sfx("stone"); this.cameras.main.shake(300, .008); this.float.setScale(1, .5); }
    }
    if (res.status === "win") { this.note.setText("The float rises. Somewhere a chain takes the strain, and the gate lifts.").setColor("#8fd68a"); this.solved(1300); return; }
    if (res.status === "fail") { ctx.audio.sfx("nope"); this.note.setText(res.why + "\n\nThe works reset themselves.").setColor("#ff9a8a"); this.time.delayedCall(2600, () => { if (!this.done) this.reset(); }); return; }
    this.locked = false;
  }
}
