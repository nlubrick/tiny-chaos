import { ctx } from "../ctx.js";
import { VIEW_W, VIEW_H, ROOM_W, FLOOR_Y } from "../config.js";
import { ROOMS, WALK_MIN, WALK_MAX, INTERACTABLES, TRIGGERS, LIGHTS, WINDOWS, FOREGROUND, PUZZLES, BLOCKERS } from "../data/world.js";
import { SCRIPTS, CUTSCENE_LINES, CARDS } from "../data/story.js";
import { MALLOW, FERN } from "../art/characters.js";

const ACCEL = 1500, DECEL = 2100, MAX_SPEED = 340, LOOK_AHEAD = 150;
const roomOf = id => ROOMS.find(r => r.id === id);

/** Side-scrolling exploration: Mallow, the camera, the four rooms, and everything that can be walked up to. */
export class WorldScene extends Phaser.Scene {
  constructor() { super("World"); }

  create() {
    const S = ctx.state;
    this.busy = true; this.vx = 0; this.facing = 1; this.stepT = 0; this.current = null; this.offer = null;

    // Storm outside: sky, rain and lightning sit behind the walls and show through the window holes.
    this.sky = this.add.image(0, 40, "sky").setOrigin(0, 0).setDisplaySize(2000, 560).setScrollFactor(0).setDepth(0);
    this.rain = this.add.tileSprite(0, 0, VIEW_W, VIEW_H, "rain").setOrigin(0, 0).setScrollFactor(0).setDepth(1).setAlpha(.9);
    this.flash = this.add.rectangle(0, 0, VIEW_W, VIEW_H, 0xcfdcff).setOrigin(0, 0).setScrollFactor(0).setDepth(1.5).setAlpha(0);

    for (const r of ROOMS) this.add.image(r.x0, 0, "room-" + r.id).setOrigin(0, 0).setDepth(2);

    for (const id in WINDOWS) for (const wx of WINDOWS[id]) {
      const x0 = roomOf(id).x0;
      for (const side of [-1, 1]) {
        const c = this.add.image(x0 + wx + 95 + side * 128, 62, "curtain").setOrigin(.5, 0).setDepth(3).setFlipX(side > 0);
        this.tweens.add({ targets: c, scaleX: { from: .96, to: 1.07 }, duration: 2600 + Math.random() * 900, yoyo: true, repeat: -1, ease: "Sine.inOut", delay: Math.random() * 900 });
      }
    }

    // Lights
    this.fireGlow = null;
    for (const L of LIGHTS) {
      const x = roomOf(L.room).x0 + L.x, tint = L.kind === "blue" ? 0x6f95ff : L.kind === "fire" ? 0xff8a3a : 0xffc56a;
      const size = L.kind === "fire" ? 620 : L.kind === "blue" ? 520 : L.kind === "torch" ? 460 : L.kind === "lamp" ? 300 : 230;
      const g = this.add.image(x, L.y, "glow").setDisplaySize(size, size).setTint(tint).setBlendMode(Phaser.BlendModes.ADD).setDepth(12).setAlpha(L.kind === "fire" ? .5 : .34);
      this.tweens.add({ targets: g, alpha: g.alpha * .72, scale: g.scale * 1.05, duration: 160 + Math.random() * 260, yoyo: true, repeat: -1, ease: "Sine.inOut", repeatDelay: Math.random() * 200 });
      if (L.kind === "torch") this.add.sprite(x, L.y + 4, "flame0").setScale(.62).setOrigin(.5, 1).setDepth(4).play({ key: "flame", startFrame: Math.floor(Math.random() * 4) });
      if (L.kind === "candle") this.add.sprite(x, L.y - 2, "flame0").setScale(.32).setOrigin(.5, 1).setDepth(4).play({ key: "flame", startFrame: Math.floor(Math.random() * 4) });
      if (L.kind === "fire") { this.fireGlow = g; for (const [dx, s] of [[-34, .9], [0, 1.25], [36, .85]]) this.add.sprite(x + dx, WALL_FIRE_Y, "flame0").setScale(s).setOrigin(.5, 1).setDepth(4).play({ key: "flame", startFrame: Math.floor(Math.random() * 4) }); }
    }

    // Doors and other things that change with the story
    const lib = roomOf("library"), hall = roomOf("hall"), gal = roomOf("gallery"), att = roomOf("attic");
    this.libDoor = this.add.image(lib.x0 + 2040 - 92, 196, S.has("doorOpen") ? "door-open" : "door-closed").setOrigin(0, 0).setDepth(3);
    this.runes = this.add.image(lib.x0 + 2040 - 92, 196, "runes").setOrigin(0, 0).setDepth(3.5).setBlendMode(Phaser.BlendModes.ADD).setVisible(!S.has("doorOpen"));
    this.tweens.add({ targets: this.runes, alpha: .45, duration: 1300, yoyo: true, repeat: -1, ease: "Sine.inOut" });
    this.add.image(hall.x0 + 180 - 92, 196, "door-open").setOrigin(0, 0).setDepth(3);
    this.add.image(gal.x0 + 2040 - 92, 196, "door-closed").setOrigin(0, 0).setDepth(3);
    this.add.image(att.x0 + 180 - 92, 196, "door-open").setOrigin(0, 0).setDepth(3);

    // Painted portraits hung in the drawn frames
    this.add.image(lib.x0 + 400, 162, "faces", 2).setDisplaySize(136, 194).setDepth(2.5);
    this.add.image(hall.x0 + 990, 238, "faces", 0).setDisplaySize(120, 172).setDepth(2.5);

    this.panel = this.add.image(lib.x0 + 590, 332, "panel").setOrigin(0, 0).setDepth(3);
    this.panelOpen = 0; if (S.has("passageShown")) this._setPanel(1);

    // Chapter Two fixtures
    const st = roomOf("stair"), uc = roomOf("undercroft"), va = roomOf("vault");
    this.gate = this.add.image(st.x0 + 2040, 160, "gate").setOrigin(.5, 0).setDisplaySize(226, 450).setDepth(3); this.gateScale = this.gate.scaleY; if (S.has("gateOpen")) this.gate.scaleY = this.gateScale * .08;
    this.jam = this.add.image(uc.x0 + 1400, FLOOR_Y + 6, "jam").setOrigin(.5, 1).setScale(1.25).setDepth(9.5).setVisible(!S.has("aisleClear"));
    this.rings = this.add.image(va.x0 + 1150, 330, "rings").setScale(.86).setDepth(3).setAlpha(S.has("orreryLit") ? 1 : .55);
    this.ringsGlow = this.add.image(va.x0 + 1150, 330, "glow").setDisplaySize(700, 700).setTint(0x8fb8ff).setBlendMode(Phaser.BlendModes.ADD).setDepth(12).setAlpha(S.has("orreryLit") ? .5 : 0);
    this.wisp2 = this.add.sprite(uc.x0 + 1040, 380, "wisp0").setDepth(8).setAlpha(S.has("wispBelow") ? .82 : 0).setFlipX(true).play("wisp");
    this.tweens.add({ targets: this.wisp2, y: 356, duration: 2400, yoyo: true, repeat: -1, ease: "Sine.inOut" });

    this.clockX = hall.x0 + 1780;
    this.pendulum = this.add.image(this.clockX, 356, "pendulum").setOrigin(.5, 0).setDepth(3);
    this.add.image(this.clockX, 240, "clockface").setDepth(3);
    this.hands = this.add.graphics().setDepth(3.2);
    this.clockRunning = S.has("clockSolved"); this.clockMinutes = this.clockRunning ? 12 * 60 + 12 : 3 * 60 + 53;

    // The household
    this.fern = this.add.image(hall.x0 + 1110, FLOOR_Y, "fern").setOrigin(FERN.originX, FERN.originY).setDepth(8);
    this.lantern = this.add.image(this.fern.x - 62, FLOOR_Y - 130, "lantern").setOrigin(.5, 0).setScale(.62).setDepth(8.1);
    this.lanternGlow = this.add.image(this.lantern.x, this.lantern.y + 34, "glow").setDisplaySize(340, 340).setTint(0xffc56a).setBlendMode(Phaser.BlendModes.ADD).setDepth(12).setAlpha(.4);
    this.tweens.add({ targets: this.fern, scaleY: 1.012, duration: 2100, yoyo: true, repeat: -1, ease: "Sine.inOut" });
    this.tweens.add({ targets: this.lantern, angle: { from: -3, to: 3 }, duration: 1900, yoyo: true, repeat: -1, ease: "Sine.inOut" });

    this.wisp = this.add.sprite(gal.x0 + 1150, 380, "wisp0").setDepth(8).setAlpha(S.has("sawWisp") ? .82 : 0).play("wisp");
    this.wispGlow = this.add.image(this.wisp.x, 380, "glow").setDisplaySize(560, 560).setTint(0x8fb8ff).setBlendMode(Phaser.BlendModes.ADD).setDepth(12).setAlpha(S.has("sawWisp") ? .3 : 0);
    this.tweens.add({ targets: [this.wisp, this.wispGlow], y: 356, duration: 2400, yoyo: true, repeat: -1, ease: "Sine.inOut" });

    this.shadow = this.add.ellipse(0, FLOOR_Y + 2, 150, 16, 0x000000, .45).setDepth(9);
    this.player = this.add.sprite(0, FLOOR_Y, "mallow-i0").setOrigin(MALLOW.originX, MALLOW.originY).setDepth(10).play("mallow-idle");
    this.marker = this.add.image(0, 0, "glow").setDisplaySize(46, 46).setTint(0xffe7a8).setBlendMode(Phaser.BlendModes.ADD).setDepth(13).setVisible(false);
    this.tweens.add({ targets: this.marker, scale: this.marker.scale * 1.5, alpha: .45, duration: 800, yoyo: true, repeat: -1, ease: "Sine.inOut" });

    this.fg = FOREGROUND.map(f => ({ room: roomOf(f.room), x: f.x, img: this.add.image(0, VIEW_H + 150, "plant").setOrigin(.5, 1).setDepth(20).setScale(.9) }));
    this.dust = this.add.particles(0, 0, "glow", { x: { min: 0, max: VIEW_W }, y: { min: 60, max: 600 }, lifespan: 9000, speedX: { min: -8, max: 8 }, speedY: { min: -6, max: 3 }, scale: { min: .012, max: .03 }, alpha: { start: 0, end: 0, ease: t => Math.sin(t * Math.PI) * .5 }, frequency: 260, tint: 0xffe0b0, blendMode: "ADD" }).setScrollFactor(0).setDepth(21);
    this.add.image(0, 0, "vignette").setOrigin(0, 0).setDisplaySize(VIEW_W, VIEW_H).setScrollFactor(0).setDepth(30);

    const startX = S.playerX != null ? S.playerX : lib.x0 + lib.start;
    this.player.x = startX; this._enterRoom(ROOMS.find(r => startX >= r.x0 && startX < r.x0 + ROOM_W) || lib, true);
    this.cameras.main.scrollX = this._camTarget();
    this.cameras.main.fadeIn(900, 4, 3, 8);

    ctx.input.onInteract = () => this._interact();
    this.time.delayedCall(950, () => this._free());
    this._scheduleLightning();
    this.events.on("resume", () => { ctx.input.release(); });
    this.events.once("shutdown", () => { ctx.input.onInteract = null; ctx.input.setEnabled(false); });
    this._drawHands();
  }

