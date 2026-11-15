/* Mystery Manor installable web app shell.
   First play online caches subsequent module loads; audio tracks stream from their
   credited host and are not falsely advertised as offline assets. */
const CACHE="mystery-manor-ch1-app-v3";
const CORE=[
 "./","./index.html","./manifest.webmanifest","./mystery-manor-icon.svg",
 "./studio-boot.js","./studio-credits-roll-v2.js","./failure-entertainment-intro.html",
 "./src/ui.css","./src/main.js","./vendor/phaser.min.js",
 "./src/ctx.js","./src/config.js",
 "./src/systems/StoryState.js","./src/systems/Input.js","./src/systems/AudioManager.js",
 "./src/systems/Dialogue.js","./src/systems/UI.js","./src/systems/PuzzleManager.js",
 "./src/data/world.js","./src/data/story.js",
 "./src/scenes/BootScene.js","./src/scenes/WorldScene.js",
 "./src/puzzles/HiddenObjectPuzzle.js","./src/puzzles/Match3Puzzle.js",
 "./src/puzzles/ClockPuzzle.js","./src/puzzles/BasePuzzle.js",
 "./src/puzzles/match3Logic.js","./src/art/svg.js","./src/art/characters.js",
 "./src/art/rooms.js","./src/art/desk.js","./src/art/pieces.js",
 "./assets/mystery_manor_witnesses.webp"
];
self.addEventListener("install",e=>{
 e.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",e=>{
 e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("mystery-manor-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",e=>{
 const req=e.request;if(req.method!=="GET")return;
 const url=new URL(req.url);if(url.origin!==self.location.origin)return;
 if(req.mode==="navigate"){
  e.respondWith(fetch(req).then(resp=>{
   if(resp.ok){const copy=resp.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});}
   return resp;
  }).catch(()=>caches.match(req,{ignoreSearch:true}).then(hit=>hit||caches.match("./index.html"))));
 }else{
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>hit||fetch(req).then(resp=>{
   if(resp.ok){const copy=resp.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});}
   return resp;
  })));
 }
});