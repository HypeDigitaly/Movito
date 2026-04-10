# Contact Form Email Sending via Resend

**Date:** 2026-04-08  
**Status:** Production-ready  
**Runtime:** Node.js 20 on Netlify Functions  
**Dependencies:** Resend ~4.0.0 (email service)

---

## Overview

The Movito landing page now captures lead submissions and sends two emails via [Resend](https://resend.com):

1. **Confirmation email** to the user (Czech) — acknowledges receipt, promises reply within 1 business day
2. **Notification email** to the Movito team (Czech) — detailed lead data with formatted contact info and investment range

The system replaced Formspree (third-party form service) with a custom Netlify Function, giving Movito complete control over email delivery, branding, and security posture.

### High-level flow

```
User fills form on movito.cz
        ↓
Honeypot check (silent 200 if filled)
        ↓
Origin/Referer validation (production only)
        ↓
Validate all fields (Czech error messages)
        ↓
Send two emails in parallel (Promise.allSettled)
        ├─ Confirmation → user's email (non-fatal if fails)
        └─ Notification → team inbox (fatal if fails; triggers 500)
        ↓
Return { success: true, message: 'Zpráva odeslána.' }
```

---

## Architecture

### Directory layout

```
Movito/
├── index.html                              # Frontend — form posts to /.netlify/functions/contact
├── netlify/
│   └── functions/
│       ├── contact.ts                      # Main HTTP handler (221 LOC)
│       └── _lib/
│           ├── utils.ts                    # Shared helpers: escapeHtml, validateEmail, etc. (189 LOC)
│           ├── validate.ts                 # Field validation + discriminated union result (236 LOC)
│           └── email-templates/
│               ├── contact-confirmation.ts # User confirmation email (Czech, 143 LOC)
│               └── contact-notification.ts # Team notification email (Czech, 214 LOC)
├── package.json                            # resend ~4.0.0, typescript, @types/node
├── tsconfig.json                           # Strict mode, Node 20 types, bundler resolution
├── netlify.toml                            # Deploy config + security headers
├── .env.example                            # Environment variable template
└── DEPLOY_CHECKLIST.md                     # Human operator pre-deploy instructions
```

### Module responsibilities

| Module | Purpose |
|--------|---------|
| `contact.ts` | HTTP request handling, orchestration, email dispatch |
| `utils.ts` | HTML escaping, email validation, JSON parsing, response helpers, error codes |
| `validate.ts` | Field-level validation with aggregated error reporting; `ContactBody` and `ValidatedContact` types |
| `contact-confirmation.ts` | Pure function returning `{ subject, html }` for user email; Movito brand tokens |
| `contact-notification.ts` | Pure function returning `{ subject, html }` for team email; investment-amount label mapping |

### Request processing pipeline

```
1. ENV GUARD
   ├─ Check RESEND_API_KEY, CONTACT_SENDER_EMAIL, CONTACT_NOTIFICATION_EMAIL present
   └─ Fail fast with 500 if missing (prevents downstream crashes)

2. METHOD GUARD
   ├─ Only POST allowed
   └─ 405 METHOD_NOT_ALLOWED for GET, PUT, DELETE, etc.

3. BODY SIZE GUARD
   ├─ Read entire request body into buffer
   ├─ Check byte length ≤ 10 KB
   └─ 413 PAYLOAD_TOO_LARGE if exceeded

4. CONTENT-TYPE GUARD
   ├─ Extract Content-Type header
   ├─ Require application/json (case-insensitive prefix match)
   └─ 415 UNSUPPORTED_MEDIA_TYPE otherwise

5. JSON PARSE
   ├─ Safe parse (catch-return-null on parse error)
   ├─ Type-narrow to `object`
   └─ 400 BAD_REQUEST on parse failure

6. ORIGIN / REFERER CHECK (production only, dev bypass)
   ├─ Extract Origin or Referer header
   ├─ Parse SITE_URL env var → expectedOrigin
   ├─ Verify request origin matches (full URL normalization)
   ├─ 403 FORBIDDEN if mismatch (prevents CSRF)
   └─ Bypass in dev (NETLIFY_DEV=true or CONTEXT=dev)

7. HONEYPOT CHECK
   ├─ Check for non-empty `website` field
   ├─ Return 200 SUCCESS_BODY (byte-identical to real success)
   └─ Silent — tells bots nothing (defense by obscurity)

8. VALIDATION
   ├─ Call validateBody(parsed)
   ├─ Aggregate all field errors (no early-return)
   └─ 422 VALIDATION_ERROR with per-field messages if failures

9. EMAIL SEND
   ├─ Build confirmation and notification emails
   ├─ Promise.allSettled both (one failing ≠ other fails)
   ├─ Notification failure → 500 EMAIL_SEND_FAILED (lead-capture critical)
   ├─ Confirmation failure → log + 200 SUCCESS (non-fatal)
   └─ Both succeed → 200 SUCCESS_BODY
```

**Why this order?**

- **Env guard first:** Every step after depends on these values; fail-fast prevents null-pointer crashes.
- **Method → body size → content-type → JSON parse:** Standard HTTP input validation; each step rejects invalid payloads early.
- **Origin check before honeypot:** Honeypot is a security feature; must verify request came from our domain before trusting it.
- **Honeypot before validation:** Bots don't read JS logic; they blindly fill all fields, including honeypot. Silent success prevents bot iteration.
- **Validation before send:** Only send if form data is clean; prevents malformed emails or injection attacks reaching Resend.
- **Promise.allSettled on send:** Confirmation is UX; notification is business-critical. Both must attempt; only notification failure is fatal.

---

## Security Posture

### Authentication & Authorization

- **No API keys in frontend:** All Resend interaction happens server-side in `contact.ts`.
- **Environment variables:** `RESEND_API_KEY` lives in Netlify dashboard, never committed.
- **Origin check:** Verifies POST came from `movito.cz` (or dev equivalent) — prevents CSRF and off-domain form POST attacks.
  - Checks `Origin` header first, falls back to `Referer`.
  - In production (`CONTEXT=production`), origin mismatch = 403 FORBIDDEN.
  - In dev (`NETLIFY_DEV=true` or `CONTEXT=dev`), check bypassed (localhost won't have matching origin).

### Input Validation & Sanitization

| Field | Validation | Sanitization |
|-------|-----------|--------------|
| `name` | 2–100 chars, no control chars | Trimmed; HTML-escaped in emails |
| `email` | Valid RFC-5322 structure, ≤254 chars, no control chars | Trimmed, lowercased; HTML-escaped in emails + URI-encoded in mailto hrefs |
| `phone` | 9–15 digits + optional +, no control chars | Trimmed, original formatting preserved; HTML-escaped in emails + URI-encoded in tel: hrefs |
| `investment_amount` | One of 6 allowed values or empty | Enum-typed; label lookup table in notification email |
| `consent` | Exactly `true` (not string "true", not 1) | Literal boolean check; enforced for GDPR |
| `consent_timestamp` | ≤100 chars, no control chars, optional | Trimmed; logged but not directly rendered |
| `form_location` | ≤100 chars, no control chars, optional | Trimmed; label lookup table in notification email |
| `website` (honeypot) | Must be empty | Checked before validation; non-empty = silently pass |

### XSS Defense

- **Control character rejection:** `hasControlChars(str)` rejects `\r` (CR), `\n` (LF), `\0` (NUL), and all other C0 controls (U+0000–U+001F except U+0009 tab). Prevents CRLF injection in email headers.
- **HTML escaping everywhere:** All user-provided text rendered in email HTML is passed through `escapeHtml()`, which escapes 6 OWASP characters: `&`, `<`, `>`, `"`, `'`, `` ` ``.
- **URI encoding in hrefs:** Email template uses `encodeURIComponent()` for `mailto:` and `tel:` hrefs. Example: `href="mailto:${encodeURIComponent(data.email)}"` ensures `+` signs in emails or spaces in phone numbers don't break the link.

### CRLF & Header Injection Defense

The `validateEmail()` and `hasControlChars()` functions block:
- Carriage return `\r` (U+000D)
- Line feed `\n` (U+000A)
- Null `\0` (U+0000)

This prevents an attacker from smuggling headers like `To: attacker@evil.com\r\nBcc: ...` into form fields.

### Honeypot

- **Silent success:** Non-empty `website` field triggers silent 200 with identical `SUCCESS_BODY` bytes returned to real success. Bots cannot distinguish success from failure.
- **Logged but not exposed:** The function does not log the honeypot value or indicate that a bot was caught; no client-side telemetry or error message reveals the trap.

### Rate limiting

**Not implemented.** Movito has decided not to rate-limit contact form submissions at the function level. Future hardening (see below) includes Cloudflare Turnstile or Netlify Blobs-based rate limiting.

### PII & Secret Logging Discipline

- **No PII in logs:** User-submitted data (name, email, phone) is never logged unless an error occurs. On error, only exception metadata is logged (error name + message), not the full request body.
- **No API keys in logs:** Errors never include `RESEND_API_KEY` or other env vars.
- **No stack traces:** Uncaught exceptions are caught and converted to generic 500 errors with Czech message `'Neočekávaná chyba. Zkuste to prosím znovu.'` No stack trace reaches client.
- **Notification email includes PII by design:** The team notification email intentionally includes name, email, phone, and investment range — this is business data, not a security flaw. Resend's sub-processor DPA covers this.

### Content Security Policy

The `netlify.toml` header block includes:

```
Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; form-action 'self'; base-uri 'self'; frame-ancestors 'none'; upgrade-insecure-requests"
```

Key directives:
- **form-action 'self':** Only allow POST/GET to same origin (blocks form hijacking).
- **frame-ancestors 'none':** Page cannot be framed (prevents clickjacking).
- **connect-src 'self':** Only same-origin fetch (the function endpoint is `/.netlify/functions/contact`).

Email templates are HTML-only; CSP headers don't apply to email (each mail client has its own sandbox).

### Environment variables in production

Never commit `.env`. Use Netlify dashboard **Site Settings → Environment Variables**:

1. `RESEND_API_KEY` — API key from https://resend.com dashboard (secret scope)
2. `CONTACT_SENDER_EMAIL` — Bare email address, e.g. `noreply@movito.cz`
3. `CONTACT_NOTIFICATION_EMAIL` — Team inbox, e.g. `info@movito.cz`
4. `SITE_URL` — Full production domain, e.g. `https://movito.cz` (used for Origin check)

In production, if `SITE_URL` is missing, the handler returns 500 (fail-closed).

---

## API Contract

### Request

**Endpoint:** `POST /.netlify/functions/contact`

**Headers (required):**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Václav Hejátko",
  "email": "vaclav@example.com",
  "phone": "+420 608 38 38 38",
  "investment_amount": "1m-5m",
  "consent": true,
  "consent_timestamp": "2026-04-08T14:32:00.000Z",
  "form_location": "primary-form-mount",
  "website": ""
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | Yes | 2–100 chars, no control chars, trimmed |
| `email` | string | Yes | Valid email, ≤254 chars, lowercased, no control chars |
| `phone` | string | Yes | 9–15 digits + optional +, no control chars |
| `investment_amount` | string | No | One of: `500k-1m`, `1m-5m`, `5m-20m`, `20m+`, `unknown`, `''` (empty string = "not answered") |
| `consent` | boolean | Yes | Exactly `true` (literal boolean, not string); GDPR checkbox |
| `consent_timestamp` | string | No | ISO 8601 datetime; ≤100 chars, no control chars |
| `form_location` | string | No | Where the form was mounted; ≤100 chars, no control chars |
| `website` | string | No | Honeypot (anti-spam). Must be empty string for real users. |

### Response (200 OK)

**On successful submission:**
```json
{
  "success": true,
  "message": "Zpráva odeslána."
}
```

**On honeypot fill (bot detected):**
```json
{
  "success": true,
  "message": "Zpráva odeslána."
}
```

(Identical to real success — bots learn nothing.)

### Response (422 Unprocessable Entity)

**On validation error:**
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Opravte prosím chyby ve formuláři.",
  "fields": {
    "name": "Jméno musí mít 2–100 znaků a nesmí obsahovat řídící znaky.",
    "email": "Zadejte platný e-mail.",
    "phone": "Telefon musí mít 9–15 číslic, volitelně s předvolbou +.",
    "consent": "Pro odeslání je nutný souhlas se zpracováním osobních údajů.",
    "investment_amount": "Neplatná hodnota výše investice.",
    "consent_timestamp": "Neplatné časové razítko.",
    "form_location": "Neplatný původ formuláře."
  }
}
```

Only fields with errors are included in `fields` object.

### Response error codes

| HTTP Status | Code | Message | Cause |
|-------------|------|---------|-------|
| 400 | `BAD_REQUEST` | Neplatný formát požadavku. | Invalid JSON or body read failure |
| 405 | `METHOD_NOT_ALLOWED` | Metoda není povolena. Použijte POST. | Non-POST request method |
| 413 | `BODY_TOO_LARGE` | Požadavek překračuje povolenou velikost. | Request body > 10 KB |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | Nepodporovaný typ obsahu. Použijte application/json. | Content-Type not application/json |
| 422 | `VALIDATION_ERROR` | Opravte prosím chyby ve formuláři. | One or more fields failed validation; see `fields` object |
| 403 | `FORBIDDEN` | Požadavek byl zamítnut. | Origin/Referer check failed in production |
| 500 | `INTERNAL_ERROR` | Neočekávaná chyba. Zkuste to prosím znovu. | Missing env vars, invalid SITE_URL, uncaught exception |
| 500 | `EMAIL_SEND_FAILED` | Odeslání e-mailu selhalo. Zkuste to prosím znovu, nebo nám zavolejte. | Resend API returned error for notification email |

### Field validation rules (Czech messages)

Exact messages from `netlify/functions/_lib/validate.ts`:

```
name:
  "Jméno musí mít 2–100 znaků a nesmí obsahovat řídící znaky."

email:
  "Zadejte platný e-mail."

phone:
  "Telefon musí mít 9–15 číslic, volitelně s předvolbou +."

consent:
  "Pro odeslání je nutný souhlas se zpracováním osobních údajů."

investment_amount:
  "Neplatná hodnota výše investice."

consent_timestamp:
  "Neplatné časové razítko."

form_location:
  "Neplatný původ formuláře."
```

---

## Environment Variables

Set these in **Netlify dashboard → Site Settings → Environment Variables** for production.

For local development, copy `.env.example` to `.env` and fill in values (`.env` is git-ignored).

### RESEND_API_KEY

- **Type:** Secret string
- **Format:** `re_xxxxxxxxxxxxxxxxxxxxxxxx` (from https://resend.com/api-keys)
- **Scope:** "Sending" permission only (not admin)
- **Required:** Yes (handler fails with 500 if missing)
- **Where to get:** Resend dashboard → API Keys → Create

### CONTACT_SENDER_EMAIL

- **Type:** Email address
- **Format:** Bare address (e.g., `noreply@movito.cz`), not `Movito <noreply@movito.cz>`
- **Notes:** Handler wraps this as `Movito <${CONTACT_SENDER_EMAIL}>` in confirmation email
- **Required:** Yes (handler fails with 500 if missing)
- **Domain:** Must match a verified sending domain in Resend dashboard

### CONTACT_NOTIFICATION_EMAIL

- **Type:** Email address
- **Format:** Team inbox, e.g., `info@movito.cz` or a Slack channel email if integrating Slack
- **Required:** Yes (handler fails with 500 if missing)
- **Notes:** Notification email is sent here with full lead details; marked as `replyTo: user_email` so team can reply directly to lead

### SITE_URL

- **Type:** Full HTTPS URL
- **Format:** `https://movito.cz` (production) or `https://staging.movito.cz` (staging)
- **Required:** Yes in production; optional in dev (NETLIFY_DEV=true bypasses Origin check)
- **Purpose:** Used to extract expected origin for Origin/Referer validation
- **Fail-closed behavior:** In production, if `SITE_URL` is missing or invalid, handler returns 500

---

## Local Development

### Setup

1. **Clone repo and install dependencies:**
   ```bash
   cd /path/to/Movito
   npm install
   ```

2. **Create `.env` from template:**
   ```bash
   cp .env.example .env
   ```

3. **Fill in Resend API key and emails:**
   ```bash
   # .env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
   CONTACT_SENDER_EMAIL=noreply@movito.cz
   CONTACT_NOTIFICATION_EMAIL=info@movito.cz
   SITE_URL=https://movito.cz
   ```

4. **Start local dev server:**
   ```bash
   npm run dev
   ```

   This runs `netlify dev`, which:
   - Serves `index.html` on `http://localhost:8888`
   - Watches for changes to `.ts` files
   - Automatically recompiles functions
   - Sets `NETLIFY_DEV=true` (triggers dev mode in Origin check — localhost request is allowed)

### Testing the function locally

**1. Valid form submission:**

```bash
curl -X POST http://localhost:8888/.netlify/functions/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+420 608 123 456",
    "investment_amount": "1m-5m",
    "consent": true,
    "consent_timestamp": "2026-04-08T10:00:00Z",
    "form_location": "primary-form-mount",
    "website": ""
  }'
```

**Expected response (200):**
```json
{
  "success": true,
  "message": "Zpráva odeslána."
}
```

**2. Missing required field (name):**

```bash
curl -X POST http://localhost:8888/.netlify/functions/contact \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "+420 608 123 456",
    "consent": true
  }'
```

**Expected response (422):**
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Opravte prosím chyby ve formuláři.",
  "fields": {
    "name": "Jméno musí mít 2–100 znaků a nesmí obsahovat řídící znaky.",
    "email": "Zadejte platný e-mail.",
    "phone": "Telefon musí mít 9–15 číslic, volitelně s předvolbou +.",
    "consent": "Pro odeslání je nutný souhlas se zpracováním osobních údajů."
  }
}
```

**3. Invalid HTTP method (GET instead of POST):**

```bash
curl -X GET http://localhost:8888/.netlify/functions/contact
```

**Expected response (405):**
```json
{
  "success": false,
  "code": "METHOD_NOT_ALLOWED",
  "message": "Metoda není povolena. Použijte POST."
}
```

**4. Honeypot filled (bot detection):**

```bash
curl -X POST http://localhost:8888/.netlify/functions/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bot",
    "email": "bot@example.com",
    "phone": "1234567890",
    "consent": true,
    "website": "http://spam.com"
  }'
