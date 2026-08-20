# Signa Studio Print — context proiect

> Fișier de context pentru sesiuni Claude Code. Citește-l primul — e suficient
> pentru a începe lucrul fără explorare suplimentară a codului.

> ⚠️ **La orice eroare, verifică ÎNTÂI [ERORI.md](ERORI.md)** — conține erorile
> deja întâlnite, cu cauza și soluția. Multe sunt specifice acestui calculator
> (Windows + Git Bash + XAMPP) și s-ar repeta identic.

> ⚠️ **La începutul fiecărei sesiuni: `git fetch origin`** și compară cu remote
> înainte de a presupune ceva despre starea proiectului. Pe 18 aug 2026 această
> verificare a lipsit și s-a refăcut o zi de muncă deja existentă pe GitHub.

## Identitate

- **Client:** Signa Studio Print — Iași, România
- **Domeniu:** site-uri de prezentare, magazine online și aplicații custom (cu AI)
- **Web:** https://signastudioprint.ro
- **Limba site:** română (diacritice corecte, obligatoriu)
- **Repo:** https://github.com/adad22ro/Signa-Studio-Print (**privat**, branch `main`)
- **Stack:** HTML5 + CSS3 + JS vanilla (ES6, IIFE, fără build tools) + PHP pentru formular

---

## REGULI ABSOLUTE (din `instrucțiuni-site-v4.txt`)

1. **Zero cod inline** — fără `style=""`, fără `onclick=""`, fără `<script>`/`<style>` în pagină.
2. **Navbar / footer / cookie banner** se scriu **o singură dată** și se injectează în fiecare pagină.
3. **Zero valori hardcodate în CSS** — totul prin variabile din `variables.css`.
4. **HSTS în .htaccess doar după ce SSL e activ** — altfel site-ul devine inaccesibil.
5. **Cache busting incrementat la fiecare modificare:** `style.css?v=1.0.0` → `?v=1.0.1`.
6. **Convenție BEM:** `.block`, `.block__element`, `.block--modifier`. Niciodată `.div1`, `.albastru`.
7. **Livrează codul COMPLET al fișierului**, nu fragmente. Specifică mereu calea exactă.
8. **Animații doar prin Intersection Observer**, niciodată pe evenimente `scroll`.
9. **Terminal:** explică pas cu pas — ce comandă, ce face, ce ar trebui să vadă utilizatorul după.
10. **`changelog.md`** actualizat la fiecare modificare: `vX.Y.Z - DATA - descriere scurtă`.

### Accesibilitate & SEO (nenegociabile)
- ARIA pe tot ce e interactiv; contrast min. 4.5:1; navigabil complet cu tastatura
- Skip-link ca prim element din `<body>`
- Title (max 60) + meta description (max 155) **unice** per pagină
- Open Graph complet + canonical + JSON-LD pe fiecare pagină
- Pagini fără valoare SEO (404, legale, mulțumire) → `noindex, nofollow`

---

## Structura ȚINTĂ (conform instrucțiuni — încă neatinsă)

```
index.html, [pagini].html
components/   navbar.html, footer.html, cookie-banner.html   (injectate prin fetch)
css/          reset.css, variables.css, base.css, layout.css,
              components.css, responsive.css, animations.css
js/           main.js, form.js, cookie.js, animations.js
php/          contact.php + tmp/     (rate limiting; tmp blocat în robots + .htaccess)
img/          icons/, og/
              404.html, robots.txt, sitemap.xml, site.webmanifest,
              .htaccess, changelog.md,
              politica-confidentialitate.html, termeni-conditii.html
```

Breakpoints țintă (în `responsive.css`): **1024 / 768 / 640 / 480px**

---

## Structura ACTUALĂ (v2.1.0 — reconstrucție Figma în curs)

