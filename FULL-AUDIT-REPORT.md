# SEO Audit Report: milionovainvestice.cz

**Datum:** 2026-04-12
**Typ webu:** Investicni platforma pro HNWI investory (CZ)
**Provozovatel:** MOVITO group, s.r.o., IC: 06124186
**Domena:** milionovainvestice.cz
**Hosting:** Netlify (CDN, Brotli, HTTP/2)
**Pocet stranek:** 2 (homepage + zasady ochrany osobnich udaju)

---

## EXECUTIVE SUMMARY

### SEO Health Score: 42 / 100

| Kategorie | Vaha | Skore | Vazene skore |
|-----------|------|-------|--------------|
| Technicke SEO | 25% | 58/100 | 14.5 |
| Kvalita obsahu & E-E-A-T | 25% | 37/100 | 9.3 |
| On-Page SEO | 20% | 45/100 | 9.0 |
| Schema / strukturovana data | 10% | 5/100 | 0.5 |
| Vykon (Core Web Vitals) | 10% | 90/100 | 9.0 |
| **Celkem** | **100%** | | **42.3** |

### Top 5 kritickych problemu

1. **Zadny robots.txt** — vyhledavace nemaji zadne instrukce pro crawlovani
2. **Zadny sitemap.xml** — Google nema mapu webu
3. **Chybi canonical tag na homepage** — riziko duplicitnich URL
4. **Nula strukturovanych dat (JSON-LD)** — zadny Organization, WebSite, FinancialProduct schema
5. **Pouze 2 stranky** — extremne tenky obsah pro YMYL financni web s naroky na E-E-A-T

### Top 5 quick wins (implementace do 1 hodiny)

1. Pridat `robots.txt` (5 min)
2. Pridat `sitemap.xml` (5 min)
3. Pridat `<link rel="canonical">`, `og:url`, `meta robots` na homepage (2 min)
4. Zkratit meta description na 155 znaku (2 min)
5. Pridat 5 JSON-LD bloku (Organization, WebSite, WebPage, FinancialProduct, BreadcrumbList) (20 min)

---

## 1. TECHNICKE SEO (Score: 58/100)

### CRITICAL

#### 1.1 Chybi robots.txt
Neexistuje zadny soubor robots.txt. Vyhledavace crawluji vse vcetne test.html a Netlify function endpointu.

**Reseni:** Vytvorit `/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /test.html

Sitemap: https://milionovainvestice.cz/sitemap.xml
```

#### 1.2 Chybi sitemap.xml
Neexistuje XML sitemap. I pri 2 strankach je to zakladni pozadavek pro Search Console.

**Reseni:** Vytvorit `/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://milionovainvestice.cz/</loc>
    <lastmod>2026-04-12</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://milionovainvestice.cz/zasady-ochrany-osobnich-udaju</loc>
    <lastmod>2026-04-12</lastmod>
    <priority>0.3</priority>
  </url>
</urlset>
```

#### 1.3 Chybi canonical tag na homepage
Homepage nema `<link rel="canonical">`. Google musi hadat kanonickou URL — riziko duplikace mezi `/`, `/index.html`, `?utm_...` variantami.

**Reseni:** Pridat do `<head>`:
```html
<link rel="canonical" href="https://milionovainvestice.cz/">
```

#### 1.4 Chybi og:image na obou strankach
Zadna stranka nema `og:image`. Sdileni na LinkedIn/Facebook/WhatsApp se zobrazi bez obrazku — kriticke pro investicni platformu, kde je duveryhodnost klicova.