```

**Expected response (200, identical to real success):**
```json
{
  "success": true,
  "message": "Zpráva odeslána."
}
```

**5. Request body > 10 KB:**

```bash
# Create a payload with 11 KB of data
LARGE_STRING=$(python3 -c "print('x' * 10500)")
curl -X POST http://localhost:8888/.netlify/functions/contact \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$LARGE_STRING\", \"email\": \"test@test.com\", \"phone\": \"123456789\", \"consent\": true}"
```

**Expected response (413):**
```json
{
  "success": false,
  "code": "BODY_TOO_LARGE",
  "message": "Požadavek překračuje povolenou velikost."
}
```

**6. Wrong Content-Type (text/plain instead of application/json):**

```bash
curl -X POST http://localhost:8888/.netlify/functions/contact \
  -H "Content-Type: text/plain" \
  -d 'name=Test&email=test@test.com'
```

**Expected response (415):**
```json
{
  "success": false,
  "code": "UNSUPPORTED_MEDIA_TYPE",
  "message": "Nepodporovaný typ obsahu. Použijte application/json."
}
```

### TypeScript compilation check

Before committing, verify types:

```bash
npm run typecheck
```

Should output `0 errors`.

---

## Email Templates

### Location

- Confirmation: `netlify/functions/_lib/email-templates/contact-confirmation.ts`
- Notification: `netlify/functions/_lib/email-templates/contact-notification.ts`

Both are pure functions exporting `{ subject: string; html: string }`.

### Brand tokens (Movito light palette)

| Token | Value | Usage |
|-------|-------|-------|
| `COLOR_BG` | `#FAFAF7` | Email background (off-white) |
| `COLOR_BG_CARD` | `#FFFFFF` | Card background (white) |
| `COLOR_CREAM` | `#FAF5E8` | Header band background (warm cream) |
| `COLOR_GOLD` | `#96730F` | Primary accent (brand gold) |
| `COLOR_GOLD_DK` | `#7A5E0A` | Darker gold (secondary accent, notification only) |
| `COLOR_TEXT` | `#1C1B17` | Body text (nearly black) |
| `COLOR_MUTED` | `#6B6A62` | Secondary text (taupe) |
| `COLOR_BORDER` | `#ECEAE3` | Dividers (light gray) |
| `FONT_DISPLAY` | `'Playfair Display', Georgia, 'Times New Roman', serif` | Headlines |
| `FONT_BODY` | `'DM Sans', Arial, sans-serif` | Body text |

