// ============================================================
// Shared utility functions for Netlify Functions — Movito
// Node.js 20 runtime — no external dependencies
// ============================================================
//
// NOTE: This file intentionally carries no imports.
// All types are defined locally; no path-alias imports are
// valid inside the Netlify Functions runtime context.
// ============================================================

// ----------------------------------------------------------
// Exported types
// ----------------------------------------------------------

/**
 * Machine-readable error codes used across all Movito Netlify Functions.
 * Callers construct error responses via `errorResponse()`.
 */
export type ErrorCode =
  | 'BAD_REQUEST'
  | 'METHOD_NOT_ALLOWED'
  | 'BODY_TOO_LARGE'
  | 'UNSUPPORTED_MEDIA_TYPE'
  | 'FORBIDDEN'
  | 'VALIDATION_ERROR'
  | 'EMAIL_SEND_FAILED'
  | 'INTERNAL_ERROR';

// ----------------------------------------------------------
// Local types (not exported)
// ----------------------------------------------------------

interface ApiErrorResponse {
  success: false;
  code: ErrorCode;
  message: string;
  fields?: Record<string, string>;
}

// ----------------------------------------------------------
// HTML escaping — covers all 6 OWASP-recommended characters
// ----------------------------------------------------------

/**
 * Escapes all six OWASP-recommended characters in a string to their
 * HTML entity equivalents, preventing XSS injection in HTML contexts.
 *
 * Characters escaped:
 *   & → &amp;
 *   < → &lt;
 *   > → &gt;
 *   " → &quot;
 *   ' → &#x27;
 *   ` → &#x60;
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/`/g, '&#x60;');
}

// ----------------------------------------------------------
// Control character detection — header injection defense
// ----------------------------------------------------------

/**
 * Returns `true` if `str` contains any C0 control character in the
 * range U+0000–U+001F, excluding U+0009 (horizontal tab).
 *
 * Specifically catches `\r` (CR), `\n` (LF), and `\0` (NUL) which are
 * the primary vectors for HTTP header injection attacks when values are
 * embedded in outbound email headers.
 *
 * - U+0000–U+0008  : NUL and other non-printable controls
 * - U+000A–U+001F  : LF, CR, and remaining C0 controls (skips U+0009 tab)
 */
export function hasControlChars(str: string): boolean {
  // Matches any C0 control char (U+0000–U+001F) except U+0009 (tab)
  return /[\x00-\x08\x0A-\x1F]/.test(str);
}

// ----------------------------------------------------------
// Email validation
// ----------------------------------------------------------

/**
 * Validates an email address through three sequential guards:
 *
 * 1. Control-character check via `hasControlChars` — rejects CRLF
 *    injection and null bytes that could corrupt outbound mail headers.
 * 2. Length check — enforces the RFC 5321 maximum of 254 characters.
 * 3. RFC-5322-compatible regex — ensures the address has the structure
 *    `local@domain.tld` with a TLD of at least two characters.
 *
 * The caller is responsible for trimming whitespace before calling this
 * function; no internal trimming is performed.
 *
 * Accepts: user@example.com, user+tag@sub.domain.co.uk
 * Rejects: strings with CRLF/NUL, strings > 254 chars, missing @/domain
 */
export function validateEmail(email: string): boolean {
  // Guard 1: reject header-injection vectors
  if (hasControlChars(email)) {
    return false;
  }

  // Guard 2: RFC 5321 maximum total length
  if (email.length > 254) {
    return false;
  }

  // Guard 3: structural shape check
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return EMAIL_RE.test(email);
}

// ----------------------------------------------------------
// Safe JSON parsing
// ----------------------------------------------------------

/**
 * Safely parses a JSON string, returning `null` on any parse error
 * instead of throwing. The return type is `unknown` — callers must
 * narrow the value through runtime validation before use.
 *
 * @example
 * const data = parseJson(body);
 * if (!data) return errorResponse('BAD_REQUEST', 'Invalid JSON', 400);
 */
export function parseJson(body: string): unknown | null {
  try {
    return JSON.parse(body) as unknown;
  } catch {
    return null;
  }
}

// ----------------------------------------------------------
// Response helpers
// ----------------------------------------------------------

/**
 * Constructs a JSON `Response` with the correct `Content-Type` header.
 * Defaults to HTTP 200 if no status is provided.
 *
 * @param data   - Any JSON-serialisable value.
 * @param status - HTTP status code (default: 200).
 */
export function jsonResponse(data: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Constructs a JSON error `Response` whose body matches the
 * `ApiErrorResponse` contract: `{ success: false, code, message, fields? }`.
 *
 * The `fields` key is omitted entirely from the serialised body when the
 * argument is not provided or is an empty object.
 *
 * @param code    - Machine-readable error code from the `ErrorCode` union.
 * @param message - Human-readable description of the failure.
 * @param status  - HTTP status code (e.g. 400, 405, 415, 500).
 * @param fields  - Optional per-field validation messages, keyed by field name.
 */
export function errorResponse(
  code: ErrorCode,
  message: string,
  status: number,
  fields?: Record<string, string>,
): Response {
  const body: ApiErrorResponse = {
    success: false,
    code,
    message,
    ...(fields !== undefined && Object.keys(fields).length > 0
      ? { fields }
      : {}),
  };
  return jsonResponse(body, status);
}