**Reseni:** Vytvorit OG obrazek 1200x630, pridat:
```html
<meta property="og:image" content="https://milionovainvestice.cz/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

### HIGH

#### 1.5 Chybi meta robots na homepage
Vychozi chovani je `index, follow`, ale explicitni nastaveni je best practice. Stranka se zasadami ochrany to ma spravne.

#### 1.6 Chybi og:url na homepage
Facebook scraper muze vybrat spatnou kanonickou URL.

#### 1.7 Chybi favicon a apple-touch-icon
Zadny `<link rel="icon">`, zadny `.ico` soubor. Prohlizece zobrazuji genericke ikony.

#### 1.8 Chybi web app manifest
Zadny `manifest.json` — ovlivnuje Lighthouse skore a "pridat na plochu" na mobilech.

### PASS

| Polozka | Status |
|---------|--------|
| HTTPS + HSTS preload | PASS |
| Security headers (CSP, X-Frame-Options, nosniff) | PASS |
| Viewport meta tag | PASS |
| Responzivni CSS (66 media queries) | PASS |
| font-display: swap na vsech 12 @font-face | PASS |
| Self-hosted fonty (GDPR compliant) | PASS |
| Cache-Control na fonty (1 rok, immutable) | PASS |
| lang="cs" na obou strankach | PASS |
| ARIA atributy (134 nalezeno) | PASS |
| JS rendering — obsah je v statickem HTML | PASS |
| test.html ma noindex, nofollow | PASS |

---

## 2. ON-PAGE SEO (Score: 45/100)

### HIGH

#### 2.1 Title tag — duplikace klicoveho slova
**Aktualni:** "Milionova Investice — Vyberte si svoji milionovou investici" (59 znaku)
Slovo "milionovou/milionova" se opakuje 2x. Chybi vysoko-hodnotna klicova slova.

**Doporuceny title (58 znaku):**
```
Vysokovynosne investice od 100 000 Kc | Milionova Investice
```

**Alternativa (55 znaku):**
```
Investice od 100 000 Kc — Vynos 8-12 % p.a. | Movito
```

#### 2.2 Meta description je prilis dlouhy (223 znaku)
Google orizne po ~155 znacich. Nejpresvedcivejsi cast ("Vyplata kazde 3 mesice. Od 100 000 Kc.") se nezobrazi.

**Doporuceny meta description (154 znaku):**
```
Investujte od 100 000 Kc. Nemovitosti, podily, baterie, drahe kovy, krypto. Cilovy vynos 8-12 % p.a. Vyplaty kazde 3 mesice. Pro kvalifikovane investory.
```

#### 2.3 H1 je pouze nazev znacky
"Milionova investice" — nepopise obsah stranky ani necili na zadny vyhledavaci dotaz.

**Doporuceni:** Pridat kontextualni podtitulek nebo upravit na klicove-slovo-bohatou variantu zachovavajici znacku.

#### 2.4 H2 headingy jsou repetitivni
Tri H2 pouzivaji variace "Vyberte si svoji milionovou investici/kategorii". Zadny necili na samostatny keyword cluster.

**Doporuceni:**
- Formular: "Ziskejte nabidku na miru" nebo "Nezavazna konzultace zdarma"
- Kategorie: "5 investicnich kategorii od 100 000 Kc"
- Explainer: "Investice do nemovitosti — jak to funguje" (toto uz je dobre)

### MEDIUM

#### 2.5 Zadna interni linkovaci struktura
2 stranky celkem, homepage linkuje pouze na privacy policy a sama na sebe (anchor linky). Zadna tematicka hub struktura, zadne silo.

#### 2.6 Chybi alt texty (nejsou relevantni — site pouziva SVG)
Vsechny vizualy jsou inline SVG s `aria-hidden="true"`. Technicke spravne pro dekorativni grafiku, ale znamena to nulovy image SEO potencial.

---

## 3. KVALITA OBSAHU & E-E-A-T (Score: 37/100)

### CRITICAL

#### 3.1 YMYL web se 2 strankami — extremne tenky obsah
Pro financni web s naroky E-E-A-T je 2 stranek naprosto nedostatecnych. Google ocekava:
- Podrobne informace o kazdem produktu
- FAQ sekci
- Stranka "O nas" s tymem a kvalifikacemi
- Vzdelelavaci obsah (blog)
- Case studies / reference

#### 3.2 E-E-A-T hodnoceni

| Faktor | Score | Poznamky |
|--------|-------|----------|
| **Experience** (20%) | 35/100 | Social proof cisla pritomna (237 investoru, 850M Kc, 8 let), ale zadne case studies, reference, ukazky portfolia |
| **Expertise** (25%) | 30/100 | Zadne zivotopisy, zadne kvalifikace, zadny vzdelavaci obsah dokazujici financni odbornost |
| **Authoritativeness** (25%) | 25/100 | Zadne externi citace, zadne zmeny v tisku, zadny obsah vhodny pro backlinkoveani |
| **Trustworthiness** (30%) | 55/100 | ICO pritomno, fyzicka adresa, telefon, GDPR, disclaimery. Snizeno chybejicim detailem o regulaci a absenci transparentnosti tymu |

**Vazeny E-E-A-T Score: 37/100**

### HIGH

#### 3.3 Tenky obsah u 4 z 5 investicnich kategorii
Kazda karta obsahuje ~30-50 slov popisu. Jedine "Nemovitosti" ma hloubkovy explainer (~800 slov). Ostatni 4 kategorie (Podily, Baterie, Kovy, Krypto) maji jen kartu.

#### 3.4 Chybi stranka o tymu / zakladateli
Vaclav Hejatko je zminen jednou v paticce. Pro financni sluzby Google vyzaduje zjistitelne kvalifikace autoru.

#### 3.5 AI Citation Readiness: 20/100
Zadna strukturovana data, zadna FAQ sekce, zadne definicni odstavce, zadna semanticka znaceni financnich pojmu. Obsah je narritivni, ale ne extrahovatelny pro AI vyhledavace.

---

## 4. SCHEMA / STRUKTUROVANA DATA (Score: 5/100)

### CRITICAL

#### 4.1 Homepage — nula JSON-LD
Jedina strukturovana data na celem webu: BreadcrumbList na privacy page.

#### 4.2 Doporucene schema typy (pripravene k implementaci)

5 JSON-LD bloku je pripraveno v ACTION-PLAN.md:
1. **Organization** — MOVITO group, s.r.o. se vsemi detaily
2. **WebSite** — identita webu
3. **WebPage** — metadata homepage
4. **FinancialProduct x5** — vsech 5 investicnich kategorii jako ItemList
5. **BreadcrumbList** — navigacni stopa homepage

Poznamka: **FAQPage schema se od srpna 2023 zobrazuje jako rich result pouze pro vladni a zdravotnicke weby.** Pro soukromou financni spolecnost Google rich results nezobrazí.

---

## 5. VYKON / CORE WEB VITALS (Score: 90/100)

### Rozklad souboru

| Komponenta | Velikost | Podil |
|------------|----------|-------|
| CSS | 114 KB | 40.7% |
| SVG (44 elementu) | 69 KB | 24.5% |
| HTML markup | 55 KB | 19.5% |
| JavaScript | 43 KB | 15.2% |
| **index.html celkem** | **286 KB** (raw) | |
| **Po Brotli kompresi** | **~42 KB** (transfer) | |

Fonty: 275 KB celkem, cesky navstevnik stahne ~151 KB (4 soubory s unicode-range).

### Odhadovane CWV metriky

| Metrika | Odhad | Status |
|---------|-------|--------|
| **LCP** | 1.2-1.8s | GOOD |
| **INP** | 80-120ms | GOOD |
| **CLS** | 0.02-0.05 | GOOD |

### Hodnoceni architektury
Single-file pristup je **spravny** pro tento web. Eliminuje CSS/JS request waterfall. Po Brotli kompresi 42 KB — pod 100 KB prahem.

### Jedine doporuceni
Pridat font preload hints pro 2 kriticke fonty:
```html
<link rel="preload" as="font" type="font/woff2" href="/fonts/dm-sans-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/fonts/playfair-display-latin.woff2" crossorigin>
```

---

## 6. KEYWORD STRATEGIE PRO INVESTORY

### Aktualni stav
Web necili na zadny konkretni vyhledavaci dotaz. Title, H1, i meta description pouzivaji pouze nazev znacky.

### Top 10 cilovych klicovych slov

| Klicove slovo | Intent | Konkurence | Volume |
|---------------|--------|------------|--------|
| kde investovat penize | Informational | Vysoka | HIGH |
| investice od 100 000 kc | Transactional | Stredni | HIGH |
| vysokovynosne investice | Transactional | Stredni | HIGH |
| investice do nemovitosti | Informational | Vysoka | HIGH |
| alternativni investice | Informational | Vysoka | HIGH |
| jak zhodnotit miliony | Informational | Stredni | MEDIUM |
| investice do zlata | Informational | Stredni | MEDIUM |
| krypto investice cz | Informational | Vysoka | HIGH |
| investice s pravidelnym vynosem | Transactional | Nizka | MEDIUM |
| investice pro bogate | Informational | Stredni | MEDIUM |

### Doporucene nove stranky

1. `/investice/nemovitosti` — "Investice do nemovitosti — 8-12 % rocne"
2. `/investice/podily-ve-firmach` — "Investicni podily v ceskych firmach"
3. `/investice/bateriova-uloziste` — "Bateriova uloziste jako investice"
4. `/investice/drahe-kovy` — "Investice do zlata a stribra"
5. `/investice/krypto` — "Krypto investice — Bitcoin a Ethereum"
6. `/o-nas` — "O Milionove Investici — 8 let na trhu, 850 mil. Kc"
7. `/faq` — "Casty dotazy investoru"
8. `/blog/inflace-a-penize` — "Proc sporit nestaci — inflace 2026"
9. `/porovnani` — "Proc Milionova Investice vs. investicni byt"
10. `/pro-kvalifikovane-investory` — "Kvalifikovany investor — co potrebujete vedet"

---

## 7. CELKOVY PREHLED NALEZU

| Priorita | Pocet | Popis |
|----------|-------|-------|
| CRITICAL | 6 | robots.txt, sitemap, canonical, og:image, JSON-LD, tenky obsah |
| HIGH | 8 | title tag, meta desc, H1/H2 optimalizace, favicon, team page, kategorie stranky |
| MEDIUM | 5 | interni linking, manifest, font preload, AI citation, copyright |
| LOW | 3 | CSP unsafe-inline, nepouzite font subsety, hreflang (nepotrebne) |
| PASS | 14 | HTTPS, security headers, viewport, responsive, fonty, ARIA, JS rendering |

---

*Report vygenerovan 2026-04-12. Podrobny akcni plan viz ACTION-PLAN.md*
