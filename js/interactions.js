/* ==========================================================================
   interactions.js — navegação, parallax, botões, spotlight, tilt
   ========================================================================== */
(function () {
  "use strict";
  var EA = window.EA, $ = EA.$, rand = EA.rand;

  /* Navegação: sombra, barra de progresso, link ativo e parallax do fundo */
  var nav = $("nav"), progress = $("progress"), stageBg = $("stageBg");
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a:not(.cta)"));
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle("is-scrolled", y > 30);
    progress.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    if (!EA.reduce) stageBg.style.transform = "translate3d(0," + Math.min(y * 0.12, 150) + "px,0)";
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window) {
    var sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { if (s) spy.observe(s); });
  }

  /* Desempenho: pausa as animações contínuas (auroras, esferas, faixa, rodapé) quando saem da tela */
  if ("IntersectionObserver" in window) {
    var pauser = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle("is-offscreen", !en.isIntersecting); });
    }, { rootMargin: "200px 0px" });
    document.querySelectorAll(".aurora, .orbs, .marquee, footer .mono").forEach(function (el) { pauser.observe(el); });
  }

  /* Botões: onda de luz + chuva de brilhos ao clicar, efeito "ímã" com mouse */
  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.addEventListener("pointerdown", function (e) {
      var r = btn.getBoundingClientRect();
      if (!EA.reduce) {
        var rp = document.createElement("span");
        rp.className = "ripple";
        rp.style.left = (e.clientX - r.left) + "px"; rp.style.top = (e.clientY - r.top) + "px";
        btn.appendChild(rp);
        setTimeout(function () { rp.remove(); }, 750);
      }
      var gold = btn.classList.contains("gold");
      EA.burst(e.clientX, e.clientY, gold ? 16 : 10, gold ? 110 : 80);
    });
    if (EA.fine && !EA.reduce) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        btn.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5) * 8 + "px");
        btn.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5) * 6 + "px");
      });
      btn.addEventListener("pointerleave", function () {
        btn.style.setProperty("--mx", "0px"); btn.style.setProperty("--my", "0px");
      });
    }
  });

  /* Spotlight: luz dourada que segue o mouse dentro dos cartões */
  document.querySelectorAll(".cell, .gift-box").forEach(function (el) {
    el.classList.add("spot");
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--sx", (e.clientX - r.left) + "px");
      el.style.setProperty("--sy", (e.clientY - r.top) + "px");
    });
  });

  if (EA.fine && !EA.reduce) {
    /* Moldura da foto inclina em 3D */
    var arch = document.querySelector(".arch"), archWrap = $("archWrap");
    if (arch && archWrap) {
      archWrap.addEventListener("pointermove", function (e) {
        var r = archWrap.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        arch.style.setProperty("--ry", px * 10 + "deg"); arch.style.setProperty("--rx", -py * 8 + "deg");
      });
      archWrap.addEventListener("pointerleave", function () {
        arch.style.setProperty("--ry", "0deg"); arch.style.setProperty("--rx", "0deg");
      });
    }

    /* Parallax do topo acompanhando o mouse (variáveis --px e --py) */
    var stage = $("stage"), cx = 0, cy = 0;
    (function loop() {
      cx += (EA.pointer.nx - cx) * 0.06; cy += (EA.pointer.ny - cy) * 0.06;
      stage.style.setProperty("--px", cx.toFixed(3)); stage.style.setProperty("--py", cy.toFixed(3));
      requestAnimationFrame(loop);
    })();

    /* Rastro de brilhos atrás do cursor */
    var lastTrail = 0;
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var now = performance.now();
      if (now - lastTrail < 90) return;
      lastTrail = now;
      var s = document.createElement("span");
      s.className = "spark";
      s.style.setProperty("--x", e.clientX + "px"); s.style.setProperty("--y", e.clientY + "px");
      s.style.setProperty("--dx", rand(-14, 14) + "px"); s.style.setProperty("--dy", rand(10, 34) + "px");
      s.style.setProperty("--s", rand(5, 10) + "px"); s.style.setProperty("--t", "0.9s");
      document.body.appendChild(s);
      setTimeout(function () { s.remove(); }, 1000);
    }, { passive: true });
  }
})();