### Localization

Both templates are **Czech-only**. Copy is hardcoded in Czech:
- Confirmation: "Tvoje zpráva dorazila", "Ozveme se Vám do 1 pracovního dne"
- Notification: "Nový kontakt", "Zvolen rozsah", field labels

To support other languages, would need:
1. Separate template files (e.g., `contact-notification-en.ts`)
2. A locale parameter passed from frontend (form data or URL)
3. Branching logic in handler to select template

Not currently in scope.

### XSS discipline in templates

Both templates follow these rules:

1. **All user-provided text is HTML-escaped:**
   ```typescript
   const safe = escapeHtml(data.name);
   // Then in HTML: <span>${safe}</span>
   ```

2. **Email addresses and phone in hrefs are URI-encoded:**
   ```html
   <a href="mailto:${encodeURIComponent(data.email)}">
   <a href="tel:${encodeURIComponent(data.phone)}">
   ```
   This prevents special characters (e.g., `+` in phone) from breaking the href.

3. **Inline CSS only:** No `<style>` tag or `<link>` (email client limitations). All styles are `style=""` attributes with hardcoded brand tokens.

4. **HTML5 doctype + responsive meta tags:** Ensures proper rendering in desktop and mobile email clients.

5. **Preheader hidden text:** Renders as email preview in inbox (user-facing signal of professionalism).

