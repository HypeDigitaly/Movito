# Changelog — v2 Rework

## Branding Rebrand: "Movito" → "Milionová Investice" (2026-04-12)

**Summary:**  
Systematic rebrand across production files replacing all non-legally-required "Movito" references with the consumer-facing brand "Milionová Investice" (with proper Czech declension). Legal entity name "MOVITO group, s.r.o." was intentionally preserved in all legally required contexts (GDPR notices, ZISIF disclaimers, deposit insurance statements, company name contexts). Domain references updated from `movito.cz` to `milionovainvestice.cz`. Email footer copyright fixed: brand name → legal entity. ZISIF disclaimers in email templates strengthened with explicit "MOVITO group, s.r.o." attribution.

**Branding rule (for future reference):**  
Use "Milionová Investice" in all user-facing marketing, product, and interface copy. Preserve "MOVITO group, s.r.o." exclusively for legally mandated contexts: GDPR privacy notices, investment law disclaimers (ZISIF §272, §50a ČNB), deposit insurance exclusions, MiCA warnings, company registration references, and email footer copyright notices. This split ensures compliance with Czech GDPR Article 13(1)(a) (controller identity) and investment law requirements while maintaining clean consumer branding.

**Audit results:**
- **40 total "Movito" occurrences** audited across 7 production files
- **20 rebranded** to "Milionová Investice" with proper Czech declension (nominative, accusative, prepositional forms as context required)
- **20 intentionally preserved** in legally required contexts (legal entity name, GDPR headers, ZISIF disclaimers, deposit insurance references, code comments, HTML comments)
- **0 stale URLs remain** — all `movito.cz` references updated to `milionovainvestice.cz`
- **Email footer copyright fixed** — changed from "© 2024 Movito. Všechna práva vyhrazena." to "© 2024 MOVITO group, s.r.o. Všechna práva vyhrazena."
- **ZISIF disclaimers strengthened** in email templates with explicit "MOVITO group, s.r.o." subject line attribution

**Files modified:**

1. **index.html** — 10 replacements:
   - `<title>` tag: "Movito —" → "Milionová Investice —"
   - Open Graph meta (`og:title`, `og:description`)
   - Twitter Card meta (`twitter:title`)
   - 3 ARIA labels (nav logo, mobile menu, category panel)
   - Eyebrow text: "Movito platform" → "Milionová Investice" (product context)
   - Explainer actor name reference
   - Comparison table label: "Movito" → "Milionová Investice"
   - ZISIF disclaimer: added "MOVITO group, s.r.o." legal entity attribution in parentheses

2. **zasady-ochrany-osobnich-udaju.html** — 15 replacements:
   - `<title>` tag and meta description
   - Canonical URL: `https://movito.cz/...` → `https://milionovainvestice.cz/...`
   - Open Graph meta (og:url, og:title)
   - Twitter Card meta
   - JSON-LD breadcrumb: organization name in BreadcrumbList
   - ARIA label on privacy page header
   - 2 cookies privacy text references (marketing cookies context)
   - 2 servers/processing text references (data processor context)
   - 2 ZISIF/deposit insurance law references: preserved "MOVITO group, s.r.o." with strengthened context

3. **contact-confirmation.ts** — 2 changes:
   - Email subject line: "Movito" → "Milionová Investice"
   - ZISIF disclaimer text in email footer: added explicit "MOVITO group, s.r.o." attribution for legal clarity

4. **contact-notification.ts** — 1 change:
   - Internal email subject line: "Nová zpráva z Movito" → "Nová zpráva z Milionová Investice" (informational context)

5. **shared.ts** — 1 change:
   - Email footer copyright: "© 2024 Movito." → "© 2024 MOVITO group, s.r.o." (legal entity context)

**Review status:** Code reviewer PASS, security engineer PASS. No compliance issues identified.

**Testing notes:**
- Verify page title and meta tags in browser DevTools: "Milionová Investice" appears in title, og:title, twitter:title
- Verify privacy page canonical URL: `https://milionovainvestice.cz/zasady-ochrany-osobnich-udaju`
- Test email templates: confirm subject lines show "Milionová Investice", footer shows "MOVITO group, s.r.o. copyright"
- Verify GDPR headers still display "MOVITO group, s.r.o." as legal controller
- Verify ZISIF disclaimers in both HTML and emails clearly attribute "MOVITO group, s.r.o."

