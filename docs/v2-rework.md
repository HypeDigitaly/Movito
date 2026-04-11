# Movito v2 Rework — Developer Documentation

## Overview

The Movito website was restructured from a **real-estate-only investment pitch** to a **5-category curated investment platform**. This document covers the architectural changes, file organization, compliance requirements, and verification steps for developers working on or inheriting this codebase.

**Feature branch:** `rework/v2`  
**Implementation period:** 2026-04  
**Status:** Complete (all critical + high + medium issues resolved through 3 review cycles)

---

## 1. What Changed and Why

### Product Transformation
- **Was:** Real-estate-only, €500,000 CZK minimum, premium-exclusive positioning
- **Is now:** 5-category curated platform (Podíly, Nemovitosti, Baterie, Kovy, Krypto), €100,000 CZK entry minimum, "Milionová Investice" brand

### Key Metrics Changed
| Aspect | Old | New |
|--------|-----|-----|
| Entry minimum | 500,000 Kč | 100,000 Kč |
| Phone | +420 608 38 38 38 | +420 603 865 865 |
| Categories | 1 (RE only) | 5 (multi-asset) |
| Yield ranges | 8–12% (RE) | Varies: 9–15% (Podíly), 8–12% (RE), 7–11% (Baterie), 3–6% (Kovy), 6–18% (Krypto) |
| Compliance | RE disclaimers | Full MiCA Art. 7 (crypto), §50a citations, risk-parity disclaimers |

### Positioning Shift
- **Brand:** "Milionová Investice" — passive income from diversified alternatives without operational burden
- **Tone:** Formal Czech "Vy/Vám", premium but inclusive, institutional rigor (transparency, due diligence), zero hype
- **Value equation:** One advisor, one platform, five curated paths, quarterly payouts, reinvest toward €1M goal

---

## 2. File Ownership Map

### Core Files (Ownership Structure)
| File/Directory | Owner | Changes |
|---|---|---|
| `index.html` | Frontend | Hero rewritten; new category selector section (§ C5); all 6 phone lines + nav/footer logos updated; "Marketingové sdělení" strip added; footer legal block expanded to 6 visible sections |
| `copy/00-offer-architecture.md` | Content strategy | Canonical source of truth: category IDs, yield ranges, banned/mandatory phrases, regulatory framework |
| `copy/categories/{id}.md` (5 files) | Content | One per category: podily.md, nemovitosti.md, baterie.md, kovy.md, krypto.md; each has 9-section structure |
| `netlify/functions/_lib/validate.ts` | Backend | Added `category` and `qualified_investor_ack` fields; soft validation (no field errors) |
| `netlify/functions/_lib/contact.ts` | Backend | Passes fields through to notification email |
| `netlify/functions/_lib/email-templates/contact-confirmation.ts` | Email | Renders category + qualified_investor_ack in confirmation email |
| `netlify/functions/contact.ts` | HTTP handler | Updated to carve-out deploy-preview context (URL.parse-based origin check) |

### DO NOT MODIFY WITHOUT APPROVAL
- Any `copy/*.md` files (use 00-offer-architecture.md as canonical)
- Any test files (verify category IDs match exactly)
- Any email templates (risk of breaking GDPR/PII redaction)

---

## 3. Canonical Category IDs

All category references **must use exactly these 5 slugs**. Drift is a breaking bug.

| Slug | Label | Yield Range | Tenure |
|------|-------|-------------|--------|
| `podily` | Podíly ve firmách | 9–15% | 1–7 years |
| `nemovitosti` | Nemovitosti | 8–12% | 1–3 years |
| `baterie` | Bateriová úložiště | 7–11% | 1–8 years |
| `kovy` | Drahé kovy | 3–6% | 1–15 years |
| `krypto` | Krypto | 6–18% | Variable |

### Critical Matching Points
1. **HTML data attributes:** `data-category-id="podily"` on tab buttons
2. **Backend enum in validate.ts:** `ALLOWED_CATEGORIES = ['podily', 'nemovitosti', 'baterie', 'kovy', 'krypto', '']`
3. **Copy files:** `slug: podily` in frontmatter of each category markdown
4. **Email templates:** Render category label via switch/case on the slug
5. **Tests:** Assert exact string matches (case-sensitive)

---

## 4. Compliance Copy Requirements

### 4.1 "Marketingové sdělení" Strip
Located at the top of the page (above navigation), visible on all screen sizes.

**Verbatim text:**
```
Marketingové sdělení — Toto sdělení má pouze informativní charakter a nepředstavuje investiční doporučení ani nabídku k uzavření smlouvy.
```

