import { ctx } from "../ctx.js";

/**
 * Runs puzzles. A puzzle is a Phaser scene that follows one lifecycle:
 *   start(id)  ->  the scene's create() builds it from its config  ->  the player plays
 *   ->  the scene calls ctx.puzzles.finish(true) when its own win check passes, or finish(false) to step back
 *   ->  the world resumes exactly where it was, and the solved flag is set.
 * The manager knows nothing about what any puzzle does, so new kinds can be added without touching the others.
 */
export class PuzzleManager {
  constructor(game, defs) { this.game = game; this.defs = defs; this.active = null; this.leaveBtn = document.getElementById("btn-leave"); this.leaveBtn.addEventListener("click", () => this.finish(false)); }
  start(id, world, done) {
    const def = this.defs[id];
    if (!def || this.active) { if (done) done(false); return; }
    this.active = { id, def, world, done };
    ctx.input.setEnabled(false);
    world.scene.pause();
    this.leaveBtn.hidden = false;
    world.scene.launch(def.scene, { id, config: def.config || {} });
  }
  finish(success) {
    const a = this.active; if (!a) return;
    this.active = null; this.leaveBtn.hidden = true;
    this.game.scene.stop(a.def.scene);
    a.world.scene.resume();
    if (success) ctx.state.set(a.def.solved);
    if (a.done) a.done(success);
  }
}
