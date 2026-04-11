# Category Selector Component — Technical Documentation

## Overview

The category selector is an interactive tab widget enabling users to explore 5 investment categories (Podíly, Nemovitosti, Baterie, Kovy, Krypto) on a single page. It combines accessible HTML (ARIA tabs), event-driven JavaScript (event delegation, roving tabindex, keyboard navigation), and form integration (hidden category field population) to guide users toward the contact form.

**Implementation:** `index.html` (lines ~4248–4650 for HTML; lines ~6465–6575 for JavaScript)  
**Type:** Vanilla JavaScript (no frameworks; IIFE-wrapped to avoid global pollution)  
**Accessibility:** WCAG 2.1 AA compliant (roving tabindex, keyboard nav, ARIA attributes)  

---

## 1. HTML Structure

The category selector uses the **ARIA tabs pattern** (WAI-ARIA Authoring Practices Guide 3.20).

### Tablist Container
```html
<section id="investment-categories" class="categories" aria-labelledby="categories-heading">
  <ul role="tablist" aria-label="Investiční kategorie" class="inv-tabs">
    <!-- 5 tab buttons here -->
  </ul>
  
  <!-- 5 tabpanels here -->
</section>
```

### Individual Tab Button (Example: Nemovitosti)
```html
<button 
  role="tab" 
  aria-selected="true" 
  aria-controls="panel-nemovitosti"
  tabindex="0"
  data-category-id="nemovitosti"
  class="inv-tab is-active"
>
  Nemovitosti
</button>
```

### Individual Tabpanel
```html
<div 
  id="panel-nemovitosti" 
  role="tabpanel" 
  aria-labelledby="tab-nemovitosti"
  class="inv-panel"
  hidden=""
>
  <!-- 8 content sections (Co to je, Jak to funguje, ..., CTA buttons) -->
  <input type="hidden" name="category" value="nemovitosti">
  <button data-open-contact-form>Začít investovat</button>
  <button data-open-contact-form">Získat nabídku financování</button>
</div>
```

---

## 2. ARIA Attributes Reference

| Attribute | Element | Value | Purpose |
|-----------|---------|-------|---------|
| `role="tablist"` | `<ul>` | (inherent) | Declares this list as a tab container |
| `role="tab"` | `<button>` | (inherent) | Marks button as a tab control |
| `role="tabpanel"` | `<div>` | (inherent) | Marks div as the panel associated with a tab |
| `aria-selected` | `<button role="tab">` | "true" \| "false" | Indicates if the tab is currently active |
| `aria-controls` | `<button role="tab">` | `panel-nemovitosti` | Links button to its panel's ID |
| `aria-labelledby` | `<div role="tabpanel">` | `tab-nemovitosti` | Links panel back to its tab's ID (optional but recommended) |
| `tabindex` | `<button role="tab">` | "0" \| "-1" | Roving tabindex: 0 on active, -1 on inactive |
| `hidden` | `<div role="tabpanel">` | (presence-based) | Hides inactive panels from the DOM |

### Initial State Example

At page load, **Nemovitosti is the default active tab**:

| Tab | aria-selected | tabindex | hidden | Panel Visible |
|-----|----------------|----------|--------|---|
| Podíly | false | -1 | hidden="" | No |
| **Nemovitosti** | **true** | **0** | (none) | **Yes** |
| Baterie | false | -1 | hidden="" | No |
| Drahé kovy | false | -1 | hidden="" | No |
| Krypto | false | -1 | hidden="" | No |

---

## 3. Keyboard Navigation

Fully accessible keyboard support, fully WAI-ARIA compliant:

| Key | Behavior |
|-----|----------|
| **Arrow Right** | Move focus to next tab (wraps to first if at last) |
| **Arrow Left** | Move focus to previous tab (wraps to last if at first) |
| **Home** | Jump to first tab |
| **End** | Jump to last tab |
| **Enter** or **Space** | Activate the currently focused tab |
| **Escape** | **NOT bound** — reserved for existing modal handler |
| **Tab** | Move focus out of tablist (browser default) |

### Implementation Detail
The keyboard handler uses **event delegation** on the tablist container:

```javascript
tablist.addEventListener('keydown', function (e) {
  var currentIdx = tabs.indexOf(document.activeElement);
  // ... determine nextIdx based on e.key ...
  if (handled) {
    e.preventDefault();
    selectTab(nextIdx, true); // Activate tab and fire GA event
    tabs[nextIdx].focus();    // Move focus to the new tab
  }
});
```

---

## 4. JavaScript Entry Point

**Location:** `index.html`, inside a `<script>` block near the bottom (before closing `</body>`).

**Pattern:** IIFE (Immediately Invoked Function Expression) to avoid global variable pollution.

```javascript
(function() {
  // Tablist widget logic here — NO global variables exposed
})();
```

### Key Functions

