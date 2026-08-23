# Signa Studio Dev — context proiect

> **Citește acest fișier primul.** E suficient pentru a începe lucrul fără să
> explorezi codul. Sincronizat cu `v2.5.2`.

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

**2. La orice eroare, caută ÎNTÂI în [ERORI.md](ERORI.md)** — 33 de erori
documentate, cu mesajul exact, cauza și soluția verificată. Multe sunt specifice
acestui calculator (Windows + Git Bash + XAMPP) și s-ar repeta identic.

---

## Identitate

- **Client:** Signa Studio Dev — Iași, România
- **Servicii:** site-uri de prezentare, magazine online, aplicații web custom
- **Web:** https://signastudiodev.ro (încă nepublicat)
- **Limba:** română, cu diacritice corecte — obligatoriu
- **Repo:** https://github.com/adad22ro/Signa-Studio-Print (**public**, branch `main`)
  — numele repo-ului a rămas cel vechi; firma și domeniul s-au redenumit în v2.4.0
- **Previzualizare:** https://adad22ro.github.io/Signa-Studio-Print/ (GitHub Pages;
  formularul NU funcționează acolo — Pages nu rulează PHP — și `.htaccess` e ignorat)
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

**Versiune cache busting curentă: `?v=2.5.2`** — incrementeaz-o la ORICE
modificare de CSS/JS, în toate paginile. `.htaccess` servește cu
`immutable, max-age=1an`, deci fără asta vizitatorii rămân blocați pe versiunea veche.

**Dimensiune:** 1.4 MB total, 1 MB imagini. Pagina principală ≈ 448 KB resurse proprii.

### Rolul fișierelor JS

| fișier | rol |
|---|---|
| `main.js` | injectează componentele prin `fetch`, link activ, meniu derulant „Servicii", hamburger, header la scroll, scroll lin cu offset; marchează pe `<body>` clasa `is-touch`, ca să nu rămână conturul de focus după atingere. Emite evenimentul `componente:gata` |
| `animations.js` | reveal la scroll (Intersection Observer, variante direcționale `reveal--left/right/scale/rise`); pauza cascadei din hero; contorizarea cifrelor `data-count-to`; hover pe tab-urile din hero → paleta gradientului; banda de logouri; bara de progres a formularului; butoanele flotante; starea `.is-near` (echivalentul hover pe mobil); chenarul cardului de preț centrat; indiciile de glisare |
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
9. **Firimiturile sunt ascunse vizual** (v2.2.5), dar rămân în DOM prin tehnica
   `visually-hidden` — nu `display: none` — ca să fie citite de cititoarele de
   ecran și de crawlere. `BreadcrumbList` din JSON-LD e neatins.
10. **Tab-urile din hero au fundal propriu închis** (v2.3.0). Text alb simplu
    peste zona lavandă a gradientului dădea sub 2:1 contrast; acum 6,35:1 în
    repaus, 12,74:1 la hover. Pe mobil pastilele sunt compacte, calibrate să
    încapă pe un rând la 320, 360, 393 și 412px — **dacă le mărești fontul sau
    padding-ul, rândul începe să deruleze**.
11. **Textul „Preț clar, termen respectat…" rămâne peste zona portocalie**, deși
    nu trece 4,5:1. Decizie explicită a clientului (21 aug 2026). Nu o redeschide.
12. **Caruselele apar doar sub 768px** — planuri de preț și proiecte. Au nevoie
    de `overflow-y: hidden`, altfel cealaltă axă devine `auto`, apare o bară
    laterală și degetul rămâne prins în ele în loc să deruleze pagina.
13. **`.section` are `overflow-x: clip`** (v2.4.5). Fără el, elementele cu
    `reveal--right` — translatate 32px până sunt dezvăluite — lățesc pagina și
    apare o bară de derulare orizontală care dispare abia la ultimul element.
14. **Conturul de focus nu se afișează după atingere** (v2.5.0). Pe Android
    `:focus-visible` se potrivește și la tap, deci butoanele rămâneau încadrate
    în albastru. `main.js` marchează modul de interacțiune; la prima tastă Tab
    conturul reapare. **Nu scoate conturul cu totul** — e cerință de accesibilitate.
