import { ctx } from "../ctx.js";

/** Conversations. Lines are { who, face, text }; face is 0 Mallow or 1 Fern on the painted strip, a name in ctx.portraits ("wisp"), or omitted. */
export class Dialogue {
  constructor(audio) {
    this.audio = audio;
    this.box = document.getElementById("dialogue");
    this.portrait = document.getElementById("dlg-portrait");
    this.who = document.getElementById("dlg-who");
    this.text = document.getElementById("dlg-text");
    this.active = false; this.lines = []; this.i = 0; this.shown = 0; this.timer = 0; this.done = null;
    const next = e => { if (!this.active) return; e.preventDefault(); this.advance(); };
    this.box.addEventListener("click", next);
    window.addEventListener("keydown", e => { if (this.active && (e.key === "Enter" || e.key === " " || e.key === "e" || e.key === "E")) { e.preventDefault(); e.stopImmediatePropagation(); this.advance(); } }, true);
  }
  play(lines, done) {
    this.lines = lines; this.i = 0; this.done = done || null; this.active = true;
    this.box.hidden = false; this._show();
  }
  _show() {
    const line = this.lines[this.i];
    this.who.textContent = line.who || "";
    if (line.face == null) this.portrait.classList.add("none");
    else if (typeof line.face === "string") { this.portrait.classList.remove("none"); this.portrait.style.backgroundImage = `url(${ctx.portraits[line.face]})`; this.portrait.style.backgroundSize = "cover"; this.portrait.style.backgroundPosition = "center"; }
    else { this.portrait.classList.remove("none"); this.portrait.style.backgroundImage = ""; this.portrait.style.backgroundSize = ""; this.portrait.style.backgroundPosition = (line.face * 50) + "% 0"; }
    this.full = line.text; this.shown = 0; this.text.textContent = "";
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.shown = Math.min(this.full.length, this.shown + 2);
      this.text.textContent = this.full.slice(0, this.shown);
      if (this.shown % 6 === 0) this.audio.sfx("blip");
      if (this.shown >= this.full.length) clearInterval(this.timer);
    }, 26);
  }
  advance() {
    if (this.shown < this.full.length) { clearInterval(this.timer); this.shown = this.full.length; this.text.textContent = this.full; return; }
    this.i++;
    if (this.i < this.lines.length) { this._show(); return; }
    this.active = false; this.box.hidden = true;
    const done = this.done; this.done = null; if (done) done();
  }
}
