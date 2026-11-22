/* ==========================================================================
   music.js — música de fundo e letra sincronizada
   Arquivo de áudio: CONFIG.musicUrl (assets/audio/). Letra: js/lyrics.js
   ========================================================================== */
(function () {
  "use strict";
  var EA = window.EA, $ = EA.$;

  var dock = $("music"), btn = $("musicBtn");
  var panel = $("lyrics"), now = $("lyricsNow"), next = $("lyricsNext");
  var lines = (typeof LYRICS !== "undefined" && LYRICS.length) ? LYRICS.slice().sort(function (a, b) { return a.t - b.t; }) : [];
  var target = typeof CONFIG.musicVolume === "number" ? CONFIG.musicVolume : 0.6;

  var audio = new Audio();
  audio.loop = true; audio.preload = "auto"; audio.volume = 0;

  var music = EA.music = { available: true, playing: false, onUnavailable: null };
  var fadeTimer = null, pausedByTab = false, lastIdx = -2;

  audio.addEventListener("error", function () {
    music.available = false; music.playing = false;
    dock.hidden = true; panel.hidden = true;
    if (music.onUnavailable) music.onUnavailable();
  });
  audio.src = CONFIG.musicUrl;

  function fade(to, done) {
    clearInterval(fadeTimer);
    fadeTimer = setInterval(function () {
      var v = audio.volume, n = v + (to > v ? 0.04 : -0.04);
      if (Math.abs(to - n) <= 0.04) { n = to; clearInterval(fadeTimer); if (done) done(); }
      audio.volume = Math.max(0, Math.min(1, n));
    }, 60);
  }

  function setState(on) {
    music.playing = on;
    dock.classList.toggle("is-playing", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    panel.classList.toggle("is-on", on && lines.length > 0);
  }

  music.play = function () {
    if (!music.available) return;
    var p = audio.play();
    if (p && p.then) {
      p.then(function () { setState(true); fade(target); }).catch(function () { setState(false); });
    } else { setState(true); fade(target); }
  };
  music.pause = function () {
    setState(false);
    fade(0, function () { audio.pause(); });
  };
  music.showDock = function () { if (music.available) dock.hidden = false; };

  btn.addEventListener("click", function () { music.playing ? music.pause() : music.play(); });

  // pausa quando a aba fica escondida e volta quando o visitante retorna
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && music.playing) { pausedByTab = true; audio.pause(); }
    else if (!document.hidden && pausedByTab) { pausedByTab = false; audio.play().catch(function () {}); }
  });

  // letra sincronizada
  if (lines.length) {
    panel.hidden = false;
    audio.addEventListener("timeupdate", function () {
      var t = audio.currentTime, idx = -1;
      for (var i = 0; i < lines.length; i++) { if (lines[i].t <= t) idx = i; else break; }
      if (idx === lastIdx) return;
      lastIdx = idx;
      now.textContent = idx >= 0 ? lines[idx].text : "";
      next.textContent = lines[idx + 1] ? lines[idx + 1].text : "";
      now.classList.remove("swap"); void now.offsetWidth; now.classList.add("swap");
    });
  }
})();
