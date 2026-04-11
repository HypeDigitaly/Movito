# Architecture — Movito Landing Page (v2)

This document describes the current structure, data flow, and technical patterns in the Movito landing page after the v2 rework.

---

## Page Structure

The page is a single static HTML file with embedded CSS and JavaScript. No build process, no bundler — delivered as-is to browsers.

```
<header>
├── marketing-notice-strip (role="note")
├── skip-link (#main)
└── nav (#nav)
    ├── nav__logo
    ├── nav__contact (phone + email links)
    └── nav__panel (Kategorie + CTA links)

<body>
├── <main id="main">
│   ├── <section id="hero">
│   │   ├── Hero heading + subheading
│   │   ├── Interactive calculator (SVG + JS)
│   │   ├── Trust row (4 metrics)
│   │   └── CTAs (→ #formular, financing pitch)
│   │
│   ├── <section id="formular">
│   │   ├── H2 "Chci nabídku šitou na míru"
│   │   ├── Subheading helper
│   │   ├── <form id="lead-form" novalidate>
│   │   │   ├── .hp-field (honeypot)
│   │   │   ├── name (required, text)
│   │   │   ├── category (required, visible <select>)
│   │   │   ├── email (required, email)
│   │   │   ├── phone (required, tel)
│   │   │   ├── investment_amount (optional, select)
│   │   │   ├── consent (required, checkbox)
│   │   │   ├── qualified_investor_ack (optional, checkbox)
│   │   │   └── submit button
│   │   └── .lead-form__success (success message, initially hidden)
│   │
│   └── <section id="investment-categories">
│       ├── <ul role="tablist"> (5 tabs, hidden on mobile)
│       │   ├── <li><button role="tab" data-category-id="podily"></button></li>
│       │   ├── <li><button role="tab" data-category-id="nemovitosti"></button></li>
│       │   └── ... (3 more)
│       │
│       └── <div role="tabpanel"> (5 panels, shown stacked on mobile)
│           ├── <h3 class="mobile-heading"> (hidden on desktop, visible on mobile)
│           ├── Category description
│           ├── .inv-panel__sidebar (facts + disclaimer + CTA)
│           └── ... (4 more)
│
└── <footer>
    └── Legal links, copyright, contact info
```

---

## Form Wiring & Category Pre-Selection

### Form Section (`#formular`)

**Location:** `index.html:2690–2783`

The form is an always-visible, always-in-flow section. No modal, no drawer. Submit handler is a single function reused for all form instances (future-proofing for multi-form layouts).

**Key elements:**
- `<form id="lead-form" novalidate>` — HTML5 validation disabled; JS handles all validation
- 5 required fields (name, category, email, phone, gdpr consent)
- Category field is a **visible, user-facing `<select>`** with 5 option values matching the backend enum
- All required fields have `aria-required="true"`, `aria-invalid="false"` initially, `aria-describedby="error-{name}"`
- Error containers: `<span id="error-{name}" class="form-group__error" role="alert"></span>`
- Success state: `<div class="lead-form__success" role="status" aria-live="polite" hidden>`

### Category Pre-Selection Flow

**Trigger:** Click on `[data-scroll-to-form]` button inside `.inv-panel`

**Steps:**
1. Click handler fires on `[data-scroll-to-form]` (lines 3906–3929)
2. Check if click originated inside `.inv-panel` (i.e., a category panel CTA, not a top-level CTA)
3. If yes:
   - Get active tab element: `tablist.querySelector('[role="tab"][aria-selected="true"]')`
   - Extract `data-category-id` attribute (e.g., "podily")
   - Validate against whitelist: `['podily', 'nemovitosti', 'baterie', 'kovy', 'krypto']`
   - Set the `<select>` value: `document.querySelector('#formular form [name="category"]').value = cat`
   - Clear `aria-invalid` on the category field
   - Dispatch `change` event (for any form observers)
   - Push GA event: `{ event: 'cta_click', category: cat, cta_location: 'category-panel' }`
4. Call `scrollToForm()` → smooth scroll to `#formular` section
5. On mobile, also focuses the first form field (name input)

**Exclusions:**
- Hero "Začít investovat" link (`href="#formular"`) — no pre-selection, just scroll
- Hero "Získat nabídku financování" button — has `[data-scroll-to-form]` but is gated by `btn.closest('.inv-panel')`, so scrolls without pre-selection
- Mobile sticky CTA — similarly gated, scrolls + focuses first field only

