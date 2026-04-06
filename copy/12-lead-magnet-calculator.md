# Lead Magnet #1: INTERAKTIVNÍ KALKULÁTOR
## "Kolik Vám vydělá Movito?" — Kalkulátor výnosů

**Typ:** Interaktivní webový nástroj (na landing page)
**CTA:** "Zobrazit kalkulaci →"
**Gate:** Výsledky viditelné IHNED, ale detailní PDF report + konzultace = po zadání emailu
**Účel:** Nízko-bariérový vstup → investor si "hraje" s čísly → vidí konkrétní výstup → chce vědět víc

---

## PROČ KALKULÁTOR (a ne PDF)

1. **Nízká bariéra** — žádný závazek, žádný hovor, prostě kliknu
2. **Personalizace** — investor vidí SVÁ čísla, ne generická
3. **Aha moment** — "Wow, z 5M bych měl 125K čtvrtletně?"
4. **Srovnání** — automaticky ukáže vs. banka/byt = okamžitě vidí rozdíl
5. **Engagement** — čas na stránce stoupne, investoři si hrají s posuvníky
6. **Kvalifikace** — podle zadané částky víme, zda je to kvalifikovaný lead

---

## VSTUPNÍ HODNOTY (co investor zadává)

### Vstup 1: Výše investice
```
Label:    "Kolik chcete investovat?"
Typ:      Slider + textové pole
Rozsah:   500 000 Kč — 50 000 000 Kč
Default:  5 000 000 Kč
Krok:     500 000 Kč (do 5M), 1 000 000 Kč (nad 5M)

Vizuální:
  500K ──────●────────────────────── 50M
              5 000 000 Kč
```

### Vstup 2: Doba investice
```
Label:    "Na jak dlouho?"
Typ:      3 tlačítka (radio buttons)
Možnosti: 1 rok | 2 roky | 3 roky
Default:  2 roky
```

### Vstup 3 (volitelný, pokročilý): Reinvestice výnosů
```
Label:    "Chcete výnosy reinvestovat?"
Typ:      Toggle (Ano / Ne)
Default:  Ne (= výplata na účet)
Tooltip:  "Pokud ano, výnosy se přičtou k jistině
           a v dalším čtvrtletí vydělávají také."
```

**TO JE VŠE. Tři vstupy, max. 10 sekund.**

---

## VÝSTUPNÍ HODNOTY (co investor vidí)

