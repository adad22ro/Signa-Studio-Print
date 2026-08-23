# Signa Studio — context proiect

> **Citește acest fișier primul.** E suficient pentru a începe lucrul fără să
> explorezi codul. Sincronizat cu `v2.4.5`.

---

## ⚠️ PRIMII DOI PAȘI, ÎNAINTE DE ORICE

**1. Sincronizează-te cu remote-ul:**
```bash
git fetch origin
git log --oneline HEAD..origin/main    # ce e pe remote și nu ai
git log --oneline origin/main..HEAD    # ce ai și nu e pe remote
```
Pe 18 aug 2026 acest pas a lipsit și s-a refăcut o zi întreagă de muncă deja
existentă pe GitHub. Nu te baza pe `pushedAt` din `gh repo view` — poate fi vechi.

**2. La orice eroare, caută ÎNTÂI în [ERORI.md](ERORI.md)** — 29 de erori
documentate, cu mesajul exact, cauza și soluția verificată. Multe sunt specifice
acestui calculator (Windows + Git Bash + XAMPP) și s-ar repeta identic.

---

## Identitate

- **Client:** Signa Studio Dev — Iași, România
- **Servicii:** site-uri de prezentare, magazine online, aplicații web custom
- **Web:** https://signastudiodev.ro (încă nepublicat)
- **Limba:** română, cu diacritice corecte — obligatoriu
- **Repo:** https://github.com/adad22ro/Signa-Studio-Print (**privat**, branch `main`)
- **Stack:** HTML5 + CSS3 + JS vanilla (ES6, IIFE, fără build tools) + PHP pentru formular

---

## REGULI ABSOLUTE (din `instrucțiuni-site-v4.txt`)

1. **Zero cod inline** — fără `style=""`, `onclick=""`, `<script>`/`<style>` în pagină
2. **Navbar / footer / cookie banner** se scriu o singură dată și se injectează
3. **Zero valori hardcodate în CSS** — totul prin variabile din `variables.css`
4. **HSTS în `.htaccess` doar după ce SSL e activ** — altfel site-ul devine inaccesibil
5. **Cache busting incrementat la fiecare modificare de CSS/JS, în TOATE paginile**
6. **BEM:** `.block`, `.block__element`, `.block--modifier`
7. **Livrează fișierul COMPLET**, nu fragmente; specifică mereu calea exactă
8. **Animații doar prin Intersection Observer**, niciodată pe evenimente `scroll`
9. **Terminal:** explică pas cu pas — ce comandă, ce face, ce ar trebui să vadă
10. **`changelog.md`** actualizat la fiecare modificare: `vX.Y.Z - DATA - descriere`

### Accesibilitate & SEO (nenegociabile)
- ARIA pe tot ce e interactiv; contrast min. 4.5:1; navigabil complet cu tastatura
- Skip-link ca prim element din `<body>`
- Title (max 60) + meta description (max 155) **unice** per pagină
- Open Graph + canonical + JSON-LD pe fiecare pagină
- Pagini fără valoare SEO (404, legale) → `noindex, nofollow`

---

## STAREA PROIECTULUI: reconstrucția pe Figma e TERMINATĂ

Toate paginile sunt pe designul nou. Structura cerută de instrucțiuni e atinsă.

```
index.html  site-uri.html  magazine-online.html  aplicatii-custom.html
proiecte.html  contact.html  404.html
politica-confidentialitate.html  termeni-conditii.html

components/   navbar.html  footer.html  cookie-banner.html   (prin fetch)
css/          reset.css  variables.css  base.css  components.css  responsive.css
              home.css      → secțiunile paginii principale
              servicii.css  → SP / MO / AC / proiecte / contact / 404
              legal.css     → pagini legale
js/           main.js  animations.js  form.js  cookie.js
php/          contact.php  config.php  tmp/
              .htaccess  robots.txt  sitemap.xml  site.webmanifest
              changelog.md  CLAUDE.md  ERORI.md
```

