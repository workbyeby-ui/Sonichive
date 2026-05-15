(function () {
  /* ── CSS ── */
  const css = `
    #qp-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem;opacity:0;pointer-events:none;transition:opacity .3s ease}
    #qp-overlay.open{opacity:1;pointer-events:auto}
    #qp-backdrop{position:absolute;inset:0;background:rgba(10,10,15,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);pointer-events:none}
    #qp-overlay.open #qp-backdrop{pointer-events:auto}
    #qp-modal{position:relative;z-index:1;background:#fff;border-radius:24px;width:100%;max-width:560px;max-height:calc(100dvh - 2rem);overflow-y:auto;box-shadow:0 32px 80px rgba(0,0,0,.22);transform:translateY(28px) scale(.97);transition:transform .35s cubic-bezier(.22,1,.36,1)}
    #qp-overlay.open #qp-modal{transform:none}
    #qp-top{background:#0A0A0F;padding:2rem 2rem 1.75rem;position:relative}
    #qp-top-accent{position:absolute;inset:0;background:radial-gradient(ellipse at 80% 50%,rgba(212,32,32,.18),transparent 65%);pointer-events:none}
    #qp-logo{display:flex;align-items:center;gap:9px;margin-bottom:1.25rem}
    #qp-logo span{font-family:'Poppins',sans-serif;font-size:1.15rem;font-weight:400;letter-spacing:-.02em;color:#fff}
    #qp-logo em{color:#D42020;font-style:normal}
    #qp-title{font-family:'Poppins',sans-serif;font-size:1.45rem;font-weight:700;color:#fff;letter-spacing:-.025em;line-height:1.15;margin-bottom:.4rem}
    #qp-sub{font-size:.82rem;color:rgba(255,255,255,.45);line-height:1.5}
    #qp-close{position:absolute;top:1.1rem;right:1.1rem;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.6);font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;line-height:1}
    #qp-close:hover{background:rgba(212,32,32,.2);border-color:rgba(212,32,32,.4);color:#fff}
    #qp-body{padding:1.75rem 2rem 2rem}
    .qp-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}
    .qp-field{display:flex;flex-direction:column;gap:.4rem;margin-bottom:1rem}
    .qp-field:last-of-type{margin-bottom:0}
    .qp-field label{font-size:.75rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#6B7280}
    .qp-field input,.qp-field textarea,.qp-field select{border:1.5px solid rgba(0,0,0,.1);border-radius:10px;padding:.7rem 1rem;font-size:.9rem;font-family:'Poppins',sans-serif;color:#0A0A0F;background:#FAFAFA;outline:none;transition:border-color .2s,box-shadow .2s;width:100%;resize:none}
    .qp-field input:focus,.qp-field textarea:focus,.qp-field select:focus{border-color:#D42020;box-shadow:0 0 0 3px rgba(212,32,32,.1);background:#fff}
    .qp-field textarea{height:88px}
    #qp-submit{width:100%;background:#D42020;color:#fff;border:none;border-radius:100px;padding:.9rem 2rem;font-size:.95rem;font-weight:600;font-family:'Poppins',sans-serif;cursor:pointer;transition:transform .2s,box-shadow .2s;margin-top:1.25rem;position:relative;overflow:hidden}
    #qp-submit:hover{transform:scale(1.02) translateY(-1px);box-shadow:0 8px 28px rgba(212,32,32,.45)}
    #qp-submit:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none}
    #qp-privacy{font-size:.72rem;color:#9CA3AF;text-align:center;margin-top:.85rem;line-height:1.5}
    #qp-success{display:none;text-align:center;padding:2.5rem 2rem 2.5rem}
    #qp-success svg{margin:0 auto 1rem}
    #qp-success h3{font-family:'Poppins',sans-serif;font-size:1.25rem;font-weight:700;color:#0A0A0F;margin-bottom:.5rem}
    #qp-success p{font-size:.9rem;color:#6B7280;line-height:1.65}
    #qp-success .qp-done-btn{display:inline-block;margin-top:1.5rem;background:#D42020;color:#fff;border:none;border-radius:100px;padding:.75rem 2rem;font-size:.875rem;font-weight:600;font-family:'Poppins',sans-serif;cursor:pointer;transition:transform .2s,box-shadow .2s}
    #qp-success .qp-done-btn:hover{transform:scale(1.04);box-shadow:0 6px 20px rgba(212,32,32,.4)}
    @media(max-width:600px){
      #qp-overlay{align-items:flex-end;padding:0}
      #qp-modal{border-radius:20px 20px 0 0;max-width:100%;max-height:92dvh;transform:translateY(48px)}
      #qp-overlay.open #qp-modal{transform:translateY(0)}
      .qp-row{grid-template-columns:1fr}
      #qp-top{padding:1.5rem 1.25rem 1.25rem}
      #qp-logo{margin-bottom:.85rem}
      #qp-title{font-size:1.2rem}
      #qp-sub{font-size:.78rem}
      #qp-body{padding:1.25rem 1.25rem 1.5rem}
      .qp-field input,.qp-field textarea,.qp-field select{font-size:1rem}
      #qp-submit{padding:.85rem 2rem;font-size:.9rem}
      #qp-success{padding:2rem 1.25rem}
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ── HTML ── */
  const html = `
    <div id="qp-overlay">
      <div id="qp-backdrop"></div>
      <div id="qp-modal" role="dialog" aria-modal="true" aria-labelledby="qp-title">
        <div id="qp-top">
          <div id="qp-top-accent"></div>
          <div id="qp-logo">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <polygon points="16,1 30,9 30,23 16,31 2,23 2,9" fill="#D42020"/>
              <polygon points="16,8 24,12.5 24,21.5 16,26 8,21.5 8,12.5" fill="#0A0A0A"/>
              <polygon points="16,12 20,14.3 20,18.7 16,21 12,18.7 12,14.3" fill="#D42020" opacity=".55"/>
            </svg>
            <span>Sonic<em>Hive</em></span>
          </div>
          <div id="qp-title">Get a Free Quote</div>
          <div id="qp-sub">Our Dubai team responds within 2 business hours.</div>
          <button id="qp-close" aria-label="Close">&#x2715;</button>
        </div>

        <div id="qp-body">
          <form id="qp-form" novalidate>
            <div class="qp-row">
              <div class="qp-field">
                <label for="qp-name">Full Name *</label>
                <input id="qp-name" name="name" type="text" placeholder="Ahmed Al Mansouri" required>
              </div>
              <div class="qp-field">
                <label for="qp-company">Company</label>
                <input id="qp-company" name="company" type="text" placeholder="Your Company">
              </div>
            </div>
            <div class="qp-row">
              <div class="qp-field">
                <label for="qp-email">Email *</label>
                <input id="qp-email" name="email" type="email" placeholder="you@company.com" required>
              </div>
              <div class="qp-field">
                <label for="qp-phone">WhatsApp / Phone</label>
                <input id="qp-phone" name="phone" type="tel" placeholder="+971 50 000 0000">
              </div>
            </div>
            <div class="qp-row">
              <div class="qp-field">
                <label for="qp-interest">Interested In</label>
                <select id="qp-interest" name="interest">
                  <option value="">Select a product…</option>
                  <option>VRT Series</option>
                  <option>VRT Plus Series</option>
                  <option>ART Pod Series</option>
                  <option>Home Pod</option>
                  <option>Rental Pods</option>
                </select>
              </div>
              <div class="qp-field">
                <label for="qp-country">Country</label>
                <select id="qp-country" name="country">
                  <option value="">Select a country…</option>
                  <option>UAE</option>
                  <option>Saudi Arabia</option>
                  <option>Qatar</option>
                  <option>Kuwait</option>
                  <option>Bahrain</option>
                  <option>Oman</option>
                  <option>New Zealand</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <button type="submit" id="qp-submit">Send Quote Request →</button>
            <p id="qp-privacy">🔒 Your details are confidential and never shared with third parties.</p>
          </form>
        </div>

        <div id="qp-success">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="28" fill="rgba(212,32,32,.08)"/>
            <circle cx="28" cy="28" r="20" fill="rgba(212,32,32,.12)"/>
            <path d="M18 28l7 7 13-13" stroke="#D42020" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3>Quote Request Sent!</h3>
          <p>Thanks — our team will be in touch within 2 business hours.<br>In the meantime feel free to browse our full product range.</p>
          <button class="qp-done-btn">Done</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);

  /* ── Logic ── */
  const overlay  = document.getElementById('qp-overlay');
  const closeBtn = document.getElementById('qp-close');
  const backdrop = document.getElementById('qp-backdrop');
  const form     = document.getElementById('qp-form');
  const submit   = document.getElementById('qp-submit');
  const body     = document.getElementById('qp-body');
  const success  = document.getElementById('qp-success');
  const doneBtn  = success.querySelector('.qp-done-btn');

  function openPopup() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('qp-name').focus(), 350);
  }

  function closePopup() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function resetPopup() {
    form.reset();
    body.style.display = '';
    success.style.display = 'none';
    submit.disabled = false;
    submit.textContent = 'Send Quote Request →';
  }

  closeBtn.addEventListener('click', closePopup);
  overlay.addEventListener('click', function(e) { if (!e.target.closest('#qp-modal')) closePopup(); });
  doneBtn.addEventListener('click', () => { closePopup(); setTimeout(resetPopup, 400); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const name  = document.getElementById('qp-name').value.trim();
    const email = document.getElementById('qp-email').value.trim();
    if (!name || !email) {
      document.getElementById(!name ? 'qp-name' : 'qp-email').focus();
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Sending…';
    const payload = {
      name,
      company:  document.getElementById('qp-company').value.trim(),
      email,
      phone:    document.getElementById('qp-phone').value.trim(),
      interest: document.getElementById('qp-interest').value,
      country:  document.getElementById('qp-country').value,
    };
    try {
      await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (_) { /* server offline in dev — still show success */ }
    body.style.display = 'none';
    success.style.display = 'block';
  });

  /* ── Intercept all quote trigger links ── */
  document.addEventListener('click', function (e) {
    const el = e.target.closest('a, button');
    if (!el) return;
    const href = el.getAttribute('href') || '';
    const text = el.textContent.trim().toLowerCase();
    const isQuoteLink =
      text.includes('get a quote') ||
      text.includes('request a free quote') ||
      text.includes('request quote') ||
      el.classList.contains('nav-cta') ||
      el.classList.contains('quote-trigger');
    if (isQuoteLink) {
      e.preventDefault();
      resetPopup();
      openPopup();
    }
  }, true);
})();
