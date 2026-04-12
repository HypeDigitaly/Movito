// ============================================================
// Shared email template constants and layout helpers
// Used by contact-confirmation.ts and contact-notification.ts
// ============================================================

// ----------------------------------------------------------
// Brand tokens — Milionová Investice light palette
// ----------------------------------------------------------

export const COLOR_BG      = '#FAFAF7';
export const COLOR_BG_CARD = '#FFFFFF';
export const COLOR_CREAM   = '#FAF5E8';
export const COLOR_GOLD    = '#96730F';
export const COLOR_TEXT    = '#1C1B17';
export const COLOR_MUTED   = '#6B6A62';
export const COLOR_BORDER  = '#ECEAE3';
export const FONT_DISPLAY  = "'Playfair Display', Georgia, 'Times New Roman', serif";
export const FONT_BODY     = "'DM Sans', Arial, sans-serif";
export const SITE_URL      = 'https://milionovainvestice.cz';

// ----------------------------------------------------------
// Layout helpers
// ----------------------------------------------------------

/**
 * Wraps an email body with the standard Milionová Investice HTML shell.
 *
 * @param preheader - Hidden preview text shown in inbox clients.
 * @param body      - Inner HTML content placed inside the card cell.
 * @param title     - Value for the <title> element (defaults to "Milionová Investice").
 * @param footerExtra - Optional extra paragraph(s) appended inside the footer cell.
 */
export function wrapEmail(
  preheader: string,
  body: string,
  title = 'Milionová Investice',
  footerExtra = '',
): string {
  return `<!DOCTYPE html>
<html lang="cs" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${title}</title>
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
              <p style="margin:0${footerExtra ? ' 0 8px 0' : ''};font-family:${FONT_BODY};font-size:12px;line-height:1.6;color:${COLOR_MUTED};">
                &copy; ${new Date().getFullYear()} MOVITO group, s.r.o. &middot; <a href="${SITE_URL}" style="color:${COLOR_MUTED};text-decoration:none;">milionovainvestice.cz</a>
              </p>${footerExtra}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
