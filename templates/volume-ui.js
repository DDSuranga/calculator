document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('volumeCalculator');
    const sync = () => document.body.classList.toggle('volume-page-active', panel.style.display !== 'none');
    sync();
    new MutationObserver(sync).observe(panel, {attributes:true, attributeFilter:['style']});
    let highlightedCard;
    let highlightTimer;
    document.querySelectorAll('.volume-formulas a').forEach(link => {
        link.addEventListener('click', event => {
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            const heading = document.getElementById(new URL(link.href).hash.slice(1));
            const card = heading?.closest('.volume-shape-form');
            if (!card) return;
            // Keep fragment navigation local despite the site's root base URL.
            event.preventDefault();
            clearTimeout(highlightTimer);
            highlightedCard?.classList.remove('volume-card-selected');
            highlightedCard = card;
            card.classList.add('volume-card-selected');
            heading.tabIndex = -1;
            heading.focus({preventScroll: true});
            card.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start'});
            highlightTimer = setTimeout(() => card.classList.remove('volume-card-selected'), 2200);
        });
    });
    const guide = document.getElementById('calculatorGuide');
    const updateUnitNote = () => {
        if (panel.style.display === 'none') return;
        const old = 'Selecting a unit labels the inputs and result; it does not convert dimensions entered in different units.';
        const walker = document.createTreeWalker(guide, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            if (node.textContent.includes(old)) node.textContent = node.textContent.replace(old, 'Each card converts the dimension units you select into the chosen result unit before calculating volume.');
        }
    };
    updateUnitNote();
    new MutationObserver(updateUnitNote).observe(guide, {childList:true, subtree:true});
    document.querySelectorAll('.volume-shape-form').forEach(form => {
        const shape = VolumeCards.shapes.find(s => s.id === form.dataset.shape);
        const output = form.querySelector('output');
        const message = form.querySelector('.volume-card-message');
        const breakdown = form.querySelector('.volume-breakdown');
        const copy = form.querySelector('[data-copy]');
        let copyText = '';
        let revision = 0;
        const invalidate = () => {
            revision++;
            copyText = ''; copy.disabled = true; output.hidden = true;
            output.textContent = ''; message.textContent = ''; breakdown.textContent = '';
            form.querySelectorAll('input').forEach(input => input.removeAttribute('aria-invalid'));
        };
        form.addEventListener('input', invalidate);
        form.addEventListener('change', event => {
            if (event.target.matches('select')) invalidate();
        });
        form.addEventListener('reset', invalidate);
        form.addEventListener('keydown', event => {
            if (event.key === 'Enter' && !event.isComposing && event.target.matches('input')) {
                event.preventDefault();
                event.stopPropagation();
                form.requestSubmit();
            }
        });
        form.addEventListener('submit', event => {
            event.preventDefault(); invalidate();
            const values = {}, units = {};
            shape.fields.forEach(([key]) => {values[key]=form.elements[key].value; units[key]=form.elements[key+'Unit'].value;});
            try {
                const result = VolumeCards.calculate(shape.id, values, units, form.elements.resultUnit.value);
                output.textContent = result.text; output.hidden = false;
                breakdown.textContent = shape.formula + '. Dimensions in ' + form.elements.resultUnit.value + ': ' + shape.fields.map(([key]) => key+' = '+Number(result.dimensions[key].toPrecision(8))).join(', ') + '.';
                copyText = shape.name+' volume: '+result.text+'\n'+breakdown.textContent;
                copy.disabled = false;
            } catch (error) {
                message.textContent = error.message;
                const invalid = [...form.querySelectorAll('input')].find(input => input.value.trim()==='' || !Number.isFinite(Number(input.value)) || Number(input.value)<=0);
                if (invalid) {invalid.setAttribute('aria-invalid','true'); invalid.focus();}
            }
        });
        copy.addEventListener('click', async () => {
            if (!copyText) return;
            const current = revision;
            try {await navigator.clipboard.writeText(copyText); if(current===revision) message.textContent='Result copied.';}
            catch {if(current===revision) message.textContent='Copy is unavailable. Select the displayed result and copy it manually.';}
        });
    });
});
