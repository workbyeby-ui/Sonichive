import re, os

BASE = r"c:/Users/stuud/Downloads/sonichive/public"

ICONS = {
  'Dimensions':   '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2.5" y="2.5" width="13" height="13" rx="2" stroke="#D42020" stroke-width="1.4"/><path d="M5.5 2.5v1.5M9 2.5v1.5M12.5 2.5v1.5M2.5 5.5h1.5M2.5 9h1.5M2.5 12.5h1.5" stroke="#D42020" stroke-width="1.2" stroke-linecap="round"/></svg>',
  'Acoustic':     '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M6.5 6.5 4 8.5v1l2.5 2V6.5z" stroke="#D42020" stroke-width="1.4" stroke-linejoin="round"/><path d="M9.5 7c.9.6 1.4 1.3 1.4 2s-.5 1.5-1.4 2" stroke="#D42020" stroke-width="1.4" stroke-linecap="round"/><path d="M11.5 5c1.4 1.1 2.2 2.5 2.2 4s-.8 2.9-2.2 4" stroke="#D42020" stroke-width="1.4" stroke-linecap="round"/></svg>',
  'Capacity':     '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="2.5" stroke="#D42020" stroke-width="1.4"/><path d="M4.5 15c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" stroke="#D42020" stroke-width="1.4" stroke-linecap="round"/></svg>',
  'Weight':       '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3.5" y="8" width="11" height="7" rx="1.5" stroke="#D42020" stroke-width="1.4"/><path d="M7 8V6a2 2 0 014 0v2" stroke="#D42020" stroke-width="1.4" stroke-linecap="round"/></svg>',
  'Glass':        '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="3" width="12" height="12" rx="1.5" stroke="#D42020" stroke-width="1.4"/><line x1="9" y1="3" x2="9" y2="15" stroke="#D42020" stroke-width="1.2"/></svg>',
  'Ventilation':  '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="1.8" stroke="#D42020" stroke-width="1.3"/><path d="M9 3c0 2-1.5 3-3 3s-3-1.5" stroke="#D42020" stroke-width="1.3" stroke-linecap="round"/><path d="M9 15c0-2 1.5-3 3-3s3 1.5" stroke="#D42020" stroke-width="1.3" stroke-linecap="round"/><path d="M3 9c2 0 3 1.5 3 3s-1.5 3" stroke="#D42020" stroke-width="1.3" stroke-linecap="round"/><path d="M15 9c-2 0-3-1.5-3-3s1.5-3" stroke="#D42020" stroke-width="1.3" stroke-linecap="round"/></svg>',
  'Air':          '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9h12M3 6h8M3 12h8" stroke="#D42020" stroke-width="1.4" stroke-linecap="round"/><path d="M12.5 6l3 3-3 3" stroke="#D42020" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'Power Supply': '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="5" y="8" width="8" height="6" rx="1.5" stroke="#D42020" stroke-width="1.4"/><path d="M7.5 8V6M10.5 8V6" stroke="#D42020" stroke-width="1.4" stroke-linecap="round"/><circle cx="9" cy="11.5" r="1" fill="#D42020"/></svg>',
  'Power Consumption': '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M10.5 3 6.5 10h5l-3.5 5" stroke="#D42020" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'Lighting':     '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 4.5a3.5 3.5 0 013.5 3.5c0 1.3-.7 2.5-1.75 3.2V13H7.25v-1.8A3.5 3.5 0 019 4.5z" stroke="#D42020" stroke-width="1.4" stroke-linejoin="round"/><path d="M7.25 14.5h3.5" stroke="#D42020" stroke-width="1.4" stroke-linecap="round"/></svg>',
  'Connectivity': '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 7.5C4.5 6 6.6 5 9 5s4.5 1 6 2.5" stroke="#D42020" stroke-width="1.4" stroke-linecap="round"/><path d="M5.5 10C6.5 9 7.7 8.5 9 8.5s2.5.5 3.5 1.5" stroke="#D42020" stroke-width="1.4" stroke-linecap="round"/><circle cx="9" cy="13" r="1.3" fill="#D42020"/></svg>',
  'Trim':         '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2.5" y="2.5" width="5.5" height="5.5" rx="1" stroke="#D42020" stroke-width="1.4"/><rect x="10" y="2.5" width="5.5" height="5.5" rx="1" stroke="#D42020" stroke-width="1.4"/><rect x="2.5" y="10" width="5.5" height="5.5" rx="1" stroke="#D42020" stroke-width="1.4"/><rect x="10" y="10" width="5.5" height="5.5" rx="1" stroke="#D42020" stroke-width="1.4"/></svg>',
  'Warranty':     '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3 4 5v4c0 3 2 5.3 5 6 3-.7 5-3 5-6V5L9 3z" stroke="#D42020" stroke-width="1.4" stroke-linejoin="round"/><path d="M6.5 9l2 2 3-3" stroke="#D42020" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'Lead':         '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="4" width="12" height="11" rx="1.5" stroke="#D42020" stroke-width="1.4"/><path d="M6 2.5v2M12 2.5v2M3 8h12" stroke="#D42020" stroke-width="1.4" stroke-linecap="round"/></svg>',
  'Floor':        '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 14h12M9 4v7M6 8l3-4 3 4" stroke="#D42020" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
}
DEFAULT_ICON = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="5.5" stroke="#D42020" stroke-width="1.4"/></svg>'
CHECK_SVG = '<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5l2.5 2.5 4.5-4.5" stroke="#FFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'

