// ============================================================
// Email template: Contact form confirmation (sent to user)
// Resend API — HTML email, inline CSS, Czech-only, Milionová Investice
// ============================================================

import { escapeHtml } from '../utils';

// ----------------------------------------------------------
// Brand tokens — Milionová Investice light palette
// ----------------------------------------------------------

const COLOR_BG      = '#FAFAF7';
const COLOR_BG_CARD = '#FFFFFF';
const COLOR_CREAM   = '#FAF5E8';
const COLOR_GOLD    = '#96730F';
const COLOR_TEXT    = '#1C1B17';
const COLOR_MUTED   = '#6B6A62';
const COLOR_BORDER  = '#ECEAE3';
const FONT_DISPLAY  = "'Playfair Display', Georgia, 'Times New Roman', serif";
const FONT_BODY     = "'DM Sans', Arial, sans-serif";
const SITE_URL      = 'https://milionovainvestice.cz';

// ----------------------------------------------------------
// Layout helpers
// ----------------------------------------------------------

function wrapEmail(preheader: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="cs" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Milionová Investice</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${COLOR_BG};font-family:${FONT_BODY};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLOR_BG};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <!-- Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

          <!-- Header band — cream background, Playfair Display wordmark -->
          <tr>
            <td align="center" style="background-color:${COLOR_CREAM};border-radius:16px 16px 0 0;padding:28px 40px;">
              <a href="${SITE_URL}" style="text-decoration:none;">
                <span style="font-family:${FONT_DISPLAY};font-size:22px;font-weight:700;color:${COLOR_GOLD};letter-spacing:0.04em;">MILIONOVÁ INVESTICE</span>
              </a>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:${COLOR_BG_CARD};border-radius:0 0 16px 16px;padding:40px 40px 36px 40px;border:1px solid ${COLOR_BORDER};border-top:none;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 0 0 0;text-align:center;">
              <p style="margin:0;font-family:${FONT_BODY};font-size:12px;line-height:1.6;color:${COLOR_MUTED};">
                &copy; ${new Date().getFullYear()} Milionová Investice &middot; <a href="${SITE_URL}" style="color:${COLOR_MUTED};text-decoration:none;">milionovainvestice.cz</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ----------------------------------------------------------
// Main export
// ----------------------------------------------------------

export function contactConfirmationEmail(data: {
  name: string;
}): { subject: string; html: string } {
  const safe = escapeHtml(data.name);

  const subject   = `Tvoje zpráva dorazila, ${data.name}`;
  const preheader = 'Ozveme se Vám do 1 pracovního dne.';

  const body = `
    <!-- Greeting -->
    <h1 style="margin:0 0 20px 0;font-family:${FONT_DISPLAY};font-size:28px;font-weight:700;color:${COLOR_TEXT};line-height:1.3;">
      Ahoj, ${safe}!
    </h1>

    <!-- Intro paragraph -->
    <p style="margin:0 0 12px 0;font-family:${FONT_BODY};font-size:16px;line-height:1.75;color:${COLOR_TEXT};">
      Tohle je automatická odpověď z webu Milionová Investice — jen abychom potvrdili, že tvoje zpráva dorazila v pořádku.
    </p>

    <!-- Promise paragraph -->
    <p style="margin:0 0 12px 0;font-family:${FONT_BODY};font-size:16px;line-height:1.75;color:${COLOR_TEXT};font-weight:600;">
      Ozveme se Vám do 1 pracovního dne s více informacemi.
    </p>

    <!-- No-reply notice -->
    <p style="margin:0 0 16px 0;font-family:${FONT_BODY};font-size:13px;line-height:1.6;color:${COLOR_MUTED};font-style:italic;">
      Na tento e-mail prosím neodpovídej, je automatický.
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

    <!-- Footer note -->
    <p style="margin:0;font-family:${FONT_BODY};font-size:11px;line-height:1.6;color:${COLOR_MUTED};">
      Tento e-mail ti přišel, protože jsi vyplnil(a) formulář na milionovainvestice.cz. Je to automatická zpráva — ozveme se osobně.
    </p>
  `;

  return {
    subject,
    html: wrapEmail(preheader, body),
  };
}
