/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — home-sites.js
   Încarcă proiectele din projects.json și le afișează
   într-un carusel pe homepage (toate categoriile).
   - Desktop: 3 carduri + săgeți · Tabletă: 2 · Mobil: 1 + swipe + puncte
   Dacă nu există niciun proiect, ascunde secțiunea complet.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* Etichete prietenoase pentru categorii */
  var CAT_LABEL = {
    site: 'Web',
    publicitate: 'Publicitate',
    tipografie: 'Tipografie'
  };

  async function loadHomeProjects() {
    var grid     = document.getElementById('psGrid');
    var section  = document.getElementById('psSection');
    var viewport = document.getElementById('psViewport');
    var prevBtn  = document.getElementById('psPrev');
    var nextBtn  = document.getElementById('psNext');
    var dotsWrap = document.getElementById('psDots');
    if (!grid || !section) return;

    try {
      var r = await fetch('projects.json');
      if (!r.ok) throw new Error('no file');
      var all = await r.json();

      /* Toate proiectele, cele mai recente primele */
      var items = all.slice().reverse();

      if (!items.length) {
        section.style.display = 'none';
        return;
      }

      grid.innerHTML = items.map(function (p) {
        var imgHtml = p.poza
          ? '<img class="ps-img" src="poze/' + escAttr(p.poza) + '" alt="' + escHtml(p.titlu) + '" loading="lazy">'
          : '<div class="ps-placeholder">' + p.titlu.charAt(0).toUpperCase() + '</div>';

        var cat = CAT_LABEL[p.categorie] || '';

        return '<div class="ps-card"' + (p.url ? ' data-url="' + escAttr(p.url) + '"' : '') + '>'
          + '<div class="ps-img-wrap">' + imgHtml
          + (p.url ? '<div class="ps-overlay"><span class="ps-overlay-text">Vizitează →</span></div>' : '')
          + '</div>'
          + '<div class="ps-info">'
          + (cat ? '<span class="ps-cat">' + escHtml(cat) + '</span>' : '')
          + '<div class="ps-name">' + escHtml(p.titlu) + '</div>'
          + (p.descriere ? '<div class="ps-desc">' + escHtml(p.descriere) + '</div>' : '')
          + (p.url ? '<a class="ps-link" href="' + escAttr(p.url) + '" target="_blank" rel="noopener" data-stop="1">' + escHtml(p.url.replace(/^https?:\/\//, '')) + ' →</a>' : '')
          + '</div>'
          + '</div>';
      }).join('');

      var cards = Array.prototype.slice.call(grid.querySelectorAll('.ps-card'));

      /* Click pe card → deschide site-ul (doar dacă are url) */
      cards.forEach(function (card) {
        card.addEventListener('click', function (e) {
          if (e.target.closest('[data-stop]')) return;
          var url = card.getAttribute('data-url');
          if (url) window.open(url, '_blank');
        });
      });

      /* Fallback imagini care nu se încarcă */
      grid.querySelectorAll('.ps-img').forEach(function (img) {
        img.addEventListener('error', function () {
          var letter = (img.getAttribute('alt') || '?').charAt(0).toUpperCase();
          var ph = document.createElement('div');
          ph.className = 'ps-placeholder';
          ph.textContent = letter;
          if (img.parentElement) img.parentElement.replaceChild(ph, img);
        });
      });

      if (viewport) initCarousel(grid, viewport, prevBtn, nextBtn, dotsWrap, cards);

    } catch (e) {
      section.style.display = 'none';
    }
  }

  function visibleCount(track) {
    var v = getComputedStyle(track).getPropertyValue('--cards');
    var n = parseInt(v, 10);
    return (n && n > 0) ? n : 1;
  }

  function initCarousel(track, viewport, prevBtn, nextBtn, dotsWrap, cards) {
    var total = cards.length;
    var index = 0;
    var perView = visibleCount(track);

    function step() {
      if (cards.length < 2) return cards.length ? cards[0].offsetWidth : 0;
      return cards[1].offsetLeft - cards[0].offsetLeft;
    }
    function maxIndex() { return Math.max(0, total - perView); }
    function pageCount() { return Math.ceil(total / perView); }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      var pages = pageCount();
      if (pages < 2) { dotsWrap.style.display = 'none'; return; }
      dotsWrap.style.display = 'flex';
      for (var i = 0; i < pages; i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'ps-dot';
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
        dotsWrap.querySelectorAll('.ps-dot').forEach(function (d, di) {
          d.classList.toggle('is-active', di === activePage);
        });
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - perView); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + perView); });

    var scrollTimer;
    viewport.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        var s = step();
        if (s > 0) { index = Math.round(viewport.scrollLeft / s); update(); }
      }, 120);
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        var np = visibleCount(track);
        if (np !== perView) { perView = np; buildDots(); }
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

  loadHomeProjects();

})();
