# Anchor audit — pre-refactor snapshot

Generated: 2026-04-11
Source: index.html (pre-A1, pre-B1b)

## Summary
- Total `href="#..."` occurrences (navigation anchors only, excluding SVG `<use>` and logo `#`): 17
- KEEP (target survives): 2
- DELETE_ORPHAN (remove href/element): 13
- REDIRECT (retarget href): 2

> Note: SVG `<use href="#symbol-id">` references are excluded from this audit — they are internal sprite references, not navigation anchors, and are unaffected by the deletion plan.
>
> Note: `id="kategorie"` does NOT exist in the current codebase. The investment categories section uses `id="investment-categories"`. Any REDIRECT classification below uses `#investment-categories` as the correct surviving target.

## Inventory

| # | Line | href | Location / element | Classification | Action for B1b |
|---|------|------|--------------------|----------------|----------------|
| 1 | 4014 | `#` | Primary nav — logo link (scroll-to-top) | KEEP | No action needed; bare `#` is a scroll-to-top, not a deleted section |
| 2 | 4035 | `#jak-to-funguje` | Primary nav — "Jak to funguje" list item | DELETE_ORPHAN | Remove `<li>` nav item entirely |
| 3 | 4036 | `#kalkulacka` | Primary nav — "Kalkulačka" list item | DELETE_ORPHAN | Remove `<li>` nav item entirely (section deleted in B1a) |
| 4 | 4037 | `#bezpecnost` | Primary nav — "Bezpečnost" list item | DELETE_ORPHAN | Remove `<li>` nav item entirely |
| 5 | 4038 | `#faq` | Primary nav — "Časté otázky" list item | DELETE_ORPHAN | Remove `<li>` nav item entirely |
| 6 | 4039 | `#kontakt` | Primary nav — "Kontakt" list item | DELETE_ORPHAN | Remove `<li>` nav item entirely |
| 7 | 4040 | `#kontakt-form-section` | Primary nav — "Chci více informací" CTA button | DELETE_ORPHAN | Form moves to hero; remove nav CTA or retarget to `#hero` / top of page |
| 8 | 4104 | `#kontakt-form-section` | Hero section — "Začít investovat" primary CTA button | DELETE_ORPHAN | Form moves into hero; convert to in-page scroll or remove href entirely (button becomes in-situ) |
| 9 | 5049 | `#kontakt-form-section` | Bezpecnost section — "Chci více informací" CTA button | DELETE_ORPHAN | Section (`#bezpecnost`) is being deleted; entire block removed in A1 |
| 10 | 5346 | `#kontakt-form-section` | FAQ section — "Chci více informací" CTA button | DELETE_ORPHAN | Section (`#faq`) is being deleted; entire block removed in A1 |
| 11 | 5381 | `#kontakt-form-section` | Final CTA section (`#kontakt`) — primary CTA button | DELETE_ORPHAN | Section (`#kontakt`) is being deleted; entire block removed in A1 |
| 12 | 5404 | `#` | Footer — logo link (scroll-to-top) | KEEP | No action needed; bare `#` is a scroll-to-top |
| 13 | 5416 | `#jak-to-funguje` | Footer nav — "Jak to funguje" list item | DELETE_ORPHAN | Remove `<li>` footer nav item entirely |
| 14 | 5417 | `#kalkulacka` | Footer nav — "Kalkulačka výnosů" list item | DELETE_ORPHAN | Remove `<li>` footer nav item entirely |
| 15 | 5418 | `#bezpecnost` | Footer nav — "Bezpečnost" list item | DELETE_ORPHAN | Remove `<li>` footer nav item entirely |
| 16 | 5419 | `#duvera` | Footer nav — "Proč nám věřit" list item | DELETE_ORPHAN | Remove `<li>` footer nav item entirely |
| 17 | 5420 | `#faq` | Footer nav — "Časté otázky" list item | DELETE_ORPHAN | Remove `<li>` footer nav item entirely |
| 18 | 5577 | `#duvera` | Form success message (inside `<template>`) — "Jak funguje Movito →" button | REDIRECT | Retarget to `#investment-categories` (nearest surviving informational section) |
| 19 | 5589 | `#kalkulacka` | Sticky bar — "Kalkulátor" secondary button | DELETE_ORPHAN | Remove the sticky bar's "Kalkulátor" button; sticky bar CTA (`#stickyBarCTA`) is a JS button, unaffected |

## Critical orphans (top 5 highest-impact)

1. **Line 4040 — Nav CTA `#kontakt-form-section`** — The primary conversion entry point in the nav bar becomes a dead link the moment the form section is deleted. Must be handled in B1b before A1 goes live.
2. **Line 4104 — Hero CTA `#kontakt-form-section`** — The above-the-fold "Začít investovat" button. If form moves into hero, this scroll-to-section link must be converted to an in-situ trigger or removed.
3. **Line 5577 — Form success REDIRECT `#duvera`** — After a lead submits, the thank-you state offers "Jak funguje Movito →" pointing to a section that no longer exists. Retarget to `#investment-categories`.
4. **Line 5381 — Final CTA section `#kontakt-form-section`** — Highest-visibility CTA in the final-CTA section; deleted with the section in A1 so the orphan is self-cleaning, but must be verified.
5. **Line 5589 — Sticky bar `#kalkulacka`** — The sticky bar floats on every scroll position; a dead `#kalkulacka` link in the sticky bar will be silently broken for all visitors post-B1a. Remove this button.

## Surviving sections (post-A1)

The following section IDs are NOT in the deletion plan and will survive the refactor:

| Section ID | Description |
|------------|-------------|
| `#kalkulacka` | Currently doubles as the hero section ID — survives as hero but the calculator widget inside is deleted in B1a |
| `#kontakt-form-section` | Form section moves into hero; original standalone section deleted |
| `#investment-categories` | Investment category tabs — SURVIVES, valid REDIRECT target |

> Caution: `#kalkulacka` is currently the `id` on the `<section class="hero">` element (line 4062). The calculator widget inside that section is deleted in B1a, but the section element itself (the hero) may retain or change its ID. B1b must coordinate with B1a on whether the hero section ID changes.
