/* ==========================================================================
   reveal.js — revelação ao rolar: títulos em máscara, texto palavra por
   palavra, blocos com fade e textos que se decifram
   ========================================================================== */
(function () {
  "use strict";
  var EA = window.EA;
  var prepared = false;

  // quebra um parágrafo em palavras (a história entra automaticamente, inclusive
  // parágrafos que os noivos adicionarem depois)
  function splitWords(p) {
    var words = p.textContent.trim().split(/\s+/);
    p.textContent = "";
    p.setAttribute("aria-label", words.join(" "));
    words.forEach(function (w, i) {
      var s = document.createElement("span");
      s.className = "w"; s.setAttribute("aria-hidden", "true");
      s.style.setProperty("--w", Math.min(i, 90));
      s.textContent = w;
      p.appendChild(s);
      if (i < words.length - 1) p.appendChild(document.createTextNode(" "));
    });
    p.setAttribute("data-reveal", "words");
  }

  function wrapMask(h) {
    var txt = h.textContent;
    h.textContent = "";
    var m = document.createElement("span"); m.className = "mask";
    var i = document.createElement("span"); i.className = "mask-in"; i.textContent = txt;
    m.appendChild(i); h.appendChild(m);
  }

  function prepare() {
    if (prepared) return; prepared = true;
    document.querySelectorAll(".story-body p.t, .story-body p.hl").forEach(splitWords);
    document.querySelectorAll("h2.display").forEach(wrapMask);

    var auto = [".story-body > *:not(p.t):not(p.hl)", ".sec-head", ".ledger .cell", ".split > div", ".count .wrap > *", ".rsvp-status"];
    document.querySelectorAll(auto.join(",")).forEach(function (el) {
      if (el.hasAttribute("data-reveal")) return;
      el.setAttribute("data-reveal", "");
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty("--d", Math.min(idx, 6) * 0.12 + "s");
    });
  }

  function reveal(el) {
    el.classList.add("is-in");
    // textos que se decifram (o próprio elemento ou os que estão dentro dele)
    var targets = el.hasAttribute("data-scramble") ? [el] : [];
    el.querySelectorAll("[data-scramble]").forEach(function (t) { targets.push(t); });
    targets.forEach(function (t, i) { EA.scramble(t, 250 + i * 150); });
    // contagem: os números sobem
    if (el.classList.contains("cd-row") && !reveal.counted) { reveal.counted = true; EA.countUp(); }
  }

  EA.initReveal = function () {
    prepare();
    var all = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) { all.forEach(reveal); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        reveal(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    all.forEach(function (el) { io.observe(el); });
  };

  // Prepara já no carregamento (antes da abertura sumir) para não haver "pulo" visual.
  prepare();
})();
