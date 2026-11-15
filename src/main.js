import { ctx } from "./ctx.js";
import { VIEW_W, VIEW_H } from "./config.js";
import { StoryState } from "./systems/StoryState.js";
import { Input } from "./systems/Input.js";
import { AudioManager } from "./systems/AudioManager.js";
import { Dialogue } from "./systems/Dialogue.js";
import { UI } from "./systems/UI.js";
import { PuzzleManager } from "./systems/PuzzleManager.js";
import { PUZZLES } from "./data/world.js";
import { BootScene } from "./scenes/BootScene.js";
import { WorldScene } from "./scenes/WorldScene.js";
import { HiddenObjectPuzzle } from "./puzzles/HiddenObjectPuzzle.js";
import { Match3Puzzle } from "./puzzles/Match3Puzzle.js";
import { ClockPuzzle } from "./puzzles/ClockPuzzle.js";
import { PinPuzzle } from "./puzzles/PinPuzzle.js";
import { BlockPuzzle } from "./puzzles/BlockPuzzle.js";
import { ChainPuzzle } from "./puzzles/ChainPuzzle.js";

const $ = id => document.getElementById(id);
ctx.state = new StoryState(); ctx.state.load();
ctx.audio = new AudioManager();
ctx.input = new Input();
ctx.dialogue = new Dialogue(ctx.audio);
ctx.ui = new UI();

const params = new URLSearchParams(location.search);
ctx.game = new Phaser.Game({
  type: params.has("canvas") ? Phaser.CANVAS : Phaser.AUTO,   // ?canvas forces the 2D renderer (used by the headless tests, which have no GPU)
  parent: "stage", backgroundColor: "#07060c",
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.NO_CENTER, width: VIEW_W, height: VIEW_H },
  audio: { noAudio: true },                      // sound is handled by AudioManager, not Phaser
  input: { activePointers: 2 }, render: { antialias: true, roundPixels: false },
  scene: [BootScene, WorldScene, HiddenObjectPuzzle, Match3Puzzle, ClockPuzzle, PinPuzzle, BlockPuzzle, ChainPuzzle]
});
ctx.puzzles = new PuzzleManager(ctx.game, PUZZLES);

/* ---------- title ---------- */
ctx.ready = () => {
  $("title-status").textContent = ctx.state.hasSave() ? "Your place in the manor has been kept." : "A storm. A fire. An empty chair.";
  $("btn-begin").disabled = false; $("btn-continue").hidden = !ctx.state.hasSave();
  if (ctx.state.hasSave()) $("btn-begin").textContent = "Start again";
};
function start(fresh) {
  ctx.audio.unlock();                            // the tap on this button is the gesture iOS needs
  if (fresh) ctx.state.reset();
  $("title").hidden = true; $("btn-menu").hidden = false;
  ctx.game.scene.start("World");
}
$("btn-begin").addEventListener("click", () => start(true));
$("btn-continue").addEventListener("click", () => start(false));

/* ---------- studio credits ---------- */
const creditsOverlay=$("credits-overlay");
let creditsPreviousMenuOpen=false;
function openGameCredits(){
  if(!creditsOverlay.hidden)return;
  creditsPreviousMenuOpen=!!ctx.menuOpen;
  ctx.menuOpen=true;
  ctx.input.release();
  creditsOverlay.hidden=false;
  $("btn-close-credits").focus({preventScroll:true});
}
function closeGameCredits(){
  if(creditsOverlay.hidden)return;
  creditsOverlay.hidden=true;
  ctx.menuOpen=creditsPreviousMenuOpen;
}
$("btn-credits-title").addEventListener("click",openGameCredits);
$("btn-credits-menu").addEventListener("click",openGameCredits);
$("btn-close-credits").addEventListener("click",closeGameCredits);
window.addEventListener("mystery-manor-show-credits",openGameCredits);
if(new URLSearchParams(location.search).has("credits"))openGameCredits();
creditsOverlay.addEventListener("keydown",e=>{if(e.key==="Escape")closeGameCredits();});

/* ---------- settings ---------- */
const menu = $("menu"), mt = $("music-toggle");
function syncMenu() { mt.setAttribute("aria-pressed", String(ctx.audio.musicOn)); mt.textContent = ctx.audio.musicOn ? "On" : "Off"; $("music-vol").value = Math.round(ctx.audio.musicVol * 100); $("sfx-vol").value = Math.round(ctx.audio.sfxVol * 100); }
$("btn-menu").addEventListener("click", () => { ctx.menuOpen = true; ctx.input.release(); syncMenu(); menu.hidden = false; });
$("btn-close-menu").addEventListener("click", () => { ctx.menuOpen = false; menu.hidden = true; });
mt.addEventListener("click", e => { e.preventDefault(); ctx.audio.setMusicOn(!ctx.audio.musicOn); syncMenu(); });
$("music-vol").addEventListener("input", e => ctx.audio.setMusicVolume(e.target.value / 100));
$("sfx-vol").addEventListener("input", e => { ctx.audio.setSfxVolume(e.target.value / 100); });
$("sfx-vol").addEventListener("change", () => ctx.audio.sfx("find"));
$("btn-restart").addEventListener("click", () => { ctx.state.reset(); location.reload(); });

document.addEventListener("contextmenu", e => { if (!e.target.closest("a,input")) e.preventDefault(); });
window.__mm = ctx;                               // handle for the automated tests

/* Register the installable Mystery Manor app shell without affecting game startup. */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(err => console.warn("Offline app cache unavailable", err)));
}