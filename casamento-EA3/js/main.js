/* ==========================================================================
   main.js — abertura do convite e inicialização
   Fluxo: carrega (contador) → botão "Abrir convite" → música + revelação.
   Se não houver música, o convite abre sozinho ao terminar de carregar.
   ========================================================================== */
(function () {
  "use strict";
  var EA = window.EA, $ = EA.$;

  var body = document.body;
  var pre = $("preloader"), pct = $("pct"), enter = $("enter");
  var enterBtn = $("enterBtn"), enterMute = $("enterMute");
  var began = false, loaded = document.readyState === "complete", ready = false;

  body.classList.add("is-loading");

  function begin(withMusic) {
    if (began) return;
    began = true;
    if (withMusic) EA.music.play();
    EA.music.showDock();
    pre.classList.add("is-done");
    body.classList.remove("is-loading");
    body.classList.add("is-ready");
    EA.initReveal();
    if (!EA.reduce) setTimeout(function () { EA.burst(window.innerWidth / 2, window.innerHeight * 0.42, 20, 160); }, 500);
  }

  // sem arquivo de música: some o botão de "sem música" e abre sozinho
  EA.music.onUnavailable = function () {
    enterMute.hidden = true;
    if (ready) begin(false);
  };

  function showEnter() {
    ready = true;
    pct.textContent = "100";
    if (!EA.music.available) { begin(false); return; }
    pre.classList.add("has-actions");
    enter.classList.add("is-on");
    enterBtn.focus({ preventScroll: true });
    setTimeout(function () { begin(false); }, 15000); // visitante parado: abre sem música
  }

  // contador de carregamento
  var t0 = performance.now(), dur = EA.reduce ? 150 : 1800;
  window.addEventListener("load", function () { loaded = true; });
  (function frame(now) {
    var p = Math.min(1, (now - t0) / dur);
    if (!loaded) p = Math.min(p, 0.92);
    var n = Math.round(p * 100);
    pct.textContent = ("00" + n).slice(-3);
    if (p >= 1 && loaded) showEnter(); else requestAnimationFrame(frame);
  })(t0);

  enterBtn.addEventListener("click", function () { begin(true); });
  enterMute.addEventListener("click", function () { begin(false); });
})();
