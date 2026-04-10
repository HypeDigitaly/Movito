# Implementation Plan v4 — Movito Layout Refresh + Podcast Content Integration

> **Status:** Approved by 5 specialist reviewers across 3 review cycles (v1, v2, v4). All CRITICAL / HIGH / MEDIUM issues resolved.
> **Scope:** 19 tasks, all in `index.html`. 11 from approved v3 base + 8 new tasks (12–19) integrating founder podcast content.
> **Pre-flight blocker:** Task 19 — user must verify co-founder surname + founder sign-off on quotes before Tasks 12, 16, 17 ship.

---

## Approach

All work in a single file (`index.html`). 19 tasks across 4 task families: hero/decoration rebalance (Tasks 1–4), form-move + JS fixes (Task 5), mobile UX (Tasks 6–7), scrollbar (Task 8), copy softening (Task 9), quality gate (Tasks 10–11), and **NEW v4 podcast-mining family (Tasks 12–19)** that adds founder origin story, co-founder credit, pull-quote, conservative-LTV philosophy, FAQ entries, and a name-verification blocker. Tasks 1–11 unchanged from v3 (already approved). Tasks 12–19 fully address the v4 architect review's 14 critical/high/medium issues.

## Plan reviewed by

- `architect-reviewer` ×3 (v1, v2, v4) — caught form-move JS regression (CRITICAL), unrequested top-right swap, sticky-bar reset selector wrong, reveal observer class mismatch (CRITICAL), Task 13/14 ordering ambiguity (CRITICAL), borrower-rate disclosure risk, founder name in protection card, regulatory disclaimer missing on yield, Czech quote mark inconsistency, quote spam, FAQ growth concern
- `frontend-developer` — pre-resolved `.form-modal__panel` selector, sticky-bar JS shape, grouped 768px selector split
- `ui-designer` — confirmed asymmetric decoration layout, mobile CTA spec, scrollbar, decoration mobile reorder concern
- `content-marketer` ×2 — Czech grammar fix on hero badge, "Investice zajištěná nemovitostí" core phrase, top-5 transcript facts, founder name verification flagged, charity/CSR skip recommendation, regulatory framing
- `accessibility-tester` — phone button contrast CRITICAL (2.18:1 → fixed to 6.3:1), focus halo on white background, reduced-motion transform reset, scroll-to-form focus management

---

## File ownership map

| Subagent role | Owned line ranges in `index.html` |
|---|---|
| `frontend-developer` | Sprite ~3047-3173, Hero deco CSS 364-498 + media queries 2830/2967/3034, Hero deco markup 3206-3228, Form section move (3389+3634-3664) and JS lines 4404-4419 + 5037-5044, Scrollbar CSS appended ~3038, Problem-card icon line 3429, **Origin story markup at 3700, Pull-quote markup ~3517, Solution rate paragraph ~3515, #bezpecnost protection card #1 line ~3856, Footer founder credit lines ~4197-4206, FAQ entries before line 4137, Origin-story/pull-quote/footer-founders CSS appended near scrollbar block** |
| `ui-designer` | Mobile CTA CSS 2100-2140 + body padding line 2963, Mobile CTA markup 4263-4268 |
| `code-reviewer` | Quality gate Task 10 |
| `accessibility-tester` | Quality gate Task 11 |
| **USER (blocking)** | **v4 Task 19 — confirm Luboš's surname + founder sign-off before Tasks 12, 16, 17 ship** |

---

## Task list

### Phase 2A — v3 base (already approved in previous review cycles)

#### Task 1: Add `deco-house` symbol to SVG sprite
- **Subagent:** `frontend-developer`
- **File:** `index.html`, append before `</defs>` at end of sprite block (~line 3170)
- **Dependencies:** None
- **Description:** Insert this exact symbol — pure line-art design (no fill) so it scales cleanly from 24px to 120px via `non-scaling-stroke`:
  ```svg
  <symbol id="deco-house" viewBox="0 0 120 120">
      <g fill="none" stroke="#7A5E0A" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke">
          <path d="M 18 56 L 60 22 L 102 56"/>            <!-- roof -->
          <path d="M 28 50 V 100 H 92 V 50"/>             <!-- body -->
          <rect x="52" y="68" width="16" height="32"/>    <!-- door -->
          <rect x="36" y="60" width="14" height="14"/>    <!-- left window -->
          <rect x="70" y="60" width="14" height="14"/>    <!-- right window -->
      </g>
  </symbol>
  ```
- **Acceptance:**
  - [ ] Symbol id `deco-house` validates in DOM
  - [ ] Renders cleanly at 24px, 48px, 76px, 120px (no stroke distortion)
  - [ ] Stroke colour is `#7A5E0A` regardless of parent CSS `color`

#### Task 2: Hero decoration CSS rebalance
- **Subagent:** `frontend-developer`
- **File:** `index.html` lines 364-498 + media query overrides at 2830-2834, 2967-2973, 3034-3035
- **Dependencies:** None
- **Description:**
  - DELETE the entire `.hero .deco--bot-left { ... }` rule (~lines 413-421)
  - DELETE the entire `.hero .deco--bot-chart { ... }` rule (~lines 422-431)
  - REPLACE `.hero .deco--bot-right` rule body with:
    ```css
    .hero .deco--bot-right {
        bottom: 1px;
        right: clamp(20px, 6vw, 96px);
        width: 132px;
        height: 78px;
        opacity: 0.85;
        animation: floatSlow 11s ease-in-out infinite;
        animation-delay: -1.4s;
    }
    ```
  - At 1024px breakpoint (lines 2830-2834): remove the lines mentioning `deco--bot-left` and `deco--bot-chart`; update `.hero .deco--bot-right` line to `width: 110px; height: 65px; bottom: 1px;`
  - At 768px breakpoint (lines 2967-2973): the existing block groups `top-left, bot-left, bot-chart` in one `display:none` selector — **SPLIT** so the line becomes `.hero .deco--top-left { display: none; }` only; remove `bot-left` and `bot-chart` references entirely. Update `.hero .deco--bot-right` line to `width: 92px; height: 54px; bottom: 1px; right: 5%;`
  - At 480px breakpoint (lines 3034-3035): NO CHANGE (the existing `.hero .deco, .section .deco { display: none; }` already covers everything)