### Form Validation & Submission

**Handler:** `validateAndSubmit(formEl, e)` (lines 3350–3547)

**Client-side validation:**
- **name:** non-empty, maxlength 100
- **category:** non-empty, must be one of ALLOWED_CATEGORIES (checked against hardcoded list in JS for UX feedback)
- **email:** valid email format (HTML5 `type="email"` + JS double-check)
- **phone:** non-empty, maxlength 20
- **consent (GDPR):** must be checked
- **honeypot:** if `.hp-field input` (name="website") is filled, silently return success without sending (bot detection)

**Error display:**
- Set `aria-invalid="true"` on invalid field
- Populate error message into corresponding `<span id="error-{name}" role="alert">`
- User sees error immediately, form does not submit

**Success flow:**
- POST JSON body to `/.netlify/functions/contact`
- Request body:
  ```json
  {
    "name": "...",
    "category": "podily",
    "email": "...",
    "phone": "...",
    "investment_amount": "1m-5m",
    "consent": true,
    "qualified_investor_ack": false
  }
  ```
- On success (200 OK, `{ success: true }`):
  1. Hide form, show success message
  2. Clear all form fields
  3. Focus success heading (`<h3 tabindex="-1">`) for screen reader announcement
  4. Push GA event: `{ event: 'lead_submitted' }`
- On network error:
  1. Show error container with `role="alert" aria-live="polite"`
  2. Display user-friendly message (or fallback generic message)
  3. Form remains visible; user can retry

---

## Mobile Strategy & Responsive Behavior

### Breakpoint: 768px

**Tablet and up (≥769px):**
- Tab list `.inv-tabs` is visible and functional (keyboard + click navigation)
- Panels are shown one at a time based on active tab
- Mobile headings (`<h3 class="mobile-heading">`) are hidden
- Mobile sticky CTA bar is not rendered (or hidden)

**Mobile (≤768px):**
- Tab list `.inv-tabs` is hidden via CSS: `.inv-tabs { display: none }`
- All 5 panels become visible, stacked vertically
- Each panel's `<h3 class="mobile-heading">` becomes visible, providing context labels
- The hidden `[hidden]` attribute on non-default panels is overridden by CSS: `.inv-panel[hidden] { display: block !important }`
- Mobile sticky CTA bar appears when user scrolls past the form

### Mobile Sticky CTA Bar

**Markup:** Lines 3975–3982 (placed at end of body, before closing `</body>`)

```html
<div class="mobile-sticky-cta" hidden aria-hidden="true">
  <button type="button" class="btn btn--primary mobile-sticky-cta__btn">
    Chci více informací →
  </button>
</div>
```

**Behavior (JS lines 3935–3969):**
1. Initialize only on mobile: `if (!window.matchMedia('(max-width: 768px)').matches) return;`
2. Create IntersectionObserver watching `#formular` section
3. When form **enters viewport** (top 10% visible):
   - Remove `.visible` class from sticky bar
   - Set `hidden=""` and `aria-hidden="true"` (bar disappears)
4. When form **leaves viewport** (scrolled out of view):
   - Add `.visible` class
   - Remove `hidden` attribute, set `aria-hidden="false"` (bar appears)
5. Click handler:
   - Call `scrollToForm()` (smooth scroll to form)
   - After 400ms delay, focus first form field (`#lead-name`)
   - Push GA event: `{ event: 'cta_click', trigger: 'sticky_bar' }`

**Styling:** Fixed position at bottom, 48px+ touch target, animated in/out based on `.visible` class and `prefers-reduced-motion`.

---

## Data Contract with Backend

**Endpoint:** `/.netlify/functions/contact` (Netlify function, TypeScript, Node.js 20)

**Request:**
- Method: POST
- Content-Type: application/json
- Body: ContactBody (see schema below)
- Max size: 10 KB

**Schema (from `netlify/functions/_lib/validate.ts`):**
```typescript
export const ALLOWED_CATEGORIES = ['podily', 'nemovitosti', 'baterie', 'kovy', 'krypto', ''] as const;

export const INVESTMENT_AMOUNTS = [
  '500k-1m', '1m-5m', '5m-20m', '20m+', 'unknown', ''
] as const;

interface ContactBody {
  name: string;           // required, 1–100 chars
  category: string;       // required, must be in ALLOWED_CATEGORIES
  email: string;          // required, valid email format
  phone: string;          // required, 1–20 chars
  investment_amount?: string;  // optional, empty or one of INVESTMENT_AMOUNTS
  consent: boolean;       // required, must be true
  qualified_investor_ack?: boolean;  // optional
}
```

