// ============================================================
// contact.ts — Netlify Function: POST /.netlify/functions/contact
// Pipeline: env guard → method → body size → content-type →
//           JSON parse → origin → honeypot → validate → send
// Node.js 20 runtime — native Request/Response Web API
// ============================================================

import { Resend } from 'resend';
import { parseJson, jsonResponse, errorResponse } from './_lib/utils';
import { validateBody, type ContactBody } from './_lib/validate';
import { contactConfirmationEmail } from './_lib/email-templates/contact-confirmation';
import { contactNotificationEmail } from './_lib/email-templates/contact-notification';

// ----------------------------------------------------------
// Constants
// ----------------------------------------------------------

/** Maximum allowed raw body size in bytes (10 KB). */
const MAX_BODY_BYTES = 10 * 1024; // 10 KB

/** Canonical success payload — both real success and honeypot return these exact bytes. */
const SUCCESS_BODY = { success: true, message: 'Zpráva odeslána.' } as const;

// ----------------------------------------------------------
// Handler
// ----------------------------------------------------------

/** Sanitise a string for safe logging: redact emails, strip control chars, truncate. */
function sanitizeLogValue(s: string): string {
  return s
    .replace(/[\w.+-]+@[\w.-]+/g, '[redacted-email]')
    .replace(/[\x00-\x1F\x7F]/g, ' ')
    .slice(0, 200);
}

/**
 * Netlify Function entry point for the Milionová Investice contact form.
 *
 * Accepts POST requests with a JSON body matching `ContactBody`.
 * Validates the payload, performs an origin check in production,
 * and dispatches a user confirmation and an internal notification
 * email via Resend. Returns `{ success: true, message }` on success
 * or a structured `{ success: false, code, message, fields? }` error.
 *
 * @param request - Native Web API `Request` object provided by the Netlify runtime.
 * @returns A `Response` with `Content-Type: application/json`.
 */
