// ============================================================
// Email template: Contact form confirmation (sent to user)
// Resend API — HTML email, inline CSS, Czech-only, Milionová Investice
// ============================================================

import { escapeHtml } from '../utils';
import {
  COLOR_BORDER,
  COLOR_GOLD,
  COLOR_MUTED,
  COLOR_TEXT,
  FONT_BODY,
  FONT_DISPLAY,
  SITE_URL,
  wrapEmail,
} from './shared';

// ----------------------------------------------------------
// Main export
// ----------------------------------------------------------

export function contactConfirmationEmail(data: {
  name: string;
}): { subject: string; html: string } {
  const safe = escapeHtml(data.name);

  const subject   = 'Děkujeme za Váš zájem o Milionovou Investici';
  const preheader = 'Ozveme se Vám do 1 pracovního dne.';

  const footerExtra = `
              <p style="margin:0;font-family:${FONT_BODY};font-size:12px;line-height:1.6;color:${COLOR_MUTED};">
                Informace o zpracování osobních údajů naleznete v našich
                <a href="${SITE_URL}/zasady-ochrany-osobnich-udaju" style="color:#B8860B;text-decoration:underline;">Zásadách ochrany osobních údajů</a>.
              </p>`;

  const body = `
    <!-- Greeting -->
    <h1 style="margin:0 0 20px 0;font-family:${FONT_DISPLAY};font-size:28px;font-weight:700;color:${COLOR_TEXT};line-height:1.3;">
      Ahoj, ${safe}!
    </h1>

    <!-- Intro paragraph -->
    <p style="margin:0 0 12px 0;font-family:${FONT_BODY};font-size:16px;line-height:1.75;color:${COLOR_TEXT};">
      Toto je automatická odpověď z webu Milionová Investice — potvrzujeme, že Vaše zpráva dorazila v pořádku.
    </p>

    <!-- Promise paragraph -->
    <p style="margin:0 0 12px 0;font-family:${FONT_BODY};font-size:16px;line-height:1.75;color:${COLOR_TEXT};font-weight:600;">
      Ozveme se Vám do 1 pracovního dne s více informacemi.
    </p>

    <!-- No-reply notice -->
    <p style="margin:0 0 16px 0;font-family:${FONT_BODY};font-size:13px;line-height:1.6;color:${COLOR_MUTED};font-style:italic;">
      Na tento e-mail prosím neodpovídejte, je automatický.
    </p>

    <!-- Priority contact -->
    <p style="margin:0 0 32px 0;font-family:${FONT_BODY};font-size:14px;line-height:1.7;color:${COLOR_TEXT};">
      Potřebuješ se nám ozvat dřív? Napiš nám prioritně na <a href="mailto:info@milionovainvestice.cz" style="color:${COLOR_GOLD};text-decoration:none;font-weight:600;">info@milionovainvestice.cz</a> a ozveme se rychleji.
    </p>

    <!-- Divider -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px 0;">
      <tr>
        <td style="height:1px;background-color:${COLOR_BORDER};font-size:0;line-height:0;">&nbsp;</td>
      </tr>
    </table>

    <!-- Signature -->
    <p style="margin:0 0 6px 0;font-family:${FONT_BODY};font-size:15px;line-height:1.6;color:${COLOR_TEXT};">
      S pozdravem,
    </p>
    <p style="margin:0 0 28px 0;font-family:${FONT_DISPLAY};font-size:18px;font-weight:700;color:${COLOR_GOLD};">
      Tým Milionová Investice
    </p>

    <!-- Mandatory risk disclaimer -->
    <p style="margin:0 0 20px 0;font-family:${FONT_BODY};font-size:12px;line-height:1.6;color:${COLOR_MUTED};">
      <strong>Upozornění:</strong> Investice nabízené společností MOVITO group, s.r.o. jsou určeny kvalifikovaným investorům dle § 272 zákona 240/2013 Sb. (ZISIF). Minimální investice je 100 000 Kč. Cílový výnos není zaručen. Minulé výsledky nejsou zárukou výsledků budoucích. Investice nabízené společností MOVITO group, s.r.o. nejsou kryty systémem pojištění vkladů. Toto sdělení je marketingové a nepředstavuje investiční doporučení.
    </p>

    <!-- Footer note -->
    <p style="margin:0;font-family:${FONT_BODY};font-size:11px;line-height:1.6;color:${COLOR_MUTED};">
      Tento e-mail Vám přišel, protože jste vyplnili formulář na milionovainvestice.cz. Je to automatická zpráva — ozveme se osobně.
    </p>
  `;

  return {
    subject,
    html: wrapEmail(preheader, body, 'Milionová Investice', footerExtra),
  };
}
