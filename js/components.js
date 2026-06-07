/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — components.js
   Injectare automată navbar + footer în toate paginile.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var NAVBAR_HTML = [
    '<nav id="navbar">',
    '  <a href="index.html" class="nav-logo">',
    '    <img id="logoImg" src="img/LOGO_SIGNA_mic.PNG" alt="Signa Studio Print logo">',
    '    <div class="nav-logo-text">',
    '      Signa Studio Print',
    '      <span>Design · Web · Publicitate</span>',
    '    </div>',
    '  </a>',
    '  <ul class="nav-links">',
    '    <li><a href="index.html" class="nl-item">Acasă</a></li>',
    '    <li><a href="site-uri.html" class="nl-item nl-featured">',
    '      <span class="nl-badge">AI</span>Web Development',
    '    </a></li>',
    '    <li><a href="productie-publicitara.html" class="nl-item">Producție Publicitară</a></li>',
    '    <li><a href="tipografie.html" class="nl-item">Tipografie</a></li>',
    '    <li><a href="proiecte.html" class="nl-item">Proiecte</a></li>',
    '    <li><a href="preturi.html" class="nl-item">Prețuri</a></li>',
    '    <li><a href="contact.html" class="nl-item nl-contact">Contact</a></li>',
    '  </ul>',
    '  <div class="nav-hamburger" id="hamburger" onclick="toggleMenu()" aria-label="Meniu" aria-expanded="false">',
    '    <span></span><span></span><span></span>',
    '  </div>',
    '</nav>',
    '<div class="mobile-menu" id="mobileMenu" role="navigation">',
    '  <a href="index.html">Acasă</a>',
    '  <a href="site-uri.html" class="mm-featured">Web Development <span class="mm-badge">AI</span></a>',
    '  <a href="productie-publicitara.html">Producție Publicitară</a>',
    '  <a href="tipografie.html">Tipografie</a>',
    '  <a href="proiecte.html">Proiecte</a>',
    '  <a href="preturi.html">Prețuri</a>',
    '  <a href="contact.html">Contact</a>',
    '</div>'
  ].join('\n');

  var FOOTER_HTML = [
    '<footer>',
    '  <div class="footer-inner">',
    '    <div class="footer-brand">',
    '      <div class="footer-logo-text">Signa Studio Print</div>',
    '      <div class="footer-tagline">Design · Web · Publicitate</div>',
    '      <p>Grafică profesională pentru orice suport, de la carte de vizită la colantări auto. Iași, România.</p>',
    '    </div>',
    '    <div class="footer-col">',
    '      <h4>Servicii</h4>',
    '      <ul>',
    '        <li><a href="site-uri.html">Web Development</a></li>',
    '        <li><a href="productie-publicitara.html">Producție Publicitară</a></li>',
    '        <li><a href="tipografie.html">Tipografie &amp; Print</a></li>',
    '        <li><a href="proiecte.html">Portofoliu</a></li>',
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
    '    <div class="footer-copy">© 2025 Signa Studio Print — Toate drepturile rezervate</div>',
    '    <div class="footer-made">Site creat cu <span>AI</span> · Signa Studio Print</div>',
    '  </div>',
    '</footer>'
  ].join('\n');

  /* ── INJECTARE ─────────────────────────────────────── */
  var navPlaceholder = document.getElementById('navbar-placeholder');
  var footerPlaceholder = document.getElementById('footer-placeholder');

  if (navPlaceholder) navPlaceholder.outerHTML = NAVBAR_HTML;
  if (footerPlaceholder) footerPlaceholder.outerHTML = FOOTER_HTML;

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

  function updateNavbar() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ── HAMBURGER MENU ────────────────────────────────── */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  window.toggleMenu = function () {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open'));
  };

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.addEventListener('click', function (e) {
    if (
      mobileMenu &&
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      hamburger &&
      !hamburger.contains(e.target)
    ) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
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
