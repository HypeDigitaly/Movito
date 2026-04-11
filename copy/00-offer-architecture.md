# Movito Group — Kurátorovaná Nabídka 5 Investičních Kategorií
## Architektura Nabídky, Regulatory Compliance & Copy Standards

---

## 1. Product Positioning

**Brand:** "Milionová Investice"

**Positioning:** Kurátorovaná nabídka 5 investičních kategorií pro české HNWI investory (a aspirační HNW s vstupním bodem 100 000 Kč).

**Paradigm shift:**
- Bylo: Real-estate-only, 500k CZK minimum, scarcity-driven
- Je nyní: Pět kategorií, jeden platform, jeden advisor, cílová reinvestice výnosů k milionové jistině
- Tón: Formální "Vy/Vám", premium ale inkluzivní, institucionální rigor (due diligence, transparency), NE hype

**Regulatory framing:** "Marketingové sdělení — Toto sdělení má pouze informativní charakter a nepředstavuje investiční doporučení ani nabídku k uzavření smlouvy."

---

## 2. Canonical Category IDs & Label Mapping

**Všechny downstream copy soubory (A1-A10, kategorie/*.md, HTML formuláře, backend validace, testy) MUSÍ používat PŘESNĚ tyto slug ID:**

| Slug ID | Český Label | Full Label |
|---------|------------|-----------|
| `podily` | Podíly ve firmách | Podíly ve firmách / Podílové vlastnictví |
| `nemovitosti` | Nemovitosti | Nemovitosti |
| `baterie` | Bateriová úložiště | Bateriová úložiště |
| `kovy` | Drahé kovy | Drahé kovy |
| `krypto` | Krypto | Krypto |

**PRAVIDLO:** Žádný drift. Slug ↔ Label je jednosměrný a má přednost před jakýmkoli novějším dokumentem.

---

## 3. Target Yield Ranges Per Category

| Kategorie | Cílový výnos p.a. |
|-----------|------------------|
| Podíly ve firmách | 9–15 % |
| Nemovitosti | 8–12 % |
| Bateriová úložiště | 7–11 % |
| Drahé kovy | 3–6 % |
| Krypto | 6–18 % |

**KRITICKÉ PRAVIDLO:** Každý claim výnosu musí být:
1. Labeled "cílový výnos" (NIKDY "garantovaný výnos")
2. Párován s risk disclaimerem: **"Cílový výnos není zaručen. Minulé výsledky nejsou zárukou výsledků budoucích."**

---

## 4. Minimum Investment (Uniform, Welcoming)

| Aspekt | Specifikace |
|--------|------------|
| Globální minimum | **100 000 Kč** across ALL categories |
| Brand framing | "Milionová Investice — začněte s 100 tisíci, budujte milion postupně reinvesticí čtvrtletních výnosů" |
| Tone | Vstupní bod (entry point), NE gatekeeping gate |
| Copy pattern | "Vstupte do private platform s minimem 100 000 Kč" — pozitivní framing |

**ZAKÁZÁNO:**
- Jazyk, který odrazuje menší investory ("jen pro miliardáře")
- Pozicování 100k jako "jen minimum" (je to vstupní bod)
- "Exkluzivní přístup omezen na..." — vždy "dostupné s minimem 100k Kč"

---

## 5. Banned Phrases (NIKDY se nepoužívají v Movito copy)

```
ZAKÁZÁNO:
✗ "garantovaný výnos"
✗ "jistota" (v kontextu výnosů/výsledků)
✗ "bez rizika"
✗ "zaručené zhodnocení"
✗ "100% bezpečné"
✗ "bezrizikový"
✗ "dvojnásobek jistě"
✗ "jisté zhodnocení"
✗ "není možné ztratit" (v jakékoli formě)
```

---

## 6. Mandatory Phrasing (must appear verbatim where applicable)

### 6.1 Standard Risk Disclaimer
"Cílový výnos není zaručen. Minulé výsledky nejsou zárukou výsledků budoucích."

### 6.2 Marketing Disclosure (top-of-page strip)
"Marketingové sdělení — Toto sdělení má pouze informativní charakter a nepředstavuje investiční doporučení ani nabídku k uzavření smlouvy."

### 6.3 MiCA Art. 7 Warning (ONLY in Krypto section)
"Kryptoaktiva mohou zcela nebo zčásti ztratit svou hodnotu, nejsou regulována jako tradiční finanční nástroje a nejsou kryta systémem pojištění vkladů."

### 6.4 Deposit Insurance Comparison
"Bankovní vklady jsou kryty systémem pojištění vkladů do 100 000 EUR. Investice u Movito nejsou kryty pojištěním vkladů."

### 6.5 Standard Yield Label
Vždy: "cílový výnos" (ne "typický výnos", "očekávaný výnos", "garantovaný výnos")

---

## 7. Value Equation (Hormozi Framework Applied to Five Categories)

```
Value = (Dream Outcome × Perceived Likelihood) ÷ (Time Delay × Effort)

Dream Outcome:          Pasivní příjem z diverzifikované alternativy bez operativních starostí = 9/10
Perceived Likelihood:   5 kurátorovaných kategorií, osobní poradce, čtvrtletní výplaty,
                        transparentní reporting, asset-specific collateral              = 7/10
Time Delay:             Čtvrtletní výplaty, doba trvání dle kategorie (1-15 let)        = 2/10 (low = good)
Effort:                 Zero management, jednoduchý onboarding, Movito spravuje za Vás  = 2/10 (low = good)

Score = (9 × 7) ÷ (2 × 2) = 15.75 → SILNÝ
```

---

## 8. Shared Operational Model ("One Platform, Five Paths")

| Aspekt | Detail |
|--------|--------|
| **Curation** | Movito vybírá, investor nemusí lovit v públiku. Čtvrtletní deal flow per kategorie. |
| **Collateral per asset type** | Nemovitosti: LTV 50-70% (risk-assessed), Baterie: SPV s fyzickou inspekci, Kovy: external custody (Brinks), Krypto: external custody (Bitstamp/Kraken), Podíly: SPV + zástavní právo na akcíích. |
| **Quarterly payouts** | Automatické transfery: březen, červen, září, prosinec (do 5. pracovního dne). |
| **Reporting** | Čtvrtletní zpráva per investor: seznam aktiv, kde jsou uložena, výkon, rizikový profil. |
| **Personal advisor** | 1 dedicated kontakt per portfolio. NE call center. |

---

## 9. CTA Dual-Path Spec

| Typ | Text | Route | Hidden Field |
|-----|------|-------|--------------|
| Primary | "Začít investovat" | Contact form v tabs | `category: [slug]` |
| Secondary | "Získat nabídku financování" | SAME form (A/B variant) | `category: [slug]` |

**PRAVIDLO:** Obě tlačítka vedou do stejného form workflow, nikoli do dvou různých flow. A/B variant je v copy, ne v infrastruktury.

---

## 10. Tone & Language Rules (Extended from Real Estate)

```
✅ POUŽÍT:
- Formální "Vy/Vám" všude
- Specifická čísla ("9,7 % za poslední rok", ne "až 10 %")
- Profesionální ale srozumitelný jazyk
- Transparentnost o rizicích (aktivně, ne jen fine print)
- "Cílový výnos" (ne "garantovaný", "typický", "očekávaný")
- "Kurátorovaná nabídka" (framing as institutional rigor, not scarcity)
- Asset-specific language (LTV for RE, SPV for batteries, custody for metals/crypto)

❌ NEPOUŽÍVAT:
- Tykání ("ty/tebe")
- Casual/hype jazyk ("bez práce", "bohatí Češi", "easy money")
- Přehnané sliby ("milion v roce", "bezpečně zdvojnásobit")
- Fake urgence (countdown timery, "jen 3 místa")
- Srovnání s konkrétními konkurenty jménem (jen kategorií alternativ)
- Slovo "záruka/garance" v kontextu výnosů
- Slovo "jistota" v kontextu zhodnocení
```

---

## 11. Comparative Communication (Category Benchmarks, NOT Named Competitors)

| vs. Alternativa | Movito Key Argument | Caveat |
|----------------|-------------------|--------|
| Bankovní vklad (4%) | 2–4× vyšší cílový výnos, diverzifikace | Vyšší riziko; NE pojištěno |
| Přímé vlastnictví nemovitosti (2-4%) | Žádná správa, nájemníci, opravy, daně | Iliquidity (čtvrtletní výplata, ne hotovost) |
| Mutual funds (4-8%) | Transparentní konkrétní assets, nižší fees | Asset-specific risk per kategorie |
| P2P lending (8-9%) | Zajištění (LTV/custody/SPV), osobní advisor | Delší tenure, delší cash-out cycle |

**PRAVIDLO:** Srovnávat dle KATEGORIÍ a produktových typů, nikoli jmenovaných konkurentů.

---

## 12. Urgency/Scarcity — POUZE faktické

```
POVOLENO (pokud real-time verified v backend):
→ "Aktuální investiční kolo [kategorie X]: celková kapacita Y Kč, ke dni [DNES] committováno Z Kč (X% zaplnění)"
→ "Příští deal flow [kategorie Y]: očekáváno [měsíc/rok]"

ZAKÁZÁNO:
✗ "Jen 3 místa zbývají" (pokud nelze technicky ověřit v reálném čase)
✗ Umělá urgence ("nabídka končí v pátek")
✗ Fake countdown timery
✗ "Exkluzivně pro prvních 10 investorů"
```

---

## 13. File Change Priority Map (All Copy Files)

Každý soubor v `copy/` musí konzumovat tuto **00-offer-architecture.md** pro:
- Category IDs (`podily`, `nemovitosti`, `baterie`, `kovy`, `krypto`)
- Yield ranges
- 100k CZK minimum
- Banned phrases (check-in linting)
- Mandatory phrasing (stamp in legal disclaimers)

| File | Priority | Element to consume | Notes |
|------|----------|-------------------|-------|
| **01-hero-section.md** | MAJOR REWRITE | Category IDs, positioning statement, primary CTA | From real-estate-only to 5-category hero |
| **02-category-intro.md** | MAJOR REWRITE | All 5 category slugs, yield ranges, operational model | Create 5 parallel narratives (one per category) |
| **03-value-stack.md** | MAJOR REWRITE | Yield ranges, collateral per asset type, advisor model | Expand from RE-only benefits to 5-category stack |
| **04-how-it-works.md** | MODERATE UPDATE | Curation process, quarterly payouts, reporting | Generalize from RE workflow to multi-asset |
| **05-risk-management.md** | MAJOR REWRITE | Asset-specific collateral (LTV, SPV, custody), disclaimers | Add MiCA Art. 7 (crypto), deposit insurance comparison |
| **06-faq.md** | MODERATE UPDATE | Yield ranges, minimum investment, category comparison Q&A | Expand FAQ to cover 5 categories + crypto-specific Qs |
| **07-testimonials.md** | LIGHT UPDATE | Yield ranges, operational model | Keep structure; add category-diverse testimonials |
| **08-comparison.md** | MODERATE UPDATE | Benchmark categories (not named competitors), value equation | Restructure as 5 parallel comparisons |
| **09-pricing.md** | MAJOR REWRITE | Minimum investment (100k), fees per category, value stack | From single price tier to category-flexible pricing |
| **10-cta-footer.md** | LIGHT UPDATE | Dual CTA spec, category slug field mapping | Update form field logic |
| **kategorií/podily.md** (NEW) | NEW FILE | `podily` slug, 9-15% yield, SPV+collateral, 1-7 year tenure | Create per-category deep-dive |
| **kategorií/nemovitosti.md** (NEW) | NEW FILE | `nemovitosti` slug, 8-12% yield, LTV 50-70%, 1-3 year tenure | Repurpose existing RE narrative |
| **kategorií/baterie.md** (NEW) | NEW FILE | `baterie` slug, 7-11% yield, SPV+inspection, 1-8 year tenure | New category narrative |
| **kategorií/kovy.md** (NEW) | NEW FILE | `kovy` slug, 3-6% yield, external custody, 1-15 year tenure | New category narrative |
| **kategorií/krypto.md** (NEW) | NEW FILE | `krypto` slug, 6-18% yield, external custody, MiCA Art. 7 warning | New category + regulatory warning |

---

## 14. Internal Structural Labels (English OK for dev clarity)

```
POSITIONING_TIER: "Curated Multi-Asset Platform for Czech HNWI"
BRAND_NAME: "Milionová Investice"
ENTRY_POINT_CZK: 100000
REINVESTMENT_HORIZON_YEARS: 3-5 (aspirational; depends on category)
PAYOUT_CADENCE: "quarterly" (March, June, September, December)
REGULATORY_FRAMEWORK: "MiCA-aware (crypto), CZK banking regulations (RE/metals), SPV docs (all)"
COPY_LANGUAGE: "Czech (formal Vy/Vám)"
TONE_VECTOR: "Premium + Inclusive + Institutional Rigor"
ZERO_HYPE: true
BANNED_PHRASE_ENFORCEMENT: "linting required before launch"
```

---

## 15. Value Stack (Included with Every Investment)

```
CO ZÍSKÁTE S INVESTICÍ DO MOVITO:

✓ Cílový výnos dle kategorie (9-15% podíly, 8-12% RE, 7-11% baterie, 3-6% kovy, 6-18% krypto)
✓ Asset-specific kolateral (LTV, SPV, fyzická inspekce, external custody dle typu)
✓ Osobní investiční poradce (dostupný v pracovní době, 1:1 relace)
✓ Čtvrtletní reporty s detaily: výkon, kde jsou aktiva, rizikový profil
✓ Čtvrtletní automatické výplaty (březen, červen, září, prosinec)
✓ Transparentní ceny bez skrytých poplatků [struktura poplatků TBD dle kategorie]
✓ Přístup k private deal flow (příští investiční kolo, kategorie dle zájmu)
✓ Due diligence proces & nezávislý odhad (asset-specific)

Vše součástí Vaší investice. Bez skrytých poplatků. Bez call center.
```

---

## 16. Tone & Brand Voice Summary

**Register:** Formal Czech ("Vy/Vám"), professional, premium-but-inclusive
**Personality:** Institutional rigor (due diligence, transparency), not hype
**Visual/narrative framing:** "Kurátorovaná nabídka" = we do the work, you get the reward
**Regulatory posture:** Proactive disclosure, asset-specific caveats (MiCA, collateral, custody), no false guarantees
**Investor archetype:** Czech HNWI or aspirational HNW seeking diversification beyond real estate + banking

---

END OF 00-OFFER-ARCHITECTURE.MD