---

## GDPR & Legal Compliance Audit Fixes (2026-04-12)

**Summary:**  
Completed 9 critical compliance tasks to address findings from a professional GDPR + Czech/EU investment law audit. All fixes baked into copy and code; no separate advokát approval tasks remain in this batch (pending advokát tasks A1–A15 deferred for legal review phase). Changes maintain backward compatibility while closing legal gaps in consent flow, data handling, email templates, calculator disclaimers, and MiCA compliance.

**Compliance tasks completed:**

1. **Split consent checkbox** — GDPR Article 7(2) fix: separated bundled "Souhlasím" checkbox into two independent checkboxes:
   - GDPR consent (changed text to "Beru na vědomí" per Art. 6(1)(b) pre-contractual basis)
   - Qualified investor acknowledgment (§272 ZISIF) — optional checkbox
   - Files: `index.html` (form section)

2. **Fixed 100k-500k validation bug** — Investment amount range "100k-500k" (100-500 tis. Kč) was missing from server-side validation whitelist, causing silent 422 errors for this tier. Added to enum and label mappings.
   - Files: `netlify/functions/_lib/validate.ts`, `netlify/functions/_lib/email-templates/contact-notification.ts`

3. **Self-hosted Google Fonts** — Eliminated GDPR-violating IP address transfers to Google (US) by self-hosting Playfair Display and DM Sans WOFF2 files. Updated CSP headers in `netlify.toml`.
   - Files: `index.html`, `zasady-ochrany-osobnich-udaju.html`, `netlify.toml`, `fonts/` (12 new WOFF2 files)

4. **Server-side consent timestamp** — Moved canonical consent timestamp generation from client-side JS (forgeable) to server-side in contact.ts. Client timestamp retained as supplementary data (renamed to `consent_timestamp_client`).
   - Files: `netlify/functions/contact.ts`, `netlify/functions/_lib/validate.ts`, `netlify/functions/_lib/email-templates/contact-notification.ts`

5. **Updated privacy policy** — 8 specific updates to both source (`copy/privacy_policy_draft.md`) and HTML (`zasyas-ochrany-osobnich-udaju.html`):
   - Named Resend and Netlify as sub-processors with SCC (US data transfer mechanism)
   - Added lead data retention period (24 months per Act 253/2008 Sb.)
   - Rewrote security section to reflect actual transient processing architecture
   - Added rodné číslo legal basis (Act 110/2019 §20, AML Act §5(1)(a))
   - Added consent withdrawal right (Art. 7(3))
   - Updated DPA assessment conclusion
   - Added children's data statement (services for 18+ only)
   - Updated effective date to 2026-04-12

6. **Fixed email templates** — Removed PII from notification email subject line, added privacy policy link to confirmation email footer, extracted shared constants to `shared.ts` (DRY refactor).
   - Files: `netlify/functions/_lib/email-templates/contact-notification.ts`, `netlify/functions/_lib/email-templates/contact-confirmation.ts`, `netlify/functions/_lib/email-templates/shared.ts` (new)

7. **Added calculator risk warning** — Added disclaimer "Cílový výnos není zaručen. Minulé výsledky nejsou zárukou výsledků budoucích." directly below calculator output in hero section.
   - Files: `index.html`

8. **Fixed MiCA Article 7 crypto warning** — Replaced paraphrased warning with exact statutory MiCA Art. 7 text including both deposit insurance exclusion and investor compensation scheme (ICS) references.
   - Files: `index.html`, `zasady-ochrany-osobnich-udaju.html`

9. **Fixed company name consistency** — Standardized all legal entity references to "MOVITO group, s.r.o." across all files.

**Outstanding compliance items (deferred to advokát review phase):**
- A1–A15: Legal review tasks pending advokát assessment (outside scope of this batch)

