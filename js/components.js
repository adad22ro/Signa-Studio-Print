/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — components.js
   Injectare automată navbar + footer în toate paginile.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var NAVBAR_HTML = [
    '<nav id="navbar" aria-label="Navigație principală">',
    '  <a href="index.html" class="nav-logo" aria-label="Signa Studio Print — Acasă">',
    '    <img id="logoImg" src="img/LOGO_SIGNA.svg" alt="Signa Studio Print" width="38" height="75">',
    '    <span class="nav-logo-text">Signa Studio Print',
    '      <span>Design · Web · Publicitate</span>',
    '    </span>',
    '  </a>',
    '  <ul class="nav-links">',
    '    <li><a href="index.html" class="nl-item">Acasă</a></li>',
    '    <li><a href="site-uri.html" class="nl-item nl-featured">',
    '      Web Development',
    '    </a></li>',
    '    <li><a href="productie-publicitara.html" class="nl-item">Producție Publicitară</a></li>',
    '    <li><a href="tipografie.html" class="nl-item">Tipografie</a></li>',
    '    <li><a href="preturi.html" class="nl-item">Prețuri</a></li>',
    '    <li><a href="contact.html" class="nl-item nl-contact">Contact</a></li>',
    '  </ul>',
    '  <button class="nav-hamburger" id="hamburger" aria-label="Deschide meniul" aria-expanded="false" aria-controls="mobileMenu">',
    '    <span></span><span></span><span></span>',
    '  </button>',
    '</nav>',
    '<div class="mobile-menu" id="mobileMenu" role="navigation" aria-label="Meniu mobil">',
    '  <a href="index.html">Acasă</a>',
    '  <a href="site-uri.html" class="mm-featured">Web Development</a>',
    '  <a href="productie-publicitara.html">Producție Publicitară</a>',
    '  <a href="tipografie.html">Tipografie</a>',
    '  <a href="preturi.html">Prețuri</a>',
    '  <a href="contact.html">Contact</a>',
    '</div>'
  ].join('\n');

  var FOOTER_HTML = [
    '<footer>',
    '  <div class="footer-inner">',
    '    <div class="footer-brand">',
    '      <div class="footer-logo">',
    '        <img src="img/LOGO_SIGNA_alb.svg" alt="Signa Studio Print" width="40" height="79">',
    '        <span class="footer-logo-text">Signa Studio Print</span>',
    '      </div>',
    '      <div class="footer-tagline">Design · Web · Publicitate</div>',
    '      <p>Grafică profesională pentru orice suport, de la carte de vizită la colantări auto. Iași, România.</p>',
    '    </div>',
    '    <div class="footer-col">',
    '      <h4>Servicii</h4>',
    '      <ul>',
    '        <li><a href="site-uri.html">Web Development</a></li>',
    '        <li><a href="productie-publicitara.html">Producție Publicitară</a></li>',
    '        <li><a href="tipografie.html">Tipografie &amp; Print</a></li>',
    '        <li><a href="preturi.html">Prețuri</a></li>',
    '      </ul>',
    '    </div>',
    '    <div class="footer-col">',
    '      <h4>Contact</h4>',
    '      <address>',
    '        Iași, România<br>',
    '        <a href="tel:+40000000000">+40 000 000 000</a><br>',
    '        <a href="mailto:contact@signastudioprint.ro">contact@signastudioprint.ro</a>',
    '      </address>',
    '    </div>',
    '  </div>',
    '  <div class="footer-bottom">',
    '    <div class="footer-copy">© <span id="footerYear">2025</span> Signa Studio Print — Toate drepturile rezervate</div>',
    '    <div class="footer-made">Site creat cu <span>AI</span> · Signa Studio Print</div>',
    '  </div>',
    '</footer>'
  ].join('\n');

  /* ── INJECTARE ─────────────────────────────────────── */
  var navPlaceholder = document.getElementById('navbar-placeholder');
  var footerPlaceholder = document.getElementById('footer-placeholder');

  if (navPlaceholder) navPlaceholder.outerHTML = NAVBAR_HTML;
  if (footerPlaceholder) footerPlaceholder.outerHTML = FOOTER_HTML;

  /* ── AN FOOTER AUTOMAT ─────────────────────────────── */
  var yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── ACTIVE NAV LINK ───────────────────────────────── */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.split('#')[0] === currentPage) {
      link.classList.add('active');
    }
  });

  /* ── NAVBAR SCROLL ─────────────────────────────────── */
  var navbar = document.getElementById('navbar');

  /* Detectează dacă pagina are un hero întunecat (ex: Web Development).
     Navbarul devine alb (on-dark) cât timp e transparent peste el. */
  var darkHero = document.querySelector('.su-hero, .pp-hero, .tp-hero');

  function updateNavbar() {
    if (!navbar) return;
    var scrolled = window.scrollY > 20;
    navbar.classList.toggle('scrolled', scrolled);
    /* on-dark doar pe pagini cu hero întunecat și doar înainte de scroll */
    if (darkHero) {
      navbar.classList.toggle('on-dark', !scrolled);
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ── HAMBURGER MENU ────────────────────────────────── */
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

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* Închidere la click în afara meniului */
  document.addEventListener('click', function (e) {
    if (
      mobileMenu &&
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      hamburger &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* Închidere la tasta Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  /* ── LOGO FALLBACK ─────────────────────────────────── */
  var logoImg = document.getElementById('logoImg');
  if (logoImg) {
    logoImg.addEventListener('error', function () {
      logoImg.style.display = 'none';
    });
  }

  /* ── REVEAL ON SCROLL ──────────────────────────────── */
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

})();
