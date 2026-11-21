/* ==========================================================================
   core.js — utilidades compartilhadas (objeto global EA)
   ========================================================================== */
(function () {
  "use strict";
  var EA = window.EA = {};

  EA.$ = function (id) { return document.getElementById(id); };
  EA.pad = function (n) { return (n < 10 ? "0" : "") + n; };
  EA.rand = function (a, b) { return a + Math.random() * (b - a); };

  // preferências do aparelho
  EA.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  EA.fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // posição atual do ponteiro (usada por partículas, cursor e parallax)
  EA.pointer = { x: -9999, y: -9999, nx: 0, ny: 0 };
  window.addEventListener("pointermove", function (e) {
    EA.pointer.x = e.clientX; EA.pointer.y = e.clientY;
    EA.pointer.nx = e.clientX / window.innerWidth - 0.5;
    EA.pointer.ny = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  // brilhos que explodem a partir de um ponto
  EA.burst = function (x, y, count, dist) {
    if (EA.reduce) return;
    for (var i = 0; i < count; i++) {
      var s = document.createElement("span");
      s.className = "spark";
      var ang = EA.rand(0, Math.PI * 2), d = EA.rand(dist * 0.4, dist);
      s.style.setProperty("--x", x + "px"); s.style.setProperty("--y", y + "px");
      s.style.setProperty("--dx", Math.cos(ang) * d + "px"); s.style.setProperty("--dy", Math.sin(ang) * d + "px");
      s.style.setProperty("--s", EA.rand(7, 16) + "px"); s.style.setProperty("--t", EA.rand(0.7, 1.2) + "s");
      document.body.appendChild(s);
      setTimeout(function (el) { el.remove(); }.bind(null, s), 1300);
    }
  };

  // texto que se "decifra": letras aleatórias até chegar ao texto final
  EA.scramble = function (el, delay) {
    if (EA.reduce || el.__scrambling) return;
    el.__scrambling = true;
    var finalText = el.textContent, len = finalText.length;
    var glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", keep = /[\s·,.\-–()/]/;
    var frame = 0, total = 28;
    setTimeout(function () {
      var id = setInterval(function () {
        frame++;
        var out = "";
        for (var i = 0; i < len; i++) {
          var c = finalText.charAt(i);
          out += (keep.test(c) || i / len < frame / total) ? c : glyphs.charAt(Math.floor(Math.random() * glyphs.length));
        }
        el.textContent = out;
        if (frame >= total) { clearInterval(id); el.textContent = finalText; }
      }, 32);
    }, delay || 0);
  };
})();
