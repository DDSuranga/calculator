const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  for(const width of [360,1600]) for(const reducedMotion of ['no-preference','reduce']) {
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto((process.argv[2]||'http://localhost:5532')+'/volume-calculator/');
   await page.locator('.volume-shape-form').first().waitFor();
   await page.locator('#vc-cube-a').fill('3');
   await page.locator('[data-shape="cube"] .volume-calculate').click();
   const originalResult=await page.locator('[data-shape="cube"] output').textContent();
   let navigations=0;page.on('framenavigated',f=>{if(f===page.mainFrame())navigations++});
   await page.evaluate(()=>{window.scrollCalls=[];const original=Element.prototype.scrollIntoView;Element.prototype.scrollIntoView=function(options){window.scrollCalls.push(options);return original.call(this,options)}});
   for(const shape of ['cube','rectangular','cylinder','sphere','cone','frustum','ellipsoid','cap','tube']) {
    const link=page.locator('.volume-formulas a[href$="#volume-card-'+shape+'"]');
    assert.equal(await link.count(),1);
    assert.equal(await link.evaluate(a=>new URL(a.href).pathname),'/volume-calculator/');
    for(const keyboard of [false,true]) {
     if(keyboard){await link.scrollIntoViewIfNeeded();await link.focus();await page.keyboard.press('Enter')}else await link.click();
     await page.waitForFunction(id=>{const r=document.querySelector('[data-shape='+id+']').getBoundingClientRect();return r.top>=105&&r.top<=115},shape);
     await page.waitForTimeout(250);
     assert.equal(new URL(page.url()).pathname,'/volume-calculator/');
     assert.equal(await page.locator('#volumeCalculator').isVisible(),true);
     assert.equal(await page.locator('#volume-card-'+shape).evaluate(e=>e===document.activeElement),true);
     const card=page.locator('[data-shape="'+shape+'"]');
     assert(await card.evaluate(e=>e.classList.contains('volume-card-selected')));
     assert(await card.evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.top<innerHeight}));
     assert.equal(await page.locator('#vc-cube-a').inputValue(),'3');
     assert.equal(await page.locator('[data-shape="cube"] output').textContent(),originalResult);
    }
   }
   assert.equal(navigations,0);
   assert(await page.evaluate(expected=>scrollCalls.every(c=>c.behavior===expected),reducedMotion==='reduce'?'instant':'smooth'));
   await page.waitForFunction(()=>!document.querySelector('.volume-card-selected'));
   assert.equal(await page.locator('.volume-card-selected').count(),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.deepEqual(errors,[]);await page.close();
   console.log('PASS all nine links, mouse/Enter, focus, scroll, highlight, preserved input/result, no navigation/errors:',width,reducedMotion);
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});


