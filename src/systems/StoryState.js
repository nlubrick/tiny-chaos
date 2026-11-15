import { SAVE_KEY } from "../config.js";

/** Chapter progress: a bag of named flags, saved locally so a reload keeps solved puzzles and opened doors. */
export class StoryState {
  constructor() { this.flags = {}; this.listeners = []; this.playerX = null; }

  load() {
    try {
      const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
      if (raw && typeof raw === "object") { this.flags = raw.flags || {}; this.playerX = typeof raw.playerX === "number" ? raw.playerX : null; return true; }
    } catch (e) { /* storage unavailable: play without saving */ }
    return false;
  }
  save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ flags: this.flags, playerX: this.playerX })); } catch (e) { /* ignore */ } }
  reset() { this.flags = {}; this.playerX = null; try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ } }
  hasSave() { return Object.keys(this.flags).length > 0; }

  has(flag) { return !!this.flags[flag]; }
  set(flag, value = true) {
    if (this.flags[flag] === value) return;
    this.flags[flag] = value; this.save();
    for (const fn of this.listeners) fn(flag, value);
  }
  onChange(fn) { this.listeners.push(fn); }

  /** A condition is a flag name, "!flag", or an array of those that must all hold. */
  test(cond) {
    if (!cond) return true;
    if (Array.isArray(cond)) return cond.every(c => this.test(c));
    return cond[0] === "!" ? !this.has(cond.slice(1)) : this.has(cond);
  }
}