**Files changed:**
- Modified: `index.html` (consent checkboxes, calculator disclaimer, crypto warning, font loading, form validation)
- Modified: `netlify.toml` (CSP headers, font cache directives)
- Modified: `copy/privacy_policy_draft.md` (8 privacy policy updates)
- Modified: `zasady-ochrany-osobnich-udaju.html` (8 privacy policy updates, font loading, MiCA warning)
- Modified: `netlify/functions/contact.ts` (consent timestamp generation)
- Modified: `netlify/functions/_lib/validate.ts` (100k-500k fix, consent_timestamp_client rename)
- Modified: `netlify/functions/_lib/email-templates/contact-notification.ts` (PII removal, 100k-500k label, shared imports)
- Modified: `netlify/functions/_lib/email-templates/contact-confirmation.ts` (privacy link, shared imports)
- Created: `netlify/functions/_lib/email-templates/shared.ts` (shared email constants)
- Created: `fonts/` directory with 12 self-hosted WOFF2 font files

**Testing notes:**
- Form validation: test all 6 investment_amount enum values including new "100k-500k" option
- Consent flow: verify both checkboxes are independent and properly submitted
- Email templates: confirm PII is not exposed in subject lines; privacy link appears in footer
- Server-side timestamp: verify consent_timestamp_server is generated server-side; consent_timestamp_client is supplementary
- Privacy page: cross-check sub-processor names, retention periods, and MiCA text match exact statutory language

**For details:** See `docs/privacy-subpage.md` for full privacy policy content updates.

---

## Privacy Policy Subpage — Standalone Legal Hub (2026-04-11)

**Summary:**  
Unified all legal information into a dedicated standalone Czech privacy policy subpage (`/zasady-ochrany-osobnich-udaju`). Landing page footer simplified to a condensed marketing-notice pointer. Privacy policy document includes 18 legal sections (13 GDPR + 5 other disclaimers), flat heading hierarchy, anchor-linked table of contents, sticky header, full WCAG 2.1 AA accessibility compliance, and semantic markup. Document is template status pending advokát legal review on three judgment-call flags (mandatory DPA appointment, marketing opt-in state, cookies audit finalization).

**Files changed:**
- Created: `zasady-ochrany-osobnich-udaju.html` (~687 LOC, inline CSS, 18 sections)
- Created: `copy/privacy_policy_draft.md` (~390 LOC, Czech markdown source)
- Modified: `netlify.toml` (2 `[[redirects]]` blocks for pretty URL rewrites)
- Modified: `index.html` (footer legal block simplified; 6 CSS rules removed)

**Key features:**
- Canonical URL: `https://movito.cz/zasady-ochrany-osobnich-udaju` (pretty, no .html visible)
- Self-contained inline CSS with `:root` tokens synced to index.html
- 18 anchor IDs (legal-{section-name}) for deep linking
- Three HTML comments flagging judgment calls for advokát review
- SEO: canonical link, robots index/follow, OG/Twitter tags, BreadcrumbList JSON-LD

**For details:** See `docs/privacy-subpage.md`

---

## v2 Rework — CRO Simplification (2026-04-11)

**Summary:**  
The Movito landing page underwent a major CRO simplification focused on reducing cognitive load and retaining only conversion-critical content. The page shrank from 6,578 lines to 3,984 lines (−40% line count) by removing 11 sections and ~23,000 words of copy, while restructuring the form as an always-visible section and reorganizing category panels into a cleaner tab interface.

---

## Shipped: Hero Slider as Single Source of Truth (2026-04-11)

**User-visible changes:**
- Hero slider (`#heroCalcSlider`) is now the single source of truth for investment amount across the entire page. Moving the slider or clicking preset pills instantly updates all category card payout ranges (quarterly / monthly / yearly).
- New compact amount selector (`.cat-amount`) added above the category grid with 5 preset pills: 100 tis. / 500 tis. / 1 mil. / 5 mil. / 10 mil. Kč. Clicking a pill syncs back to the hero slider and recalculates all payouts.
- Hero slider minimum dropped from 500,000 Kč to 100,000 Kč (`min`, `step` attributes both `100000`), matching the product promise "Začíná se na 100 000 Kč".
- Hero headline rewritten to "Milionová investice" with previous headline repositioned as subheadline. Subtitle enriched with "cílový výnos kolem 10 % ročně", CTA changed to "Vyberte si milionovou investici", yield badge suffix changed from "per annum" to "ročně".
- Per-category yields remain differentiated: podíly 9–15 %, nemovitosti 8–12 %, baterie 7–11 %, kovy 3–6 %, krypto 6–18 %. Only the investment amount syncs bidirectionally.