### Confirmation email structure

```
Header (cream bg, MOVITO logo in Playfair Display)
  ↓
Card (white bg)
  ├─ Greeting: "Ahoj, [Name]!"
  ├─ Automatic-reply disclaimer
  ├─ Promise: "Ozveme se Vám do 1 pracovního dne"
  ├─ Divider line
  ├─ Signature: "S pozdravem, Tým Movito" (gold Playfair)
  └─ Footer note: "Tento e-mail ti přišel, protože jsi vyplnil(a) formulář…"
  ↓
Footer (copyright + movito.cz link)
```

### Notification email structure

```
Header (cream bg, MOVITO logo)
  ↓
Card (white bg)
  ├─ Badge: "NOVÝ KONTAKT" (gold bg, white text)
  ├─ Contact name (large, gold accent)
  ├─ Timestamp (muted text)
  ├─ Detail table (2-column label/value pairs with dividers):
  │   ├─ Jméno (name, bold gold)
  │   ├─ E-mail (mailto: link, gold)
  │   ├─ Telefon (tel: link, gold)
  │   ├─ Zvolen rozsah (investment range, humanized label)
  │   ├─ Původ formuláře (form_location, humanized label)
  │   ├─ Datum odeslání (formatted Prague time)
  │   └─ Časové razítko souhlasu (consent timestamp, formatted Prague time)
  ├─ Reply CTA button (gold, "Odpověděť [Name]", mailto: link)
  └─ Reply-to note: "Reply-to adresa je nastavena na e-mail kontaktu…"
  ↓
Footer (copyright + movito.cz link)
```

