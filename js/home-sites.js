/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — home-sites.js
   Încarcă site-urile din projects.json și le afișează
   în secțiunea preview de pe homepage.
   Dacă nu există niciun site, ascunde secțiunea complet.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  async function loadHomeSites() {
    var section = document.getElementById('sitesHomeSection');
    var grid    = document.getElementById('homeSitesGrid');
    if (!section || !grid) return;

    try {
      var r = await fetch('projects.json');
      if (!r.ok) throw new Error('no file');
      var all = await r.json();

      /* Filtrăm doar categoria "site", luăm ultimele 4 */
      var sites = all
        .filter(function (p) { return p.categorie === 'site'; })
        .slice(-4)
        .reverse();

      if (!sites.length) {
        section.style.display = 'none';
        return;
      }

      grid.innerHTML = sites.map(function (p) {
        var imgHtml = p.poza
          ? '<img class="home-site-img" src="poze/' + p.poza + '" alt="' + esc(p.titlu) + '" loading="lazy" onerror="this.parentElement.classList.add(\'no-img\');this.remove()">'
          : '';

        return '<div class="home-site-card"'
          + (p.url ? ' onclick="window.open(\'' + escAttr(p.url) + '\',\'_blank\')" role="link" tabindex="0"' : '')
          + '>'
          + '<div class="home-site-img-wrap">'
          + imgHtml
          + '<div class="home-site-img-placeholder" aria-hidden="true">' + p.titlu.charAt(0).toUpperCase() + '</div>'
          + (p.url ? '<div class="home-site-hover"><span>Vizitează →</span></div>' : '')
          + '</div>'
          + '<div class="home-site-info">'
          + '<div class="home-site-title">' + esc(p.titlu) + '</div>'
          + (p.url ? '<div class="home-site-url">' + p.url.replace(/^https?:\/\//, '') + '</div>' : '')
          + '</div>'
          + '</div>';
      }).join('');

    } catch (e) {
      /* projects.json inexistent sau fără site-uri — ascundem secțiunea */
      var s = document.getElementById('sitesHomeSection');
      if (s) s.style.display = 'none';
    }
  }

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }

  function escAttr(s) {
    if (!s) return '';
    return String(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  loadHomeSites();

})();