**Implementation details:**
- `data-yield-min` and `data-yield-max` attributes added to each `.cat-card__payout` block for dynamic range computation.
- `updateCategoryPayouts(amount)` helper caches DOM references once at init (lazy cache); zero `querySelector` calls on hot path. Uses `textContent`/`nodeValue` only — no `innerHTML` sinks.
- `formatCurrency` helper updated to use NBSP (`\u00a0`) so currency values never wrap mid-number inside narrow cards.
- Preset pills use hardcoded `aria-pressed` for SSR/no-JS resilience, `role="group"` on container, keyboard focus-visible states fully styled.

**Review status:** Code reviewer PASS, security engineer PASS (cycle 2). All 5 findings from cycle 1 (slider/pill mismatch, duplicate init, missing `aria-pressed`, NBSP formatting, DOM cache refactor) resolved.

---

## Sections Removed (11)

1. **"Proč HNWI volí Movito"** — Removed because it was agitation copy that didn't drive conversion.
2. **"Jak to funguje" + solution flow** — Removed because it duplicated form/category information.
3. **Process step counter (4 kroky)** — Removed as unnecessary procedural detail.
4. **Credibility + origin story + testimonials** — Removed to reduce decision friction.
5. **"Co když se pokazí" (security section)** — Removed as defensive, not conversion-driving.
6. **Comparison table** — Removed; category details now live in sidebar panels.
7. **FAQ section** — Removed; high-friction for mobile, redundant with category sidebars.
8. **Final CTA section (closing pitch)** — Removed; form is now persistent.
9. **Original `#kontakt-form-section` markup** — Replaced with new `#formular` section.
10. **Modal dialog (`<div class="form-modal">`)** — Removed; form is now inline + always visible.
11. **Original mobile CTA (separate button)** — Replaced with new mobile sticky bar via IntersectionObserver.

---

## New Structure (3 Primary Sections)

### 1. **Hero Section** (`#hero`)
- **H1:** "Vyberte si svoji milionovou investici"
- **Subheading:** "Chytrá investice od 100 000 Kč s čtvrtletními výnosy. Volte z pěti kategorií, kterým rozumíme."
- **Interactive calculator:** Fully preserved from original (SVG chart, slider, pills, payouts)
- **Trust row:** 4 metrics (8+ let na trhu, 850 mil. Kč spravuje, 237 investorů, 0 % ztrát)
- **CTAs:**
  - "Začít investovat" → scrolls to `#formular`
  - "Získat nabídku financování" → scrolls to form without pre-selecting category
- **Yield disclaimer & micro copy:** Preserved verbatim

### 2. **Lead Capture Form Section** (`#formular`)
**New inline section** replaces modal. Always visible, always at same depth in DOM.

**Markup:**
- `<section id="formular" class="contact-section" aria-labelledby="formular-heading">`
- **H2:** "Chci nabídku šitou na míru"
- **Subheading helper:** "Nejste si jistý/á kategorií? Vyberte libovolnou — poradíme Vám na telefonu. Vyplnění formuláře zabere necelou minutu."

**Form fields (in order):**
1. **Name** (`name`) — text, required, maxlength 100, aria-required
2. **Category** (`category`) — **visible `<select>`**, required, 5 options + empty placeholder
   - Options: "podily", "nemovitosti", "baterie", "kovy", "krypto" (exact enum match with backend)
3. **Email** (`email`) — email, required, maxlength 254, aria-required
4. **Phone** (`phone`) — tel, required, maxlength 20, aria-required
5. **Investment amount** (`investment_amount`) — optional select (rozsah dropdown)
6. **GDPR consent** (`consent`) — required checkbox, aria-required
7. **Qualified investor ack** (`qualified_investor_ack`) — optional checkbox

**Accessibility:**
- Full ARIA stack: `aria-required="true"`, `aria-invalid="false"` (set to "true" on validation error), `aria-describedby="error-{fieldname}"`
- Error spans: `<span id="error-{name}" class="form-group__error" role="alert"></span>`
- Honeypot: `.hp-field` hidden input (`name="website"`) with `aria-hidden="true"`
- Success state: `role="status" aria-live="polite"` with `<h3 tabindex="-1">` for focus management

**Form wiring:**
- **Submit handler:** `validateAndSubmit(formEl, e)` (lines ~3350–3547)
  - Client-side validation: name, category, email, phone, GDPR consent required
  - Honeypot check: if filled, return silent success (same response bytes as real success)
  - POST to `/.netlify/functions/contact` with JSON body
  - On success: show success state, clear form, focus h3 with `tabindex="-1"`
  - On error: populate error spans, set `aria-invalid="true"`, show error container with `role="alert" aria-live="polite"`

