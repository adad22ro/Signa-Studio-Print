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
    });
  } else {
    init();
    initHeroFlow();
    initCounters();
    initFormProgress();
    initFloating();
  }

})();
