/* Plays Chapter One from the title screen to the ending in headless Chrome with touch input.
   Usage:  python3 tests/serve.py &   then   PUPPETEER=/path/to/puppeteer-core node tests/smoke.cjs
   This is emulated touch in desktop Chrome. It is not a real iPhone. */
const puppeteer = require(process.env.PUPPETEER || "puppeteer-core");
const BASE = process.env.URL || "http://127.0.0.1:8765/index.html";
let URL = BASE + "?canvas";   // headless Chrome has no GPU; its software WebGL runs at about 6 frames a second, so the play-through uses the 2D renderer
const sleep = ms => new Promise(r => setTimeout(r, ms));
const results = []; let failed = 0;
const check = (name, ok, extra = "") => { results.push((ok ? "PASS " : "FAIL ") + name + (extra ? "  [" + extra + "]" : "")); if (!ok) failed++; };

async function open(browser, vp, errors) {
  const p = await browser.newPage(); await p.setViewport(vp);
  p.on("pageerror", e => errors.push("pageerror: " + e.message));
  p.on("console", m => { if (m.type() === "error" && !/ERR_FAILED|incompetech/.test(m.text())) errors.push("console: " + m.text()); });
  await p.setRequestInterception(true); p.on("request", r => r.url().includes("incompetech") ? r.abort() : r.continue());   // the sandbox has no route to the music host
  await p.goto(URL); await p.waitForFunction(() => !document.getElementById("btn-begin").disabled, { timeout: 30000 });
  return p;
}
const W = p => p.evaluate(() => { const w = __mm.game.scene.getScene("World"); return { x: w.player.x, vx: w.vx, room: w.current && w.current.id, busy: w.busy, lx: w.current ? w.player.x - w.current.x0 : 0, paused: w.scene.isPaused(), panel: w.panelOpen }; });
const visible = (p, sel) => p.evaluate(s => { const e = document.querySelector(s); return !!e && !e.hidden; }, sel);
const flag = (p, f) => p.evaluate(f => __mm.state.has(f), f);
async function talk(p) { let n = 0; while (await visible(p, "#dialogue") && n++ < 80) { await p.tap("#dialogue"); await sleep(70); } return n; }
async function settle(p, ms = 9000) { const t = Date.now(); while (Date.now() - t < ms) { if (await visible(p, "#dialogue")) await talk(p); const w = await W(p); if (!w.busy && !w.paused) return; await sleep(120); } }
async function walkTo(p, lx) {
  for (let guard = 0; guard < 400; guard++) {
    await settle(p); const w = await W(p); const d = lx - w.lx; if (Math.abs(d) < 50) break;
    const btn = d > 0 ? "#btn-right" : "#btn-left", box = await (await p.$(btn)).boundingBox();
    await p.touchscreen.touchStart(box.x + box.width / 2, box.y + box.height / 2);
    for (let i = 0; i < 100; i++) { await sleep(40); const v = await W(p); if (v.busy || Math.abs(lx - v.lx) < 40 || Math.sign(lx - v.lx) !== Math.sign(d)) break; }
    await p.touchscreen.touchEnd(); await sleep(350);
  }
  await settle(p);
}
async function act(p, expect) { await p.waitForFunction(() => !document.getElementById("btn-act").hidden, { timeout: 5000 }); const label = await p.$eval("#btn-act", e => e.textContent); if (expect) check("prompt reads '" + expect + "'", label === expect, label); await p.tap("#btn-act"); await sleep(250); return label; }
async function stageTap(p, sx, sy) { const r = await p.$eval("#stage canvas", c => { const b = c.getBoundingClientRect(); return { l: b.left, t: b.top, w: b.width, h: b.height }; }); await p.touchscreen.tap(r.l + sx / 1560 * r.w, r.t + sy / 720 * r.h); }
const puzzleUp = (p, key) => p.waitForFunction(k => __mm.game.scene.isActive(k), { timeout: 15000 }, key);
const puzzleGone = (p, key) => p.waitForFunction(k => !__mm.game.scene.isActive(k) && !__mm.puzzles.active, { timeout: 40000 }, key);