### Výstup — Okamžitě viditelný (BEZ emailu)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  VAŠE INVESTICE: 5 000 000 Kč na 2 roky                   │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │  ČTVRTLETNÍ VÝPLATA         125 000 Kč               │  │
│  │                              každé 3 měsíce           │  │
│  │                                                       │  │
│  │  CELKOVÝ VÝNOS ZA 2 ROKY   1 000 000 Kč             │  │
│  │                              (8 výplat)               │  │
│  │                                                       │  │
│  │  NÁVRAT JISTINY             5 000 000 Kč             │  │
│  │                              po 2 letech              │  │
│  │                                                       │  │
│  │  ─────────────────────────────────────────────────    │  │
│  │                                                       │  │
│  │  CELKEM OBDRŽÍTE            6 000 000 Kč             │  │
│  │                              (jistina + výnosy)       │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ⚠️ Cílový výnos 10 % p.a. Skutečný výnos se může lišit.  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Výstup — Srovnávací tabulka (KLÍČOVÝ "aha moment")

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  CO BY STEJNÁ ČÁSTKA VYDĚLALA JINDE:                       │
│                                                             │
│  ┌─────────────────────┬────────────┬────────────────────┐  │
│  │                     │ Za 2 roky  │ Čtvrtletně         │  │
│  ├─────────────────────┼────────────┼────────────────────┤  │
│  │ 🏠 MOVITO           │ 1 000 000  │ 125 000 Kč        │  │
│  │    (cíl. 10 % p.a.) │ Kč         │                    │  │
│  ├─────────────────────┼────────────┼────────────────────┤  │
│  │ 🏦 Spořicí účet     │   400 000  │  50 000 Kč        │  │
│  │    (4 % p.a.)       │ Kč         │                    │  │
│  ├─────────────────────┼────────────┼────────────────────┤  │
│  │ 🏢 Investiční byt   │   250 000  │  31 250 Kč        │  │
│  │    (~2,5 % čistý)   │ Kč         │                    │  │
│  ├─────────────────────┼────────────┼────────────────────┤  │
│  │ 💰 Rozdíl Movito    │ +600 000   │ +75 000 Kč        │  │
│  │    vs. banka        │ Kč         │ čtvrtletně navíc   │  │
│  └─────────────────────┴────────────┴────────────────────┘  │
│                                                             │
│  Za 2 roky získáte o 600 000 Kč VÍCE než na spořicím účtu. │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Výstup — Timeline vizualizace (čtvrtletní výplaty)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ČASOVÁ OSA VAŠICH VÝPLAT:                                 │
│                                                             │
│  Q1 ──→ 125 000 Kč  (březen)                               │
│  Q2 ──→ 125 000 Kč  (červen)                               │
│  Q3 ──→ 125 000 Kč  (září)                                 │
│  Q4 ──→ 125 000 Kč  (prosinec)                             │
│  Q5 ──→ 125 000 Kč  (březen)                               │
│  Q6 ──→ 125 000 Kč  (červen)                               │
│  Q7 ──→ 125 000 Kč  (září)                                 │
│  Q8 ──→ 125 000 Kč  (prosinec) + 5 000 000 Kč jistina     │
│                                                             │
│  CELKEM: 6 000 000 Kč                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## EMAIL GATE + KVALIFIKAČNÍ OTÁZKY — Po zobrazení výsledků

Výsledky kalkulátoru se zobrazí OKAMŽITĚ (žádná bariéra).
Pod výsledky se objeví formulář s kvalifikačními otázkami.

**PROČ kvalifikační otázky:**
1. **Lead scoring** — sales tým ví, koho volat PRVNÍ (hot vs. warm vs. cold)
2. **Personalizace konzultace** — nemusí se ptát na basics, jdou rovnou k věci
3. **Filtrování** — odhalí nekvalifikované leady (studenti, zvědavci)
4. **Psychologický commitment** — kdo vyplní 5 polí, myslí to vážněji než kdo vyplní 2
5. **Segmentace emailů** — jiný email pro "mám 500K poprvé" vs. "mám 20M a zkušenosti"

**PRAVIDLO:** Max 7 polí celkem (víc = drop-off). Povinné jsou 4, volitelné 3.

---

### KROK 1: Kalkulátor (3 vstupy — viz výše)
Investor zadá částku, dobu, reinvestici → vidí výsledky.

### KROK 2: Email gate + kvalifikace

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  CHCETE PERSONALIZOVANÝ REPORT?                            │
│                                                             │
│  Pošleme Vám detailní analýzu na míru:                     │
│                                                             │
│  📊 PDF report s Vaší kalkulací + srovnání                 │
│  📋 Přehled aktuálních investičních příležitostí           │
│  📞 Možnost 30min konzultace s investičním týmem           │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Vaše jméno: *            [________________________]       │
│  Email: *                 [________________________]       │
│  Telefon:                 [________________________]       │
│                                                             │
│  ─── Pomozte nám připravit se na konzultaci ───            │
│                                                             │
│  Kde máte aktuálně uložen kapitál? *                       │
│  ☐ Spořicí účet / termínovaný vklad                        │
│  ☐ Investiční byty / nemovitosti                           │
│  ☐ Akcie / ETF / fondy                                     │
│  ☐ Dluhopisy / P2P platformy                               │
│  ☐ Podnikání (volný cash flow z firmy)                     │
│  ☐ Jiné: _______________                                   │
│                                                             │
│  Máte zkušenosti s investicemi do nemovitostí? *           │
│  ○ Ne, jsem úplný začátečník                               │
│  ○ Ano, vlastním investiční nemovitost                     │
│  ○ Ano, investuji přes platformy (P2P, fondy)             │
│  ○ Ano, aktivně investuji do více nemovitostí              │
│                                                             │
│  Co je pro Vás při investování nejdůležitější?             │
│  ○ Maximální výnos                                         │
│  ○ Bezpečnost a zajištění                                  │
│  ○ Pravidelný pasivní příjem                               │
│  ○ Jednoduchost (nechci se o nic starat)                   │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ☐ Souhlasím se zpracováním osobních údajů *               │
│    [odkaz na zásady]                                       │
│  ☐ Chci dostávat informace o nových investičních           │
│    příležitostech                                          │
│                                                             │
│  [ Odeslat a získat report → ]                             │
│                                                             │
│  Nebo zavolejte: +420 XXX XXX XXX                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