**Technical notes:**
- Fixed position; `z-index: 998` (below modal, above content)
- `--strip-h: 40px` in CSS variables
- `body { padding-top: var(--strip-h); }` accounts for it
- On mobile (< 768px), uses `white-space: nowrap; text-overflow: ellipsis` to prevent wrapping
- Must not cover the first content row (scroll-padding-top accounts for it)

### 4.2 MiCA Art. 7 Warning (Crypto Panel Only)

**Location:** Krypto category detail panel (both inline and in FAQ Q6).

**Verbatim text:**
```
Kryptoaktiva mohou zcela nebo zčásti ztratit svou hodnotu, nejsou regulována jako tradiční finanční nástroje a nejsou kryta systémem pojištění vkladů.
```

**Technical notes:**
- In HTML: renders in a visually distinct `<aside>` element at the top of the Krypto panel
- In FAQ (copy/02-problem.md Q6): included verbatim in the Q6 answer
- No truncation or paraphrasing; if you modify the text, you break MiCA compliance

### 4.3 Risk Disclaimer (All Categories)

**Mandatory phrasing for all yield claims:**
```
Cílový výnos není zaručen. Minulé výsledky nejsou zárukou výsledků budoucích.
```

**Where it appears:**
- `copy/categories/{id}.md` Section 4 (Očekávaný výnos)
- `copy/00-offer-architecture.md` Section 6.1
- Email confirmation (if applicable)

### 4.4 Banned Phrases (Linting Required)

These phrases **must never** appear in any copy:

```
✗ "garantovaný výnos"
✗ "jistota" (in yield context)
✗ "bez rizika"
✗ "zaručené zhodnocení"
✗ "100% bezpečné"
✗ "bezrizikový"
✗ "dvojnásobek jisté"
✗ "není možné ztratit"
✗ "jisté zhodnocení"
```

### 4.5 §50a Comparison Citations

The comparison table (Section 7 of index.html) includes per-row `<cite>` tags citing §50a compliance. Example:

```html
<td><cite>§50a ČNB</cite> Bankovní vklady jsou pojištěny do 100k EUR</td>
```

---

## 5. Known LOW Issues (Deferred, Non-Blocking)

These items were identified in review cycles but did not block release (per skill rules).

1. **Duplicate `.nav` CSS ruleset** — cosmetic; both definitions are identical (cleanup only)
2. **Hero CTA `data-cta` attribute ignored by GA handler** — all category panel CTAs push `cta_location: 'category-panel'`, mis-attributing hero CTAs to 'hero' (low impact; can be fixed in next GA retag)
3. **`<header>` semantic choice for marketing strip** — arguably should be `<div role="note">` or plain `<div>` (accessibility; `role="note"` has weak SR support)
4. **Checkbox touch target 18×18px vs. WCAG AAA 44×44px** — qualified-investor checkbox in category panels (minor UX)
5. **Duplicate `.nav` rulesets in CSS** — lines ~231–312 have two identical `.nav` sections (consolidate on next refactor)
6. **Marketing strip wrapping on narrow mobile** — now uses `white-space: nowrap` (acceptable; truncates on XS devices)
7. **GA 4 attribution for CTA clicks** — hero CTAs and category panel CTAs both recorded; need channel clarification in GA4 custom events (future)

---

## 6. How to Verify Locally

### Prerequisites
- Node.js 18+
- `npm install` (at repo root)
- Netlify CLI: `npm install -g netlify-cli` (optional, for `netlify dev`)

### TypeScript Check
```bash
npx tsc --noEmit
```
Should complete with 0 errors. If errors appear, the feature branch is not production-ready.

### Manual Verification Checklist

- [ ] **Category selector appears on page**
  - Scroll to "investment-categories" section (~40% down)
  - 5 tab buttons visible: Podíly, Nemovitosti, Baterie, Drahé kovy, Krypto
  - Default active tab: Nemovitosti (aria-selected="true")
  
- [ ] **Keyboard navigation works**
  - Click a tab, then press ArrowRight/ArrowLeft — tab focus moves and panel content updates
  - Press Home/End — jumps to first/last tab
  - Press Enter/Space on focused tab — selects it (visual feedback)
  - **DO NOT press Escape** — reserved for modal handler; won't close tab

- [ ] **Mobile responsiveness**
  - Resize to 375px width (iPhone SE)
  - "Marketingové sdělení" strip appears (single line, ellipsis if text wraps)
  - Category tabs stack or scroll horizontally (design-dependent)
  - Panel content is readable (two-column grid collapses to single column)

- [ ] **Form submission flow**
  - Click a category tab, then click "Začít investovat" CTA in the panel
  - Page scrolls to contact form
  - Inspect the form's hidden `<input name="category">` — should be pre-filled (e.g., value="nemovitosti")
  - Submit the form; on success, check browser console for `window.dataLayer` event with `event: 'cta_click', category: 'nemovitosti', cta_location: 'category-panel'`

