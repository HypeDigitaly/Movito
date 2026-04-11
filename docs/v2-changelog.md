# Movito v2 Rework — Changelog

## 2026-04-11 — Feature branch `rework/v2`

### Added
- **5-category investment selector** — Interactive tablist widget (Podíly ve firmách, Nemovitosti, Bateriová úložiště, Drahé kovy, Krypto) with sticky sidebar panels, keyboard navigation (Arrow/Home/End/Enter/Space), and ARIA roving tabindex. Default active: Nemovitosti.
- **Rich detail panels per category** — Each category displays 9-section structured content: Co to je, Jak to funguje, Zajištění, Očekávaný výnos, Příklady projektů, Minimální vstup, Rizika, Právní rámec, CTA buttons.
- **"Marketingové sdělení" compliance strip** — Fixed position header (40px height) above navigation with verbatim regulatory disclosure: "Toto sdělení má pouze informativní charakter a nepředstavuje investiční doporučení ani nabídku k uzavření smlouvy."
- **MiCA Art. 7 warning in Krypto panel** — Verbatim warning displayed in a visually distinct aside element in both the Krypto category detail panel and FAQ Q6: "Kryptoaktiva mohou zcela nebo zčásti ztratit svou hodnotu, nejsou regulována jako tradiční finanční nástroje a nejsou kryta systémem pojištění vkladů."
- **6-section visible footer legal block** — Expanded from hidden accordion to 6 always-visible sections: supervision status (ČNB), AML compliance (FIU), deposit insurance notice (not covered), yield disclaimer ("cílový výnos"), GDPR statement, ADR contact.
- **Category form field** — Hidden input `category` (enum: podily, nemovitosti, baterie, kovy, krypto, or empty string) passed through validate.ts with soft validation and rendered in notification + confirmation emails.
- **Qualified investor acknowledgment** — Checkbox in each category panel; field `qualified_investor_ack` (boolean) flows to form submission and is rendered in confirmation email (soft validation, no field error).
- **SVG symbol library expansion** — Added deco-coin-euro, logo-mark Direction B ascending-bars-as-negative-space-M, and 4 category-specific icons (podily-icon, nemovitosti-icon, baterie-icon, kovy-icon, krypto-icon); swapped hero rail from deco-house-villa → deco-coin-stack.
- **5 category markdown files** — New `copy/categories/{id}.md` (podily.md, nemovitosti.md, baterie.md, kovy.md, krypto.md) with 9-section structure, yield ranges, and canonical copy approved per 00-offer-architecture.md.
- **Form submission with category slug** — When user clicks "Začít investovat" or "Získat nabídku financování" in a panel, the contact form's category input is pre-filled and form scrolls into view; GA event `cta_click` fires with `cta_location: 'category-panel'`.

### Changed
- **Minimum investment entry point** — Lowered from 500,000 Kč to 100,000 Kč (uniform across all 5 categories). Framing changed from exclusive/premium to welcoming entry point ("Milionová Investice — začněte s 100 tisíci, budujte milion postupně"). Hero badge text updated: "Od 100 000 Kč".
- **Phone number** — Changed from +420 608 38 38 38 to +420 603 865 865 across all 6 phone line references (nav, footer contact links, header strip if applicable).
- **Navigation logo** — Swapped from text-only "Movito" to SVG logo mark (Direction B ascending-bars-as-negative-space) + text; color changed to white on gradient background.
- **Footer logo** — Updated to matching SVG logo mark (consistent with nav).
- **Hero headline** — Rewritten from real-estate-focused pitch to 5-category embrace: "Vyberte si svoji milionovou investici" (instead of prior RE-only headline). Subheadline names all 5 categories. Risk-parity disclaimer added below headline.
- **Hero CTA copy** — Dual CTA structure: "Začít investovat" (primary) + "Získat nabídku financování" (secondary financing option).
- **Problem section** — Rewritten with 3 HNWI pain-point cards (Fragmentation, Hidden Fees, Time Drain) replacing prior RE-centric narrative.
- **Solution section** — Rewritten narrative: "Jedna platforma, pět cest k výnosu" (4-paragraph description of operational model: curation, collateral, quarterly payouts, personal advisor).
- **Comparison table** — Rebuilt as 5-column × 10-row matrix (vs. 4-column prior); rows include per-row `<cite>§50a ČNB</cite>` citations for regulatory compliance; "Počet dostupných kategorií" row shows Movito: 5.
- **FAQ section** — Replaced with 10 new questions covering all 5 categories + crypto-specific compliance. Q6 contains verbatim MiCA Art. 7 warning.
- **Design tokens** — Updated `:root` variables: `--text-muted` corrected to #58574F (WCAG AA contrast fix), added `--gold-interactive` (#6B5009), added `--strip-h` (40px); `body { overflow-x: hidden }` → `body { overflow-x: clip }` (critical for sticky sidebar support).
- **Navigation logo mark** — Added explicit `color: #FFFFFF` to `.nav__logo-mark` for contrast.
- **Form fields (validate.ts)** — Added `category?` and `qualified_investor_ack?` fields with soft validation (no field errors on absent/invalid values).
- **Email notification flow** — Updated contact-notification.ts to render category label (via categoryLabel() helper) and qualified_investor_ack status in email body.
- **Email confirmation flow** — Updated contact-confirmation.ts to include mandatory legal disclaimer, formalized tone, and category/qualified_investor_ack details.

