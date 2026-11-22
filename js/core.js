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

  // texto que "se revela" letra por letra, da esquerda para a direita, SEM letras aleatórias.
  // Cada palavra tem largura fixa (medida com o texto real), então o layout e a quebra de
  // linha não mudam durante o efeito; as letras ainda não reveladas ficam transparentes.
  EA.scramble = function (el, delay) {
    if (EA.reduce || el.__scrambling) return;
    el.__scrambling = true;
    var finalText = el.textContent;

    var words = finalText.split(/(\s+)/), boxes = [];
    el.textContent = "";
    words.forEach(function (w) {
      if (!w || /^\s+$/.test(w)) { el.appendChild(document.createTextNode(w)); return; }
      var s = document.createElement("span");
      s.style.cssText = "display:inline-block;white-space:nowrap;vertical-align:top";
      s.textContent = w;
      el.appendChild(s);
      boxes.push({ el: s, text: w });
    });
    boxes.forEach(function (b) { b.w = b.el.getBoundingClientRect().width; });
    boxes.forEach(function (b) { b.el.style.width = b.w + "px"; });

    var total = boxes.reduce(function (n, b) { return n + b.text.length; }, 0);
    var frame = 0, frames = 28;
    setTimeout(function () {
      var id = setInterval(function () {
        frame++;
        var shown = Math.round(total * frame / frames), done = 0;
        boxes.forEach(function (b) {
          var n = Math.max(0, Math.min(b.text.length, shown - done));
          done += b.text.length;
          b.el.textContent = b.text.slice(0, n);
          if (n < b.text.length) {
            var rest = document.createElement("span");
            rest.style.color = "transparent"; rest.textContent = b.text.slice(n);
            b.el.appendChild(rest);
          }
        });
        if (frame >= frames) { clearInterval(id); el.textContent = finalText; }
      }, 32);
    }, delay || 0);
  };
})();
