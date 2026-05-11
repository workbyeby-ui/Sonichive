(function () {
  const KEY = 'sh-lang';
  const stored = localStorage.getItem(KEY) || 'en';

  /* ── Arabic translations ── */
  const T = {
    /* Nav */
    'Products': 'المنتجات',
    'Features': 'المميزات',
    'Use Cases': 'حالات الاستخدام',
    'About': 'من نحن',
    'Contact': 'اتصل بنا',
    'Get a Quote →': 'احصل على عرض →',
    'Get a Quote': 'احصل على عرض',
    /* Mega menu */
    'Product Series': 'سلاسل المنتجات',
    'All Products': 'جميع المنتجات',
    'Rental Pods': 'كبائن الإيجار',
    'Explore Series →': 'استكشف السلسلة →',
    'Plug-and-play soundproofing for any team size. Installed in under 2 hours.': 'عزل صوتي جاهز للتركيب لأي حجم فريق. مُركَّب في أقل من ساعتين.',
    'Enhanced HVAC, premium finishes and superior acoustic performance.': 'تكييف هواء محسّن، تشطيبات فاخرة وأداء صوتي متفوق.',
    'Architecturally striking pods with bespoke cladding and custom branding.': 'كبائن معمارية مميزة بتكسية مخصصة وهوية بصرية فريدة.',
    'Purpose-built for home offices, streaming studios and music practice.': 'مصممة خصيصاً للمكاتب المنزلية واستوديوهات البث وتدريب الموسيقى.',
    /* Products */
    'VRT': 'VRT',
    'VRT Plus': 'VRT Plus',
    'ART Pod': 'ART Pod',
    'Home Pod': 'Home Pod',
    /* Capacity cards */
    'Need a Different Capacity?': 'تحتاج إلى سعة مختلفة؟',
    'Person': 'شخص',
    'Persons': 'أشخاص',
    'Noise Reduction': 'تقليل الضوضاء',
    /* Common CTAs */
    'Request a Free Quote': 'طلب عرض سعر مجاني',
    'Chat on WhatsApp': 'تحدث عبر واتساب',
    'Get Started Today': 'ابدأ اليوم',
    'Transform Your Workspace.': 'حوّل مساحة عملك.',
    'Visit our Downtown Dubai showroom, get a free consultation, or request a quote online. Our team responds within 2 business hours.': 'زر صالة العرض في وسط مدينة دبي، احصل على استشارة مجانية، أو اطلب عرض سعر عبر الإنترنت. يستجيب فريقنا خلال ساعتين عمل.',
    /* Index hero */
    'Acoustic Pods for': 'كبائن صوتية لـ',
    'Modern Workspaces': 'بيئات العمل الحديثة',
    'Office Pods': 'كبائن المكتب',
    'Silence Booths': 'كشك الصمت',
    'Meeting Pods': 'كبائن الاجتماعات',
    'Home Studios': 'استوديوهات منزلية',
    /* Stats */
    'Pod Installations': 'تركيب كابينة',
    'Countries': 'دول',
    'Sound Reduction': 'تقليل الصوت',
    'Corporate Clients': 'عميل مؤسسي',
    'Avg. Installation': 'متوسط التركيب',
    'Customer Rating': 'تقييم العملاء',
    /* Sections */
    'Reviews': 'التقييمات',
    'Trusted Across the Region': 'موثوق به في جميع أنحاء المنطقة',
    'Real stories from real spaces. See why teams and individuals choose SonicHive for focus, privacy, and performance.': 'قصص حقيقية من مساحات حقيقية. اكتشف لماذا يختار الأفراد والفرق SonicHive للتركيز والخصوصية والأداء.',
    'Our Process': 'عمليتنا',
    'Why SonicHive': 'لماذا SonicHive',
    'Use Cases': 'حالات الاستخدام',
    /* Footer */
    'Explore': 'استكشف',
    'Contact Us': 'اتصل بنا',
    'All rights reserved.': 'جميع الحقوق محفوظة.',
    "Dubai's leading acoustic pod provider — delivering silence, privacy, and productivity to workspaces across the Middle East.": 'المزود الرائد للكبائن الصوتية في دبي — نوفر الهدوء والخصوصية والإنتاجية للمساحات المكتبية في جميع أنحاء الشرق الأوسط.',
    /* Contact form */
    'Get a Quote — SonicHive Dubai': 'احصل على عرض سعر — SonicHive دبي',
    'Send Quote Request →': 'إرسال طلب العرض →',
    'First Name': 'الاسم الأول',
    'Last Name': 'الاسم الأخير',
    'Work Email': 'البريد الإلكتروني',
    'Phone': 'الهاتف',
    'Company': 'الشركة',
    'Country': 'الدولة',
    /* Product pages */
    'Other ART Pod Sizes': 'أحجام ART Pod الأخرى',
    'Other VRT Sizes': 'أحجام VRT الأخرى',
    'Other VRT Plus Sizes': 'أحجام VRT Plus الأخرى',
    'Explore the full ART Pod designer range — each size shares the same architectural DNA.': 'استكشف المجموعة الكاملة من ART Pod — كل حجم يشترك في نفس الهوية المعمارية.',
    'Explore the full VRT range — each size shares the same acoustic DNA.': 'استكشف المجموعة الكاملة من VRT — كل حجم يشترك في نفس الأداء الصوتي.',
    'Explore the full VRT Plus range — each size shares the same acoustic DNA.': 'استكشف المجموعة الكاملة من VRT Plus — كل حجم يشترك في نفس الأداء الصوتي.',
  };

  /* ── Inject CSS (button style + RTL overrides) ── */
  const style = document.createElement('style');
  style.textContent = `
    .lang-btn{display:inline-flex;align-items:center;gap:.35rem;background:transparent;border:1.5px solid rgba(0,0,0,.2);border-radius:100px;padding:.42rem .95rem;font-size:.82rem;font-weight:500;cursor:pointer;color:#0A0A0F;transition:background .2s,border-color .2s,color .2s;font-family:inherit;white-space:nowrap;flex-shrink:0;letter-spacing:.01em}
    .lang-btn:hover{background:#D42020;border-color:#D42020;color:#fff}
    #nav.nav-dark:not(.s) .lang-btn{border-color:rgba(255,255,255,.55);color:#fff;background:rgba(255,255,255,.1)}
    #nav.nav-dark:not(.s) .lang-btn:hover{background:#D42020;border-color:#D42020;color:#fff}
    [dir="rtl"] .lang-btn{font-family:'Cairo',sans-serif}
    [dir="rtl"] body,[dir="rtl"] *{font-family:'Cairo',sans-serif !important}
    [dir="rtl"] .nav-links{flex-direction:row-reverse}
    [dir="rtl"] .nav-i{flex-direction:row-reverse}
    [dir="rtl"] .foot-g{direction:rtl}
    [dir="rtl"] .rel-arr svg{transform:scaleX(-1)}
    [dir="rtl"] .mega-wrap{left:auto;right:50%;transform:translateX(50%) translateY(-12px)}
    [dir="rtl"] .nav-dd.open .mega-wrap{transform:translateX(50%) translateY(0)}
  `;
  document.head.appendChild(style);

  /* ── Walk DOM and replace text nodes ── */
  function translateNode(node) {
    if (node.nodeType === 3) {
      let t = node.textContent;
      let changed = false;
      for (const [en, ar] of Object.entries(T)) {
        if (t.includes(en)) {
          t = t.split(en).join(ar);
          changed = true;
        }
      }
      if (changed) node.textContent = t;
    } else if (
      node.nodeType === 1 &&
      node.tagName !== 'SCRIPT' &&
      node.tagName !== 'STYLE' &&
      node.tagName !== 'SVG' &&
      node.tagName !== 'NOSCRIPT'
    ) {
      if (node.placeholder) {
        for (const [en, ar] of Object.entries(T)) {
          if (node.placeholder.includes(en)) {
            node.placeholder = node.placeholder.split(en).join(ar);
          }
        }
      }
      node.childNodes.forEach(translateNode);
    }
  }

  /* ── Load Arabic font ── */
  function loadFont() {
    if (document.getElementById('sh-cairo-font')) return;
    const link = document.createElement('link');
    link.id = 'sh-cairo-font';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link);
  }

  /* ── Apply Arabic ── */
  function applyArabic() {
    loadFont();
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
    translateNode(document.body);
  }

  /* ── Init on DOMContentLoaded ── */
  document.addEventListener('DOMContentLoaded', () => {
    /* Detect if nav starts on a dark/transparent hero and mark it */
    const navEl = document.getElementById('nav');
    const firstLink = document.querySelector('.nav-links a');
    if (navEl && firstLink) {
      const col = window.getComputedStyle(firstLink).color;
      if (col === 'rgb(255, 255, 255)') navEl.classList.add('nav-dark');
    }

    /* Inject button after .nav-cta (rightmost) */
    const navCta = document.querySelector('.nav-cta');
    if (navCta) {
      const btn = document.createElement('button');
      btn.id = 'lang-toggle';
      btn.className = 'lang-btn';
      btn.setAttribute('aria-label', 'Toggle language');
      btn.textContent = stored === 'ar' ? 'EN' : 'عربي';
      navCta.after(btn);

      btn.addEventListener('click', () => {
        const next = stored === 'ar' ? 'en' : 'ar';
        localStorage.setItem(KEY, next);
        location.reload();
      });
    }

    if (stored === 'ar') applyArabic();
  });
})();