**Response (success):**
```json
{
  "success": true,
  "message": "Zpráva odeslána."
}
```

**Response (error):**
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Pole X je povinné.",
  "fields": { "category": ["Neplatná kategorie"] }
}
```

**Backend validation pipeline (unchanged):**
1. Env guard (API key, sender, notification emails)
2. Method guard (POST only)
3. Body size guard (≤10 KB)
4. Content-Type guard (application/json)
5. JSON parse
6. Origin check (production only; regex-hardened to prevent bypass)
7. Honeypot check (silent success if website field is filled)
8. Schema validation (type, length, enum checks)
9. Resend email dispatch (confirmation to user, notification to team)

---

## Key JavaScript Functions

### 1. `validateAndSubmit(formEl, e)`
**Lines:** 3350–3547

Handles form validation, submission, and error/success states. Called on `form.submit` event.

**Process:**
- Prevent default form submission
- Honeypot check → silent success if triggered
- Validate required fields (name, category, email, phone, consent)
- On validation error: set `aria-invalid="true"`, populate error spans
- On success: POST to backend
- Handle response: show/hide form & success message, focus management

### 2. `scrollToForm()`
**Lines:** 3810–3812

Smooth scroll to `#formular` section. Used by multiple CTAs (hero, category panels, mobile sticky bar).

```javascript
function scrollToForm() {
    document.getElementById('formular')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
```

### 3. Tab Widget IIFE
**Lines:** 3822–3930

WAI-ARIA tab pattern implementation. Manages active tab state, keyboard navigation (Arrow Left/Right, Home/End), and panel visibility.

**Public function:**
- `selectTab(idx, userInitiated)` — switches active tab and updates ARIA attributes

**Event handlers:**
- Click on tab → select it
- Arrow Left/Right → cycle tabs
- Home/End → jump to first/last tab
- Enter/Space → select current tab (no-op)

**Category pre-selection integration:**
- Listens for `[data-scroll-to-form]` clicks
- If click is inside `.inv-panel`, reads active tab's `data-category-id`
- Pre-fills form category select before scrolling

### 4. Mobile Sticky CTA IIFE
**Lines:** 3935–3969

IntersectionObserver-based sticky CTA bar. Only runs on mobile (≤768px).

**Process:**
- Observe `#formular` section
- On visible: hide sticky bar
- On out of view: show sticky bar
- Click handler: scroll to form + focus first field

---

## Accessibility Contract

### Landmarks & Skip Links

- `<main id="main">` wraps all primary content (hero, form, categories)
- `<a class="skip-link" href="#main">` at top of body allows keyboard users to jump to content

### Form ARIA

All form fields follow the pattern:
```html
<div class="form-group">
  <label for="lead-{name}">{Label} <span class="form-group__required" aria-label="povinné">*</span></label>
  <input type="..." id="lead-{name}" name="{name}" required
         aria-required="true"
         aria-invalid="false"
         aria-describedby="error-{name}">
  <span id="error-{name}" class="form-group__error" role="alert"></span>
</div>
```

- `aria-required="true"` on required fields
- `aria-invalid="true"` on validation error (set by JS)
- `aria-describedby="error-{name}"` links to error message span
- Error spans have `role="alert"` for screen reader announcements
- Submit button text is clear and descriptive

### Success State ARIA

```html
<div class="lead-form__success" role="status" aria-live="polite" hidden>
  <h3 tabindex="-1">Děkujeme!</h3>
  <p>Prověřili jsme Váš dotaz...</p>
</div>
```

- `role="status"` + `aria-live="polite"` announces success message to screen readers
- `<h3 tabindex="-1">` allows programmatic focus after form submission (JS calls `.focus()`)

### Abbreviations

9 instances of `<abbr title="...">`:
- "p.a." → "per annum"
- "LTV" → "Loan-to-Value"
- "ZISIF" → "Zákon o investičních společnostech a fondech"

### Focus Visibility

