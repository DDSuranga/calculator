const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
const base=process.argv[2]||'http://127.0.0.1:5501';
const examples=[['cube',{a:'2'},'8.00 cm³'],['rectangular',{l:'2',w:'3',h:'4'},'24.00 cm³'],['cylinder',{r:'2',h:'3'},'37.70 cm³'],['sphere',{r:'2'},'33.51 cm³'],['cone',{r:'2',h:'3'},'12.57 cm³'],['frustum',{r:'1',R:'3',h:'6'},'81.68 cm³'],['ellipsoid',{a:'2',b:'3',c:'4'},'100.53 cm³'],['cap',{R:'3',h:'1'},'8.38 cm³'],['tube',{R:'3',r:'2',h:'5'},'78.54 cm³']];
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});try{const c=await b.newContext({serviceWorkers:'block'});await c.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 for(const width of [390,1440])for(const dark of [false,true]){
  await p.setViewportSize({width,height:1000});await p.goto(base+'/volume-calculator/');await p.evaluate(d=>{document.body.classList.toggle('dark-mode',d);document.body.classList.toggle('light-mode',!d)},dark);
  assert.equal(await p.locator('h1').count(),1);assert.equal(await p.locator('#volume-education').count(),1);assert.match(await p.locator('.hero-subtitle').innerText(),/nine solids/);
  for(const [id,values,expected]of examples){const f=p.locator('[data-shape='+id+']');for(const [key,value]of Object.entries(values))await f.locator('[name='+key+']').fill(value);assert.equal(await f.locator('output').innerText(),expected);assert(await f.locator('[data-copy]').isEnabled());
   const input=f.locator('input').last();for(const bad of ['','0','-1','1e309']){await input.fill(bad);assert(await f.locator('output').isHidden());assert(await f.locator('[data-copy]').isDisabled());assert((await f.locator('[role=status]').innerText()).length>0);assert(await input.evaluate(e=>e===document.activeElement));}
   for(const [key,value]of Object.entries(values))await f.locator('[name='+key+']').fill(value);await input.press('Enter');assert.equal(await f.locator('output').innerText(),expected);await f.locator('[type=reset]').click();await f.locator('output').waitFor({state:'hidden'});
  }
  const cube=p.locator('[data-shape=cube]');await cube.locator('[name=a]').fill('0.01');assert.equal(await cube.locator('output').innerText(),'1e-6 cm³');await cube.locator('[name=a]').fill('1');await cube.locator('[name=aUnit]').selectOption('m');await cube.locator('[name=resultUnit]').selectOption('m');assert.equal(await cube.locator('output').innerText(),'1.00 m³');await cube.locator('[name=resultUnit]').selectOption('cm');assert.equal(await cube.locator('output').innerText(),'1,000,000.00 cm³');
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if(process.env.VOLUME_SCREENSHOTS)await p.screenshot({path:process.env.VOLUME_SCREENSHOTS+'/volume-'+width+'-'+dark+'.png',fullPage:true});
 }
 assert.deepEqual(errors,[]);console.log('PASS: all nine live updates, units, invalid/empty/extreme input, focus, Enter, Clear, guide, desktop/mobile/light/dark and no JS exceptions.');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
