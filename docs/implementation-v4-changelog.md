# Implementation v4 Changelog — Movito Layout Refresh + Content Additions

**Date:** 2026-04-07  
**Scope:** 16 tasks shipped in single `index.html` commit. 2 tasks dropped per user direction. 1 critical fix during review.  
**Review Status:** PASS (code-reviewer, security-engineer, accessibility-tester)

---

## Shipped Tasks Summary

### Phase 2A — Layout & UX Refresh (9 tasks)

1. **Task 1: SVG sprite house symbol** — Added `<symbol id="deco-house">` with line-art house (roof, body, door, 2 windows). Non-scaling-stroke preserves 24–120px visibility. Line ~3255 in sprite block.

2. **Task 2: Hero deco CSS rebalance** — Deleted `.deco--bot-left` and `.deco--bot-chart` CSS rules at all 3 breakpoints (desktop, 1024px, 768px). Updated `.deco--bot-right` to growth-chart aspect ratio: 132×78px (desktop), 110×65px (1024px), 92×54px (768px).

3. **Task 3: Hero deco markup swap** — Removed bot-left and bot-chart decoration divs from hero. Converted bot-right from coin to growth-chart: viewBox changed to `0 0 220 130`, inner `<use>` now references `#deco-growth-chart`. Top-left ₿ and top-right $ unchanged.

4. **Task 4: Problem-card icon swap** — Replaced inline 24×24 SVG house icon in "Investiční byt" problem card with `<use href="#deco-house"/>` reference. Maintains gold stroke color via `#7A5E0A`.

5. **Task 5: Form section move + sticky-bar JS fix + scroll focus** — (3 sub-changes)
   - Moved form section from below problems to sit between marketing-notice and problems; removed section-divider; changed class from `section--alt` to `section`; added `tabindex="-1"` to h2 for focus management.
   - Rewrote sticky-bar JS to use `formBottom < 0` logic (appeared only when both hero AND form are off-screen).
   - Added 700ms focus injection on h2 after scroll-to-form action.

6. **Task 6: Mobile CTA CSS rewrite** — Redesigned `.mobile-cta` and buttons: new rounded-pill styling (52px tap targets), white phone button with gold-600 border (6.35:1 contrast, up from 2.18:1), primary gradient button 4.94:1 contrast, 3px gold outline on focus-visible, prefers-reduced-motion override, safe-area-inset padding for notch devices. Added body `padding-bottom: calc(80px + env(safe-area-inset-bottom))`.

7. **Task 7: Mobile CTA markup additions** — Added arrow icon to primary button text; added phone icon to phone link text. Both use `<span>` wrappers and `currentColor` for icon inheritance.

8. **Task 8: Custom scrollbar** — Appended gold gradient scrollbar CSS: `scrollbar-width: thin`, `scrollbar-color` with gradient, webkit overrides for Chrome/Safari/Edge. Reset `.form-modal__panel` to default scrollbar.

9. **Task 9: Copy edits + OG/Twitter meta** — Updated meta description (149 chars), hero badge to "Investice zajištěná nemovitostí — od 500 tis. Kč", footer brand description, added 6 OG/Twitter meta tags (og:title, og:description, og:type, twitter:card, twitter:title, twitter:description).

### Phase 2D — Content Additions (7 tasks, with user overrides)

14. **Task 14: Borrower-rate context paragraph** — Added paragraph inside `.solution__explanation` explaining "férovost je nákladová položka" framing without disclosing specific borrower rate. Mentions "8–12 % p.a. (orientační, není zaručen)" with regulatory disclaimer.

15. **Task 15: Conservative-LTV expansion** — Appended sentence to `.protection-card__text` in protection card #1 explaining "LTV 70 % není administrativní pravidlo" with 2008 historical context. No founder name (impersonal structural tone preserved).

