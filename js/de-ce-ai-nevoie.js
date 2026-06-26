/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — de-ce-ai-nevoie.js
   Timeline proces: linie de progres + activare pași la scroll.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var steps = document.querySelector('.dce-process-steps');
  if (!steps) return;

  var fill = steps.querySelector('.dce-proc-fill');
  var items = Array.prototype.slice.call(steps.querySelectorAll('.dce-step'));
  if (!items.length) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ticking = false;

  function update() {
    ticking = false;
    var rect = steps.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var center = vh * 0.5;

    /* Progresul liniei: cât din container a trecut de centrul ecranului */
    var prog = (center - rect.top) / rect.height;
    if (prog < 0) prog = 0;
    if (prog > 1) prog = 1;
    if (fill) fill.style.height = (prog * 100) + '%';

    /* Activează fiecare pas când ajunge la centru — rămâne activ */
    items.forEach(function (it) {
      var r = it.getBoundingClientRect();
      if (r.top < center) it.classList.add('active');
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  if (reduceMotion) {
    /* Fără animație: arată tot activ și linia plină */
    items.forEach(function (it) { it.classList.add('active'); });
    if (fill) fill.style.height = '100%';
    return;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();