15. **Cifrele care contorizează** pornesc doar când sunt și în ecran, și
    dezvăluite (v2.5.1–2.5.2). Cele vizibile de la încărcare pornesc imediat;
    restul așteaptă derularea. Elementele `.reveal` sunt „în ecran" pentru
    Intersection Observer chiar și la opacitate 0 — de aici venea numărătoarea
    terminată înainte de a fi văzută.
16. **Chenarul-gradient al cardului de preț**: pe desktop la hover, cu culorile
    rotindu-se; pe mobil îl primește cardul centrat în carusel, static, iar până
    la prima glisare stă pe planul din mijloc — cel recomandat.

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
- **Datele firmei sunt completate** în ambele pagini legale, în subsolul fiecărei
  pagini (Legea 365/2002 art. 5) și în JSON-LD: SIGNA STUDIO DEV S.R.L.,
  CUI 55415684, J2026049532007, Str. Petru Poni nr. 13, bl. 573A, et. 2, ap. 10,
  Iași, jud. Iași, 700523.
- **Politica de confidențialitate**, 12 secțiuni, redactată după ANSPDCP, ghidurile
  EDPB și Legea 506/2004: tabel scop/date/temei legal, justificarea interesului
  legitim, caracterul opțional al furnizării, jurnalele serverului, transferuri în
  afara SEE, toate cele 8 drepturi cu articolele lor, datele complete ale ANSPDCP,
  tabel cu cookie-urile, notificarea încălcărilor în 72h, secțiune despre minori.
- **Retragerea consimțământului**: link „Preferințe cookie-uri" în subsol și în
  politică, care redeschide bannerul (art. 7 alin. 3).
- **Formularele sunt identice pe toate paginile** — nume, email, telefon
  (opțional), tip proiect, mesaj — cu bară de progres generată din JS.
- **Nicio pagină nu derulează pe orizontală**, verificat la 320, 360, 393, 412,
  768, 1152, 1366, 1440, 1512 și 1680px.

---

## ❌ Ce a rămas de făcut

### Blocat de date pe care nu le avem
- **Telefonul de contact** — clientul face un număr pe firmă și îl completează
  atunci. Se adaugă în 3 locuri: `contact.html`, JSON-LD, politica de
  confidențialitate.
- **Furnizorul de găzduire** — singurul `[DE COMPLETAT]` rămas, în secțiunea 6
  din politica de confidențialitate (lista persoanelor împuternicite).
- **Logo nou** — clientul îl aduce. Ideal SVG; din el se generează și faviconurile.
  De decis atunci dacă numele afișat în navbar/footer devine „Signa Studio Dev"
  (acum e „Signa Studio").

### Verificări nefăcute
- Test al trimiterii reale de email (necesită host cu PHP și SMTP)
- Fonturile Fontshare față de CSP — se vede **doar pe Apache**, nu local și nici
  pe GitHub Pages, unde `.htaccess` e ignorat

### Curățenie opțională
- `img/hero/hero-gradient-*.webp` (29 KB) nu mai sunt referite de când fundalul
  hero e CSS. Păstrate pentru o eventuală revenire.

---

## 🚀 Înainte de publicare — listă de control

- [ ] `MAIL_TO` și `MAIL_FROM` reale în `php/config.php` (acum: `contact@signastudiodev.ro`)
- [ ] Creează cutia poștală `contact@signastudiodev.ro` la host
- [ ] Completează furnizorul de găzduire în politica de confidențialitate
- [ ] Confirmă `DEV_MODE = false` în `php/config.php` (e deja false)
- [ ] Verifică `mail()` pe host — trimite un mesaj de test
- [ ] Activează HSTS în `.htaccess` **doar după** ce SSL e confirmat funcțional
- [ ] Decomentează redirectările HTTPS și www/non-www în `.htaccess`
- [ ] Dacă activezi Analytics: `ANALYTICS_ID` în `js/cookie.js` **și** domeniile
      Google în CSP (vezi nota din `.htaccess`) — altfel CSP-ul îl blochează
- [ ] Regenerează token-ul Figma (a fost expus în chat) — Settings → Security
- [ ] Trimite `sitemap.xml` în Google Search Console
