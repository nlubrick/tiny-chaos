import { ctx } from "../ctx.js";
import { VIEW_W } from "../config.js";
import { BasePuzzle } from "./BasePuzzle.js";

/** Find the listed things on the librarian's desk. Targets and their hiding places are plain data. */
const TARGETS = [
  { key: "ho-key",    name: "Strange key",    x: 418,  y: 504, rot: -24, cover: { x: 520, y: 430, rot: -8 } },
  { key: "ho-letter", name: "Torn letter",    x: 992,  y: 452, rot: 14 },
  { key: "ho-seal",   name: "Wax seal",       x: 1262, y: 546, rot: 0 },
  { key: "ho-watch",  name: "Pocket watch",   x: 196,  y: 262, rot: -12 },
  { key: "ho-specs",  name: "Her spectacles", x: 668,  y: 388, rot: 6 }
];
export class HiddenObjectPuzzle extends BasePuzzle {
  constructor() { super("HiddenObject"); }
  build() {
    const bg = this.add.image(0, 0, "desk-bg").setOrigin(0, 0).setInteractive();
    bg.on("pointerdown", p => { if (!this.done) { ctx.audio.sfx("miss"); const d = this.add.circle(p.x, p.y, 10, 0xffffff, .25); this.tweens.add({ targets: d, scale: 2.4, alpha: 0, duration: 380, onComplete: () => d.destroy() }); } });
    this.left = TARGETS.length; this.items = [];
    this.add.rectangle(0, 640, VIEW_W, 80, 0x07060c, .82).setOrigin(0, 0).setDepth(20);
    TARGETS.forEach((t, i) => {
      const img = this.add.image(t.x, t.y, t.key).setAngle(t.rot).setDepth(5);
      img.setInteractive(new Phaser.Geom.Rectangle(-24, -24, img.width + 48, img.height + 48), Phaser.Geom.Rectangle.Contains);
      if (t.cover) this.add.image(t.cover.x, t.cover.y, "ho-cover").setAngle(t.cover.rot).setDepth(6);
      const slotX = 250 + i * 235;
      const text = this.add.text(slotX, 680, t.name, { fontFamily: "Georgia, serif", fontSize: "24px", color: "#f3e6cf" }).setOrigin(.5).setDepth(21);
      const item = { t, img, text, found: false, slotX };
      img.on("pointerdown", (p, lx, ly, e) => { e.stopPropagation(); this.find(item); });
      this.items.push(item);
    });
    const hint = this.add.text(VIEW_W - 30, 96, "Hint", { fontFamily: "Georgia, serif", fontSize: "24px", color: "#d9b46a", backgroundColor: "#120d14", padding: { x: 18, y: 10 } }).setOrigin(1, 0).setDepth(22).setInteractive({ useHandCursor: true });
    hint.on("pointerdown", (p, lx, ly, e) => { e.stopPropagation(); this.hint(); });
  }
  find(item) {
    if (item.found || this.done) return;
    item.found = true; this.left--; ctx.audio.sfx("find");
    item.img.disableInteractive().setDepth(30);
    this.tweens.add({ targets: item.img, x: item.slotX, y: 606, angle: 0, scale: .5, duration: 600, ease: "Cubic.inOut" });
    item.text.setColor("#8fd68a").setText("✓ " + item.t.name);
    if (this.left === 0) this.solved(1100);
  }
  hint() {
    const item = this.items.find(i => !i.found); if (!item || this.done) return;
    ctx.audio.sfx("hint");
    const g = this.add.image(item.img.x, item.img.y, "glow").setDisplaySize(260, 260).setTint(0xffe7a8).setBlendMode(Phaser.BlendModes.ADD).setDepth(25).setAlpha(0);
    this.tweens.add({ targets: g, alpha: .8, duration: 420, yoyo: true, repeat: 2, onComplete: () => g.destroy() });
  }
}
