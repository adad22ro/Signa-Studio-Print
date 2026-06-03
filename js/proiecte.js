/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — proiecte.js
   Galerie proiecte cu filtrare pe categorii.
   Categorii: publicitate | tipografie | site
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var allProjects = [];
  var currentFilter = 'toate';

  /* ── ETICHETE CATEGORII ────────────────────────────── */
  function catLabel(cat) {
    if (cat === 'publicitate') return 'Producție Publicitară';
    if (cat === 'tipografie')  return 'Tipografie';
    if (cat === 'site')        return 'Site-uri';
    return cat;
  }

  /* ── LOAD ──────────────────────────────────────────── */
  async function loadProjects() {
    try {
      var r = await fetch('projects.json');
      if (!r.ok) throw new Error('no file');
      allProjects = await r.json();
      renderProjects();

      /* Dacă am venit din site-uri.html, activăm direct filtrul "site" */
      var savedFilter = sessionStorage.getItem('filterProiecte');
      if (savedFilter) {
        sessionStorage.removeItem('filterProiecte');
        window.filterProjects(savedFilter);
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
      var isSite = p.categorie === 'site';

      var imgHtml = p.poza
        ? '<img class="proj-img" src="poze/' + p.poza + '" alt="' + escHtml(p.titlu) + '" loading="lazy" onerror="this.parentElement.innerHTML=\'<div class=proj-img-placeholder>\' + \'' + p.titlu.charAt(0).toUpperCase() + '\' + \'</div>\'">'
        : '<div class="proj-img-placeholder">' + p.titlu.charAt(0).toUpperCase() + '</div>';

      var overlayText = isSite ? 'Vezi site-ul' : 'Vezi proiectul';

      var card = '<div class="proj-card' + (isSite && p.url ? ' proj-card--site' : '') + '"'
        + (isSite && p.url ? ' onclick="window.open(\'' + escAttr(p.url) + '\', \'_blank\')"' : ' onclick="openLightbox(\'' + (p.poza ? 'poze/' + p.poza : '') + '\',\'' + escAttr(p.categorie) + '\',\'' + escAttr(p.titlu) + '\',\'' + escAttr(p.descriere || '') + '\')"')
        + '>'
        + '<div class="proj-img-wrap">' + imgHtml
        + '<div class="proj-overlay"><span class="proj-overlay-text">' + overlayText + '</span></div>'
        + '</div>'
        + '<div class="proj-info">'
        + '<div class="proj-cat">' + catLabel(p.categorie) + '</div>'
        + '<div class="proj-title">' + escHtml(p.titlu) + '</div>'
        + (p.descriere ? '<div class="proj-desc">' + escHtml(p.descriere) + '</div>' : '')
        + (isSite && p.url ? '<div class="proj-link"><a href="' + escAttr(p.url) + '" target="_blank" rel="noopener" onclick="event.stopPropagation()">' + p.url.replace(/^https?:\/\//, '') + ' →</a></div>' : '')
        + '</div>'
        + '</div>';

      return card;
    }).join('');
  }

  /* ── FILTER ────────────────────────────────────────── */
  window.filterProjects = function (cat) {
    currentFilter = cat;
    document.querySelectorAll('.filter-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.filter === cat);
    });
    renderProjects();
  };

  /* ── LIGHTBOX (pentru publicitate & tipografie) ────── */
  window.openLightbox = function (src, cat, title, desc) {
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
  };

  window.closeLightbox = function (e) {
    var lb = document.getElementById('lightbox');
    if (!e || e.target === lb || (e.target && e.target.classList.contains('lightbox-close'))) {
      if (lb) lb.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeLightbox({ target: document.getElementById('lightbox') });
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

  /* ── INIT ──────────────────────────────────────────── */
  loadProjects();

})();