### Investment amount label mapping

Used in notification email to humanize the `investment_amount` value:

```typescript
function investmentLabel(v: string): string {
  switch (v) {
    case '500k-1m':  return '500 tis. – 1 mil. Kč';
    case '1m-5m':    return '1 – 5 mil. Kč';
    case '5m-20m':   return '5 – 20 mil. Kč';
    case '20m+':     return '20 mil. Kč a více';
    case 'unknown':  return 'Zatím nevím';
    case '':         return 'Nezadáno';
    default:         return 'Nezadáno';
  }
}
```

### Form location label mapping

Used in notification email to humanize the `form_location` value:

```typescript
function formLocationLabel(v: string): string {
  switch (v) {
    case 'primary-form-mount': return 'Hlavní formulář (sekce Kontakt)';
    case 'modal-form-mount':   return 'Modální okno';
    default:                   return escapeHtml(v);
  }
}
```

If a new form location is added (e.g., `'hero-form-mount'`), update this mapping to avoid falling back to `escapeHtml(v)`.

### Date formatting (Prague timezone)

Both templates format timestamps using:

```typescript
function formatPragueDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('cs-CZ', {
      timeZone: 'Europe/Prague',
      dateStyle: 'full',
      timeStyle: 'short',
    });
  } catch {
    return iso; // fallback to raw ISO string
  }
}
```

