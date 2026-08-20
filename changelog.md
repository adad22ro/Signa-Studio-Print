# Changelog

Toate modificările notabile ale site-ului sunt documentate aici.

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