Custom focus styles for all interactive elements:
- `.btn--primary:focus-visible`
- `.btn--dark:focus-visible`
- Tab elements (`.inv-tab:focus-visible`)
- Form inputs (`:focus-visible`)

### Touch Targets

All touch targets on mobile are ≥48×48 pixels:
- Buttons: 48px height minimum
- Checkboxes: label padding expands touch area
- Select dropdowns: 48px height minimum

### Motion Preferences

All animations respect `prefers-reduced-motion: reduce`:
```css
@media (prefers-reduced-motion: reduce) {
    .deco { animation: none !important; }
    .form-submit-animation { animation: none !important; }
    .mobile-sticky-cta { transition: none !important; }
}
```

---

## Design Tokens

### Colors

**Grays & Backgrounds:**
- `--bg-darkest: #FAFAF7` (main background)
- `--bg-dark: #F4F3EE` (alternate section)
- `--bg-medium: #ECEAE3` (tertiary section)
- `--bg-card: #FFFFFF` (card/form background)
- `--bg-card-hover: #FDFCF9` (hover state)

**Gold Palette:**
- `--gold-600: #7A5E0A` (darkest, text)
- `--gold-500: #96730F` (main)
- `--gold-400: #A98215` (lighter)
- `--gold-300: #BF961F` (lightest)
- `--gold-100: #5C4708` (darkest variant)
- `--gold-glow: rgba(150, 115, 15, 0.18)` (transparency for overlays)

**Text:**
- `--text-white: #1C1B17` (main text color, ironically named)
- `--text-light: #3D3C36` (secondary text)
- `--text-muted: #58574F` (tertiary)
- `--text-dim: #9C9B92` (least visible)

**Accents:**
- `--green-accent: #16A34A` (success)
- `--red-accent: #DC2626` (error)

### Fonts

- `--font-display: 'Playfair Display', Georgia, 'Times New Roman', serif` (headings, CTAs)
- `--font-body: 'DM Sans', -apple-system, sans-serif` (body text, form labels)

### Spacing & Radii

- `--radius-sm: 10px`
- `--radius-md: 16px`
- `--radius-lg: 24px`
- `--radius-xl: 32px`

### Shadows

- `--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.03)` (subtle)
- `--shadow-card-hover: 0 4px 24px rgba(0, 0, 0, 0.07), 0 1px 4px rgba(0, 0, 0, 0.04)` (elevated)
- `--shadow-gold: 0 4px 24px rgba(150, 115, 15, 0.18)` (gold glow)
- `--shadow-gold-lg: 0 8px 40px rgba(150, 115, 15, 0.25)` (large gold glow)
- `--shadow-dark: 0 8px 32px rgba(0, 0, 0, 0.06)` (dark shadow)

### Z-Index Scale

- `--z-sticky: 998` (sticky elements, e.g., mobile CTA bar)
- `--z-nav: 1000` (navigation, always on top)

---

## Known Constraints

1. **Single HTML file:** No bundling, no build step. All CSS is inline in `<style>`, all JS is inline in `<script>`.
2. **No framework:** Vanilla JavaScript only. DOM manipulation via `querySelector`, `addEventListener`, `classList`.
3. **Netlify Functions backend:** Form submission posts to `/.netlify/functions/contact` (TypeScript, Node.js 20).
4. **Resend email service:** Uses Resend API (env var `RESEND_API_KEY`) for sending confirmation and notification emails.
5. **Static hosting:** No server-side rendering, no dynamic routes. Entire page is static except for the Netlify Function endpoint.
6. **CSP headers:** If Content Security Policy is configured at Netlify, ensure `script-src 'unsafe-inline'` is permitted (inline JS is necessary without a build process).
7. **Browser support:** Modern evergreen browsers (Chrome, Firefox, Safari, Edge) with ES6+ support. IE not supported.

---

## Future Considerations

- **Tab widget on mobile:** The tab JS continues to run on mobile even though tabs are hidden by CSS. A future refactor could conditionally initialize the widget only on desktop (media query in JS).
- **Form validation:** Currently dual: HTML5 `required` attribute + JS validation. Could be unified or moved entirely to JS for more control.
- **Sticky CTA timing:** The 400ms timeout for focus after scroll is empirical and may need adjustment for slower devices.
- **Category enum sync:** Keep the hardcoded category list in JS (line 3914) synchronized with the backend `ALLOWED_CATEGORIES` constant.
