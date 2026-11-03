const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=process.argv[2] || 'http://127.0.0.1:5517';
const examples=[['cube',{a:'2'},'8.00 cm³'],['rectangular',{l:'2',w:'3',h:'4'},'24.00 cm³'],['cylinder',{r:'2',h:'3'},'37.70 cm³'],['sphere',{r:'2'},'33.51 cm³'],['cone',{r:'2',h:'3'},'12.57 cm³'],['frustum',{r:'1',R:'3',h:'6'},'81.68 cm³'],['ellipsoid',{a:'2',b:'3',c:'4'},'100.53 cm³'],['cap',{R:'3',h:'1'},'8.38 cm³'],['tube',{R:'3',r:'2',h:'5'},'78.54 cm³']];
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  const context=await browser.newContext({permissions:['clipboard-read','clipboard-write']});
  await context.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  for(const width of [360,414,768,1440,1800]) for(const dark of [false,true]) {
   await page.setViewportSize({width,height:1000});
   assert.equal((await page.goto(base+'/volume-calculator/')).status(),200);
   await page.evaluate(d=>{document.body.classList.toggle('dark-mode',d);document.body.classList.toggle('light-mode',!d);},dark);
   assert.equal(await page.locator('h1').count(),1);
   assert.equal(await page.locator('.volume-shape-form').count(),9);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   for(const [id,values,expected]of examples) {
    const form=page.locator(`[data-shape="${id}"]`);
    assert(await form.locator('output').isHidden());assert(await form.locator('[data-copy]').isDisabled());
    await form.locator('[type=submit]').click();assert.match(await form.locator('[role=status]').innerText(),/greater than zero/);
    for(const [key,value]of Object.entries(values)) await form.locator(`[name="${key}"]`).fill(value);
    await form.locator('input').last().press('Enter');
    assert.equal(await form.locator('output').innerText(),expected);
    await form.locator('[data-copy]').click();await page.waitForFunction(id=>document.querySelector('[data-shape="'+id+'"] [role=status]').textContent==='Result copied.',id);assert((await page.evaluate(()=>navigator.clipboard.readText())).includes(expected));
    await form.locator('[type=reset]').click();assert(await form.locator('output').isHidden());assert(await form.locator('[data-copy]').isDisabled());
    for(const field of await form.locator('input,select,button').all()) assert(await field.evaluate(el=>{const r=el.getBoundingClientRect(),f=el.closest('form').getBoundingClientRect();return r.width>0&&r.left>=f.left-1&&r.right<=f.right+1;}));
   }
  }
  const cube=page.locator('[data-shape=cube]');
  for(const [input,result]of [['0.01','1e-6 cm³'],['1000','1,000,000,000.00 cm³']]){await cube.locator('[name=a]').fill(input);await cube.locator('[name=a]').press('Enter');assert.equal(await cube.locator('output').innerText(),result);}
  await cube.locator('[name=a]').fill('1e150');await cube.locator('[name=a]').press('Enter');assert.match(await cube.locator('[role=status]').innerText(),/too large/);assert(await cube.locator('output').isHidden());
  const rect=page.locator('[data-shape=rectangular]');
  await rect.locator('[name=l]').fill('1');await rect.locator('[name=lUnit]').selectOption('m');await rect.locator('[name=w]').fill('100');await rect.locator('[name=h]').fill('100');await rect.locator('[name=resultUnit]').selectOption('m');await rect.locator('[name=h]').press('Enter');assert.equal(await rect.locator('output').innerText(),'1.00 m³');
  await page.locator('#calculatorList a[data-target=basic]').evaluate(el=>el.click());
  await page.waitForSelector('#basicCalculator');assert(await page.locator('#basicCalculator').isVisible());assert.equal(await page.evaluate(()=>document.body.classList.contains('volume-page-active')),false);
  await page.locator('#calculatorList a[data-target=volume]').evaluate(el=>el.click());await page.waitForSelector('.volume-shape-form');assert(await page.locator('[data-shape=cube]').isVisible());
  await page.goto(base+'/basic-calculator/');await page.locator('#calculatorList a[data-target=volume]').evaluate(el=>el.click());await page.waitForSelector('.volume-shape-form');assert.equal(new URL(page.url()).pathname,'/volume-calculator/');
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>navigator.serviceWorker.controller);
  await context.setOffline(true);await page.reload();await page.locator('[data-shape=cube] [name=a]').fill('2');await page.locator('[data-shape=cube] [name=a]').press('Enter');assert.equal(await page.locator('[data-shape=cube] output').innerText(),'8.00 cm³');await context.setOffline(false);
  if(process.env.VOLUME_SCREENSHOTS) {
   for(const [name,width,dark]of [['after-desktop',1600,false],['after-mobile',390,false],['after-dark',1600,true]]) {
    await page.setViewportSize({width,height:1100});await page.goto(base+'/volume-calculator/');await page.evaluate(d=>{document.body.classList.toggle('dark-mode',d);document.body.classList.toggle('light-mode',!d);},dark);
    await page.screenshot({path:path.join(process.env.VOLUME_SCREENSHOTS,name+'.png'),fullPage:true});
   }
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: nine cards × five widths × both themes; known examples, Enter, Copy, Clear, field bounds, empty validation; small/overflow results, mixed units, SPA/direct navigation, offline and no first-party exceptions.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
