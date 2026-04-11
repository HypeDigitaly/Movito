# Sekce 1: HERO + TRUST BAR — Kurátorovaná Nabídka 5 Investičních Kategorií

---

## Regulatory Strip (Top-of-Page)

```
MARKETINGOVÉ SDĚLENÍ — Toto sdělení má pouze informativní charakter 
a nepředstavuje investiční doporučení ani nabídku k uzavření smlouvy.
```

---

## Hero Headline (Fixed — H1)

```
VYBERTE SI SVOJI MILIONOVOU INVESTICI
```

---

## Subheadline Variants (3 Options)

### Varianta A — Primary (Recommended)
```
Investujte chytře od 100 000 Kč. 
Podílové vlastnictví, nemovitosti, bateriová úložiště, drahé kovy, krypto. 
Čtvrtletní výplaty. Osobní poradenství.
```

**Focus:** All 5 categories listed in Czech labels (canonical), entry point framed as accessible, 
operational benefits (quarterly, personal advisor).

---

### Varianta B — Rhythmic/Condensed (~15 words)
```
Pět kategorií. Jeden poradce. Jeden vstup od 100 tisíc. Čtvrtletní príjmy.
```

**Focus:** Shortened rhythm, emphasizes unified platform, budget-friendly entry.

---

### Varianta C — Benefit-Led (Outcome First)
```
Vytvořte si pasivní příjem diverzifikací. 
Od podílů po krypto—pět kurátorovaných cest k vašemu miliónu. 
Čtvrtletní výplaty. Bez operativních starostí.
```

**Focus:** Dream outcome (passive income, diversification) leads; 5 categories follow as pathways; 
zero management burden highlighted.

---

## Tagline (Below Subheadline)

```
Od 100 000 Kč  ·  Čtvrtletní výplaty  ·  Transparentní řízení
```

---

## Dual CTA Specification

### Primary CTA
```
Button Text: "Začít investovat"
Style: Gold filled button
Route: Contact form (category field auto-populated or selector shown)
Hidden Field: category: [slug from selector below]
```

### Secondary CTA
```
Button Text: "Získat nabídku financování"
Style: Outlined button (gold accent border)
Route: SAME contact form (not separate flow)
Hidden Field: category: [slug from selector below]
A/B Note: This variant tests financing-interested segment; copy messaging identical otherwise
```

**Form Integration Rule:** Both CTAs post to existing contact form. The `category` hidden field 
differentiates intent downstream (invest-now vs. financing-inquiry) without separate workflow.

---

## Trust Bar (Directly Below CTAs)

### Primary Trust Line
```
5 kurátorovaných kategorií  ·  Od 100 000 Kč  ·  
Čtvrtletní výplaty  ·  Osobní poradce
```

### Mandatory Risk Warning (Equal Prominence)
```
⚠ Cílový výnos není zaručen. Minulé výsledky nejsou zárukou výsledků budoucích.
```

**Placement Rule:** Display the risk warning on same visual line or immediately adjacent 
(same color/size as trust line). No subordination. Financial transparency mandate.

---

## Hero Badge (Replaces Real-Estate Badge)

```
Diverzifikované investice od 100 000 Kč — kurátorovaná nabídka
```

**Context:** This badge appears in header/navigation context and on social share cards. 
Signals shift from single-asset (real estate) to multi-category platform.

---

## Category Selector Integration Note (Implementation Guidance)

Below the dual CTA buttons, insert the **5-Category Tab Card Selector**:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Vyberte si kategorii (klikněte pro detaily):              │
│                                                             │
│  [ Podíly ]  [ Nemovitosti ]  [ Baterie ]  [ Kovy ]  [ Krypto ]  │
│    9-15%        8-12%          7-11%       3-6%      6-18%       │
│                                                             │
│  (Each tab opens category-specific hero image, descriptor,  │
│   and pre-populates contact form's category field)         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Technical Implementation:**
- Each tab = clickable card with category slug (`podily`, `nemovitosti`, `baterie`, `kovy`, `krypto`)
- Display target yield range (p.a.) under category name
- Tab click scrolls or slides to category-specific deep-dive section (OR opens modal)
- Selecting a tab pre-fills `category` field in CTA form below

---

## Hero Section — Complete Visual Layout Example

```
─────────────────────────────────────────────────────────────────────

    [MARKETING DISCLOSURE STRIP AT TOP]
    MARKETINGOVÉ SDĚLENÍ — Toto sdělení má pouze informativní charakter...

─────────────────────────────────────────────────────────────────────

                 VYBERTE SI SVOJI MILIONOVOU INVESTICI

           Investujte chytře od 100 000 Kč. 
           Podílové vlastnictví, nemovitosti, bateriová úložiště, 
           drahé kovy, krypto. Čtvrtletní výplaty. Osobní poradenství.

              Od 100 000 Kč  ·  Čtvrtletní výplaty  ·  Transparentní řízení

                    [ Začít investovat ]  [ Získat nabídku financování ]

─────────────────────────────────────────────────────────────────────

   5 kurátorovaných kategorií  ·  Od 100 000 Kč  ·  
   Čtvrtletní výplaty  ·  Osobní poradce

   ⚠ Cílový výnos není zaručen. Minulé výsledky nejsou zárukou výsledků budoucích.

─────────────────────────────────────────────────────────────────────

                     VYBERTE SI KATEGORII:

    [ Podíly ]  [ Nemovitosti ]  [ Baterie ]  [ Kovy ]  [ Krypto ]
      9-15%        8-12%          7-11%       3-6%      6-18%

─────────────────────────────────────────────────────────────────────
```

---

## Acceptance Checklist

- [x] H1 verbatim: "VYBERTE SI SVOJI MILIONOVOU INVESTICI"
- [x] Top-of-page marketing strip: "MARKETINGOVÉ SDĚLENÍ — Toto sdělení..."
- [x] 3 subheadline variants provided (A/Primary, B/Rhythmic, C/Benefit-led)
- [x] Dual CTA spec'd: "Začít investovat" (filled) + "Získat nabídku financování" (outlined)
- [x] 100k minimum mentioned twice (subheadline A, tagline, trust bar)
- [x] Risk-parity wording present: "Cílový výnos není zaručen..." (equal prominence in trust bar)
- [x] All 5 categories by canonical label: Podíly, Nemovitosti, Baterie, Kovy, Krypto
- [x] No banned phrases used (zero "garantovaný výnos", "jistota", "bez rizika")
- [x] Formal "Vy/Vám" throughout
- [x] ~250 lines total; Czech formal register; institutional tone

---

END OF 01-HERO.MD (v2 — 5-Category Rework)