  /* ---------- story steps ---------- */
  /** Runs a list of steps in order (see data/world.js), then gives control back to the player. */
  run(steps, done) {
    this.busy = true; ctx.input.setEnabled(false); this.vx = 0;
    let i = 0;
    const next = () => {
      if (i >= steps.length) { if (done) done(); else this._free(); return; }
      const [op, a, b] = steps[i++];
      if (op === "say") ctx.dialogue.play(SCRIPTS[a] || CUTSCENE_LINES[a], next);
      else if (op === "set") { ctx.state.set(a); this._storyChanged(a); next(); }
      else if (op === "sfx") { ctx.audio.sfx(a); next(); }
      else if (op === "toast") { ctx.ui.toast(a, 4200); next(); }
      else if (op === "go") this._go(a, b, next);
      else if (op === "card") ctx.ui.showCard(CARDS[a], next);
      else if (op === "cutscene") this["_cut_" + a](next);
      else if (op === "puzzle") ctx.puzzles.start(a, this, ok => { if (!ok) { this._free(); return; } this._storyChanged(PUZZLES[a].solved); steps = PUZZLES[a].after.concat(steps.slice(i)); i = 0; next(); });
      else next();
    };
    next();
  }
  _free() { this.busy = false; ctx.state.playerX = this.player.x; ctx.state.save(); ctx.input.setEnabled(true); }

