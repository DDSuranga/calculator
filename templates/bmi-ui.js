document.addEventListener('DOMContentLoaded', () => {
    const form=document.getElementById('bmi-interactive-form');
    if(!form)return;
    const el=id=>document.getElementById('bi-'+id), model=window.BmiInteractive;
    let copyText='', heightUnit='cm', weightUnit='kg';
    const clamp=v=>Math.max(10,Math.min(45,v));
    const category=v=>model.categories.find(c=>v<c.max);
    const values=()=>({age:el('age').value,height:el('height').value,weight:el('weight').value,heightUnit:el('height-unit').value,weightUnit:el('weight-unit').value});
    const svg=(tag,attrs)=>{const n=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));return n;};
    const boundaries=[10,18.5,25,30,35,40,45];
    const point=v=>{const a=Math.PI+(clamp(v)-10)/35*Math.PI;return [160+130*Math.cos(a),155+130*Math.sin(a)];};
    const chartY=v=>148-(clamp(v)-10)/35*125;
    const chartX=cm=>38+(Math.max(40,Math.min(280,cm))-40)/240*265;
    const colors=['#35a9f5','#58cb32','#ffc819','#ff8a14','#e63051','#9f173f'];
    model.categories.forEach((c,i)=>{
        const [x,y]=point(boundaries[i]),[xx,yy]=point(boundaries[i+1]);
        el('arcs').append(svg('path',{d:`M${x} ${y}A130 130 0 0 1 ${xx} ${yy}`,fill:'none',stroke:colors[i],'stroke-width':30}));
        const outer=v=>{const [x,y]=point(v);return [160+(x-160)*1.20,155+(y-155)*1.20];};
        const [ox,oy]=outer(boundaries[i]),[ex,ey]=outer(boundaries[i+1]),id='bi-gauge-label-'+i;
        el('arcs').append(svg('path',{id,d:`M${ox} ${oy}A156 156 0 0 1 ${ex} ${ey}`,fill:'none'}));
        const title=svg('text',{'text-anchor':'middle',class:'bmi-arc-label'}),textPath=svg('textPath',{href:'#'+id,startOffset:'50%'});textPath.textContent=['Underweight','Healthy','Overweight','Class 1','Class 2','Class 3'][i];title.append(textPath);el('arcs').append(title);
        if(i>0){const [tx,ty]=point(boundaries[i]);const label=svg('text',{x:160+(tx-160)*.75,y:155+(ty-155)*.75,'text-anchor':'middle'});label.textContent=boundaries[i];el('arcs').append(label);}
        el('chart-zones').append(svg('rect',{x:38,y:chartY(boundaries[i+1]),width:265,height:chartY(boundaries[i])-chartY(boundaries[i+1]),fill:colors[i],opacity:.16}));
    });
    for(const v of [10,20,25,30,40,45]) {
        el('chart-axis').append(svg('line',{x1:38,x2:303,y1:chartY(v),y2:chartY(v),stroke:'#a6bdd4','stroke-opacity':'.45'}));
        const label=svg('text',{x:30,y:chartY(v)+4,'text-anchor':'end'});label.textContent=v;el('chart-axis').append(label);
    }
    for(const v of [50,100,150,200,250]) {const label=svg('text',{x:chartX(v),y:165,'text-anchor':'middle'});label.textContent=v;el('chart-axis').append(label);}
    const axisTitle=svg('text',{x:170,y:185,'text-anchor':'middle'});axisTitle.textContent='Height (cm)';el('chart-axis').append(axisTitle);
    const reference=svg('line',{id:'bi-reference-line',x1:38,x2:303,y1:chartY(22),y2:chartY(22),stroke:'#64748b','stroke-dasharray':'4 4'});el('chart-zones').append(reference);
    function explore(){const v=Number(el('explore').value);reference.setAttribute('y1',chartY(v));reference.setAttribute('y2',chartY(v));el('zone-description').textContent=`Reference BMI ${v.toFixed(1)}: ${category(v).label}. Not an additional measurement.`;}
    el('explore').addEventListener('input',explore);
    const pictures=new Map();
    function picture(src){if(!pictures.has(src))pictures.set(src,new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=src;}));return pictures.get(src);}
    let illustrationVersion=0;
    function illustration(){
        const version=++illustrationVersion,age=Number(el('age').value),selected=form.elements.avatar.value;
        let bmi=null;
        try{bmi=model.calculate(values()).bmi;}catch{}
        const visual=window.BmiCharacters.select(age,bmi);
        for(const person of document.querySelectorAll('[data-character]')){
            const sex=person.dataset.character,src='/assets/bmi/characters/'+sex+'-'+visual.band+'-'+visual.build+'.webp';
            person.classList.toggle('is-selected',sex===selected);
            person.hidden=sex!==selected;
            const fallback=person.querySelector('img');fallback.src=src;
            person.querySelector('.bmi-character-label').textContent=sex===selected?(sex==='male'?'Male':'Female')+' · '+(Number.isInteger(age)&&age>=2&&age<=120?age+' years':'select age'):(sex==='male'?'Male':'Female');
            const canvas=person.querySelector('canvas');
            canvas.setAttribute('aria-label',(sex==='male'?'Male':'Female')+' '+visual.band+' illustrative character; not a body prediction');
            picture(src).then(image=>{
                if(version!==illustrationVersion)return;
                const ctx=canvas.getContext('2d'),previous=document.createElement('canvas');previous.width=420;previous.height=780;previous.getContext('2d').drawImage(canvas,0,0);
                const start=performance.now(),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
                const scale=Math.min(visual.height/image.height,400/image.width),w=image.width*scale,h=image.height*scale;
                function draw(now){
                    if(version!==illustrationVersion)return;
                    const t=reduce?1:Math.min(1,(now-start)/260);
                    ctx.clearRect(0,0,420,780);ctx.globalAlpha=1-t;ctx.drawImage(previous,0,0);ctx.globalAlpha=t;
                    ctx.drawImage(image,(420-w)/2,770-h,w,h);ctx.globalAlpha=1;
                    canvas.hidden=false;fallback.hidden=true;canvas.dataset.band=visual.band;canvas.dataset.build=visual.build;
                    if(t<1)requestAnimationFrame(draw);else canvas.dataset.ready=src;
                }
                requestAnimationFrame(draw);
            }).catch(()=>{if(version===illustrationVersion){canvas.hidden=true;fallback.hidden=false;}});
        }
        el('avatar-caption').textContent=(selected==='male'?'Male':'Female')+' illustration selected';
    }
    function limits(){
        for(const [field,min,max,base]of [['height',50,250,'cm'],['weight',2,400,'kg']]){el(field).min=model.convert(min,base,el(field+'-unit').value,field);el(field).max=model.convert(max,base,el(field+'-unit').value,field);}
    }
    function invalidate(){
        for(const field of ['age','height','weight']){el(field+'-error').textContent='';el(field).removeAttribute('aria-invalid');}
        copyText='';el('copy').disabled=true;el('result').hidden=true;el('empty').hidden=false;el('point').setAttribute('hidden','');
        el('detail-category').textContent='—';el('range').textContent='—';el('pi').textContent='—';el('formula').textContent='BMI = kg ÷ m². Calculate to see your values.';
        el('message').textContent='';el('chart').setAttribute('aria-label','No current BMI plotted');
        const child=Number(el('age').value)<20;el('chart-zones').toggleAttribute('hidden',child);el('explore').disabled=child;
        el('zone-description').textContent=child?'Adult reference zones are not applied to children or teens.':'Explore a reference zone with the slider.';
        illustration();
    }
    form.addEventListener('input', e=>{
        if(e.target===el('age-range'))el('age').value=e.target.value;
        if(e.target===el('age')&&el('age').validity.valid)el('age-range').value=e.target.value;
        if(!e.target.matches('select'))update();
    });
    form.addEventListener('change',e=>{if(!e.target.matches('select'))update();});
    for(const type of ['height','weight'])el(type+'-unit').addEventListener('change',()=>{
        const old=type==='height'?heightUnit:weightUnit,next=el(type+'-unit').value;
        el(type).value=model.convert(el(type).value,old,next,type);
        if(type==='height')heightUnit=next;else weightUnit=next;
        limits();update();
    });
    form.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('input[type=number]')){e.preventDefault();e.stopPropagation();form.requestSubmit();}});
    function update(focusErrors=false){
        try{
            const r=model.calculate(values());
            for(const field of ['age','height','weight']){el(field+'-error').textContent='';el(field).removeAttribute('aria-invalid');}
            el('message').textContent='';el('explore').disabled=!r.adult;
            el('zone-description').textContent=r.adult?'Explore a reference zone with the slider.':'Adult reference zones are not applied to children or teens.';
            el('empty').hidden=true;el('result').hidden=false;
            el('score').textContent=`${r.bmi.toFixed(2)} kg/m²`;el('gauge-value').textContent=r.bmi.toFixed(2);
            el('category').style.backgroundColor=r.adult?r.category.color:'';el('category').style.color=r.adult?'#fff':'';
            el('category').textContent=r.adult?r.category.label:'Age-specific assessment needed';
            el('detail-category').textContent=r.adult?r.category.label:'Age-specific assessment';el('gauge').toggleAttribute('hidden',!r.adult);el('chart-zones').toggleAttribute('hidden',!r.adult);
            el('interpretation').textContent=r.adult?'Adult screening category, based on unrounded BMI. This is not a diagnosis.':'For ages 2–19, this number needs an age- and sex-specific BMI-for-age assessment. No adult category or weight range is assigned.';
            el('needle').style.transform=`rotate(${(clamp(r.bmi)-10)/35*180}deg)`;
            el('gauge').setAttribute('aria-label',`BMI ${r.bmi.toFixed(2)}: ${r.category?.label||'no adult category'}`);
            el('formula').textContent=`${r.kg.toFixed(3)} kg ÷ (${r.m.toFixed(4)} m × ${r.m.toFixed(4)} m) = ${r.bmi.toFixed(2)} kg/m². Calculations use unrounded conversions.`;
            const divisor=weightUnit==='lb'?.45359237:1;
            el('range').textContent=r.adult?`${(r.low/divisor).toFixed(2)} – < ${(r.high/divisor).toFixed(2)} ${weightUnit}`:'Not assigned under 20';
            el('pi').textContent=r.adult?r.pi.toFixed(2):'Not interpreted under 20';
            el('point').toggleAttribute('hidden',!r.adult);el('point').setAttribute('transform',`translate(${chartX(r.m*100)} ${chartY(r.bmi)})`);
            el('chart').setAttribute('aria-label',r.adult?`Current BMI ${r.bmi.toFixed(2)} shown against adult reference zones; no history.`:'Adult graph not applied under age 20.');
            copyText=`BMI: ${r.bmi.toFixed(2)} kg/m²\n${el('category').textContent}\n${el('formula').textContent}\n${r.adult?'Adult reference weight: '+el('range').textContent+' (rounded boundaries, not a personal target).\nPonderal Index: '+r.pi.toFixed(2)+' kg/m³.':'No adult category or reference weight for ages under 20.'}\nScreening information only; not a diagnosis.`;
            el('copy').disabled=false;illustration();
        }catch(error){
            invalidate();
            if(error.fields){for(const [field,message]of Object.entries(error.fields)){el(field+'-error').textContent=message;el(field).setAttribute('aria-invalid','true');}if(focusErrors)el(Object.keys(error.fields)[0]).focus();el('message').textContent='Please check the highlighted fields.';}else el('message').textContent=error.message;
        }
    }
    form.addEventListener('submit',e=>{e.preventDefault();update(true);});
    form.addEventListener('reset',()=>{setTimeout(()=>{heightUnit='cm';weightUnit='kg';limits();invalidate();},0);});
    el('copy').addEventListener('click',async()=>{if(!copyText)return;try{await navigator.clipboard.writeText(copyText);el('message').textContent='Result copied.';}catch{el('message').textContent='Copy is unavailable. Select and copy the visible result.';}});
    limits();update();
});