18. **Task 18: CSS for `.origin-story`, `.pull-quote`, `.footer__founders`** — Appended 3 CSS blocks: origin-story card (48px padding, 4px gold left border, max-width 880px, clamp font-sizes, responsive 768px override), pull-quote styling (centered, italic Playfair Display, gold color), footer-founders (14px, gold-400 on dark background). Uses existing `.reveal` observer pattern (no bespoke opacity).

### Phase 2D — Content Additions with User Overrides

12. **Task 12: Founder origin story** — Inserted multi-paragraph origin story block in `#duvera` between credibility metrics and case study. **USER OVERRIDE:** Paragraph 2 rewritten to remove co-founder name mention. Originally introduced "Luboš ${LUBOS_SURNAME}", now uses company-plural voice ("Postavili jsme firmu") with Václav Hejátko named only in paragraph 1. Placeholder `${LUBOS_SURNAME}` resolved per override.

16. **Task 16: Footer founder credit** — Appended footer-founders credit below footer description. **USER OVERRIDE:** Changed from dual-founder "Zakladatelé: Václav Hejátko · Luboš ${LUBOS_SURNAME}" to singular "Zakladatel: Václav Hejátko" (strong tags, gold-400 color). Reflects decision to credit only Václav.

17. **Task 17: FAQ entries (rewritten)** — Added 3 new FAQ entries (originally 4). Q1 rewritten to remove co-founder mention. Q2 and Q3 shipped as planned. **Q4 DROPPED entirely** per user direction. FAQ list grew from 9 items → 12 items. All 3 entries use regulatory "(orientační, není zaručen)" on yield figures.

---

## User Overrides During Execution

**Decision: Do not mention any co-founder in shipment.**

1. **Task 12 (Origin story paragraph 2):** Originally narrated Václav meeting Luboš and founding Movito together. Rewritten to use company-plural voice without naming second co-founder. Václav Hejátko mentioned only once (paragraph 1, founder backstory). Placeholder `${LUBOS_SURNAME}` fully removed.

2. **Task 16 (Footer founder credit):** Simplified from two-founder structure to single credit: "Zakladatel: Václav Hejátko" (singular, strong tags, gold accent). Removed Luboš reference entirely.

3. **Task 17 (FAQ entries):** Originally 4 entries (Q1–Q4). Q1 rewritten to reference "spoluzakladatel" without name; Q4 entirely dropped. Result: 3 new FAQ entries ship. Entries now explicitly describe only Václav's background (17+ years real estate, MBA, 2008 refinancing experience). No co-founder bios included.

4. **Task 13 (Pull-quote) & Task 19 (Verification):** Not shipped. Tasks 13 (pull-quote markup) and 19 (name verification blocker) omitted per user direction. Pull-quote CSS rules **not** included in Task 18. Origin story uses editorial prose only (no founder quote).

---

## Review Loop & Fixes

**Review cycle:** 1 iteration  
**Issues resolved:** 1 CRITICAL (legacy CSS rule shadowing new primary button), 4 LOW (deferred cosmetic)

### HIGH Issue — RESOLVED

**Legacy button CSS rule conflict:** Lines 2415–2424 contained legacy `button.mobile-cta__btn { background: inherit; ... }` rule with higher specificity than new `.mobile-cta__btn--primary { background: linear-gradient(...) }`. Caused primary button to render without gold gradient (background reset to `inherit`). Fixed by deleting legacy block entirely. Re-review confirmed gradient now renders correctly.

### Deferred LOW Issues (cosmetic, non-blocking)

1. **Select option labels:** Lines ~4461–4463 use literal en-dashes instead of `&ndash;` (3 occurrences). No semantic impact; visual identical on all browsers.

2. **Submit button + success link icons:** Lines ~4478, 4489 use literal `→` instead of `&rarr;`. Renders identically; entity would be more semantic.

3. **Scroll handler performance:** Sticky-bar JS calls `getBoundingClientRect()` even on mobile where `.mobile-cta` is `display: none`. Minor perf nit; no user impact.