  /** The world reacting to a flag: this is where solved puzzles change what the manor looks like. */
  _storyChanged(flag) {
    if (flag === "doorOpen") { this.libDoor.setTexture("door-open"); this.tweens.add({ targets: this.runes, alpha: 0, scale: 1.2, duration: 900, onComplete: () => this.runes.setVisible(false) }); this.cameras.main.shake(260, .004); }
    if (flag === "clockSolved") { this.clockRunning = true; this.clockMinutes = 12 * 60 + 12; this._drawHands(); }
    if (flag === "gateOpen") { this.tweens.add({ targets: this.gate, scaleY: this.gateScale * .08, duration: 1600, ease: "Sine.inOut" }); this.cameras.main.shake(500, .003); }
    if (flag === "aisleClear") this.tweens.add({ targets: this.jam, alpha: 0, x: this.jam.x + 60, duration: 700, onComplete: () => this.jam.setVisible(false) });
    if (flag === "orreryLit") { this.tweens.add({ targets: this.rings, alpha: 1, duration: 800 }); this.tweens.add({ targets: this.ringsGlow, alpha: .5, duration: 1500 }); }
    if (flag === "wispBelow") this.tweens.add({ targets: this.wisp2, alpha: .82, duration: 1400 });
    if (flag === "sawWisp") this.tweens.add({ targets: this.wisp, alpha: .82, duration: 1400 }), this.tweens.add({ targets: this.wispGlow, alpha: .3, duration: 1400 });
  }