**Sistem de design nou** (structura cerută de instrucțiuni, pe loc):
```
css/reset.css  variables.css  base.css  components.css  responsive.css
css/home.css      (secțiuni pagina principală)
css/servicii.css  (pagini de serviciu: SP / MO / AC)
css/legal.css     (pagini legale)
components/navbar.html  footer.html      (injectate prin fetch)
js/main.js  animations.js  form.js
php/contact.php  config.php  tmp/
```

**Pagini pe designul NOU (Figma):**
- `index.html` — ✅ COMPLETĂ, toate cele 11 secțiuni
- `aplicatii-custom.html` — ✅ pagină nouă (frame 1:1668)
- `politica-confidentialitate.html`, `termeni-conditii.html` — ✅
  ⚠️ conțin marcaje `[DE COMPLETAT]` (denumire legală, CUI, adresă)

**Pagini încă pe designul VECHI v2.0.0** (Space Grotesk + teal, `css/global.css`):
- `site-uri.html` (Figma 1:1398 / 1:2981)
- `magazine-online.html` (Figma 1:1861 / 1:3254)
- `proiecte.html` (Figma 1:1190 / 1:2857)
- `contact.html` (Figma 1:1320 / 1:3718)
- `404.html` (fără frame — se face în stilul nou)
- Fișiere vechi încă folosite: `css/global.css`, `css/error.css`,
  `js/components.js`, `js/contact.js` — se șterg pe măsura reconstrucției

**Versiune cache busting: `?v=2.1.0`** — incrementeaz-o la orice modificare
de CSS/JS, în TOATE paginile (`.htaccess` servește cu `immutable, max-age=1an`).

## Unelte verificate pe acest calculator

- PHP 8.2 la `/c/xampp/php/php.exe` — `php -l` și `php -S 127.0.0.1:8899 -t .`
- Chrome la `/c/Program Files/Google/Chrome/Application/chrome.exe`
  — screenshot headless; **cale Windows la `--screenshot`**
  — **nu poate randa sub 500px**: pentru mobil folosește metoda cu iframe
    din [ERORI.md](ERORI.md) 1.10
- `sharp` instalat în scratchpad pentru WebP (nu în proiect)
- **Previzualizarea necesită server** — `fetch()` nu merge pe `file://`
- Figma: REST API pentru date (`/v1/files`), dar `/v1/images` are rate limit —
  reproduce în CSS ce se poate (gradienți, forme simple)

---

## Stare conformitate

### ✅ Rezolvate (v1.0.1 — 2026-08-18, testate funcțional)
- `php/contact.php` + `php/config.php` — POST-only, honeypot, CSRF, sanitizare,
  validare server-side, limite hard, rate limiting, email multipart cu Reply-To.
  Testat cu PHP 8.2: CSRF greșit → 403, metodă greșită → 405, date invalide → 422,
  honeypot → succes fals, depășire limită → 429.
  **Rate limiting numără doar trimiterile reușite**, nu și erorile de validare
  (altfel utilizatorul se autoblochează greșind emailul).
- `.htaccess` — security headers, CSP (Fontshare + Google Fonts), GZIP, cache 1 an,
  blocare listare directoare și fișiere sensibile, `ErrorDocument 404`.
  HSTS și redirectările HTTPS/www sunt **comentate** — se activează după SSL.
- `php/tmp/` — blocat din web prin `.htaccess` propriu; conținutul ignorat de git.
- `js/contact.js` — trimitere reală prin `fetch()` (înainte simula cu `setTimeout`).
- `sitemap.xml` — eliminate 3 pagini inexistente, adăugat `magazine-online.html`.
- `robots.txt` — blocat explicit `/php/tmp/`.
- **Cache busting `?v=1.0.1`** pe toate cele 32 de referințe CSS/JS.
  Obligatoriu acum: `.htaccess` servește CSS/JS cu `immutable, max-age=1an`.
  **La orice modificare de CSS/JS, incrementează versiunea în toate paginile.**
