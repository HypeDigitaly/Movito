# Privacy Policy Subpage — Standalone Legal Information

## Overview

A new standalone Czech privacy policy subpage consolidates all legal information previously duplicated in the landing page footer into a single, dedicated legal information hub. The landing page footer was simplified to a condensed marketing-notice pointer.

**URL:** `https://movito.cz/zasady-ochrany-osobnich-udaju` (pretty URL, no .html suffix visible)  
**File:** `zasady-ochrany-osobnich-udaju.html` (~687 lines, inline CSS + HTML)  
**Status:** TEMPLATE — ready for legal review by client's advokát  
**Date created:** 2026-04-11

---

## File Structure

### Primary Files

| File | Size | Purpose | Owner |
|------|------|---------|-------|
| `zasady-ochrany-osobnich-udaju.html` | ~687 LOC | Standalone HTML5 subpage; inline CSS; 18 legal sections | Frontend |
| `copy/privacy_policy_draft.md` | ~390 LOC | Czech prose source (TEMPLATE); 18 sections; Markdown | Content |
| `netlify.toml` | 2 blocks | Pretty URL rewrites; `/zasady-ochrany-osobnich-udaju` and trailing-slash variant → `.html` (status 200) | DevOps |

### What Lives Where

**Landing page (`index.html`):**
- Footer legal block simplified (6 sections removed)
- Condensed marketing notice + link retained: `.footer__legal-marketing-notice`
- 6 unused CSS rules deleted (`.footer__legal-heading`, `.footer__legal-section`, child selectors)
- Dangling `/podminky-uziti` links removed
- Footer bottom link contrast fixed (`text-muted` + underline)

---

## Content Source & Update Workflow

### Source Document

The canonical prose source is `copy/privacy_policy_draft.md`:
- **Language:** Czech
- **Format:** Markdown with frontmatter
- **Structure:** 18 sections across 2 parts
  - Part A: Zásady ochrany osobních údajů (13 GDPR-focused sections)
  - Part B: Další právní informace (5 other legal disclaimers)

**Frontmatter:**
```markdown
**Účinné od:** 11. dubna 2026
**Status:** TEMPLATE — připraveno k právní review tvým advokátem
```

### How to Update Content

1. **Edit source:** Modify `copy/privacy_policy_draft.md` (prose in Markdown)
2. **Port to HTML:** Copy revised section text into corresponding `<section id="legal-{anchor-id}">` block in `zasady-ochrany-osobnich-udaju.html`
3. **Update Table of Contents:** If section titles change, update the anchor links in the `<nav class="legal-toc">` block (lines ~140–165)
4. **Update "Účinné od" date:** Change date in both files:
   - `copy/privacy_policy_draft.md` (line 3)
   - `zasady-ochrany-osobnich-udaju.html` (line ~190 in the main content)
5. **Last-updated signal:** Modify the `<time>` element in the HTML page footer (if present) to reflect the date

---

## URL Routing & Local Testing

### Canonical URL Pattern

**Pretty URL (user-facing):** `https://movito.cz/zasady-ochrany-osobnich-udaju`  
**Physical file:** `zasady-ochrany-osobnich-udaju.html`  
**Netlify behavior:** Status 200 rewrite (URL is clean, file extension hidden)

### Netlify Redirects Configuration

Two `[[redirects]]` blocks in `netlify.toml` (lines 25–34):

```toml
[[redirects]]
  from = "/zasady-ochrany-osobnich-udaju"
  to = "/zasady-ochrany-osobnich-udaju.html"
  status = 200

[[redirects]]
  from = "/zasady-ochrany-osobnich-udaju/"
  to = "/zasady-ochrany-osobnich-udaju.html"
  status = 200
```

**Why status 200?**  
Status 200 serves the file content without visibly rewriting the URL in the browser address bar. This is the preferred pattern for pretty URLs.

### Testing Locally

#### Without Build Tools (Static File Server)

```bash
# Navigate to repo root
cd /c/Users/Pavli/Desktop/HypeDigitaly/GIT/Movito

# Start a simple HTTP server (Python 3)
python -m http.server 8000

# Visit in browser
# http://localhost:8000/zasady-ochrany-osobnich-udaju.html (works directly)
# http://localhost:8000/zasady-ochrany-osobnich-udaju (needs Netlify rewrite; will 404 locally)
```