def get_icon(label):
    for key, svg in ICONS.items():
        if key.lower() in label.lower():
            return svg
    return DEFAULT_ICON

NEW_CSS = (
    ".spec-section{padding:5rem 0;background:var(--bg2)}"
    ".spec-grid{display:grid;grid-template-columns:3fr 2fr;gap:1.5rem;align-items:start}"
    "@media(max-width:900px){.spec-grid{grid-template-columns:1fr}}"
    ".spec-card,.feat-card{background:#FFF;border:1px solid var(--border);border-radius:16px;padding:1.75rem 2rem;box-shadow:0 2px 20px rgba(0,0,0,.06)}"
    ".spec-card-hd,.feat-card-hd{font-size:.68rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:var(--red);margin-bottom:1.25rem;padding-bottom:.85rem;border-bottom:1px solid var(--border)}"
    ".spec-row{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid var(--border)}"
    ".spec-row:last-child{border-bottom:none}"
    ".spec-row-l{display:flex;align-items:center;gap:.65rem;padding:.85rem 1rem .85rem 0;border-right:1px solid var(--border)}"
    ".spec-lbl{font-size:.85rem;font-weight:500;color:var(--text)}"
    ".spec-row-r{padding:.85rem 0 .85rem 1.2rem;font-size:.85rem;color:var(--text);font-weight:400}"
    ".feat-row{display:flex;align-items:flex-start;gap:1rem;padding:.85rem 0;border-bottom:1px solid var(--border)}"
    ".feat-row:last-child{border-bottom:none}"
    ".feat-chk{width:24px;min-width:24px;height:24px;border-radius:50%;background:var(--red);display:flex;align-items:center;justify-content:center;margin-top:.1rem}"
    ".feat-txt{font-size:.875rem;color:var(--text);line-height:1.6;padding-top:.2rem}"
)