- `changelog.md` — creat.
- `css/global.css` — adăugate `--error`, `--error-bg`, `--error-border`.

### ❌ Rămase de făcut
- **Cookie banner + `cookie.js`** — nu există încă (regula absolută 2 + GDPR)
- **Datele firmei în paginile legale** — marcajele `[DE COMPLETAT]`
  (denumire legală, CUI, adresă); documentele nu sunt valabile fără ele
- **Reconstrucția paginilor rămase** pe designul Figma (vezi Structura ACTUALĂ)
- `style=` inline în `magazine-online.html` (dispare la reconstrucție)
- `css/site-uri.css`: 40 hex hardcodate (dispare la reconstrucție)
- Date contact placeholder (`+40 700 000 000`) în `contact.html`
- **Contrast insuficient în hero**: textul alb peste zona portocalie a
  gradientului nu trece 4.5:1. Reprodus fidel din Figma, la cererea clientului
  — decizie de luat (overlay subtil sau mutarea textului pe zona închisă)

---

## FIGMA — acces și date deja extrase

**Fișier:** `Signa Studio Design`
**fileKey:** `x4XGqHY7qNJFLYbyxZG89d`
**URL:** https://www.figma.com/design/x4XGqHY7qNJFLYbyxZG89d/Signa-Studio-Design

### Cum accesezi — IMPORTANT, nu risipi apeluri MCP

Cont Figma: plan **Starter + seat Full** → MCP-ul Figma are doar **20 apeluri pe LUNĂ**.
**Folosește REST API pentru date** (limite generoase, gratuit pe Starter) și păstrează
MCP-ul exclusiv pentru `get_screenshot` la verificarea vizuală finală.

Token read-only salvat în `~/.figma-token` (în afara repo-ului):

```bash
TOKEN=$(cat "$HOME/.figma-token")

# structura unui frame
curl -s -H "X-Figma-Token: $TOKEN" \
  "https://api.figma.com/v1/files/x4XGqHY7qNJFLYbyxZG89d/nodes?ids=1:439" -o frame.json

# export imagine PNG @2x (sau format=svg pentru logo-uri/iconuri)
curl -s -H "X-Figma-Token: $TOKEN" \
  "https://api.figma.com/v1/images/x4XGqHY7qNJFLYbyxZG89d?ids=1:439&format=png&scale=2"
```

> Endpoint-ul `/variables/local` e **Enterprise-only** — nu funcționează pe Starter.
> Valorile rezolvate se citesc din JSON-ul nodurilor (deja extrase mai jos).

### Frame-uri (12 — desktop 1440px + mobil ~393px)

| Pagină | Desktop | Mobil |
|---|---|---|
| Landing | `1:439` | `1:2138` |
| Site-uri prezentare (SP) | `1:1398` | `1:2981` |
| Magazine online (MO) | `1:1861` | `1:3254` |
| Aplicații custom (AC) — **pagină nouă** | `1:1668` | `1:3531` ⚠️ |
| Proiecte | `1:1190` | `1:2857` |
| Contact | `1:1320` | `1:3718` ⚠️ |

