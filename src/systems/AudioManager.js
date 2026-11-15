import { MUSIC_TRACKS } from "../config.js";

/**
 * Music and sound.
 * Music is the three original Kevin MacLeod recordings, streamed in order through one <audio> element that
 * lives outside the game scenes, so it never restarts when a room or puzzle changes.
 * Sound effects are small synthesised sounds (Web Audio) with their own volume.
 */
export class AudioManager {
  constructor() {
    this.musicOn = true; this.musicVol = .45; this.sfxVol = .7; this.track = 0; this.started = false; this.failed = false;
    try {
      const s = JSON.parse(localStorage.getItem("mystery-manor-audio") || "{}");
      if (typeof s.musicOn === "boolean") this.musicOn = s.musicOn;
      if (typeof s.musicVol === "number") this.musicVol = s.musicVol;
      if (typeof s.sfxVol === "number") this.sfxVol = s.sfxVol;
    } catch (e) { /* defaults */ }
    this.el = new Audio(); this.el.preload = "none"; this.el.volume = this.musicVol;
    this.el.addEventListener("ended", () => { this.track = (this.track + 1) % MUSIC_TRACKS.length; this._load(); if (this.musicOn) this._play(); });
    this.el.addEventListener("error", () => { this.failed = true; this._label(); });
    this.el.addEventListener("playing", () => { this.failed = false; this._label(); });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { this.el.pause(); if (this.ctx && this.ctx.state === "running") this.ctx.suspend(); }
      else if (this.started) { if (this.musicOn) this._play(); if (this.ctx) this.ctx.resume(); }
    });
    this.ctx = null; this.loops = {};
    this._load();
  }
  _save() { try { localStorage.setItem("mystery-manor-audio", JSON.stringify({ musicOn: this.musicOn, musicVol: this.musicVol, sfxVol: this.sfxVol })); } catch (e) { /* ignore */ } }
  _load() { this.el.src = MUSIC_TRACKS[this.track].url; this._label(); }
  _play() { const p = this.el.play(); if (p && p.catch) p.catch(() => { this.failed = true; this._label(); }); }
  _label() {
    const el = document.getElementById("now-playing"); if (!el) return;
    el.textContent = this.failed ? "The music could not be reached just now. It will try again when you switch it on." : "Now playing: " + MUSIC_TRACKS[this.track].title + ", Kevin MacLeod";
  }

  /** Call from a tap or key press: browsers only let sound start from a user gesture. */
  unlock() {
    this.started = true;
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC(); this.out = this.ctx.createGain(); this.out.gain.value = this.sfxVol; this.out.connect(this.ctx.destination);
        this.noise = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
        const ch = this.noise.getChannelData(0); for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
      } catch (e) { this.ctx = null; }
    }
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    if (this.musicOn && this.el.paused) this._play();
  }
  setMusicOn(on) { this.musicOn = on; if (on) { if (this.failed) this._load(); this._play(); } else this.el.pause(); this._save(); }
  setMusicVolume(v) { this.musicVol = v; this.el.volume = v; this._save(); }
  setSfxVolume(v) { this.sfxVol = v; if (this.out) this.out.gain.value = v; this._save(); }

  // ---- synthesised effects ----
  _tone(type, f0, f1, dur, vol, delay = 0) {
    const t = this.ctx.currentTime + delay, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(vol, t + Math.min(.02, dur / 4)); g.gain.exponentialRampToValueAtTime(.0008, t + dur);
    o.connect(g); g.connect(this.out); o.start(t); o.stop(t + dur + .05);
  }
  _hush(dur, vol, kind, freq, delay = 0, q = 1) {
    const t = this.ctx.currentTime + delay, n = this.ctx.createBufferSource(), f = this.ctx.createBiquadFilter(), g = this.ctx.createGain();
    n.buffer = this.noise; f.type = kind; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(vol, t + Math.min(.05, dur / 3)); g.gain.exponentialRampToValueAtTime(.0008, t + dur);
    n.connect(f); f.connect(g); g.connect(this.out); n.start(t, Math.random()); n.stop(t + dur + .05);
  }
  sfx(name, arg) {
    if (!this.ctx || this.ctx.state !== "running") return;
    try {
      switch (name) {
        case "blip": this._tone("triangle", 420 + Math.random() * 60, 0, .04, .03); break;
        case "step": this._hush(.06, .1, "lowpass", 500 + Math.random() * 200); break;
        case "prompt": this._tone("sine", 660, 0, .12, .08); this._tone("sine", 990, 0, .18, .06, .08); break;
        case "find": this._tone("triangle", 784, 0, .14, .16); this._tone("triangle", 1175, 0, .26, .14, .1); break;
        case "miss": this._hush(.08, .08, "bandpass", 900); break;
        case "hint": this._tone("sine", 1320, 880, .5, .08); break;
        case "swap": this._tone("sine", 520, 660, .08, .08); break;
        case "nope": this._tone("square", 180, 140, .12, .05); break;
        case "match": this._tone("triangle", 600 + (arg || 0) * 90, 0, .16, .13); this._hush(.12, .06, "highpass", 4000); break;
        case "hex": this._hush(.6, .5, "lowpass", 900); this._tone("sine", 160, 40, .55, .5); this._tone("sawtooth", 880, 220, .45, .07); break;
        case "ward": this._tone("sine", 1400, 500, .3, .1); this._hush(.2, .1, "highpass", 5000); break;
        case "unlock": this._hush(.25, .3, "bandpass", 700, 0, 3); this._tone("square", 140, 90, .2, .12, .05); this._hush(.9, .25, "bandpass", 300, .25, 4); break;
        case "gear": this._hush(.09, .2, "bandpass", 1800, 0, 6); this._hush(.09, .16, "bandpass", 1500, .09, 6); this._hush(.09, .12, "bandpass", 1300, .18, 6); break;
        case "tick": this._hush(.03, .14, "bandpass", arg ? 2100 : 2600, 0, 8); break;
        case "chime": this._tone("sine", 196, 0, 2.2, .3); this._tone("sine", 392, 0, 1.8, .14); this._tone("sine", 588, 0, 1.2, .07); break;
        case "stone": this._hush(1.8, .5, "lowpass", 220, 0, 2); this._tone("sawtooth", 60, 44, 1.6, .12); break;
        case "thunder": this._hush(2.6, .5, "lowpass", 180, 0, 1); this._hush(1.4, .3, "lowpass", 90, .4, 1); break;
        case "whisper": this._hush(1.2, .09, "bandpass", 2400, 0, 5); this._hush(.9, .06, "bandpass", 3100, .5, 6); break;
        case "success": [523, 659, 784, 1047].forEach((f, i) => this._tone("triangle", f, 0, .5, .15, i * .12)); break;
        case "mew": this._tone("sine", 700, 980, .12, .1); this._tone("sine", 980, 620, .2, .1, .11); break;
        case "scrape": this._hush(.7, .22, "bandpass", 420, 0, 5); break;
      }
    } catch (e) { /* a failed sound must never stop the game */ }
  }
  /** A continuous bed (fire, rain) whose loudness the world sets every frame. */
  loop(name, level) {
    if (!this.ctx) return;
    let L = this.loops[name];
    if (!L) {
      const n = this.ctx.createBufferSource(), f = this.ctx.createBiquadFilter(), g = this.ctx.createGain();
      n.buffer = this.noise; n.loop = true;
      if (name === "fire") { f.type = "bandpass"; f.frequency.value = 900; f.Q.value = .6; }
      else { f.type = "highpass"; f.frequency.value = 2600; }
      g.gain.value = 0; n.connect(f); f.connect(g); g.connect(this.out); n.start();
      L = this.loops[name] = { g };
    }
    L.g.gain.setTargetAtTime(level, this.ctx.currentTime, .25);
  }
}
