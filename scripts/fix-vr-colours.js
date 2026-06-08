const fs = require('fs');

const pages = [
  { file: 'public/vr-s/index.html',  size: 'S',  frame: '0000', sizeLabel: 'S' },
  { file: 'public/vr-s.html',        size: 'S',  frame: '0000', sizeLabel: 'S' },
  { file: 'public/pods/vr-s.html',   size: 'S',  frame: '0000', sizeLabel: 'S' },
  { file: 'public/vr-m/index.html',  size: 'M',  frame: '0010', sizeLabel: 'M' },
  { file: 'public/vr-m.html',        size: 'M',  frame: '0010', sizeLabel: 'M' },
  { file: 'public/pods/vr-m.html',   size: 'M',  frame: '0010', sizeLabel: 'M' },
  { file: 'public/vr-l/index.html',  size: 'L',  frame: '0025', sizeLabel: 'L' },
  { file: 'public/vr-l.html',        size: 'L',  frame: '0025', sizeLabel: 'L' },
  { file: 'public/pods/vr-l.html',   size: 'L',  frame: '0025', sizeLabel: 'L' },
  { file: 'public/vr-xl/index.html', size: 'XL', frame: '0030', sizeLabel: 'XL' },
  { file: 'public/vr-xl.html',       size: 'XL', frame: '0030', sizeLabel: 'XL' },
  { file: 'public/pods/vr-xl.html',  size: 'XL', frame: '0030', sizeLabel: 'XL' },
];

const imgBase = 'images/Pods/VR/VR%20booth%20with%203D%20interior%20wall%20panel';

