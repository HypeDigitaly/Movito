// ============================================================
// Email template: Contact form notification (sent to Movito team)
// Resend API — HTML email, inline CSS, Czech-only, Milionová Investice
// ============================================================

import { escapeHtml } from '../utils';
import {
  COLOR_BG,
  COLOR_BG_CARD,
  COLOR_BORDER,
  COLOR_GOLD,
  COLOR_MUTED,
  COLOR_TEXT,
  FONT_BODY,
  FONT_DISPLAY,
  wrapEmail,
} from './shared';

// ----------------------------------------------------------
// Template-local brand token
// ----------------------------------------------------------

const COLOR_GOLD_DK = '#7A5E0A';

// ----------------------------------------------------------
// Layout helpers
// ----------------------------------------------------------

/** Renders one table row: left cell = label, right cell = value, separator row below. */
function fieldRow(label: string, value: string, highlight = false): string {
  return `
  <tr>
    <td valign="top" style="width:140px;padding:10px 16px 10px 0;font-family:${FONT_BODY};font-size:11px;font-weight:600;color:${COLOR_MUTED};text-transform:uppercase;letter-spacing:0.07em;white-space:nowrap;">
      ${label}
    </td>
    <td valign="top" style="padding:10px 0;font-family:${FONT_BODY};font-size:${highlight ? '16px' : '15px'};font-weight:${highlight ? '700' : '400'};color:${highlight ? COLOR_GOLD : COLOR_TEXT};line-height:1.6;word-break:break-word;">
      ${value}
    </td>
  </tr>
  <tr>
    <td colspan="2" style="height:1px;background-color:${COLOR_BORDER};font-size:0;line-height:0;padding:0;">&nbsp;</td>
  </tr>`;
}

// ----------------------------------------------------------
// Domain helpers
// ----------------------------------------------------------

function investmentLabel(v: string): string {
  switch (v) {
    case '100k-500k': return '100 000 \u2013 500 000 K\u010D';
    case '500k-1m': return '500 tis. \u2013 1 mil. K\u010D';
    case '1m-5m':   return '1 \u2013 5 mil. K\u010D';
    case '5m-20m':  return '5 \u2013 20 mil. K\u010D';
    case '20m+':    return '20 mil. K\u010D a v\xedce';
    case 'unknown': return 'Zat\xedm nev\xedm';
    case '':        return 'Nezad\xe1no';
    default:        return 'Nezad\xe1no'; // defensive
  }
}

function categoryLabel(category: string): string {
  switch (category) {
    case 'podily':      return 'Pod\xedly ve firm\xe1ch';
    case 'nemovitosti': return 'Nemovitosti';
    case 'baterie':     return 'Bateriov\xe1 \xfalo\u017ei\u0161t\u011b';
    case 'kovy':        return 'Drah\xe9 kovy';
    case 'krypto':      return 'Krypto';
    default:            return 'Neuvedena';
  }
}

function formLocationLabel(v: string): string {
  switch (v) {
    case 'primary-form-mount':         return 'Hlavn\xed formul\xe1\u0159 (sekce Kontakt)';
    case 'modal-form-mount':           return 'Mod\xe1ln\xed okno';
    case 'category-panel-podily':      return 'Detail kategorie: Pod\xedly ve firm\xe1ch';
    case 'category-panel-nemovitosti': return 'Detail kategorie: Nemovitosti';
    case 'category-panel-baterie':     return 'Detail kategorie: Bateriov\xe1 \xfalo\u017ei\u0161t\u011b';
    case 'category-panel-kovy':        return 'Detail kategorie: Drah\xe9 kovy';
    case 'category-panel-krypto':      return 'Detail kategorie: Krypto';
    default: return escapeHtml(v); // fallback: escape unknown values
  }
}

function formatPragueDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('cs-CZ', {
      timeZone:  'Europe/Prague',
      dateStyle: 'full',
      timeStyle: 'short',
    });
  } catch {
    return iso; // fallback to raw ISO string
  }
}

// ----------------------------------------------------------
// Main export
// ----------------------------------------------------------