4. **Focus outline on contact heading:** `.contact-section__heading` has no explicit `:focus { outline: ... }` rule. Falls back to UA (user-agent) default outline, which is functional; adding explicit rule would be optional enhancement.

---

## Files Changed

**Single-file scope:**  
- `index.html` — All 16 task implementations, all 3 user override applications, HIGH fix applied.

No auxiliary files modified (no CSS extraction, no new component files, no image assets added).

---

## Verification Checklist

### Visual Verification
- [ ] Open `index.html` in browser (Chrome, Firefox, Safari, Edge)
- [ ] **Hero section:** Verify deco-bot-right shows growth chart only (no bot-left or bot-chart)
- [ ] **Problem cards:** Second card ("Investiční byt") shows house icon (gold line-art, 24×24)
- [ ] **Form section:** Renders between marketing-notice (cream bg) and problems (darker bg); no section-divider
- [ ] **Mobile CTA:** 52px height, rounded-pill buttons, phone button has gold border on white bg, primary button shows gold gradient + arrow icon
- [ ] **Scrollbar:** 14px thick gold gradient scrollbar visible when page scrolls
- [ ] **Origin story block:** Sits in `#duvera` after credibility metrics, shows two paragraphs (no founder name in paragraph 2)
- [ ] **Footer:** Shows "Zakladatel: Václav Hejátko" (singular) in small text below brand description
- [ ] **FAQ:** 12 total items visible (up from 9); new Q1–Q3 display without co-founder names

### Functional Verification
- [ ] Click "Chci více informací" button → page scrolls to form, h2 receives focus (screen reader announces)
- [ ] Scroll past form section → sticky mobile-cta appears; scroll back up → disappears
- [ ] Resize window to mobile (≤768px) → hero deco-bot-right shrinks to 92×54px, appears correctly
- [ ] Reduce motion in OS settings → mobile-cta bar stays visible (no slide-up animation)
- [ ] Tab through mobile CTA buttons → gold outline visible on both gradient and white button
- [ ] Scroll page → custom gold scrollbar tracks smoothly; form modal scroll uses default scrollbar

### HTML/CSS Validation
- [ ] Run `index.html` through HTML validator — zero errors
- [ ] Inspect CSS in DevTools — no dead code (no `.deco--bot-left`, `.deco--bot-chart` rules)
- [ ] Search HTML for `${LUBOS_SURNAME}` — zero matches (placeholder fully resolved)
- [ ] Search HTML for literal `deco-bot-left` or `deco-bot-chart` — zero matches