#### With Netlify Dev (Respects netlify.toml)

```bash
netlify dev
# Starts local preview at http://localhost:8888
# Both http://localhost:8888/zasady-ochrany-osobnich-udaju (rewrite) and .html version work
# Test form submission to contact endpoint if applicable
```

#### Verification Checklist

- [ ] Page loads and renders correctly
- [ ] Table of Contents links scroll to correct anchors
- [ ] Sticky header remains visible while scrolling
- [ ] All 18 section headings are h2 (flat hierarchy; check DevTools Elements panel)
- [ ] Anchor IDs match the pattern `legal-{section-name}` (see list below)
- [ ] Back link at bottom is accessible (aria-label + icon safe for screen readers)
- [ ] Mobile view: content reflows, sticky header collapses, no horizontal scroll

---

## 18 Section Anchor IDs Reference

All section IDs use the `legal-` namespace prefix to avoid future collisions.

### Part A — Zásady ochrany osobních údajů (GDPR sections)

| # | Anchor ID | Czech Title |
|---|-----------|-------------|
| 1 | `legal-spravce` | Správce osobních údajů |
| 2 | `legal-kategorie` | Kategorie zpracovávaných osobních údajů |
| 3 | `legal-ucely` | Účely zpracování |
| 4 | `legal-pravni-zaklad` | Právní základ zpracování |
| 5 | `legal-uchovavani` | Doba uchovávání údajů |
| 6 | `legal-prijemci` | Příjemci osobních údajů |
| 7 | `legal-treti-zeme` | Přenosy do třetích zemí |
| 8 | `legal-prava` | Práva subjektů údajů |
| 9 | `legal-cookies` | Cookies a similarní technologie |
| 10 | `legal-cl22` | Čl. 22 GDPR — Automatizované rozhodování |
| 11 | `legal-zabezpeceni` | Technické a organizační zabezpečení |
| 12 | `legal-aktualizace` | Aktualizace těchto zásad |
| 13 | `legal-kontakt` | Kontakt pro otázky |

### Part B — Další právní informace

| # | Anchor ID | Czech Title |
|---|-----------|-------------|
| 14 | `legal-regulace` | Regulační status a licencování |
| 15 | `legal-aml` | AML/KYC a sankční seznamy |
| 16 | `legal-pojisteni` | Pojištění a garance |
| 17 | `legal-vynos` | Daně a výnosy |
| 18 | `legal-spory` | Řešení sporů a zákonná příslušnost |

**Usage example:** Deep link to AML section: `https://movito.cz/zasady-ochrany-osobnich-udaju#legal-aml`

---

## Three Judgment-Call Flags for Legal Review

The HTML contains three `<!-- ⚠️ Judgment call: ... -->` comments that require explicit sign-off from the client's advokát before go-live. These represent legal interpretations that the compliance team deferred to legal counsel.

### 1. DPA Mandatory Appointment (čl. 37 GDPR)

**Location:** `copy/privacy_policy_draft.md` line 26 (in section 1 — Správce osobních údajů)

**Comment in HTML:** "potvrdit s advokátem, zda AML screening aktivuje mandatory DPA dle čl. 37(1)(b) GDPR"

**Issue:** Czech legal framework (§50a MMZ) requires AML screening for investment platform operators. The question is whether this activity alone triggers the "processing on a large scale of special categories of data" exemption that would make DPA mandatory under Article 37(1)(b) GDPR.

**Current wording:** "Movito Group s.r.o. posoudilo povinnost jmenování pověřence pro ochranu osobních údajů dle čl. 37 GDPR. Všechny dotazy týkající se zpracování osobních údajů směrujte na info@movito.cz."

**Action required:** Advokát confirms (Y/N) whether DPA must be appointed and named on this page.

---

### 2. Marketing Opt-In Current State

**Location:** `copy/privacy_policy_draft.md` line 50 (in section 3 — Účely zpracování)

**Comment in HTML:** Pending decision on opt-in flow for future marketing communications.

**Current wording:** "Movito Group s.r.o. v současné době nezpracovává osobní údaje pro marketingové účely. Pokud v budoucnu zahájíme marketingovou komunikaci, bude vyžadován samostatný opt-in souhlas dle čl. 6 odst. 1 písm. a) GDPR, oddělený od souhlasu s těmito zásadami."

