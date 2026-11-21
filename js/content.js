/* ==========================================================================
   content.js — preenche o convite com os dados de js/config.js
   ========================================================================== */
(function () {
  "use strict";
  var EA = window.EA, $ = EA.$;

  function fmtTime(t) { var p = t.split(":"); return p[1] === "00" ? p[0] + "h" : p[0] + "h" + p[1]; }

  var start = new Date(CONFIG.date + "T" + CONFIG.startTime + ":00-03:00");
  EA.eventStart = start;

  var dayLong = start.toLocaleDateString("pt-BR", { weekday: "long", timeZone: "America/Fortaleza" });
  var dateLong = start.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Fortaleza" });

  $("heroDate").textContent = dateLong + " · " + fmtTime(CONFIG.startTime);
  $("heroPlace").textContent = CONFIG.placeName + " · " + CONFIG.placeShort;
  $("dateBig").textContent = dateLong;
  $("dateSub").textContent = dayLong.charAt(0).toUpperCase() + dayLong.slice(1);
  $("timeBig").textContent = fmtTime(CONFIG.startTime);
  $("placeName").textContent = CONFIG.placeName;
  $("placeAddress").textContent = CONFIG.placeAddress;

  // Google Maps
  $("mapBtn").href = CONFIG.mapsUrl ||
    ("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.placeName + ", " + CONFIG.placeAddress));

  // Google Agenda
  function calStamp(date, time) { return date.replace(/-/g, "") + "T" + time.replace(":", "") + "00"; }
  $("calBtn").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent("Casamento E&A") +
    "&dates=" + calStamp(CONFIG.date, CONFIG.startTime) + "/" + calStamp(CONFIG.date, CONFIG.endTime) +
    "&ctz=America/Fortaleza" +
    "&details=" + encodeURIComponent("Esperamos você para celebrar o nosso casamento.") +
    "&location=" + encodeURIComponent(CONFIG.placeName + ", " + CONFIG.placeAddress);

  // Lista de presentes
  $("giftBtn").href = CONFIG.giftListUrl;

  // Confirmação de presença
  var rsvp = $("rsvpBtn");
  if (CONFIG.formUrl) {
    rsvp.href = CONFIG.formUrl;
    rsvp.target = "_blank";
    rsvp.rel = "noopener noreferrer";
  } else {
    rsvp.addEventListener("click", function (ev) {
      ev.preventDefault();
      $("rsvpStatus").textContent = "Você será redirecionado para o formulário de confirmação.";
    });
  }
})();