  _go(roomId, x, done) {
    const cam = this.cameras.main, room = roomOf(roomId);
    ctx.audio.sfx("step");
    cam.fadeOut(320, 4, 3, 8);
    cam.once("camerafadeoutcomplete", () => {
      this.player.x = room.x0 + x; this.vx = 0; this._enterRoom(room); cam.scrollX = this._camTarget();
      cam.fadeIn(420, 4, 3, 8); cam.once("camerafadeincomplete", done);
    });
  }
  _enterRoom(room, quiet) {
    this.current = room; this.cameras.main.setBounds(room.x0, 0, ROOM_W, VIEW_H);
    if (!quiet) ctx.ui.toast(room.name);
  }

  _cut_passage(done) {
    const cam = this.cameras.main, lib = roomOf("library"), back = { room: this.current, x: cam.scrollX };
    this.time.delayedCall(500, () => cam.fadeOut(600, 4, 3, 8));
    cam.once("camerafadeoutcomplete", () => {
      this.player.setVisible(false); this.shadow.setVisible(false);
      cam.setBounds(lib.x0, 0, ROOM_W, VIEW_H); cam.scrollX = lib.x0; this.cutscene = true; ctx.ui.toast(lib.name);
      cam.fadeIn(700, 4, 3, 8);
      this.time.delayedCall(1000, () => {
        ctx.audio.sfx("stone"); cam.shake(1700, .0035);
        this.tweens.addCounter({ from: 0, to: 1, duration: 1900, ease: "Sine.inOut", onUpdate: t => this._setPanel(t.getValue()) });
      });
      this.time.delayedCall(3300, () => ctx.dialogue.play(CUTSCENE_LINES.passage, () => {
        cam.fadeOut(500, 4, 3, 8);
        cam.once("camerafadeoutcomplete", () => {
          this.cutscene = false; this.player.setVisible(true); this.shadow.setVisible(true);
          this._enterRoom(back.room); cam.scrollX = back.x; cam.fadeIn(500, 4, 3, 8); cam.once("camerafadeincomplete", done);
        });
      }));
    });
  }
  _setPanel(p) { this.panelOpen = p; const w = 172 * (1 - p * .93); this.panel.x = roomOf("library").x0 + 590 - (172 - w); this.panel.setCrop(172 - w, 0, w, 278); }

  /* ---------- interaction ---------- */
  _stateOf(it) { return it.states.find(s => ctx.state.test(s.when)); }
  _nearest() {
    let best = null, bd = 1e9;
    for (const it of INTERACTABLES) {
      if (it.room !== this.current.id) continue;
      const st = this._stateOf(it); if (!st || !st.label) continue;
      const d = Math.abs(this.current.x0 + it.x - this.player.x);
      if (d < (it.range || 140) && d < bd) { bd = d; best = { it, st }; }
    }
    return best;
  }
  _interact() { if (this.busy || ctx.menuOpen || !this.offer) return; const o = this.offer; this.offer = null; ctx.audio.sfx("mew"); this.run(o.st.run); }