* = povinné pole

---

## KVALIFIKAČNÍ OTÁZKY — Detail

### Q1: Výše investice (UŽ MÁME ze slideru)
```
Zdroj:    Automaticky z kalkulátoru (slider)
Typ:      Číslo
Scoring:  
  · 500K – 1M:     WARM (testovací investor)
  · 1M – 5M:       HOT (seriózní investor)
  · 5M – 20M:      VERY HOT (prioritní)
  · 20M+:           VIP (okamžitý callback)
```

### Q2: Doba investice (UŽ MÁME z kalkulátoru)
```
Zdroj:    Automaticky z kalkulátoru (tlačítka)
Typ:      1 / 2 / 3 roky
Scoring:  Všechny hodnoty kvalifikované (min. je 1 rok)
```

### Q3: Kde máte aktuálně uložen kapitál? (NOVÉ — checkbox, multi-select)
```
Label:    "Kde máte aktuálně uložen kapitál?"
Typ:      Checkbox (více možností)
Povinné:  Ano

Možnosti:
  ☐ Spořicí účet / termínovaný vklad
  ☐ Investiční byty / nemovitosti
  ☐ Akcie / ETF / fondy
  ☐ Dluhopisy / P2P platformy
  ☐ Podnikání (volný cash flow z firmy)
  ☐ Jiné: [textové pole]

PROČ SE PTÁME:
  · Víme, ODKUD peníze přijdou → personalizujeme pitch
  · "Spořicí účet" → zdůrazníme srovnání s bankou (4% vs 10%)
  · "Investiční byty" → zdůrazníme žádné starosti, vyšší výnos
  · "Akcie/ETF" → zdůrazníme stabilitu, reálné zajištění
  · "Podnikání" → zdůrazníme čtvrtletní cash flow, diverzifikaci
  · "P2P platformy" → zdůrazníme nižší LTV, osobní přístup

SCORING:
  · "Spořicí účet" = má volný kapitál, nejsnazší konverze
  · "Podnikání" = aktivní cash flow, může navyšovat
  · "Investiční byty" = zná nemovitosti, už investuje
  · "P2P platformy" = zná model, srovnává
  · Více zaškrtnutých = diversifikovaný investor = vyšší kvalita
```

### Q4: Zkušenosti s nemovitostními investicemi (NOVÉ — radio, single)
```
Label:    "Máte zkušenosti s investicemi do nemovitostí?"
Typ:      Radio buttons (jedna odpověď)
Povinné:  Ano

Možnosti:
  ○ Ne, jsem úplný začátečník
  ○ Ano, vlastním investiční nemovitost
  ○ Ano, investuji přes platformy (P2P, fondy)
  ○ Ano, aktivně investuji do více nemovitostí

PROČ SE PTÁME:
  · "Začátečník" → konzultace musí být edukativní,
    jednoduchý jazyk, více vysvětlování modelu
  · "Vlastním nemovitost" → zná pain (nájemníci, opravy),
    pitch jde rovnou na "bez starostí + vyšší výnos"
  · "Investuji přes platformy" → zná P2P model,
    pitch jde na diferenciaci (nižší LTV, osobní přístup)
  · "Aktivně investuji" → zkušený, chce čísla a detaily,
    kratší intro, rovnou due diligence

SCORING:
  · Začátečník:          WARM (potřebuje edukaci → delší sales cycle)
  · Vlastní nemovitost:  HOT (zná obor, má kapitál)
  · Platformy:           HOT (zná model, porovnává)
  · Aktivně investuje:   VERY HOT (rozhodne se rychle)
```