**Versiune cache busting curentă: `?v=2.4.5`** — incrementeaz-o la ORICE
modificare de CSS/JS, în toate paginile. `.htaccess` servește cu
`immutable, max-age=1an`, deci fără asta vizitatorii rămân blocați pe versiunea veche.

**Dimensiune:** 1.4 MB total, 1 MB imagini. Pagina principală ≈ 448 KB resurse proprii.

### Rolul fișierelor JS

| fișier | rol |
|---|---|
| `main.js` | injectează componentele prin `fetch`, link activ, meniu derulant „Servicii", hamburger, header la scroll, scroll lin cu offset. Emite evenimentul `componente:gata` |
| `animations.js` | reveal la scroll prin Intersection Observer; pune pe pauză cascada din hero când panoul iese de pe ecran; contorizează cifrele marcate cu `data-count-to` |
| `form.js` | validare, token CSRF, trimitere AJAX — partajat de toate paginile cu formular |
| `cookie.js` | banner GDPR; **nu încarcă nimic înainte de accept explicit** |

---

## Cum rulezi și verifici (unelte confirmate pe acest calculator)

**Previzualizarea NECESITĂ server** — `fetch()` nu merge pe `file://`:
```bash
/c/xampp/php/php.exe -S 127.0.0.1:8899 -t .
```

**PHP 8.2** la `/c/xampp/php/php.exe` — `php -l fisier.php` pentru sintaxă.
`mail()` nu merge local (fără SMTP), deci calea de succes a formularului dă 500
local. Restul fluxului (CSRF, honeypot, validare, rate limiting) e testabil.

**Chrome headless** la `/c/Program Files/Google/Chrome/Application/chrome.exe`:
```bash
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
"$CHROME" --headless --disable-gpu --hide-scrollbars --window-size=1440,3000 \
  --virtual-time-budget=10000 --screenshot='C:\cale\windows\out.png' \
  http://127.0.0.1:8899/
```
Trei capcane, toate documentate în [ERORI.md](ERORI.md):
- calea la `--screenshot` trebuie **Windows** (`C:\...`), nu POSIX — **1.2**
- **nu poate randa sub 500px**; pentru mobil folosește metoda cu iframe — **1.10**
- `--virtual-time-budget` **nu avansează tranzițiile CSS**, deci nu măsura
  proprietăți tranziționate cu `getComputedStyle` — verifică prin screenshot — **1.11**

**`sharp`** e instalat în scratchpad pentru conversie WebP — nu în proiect, ca
să nu introducem build tools.

---

## FIGMA — acces și tokeni

**fileKey:** `x4XGqHY7qNJFLYbyxZG89d`
**URL:** https://www.figma.com/design/x4XGqHY7qNJFLYbyxZG89d/Signa-Studio-Design
**Token read-only:** `~/.figma-token`, în afara repo-ului

```bash
TOKEN=$(cat "$HOME/.figma-token")

# structura unui frame — fără limită strânsă, folosește-l liber
curl -s -H "X-Figma-Token: $TOKEN" \
  "https://api.figma.com/v1/files/x4XGqHY7qNJFLYbyxZG89d/nodes?ids=1:439"

# randare nod ca imagine — echivalentul unui screenshot
curl -s -H "X-Figma-Token: $TOKEN" \
  "https://api.figma.com/v1/images/x4XGqHY7qNJFLYbyxZG89d?ids=1:439&format=png&scale=2"
```

- `/v1/images` **are rate limit** (429). Grupează ID-urile într-un singur apel
  și reproduce în CSS ce se poate — gradienți, forme simple — [ERORI.md](ERORI.md) **3.6**
- `/v1/variables/local` e **Enterprise-only**, nu funcționează pe acest cont
- MCP-ul Figma: plan Starter → **20 apeluri pe LUNĂ**. Nu-l folosi pentru date.

