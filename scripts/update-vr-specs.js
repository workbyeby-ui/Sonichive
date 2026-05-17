const fs = require('fs');
const path = require('path');

const PODS_DIR = path.join(__dirname, '..', 'public', 'pods');

// Verified specs from the official VR Series Data Sheet PDF
const models = {
  's': {
    file: 'vr-s.html',
    model: 'S-F2',
    capacity: '1',
    capacityLabel: 'Person',
    extDims: '1000 × 966 × 2300 mm',
    intDims: '840 × 900 × 2140 mm',
    weight: '258',
    stc: '30 ± 5 dB (STC)',
    revTime: '≤ 0.1 s',
    airVol: '70 m³/h',
    airFreq: '43 times/h',
    power: '18W – 23W',
    voltage: '100–240V AC / 12V–24V DC',
    fans: '1 × silent fan, ≤ 40 dB, 900 RPM',
    lighting: '4000K / 879 LM — Round, black',
    formaldehyde: 'Class Ⅰ ≤ 0.08 mg/m³',
    tvoc: 'Class Ⅰ ≤ 0.5 mg/m³',
    co2: '≤ 1000 PPM',
    certs: '3C / CE · ASTM E84 / GB 20286-2006',
    table: 'ST-02 shelf table — birch wood',
    seating: 'SY-01 bar chair × 1',
    // Quick spec bar
    qs_noise: '30dB',
    qs_width: '1000mm',
    qs_height: '2300mm',
    qs_weight: '258kg',
    // Related cards captions for other sizes
    rel_s: null,
    rel_m: '30dB · 1500mm wide',
    rel_l: '30dB · 2200mm wide',
    rel_xl: '30dB · 2200mm wide',
  },
  'm': {
    file: 'vr-m.html',
    model: 'M-F3',
    capacity: '2',
    capacityLabel: 'Persons',
    extDims: '1500 × 1266 × 2300 mm',
    intDims: '1340 × 1200 × 2140 mm',
    weight: '388',
    stc: '30 ± 5 dB (STC)',
    revTime: '≤ 0.15 s',
    airVol: '81 m³/h',
    airFreq: '23 times/h',
    power: '26W – 31W',
    voltage: '100–240V AC / 12V–24V DC',
    fans: '1 × silent fan, ≤ 40 dB, 900 RPM',
    lighting: '4000K / 879 LM — Square, black',
    formaldehyde: 'Class Ⅰ ≤ 0.08 mg/m³',
    tvoc: 'Class Ⅰ ≤ 0.5 mg/m³',
    co2: '≤ 1000 PPM',
    certs: '3C / CE · ASTM E84 / GB 20286-2006',
    table: 'ST-03 table — birch wood',
    seating: 'SY-01 bar chair × 2',
    qs_noise: '30dB',
    qs_width: '1500mm',
    qs_height: '2300mm',
    qs_weight: '388kg',
    rel_s: '30dB · 1000mm wide',
    rel_m: null,
    rel_l: '30dB · 2200mm wide',
    rel_xl: '30dB · 2200mm wide',
  },
  'l': {
    file: 'vr-l.html',
    model: 'L',
    capacity: '4',
    capacityLabel: 'Persons',
    extDims: '2200 × 1566 × 2300 mm',
    intDims: '2040 × 1500 × 2140 mm',
    weight: '583',
    stc: '30 ± 5 dB (STC)',
    revTime: '≤ 0.15 s',
    airVol: '141 m³/h',
    airFreq: '21 times/h',
    power: '73W – 83W',
    voltage: '100–240V AC / 12V–24V DC',
    fans: '2 × silent fan, ≤ 40 dB, 500–1200 RPM',
    lighting: '4000K / 1500 LM — Strip light, black',
    formaldehyde: 'Class Ⅰ ≤ 0.08 mg/m³',
    tvoc: 'Class Ⅰ ≤ 0.5 mg/m³',
    co2: '≤ 1000 PPM',
    certs: '3C / CE · ASTM E84 / GB 20286-2006',
    table: 'ST-05 table — birch wood (+ optional TV hanger)',
    seating: 'SY-05 office sofa × 2',
    qs_noise: '30dB',
    qs_width: '2200mm',
    qs_height: '2300mm',
    qs_weight: '583kg',
    rel_s: '30dB · 1000mm wide',
    rel_m: '30dB · 1500mm wide',
    rel_l: null,
    rel_xl: '30dB · 2200mm wide',
  },
  'xl': {
    file: 'vr-xl.html',
    model: 'XL',
    capacity: '6',
    capacityLabel: 'Persons',
    extDims: '2200 × 2166 × 2300 mm',
    intDims: '2040 × 2100 × 2140 mm',
    weight: '680',
    stc: '30 ± 5 dB (STC)',
    revTime: '≤ 0.2 s',
    airVol: '143 m³/h',
    airFreq: '15 times/h',
    power: '100W – 110W',
    voltage: '100–240V AC / 12V–24V DC',
    fans: '2 × silent fan, ≤ 40 dB, 500–1200 RPM',
    lighting: '4000K / 2000 LM — Strip light, black',
    formaldehyde: 'Class Ⅰ ≤ 0.08 mg/m³',
    tvoc: 'Class Ⅰ ≤ 0.5 mg/m³',
    co2: '≤ 1000 PPM',
    certs: '3C / CE · ASTM E84 / GB 20286-2006',
    table: 'ST-06 table — birch wood (+ optional TV hanger)',
    seating: 'SY-06 office sofa × 2',
    qs_noise: '30dB',
    qs_width: '2200mm',
    qs_height: '2300mm',
    qs_weight: '680kg',
    rel_s: '30dB · 1000mm wide',
    rel_m: '30dB · 1500mm wide',
    rel_l: '30dB · 2200mm wide',
    rel_xl: null,
  },
};