### Q5: Investiční priorita (NOVÉ — radio, single)
```
Label:    "Co je pro Vás při investování nejdůležitější?"
Typ:      Radio buttons (jedna odpověď)
Povinné:  Ne (volitelné)

Možnosti:
  ○ Maximální výnos
  ○ Bezpečnost a zajištění
  ○ Pravidelný pasivní příjem
  ○ Jednoduchost (nechci se o nic starat)

PROČ SE PTÁME:
  · Ukazuje MOTIVACI investora → co zdůraznit na konzultaci
  · "Max. výnos" → ukázat 10-12% band, srovnání s alternativami
  · "Bezpečnost" → zdůraznit LTV 50-70%, ochranné prvky, SPV
  · "Pasivní příjem" → zdůraznit čtvrtletní výplaty, nulovou správu
  · "Jednoduchost" → zdůraznit 4 kroky, osobní asistent, vše řídíme my

SCORING:
  · Všechny odpovědi kvalifikované (není špatná odpověď)
  · Ale "bezpečnost" + "pasivní příjem" = ideální fit pro Movito
  · "Max. výnos" = může být zklamaný, pokud očekává 20%+
```

---

## ROZŠÍŘENÉ KVALIFIKAČNÍ OTÁZKY (volitelné — pro vyšší kvalifikaci)

Tyto otázky se zobrazí POUZE pokud investor zadal 5M+ v kalkulátoru.
Pro menší částky by to bylo příliš mnoho polí.

### Q6: Časový rámec rozhodnutí (volitelné, 5M+ only)
```
Label:    "Kdy byste chtěli začít investovat?"
Typ:      Radio buttons
Povinné:  Ne

Možnosti:
  ○ Co nejdříve (tento měsíc)
  ○ V nejbližších 1–3 měsících
  ○ Zatím se jen informuji

PROČ SE PTÁME:
  · "Co nejdříve" = URGENTNÍ → sales tým volá do 24h
  · "1-3 měsíce" = HOT → email nurture + follow-up za 2 týdny
  · "Jen se informuji" = WARM → email nurture, žádný tlak

SCORING:
  · Co nejdříve:     VIP PRIORITY (okamžitý callback)
  · 1-3 měsíce:      HOT (standardní follow-up)
  · Jen se informuji: WARM (nurture sequence)
```

### Q7: Jak jste se o nás dozvěděli? (volitelné, vždy)
```
Label:    "Jak jste se o Movito dozvěděli?"
Typ:      Dropdown
Povinné:  Ne

Možnosti:
  - Doporučení od známého
  - LinkedIn
  - Google vyhledávání
  - Email
  - Webinář
  - Jiné: [text]

PROČ SE PTÁME:
  · Attribution → víme, který kanál funguje
  · "Doporučení" = nejvyšší kvalita (referral = trust)
  · Pomáhá optimalizovat marketingový budget
```

---

## LEAD SCORING MODEL

