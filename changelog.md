# Changelog

Toate modificările notabile ale site-ului sunt documentate aici.

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

### În lucru — pagini încă pe designul v2.0.0
`site-uri.html`, `magazine-online.html`, `proiecte.html`, `contact.html`, `404.html`
Pagina nouă `aplicatii-custom.html` nu există încă (frame Figma 1:1668).

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
