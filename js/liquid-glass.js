/* ==========================================================================
   Amelia Flowers — liquid glass motion layer.

   Loads AFTER js/main.js and adds nothing the storefront depends on: it
   never touches the cart, the catalogue, the language switcher or the
   checkout form. Everything here writes CSS custom properties and lets
   css/liquid-glass.css decide what to do with them, so removing this file
   leaves a site that is static but complete.

   Two gates guard the whole file:
     · prefers-reduced-motion: reduce  → no parallax, no tilt, no progress bar
     · a coarse pointer (touch)        → no parallax, no tilt
   ========================================================================== */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  function motionOK() { return !reduced.matches; }
  function pointerOK() { return finePointer.matches && motionOK(); }

  /* ---------------- scroll progress ----------------
     A 3px rule across the top. Written as a scaleX on a custom property, so
     the browser only ever composites — no width animation, no layout. */
  function initProgress() {
    if (!motionOK()) return;
    var bar = document.createElement("div");
    bar.className = "lg-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);

    var ticking = false;
    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.setProperty("--lg-progress", ratio.toFixed(4));
      ticking = false;
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  /* ---------------- hero parallax ----------------
     The photograph drifts by at most ~14px against the pointer. The values
     are normalised to -1..1 and handed to CSS; the easing lives there too,
     so the image glides rather than tracking the cursor exactly. */
  function initHeroParallax() {
    var hero = document.querySelector(".hero");
    if (!hero || !pointerOK()) return;

    var frame = null;
    function move(e) {
      if (frame) return;
      frame = requestAnimationFrame(function () {
        frame = null;
        var r = hero.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        hero.style.setProperty("--lg-px", (-x * 2).toFixed(3));
        hero.style.setProperty("--lg-py", (-y * 2).toFixed(3));
      });
    }
    function rest() {
      hero.style.setProperty("--lg-px", "0");
      hero.style.setProperty("--lg-py", "0");
    }
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", rest, { passive: true });
    window.addEventListener("blur", rest);
  }

  /* ---------------- product card tilt + reflection ----------------
     Delegated from the document, because the grids are re-rendered from
     scratch on every language change and on every category filter — a
     listener bound to each card would be lost on the next render. */
  var MAX_TILT = 4;      /* degrees; the brief's ceiling is 5 */

  function initCardTilt() {
    if (!pointerOK()) return;
    var active = null;
    var frame = null;
    var last = null;

    function clear(card) {
      if (!card) return;
      card.style.removeProperty("--lg-rx");
      card.style.removeProperty("--lg-ry");
      card.style.removeProperty("--lg-mx");
      card.style.removeProperty("--lg-my");
    }

    function apply() {
      frame = null;
      if (!active || !last) return;
      var r = active.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var px = (last.clientX - r.left) / r.width;
      var py = (last.clientY - r.top) / r.height;
      active.style.setProperty("--lg-ry", ((px - 0.5) * 2 * MAX_TILT).toFixed(2) + "deg");
      active.style.setProperty("--lg-rx", ((0.5 - py) * 2 * MAX_TILT).toFixed(2) + "deg");
      active.style.setProperty("--lg-mx", (px * 100).toFixed(1) + "%");
      active.style.setProperty("--lg-my", (py * 100).toFixed(1) + "%");
    }

    document.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      var card = e.target instanceof Element ? e.target.closest(".p-card") : null;
      if (card !== active) { clear(active); active = card; }
      if (!active) return;
      last = { clientX: e.clientX, clientY: e.clientY };
      if (!frame) frame = requestAnimationFrame(apply);
    }, { passive: true });

    /* Leaving through a gap between cards, or scrolling the card away under
       a still pointer, both need the resting state back. */
    document.addEventListener("pointerleave", function () { clear(active); active = null; }, { passive: true });
    window.addEventListener("scroll", function () {
      if (active) { clear(active); active = null; }
    }, { passive: true });
  }

  /* If the visitor turns reduced-motion on mid-visit, drop every value we
     have written and let the stylesheet's static rules take over. */
  function watchReducedMotion() {
    if (!reduced.addEventListener) return;
    reduced.addEventListener("change", function (e) {
      if (!e.matches) return;
      document.querySelectorAll(".p-card, .hero").forEach(function (el) {
        ["--lg-rx", "--lg-ry", "--lg-mx", "--lg-my", "--lg-px", "--lg-py"]
          .forEach(function (prop) { el.style.removeProperty(prop); });
      });
    });
  }

  function boot() {
    initProgress();
    initHeroParallax();
    initCardTilt();
    watchReducedMotion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