Na základě odpovědí automaticky skórovat leady v CRM (Pipedrive):

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  LEAD SCORING — automatická prioritizace                   │
│                                                            │
│  KRITÉRIUM                    │ BODY                       │
│  ─────────────────────────────│─────────────────────────── │
│  Investiční částka:           │                            │
│    500K – 1M                  │ +10                        │
│    1M – 5M                   │ +25                        │
│    5M – 20M                  │ +40                        │
│    20M+                      │ +60                        │
│                               │                            │
│  Zkušenosti:                  │                            │
│    Začátečník                 │ +5                         │
│    Vlastní nemovitost         │ +15                        │
│    Platformy                  │ +15                        │
│    Aktivně investuje          │ +25                        │
│                               │                            │
│  Zdroj kapitálu:              │                            │
│    Spořicí účet               │ +10 (volný kapitál)        │
│    Podnikání (cash flow)      │ +15 (opakovaný potenciál)  │
│    Investiční byty            │ +10 (zná RE, má majetek)   │
│                               │                            │
│  Časový rámec:                │                            │
│    Co nejdříve                │ +20                        │
│    1-3 měsíce                 │ +10                        │
│    Jen se informuji           │ +0                         │
│                               │                            │
│  Priorita:                    │                            │
│    Bezpečnost/pasivní příjem  │ +10 (ideální fit)          │
│    Jednoduchost               │ +10 (ideální fit)          │
│    Max. výnos                 │ +5                         │
│                               │                            │
│  Zdroj:                       │                            │
│    Doporučení                 │ +15                        │
│    Ostatní                    │ +0                         │
│                               │                            │
│  ═════════════════════════════│═══════════════════════════ │
│                               │                            │
│  CELKEM:                      │ Max 145 bodů               │
│                               │                            │
│  TIER:                        │                            │
│    0-25:   COLD   → email nurture, žádný call              │
│    26-50:  WARM   → email nurture + follow-up za 7 dní     │
│    51-80:  HOT    → callback do 48h                        │
│    81+:    VIP    → callback do 24h, senior sales          │
│                               │                            │
└────────────────────────────────────────────────────────────┘
```

---

## PŘÍKLADY LEAD PROFILŮ

### Příklad A: VIP Lead (score: 105)
```
Částka: 15M (40) + Aktivně investuje (25) + Podnikání (15)
+ Co nejdříve (20) + Doporučení (15) = 115 bodů → VIP

AKCE: Senior sales volá do 4 hodin. Připraví konkrétní
projekt na míru. Osobní schůzka.
```

### Příklad B: HOT Lead (score: 65)
```
Částka: 3M (25) + Vlastní nemovitost (15) + Spořicí účet (10)
+ 1-3 měsíce (10) + Bezpečnost (10) = 70 bodů → HOT

AKCE: Sales volá do 48h. Pošle PDF report + příklad projektu.
Nabídne konzultaci.
```

### Příklad C: WARM Lead (score: 30)
```
Částka: 500K (10) + Začátečník (5) + Spořicí účet (10)
+ Jen se informuji (0) + Max. výnos (5) = 30 bodů → WARM

AKCE: Email nurture (6 emailů / 17 dní). Žádný call
pokud se sám neozve. Edukativní obsah.
```

### Příklad D: COLD Lead (score: 15)
```
Částka: 500K (10) + Začátečník (5) + Jen se informuji (0)
= 15 bodů → COLD

AKCE: Email nurture only. Pravděpodobně zvědavec
nebo student. Neplýtvat sales časem.
```

---

## VÝPOČETNÍ LOGIKA (pro developera)

```javascript
// Vstupy
const investice = 5000000;        // Kč (slider)
const roky = 2;                   // 1, 2 nebo 3
const reinvestice = false;        // toggle
const cilovy_vynos = 0.10;        // 10% p.a. (fixní)

// Výpočty
if (!reinvestice) {
    // Jednoduchý úrok
    const ctvrtletni_vyplata = investice * cilovy_vynos / 4;
    const pocet_vyplat = roky * 4;
    const celkovy_vynos = ctvrtletni_vyplata * pocet_vyplat;
    const celkem_obdrzite = investice + celkovy_vynos;
} else {
    // Složený úrok (čtvrtletní kapitalizace)
    const q_rate = cilovy_vynos / 4;  // 2.5% per quarter
    const pocet_ctvrtroku = roky * 4;
    const konecna_hodnota = investice * Math.pow(1 + q_rate, pocet_ctvrtroku);
    const celkovy_vynos = konecna_hodnota - investice;
}

