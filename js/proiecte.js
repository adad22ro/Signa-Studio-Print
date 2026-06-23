/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — proiecte.js
   Galerie proiecte cu filtrare pe categorii.
   Categorii: prezentare | landing | magazine
   Fără cod inline — toate evenimentele prin addEventListener.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var allProjects = [];
  var currentFilter = 'toate';

  /* ── ETICHETE CATEGORII ────────────────────────────── */
  function catLabel(cat) {
    if (cat === 'prezentare') return 'Pagină de prezentare';
    if (cat === 'landing')    return 'Landing page';
    if (cat === 'magazine')   return 'Magazin online';
    return cat;
  }

  /* ── LOAD ──────────────────────────────────────────── */
  async function loadProjects() {
    try {
      var r = await fetch('projects.json');
      if (!r.ok) throw new Error('no file');
      allProjects = await r.json();
      renderProjects();

      /* Dacă am venit cu un filtru pre-setat (ex: din site-uri.html) */
      var savedFilter = sessionStorage.getItem('filterProiecte');
      if (savedFilter) {
        sessionStorage.removeItem('filterProiecte');
        filterProjects(savedFilter);
      }

      var inst = document.getElementById('addInstructions');
      if (inst) inst.style.display = 'none';
    } catch (e) {
      var grid = document.getElementById('galleryGrid');
      if (grid) {
        grid.innerHTML = '<div class="empty-state"><p>Niciun proiect adăugat încă.<br>Consultați instrucțiunile de mai jos.</p></div>';
      }
    }
  }

  /* ── RENDER ────────────────────────────────────────── */
  function renderProjects() {
    var grid = document.getElementById('galleryGrid');
    if (!grid) return;

    var filtered = currentFilter === 'toate'
      ? allProjects
      : allProjects.filter(function (p) { return p.categorie === currentFilter; });

    if (!filtered.length) {
      grid.innerHTML = '<div class="empty-state"><p>Niciun proiect în această categorie.</p></div>';
      return;
    }

    grid.innerHTML = filtered.map(function (p) {
      var isSite = p.categorie === 'prezentare' || p.categorie === 'landing' || p.categorie === 'magazine';

      var imgHtml = p.poza
        ? '<img class="proj-img" src="poze/' + escAttr(p.poza) + '" alt="' + escHtml(p.titlu) + '" loading="lazy">'
        : '<div class="proj-img-placeholder">' + p.titlu.charAt(0).toUpperCase() + '</div>';

      var overlayText = isSite ? 'Vezi site-ul' : 'Vezi proiectul';

      /* Datele se pun în data-* și se citesc la click prin addEventListener */
      var dataAttrs = ' data-cat="' + escAttr(p.categorie) + '"'
        + ' data-titlu="' + escAttr(p.titlu) + '"'
        + ' data-desc="' + escAttr(p.descriere || '') + '"'
        + ' data-poza="' + (p.poza ? 'poze/' + escAttr(p.poza) : '') + '"'
        + ' data-url="' + (isSite && p.url ? escAttr(p.url) : '') + '"';

      var card = '<div class="proj-card' + (isSite && p.url ? ' proj-card--site' : '') + '"' + dataAttrs + '>'
        + '<div class="proj-img-wrap">' + imgHtml
        + '<div class="proj-overlay"><span class="proj-overlay-text">' + overlayText + '</span></div>'
        + '</div>'
        + '<div class="proj-info">'
        + '<div class="proj-cat">' + catLabel(p.categorie) + '</div>'
        + '<div class="proj-title">' + escHtml(p.titlu) + '</div>'
        + (p.descriere ? '<div class="proj-desc">' + escHtml(p.descriere) + '</div>' : '')
        + (isSite && p.url ? '<div class="proj-link"><a href="' + escAttr(p.url) + '" target="_blank" rel="noopener" data-stop="1">' + escHtml(p.url.replace(/^https?:\/\//, '')) + ' →</a></div>' : '')
        + '</div>'
        + '</div>';

      return card;
    }).join('');

    /* Leg click pe fiecare card (fără inline) */
    grid.querySelectorAll('.proj-card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        /* Linkul din interior nu declanșează cardul */
        if (e.target.closest('[data-stop]')) return;

        var url = card.getAttribute('data-url');
        if (url) {
          window.open(url, '_blank');
        } else {
          openLightbox(
            card.getAttribute('data-poza'),
            card.getAttribute('data-cat'),
            card.getAttribute('data-titlu'),
            card.getAttribute('data-desc')
          );
        }
      });
    });

    /* Fallback imagini care nu se încarcă */
    grid.querySelectorAll('.proj-img').forEach(function (img) {
      img.addEventListener('error', function () {
        var letter = (img.getAttribute('alt') || '?').charAt(0).toUpperCase();
        var ph = document.createElement('div');
        ph.className = 'proj-img-placeholder';
        ph.textContent = letter;
        if (img.parentElement) img.parentElement.replaceChild(ph, img);
      });
    });
  }

  /* ── FILTER ────────────────────────────────────────── */
  function filterProjects(cat) {
    currentFilter = cat;
    document.querySelectorAll('.filter-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.filter === cat);
    });
    renderProjects();
  }

  /* ── LIGHTBOX ──────────────────────────────────────── */
  function openLightbox(src, cat, title, desc) {
    var lb    = document.getElementById('lightbox');
    var lbImg = document.getElementById('lbImg');
    var lbCat = document.getElementById('lbCat');
    var lbTit = document.getElementById('lbTitle');
    var lbDsc = document.getElementById('lbDesc');

    if (lbImg) { lbImg.src = src || ''; lbImg.style.display = src ? 'block' : 'none'; }
    if (lbCat) lbCat.textContent = catLabel(cat);
    if (lbTit) lbTit.textContent = title;
    if (lbDsc) lbDsc.textContent = desc;
    if (lb)    { lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
  }

  function closeLightbox() {
    var lb = document.getElementById('lightbox');
    if (lb) lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── INIT EVENIMENTE ───────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    /* Butoane filtru */
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterProjects(btn.getAttribute('data-filter'));
      });
    });

    /* Lightbox: închidere la click pe fundal sau buton X */
    var lb = document.getElementById('lightbox');
    if (lb) {
      lb.addEventListener('click', function (e) {
        if (e.target === lb || (e.target && e.target.classList.contains('lightbox-close'))) {
          closeLightbox();
        }
      });
    }
    var closeBtn = document.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    /* Escape închide lightbox-ul */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  });

  /* ── HELPERS ───────────────────────────────────────── */
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

  /* ── START ─────────────────────────────────────────── */
  loadProjects();

})();