### Frame-uri

| Pagină | Desktop | Mobil |
|---|---|---|
| Landing | `1:439` | `1:2138` |
| Site-uri prezentare | `1:1398` | `1:2981` |
| Magazine online | `1:1861` | `1:3254` |
| Aplicații custom | `1:1668` | `1:3531` ⚠️ |
| Proiecte | `1:1190` | `1:2857` |
| Contact | `1:1320` | `1:3718` ⚠️ |

⚠️ `1:3531` și `1:3718` sunt **denumite greșit** în Figma (ambele „Tip servicii
mobile MO"). După conținut sunt **AC**, respectiv **Contact**.

### Tokeni — deja în `css/variables.css`, nu-i re-extrage

**Temă LIGHT.** Toate frame-urile au fundal `#ffffff`. `#101010` e culoarea
**textului**, nu a fundalului. La analiza `fills`, separă nodurile `TEXT` de
restul și cântărește fundalurile după **suprafață**, nu după frecvență —
altfel deduci greșit tema ([ERORI.md](ERORI.md) **3.1**).

```
Fundal: #FFFFFF   Suprafețe închise: #0A0A0A  #101010  #141414  #000000
Text pe alb: #101010 / #4E4E4E      Text pe închis: #FFFFFF / #BDBEC2
Accente: #278CFF  #1EFB26  #E9591C  #2E964B  #3898EC  #4FA3F2
Gradient-semnătură: #FF6161 → #FFD361 → #95FFA0 → #95B9FF → #D795FF
```

**Fonturi — Fontshare, gratuite comercial:**
```html
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@300,301,400,500,700,900&f[]=cabinet-grotesk@400,500,700&display=swap">
```
- **Satoshi** — principal; **Cabinet Grotesk** — paragrafe intro și accente bold
- La Fontshare **italicul e weight-ul +1** (`301` = 300 italic) — **3.4**
- ⚠️ CSP-ul din `.htaccess` trebuie să permită `api.fontshare.com` și
  `cdn.fontshare.com`. A fost odată doar pe Google Fonts și ar fi blocat toate
  fonturile în producție — se vede doar pe Apache, nu local — **4.8**

**Radius:** 15, 24, 25, 40, 48px (valorile fracționare sunt zgomot din vectori scalați)

**Umbre:** `0 4px 4px rgba(0,0,0,.25)` apare de 104 ori în Figma — e **valoarea
default a aplicației, neintenționată**. Nu se reproduce; folosim scala din
`variables.css`.

---

## Decizii luate — nu le re-discuta

1. **Se păstrează exact paginile din Figma.** `de-ce-ai-nevoie.html` și
   `explorare-lista.html` au fost șterse. Excepții păstrate, fiindcă sunt
   cerințe funcționale sau legale: `404.html`, paginile legale, cookie banner.
2. **Umbrele nu se reproduc din Figma** (vezi mai sus).
3. **Diacriticele se scriu corect**, deși în Figma lipsesc pe alocuri (regula 5).
4. **„Servicii" e meniu derulant** în navbar. Figma are 4 intrări fără submeniu,
   dar paginile de serviciu nu erau accesibile din paginile interioare. Navbarul
   în repaus rămâne identic cu designul.
5. **Pagina de contact are date directe** (email, locație, timp de răspuns),
   deși Figma are doar formularul — o pagină de contact fără adresă e o lipsă reală.
6. **Textele placeholder din Figma au fost rescrise** unde erau evident greșite:
   secțiunea „Ce primești" (toate cele 6 descrieri erau identice) și planurile
   de preț pentru magazine (descrierile erau copiate din pagina de site-uri).
   **Prețurile sunt cele reale din Figma:** SP 500 / 1.200 lei,
   MO 2.500 / 5.000 lei, ambele cu al treilea plan „La cerere".
7. **Fundalul hero e gradient CSS, nu imagine** (v2.2.6). S-a trecut de la
   `hero-gradient-*.webp` la `.hero__bg` din `home.css` fiindcă doar așa se pot
   anima culorile individual — o imagine se poate doar muta sau filtra global.
   Peste el, `.hero__flow` face o cascadă de 6s cu culorile-semnătură. Culorile
   sunt în `variables.css`, declarate și în `:root` și cu `@property`; nu șterge
   prima declarație, e fallback-ul pentru browserele fără `@property`.
8. **Linkul „Despre" a fost scos** din navbar și footer (v2.2.4). Ducea spre
   `index.html#despre`, deci din paginile interioare te trimitea înapoi pe
   pagina principală, cu derulare, către conținut fără valoare informativă.
   Secțiunea rămâne în `index.html`, doar navigația către ea a dispărut.

---

## ✅ Ce e gata și testat

- **Backend formular** (`php/contact.php` + `config.php`): POST-only, honeypot,
  CSRF din sesiune, sanitizare, validare server-side, limite hard, email
  multipart cu Reply-To. Testat cu PHP 8.2 — CSRF greșit → 403, metodă greșită →
  405, date invalide → 422, honeypot → succes fals, depășire limită → 429.
  **Rate limiting numără doar trimiterile reușite**, nu erorile de validare
  (altfel utilizatorul se autoblochează greșind emailul).
- **`.htaccess`**: security headers, CSP pe Fontshare, GZIP, cache 1 an cu
  `immutable`, blocare listare directoare + fișiere sensibile + `config.php`,
  `ErrorDocument 404`. HSTS și redirectările HTTPS/www sunt **comentate**.
- **Cookie banner GDPR**: zero scripturi de urmărire înainte de accept explicit;
  la refuz nu se încarcă nimic. Testat programatic.
- **Toate cele 9 pagini**: răspund 200, linkuri interne valide, zero cod inline,
  zero culori hardcodate în afara `variables.css`, title/description în limite,
  layout mobil curat la 393px reali.

---

## ❌ Ce a rămas de făcut

### Blocat de date pe care nu le avem
- **Datele firmei în paginile legale** — marcajele `[DE COMPLETAT]` (denumire
  legală, CUI, adresă). Documentele **nu sunt valabile juridic** fără ele.
- **Telefonul de contact** — lipsește din Figma; cel vechi era placeholder
  (`+40 700 000 000`) și nu a fost preluat.

### Decizie de design în așteptare
- **Contrast insuficient în hero**: textul alb peste zona portocalie a
  gradientului nu trece 4.5:1 — cerință explicită în instrucțiuni. Reprodus
  fidel la cererea clientului. Se rezolvă cu un overlay subtil sau mutând
  blocul de text peste zona închisă a gradientului.

### Verificări nefăcute
- Test pe dispozitiv mobil real (până acum doar prin metoda cu iframe)
- Test al trimiterii reale de email (necesită host cu PHP și SMTP)

---

## 🚀 Înainte de publicare — listă de control

- [ ] `MAIL_TO` și `MAIL_FROM` reale în `php/config.php`
- [ ] Confirmă `DEV_MODE = false` în `php/config.php` (e deja false)
- [ ] Datele firmei în cele două pagini legale
- [ ] Verifică `mail()` pe host — trimite un mesaj de test
- [ ] Activează HSTS în `.htaccess` **doar după** ce SSL e confirmat funcțional
- [ ] Decomentează redirectările HTTPS și www/non-www în `.htaccess`
- [ ] Dacă activezi Analytics: `ANALYTICS_ID` în `js/cookie.js` **și** domeniile
      Google în CSP (vezi nota din `.htaccess`) — altfel CSP-ul îl blochează
- [ ] Regenerează token-ul Figma (a fost expus în chat) — Settings → Security
- [ ] Trimite `sitemap.xml` în Google Search Console
