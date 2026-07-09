/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — index.js
   Funcționalitate specifică homepage-ului
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ── Marquee: dublare pentru scroll infinit ──────── */
    var track = document.querySelector('.marquee-track');
    if (track) {
      var clone = track.cloneNode(true);
      track.parentElement.appendChild(clone);
    }

    /* ── Carduri proiecte: click spre proiecte.html ──── */
    document.querySelectorAll('.ps-card').forEach(function (card) {
      card.addEventListener('click', function () {
        window.location.href = 'proiecte.html';
      });
    });

  });

})();
