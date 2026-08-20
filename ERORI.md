# Jurnal de erori — Signa Studio Print

> **Citește acest fișier ÎNAINTE de a depana orice eroare.** Multe probleme
> întâlnite aici sunt specifice acestui calculator (Windows + Git Bash + XAMPP)
> și s-ar repeta identic. Caută mesajul de eroare cu Ctrl+F.
>
> Când rezolvi o eroare nouă, adaug-o aici cu: simptom exact → cauză → soluție →
> cum se previne. Fără intrări teoretice: doar erori care chiar s-au întâmplat.

---

## 1. Unelte și mediu (Windows / Git Bash)

### 1.1 `convert` nu este ImageMagick
```
Invalid drive specification.
Invalid Parameter - /hero
```
**Cauză:** Pe Windows, `convert` este utilitarul de sistem care transformă
FAT în NTFS, nu ImageMagick. `command -v convert` îl găsește și induce în eroare.

**Soluție:** Pentru procesare de imagini se folosește `sharp`, instalat **în
scratchpad**, nu în proiect (site-ul nu are build tools):
```bash
cd "$SCRATCHPAD" && npm init -y && npm install sharp
node -e 'require("sharp")("in.png").resize(1200).webp({quality:80}).toFile("out.webp")'
```
**Prevenție:** Nu presupune că `convert`, `magick` sau `cwebp` există. Verifică
întâi cu o comandă reală, nu doar cu `command -v`.

---

### 1.2 Chrome headless: „Access is denied" la screenshot
```
ERROR:headless_command_handler.cc:266] Failed to write file home-desktop.png:
Access is denied. (0x5)
```
**Cauză:** Chrome e o aplicație Windows și nu înțelege căile în stil Git Bash
(`/c/Users/...`). Calea relativă se rezolvă greșit.

**Soluție:** Pasează o cale **absolută în stil Windows** la `--screenshot`:
```bash
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
OUT='C:\cale\completa\catre\screenshot.png'
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --window-size=1440,900 --virtual-time-budget=7000 \
  --screenshot="$OUT" http://127.0.0.1:8899/
```
**Prevenție:** Orice executabil Windows apelat din Git Bash primește căi
Windows (`C:\...`), nu POSIX.

---

### 1.3 Python: UnicodeEncodeError la afișarea diacriticelor
```
UnicodeEncodeError: 'charmap' codec can't encode character '\u021b'
  File "C:\Python314\Lib\encodings\cp1252.py"
```
**Cauză:** Consola Windows folosește cp1252. Eroarea apare **doar la `print()`**,
nu la scrierea în fișier — fișierul se scrie corect chiar dacă scriptul crapă după.

**Soluție:** Nu tipări text cu diacritice în consolă. Verifică rezultatul cu
`grep` pe fișier, sau tipărește doar markeri ASCII:
```python
open(p,'w',encoding='utf-8',newline='').write(s)
print('OK')          # nu print(continut_cu_diacritice)
```
**Prevenție:** Scrie mereu fișierele cu `encoding='utf-8'` explicit și
`newline=''` (altfel Python dublează CRLF pe Windows).

---

