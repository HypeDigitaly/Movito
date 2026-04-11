# Movito Group — Sales Page Copy & Materials

## Struktura souborů

### /copy/ — Textace prodejní stránky

| Soubor | Obsah |
|--------|-------|
| `00-offer-architecture.md` | Celková architektura nabídky (Hormozi framework), value equation, value stack, CTA hierarchie, tone rules, category IDs, yield ranges, banned phrases, mandatory phrasing — **CANONICAL SOURCE OF TRUTH** |
| `01-hero.md` | Hero sekce: 6 headline variant, subheadlines, CTA, trust bar |
| `02-problem.md` | Problem agitation: bankovní vklady, investiční byty, fondy, krypto |
| `03-solution.md` | Solution reveal: Movito model, proč 10%, klíčové výhody |
| `04-credibility.md` | Trust & credibility: metriky, tým (template), testimonials (template), case study, partneři |
| `05-process.md` | Jak to funguje: 4 kroky, příklad výpočtu |
| `06-risk-safety.md` | Rizika a bezpečnost: 3 scénáře (default, pokles cen, likvidita) |
| `07-comparison.md` | Srovnění: tabulka + narativ (vs. banka, byt, fondy — BEZ jmen konkurentů) |
| `08-protective-elements.md` | Ochranné prvky: LTV, SPV, reporting, due diligence (NE "záruky") |
| `09-faq.md` | FAQ: 10 otázek a odpovědí |
| `10-final-cta.md` | Závěrečné CTA: closing copy, buttons, telefon |

### /copy/categories/ — Kategorie investic (nové v2)

Pět kategorií se specifickým copy, yield ranges, a regulatorní framing:

| Soubor | Obsah | Minimální investice |
|--------|-------|-------------------|
| `podily.md` | Podíly na podnicích — equity-like exposure | 100 tis. Kč |
| `nemovitosti.md` | Nemovitosti — collateralized real estate debt | 100 tis. Kč |
| `baterie.md` | Baterie — commodity + ESG exposure | 100 tis. Kč |
| `kovy.md` | Drahé kovy — hedging + store of value | 100 tis. Kč |
| `krypto.md` | Krypto — digital assets (high risk label) | 100 tis. Kč |

Každý soubor obsahuje:
- Headline a subheadline pro kategorii
- 3–5 key benefits
- Risk/reward positioning
- Cílový výnos range (z `00-offer-architecture.md`)
- Typické příklady nebo case study
- CTA pro deep-dive

### /compliance/ — Právní texty

| Soubor | Obsah |
|--------|-------|
| `disclaimers.md` | 7 povinných disclaimerů v češtině + kompletní footer |

### /research/ — Research & analýzy

| Soubor | Obsah |
|--------|-------|
| `competitive-analysis.md` | Analýza konkurence (Investown, Upvest, Ronda Invest), benchmarky, Inizia marketing reference |
| `hormozi-framework.md` | Hormozi $100M Offers framework aplikovaný na Movito |
| `objection-handling.md` | 8 objection handling scriptů pro konzultační hovory |

---

## Pořadí sekcí na stránce

```
1.  Hero + Trust Bar
2.  Problem Agitation
3.  Solution Reveal
4.  Credibility & Trust     ← přesunuto nahoru (z pozice 6)
5.  Jak to funguje (4 kroky)
6.  5 kategorií (carousel nebo grid)
7.  Rizika a bezpečnost     ← rozšířená sekce pro HNWI
8.  Srovnění s alternativami
9.  Ochranné prvky
10. FAQ
11. Závěrečné CTA
12. Footer (disclaimery)
```

---

## Klíčová pravidla pro copy

1. **Formální "Vy"** všude — žádné tykání
2. **Specifická čísla** > vágní sliby
3. **"Cílový výnos"** — nikdy "garantovaný" nebo "typický"
4. **Risk warnings** se stejnou vizuální prominencí jako return claims
5. **Žádná jména konkurentů** — srovnávat kategorie (fondy, banky, přímé vlastnictví)
6. **Žádné fake ceny** u bonusů ve value stacku
7. **Žádná umělá urgence** — pouze faktické údaje o kapacitě
8. **Disclaimery** jsou povinné, ne volitelné
9. **Generalizované minimum** — 100 tis. Kč (ne 500 tis.)
10. **Pět kategorií, jeden rámec** — copy se v kategoriích liší, ale architektura (value equation, yield positioning) je konzistentní

---

## Kanál pro updaty a governance

- **Změny v kategoriích, yield ranges, nebo mandatory phrasing**: aktualizujte `00-offer-architecture.md` VŽDY PRVNÍ
- **Poté aktualizujte jednotlivé kategorické soubory** v `categories/`
- **Nikdy neměňte `00-offer-architecture.md` bez toho, aby byly všechny kategorie v souladu**

---

## Status

- [x] 11 existujících copy souborů (00-10) — přepsáno pro 5 kategorií
- [x] Nový `copy/categories/` subdirectory s 5 soubory
- [x] `00-offer-architecture.md` je canonical source of truth
- [ ] Právní review (BLOCKING — nutno před implementací)
- [ ] Klient doplní: reálná čísla (investoři, AUM, track record)
- [ ] Klient doplní: tým (jména, pozice, zkušenosti)
- [ ] Klient doplní: testimonials (se souhlasem investorů)
- [ ] Klient doplní: regulatorní status (po konzultaci s právníkem)
- [ ] Implementace do HTML
