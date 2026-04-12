# SEO Action Plan: milionovainvestice.cz

**Datum:** 2026-04-12
**Celkove SEO skore:** 42/100
**Cilove skore po Phase 1+2:** 75-80/100

---

## PHASE 1: CRITICAL FIXES (do 1 hodiny, +20 bodu)

### 1.1 Vytvorit robots.txt
**Soubor:** `/robots.txt`
**Narocnost:** 5 min

```
User-agent: *
Allow: /
Disallow: /test.html

Sitemap: https://milionovainvestice.cz/sitemap.xml
```

---

### 1.2 Vytvorit sitemap.xml
**Soubor:** `/sitemap.xml`
**Narocnost:** 5 min

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://milionovainvestice.cz/</loc>
    <lastmod>2026-04-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://milionovainvestice.cz/zasady-ochrany-osobnich-udaju</loc>
    <lastmod>2026-04-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
```

---

### 1.3 Pridat chybejici meta tagy do index.html `<head>`
**Soubor:** `/index.html` — za existujici meta tagy
**Narocnost:** 2 min

```html
<link rel="canonical" href="https://milionovainvestice.cz/">
<meta property="og:url" content="https://milionovainvestice.cz/">
<meta name="robots" content="index, follow">
```

---

### 1.4 Optimalizovat title tag
**Soubor:** `/index.html` radek 6
**Narocnost:** 1 min

**Z:**
```html
<title>Milionova Investice — Vyberte si svoji milionovou investici</title>
```

**Na:**
```html
<title>Vysokovynosne investice od 100 000 Kc | Milionova Investice</title>
```

Aktualizovat tez `og:title` a `twitter:title` na stejny text.

---

### 1.5 Zkratit meta description na 155 znaku
**Soubor:** `/index.html` radek 7
**Narocnost:** 1 min

**Z:**
```
At Vase penize vydelavaji Vam, ne bance. Pet zpusobu, jak nechat penize pracovat za Vas: podily ve firmach, nemovitosti, bateriova uloziste, drahe kovy, krypto. Vyplata kazde 3 mesice. Od 100 000 Kc.
```

**Na:**
```
Investujte od 100 000 Kc. Nemovitosti, podily, baterie, drahe kovy, krypto. Cilovy vynos 8-12 % p.a. Vyplaty kazde 3 mesice. Pro kvalifikovane investory.
```

Aktualizovat tez `og:description` a `twitter:description`.

---

### 1.6 Pridat 5 JSON-LD bloku do index.html
**Soubor:** `/index.html` — pred `</head>`
**Narocnost:** 20 min

#### Blok 1: Organization
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://milionovainvestice.cz/#organization",
  "name": "MOVITO group, s.r.o.",
  "alternateName": "Milionova Investice",
  "url": "https://milionovainvestice.cz/",
  "description": "Investicni platforma pro kvalifikovane investory. Pet investicnich kategorii s cilovym vynosem 3-18 % rocne. Vyplata kazde 3 mesice. Od 100 000 Kc.",
  "foundingDate": "2017",
  "founder": {
    "@type": "Person",
    "name": "Vaclav Hejatko"
  },
  "address": [
    {
      "@type": "PostalAddress",
      "name": "Sidlo spolecnosti",
      "streetAddress": "5. kvetna 1111/11",
      "addressLocality": "Praha-Nusle",
      "postalCode": "140 00",
      "addressCountry": "CZ"
    },
    {
      "@type": "PostalAddress",
      "name": "Kontaktni kancelar",
      "streetAddress": "Pikrtova 1a, Enterprise Office Center",
      "addressLocality": "Praha 4-Nusle",
      "postalCode": "140 00",
      "addressCountry": "CZ"
    }
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+420603865865",
    "email": "info@milionovainvestice.cz",
    "contactType": "customer service",
    "availableLanguage": "cs"
  },
  "taxID": "06124186",
  "areaServed": {
    "@type": "Country",
    "name": "CZ"
  },
  "knowsLanguage": "cs"
}
</script>
```