  /* ---------- frame ---------- */
  update(time, dms) {
    const dt = Math.min(dms, 50) / 1000, cam = this.cameras.main, S = ctx.state;
    const axis = (this.busy || ctx.menuOpen) ? 0 : ctx.input.axis();

    if (axis) { this.vx += axis * ACCEL * dt; if (Math.sign(this.vx) !== axis) this.vx += axis * DECEL * dt; this.facing = axis; }
    else { const d = DECEL * dt; this.vx = Math.abs(this.vx) <= d ? 0 : this.vx - Math.sign(this.vx) * d; }
    this.vx = Phaser.Math.Clamp(this.vx, -MAX_SPEED, MAX_SPEED);
    const lo = this.current.x0 + WALK_MIN; let hi = this.current.x0 + WALK_MAX;
    for (const b of BLOCKERS) if (b.room === this.current.id && !S.has(b.until)) hi = Math.min(hi, this.current.x0 + b.x - 150);
    this.player.x += this.vx * dt;
    if (this.player.x < lo) { this.player.x = lo; this.vx = 0; } else if (this.player.x > hi) { this.player.x = hi; this.vx = 0; }

    const speed = Math.abs(this.vx);
    if (speed > 12) {
      if (this.player.anims.getName() !== "mallow-walk") this.player.play("mallow-walk");
      this.player.anims.timeScale = .45 + speed / MAX_SPEED * .75;
      this.stepT -= dt * (speed / MAX_SPEED); if (this.stepT <= 0) { this.stepT = .21; ctx.audio.sfx("step"); }
    } else if (this.player.anims.getName() !== "mallow-idle") { this.player.play("mallow-idle"); this.player.anims.timeScale = 1; }
    this.player.setFlipX(this.facing < 0);
    this.shadow.x = this.player.x;

    if (!this.cutscene) cam.scrollX += (this._camTarget() - cam.scrollX) * Math.min(1, dt * 4.2);
    const local = cam.scrollX - this.current.x0;
    this.sky.x = -120 - local * .22; this.rain.tilePositionY -= 900 * dt; this.rainT = ((this.rainT || 0) + 200 * dt) % 256; this.rain.tilePositionX = this.rainT + local * .22;
    const view = this.cutscene ? roomOf("library") : this.current;
    for (const f of this.fg) { f.img.setVisible(f.room === view); f.img.x = f.room.x0 + f.x - (cam.scrollX + VIEW_W / 2 - f.room.x0 - f.x) * .28; }

    // prompt
    if (!this.busy && !ctx.menuOpen) {
      const n = this._nearest();
      if ((n && n.it.id) !== (this.offer && this.offer.it.id)) { if (n) ctx.audio.sfx("prompt"); }
      this.offer = n; ctx.input.showAction(n ? n.st.label : null);
      this.marker.setVisible(!!n); if (n) this.marker.setPosition(this.current.x0 + n.it.x, 150);
      for (const t of TRIGGERS) {
        if (t.room !== this.current.id || !S.test(t.when)) continue;
        const lx = this.player.x - this.current.x0; if (lx < t.from || lx > t.to) continue;
        this.offer = null; ctx.input.showAction(null); this.marker.setVisible(false); this.run(t.run); break;
      }
    } else this.marker.setVisible(false);

    // ambience
    const fx = roomOf("library").x0 + 400, near = this.current.id === "library" ? Math.max(0, 1 - Math.abs(this.player.x - fx) / 1300) : 0;
    ctx.audio.loop("fire", .05 + near * .22); ctx.audio.loop("rain", this.current.below ? 0 : this.current.id === "attic" ? .09 : .045);
    if (S.has("orreryLit")) this.rings.angle += dt * 14;
    if (this.clockRunning) { this.pendulum.angle = Math.sin(time / 1000 * Math.PI) * 9; const s = Math.floor(time / 1000); if (s !== this.lastTick) { this.lastTick = s; if (this.current.id === "hall" && !this.busy) ctx.audio.sfx("tick", s % 2); } }
    this.lanternGlow.setPosition(this.lantern.x, this.lantern.y + 34);
  }
  _camTarget() { const b = this.current.x0; return Phaser.Math.Clamp(this.player.x - VIEW_W / 2 + this.facing * LOOK_AHEAD, b, b + ROOM_W - VIEW_W); }

  _drawHands() {
    const g = this.hands, m = this.clockMinutes, cx = this.clockX, cy = 240;
    g.clear();
    const hand = (a, len, w) => { g.lineStyle(w, 0x1a120a, 1); g.lineBetween(cx, cy, cx + Math.sin(a) * len, cy - Math.cos(a) * len); };
    hand((m % 720) / 720 * Math.PI * 2, 30, 5); hand((m % 60) / 60 * Math.PI * 2, 46, 3);
    g.fillStyle(0x8a6a2c, 1); g.fillCircle(cx, cy, 5);
  }
  _scheduleLightning() {
    this.time.delayedCall(7000 + Math.random() * 11000, () => {
      if (!this.scene.isPaused() && !this.current.below) {
        this.tweens.add({ targets: this.flash, alpha: { from: .85, to: 0 }, duration: 520, ease: "Expo.out" });
        this.time.delayedCall(140, () => this.tweens.add({ targets: this.flash, alpha: { from: .6, to: 0 }, duration: 700 }));
        this.time.delayedCall(500 + Math.random() * 900, () => ctx.audio.sfx("thunder"));
      }
      this._scheduleLightning();
    });
  }
}
const WALL_FIRE_Y = 606;