### Accessibility Verification
- [ ] Phone button: extract RGB from `var(--gold-600)` (#7A5E0A) on white, compute WCAG contrast = 6.35:1 (pass ≥3:1 for UI, ≥4.5:1 for text)
- [ ] Primary button: compute white on gold gradient = 4.94:1 (pass ≥4.5:1)
- [ ] Use keyboard-only navigation (no mouse) to reach all CTA buttons — outline visible on every button
- [ ] Enable screen reader (Windows Narrator, macOS VoiceOver, NVDA) — form h2 announced after scroll-to-form click
- [ ] Check form modal scroll — uses system scrollbar (verify in DevTools with dark theme that default scrollbar appears, not gold)

### Regulatory Copy Verification
- [ ] Meta description (149 chars) — verify not truncated in Google SERP preview
- [ ] OG meta tags present in `<head>` — 6 tags visible in DevTools
- [ ] Find all "8–12 %" mentions → each includes "(orientační, není zaručen)" or similar qualifier
- [ ] Borrower-rate in Task 14 paragraph → no specific range disclosed (only "brutální úroky" / "férovost" framing)

---

## Notes for Future Maintenance

1. **Mobile CTA safe-area-inset:** iPhone notch / Android inset padding active. Test on notch devices if available (simulator acceptable).

2. **Origin story animation:** Uses existing `.reveal` IntersectionObserver (line 4433). No bespoke opacity rules; inherits fade-in from page scrolling. Verify observer still fires on mobile (sometimes flaky on slow devices).

3. **Custom scrollbar:** Firefox uses `scrollbar-color`, webkit browsers use `::-webkit-scrollbar`. iOS/Android show system scrollbars (expected). If scrollbar missing in Firefox, verify `scrollbar-color: var(--gold-400) var(--bg-dark)` syntax in DevTools.

4. **Sticky-bar logic:** Switched from `heroBottom < 0 && formTop > window.innerHeight` to `heroBottom < 0 && formBottom < 0`. If behavior changes after form content edits, verify bounding rect logic in JS console during scroll.

5. **Focus management:** Form section h2 receives focus after 700ms scroll delay. If screen reader skips announcement, check that heading is not hidden with `aria-hidden="true"` or `display: none`.

---

## Deployment Notes

- Single commit containing all Tasks 1–9, 12, 14–18 (16 total)
- No database migrations, no asset builds, no deploy-time secrets
- No new dependencies (all CSS/JS native)
- No git history rewrite required
- Post-deploy: monitor analytics for form conversion rate (moved section position may affect funnel)
- Post-deploy: monitor mobile CTR on new CTA buttons (new styling + focus behavior)

---

## 2026-04-07 — Hotfix: Mobile Hamburger Menu (Broken → Dialog Pattern)

**User complaint:** *"The mobile menu is not showing and nothing happens."*

### Root Cause

The hamburger button (`<button id="mobileToggle">` at line ~3462) existed in markup but had no JavaScript click handler registered anywhere—a full search for `mobileToggle.*addEventListener` returned zero matches. Additionally, no `.nav.open` CSS state existed to toggle menu visibility in the mobile viewport (`@media (max-width: 768px)` set `.nav__links { display: none }` with no override). A third symptom: orphaned code at line ~5314 inside `openModal()` contained `if (nav && nav.classList.contains('open')) nav.classList.remove('open');`—a cleanup line referencing a state that nothing could ever produce, evidence of half-implemented earlier work.

### Approach

Implemented an ARIA **dialog pattern** (not disclosure) because the menu exhibits dialog characteristics per ARIA 1.2: backdrop overlay, body scroll lock, and keyboard focus trap. Single-file edit to `index.html`; zero new files. Dialog semantics are managed by JavaScript based on `matchMedia(max-width: 768px)` breakpoint—HTML attributes are set/removed dynamically to avoid hiding the desktop navigation from screen readers.

### Changes

#### HTML (lines ~3553, ~3569, ~3582)
- Wrapped `<ul class="nav__links">` in new `<div id="navLinks" class="nav__panel">` container (dialog element at runtime).
- Updated `<button id="mobileToggle">` with `aria-haspopup="dialog"`, `aria-controls="navLinks"`, `aria-expanded="false"`, `aria-label="Otevřít navigaci"` (Czech, replaces generic "Menu").
- Added `<div class="nav__backdrop" aria-hidden="true" inert></div>` inside `<nav id="nav">` (backdrop overlay, below menu in stacking order).

#### CSS (lines ~303-306, ~364, ~2926-3011, ~3289)
- Button tap target: padding 8px → 10px, yielding 44×44px (WCAG 2.5.8 AAA).
- Button `:focus-visible` outline: 2px gold-400, 2px offset.
- Menu link `:focus-visible` outline: 2px gold-400, 2px offset.
- **Deleted** old `@media (max-width: 768px) { .nav__links { display: none } }` rule entirely (replaced by visibility + transform).
- New `#navLinks.nav__panel`: `visibility: hidden` + `transform: translateY(-110%)` (closed); `transition: visibility 240ms ease-out, transform 240ms ease-out`. Applied asymmetric timing: `visibility: visible` on `.nav.open` flips immediately (so AT announces); `visibility: hidden` waits 240ms on close (so slide-out animation completes before AT un-announces).
- New `.nav.open #navLinks.nav__panel`: `visibility: visible`, `transform: translateY(0)` (open state).
- New `.nav.scrolled #navLinks.nav__panel { top: 64px }` (compensates for nav's scrolled-state padding; unscrolled = 76px, scrolled = 64px).
- `.nav__backdrop`: z-index 997 (below sticky mobile CTA at 999, below nav at 1000); `background: rgba(0, 0, 0, 0.5)`; `opacity` transition when menu opens.
- Hamburger→X SVG transform: targets existing `<line>` children, rotates/translates on `.nav.open` state.
- New `@media (max-width: 768px) and (prefers-reduced-motion: reduce)` block: disables all transitions via `transition: none !important` on panel and backdrop.

#### JavaScript (lines ~4857-4881, ~4886-5001, ~5566-5580, ~5597-5600)
- New shared **`trapFocus(container, event)` helper** at outer scope: handles Tab/Shift+Tab focus trap. Eliminates code duplication between mobile menu and existing `formModal`.
- New section `// MOBILE NAVIGATION TOGGLE (dialog pattern)`:
  - Hoisted `let closeMobileMenu = () => {}` function at outer scope with explanatory comment (allows `openModal()` and Escape handler further down to call it unconditionally, even if mobile nav elements don't exist).
  - `setMobileAria(isMobile)` helper: sets/removes `role="dialog"`, `aria-modal="true"`, `aria-label="Navigace"`, `aria-hidden="true"` on `#navLinks` based on breakpoint (called on init AND in matchMedia listener). **Critical:** placing these in HTML would break desktop screen reader navigation.
  - `openMobileMenu()`: applies class first, then aria-attrs (correct AT announcement order); saves `previousBodyOverflow` before locking; double `requestAnimationFrame` before `focus()` to work around iOS Safari 15-17 silent focus failure on newly-visible elements.
  - `closeMobileMenu({ returnFocus })`: applies aria-attrs first, then removes class; restores `previousBodyOverflow`.
  - Toggle button click: `e.stopPropagation()` (prevents immediate re-close via document click-outside).
  - Nav link click **CAPTURE-phase delegation** on `#navLinks` (runs BEFORE bubble-phase smooth-scroll handler later, so `body.overflow` is restored synchronously before `window.scrollTo` fires; does NOT prevent smooth scroll).
  - Backdrop click → `closeMobileMenu({ returnFocus: true })`.
  - Document click-outside: explicit `mobileToggle.contains(e.target)` guard.
  - Tab/Shift+Tab: focus trap via shared `trapFocus` helper.
  - `matchMedia('(max-width: 768px)')` change listener with legacy `addListener` fallback for iOS Safari <14: auto-closes menu on resize out of mobile, calls `setMobileAria(e.matches)`.
- Integration with existing `openModal()`: replaced orphaned `if (nav && nav.classList.contains('open')) nav.classList.remove('open');` with `closeMobileMenu()` call placed BEFORE `document.body.style.overflow = 'hidden'` (so menu's `previousBodyOverflow` doesn't clobber modal's scroll lock).
- Extended Escape handler: added `else if` branch calling `closeMobileMenu({ returnFocus: true })` (idempotent, no-op if menu closed).
- Existing `formModal` focus trap refactored to use shared `trapFocus` helper (eliminates duplication).

### Key Decisions

- **Dialog vs. disclosure pattern:** Backdrop + body scroll lock + focus trap crossed the threshold into dialog territory per ARIA 1.2 (disclosure is a simple hide/show toggle; this is a modal overlay).
- **JavaScript-managed ARIA attributes:** `setMobileAria()` sets/removes `role="dialog"`, `aria-modal`, `aria-hidden` based on breakpoint instead of placing them in HTML. Reason: `aria-hidden="true"` in HTML would permanently hide the desktop navigation from screen readers (never removed), breaking AT access.
- **CAPTURE-phase link click delegation:** Nav links use capture phase to run BEFORE the bubble-phase smooth-scroll handler defined later in the script. This ensures `body.overflow` is restored synchronously before `window.scrollTo` fires, preventing janky scroll behavior.
- **Hoisted `closeMobileMenu` function:** Defined as empty function at outer scope with comment explaining why. Allows `openModal()` and the Escape handler (defined much later in the script) to call it unconditionally without null checks or `typeof` guards, improving code clarity.

### Review Summary

| Reviewer | Cycles | Verdict |
|----------|--------|---------|
| `javascript-pro` | 2 | PASS (2 CRITICAL, 3 HIGH, 3 MEDIUM, 3 LOW—all resolved pre-implementation) |
| `accessibility-tester` | 2 | PASS (1 HIGH desktop `aria-hidden` regression, 1 MEDIUM reduced-motion scope—both fixed; 1 enhancement applied) |
| `code-reviewer` | 2 | PASS (Cycle 1: 4 MEDIUM findings; Cycle 2: all resolved) |
| `security-engineer` | 1 | PASS (0 C/H/M findings; 5 LOW defense-in-depth notes) |

**Critical finds resolved:** Desktop `aria-hidden="true"` attribute preventing screen reader access to nav (fixed by JS-managed attributes only on mobile breakpoint); magic nav-height constant `72px` (documented in code comment); missing `nav` null-check (added defensive guard); focus-trap code duplication between menu and modal (refactored to shared `trapFocus` helper).

### Files Changed

**Single-file scope:**
- `index.html` — 3 change regions (HTML markup, CSS rules, JavaScript handlers + integration with existing `openModal()` and Escape handler). All changes in one commit.

---

## 2026-04-07 — CRO Refactor: Lead Capture Form Enlargement (Page Version)

**User request:** *"Increase conversion on the primary contact form by enlarging and emphasizing the lead capture card on the landing page."*

### Scope

Conversion-rate optimization redesign of the form in `#kontakt-form-section`. The form card was enlarged from 560px → 800px max-width, padding from 48px → 56px/64px, headline from 30px → 42px, input height from 56px → 68px, button from 60px → 72px, and accompanying typography scaled proportionally across all responsive breakpoints. All changes scoped to the page version; the modal version (mounted in `#modal-form-mount`) remains unchanged to preserve mobile UX.

### Key Changes

#### CSS Enlargements (Desktop)
- **Card width:** 560px → 800px (centered, greater breathing room)
- **Card padding:** 48px (uniform) → 56px top/bottom, 64px left/right (proportional)
- **Headline "Zanechte nám kontakt":** 30px → 42px (stronger visual hierarchy)
- **Subline "Ozveme se Vám…":** 17px → 20px (improved legibility)
- **Field labels:** 15px, weight 500 → 18px, weight 600 (clearer structure)
- **Inputs / select:** height 56px → 68px; font 17px → 20px; border 1.5px → 2px (easier to tap and read)
- **Submit button:** height 60px → 72px; font 19px → 22px (dominant CTA)
- **Footer note "Odpovíme do 24 hodin…":** 14px → 16px
- **Section heading above card:** 40px → 50px (visual anchor)
- **Avatar circles:** 36px → 44px (proportional to card)
- **Trust strip (below card):** 14px font → 16px; gap 24px → 32px; top margin 24px → 48px

#### Responsive Adjustments
- **Tablet (≤768px):** Full-width card, 32px headline, 60px inputs, 64px button (proportional reduction)
- **Mobile (≤480px):** Compact layout, 26px headline, 56px inputs, 16px font floor (iOS zoom prevention)

#### Content Changes
- **Removed:** In-card privacy disclaimer "Vaše data jsou v bezpečí…" (read as defensive, discouraged commitment)
- **Added:** Post-submit security element `.lead-form__secure` with lock icon + "Zabezpečeno" text (quiet reassurance below button, placed after commitment)

#### Accessibility
- **Color fix:** `.lead-form__legal` and `.form-trust-strip span` changed from `--text-dim` (#9C9B92) to `--text-muted` (#6B6A62) to meet WCAG AA 4.5:1 contrast on cream background

#### Scoping Strategy
- **All rules scoped via `.contact-section .lead-form`** (page version only)
- **Modal protection:** `.form-modal__panel .lead-form` uses original compact size; no enlargement rules applied
- **Hero/global protection:** Avatar resizing uses `.contact-section__avatars .hero__avatar`; section-label uses `#kontakt-form-section .section-label`

### Selector Map

| Component | Base Rule | Page Scope | Location |
|-----------|-----------|-----------|----------|
| Card | `.lead-form { max-width: 560px; padding: 48px; }` | `.contact-section .lead-form { max-width: 800px; padding: 56px 64px; }` | Lines 2456–2459 |
| Headline | `.lead-form__headline { font-size: 30px; }` | `.contact-section .lead-form .lead-form__headline { font-size: 42px; }` | Lines 2460–2463 |
| Subline | `.lead-form__sub { font-size: 17px; }` | `.contact-section .lead-form .lead-form__sub { font-size: 20px; }` | Lines 2464–2468 |
| Field labels | `.form-group label { font-size: 15px; weight: 500; }` | `.contact-section .lead-form .form-group:not(.lead-form__consent) label { font-size: 18px; weight: 600; }` | Lines 2472–2476 |
| Inputs | `.form-group input { height: 56px; font-size: 17px; border: 1.5px; }` | `.contact-section .lead-form .form-group input { height: 68px; font-size: 20px; border: 2px; }` | Lines 2477–2483 |
| Submit button | `.lead-form__submit { height: 60px; font-size: 19px; }` | `.contact-section .lead-form .lead-form__submit { height: 72px; font-size: 22px; }` | Lines 2512–2516 |
| Trust note | `.lead-form__legal { font-size: 14px; color: --text-dim; }` | `.contact-section .lead-form .lead-form__legal { font-size: 16px; color: --text-muted; }` | Lines 2517–2521 |
| Avatars | `.hero__avatar { width: 36px; }` (global) | `.contact-section__avatars .hero__avatar { width: 44px; }` | Lines 2950–2955 |
| Section eyebrow | `.section-label { font-size: 14px; }` (global) | `#kontakt-form-section .section-label { font-size: 16px; }` | Lines 2930–2934 |

### Tablet & Mobile Overrides

**Tablet (≤768px):** Lines 3272–3302
- Card full-width, padding 40px 32px
- Headline 32px, inputs 60px height, button 64px

**Mobile (≤480px):** Lines 3333–3370
- Card full-width, padding 32px 20px
- Headline 26px, inputs 56px height (16px font floor), button 60px

### Rationale

**CRO motivation:** Larger form fields, clearer typography hierarchy, and greater visual prominence reduce cognitive friction for investors filling out a lead-capture form. Scoped CSS protects the modal version (used in sticky-bar on mobile), which is already optimized for compact space. Removed defensive language; added post-commitment security reassurance.

**Target audience:** Czech retail investors aged 35–65 considering 500k–20mil CZK investments. Larger inputs and clearer labeling address potential dexterity and legibility concerns in this demographic.

### Verification

- [ ] Desktop form renders 800px wide with 42px headline and 68px inputs
- [ ] Modal form remains 560px wide with 30px headline and 56px inputs (unaffected)
- [ ] Mobile inputs maintain 16px font (iOS zoom prevention)
- [ ] All text meets WCAG AA contrast (text-muted color #6B6A62)
- [ ] Lock icon + "Zabezpečeno" visible below submit (desktop)
- [ ] No layout shift or overflow at any breakpoint
- [ ] Form submits successfully; success message displays

### Files Changed

- `index.html` — CSS only (lines 2456–2535, 3272–3302, plus base adjustments at 2921–2959)

### Related Documentation

- Full technical detail: `docs/cta-form-cro-refactor.md` (new)

---

## 2026-04-08 — Contact Form Email Integration via Resend

**Scope:** Added complete Resend-based email service for contact form submissions.

### What shipped

- **Netlify Function** (`netlify/functions/contact.ts`) — Validates form submissions, enforces Origin/Referer check (production), honeypot anti-spam, and sends two emails via Resend API.
- **Email templates** (confirmation + notification, Czech-only) — Brand-compliant HTML with Movito light palette tokens (gold `#96730F`, cream `#FAF5E8`, etc.).
- **Validation module** (`netlify/functions/_lib/validate.ts`) — Hand-written type guards with discriminated-union result; aggregates all field errors before returning.
- **Shared utilities** (`netlify/functions/_lib/utils.ts`) — XSS escaping, email validation, CRLF/control-char rejection, JSON parsing, error code union.
- **Frontend integration** (`index.html` lines 5223–5438) — Form now POSTs to `/.netlify/functions/contact` instead of Formspree; added `website` honeypot field and `consent_timestamp` capture; `.catch` handler extracts Czech error messages from server response.
- **Deploy config** — `netlify.toml` (Node 20 runtime, 10s timeout, CSP with Google Fonts), `package.json` (resend ~4.0.0), `.env.example`, `.gitignore`, `DEPLOY_CHECKLIST.md`.

### Security hardening

- **Origin/Referer validation** (production only) — Fail-closed; rejects CSRF and off-domain POSTs.
- **Honeypot anti-spam** — Non-empty `website` field returns 200 with identical bytes to real success (silent, no bot learning).
- **XSS defense** — All user input HTML-escaped; email/phone URIs are `encodeURIComponent()`-encoded in mailto/tel hrefs.
- **CRLF/header injection defense** — `hasControlChars()` rejects CR, LF, NUL in all input fields.
- **GDPR consent enforcement** — `consent` must be exactly `true` (boolean); string "true" or number 1 rejected.
- **PII logging discipline** — No user data logged unless error occurs; error logs contain only exception metadata, never secrets.
- **CSP headers** — `form-action 'self'` prevents form hijacking; `frame-ancestors 'none'` prevents clickjacking.

### Field validation (Czech messages)

All 8 error codes return Czech user-facing messages. Investment amount field supports 6 enums + empty string (optional). Timestamps and form location are optional pass-through fields.

### Notification email intelligence

Team notification email includes:
- Contact name, email, phone with clickable links (reply-to configured)
- Investment amount humanized (e.g., `1m-5m` → "1 – 5 mil. Kč")
- Form location humanized (primary vs. modal)
- Consent timestamp in Prague timezone
- "NEW CONTACT" badge for easy scanning

### Documentation

Full technical reference at `docs/contact-form-resend.md` including:
- Architecture & pipeline (10 validation steps)
- Security posture (XSS, CRLF, origin check, honeypot, rate limiting out-of-scope)
- API contract (request body shape, all 8 error codes with HTTP status table)
- Environment variable setup (4 secrets in Netlify dashboard)
- Local dev workflow (npm install → .env → netlify dev → curl examples)
- Email template structure (Movito brand tokens, investment/location label mappings, Prague timezone formatting)
- Deploy flow (references DEPLOY_CHECKLIST.md)
- Future hardening roadmap (Turnstile, Blobs rate limiting, CRM integration, nonce CSP)

### Files added/modified

- Created: `netlify/functions/contact.ts`, `netlify/functions/_lib/{utils,validate}.ts`, `netlify/functions/_lib/email-templates/{contact-confirmation,contact-notification}.ts`, `package.json`, `tsconfig.json`, `netlify.toml`, `.gitignore`, `.env.example`, `DEPLOY_CHECKLIST.md`
- Modified: `index.html` (lines 5223, 5366–5420)
- Documentation: `docs/contact-form-resend.md` (new)

---
