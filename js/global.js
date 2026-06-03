/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — global.js
   Funcționalitate comună tuturor paginilor:
   navbar scroll, hamburger menu, reveal on scroll,
   active nav link, logo fallback
   ═══════════════════════════════════════════════════════ */

/* ── GSAP CDN ────────────────────────────────────────── */
// GSAP este încărcat din CDN în HTML

(function () {
  'use strict';

  /* ── NAVBAR SCROLL ─────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); // la inițializare

  /* ── HAMBURGER MENU ────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.toggleMenu = function () {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  };

  // Închide meniul la click pe link
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // Închide meniul la click în afara lui
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
    }
  });

  /* ── ACTIVE NAV LINK ───────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && href.split('#')[0] === currentPage) {
      link.classList.add('active');
    }
  });

  /* ── REVEAL ON SCROLL (IntersectionObserver) ────────── */
  const revealObserver = new IntersectionObserver(
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

  /* ── LOGO IMAGE LOAD ───────────────────────────────── */
  // Logo-ul este referit prin src direct; fallback la text dacă nu se încarcă
  const logoImg = document.getElementById('logoImg');
  if (logoImg) {
    logoImg.addEventListener('error', function () {
      logoImg.style.display = 'none';
    });
  }

})();
