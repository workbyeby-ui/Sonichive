require('dotenv').config();
const express  = require('express');
const path     = require('path');
const fs       = require('fs');
const nodemailer = require('nodemailer');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── Mailer ─────────────────────────────────────────────────── */
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function buildEmail(data) {
  const { name, company, email, phone, interest, country, source } = data;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{margin:0;padding:0;background:#F2F3F5;font-family:'Segoe UI',Arial,sans-serif;color:#0A0A0F}
  .wrap{max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
  .header{background:#0A0A0F;padding:28px 32px;text-align:center}
  .header-logo{display:inline-flex;align-items:center;gap:10px}
  .logo-text{font-size:1.25rem;font-weight:600;color:#fff;letter-spacing:-.02em}
  .logo-text em{color:#D42020;font-style:normal}
  .badge{display:inline-block;background:rgba(212,32,32,.15);border:1px solid rgba(212,32,32,.35);color:#FF6B6B;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;border-radius:100px;padding:.3rem .9rem;margin-top:.9rem}
  .body{padding:32px}
  .title{font-size:1.15rem;font-weight:700;margin-bottom:4px}
  .subtitle{font-size:.85rem;color:#6B7280;margin-bottom:24px}
  .field{margin-bottom:16px}
  .field-label{font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#9CA3AF;margin-bottom:4px}
  .field-value{font-size:.95rem;color:#0A0A0F;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:10px 14px}
  .field-value a{color:#D42020;text-decoration:none}
  .row{display:flex;gap:12px}
  .row .field{flex:1}
  .divider{height:1px;background:#F3F4F6;margin:24px 0}
  .footer{background:#F9FAFB;border-top:1px solid #F3F4F6;padding:20px 32px;text-align:center;font-size:.78rem;color:#9CA3AF;line-height:1.6}
  .cta{display:inline-block;margin-top:16px;background:#D42020;color:#fff;text-decoration:none;border-radius:100px;padding:10px 24px;font-size:.85rem;font-weight:600}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="header-logo">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <polygon points="16,1 30,9 30,23 16,31 2,23 2,9" fill="#D42020"/>
        <polygon points="16,8 24,12.5 24,21.5 16,26 8,21.5 8,12.5" fill="#0A0A0A"/>
        <polygon points="16,12 20,14.3 20,18.7 16,21 12,18.7 12,14.3" fill="#D42020" opacity=".55"/>
      </svg>
      <span class="logo-text">Sonic<em>Hive</em></span>
    </div>
    <div class="badge">🔔 New Lead</div>
  </div>

  <div class="body">
    <div class="title">New Quote Request</div>
    <div class="subtitle">Submitted via thesonichive.com · ${new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai', dateStyle: 'full', timeStyle: 'short' })}</div>

    <div class="row">
      <div class="field">
        <div class="field-label">Full Name</div>
        <div class="field-value">${esc(name) || '—'}</div>
      </div>
      <div class="field">
        <div class="field-label">Company</div>
        <div class="field-value">${esc(company) || '—'}</div>
      </div>
    </div>

    <div class="row">
      <div class="field">
        <div class="field-label">Email</div>
        <div class="field-value"><a href="mailto:${esc(email)}">${esc(email) || '—'}</a></div>
      </div>
      <div class="field">
        <div class="field-label">WhatsApp / Phone</div>
        <div class="field-value"><a href="tel:${esc(phone)}">${esc(phone) || '—'}</a></div>
      </div>
    </div>

    <div class="row">
      <div class="field">
        <div class="field-label">Interested In</div>
        <div class="field-value">${esc(interest) || '—'}</div>
      </div>
      <div class="field">
        <div class="field-label">Country</div>
        <div class="field-value">${esc(country) || '—'}</div>
      </div>
    </div>

    ${source ? `<div class="field" style="margin-top:16px">
      <div class="field-label">Source</div>
      <div class="field-value">${esc(source)}</div>
    </div>` : ''}

    <div class="divider"></div>

    <div style="text-align:center">
      <a href="mailto:${esc(email)}?subject=Re: Your SonicHive Quote Request" class="cta">Reply to ${esc(name ? name.split(' ')[0] : 'Lead')} →</a>
    </div>
  </div>

  <div class="footer">
    SonicHive · Office No. 3-13, Owned by Sheikha Reesa Khalifa Bin Saeed Al Maktoum - Al Wasl, Dubai, UAE<br>
    <a href="mailto:info@thesonichive.com" style="color:#D42020;text-decoration:none">info@thesonichive.com</a> · +971 58 555 0099
  </div>
</div>
</body>
</html>`;

  const text = [
    `New Quote Request — SonicHive`,
    ``,
    `Name:     ${name || '—'}`,
    `Company:  ${company || '—'}`,
    `Email:    ${email || '—'}`,
    `Phone:    ${phone || '—'}`,
    `Interest: ${interest || '—'}`,
    `Country:  ${country || '—'}`,
    `Source:   ${source || '—'}`,
    ``,
    `Submitted: ${new Date().toISOString()}`,
  ].join('\n');

  return { html, text };
}

/* ── View engine ────────────────────────────────────────────── */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ── Middleware ─────────────────────────────────────────────── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── Quote endpoint ─────────────────────────────────────────── */
const LEAD_TO    = process.env.LEAD_TO || 'info@thesonichive.com';
const LEADS_FILE = path.join(__dirname, 'leads.jsonl');

app.post('/api/quote', async (req, res) => {
  const data = req.body || {};
  console.log('[quote]', new Date().toISOString(), data);

  // 1) Persist every lead to disk FIRST — a paid lead must never be lost,
  //    even if the mail server is unreachable.
  try {
    fs.appendFileSync(
      LEADS_FILE,
      JSON.stringify({ ...data, receivedAt: new Date().toISOString(), ip: req.ip }) + '\n'
    );
  } catch (e) {
    console.error('[quote] Could not write leads.jsonl:', e.message);
  }

  // 2) Confirm to the visitor immediately — the lead is already saved above,
  //    so we don't make them wait on the mail server.
  res.status(200).json({ success: true, message: 'Quote request received successfully!' });

  // 3) Email the lead to info@thesonichive.com in the background
  (async () => {
    try {
      const { html, text } = buildEmail(data);
      await transporter.sendMail({
        from:    `"SonicHive Leads" <${process.env.SMTP_USER}>`,
        to:      LEAD_TO,
        replyTo: data.email || undefined,
        subject: `New Quote Request — ${data.name || 'Unknown'} (${data.country || data.interest || 'thesonichive.com'})`,
        text,
        html,
      });
      console.log(`[quote] Email sent ✓ → ${LEAD_TO}`);
    } catch (err) {
      console.error('[quote] ⚠ EMAIL FAILED — lead is safe in leads.jsonl. Reason:', err.message);
    }
  })();
});

/* ── Static assets + pre-built pages ───────────────────────── */
// Serve the pre-built public/ folder first (absolute paths, safe on any URL depth)
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));
// Note: the Google Ads landing page lives at public/landing-pages/index.html and
// is served at /landing-pages/ by the static handler above (same as every other page).

/* ── Fallback page routes — only if no static file matched ── */
app.get('/:page', (req, res, next) => {
  const page = req.params.page.replace(/\.html$/, '');
  // Try pre-built HTML (absolute paths, no breakage on trailing slash)
  const staticDir  = path.join(__dirname, 'public', page, 'index.html');
  const staticFile = path.join(__dirname, 'public', page + '.html');
  if (fs.existsSync(staticDir))  return res.sendFile(staticDir);
  if (fs.existsSync(staticFile)) return res.sendFile(staticFile);
  // EJS fallback for any page not yet built
  const view = path.join(__dirname, 'views', 'pages', page + '.ejs');
  if (!fs.existsSync(view)) return next();
  res.render('pages/' + page, { page });
});

/* ── Start ──────────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
  // Surface mail misconfiguration immediately instead of silently losing leads.
  transporter.verify()
    .then(() => console.log(`[mail] SMTP ready ✓ — leads will be delivered to ${LEAD_TO}`))
    .catch(err => console.error(`[mail] ⚠ SMTP NOT working — set SMTP_PASS in .env. Reason: ${err.message}`));
});