### 1.4 Bash heredoc crapă pe conținut cu caractere speciale
```
/usr/bin/bash: -c: line 68: unexpected EOF while looking for matching `''
```
**Cauză:** Fișiere lungi cu ghilimele, backtick-uri, `$`, paranteze și diacritice
amestecate rup parsarea heredoc-ului, chiar și cu delimitator între ghilimele.

**Soluție:** Pentru fișiere mari sau cu multe caractere speciale folosește
unealta **Write**, nu heredoc. Heredoc-ul rămâne bun pentru fișiere scurte
și simple (`.htaccess`, `robots.txt`).

---

### 1.5 `require('sharp/package.json')` eșuează
```
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './package.json'
is not defined by "exports"
```
**Cauză:** Pachetele moderne restricționează ce subcăi pot fi importate.
Nu înseamnă că pachetul e stricat.

**Soluție:** Importă doar pachetul (`require('sharp')`). Nu-i citi `package.json`.

---

### 1.6 `php` nu e în PATH
**Cauză:** PHP nu e instalat global, dar XAMPP e prezent.

**Soluție:** Folosește calea completă:
```bash
/c/xampp/php/php.exe -l php/contact.php        # verificare sintaxă
/c/xampp/php/php.exe -S 127.0.0.1:8899 -t .    # server local
```
**Prevenție:** Nu scrie validatoare proprii de sintaxă PHP — vezi eroarea 1.7.

---

### 1.7 Validator PHP scris de mână — regex invalid
```
re.PatternError: unterminated character set at position 5
```
**Cauză:** Am încercat să verific echilibrul acoladelor în PHP cu regex, după ce
`php` părea indisponibil. Regexurile pentru „șiruri și comentarii PHP" sunt
fragile și greșite.

**Soluție:** Caută un PHP real pe sistem înainte (XAMPP, Laragon, WAMP):
```bash
ls -d /c/xampp /c/laragon /c/wamp64 2>/dev/null
```
**Prevenție:** Nu reimplementa un parser când există unealta oficială.

---

### 1.8 `curl` iese cu codul 23
**Cauză:** Combinația `-o /dev/stdout` cu `-w` produce o eroare de scriere.
**Efect:** Niciunul — cererea a reușit, doar codul de ieșire e diferit de 0.
**Soluție:** Ignoră, sau nu combina `-o /dev/stdout` cu `-w`.

---

### 1.9 `/tmp` diferă între Git Bash și Python-ul de Windows
```
FileNotFoundError: [Errno 2] No such file or directory: '/tmp/imgresp.json'
```
**Cauză:** `curl` rulează în Git Bash și scrie în `/tmp` (mapat de Git Bash),
dar Python este binarul de Windows și interpretează `/tmp` ca o cale absolută
inexistentă pe disc. Fișierul chiar există — doar că fiecare unealtă vede
alt loc.

**Soluție:** Când combini unelte Git Bash cu unelte Windows (Python, Chrome,
PHP din XAMPP), folosește o cale absolută explicită pentru fișierele
intermediare — de exemplu directorul de scratchpad:
```bash
SP="c:/Users/.../scratchpad"
curl -s ... -o "$SP/raspuns.json"
python -c "json.load(open(r'c:/Users/.../scratchpad/raspuns.json'))"
```
**Prevenție:** Aceeași cauză ca eroarea 1.2 (Chrome). Regulă generală:
**niciun fișier partajat între Git Bash și un binar Windows nu se pune în `/tmp`.**

---

### 1.10 Chrome headless nu poate randa sub 500px pe Windows — screenshot înșelător
**Simptom:** La `--window-size=393,2400`, screenshotul (393px lățime) arăta text
tăiat la marginea dreaptă în toată pagina. Părea o depășire gravă pe orizontală.

**Cauză:** Windows impune o lățime minimă de fereastră. Verificat direct:
```
--window-size=393  →  innerWidth=500   (!)
--window-size=1440 →  innerWidth=1424  (16px = bara de derulare)
```
Layout-ul se calculează la **500px**, iar imaginea e doar **decupată** la 393.
Textul „tăiat" era artefact al capturii, nu o problemă reală de CSS.

**Soluție — previzualizare mobilă corectă, prin iframe:**
```html
<!-- _mobil.html, temporar în rădăcina proiectului -->
<style>html,body{margin:0}iframe{width:393px;height:2600px;border:0;display:block}</style>
<iframe src="index.html" scrolling="no"></iframe>
```
```bash
chrome --headless --hide-scrollbars --window-size=600,2600   --screenshot="C:\...\mobil.png" http://127.0.0.1:8899/_mobil.html
# decupezi apoi primii 393px pe orizontală — sunt 393px REALI
```

**Măsurare programatică** (mai sigură decât ochiul), tot prin iframe:
```js
d.documentElement.scrollWidth          // depășire la nivel de document
el.scrollWidth > el.clientWidth        // text tăiat în interiorul unui container
```
Atenție: iframe-ul fără `scrolling="no"` își rezervă ~15px pentru bara de
derulare, deci raportează 378 în loc de 393.

**Prevenție:** Nu diagnostica probleme de responsive din screenshot-uri făcute cu
`--window-size` sub 500px. Măsoară întâi, apoi corectează.
**Notă:** din cauza acestei capcane am adăugat corecții de responsive care nu
rezolvau un bug real (rămân în cod — sunt îmbunătățiri valide, dar nu erau necesare).

---

### 1.11 `--virtual-time-budget` îngheață tranzițiile CSS — măsurători false
**Simptom:** `getComputedStyle()` raporta `visibility: hidden` și `opacity: 0`
pentru un meniu care în screenshot apărea perfect vizibil. Invers, o regulă
`opacity: 0` corectă raporta `opacity: 1` chiar și după 1200 ms de așteptare.

**Cauză:** `--virtual-time-budget` derulează rapid `setTimeout`-urile, dar
**nu avansează tranzițiile CSS** (rulate de compozitor). Proprietatea rămâne
înghețată la valoarea de dinaintea tranziției, oricât aștepți în timp virtual.

**Cum recunoști:** regula se potrivește (`el.matches(selector) === true`),
apare în `cssRules`, nu există conflicte — dar `getComputedStyle` arată altceva.
Am verificat exhaustiv, inclusiv scanând toate foile de stil pentru reguli
concurente: era una singură, corectă.

**Soluții:**
1. **Verifică vizual prin screenshot** — singura sursă de adevăr pentru orice
   proprietate animată sau tranziționată.
2. Pentru verificări programatice, testează proprietăți **fără tranziție**
   (`pointer-events`, `display`) — acelea se aplică instant și dovedesc că
   blocul de reguli e activ.
3. Dacă proprietatea chiar trebuie măsurată, elimină tranziția pentru ea:
```css
body.has-menu-open .cookie { visibility: hidden; opacity: 0; transition: none; }
```

**Prevenție:** Nu concluziona că o regulă CSS „nu se aplică" pe baza
`getComputedStyle` în headless. Confirmă cu un screenshot înainte de a
rescrie CSS care era corect de la început.

---

## 2. Git

### 2.1 Push respins — „fetch first"
```
! [rejected]  main -> main (fetch first)
Updates were rejected because the remote contains work that you do not have locally
```
**Cauză reală (18 aug 2026):** Folderul local era **în urmă cu 4 commit-uri**.
Munca din iulie fusese făcută prin aplicația web Claude (fără acces la git) și
commis manual, iar copia locală rămăsese la starea din iunie. `gh repo view`
raporta `pushedAt` vechi, ceea ce m-a indus în eroare.

**Consecință:** Am refăcut din greșeală o zi de muncă deja existentă pe remote.

**Soluție:** **NU face `git push --force`** — ar șterge munca de pe server.
```bash
git fetch origin
git log --oneline HEAD..origin/main      # ce e pe remote și nu am
git log --oneline origin/main..HEAD      # ce am și nu e pe remote
git branch backup/sesiune-AAAA-LL-ZZ     # plasă de siguranță
git reset --hard origin/main             # abia apoi aliniere
git checkout backup/... -- fisier.php    # recuperezi selectiv ce merita
```
**Prevenție — REGULĂ:** La **începutul fiecărei sesiuni**, rulează `git fetch`
și compară cu remote înainte de a presupune orice despre starea proiectului.
Nu te baza pe `pushedAt` din `gh repo view`.

---

## 3. Analiza designului Figma

### 3.1 Tema identificată greșit ca „dark" — de fapt e light
**Simptom:** Am raportat că designul e dark theme pe baza faptului că `#101010`
apărea de 629 de ori, mai des decât orice altă culoare.

