/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — site-uri-hero.js
   Cod care curge (canvas) + Typewriter effect
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── COD CARE CURGE ─────────────────────────────────── */
  var canvas = document.getElementById('codeRain');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');

  /* Fragmente de cod sugestive */
  var codeChars = [
    '<div>', '</div>', '<section>', 'const', 'function()',
    'display:', 'flex', 'border:', '1px', 'solid',
    'font-size:', 'margin:', 'padding:', 'color:', '#fff',
    'var(--', 'rgba(', 'transform:', 'opacity:', 'animation:',
    'return', '=>', '{}', '[];', '.classList',
    'querySelector', 'addEventListener', 'fetch(', 'async',
    'clamp(', 'grid', 'clamp', 'vh', 'vw', 'rem',
    'AI', '✦', '···', '0px', '100%', 'ease',
  ];

  var columns = [];
  var fontSize = 13;
  var cols;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    cols = Math.floor(canvas.width / (fontSize * 4.5));
    columns = [];
    for (var i = 0; i < cols; i++) {
      columns.push({
        y: Math.random() * -canvas.height,
        speed: 0.5 + Math.random() * 1.0,
        opacity: 0.55 + Math.random() * 0.4,
        charIndex: Math.floor(Math.random() * codeChars.length),
      });
    }
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  var colWidth = 0;

  function draw() {
    /* Fade trail */
    ctx.fillStyle = 'rgba(13, 13, 13, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    colWidth = canvas.width / cols;

    columns.forEach(function (col, i) {
      var text = codeChars[col.charIndex % codeChars.length];

      var isGold = (i % 3 !== 0);
      ctx.fillStyle = isGold
        ? 'rgba(184, 146, 42, ' + col.opacity + ')'
        : 'rgba(255, 255, 255, ' + (col.opacity * 0.6) + ')';

      ctx.font = fontSize + 'px JetBrains Mono, monospace';
      ctx.fillText(text, i * colWidth, col.y);

      col.y += col.speed * fontSize;
      col.charIndex++;

      /* Reset când iese din ecran */
      if (col.y > canvas.height + fontSize * 2) {
        col.y = -fontSize * (2 + Math.random() * 8);
        col.speed = 0.4 + Math.random() * 0.8;
        col.opacity = 0.5 + Math.random() * 0.45;
        col.charIndex = Math.floor(Math.random() * codeChars.length);
      }
    });

    requestAnimationFrame(draw);
  }

  draw();

  /* ── TYPEWRITER EFFECT ──────────────────────────────── */
  var el = document.getElementById('typewriter');
  if (!el) return;

  var words = ['AI.', 'atenție la detalii.', 'pasiune.'];
  var wordIndex = 0;
  var charIndex = 0;
  var deleting = false;
  var pauseFrames = 0;

  function type() {
    var current = words[wordIndex];

    if (pauseFrames > 0) {
      pauseFrames--;
      setTimeout(type, 80);
      return;
    }

    if (!deleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        pauseFrames = 18; /* pauza dupa scriere completa */
      }
      setTimeout(type, 90);
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        pauseFrames = 6;
      }
      setTimeout(type, 50);
    }
  }

  /* Porneste dupa ce animatia hero s-a incarcat */
  setTimeout(type, 800);

})();
