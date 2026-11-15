import { ctx } from "../ctx.js";
import { BasePuzzle } from "./BasePuzzle.js";
import { STARS, LINKS, neighbours, tap, allLit, solve, start } from "./chainLogic.js";

const CX = 520, CY = 372, SX = 300, SY = 280, serif = { fontFamily: "Georgia, 'Times New Roman', serif" };
const pos = i => ({ x: CX + STARS[i][0] * SX, y: CY + STARS[i][1] * SY });

/** "The Star Vault": waking a star flips it and every star tied to it. Light all seven. Rules: chainLogic.js. */
export class ChainPuzzle extends BasePuzzle {
  constructor() { super("Chain"); }
  build() {
    this.bannerAt = { x: 1240, y: 34 };
    this.state = start(); this.locked = false; this.taps = 0;
    const g = this.add.graphics(); g.fillStyle(0x070a1c, 1).fillRoundedRect(130, 20, 780, 690, 24); g.lineStyle(4, 0x8a6a2c, 1).strokeRoundedRect(130, 20, 780, 690, 24);
    this.threads = this.add.graphics();
    this.stars = STARS.map((_, i) => {
      const p = pos(i), halo = this.add.image(p.x, p.y, "glow").setBlendMode(Phaser.BlendModes.ADD).setDisplaySize(210, 210);
      const s = this.add.star(p.x, p.y, 5, 22, 52, 0xffffff).setStrokeStyle(5, 0x07060c);
      const z = this.add.zone(p.x, p.y, 150, 150).setInteractive({ useHandCursor: true }); z.on("pointerdown", () => this.wake(i));
      return { s, halo };
    });
    this.label(980, 110, "Tap a star to wake it.\nIt flips itself and every star tied to it.", 30, "#e6d8bd");
    this.label(980, 290, "Light all seven.", 40, "#ffffff");
    const hint = this.add.text(980, 420, "Hint", { ...serif, fontSize: "30px", color: "#241505", backgroundColor: "#d9b46a", padding: { x: 26, y: 14 } }).setInteractive({ useHandCursor: true });
    hint.on("pointerdown", () => this.hint());
    this.paint();
  }
  paint() {
    this.threads.clear();
    for (const [a, b] of LINKS) { const p = pos(a), q = pos(b), on = this.state[a] && this.state[b]; this.threads.lineStyle(on ? 7 : 4, on ? 0xffd23a : 0x3a4a8a, 1).lineBetween(p.x, p.y, q.x, q.y); }
    this.stars.forEach((st, i) => { const on = this.state[i]; st.s.setFillStyle(on ? 0xffd23a : 0x26305c).setScale(on ? 1 : .8); st.halo.setTint(on ? 0xffc040 : 0x3a5ad0).setAlpha(on ? .9 : .25); });
  }
  wake(i) {
    if (this.locked || this.done) return; this.locked = true; this.taps++; ctx.audio.sfx("find");
    const from = pos(i), ns = neighbours(i);
    for (const n of ns) { const to = pos(n), sp = this.add.image(from.x, from.y, "glow").setBlendMode(Phaser.BlendModes.ADD).setDisplaySize(70, 70); this.tweens.add({ targets: sp, x: to.x, y: to.y, duration: 240, onComplete: () => sp.destroy() }); }
    this.time.delayedCall(250, () => {
      tap(this.state, i); this.paint(); ctx.audio.sfx("ward");
      for (const k of [i, ...ns]) this.tweens.add({ targets: this.stars[k].s, angle: "+=72", duration: 260 });
      if (allLit(this.state)) { for (const st of this.stars) this.tweens.add({ targets: st.halo, scale: st.halo.scale * 1.8, alpha: 0, duration: 900 }); this.solved(1200); } else this.locked = false;
    });
  }
  hint() { if (this.done || this.locked) return; const sol = solve(this.state); if (!sol || !sol.length) return; ctx.audio.sfx("hint"); const st = this.stars[sol[0]]; this.tweens.add({ targets: st.s, scale: 1.5, duration: 260, yoyo: true, repeat: 2, onComplete: () => this.paint() }); }
}
