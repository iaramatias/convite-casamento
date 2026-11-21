/* ==========================================================================
   particles.js — vagalumes dourados que flutuam, piscam e se afastam do mouse
   ========================================================================== */
(function () {
  "use strict";
  var EA = window.EA, rand = EA.rand;
  var MOUSE = 130;      // raio em que o mouse afasta suavemente os vagalumes

  EA.makeSparkles = function (canvas, density) {
    if (!canvas || EA.reduce) return;
    var ctx = canvas.getContext("2d");
    var w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var parts = [], running = false, visible = false, rect = null;

    function spawn(anywhere) {
      return {
        x: rand(0, w), y: anywhere ? rand(0, h) : h + 10,
        r: rand(0.8, 2.8), vy: rand(0.12, 0.45), vx: rand(-0.12, 0.12),
        ph: rand(0, Math.PI * 2), sp: rand(0.01, 0.03), a: rand(0.4, 1)
      };
    }
    function size() {
      rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(70, Math.max(18, (w * h) / density)));
      parts = [];
      for (var i = 0; i < count; i++) parts.push(spawn(true));
    }

    function frame() {
      if (!running) return;
      rect = canvas.getBoundingClientRect();
      var mx = EA.pointer.x - rect.left, my = EA.pointer.y - rect.top;
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.ph += p.sp; p.y -= p.vy; p.x += p.vx + Math.sin(p.ph) * 0.25;
        // o mouse afasta suavemente as partículas
        var dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        if (d2 < MOUSE * MOUSE && d2 > 1) {
          var d = Math.sqrt(d2), f = (1 - d / MOUSE) * 1.6;
          p.x += (dx / d) * f; p.y += (dy / d) * f;
        }
        if (p.y < -10) { parts[i] = spawn(false); continue; }

        var tw = 0.5 + 0.5 * Math.sin(p.ph * 2);
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, "rgba(255, 232, 186, " + (p.a * tw) + ")");
        g.addColorStop(0.35, "rgba(214, 170, 108, " + (p.a * tw * 0.55) + ")");
        g.addColorStop(1, "rgba(214, 170, 108, 0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2); ctx.fill();
      }

      requestAnimationFrame(frame);
    }

    function toggle() {
      var should = visible && !document.hidden;
      if (should && !running) { running = true; requestAnimationFrame(frame); }
      else if (!should) running = false;
    }

    size();
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(size, 200); });
    document.addEventListener("visibilitychange", toggle);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; toggle(); }).observe(canvas);
    } else { visible = true; toggle(); }
  };

  EA.makeSparkles(EA.$("sparkles"), 16000);
  EA.makeSparkles(EA.$("sparklesRsvp"), 22000);
})();
