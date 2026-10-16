// Starfield: a fixed canvas of stars, layered at different depths. Scrolling
// drifts each layer at a different speed (nearer layers move faster), and
// stars wrap seamlessly so the effect feels continuous no matter how far
// you scroll — like drifting through a field of stars rather than just
// scrolling past a flat background. Twinkling runs independently of scroll.
document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById("starfield");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var width, height;

  // Three depth layers: far (small, dim, slow) to near (bigger, brighter, fast).
  var layers = [
    { count: 90, speed: 0.02, size: [0.5, 1.1], alpha: [0.15, 0.4], stars: [] },
    { count: 55, speed: 0.05, size: [0.8, 1.6], alpha: [0.25, 0.55], stars: [] },
    { count: 28, speed: 0.09, size: [1.1, 2.2], alpha: [0.35, 0.75], stars: [] }
  ];

  function rand(min, max) { return min + Math.random() * (max - min); }

  function buildLayer(layer) {
    layer.fieldHeight = height * 2.2; // wrap period — how far you scroll before it loops
    layer.stars = [];
    for (var i = 0; i < layer.count; i++) {
      layer.stars.push({
        x: Math.random() * width,
        y: Math.random() * layer.fieldHeight,
        r: rand(layer.size[0], layer.size[1]),
        baseAlpha: rand(layer.alpha[0], layer.alpha[1]),
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: rand(0.4, 1.1)
      });
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layers.forEach(buildLayer);
  }

  function draw(scrollY, t) {
    ctx.clearRect(0, 0, width, height);
    layers.forEach(function (layer) {
      var offset = (scrollY * layer.speed) % layer.fieldHeight;
      layer.stars.forEach(function (star) {
        var y = star.y - offset;
        // wrap vertically so stars loop seamlessly in both directions
        if (y < 0) y += layer.fieldHeight;
        if (y > layer.fieldHeight) y -= layer.fieldHeight;
        if (y > height) return; // only draw within the visible viewport slice

        var twinkle = reduceMotion ? 1 : 0.7 + 0.3 * Math.sin(t * 0.001 * star.twinkleSpeed + star.phase);
        ctx.globalAlpha = star.baseAlpha * twinkle;
        ctx.fillStyle = "#f5f0ec";
        ctx.beginPath();
        ctx.arc(star.x, y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
    });
    ctx.globalAlpha = 1;
  }

  resize();
  window.addEventListener("resize", resize);

  if (reduceMotion) {
    // Static single frame — no continuous animation loop at all.
    draw(window.scrollY || 0, 0);
    window.addEventListener("scroll", function () {
      draw(window.scrollY || 0, 0);
    }, { passive: true });
    return;
  }

  function frame(t) {
    draw(window.scrollY || window.pageYOffset || 0, t);
    window.requestAnimationFrame(frame);
  }
  window.requestAnimationFrame(frame);
});

// Hero photo pan: the hero backdrop is fixed (always spans the full page,
// header to footer), but the image itself is oversized and pans slightly
// as you scroll, so which part of it is visible keeps shifting. Clamped so
// it never scrolls past its own oversized edges. Skipped for
// prefers-reduced-motion (image just stays put).
document.addEventListener("DOMContentLoaded", function () {
  var photo = document.querySelector(".hero-photo");
  if (!photo) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  var ticking = false;

  function update() {
    var scrollY = window.scrollY || window.pageYOffset;
    var maxShift = window.innerHeight * 0.12; // matches the CSS oversize buffer
    var shift = Math.min(scrollY * 0.08, maxShift);
    photo.style.transform = "translateY(-" + shift + "px)";
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", update);
  update();
});

// Scroll cue: fades out once the user starts scrolling past the hero.
document.addEventListener("DOMContentLoaded", function () {
  var cue = document.querySelector(".scroll-cue");
  if (!cue) return;
  var ticking = false;
  function update() {
    var scrollY = window.scrollY || window.pageYOffset;
    cue.style.opacity = String(Math.max(0, 0.6 - scrollY / 300));
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
});

// Fade sections in as they enter the viewport, and back out as they leave —
// applies to any element marked data-fade (currently just the homepage
// sections). Reversible both ways via IntersectionObserver; disabled under
// prefers-reduced-motion (sections just stay visible, see CSS).
document.addEventListener("DOMContentLoaded", function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  var targets = document.querySelectorAll("[data-fade]");
  if (!targets.length || !("IntersectionObserver" in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  }, { threshold: 0.15 });

  targets.forEach(function (el) { observer.observe(el); });
});