Output example: `"středa 8. dubna 2026, 14:32"` (full name of weekday and month in Czech).

---

## Deployment Flow

### 1. Pre-deployment verification

Before merging to main, run the checklist in `DEPLOY_CHECKLIST.md`:

- [ ] `npm install` succeeds
- [ ] `npm run typecheck` passes (0 errors)
- [ ] `netlify dev` starts and function responds to POST
- [ ] Test cases pass: valid form, missing field, wrong method, honeypot, oversized body, wrong content-type

### 2. Environment variable setup

In **Netlify dashboard → Site Settings → Environment Variables**, set:

- `RESEND_API_KEY` — from Resend dashboard
- `CONTACT_SENDER_EMAIL` — verified sending domain address
- `CONTACT_NOTIFICATION_EMAIL` — team inbox
- `SITE_URL` — full production domain (`https://movito.cz`)

Do NOT commit these to `.env`; they are secrets.

### 3. Resend setup (one-time)

- Create account at https://resend.com
- Verify domain (`movito.cz`) — add SPF, DKIM, DMARC records per Resend instructions
- Generate API key (sending-only scope)
- Sign DPA (required for GDPR compliance)
- Configure sending cap and billing alerts

### 4. DNS / Email configuration

- **SPF record:** Authorizes Resend to send on behalf of `movito.cz`
- **DKIM record:** Cryptographic signature for email authenticity
- **DMARC record:** Policy for handling spoofed emails
- **Verified domain:** Without verification, Resend will only send to you or require additional confirmation

