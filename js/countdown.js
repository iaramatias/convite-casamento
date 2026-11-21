/* ==========================================================================
   countdown.js — contagem regressiva (dias, horas, minutos e segundos)
   ========================================================================== */
(function () {
  "use strict";
  var EA = window.EA, $ = EA.$, pad = EA.pad;

  var cd = { days: $("cdDays"), hours: $("cdHours"), mins: $("cdMins"), secs: $("cdSecs") };
  var last = {};
  var counting = false; // enquanto os números "sobem" na primeira exibição

  function parts() {
    var diff = Math.max(0, EA.eventStart.getTime() - Date.now());
    var total = Math.floor(diff / 1000);
    return {
      days: Math.floor(total / 86400),
      hours: Math.floor((total % 86400) / 3600),
      mins: Math.floor((total % 3600) / 60),
      secs: total % 60
    };
  }
  function fmt(key, n) { return key === "days" ? String(n) : pad(n); }

  function setVal(key, text, animate) {
    if (last[key] === text) return;
    last[key] = text;
    cd[key].textContent = text;
    if (animate && !EA.reduce) {
      cd[key].classList.remove("bump");
      void cd[key].offsetWidth; // reinicia a animação
      cd[key].classList.add("bump");
    }
  }
  function tick(animate) {
    if (counting) return;
    var p = parts();
    for (var k in cd) setVal(k, fmt(k, p[k]), animate);
  }
  tick(false);
  setInterval(function () { tick(true); }, 1000);

  // na primeira vez que a contagem aparece, os números sobem até o valor real
  EA.countUp = function () {
    if (EA.reduce) return;
    var target = parts(), t0 = performance.now(), dur = 1800;
    counting = true;
    (function frame(now) {
      var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      for (var k in cd) cd[k].textContent = fmt(k, Math.round(target[k] * e));
      if (p < 1) requestAnimationFrame(frame);
      else { counting = false; last = {}; tick(false); }
    })(t0);
  };
})();
