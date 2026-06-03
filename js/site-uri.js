/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — site-uri.js
   Încarcă ultimele 4 site-uri din projects.json
   și le afișează în secțiunea preview din site-uri.html
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
          ? '<img class="sp-img" src="poze/' + p.poza + '" alt="' + escHtml(p.titlu) + '" loading="lazy" onerror="this.parentElement.innerHTML=\'<div class=sp-placeholder>\' + \'' + p.titlu.charAt(0).toUpperCase() + '\' + \'</div>\'">'
          : '<div class="sp-placeholder">' + p.titlu.charAt(0).toUpperCase() + '</div>';

        return '<div class="sp-card"' + (p.url ? ' onclick="window.open(\'' + escAttr(p.url) + '\',\'_blank\')"' : '') + '>'
          + '<div class="sp-img-wrap">' + imgHtml
          + '<div class="sp-overlay"><span class="sp-overlay-text">Vizitează site-ul →</span></div>'
          + '</div>'
          + '<div class="sp-info">'
          + '<div class="sp-title">' + escHtml(p.titlu) + '</div>'
          + (p.descriere ? '<div class="sp-desc">' + escHtml(p.descriere) + '</div>' : '')
          + (p.url ? '<a class="sp-link" href="' + escAttr(p.url) + '" target="_blank" rel="noopener" onclick="event.stopPropagation()">' + p.url.replace(/^https?:\/\//, '') + ' →</a>' : '')
          + '</div>'
          + '</div>';
      }).join('');

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

  loadSitePreview();

})();