export default async function handler(request: Request): Promise<Response> {
  // ----------------------------------------------------------
  // Capture env vars as consts so TypeScript narrowing persists
  // across all subsequent statements.
  // ----------------------------------------------------------
  const apiKey            = process.env['RESEND_API_KEY'];
  const senderAddr        = process.env['CONTACT_SENDER_EMAIL'];
  const notificationAddr  = process.env['CONTACT_NOTIFICATION_EMAIL'];
  const siteUrl           = process.env['SITE_URL'] ?? '';
  const context         = process.env['CONTEXT'];
  const isLocalDev      = process.env['NETLIFY_DEV'] === 'true' || context === 'dev';
  const isDeployPreview = context === 'deploy-preview';

  try {
    // ── Step 0 — Env var guard ─────────────────────────────
    // Must be first: every subsequent step depends on these values.
    if (!apiKey || !senderAddr || !notificationAddr) {
      console.error('[contact] missing required env var');
      return errorResponse('INTERNAL_ERROR', 'Neočekávaná chyba. Zkuste to prosím znovu.', 500);
    }
    // After this guard, TypeScript narrows apiKey/senderAddr/notificationAddr to string.

    // ── Step 1 — Method guard ──────────────────────────────
    if (request.method !== 'POST') {
      return errorResponse('METHOD_NOT_ALLOWED', 'Metoda není povolena. Použijte POST.', 405);
    }

    // ── Step 2 — Body size guard ───────────────────────────
    let rawBody: string;
    try {
      const buffer = await request.arrayBuffer();
      if (buffer.byteLength > MAX_BODY_BYTES) {
        return errorResponse('BODY_TOO_LARGE', 'Požadavek překračuje povolenou velikost.', 413);
      }
      rawBody = new TextDecoder().decode(buffer);
    } catch {
      return errorResponse('BAD_REQUEST', 'Nepodařilo se načíst tělo požadavku.', 400);
    }

    // ── Step 3 — Content-Type guard ────────────────────────
    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.toLowerCase().startsWith('application/json')) {
      return errorResponse(
        'UNSUPPORTED_MEDIA_TYPE',
        'Nepodporovaný typ obsahu. Použijte application/json.',
        415,
      );
    }

    // ── Step 4 — JSON parse ────────────────────────────────
    const parsed = parseJson(rawBody);
    if (!parsed || typeof parsed !== 'object') {
      return errorResponse('BAD_REQUEST', 'Neplatný formát požadavku.', 400);
    }
    // `parsed` is narrowed to `object` (non-null) past this point.

    // ── Step 5 — Origin / Referer check ───────────────────
    if (isLocalDev) {
      // Skip origin check entirely on local dev.
    } else if (isDeployPreview) {
      // On deploy-preview, accept only requests originating from a .netlify.app
      // URL or from DEPLOY_PRIME_URL (set automatically by Netlify on preview builds).
      // URL-parsed checks prevent regex bypass and startsWith subdomain-injection.
      const origin = request.headers.get('origin') ?? request.headers.get('referer') ?? '';
      let isAllowedOrigin = false;
      if (origin) {
        try {
          const parsed = new URL(origin);
          // Must be HTTPS (preview URLs are always HTTPS on Netlify)
          if (parsed.protocol === 'https:') {
            // Accept any *.netlify.app host (preview deploys) — hostname-anchored check
            if (parsed.hostname.endsWith('.netlify.app')) {
              isAllowedOrigin = true;
            }
            // Also accept an exact match against DEPLOY_PRIME_URL, compared by parsed origin
            const deployPrimeUrl = process.env['DEPLOY_PRIME_URL'];
            if (!isAllowedOrigin && deployPrimeUrl) {
              try {
                const expected = new URL(deployPrimeUrl);
                if (parsed.origin === expected.origin) {
                  isAllowedOrigin = true;
                }
              } catch { /* DEPLOY_PRIME_URL malformed — ignore */ }
            }
          }
        } catch {
          // Malformed origin header — treat as disallowed
        }
      }
      if (!isAllowedOrigin) {
        return errorResponse('FORBIDDEN', 'Požadavek byl zamítnut.', 403);
      }
    } else {
      // Production: strict origin check against SITE_URL.
      if (!siteUrl) {
        console.error('[contact] missing SITE_URL in production');
        return errorResponse('INTERNAL_ERROR', 'Neočekávaná chyba. Zkuste to prosím znovu.', 500);
      }

      let expectedOrigin: string;
      try {
        expectedOrigin = new URL(siteUrl).origin;
      } catch {
        console.error('[contact] invalid SITE_URL');
        return errorResponse('INTERNAL_ERROR', 'Neočekávaná chyba. Zkuste to prosím znovu.', 500);
      }

      const originHeader  = request.headers.get('origin');
      const refererHeader = request.headers.get('referer');

      let originOk = false;
      if (originHeader) {
        try {
          originOk = new URL(originHeader).origin === expectedOrigin;
        } catch {
          originOk = false;
        }
      } else if (refererHeader) {
        try {
          originOk = new URL(refererHeader).origin === expectedOrigin;
        } catch {
          originOk = false;
        }
      }

      if (!originOk) {
        return errorResponse('FORBIDDEN', 'Požadavek byl zamítnut.', 403);
      }
    }

    // ── Step 6 — Honeypot check ────────────────────────────
    // Silent 200 — byte-identical to real success; bots learn nothing.
    const body = parsed as ContactBody;
    if (typeof body['website'] === 'string' && body['website'].length > 0) {
      return jsonResponse(SUCCESS_BODY, 200);
    }

    // ── Step 7 — Validation ────────────────────────────────
    const validation = validateBody(body);
    if (!validation.ok) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Opravte prosím chyby ve formuláři.',
        422,
        validation.fields,
      );
    }
    const { data } = validation;

    // ── Step 8 — Build emails ──────────────────────────────
    // Server-generated timestamp: canonical, tamper-proof record of when the
    // server accepted and processed the consent.  The client-supplied value
    // (consent_timestamp_client) is retained as supplementary information only.
    const consent_timestamp = new Date().toISOString();
    const createdAt         = consent_timestamp; // reuse the same instant
    const senderEmail       = `Milionová Investice <${senderAddr}>`;

    const confirmation = contactConfirmationEmail({ name: data.name });
    const notification = contactNotificationEmail({
      name:                     data.name,
      email:                    data.email,
      phone:                    data.phone,
      investment_amount:        data.investment_amount,
      form_location:            data.form_location,
      consent_timestamp,                          // server-generated (authoritative)
      consent_timestamp_client: data.consent_timestamp_client, // client-supplied (supplementary)
      category:                 data.category,
      qualified_investor_ack:   data.qualified_investor_ack,
      createdAt,
    });

    // ── Step 9 — Send emails via Promise.allSettled ────────
    const resend = new Resend(apiKey);

    const [confRes, notifRes] = await Promise.allSettled([
      resend.emails.send({
        from:    senderEmail,
        to:      data.email,
        subject: confirmation.subject,
        html:    confirmation.html,
      }),
      resend.emails.send({
        from:    senderEmail,
        to:      notificationAddr,
        replyTo: data.email,
        subject: notification.subject,
        html:    notification.html,
      }),
    ]);

    // ── Step 10 — Result handling ──────────────────────────
    //
    // Resend SDK v4 resolves on API errors with { data: null, error: {...} }
    // instead of rejecting. We must check BOTH failure modes:
    //   (a) rejected  — network/connection failure (promise rejected)
    //   (b) fulfilled — API error (promise resolved with .error !== null)
    //
    // Returns a { name, message } pair for logging, or null on success.

    type SendError = { name: string; message: string };

    function extractSendError(
      result: PromiseSettledResult<Awaited<ReturnType<typeof resend.emails.send>>>,
    ): SendError | null {
      // (a) Network-level failure — promise rejected.
      if (result.status === 'rejected') {
        const reason: unknown = result.reason;
        return {
          name:    reason instanceof Error ? reason.name    : 'NetworkError',
          message: reason instanceof Error ? reason.message : 'Promise rejected with non-Error value',
        };
      }
      // (b) API-level failure — promise fulfilled but SDK signalled an error.
      const { error } = result.value;
      if (error) {
        return { name: error.name, message: error.message };
      }
      // Success requires a Resend message ID. Anything else is treated as a failure.
      if (!result.value.data?.id) {
        return { name: 'UnknownError', message: 'Resend returned neither data nor error' };
      }
      return null;
    }

    const notifError = extractSendError(notifRes);
    const confError  = extractSendError(confRes);

    // Notification failure is fatal — the team must receive every lead.
    if (notifError !== null) {
      console.error('[contact] notification failed', notifError.name, sanitizeLogValue(notifError.message));
      return errorResponse(
        'EMAIL_SEND_FAILED',
        'Odeslání e-mailu selhalo. Zkuste to prosím znovu, nebo nám zavolejte.',
        500,
      );
    }

    // Confirmation failure is non-fatal — lead is captured; user still gets 200.
    if (confError !== null) {
      console.error('[contact] confirmation failed', confError.name, sanitizeLogValue(confError.message));
    }

    console.log('[contact] submission', {
      form_location: sanitizeLogValue(validation.data.form_location),
      category:      sanitizeLogValue(validation.data.category ?? ''),
    });

    return jsonResponse(SUCCESS_BODY, 200);

  } catch (err) {
    console.error(
      '[contact] uncaught',
      err instanceof Error ? err.name    : 'Unknown',
      err instanceof Error ? sanitizeLogValue(err.message) : '',
    );
    return errorResponse('INTERNAL_ERROR', 'Neočekávaná chyba. Zkuste to prosím znovu.', 500);
  }
}