// Srovnání
const banka_vynos = investice * 0.04 * roky;           // 4% p.a.
const byt_vynos = investice * 0.025 * roky;             // 2.5% čistý
const rozdil_vs_banka = celkovy_vynos - banka_vynos;
const rozdil_vs_byt = celkovy_vynos - byt_vynos;
```

### Srovnávací sazby (hardcoded, aktualizovat ročně):

```
BANKA:            4.0 % p.a. (spořicí účet, průměr ČR 2026)
INVESTIČNÍ BYT:   2.5 % p.a. (čistý po nákladech, Praha)
NEMOVITOSTNÍ FOND: 6.0 % p.a. (průměr českých RE fondů)
MOVITO:          10.0 % p.a. (cílový výnos — NE garantovaný)
```

---

## PŘÍKLADY VÝSTUPŮ (pro různé částky)

### Investor A: 500 000 Kč / 1 rok
```
Čtvrtletní výplata:     12 500 Kč
Celkový výnos za rok:   50 000 Kč
Celkem obdržíte:        550 000 Kč

vs. Banka:              20 000 Kč (4%)
vs. Byt:                12 500 Kč (2.5%)
Rozdíl vs. banka:       +30 000 Kč
```

### Investor B: 2 000 000 Kč / 2 roky
```
Čtvrtletní výplata:     50 000 Kč
Celkový výnos za 2 roky: 400 000 Kč
Celkem obdržíte:        2 400 000 Kč

vs. Banka:              160 000 Kč
vs. Byt:                100 000 Kč
Rozdíl vs. banka:       +240 000 Kč
```

### Investor C: 5 000 000 Kč / 2 roky
```
Čtvrtletní výplata:     125 000 Kč
Celkový výnos za 2 roky: 1 000 000 Kč
Celkem obdržíte:        6 000 000 Kč

vs. Banka:              400 000 Kč
vs. Byt:                250 000 Kč
Rozdíl vs. banka:       +600 000 Kč
```

### Investor D: 10 000 000 Kč / 3 roky
```
Čtvrtletní výplata:     250 000 Kč
Celkový výnos za 3 roky: 3 000 000 Kč
Celkem obdržíte:        13 000 000 Kč

vs. Banka:              1 200 000 Kč
vs. Byt:                750 000 Kč
Rozdíl vs. banka:       +1 800 000 Kč
```

### Investor E: 50 000 000 Kč / 3 roky
```
Čtvrtletní výplata:     1 250 000 Kč
Celkový výnos za 3 roky: 15 000 000 Kč
Celkem obdržíte:        65 000 000 Kč

vs. Banka:              6 000 000 Kč
vs. Byt:                3 750 000 Kč
Rozdíl vs. banka:       +9 000 000 Kč
```

---

## UX POZNÁMKY

1. **Slider je primární interakce** — velký, touch-friendly, okamžitá reakce
2. **Čísla se mění v reálném čase** — žádné "vypočítat" tlačítko, vše živě
3. **Srovnávací tabulka je "aha moment"** — musí být vizuálně výrazná
4. **Rozdíl vs. banka** zvýraznit zeleně a velkým fontem
5. **Mobile-first** — slider musí fungovat na dotyk
6. **Disclaimer** vždy viditelný pod kalkulátorem
7. **CTA na email gate** — až PO zobrazení výsledků (ne místo nich)

---

## DISCLAIMER POD KALKULÁTOREM (mandatory)

```
⚠️ Tato kalkulace je orientační a vychází z cílového výnosu
10 % p.a. Skutečný výnos se může lišit a není zaručen.
Investice není chráněna systémem pojištění vkladů.
Minulé výnosy nejsou zárukou budoucích výnosů.
Před investicí doporučujeme konzultaci s finančním poradcem.
```
