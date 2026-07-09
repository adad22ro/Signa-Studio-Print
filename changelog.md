# Changelog

Toate modificările notabile ale site-ului sunt documentate aici.

## v2.0.0 — 2026-07-09 — Redesign complet (direcție nouă: dezvoltare web)
- Site transformat în single-page conform noii poziționări (firmă de dezvoltare web)
- Paletă nouă oklch (albastru + teal pe alb cald) + font sistem, definite ca design tokens compleți în global.css (culori, spațiere 8px, raze, umbre, tranziții, z-index)
- index.html rescris: secțiuni Hero (blob-uri animate) → Cum lucrăm (linie conectoare la scroll) → Servicii (2 carduri) → Despre → Contact
- components.js: header nou (brand + ancore Servicii/Contact + CTA) și footer minimal, single-page
- Secțiunea Contact integrează formularul real (CSRF + php/contact.php păstrate)
- 404.html + error.css aduse la noul design
- Eliminate paginile/CSS/JS/assets vechi (print/portofoliu): site-uri, magazine-online, de-ce-ai-nevoie, proiecte, contact + testimoniale + logo-uri clienți (rămân în istoricul Git)
- sitemap.xml redus la homepage; site.webmanifest actualizat
- Nume „Signa Studio Print" păstrat ca placeholder temporar (se schimbă la decizia numelui)

### De decis / făcut la rebranding
- Nume firmă final → înlocuit în: constanta BRAND (js/components.js), meta/OG/schema din index.html + 404, canonical/URL-uri, php/contact.php (SITE_NAME, CONTACT_EMAIL), site.webmanifest
- Email de contact real (acum contact@signastudioprint.ro placeholder)
- Pagini legale (confidențialitate, termeni) + cookie banner — necesită formă juridică + CUI

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