- [ ] **Crypto-specific compliance**
  - Click Krypto tab
  - Verify MiCA Art. 7 warning appears in a visually distinct box at the top of the panel
  - Verify text is verbatim: "Kryptoaktiva mohou zcela nebo zčásti..."

- [ ] **Phone numbers updated**
  - Check nav: should display +420 603 865 865 (not +420 608 38 38 38)
  - Check footer: 6 phone lines visible, all should be +420 603 865 865

- [ ] **Banned phrases are absent**
  - Search page source for "garantovaný", "bez rizika", "jisté" — should return 0 hits
  - Search for "Cílový výnos" — should appear multiple times (mandatory)

### Running Netlify Dev (Optional)
```bash
netlify dev
```
Opens local dev server at `http://localhost:8888`.

- POST a test contact form submission to `http://localhost:8888/.netlify/functions/contact`
- Verify response includes `category` and `qualified_investor_ack` fields in the submitted data (if applicable)
- Check that logs do **not** contain API keys, PII, or stack traces (redaction working)

---

## 7. Rollback Plan

All commits on the `rework/v2` feature branch are **atomic per sub-phase** (C1–C9b, A1–A13). If a critical issue is discovered post-merge:

1. **Revert the merge commit** (if on main):
   ```bash
   git revert -m 1 <merge-commit-hash>
   git push origin main
   ```

2. **Or cherry-pick individual atomic commits** to `main` if only some changes are needed:
   - C1–C3: Design tokens + SVG symbols (safe to revert independently)
   - C4–C5: Hero + category selector (can revert if tab widget breaks)
   - C6–C9b: Content + JS refinements (can selectively revert)

3. **Testing after revert:**
   - `npx tsc --noEmit` (confirm no new errors)
   - `netlify dev` (manual smoke test)
   - Deploy to preview URL to confirm old behavior is restored

---

## 8. Design Token & CSS Overrides

Key CSS variables changed in Phase 1 (C1):

| Variable | Old | New | Reason |
|----------|-----|-----|--------|
| `--text-muted` | (legacy) | #58574F | WCAG AA contrast fix |
| `--gold-interactive` | N/A | #6B5009 | New: interactive element deepening |
| `--strip-h` | N/A | 40px | New: marketing strip height constant |
| `body { overflow-x }` | `hidden` | `clip` | Critical: enables sticky sidebars in category panels |
| `.nav__logo-mark { color }` | (inherit) | #FFFFFF | Explicit: ensures white logo mark on gradient |

**Do not modify these tokens without testing mobile layout and sticky sidebar functionality.**

---

## 9. Category Panel Structure (Technical Reference)

Each category panel in the HTML follows this pattern:

```html
<button 
  role="tab" 
  aria-selected="true" 
  aria-controls="panel-nemovitosti"
  tabindex="0"
  data-category-id="nemovitosti"
  class="inv-tab"
>
  Nemovitosti
</button>

<div 
  id="panel-nemovitosti" 
  role="tabpanel" 
  aria-labelledby="tab-nemovitosti"
>
  <!-- 8 content sections + facts block + qualified-investor checkbox + dual CTAs -->
  <!-- Hidden input: <input type="hidden" name="category" value="nemovitosti"> -->
</div>
```

**Critical attributes:**
- `role="tab"` on buttons; `role="tabpanel"` on content divs
- `aria-selected` toggled by JavaScript (true on active, false on inactive)
- `aria-controls` links button to its panel (a11y)
- `data-category-id` used by JS to populate form and GA events
- `tabindex` managed by JS (0 on active, -1 on inactive) — enables roving tabindex pattern

---

## Summary

| Item | Location | Notes |
|------|----------|-------|
| **Category ID canonical** | `copy/00-offer-architecture.md` (§2) | Source of truth; all downstream must match |
| **Yield ranges** | `copy/00-offer-architecture.md` (§3) + category files (§4) | Paired with risk disclaimer always |
| **Compliance copy** | `index.html` (strip + legal block + footer) + copy files | MiCA Art. 7 in Krypto; §50a in comparison table |
| **Category selector widget** | `index.html` (§ C5 lines ~4248–4650) | 5 tabs + 5 panels; keyboard-accessible |
| **Form integration** | `validate.ts` (enum), `contact.ts` (pass-through), email templates | `category` field flows to notification + confirmation |
| **Testing** | Local: typecheck + manual checklist above; preview deploy: form submission smoke test | All LOW issues logged; no blockers |
| **Feature branch** | `rework/v2` | Merge to main after final QA; atomic commits per sub-phase for easy rollback |

---

For questions on specific categories, see `copy/categories/{slug}.md`. For regulatory compliance, see `copy/00-offer-architecture.md` sections 6–8. For form handling, see `netlify/functions/_lib/validate.ts` and contact.ts.
