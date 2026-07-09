/* ═══════════════════════════════════════════════════════
   DEZVOLTARE WEB — components.js
   Injectare header + footer, meniu mobil, reveal la scroll.
   Se modifică într-un singur loc.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var BRAND = 'Signa Studio Print'; // nume temporar — se schimbă la rebranding

  var HEADER_HTML = [
    '<header class="site-header">',
    '  <a href="#main-content" class="brand">' + BRAND + '</a>',
    '  <nav class="nav" aria-label="Navigație principală">',
    '    <a href="#servicii" class="nav-link">Servicii</a>',
    '    <a href="#contact" class="nav-link">Contact</a>',
    '  </nav>',
    '  <a href="#contact" class="nav-cta">Hai să discutăm</a>',
    '  <button class="hamburger" id="hamburger" aria-label="Deschide meniul" aria-expanded="false" aria-controls="mobileMenu">',
    '    <span></span><span></span><span></span>',
    '  </button>',
    '</header>',
    '<div class="mobile-menu" id="mobileMenu" role="navigation" aria-label="Meniu mobil">',
    '  <a href="#servicii">Servicii</a>',
    '  <a href="#contact">Contact</a>',
    '  <a href="#contact">Hai să discutăm</a>',
    '</div>'
  ].join('\n');

  var FOOTER_HTML = [
    '<footer class="site-footer">',
    '  © <span id="footerYear">2026</span> ' + BRAND,
    '</footer>'
  ].join('\n');

  /* ── INJECTARE ─────────────────────────────────────── */
  var headerPlaceholder = document.getElementById('header-placeholder');
  var footerPlaceholder = document.getElementById('footer-placeholder');
  if (headerPlaceholder) headerPlaceholder.outerHTML = HEADER_HTML;
  if (footerPlaceholder) footerPlaceholder.outerHTML = FOOTER_HTML;

  /* ── AN FOOTER AUTOMAT ─────────────────────────────── */
  var yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── MENIU MOBIL ───────────────────────────────────── */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Deschide meniul');
  }

  function toggleMenu() {
    if (!hamburger || !mobileMenu) return;
    var isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    hamburger.setAttribute('aria-label', isOpen ? 'Închide meniul' : 'Deschide meniul');
  }

  if (hamburger) hamburger.addEventListener('click', toggleMenu);

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* Închidere la click în afară */
  document.addEventListener('click', function (e) {
    if (
      mobileMenu && mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      hamburger && !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* Închidere la Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  /* ── REVEAL LA SCROLL ──────────────────────────────── */
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

})();
