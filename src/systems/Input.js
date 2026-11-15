/**
 * Exploration input. Movement comes only from the two on-screen buttons or the keyboard, never from
 * touching the scene. Every way a press can end (lift, cancel, leaving the button, the page losing
 * focus) releases the direction, so a walk can never get stuck.
 */
export class Input {
  constructor() {
    this.left = false; this.right = false; this.enabled = false;
    this.onInteract = null;
    this.btnLeft = document.getElementById("btn-left");
    this.btnRight = document.getElementById("btn-right");
    this.btnAct = document.getElementById("btn-act");
    this._bindHold(this.btnLeft, "left");
    this._bindHold(this.btnRight, "right");

    const act = e => { e.preventDefault(); if (this.enabled && this.onInteract) this.onInteract(); };
    this.btnAct.addEventListener("click", act);

    for (const el of [this.btnLeft, this.btnRight, this.btnAct, document.getElementById("stage")]) {
      for (const type of ["contextmenu", "selectstart", "dragstart", "gesturestart"]) el.addEventListener(type, e => e.preventDefault());
    }
    // iOS sometimes swallows pointerup: when the last finger leaves the screen, nothing is held.
    const allUp = e => { if (!e.touches || e.touches.length === 0) this.release(); };
    window.addEventListener("touchend", allUp, { passive: true });
    window.addEventListener("touchcancel", () => this.release(), { passive: true });
    window.addEventListener("blur", () => this.release());
    window.addEventListener("pagehide", () => this.release());
    document.addEventListener("visibilitychange", () => { if (document.hidden) this.release(); });

    this.keys = { left: false, right: false };
    window.addEventListener("keydown", e => {
      if (e.repeat) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") this.keys.left = true;
      else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") this.keys.right = true;
      else if ((e.key === "e" || e.key === "E" || e.key === "Enter" || e.key === " ") && this.enabled && this.onInteract && !this.btnAct.hidden) { e.preventDefault(); this.onInteract(); }
    });
    window.addEventListener("keyup", e => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") this.keys.left = false;
      else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") this.keys.right = false;
    });
  }

  _bindHold(btn, dir) {
    const down = e => { e.preventDefault(); try { btn.setPointerCapture(e.pointerId); } catch (err) { /* older browsers */ } this[dir] = true; btn.classList.add("down"); };
    const up = () => { this[dir] = false; btn.classList.remove("down"); };
    btn.addEventListener("pointerdown", down);
    for (const type of ["pointerup", "pointercancel", "lostpointercapture", "pointerleave"]) btn.addEventListener(type, up);
    btn.addEventListener("touchstart", e => e.preventDefault(), { passive: false });   // no long-press callout, no synthetic click
  }

  release() {
    this.left = this.right = false; this.keys.left = this.keys.right = false;
    this.btnLeft.classList.remove("down"); this.btnRight.classList.remove("down");
  }
  /** -1, 0 or 1. Zero whenever exploration is switched off (dialogue, puzzles, menus). */
  axis() { return this.enabled ? ((this.right || this.keys.right) ? 1 : 0) - ((this.left || this.keys.left) ? 1 : 0) : 0; }
  setEnabled(on) { this.enabled = on; if (!on) this.release(); document.getElementById("pad").hidden = !on; if (!on) this.btnAct.hidden = true; }
  showAction(label) { if (!this.enabled || !label) { this.btnAct.hidden = true; return; } if (this.btnAct.textContent !== label) this.btnAct.textContent = label; this.btnAct.hidden = false; }
}
