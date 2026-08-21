# Changelog

Toate modificările notabile ale site-ului sunt documentate aici.

## v2.4.1 — 2026-08-21 — Datele firmei completate

### Adăugat
- **Datele reale de identificare**, în politica de confidențialitate și în
  termeni și condiții: SIGNA STUDIO DEV S.R.L., CUI 55415684,
  J2026049532007, Str. Petru Poni nr. 13, bl. 573A, et. 2, ap. 10, Iași,
  jud. Iași, 700523. Ambele documente sunt acum valabile juridic.
- **Datele de identificare și în subsolul fiecărei pagini** — Legea 365/2002
  privind comerțul electronic (art. 5) cere ca acestea să fie „ușor, direct și
  permanent accesibile", nu doar îngropate într-o pagină legală.
- **Adresa completă în JSON-LD** (`streetAddress`, `postalCode`, `addressRegion`)
  pe `index.html` și `contact.html`; `name` devine „Signa Studio Dev".

### Rămas de completat
- Numele furnizorului de găzduire, în secțiunea 6 din politică — după achiziție.
- Numărul de telefon — după ce firma va avea unul.

### Modificat
- Cache busting `?v=2.4.0` → `?v=2.4.1` în toate paginile.

## v2.4.0 — 2026-08-21 — Signa Studio Dev + politică GDPR completă

### Modificat
- **Redenumire: Signa Studio Print → Signa Studio Dev**, iar domeniul
  `signastudioprint.ro` → `signastudiodev.ro`. Actualizate: cele 9 pagini
  (title, meta description, Open Graph, canonical, JSON-LD), `sitemap.xml`,
  `site.webmanifest`, `php/config.php`, `php/contact.php`, `js/form.js`,
  antetele din toate fișierele CSS și JS, `CLAUDE.md`, `ERORI.md`.
  Redirectările din `.htaccess` erau deja generice, nu conțineau domeniul.
- Cache busting `?v=2.3.4` → `?v=2.4.0` în toate paginile.

### Adăugat — politica de confidențialitate, rescrisă de la 9 la 12 secțiuni
Documentată pe baza ANSPDCP, a ghidurilor EDPB privind cookie-urile și a
modificărilor aduse Legii 506/2004:
- **Identitatea operatorului** completată cu denumirea legală nouă; rămân de
  completat CUI, numărul din Registrul Comerțului, adresa și furnizorul de găzduire.
- **Mențiune explicită despre DPO** — de ce nu am desemnat unul (art. 37).
- **Tabel scop / date / temei legal**, cu articolele exacte din GDPR.
- **Justificarea interesului legitim** — cerință a art. 13 alin. 1 lit. d.
- **Secțiune nouă: „Este obligatoriu să ne dai aceste date?"** — art. 13 alin. 2 lit. e.
- **Jurnalele serverului**, declarate ca prelucrare separată.
- **Transferuri în afara SEE**, cu temeiul (art. 45–46).
- **Toate cele 8 drepturi**, fiecare cu articolul lui, plus termenul de răspuns
  de o lună și posibilitatea prelungirii cu două.
- **Datele complete de contact ale ANSPDCP** — adresă, telefoane, email, site.
- **Tabel cu cookie-urile** — nume, scop, durată, categorie — și explicația
  modului în care funcționează consimțământul: refuzul la fel de ușor ca
  acceptul, nimic bifat dinainte, navigarea continuă nu înseamnă acord.
- **Notificarea încălcărilor de securitate în 72 de ore** (art. 33–34).
- **Secțiune despre minori.**

### Adăugat — retragerea consimțământului
- Link **„Preferințe cookie-uri"** în subsolul fiecărei pagini și în politică.
  Redeschide bannerul, ca retragerea consimțământului să fie la fel de simplă ca
  acordarea lui — cerință a art. 7 alin. 3 GDPR, care lipsea.
- Stiluri pentru tabelele din paginile legale, cu derulare proprie pe ecran îngust.

## v2.3.4 — 2026-08-21 — Hero-ul mobil revine la forma dinainte

### Eliminat
- **Caruselul de tab-uri din hero, pe mobil** (introdus în v2.3.3): fixarea pe
  centru, culoarea care urma tabul centrat și evidențierea acestuia. Rândul de
  tab-uri revine exact la comportamentul anterior — trei etichete distribuite pe
  un rând, care derulează doar dacă textul nu încape. Decizie de design a
  clientului.
- Indiciul de glisare nu se mai aplică pe rândul de tab-uri; rămâne pe
  caruselele de prețuri și de proiecte.

Restul din v2.3.3 rămâne neschimbat: starea „în centru", caruselul de proiecte,
banda de logouri care răspunde la deget, butonul de trimitere lipit jos.
Pe desktop, hover-ul pe tab-uri care virează gradientul rămâne neatins.