⚠️ `1:3531` și `1:3718` sunt denumite greșit în Figma (ambele „Tip servicii mobile MO").
După conținut sunt de fapt **AC**, respectiv **Contact**.

### Tokeni extrași din design

**Temă: LIGHT.** Toate cele 12 frame-uri au fundal `#ffffff`. Albul domină ca
suprafață (58.7M px² față de 10.9M negru). `#101010` este culoarea **textului**
(460 noduri text), NU a fundalului — de verificat mereu `fills` pe noduri
non-TEXT când se deduce paleta.

Structura vizuală: pagină albă, cu **o bandă închisă full-width** (secțiunea
despre agenție, 1440×2162) și **carduri închise** în restul secțiunilor.

```
Fundal pagină:   #ffffff
Suprafețe închise: #0a0a0a   #101010   #141414   #000000
Text pe alb:     #101010 (principal)   #4e4e4e (secundar)
Text pe închis:  #ffffff   #bdbec2 (secundar)
Accente:         #278cff (albastru)  #1efb26 (verde)  #e9591c (portocaliu)
                 #2e964b  #3898ec  #4fa3f2

Gradient-semnătură (x32):
  #ff6161 → #ffd361 → #95ffa0 → #95b9ff → #d795ff
```

**Tipografie** — ambele fonturi sunt **gratuite comercial** via Fontshare CDN (testat, HTTP 200):

```html
<link rel="preconnect" href="https://api.fontshare.com">
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&f[]=cabinet-grotesk@400,500,700&display=swap" rel="stylesheet">
```

- **Satoshi** → font principal (titluri + UI + corp text), weights 400/500/700/900
- **Cabinet Grotesk** → paragrafe intro / display, weight 400

Scala reală (size/line-height/letter-spacing):
```
Hero:     132/178 ls+5.28 (700)   104/94 ls-2 (900)
Display:  64/86 (900)   64/60 (700)   49/65 ls-0.97 (500)
Titluri:  48/58   43/58   40/50   34/34   32/41..43
Corp:     21/41   20/27 ls-0.40   18/36   16/22   14/19   12/16
```

**Border radius:** 15, 24, 25, 40, 48px
(valorile fracționare gen `1.13px` sunt zgomot din vectori scalați — se ignoră)

**Shadows:** `0px 4px 4px #00000040` apare de 104 ori = default Figma, neintenționat.
Se folosește scala din secțiunea „Decizii luate".

---

## Ordinea de lucru stabilită

1. ~~**Backend**~~ — ✅ FĂCUT în v1.0.1 (vezi Stare conformitate)
2. **Reconstrucția pe designul Figma** — se adoptă direct structura ȚINTĂ de mai sus
   (`variables.css` generat din tokenii de mai sus, `components/*.html` prin fetch)
3. **Finisaje pe designul nou** — WebP + srcset, cache busting, pagini legale, cookie banner

> Nu face fixuri de CSS sau markup înainte de pasul 2 — se rescriu oricum.

## Decizii luate

1. **Se păstrează exact paginile din Figma.** `de-ce-ai-nevoie.html` (+ CSS/JS) și
   `explorare-lista.html` au fost **șterse** (recuperabile: `git checkout HEAD~ -- <fișier>`).
   **Excepții păstrate**, fiindcă sunt cerințe funcționale/legale, nu pagini de design:
   `404.html` (servit prin `ErrorDocument`), paginile legale și cookie banner-ul (GDPR).
   Acestea se construiesc în stilul designului nou.
2. **Pagina AC (Aplicații Custom) se adaugă** — în navbar, footer și sitemap.
3. **Umbrele NU se reproduc din Figma.** `0 4px 4px rgba(0,0,0,.25)` (x104) e valoarea
   default din Figma, nu o decizie de design: blur = offset ⇒ margine dură, iar negrul
   pur e invizibil pe `#101010`. Se folosește scala de mai jos, iar elevația se face
   prin trepte de suprafață, nu prin umbre:

   ```css
   --shadow-sm:   0 1px 2px  rgba(0,0,0,.4);
   --shadow-md:   0 4px 12px rgba(0,0,0,.5);
   --shadow-lg:   0 12px 32px rgba(0,0,0,.6);
   --glow-accent: 0 4px 20px rgba(39,140,255,.25);
   /* elevație pe dark: #101010 → #171717 → #1f1f1f + border 1px rgba(255,255,255,.08) */
   ```

## De făcut la finalul proiectului

- [ ] Regenerează token-ul Figma (a fost expus în chat) — Settings → Security → revoke
- [ ] Activează HSTS în `.htaccess` **doar după** ce SSL e confirmat funcțional
- [ ] Înlocuiește datele de contact placeholder (`+40 700 000 000`)
