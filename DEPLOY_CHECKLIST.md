# Deploy Checklist — Movito contact function

Complete ALL items before the first production deploy.

## Resend setup
- [ ] Create Resend account at https://resend.com
- [ ] Verify sending domain (`movito.cz`) — add SPF, DKIM, DMARC DNS records per Resend dashboard
- [ ] Configure a daily sending cap and billing alert in Resend dashboard
- [ ] Generate an API key with "sending only" scope
- [ ] Sign the Resend DPA (available in Resend dashboard)
- [ ] Record API key in a secret vault (not in any committed file)

## Netlify setup
- [ ] Connect GitHub repo (`HypeDigitaly/Movito`) to Netlify via dashboard
- [ ] Confirm publish dir is `.` and build command is blank (auto-detected from `netlify.toml`)
- [ ] Set 4 environment variables in Site Settings → Environment Variables:
      - `RESEND_API_KEY`
      - `CONTACT_SENDER_EMAIL` (bare address, e.g. `noreply@movito.cz`)
      - `CONTACT_NOTIFICATION_EMAIL` (e.g. `info@movito.cz`)
      - `SITE_URL` (e.g. `https://movito.cz`)
- [ ] Run `netlify link` locally to enable `netlify env:pull`

## Pre-merge verification
- [ ] `npm install` succeeds at repo root
- [ ] `npm run typecheck` passes with 0 errors
- [ ] `netlify dev` starts; POST to `http://localhost:8888/.netlify/functions/contact` with valid body returns 200
- [ ] Missing field → 422
- [ ] Wrong method → 405
- [ ] Empty body → 400
- [ ] Honeypot filled → 200 with identical bytes

## Post-deploy smoke test
- [ ] On preview deploy, submit a real form entry with your own email
- [ ] Confirm both emails arrive (confirmation in submitter inbox, notification in `info@movito.cz`)
- [ ] Verify NO PII, NO API key, NO stack traces appear in Netlify function logs
- [ ] Inspect response headers in browser devtools: CSP, HSTS, X-Frame-Options present

## Privacy / GDPR
- [ ] Update privacy policy to mention Resend as sub-processor
- [ ] Sign Resend DPA

## Important — do NOT do these things
- Do NOT add `<meta name="referrer" content="no-referrer">` to `index.html` — would break the function's Origin/Referer check on strict-privacy browsers
- Do NOT commit `.env` (only `.env.example` is committed)
- Do NOT include `"type": "module"` in `package.json`
- Do NOT add `lib: ["DOM"]` to `tsconfig.json` — would shadow Node's Request/Response globals