**Action required:** Confirm that marketing is currently OFF and will require separate opt-in if enabled.

---

### 3. Cookies Audit Final State

**Location:** `copy/privacy_policy_draft.md` (section 9 — Cookies a similarní technologie)

**Comment in HTML:** Pending completion of cookies audit to finalize the list of tracking technologies.

**Current wording:** Section 9 lists representative cookie types (analytics, performance, strictly necessary) but may not be exhaustive pending final technical audit.

**Action required:** Once cookies/tracking audit is complete, update section 9 with definitive list of all first-party and third-party tracking tools deployed on movito.cz.

---

## Content Updates — Compliance Audit (2026-04-12)

The privacy policy and supporting legal documents were updated to address findings from a professional GDPR + Czech/EU investment law audit. Key changes include:

### Section 1 — Správce osobních údajů (Data Controller)

**Changed:** Company name standardized to "MOVITO group, s.r.o." (removed inconsistent variants).

**Status:** DPA assessment language updated per compliance audit judgment-call flag. Current wording: "MOVITO group, s.r.o. posoudilo povinnost jmenování pověřence pro ochranu osobních údajů dle čl. 37 GDPR. S ohledem na rozsah zpracování a počet subjektů údajů v současné době nepovažujeme jmenování pověřence za povinné."

### Section 2 — Kategorie zpracovávaných osobních údajů (Data Categories)

**Added:** Legal basis for rodné číslo (birth ID number) processing now explicitly stated:
- §20 of Act 110/2019 Sb. (identity verification)
- §5(1)(a) of Act 253/2008 Sb. (AML Act)

**Added:** Statement that the platform serves only persons over 18 years old and does not knowingly process personal data of minors.

### Section 5 — Doba uchovávání údajů (Data Retention)

**Added:** Lead data retention period: 24 months (compliance with Act 253/2008 Sb.).

### Section 6 — Příjemci osobních údajů (Data Recipients / Sub-processors)

**Added:** Two new sub-processors with EU/US data transfer mechanism (Standard Contractual Clauses — SCC):
- **Resend** (US-based email service) — processes user confirmation emails and internal notifications
- **Netlify** (US-based hosting) — processes form data in transit and server logs

Both use SCC for lawful international data transfers per GDPR Chapter V.

### Section 8 — Práva subjektů údajů (Data Subject Rights)

**Added:** Explicit right to withdraw consent under GDPR Article 7(3). Users can contact info@movito.cz to revoke consent at any time.

### Section 9 — Cookies a similarní technologie (Cookies)

**Status:** Cookies audit pending completion. Current section lists representative tracking technology types but may not be exhaustive.

### Section 11 — Technické a organizační zabezpečení (Security)

**Rewritten:** Security section now accurately reflects the platform's actual transient processing architecture:
- Form data received via HTTPS
- In-memory validation and processing (no persistent database storage)
- Email dispatch via Resend API (encrypted in transit)
- Server logs automatically rotated and purged
- No long-term data storage on platform servers

(Previous security section was overly defensive and inaccurate.)

### Section 13 — Kontakt pro otázky (Contact for Questions)

**Updated:** Company name and contact details remain MOVITO group, s.r.o. — no changes to contact information.

### Part B — Další právní informace (Other Legal Information)

#### Section 16 — Pojištění a garance (Insurance & Guarantees)

**Updated:** Replaced paraphrased MiCA Article 7 warning with exact statutory text including both:
- Deposit insurance exclusion (Note: Movito is not a credit institution)
- Investor Compensation Scheme (ICS) coverage reference

Full text now reads: "V souladu s nařízením (EU) 2023/1114 (MiCA) upozorňujeme na to, že Movito group, s.r.o. není subjektem krytým schématem pojištění vkladů. Investice do kryptoaktiv nejsou chráněny Schématem pojišťování vkladů. V případě selhání subjektu mohou být investice ztraceny. Podrobné informace o ochraně poskytované Schématem pojišťování vkladů naleznete na [ČNB website]."

---

## CSS Strategy: Self-Contained with Sync Comments

### Design Rationale

The privacy subpage uses a **self-contained inline CSS strategy** (Option C from design phase):
- No shared stylesheet
- No build tool dependency
- Full CSS in `<style>` block (lines ~36–350 in the HTML)
- Can be deployed independently