#### Blok 2: WebSite
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://milionovainvestice.cz/#website",
  "name": "Milionova Investice",
  "url": "https://milionovainvestice.cz/",
  "description": "At Vase penize vydelavaji Vam, ne bance. Pet zpusobu, jak nechat penize pracovat za Vas.",
  "inLanguage": "cs",
  "publisher": {
    "@id": "https://milionovainvestice.cz/#organization"
  }
}
</script>
```

#### Blok 3: WebPage
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://milionovainvestice.cz/#webpage",
  "name": "Milionova Investice — Vysokovynosne investice od 100 000 Kc",
  "description": "Investujte od 100 000 Kc. Nemovitosti, podily, baterie, drahe kovy, krypto. Cilovy vynos 8-12 % p.a. Vyplaty kazde 3 mesice.",
  "url": "https://milionovainvestice.cz/",
  "inLanguage": "cs",
  "isPartOf": { "@id": "https://milionovainvestice.cz/#website" },
  "about": { "@id": "https://milionovainvestice.cz/#organization" },
  "dateModified": "2026-04-12"
}
</script>
```

#### Blok 4: FinancialProduct (5 kategorii jako ItemList)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": "https://milionovainvestice.cz/#investment-categories",
  "name": "Investicni kategorie Milionove Investice",
  "numberOfItems": 5,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "FinancialProduct",
        "name": "Podily ve firmach",
        "description": "Koupite si kus proverene ceske firmy. Kazde 3 mesice Vam z jejiho zisku prijde podil na ucet.",
        "category": "Investice do firem",
        "provider": { "@id": "https://milionovainvestice.cz/#organization" },
        "url": "https://milionovainvestice.cz/#investment-categories"
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "FinancialProduct",
        "name": "Nemovitosti",
        "description": "Pujcite penize lidem, kteri maji drahy dum, ale banka jim nepujci. Oni Vam plati uroky. Jejich dum je Vase zaruka.",
        "category": "Investice do nemovitosti",
        "provider": { "@id": "https://milionovainvestice.cz/#organization" },
        "url": "https://milionovainvestice.cz/#investment-categories"
      }
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@type": "FinancialProduct",
        "name": "Bateriova uloziste",
        "description": "Obri baterie kupuji levnou elektrinu a prodavaji ji, kdyz zdrazi. Delaji to kazdy den.",
        "category": "Investice do energetiky",
        "provider": { "@id": "https://milionovainvestice.cz/#organization" },
        "url": "https://milionovainvestice.cz/#investment-categories"
      }
    },
    {
      "@type": "ListItem",
      "position": 4,
      "item": {
        "@type": "FinancialProduct",
        "name": "Drahe kovy",
        "description": "Opravdove zlato a stribro. Slitky ulozene na Vase jmeno ve strezenem trezoru, vsechno pojistene.",
        "category": "Investice do drahych kovu",
        "provider": { "@id": "https://milionovainvestice.cz/#organization" },
        "url": "https://milionovainvestice.cz/#investment-categories"
      }
    },
    {
      "@type": "ListItem",
      "position": 5,
      "item": {
        "@type": "FinancialProduct",
        "name": "Krypto",
        "description": "Bitcoin a Ethereum, schovane mimo internet v bezpecne uschovne podle pravidel EU.",
        "category": "Investice do kryptoaktiv",
        "provider": { "@id": "https://milionovainvestice.cz/#organization" },
        "url": "https://milionovainvestice.cz/#investment-categories"
      }
    }
  ]
}
</script>
```

#### Blok 5: BreadcrumbList
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Milionova Investice",
      "item": "https://milionovainvestice.cz/"
    }
  ]
}
</script>
```

---

## PHASE 2: HIGH PRIORITY (1-2 tydny, +15 bodu)

### 2.1 Vytvorit OG image
**Narocnost:** 30 min
- 1200x630 PNG/JPG s logem, nazvem a USP
- Hostovat na `/og-image.jpg`
- Pridat `<meta property="og:image">` na obe stranky

### 2.2 Pridat favicon + apple-touch-icon
**Narocnost:** 15 min
- favicon.ico (32x32)
- apple-touch-icon.png (180x180)
- Pridat `<link>` tagy do `<head>` obou stranek

### 2.3 Pridat font preload hints
**Soubor:** `/index.html` — na zacatek `<head>`
**Narocnost:** 2 min

```html
<link rel="preload" as="font" type="font/woff2" href="/fonts/dm-sans-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/fonts/playfair-display-latin.woff2" crossorigin>
```

