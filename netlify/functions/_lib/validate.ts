// ============================================================
// validate.ts — Contact form validation for Movito
// Netlify Functions runtime — no external dependencies
// ============================================================
//
// Exports a `validateBody` function that accepts a raw (unvalidated)
// `ContactBody` and returns a discriminated union:
//   { ok: true;  data: ValidatedContact }
//   { ok: false; fields: Record<string, string> }
//
// All field errors are aggregated before returning — no early-return.
// ============================================================

import { hasControlChars, validateEmail } from './utils';

// ----------------------------------------------------------
// Exported types
// ----------------------------------------------------------

/**
 * Raw request body shape for the Movito contact form.
 * All fields are typed as `unknown` so the caller is not required
 * to pre-validate before passing the parsed JSON object here.
 */
export interface ContactBody {
  name: unknown;
  email: unknown;
  phone: unknown;
  investment_amount: unknown;
  consent: unknown;
  consent_timestamp: unknown;
  form_location: unknown;
  /** Honeypot — must be checked and rejected by the handler BEFORE calling validateBody. */
  website: unknown;
  /** Investment category the lead came from; populated by a hidden input in each category panel. */
  category?: unknown;
  /** Soft acknowledgment that the user is aware this is for qualified investors (ZISIF §272). */
  qualified_investor_ack?: unknown;
}

/**
 * Allowed values for the investment-amount selector.
 * The empty string `''` represents "not answered / prefer not to say".
 */
export const INVESTMENT_AMOUNTS = ['500k-1m', '1m-5m', '5m-20m', '20m+', 'unknown', ''] as const;

/**
 * Allowed values for the investment-category selector.
 * The empty string `''` represents absent or unrecognised.
 */
export const ALLOWED_CATEGORIES = ['podily', 'nemovitosti', 'baterie', 'kovy', 'krypto', ''] as const;

/** Literal union derived from `ALLOWED_CATEGORIES`. */
export type InvestmentCategory = (typeof ALLOWED_CATEGORIES)[number];

/** Literal union derived from `INVESTMENT_AMOUNTS`. */
export type InvestmentAmount = (typeof INVESTMENT_AMOUNTS)[number];

/**
 * Fully validated and narrowed contact form data.
 * All string fields have been trimmed; `email` is also lowercased.
 * `consent` is the literal `true` — never `false` or any truthy value.
 */
export interface ValidatedContact {
  name: string;
  email: string;
  /** Original user-formatted phone string (spaces/dashes preserved). */
  phone: string;
  investment_amount: InvestmentAmount;
  consent: true;
  consent_timestamp: string;
  form_location: string;
  /** Investment category; empty string if absent or unrecognised. */
  category: string;
  /** Whether the user acknowledged the qualified-investor requirement (ZISIF §272). */
  qualified_investor_ack: boolean;
}

// ----------------------------------------------------------
// Internal narrowing helpers
// ----------------------------------------------------------

/**
 * Type predicate that narrows `x: string` to `InvestmentAmount`.
 *
 * The `as readonly string[]` cast is intentional and required: without it
 * TypeScript rejects the `.includes(x)` call because `x: string` is not
 * assignable to the narrower element type of the `as const` tuple.
 */
function isAmount(x: string): x is InvestmentAmount {
  return (INVESTMENT_AMOUNTS as readonly string[]).includes(x);
}

/** Type predicate that narrows `x: string` to `InvestmentCategory`. */
function isCategory(x: string): x is InvestmentCategory {
  return (ALLOWED_CATEGORIES as readonly string[]).includes(x);
}

// ----------------------------------------------------------
// validateBody
// ----------------------------------------------------------

/**
 * Validates a raw contact form body and returns a discriminated union result.
 *
 * - On success: `{ ok: true; data: ValidatedContact }`
 * - On failure: `{ ok: false; fields: Record<string, string> }` where each
 *   key is a field name and the value is a Czech user-facing error message.
 *
 * All field validations are performed before returning so that callers receive
 * the complete set of errors in a single call (no early-return on first error).
 *
 * The `website` honeypot field is intentionally ignored here — the handler
 * must check it and short-circuit before ever calling this function.
 *
 * @param raw - Parsed but unvalidated request body.
 * @returns Discriminated union: success with narrowed data, or failure with field errors.
 */