**Cauză:** Am numărat toate `fills`-urile la un loc. Pe un nod de tip `TEXT`,
`fills` este **culoarea textului**, nu a fundalului. `#101010` era culoarea
textului în 460 de noduri. Toate cele 12 frame-uri au fundal `#FFFFFF`.

**Soluție:** Separă nodurile TEXT de restul și cântărește fundalurile după
**suprafață**, nu după frecvență:
```js
if (n.type === "TEXT") textColors[hex] = ...
else bgArea[hex] = (bgArea[hex]||0) + (b.width * b.height);
```
Rezultat corect: `#FFFFFF` 58.7M px² față de `#000000` 10.9M px².

**Prevenție:** Verifică mereu `fills` pe frame-ul rădăcină al paginii
(`document.children[0].children[*].fills`) înainte de a declara tema.

---

### 3.2 Extragere superficială — detalii pierdute
**Simptom:** Hero-ul construit din date extrase la adâncime 3 a ieșit incomplet:
lipseau două chip-uri, un buton, textul complet și stilurile mixte din tagline.

**Cauză:** Extractorul rula cu `depth=3`; conținutul real era la nivelurile 4–7.

**Soluție:**
1. Extrage la adâncime 6–7 pentru secțiunile pe care le construiești
2. **Compară obligatoriu cu un screenshot real** din Figma înainte de a declara
   o secțiune terminată (`get_screenshot` prin MCP)

