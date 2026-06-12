/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — site-uri.js
   Încarcă ultimele 4 site-uri din projects.json
   și le afișează în secțiunea preview din site-uri.html.
   Fără cod inline — evenimente prin addEventListener.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  async function loadSitePreview() {
    var grid    = document.getElementById('sitesPreviewGrid');
    var section = document.getElementById('sitesPreviewSection');
    if (!grid || !section) return;

    try {
      var r = await fetch('projects.json');
      if (!r.ok) throw new Error('no file');
      var all = await r.json();

      /* Filtrăm doar site-urile, luăm ultimele 4 (cele mai recente) */
      var sites = all.filter(function (p) { return p.categorie === 'site'; }).slice(-4).reverse();

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

      /* Click pe card → deschide site-ul (fără inline) */
      grid.querySelectorAll('.sp-card').forEach(function (card) {
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

    } catch (e) {
      /* Dacă nu există încă projects.json, ascundem secțiunea */
      section.style.display = 'none';
    }
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

/* ── LINK "Vezi toate" → memorează filtrul pentru proiecte.html ── */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-set-filter]').forEach(function (el) {
      el.addEventListener('click', function () {
        sessionStorage.setItem('filterProiecte', el.getAttribute('data-set-filter'));
      });
    });
  });

  loadSitePreview();

})();

