const fs = require('node:fs');
const path = require('node:path');
const {shapes,units} = require('../templates/volume-model.js');
const root = path.resolve(__dirname,'..');
function illustration(id, suffix) {
    const uid = 'volume-'+id+'-'+suffix;
    const color = {cube:'#0397ef',rectangular:'#ffab26',cylinder:'#f8bb08',sphere:'#f23975',cone:'#9846ef',frustum:'#39b66c',ellipsoid:'#1689e8',cap:'#e745b7',tube:'#8493a8'}[id];
    let geometry;
    if (['cube','rectangular'].includes(id)) geometry='<path d="M24 30 65 15 106 30 65 48Z" fill="#b5f0ff"/><path d="M24 30 65 48V90L24 72Z" fill="url(#'+uid+')"/><path d="m65 48 41-18v42L65 90Z" fill="'+color+'"/>';
    else if (['sphere','ellipsoid'].includes(id)) geometry='<ellipse cx="65" cy="52" rx="'+(id==='sphere'?37:51)+'" ry="'+(id==='sphere'?37:29)+'" fill="url(#'+uid+')"/>';
    else if (id==='cap') geometry='<path d="M18 66a47 47 0 0 1 94 0Q65 88 18 66" fill="url(#'+uid+')"/>';
    else if (id==='tube') geometry='<path d="M18 35v37c0 24 94 24 94 0V35Z" fill="url(#'+uid+')"/><ellipse cx="65" cy="35" rx="47" ry="19" fill="#cbd4e0"/><ellipse cx="65" cy="35" rx="25" ry="11" fill="#334155"/>';
    else if (id==='cone') geometry='<path d="M65 12 112 79Q65 107 18 79Z" fill="url(#'+uid+')"/>';
    else geometry='<path d="M'+(id==='frustum'?'40':'30')+' 24 '+(id==='frustum'?'18':'30')+' 78Q65 102 '+(id==='frustum'?'112':'100')+' 78L'+(id==='frustum'?'90':'100')+' 24Z" fill="url(#'+uid+')"/><ellipse cx="65" cy="24" rx="'+(id==='frustum'?25:35)+'" ry="11" fill="'+(id==='frustum'?'#b7f3aa':'#fff3a0')+'"/>';
    return `<svg viewBox="0 0 130 110" width="130" height="110" aria-hidden="true" focusable="false"><defs><radialGradient id="${uid}" cx="28%" cy="20%" r="90%"><stop stop-color="#fff"/><stop offset=".3" stop-color="${color}"/><stop offset="1" stop-color="#183c6c"/></radialGradient></defs><ellipse cx="65" cy="97" rx="40" ry="5" fill="#143b6715"/><g${id==='rectangular'?' transform="translate(-7 15) scale(1.1 .7)"':''}>${geometry}</g></svg>`;
}
const options = Object.keys(units).map(u=>`<option value="${u}">${u}</option>`).join('');
function cards() {
    return `<section class="volume-card-workspace" aria-label="Volume calculators"><p class="volume-workspace-intro">Choose a solid below. Each dimension has its own unit; choose the cubic unit for your result. All nine tools include Calculate, Clear and Copy.</p><div class="volume-card-grid">${shapes.map(s=>`<form class="volume-shape-form volume-${s.id}" data-shape="${s.id}" novalidate aria-labelledby="volume-card-${s.id}">
        ${illustration(s.id,'card')}<h2 id="volume-card-${s.id}">${s.name}</h2><p class="volume-card-formula">${s.formula}</p>
        <p class="volume-dimension-help" id="volume-help-${s.id}">${s.note}</p>
        <div class="volume-card-fields">${s.fields.map(([key,label])=>`<div class="volume-dimension"><label for="vc-${s.id}-${key}">${label}</label><div><input id="vc-${s.id}-${key}" name="${key}" type="number" step="any" min="0" required inputmode="decimal" placeholder="Enter value" aria-describedby="volume-help-${s.id}"><select name="${key}Unit" aria-label="${label} unit">${options}</select></div></div>`).join('')}
        <label class="volume-result-unit">Result unit <select name="resultUnit" aria-label="${s.name} result unit">${Object.keys(units).map(u=>`<option value="${u}">${u}³</option>`).join('')}</select></label></div>
        <button type="submit" class="volume-calculate">Calculate volume</button><div class="volume-secondary"><button type="reset">Clear</button><button type="button" data-copy disabled>Copy result</button></div>
        <output aria-live="polite" hidden></output><p class="volume-card-message" role="status"></p><p class="volume-breakdown"></p>
    </form>`).join('')}</div>
    <section class="volume-learning"><div><h2>From dimensions to volume</h2><ol><li>Pick the shape and measure the labeled dimensions.</li><li>Choose a unit beside each dimension and a result unit.</li><li>Calculate, review the result, then Copy or Clear.</li></ol></div><div><h2>Use the right measurements</h2><p>Radius is half of diameter. Ellipsoid semi-axes are half of the full widths. Heights are perpendicular, not slanted. These models describe ideal geometric solids; irregular objects need a different method.</p></div></section>
    <details class="volume-new-examples"><summary>Examples, conversions and shape limits</summary><p>A frustum with radii 3 cm and 1 cm and height 6 cm has volume 26π ≈ 81.68 cm³. An ellipsoid with semi-axes 2, 3 and 4 cm has volume 32π ≈ 100.53 cm³.</p><p>A spherical cap with sphere radius 3 cm and height 1 cm has volume 8π/3 ≈ 8.38 cm³. A tube with outer radius 3 cm, inner radius 2 cm and length 5 cm contains 25π ≈ 78.54 cm³ of material, not liquid capacity.</p><p>1 inch = 2.54 cm and 1 foot = 12 inches. Length conversion happens before calculating volume: a 1 m cube is 1,000,000 cm³. Inputs must be positive. Tube inner radius must be less than outer radius; cap height must not exceed the sphere diameter. Results are rounded to two decimals, with scientific notation for very small values. Unrepresentable results show a validation message.</p><p>Formula references: <a href="https://mathworld.wolfram.com/ConicalFrustum.html">conical frustum</a>, <a href="https://mathworld.wolfram.com/Ellipsoid.html">ellipsoid</a>, <a href="https://mathworld.wolfram.com/SphericalCap.html">spherical cap</a>.</p></details></section>`;
}
function render(html) {
    if(html.includes('id="volume-page-css"')) throw Error('Render from the original generated page, not an already enhanced page.');
    html=html.replace('class="app-page', 'class="app-page volume-page-active');
    html=html.replace('Selecting a unit labels the inputs and result; it does not convert dimensions entered in different units.', 'Each card converts the dimension units you select into the chosen result unit before calculating volume.');
    html=html.replace('</head>',`<style id="volume-page-css">${fs.readFileSync(path.join(root,'templates/volume-ui.css'),'utf8')}</style>\n</head>`);
    html=html.replace('<div class="calculator extra-tall" id="volumeCalculator" style="display: block;">',`<div class="calculator extra-tall" id="volumeCalculator" style="display: block;">${cards()}<div class="volume-legacy">`);
    html=html.replace(/(\s*<!-- Area Calculator -->)/,'</div>$1');
    html=html.replace('<div class="hero-art" aria-hidden="true">',`<div class="volume-hero-art" aria-hidden="true">${['cube','sphere','cylinder','cone','frustum'].map(s=>illustration(s,'hero')).join('')}</div><div class="hero-art" aria-hidden="true">`);
    html=html.replace('<aside class="seo-column contextual-panel" aria-label="Calculator information">',`<aside class="seo-column contextual-panel" aria-label="Calculator information"><section class="info-card volume-formulas"><h2>Volume formulas at a glance</h2>${shapes.map(s=>`<a href="#volume-card-${s.id}">${illustration(s.id,'formula')}<span><strong>${s.name}</strong><small>${s.formula}</small></span></a>`).join('')}</section>`);
    html=html.replace('</body>',`<script id="volume-page-model">${fs.readFileSync(path.join(root,'templates/volume-model.js'),'utf8')}</script><script id="volume-page-ui">${fs.readFileSync(path.join(root,'templates/volume-ui.js'),'utf8')}</script>\n</body>`);
    return html;
}
module.exports = {render};
