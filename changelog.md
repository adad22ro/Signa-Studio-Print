# Changelog

Toate modificările notabile ale site-ului sunt documentate aici.

## v2.2.6 — 2026-08-21 — Hero animat, fundal construit în CSS

### Adăugat
- **Cascadă de culoare în hero**: un gradient repetitiv cu culorile-semnătură
  traversează panoul de la stânga la dreapta, în buclă de 6 secunde. Motivul se
  repetă, deci bucla nu are salt vizibil. Se animă exclusiv `transform`, deci
  rularea e pe compozitor, fără repaint.
- Animația stă **pe pauză cât timp hero-ul nu e pe ecran**, prin Intersection
  Observer în `js/animations.js` (`.hero__flow.is-paused`).
- `prefers-reduced-motion: reduce` oprește animația și lasă stratul static.

### Modificat
- **Fundalul hero nu mai e imagine, ci gradient CSS.** `img/hero/hero-gradient-*.webp`
  și preload-ul aferent au dispărut din `index.html`; în locul lor, `.hero__bg`.
  Motivul e funcțional, nu de dimensiune: culorile dintr-un gradient CSS pot fi
  animate individual, pixelii dintr-o imagine nu. Efect secundar: o cerere de
  rețea mai puțin înainte de LCP, care devine textul.
- Culorile fundalului și ale gradientului-semnătură sunt acum variabile în
  `variables.css` (`--hero-c1`…`--hero-c6`, `--grad-1`…`--grad-5`), declarate
  **de două ori**: o dată în `:root` și o dată cu `@property`. Prima declarație
  ține fundalul corect în browserele fără `@property`; a doua le dă tip, ca
  browserul să le poată interpola.
- Cache busting `?v=2.2.5` → `?v=2.2.6` în toate paginile.

### Rămas de făcut
- `img/hero/hero-gradient-*.webp` (29 KB) nu mai sunt referite nicăieri. Sunt
  păstrate deocamdată, ca revenirea la fundalul-imagine să fie posibilă.

## v2.2.5 — 2026-08-20 — Firimiturile ascunse vizual

