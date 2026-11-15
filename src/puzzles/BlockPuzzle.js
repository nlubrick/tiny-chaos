import { ctx } from "../ctx.js";
import { BasePuzzle } from "./BasePuzzle.js";
import { AISLE, SIZE, range, slide, solved } from "./blockLogic.js";

const CELL = 108, X0 = 250, Y0 = 36, serif = { fontFamily: "Georgia, 'Times New Roman', serif" };
const px = c => X0 + c * CELL, py = r => Y0 + r * CELL;

/** "The Archive Aisle": drag crates along their length to clear a way out for the brass trolley. Rules: blockLogic.js. */
export class BlockPuzzle extends BasePuzzle {
  constructor() { super("Block"); }
  build() {
    this.bannerAt = { x: 1240, y: 34 };
    const g = this.add.graphics(), W = SIZE * CELL;
    g.fillStyle(0x17171d, 1).fillRoundedRect(X0 - 16, Y0 - 16, W + 32, W + 32, 16); g.lineStyle(4, 0x6f6a70, 1).strokeRoundedRect(X0 - 16, Y0 - 16, W + 32, W + 32, 16);
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) g.fillStyle((r + c) % 2 ? 0x22232a : 0x282932, 1).fillRect(px(c) + 2, py(r) + 2, CELL - 4, CELL - 4);
    g.fillStyle(0x07060c, 1).fillRect(X0 + W + 12, py(2) + 6, 10, CELL - 12);   // the gap in the frame
    this.add.text(X0 + W + 30, py(2) + CELL / 2, "▶▶", { fontSize: "44px", color: "#ffd23a" }).setOrigin(0, .5);
    this.label(1040, 110, "Slide the crates out of the way.\nGet the brass trolley out through the gap.", 30, "#e6d8bd").setWordWrapWidth(480);
    this.label(1040, 330, "Crates only slide along their length.", 26, "#b7a487").setWordWrapWidth(480);
    this.moves = 0; this.count = this.label(1040, 430, "Moves: 0", 40, "#ffffff");
    const again = this.add.text(1040, 530, "Start over", { ...serif, fontSize: "30px", color: "#241505", backgroundColor: "#d9b46a", padding: { x: 26, y: 14 } }).setInteractive({ useHandCursor: true });
    again.on("pointerdown", () => { if (!this.done) { ctx.audio.sfx("swap"); this.setup(); } });
    this.sprites = []; this.setup();
    this.input.on("pointermove", p => this.dragMove(p)); this.input.on("pointerup", p => this.dragEnd(p));
  }
  setup() {
    this.sprites.forEach(s => s.destroy()); this.sprites = []; this.blocks = AISLE(); this.moves = 0; this.count.setText("Moves: 0"); this.drag = null;
    for (const b of this.blocks) {
      const w = (b.dir === "H" ? b.len : 1) * CELL - 10, h = (b.dir === "V" ? b.len : 1) * CELL - 10, c = this.add.container(px(b.c) + 5, py(b.r) + 5), g = this.add.graphics();
      if (b.key) { g.fillStyle(0xe8b93a, 1).fillRoundedRect(0, 0, w, h, 16).lineStyle(6, 0xfff0a8, 1).strokeRoundedRect(0, 0, w, h, 16); g.fillStyle(0x5a3c00, 1).fillCircle(34, h - 14, 14).fillCircle(w - 34, h - 14, 14); g.fillStyle(0x5a3c00, 1).fillTriangle(w / 2 - 22, h / 2 - 30, w / 2 - 22, h / 2 + 14, w / 2 + 26, h / 2 - 8); }
      else { g.fillStyle(0x6a3a22, 1).fillRoundedRect(0, 0, w, h, 8).lineStyle(5, 0x1c0c07, 1).strokeRoundedRect(0, 0, w, h, 8); g.lineStyle(4, 0x2c140c, 1).strokeRect(10, 10, w - 20, h - 20); const n = b.len; for (let i = 1; i < n; i++) b.dir === "H" ? g.lineBetween(i * CELL - 5, 10, i * CELL - 5, h - 10) : g.lineBetween(10, i * CELL - 5, w - 10, i * CELL - 5); g.lineStyle(3, 0x8a5a3a, .5); b.dir === "H" ? g.lineBetween(16, h / 2, w - 16, h / 2) : g.lineBetween(w / 2, 16, w / 2, h - 16); }
      c.add(g); c.setSize(w, h); c.setInteractive(new Phaser.Geom.Rectangle(w / 2, h / 2, w, h), Phaser.Geom.Rectangle.Contains);
      c.on("pointerdown", p => { if (this.done) return; this.drag = { b, c, sx: p.x, sy: p.y, ...range(this.blocks, b.id), ox: c.x, oy: c.y }; });
      this.sprites.push(c);
    }
  }
  offset(p, d = this.drag) { const raw = d.b.dir === "H" ? p.x - d.sx : p.y - d.sy; return Phaser.Math.Clamp(raw, d.min * CELL, d.max * CELL); }
  dragMove(p) { if (!this.drag || !p.isDown) return; const o = this.offset(p); if (this.drag.b.dir === "H") this.drag.c.x = this.drag.ox + o; else this.drag.c.y = this.drag.oy + o; }
  dragEnd(p) {
    const d = this.drag; if (!d) return; this.drag = null;
    const cells = Math.round(this.offset(p, d) / CELL);
    if (cells && slide(this.blocks, d.b.id, cells)) { this.moves++; this.count.setText("Moves: " + this.moves); ctx.audio.sfx("gear"); }
    this.tweens.add({ targets: d.c, x: px(d.b.c) + 5, y: py(d.b.r) + 5, duration: 90 });
    if (solved(this.blocks)) { this.tweens.add({ targets: d.c, x: px(SIZE) + 200, duration: 700, ease: "Cubic.in", delay: 100 }); ctx.audio.sfx("unlock"); this.solved(1000); }
  }
}