### 5. Deploy to production

Once variables are set in Netlify:

```bash
git push origin main
```

Netlify automatically:
1. Fetches GitHub repo
2. Installs dependencies
3. Compiles TypeScript → JavaScript in `netlify/functions`
4. Deploys to Netlify CDN
5. Function available at `https://movito.cz/.netlify/functions/contact`

### 6. Post-deploy smoke test

- [ ] Submit form with real email on production
- [ ] Confirm both emails arrive (confirmation + notification)
- [ ] Verify no PII/secrets in Netlify function logs
- [ ] Check response headers: CSP, HSTS, X-Frame-Options present
- [ ] Test error case: submit with invalid email, verify 422 + Czech message in browser

---

## Future Hardening

The following features are **explicitly out of scope** for this release. Movito can opt-in to these later:

### Rate limiting

**Current state:** No rate limiting. A single IP can submit unlimited forms.

**Future option:** Implement bucket-based rate limiting using Netlify Blobs (key-value store):
- Track IP + timestamp
- Limit to N submissions per M minutes (e.g., 5 per 15 min)
- Return 429 TOO_MANY_REQUESTS if exceeded
- Clear old entries periodically

**Alternative:** Use Cloudflare Workers Rate Limiting if adding Cloudflare proxy.

### CAPTCHA / Bot detection

**Current state:** Honeypot only (silent, no visual challenge).

**Future option:** Integrate Cloudflare Turnstile (free tier):
- Add Turnstile widget to form (frontend)
- Verify token in handler before processing (backend)
- Return 403 if token invalid or expired
- No rate limiting or CAPTCHAs for users coming from known good sources (whitelisting)

**Benefit:** Automated detection without annoying legitimate users with visual puzzles.

### Lead storage / CRM integration

**Current state:** Emails only. No database storage.

**Future option:** Store leads in Netlify Blobs or external service:
- After successful email send, store lead JSON
- Enable lead deduplication (same email = update, not new)
- Build internal admin dashboard to view/export leads
- Integrate with Pipedrive, HubSpot, or other CRM

### Nonce-based CSP

**Current state:** CSP allows `'unsafe-inline'` for script and style (broad but acceptable for single-page site).

**Future option:** Generate nonce per request:
- Remove `'unsafe-inline'` from `script-src` and `style-src`
- Generate cryptographic nonce in handler
- Inject nonce into `<script>` and `<style>` tags
- Pass nonce in `Content-Security-Policy` header
- Higher security but more complex

### Inline script extraction

**Current state:** ~400 lines of JavaScript inline in `<script>` tag in `index.html`.

**Future option:** Extract to separate `.js` file:
- Create `netlify/functions/_lib/form-handler.ts` (shared handler logic for frontend)
- Build separate asset `form-handler.js` in build step
- Reference from `index.html` as `<script src="/form-handler.js"></script>`
- Benefits: better caching, nonce-based CSP compatibility, code reuse
- Cost: additional build complexity

### Email templating library

**Current state:** Email templates are inline TypeScript strings with template literals.

**Future option:** Migrate to library like:
- **Milla.js** — lightweight, HTML-focused
- **Handlebars.js** — more flexible if logic grows
- **Mjml** — email-specific markup language (compiles to responsive HTML)

Benefit: Easier to maintain templates, preview in browser, version control diffs.

---

## Troubleshooting

### Function returns 500 "Unexpected error"

**Possible causes:**

1. **Missing environment variables:**
   - Check Netlify dashboard → Site Settings → Environment Variables
   - Verify `RESEND_API_KEY`, `CONTACT_SENDER_EMAIL`, `CONTACT_NOTIFICATION_EMAIL` are set
   - In production, verify `SITE_URL` is set

2. **Invalid SITE_URL format:**
   - Must be a valid URL: `https://movito.cz` (with protocol)
   - Not `movito.cz` (missing protocol)
   - Check Netlify logs: `[contact] invalid SITE_URL`

3. **Uncaught JavaScript error:**
   - Check Netlify function logs for error name + message
   - Run `npm run typecheck` locally to catch type errors
   - Test in dev mode locally first: `npm run dev`

### Function returns 403 "Request was rejected"

**Cause:** Origin/Referer check failed in production.