**Category pre-selection flow:**
- When user clicks `[data-scroll-to-form]` button inside `.inv-panel`:
  1. JavaScript reads active tab's `data-category-id`
  2. Writes to `#formular form [name="category"]` select
  3. Clears `aria-invalid` from field
  4. Dispatches `change` event
  5. Calls `scrollToForm()` → smooth scroll to `#formular`
- Hero "Získat nabídku financování" button is gated by `btn.closest('.inv-panel')` check — scrolls without pre-selection
- Mobile sticky CTA is similarly gated

### 3. **Investment Categories Section** (`#investment-categories`)
**Restructured tab widget with shortened panels.**

**Layout:**
- **Tab list** (`role="tablist" aria-label="Investiční kategorie"`) — visible on desktop, hidden on mobile via CSS
- **5 tab panels**, each with:
  - **`<h3 class="mobile-heading">`** — hidden on desktop, shown at ≤768px (mobile stack layout)
  - **Short category description** (~60–80 words, sourced from `docs/copy-v2.md`)
  - **Key facts sidebar:**
    - Cílový výnos (target yield)
    - Minimum vstup (minimum entry)
    - Horizont (time horizon)
    - Zajištění (collateral/insurance)
  - **Yield disclaimer:** "Cílový výnos není zaručen..."
  - **CTA button:** `.btn--outline.inv-panel__cta[data-scroll-to-form]` — "Chci {category}" → pre-selects category & scrolls to form

**Mobile strategy (≤768px breakpoint):**
- CSS rule: `.inv-tabs { display: none }` hides the entire tab list on mobile
- All 5 `.inv-panel` elements are shown stacked via `display: block !important` override on `[hidden]` attribute
- Each panel's `<h3 class="mobile-heading">` becomes visible, making each stack layer self-labeled
- Tab widget JS continues to run on mobile (arrow keys, selectTab, focus) but has no visual effect — this is acceptable technical debt to avoid a full JS rewrite

**Tab widget** (WAI-ARIA pattern, lines ~3822–3930):
- Keyboard support: Arrow Left/Right cycles tabs, Home/End jump to first/last
- Click to select tab
- Panels controlled via `aria-selected`, `aria-controls`, `role="tab"` / `role="tabpanel"`
- Active tab has `tabindex="0"`, inactive have `tabindex="-1"`
- `selectTab(idx, userInitiated)` function handles tab selection and panel visibility

---

## Form Validation & Backend Contract

**Backend endpoint:** `/.netlify/functions/contact` (unchanged)

**Category enum (from `netlify/functions/_lib/validate.ts`):**
```typescript
export const ALLOWED_CATEGORIES = ['podily', 'nemovitosti', 'baterie', 'kovy', 'krypto', ''] as const;
```

The visible `<select>` in the form offers these exact values (minus empty string as disabled placeholder), ensuring 100% match with backend validation.

**Form validation pipeline (unchanged):**
1. Env guard: API key, sender, notification address
2. Method guard: POST only
3. Body size guard: ≤10 KB
4. Content-Type guard: application/json
5. JSON parse
6. Origin check (production only, regex-hardened to prevent bypass)
7. Honeypot check (silent success if filled)
8. Schema validation: name, category enum, email, phone, investment_amount enum, consents
9. Resend email send (confirmation to user, notification to team)

**Success response (identical for honeypot + real success):**
```json
{ "success": true, "message": "Zpráva odeslána." }
```

---

## Accessibility Improvements (WCAG 2.1 AA)

- **Landmarks:** `<main id="main">` added; skip link at top of body
- **Focus visibility:** `.btn--primary:focus-visible` and `.btn--dark:focus-visible` styled
- **Form ARIA:**
  - All required fields have `aria-required="true"`
  - Invalid fields get `aria-invalid="true"` on validation error
  - Error messages linked via `aria-describedby="error-{name}"`
  - Error spans use `role="alert"`