(async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", headless: "new", args: ["--no-sandbox"] });
  const errors = [];

  /* ---------- iPhone landscape, touch ---------- */
  let p = await open(browser, { width: 844, height: 390, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }, errors);
  await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForFunction(() => !document.getElementById("btn-begin").disabled);
  const audioEl = await p.evaluateHandle(() => __mm.audio.el);
  await p.tap("#btn-begin"); await sleep(1500);
  check("intro dialogue opens by itself", await visible(p, "#dialogue"));
  check("walking is locked during dialogue", !(await visible(p, "#pad")));
  await settle(p);
  check("intro sets its story flag", await flag(p, "introDone"));
  check("music element points at the first original track", await p.evaluate(() => __mm.audio.el.src.includes("Sneaky%20Adventure.mp3") && __mm.audio.track === 0));

  let a = await W(p); await stageTap(p, 780, 330); await stageTap(p, 1200, 400); await sleep(500); let b2 = await W(p);
  check("touching the middle of the scene does not move Mallow", Math.abs(a.x - b2.x) < 1 && b2.vx === 0);
  let box = await (await p.$("#btn-right")).boundingBox();
  await p.touchscreen.touchStart(box.x + 30, box.y + 30); await sleep(900); let mid = await W(p);
  check("holding the right arrow walks right", mid.x > a.x + 60 && mid.vx > 100, "moved " + Math.round(mid.x - a.x));
  check("long press selects no text", await p.evaluate(() => String(window.getSelection()) === ""));
  await p.touchscreen.touchEnd(); await sleep(600); let after = await W(p); await sleep(300); let after2 = await W(p);
  check("releasing stops Mallow", after.vx === 0 && after.x === after2.x);
  check("context menu is suppressed on the controls", await p.evaluate(() => { const e = new MouseEvent("contextmenu", { bubbles: true, cancelable: true }); document.getElementById("btn-left").dispatchEvent(e); return e.defaultPrevented; }));
  check("controls cannot be selected", await p.evaluate(() => { const s = getComputedStyle(document.getElementById("btn-left")); return (s.userSelect || s.webkitUserSelect) === "none"; }));
  await p.touchscreen.touchStart(box.x + 30, box.y + 30); await sleep(300); await p.evaluate(() => window.dispatchEvent(new Event("blur"))); await sleep(500); const blurred = await W(p); await p.touchscreen.touchEnd();
  check("losing focus releases a held direction", blurred.vx === 0);
  check("camera follows inside the room", await p.evaluate(() => { const w = __mm.game.scene.getScene("World"), c = w.cameras.main; return c.scrollX >= w.current.x0 && c.scrollX <= w.current.x0 + 2200 - 1560; }));

  await walkTo(p, 1640); check("the scraping-noise moment fired on the way", await flag(p, "heardScrape"));
  await act(p, "Search the desk"); await talk(p); await puzzleUp(p, "HiddenObject");
  check("exploration controls are hidden inside a puzzle", !(await visible(p, "#pad")) && !(await visible(p, "#btn-act")));
  await sleep(600); await stageTap(p, 1400, 620); await sleep(200);
  check("a wrong tap on the desk finds nothing", !(await flag(p, "deskSolved")));
  for (const [x, y] of [[372, 520], [992, 452], [1262, 546], [196, 262], [668, 388]]) { await stageTap(p, x, y); await sleep(250); }
  await puzzleGone(p, "HiddenObject"); await settle(p);
  check("hidden-object puzzle completes and sets its flag", await flag(p, "deskSolved"));
  a = await W(p); check("control returns beside the desk", a.room === "library" && Math.abs(a.lx - 1640) < 80 && !a.busy);
  check("music element survived the puzzle", await p.evaluate(el => __mm.audio.el === el, audioEl));

  await walkTo(p, 2040); await act(p, "Use the strange key"); await talk(p); await puzzleUp(p, "Match3"); await sleep(600);
  // Arrange a 2 x 2 on the live board, then make the swap with real taps.
  await p.evaluate(() => { const s = __mm.game.scene.getScene("Match3"), g = s.board.g, set = (r, c, t) => { g[r][c].t = t; s.sprites.get(g[r][c].id).setTexture("pc" + t); };
    const k = [0, 1, 2, 3, 4, 5]; for (let r = 3; r < 6; r++) for (let c = 0; c < 4; c++) set(r, c, k[(r * 2 + c) % 3 + 3]);
    set(4, 0, 0); set(4, 1, 0); set(5, 0, 0); set(5, 1, 1); set(5, 2, 0); });
  const cell = (r, c) => [236 + c * 112 + 56, 24 + r * 112 + 56];
  await stageTap(p, ...cell(5, 2)); await sleep(150); await stageTap(p, ...cell(5, 1));
  await p.waitForFunction(() => !__mm.game.scene.getScene("Match3").locked, { timeout: 10000 });
  check("matching four in a 2x2 square creates a Hex Bomb on the board", await p.evaluate(() => { const s = __mm.game.scene.getScene("Match3"); const h = s.board.g.flat().filter(q => q.s === "hex"); return h.length >= 1 && h.every(q => s.sprites.get(q.id).texture.key === "pc-hex"); }));
  const dud = await p.evaluate(async () => { const L = await import("/src/puzzles/match3Logic.js"), s = __mm.game.scene.getScene("Match3"), ok = new Set(L.findMoves(s.board).map(m => JSON.stringify(m)));
    for (let r = 0; r < 6; r++) for (let c = 0; c < 5; c++) if (!ok.has(JSON.stringify([[r, c], [r, c + 1]]))) return { a: [r, c], z: [r, c + 1], ids: s.board.g.flat().map(q => q.id).join() }; return null; });
  if (dud) { await stageTap(p, ...cell(...dud.a)); await sleep(150); await stageTap(p, ...cell(...dud.z)); await sleep(900); }
  check("a swap that matches nothing is refused and slides back", !!dud && await p.evaluate(ids => { const s = __mm.game.scene.getScene("Match3"); return !s.locked && s.board.g.flat().map(q => q.id).join() === ids; }, dud.ids));
  let moves = 0;
  while (await p.evaluate(() => __mm.game.scene.isActive("Match3") && !__mm.game.scene.getScene("Match3").done) && moves < 200) {
    const m = await p.evaluate(async () => { const L = await import("/src/puzzles/match3Logic.js"), s = __mm.game.scene.getScene("Match3"); if (s.locked) return null; const ms = L.findMoves(s.board); const w = ms.filter(([x, y]) => s.board.w[x[0]][x[1]] || s.board.w[y[0]][y[1]]); const pick = w.length ? w : ms; return pick[Math.floor(Math.random() * pick.length)] || null; });
    if (m) { await stageTap(p, ...cell(...m[0])); await sleep(120); await stageTap(p, ...cell(...m[1])); moves++; }
    await sleep(200);
  }
  await puzzleGone(p, "Match3"); await settle(p);
  check("match-3 squares are at least 56 CSS pixels on an iPhone-sized screen", await p.$eval("#stage canvas", c => c.getBoundingClientRect().width / 1560 * 112 >= 56));
  check("match-3 objective completes", await flag(p, "doorOpen"), moves + " moves");
  check("the library door is physically open afterwards", await p.evaluate(() => { const w = __mm.game.scene.getScene("World"); return w.libDoor.texture.key === "door-open"; }));

  await act(p, "West Hall"); await sleep(1200); await settle(p);
  a = await W(p); check("room transition to the West Hall", a.room === "hall");
  check("Fern calls out on first entering the hall", await flag(p, "sawHall"));
  await walkTo(p, 1130); await act(p, "Talk to Fern"); await settle(p); check("meeting Fern sets its flag", await flag(p, "metFern"));
  await walkTo(p, 1780); await act(p, "Open the clock"); await talk(p); await puzzleUp(p, "Clock"); await sleep(600);
  await stageTap(p, 1150, 580); await sleep(200);
  check("the hands are locked until the gears are freed", await p.evaluate(() => __mm.game.scene.getScene("Clock").minutes === 233));
  for (const [gx, gy, n] of [[250, 300, 4], [452, 404, 5], [610, 280, 2]]) for (let i = 0; i < n; i++) { await stageTap(p, gx, gy); await sleep(300); }
  await sleep(500); check("aligning the three gears frees the works", await p.evaluate(() => __mm.game.scene.getScene("Clock").stage === 2));
  for (let i = 0; i < 3; i++) { await stageTap(p, 1150 - 150 - 58, 580); await sleep(120); }
  for (let i = 0; i < 41; i++) { await stageTap(p, 1150 + 150 - 58, 580); await sleep(90); }
  check("the hands can be set to 12:12", await p.evaluate(() => __mm.game.scene.getScene("Clock").minutes === 12));
  await puzzleGone(p, "Clock");
  check("the clock puzzle completes", await flag(p, "clockSolved"));
  await sleep(1500); await p.waitForFunction(() => __mm.state.has("passageShown") || !document.getElementById("dialogue").hidden, { timeout: 20000 });
  await settle(p, 20000);
  a = await W(p); check("the fireplace cutscene opens the hidden panel", (await flag(p, "passageShown")) && a.panel > .99);
  check("control returns in the hall beside the clock", a.room === "hall" && Math.abs(a.lx - 1780) < 80 && !a.busy);

  await walkTo(p, 1150 + 300); await walkTo(p, 2040); await act(p, "Portrait Gallery"); await sleep(1200); await settle(p);
  await walkTo(p, 1150); await act(p); await settle(p); check("Miss Wisp can be met in the gallery", await flag(p, "metWisp"));
  await walkTo(p, 2040); await act(p, "Attic stairs"); await sleep(1200); await settle(p); a = await W(p); check("the attic landing is reachable", a.room === "attic");
  await walkTo(p, 180); await act(p); await sleep(1200); await settle(p); await walkTo(p, 180); await act(p, "West Hall"); await sleep(1200); await settle(p);
  await walkTo(p, 180); await act(p, "Library"); await sleep(1200); await settle(p);
  await walkTo(p, 676); await act(p, "Look inside"); await talk(p);
  await p.waitForFunction(() => !document.getElementById("card").hidden, { timeout: 8000 });
  check("the chapter ends on the Collector card, not a level-complete screen", await p.$eval("#card-inner", e => /Collector/.test(e.textContent) && !/level complete/i.test(e.textContent)));
  await sleep(5500); await p.tap("#card [data-close]"); await settle(p);
  a = await W(p); check("exploration continues after the ending", !a.busy && a.room === "library");

  await p.tap("#btn-menu"); await sleep(200); await p.tap("#music-toggle");
  check("music can be switched off", await p.evaluate(() => __mm.audio.musicOn === false && __mm.audio.el.paused));
  await p.$eval("#music-vol", e => { e.value = 20; e.dispatchEvent(new Event("input")); }); await p.$eval("#sfx-vol", e => { e.value = 30; e.dispatchEvent(new Event("input")); });
  check("music and effects volumes are separate", await p.evaluate(() => Math.abs(__mm.audio.el.volume - .2) < .01 && Math.abs(__mm.audio.sfxVol - .3) < .01));
  check("music credits and licence link are present", await p.evaluate(() => /Kevin MacLeod/.test(document.getElementById("menu").textContent) && !!document.querySelector('#menu a[href*="creativecommons.org/licenses/by/4.0"]')));
  await p.tap("#music-toggle"); await p.tap("#btn-close-menu");
  check("the three tracks are the originals, in order", await p.evaluate(async () => { const c = await import("/src/config.js"); return c.MUSIC_TRACKS.map(t => t.title).join("|") === "Sneaky Adventure|Some Amount of Evil|Machinations"; }));

  await p.reload(); await p.waitForFunction(() => !document.getElementById("btn-begin").disabled);
  check("a reload offers Continue", await visible(p, "#btn-continue")); await p.tap("#btn-continue"); await sleep(1800); await settle(p);
  check("solved puzzles and opened rooms are kept", (await flag(p, "doorOpen")) && (await flag(p, "clockSolved")) && (await W(p)).panel > .99);
  await p.close();

  /* ---------- iPhone portrait fallback ---------- */
  p = await open(browser, { width: 390, height: 844, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }, errors);
  await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForFunction(() => !document.getElementById("btn-begin").disabled);
  await p.tap("#btn-begin"); await sleep(1500); await settle(p);
  const inView = await p.evaluate(() => ["btn-left", "btn-right"].every(id => { const r = document.getElementById(id).getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight && r.width >= 44; }));
  check("portrait: arrows are on screen and finger-sized", inView);
  a = await W(p); box = await (await p.$("#btn-right")).boundingBox(); await p.touchscreen.touchStart(box.x + 40, box.y + 40); await sleep(800); await p.touchscreen.touchEnd(); await sleep(500); b2 = await W(p);
  check("portrait: walking works and stops", b2.x > a.x + 40 && b2.vx === 0);
  await p.screenshot({ path: "/tmp/mm_portrait.png" }); await p.close();

  /* ---------- desktop keyboard ---------- */
  p = await open(browser, { width: 1280, height: 720 }, errors);
  await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForFunction(() => !document.getElementById("btn-begin").disabled);
  await p.click("#btn-begin"); await sleep(1500);
  for (let i = 0; i < 20 && await visible(p, "#dialogue"); i++) { await p.keyboard.press("Enter"); await sleep(80); }
  await sleep(400); a = await W(p); await p.keyboard.down("d"); await sleep(800); await p.keyboard.up("d"); await sleep(500); b2 = await W(p);
  check("desktop: D walks right and stops on release", b2.x > a.x + 40 && b2.vx === 0);
  await p.keyboard.down("ArrowLeft"); await sleep(1400); await p.keyboard.up("ArrowLeft"); await sleep(500);
  check("desktop: the interact key works at the hearth", await p.evaluate(() => !document.getElementById("btn-act").hidden)); await p.keyboard.press("e"); await sleep(300);
  check("desktop: E starts the interaction", await visible(p, "#dialogue"));
  await p.close();

  /* ---------- default WebGL renderer: boots, draws, first dialogue appears ---------- */
  URL = BASE; p = await open(browser, { width: 844, height: 390, hasTouch: true, isMobile: true }, errors);
  await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForFunction(() => !document.getElementById("btn-begin").disabled);
  await p.tap("#btn-begin"); await p.waitForFunction(() => !document.getElementById("dialogue").hidden, { timeout: 60000 }).catch(() => {});
  check("WebGL renderer boots and reaches the intro", (await visible(p, "#dialogue")) && await p.evaluate(() => __mm.game.renderer.type === Phaser.WEBGL));
  await p.screenshot({ path: "/tmp/mm_webgl.png" }); await p.close();

  check("no console errors or exceptions in any run", errors.length === 0, errors.slice(0, 3).join(" | "));
  console.log(results.join("\n")); console.log(failed ? "\n" + failed + " FAILED" : "\nall " + results.length + " checks passed");
  await browser.close(); process.exit(failed ? 1 : 0);
})().catch(e => { console.log(results.join("\n")); console.error("TEST CRASHED:", e.message); process.exit(2); });