**Prevenție:** Nicio secțiune nu e „gata" fără comparație vizuală cu Figma.

---

### 3.3 Text cu stiluri mixte în același nod
**Simptom:** Tagline-ul apărea uniform, dar în Figma alterna bold cu italic.

**Cauză:** Figma păstrează stilurile pe segmente în `styleOverrideTable` +
`characterStyleOverrides`. Extractorul citea doar `node.style` (stilul de bază).

**Soluție:** Verifică segmentarea:
```js
const cs = t.characterStyleOverrides || [];
for (const [k,v] of Object.entries(t.styleOverrideTable))
  console.log(k, v.fontFamily, v.fontWeight, v.italic);
```
Rezultat: „Site-ul tău," = Cabinet Grotesk 700; „fără bătăi de cap." =
Satoshi 300 **italic**. Se traduce în `<strong>` + `<em>` cu reguli CSS separate.

---

### 3.4 Fontshare — italicele au coduri impare
**Cauză:** Designul cerea Satoshi 300 Italic, dar `satoshi@300` livrează doar
varianta normală.

**Soluție:** La Fontshare, italicul este weight-ul **+1**:
```
satoshi@300,301,400,500,700,900     # 301 = 300 italic
```
Verificare rapidă a variantelor disponibile:
```bash
curl -s "https://api.fontshare.com/v2/css?f[]=satoshi@300,301,400,401" \
  | grep -E "font-weight|font-style" | paste - - | sort -u
```

---

### 3.5 Figma MCP — doar 20 apeluri pe LUNĂ
**Cauză:** Contul e pe plan **Starter** cu seat Full. Limita e lunară, nu zilnică.

**Soluție:** Pentru **date** folosește REST API (gratuit, limite generoase):
```bash
TOKEN=$(cat "$HOME/.figma-token")
curl -s -H "X-Figma-Token: $TOKEN" \
  "https://api.figma.com/v1/files/x4XGqHY7qNJFLYbyxZG89d/nodes?ids=1:439"
```
Rezervă apelurile MCP **exclusiv** pentru `get_screenshot` la verificarea vizuală.

**Notă:** `/v1/variables/local` este Enterprise-only — nu funcționează pe Starter.
Valorile rezolvate se citesc oricum din JSON-ul nodurilor.

---

### 3.6 Figma REST — rate limit pe randarea de imagini
```
{"status":429,"err":"Rate limit exceeded"}
```
**Cauză:** Endpoint-ul `/v1/images` randează noduri pe serverele Figma și este
limitat separat de `/v1/files`. Câteva zeci de exporturi consecutive îl declanșează.

**Soluție:** Nu exporta ce poți reproduce în CSS. Elipsele difuze, gradienții
liniari/radiali și formele simple se fac cu `radial-gradient` / `linear-gradient`
— zero bytes, scalare perfectă, nicio dependență de API:
```css
background:
  radial-gradient(60% 50% at 20% 30%, rgba(39,140,255,.18), transparent 70%),
  var(--c-dark);
```
Exportă doar compozițiile complexe (mockup-uri, ilustrații cu multe straturi).