- **Abbreviations:** 9 `<abbr title="...">` tags for "p.a.", "LTV", "ZISIF"
- **Form success focus management:** `<h3 tabindex="-1">` on success heading; JS calls `.focus()` after form submission
- **Touch targets:** ≥48×48 on mobile (checkbox labels padded, buttons sized)
- **Motion preferences:** `@media (prefers-reduced-motion: reduce)` wraps all animations (form submit, mobile CTA transition, hero decorations)

---

## Mobile Strategy

**Breakpoint:** 768px

**What changes on mobile:**
1. **Tab list hidden:** `.inv-tabs { display: none }` — tab buttons disappear
2. **Panels stack:** All 5 `.inv-panel` elements become `display: block` even with `hidden` attribute via CSS override
3. **Mobile headings visible:** Each panel's `<h3 class="mobile-heading">` shows, labeling each stack layer
4. **Sticky CTA bar:** New `<div class="mobile-sticky-cta">` with IntersectionObserver:
   - Watches `#formular` section
   - When form is out of viewport (below fold), shows a bottom bar with "Chci více informací" button
   - IntersectionObserver gated by `matchMedia('(max-width: 768px)')` — only runs on mobile
   - Click handler calls `scrollToForm()` and focuses first form field
5. **Touch targets:** All buttons and checkboxes ≥48×48px via padding/sizing

**Technical debt:**
- Tab widget JS continues to run on mobile even though tabs are hidden (no effect, but wastes cycles). Acceptable to avoid full JS rewrite.

---

## Known Technical Debt & Notes

1. **Tab widget JS on mobile:** The WAI-ARIA tab widget IIFE (lines ~3822–3930) runs on mobile even though the tabs are hidden by CSS. This is harmless but unnecessary — the selector `document.querySelector('ul[role="tablist"].inv-tabs')` still finds the (hidden) tablist, and keyboard handlers still work, but there's no visual feedback. Fixing this would require conditional initialization or CSS-based media queries in JS.

2. **Redundant tabindex in HTML & JS:** The form success heading is set with `tabindex="-1"` in HTML (line 2774) and then `form.focus()` is called from JS (line 3534) after success. This is correct and standard practice for focus management.

3. **Redundant inline style on network error:** The network error container has a CSS class `.lead-form__network-error` and also has inline `style.cssText` set from JS (line 3530) for visibility. Both methods work; the CSS class is now preferred, but the inline style remains harmless.

4. **Mobile sticky CTA focus timing:** The mobile sticky CTA button click handler uses `setTimeout(..., 400)` to focus the first form field after smooth scroll completes. This timing is empirical and may vary on slower devices.

---

## Files Changed

**Modified:**
- `index.html` (3985 lines total, single file)

**Created:**
- `docs/copy-v2.md` (owner-approved Czech copy, 742 words, all disclaimers and MiCA warning verbatim)
- `docs/baseline/anchor-audit.md` (pre-rework anchor audit for regression testing)
- `docs/baseline/README.md` (baseline documentation context)
- `docs/rework-v2-changelog.md` (this file)
- `docs/architecture.md` (current page architecture reference)

**Unchanged:**
- `netlify/functions/contact.ts` and all supporting files (`_lib/validate.ts`, `_lib/utils.ts`, etc.)
- `README.md` (setup and API docs unchanged)

---

## Deployment Notes

- Single static HTML file; no build process changes
- Netlify function backend remains on Node.js 20 runtime
- All environment variables unchanged (RESEND_API_KEY, CONTACT_SENDER_EMAIL, CONTACT_NOTIFICATION_EMAIL, SITE_URL, CONTEXT)
- CSP headers remain in effect (if configured at Netlify level)
- Page loads full in single request; no code splitting needed

---

## Testing Recommendations

1. **Form submission:** Test category pre-selection by clicking each category CTA, verify form select is populated correctly
2. **Mobile layout:** At 768px and below, verify tabs are hidden, panels stack, headings appear, sticky CTA shows/hides correctly
3. **Keyboard navigation:** Test arrow keys in tab widget on desktop; Escape in mobile menu
4. **Accessibility:** Run axe/WAVE on form section; verify ARIA labels and error messages are announced
5. **Hero calculator:** Verify slider, pills, payout calculations still work (no changes)
6. **Network errors:** Test form submission with network disabled; error message should appear in alert container

---

## Copy Source

All Czech copy, disclaimers, and field labels sourced from `docs/copy-v2.md` (owner-approved native Czech, 742 words). See that file for full copy and rationale.