### Fixed
- **Compliance copy integration** — All banned phrases (garantovaný výnos, bez rizika, jisté zhodnocení, etc.) removed from all copy files; mandatory phrasing (Cílový výnos není zaručen, Marktetingové sdělení, MiCA Art. 7) baked into content and inline in the page.
- **Form field missing inputs** (Cycle 1) — Form template was missing category and qualified_investor_ack inputs; backend chain was decorative. Fixed: added hidden category input to each category panel's form instance; added checkbox for qualified_investor_ack with label.
- **Missing focus-visible states** (Cycle 1) — `.btn--secondary` had no `:focus-visible` outline. Fixed: added `outline: 2px solid var(--gold-400); outline-offset: 2px;`.
- **Marketing strip gap after scroll** (Cycle 1) — Marketing strip created layout shift when nav scrolled. Fixed: confirmed fixed position with proper z-index (998) and scroll-padding-top accounting.
- **Inline onclick selector mismatch** (Cycle 1) — Dead code with mismatched selector in onclick attribute. Fixed: removed; replaced with event delegation on `[data-open-contact-form]` attribute.
- **Overencoded mailto/tel links** (Cycle 1) — encodeURIComponent was being applied to mailto: and tel: URIs. Fixed: removed encoding for protocol-based links.
- **Deploy-preview origin bypass** (Cycle 1, HIGH) — Regex `/\.netlify\.app(\/|$)/i` allowed path-injection attacks on deploy-preview URLs. Fixed: replaced with URL.parse-based origin check; validates hostname against HTTPS-only DEPLOY_PRIME_URL with exact-match, no path traversal.
- **Marketing strip wrapping on mobile** (Cycle 2) — Strip text wrapped to 2 lines on XS devices, breaking layout. Fixed: added `white-space: nowrap; text-overflow: ellipsis;` for single-line truncation.
- **Qualified investor checkbox focus-visible** (Cycle 2) — Checkbox was missing `:focus-visible` state. Fixed: added outline styling.
- **URL.parse origin validation** (Cycle 3) — Replaced regex with hostname-anchored, HTTPS-only, exact-origin DEPLOY_PRIME_URL match for maximum security.

### Security
- **Deploy-preview origin hardening** — Implemented URL.parse-based origin validation to prevent path-injection attacks on deploy-preview URLs. Only exact-match DEPLOY_PRIME_URL (with HTTPS) is accepted for contact form submissions from preview deploys.
- **PII redaction in logs** — Contact function logs now redact email addresses and phone numbers before writing to Netlify function logs (preventing accidental exposure in observability tools).
- **Honeypot check before validation** — Handler checks `website` honeypot field and short-circuits before calling validateBody() (prevents spam submissions from reaching validation logic).

### Low Priority (Deferred, Non-Blocking)
- Duplicate `.nav` CSS ruleset (cosmetic cleanup)
- Hero CTA `data-cta` attribute ignored by GA handler (mis-attribution to 'hero' vs. actual CTA location; affects analytics attribution only)
- `<header>` semantic choice for marketing strip (accessibility; `role="note"` has weak screen-reader support; consider `<div role="note">` or plain `<div>` in next refactor)
- Qualified investor checkbox touch target 18×18px (WCAG AAA guideline is 44×44px; current is acceptable for AA; minor UX improvement)
- Marketing strip wrapping on XS devices (now uses ellipsis; acceptable trade-off)
- GA 4 custom event attribution for CTA clicks (hero vs. category-panel CTAs; requires GA4 configuration review in next cycle)

### Testing Notes
- All TypeScript types pass `npx tsc --noEmit` with 0 errors
- Category selector keyboard navigation tested: Arrow/Home/End/Enter/Space work as specified
- Form submission chain validated: category slug flows from hidden input → validate.ts → contact.ts → email templates
- Mobile responsiveness verified at 375px (iPhone SE), 768px (iPad), 1440px (desktop)
- 3 code review cycles completed: 7 total issues (3 HIGH + 4 MEDIUM) identified and resolved
- Deploy-preview context verified: URL.parse origin check prevents unauthorized submissions

---

**Summary:** Feature branch `rework/v2` transforms Movito from a real-estate-only platform to a 5-category curated investment destination. All compliance requirements (MiCA Art. 7, §50a citations, banned phrases, mandatory phrasing) are baked into content and markup. Form integration flows category + qualified_investor_ack through the entire submission chain. All critical and medium-severity issues have been resolved through 3 review cycles; low-priority items are logged for future refactoring.