### Modificat
- **Firimiturile („Acasă / …")** nu se mai afișează pe nicio pagină. Sunt
  ascunse vizual prin tehnica `visually-hidden` (poziționare + `clip-path`),
  **nu** cu `display: none` — rămân în DOM, citibile de cititoarele de ecran și
  de motoarele de căutare, alături de `BreadcrumbList` din JSON-LD.
  Afectate: `css/servicii.css` (SP / MO / AC / proiecte / contact) și
  `css/legal.css` (cele două pagini legale).
- Cache busting `?v=2.2.4` → `?v=2.2.5` în toate paginile.

## v2.2.4 — 2026-08-20 — Eliminat linkul „Despre"

### Eliminat
- Linkul **„Despre"** din navbar (desktop + meniu mobil) și din footer. Trimitea
  spre `index.html#despre`, deci din paginile interioare arunca vizitatorul
  înapoi pe pagina principală, cu derulare, către conținut fără informații
  relevante. Abatere conștientă de la Figma, la cererea clientului.
- Secțiunea `#despre` din `index.html` rămâne pe loc — doar navigația către ea a
  fost scoasă.

### Modificat
- Cache busting `?v=2.2.3` → `?v=2.2.4` în toate paginile.

## v2.2.3 — 2026-08-20 — Paginile de serviciu accesibile din navbar

### Adăugat
- **Meniu derulant sub „Servicii"** în navbar, cu cele trei pagini de serviciu
  (site-uri de prezentare, magazine online, aplicații custom) plus link către
  secțiunea completă. Navbarul în repaus rămâne identic cu designul Figma —
  meniul apare doar la interacțiune.
- Accesibilitate: `aria-expanded`, `aria-haspopup`, `aria-controls`, deschidere
  cu săgeata jos, închidere cu Escape (cu revenirea focusului pe buton),
  la click în afară și la ieșirea focusului prin Tab.
- Pagina curentă e marcată atât în submeniu, cât și pe butonul „Servicii".
- **Meniul mobil** listează direct paginile de serviciu, sub un titlu „Servicii".

### Corectat
- **Bannerul de cookie-uri acoperea meniul mobil deschis** (z-index 80 vs 60),
  ascunzând ultimele intrări de navigație. Acum se ascunde instant cât timp
  meniul e deschis.

### Notă
Designul Figma are 4 intrări în navbar și niciun submeniu, dar paginile de
serviciu nu erau accesibile din nicio pagină interioară. Meniul derulant e
soluția care rezolvă navigația fără să schimbe aspectul din design.

## v2.2.0 — 2026-08-20 — Reconstrucție completă pe designul Figma

### Pagini reconstruite (toate pe designul nou)
- `site-uri.html` — hero, cifre, comparație „de ce cod curat și nu WordPress",
  tabel de prețuri (3 planuri), formular
- `magazine-online.html` — hero, „Cum alegi?" (2 platforme), „Ce primești"
  (bandă închisă cu 6 beneficii), prețuri, formular
- `proiecte.html` — portofoliu cu 2 proiecte reale, CTA, formular
- `contact.html` — hero, formular complet, date de contact directe
- `404.html` — reconstruită în stilul nou, cu gradientul-semnătură

### Adăugat
- **Cookie banner GDPR**: `components/cookie-banner.html` + `js/cookie.js`.
  Nu se încarcă niciun script de urmărire înainte de acceptul explicit;
  la refuz nu se încarcă nimic. Alegerea se reține în `localStorage`.
- `css/servicii.css` — stiluri comune paginilor de serviciu
- Politica de confidențialitate — secțiunea despre cookie-uri aliniată la
  implementarea reală

### Corectat
- **`.htaccess`: CSP-ul permitea doar Google Fonts, nu și Fontshare** — ar fi
  blocat toate fonturile în producție. Corectat la `api.fontshare.com` +
  `cdn.fontshare.com`; Google Fonts eliminat (nicio pagină nu îl mai folosește).
- `.htaccess`: adăugate `Cache-Control: immutable` pe resurse versionate și
  blocarea accesului direct la `php/config.php`
- **Prețurile magazinelor**: aliniate la valorile reale din Figma
  (2.500 / 5.000 lei). Descrierile și listele de opțiuni din Figma erau copiate
  din pagina de site-uri și nespecifice magazinelor — rescrise.
- Titluri și meta descrieri aduse în limitele SEO (60 / 155 caractere)
- Cache busting normalizat la `?v=2.2.0` pe toate paginile

### Eliminat
- `css/global.css`, `css/error.css`, `js/components.js`, `js/contact.js`
  — ultimele fișiere ale designului v2.0.0, nemaifolosite de nicio pagină

### ⚠️ De completat înainte de publicare
- Datele firmei în paginile legale (marcaje `[DE COMPLETAT]`)
- `MAIL_TO` / `MAIL_FROM` în `php/config.php`, `DEV_MODE = false`
- HSTS și redirectările HTTPS/www în `.htaccess` — **doar după SSL**
- Dacă activezi Analytics: `ANALYTICS_ID` în `js/cookie.js` **și** domeniile
  Google în CSP (vezi nota din `.htaccess`)

## v2.1.0 — 2026-08-18 — Reconstrucție pe designul Figma (în lucru)

### Sistem de design nou, extras din Figma
- `css/variables.css` — tokeni din fișierul Figma „Signa Studio Design":
  paletă (temă light, `#FFFFFF` fundal, `#101010` text, suprafețe închise
  `#0A0A0A`/`#101010`/`#141414`, accente `#278CFF`/`#1EFB26`/`#E9591C`),
  scală tipografică, spațiere pe 8px, raze, umbre, tranziții, z-index
- `css/reset.css`, `css/base.css`, `css/components.css`, `css/responsive.css`
  — structura cerută de instrucțiuni; breakpoints 1024/768/640/480
- Fonturi noi: **Satoshi** + **Cabinet Grotesk** de la Fontshare
  (gratuite comercial), înlocuiesc Space Grotesk + Inter

### Componente partajate
- `components/navbar.html` și `components/footer.html` — fișiere HTML reale,
  injectate prin `fetch()` din `js/main.js` (înainte erau string-uri în JS)
- `js/main.js` — injectare componente, link activ, hamburger, meniu mobil,
  header la scroll, scroll lin cu offset = înălțimea header-ului
- `js/animations.js` — animații la scroll exclusiv prin Intersection Observer

### Pagina principală
- Hero reconstruit: titlu „Signa / Studio", panou cu gradient, tab-uri servicii,
  chip-uri, tagline cu Cabinet Grotesk bold + Satoshi Light Italic (conform
  `styleOverrideTable` din Figma), două butoane, linie de stack tehnologic
- Secțiunea Servicii: 4 rânduri cu titlu, descriere, chip-uri și buton
- Imagine hero: PNG 3.3 MB → WebP în 4 dimensiuni (2.4–14 KB), cu `srcset`,
  `loading="eager"` și `fetchpriority="high"`

### Backend
- `php/config.php` separat, cu `if (!defined('APP')) die();`
- Whitelist pe tipul de serviciu; rate limiting numără doar trimiterile reușite

### Pagini noi
- `aplicatii-custom.html` — pagină nouă, construită după frame-ul Figma 1:1668:
  hero, argumente scurte, „Îți este potrivit?" (bandă închisă), „Ce construim",
  secțiune de preț și formular de contact
- `politica-confidentialitate.html` și `termeni-conditii.html` — cerință GDPR;
  **conțin marcaje `[DE COMPLETAT]`** pentru datele de identificare ale firmei
  (denumire legală, CUI, adresă), care trebuie completate înainte de publicare
- `css/servicii.css` — stiluri comune paginilor de serviciu
- `css/legal.css` — stiluri pentru paginile legale

### Eliminat
- `de-ce-ai-nevoie.html` — nu există în designul Figma (decizie confirmată);
  eliminate și referințele din `js/components.js` și `sitemap.xml`

### Modificat
- `sitemap.xml` — adăugat `aplicatii-custom.html`
- `js/components.js` (navbar vechi) — adăugat link către pagina nouă, ca să fie
  accesibilă din paginile încă nereconstruite

### În lucru — pagini încă pe designul v2.0.0
`site-uri.html`, `magazine-online.html`, `proiecte.html`, `contact.html`, `404.html`

## v2.0.0 — 2026-07-09 — Redesign vizual complet (temă nouă)
- Temă nouă aplicată pe TOT site-ul (multi-page păstrat): paletă caldă albastru+teal (oklch), carduri cu contur + umbră solidă, highlight-uri, acordeon, fonturi Space Grotesk + Inter
- Design system partajat în css/global.css (tokens, header/footer, butoane, carduri, pachete, comparație, timeline, formular, proiecte) + js/components.js (header/footer multi-page, meniu, acordeon, reveal)
- Layout full-bleed: container 1600px + spațiere laterală fluidă, footer edge-to-edge
- Toate paginile reconstruite în temă: index, de-ce-ai-nevoie, site-uri, magazine-online, proiecte, contact, 404
- proiecte.html trecut pe galerie statică (2 proiecte reale) în locul mecanismului JSON/JS
- Formularul de contact păstrat funcțional (CSRF + php/contact.php), restilizat
- Nume „Signa Studio Print" păstrat ca placeholder — se schimbă în BRAND (components.js) + meta/schema + php la rebranding
- Eliminate fișierele vechi de design (css/js per-pagină) și variantele de comparație

## v1.0.0 — 2026-07-09
- Eliminat toate stilurile inline (hero index, secțiune prețuri magazine) → clase CSS
- Corectat sitemap.xml (elimină pagini inexistente din vechiul brand, adaugă paginile reale)
- Adăugat `.htaccess` complet: securitate (headers + CSP), GZIP, cache browser, ErrorDocument 404, blocare listare directoare. HSTS și redirect HTTPS pregătite, comentate (se activează după SSL)
- Adăugat `php/contact.php`: honeypot, token CSRF, rate limiting (5/oră/IP), sanitizare, validare server-side, mail() multipart, răspuns JSON
- Protejat `php/tmp/` (rate limiting) prin `.htaccess` dedicat
- Formular contact: token CSRF ascuns + trimitere reală prin fetch(), cu fallback pe simulare cât timp nu există backend PHP
- Cache busting `?v=1.0.0` pe toate fișierele CSS și JS

### De făcut la mutarea pe host (Apache + PHP)
- Decomentează HSTS și redirectul HTTPS/www în `.htaccess` DUPĂ ce SSL e activ
- Verifică că `mail()` trimite corect către adresa din `php/contact.php`
- Setează adresa reală în constanta `CONTACT_EMAIL` din `php/contact.php`

### În așteptarea rebrandingului
- Pagini legale (politica de confidențialitate, termeni) — necesită denumire legală + CUI
- Cookie banner + activare Google Analytics
- Actualizare denumire brand, meta tags, logo, opțiuni formular (încă orientate spre grafică/print)
- Ștergere pagină orfană `explorare-lista.html` (scratch, nelegată, conține `<style>` inline)