export function contactNotificationEmail(data: {
  name: string;
  email: string;
  phone: string;
  investment_amount: '' | '100k-500k' | '500k-1m' | '1m-5m' | '5m-20m' | '20m+' | 'unknown';
  form_location: string;
  /** Server-generated ISO timestamp — authoritative for GDPR records. */
  consent_timestamp: string;
  /** Client-supplied ISO timestamp — supplementary; may differ from server value. */
  consent_timestamp_client?: string;
  createdAt: string;
  category?: string;
  qualified_investor_ack?: boolean;
}): { subject: string; html: string } {
  const safeName  = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.phone);

  const subject   = `Nový kontakt z webu Milionové Investice`;
  const preheader = `${safeName} vypln\xedl/a kontaktn\xed formul\xe1\u0159 \u2014 zkontroluj zpr\xe1vu.`;

  const formattedCreatedAt = formatPragueDate(data.createdAt);

  // Server timestamp is always present (generated in contact.ts).
  const consentRendered = formatPragueDate(data.consent_timestamp);
  // Client timestamp is supplementary — shown for audit trail completeness.
  const consentClientRendered = data.consent_timestamp_client
    ? formatPragueDate(data.consent_timestamp_client)
    : '(nedod\xe1no)';

  const body = `
    <!-- Badge -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px 0;">
      <tr>
        <td style="background-color:${COLOR_GOLD};border-radius:4px;padding:4px 12px;">
          <span style="font-family:${FONT_BODY};font-size:11px;font-weight:700;color:${COLOR_BG};text-transform:uppercase;letter-spacing:0.08em;">NOV\xdd KONTAKT</span>
        </td>
      </tr>
    </table>

    <!-- Heading -->
    <h1 style="margin:0 0 8px 0;font-family:${FONT_DISPLAY};font-size:26px;font-weight:700;color:${COLOR_TEXT};line-height:1.3;">
      ${safeName}
    </h1>
    <p style="margin:0 0 32px 0;font-family:${FONT_BODY};font-size:14px;color:${COLOR_MUTED};">
      ${formattedCreatedAt}
    </p>

    <!-- Detail table -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px 0;">
      ${fieldRow('Jm\xe9no', safeName, true)}
      ${fieldRow('E-mail', `<a href="mailto:${safeEmail}" style="color:${COLOR_GOLD};text-decoration:none;">${safeEmail}</a>`)}
      ${fieldRow('Telefon', `<a href="tel:${safePhone}" style="color:${COLOR_GOLD};text-decoration:none;">${safePhone}</a>`)}
      ${fieldRow('Zvolen\xfd rozsah', investmentLabel(data.investment_amount))}
      ${fieldRow('P\u016fvod formul\xe1\u0159e', formLocationLabel(data.form_location))}
      ${fieldRow('Kategorie', categoryLabel(data.category ?? ''))}
      ${fieldRow('Kval. investor (potvrzeno)', data.qualified_investor_ack ? 'Ano' : 'Neuvedeno')}
      ${fieldRow('Datum odeslan\xed', formattedCreatedAt)}
      ${fieldRow('\u010casov\xe9 raz\xedtko souhlasu (server)', consentRendered)}
      ${fieldRow('\u010casov\xe9 raz\xedtko souhlasu (klient)', consentClientRendered)}
    </table>

    <!-- Reply CTA button -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px 0;">
      <tr>
        <td style="border-radius:10px;background-color:${COLOR_GOLD};">
          <a href="mailto:${safeEmail}?subject=Re%3A%20Va%C5%A1e%20zpr%C3%A1va" style="display:inline-block;padding:14px 28px;font-family:${FONT_BODY};font-size:15px;font-weight:600;color:${COLOR_BG_CARD};text-decoration:none;border-radius:10px;">
            Odpov\u011bd\u011bt ${safeName}
          </a>
        </td>
      </tr>
    </table>

    <!-- Reply-to note -->
    <p style="margin:0;font-family:${FONT_BODY};font-size:12px;line-height:1.6;color:${COLOR_MUTED};">
      Reply-to adresa je nastavena na e-mail kontaktu: <strong style="color:${COLOR_GOLD_DK};">${safeEmail}</strong>
    </p>
  `;

  return {
    subject,
    html: wrapEmail(preheader, body, 'Milionová Investice – Notifikace'),
  };
}