**selectTab(idx, userInitiated)**
- Argument `idx`: 0-based tab index
- Argument `userInitiated`: boolean; if true, fires GA `tab_select` event
- Responsibility: Update ARIA attributes, show/hide panels, focus management

**Event Delegation: Click Handler**
- Listens on `tablist` for clicks on `[role="tab"]` buttons
- Calls `selectTab()` and sets focus on the activated tab
- Fires GA event `tab_select` with the category slug

**Event Delegation: Keydown Handler**
- Listens on `tablist` for arrow/Home/End/Enter/Space keys
- Navigates tabs (with wrapping)
- Fires GA event on Enter/Space activation

**CTA Handler: Panel → Contact Form**
- Listens document-wide for clicks on `[data-open-contact-form]` buttons
- Gets the active tab's `data-category-id`
- Populates the main contact form's hidden `category` input
- Scrolls to contact form (calls `scrollToForm()` if available)
- Fires GA event `cta_click` with `cta_location: 'category-panel'`

---

## 5. CTA Integration with Contact Form

### Form Population

When a user clicks "Začít investovat" in a category panel:

1. **JavaScript identifies the active tab:**
   ```javascript
   var activeTab = tablist.querySelector('[role="tab"][aria-selected="true"]');
   var cat = activeTab ? activeTab.getAttribute('data-category-id') : '';
   ```

2. **Populate the main contact form's hidden input:**
   ```javascript
   var mainCategoryInput = document.querySelector('#primary-form-mount form input[name="category"]');
   if (mainCategoryInput) {
     mainCategoryInput.value = cat; // e.g., "nemovitosti"
   }
   ```

3. **Scroll to form and focus:**
   ```javascript
   if (typeof scrollToForm === 'function') {
     scrollToForm(); // Reuse existing scroll utility
   } else {
     target.scrollIntoView({ behavior: 'smooth' });
   }
   ```

### Form Submission Chain

1. **HTML:** User fills form; hidden `category` input contains (e.g.) "nemovitosti"
2. **Frontend:** Form validation + optional `qualified_investor_ack` checkbox (boolean)
3. **POST:** `/.netlify/functions/contact` receives payload
4. **validate.ts:** 
   - `category` field is soft-validated (no error if absent/invalid; coerced to empty string)
   - `qualified_investor_ack` field is strict-boolean (=== true only; else false)
   - Returns `ValidatedContact` with both fields preserved
5. **contact.ts:** Passes fields through to notification email
6. **contact-confirmation.ts:** Email template renders category label (via switch/case on slug) and qualified_investor_ack status in the confirmation email body

### Sample Payload

```json
{
  "name": "Jan Novák",
  "email": "jan@example.com",
  "phone": "+420 603 865 865",
  "investment_amount": "1m-5m",
  "consent": true,
  "consent_timestamp": "2026-04-11T10:30:00Z",
  "form_location": "category-panel",
  "category": "nemovitosti",
  "qualified_investor_ack": true
}
```

**Backend validation result:**
```typescript
{
  ok: true,
  data: {
    name: "Jan Novák",
    email: "jan@example.com",
    phone: "+420 603 865 865",
    investment_amount: "1m-5m",
    consent: true,
    consent_timestamp: "2026-04-11T10:30:00Z",
    form_location: "category-panel",
    category: "nemovitosti",           // Soft: '' if absent/invalid
    qualified_investor_ack: true       // Soft: false if not === true
  }
}
```

---

## 6. Mobile Scroll-Snap & Touch Optimization

### Horizontal Scroll
Category tabs may scroll horizontally on narrow screens (design-dependent). CSS provides momentum scrolling on iOS:

```css
.inv-tabs {
  -webkit-overflow-scrolling: touch; /* iOS Safari momentum scrolling */
}
```

### Sticky Sidebar
Each category panel has a 35%-width sticky sidebar (facts block, qualified-investor notice, CTAs):

```css
body { overflow-x: clip; } /* CRITICAL: Not 'hidden' — enables sticky positioning */
.inv-panel__sidebar {
  position: sticky;
  top: calc(80px + var(--strip-h)); /* Accounts for nav + marketing strip */
}
```

**Why `clip` not `hidden`?**
- `overflow-x: hidden` disables sticky positioning (browser quirk)
- `overflow-x: clip` clips overflow without disabling sticky (CSS Containment spec)

---

## 7. Reduced Motion Support