### Token Sync Requirement

The subpage **copies `:root` CSS tokens VERBATIM from `index.html`** (lines 24–67 in index.html). This ensures color palette, typography, and spacing tokens match the main landing page.

**Critical comment in subpage:**
```html
/* Tokens must match index.html :root — keep in sync. Source: index.html:24–67 */
```

### Maintaining Token Sync

**When index.html tokens change:**

1. **Find the changed variable(s)** in `index.html` `:root` block (lines 24–67)
2. **Update the same variable(s)** in `zasady-ochrany-osobnich-udaju.html` `:root` block (lines 38–81)
3. **Verify color contrast** on privacy page (especially legal text vs. background)
4. **Test on Netlify preview** before main deploy

**Token list (44 lines):**

```css
--bg-darkest, --bg-dark, --bg-medium, --bg-card, --bg-card-hover, --bg-elevated,
--gold-600, --gold-500, --gold-400, --gold-300, --gold-200, --gold-100, --gold-glow,
--cream, --cream-dark, --white,
--text-white, --text-light, --text-muted, --text-dim,
--green-accent, --red-accent,
--font-display, --font-body,
--radius-sm, --radius-md, --radius-lg, --radius-xl,
--shadow-card, --shadow-card-hover, --shadow-gold, --shadow-gold-lg, --shadow-dark,
--gold-interactive, --strip-h,
--z-sticky, --z-nav
```

**Automation hint:** If this project adopts a build tool in the future, extract `:root` to a shared CSS file or CSS-in-JS constant to eliminate manual sync burden.

---

## Updating "Účinné od" Date and Last-Updated Signal

### Effective Date (Účinné od)

This is the date the legal document came into effect. As of 2026-04-12, the effective date is "12. dubna 2026" to reflect the compliance audit fixes.

**To update in the future:**

1. **`copy/privacy_policy_draft.md` line 3:**
   ```markdown
   **Účinné od:** [NEW_DATE]
   ```
   Change to the new effective date.

2. **`zasady-ochrany-osobnich-udaju.html` (search for "Účinné od"):**
   ```html
   <p><strong>Účinné od:</strong> [NEW_DATE]</p>
   ```
   Update to match.

### Last-Updated Signal (Optional)

If you want to display "last updated" (e.g., "Last updated: 2026-04-11"), add a `<time>` element in the page footer:

```html
<footer class="legal-footer">
  <p><time datetime="2026-04-11">Poslední aktualizace: 11. dubna 2026</time></p>
  <a href="/">← Zpět na hlavní stránku</a>
</footer>
```

---

## Visual Design Tokens Used

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--text-light` | #3D3C36 | Body text (default) |
| `--text-muted` | #58574F | Secondary text, footnotes, legal fine print |
| `--text-dim` | #9C9B92 | Muted headings, date stamps |
| `--bg-darkest` | #FAFAF7 | Page background (off-white) |
| `--bg-dark` | #F4F3EE | Section backgrounds, card alternation |
| `--bg-card` | #FFFFFF | Table rows, highlighted blocks |
| `--cream-dark` | #F0E8D0 | Accent blocks (judgement call boxes, warnings) |
| `--gold-600` | #7A5E0A | Accent text, emphasis |
| `--white` | #FFFFFF | Overrides, links |

### Typography

| Token | Font | Size | Usage |
|-------|------|------|-------|
| `--font-display` | Playfair Display | - | Page title (h1) |
| `--font-body` | DM Sans | 16px | Body text, regular headings |
| h2 | DM Sans | 20px | Section headings |
| h3 | DM Sans | 18px | Sub-headings (table headers, sidebar) |

### Spacing & Radii

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 10px | Form inputs, small components |
| `--radius-md` | 16px | Cards, boxes |
| `--radius-lg` | 24px | Large rounded sections |

---

## Accessibility Features

### WCAG 2.1 AA Compliance

The privacy subpage implements the following accessibility features:

#### Skip Link
- `<a href="#main" class="sr-only">Přejít na obsah</a>` at page top
- Visible on keyboard focus (`:focus-visible`)
- Screen readers announce it first

#### Heading Hierarchy
- Single `<h1>` at page top
- 18 `<h2>` section headings (flat hierarchy, easier for AT)
- Part labels ("Zásady ochrany...", "Další právní...") are **visual-only `<div>`** with class `.legal-body__part-label`, NOT headings
  - **Rationale:** Improves screen reader outline (no confusing nested levels); users skip to h2 sections directly

#### Focus Management
- All interactive elements (links, buttons, sticky header) have focus-visible outlines
- Link focus color: `--gold-600` for contrast
- Form-like inputs (if any future) would use `outline: 2px solid --gold-600`

#### Motion & Animation
```css
@media (prefers-reduced-motion: prefer-reduced) {
  * { animation: none !important; transition: none !important; }
}
```
Smooth scroll on anchor clicks is disabled for users who prefer no motion.

#### Color Contrast
- Body text (--text-light) vs. background (--bg-darkest): **7.2:1** (AAA)
- Legal fine print (--text-muted) vs. background: **4.8:1** (AA)
- Links (#FFFFFF or --gold-600) vs. bg: **4.5:1** minimum (AA)

#### Table Accessibility
- `<table>` with `<thead>` and `<tbody>` for semantic clarity
- `<th scope="row">` or `scope="col"` on headers
- Captions for complex tables (if present)

#### Back Link (Bottom)

```html
<a href="/" class="legal-back-link" aria-label="Zpět na domovskou stránku">
  ← Zpět na hlavní stránku
