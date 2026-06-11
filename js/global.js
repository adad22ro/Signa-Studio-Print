/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — global.js
   Funcționalitate globală suplimentară.

   NOTĂ: navbar scroll, hamburger, meniu mobil, active link,
   reveal on scroll și logo fallback sunt gestionate acum
   centralizat în js/components.js (împreună cu injectarea
   navbar/footer). Acest fișier rămâne pentru funcționalitate
   globală viitoare, ca să nu existe cod duplicat.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── SCROLL RESTORATION ────────────────────────────── */
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'auto';
  }

  /* ── SMOOTH SCROLL CU OFFSET NAVBAR ────────────────── */
  /* Pentru linkuri ancoră (#) — compensează înălțimea navbar-ului fix */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var targetId = link.getAttribute('href');
    if (targetId === '#' || targetId === '#main-content') return;

    var target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    var navbar = document.getElementById('navbar');
    var navH = navbar ? navbar.offsetHeight : 68;
    var top = target.getBoundingClientRect().top + window.scrollY - navH - 12;

    window.scrollTo({ top: top, behavior: 'smooth' });
  });

})();
