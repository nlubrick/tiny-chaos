import { ctx } from "../ctx.js";
import { BasePuzzle } from "./BasePuzzle.js";

const STEPS = 6, START = [2, 5, 3], TARGET_MIN = 12 * 60 + 12, START_MIN = 3 * 60 + 53;
const GEARS = [{ x: 250, y: 300, r: 118, teeth: 18 }, { x: 452, y: 404, r: 96, teeth: 15 }, { x: 610, y: 280, r: 84, teeth: 12 }];
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

/**
 * "The Grandfather Clock", in two movements.
 *  1. Free the works: each gear has a ruby tooth that must sit under its brass pointer. Turning a gear
 *     drags the next one backwards, so they have to be settled from left to right.
 *  2. Set the hands to the minute the librarian vanished (twelve past twelve) and the clock strikes thirteen.
 */
export class ClockPuzzle extends BasePuzzle {
  constructor() { super("Clock"); }
  build() {
    this.pos = START.slice(); this.minutes = START_MIN; this.stage = 1; this.locked = false;
    const g = this.add.graphics();
    g.fillStyle(0x1a0d08, 1).fillRoundedRect(70, 90, 700, 560, 20); g.lineStyle(4, 0x8a6a2c, 1).strokeRoundedRect(70, 90, 700, 560, 20);
    g.fillStyle(0x2c140c, 1).fillRoundedRect(810, 90, 680, 560, 20); g.lineStyle(4, 0x8a6a2c, 1).strokeRoundedRect(810, 90, 680, 560, 20);

    this.gears = GEARS.map((G, i) => {
      const gr = this.add.graphics({ x: G.x, y: G.y }); this.drawGear(gr, G);
      gr.rotation = this.pos[i] / STEPS * Math.PI * 2;
      const p = this.add.graphics(); p.fillStyle(0xf0d08a, 1).fillTriangle(G.x - 13, G.y - G.r - 30, G.x + 13, G.y - G.r - 30, G.x, G.y - G.r - 6); p.lineStyle(2, 0x3a2a0c, 1).strokeTriangle(G.x - 13, G.y - G.r - 30, G.x + 13, G.y - G.r - 30, G.x, G.y - G.r - 6);
      const zone = this.add.zone(G.x, G.y, G.r * 2 + 30, G.r * 2 + 30).setInteractive(new Phaser.Geom.Circle(G.r + 15, G.r + 15, G.r + 15), Phaser.Geom.Circle.Contains);
      zone.on("pointerdown", () => this.turn(i));
      return gr;
    });
    this.note = this.add.text(420, 560, "", { ...serif, fontSize: "23px", color: "#b7a487", align: "center", wordWrap: { width: 640 }, lineSpacing: 5 }).setOrigin(.5, 0);

    // face
    const FX = 1150, FY = 300, R = 170; this.face = { FX, FY };
    g.fillStyle(0xc2933f, 1).fillCircle(FX, FY, R + 14); g.fillStyle(0xf3e8cc, 1).fillCircle(FX, FY, R); g.lineStyle(2, 0x8a6a2c, 1).strokeCircle(FX, FY, R - 44);
    ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"].forEach((t, i) => { const a = i / 12 * Math.PI * 2; this.add.text(FX + Math.sin(a) * (R - 24), FY - Math.cos(a) * (R - 24), t, { ...serif, fontSize: "24px", color: "#2a1a0c" }).setOrigin(.5); });
    for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, l = i % 5 ? 6 : 0; if (l) { g.lineStyle(1.5, 0x5a4a2c, 1); g.lineBetween(FX + Math.sin(a) * (R - 46), FY - Math.cos(a) * (R - 46), FX + Math.sin(a) * (R - 52), FY - Math.cos(a) * (R - 52)); } }
    this.handG = this.add.graphics(); this.drawHands();
    this.readout = this.add.text(FX, 492, "", { ...serif, fontSize: "26px", color: "#f3e6cf" }).setOrigin(.5);
    this.keys = [];
    this.knob(FX - 150, 580, "Hour", 60); this.knob(FX + 150, 580, "Minute", 1);
    this.count = this.add.text(FX, FY + 70, "", { ...serif, fontSize: "40px", color: "#5a1e2a" }).setOrigin(.5);
    this.refresh();
  }
  drawGear(gr, G) {
    const pts = [], n = G.teeth;
    for (let i = 0; i < n * 4; i++) { const a = i / (n * 4) * Math.PI * 2 - Math.PI / (n * 4) - Math.PI / 2 - Math.PI * 2 / n / 4 * 0, rr = (i % 4 < 2) ? G.r : G.r - 16; pts.push({ x: Math.cos(a) * rr, y: Math.sin(a) * rr }); }
    gr.fillStyle(0xb8892f, 1).fillPoints(pts, true); gr.lineStyle(3, 0x3a2a0c, 1).strokePoints(pts, true);
    gr.fillStyle(0xd9b46a, 1).fillCircle(0, 0, G.r - 26); gr.lineStyle(2, 0x6e4f1a, 1).strokeCircle(0, 0, G.r - 26);
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; gr.fillStyle(0x1a0d08, 1).fillCircle(Math.cos(a) * (G.r - 52), Math.sin(a) * (G.r - 52), G.r * .13); }
    gr.fillStyle(0x6e4f1a, 1).fillCircle(0, 0, 16); gr.fillStyle(0x1a0d08, 1).fillCircle(0, 0, 6);
    gr.fillStyle(0xd8263a, 1).fillCircle(0, -G.r + 30, 11); gr.lineStyle(2, 0x5a0a14, 1).strokeCircle(0, -G.r + 30, 11); gr.fillStyle(0xffffff, .6).fillCircle(-3, -G.r + 27, 3);
  }
  knob(x, y, name, step) {
    this.add.text(x, y - 52, name + " hand", { ...serif, fontSize: "22px", color: "#d9b46a" }).setOrigin(.5);
    for (const dir of [-1, 1]) {
      const b = this.add.text(x + dir * 58, y, dir < 0 ? "◀" : "▶", { ...serif, fontSize: "34px", color: "#241505", backgroundColor: "#d9b46a", padding: { x: 22, y: 10 } }).setOrigin(.5).setInteractive({ useHandCursor: true });
      let timer = null; const stop = () => { if (timer) { timer.remove(); timer = null; } };
      b.on("pointerdown", () => { this.wind(dir * step); stop(); let n = 0; timer = this.time.addEvent({ delay: 110, loop: true, startAt: -280, callback: () => { n++; this.wind(dir * step * (step === 1 && n > 12 ? 2 : 1)); } }); });
      b.on("pointerup", stop); b.on("pointerout", stop); this.input.on("pointerup", stop);
      this.keys.push(b);
    }
  }
  aligned() { return this.pos.every(p => p % STEPS === 0); }
  turn(i) {
    if (this.stage !== 1 || this.locked) return;
    this.pos[i] = (this.pos[i] + 1) % STEPS; if (i < 2) this.pos[i + 1] = (this.pos[i + 1] + STEPS - 1) % STEPS;
    ctx.audio.sfx("gear");
    this.tweens.add({ targets: this.gears[i], rotation: this.gears[i].rotation + Math.PI * 2 / STEPS, duration: 240, ease: "Back.out" });
    if (i < 2) this.tweens.add({ targets: this.gears[i + 1], rotation: this.gears[i + 1].rotation - Math.PI * 2 / STEPS, duration: 240, ease: "Back.out" });
    if (this.aligned()) { this.stage = 2; this.time.delayedCall(320, () => { ctx.audio.sfx("unlock"); this.cameras.main.shake(180, .004); this.refresh(); }); }
  }
  wind(delta) {
    if (this.stage !== 2 || this.locked) { if (this.stage === 1) { ctx.audio.sfx("nope"); this.note.setText("The winding keys will not turn. Something in the works is out of place."); } return; }
    this.minutes = ((this.minutes + delta) % 720 + 720) % 720; ctx.audio.sfx("tick", this.minutes % 2); this.drawHands(); this.refresh();
    if (this.settle) this.settle.remove();
    if (this.minutes === TARGET_MIN % 720) this.settle = this.time.delayedCall(700, () => this.strike());
  }
  strike() {
    this.locked = true; this.keys.forEach(k => k.disableInteractive().setAlpha(.4));
    this.note.setText("The pendulum catches. The clock begins to strike.");
    this.spin = this.tweens.add({ targets: this.gears, rotation: "+=6.283", duration: 5000, repeat: -1 });
    for (let n = 1; n <= 13; n++) this.time.delayedCall(500 + n * 560, () => { ctx.audio.sfx("chime"); this.count.setText(String(n)).setColor(n === 13 ? "#b01828" : "#5a1e2a").setScale(n === 13 ? 1.5 : 1); this.tweens.add({ targets: this.count, alpha: { from: 1, to: .25 }, duration: 520 }); if (n === 13) { this.cameras.main.shake(500, .005); this.note.setText("Thirteen."); } });
    this.time.delayedCall(500 + 14 * 560, () => { ctx.audio.sfx("stone"); this.note.setText("Thirteen. And far off, behind the library fireplace, something heavy moves."); this.solved(2600); });
  }
  drawHands() {
    const { FX, FY } = this.face, g = this.handG, m = this.minutes; g.clear();
    const hand = (a, len, w) => { g.lineStyle(w, 0x1a120a, 1); g.lineBetween(FX - Math.sin(a) * 18, FY + Math.cos(a) * 18, FX + Math.sin(a) * len, FY - Math.cos(a) * len); };
    hand(m / 720 * Math.PI * 2, 88, 9); hand((m % 60) / 60 * Math.PI * 2, 132, 5); g.fillStyle(0x8a6a2c, 1).fillCircle(FX, FY, 10);
  }
  refresh() {
    const h = Math.floor(this.minutes / 60) || 12, mm = String(this.minutes % 60).padStart(2, "0");
    this.readout.setText("The hands read " + h + ":" + mm);
    this.keys.forEach(k => k.setAlpha(this.stage === 2 ? 1 : .45));
    if (this.stage === 1) this.note.setText("Tap a gear to turn it. Each one drags the next gear back a notch. Bring every ruby tooth under its brass pointer.");
    else if (!this.locked) this.note.setText("The works run free. Now set the hands to the minute everything went wrong.\nHer watch stopped at twelve past twelve.");
  }
}