OLD_CSS_PATTERNS = [
    r"\.spec-section\{padding:5rem 0;background:var\(--bg2\);border-top:[^}]+\}",
    r"\.spec-section\{padding:5rem 0;background:var\(--bg2\)\}",
    r"\.spec-grid\{display:grid;grid-template-columns:3fr 2fr;gap:4rem;align-items:start\}",
    r"\.spec-grid\{display:grid;grid-template-columns:1fr 1fr;gap:3rem\}",
    r"@media\(max-width:768px\)\{\.spec-grid\{grid-template-columns:1fr\}\}",
    r"@media\(max-width:900px\)\{\.spec-grid\{grid-template-columns:1fr\}\}",
    r"\.spec-table\{[^}]+\}",
    r"\.spec-table tr\{[^}]+\}",
    r"\.spec-table tr:last-child\{[^}]+\}",
    r"\.spec-table td\{[^}]+\}",
    r"\.spec-table td:first-child\{[^}]+\}",
    r"\.spec-table td:last-child\{[^}]+\}",
    r"\.feat-list\{[^}]+\}",
    r"\.feat-item\{[^}]+\}",
    r"\.feat-check\{[^}]+\}",
    r"\.spec-card,\.feat-card\{[^}]+\}",
    r"\.spec-card-hd,\.feat-card-hd\{[^}]+\}",
    r"\.spec-row\{[^}]+\}",
    r"\.spec-row:last-child\{[^}]+\}",
    r"\.spec-row-l\{[^}]+\}",
    r"\.spec-lbl\{[^}]+\}",
    r"\.spec-row-r\{[^}]+\}",
    r"\.feat-row\{[^}]+\}",
    r"\.feat-row:last-child\{[^}]+\}",
    r"\.feat-chk\{[^}]+\}",
    r"\.feat-txt\{[^}]+\}",
    # multiline versions
    r"\n    \.spec-table\{[^\n]+\}",
    r"\n    \.spec-table tr\{[^\n]+\}",
    r"\n    \.spec-table tr:last-child\{[^\n]+\}",
    r"\n    \.spec-table td\{[^\n]+\}",
    r"\n    \.spec-table td:first-child\{[^\n]+\}",
    r"\n    \.spec-table td:last-child\{[^\n]+\}",
    r"\n    \.feat-list\{[^\n]+\}",
    r"\n    \.feat-item\{[^\n]+\}",
    r"\n    \.feat-check\{[^\n]+\}",
]

TR_PAT = re.compile(r"<tr><td>([^<]+)</td><td>(.*?)</td></tr>", re.DOTALL)
FT_PAT = re.compile(r'<div class="feat-item">.*?<span>(.*?)</span>\s*</div>', re.DOTALL)
GRID_PAT = re.compile(r'<div class="spec-grid">(.*?)</div>\s*</div>\s*</section>', re.DOTALL)

def build_spec_rows(matches):
    out = ""
    for label, value in matches:
        label = label.strip(); value = value.strip()
        out += (f'<div class="spec-row">'
                f'<div class="spec-row-l">{get_icon(label)}'
                f'<span class="spec-lbl">{label}</span></div>'
                f'<div class="spec-row-r">{value}</div>'
                f'</div>')
    return out

def build_feat_rows(matches):
    out = ""
    for text in matches:
        out += (f'<div class="feat-row">'
                f'<div class="feat-chk">{CHECK_SVG}</div>'
                f'<span class="feat-txt">{text.strip()}</span>'
                f'</div>')
    return out

def transform_spec_section(html):
    def replacer(m):
        inner = m.group(1)
        tr_matches = TR_PAT.findall(inner)
        ft_matches = FT_PAT.findall(inner)
        return (
            '<div class="spec-grid">'
            '<div class="spec-card r d1">'
            '<div class="spec-card-hd">Specifications</div>'
            + build_spec_rows(tr_matches) +
            '</div>'
            '<div class="feat-card r d2">'
            '<div class="feat-card-hd">Included Features</div>'
            + build_feat_rows(ft_matches) +
            '</div>'
            '</div>'
            '</div></section>'
        )
    return GRID_PAT.sub(replacer, html)

pages = [
    "vrt-solo.html","vrt-duo.html","vrt-quartet.html","vrt-hexa.html",
    "vrt-plus-solo.html","vrt-plus-duo.html","vrt-plus-quartet.html","vrt-plus-hexa.html",
    "art-pod-solo.html","art-pod-duo.html","art-pod-quartet.html","art-pod-hexa.html",
]

for fname in pages:
    fpath = os.path.join(BASE, fname)
    txt = open(fpath, encoding="utf-8").read()
    orig = txt

    for pat in OLD_CSS_PATTERNS:
        txt = re.sub(pat, "", txt)

    txt = txt.replace("</style>", NEW_CSS + "</style>", 1)
    txt = transform_spec_section(txt)

    if txt != orig:
        open(fpath, "w", encoding="utf-8").write(txt)
        print(f"Done: {fname}")
    else:
        print(f"No change: {fname}")

print("\nAll done.")
