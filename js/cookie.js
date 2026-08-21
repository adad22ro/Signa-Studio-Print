/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO DEV — js/cookie.js
   Banner de cookie-uri conform GDPR.

   Comportament:
   • verifică localStorage la încărcare
   • afișează bannerul doar la prima vizită
   • la Accept  → salvează consimțământul și încarcă Analytics
   • la Refuz   → salvează refuzul și NU încarcă nimic

   IMPORTANT: nu se încarcă niciun script de urmărire înainte
   de acceptul explicit. Cookie-ul tehnic al formularului
   (token CSRF) e strict necesar și nu intră sub consimțământ.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var STORAGE_KEY = 'signa-cookie-consent';

  /* Pune aici ID-ul real de Google Analytics când există.
     Cât timp e null, nu se încarcă nimic nici după Accept. */
  var ANALYTICS_ID = null;   /* ex: 'G-XXXXXXXXXX' */

  function readConsent() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* localStorage blocat (mod privat, setări stricte) */
      return null;
    }
  }

  function saveConsent(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (e) { /* ignorăm — bannerul va reapărea la următoarea vizită */ }
  }

  /* ── ANALYTICS — doar după Accept ─────────────────────*/
  function loadAnalytics() {
    if (!ANALYTICS_ID) return;
    if (document.getElementById('ga-script')) return;

    var s = document.createElement('script');
    s.id = 'ga-script';
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ANALYTICS_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', ANALYTICS_ID, { anonymize_ip: true });
  }

  /* ── BANNER ──────────────────────────────────*/
  function init() {
    var banner = document.getElementById('cookieBanner');
    if (!banner) return;

    var accept = document.getElementById('cookieAccept');
    var reject = document.getElementById('cookieReject');

    function show() {
      banner.hidden = false;
      void banner.offsetWidth;        /* reflow, ca tranziția să pornească */
      banner.classList.add('is-visible');
    }

    function close() {
      banner.classList.remove('is-visible');
      window.setTimeout(function () { banner.hidden = true; }, 300);
    }

    if (accept) {
      accept.addEventListener('click', function () {
        saveConsent('accepted');
        loadAnalytics();
        close();
      });
    }

    if (reject) {
      reject.addEventListener('click', function () {
        saveConsent('rejected');
        close();
      });
    }

    /* Retragerea consimțământului trebuie să fie la fel de simplă ca
       acordarea lui (GDPR art. 7 alin. 3). Orice element cu
       data-cookie-preferences redeschide bannerul — în footer e un link. */
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-cookie-preferences]');
      if (!trigger) return;
      e.preventDefault();
      show();
      if (reject) reject.focus();
    });

    var consent = readConsent();

    if (consent === 'accepted') {
      loadAnalytics();
      return;
    }
    if (consent === 'rejected') {
      return;
    }

    /* Prima vizită — afișăm bannerul */
    show();
  }

  /* Bannerul e injectat de main.js, deci așteptăm evenimentul lui.
     Dacă a fost deja injectat, pornim direct. */
  if (document.getElementById('cookieBanner')) {
    init();
  } else {
    document.addEventListener('componente:gata', init);
  }

})();