- **Constraint:** `bottom + height < 80` at every breakpoint (1+78=79 ✓, 1+65=66 ✓, 1+54=55 ✓)
- **Acceptance:**
  - [ ] No selectors `deco--bot-left` or `deco--bot-chart` remain anywhere in CSS
  - [ ] `bot-right` slot fits chart aspect ratio 220:130
  - [ ] Trust-bar clearance maintained at all 3 breakpoints
  - [ ] 768px split keeps `top-left { display:none; }` intact
- **Do NOT touch:** any other `.hero .deco--*` rules; the `prefers-reduced-motion` block at line 496-498

#### Task 3: Hero decoration markup swap
- **Subagent:** `frontend-developer`
- **File:** `index.html` lines 3206-3228 (hero deco markup block)
- **Dependencies:** None (the `#deco-growth-chart` symbol already exists in the sprite from the previous refactor)
- **Description:**
  - DELETE the `<div class="deco deco--stack deco--bot-left">…</div>` block (3 lines around 3215)
  - DELETE the `<div class="deco deco--chart deco--bot-chart">…</div>` block (3 lines around 3218)
  - UPDATE the existing `<div class="deco deco--coin deco--bot-right">` block:
    - Change opening tag class `deco--coin` → `deco--chart`
    - Change inner `<svg viewBox="0 0 120 120">` to `<svg viewBox="0 0 220 130">`
    - Change inner `<use href="#deco-coin-dollar"/>` to `<use href="#deco-growth-chart"/>`
  - **Top-left ₿ and top-right $ remain UNCHANGED.**
- **Acceptance:**
  - [ ] Hero shows ₿ TL, $ TR, growth chart BR
  - [ ] No bot-left or bot-chart elements remain in hero markup
  - [ ] `#deco-coin-dollar` still appears in #duvera and other section corners (not removed from sprite)
- **Do NOT touch:** rail decorations, top-left, top-right

#### Task 4: Problem-card "Investiční byt" icon → house
- **Subagent:** `frontend-developer`
- **File:** `index.html` line ~3429
- **Dependencies:** Task 1 (sprite must contain `deco-house`)
- **Description:** Replace the inline 24×24 SVG inside the second `.problem-card`:
  - From: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4B85C" stroke-width="2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
  - To: `<svg width="24" height="24" viewBox="0 0 120 120" fill="none" aria-hidden="true"><use href="#deco-house"/></svg>`
- The new symbol carries its own `stroke="#7A5E0A"` so the parent card's `color` doesn't override it. `non-scaling-stroke` keeps the line weight visible at 24×24.
- **Acceptance:**
  - [ ] House icon visible at 24×24 in the second problem card
  - [ ] Stroke colour matches sibling line-art icons in tone
  - [ ] No layout shift in the card
- **Do NOT touch:** other problem-card icons