function makeSpecRows(m) {
  const icon = (path) => `<svg width="18" height="18" viewBox="0 0 18 18" fill="none">${path}</svg>`;
  const dims_icon = icon(`<rect x="2.5" y="2.5" width="13" height="13" rx="2" stroke="#2563EB" stroke-width="1.4"/><path d="M5.5 2.5v1.5M9 2.5v1.5M12.5 2.5v1.5M2.5 5.5h1.5M2.5 9h1.5M2.5 12.5h1.5" stroke="#2563EB" stroke-width="1.2" stroke-linecap="round"/>`);
  const sound_icon = icon(`<path d="M6.5 6.5 4 8.5v1l2.5 2V6.5z" stroke="#2563EB" stroke-width="1.4" stroke-linejoin="round"/><path d="M9.5 7c.9.6 1.4 1.3 1.4 2s-.5 1.5-1.4 2" stroke="#2563EB" stroke-width="1.4" stroke-linecap="round"/><path d="M11.5 5c1.4 1.1 2.2 2.5 2.2 4s-.8 2.9-2.2 4" stroke="#2563EB" stroke-width="1.4" stroke-linecap="round"/>`);
  const person_icon = icon(`<circle cx="9" cy="6" r="2.5" stroke="#2563EB" stroke-width="1.4"/><path d="M4.5 15c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" stroke="#2563EB" stroke-width="1.4" stroke-linecap="round"/>`);
  const weight_icon = icon(`<rect x="3.5" y="8" width="11" height="7" rx="1.5" stroke="#2563EB" stroke-width="1.4"/><path d="M7 8V6a2 2 0 014 0v2" stroke="#2563EB" stroke-width="1.4" stroke-linecap="round"/>`);
  const fan_icon = icon(`<circle cx="9" cy="9" r="1.8" stroke="#2563EB" stroke-width="1.3"/><path d="M9 3c0 2-1.5 3-3 3s-3-1.5M9 15c0-2 1.5-3 3-3s3 1.5M3 9c2 0 3 1.5 3 3s-1.5 3M15 9c-2 0-3-1.5-3-3s1.5-3" stroke="#2563EB" stroke-width="1.3" stroke-linecap="round"/>`);
  const air_icon = icon(`<path d="M3 9h12M3 6h8M3 12h8" stroke="#2563EB" stroke-width="1.4" stroke-linecap="round"/><path d="M12.5 6l3 3-3 3" stroke="#2563EB" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`);
  const volt_icon = icon(`<rect x="5" y="8" width="8" height="6" rx="1.5" stroke="#2563EB" stroke-width="1.4"/><path d="M7.5 8V6M10.5 8V6" stroke="#2563EB" stroke-width="1.4" stroke-linecap="round"/><circle cx="9" cy="11.5" r="1" fill="#2563EB"/>`);
  const power_icon = icon(`<path d="M10.5 3 6.5 10h5l-3.5 5" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`);
  const light_icon = icon(`<path d="M9 4.5a3.5 3.5 0 013.5 3.5c0 1.3-.7 2.5-1.75 3.2V13H7.25v-1.8A3.5 3.5 0 019 4.5z" stroke="#2563EB" stroke-width="1.4" stroke-linejoin="round"/><path d="M7.25 14.5h3.5" stroke="#2563EB" stroke-width="1.4" stroke-linecap="round"/>`);
  const cert_icon = icon(`<path d="M9 3 4 5v4c0 3 2 5.3 5 6 3-.7 5-3 5-6V5L9 3z" stroke="#2563EB" stroke-width="1.4" stroke-linejoin="round"/><path d="M6.5 9l2 2 3-3" stroke="#2563EB" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`);
  const co2_icon = icon(`<path d="M3 7.5C4.5 6 6.6 5 9 5s4.5 1 6 2.5M5.5 10C6.5 9 7.7 8.5 9 8.5s2.5.5 3.5 1.5" stroke="#2563EB" stroke-width="1.4" stroke-linecap="round"/><circle cx="9" cy="13" r="1.3" fill="#2563EB"/>`);
  const table_icon = icon(`<rect x="3" y="4" width="12" height="11" rx="1.5" stroke="#2563EB" stroke-width="1.4"/><path d="M6 2.5v2M12 2.5v2M3 8h12" stroke="#2563EB" stroke-width="1.4" stroke-linecap="round"/>`);

  const row = (svg, label, value) =>
    `<div class="spec-row"><div class="spec-row-l">${svg}<span class="spec-lbl">${label}</span></div><div class="spec-row-r">${value}</div></div>`;

  return `<div class="spec-card-hd">Specifications</div>
        ${row(dims_icon, 'Ext. Dimensions (W×D×H)', m.extDims)}
        ${row(dims_icon, 'Int. Dimensions (W×D×H)', m.intDims)}
        ${row(sound_icon, 'Acoustic Reduction', m.stc)}
        ${row(person_icon, 'Capacity', m.capacity + (m.capacity === '1' ? ' Person' : ' Persons'))}
        ${row(weight_icon, 'Net Weight', m.weight + ' kg')}
        ${row(fan_icon, 'Ventilation', m.fans)}
        ${row(air_icon, 'Air Circulation', m.airFreq + ' · ' + m.airVol)}
        ${row(volt_icon, 'Power Supply', m.voltage)}
        ${row(power_icon, 'Power Consumption', m.power)}
        ${row(light_icon, 'Lighting', m.lighting)}
        ${row(co2_icon, 'Air Quality (CO₂)', m.co2)}
        ${row(co2_icon, 'Formaldehyde', m.formaldehyde)}
        ${row(cert_icon, 'Certifications', m.certs)}
        ${row(table_icon, 'Furniture', m.table + ' / ' + m.seating)}`;
}

