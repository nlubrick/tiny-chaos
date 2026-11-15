/* Failure Entertainment cinematic credits roll.
   Starts when the credits become visible, advances the actual scroll container,
   and supports touch scrolling, Pause, Replay, and accessibility controls. */
(function () {
  "use strict";
  const controllers = new WeakMap();

  function create(root) {
    if (controllers.has(root)) return controllers.get(root);
    const viewport = root.querySelector("[data-fe-credits-scroll]");
    const pause = root.querySelector("[data-fe-credits-pause]");
    const replay = root.querySelector("[data-fe-credits-replay]");
    if (!viewport || !pause || !replay) return null;

    let active = false, open = false, raf = 0, lastFrame = null, started = 0, completed = false, resumeOnReturn = false;
    // Long credits need to move visibly right away, rather than after a long blank lead-in.
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pixelsPerSecond = reduced ? 44 : 76;

    function syncButton() {
      pause.textContent = active ? "Pause" : "Resume";
      pause.setAttribute("aria-pressed", String(!active));
    }
    function halt() {
      active = false;
      cancelAnimationFrame(raf);
      raf = 0;
      lastFrame = null;
      syncButton();
    }
    function frame(now) {
      if (!active) return;
      if (root.hidden || document.hidden) { halt(); return; }
      if (lastFrame !== null) {
        const delta = Math.min(0.10, Math.max(0, (now - lastFrame) / 1000));
        const limit = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
        if (limit > 2) {
          viewport.scrollTop = Math.min(limit, viewport.scrollTop + pixelsPerSecond * delta);
          if (viewport.scrollTop >= limit - 1) {
            completed = true;
            halt();
            return;
          }
        } else if (now - started > 2500) {
          // No scrollable content yet. Don't spin a busy animation forever.
          halt();
          return;
        }
      }
      lastFrame = now;
      raf = requestAnimationFrame(frame);
    }
    function resume() {
      if (active || root.hidden || document.hidden) return;
      if (completed) { viewport.scrollTop = 0; completed = false; }
      active = true;
      started = performance.now();
      lastFrame = null;
      syncButton();
      raf = requestAnimationFrame(frame);
    }
    function restart() {
      halt();
      completed = false;
      viewport.scrollTop = 0;
      resume();
    }
    function show() {
      if (root.hidden) return;
      if (open) return;
      open = true;
      // Wait for the element to have its final height on iPhone.
      requestAnimationFrame(() => {
        if (root.hidden || !open) return;
        restart();
      });
    }
    function hide() {
      open = false;
      halt();
    }

    pause.addEventListener("click", () => active ? halt() : resume());
    replay.addEventListener("click", restart);

    // Manual touch/wheel scrolling pauses the automatic roll instead of fighting it.
    for (const eventName of ["wheel", "touchstart", "pointerdown", "keydown"]) {
      viewport.addEventListener(eventName, () => { if (active) halt(); }, { passive: true });
    }

    const observer = new MutationObserver(() => root.hidden ? hide() : show());
    observer.observe(root, { attributes: true, attributeFilter: ["hidden"] });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        resumeOnReturn = active;
        if (active) halt();
      } else if (resumeOnReturn && open && !root.hidden) {
        resumeOnReturn = false;
        resume();
      }
    });
    const api = { show, hide, restart, resume };
    controllers.set(root, api);
    syncButton();
    if (!root.hidden) show();
    return api;
  }

  function initialize() {
    document.querySelectorAll("[data-fe-credits-root]").forEach(create);
  }
  window.FailureCreditsRoll = {
    show(root) {
      const el = typeof root === "string" ? document.querySelector(root) : root;
      if (!el) return;
      const controller = create(el);
      if (controller) controller.show();
    }
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();