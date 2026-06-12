/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — site-uri-hero.js
   Fundal hero: mini-site Signa care se construiește singur.
   HTML → CSS → JS, cu scroll lin și reset blând.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* Mini-site Signa care se construiește: HTML → CSS → JS */
  var sequences = [
    { file: 'index.html', lines: [
      [['punc','<!'],['kw','DOCTYPE'],['attr',' html'],['punc','>']],
      [['punc','<'],['tag','header'],['attr',' class'],['punc','='],['str','"site-hero"'],['punc','>']],
      [['punc','  <'],['tag','h1'],['punc','>'],['prop','Signa Studio Print'],['punc','</'],['tag','h1'],['punc','>']],
      [['punc','  <'],['tag','p'],['punc','>'],['prop','Design. Web. Publicitate.'],['punc','</'],['tag','p'],['punc','>']],
      [['punc','  <'],['tag','a'],['attr',' href'],['punc','='],['str','"#contact"'],['punc','>']],
      [['prop','    Solicită ofertă'],['punc','</'],['tag','a'],['punc','>']],
      [['punc','</'],['tag','header'],['punc','>']]
    ]},
    { file: 'style.css', lines: [
      [['tag','.site-hero'],['punc',' {']],
      [['prop','  display'],['punc',': '],['val','flex'],['punc',';']],
      [['prop','  flex-direction'],['punc',': '],['val','column'],['punc',';']],
      [['prop','  background'],['punc',': '],['val','#0D0D0D'],['punc',';']],
      [['prop','  color'],['punc',': '],['val','#F8F7F4'],['punc',';']],
      [['prop','  padding'],['punc',': '],['val','6rem 2rem'],['punc',';']],
      [['prop','  animation'],['punc',': '],['val','fadeUp 0.8s ease'],['punc',';']],
      [['punc','}']],
      [['tag','.site-hero h1'],['punc',' { '],['prop','color'],['punc',': '],['val','#C8860D'],['punc','; }']]
    ]},
    { file: 'script.js', lines: [
      [['kw','const'],['prop',' hero'],['punc',' = '],['fn','document'],['punc','.'],['fn','querySelector'],['punc','('],['str','".site-hero"'],['punc',');']],
      [['kw','const'],['prop',' cta'],['punc',' = '],['fn','hero'],['punc','.'],['fn','querySelector'],['punc','('],['str','"a"'],['punc',');']],
      [['blank','']],
      [['fn','cta'],['punc','.'],['fn','addEventListener'],['punc','('],['str','"click"'],['punc',', '],['punc','(e) => {']],
      [['prop','  e'],['punc','.'],['fn','preventDefault'],['punc','();']],
      [['fn','  window'],['punc','.'],['fn','open'],['punc','('],['str','"/contact.html"'],['punc',');']],
      [['punc','});']],
      [['blank','']],
      [['com','// Site live în 3–7 zile ✦']]
    ]}
  ];

  var win = document.getElementById('codeWindow');
  var viewport = win ? win.parentElement : null;
  var fileLabel = document.getElementById('codeFile');
  if (!win) return;

  /* Respectă prefers-reduced-motion: afișează static primul fișier, fără animație */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var seqIndex = 0, lineIndex = 0, tokenIndex = 0, charIndex = 0;
  var currentLines = [];

  function renderFile() {
    if (fileLabel) {
      fileLabel.textContent = sequences[seqIndex].file;
      fileLabel.classList.add('show');
    }
  }

  function buildHTML() {
    var html = '';
    for (var i = 0; i < currentLines.length; i++) {
      var isLast = (i === currentLines.length - 1);
      html += '<div class="code-line">' + (currentLines[i] || '&nbsp;') +
              (isLast ? '<span class="code-cursor"></span>' : '') + '</div>';
    }
    win.innerHTML = html;

    /* Scroll lin: dacă depășește viewportul, ridică conținutul ca ultima linie să rămână vizibilă */
    if (viewport) {
      var overflow = win.scrollHeight - viewport.clientHeight;
      win.style.transform = overflow > 0 ? 'translateY(' + (-overflow) + 'px)' : 'translateY(0)';
    }
  }

  function typeChar() {
    var seq = sequences[seqIndex];
    var line = seq.lines[lineIndex];
    var token = line[tokenIndex];
    var cls = token[0], text = token[1];

    if (currentLines[lineIndex] === undefined) currentLines[lineIndex] = '';

    /* Linie goală (spacer) */
    if (cls === 'blank') {
      currentLines[lineIndex] = '&nbsp;';
      buildHTML();
      tokenIndex = 0; lineIndex++;
      if (lineIndex >= seq.lines.length) { setTimeout(fadeAndNext, 1600); return; }
      setTimeout(typeChar, 120);
      return;
    }

    var lineHTML = '';
    for (var t = 0; t < tokenIndex; t++) {
      lineHTML += '<span class="' + line[t][0] + '">' + escapeHtml(line[t][1]) + '</span>';
    }
    lineHTML += '<span class="' + cls + '">' + escapeHtml(text.slice(0, charIndex + 1)) + '</span>';
    currentLines[lineIndex] = lineHTML;
    buildHTML();

    charIndex++;
    if (charIndex >= text.length) {
      charIndex = 0; tokenIndex++;
      if (tokenIndex >= line.length) {
        tokenIndex = 0; lineIndex++;
        if (lineIndex >= seq.lines.length) { setTimeout(fadeAndNext, 1600); return; }
      }
    }
    var delay = 26 + Math.random() * 48;
    if (text.slice(charIndex - 1, charIndex) === ' ') delay += 25;
    setTimeout(typeChar, delay);
  }

  function fadeAndNext() {
    win.style.opacity = '0';
    if (fileLabel) fileLabel.classList.remove('show');
    setTimeout(function () {
      seqIndex = (seqIndex + 1) % sequences.length;
      lineIndex = 0; tokenIndex = 0; charIndex = 0; currentLines = [];
      win.innerHTML = '';
      win.style.transform = 'translateY(0)';
      win.style.opacity = '1';
      renderFile();
      setTimeout(typeChar, 400);
    }, 1500);
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ── PORNIRE ──────────────────────────────────────────── */
  if (reduceMotion) {
    /* Afișează static tot primul fișier, fără tastare */
    var seq = sequences[0];
    currentLines = seq.lines.map(function (line) {
      if (line[0][0] === 'blank') return '&nbsp;';
      return line.map(function (tok) {
        return '<span class="' + tok[0] + '">' + escapeHtml(tok[1]) + '</span>';
      }).join('');
    });
    buildHTML();
    renderFile();
    return;
  }

  renderFile();
  setTimeout(typeChar, 600);

})();
