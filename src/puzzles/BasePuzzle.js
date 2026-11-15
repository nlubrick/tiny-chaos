import { ctx } from "../ctx.js";
import { VIEW_W, VIEW_H } from "../config.js";

/**
 * What every puzzle scene shares. A new puzzle extends this and supplies:
 *   build(config)   draw the puzzle and wire its input
 *   (its own rule for when it is solved, calling this.solved() once)
 * and gets the backdrop, the title banner, the fade in, and the hand-back to the world for free.
 */
export class BasePuzzle extends Phaser.Scene {
  init(data) { this.puzzleId = data.id; this.config = data.config || {}; this.done = false; }
  create() {
    this.add.rectangle(0, 0, VIEW_W, VIEW_H, 0x07060c, 1).setOrigin(0, 0).setInteractive();   // swallows touches so nothing reaches the world
    this.build(this.config);
    this.banner(this.config.title || "");
    this.cameras.main.fadeIn(380, 4, 3, 8);
  }
  banner(text) {
    const at = this.bannerAt || { x: VIEW_W / 2, y: 30 };   // a puzzle that needs the top of the screen can move its title
    this.add.text(at.x, at.y, text, { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "34px", color: "#f6e3b8", stroke: "#000", strokeThickness: 5 }).setOrigin(.5, 0).setDepth(50);
  }
  label(x, y, text, size = 24, color = "#f3e6cf") { return this.add.text(x, y, text, { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: size + "px", color, wordWrap: { width: 560 }, lineSpacing: 6 }); }
  /** Call once when the puzzle's own win condition is met. */
  solved(delay = 900) {
    if (this.done) return; this.done = true;
    ctx.audio.sfx("success");
    this.time.delayedCall(delay, () => { this.cameras.main.fadeOut(420, 4, 3, 8); this.cameras.main.once("camerafadeoutcomplete", () => ctx.puzzles.finish(true)); });
  }
}
