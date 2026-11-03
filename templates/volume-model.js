(function (root) {
    const units = {cm: 0.01, m: 1, in: 0.0254, ft: 0.3048};
    const shapes = [
        {id:'cube', name:'Cube', formula:'V = a³', fields:[['a','Edge length (a)']], note:'Measure one edge of the cube.'},
        {id:'rectangular', name:'Rectangular Prism', formula:'V = l × w × h', fields:[['l','Length (l)'],['w','Width (w)'],['h','Height (h)']], note:'Use three perpendicular dimensions.'},
        {id:'cylinder', name:'Cylinder', formula:'V = π × r² × h', fields:[['r','Radius (r)'],['h','Height (h)']], note:'Use radius, not diameter, and perpendicular height.'},
        {id:'sphere', name:'Sphere', formula:'V = 4/3 × π × r³', fields:[['r','Radius (r)']], note:'Radius is half the diameter.'},
        {id:'cone', name:'Cone', formula:'V = π × r² × h / 3', fields:[['r','Radius (r)'],['h','Height (h)']], note:'Enter perpendicular height, not slant height.'},
        {id:'frustum', name:'Conical Frustum', formula:'V = π × h × (R² + Rr + r²) / 3', fields:[['r','Top radius (r)'],['R','Bottom radius (R)'],['h','Height (h)']], note:'A truncated cone with parallel circular ends. Either radius may be larger.'},
        {id:'ellipsoid', name:'Ellipsoid', formula:'V = 4/3 × π × a × b × c', fields:[['a','Semi-axis (a)'],['b','Semi-axis (b)'],['c','Semi-axis (c)']], note:'Enter half of each full axis length, not the full widths.'},
        {id:'cap', name:'Spherical Cap', formula:'V = π × h² × (3R − h) / 3', fields:[['R','Sphere radius (R)'],['h','Cap height (h)']], note:'R is the parent sphere radius, not the cap base radius. Height must be at most 2R.'},
        {id:'tube', name:'Tube', formula:'V = π × h × (R² − r²)', fields:[['R','Outer radius (R)'],['r','Inner radius (r)'],['h','Length (h)']], note:'Calculates tube material volume, excluding the hollow center. Inner radius must be smaller than outer radius.'}
    ];
    function calculate(id, values, inputUnits, outputUnit) {
        const shape = shapes.find(s => s.id === id);
        if (!shape || !Object.hasOwn(units, outputUnit)) throw Error('Choose a valid shape and result unit.');
        const v = {};
        for (const [key,label] of shape.fields) {
            const raw = values[key];
            const n = typeof raw === 'number' ? raw : typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : NaN;
            if (!Number.isFinite(n) || n <= 0) throw Error(`${label} must be a finite number greater than zero.`);
            if (!Object.hasOwn(units,inputUnits[key])) throw Error(`Choose a valid unit for ${label}.`);
            // Convert lengths to the selected output unit before cubing, preserving same-unit precision.
            v[key] = n * (units[inputUnits[key]] / units[outputUnit]);
            if (!Number.isFinite(v[key]) || v[key] <= 0) throw Error('These dimensions exceed the supported numerical range. Use less extreme values.');
        }
        if (id === 'cap' && v.h / v.R > 2) throw Error('Cap height cannot exceed twice the sphere radius.');
        if (id === 'tube' && v.r >= v.R) throw Error('Inner radius must be smaller than outer radius.');
        let value;
        switch (id) {
            case 'cube': value = Math.pow(v.a,3); break;
            case 'rectangular': value = v.l * v.w * v.h; break;
            case 'cylinder': value = Math.PI * Math.pow(v.r,2) * v.h; break;
            case 'sphere': value = 4 / 3 * Math.PI * Math.pow(v.r,3); break;
            case 'cone': value = Math.PI * Math.pow(v.r,2) * v.h / 3; break;
            case 'frustum': value = Math.PI * v.h * (v.R*v.R + v.R*v.r + v.r*v.r) / 3; break;
            case 'ellipsoid': value = 4 / 3 * Math.PI * v.a * v.b * v.c; break;
            case 'cap': value = Math.PI * v.h * v.h * (3*v.R-v.h) / 3; break;
            case 'tube': value = Math.PI * v.h * (v.R-v.r) * (v.R+v.r); break;
        }
        if (!Number.isFinite(value)) throw Error('The calculated volume is too large to display. Please enter smaller dimensions.');
        if (value <= 0) throw Error('The calculated volume is too small to represent. Please use less extreme dimensions.');
        const number = value < 0.005 ? Number(value.toPrecision(6)).toExponential() : value.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
        return {value, text:`${number} ${outputUnit}³`, dimensions:v};
    }
    const api = {units, shapes, calculate};
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.VolumeCards = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
