/**
 * The art pipeline. All artwork is authored as SVG built by small functions (so a character can be re-posed
 * by changing numbers), rasterised once at start-up, and handed to Phaser as ordinary textures.
 */
export function svgDoc(w, h, body, defs = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`;
}
export function lin(id, stops, x2 = 0, y2 = 1) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ""}/>`).join("")}</linearGradient>`;
}
export function rad(id, stops, cx = .5, cy = .5, r = .5) {
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ""}/>`).join("")}</radialGradient>`;
}
/** Deterministic pseudo-random numbers so the manor looks the same on every visit. */
export function rng(seed) {
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
/** Rasterise one SVG into a Phaser texture. Resolves when the texture exists. */
export function addSvgTexture(scene, key, w, h, body, defs = "") {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      if (scene.textures.exists(key)) scene.textures.remove(key);
      scene.textures.addCanvas(key, c);
      resolve(key);
    };
    img.onerror = () => reject(new Error("Could not draw artwork: " + key));
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgDoc(w, h, body, defs));
  });
}