export function validateBody(
  raw: ContactBody,
): { ok: true; data: ValidatedContact } | { ok: false; fields: Record<string, string> } {
  const fields: Record<string, string> = {};

  // ----------------------------------------------------------
  // name (required)
  // Must be a non-empty string, 2–100 chars after trim, no control chars.
  // ----------------------------------------------------------
  let validatedName = '';
  if (typeof raw.name !== 'string') {
    fields.name = 'Jméno musí mít 2–100 znaků a nesmí obsahovat řídící znaky.';
  } else {
    const trimmedName = raw.name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 100 || hasControlChars(trimmedName)) {
      fields.name = 'Jméno musí mít 2–100 znaků a nesmí obsahovat řídící znaky.';
    } else {
      validatedName = trimmedName;
    }
  }

  // ----------------------------------------------------------
  // email (required)
  // Must be a string; trimmed+lowercased value passes validateEmail
  // (which itself guards against control chars, length > 254, and regex).
  // ----------------------------------------------------------
  let validatedEmail = '';
  if (typeof raw.email !== 'string') {
    fields.email = 'Zadejte platný e-mail.';
  } else {
    const trimmedEmail = raw.email.trim().toLowerCase();
    if (!validateEmail(trimmedEmail)) {
      fields.email = 'Zadejte platný e-mail.';
    } else {
      validatedEmail = trimmedEmail;
    }
  }

  // ----------------------------------------------------------
  // phone (required)
  // Control-char check on the RAW value (before stripping) to catch
  // injection attempts embedded in formatting characters.
  // After stripping spaces/dashes/parens the digit sequence must be
  // 9–15 chars with an optional leading '+'.
  // The ORIGINAL (trimmed) formatting is preserved in ValidatedContact.
  // ----------------------------------------------------------
  let validatedPhone = '';
  if (typeof raw.phone !== 'string') {
    fields.phone = 'Telefon musí mít 9–15 číslic, volitelně s předvolbou +.';
  } else {
    if (hasControlChars(raw.phone)) {
      fields.phone = 'Telefon musí mít 9–15 číslic, volitelně s předvolbou +.';
    } else {
      const stripped = raw.phone.replace(/[\s\-()]/g, '');
      if (!/^[+]?[0-9]{9,15}$/.test(stripped)) {
        fields.phone = 'Telefon musí mít 9–15 číslic, volitelně s předvolbou +.';
      } else {
        validatedPhone = raw.phone.trim();
      }
    }
  }

  // ----------------------------------------------------------
  // consent (required, STRICTLY true)
  // Rejects "true" (string), 1 (number), or any other truthy-but-not-true value.
  // ----------------------------------------------------------
  if (raw.consent !== true) {
    fields.consent = 'Pro odeslání je nutný souhlas se zpracováním osobních údajů.';
  }

  // ----------------------------------------------------------
  // investment_amount (optional)
  // undefined / null → default to '' (valid, "not answered").
  // If present: must be a string and pass isAmount().
  // ----------------------------------------------------------
  let validatedAmount: InvestmentAmount = '';
  if (raw.investment_amount === undefined || raw.investment_amount === null) {
    // Treat absence as the empty-string default — valid.
    validatedAmount = '';
  } else if (typeof raw.investment_amount !== 'string') {
    fields.investment_amount = 'Neplatná hodnota výše investice.';
  } else if (!isAmount(raw.investment_amount)) {
    fields.investment_amount = 'Neplatná hodnota výše investice.';
  } else {
    validatedAmount = raw.investment_amount;
  }

  // ----------------------------------------------------------
  // consent_timestamp (optional pass-through)
  // undefined / null → ''.
  // If present: must be string, ≤100 chars, no control chars.
  // We add an error on clearly bogus payloads to catch injection attempts,
  // but this field is otherwise non-blocking for legitimate users.
  // ----------------------------------------------------------
  let validatedConsentTimestamp = '';
  if (raw.consent_timestamp === undefined || raw.consent_timestamp === null) {
    validatedConsentTimestamp = '';
  } else if (typeof raw.consent_timestamp !== 'string') {
    fields.consent_timestamp = 'Neplatné časové razítko.';
  } else if (raw.consent_timestamp.length > 100 || hasControlChars(raw.consent_timestamp)) {
    fields.consent_timestamp = 'Neplatné časové razítko.';
  } else {
    validatedConsentTimestamp = raw.consent_timestamp;
  }

  // ----------------------------------------------------------
  // form_location (optional pass-through)
  // Same pattern as consent_timestamp.
  // ----------------------------------------------------------
  let validatedFormLocation = '';
  if (raw.form_location === undefined || raw.form_location === null) {
    validatedFormLocation = '';
  } else if (typeof raw.form_location !== 'string') {
    fields.form_location = 'Neplatný původ formuláře.';
  } else if (raw.form_location.length > 100 || hasControlChars(raw.form_location)) {
    fields.form_location = 'Neplatný původ formuláře.';
  } else {
    validatedFormLocation = raw.form_location;
  }

  // ----------------------------------------------------------
  // category (optional soft pass-through)
  // If present and a recognised string, keep it; otherwise coerce to ''.
  // Never causes a validation failure.
  // ----------------------------------------------------------
  let validatedCategory = '';
  if (typeof raw.category === 'string') {
    const trimmedCategory = raw.category.trim().slice(0, 100);
    if (isCategory(trimmedCategory)) {
      validatedCategory = trimmedCategory;
    }
  }

  // ----------------------------------------------------------
  // qualified_investor_ack (optional soft boolean)
  // Only strictly === true is accepted; everything else → false.
  // Never causes a validation failure.
  // ----------------------------------------------------------
  const validatedQualifiedInvestorAck: boolean = raw.qualified_investor_ack === true;

  // ----------------------------------------------------------
  // Aggregate result
  // ----------------------------------------------------------
  if (Object.keys(fields).length > 0) {
    return { ok: false, fields };
  }

  return {
    ok: true,
    data: {
      name: validatedName,
      email: validatedEmail,
      phone: validatedPhone,
      investment_amount: validatedAmount,
      consent: true,
      consent_timestamp: validatedConsentTimestamp,
      form_location: validatedFormLocation,
      category: validatedCategory,
      qualified_investor_ack: validatedQualifiedInvestorAck,
    },
  };
}
