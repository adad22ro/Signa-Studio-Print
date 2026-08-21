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
      /* Pe ecran mic, un element înalt nu ajunge ușor la 60% vizibil —
         așa că pragul coboară, altfel se ratează începutul numărătorii. */
    }, { threshold: window.innerWidth <= 768 ? 0.25 : 0.6 });

    nums.forEach(function (el) { observer.observe(el); });
  }

  /* ── BARA DE PROGRES A FORMULARULUI ──────────────
     Formularul e lung, mai ales pe telefon. Bara arată câte dintre
     câmpurile obligatorii sunt completate. Marcajul e construit din
     JS: e pur decorativ, deci n-are ce căuta în HTML-ul fiecărei pagini. */
  function initFormProgress() {
    var forms = document.querySelectorAll('.form');

    Array.prototype.forEach.call(forms, function (form) {
      var required = form.querySelectorAll('[required]');
      if (required.length < 2) return;

      var wrap = document.createElement('div');
      wrap.className = 'form-progress';
      wrap.innerHTML =
        '<span class="form-progress__track">' +
          '<span class="form-progress__bar"></span>' +
        '</span>' +
        '<span class="form-progress__label"></span>';

      var bar   = wrap.querySelector('.form-progress__bar');
      var label = wrap.querySelector('.form-progress__label');

      function update() {
        var done = 0;
        Array.prototype.forEach.call(required, function (field) {
          if (field.value.trim() !== '') done++;
        });
        var pct = Math.round(done / required.length * 100);
        bar.style.width = pct + '%';
        label.textContent = done + '/' + required.length;
      }

      form.addEventListener('input', update);
      form.addEventListener('change', update);
      form.insertBefore(wrap, form.firstChild);
      update();
    });
  }

  /* ── BUTOANE FLOTANTE ─────────────────────────
     „Sus" și „Cere ofertă", ambele apărând doar după ce vizitatorul a
     derulat. Vizibilitatea e decisă de un observer pe hero și unul pe
     formular — fără ascultare de scroll. */
  function initFloating() {
    if (!('IntersectionObserver' in window)) return;

    var main = document.getElementById('main-content');
    if (!main) return;

    var hero = document.querySelector('.hero, .svc-hero, .contact-hero, .work-hero');
    var form = document.querySelector('.form');

    var box = document.createElement('div');
    box.className = 'floating';
    box.innerHTML =
      '<button type="button" class="floating__btn floating__btn--top" ' +
              'aria-label="Înapoi sus">' +
        '<svg class="floating__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
          '<path d="M8 13V3M4 7l4-4 4 4" stroke="currentColor" stroke-width="1.6" ' +
                'stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
      '</button>' +
      '<a class="floating__btn floating__btn--cta" href="contact.html">' +
        '<span>Cere ofertă</span>' +
      '</a>';

    document.body.appendChild(box);

    var top = box.querySelector('.floating__btn--top');
    var cta = box.querySelector('.floating__btn--cta');

    /* Pe pagina de contact, CTA-ul flotant n-are unde să ducă. */
    if (document.querySelector('.contact-hero')) {
      cta.remove();
      cta = null;
    }

    var pastHero = false;
    var atForm = false;

    function apply() {
      top.classList.toggle('is-visible', pastHero);
      if (cta) cta.classList.toggle('is-visible', pastHero && !atForm);
    }

    if (hero) {
      new IntersectionObserver(function (entries) {
        pastHero = !entries[0].isIntersecting;
        apply();
      }, { threshold: 0 }).observe(hero);
    } else {
      pastHero = true;
    }

    if (form) {
      new IntersectionObserver(function (entries) {
        atForm = entries[0].isIntersecting;
        apply();
      }, { threshold: 0 }).observe(form);
    }

    top.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: reduced ? 'auto' : 'smooth'
      });
      /* Focusul se întoarce la începutul conținutului, altfel navigarea
         cu tastatura ar continua de unde a rămas, jos în pagină. */
      main.setAttribute('tabindex', '-1');
      main.focus({ preventScroll: true });
    });

    apply();
  }

  /* ── TAB-URILE DIN HERO ────────────────────────
     La hover sau focus pe un tab, panoul primește data-svc și CSS-ul
     virează gradientul spre culoarea serviciului. Merge și din tastatură. */
  function initHeroTabs() {
    var panel = document.querySelector('.hero__panel');
    if (!panel) return;

    var tabs = panel.querySelectorAll('.hero__tab');
    if (!tabs.length) return;

    Array.prototype.forEach.call(tabs, function (tab, i) {
      function set()   { panel.setAttribute('data-svc', String(i + 1)); }
      function clear() { panel.removeAttribute('data-svc'); }

      tab.addEventListener('pointerenter', set);
      tab.addEventListener('focus', set);
      tab.addEventListener('pointerleave', clear);
      tab.addEventListener('blur', clear);
    });
  }

  /* ── STAREA „În CENTRU" (echivalentul hover pe mobil) ────
     Pe ecrane fără hover nu există nimic care să declanșeze starea de
     hover, deci conținutul rămâne inert. Aici rolul îl ia poziția pe
     ecran: cardul aflat în banda centrală primește .is-near. */
  function initNearCenter() {
    if (reduced || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(hover: hover)').matches) return;

    var items = document.querySelectorAll('.need, .pcard, .project');
    if (!items.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-near', entry.isIntersecting);
      });
    }, {
      /* Banda centrală: 30% din înălțimea ecranului, la mijloc */
      rootMargin: '-35% 0px -35% 0px',
      threshold: 0
    });

    Array.prototype.forEach.call(items, function (el) { observer.observe(el); });
  }

  /* ── TAB-URILE DIN HERO PE MOBIL ────────────────────
     Rândul de tab-uri e carusel cu fixare; culoarea gradientului urmează
     tabul aflat în centru. Pe desktop rămâne hover-ul, deci ieșim devreme. */
  function initHeroTabsMobile() {
    if (window.matchMedia('(hover: hover)').matches) return;

    var panel = document.querySelector('.hero__panel');
    if (!panel) return;

    var nav  = panel.querySelector('.hero__panel-nav');
    var tabs = panel.querySelectorAll('.hero__tab');
    if (!nav || !tabs.length) return;

    var ticking = false;

    function update() {
      var mid = nav.getBoundingClientRect().left + nav.offsetWidth / 2;
      var best = 0;
      var bestDist = Infinity;

      Array.prototype.forEach.call(tabs, function (tab, i) {
        var r = tab.getBoundingClientRect();
        var d = Math.abs((r.left + r.width / 2) - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });

      Array.prototype.forEach.call(tabs, function (tab, i) {
        tab.classList.toggle('is-centered', i === best);
      });

      panel.setAttribute('data-svc', String(best + 1));
      ticking = false;
    }

    nav.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  /* ── INDICIU DE GLISARE ─────────────────────────
     Orice zonă care derulează orizontal primește o estompare pe margine
     și o etichetă cu săgeată. Ambele dispar după prima glisare. */
  function initSwipeHints() {
    var zones = document.querySelectorAll('.plans, .projects, .hero__panel-nav');

    Array.prototype.forEach.call(zones, function (zone) {
      /* Nimic de sugerat dacă tot conținutul încape */
      if (zone.scrollWidth <= zone.clientWidth + 4) return;

      zone.classList.add('swipe');

      var onDark = !!zone.closest('.on-dark');
      if (onDark) zone.classList.add('swipe--on-dark');

      var hint = null;

      /* Eticheta apare doar la caruselele de conținut, nu și la
         rândul de tab-uri din hero — acolo ar acoperi designul. */
      if (!zone.classList.contains('hero__panel-nav')) {
        hint = document.createElement('p');
        hint.className = 'swipe__hint';
        hint.innerHTML =
          '<span>Glisează pentru mai multe</span>' +
          '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
            '<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" ' +
                  'stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>';
        zone.parentNode.insertBefore(hint, zone.nextSibling);
      }

      function done() {
        zone.classList.add('is-scrolled');
        if (hint) hint.classList.add('is-done');
        zone.removeEventListener('scroll', onScroll);
      }

      function onScroll() {
        if (zone.scrollLeft > 12) done();
      }

      zone.addEventListener('scroll', onScroll, { passive: true });
    });
  }

  /* ── BANDĂ CU LOGOURI ──────────────────────────
     Dublarea listei se face din JS, nu în HTML: la fiecare proiect nou
     se adaugă un singur <li>, iar banda se recalculează singură. Copia
     e ascunsă pentru cititoarele de ecran, ca logourile să nu fie
     anunțate de două ori. Viteza e constantă — cât timp îi ia să
     parcurgă o lățime de ecran e același, indiferent câte logouri sunt. */
  function initMarquee() {
    var boxes = document.querySelectorAll('[data-marquee]');
    if (!boxes.length || reduced) return;

    Array.prototype.forEach.call(boxes, function (box) {
      var track = box.querySelector('.marquee__track');
      if (!track || track.children.length === 0) return;

      /* Setul original, memorat înainte de orice clonare. */
      var original = Array.prototype.slice.call(track.children);

      function build() {
        /* Ștergem clonele de la rularea anterioară (ex. după redimensionare) */
        while (track.children.length > original.length) {
          track.removeChild(track.lastChild);
        }

        var gap = parseFloat(getComputedStyle(track).columnGap) || 0;

        /* Deplasarea trebuie să fie exact un set PLUS spațiul dintre
           elemente — altfel, la reluare, ultimul logo s-ar lipi de primul. */
        var shift = track.scrollWidth + gap;
        if (shift <= gap) return;              /* nimic de măsurat încă */

        /* Copiem setul până când banda depășește lățimea vizibilă plus o
           deplasare — altfel ar apărea un gol în timpul derulării. Cu două
           logouri sunt necesare mai multe copii decât cu zece. */
        var guard = 0;
        while (track.scrollWidth < box.offsetWidth + shift && guard < 20) {
          original.forEach(function (li) {
            var clone = li.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
          });
          guard++;
        }

        var speed = 55;                        /* pixeli pe secundă */
        track.style.setProperty('--marquee-shift', shift + 'px');
        track.style.setProperty('--marquee-duration', (shift / speed) + 's');
      }

      /* Măsurarea depinde de lățimea reală a logourilor, care nu e cunoscută
         până când fiecare imagine nu e descărcată. De aceea recalculăm și la
         `load`-ul fiecărei imagini, nu doar o dată. */
      Array.prototype.forEach.call(track.querySelectorAll('img'), function (img) {
        if (!img.complete) img.addEventListener('load', build);
      });

      if (document.readyState === 'complete') {
        build();
      } else {
        window.addEventListener('load', build);
      }

      var t = null;
      window.addEventListener('resize', function () {
        clearTimeout(t);
        t = setTimeout(build, 200);
      });

      /* Oprită cât timp banda nu e pe ecran. */
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          track.classList.toggle('is-paused', !entries[0].isIntersecting);
        }, { threshold: 0 }).observe(box);
      }

      /* Pe telefon nu există hover, deci pauza vine de la deget: cât timp
         atingi banda stă pe loc și poate fi trasă lateral, iar la ridicare
         repornește după o scurtă așteptare. */
      var resume = null;

      box.addEventListener('pointerdown', function () {
        clearTimeout(resume);
        track.classList.add('is-paused');
      });

      function release() {
        clearTimeout(resume);
        resume = setTimeout(function () {
          track.classList.remove('is-paused');
        }, 1200);
      }

      box.addEventListener('pointerup', release);
      box.addEventListener('pointercancel', release);
      box.addEventListener('pointerleave', release);
    });
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
      initFormProgress();
      initFloating();
      initHeroTabs();
      initMarquee();
      initNearCenter();
      initHeroTabsMobile();
      initSwipeHints();
    });
  } else {
    init();
    initHeroFlow();
    initCounters();
    initFormProgress();
    initFloating();
    initHeroTabs();
    initMarquee();
    initNearCenter();
    initHeroTabsMobile();
    initSwipeHints();
  }

})();