#### Task 5: Move form section + sticky-bar JS fix + scroll focus
- **Subagent:** `frontend-developer`
- **File:** `index.html` — markup at lines 3389-3664, JS at lines 4404-4419 and 5037-5044
- **Dependencies:** None
- **Description (3 sub-changes, atomic commit):**

  **5a Markup move:**
  - Locate `<div class="section-divider"></div>` at line 3634 (sits immediately before the form section)
  - Locate `<section class="section section--alt" id="kontakt-form-section">` block starting line 3639 to its closing `</section>`
  - CUT both elements together
  - REINSERT at the position immediately after the marketing-notice closing `</div>` (currently line ~3390, the div spanning lines 3389-3392)
  - In the reinserted block, drop the section-divider entirely (do not paste it back)
  - Change the reinserted section's class from `class="section section--alt"` to `class="section"` (verified safe — `.section--alt` has zero descendant selectors)
  - Add `tabindex="-1"` to the inner `<h2 class="contact-section__heading">` for screen-reader focus landing
  - Resulting bg cascade: hero `--bg-darkest` → marketing-notice `--bg-medium` → form `--bg-darkest` → problems `--bg-dark`. Marketing-notice's existing `border-bottom: 1px solid rgba(166,124,26,0.08)` (line 758) is the visual divider; no extra divider needed.

  **5b Sticky-bar JS fix (lines 4408-4413):**
  Replace these exact lines:
  ```js
  const formSection = document.getElementById('kontakt-form-section');
  if (heroEl) {
      const heroBottom = heroEl.getBoundingClientRect().bottom;
      const formTop = formSection ? formSection.getBoundingClientRect().top : Infinity;
      const isVisible = heroBottom < 0 && formTop > window.innerHeight;
  ```
  With:
  ```js
  const formSection = document.getElementById('kontakt-form-section');
  if (heroEl) {
      const heroBottom = heroEl.getBoundingClientRect().bottom;
      const formBottom = formSection ? formSection.getBoundingClientRect().bottom : -Infinity;
      const isVisible = heroBottom < 0 && formBottom < 0;
  ```
  Rationale: in the new layout, sticky bar should appear when user has scrolled past BOTH hero AND form (i.e. they're now in problems/jak-to-funguje/etc.) — not while form is still in view.

  **5c scrollToForm focus injection (lines 5037-5044):**
  After the existing `window.scrollTo` call, append (inside scrollToForm function):
  ```js
  setTimeout(() => {
      const heading = formSection.querySelector('h2');
      if (heading) heading.focus({ preventScroll: true });
  }, 700);
  ```
- **Acceptance:**
  - [ ] Form renders between marketing-notice and `#problemy` in DOM order
  - [ ] Form section is class `section` (not `section--alt`); background reads as light cream
  - [ ] All `href="#kontakt-form-section"` links scroll correctly
  - [ ] Sticky bar appears during problems / jak-to-funguje / process scrolling
  - [ ] Sticky bar hides when user scrolls back up to the form
  - [ ] Screen reader announces form `<h2>` after scroll
  - [ ] No JS console errors
- **Do NOT touch:** any other JS, the form's inner markup (template, mount divs)

#### Task 6: Mobile CTA bar CSS rewrite
- **Subagent:** `ui-designer`
- **File:** `index.html` lines 2100-2140 + body padding line 2963
- **Dependencies:** None
- **Description:**

  Update `.mobile-cta` to:
  ```css
  .mobile-cta {
      display: none;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      z-index: var(--z-mobile-cta);
      padding: 14px 16px calc(14px + env(safe-area-inset-bottom, 0px));
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-top: 2px solid var(--gold-400);
      box-shadow: 0 -4px 20px rgba(150, 115, 15, 0.10);
      transform: translateY(100%);
      transition: transform 280ms ease-out;
  }
  .mobile-cta.visible { transform: translateY(0); }
  ```

  Update `.mobile-cta__inner`: `display: flex; gap: 12px;`

  Update `.mobile-cta__btn`:
  ```css
  .mobile-cta__btn {
      flex: 1;
      min-height: 52px;
      padding: 14px 18px;
      border-radius: 100px;
      font-family: var(--font-body);
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      text-align: center;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s ease;
      cursor: pointer;
      border: none;
  }
  .mobile-cta__btn:focus-visible {
      outline: 3px solid var(--gold-600);
      outline-offset: 3px;
      box-shadow: 0 0 0 5px rgba(150, 115, 15, 0.18);
  }
  ```

  Update `.mobile-cta__btn--primary`:
  ```css
  .mobile-cta__btn--primary {
      background: linear-gradient(135deg, var(--gold-500), var(--gold-400));
      color: #FFFFFF;
  }
  .mobile-cta__btn--primary:hover {
      background: linear-gradient(135deg, var(--gold-600), var(--gold-500));
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(150, 115, 15, 0.35);
  }
  ```

  REPLACE `.mobile-cta__btn--phone` entirely:
  ```css
  .mobile-cta__btn--phone {
      background: #FFFFFF;
      border: 2px solid var(--gold-600);
      color: var(--gold-600);
  }
  .mobile-cta__btn--phone:hover {
      background: var(--cream);
      border-color: var(--gold-500);
  }
  ```

  Add reduced-motion override:
  ```css
  @media (prefers-reduced-motion: reduce) {
      .mobile-cta { transition: none !important; transform: translateY(0) !important; }
  }
  ```

  At line 2963, change `padding-bottom: 72px;` to `padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));`

- **Acceptance:**
  - [ ] Phone button border + text both `--gold-600` (#7A5E0A) on white = ~6.3:1 (passes WCAG 1.4.11 ≥3:1 for UI and ≥4.5:1 for text)
  - [ ] Primary button white-on-gold-gradient = ~4.9:1 (passes 4.5:1)
  - [ ] 52px tap targets meet WCAG 2.5.5
  - [ ] Focus halo visible on both gradient AND white button backgrounds
  - [ ] Reduced-motion override keeps the bar visible (transform reset)
  - [ ] Safe-area inset handled on iPhone notch devices
- **Do NOT touch:** the JS toggle logic at line 4404

#### Task 7: Mobile CTA markup additions
- **Subagent:** `ui-designer`
- **File:** `index.html` lines 4263-4268
- **Dependencies:** Task 6
- **Description:**

  Replace the primary button with text + arrow icon:
  ```html
  <button type="button" id="mobileCTABtn" class="mobile-cta__btn mobile-cta__btn--primary">
      <span>Chci více informací</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  </button>
  ```

  Replace the phone link with phone icon + text:
  ```html
  <a href="tel:+420000000000" class="mobile-cta__btn mobile-cta__btn--phone">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      <span>Zavolejte nám</span>
  </a>
  ```
  **NO** `aria-haspopup="dialog"` — verified at lines 5053-5058 the primary button just calls `scrollToForm()`, doesn't open a modal.
- **Acceptance:**
  - [ ] Both buttons render with icons aligned (flex gap from Task 6)
  - [ ] Text labels readable in Czech with diacritics
  - [ ] Icons inherit `currentColor` matching the button text
  - [ ] No invalid ARIA attributes
- **Do NOT touch:** the `id="mobileCTABtn"` or `href="tel:..."` values

#### Task 8: Custom thick gold scrollbar
- **Subagent:** `frontend-developer`
- **File:** `index.html` — append new CSS rules at end of `<style>` block (just before `</style>` ~line 3039)
- **Dependencies:** None
- **Description:** Append:
  ```css
  /* =====================================================
     Custom gold scrollbar
     ===================================================== */
  html {
      scrollbar-gutter: stable;
      scrollbar-width: thin;
      scrollbar-color: var(--gold-400) var(--bg-dark);
  }
  html::-webkit-scrollbar { width: 14px; }
  html::-webkit-scrollbar-track { background: var(--bg-dark); }
  html::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, var(--gold-400) 0%, var(--gold-500) 60%, var(--gold-600) 100%);
      border-radius: 8px;
      border: 2px solid transparent;
      background-clip: padding-box;
      min-height: 48px;
  }
  html::-webkit-scrollbar-thumb:hover {
      box-shadow: inset 0 0 0 2px var(--gold-300);
  }
  /* Reset for nested scroll containers */
  .form-modal__panel {
      scrollbar-color: auto;
      scrollbar-width: auto;
  }
  .form-modal__panel::-webkit-scrollbar { width: auto; }
  .form-modal__panel::-webkit-scrollbar-thumb {
      background: initial;
      border: initial;
  }
  ```
- **Acceptance:**
  - [ ] Gold scrollbar visible in Chrome, Edge, Firefox
  - [ ] `.form-modal__panel` (line 2488 with `overflow-y: auto`) uses default scrollbar
  - [ ] No layout shift due to `scrollbar-gutter: stable`
  - [ ] Mobile browsers gracefully ignore (use system scrollbars)
- **Do NOT touch:** any existing CSS

#### Task 9: Copywriting rewrites + OG/Twitter meta tags
- **Subagent:** `frontend-developer` (string-only edits)
- **File:** `index.html` — 4 atomic edits
- **Dependencies:** None
- **Description:**

  **Edit 1 — Line 7 meta description** (149 chars, within Google's 155 truncation limit):
  Replace `<meta name="description" content="Máte na spořáku miliony a víte, že ztrácejí hodnotu? Nemovitostní investice s cílovým výnosem 8–12 % ročně. Čtvrtletní výplaty na účet. Žádná správa z Vaší strany. Od 500 tis. Kč.">`
  With: `<meta name="description" content="Chcete víc než spořák nabízí? Investice zajištěná nemovitostí s cílovým výnosem 8–12 % ročně. Čtvrtletní výplaty. Žádná správa. Od 500 tis. Kč.">`

  **Edit 2 — Line 3233 hero badge**:
  Replace `<span class="badge badge--gold">Nemovitostní investice od 500&nbsp;tis.&nbsp;Kč</span>`
  With: `<span class="badge badge--gold">Investice zajištěná nemovitostí — od 500&nbsp;tis.&nbsp;Kč</span>`

  **Edit 3 — Line 4203 footer**:
  Replace `Nemovitostní investice s cílovým výnosem 8–12 % ročně. Čtvrtletní výplaty na účet. Zajištění reálným majetkem. Osobní přístup pro investory od 500 tis. Kč.`
  With: `Investice zajištěná nemovitostí s cílovým výnosem 8–12 % ročně. Čtvrtletní výplaty na účet. Zajištění reálným majetkem. Osobní přístup od 500&nbsp;tis.&nbsp;Kč.`

  **Edit 4 — Add OG/Twitter meta tags**: After the existing meta description (after line 7), insert these new lines inside `<head>`:
  ```html
  <meta property="og:title" content="Milionová Investice — Vaše peníze si zaslouží víc než 4 % v bance">
  <meta property="og:description" content="Investice zajištěná nemovitostí s cílovým výnosem 8–12 % ročně. Čtvrtletní výplaty. Od 500 tis. Kč.">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="Milionová Investice">
  <meta name="twitter:description" content="Investice zajištěná nemovitostí s cílovým výnosem 8–12 % ročně. Od 500 tis. Kč.">
  ```
- **Acceptance:**
  - [ ] All 4 string updates verified verbatim
  - [ ] Meta description ≤ 155 chars (149 actual)
  - [ ] OG and Twitter meta present in `<head>`
  - [ ] Title (line 6) UNCHANGED
  - [ ] Mechanism copy at lines 3478, 3856, 3858, 4028 UNCHANGED
- **Do NOT touch:** any other text content

#### Task 10: Code review of all changes
- **Subagent:** `code-reviewer`
- **File:** `index.html` (entire file diff)
- **Dependencies:** Tasks 1-9 + Tasks 12-18
- **Description:** Verify HTML validity (no broken tags, no orphaned closes); verify CSS syntax (no missing semicolons, no rule duplication); verify all `<use href="#…">` references resolve to existing symbols; verify all `getElementById` selectors still find their targets in the new DOM order; verify no leftover dead CSS rules referencing removed classes (`deco--bot-left`, `deco--bot-chart`).
- **Acceptance:**
  - [ ] Zero CRITICAL or HIGH issues reported
  - [ ] All sprite refs resolve
  - [ ] No CSS dead code

#### Task 11: Accessibility re-verification
- **Subagent:** `accessibility-tester`
- **File:** `index.html`
- **Dependencies:** Tasks 1-9 + Tasks 12-18
- **Description:** Re-compute WCAG contrast for both mobile CTA buttons; verify focus indicators visible on both backgrounds; verify scroll-to-form announces section heading via screen reader; verify reduced-motion override keeps the bar in place; verify scrollbar contrast at 14px.
- **Acceptance:**
  - [ ] Zero CRITICAL or HIGH WCAG violations
  - [ ] Phone button passes 1.4.11 (border ≥3:1, text ≥4.5:1)
  - [ ] Focus visible on both buttons via tab navigation
  - [ ] Form heading reachable by keyboard after scroll

---

### Phase 2D — NEW v4 podcast-content additions

#### Task 12: Founder origin story block in `#duvera`
- **Subagent:** `frontend-developer`
- **File:** `index.html` insert at line 3700 (immediately after `.credibility__metrics` closing `</div>` at line 3699 and before `<!-- Case Study -->` comment at line 3701)
- **Dependencies:** Task 18 (CSS), **Task 19 (name verification BLOCKER)**
- **Description:** Insert this exact markup. Note: uses `class="reveal"` so it inherits the existing IntersectionObserver pattern from line 4433 (no bespoke opacity rules needed). The blockquote was DROPPED per architect-reviewer (quote-spam concern — Task 13 carries the founder voice in `#jak-to-funguje` instead).
  ```html
  <div class="origin-story reveal">
      <span class="origin-story__label">Proč jsme tu</span>
      <h3 class="origin-story__title">Sami jsme tudy prošli</h3>
      <p class="origin-story__text">
          V&nbsp;roce 2008 stál spoluzakladatel Václav Hejátko před problémem: po&nbsp;rozvodu potřeboval refinancovat svoji nemovitost, ale banka mu nepůjčila &mdash; špatné načasování, nestandardní případ. Rodina pomoct nemohla. Bez nebankovního věřitele by přišel o&nbsp;střechu nad hlavou. Začal na&nbsp;30&nbsp;% úroku, postupně refinancoval na&nbsp;12&nbsp;% a&nbsp;o&nbsp;nemovitost nepřišel. <strong>Tahle zkušenost ho naučila, jak by měla férová investice zajištěná nemovitostí vypadat.</strong>
      </p>
      <p class="origin-story__text">
          Pak potkal Luboše&nbsp;${LUBOS_SURNAME} &mdash; jednoho z&nbsp;mála nebankovních věřitelů, kteří mu pomohli refinancovat za&nbsp;rozumných podmínek. Domluvili se a&nbsp;založili Movito. Václav přinesl praxi z&nbsp;realitního trhu, Luboš znalost nebankovního financování. Společně postavili firmu, která dělá to, co by sami chtěli mít k&nbsp;dispozici v&nbsp;roce 2008: konzervativní LTV&nbsp;70&nbsp;%, jasné podmínky, žádný prodejní tlak. <strong>Důsledek? Za&nbsp;celou historii Movito 0&nbsp;% ztráty jistiny.</strong>
      </p>
  </div>
  ```
- **Acceptance:**
  - [ ] Renders between metric cards (closing 3699) and case study (opening 3701)
  - [ ] No `${LUBOS_SURNAME}` placeholder remains in production output
  - [ ] Inherits reveal animation via existing observer (no bespoke opacity)
  - [ ] All Czech quote marks render correctly (no straight `"`)
  - [ ] 0 % ztráty jistiny line bridges the existing metric (line 3697) to the founder philosophy
- **Do NOT touch:** existing metric cards, case study, testimonials

#### Task 13: Pull-quote in `#jak-to-funguje` (investor-framed)
- **Subagent:** `frontend-developer`
- **File:** `index.html` insert AFTER `.solution__explanation` closing `</div>` at line 3516 and BEFORE `<div class="benefits__grid">` at line 3518
- **Dependencies:** Task 18 (CSS), Task 19 (quote attributes Václav)
- **Description:** Insert this pull-quote. Per architect review the original "Když ti banka nepůjčí…" was BORROWER-facing on an investor landing page → replaced with an investor-framed quote that reinforces the conservative philosophy:
  ```html
  <blockquote class="pull-quote pull-quote--gold reveal">
      <p>&bdquo;Stavíme to, co bych sám v&nbsp;roce 2008 potřeboval &mdash; konzervativní LTV, jasné podmínky, žádný nátlak.&ldquo;</p>
      <cite>&mdash; Václav Hejátko, spoluzakladatel Movito</cite>
  </blockquote>
  ```
- **Acceptance:**
  - [ ] Sits between explanation paragraph and benefit cards grid
  - [ ] Centered, italic Playfair Display, gold accent
  - [ ] Quote frames conservative LTV positively for investors (not "we lend without income checks")
  - [ ] Czech quotation marks `&bdquo;...&ldquo;` (not straight `"`)

#### Task 14: Borrower-rate context paragraph in `#jak-to-funguje`
- **Subagent:** `frontend-developer`
- **File:** `index.html` insert INSIDE `.solution__explanation` div, AFTER the existing `</p>` at line 3515 and BEFORE the closing `</div>` at line 3516
- **Dependencies:** None
- **Description:** Add this paragraph (Czech, fits existing solution__explanation styling). Numeric borrower rate (12-18%) DROPPED to avoid public commitment, and the 8-12% yield gets the regulatory disclaimer "(orientační, není zaručen)":
  ```html
  <p>
      <strong>Proč nezvládnutelné úroky pro dlužníka nedávají smysl ani jedné straně?</strong> V&nbsp;nebankovním sektoru se občas účtují brutální úroky, ze&nbsp;kterých dlužník zkrachuje a&nbsp;celý projekt skončí ztrátou. Náš model je nastavený tak, aby fungoval pro obě strany &mdash; dlužník zvládne splácet a&nbsp;Vy jako investor dostáváte cílový výnos 8&ndash;12&nbsp;% p.a. (orientační, není zaručen). Férovost je nákladová položka, kterou rádi platíme.
  </p>
  ```
- **Acceptance:**
  - [ ] Sits inside `.solution__explanation` as a sibling of the existing mechanism `<p>`
  - [ ] No specific borrower-rate range disclosed (no "12–18 %")
  - [ ] Yield figure carries "(orientační, není zaručen)" qualifier
  - [ ] Typo fix: "nezvládnutelné" not "nezakázané"
- **Do NOT touch:** existing mechanism paragraph, benefit cards

#### Task 15: Conservative-LTV expansion in `#bezpecnost` protection card #1
- **Subagent:** `frontend-developer`
- **File:** `index.html` line ~3856-3860 (the protection card with title "Za penězi stojí reálný dům")
- **Dependencies:** None
- **Description:** Append this sentence to the existing `.protection-card__text` for protection card #1. Depersonalized — does NOT name Václav (cards have impersonal/structural tone):
  > Maximální LTV&nbsp;70&nbsp;% u&nbsp;nás není administrativní pravidlo &mdash; je to bezpečnostní polštář postavený na&nbsp;zkušenosti z&nbsp;roku 2008, kdy menší rezerva znamenala ztrátu nemovitosti. Proto u&nbsp;nás půjčujeme jen do&nbsp;70&nbsp;% opatrného odhadu. Vždy.
- **Acceptance:**
  - [ ] No founder name in card body (impersonal tone preserved)
  - [ ] Adds historical context without contradicting existing LTV mechanism copy
  - [ ] No new performance promises
- **Do NOT touch:** other protection cards, scenario cards

#### Task 16: Founder credit in footer
- **Subagent:** `frontend-developer`
- **File:** `index.html` `.footer__brand` (lines ~4197-4206), append after the existing footer description `<p>` (which v3 Task 9 rewrites)
- **Dependencies:** **v3 Task 9** (sequential — both edit `.footer__brand`), Task 18 (CSS), **Task 19 (name verification)**
- **Description:** Append this paragraph as a new sibling after the description:
  ```html
  <p class="footer__founders">Zakladatelé: <strong>Václav Hejátko</strong> &middot; <strong>Luboš&nbsp;${LUBOS_SURNAME}</strong></p>
  ```
- **Acceptance:**
  - [ ] Appears in footer brand column below the description
  - [ ] Both names rendered in `<strong>` with gold accent
  - [ ] No `${LUBOS_SURNAME}` placeholder remains
- **Do NOT touch:** footer columns, legal block, copyright bottom

#### Task 17: Four new FAQ entries
- **Subagent:** `frontend-developer`
- **File:** `index.html` append before line 4137 (closing `</div>` of `.faq__list`)
- **Dependencies:** **Task 19 (name verification — Q1 and Q4 use surname)**
- **Description:** Add 4 new `<div class="faq-item reveal">` blocks matching the existing 10-item structure. All use Czech quotation marks `&bdquo;...&ldquo;`, all yield figures carry the regulatory qualifier, voice consistent ("My" throughout).

  **Q1:** "Jak vznikla Milionová Investice?"
  > V&nbsp;roce 2008 spoluzakladatel Václav Hejátko sám potřeboval nebankovní refinancování, aby nepřišel o&nbsp;svoji nemovitost. Tu zkušenost využil k&nbsp;tomu, aby s&nbsp;Lubošem&nbsp;${LUBOS_SURNAME} postavili firmu, která dělá nebankovní financování spravedlivě &mdash; konzervativně, bez nátlaku, s&nbsp;jasnými podmínkami. Od&nbsp;té doby jsme pomohli stovkám investorů rozumně zhodnotit kapitál.

  **Q2:** "Jak se Movito liší od bankovního financování?"
  > Banka po&nbsp;Vás chce výplatní pásku, výpisy z&nbsp;účtu, bonitu a&nbsp;desítky stran dokumentů. Nás zajímá především nemovitost, kterou je investice zajištěná. My půjčujeme tam, kde má reálný majetek dostatečnou hodnotu k&nbsp;zajištění &mdash; i&nbsp;pro klienty, kterým banka neřekla ano. Pro Vás jako investora to znamená vyšší cílový výnos a&nbsp;jasné zajištění Vašich peněz reálnou nemovitostí.

  **Q3:** "Proč by měl dlužník jít k&nbsp;Vám místo do banky? Nejsou Vaše úroky vyšší?"
  > Ano, naše úroky jsou vyšší než bankovní &mdash; ale nižší než brutální úroky, které účtuje část nebankovního sektoru. Model je nastavený tak, aby fungoval pro obě strany: dlužník zvládne splácet a&nbsp;Vy jako investor dostáváte cílový výnos 8&ndash;12&nbsp;% p.a. (orientační, není zaručen). Férovost je nákladová položka, kterou rádi platíme. Žádný prodejní tlak.

  **Q4:** "Kdo za&nbsp;Movito stojí?"
  > Václav Hejátko a&nbsp;Luboš&nbsp;${LUBOS_SURNAME}. Václav má za&nbsp;sebou 17+&nbsp;let v&nbsp;realitách a&nbsp;obchodě, MBA, a&nbsp;osobní zkušenost s&nbsp;nebankovním financováním (sám si jím v&nbsp;roce 2008 zachránil nemovitost). Luboš pochází z&nbsp;nebankovního financování &mdash; patří mezi férové věřitele, na&nbsp;které Václav před lety narazil. Společně postavili Movito a&nbsp;dnes pomáhají investorům i&nbsp;dlužníkům najít rozumný střed.

- **Acceptance:**
  - [ ] All 4 entries follow existing FAQ markup pattern
  - [ ] FAQ count rises from 10 to 14
  - [ ] All Czech quotation marks correct (`&bdquo;...&ldquo;`)
  - [ ] Q3 yield carries "(orientační, není zaručen)" qualifier
  - [ ] Q2 voice consistent (no slip between "Movito" and "My")
  - [ ] No `${LUBOS_SURNAME}` placeholder remains

#### Task 18: CSS for `.origin-story`, `.pull-quote`, `.footer__founders`
- **Subagent:** `frontend-developer`
- **File:** `index.html` `<style>` block, append new rules near the end (just BEFORE the scrollbar block from Task 8)
- **Dependencies:** None
- **Description:** Dropped bespoke opacity (uses existing `.reveal` observer pattern), removed dead `::before/::after` pseudo-elements without `content:`, removed unused `.origin-story__quote` rules (since blockquote dropped from Task 12), matched existing transition easing.
  ```css
  /* =====================================================
     PODCAST CONTENT additions (origin story, pull-quote, footer founders)
     ===================================================== */
  /* Origin story block (in #duvera) — uses existing .reveal observer */
  .origin-story {
      background: var(--bg-card);
      border-left: 4px solid var(--gold-500);
      padding: 48px 56px;
      border-radius: var(--radius-lg);
      margin: 80px auto 64px;
      max-width: 880px;
      box-shadow: var(--shadow-card);
  }
  .origin-story__label {
      display: inline-block;
      font-family: var(--font-body);
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--gold-500);
      margin-bottom: 16px;
  }
  .origin-story__title {
      font-family: var(--font-display);
      font-size: clamp(28px, 3.5vw, 38px);
      color: var(--gold-600);
      margin-bottom: 24px;
      line-height: 1.2;
  }
  .origin-story__text {
      font-size: 18px;
      line-height: 1.75;
      color: var(--text-light);
      margin-bottom: 20px;
  }
  .origin-story__text:last-child { margin-bottom: 0; }
  .origin-story__text strong { color: var(--text-white); }
  @media (max-width: 768px) {
      .origin-story { padding: 32px 24px; margin: 56px auto 48px; border-left-width: 3px; }
  }

  /* Pull-quote (used in #jak-to-funguje) */
  .pull-quote {
      text-align: center;
      margin: 56px auto;
      max-width: 820px;
      padding: 0 24px;
  }
  .pull-quote p {
      font-family: var(--font-display);
      font-size: clamp(22px, 2.8vw, 30px);
      font-style: italic;
      color: var(--gold-600);
      line-height: 1.4;
      margin-bottom: 18px;
  }
  .pull-quote cite {
      display: inline-block;
      color: var(--text-muted);
      font-style: normal;
      font-size: 14px;
      letter-spacing: 0.04em;
  }

  /* Footer founder credit */
  .footer__founders {
      margin-top: 14px;
      font-size: 14px;
      color: var(--text-dim);
      letter-spacing: 0.02em;
  }
  .footer__founders strong {
      color: var(--gold-400);
      font-weight: 600;
  }
  ```
- **Acceptance:**
  - [ ] All three components render with theme tokens
  - [ ] No bespoke opacity rules — uses existing `.reveal` observer
  - [ ] No dead `::before/::after` pseudo-elements
  - [ ] No unused `.origin-story__quote` rules (blockquote dropped from Task 12)
  - [ ] Mobile (≤768px) reduces border weight to avoid clutter
- **Do NOT touch:** existing CSS

#### Task 19: USER-BLOCKING — verify co-founder name spelling + founder sign-off
- **Subagent:** N/A — this is a question to the USER
- **File:** None — this is a pre-flight check
- **Dependencies:** None (but blocks Tasks 12, 16, 17)
- **Description:** Before Tasks 12, 16, 17 can ship, the user must confirm:

  **1. Co-founder surname spelling.** Transcript inconsistency:
  - Earlier conversation context: "Luboš Vebr"
  - Transcript verbatim genitive form: "Luboše Velebla" → nominative most likely "Luboš Veleba"
  - Either could be a transcription artifact

  All `${LUBOS_SURNAME}` placeholders in Tasks 12, 16, 17 must be filled in with the verified spelling before merging to production.

  **2. Founder approval of quoted material.** The quote in Task 13 ("Stavíme to, co bych sám v roce 2008 potřeboval — konzervativní LTV, jasné podmínky, žádný nátlak.") is a paraphrase of the transcript, not a verbatim quote. Václav should sign off on it before publication.

  **3. Bio claims approval.** FAQ A4 (Task 17) makes bio claims: "17+ let v realitách a obchodě, MBA, sám si jím v roce 2008 zachránil nemovitost" for Václav, and "patří mezi férové věřitele" for Luboš. These are verifiable statements about real people — confirm with Václav.

  **Fallback if name cannot be verified:** Replace ALL `${LUBOS_SURNAME}` references with reformulated sentences that don't require the surname:
  - Task 12 paragraph 2: "Pak potkal Luboše &mdash; jednoho z&nbsp;mála..." (uses first name only)
  - Task 16 footer: "Zakladatelé: <strong>Václav Hejátko</strong> a&nbsp;jeho spoluzakladatel" (rephrased)
  - Task 17 Q1: "...aby s&nbsp;Lubošem postavili firmu..." (first name only)
  - Task 17 Q4: "Václav Hejátko a&nbsp;jeho spoluzakladatel Luboš." (rephrased — NOT "Václav Hejátko a Luboš." which reads truncated)

- **Acceptance:**
  - [ ] No `${LUBOS_SURNAME}` placeholder ships to production
  - [ ] User has explicitly confirmed surname OR fallback applied to all 4 occurrences
  - [ ] User has confirmed Václav approves the Task 13 paraphrase quote and the Task 17 A4 bio claims (or both have been edited per his correction)

---

## Execution order (consolidated v3 + v4)

```
USER-BLOCKING (must happen FIRST or in parallel — blocks Tasks 12, 16, 17)
└── Task 19: Name verification + founder sign-off

PARALLEL GROUP A — independent, no internal deps (run in one call)
├── Task 1:  SVG sprite house symbol
├── Task 2:  Hero deco CSS rebalance
├── Task 5:  Form move + sticky-bar JS + scroll focus
├── Task 6:  Mobile CTA CSS rewrite
├── Task 8:  Custom gold scrollbar
├── Task 9:  Copywriting + OG meta              ← v3 Task 9 (footer description rewrite)
├── Task 14: Solution rate paragraph (no name)
├── Task 15: #bezpecnost LTV expansion (no name)
└── Task 18: CSS for origin-story / pull-quote / footer-founders

PARALLEL GROUP B — depend on Group A (run in one call)
├── Task 3:  Hero deco markup swap (depends on freed bot-right slot from Task 2)
├── Task 4:  Problem-card icon swap (depends on Task 1 sprite)
├── Task 7:  Mobile CTA markup (depends on Task 6 CSS)
├── Task 12: Origin story markup (depends on Task 18 CSS + Task 19 name)
├── Task 13: Pull-quote markup (depends on Task 18 CSS + Task 19)
└── Task 17: FAQ entries (depends on Task 19)

SEQUENTIAL after Task 9 (same .footer__brand element)
└── Task 16: Footer founder credit (depends on Task 9 finishing footer description rewrite + Task 18 CSS + Task 19 name)

QUALITY GATE — after all implementation (parallel)
├── Task 10: code-reviewer
└── Task 11: accessibility-tester re-verification
```

**Notes:**
- Group A is fully parallel-safe — line ranges don't overlap. Single `Agent` call with all 9 tasks.
- Group B has fan-in dependencies on Group A — single call with all 6.
- Task 16 is the ONE sequential outlier because v3 Task 9 and v4 Task 16 both touch `.footer__brand`. Single executor handles both.
- **Recommended single-agent sequential order:** 19 → 1 → 2 → 5 → 6 → 8 → 9 → 14 → 15 → 18 → 3 → 4 → 7 → 12 → 13 → 17 → 16 → 10 → 11

---

## Risk register

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| 1 | Form-move desktop conversion drop (cold visitors lose value-prop scroll path) | MEDIUM | Form move is the LAST commit in v3 sequence. Single git revert rolls it back. Monitor analytics 7-14 days post-launch. |
| 2 | Decoration asymmetry (bot-left intentionally empty) | LOW | Honors user's literal screenshot intent. Acceptable as deliberate breathing room. |
| 3 | Mobile browsers ignore custom scrollbar | LOW | iOS/Android use system scrollbars. Firefox `scrollbar-color` handles desktop Firefox; webkit handles desktop Chrome/Edge/Safari. |
| 4 | OG image asset not added (no verified URL or image) | LOW | Future SEO task. Current OG/Twitter tags include title + description + type. |
| 5 | Sticky-bar JS regression masked until form moved | LOW | Pre-emptively fixed in Task 5b. New `formBottom < 0` logic verified. |
| 6 | Section-class change side-effects | LOW | Verified `.section--alt` has zero descendant selectors. |
| 7 | House symbol size inconsistency vs sibling icons | LOW | `vector-effect="non-scaling-stroke"` keeps stroke readable at 24×24. Visual review during Task 10. |
| 8 | **Co-founder name wrong** | **HIGH** | Task 19 blocks all name-using tasks. Fallback uses first name only + rephrased sentences. |
| 9 | **Founder sign-off on quote not obtained** | **HIGH** | Task 19 acceptance requires Václav's explicit OK on the paraphrased Task 13 quote and Task 17 A4 bio claims. |
| 10 | Regulatory: yield disclosure without "(orientační, není zaručen)" qualifier | MEDIUM | All new copy mentioning 8-12% includes the qualifier (Tasks 14, 17 Q3). |
| 11 | Borrower-rate (12-18%) public commitment | MEDIUM | Removed from copy. Task 14 uses "brutální úroky" / "férovost" framing without disclosing exact range. |
| 12 | Quote spam (multiple founder voices in close proximity) | LOW | Origin story blockquote DROPPED. Task 13 carries the founder voice in `#jak-to-funguje`. Origin story uses editorial paragraphs only. |
| 13 | FAQ growth 10→14 pushes final CTA below fold | LOW | No JSON-LD schema exists (verified) so no schema update needed. Final CTA position concern is minor — accept it. |
| 14 | Czech quotation mark inconsistency causing visual mess | LOW | All v4 drafts normalized to `&bdquo;...&ldquo;` pattern matching existing testimonials. |

---

## Estimated scope

- Files created: 0
- Files modified: 1 (`index.html`)
- Total tasks: 19 (16 implementation + 1 user-blocker + 2 quality gate)
- Parallelisable groups: 3 (Group A: 9 tasks, Group B: 6 tasks, Quality gate: 2 tasks)
- Sequential single-agent fallback: ~17 ordered edits + Task 19 user check
- New CSS rules added: ~40 lines (origin-story, pull-quote, footer-founders)
- New HTML inserted: ~140 lines (origin story block, pull-quote, rate paragraph, LTV expansion, footer credit, 4 FAQ items)
- New copywriting words (Czech): ~520 words across all v4 content tasks

---

## Pre-flight USER ACTIONS NEEDED

Before this plan can be executed, you must answer 3 questions (Task 19):

1. **What is the co-founder's correct surname?** Transcript suggests "Veleba" but earlier context said "Vebr". If you don't know, fallback uses first-name-only across all 4 occurrences.

2. **Does Václav approve this paraphrased quote for Task 13?**
   *"Stavíme to, co bych sám v roce 2008 potřeboval — konzervativní LTV, jasné podmínky, žádný nátlak."*
   (NOT a verbatim transcript line — paraphrase that captures the founder's voice. Founder should sign off before publication.)

3. **Are these bio claims about Václav and Luboš factually accurate?** (FAQ A4)
   - Václav: "17+ let v realitách a obchodě, MBA, sám si jím v roce 2008 zachránil nemovitost"
   - Luboš: "pochází z nebankovního financování — patří mezi férové věřitele, na které Václav před lety narazil"
