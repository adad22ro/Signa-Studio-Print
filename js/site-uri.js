/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — site-uri.js
   Încarcă site-urile din projects.json și le afișează
   într-un carusel de carduri în site-uri.html.
   - Desktop: 3 carduri + săgeți stânga/dreapta
   - Tabletă: 2 carduri
   - Mobil: 1 card, glisare cu degetul + puncte
   Fără cod inline — evenimente prin addEventListener.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  async function loadSitePreview() {
    var grid     = document.getElementById('sitesPreviewGrid');   /* .sp-track */
    var section  = document.getElementById('sitesPreviewSection');
    var viewport = document.getElementById('spViewport');
    var prevBtn  = document.getElementById('spPrev');
    var nextBtn  = document.getElementById('spNext');
    var dotsWrap = document.getElementById('spDots');
    if (!grid || !section) return;

    try {
      var r = await fetch('projects.json');
      if (!r.ok) throw new Error('no file');
      var all = await r.json();

      /* Toate site-urile, cele mai recente primele */
      var sites = all.filter(function (p) { return p.categorie === 'site'; }).reverse();

      if (!sites.length) {
        section.style.display = 'none';
        return;
      }

      grid.innerHTML = sites.map(function (p) {
        var imgHtml = p.poza
          ? '<img class="sp-img" src="poze/' + escAttr(p.poza) + '" alt="' + escHtml(p.titlu) + '" loading="lazy">'
          : '<div class="sp-placeholder">' + p.titlu.charAt(0).toUpperCase() + '</div>';

        return '<div class="sp-card"' + (p.url ? ' data-url="' + escAttr(p.url) + '"' : '') + '>'
          + '<div class="sp-img-wrap">' + imgHtml
          + '<div class="sp-overlay"><span class="sp-overlay-text">Vizitează site-ul →</span></div>'
          + '</div>'
          + '<div class="sp-info">'
          + '<div class="sp-title">' + escHtml(p.titlu) + '</div>'
          + (p.descriere ? '<div class="sp-desc">' + escHtml(p.descriere) + '</div>' : '')
          + (p.url ? '<a class="sp-link" href="' + escAttr(p.url) + '" target="_blank" rel="noopener" data-stop="1">' + escHtml(p.url.replace(/^https?:\/\//, '')) + ' →</a>' : '')
          + '</div>'
          + '</div>';
      }).join('');

      var cards = Array.prototype.slice.call(grid.querySelectorAll('.sp-card'));

      /* Click pe card → deschide site-ul (fără inline) */
      cards.forEach(function (card) {
        card.addEventListener('click', function (e) {
          if (e.target.closest('[data-stop]')) return;
          var url = card.getAttribute('data-url');
          if (url) window.open(url, '_blank');
        });
      });

      /* Fallback imagini */
      grid.querySelectorAll('.sp-img').forEach(function (img) {
        img.addEventListener('error', function () {
          var letter = (img.getAttribute('alt') || '?').charAt(0).toUpperCase();
          var ph = document.createElement('div');
          ph.className = 'sp-placeholder';
          ph.textContent = letter;
          if (img.parentElement) img.parentElement.replaceChild(ph, img);
        });
      });

      /* ── CARUSEL ──────────────────────────────────────── */
      if (viewport) initCarousel(grid, viewport, prevBtn, nextBtn, dotsWrap, cards);

    } catch (e) {
      /* Dacă nu există încă projects.json, ascundem secțiunea */
      section.style.display = 'none';
    }
  }

  /* Câte carduri sunt vizibile odată (din variabila CSS --cards) */
  function visibleCount(track) {
    var v = getComputedStyle(track).getPropertyValue('--cards');
    var n = parseInt(v, 10);
    return (n && n > 0) ? n : 1;
  }

  function initCarousel(track, viewport, prevBtn, nextBtn, dotsWrap, cards) {
    var total = cards.length;
    var index = 0;          /* indexul primului card vizibil */
    var perView = visibleCount(track);

    /* Lățimea unui „pas” = lățime card + gap */
    function step() {
      if (cards.length < 2) return cards.length ? cards[0].offsetWidth : 0;
      return cards[1].offsetLeft - cards[0].offsetLeft;
    }

    function maxIndex() {
      return Math.max(0, total - perView);
    }

    function pageCount() {
      return Math.ceil(total / perView);
    }

    /* Construiește punctele (câte o „pagină”) */
    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      var pages = pageCount();
      if (pages < 2) { dotsWrap.style.display = 'none'; return; }
      dotsWrap.style.display = 'flex';
      for (var i = 0; i < pages; i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'sp-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Pagina ' + (i + 1));
        (function (page) {
          dot.addEventListener('click', function () { goTo(page * perView); });
        })(i);
        dotsWrap.appendChild(dot);
      }
    }

    function goTo(i) {
      index = Math.max(0, Math.min(i, maxIndex()));
      viewport.scrollTo({ left: index * step(), behavior: 'smooth' });
      update();
    }

    function update() {
      if (prevBtn) prevBtn.disabled = (index <= 0);
      if (nextBtn) nextBtn.disabled = (index >= maxIndex());
      if (dotsWrap) {
        var activePage = Math.round(index / perView);
        dotsWrap.querySelectorAll('.sp-dot').forEach(function (d, di) {
          d.classList.toggle('is-active', di === activePage);
        });
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - perView); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + perView); });

    /* Sincronizează indexul când utilizatorul glisează cu degetul (mobil) */
    var scrollTimer;
    viewport.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        var s = step();
        if (s > 0) { index = Math.round(viewport.scrollLeft / s); update(); }
      }, 120);
    });

    /* Recalculează la redimensionarea ferestrei (se schimbă --cards) */
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        var np = visibleCount(track);
        if (np !== perView) {
          perView = np;
          buildDots();
        }
        goTo(index);
      }, 150);
    });

    buildDots();
    update();
  }

  function escHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }

  function escAttr(s) {
    if (!s) return '';
    return String(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  loadSitePreview();

})();