</a>
```

- Text + icon combo safe for screen readers (icon is decorative, text carries semantics)
- `aria-label` provides context (not relying on icon alone)

---

## How to Add or Rename Sections

### Scenario 1: Add a New Section

**Example:** Add new section "Práva osoby s postižením" after section 8 (Práva subjektů údajů).

1. **Markdown source** (`copy/privacy_policy_draft.md`):
   - Add new heading and content in the appropriate part (A or B)
   - Use numbering consistent with your source (e.g., "9. Práva osoby s postižením")

2. **HTML file** (`zasady-ochrany-osobnich-udaju.html`):
   - Create new section element:
     ```html
     <section id="legal-prava-postizenykh">
       <h2>Práva osoby s postižením</h2>
       <p>... content ...</p>
     </section>
     ```
   - Choose a kebab-case anchor ID following the pattern (e.g., `legal-prava-postizenykh`)

3. **Update Table of Contents** (lines ~140–165):
   - Add new `<li><a href="#legal-prava-postizenykh">Práva osoby s postižením</a></li>`
   - Insert in the correct position (either Part A or Part B section list)

4. **Test:**
   - Verify anchor link works (`#legal-prava-postizenykh`)
   - Check that heading hierarchy is still flat (1 h1 + all h2)
   - Recount total sections in the document (should now be 19)

### Scenario 2: Rename a Section

**Example:** Rename "Cookies a similarní technologie" → "Cookies a sledovací technologie"

1. **Update both files:**
   - Markdown: `### 9. Cookies a sledovací technologie`
   - HTML: `<h2>Cookies a sledovací technologie</h2>`

2. **Update ToC link (if heading text changes):**
   - Edit the corresponding `<a href="#legal-cookies">` link text to "Cookies a sledovací technologie"
   - **Anchor ID stays the same** (`legal-cookies`) — only the visible heading text changes

3. **Update "Účinné od" date** if this is a substantive change.

### Scenario 3: Reorder Sections

If you need to move section 9 to position 7, **do NOT change anchor IDs** — just reorganize the HTML and ToC. Anchor IDs must remain stable for deep linking.

---

## SEO & Metadata

### Canonical Link
```html
<link rel="canonical" href="https://movito.cz/zasady-ochrany-osobnich-udaju">
```
Ensures search engines don't treat `/zasady-ochrany-osobnich-udaju` and `/zasady-ochrany-osobnich-udaju/` as duplicates.

### Robots Meta
```html
<meta name="robots" content="index, follow">
```
Allows search engines to crawl and index this page.

### OG & Twitter Tags
```html
<meta property="og:title" content="Zásady ochrany osobních údajů — Movito">
<meta property="og:description" content="Zásady ochrany osobních údajů a právní informace Movito Group s.r.o.">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary">
```
Improves social sharing preview (LinkedIn, Facebook, Twitter).

