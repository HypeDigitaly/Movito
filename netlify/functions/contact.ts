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
  const isDev             = process.env['NETLIFY_DEV'] === 'true' || process.env['CONTEXT'] === 'dev';

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
    if (!isDev) {
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
    const createdAt   = new Date().toISOString();
    const senderEmail = `Milionová Investice <${senderAddr}>`;

    const confirmation = contactConfirmationEmail({ name: data.name });
    const notification = contactNotificationEmail({
      name:              data.name,
      email:             data.email,
      phone:             data.phone,
      investment_amount: data.investment_amount,
      form_location:     data.form_location,
      consent_timestamp: data.consent_timestamp,
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
    // Notification failure is fatal — the team must receive every lead.
    if (notifRes.status === 'rejected') {
      const reason = notifRes.reason;
      console.error(
        '[contact] notification failed',
        reason instanceof Error ? reason.name    : 'Unknown',
        reason instanceof Error ? reason.message : '',
      );
      return errorResponse(
        'EMAIL_SEND_FAILED',
        'Odeslání e-mailu selhalo. Zkuste to prosím znovu, nebo nám zavolejte.',
        500,
      );
    }

    // Confirmation failure is non-fatal — lead is captured; user still gets 200.
    if (confRes.status === 'rejected') {
      const reason = confRes.reason;
      console.error(
        '[contact] confirmation failed',
        reason instanceof Error ? reason.name    : 'Unknown',
        reason instanceof Error ? reason.message : '',
      );
    }

    return jsonResponse(SUCCESS_BODY, 200);

  } catch (err) {
    console.error(
      '[contact] uncaught',
      err instanceof Error ? err.name    : 'Unknown',
      err instanceof Error ? err.message : '',
    );
    return errorResponse('INTERNAL_ERROR', 'Neočekávaná chyba. Zkuste to prosím znovu.', 500);
  }
}
