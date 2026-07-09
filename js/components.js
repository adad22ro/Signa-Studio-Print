/* ═══════════════════════════════════════════════════════
   COMBINAȚIE — mix.js
   Header/footer, meniu mobil, acordeon proces, reveal.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var BRAND = 'Signa Studio Print'; // nume temporar

  var LINKS = [
    { href: 'index.html',           label: 'Acasă' },
    { href: 'de-ce-ai-nevoie.html', label: 'De ce ai nevoie?' },
    { href: 'site-uri.html',        label: 'Site-uri' },
    { href: 'magazine-online.html', label: 'Magazine' },
    { href: 'proiecte.html',        label: 'Proiecte' }
  ];

  var navLinks = LINKS.map(function (l) { return '    <a href="' + l.href + '">' + l.label + '</a>'; }).join('\n');
  var mobLinks = LINKS.map(function (l) { return '  <a href="' + l.href + '">' + l.label + '</a>'; }).join('\n');

  var HEADER = [
    '<header class="mx-header">',
    '  <a href="index.html" class="mx-brand">' + BRAND + '</a>',
    '  <nav class="mx-nav" aria-label="Navigație principală">',
    navLinks,
    '  </nav>',
    '  <a href="contact.html" class="mx-cta">Cere o ofertă</a>',
    '  <button class="mx-burger" id="mxBurger" aria-label="Deschide meniul" aria-expanded="false" aria-controls="mxMobile"><span></span><span></span><span></span></button>',
    '</header>',
    '<div class="mx-mobile" id="mxMobile" role="navigation" aria-label="Meniu mobil">',
    mobLinks,
    '  <a href="contact.html">Cere o ofertă</a>',
    '</div>'
  ].join('\n');

  var FOOTER = [
    '<footer class="mx-footer"><div class="mx-footer-inner">',
    '  <div class="mx-footer-top">',
    '    <div class="mx-footer-brand">' + BRAND + '</div>',
    '    <nav class="mx-footer-nav" aria-label="Navigație footer">',
    '      <a href="site-uri.html">Site-uri</a>',
    '      <a href="magazine-online.html">Magazine</a>',
    '      <a href="proiecte.html">Proiecte</a>',
    '      <a href="contact.html">Contact</a>',
    '    </nav>',
    '  </div>',
    '  <div class="mx-footer-cols">',
    '    <div><h4>Contact</h4><address>Iași, România<br><a href="mailto:contact@signastudioprint.ro">contact@signastudioprint.ro</a></address></div>',
    '    <div><h4>Servicii</h4><address>Site-uri de prezentare<br>Magazine online<br>Aplicații web custom</address></div>',
    '  </div>',
    '  <div class="mx-footer-copy">© <span id="mxYear">2026</span> ' + BRAND + ' — Toate drepturile rezervate</div>',
    '</div></footer>'
  ].join('\n');

  var hp = document.getElementById('header-placeholder');
  var fp = document.getElementById('footer-placeholder');
  if (hp) hp.outerHTML = HEADER;
  if (fp) fp.outerHTML = FOOTER;

  var y = document.getElementById('mxYear');
  if (y) y.textContent = new Date().getFullYear();

  var current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.mx-nav a, .mx-mobile a').forEach(function (a) {
    if ((a.getAttribute('href') || '').split('#')[0] === current) a.classList.add('active');
  });

  var burger = document.getElementById('mxBurger');
  var mobile = document.getElementById('mxMobile');
  function closeM() { if (burger && mobile) { burger.classList.remove('open'); mobile.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } }
  if (burger) burger.addEventListener('click', function () {
    var open = burger.classList.toggle('open');
    mobile.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  if (mobile) mobile.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeM); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeM(); });

  /* Acordeon */
  document.querySelectorAll('.mx-acc-head').forEach(function (head) {
    head.addEventListener('click', function () {
      var item = head.closest('.mx-acc');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.mx-acc').forEach(function (a) {
        a.classList.remove('open');
        var h = a.querySelector('.mx-acc-head'); if (h) h.setAttribute('aria-expanded', 'false');
        var ic = a.querySelector('.mx-acc-icon'); if (ic) ic.textContent = '+';
      });
      if (!isOpen) {
        item.classList.add('open');
        head.setAttribute('aria-expanded', 'true');
        var icon = item.querySelector('.mx-acc-icon'); if (icon) icon.textContent = '–';
      }
    });
  });

  /* Reveal */
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });

})();
