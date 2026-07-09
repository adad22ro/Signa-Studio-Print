/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — site-uri-hero.js
   Fereastră de editor (gen VS Code) care construiește singur
   un mini-site Signa: HTML → CSS → JS.
   Tranziție între fișiere ca deschiderea unui tab nou.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var sequences = [
    { file: 'index.html', tab: 'tabHtml', lang: 'HTML', lines: [
      [['punc','<'],['tag','header'],['punc','>']],
      [['punc','  <'],['tag','h1'],['punc','>'],['prop','Signa'],['punc','</'],['tag','h1'],['punc','>']],
      [['punc','  <'],['tag','p'],['punc','>'],['prop','Design. Web.'],['punc','</'],['tag','p'],['punc','>']],
      [['punc','  <'],['tag','a'],['attr',' href'],['punc','='],['str','"#"'],['punc','>']],
      [['prop','    Ofertă'],['punc','</'],['tag','a'],['punc','>']],
      [['punc','</'],['tag','header'],['punc','>']]
    ]},
    { file: 'style.css', tab: 'tabCss', lang: 'CSS', lines: [
      [['tag','header'],['punc',' {']],
      [['prop','  display'],['punc',': '],['val','flex'],['punc',';']],
      [['prop','  background'],['punc',': '],['val','#0D0D0D'],['punc',';']],
      [['prop','  color'],['punc',': '],['val','#F8F7F4'],['punc',';']],
      [['prop','  padding'],['punc',': '],['val','4rem'],['punc',';']],
      [['punc','}']],
      [['tag','h1'],['punc',' { '],['prop','color'],['punc',': '],['val','#C8860D'],['punc','; }']]
    ]},
    { file: 'script.js', tab: 'tabJs', lang: 'JavaScript', lines: [
      [['kw','const'],['prop',' cta'],['punc',' = '],['fn','$'],['punc','('],['str','"a"'],['punc',');']],
      [['blank','']],
      [['fn','cta'],['punc','.'],['fn','onclick'],['punc',' = '],['punc','() => {']],
      [['fn','  open'],['punc','('],['str','"/contact"'],['punc',');']],
      [['punc','};']],
      [['blank','']],
      [['com','// Live în 3–7 zile ✦']]
    ]}
  ];

  var win = document.getElementById('codeWindow');
  var gutter = document.getElementById('gutter');
  var titleEl = document.getElementById('editorTitle');
  var statusLang = document.getElementById('statusLang');
  if (!win || !gutter) return;

  var codeArea = win.parentElement;
  var tabs = {
    tabHtml: document.getElementById('tabHtml'),
    tabCss: document.getElementById('tabCss'),
    tabJs: document.getElementById('tabJs')
  };

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var si = 0, li = 0, ti = 0, ci = 0, cur = [];

  function setActiveTab(id) {
    for (var k in tabs) {
      if (!tabs[k]) continue;
      var isActive = (k === id);
      tabs[k].classList.toggle('active', isActive);
      tabs[k].classList.remove('just-opened');
      if (isActive) { void tabs[k].offsetWidth; tabs[k].classList.add('just-opened'); }
    }
  }

  function renderMeta() {
    var s = sequences[si];
    if (titleEl) titleEl.textContent = 'signa — ' + s.file;
    if (statusLang) statusLang.textContent = s.lang;
    setActiveTab(s.tab);
  }

  function build() {
    var html = '', g = '';
    for (var i = 0; i < cur.length; i++) {
      var last = (i === cur.length - 1);
      html += '<div class="code-line">' + (cur[i] || '&nbsp;') + (last ? '<span class="code-cursor"></span>' : '') + '</div>';
      g += '<div class="gutter-num">' + (i + 1) + '</div>';
    }
    win.innerHTML = html;
    gutter.innerHTML = g;
    var ov = win.scrollHeight - codeArea.clientHeight;
    var ty = ov > 0 ? 'translateY(' + (-ov) + 'px)' : 'translateY(0)';
    win.style.transform = ty;
    gutter.style.transform = ty;
  }

  function type() {
    var s = sequences[si], line = s.lines[li], tok = line[ti], cls = tok[0], txt = tok[1];
    if (cur[li] === undefined) cur[li] = '';

    if (cls === 'blank') {
      cur[li] = '&nbsp;'; build(); ti = 0; li++;
      if (li >= s.lines.length) { setTimeout(nextFile, 1600); return; }
      setTimeout(type, 120); return;
    }

    var lh = '';
    for (var t = 0; t < ti; t++) lh += '<span class="' + line[t][0] + '">' + esc(line[t][1]) + '</span>';
    lh += '<span class="' + cls + '">' + esc(txt.slice(0, ci + 1)) + '</span>';
    cur[li] = lh; build();

    ci++;
    if (ci >= txt.length) {
      ci = 0; ti++;
      if (ti >= line.length) {
        ti = 0; li++;
        if (li >= s.lines.length) { setTimeout(nextFile, 1600); return; }
      }
    }
    var d = 26 + Math.random() * 46;
    if (txt.slice(ci - 1, ci) === ' ') d += 24;
    setTimeout(type, d);
  }

  /* Schimbă la următorul fișier INSTANT, ca deschiderea unui tab nou */
  function nextFile() {
    setTimeout(function () {
      si = (si + 1) % sequences.length;
      li = 0; ti = 0; ci = 0; cur = [];
      win.innerHTML = ''; gutter.innerHTML = '';
      win.style.transform = 'translateY(0)';
      gutter.style.transform = 'translateY(0)';
      renderMeta();
      setTimeout(type, 260);
    }, 1500);
  }

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* prefers-reduced-motion: afișează static primul fișier */
  if (reduceMotion) {
    var s0 = sequences[0];
    cur = s0.lines.map(function (line) {
      if (line[0][0] === 'blank') return '&nbsp;';
      return line.map(function (tok) {
        return '<span class="' + tok[0] + '">' + esc(tok[1]) + '</span>';
      }).join('');
    });
    build();
    renderMeta();
    return;
  }

  renderMeta();
  setTimeout(type, 600);

})();