### Modificat
- Cache busting `?v=2.3.3` → `?v=2.3.4` în toate paginile.

## v2.3.3 — 2026-08-21 — Ce era doar pe desktop, adus și pe mobil

### Adăugat
- **Starea „în centru", echivalentul hover-ului pe mobil**: pe ecrane fără
  hover, cardul aflat în banda centrală a ecranului primește `.is-near` și
  aceeași stare pe care desktopul o dă la hover — se ridică, imaginea se
  apropie. Acoperă „Ce ai nevoie?", cardurile din proces și proiectele.
- **Tab-urile din hero devin carusel pe mobil**, cu fixare pe centru; culoarea
  gradientului urmează tabul din centru, iar acesta se evidențiază. Pe desktop
  rămâne hover-ul, neschimbat.
- **Indiciu de glisare** pe orice zonă care derulează orizontal: estompare la
  marginea din dreapta plus eticheta „Glisează pentru mai multe", cu săgeată
  care se leagănă. Ambele dispar definitiv după prima glisare. Se adaugă
  automat, și numai dacă zona chiar are conținut ascuns.
- **Proiectele devin carusel sub 768px**, ca planurile de preț.
- **Banda de logouri răspunde la deget**: se oprește cât timp o atingi, poate fi
  trasă lateral, și repornește la 1,2s după ce ridici degetul.
- **Butonul de trimitere rămâne lipit jos** în formular, pe mobil.
- La trimitere eșuată, primul câmp greșit e adus în centrul ecranului înainte
  de a primi focus — pe mobil putea fi mult deasupra zonei vizibile.

### Modificat
- `.marquee` folosește `overflow-x: auto` în loc de `hidden`, ca banda să poată
  fi trasă cu degetul. Bara de derulare e ascunsă.
- Cache busting `?v=2.3.2` → `?v=2.3.3` în toate paginile.

## v2.3.1 — 2026-08-21 — Bandă de logouri, formulare unificate, zona de jos animată

### Adăugat
- **Banda de logouri se derulează continuu**, de la stânga la dreapta, cu pauză
  la hover și când nu e pe ecran. Setul se dublează **din JS**, nu în HTML: la
  fiecare proiect nou se adaugă un singur `<li>` și bucla se recalculează
  singură. Deplasarea e exact un set plus un spațiu, deci reluarea e invizibilă.
  Copiile sunt `aria-hidden`, ca logourile să nu fie citite de două ori.
- **Animații de la secțiunea „Suntem mai mult decât o agenție" în jos**, pe
  desktop și pe mobil: variante direcționale de reveal (`--left`, `--right`,
  `--scale`, `--rise`), mesajele din chat intră pe rând, punctele din lista
  echipei decalat. La hover: cardurile „Ce ai nevoie?" și cele din proces se
  ridică, imaginile se apropie, imaginea echipei respiră ușor.

### Modificat
- **Formularele sunt identice pe toate paginile.** Cel scurt (nume, email,
  mesaj) a fost înlocuit peste tot cu varianta completă de pe pagina de contact:
  nume, email, telefon (opțional), tip proiect, mesaj. Documentația de
  specialitate recomandă 3–5 câmpuri, coloană unică, cu un câmp de calificare —
  exact structura asta. Backend-ul accepta deja `phone` și `service`.
- **Imaginea proiectului duce la site-ul live**, nu doar linkul de sub ea.
  Pe `index.html`, „Vezi pagina live" ducea la `proiecte.html`, deși eticheta
  promitea altceva — acum duce la site-ul real, ca pe pagina de proiecte.
- **Footer: LinkedIn → TikTok.**
- Logourile din bandă nu mai sunt `loading="lazy"`: lățimea lor reală trebuie
  cunoscută ca să se poată calcula bucla.
- Cache busting `?v=2.3.0` → `?v=2.3.2` în toate paginile.

## v2.3.0 — 2026-08-21 — Tab-urile din hero: lizibile și reactive

### Adăugat
- **Hover pe tab virează gradientul** spre culoarea serviciului — albastru
  pentru site-uri, verde pentru magazine, ambră pentru aplicații — printr-o
  tranziție reală între culori, pe 900ms. Funcționează fiindcă variabilele
  gradientului sunt înregistrate cu `@property`. Merge și din tastatură (focus).
  Cascada de 6s rămâne, cele două animații se suprapun fără să se încurce.

