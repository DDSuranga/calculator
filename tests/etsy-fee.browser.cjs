// Run against an HTTP preview of this worktree; no external requests or real analytics.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),os=require('node:os'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.argv[2]||'http://127.0.0.1:5503';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  // Without JavaScript, the delivered HTML must already hide the empty display.
  const staticContext=await browser.newContext({javaScriptEnabled:false});
  await staticContext.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
  const staticPage=await staticContext.newPage();await staticPage.goto(base+'/etsy-fee-calculator/');
  assert(await staticPage.locator('#dynamicToolDisplay').isHidden());
  assert.equal(await staticPage.locator('#dynamicToolDisplay').evaluate(el=>el.getBoundingClientRect().height),0);
  await staticContext.close();
  const context=await browser.newContext({permissions:['clipboard-read','clipboard-write'],serviceWorkers:'allow'});
  await context.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const fill=async values=>{for(const [key,value]of Object.entries(values))await page.locator('#dynamic-'+key).fill(value);};
  const example={etsyPrice:'30',etsyQuantity:'2',etsyUnitCost:'10',etsyShipping:'5',etsyShippingCost:'4',etsyWrap:'3',etsyWrapCost:'1',etsyTax:'5.44'};
  for(const width of [1440,768,414,360])for(const dark of [false,true]){
   await page.setViewportSize({width,height:900});assert.equal((await page.goto(base+'/etsy-fee-calculator/')).status(),200);
   await page.evaluate(d=>document.body.classList.toggle('dark-mode',d),dark);
   assert.equal(await page.locator('h1').innerText(),'Etsy Fee Calculator');
   assert.equal(await page.locator('#calculatorGuide details').count(),7);
   assert(await page.locator('#etsyFeeCopy').isDisabled());
   assert(await page.locator('#dynamicToolDisplay').isHidden());
   assert.equal(await page.locator('#dynamicToolDisplay').evaluate(el=>el.getBoundingClientRect().height),0);
   await fill(example);await page.locator('#dynamic-etsyPrice').press('Enter');
   assert.equal(await page.locator('#dynamicToolDisplay').inputValue(),'$35.73');
   assert(await page.locator('#dynamicToolDisplay').isVisible());
   assert.equal(await page.locator('.etsy-main > div').count(),6);
   assert.match(await page.locator('#dynamicToolResult').innerText(),/52.54%/);
   assert(await page.locator('#etsyFeeCopy').isEnabled());
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'overflow '+width);
   for(const input of await page.locator('.etsy-form input:visible,.etsy-form select:visible').all()){
    const b=await input.boundingBox();assert(b.width>0 && b.x>=0 && b.x+b.width<=width+1,'input clipped at '+width);
   }
   await page.screenshot({path:path.join(os.tmpdir(),`etsy-fee-${width}-${dark?'dark':'light'}.png`),fullPage:true});
  }
  // Enter is prevented on fields, never a reload; focused buttons retain their native action.
  await page.evaluate(()=>window.etsyNavigationSentinel=1);
  await page.locator('#dynamic-etsyTax').press('Enter');assert.equal(await page.evaluate(()=>window.etsyNavigationSentinel),1);
  await page.locator('#etsyFeeCopy').focus();await page.keyboard.press('Enter');
  assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/Estimated net profit: \$35.73/);
  await page.locator('#dynamic-etsyOffsite').selectOption('15');assert(await page.locator('#etsyFeeCopy').isDisabled());
  assert(await page.locator('#dynamicToolDisplay').isHidden());
  await page.getByRole('button',{name:'Calculate Etsy Profit',exact:true}).click();assert.equal(await page.locator('#dynamicToolDisplay').inputValue(),'$25.53');
  await fill({etsyQuantity:'0'});await page.locator('#dynamic-etsyQuantity').press('Enter');
  assert.match(await page.locator('#dynamicToolMessage').innerText(),/whole number/);assert(await page.locator('#etsyFeeCopy').isDisabled());
  assert(await page.locator('#dynamicToolDisplay').isHidden());
  await page.getByRole('button',{name:'Clear',exact:true}).focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('#dynamic-etsyPrice').inputValue(),'');assert.equal(await page.locator('#dynamic-etsyQuantity').inputValue(),'1');
  assert(await page.locator('#dynamicToolDisplay').isHidden());
  await page.locator('.etsy-settings summary').click();
  assert.equal(await page.locator('#dynamic-etsyTransactionRate').inputValue(),'6.5');
  await fill(example);await page.locator('#dynamic-etsyConversion').check();await page.locator('#dynamic-etsyPrice').press('Enter');
  assert.equal(await page.locator('#dynamicToolDisplay').inputValue(),'$34.03');
  await page.reload();assert.equal(await page.locator('.etsy-form').count(),1);
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>navigator.serviceWorker.controller);
  await context.setOffline(true);await page.reload();await fill(example);await page.locator('#dynamic-etsyPrice').press('Enter');assert.equal(await page.locator('#dynamicToolDisplay').inputValue(),'$35.73');await context.setOffline(false);
  const registry=vm.runInNewContext(fs.readFileSync('script.js','utf8').match(/const calculatorData = (\[[\s\S]*?\n\]);/)[1]);
  for(const c of registry){assert.equal((await page.goto(base+'/'+c.slug+'/')).status(),200);assert.equal(await page.locator('h1').innerText(),c.title||c.name);assert(await page.locator('#'+c.elementId).isVisible());}
  // Same-document navigation exercises the shared panel after using Etsy.
  await page.goto(base+'/etsy-fee-calculator/');await page.locator('#calculatorList a[data-target="roofPitch"]').evaluate(el=>el.click());
  assert(await page.locator('#dynamicToolDisplay').isVisible());
  await page.locator('#dynamic-roofRise').fill('6');await page.locator('#dynamic-roofRun').fill('12');await page.getByRole('button',{name:'Calculate Roof Pitch',exact:true}).click();assert.equal(await page.locator('#dynamicToolDisplay').inputValue(),'6:12');
  await page.locator('#calculatorList a[data-target="etsyFee"]').evaluate(el=>el.click());await fill(example);await page.locator('#dynamic-etsyPrice').press('Enter');assert.equal(await page.locator('#dynamicToolDisplay').inputValue(),'$35.73');
  assert.deepEqual(errors,[]);
  console.log('PASS: 42 browser routes; Etsy desktop/tablet/414/360, both themes, unclipped fields, Enter/no reload, Copy, Clear, validation, editable fees, conversion, SPA navigation, offline and no first-party JS exceptions. Screenshots: '+os.tmpdir());
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