**Prevenție:** Grupează exporturile într-un singur apel (`ids=1:1,1:2,1:3`) și
lasă pauze între ele. Citirea structurii (`/v1/files`) nu e afectată.

---

## 4. Erori de cod (găsite și corectate)

### 4.1 `.htaccess` ar fi blocat `projects.json`
**Simptom potențial:** Galeria de proiecte ar fi murit pe tot site-ul.

**Cauză:** Regula de blocare a fișierelor sensibile includea extensia `json`:
```apache
<FilesMatch "(^\.|\.(md|json|log|ini|sh|bak|sql|yml|yaml)$|...)">
```
Adăugasem un bloc de excepție ulterior, dar depindea de ordinea de suprascriere
din Apache — fragil.

**Soluție:** Scoate `json` din lista blocată. Singurul `.json` din proiect este
`projects.json`, care **trebuie** servit. Nu te baza pe ordinea directivelor.

**Prevenție:** După orice regulă de blocare în `.htaccess`, testează efectiv
că fișierele necesare încă se servesc:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:8899/projects.json
```

---

### 4.2 Rate limiting bloca utilizatorii care greșeau la validare
**Simptom:** După 5 încercări cu email greșit, utilizatorul primea 429 și era
blocat o oră — fără să fi trimis vreun mesaj.

**Cauză:** Contorul se incrementa înainte de validare, deci numărau și eșecurile.

**Soluție:** Separă verificarea de înregistrare. Verifici înainte de procesare,
dar înregistrezi **doar după `mail()` reușit**:
```php
if (!rate_limit_ok($ip)) { http_response_code(429); ... }   // doar citește
// ... validare, trimitere ...
rate_limit_record($ip);                                      // abia acum scrie
```
**Verificat:** 8 încercări invalide → toate 422, niciun fișier de limită creat.

---

### 4.3 Două linkuri active simultan în navbar
**Simptom:** „Servicii" și „Despre" apăreau ambele subliniate pe pagina principală.

**Cauză:** Ambele au `href="index.html#..."`. Funcția compara doar partea de
dinaintea `#`, deci ambele se potriveau cu pagina curentă.

**Soluție:** Linkurile cu ancoră nu marchează pagina activă:
```js
var hash = href.split('#')[1];
if (hash) return;                 // ancorele nu sunt „pagina activă"
if (page !== current) return;
```

---

### 4.4 Valori hardcodate în CSS (încălcarea propriei reguli)
**Simptom:** Am scris `#c0392b` direct în `css/contact.css`, deși regula 3 din
instrucțiuni interzice valorile hardcodate.

**Soluție:** Adaugă variabile în `variables.css` (`--c-error`, `--c-error-bg`)
și referențiază-le.

**Prevenție:** Înainte de a scrie o culoare nouă, verifică dacă există deja:
```bash
grep -n -iE '^\s*--[a-z-]*(red|error|danger)' css/variables.css
```

---

### 4.5 `fetch()` nu funcționează pe `file://`
**Simptom:** Navbar-ul și footer-ul nu apar la deschiderea directă a fișierului.

**Cauză:** Componentele se injectează prin `fetch()`, blocat de CORS pe `file://`.

**Soluție:** Previzualizare doar prin server:
```bash
/c/xampp/php/php.exe -S 127.0.0.1:8899 -t .
```
**Notă:** Aceasta e o consecință acceptată a regulii 2 din instrucțiuni
(componente injectate). Pe hostul final cu Apache nu e nicio problemă.

---

### 4.6 Cache busting devenit obligatoriu
**Simptom potențial:** După activarea `.htaccess`, vizitatorii vechi ar fi rămas
blocați cu versiunea veche a `contact.js` timp de un an, cu formularul nefuncțional.

**Cauză:** `.htaccess` servește CSS/JS cu `Cache-Control: immutable, max-age=31536000`.
Fără `?v=`, browserul nu mai cere niciodată fișierul din nou.

**Soluție:** `?v=X.Y.Z` pe **toate** referințele CSS/JS, incrementat la fiecare
modificare. Verificare că nu a scăpat niciuna:
```bash
grep -oh '\(href="css/[^"?]*\.css"\|src="js/[^"?]*\.js"\)' *.html
# rezultat gol = toate versionate
```