### Reparat
- **Tab-ul din dreapta era ilizibil.** Text alb simplu peste un gradient care
  ajunge la lavandă deschisă înseamnă sub 2:1 contrast. Fiecare tab are acum
  fundal propriu închis translucid cu blur: **6,35:1 în repaus, 12,74:1 la
  hover**, indiferent de zona pe care cade. Cerința din instrucțiuni e 4,5:1.

### Modificat
- Animația titlului din hero, **doar pe desktop**: 1500ms → 2300ms, decalajul
  dintre jumătăți 180ms → 280ms. Titlul e mult mai mare pe desktop, deci
  parcurge mai multă distanță — la aceeași durată părea grăbit. Pe mobil
  rămâne 1500ms.
- Cache busting `?v=2.2.9` → `?v=2.3.0` în toate paginile.

## v2.2.9 — 2026-08-21 — Mobil interactiv, header cu adevărat fix

### Reparat
- **Header-ul nu rămânea sus la derulare.** Era `position: sticky`, dar stătea
  în `#navbar-placeholder`, un `div` înalt exact cât header-ul — iar un element
  sticky se lipește doar cât timp părintele lui e pe ecran. Placeholderul a
  primit `display: contents`, deci cutia părinte dispare și header-ul se
  raportează la `<body>`. Afecta toate paginile, pe desktop și pe mobil.

### Adăugat
- **Feedback la atingere** (`@media (hover: none)`): butoanele și cardurile se
  afundă la apăsare, cu revenire elastică. Zonele de atingere au minimum 44px.
- **Meniul mobil**: intrările cad decalat la 50ms una de alta.
- **Planurile de preț devin carusel sub 768px**, cu `scroll-snap`. Cardul
  următor se vede parțial, ca să fie clar că se poate glisa. Zero JS.
- **Bara de progres a formularului** (desktop și mobil): arată câte câmpuri
  obligatorii sunt completate. Marcajul e generat din JS — e decorativ, deci
  n-are ce căuta în HTML-ul fiecărei pagini.
- **Butoane flotante**: „Înapoi sus" și „Cere ofertă", ambele apărând după
  ieșirea din hero. CTA-ul dispare când formularul e pe ecran și lipsește de
  tot pe pagina de contact. Vizibilitatea vine din Intersection Observer,
  fără ascultare de scroll. Butonul „sus" mută și focusul la începutul
  conținutului, altfel navigarea cu tastatura ar continua de jos.
- Header-ul se compactează la derulare (64px → 54px) și devine translucid.

### Modificat
- Contorizarea cifrelor pornește la 25% vizibilitate pe mobil, față de 60% pe
  desktop — pe ecran îngust un element înalt nu ajunge ușor la 60%.
- Titlul din hero: animația de intrare 900ms → 1500ms, deplasare 7% → 22%,
  decalaj între jumătăți 90ms → 180ms. Era prea rapidă ca să se observe.
  Titlul a primit `overflow: clip`, altfel jumătățile ar lărgi pagina.
- Cât timp banner-ul de cookie-uri e vizibil, butoanele flotante stau ascunse —
  ocupă același colț.
- Cache busting `?v=2.2.7` → `?v=2.2.9` în toate paginile.

## v2.2.7 — 2026-08-21 — Interacțiune pe tot site-ul

### Adăugat
- **Cifre care contorizează** (`js/animations.js`): valorile din secțiunea de
  statistici urcă de la 0 când intră în ecran, o singură dată. Textul din HTML
  e deja valoarea finală, deci fără JS sau cu `prefers-reduced-motion` se vede
  corect. `tabular-nums` ține lățimea fixă, ca numărul să nu tremure.
- **Pagina de contact** avea doar două elemente animate; acum hero-ul și fiecare
  câmp de formular intră decalat, iar eticheta câmpului activ se colorează
  (prin `:has()`, cu degradare curată unde nu e suportat).
- **Cardurile de preț**: ridicare la hover, muchie de sus cu gradientul-semnătură,
  prețul crește ușor. Reacționează și la `:focus-within`, deci și din tastatură.
- **Butonul închis** primește un strat de gradient care se aprinde la hover
  (opacitatea unui pseudo-element — gradienții nu se pot tranziționa direct).
- **Cardurile de proiect**: imaginea se apropie lent într-un container care taie,
  titlul urcă, linia de sub link se îngroașă.
- **Titlul „Signa / Studio"** intră din margini opuse la încărcare. Doar
  `transform` — e elementul LCP, iar o animație de opacitate ar amâna măsurătoarea.
- **Meniul „Servicii"**: intrările apar decalat la 40ms una de alta.

### Modificat
- `.project__link` nu mai are `text-decoration`; linia vine dintr-un
  pseudo-element, vizibil și în repaus la opacitate redusă.
- Cache busting `?v=2.2.6` → `?v=2.2.7` în toate paginile.

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
