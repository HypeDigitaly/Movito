# CRO Optimization: Lead Capture System Documentation

**Last Updated:** 2026-04-06  
**Status:** Ready for Launch (Pre-Launch Checklist Required)  
**Target Audience:** Developers, QA Engineers, Operations Team

---

## Table of Contents

1. [Overview & CRO Goals](#overview--cro-goals)
2. [New Components](#new-components)
3. [CTA Hierarchy](#cta-hierarchy)
4. [JavaScript Architecture](#javascript-architecture)
5. [CSS Architecture](#css-architecture)
6. [Pre-Launch Checklist](#pre-launch-checklist)
7. [Testing Guide](#testing-guide)
8. [Analytics Events](#analytics-events)

---

## Overview & CRO Goals

### What Changed

A complete lead capture system was integrated into the Czech investment landing page (`index.html`) to increase conversion rates and improve lead qualification.

### CRO Objectives

- **Primary Goal:** Convert calculator viewers into qualified leads (name, email, phone, investment amount)
- **Secondary Goal:** Capture investment sizing bracket for sales team segmentation
- **Tertiary Goal:** Reduce friction with 3 form placement points + pre-filling logic
- **Technical Goal:** Maintain page performance (<2s load time) and accessibility (WCAG AA)

### Key Changes Summary

| Component | Type | Status |
|-----------|------|--------|
| Lead form (template-based) | New | 3 instances |
| Hero mini-calculator | New | Independent from main calc |
| Desktop sticky bar | New | After hero, hides at form |
| Form modal | New | Accessible dialog |
| CTA hierarchy redesign | Modified | See CTA section |
| Calculator-form bridge | New | Auto-fill + analytics |

---

## New Components

### 1. Lead Form Template

**Location:** `<template id="lead-form-template">` (line 3949)

**Purpose:** Single source of truth cloned to 3 mount points to avoid code duplication.

**Fields:**

```html
<input type="text" name="name" placeholder="Např. Jan Novák" required />
<input type="email" name="email" placeholder="vas@email.cz" required />
<input type="tel" name="phone" placeholder="+420" required />
<select name="investment_amount" required>
  <option value="100k-500k">100 tis. – 500 tis. Kč</option>
  <option value="500k-1m">500 tis. – 1 mil. Kč</option>
  <option value="1m-5m">1 – 5 mil. Kč</option>
  <option value="5m-20m">5 – 20 mil. Kč</option>
  <option value="20m+">20 mil. Kč a více</option>
  <option value="unknown">Zatím nevím</option>
</select>
<input type="checkbox" name="consent" required />
<!-- Honeypot -->
<input type="text" name="website" class="hp-field" aria-hidden="true" />
```

**Template Features:**

- **Trust bar** (lock icon + security text)
- **Headline & subheadline** (centered, personalized on success)
- **Form groups** with individual error spans
- **Honeypot field** (hidden, catches spambots)
- **GDPR consent** checkbox with link to privacy policy
- **Success message** (hidden until submission succeeds)
- **Trust strip** (dotted list below form with badges)

**Form Mount Points:**

```html
<div id="primary-form-mount"></div>      <!-- Contact section (primary CTA) -->
<div id="secondary-form-mount"></div>    <!-- FAQ section (secondary CTA) -->
<div id="modal-form-mount"></div>        <!-- Modal (sticky bar + mobile) -->
```

**Design Notes:**

- Max-width: 560px (centered)
- Border: gold accent top (3px), subtle border around
- Background: semi-transparent card style
- Responsive: full width on mobile with 32px padding

---

### 2. Hero Mini-Calculator

**Location:** Within hero section (lines 2436–2513 CSS, ~3000 HTML)

**Purpose:** Quick ROI preview without leaving hero, drives engagement before scroll.

**Inputs:**

- Slider: 500k – 50M Kč (rounded above 5M)
- Pills: 2, 5, 10 years (duration selection)
- Auto-calculation: 10% annual return

**Display:**

```
Investment: 5 mil. Kč
Return over 2 years: 1 mil. Kč
```

**Gradient Fill:**

The slider has a live gradient fill showing progress (gold-500 to gold-400, then transparent).

**JavaScript Variables:**

```javascript
let heroDuration = 2;  // Default
const heroSlider = document.getElementById('heroCalcSlider');
const heroResult = document.getElementById('heroCalcResult');
const heroDisplay = document.getElementById('heroCalcDisplay');
```

**Independence:**

- Separate from main calculator (different variables)
- Updates via `updateHeroCalc()` function
- Does NOT affect main calculator state

---

### 3. Desktop Sticky Bar

**Location:** Fixed bottom after hero scroll (lines 2319–2356 CSS, line 4023 HTML)

**Purpose:** Convert browsers who scroll past hero without clicking CTA.

**Visibility Logic:**

```javascript
const isVisible = heroBottom < 0 && formTop > window.innerHeight;
stickyBar.classList.toggle('visible', isVisible);
```

- Shows when hero is scrolled past AND form section is not yet visible
- Hidden on mobile (<768px viewport) via `display: none !important`
- Smooth slide-in animation (translateY from 100%)

**Content:**

```html
<p class="sticky-bar__text">Již 237+ investorů nám svěřilo kapitál.</p>
<!-- Or dynamically updated to: "Investice 5 mil. Kč na 2 roky" -->

<button type="button" class="btn btn--primary" id="stickyBarCTA">
  Domluvit konzultaci
</button>
```

**Dynamic Update:**

When user interacts with main calculator, sticky bar text updates to show:

```
"Investice {amount} na {years} {years === 1 ? 'rok' : 'roky'}"
```

Example: "Investice 10 mil. Kč na 5 roků"

**Z-Index:** 998 (below modal, above content)

---

### 4. Form Modal

**Location:** Lines 2358–2431 CSS, lines 4036–4043 HTML

**Purpose:** Non-intrusive form lightbox triggered by sticky bar or mobile CTA buttons.

**Accessibility Features:**

- Role: `dialog` with `aria-modal="true"`
- Focus trap: Tab loops within modal
- Escape key: closes modal
- Backdrop click: closes modal
- Focus restoration: returns focus to trigger button on close
- Live region: success message announced to screen readers

**Structure:**

```html
<div class="form-modal" id="formModal" role="dialog" aria-modal="true" aria-hidden="true">
  <div class="form-modal__backdrop"></div>
  <div class="form-modal__panel">
    <button class="form-modal__close" aria-label="Zavřít">&times;</button>
    <h2 class="form-modal__heading">Domluvit konzultaci</h2>
    <div id="modal-form-mount"></div>
  </div>
</div>
```

**Styling:**

- Backdrop: Dark overlay with blur filter
- Panel: 520px max-width, scales up on open (0.94 → 1.0)
- Z-Index: Modal backdrop 1100, panel 1101
- Mobile: 100% width minus 48px padding

**JavaScript Control:**

```javascript
openModal()    // Adds 'open' class, sets aria-hidden="false", focus trap active
closeModal()   // Removes 'open' class, restores focus
```

---

## CTA Hierarchy

### Primary CTAs (→ Form)

These buttons point users toward form submission (lead capture priority).

| Location | Button Text | Target | ID |
|----------|------------|--------|-----|
| Navigation | Domluvit konzultaci | #kontakt-form-section | nav (implied) |
| Risk/Safety Section | Mám otázku k bezpečnosti | #kontakt-form-section | (generic link) |
| FAQ Section | Zeptejte se nás přímo | #kontakt-form-section | (generic link) |
| Sticky Bar | Domluvit konzultaci | Opens modal | #stickyBarCTA |
| Mobile CTA | Domluvit konzultaci | Opens modal | #mobileCTABtn |

**Action:** All primary CTAs either scroll to #kontakt-form-section or open modal, prefilling the form with calculator values.

---

### Secondary CTAs (→ Calculator)

These support warm traffic coming with intent, but don't force form yet.

| Location | Button Text | Target | ID |
|----------|------------|--------|-----|
| Hero | Spočítat návratnost | #kalkulacka | (generic link) |
| Sticky Bar | Kalkulátor | #kalkulacka | (generic link) |

**Action:** Scroll to main calculator, allow exploration before form push.

---

### CTA Interaction Flow

```
Cold Traffic (Hero)
  ↓
Click "Spočítat" → Scroll to Calculator
  ↓
Play with calculator, get personalized ROI
  ↓
User Engagement Trigger: Slider moved (calculatorInteracted = true)
  ↓
Scroll continues → Hero leaves viewport
  ↓
Sticky Bar appears with: "Investice X mil. Kč na Y roků"
  ↓
User clicks "Domluvit konzultaci" → Modal opens
  ↓
Form pre-filled with investment amount bracket
  ↓
Form submit → Success message
```

---

## JavaScript Architecture

### Core Utilities

**Currency Formatting:**

```javascript
function formatCurrency(value) {
  // 5000000 → "5 000 000 Kč"
  return value.toLocaleString('cs-CZ').replace(/\s/g, ' ') + ' Kč';
}

function formatCurrencyShort(value) {
  // 5000000 → "5 mil. Kč"
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1).replace('.0', '') + ' mil. Kč';
  }
  return formatCurrency(value);
}
```

---

### Template Cloning System

**Purpose:** Create 3 independent form instances (primary, secondary, modal) from single template without code duplication.

**Process (lines 4304–4323):**

```javascript
const formTemplate = document.getElementById('lead-form-template');
const formMounts = [
  { id: 'primary-form-mount', suffix: 'primary' },
  { id: 'secondary-form-mount', suffix: 'secondary' },
  { id: 'modal-form-mount', suffix: 'modal' }
];

formMounts.forEach(({ id, suffix }) => {
  const mount = document.getElementById(id);
  if (mount && formTemplate) {
    const clone = formTemplate.content.cloneNode(true);
    
    // Rename all IDs to avoid duplicates
    clone.querySelectorAll('[id]').forEach(el => {
      const oldId = el.id;
      el.id = oldId + '-' + suffix;
      
      // Update label references
      const label = clone.querySelector('label[for="' + oldId + '"]');
      if (label) label.setAttribute('for', el.id);
    });
    
    mount.appendChild(clone);
  }
});
```

**Result:**

```
lead-name → lead-name-primary, lead-name-secondary, lead-name-modal
lead-email → lead-email-primary, lead-email-secondary, lead-email-modal
(etc.)
```

---

### Form Validation & Submission

**Handler:** `validateAndSubmit(formEl, e)` (lines 4341–4498)

**Validation Rules:**

| Field | Validation | Error Message |
|-------|-----------|----------------|
| Name | Min 2 chars, not empty | "Zadejte prosím své jméno (min. 2 znaky)." |
| Email | RFC-simple regex | "Zadejte prosím platný e-mail." |
| Phone | 9–15 digits (after cleanup) | "Zadejte prosím platné telefonní číslo." |
| Consent | Must be checked | "Pro odeslání musíte souhlasit se zpracováním údajů." |

**Honeypot Check (Anti-Spam):**

```javascript
const hp = form.querySelector('.hp-field input');
if (hp && hp.value) {
  // Bot detected — silently show success (don't expose validation)
  form.style.display = 'none';
  const success = leadForm.querySelector('.lead-form__success');
  if (success) success.style.display = 'block';
  return;
}
```

**Error Display:**

1. Collect all errors
2. Add `form-group--error` class to field container
3. Populate error span text
4. Focus first errored field
5. On user input to errored field, remove error class/text

**Submission (lines 4438–4498):**

```javascript
// 1. Disable button + change text
submitBtn.disabled = true;
submitBtn.textContent = 'Odesílám...';

// 2. POST to Formspree
fetch(FORM_ENDPOINT, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput ? phoneInput.value.trim() : '',
    investment_amount: form.querySelector('select[name="investment_amount"]').value,
    consent_timestamp: new Date().toISOString(),
    form_location: mountEl ? mountEl.id : 'unknown'
  })
})

// 3. On success
.then(response => {
  if (response.ok) {
    form.style.display = 'none';
    const success = leadForm.querySelector('.lead-form__success');
    if (success) {
      success.style.display = 'block';
      const h3 = success.querySelector('h3');
      if (h3) h3.textContent = 'Děkujeme, ' + formData.name + '!';
    }
    // Fire analytics
    window.dataLayer.push({ event: 'form_submit', ... });
  }
})

// 4. On error
.catch(() => {
  submitBtn.disabled = false;
  submitBtn.textContent = 'Chci konzultaci zdarma →';
  // Show network error message
  errorMsg.textContent = 'Nepodařilo se odeslat. Zavolejte nám: +420 XXX XXX XXX';
});
```

---

### Calculator-Form Bridge

**Purpose:** Auto-fill investment amount dropdown when user switches to form, and update sticky bar summary text.

**State Tracking:**

```javascript
let calculatorInteracted = false;  // True after first slider/button click
let investmentAmount = 5000000;     // Current slider value
let investmentYears = 2;            // Current duration
```

**Prefill Function (lines 4549–4559):**

```javascript
function prefillForm(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  const select = mount.querySelector('select[name="investment_amount"]');
  if (!select) return;
  
  const amount = investmentAmount;
  if (amount < 1000000) select.value = '500k-1m';
  else if (amount < 5000000) select.value = '1m-5m';
  else if (amount < 20000000) select.value = '5m-20m';
  else select.value = '20m+';
}
```

**Sticky Bar Update (lines 4562–4568):**

```javascript
function updateStickyBarSummary() {
  if (!calculatorInteracted) return;
  const textEl = document.querySelector('.sticky-bar__text');
  if (textEl) {
    textEl.textContent = 'Investice ' + formatCurrencyShort(investmentAmount) 
      + ' na ' + investmentYears + ' ' 
      + (investmentYears === 1 ? 'rok' : 'roky');
  }
}
```

**Trigger:** Calculator's `updateCalculator()` calls this after slider/button changes (line 4223).

---

### Modal Control

**Open Modal (lines 4594–4609):**

```javascript
function openModal() {
  lastFocusedElement = document.activeElement;  // Store for restoration
  formModal.classList.add('open');
  formModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';  // Prevent scroll
  
  // Close mobile nav if open
  if (nav && nav.classList.contains('open')) nav.classList.remove('open');
  
  // Focus first input
  setTimeout(() => {
    const firstInput = formModal.querySelector('input:not([tabindex="-1"]), select');
    if (firstInput) firstInput.focus();
  }, 100);
}
```

**Close Modal (lines 4611–4620):**

```javascript
function closeModal() {
  formModal.classList.remove('open');
  formModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';  // Re-enable scroll
  if (lastFocusedElement) lastFocusedElement.focus();
  
  // Analytics
  if (window.dataLayer) window.dataLayer.push({ event: 'modal_close' });
}
```

**Close Triggers:**

1. **Backdrop click** (line 4623)
2. **Close button click** (line 4624)
3. **Escape key** (line 4625–4627)

**Focus Trap (lines 4630–4645):**

When Tab key pressed inside modal:
- If focus on first focusable element + Shift+Tab → Jump to last
- If focus on last focusable element + Tab → Jump to first
- Prevents focus from leaving modal

---

## CSS Architecture

### Color Palette

```css
:root {
  --bg-darkest: #0D0A06;    /* Page background */
  --bg-card: #1E1A12;       /* Form & card backgrounds */
  --gold-500: #C9A84C;      /* Primary accent */
  --gold-400: #D4B85C;      /* Lighter gold */
  --gold-300: #E2CC7A;      /* Light gold for display */
  --text-white: #F5F0E0;    /* Headings */
  --text-light: rgba(245, 240, 224, 0.7);     /* Body text */
  --text-muted: rgba(245, 240, 224, 0.45);    /* Secondary text */
  --red-accent: #EF4444;    /* Error states */
  --green-accent: #4ADE80;  /* Success states */
}
```

### Z-Index System

```css
--z-sticky: 998;              /* Sticky bar */
--z-mobile-cta: 999;          /* Mobile CTA button */
--z-nav: 1000;                /* Navigation */
--z-modal-backdrop: 1100;     /* Modal backdrop */
--z-modal: 1101;              /* Modal panel */
```

**Stacking Order (top to bottom):**

```
Modal Panel (1101)
  ↓
Modal Backdrop (1100)
  ↓
Navigation (1000)
  ↓
Mobile CTA (999)
  ↓
Sticky Bar (998)
  ↓
Content (default)
```

---

### Form Component CSS

**Lead Form Container (lines 2050–2070):**

```css
.lead-form {
  background: var(--bg-card);
  border: 1px solid rgba(201, 168, 76, 0.20);
  border-radius: 32px;
  max-width: 560px;
  margin: 0 auto;
  padding: 48px;
}

.lead-form::before {  /* Gold top accent */
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, var(--gold-500), var(--gold-400));
  border-radius: 32px 32px 0 0;
}
```

**Input Fields (lines 2114–2153):**

```css
.form-group input,
.form-group select {
  width: 100%;
  height: 56px;
  padding: 16px 20px;
  background: rgba(42, 36, 24, 0.6);
  border: 1.5px solid rgba(201, 168, 76, 0.14);
  border-radius: 16px;
  color: var(--text-white);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.form-group input:focus,
.form-group select:focus {
  border-color: rgba(201, 168, 76, 0.55);
  box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.10);
  background: rgba(42, 36, 24, 0.9);
}
```

**Error State (lines 2162–2169):**

```css
.form-group--error input,
.form-group--error select {
  border-color: rgba(239, 68, 68, 0.50);
}

.form-group--error .form-group__error {
  display: block;
}
```

**Submit Button (lines 2203–2227):**

```css
.lead-form__submit {
  width: 100%;
  height: 60px;
  background: linear-gradient(135deg, var(--gold-500), var(--gold-400));
  color: var(--bg-darkest);
  font-weight: 700;
  font-size: 17px;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  box-shadow: var(--shadow-gold);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.lead-form__submit:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-gold-lg);
}

.lead-form__submit:disabled {
  opacity: 0.7;
  pointer-events: none;
}
```

**Success Message (lines 2237–2272):**

```css
.lead-form__success {
  display: none;
  text-align: center;
  padding: 32px 0;
}

.lead-form__success .success-icon {
  width: 56px;
  height: 56px;
  background: rgba(74, 222, 128, 0.12);
  border: 1px solid rgba(74, 222, 128, 0.25);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}
```

---

### Sticky Bar CSS (lines 2319–2356)

```css
.sticky-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  background: rgba(13, 10, 6, 0.90);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(201, 168, 76, 0.12);
  padding: 14px 0;
  transform: translateY(100%);  /* Hidden below */
  transition: transform 0.4s ease;
}

.sticky-bar.visible {
  transform: translateY(0);  /* Slide up */
}

.sticky-bar__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

**Mobile Breakpoint (line 2695):**

```css
@media (max-width: 767px) {
  .sticky-bar { display: none !important; }
}
```

---

### Modal CSS (lines 2358–2431)

```css
.form-modal {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.form-modal.open {
  opacity: 1;
  pointer-events: all;
}

.form-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(13, 10, 6, 0.85);
  backdrop-filter: blur(8px);
}

.form-modal__panel {
  position: relative;
  z-index: var(--z-modal);
  max-width: 520px;
  width: calc(100% - 48px);
  max-height: 90vh;
  overflow-y: auto;
  background: var(--bg-card);
  border: 1px solid rgba(201, 168, 76, 0.15);
  border-radius: 32px;
  padding: 48px;
  transform: scale(0.94);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.form-modal.open .form-modal__panel {
  transform: scale(1);  /* Zoom in */
}
```

---

### Hero Calculator CSS (lines 2436–2513)

```css
.hero-calc {
  background: rgba(30, 26, 18, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(201, 168, 76, 0.14);
  border-radius: 24px;
  padding: 24px 28px;
  max-width: 480px;
  margin: 32px auto 0;
  opacity: 0;
  animation: fadeInUp 0.8s 0.95s forwards;
}

.hero-calc__result {
  font-size: 28px;
  color: var(--gold-300);
}

.hero-calc__pill {
  padding: 7px 18px;
  border-radius: 100px;
  border: 1px solid rgba(201, 168, 76, 0.14);
  background: rgba(201, 168, 76, 0.08);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.hero-calc__pill.active {
  background: rgba(201, 168, 76, 0.18);
  border-color: rgba(201, 168, 76, 0.40);
  color: var(--gold-300);
}
```

---

### Responsive Breakpoints

**Mobile (<768px):**

- `form-modal__panel`: width = 100% - 32px
- `sticky-bar`: display = none
- Forms: full width with adjusted padding
- Hero calculator: reduced padding

**Tablet/Desktop (≥768px):**

- `form-modal__panel`: 520px max-width
- `sticky-bar`: visible when conditions met
- Forms: max 560px centered

---

## Pre-Launch Checklist

**STATUS: CRITICAL — Must complete before going live**

### 1. Formspree Configuration

**File:** `/c/Users/Pavli/Desktop/HypeDigitaly/GIT/Movito/index.html`

**Location:** Line 4301

**Current:** 
```javascript
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; // TODO
```

**Action Required:**

1. Go to https://formspree.io
2. Create new form project
3. Copy form ID (e.g., `f_abc12def3`)
4. Replace `YOUR_FORM_ID`:

```javascript
const FORM_ENDPOINT = 'https://formspree.io/f/f_abc12def3';
```

**Verification:**
- [ ] Form ID is 15+ characters
- [ ] Endpoint URL is valid HTTPS
- [ ] Test form submission on staging

---

### 2. Phone Numbers — Replace All Instances

**File:** `/c/Users/Pavli/Desktop/HypeDigitaly/GIT/Movito/index.html`

**Current Pattern:** `+420 XXX XXX XXX` and `+420000000000`

**Locations to Update:**

```
Line 3850:  Nebo rovnou zavolejte: <a href="tel:+420000000000">+420 XXX XXX XXX</a>
Line 3897:  <li><a href="tel:+420000000000">+420 XXX XXX XXX</a></li>
Line 3942:  <a href="tel:+420000000000" class="...">Zavolejte nám</a>
Line 4496:  'Nepodařilo se odeslat. Zavolejte nám: +420 XXX XXX XXX'
```

**Action Required:**

1. Search & Replace: `+420 XXX XXX XXX` → your actual number
2. Search & Replace: `+420000000000` → your actual number (tel: format)

**Example:**

```
// Before:
Nebo rovnou zavolejte: <a href="tel:+420000000000">+420 XXX XXX XXX</a>

// After:
Nebo rovnou zavolejte: <a href="tel:+420257321456">+420 257 321 456</a>
```

**Verification:**
- [ ] All 4 occurrences updated
- [ ] Phone number valid Czech format
- [ ] Matching in both tel: links and display text
- [ ] Test: Click link, verify phone app opens

---

### 3. Privacy Policy Page

**File:** Check if exists at `/zasady-ochrany-osobnich-udaju`

**Current Reference:** Line 3999

```html
<a href="/zasady-ochrany-osobnich-udaju" target="_blank" rel="noopener">
  zpracováním osobních údajů
</a>
```

**Action Required:**

1. Verify file exists: `/zasady-ochrany-osobnich-udaju.html` (or similar)
2. If missing, create minimal privacy policy page
3. Update path if different:

```html
<a href="/privacy-policy" target="_blank" rel="noopener">
  zpracováním osobních údajů
</a>
```

**Minimum Requirements:**

- GDPR-compliant consent language
- Data usage explanation
- Contact for data requests
- Czech language (target audience)

**Verification:**
- [ ] File exists and is accessible
- [ ] Link opens in new tab (target="_blank")
- [ ] Page loads without errors
- [ ] Content covers GDPR basics

---

### 4. Terms & Conditions Page

**File:** Check if exists at `/podminky-uziti`

**Action Required:**

1. Verify file exists
2. Create if missing (required for legal compliance)
3. Update link in footer if different path

**Verification:**
- [ ] File accessible
- [ ] Czech language
- [ ] Covers service terms

---

### 5. Email Backend Configuration

**Formspree Email Settings:**

1. Log into Formspree dashboard
2. Go to form settings
3. Configure email notifications:
   - **Recipient Email:** sales@movito.cz (or your lead email)
   - **Redirect URL:** `/thank-you` or show success modal (already configured)
   - **Custom Email Subject:** "Nový lead: {name}" (optional)

**Verification:**
- [ ] Test form submission
- [ ] Email received within 5 seconds
- [ ] All fields populated in email
- [ ] Email routing to correct inbox

---

### 6. Analytics Setup

**Google Tag Manager / DataLayer:**

If using GTM, ensure these events are configured:

```javascript
window.dataLayer.push({
  event: 'form_submit',
  form_location: 'primary-form-mount',
  investment_range: '5m-20m'
});

window.dataLayer.push({
  event: 'form_error',
  form_location: 'modal-form-mount',
  error_fields: ['email', 'phone']
});

window.dataLayer.push({
  event: 'modal_open',
  trigger: 'sticky_bar'
});

window.dataLayer.push({
  event: 'calculator_to_form',
  investment_amount: 5000000,
  investment_years: 2
});
```

**Action Required:**

1. Verify `window.dataLayer` is initialized
2. Configure GTM events:
   - `form_submit`
   - `form_error`
   - `modal_open`
   - `modal_close`
   - `calculator_to_form`
   - `cta_click`
3. Set up conversion tracking goals

**Verification:**
- [ ] DataLayer object exists
- [ ] Events fire in browser console
- [ ] Google Analytics receives events
- [ ] Conversions tracked in GA dashboard

---

### 7. Accessibility Audit

**Requirements:** WCAG AA compliance

**Checklist:**

- [ ] Form labels associated with inputs (via `for="id"` attribute)
- [ ] Error messages have `role="alert"`
- [ ] Modal has `role="dialog"` and `aria-modal="true"`
- [ ] Focus trap working (Tab key within modal)
- [ ] Close button accessible via keyboard (Enter/Space)
- [ ] Honeypot hidden with `aria-hidden="true"`
- [ ] Success message has `aria-live="polite"`
- [ ] Color contrast > 4.5:1 (text vs background)
- [ ] Form inputs have min-height 44px (mobile touch target)

**Testing Tools:**

- axe DevTools browser extension
- WAVE: wave.webaim.org
- NVDA screen reader (Windows)

---

### 8. Mobile Testing

**Test on Real Devices:**

- [ ] iPhone 13 (Safari)
- [ ] iPhone SE (Safari)
- [ ] Samsung Galaxy S21 (Chrome)
- [ ] iPad (Safari)

**Mobile Checklist:**

- [ ] Sticky bar is hidden (display: none)
- [ ] Mobile CTA button visible and clickable
- [ ] Modal opens from mobile CTA
- [ ] Form fits without horizontal scroll
- [ ] Touch targets > 44px
- [ ] Keyboard appears for phone input
- [ ] No form fields cut off on small screens
- [ ] Success message readable and accessible

---

### 9. Cross-Browser Testing

**Required Browsers:**

- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (macOS latest)
- [ ] Edge (latest)
- [ ] Safari (iOS 15+)

**Test Coverage:**

- [ ] Form inputs functional
- [ ] Modal opens/closes smoothly
- [ ] Calculator works correctly
- [ ] Sticky bar visibility correct
- [ ] No JavaScript errors (console clean)
- [ ] CSS gradients render
- [ ] Backdrop blur effect works (or degrades gracefully)

---

### 10. Performance Check

**Target Metrics:**

- Page Load: < 2 seconds
- First Contentful Paint: < 1 second
- Largest Contentful Paint: < 2.5 seconds
- Cumulative Layout Shift: < 0.1

**Tools:**

- Google PageSpeed Insights
- WebPageTest.org
- Chrome DevTools (Lighthouse)

**Testing:**

```bash
# Check page speed
lighthouse https://your-domain.cz --output json
```

---

### 11. Form Testing Scenarios

**Happy Path (Valid Submission):**

1. [ ] Fill all fields correctly
2. [ ] Click submit
3. [ ] Form disappears, success message appears
4. [ ] Email received
5. [ ] Personalized success message shows user name

**Validation Testing:**

1. [ ] Submit with empty name → Error message appears
2. [ ] Submit with invalid email (no @) → Error message
3. [ ] Submit with invalid phone (< 9 digits) → Error message
4. [ ] Submit without GDPR consent → Error message
5. [ ] Click error field → Error clears on input

**Honeypot Testing:**

1. [ ] Fill honeypot field (simulate bot)
2. [ ] Submit form
3. [ ] Success message appears (silently, no email sent)
4. [ ] No email in backend

**Network Error Testing:**

1. [ ] Turn off internet
2. [ ] Submit form
3. [ ] Error message shows: "Nepodařilo se odeslat. Zavolejte nám: +420..."
4. [ ] Submit button re-enabled
5. [ ] Turn internet on and retry

---

### 12. Analytics Testing

**Test Each Event:**

```javascript
// In browser console:
window.dataLayer = [];  // Reset

// Event: Form Submit
window.dataLayer.push({
  event: 'form_submit',
  form_location: 'primary-form-mount',
  investment_range: '5m-20m'
});

// Check: Event in GA Realtime > Events
```

**Events to Verify:**

- [ ] `form_submit` (investment_range captured)
- [ ] `form_error` (error_fields logged)
- [ ] `modal_open` (trigger: sticky_bar or mobile_cta)
- [ ] `modal_close`
- [ ] `calculator_to_form` (investment_amount, investment_years)

---

## Testing Guide

### Pre-Launch QA Checklist

#### Setup

1. **Staging Deployment:**
   - Deploy to staging environment
   - Clear browser cache
   - Test on fresh session

2. **Test Accounts:**
   - Valid email: test@example.com
   - Invalid email: test@invalid
   - Valid phone: +420257321456
   - Invalid phone: 123

#### Form Cloning Verification

```javascript
// In browser console:
document.querySelectorAll('.lead-form').length  // Should be 3
// Output: 3

document.querySelectorAll('.lead-form form').length  // Should be 3
// Output: 3

// Check ID uniqueness:
document.querySelectorAll('[id*="lead-name"]')  // Should be 3
// Output: (3) [input#lead-name-primary, input#lead-name-secondary, input#lead-name-modal]
```

---

#### Sticky Bar Testing

**Desktop Only:**

```javascript
// 1. Scroll past hero section
// Expected: Sticky bar slides up

// 2. Check visibility with DevTools:
document.getElementById('stickyBar').classList.contains('visible')  // true

// 3. Scroll to form section
// Expected: Sticky bar slides down out of view

// 4. Mobile (<768px):
// Expected: display: none (not visible)
```

---

#### Modal Testing

**Scenario 1: Open via Sticky Bar Button**

```
1. Scroll past hero
2. Click "Domluvit konzultaci" button
3. Expected: Modal opens smoothly, first input focused
4. Check: <div aria-hidden="false">
```

**Scenario 2: Open via Mobile CTA**

```
1. On mobile device, scroll down
2. Click "Domluvit konzultaci" at bottom
3. Expected: Modal opens, body.overflow = 'hidden'
4. Check: Page doesn't scroll behind modal
```

**Scenario 3: Close with Escape Key**

```
1. Open modal (any method)
2. Press Escape key
3. Expected: Modal closes smoothly
4. Check: Focus returns to trigger button
```

**Scenario 4: Close with Backdrop Click**

```
1. Open modal
2. Click dark area outside modal panel
3. Expected: Modal closes
4. Click modal panel content (form) → Should NOT close
```

**Scenario 5: Focus Trap**

```
1. Open modal
2. Press Tab repeatedly
3. Expected: Focus cycles only within modal
4. Focus should NOT go to elements behind modal
```

---

#### Calculator-Form Bridge Testing

**Scenario: Calculator to Form Prefill**

```
1. Interact with main calculator:
   - Drag slider to 10 mil. Kč
   - Select "5 years" duration
2. Click "Rezervovat konzultaci" (below calculator)
3. Scroll to primary form
4. Expected: Investment amount dropdown = "5m-20m"
5. Sticky bar text: "Investice 10 mil. Kč na 5 roků"
```

**Expected Behavior:**

| Slider Value | Prefilled Option |
|--------------|------------------|
| 500k–999k    | 500k-1m          |
| 1m–4.9m      | 1m-5m            |
| 5m–19.9m     | 5m-20m           |
| 20m+         | 20m+             |

---

#### Hero Calculator Independence

```javascript
// Verify hero calc doesn't affect main calc:
1. Set main calculator: 5m, 2 years
2. Interact with hero calc: 10m, 5 years
3. Scroll to main calc
4. Expected: Still shows 5m, 2 years (unchanged)

// Check different results:
heroDuration = 5;  // Hero: 5 years
investmentYears = 2;  // Main: 2 years (independent state)
```

---

#### Form Validation Testing

**Test Case: Name Field**

```
Input: "" (empty)
Expected Error: "Zadejte prosím své jméno (min. 2 znaky)."

Input: "J" (1 char)
Expected Error: "Zadejte prosím své jméno (min. 2 znaky)."

Input: "Jan Novák" (valid)
Expected Error: (none)
```

**Test Case: Email Field**

```
Input: "invalid"
Expected Error: "Zadejte prosím platný e-mail."

Input: "test@"
Expected Error: "Zadejte prosím platný e-mail."

Input: "test@example.com"
Expected Error: (none)
```

**Test Case: Phone Field**

```
Input: "123" (too short)
Expected Error: "Zadejte prosím platné telefonní číslo."

Input: "+420257321456" (valid)
Expected Error: (none)

Input: "+420 257 321 456" (with spaces)
Expected Error: (none) — spaces removed before validation
```

**Test Case: Consent Checkbox**

```
Unchecked: Submit
Expected Error: "Pro odeslání musíte souhlasit se zpracováním údajů."

Checked: Submit
Expected Error: (none)
```

---

#### Error Clearing

**Scenario: Error clears on user input**

```
1. Try to submit with empty name
2. Error appears: "Zadejte prosím své jméno..."
3. Focus first error field
4. Type "J" in name field
5. Expected: Error message disappears
6. Error class removed from field
```

---

#### Honeypot Anti-Spam

```javascript
// Simulate bot submission:
const form = document.querySelector('.lead-form form');
const hp = form.querySelector('.hp-field input');
hp.value = 'https://spam-site.ru';  // Fill honeypot

// Submit form
form.dispatchEvent(new Event('submit'));

// Expected:
// 1. Form disappears
// 2. Success message appears (but no email sent)
// 3. No backend record created
```

---

#### Network Error Handling

```
1. Open DevTools Network tab
2. Throttle: Offline
3. Fill form correctly
4. Submit
5. Expected:
   - Submit button re-enabled
   - Error message: "Nepodařilo se odeslat. Zavolejte nám: +420 XXX XXX XXX"
   - Form still visible (user can retry or call)
```

---

#### Analytics Events

**Event: form_submit**

```javascript
// In DevTools console after successful submit:
window.dataLayer.filter(e => e.event === 'form_submit')
// Output: [{
//   event: 'form_submit',
//   form_location: 'primary-form-mount',
//   investment_range: '5m-20m'
// }]
```

**Event: form_error**

```javascript
// After validation error:
window.dataLayer.filter(e => e.event === 'form_error')
// Output: [{
//   event: 'form_error',
//   form_location: 'primary-form-mount',
//   error_fields: ['email', 'consent']
// }]
```

**Event: modal_open**

```javascript
// After opening modal:
window.dataLayer.filter(e => e.event === 'modal_open')
// Output: [{
//   event: 'modal_open',
//   trigger: 'sticky_bar'  // or 'mobile_cta'
// }]
```

**Event: calculator_to_form**

```javascript
// After clicking calc CTA button:
window.dataLayer.filter(e => e.event === 'calculator_to_form')
// Output: [{
//   event: 'calculator_to_form',
//   investment_amount: 5000000,
//   investment_years: 2
// }]
```

---

### Regression Testing

**Existing Features to Verify:**

- [ ] Calculator still works (slider, pills, reinvestment)
- [ ] FAQ accordion opens/closes
- [ ] Smooth scroll to sections works
- [ ] Trust bar counter animation
- [ ] Navigation scroll effect
- [ ] Mobile nav toggle

---

## Analytics Events

### Event Map

All events pushed to `window.dataLayer` for Google Tag Manager integration.

#### form_submit

**Fired:** After successful form submission

```javascript
{
  event: 'form_submit',
  form_location: string,        // 'primary-form-mount' | 'secondary-form-mount' | 'modal-form-mount' | 'kontakt-form-section'
  investment_range: string      // '500k-1m' | '1m-5m' | '5m-20m' | '20m+' | 'unknown' | ''
}
```

**Use Case:** Track conversions by form placement and investment sizing.

---

#### form_error

**Fired:** When form validation fails

```javascript
{
  event: 'form_error',
  form_location: string,        // Same as above
  error_fields: Array<string>   // ['name', 'email', 'phone', 'consent']
}
```

**Use Case:** Identify UX friction points (which fields cause errors).

---

#### modal_open

**Fired:** When form modal opens

```javascript
{
  event: 'modal_open',
  trigger: string               // 'sticky_bar' | 'mobile_cta'
}
```

**Use Case:** Track modal engagement by trigger source.

---

#### modal_close

**Fired:** When form modal closes (any method)

```javascript
{
  event: 'modal_close'
}
```

**Use Case:** Track abandonment rate (opens vs. closes).

---

#### calculator_to_form

**Fired:** When user clicks calculator CTA button

```javascript
{
  event: 'calculator_to_form',
  investment_amount: number,    // e.g., 5000000
  investment_years: number      // e.g., 2
}
```

**Use Case:** Understand conversion path (calc interaction → form submission).

---

#### cta_click

**Fired:** When any primary CTA button is clicked (optional, depends on GTM setup)

```javascript
{
  event: 'cta_click',
  cta_location: string,         // 'nav' | 'hero' | 'calculator' | 'sticky_bar'
  cta_text: string              // Button label
}
```

---

## Troubleshooting

### Issue: Form not submitting

**Symptoms:** Click submit, nothing happens.

**Diagnosis:**

```javascript
// Check Formspree endpoint
console.log('Endpoint:', 'https://formspree.io/f/YOUR_FORM_ID');
// Should NOT contain 'YOUR_FORM_ID'

// Check form validation
const form = document.querySelector('.lead-form form');
form.dispatchEvent(new Event('submit'));
// Check browser console for errors
```

**Solution:**

1. Verify `FORM_ENDPOINT` has real form ID (line 4301)
2. Check browser console for JavaScript errors
3. Verify network request in DevTools → Network tab
4. Ensure Formspree is not down (https://formspree.io)

---

### Issue: Modal doesn't open

**Symptoms:** Click button, nothing visible.

**Diagnosis:**

```javascript
// Check modal exists
document.getElementById('formModal')  // Should return element

// Check if modal hidden by CSS
const modal = document.getElementById('formModal');
getComputedStyle(modal).display  // Should NOT be 'none'
getComputedStyle(modal).opacity  // Check opacity

// Manually open
modal.classList.add('open');
// Should appear
```

**Solution:**

1. Verify `formModal` element exists in HTML
2. Check `display: none` not applied by another rule
3. Verify z-index layers are correct
4. Check for JavaScript errors preventing `openModal()` execution

---

### Issue: Sticky bar not showing

**Symptoms:** Scroll past hero, no bar appears on desktop.

**Diagnosis:**

```javascript
// Check visibility logic
const stickyBar = document.getElementById('stickyBar');
const heroEl = document.querySelector('.hero');
const formSection = document.getElementById('kontakt-form-section');

const heroBottom = heroEl.getBoundingClientRect().bottom;
const formTop = formSection.getBoundingClientRect().top;

console.log('heroBottom:', heroBottom);  // Should be < 0 when scrolled
console.log('formTop:', formTop);        // Should be > window.innerHeight when not visible
console.log('Should be visible:', heroBottom < 0 && formTop > window.innerHeight);
```

**Solution:**

1. Check viewport is desktop (>768px)
2. Scroll to trigger position (past hero, before form)
3. Verify `display: none !important` not applied at mobile breakpoint
4. Check `visible` class is being added/removed

---

### Issue: Form prefill not working

**Symptoms:** Calculator value doesn't auto-select investment bracket.

**Diagnosis:**

```javascript
// Check calculator state
console.log('investmentAmount:', investmentAmount);  // Should match slider
console.log('investmentYears:', investmentYears);

// Check prefillForm function
prefillForm('primary-form-mount');
const select = document.querySelector('#lead-amount-primary');
console.log('Selected value:', select.value);  // Should match bracket
```

**Solution:**

1. Ensure calculator is interacted with first (slider moved or button clicked)
2. Verify `calculatorInteracted` flag is true
3. Check target select element ID includes correct suffix (-primary, -secondary, -modal)
4. Verify prefillForm is called at right time (after CTA click)

---

### Issue: Success message not appearing

**Symptoms:** Form submitted, but success message hidden.

**Diagnosis:**

```javascript
// Check success element exists
const successEl = document.querySelector('.lead-form__success');
console.log('Success element:', successEl);

// Check it has proper display rule
getComputedStyle(successEl).display  // Should be 'none' initially, 'block' on success
```

**Solution:**

1. Verify form submission succeeded (check backend)
2. Ensure success element structure matches expected selectors
3. Check `.lead-form__success` has `display: block` after submission

---

## Deployment Checklist

### Before Going Live

- [ ] All pre-launch checklist items completed
- [ ] Form ID configured (not placeholder)
- [ ] Phone numbers updated (all 4 locations)
- [ ] Privacy policy page exists and accessible
- [ ] Terms page exists
- [ ] QA testing passed (all scenarios)
- [ ] Mobile testing passed (iOS, Android)
- [ ] Cross-browser testing passed
- [ ] Performance validated (<2s load)
- [ ] Analytics events firing correctly
- [ ] Accessibility audit passed
- [ ] Network error handling tested
- [ ] Security headers configured
- [ ] SSL/HTTPS enabled

### Monitoring After Launch

1. **First 24 Hours:**
   - Monitor form submissions (any = success)
   - Check error logs for JavaScript errors
   - Verify email backend receiving submissions
   - Monitor performance (page load time)

2. **First Week:**
   - Track conversion rate (form submit / visitors)
   - Analyze error patterns (which fields causing issues)
   - Review analytics events in GA
   - Collect user feedback

3. **Ongoing:**
   - Weekly conversion report
   - Monthly performance review
   - Quarterly A/B testing of CTA copy
   - Update phone numbers if needed

---

## File Locations Reference

**Main File:** `/c/Users/Pavli/Desktop/HypeDigitaly/GIT/Movito/index.html`

**Key Sections:**

- Lines 14–2590: All CSS (variables, components, responsive)
- Lines 4048–4666: All JavaScript (forms, calculator, modal)
- Lines 3949–4018: Form template
- Line 4023: Sticky bar HTML
- Line 4036: Modal HTML
- Lines 3303–3319: Primary form mount
- Lines 3845–3847: Secondary form mount
- Line 4041: Modal form mount

---

## Contact & Support

**For Issues:**
1. Check Troubleshooting section above
2. Review DevTools console (F12 → Console)
3. Verify all pre-launch items completed
4. Check Git history for recent changes

**Form Endpoint Support:** https://formspree.io/support

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-06 | Documentation Engineer | Initial documentation for CRO optimization |

---

**End of Documentation**