The category panel transitions (fade in/out, slide) respect user's `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .inv-panel__content {
    transition: none; /* Disable animations */
  }
}
```

**Testing:**
- macOS: System Preferences > Accessibility > Display > Reduce Motion
- Windows 11: Settings > Accessibility > Display > Show animations
- DevTools: More Tools > Rendering > Emulate CSS Media Feature prefers-reduced-motion

---

## 8. Google Analytics Integration

### Events Fired

**`tab_select`** — When user clicks or keys into a new tab

```javascript
window.dataLayer.push({
  event: 'tab_select',
  category: 'nemovitosti' // The data-category-id from the active tab
});
```

**`cta_click`** — When user clicks "Začít investovat" or financing CTA

```javascript
window.dataLayer.push({
  event: 'cta_click',
  category: 'nemovitosti',
  cta_location: 'category-panel'
});
```

### Configuration
- GA tag must be installed in `index.html` before the category selector script
- `window.dataLayer` must exist (GA initializes it)
- Non-fatal: if GA is not loaded, errors are caught and ignored

---

## 9. Browser Compatibility

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| Chrome | 90+ | Full | ES5 syntax; event delegation works |
| Firefox | 88+ | Full | Same |
| Safari | 14+ | Full | `-webkit-overflow-scrolling: touch` on iOS |
| Edge | 90+ | Full | Chromium-based |
| IE 11 | N/A | Not supported | Uses ES6+ (const, arrow functions, template literals in other places) |

---

## 10. Adding a 6th Category in the Future

If Movito adds a sixth investment category, follow these steps:

### Step 1: Update Type Definitions
**File:** `netlify/functions/_lib/validate.ts`

```typescript
export const ALLOWED_CATEGORIES = [
  'podily', 'nemovitosti', 'baterie', 'kovy', 'krypto',
  'newcategory', // Add here
  ''
] as const;
```

### Step 2: Create Content File
**File:** `copy/categories/newcategory.md`

```markdown
---
slug: newcategory
title: New Category Label
category_id: newcategory
---

# New Category — Marketing Headline

## 1. Co to je
...

## 2. Jak to funguje
...

[... 9 sections total, see nemovitosti.md for structure ...]
```

### Step 3: Add SVG Icon
**File:** `index.html` (inside `<defs>` in the SVG `<svg>` symbol block)

```html
<symbol id="icon-newcategory" viewBox="0 0 24 24">
  <!-- SVG path here -->
</symbol>
```

### Step 4: Add HTML Tab Button
**File:** `index.html` (inside `<ul role="tablist">`)

```html
<button 
  role="tab" 
  aria-selected="false" 
  aria-controls="panel-newcategory"
  tabindex="-1"
  data-category-id="newcategory"
  class="inv-tab"
>
  New Category Label
</button>
```

### Step 5: Add HTML Tabpanel
**File:** `index.html` (after the last tabpanel)

```html
<div 
  id="panel-newcategory" 
  role="tabpanel" 
  aria-labelledby="tab-newcategory"
  hidden=""
>
  <!-- Content from copy/categories/newcategory.md injected here -->
  <input type="hidden" name="category" value="newcategory">
  
  <button data-open-contact-form>Začít investovat</button>
  <button data-open-contact-form">Získat nabídku financování</button>
</div>
```

### Step 6: Update Email Templates
**Files:** `contact-confirmation.ts`, `contact-notification.ts` (in netlify/functions/_lib/email-templates/)

Add a case to the `categoryLabel()` helper:

```typescript
function categoryLabel(cat: string): string {
  switch (cat) {
    case 'podily': return 'Podíly ve firmách';
    case 'nemovitosti': return 'Nemovitosti';
    case 'baterie': return 'Bateriová úložiště';
    case 'kovy': return 'Drahé kovy';
    case 'krypto': return 'Krypto';
    case 'newcategory': return 'New Category Label'; // Add here
    default: return '';
  }
}
```

### Step 7: Update Tests
**Files:** Any test files that assert category values

```typescript
expect(categories).toContain('newcategory');
expect(categoryCounts).toEqual({
  podily: ...,
  nemovitosti: ...,
  baterie: ...,
  kovy: ...,
  krypto: ...,
  newcategory: ... // Add here
});
```

### Step 8: Verify
- [ ] `npx tsc --noEmit` passes (0 errors)
- [ ] Category appears in tab list and is clickable
- [ ] Form submission pre-fills `category: newcategory`
- [ ] Confirmation email renders the new category label
- [ ] GA fires `tab_select` and `cta_click` events with `category: newcategory`
- [ ] Tests pass

---

## Summary

| Aspect | Implementation |
|--------|---|
| **Accessible tablist** | WAI-ARIA tabs pattern; roving tabindex; keyboard nav (Arrow/Home/End/Enter/Space) |
| **Event handling** | Event delegation on tablist container; no onclick attributes |
| **Form integration** | Hidden category input populated on CTA click; category field flows to backend |
| **Analytics** | GA events: `tab_select`, `cta_click` with category slug |
| **Mobile** | Sticky sidebar (requires `overflow-x: clip`); momentum scrolling on iOS |
| **Reduced motion** | Respects `prefers-reduced-motion: reduce` |
| **Future expansion** | 6-step process: type def + content + SVG + HTML + email + tests |

For form validation details, see `netlify/functions/_lib/validate.ts`. For email rendering, see `netlify/functions/_lib/email-templates/contact-confirmation.ts`. For canonical category information, see `copy/00-offer-architecture.md` Section 2.
