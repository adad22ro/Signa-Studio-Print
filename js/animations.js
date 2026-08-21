/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — js/animations.js
   Animații la scroll exclusiv prin Intersection Observer.
   Nu se folosesc niciodată evenimente de tip scroll.

   Elementele pornesc invizibile din CSS (.reveal) și
   primesc .is-visible la intrarea în viewport.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealAll(items) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  function init() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    /* Fără suport sau cu mișcare redusă → afișează tot imediat */
    if (reduced || !('IntersectionObserver' in window)) {
      revealAll(Array.prototype.slice.call(items));
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;

        /* Decalaj în cascadă pentru grupurile de elemente */
        var group = el.closest('.reveal-group');
        if (group) {
          var siblings = Array.prototype.slice.call(group.querySelectorAll('.reveal'));
          var index = siblings.indexOf(el);
          el.style.transitionDelay = Math.min(index, 6) * 80 + 'ms';
        }

        el.classList.add('is-visible');
        observer.unobserve(el);
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ── CIFRE CARE CONTORIZEAZĂ ────────────────────
     Numărul urcă de la 0 la valoarea din data-count-to când elementul
     intră în ecran, o singură dată. Textul din HTML e deja valoarea
     finală, deci fără JS sau cu mișcare redusă se vede corect. */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count-to'), 10);
    if (isNaN(target)) return;

    var prefix = el.getAttribute('data-count-prefix') || '';
    var suffix = el.getAttribute('data-count-suffix') || '';
    var duration = 1100;
    var start = null;

    function frame(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      /* ease-out: rapid la început, se așază lin pe valoarea finală */
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function initCounters() {
    var nums = document.querySelectorAll('[data-count-to]');
    if (!nums.length) return;

    /* Fără observer sau cu mișcare redusă, valorile rămân cele din HTML. */
    if (reduced || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    nums.forEach(function (el) { observer.observe(el); });
  }

  /* ── CASCADA DIN HERO ──────────────────────────
     Animația rulează la infinit, deci o punem pe pauză cât timp
     panoul nu e pe ecran — altfel compozitorul lucrează degeaba
     cât timp vizitatorul citește restul paginii. */
  function initHeroFlow() {
    var flow = document.querySelector('.hero__flow');
    if (!flow) return;

    if (reduced || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        flow.classList.toggle('is-paused', !entry.isIntersecting);
      });
    }, { threshold: 0 });

    observer.observe(flow.parentNode);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init();
      initHeroFlow();
      initCounters();
    });
  } else {
    init();
    initHeroFlow();
    initCounters();
  }

})();
