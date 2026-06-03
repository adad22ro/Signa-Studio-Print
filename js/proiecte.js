/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — proiecte.js
   Logica pentru galeria de proiecte (projects.json)
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  let allProjects = [];
  let currentFilter = 'toate';

  /* ── LOAD PROJECTS ─────────────────────────────────── */
  async function loadProjects() {
    try {
      const r = await fetch('projects.json');
      if (!r.ok) throw new Error('no file');
      allProjects = await r.json();
      renderProjects();
      const inst = document.getElementById('addInstructions');
      if (inst) inst.style.display = 'none';
    } catch (e) {
      const grid = document.getElementById('galleryGrid');
      if (grid) {
        grid.innerHTML = '<div class="empty-state"><p>Niciun proiect adăugat încă.<br>Consultați instrucțiunile de mai jos.</p></div>';
      }
    }
  }

  /* ── RENDER ────────────────────────────────────────── */
  function renderProjects() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    const filtered = currentFilter === 'toate'
      ? allProjects
      : allProjects.filter(function (p) { return p.categorie === currentFilter; });

    if (!filtered.length) {
      grid.innerHTML = '<div class="empty-state"><p>Niciun proiect în această categorie.</p></div>';
      return;
    }

    grid.innerHTML = filtered.map(function (p) {
      var imgHtml = p.poza
        ? '<img class="proj-img" src="poze/' + p.poza + '" alt="' + escHtml(p.titlu) + '" loading="lazy" onerror="this.parentElement.innerHTML=\'<div class=proj-img-placeholder>\' + \'' + p.titlu.charAt(0).toUpperCase() + '\' + \'</div>\'">'
        : '<div class="proj-img-placeholder">' + p.titlu.charAt(0).toUpperCase() + '</div>';

      return '<div class="proj-card" onclick="openLightbox(\'' + (p.poza ? 'poze/' + p.poza : '') + '\',\'' + escHtml(p.categorie) + '\',\'' + escHtml(p.titlu) + '\',\'' + escHtml(p.descriere || '') + '\')">'
        + '<div class="proj-img-wrap">' + imgHtml + '<div class="proj-overlay"><span class="proj-overlay-text">Vezi proiectul</span></div></div>'
        + '<div class="proj-info">'
        + '<div class="proj-cat">' + (p.categorie === 'publicitate' ? 'Producție Publicitară' : 'Tipografie') + '</div>'
        + '<div class="proj-title">' + escHtml(p.titlu) + '</div>'
        + (p.descriere ? '<div class="proj-desc">' + escHtml(p.descriere) + '</div>' : '')
        + '</div></div>';
    }).join('');
  }

  /* ── FILTER ────────────────────────────────────────── */
  window.filterProjects = function (cat) {
    currentFilter = cat;
    document.querySelectorAll('.filter-btn').forEach(function (b) {
      var isActive = (cat === 'toate' && b.textContent.toLowerCase().includes('toate'))
        || (cat === 'publicitate' && b.textContent.toLowerCase().includes('produc'))
        || (cat === 'tipografie' && b.textContent.toLowerCase().includes('tipografie'));
      b.classList.toggle('active', isActive);
    });
    renderProjects();
  };

  /* ── LIGHTBOX ──────────────────────────────────────── */
  window.openLightbox = function (src, cat, title, desc) {
    var lb = document.getElementById('lightbox');
    var lbImg = document.getElementById('lbImg');
    var lbCat = document.getElementById('lbCat');
    var lbTitle = document.getElementById('lbTitle');
    var lbDesc = document.getElementById('lbDesc');

    if (lbImg) { lbImg.src = src || ''; lbImg.style.display = src ? 'block' : 'none'; }
    if (lbCat) lbCat.textContent = cat === 'publicitate' ? 'Producție Publicitară' : 'Tipografie';
    if (lbTitle) lbTitle.textContent = title;
    if (lbDesc) lbDesc.textContent = desc;
    if (lb) { lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
  };

  window.closeLightbox = function (e) {
    var lb = document.getElementById('lightbox');
    if (!e || e.target === lb || (e.target && e.target.classList.contains('lightbox-close'))) {
      if (lb) lb.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      window.closeLightbox({ target: document.getElementById('lightbox') });
    }
  });

  /* ── HELPER ────────────────────────────────────────── */
  function escHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ── INIT ──────────────────────────────────────────── */
  loadProjects();

})();
