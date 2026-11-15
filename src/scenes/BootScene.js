import { ctx } from "../ctx.js";
import { addSvgTexture } from "../art/svg.js";
import { MALLOW, mallowSvg, FERN, fernSvg, LANTERN, lanternSvg, WISP, wispSvg } from "../art/characters.js";
import * as R from "../art/rooms.js";
import { deskArt } from "../art/desk.js";
import { PIECES } from "../art/pieces.js";
import { WISP as WISP_ART } from "../art/characters.js";

/** Loads the painted images and builds every drawn texture once, then hands over to the title screen. */
export class BootScene extends Phaser.Scene {
  constructor() { super("Boot"); }
  preload() {
    this.load.spritesheet("faces", "assets/mystery_manor_witnesses.webp", { frameWidth: 160, frameHeight: 228 });   // painted portraits: 0 Mallow, 1 Fern, 2 the librarian
  }
  async create() {
    const jobs = [], add = (key, w, h, art) => jobs.push(addSvgTexture(this, key, w, h, art.body, art.defs));
    for (let i = 0; i < MALLOW.walkFrames; i++) add("mallow-w" + i, MALLOW.w, MALLOW.h, mallowSvg({ phase: i / MALLOW.walkFrames * Math.PI * 2, moving: true, tail: Math.sin(i / MALLOW.walkFrames * Math.PI * 2) * .5 }));
    for (let i = 0; i < MALLOW.idleFrames; i++) add("mallow-i" + i, MALLOW.w, MALLOW.h, mallowSvg({ phase: i / MALLOW.idleFrames * Math.PI * 2, tail: Math.sin(i / MALLOW.idleFrames * Math.PI * 2), blink: i === 4 }));
    add("fern", FERN.w, FERN.h, fernSvg()); add("lantern", LANTERN.w, LANTERN.h, lanternSvg());
    for (let i = 0; i < WISP.frames; i++) add("wisp" + i, WISP.w, WISP.h, wispSvg(i));
    for (const id in R.ROOM_SVG) add("room-" + id, R.RW, R.RH, R.ROOM_SVG[id]());
    add("sky", 1100, 520, R.skySvg()); add("rain", 256, 256, R.rainSvg()); add("glow", 256, 256, R.glowSvg());
    for (let i = 0; i < 4; i++) add("flame" + i, 60, 90, R.flameSvg(i));
    add("vignette", 780, 360, R.vignetteSvg()); add("curtain", 110, 400, R.curtainSvg());
    add("door-closed", 184, 414, R.doorSvg(false)); add("door-open", 184, 414, R.doorSvg(true)); add("runes", 184, 414, R.runesSvg());
    add("panel", 172, 278, R.panelSvg()); add("clockface", 132, 132, R.clockFaceSvg()); add("pendulum", 40, 180, R.pendulumSvg()); add("plant", 300, 420, R.plantSvg());
    for (const key in deskArt) add(key, deskArt[key].w, deskArt[key].h, deskArt[key].art());
    for (const key in PIECES) add(key, 128, 128, PIECES[key]());
    try { await Promise.all(jobs); } catch (e) { document.getElementById("title-status").textContent = "The artwork could not be drawn on this browser."; console.error(e); return; }
    const f = (p, n) => Array.from({ length: n }, (_, i) => ({ key: p + i }));
    this.anims.create({ key: "mallow-walk", frames: f("mallow-w", MALLOW.walkFrames), frameRate: 12, repeat: -1 });
    this.anims.create({ key: "mallow-idle", frames: f("mallow-i", MALLOW.idleFrames), frameRate: 3.2, repeat: -1 });
    this.anims.create({ key: "flame", frames: f("flame", 4), frameRate: 9, repeat: -1 });
    this.anims.create({ key: "wisp", frames: f("wisp", WISP.frames), frameRate: 4, repeat: -1 });
    // Miss Wisp's dialogue portrait is cut from her own sprite, so the face in the box is the ghost in the room.
    const src = this.textures.get("wisp0").getSourceImage(), c = document.createElement("canvas"); c.width = 160; c.height = 228;
    const g = c.getContext("2d"); g.fillStyle = "#0b1230"; g.fillRect(0, 0, 160, 228); g.drawImage(src, 78, 6, 144, 205, 0, 0, 160, 228);
    ctx.portraits = { wisp: c.toDataURL() };
    ctx.ready();
  }
}
