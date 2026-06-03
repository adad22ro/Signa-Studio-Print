/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — index.js
   Animații specifice paginii principale cu GSAP
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── GSAP Hero Animations ──────────────────────────── */
  // Rulează după ce DOM-ul e gata
  document.addEventListener('DOMContentLoaded', function () {

    // Verificăm că GSAP este disponibil
    if (typeof gsap === 'undefined') return;

    /* Animație hero cu GSAP (staggered) */
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
      .from('.hero-line', {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1.2,
        delay: 0.2
      })
      .from('.hero-bg-text', {
        opacity: 0,
        scale: 1.04,
        duration: 1.8,
        ease: 'power2.out'
      }, '-=0.8')
      .from('.hero-eyebrow', {
        opacity: 0,
        y: 20,
        duration: 0.7
      }, '-=1.2')
      .from('.hero-title', {
        opacity: 0,
        y: 28,
        duration: 0.8
      }, '-=0.5')
      .from('.hero-subtitle', {
        opacity: 0,
        y: 24,
        duration: 0.7
      }, '-=0.5')
      .from('.hero-ctas', {
        opacity: 0,
        y: 20,
        duration: 0.7
      }, '-=0.4')
      .from('.hero-scroll', {
        opacity: 0,
        duration: 0.8
      }, '-=0.2');

  });

  /* ── Marquee dublare dinamică ──────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    const track = document.querySelector('.marquee-track');
    if (!track) return;

    // Dublăm conținutul pentru scroll infinit
    const clone = track.cloneNode(true);
    track.parentElement.appendChild(clone);
  });

  /* ── Hover efect pe carduri proiecte ───────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof gsap === 'undefined') return;

    document.querySelectorAll('.project-card').forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        gsap.to(card.querySelector('.project-info'), {
          y: 0,
          duration: 0.35,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', function () {
        gsap.to(card.querySelector('.project-info'), {
          y: 8,
          duration: 0.35,
          ease: 'power2.in'
        });
      });
    });
  });

})();