pages.forEach(({ file, size, frame, sizeLabel }) => {
  let html = fs.readFileSync(file, 'utf8');

  const newBase = imgBase + '/VR-' + size + '/VR-3D-';
  const newSrcBase = '/' + newBase;

  // ── 1. Fix ALL image paths (old VR series + previously wrong unencoded) ──────
  const oldPaths = [
    { from: "'" + 'VR series/VR ' + sizeLabel + '/VR-3D-',                               to: "'" + newBase },
    { from: '/pods/VR series/VR ' + sizeLabel + '/VR-3D-',                                to: newSrcBase },
    { from: "'" + 'images/Pods/VR/VR booth with 3D interior wall panel/VR-' + size + '/VR-3D-', to: "'" + newBase },
    { from: '/images/Pods/VR/VR booth with 3D interior wall panel/VR-' + size + '/VR-3D-',      to: newSrcBase },
  ];
  oldPaths.forEach(({ from, to }) => { html = html.split(from).join(to); });

  // ── 2. Deduplicate: remove extra .int-swatch CSS blocks (keep only first) ───
  const intCss = `.int-swatch{display:inline-flex;`;
  const firstIdx = html.indexOf(intCss);
  if (firstIdx !== -1) {
    const secondIdx = html.indexOf(intCss, firstIdx + 1);
    if (secondIdx !== -1) {
      // find the end of the second block (next </style> after secondIdx)
      const blockEnd = html.indexOf('\n    .int-swatch .csw-body{width:100%;height:100%;border-radius:50%}', secondIdx);
      if (blockEnd !== -1) {
        const removeEnd = blockEnd + '\n    .int-swatch .csw-body{width:100%;height:100%;border-radius:50%}'.length;
        html = html.slice(0, secondIdx - 4) + html.slice(removeEnd);
      }
    }
  }

  // ── 3. Deduplicate: remove second interior selector HTML block ───────────────
  const intHtmlMarker = `<p style="font-size:.8rem;color:var(--muted);margin-bottom:.6rem;font-weight:500">Interior:`;
  const h1 = html.indexOf(intHtmlMarker);
  if (h1 !== -1) {
    const h2 = html.indexOf(intHtmlMarker, h1 + 1);
    if (h2 !== -1) {
      // Find the closing </div></div> of the second block
      const closeTag = '</div>\n      </div>';
      const blockEnd = html.indexOf(closeTag, h2);
      if (blockEnd !== -1) {
        const removeStart = html.lastIndexOf('<div style="margin-bottom:1.75rem">', h2);
        const removeEnd = blockEnd + closeTag.length + 1;
        html = html.slice(0, removeStart) + html.slice(removeEnd);
      }
    }
  }

  // ── 4. Deduplicate: remove second setInterior function ──────────────────────
  const siFn = 'function setInterior(el){';
  const si1 = html.indexOf(siFn);
  if (si1 !== -1) {
    const si2 = html.indexOf(siFn, si1 + 1);
    if (si2 !== -1) {
      const siEnd = html.indexOf('\n}', si2);
      if (siEnd !== -1) {
        html = html.slice(0, si2) + html.slice(siEnd + 3);
      }
    }
  }

  // ── 5. Ensure curInterior is declared (add if missing) ──────────────────────
  if (!html.includes('var curInterior')) {
    // Match both "var curColour='black';" and "var curColour = 'black';"
    html = html.replace(/var curColour\s*=\s*'black';/, "var curColour = 'black';\nvar curInterior = '';");
  }

  // ── 6. Fix updateImg to use curInterior (replace broken hardcoded version) ──
  // If it still has the old broken hardcoded 'black' version, replace it
  const oldUpdateRe = /function updateImg\(\)\{[\s\S]*?setTimeout\(function\(\)\{img\.src='\/pods\/'[\s\S]*?\}\);[\s\S]*?\}\}/;
  const newUpdateImg = `function updateImg(){
  var intKey=curInterior;
  if(curColour==='White'&&curInterior==='-Yellow')intKey='-YELLOW';
  var key=curColour+intKey;
  var path=colourMap[key];if(!path)return;
  var img=document.getElementById('main-img');
  img.style.opacity='0';
  setTimeout(function(){img.src='/'+path+curAngle+'.webp';img.style.opacity='1';},150);
  document.querySelectorAll('.ph-thumb').forEach(function(t){
    var a=t.getAttribute('onclick').match(/'(\\d+)'/);
    if(a){t.querySelector('img').src='/'+path+a[1]+'.webp';}
  });
}`;
  if (oldUpdateRe.test(html)) html = html.replace(oldUpdateRe, newUpdateImg);

  // ── 7. Fix data-key values to match actual filenames ────────────────────────
  html = html.replace(/data-key="Black"/g, 'data-key="black"');
  html = html.replace(/data-key="Grey"/g,  'data-key="gray"');
  html = html.replace(/data-key="Olive-Green"/g, 'data-key="green"');

  // ── 8. Fix active swatch: Black active, White inactive ──────────────────────
  html = html.replace(/(<div class="cswatch act" data-key="White")/g, '<div class="cswatch" data-key="White"');
  html = html.replace(/(<div class="cswatch" data-key="black")/g, '<div class="cswatch act" data-key="black"');

  // ── 9. Fix colour-label initial text ────────────────────────────────────────
  html = html.replace(
    '<span id="colour-label" style="color:var(--text);font-weight:600">White</span>',
    '<span id="colour-label" style="color:var(--text);font-weight:600">Black</span>'
  );

  // ── 10. Add setInterior if missing entirely ──────────────────────────────────
  if (!html.includes('function setInterior')) {
    html = html.replace('function setAngle(el,angle){',
      `function setInterior(el){
  document.querySelectorAll('.int-swatch').forEach(function(s){s.classList.remove('act')});
  el.classList.add('act');
  curInterior=el.dataset.int;
  document.getElementById('interior-label').textContent=el.dataset.label;
  updateImg();
}
function setAngle(el,angle){`);
  }

  // ── 11. Add interior selector HTML if missing ────────────────────────────────
  if (!html.includes('id="interior-label"')) {
    const marker = `      <div class="ph-specs-row">`;
    const interiorHtml = `      <div style="margin-bottom:1.75rem">
        <p style="font-size:.8rem;color:var(--muted);margin-bottom:.6rem;font-weight:500">Interior: <span id="interior-label" style="color:var(--text);font-weight:600">Black</span></p>
        <div class="colour-grid" style="margin-top:.6rem">
          <div class="int-swatch act" data-int="" data-label="Black" onclick="setInterior(this)"><div class="cswatch-in"><div class="csw-body" style="background:#1a1a1a"></div></div></div>
          <div class="int-swatch" data-int="-Yellow" data-label="Yellow" onclick="setInterior(this)"><div class="cswatch-in"><div class="csw-body" style="background:#facc15"></div></div></div>
          <div class="int-swatch" data-int="-Blue" data-label="Dark Blue" onclick="setInterior(this)"><div class="cswatch-in"><div class="csw-body" style="background:#1e3a8a"></div></div></div>
        </div>
      </div>
      <div class="ph-specs-row">`;
    html = html.replace(marker, interiorHtml);
  }

  // ── 12. Add int-swatch CSS if missing ───────────────────────────────────────
  if (!html.includes('.int-swatch{')) {
    const cssPatch = `
    .int-swatch{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:all .18s;outline:2.5px solid transparent;outline-offset:2px}
    .int-swatch:hover{transform:scale(1.1)}
    .int-swatch.act{outline-color:var(--blue)}
    .int-swatch .cswatch-in{width:100%;height:100%;border-radius:50%;padding:3px;display:flex;align-items:center;justify-content:center}
    .int-swatch .csw-body{width:100%;height:100%;border-radius:50%}`;
    html = html.replace('</style>', cssPatch + '\n  </style>');
  }

  fs.writeFileSync(file, html, 'utf8');
  console.log('Fixed:', file);
});

console.log('All done.');