**Debug steps:**

1. Verify you're posting from `movito.cz` domain (not staging, localhost, etc.)
2. Check that `SITE_URL` in Netlify environment matches actual production domain
3. If using a reverse proxy or custom domain, ensure `Origin` header is preserved (not stripped)
4. Test in dev mode: `netlify dev` sets `NETLIFY_DEV=true`, which bypasses Origin check

### Form submits but no emails arrive

**Possible causes:**

1. **Confirmation email fails but notification succeeds:** Handler returns 200 (expected behavior). Check Resend dashboard → Activity log for failed delivery.

2. **Notification email fails:** Handler returns 500 `EMAIL_SEND_FAILED`. Likely causes:
   - `CONTACT_NOTIFICATION_EMAIL` is not a valid address
   - `CONTACT_SENDER_EMAIL` domain is not verified in Resend
   - Resend API key is revoked or rate-limited
   - Check Resend activity log or API error response in Netlify function logs

3. **Both emails fail:** See #2 above; also check `RESEND_API_KEY` is correct and has "sending" permission.

4. **Emails land in spam:** Domain not verified (SPF, DKIM, DMARC missing or invalid). Check Resend → Domains → Verify record status.

### Honeypot not working

**Symptom:** Non-empty `website` field doesn't return 200 or isn't silent.

**Debug:** Check `netlify/functions/contact.ts` line 135:

```typescript
if (typeof body['website'] === 'string' && body['website'].length > 0) {
  return jsonResponse(SUCCESS_BODY, 200);
}
```

If this logic was modified, restore it. Also verify the honeypot `<input name="website">` exists in form and is hidden from users (CSS `display: none`).

### Validation error messages not appearing on form

**Frontend issue**, not backend. Check `index.html` line 5262+ (form submission handler):

```javascript
if (!validation.ok) {
  return errorResponse('VALIDATION_ERROR', '...', 422, validation.fields);
}
```

Frontend handler should:
1. Receive 422 response
2. Parse `.fields` object
3. Iterate over field names and error messages
4. Display errors in UI

If errors don't appear, check browser console for fetch errors or JavaScript exceptions.

---

## Related Documentation

- **Deploy checklist:** `DEPLOY_CHECKLIST.md` — human operator pre-deploy instructions
- **Implementation changelog:** `docs/implementation-v4-changelog.md` — context on v4 layout refresh and CRO changes
- **CRO refactor:** `docs/cta-form-cro-refactor.md` — detailed CRO changes to form styling and emphasis

---

## Changelog

### 2026-04-10 — Security Hotfix: Resend v4 Error Detection & PII Redaction in Logs

**Bug:** `contact.ts` detected network-level promise rejections but missed Resend SDK v4's API-error pattern (`{data: null, error}`). Any Resend API failure (unverified domain, rate limit, auth failure, validation error) resolved the promise and fell through the error check, returning fake 200 success to the user while no emails were sent. Silent lead loss + GDPR risk from unredacted email logging.

**Fixes:**
1. **Resend v4 error detection** — `extractSendError` now checks both promise rejection AND `result.value?.error` in settled promise. Requires `result.value.data?.id` to exist for success (defence-in-depth positive check).
2. **PII redaction** — New `sanitizeLogValue` helper redacts email patterns, strips control chars (log-injection defense), truncates to 200 chars. Applied to all 3 log sites: notification failure, confirmation failure, uncaught exception.
3. **Fatal vs. non-fatal** — Notification email failure → 500 `EMAIL_SEND_FAILED` (team must receive every lead). Confirmation failure → logged at INFO, user still gets 200 (lead captured in notification).

**Impact:** No more silent lead loss from Resend API errors. Logs compliant with GDPR (no PII exposure). Handles SDK version mismatches gracefully.

**Verification:** Submit form with valid data → 200. Try after domain verification error in Resend console → 500 with redacted logs.

**Files changed:** `netlify/functions/contact.ts` (221 → 256 LOC)

---

### 2026-04-08 — Contact form email sending via Resend

Added complete contact form email integration powered by Resend. Previously, the form submitted to Formspree (third-party service). Now, a Netlify Function validates submissions server-side and sends two emails: (1) a Czech confirmation to the user, (2) a detailed notification to the Movito team. Includes origin validation, honeypot anti-spam, full input validation with aggregated error reporting, and brand-compliant HTML email templates. Production-ready with security hardening (XSS escaping, CRLF injection prevention, GDPR consent enforcement, origin/referer check).