function makeRelCard(href, num, label, name, cap) {
  return `<a href="${href}" class="rel-card r d${['vr-s','vr-m','vr-l','vr-xl'].indexOf(href.replace('.html',''))+1}">
        <div class="rel-num">${num}</div>
        <div class="rel-p-label">${label}</div>
        <div class="rel-divider"></div>
        <div class="rel-name">${name}</div>
        <div class="rel-cap">${cap}</div>
        <svg class="rel-arr" width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>`;
}

const relData = {
  's': { href:'vr-s.html', num:'1', label:'Person', name:'VR S' },
  'm': { href:'vr-m.html', num:'2', label:'Persons', name:'VR M' },
  'l': { href:'vr-l.html', num:'4', label:'Persons', name:'VR L' },
  'xl': { href:'vr-xl.html', num:'6', label:'Persons', name:'VR XL' },
};

for (const [key, m] of Object.entries(models)) {
  const fp = path.join(PODS_DIR, m.file);
  let html = fs.readFileSync(fp, 'utf8');

  // 1. Quick specs row
  html = html.replace(
    /<div class="ph-specs-row">[\s\S]*?<\/div>\s*<\/div>/,
    `<div class="ph-specs-row">
        <div class="ph-spec"><strong>${m.qs_noise}</strong><span>Noise Reduction</span></div>
        <div class="ph-spec"><strong>${m.qs_width}</strong><span>Ext. Width</span></div>
        <div class="ph-spec"><strong>${m.qs_height}</strong><span>Height</span></div>
        <div class="ph-spec"><strong>${m.qs_weight}</strong><span>Net Weight</span></div>
      </div>`
  );

  // 2. Full spec table (replace everything inside spec-card)
  html = html.replace(
    /(<div class="spec-card r d1">\s*)<div class="spec-card-hd">[\s\S]*?(<\/div>\s*<\/div>\s*<div class="feat-card)/,
    (_, open, end) => `${open}${makeSpecRows(m)}\n      ${end}`
  );

  // 3. Related cards grid
  const otherSizes = ['s','m','l','xl'].filter(k => k !== key);
  const relCards = otherSizes.map(k => {
    const r = relData[k];
    const cap = m[`rel_${k}`];
    return makeRelCard(r.href, r.num, r.label, r.name, cap);
  }).join('\n      ');

  html = html.replace(
    /(<div class="related-grid">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>\s*\n\s*<section class="cta-sec")/,
    (_, open, end) => `${open}\n      ${relCards}\n    </div>\n  </div>\n</section>\n\n<section class="cta-sec"`
  );

  fs.writeFileSync(fp, html, 'utf8');
  console.log('Updated:', m.file);
}

console.log('\nAll VR spec pages updated from PDF data sheet.');