---

### 4.7 Text alb care apare gri pe fundal închis (specificitate CSS)
**Simptom:** Declarația mare „Suntem mai mult decât o agenție…" apărea gri,
deși `.statement` seta explicit `color: var(--c-text-on-dark)` (alb).

**Cauză:** În `base.css` exista regula implicită:
```css
.on-dark p { color: var(--c-text-on-dark-muted); }   /* specificitate (0,1,1) */
```
`.statement` are specificitate (0,1,0) — deci pierde, indiferent de ordinea
fișierelor. Afecta orice paragraf de pe fundal închis care voia altă culoare.

**Soluție:** Coboară specificitatea regulilor implicite cu `:where()`, care
nu adaugă specificitate:
```css
.on-dark :where(p) { color: var(--c-text-on-dark-muted); }   /* (0,1,0) */
```
Acum orice clasă proprie o poate suprascrie, fără `!important`.

**Verificare:** măsoară pixelii, nu te baza pe ochi:
```bash
node -e "sharp(\"pagina.png\").extract({...}).greyscale().raw().toBuffer()"
# luminozitate max 255 = alb pur
```
**Prevenție:** Regulile implicite dintr-un fișier de bază (`base.css`) se scriu
mereu cu `:where()`, ca să rămână suprascriibile din fișierele de componentă.

---

### 4.8 CSP care blochează fonturile în producție
**Simptom potențial:** Toate fonturile ar fi căzut pe fallback în producție,
deși local arătau perfect (serverul PHP de dezvoltare nu aplică `.htaccess`).

**Cauză:** După `git reset --hard origin/main`, `.htaccess` a revenit la
versiunea veche, al cărei CSP permitea doar Google Fonts:
```
style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;
```
Între timp site-ul trecuse pe Fontshare. CSP-ul le-ar fi blocat pe toate.

**Soluție:**
```
style-src 'self' https://api.fontshare.com;
font-src  'self' https://cdn.fontshare.com;
```
**Prevenție — REGULĂ:** După orice `git reset` care aduce fișiere de configurare
de pe remote, verifică dacă mai corespund stării actuale a codului. `.htaccess`,
`robots.txt` și `sitemap.xml` nu sunt „doar config" — pot rupe site-ul în tăcere.

**Cum verifici** că CSP-ul acoperă tot ce încarci:
```bash
grep -oh 'https://[a-z.]*' *.html | sort -u        # domenii externe folosite
grep -o 'Content-Security-Policy "[^"]*"' .htaccess # ce permite CSP
```
Serverul de dezvoltare `php -S` **nu aplică `.htaccess`**, deci problema nu
apare local. Se vede abia pe Apache.

---

### 4.9 Fals pozitiv la căutarea de handlere inline
**Simptom:** `grep -oh 'on[a-z]*="' *.html` raporta 72 de „handlere onclick".

**Cauză:** Tiparul prinde coada lui `content="` → `ontent="`. Zero handlere reale.

**Soluție:** Ancorează la începutul atributului:
```bash
grep -ohE '\son(click|change|submit|load|error|input|mouse[a-z]+)="' *.html
```

---

## 5. Probleme cunoscute, nerezolvate încă

### 5.1 Contrast insuficient în hero (provine din design)
Textul alb „Preț clar, termen respectat…" stă peste zona portocalie a
gradientului. Raportul de contrast este sub 4.5:1, deci nu trece WCAG AA —
cerință explicită în instrucțiuni.

**Stare:** Reprodus fidel, la cererea clientului („exact ca în Figma").
**Opțiuni de rezolvare:** overlay întunecat subtil sub text, sau mutarea
blocului peste zona închisă a gradientului. **Așteaptă decizia clientului.**

### 5.2 Fără server de mail local
`mail()` eșuează pe XAMPP fără SMTP configurat, deci calea de succes a
formularului nu poate fi testată local (dă 500). Tot restul fluxului
— CSRF, honeypot, validare, rate limiting — este testabil și **a fost testat**.
Confirmă trimiterea reală după mutarea pe hostul cu PHP.
