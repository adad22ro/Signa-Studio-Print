/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — js/main.js
   Injectează componentele partajate (navbar, footer) prin
   fetch, marchează linkul activ, gestionează hamburgerul,
   starea de scroll a header-ului și scroll-ul lin cu offset.

   NOTĂ: fetch() nu funcționează pe protocolul file://.
   Pentru previzualizare locală rulează un server:
     php -S localhost:8000     (sau Apache din XAMPP)
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* Poziția de scroll se restaurează nativ la refresh */
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'auto';
  }

  var COMPONENTS = [
    { url: 'components/navbar.html', target: 'navbar-placeholder' },
    { url: 'components/footer.html', target: 'footer-placeholder' }
  ];

  /* ── INJECTARE COMPONENTE ──────────────────────────────*/
  function inject(component) {
    var host = document.getElementById(component.target);
    if (!host) return Promise.resolve();

    return fetch(component.url)
      .then(function (r) {
        if (!r.ok) throw new Error(r.status + ' ' + component.url);
        return r.text();
      })
      .then(function (html) {
        host.innerHTML = html;
      })
      .catch(function (err) {
        /* Componenta lipsă nu trebuie să blocheze restul paginii */
        if (window.console) console.error('[main] Injectare eșuată:', err);
      });
  }

  Promise.all(COMPONENTS.map(inject)).then(init);

  /* ── INIȚIALIZARE DUPĂ INJECTARE ───────────────────────*/
  function init() {
    setActiveLink();
    setFooterYear();
    initHeaderScroll();
    initHamburger();
    initSmoothScroll();
  }

  /* ── LINK ACTIV ────────────────────────────────────────
     Compară pathname-ul curent cu href-ul fiecărui link. */
  function setActiveLink() {
    var current = location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav__link, .mobile-menu__link').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      var page = href.split('#')[0].split('/').pop();
      var hash = href.split('#')[1];

      /* Un link cu ancoră marchează pagina activă doar dacă nu are ancoră —
         altfel „Servicii" și „Despre" ar apărea ambele active pe index. */
      if (hash) return;
      if (page !== current) return;

      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    });
  }

  /* ── ANUL DIN FOOTER ───────────────────────────────────*/
  function setFooterYear() {
    var el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ── HEADER LA SCROLL ──────────────────────────────────*/
  function initHeaderScroll() {
    var header = document.getElementById('siteHeader');
    if (!header) return;

    var ticking = false;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  /* ── MENIU MOBIL ───────────────────────────────────────*/
  function initHamburger() {
    var btn  = document.getElementById('hamburger');
    var menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    function open() {
      menu.hidden = false;
      /* Forțează un reflow pentru ca tranziția să pornească */
      void menu.offsetWidth;
      menu.classList.add('is-open');
      btn.classList.add('is-active');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Închide meniul');
      document.body.classList.add('has-menu-open');
    }

    function close() {
      menu.classList.remove('is-open');
      btn.classList.remove('is-active');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Deschide meniul');
      document.body.classList.remove('has-menu-open');

      /* Ascunde după terminarea tranziției, ca să iasă din ordinea de focus */
      window.setTimeout(function () {
        if (!menu.classList.contains('is-open')) menu.hidden = true;
      }, 300);
    }

    function isOpen() {
      return btn.getAttribute('aria-expanded') === 'true';
    }

    btn.addEventListener('click', function () {
      isOpen() ? close() : open();
    });

    /* Închide la click pe un link */
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', close);
    });

    /* Închide cu Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) {
        close();
        btn.focus();
      }
    });

    /* Închide la click în afara meniului */
    document.addEventListener('click', function (e) {
      if (!isOpen()) return;
      if (menu.contains(e.target) || btn.contains(e.target)) return;
      close();
    });
  }

  /* ── SCROLL LIN CU OFFSET = ÎNĂLȚIMEA HEADER-ULUI ──────*/
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href*="#"]');
      if (!link) return;

      var href = link.getAttribute('href') || '';
      var hash = href.split('#')[1];
      if (!hash) return;

      /* Doar ancorele din pagina curentă */
      var page = href.split('#')[0];
      var current = location.pathname.split('/').pop() || 'index.html';
      if (page && page.split('/').pop() !== current) return;

      var target = document.getElementById(hash);
      if (!target) return;

      e.preventDefault();

      var header = document.getElementById('siteHeader');
      var offset = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: top,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });

      /* Actualizează URL-ul fără să sară pagina */
      history.pushState(null, '', '#' + hash);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

})();