### 2.4 Vytvorit stranku "O nas"
**URL:** `/o-nas`
**Narocnost:** 4-8 hodin
**Obsah:**
- Pribeh firmy a zakladatele Vaclava Hejatka
- Kvalifikace, zkusenosti, track record
- Cisla: 8 let, 850 mil. Kc, 237 investoru
- Fotografie tymu
- Regulacni status a certifikace

### 2.5 Vytvorit web app manifest
**Soubor:** `/site.webmanifest`
**Narocnost:** 10 min

---

## PHASE 3: CONTENT EXPANSION (3-6 tydnu, +15-20 bodu)

### 3.1 5 samostatnych kategoriovych stranek (800+ slov kazda)

| URL | Cilovy keyword | Popis |
|-----|---------------|-------|
| `/investice/nemovitosti` | investice do nemovitosti | Rozsirim explainer, case studies, detailni popis procesu |
| `/investice/podily-ve-firmach` | investicni podily ve firmach | Jak funguje podilnictvi, jake firmy, rizika |
| `/investice/bateriova-uloziste` | bateriova uloziste investice | Technologie, smlouvy, vynosy, udrzitelnost |
| `/investice/drahe-kovy` | investice do zlata | Fyzicke zlato, trezor, pojisteni, historicke vynosy |
| `/investice/krypto` | krypto investice cz | Bitcoin, Ethereum, bezpecnost, regulace EU |

Kazda stranka musi obsahovat:
- Unikatni title tag cilici na keyword
- Meta description pod 155 znaku
- H1 s klicovym slovem
- Minimalne 800 slov kvalitniho obsahu
- JSON-LD FinancialProduct schema
- CTA formular nebo odkaz na hlavni formular
- BreadcrumbList schema

### 3.2 FAQ stranka
**URL:** `/faq`
**Narocnost:** 4 hodiny
**Obsah (min. 15 otazek):**
- Od jake castky mohu investovat?
- Jak jsou moje penize zajisteny?
- Kdy dostanu prvni vyplatu?
- Co se stane, kdyz dluznik neplati?
- Jak se lisi Milionova Investice od investicniho fondu?
- Musim byt kvalifikovany investor?
- Jake jsou poplatky?
- Mohu investici predcasne ukoncit?
- Jak funguji uroky ze zastavy nemovitosti?
- Je to regulovane CNB?
- Jake dane platim z vynosu?
- Jak probiha proverka dluznika?
- Mohu investovat do vice kategorii najednou?
- Jak dlouho trva celý proces?
- Co kdyz cena nemovitosti klesne?

### 3.3 Netlify redirects pro nove stranky
**Soubor:** `/netlify.toml` — pridat pretty URL rewrites pro kazdy novy `.html` soubor

---

## PHASE 4: DLOUHODOBE (ongoing)

### 4.1 Blog s investicnim obsahem
Temata:
- "Proc sporit nestaci — inflace 2026"
- "Investicni byt vs. zastava nemovitosti — porovnani"
- "5 nejcastejsich chyb zacinajicich investoru"
- "Jak funguje zastava nemovitosti krok za krokem"
- "Zlato jako ochrana proti inflaci — mity a realita"
- "Co je kvalifikovany investor podle ZISIF"

### 4.2 Link building strategie
- PR clanky v ceskych financnich mediich (Penize.cz, Mesec.cz, E15)
- Hostovaanske clanky na investicnich blozich
- Partnerska spoluprace s financnimi poradci
- Registrace do ceskych business directories (Firmy.cz, Zivefirmy.cz)

### 4.3 Google Search Console
- Zaregistrovat web
- Odeslat sitemap.xml
- Sledovat indexaci a vyhledavaci dotazy
- Nastavit email notifikace pro problemy

### 4.4 Google Business Profile
- Vytvorit profil pro Enterprise Office Center, Praha 4
- Pridat fotografie kancelare
- Ziskat prvni recenze od existujicich investoru

---

## CASOVY HARMONOGRAM

| Faze | Cas | Ocekavany dopad |
|------|-----|-----------------|
| Phase 1 | 1 hodina | Score 42 -> 62 |
| Phase 2 | 1-2 tydny | Score 62 -> 75 |
| Phase 3 | 3-6 tydnu | Score 75 -> 85 |
| Phase 4 | pruebezne | Score 85 -> 90+ |

---

*Akcni plan vygenerovan 2026-04-12 jako soucast plnohodnotneho SEO auditu.*