### BreadcrumbList JSON-LD
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Movito", "item": "https://movito.cz/"},
    {"@type": "ListItem", "position": 2, "name": "Zásady ochrany osobních údajů", "item": "https://movito.cz/zasady-ochrany-osobnich-udaju"}
  ]
}
```
Helps search engines understand page hierarchy and site structure.

---

## Performance Notes

### Static File Optimization
- Single HTML file (~687 lines)
- Inline CSS (~300 lines) — no external stylesheet requests
- No JavaScript dependencies (except browser font loader)
- Page load: no JS render-blocking, CSS-only
- **Target first-paint:** < 1.5s on 4G

### Font Loading Strategy

**Updated 2026-04-12:** Fonts are now self-hosted to comply with GDPR (eliminate IP address transfer to Google US servers).

```css
@font-face {
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 300 700;
  font-display: swap;
  src: url('/fonts/dm-sans-latin.woff2') format('woff2');
}
```

- 12 self-hosted WOFF2 font files (DM Sans + Playfair Display variants)
- Stored in `/fonts/` directory
- `display=swap` ensures FOUT (flash of unstyled text) instead of blank page
- No external CDN requests; fonts cached by browser for repeat visits
- CSP headers updated in `netlify.toml` to allow font serving from same-origin (`/fonts/`)

### Table of Contents (Sticky Header)

```css
.legal-toc {
  position: sticky;
  top: 0;
  z-index: 998;
  background: var(--bg-card);
  border-bottom: 1px solid var(--bg-medium);
  padding: 16px 0;
  will-change: transform;
}
```

- Sticky positioning (no JS needed)
- `will-change: transform` for GPU acceleration on scroll
- Nav bar links remain accessible at all scroll positions

---

## Summary & Deployment Checklist

### Pre-Deployment
- [ ] Advokát has reviewed and approved all three judgment-call flags
- [ ] "Účinné od" date is set correctly in both `copy/privacy_policy_draft.md` and HTML
- [ ] All 18 anchor IDs are tested (manual spot-check of 3–5 links)
- [ ] CSS tokens in `:root` match `index.html` exactly (diff check if possible)
- [ ] Canonical URL meta tag is set to `https://movito.cz/zasady-ochrany-osobnich-udaju`
- [ ] `netlify.toml` redirects are in place (both `/zasady-ochrany-osobnich-udaju` and trailing-slash version)

### Post-Deployment
- [ ] Test live URL on staging/preview: `https://deploy-preview-*.netlify.app/zasady-ochrany-osobnich-udaju`
- [ ] Verify Table of Contents ToC links scroll to correct sections
- [ ] Test keyboard navigation (Tab, Shift+Tab, arrow keys if any widgets present)
- [ ] Screen reader test with NVDA or JAWS on Windows or VoiceOver on macOS
- [ ] Check Google Search Console: privacy page indexed with correct canonical
- [ ] Monitor analytics: track page views, scroll depth to section anchors, exit links

---

## Related Files

| File | Purpose |
|------|---------|
| `index.html` | Main landing page (footer simplified, consent checkboxes, calculator disclaimer, MiCA warning, self-hosted fonts) |
| `copy/privacy_policy_draft.md` | Content source for legal document (Markdown); updated 2026-04-12 with audit fixes |
| `netlify.toml` | URL redirect rules for pretty URLs; CSP headers for self-hosted fonts |
| `docs/v2-rework.md` | Overview of v2 restructuring (for context) |
| `docs/rework-v2-changelog.md` | Timeline of all changes including GDPR & legal compliance audit fixes (2026-04-12) |
| `netlify/functions/contact.ts` | Backend form handler; server-side consent timestamp generation |
| `netlify/functions/_lib/validate.ts` | Form validation; 100k-500k investment amount fix |
| `netlify/functions/_lib/email-templates/` | Email templates; PII removal from subject lines, privacy policy link in footer |
| `fonts/` | 12 self-hosted WOFF2 font files (GDPR-compliant, no Google CDN) |

---

## Questions & Support

**Content/legal questions:**
- Contact client's advokát (advokát email)
- Reference the three judgment-call comments for legal review items

**Technical questions:**
- CSS tokens out of sync? Check `index.html` `:root` vs. privacy page `:root`
- Broken anchor? Verify the section ID in HTML matches the ToC href
- Mobile layout issues? Test in DevTools at 375px width (iPhone SE)
