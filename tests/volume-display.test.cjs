const test = require('node:test');
const assert = require('node:assert/strict');
const harness = require('./roof-pitch-harness.cjs');

function setup(shape, dimensions, unit = 'cm') {
    const h = harness();
    h.inputs({volumeShapeInput: shape, volumeUnitInput: unit});
    dimensions.forEach((value, i) => h.inputs({[['volumeDimensionOneInput', 'volumeDimensionTwoInput', 'volumeDimensionThreeInput'][i]]: value}));
    h.context.calculateVolume();
    return h;
}

test('Small nonzero volume remains visible in display, breakdown and Copy', async () => {
    const h = setup('cube', [0.01]);
    assert.equal(h.el('volumeDisplay').value, '1e-6 cm³');
    assert.match(h.el('volumeResult').innerHTML, /1e-6 cm³/);
    await h.context.copyVolumeResult();
    assert.match(h.copied(), /Volume: 1e-6 cm³/);
});

test('Overflow replaces previous result with friendly validation and clears Copy data', () => {
    const h = setup('cube', [2]);
    h.inputs({volumeDimensionOneInput: '1e150'});
    h.context.calculateVolume();
    assert.equal(h.el('volumeDisplay').value, 'Check inputs');
    assert.match(h.el('volumeResult').innerHTML, /too large.*smaller dimensions/i);
    assert.doesNotMatch(h.el('volumeResult').innerHTML, /Infinity|NaN|∞/);
    assert.equal(h.run('latestVolumeResultText'), '');
});

test('Normal shape results and unit labels retain existing two-decimal formatting', () => {
    for (const [shape, values, expected] of [
        ['rectangular', [2, 3, 4], '24.00'], ['cube', [2], '8.00'],
        ['cylinder', [2, 3], '37.70'], ['sphere', [2], '33.51'], ['cone', [2, 3], '12.57'],
        ['rectangular', [0.005, 1, 1], '0.01'], ['cube', [1000], '1,000,000,000.00']
    ]) {
        for (const unit of ['cm', 'm', 'in', 'ft']) {
            assert.equal(setup(shape, values, unit).el('volumeDisplay').value, `${expected} ${unit}³`);
        }
    }
});

test('Existing empty, zero and negative validation remains intact', () => {
    for (const value of ['', 0, -1]) {
        assert.equal(setup('cube', [value]).el('volumeDisplay').value, 'Check inputs');
    }
});
