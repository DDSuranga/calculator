const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/Lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
 const context=await browser.newContext({serviceWorkers:'allow',permissions:['clipboard-read','clipboard-write']});
 await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1440,768,414,360])for(const dark of [false,true]){
  await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:5502/roof-pitch-calculator/');
  await page.evaluate(d=>document.body.classList.toggle('dark-mode',d),dark);
  assert.equal(await page.locator('#calculatorGuide details').count(),6);
  assert(await page.locator('#roofPitchCopy').isDisabled());
  await page.locator('#dynamic-roofRise').fill('6');await page.locator('#dynamic-roofRun').fill('12');
  await page.getByRole('button',{name:'Calculate Roof Pitch',exact:true}).click();
  assert.equal(await page.locator('#dynamicToolDisplay').inputValue(),'6:12');
  assert(await page.locator('#roofPitchCopy').isEnabled());
  assert.equal(await page.locator('.roof-pitch-main > div').count(),4);
  assert.match(await page.locator('#dynamicToolResult').innerText(),/26.57°/);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'overflow '+width);
  const box=await page.locator('#dynamic-roofRise').boundingBox();assert(box.y<900,'first input below viewport '+width);
  await page.screenshot({path:require('node:path').join(require('node:os').tmpdir(),`roof-pitch-${width}-${dark?'dark':'light'}.png`),fullPage:true});
 }
 await page.getByRole('button',{name:'Copy',exact:true}).click();assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/Roof Pitch: 6:12/);
 await page.locator('#dynamic-roofUnit').selectOption('cm');assert(await page.locator('#roofPitchCopy').isDisabled());await page.locator('#dynamic-roofRise').fill('15.24');await page.locator('#dynamic-roofRun').fill('30.48');await page.getByRole('button',{name:'Calculate Roof Pitch',exact:true}).click();assert.match(await page.locator('#dynamicToolResult').innerText(),/34.08 cm/);
 await page.locator('#dynamic-roofRun').fill('0');await page.getByRole('button',{name:'Calculate Roof Pitch',exact:true}).click();assert.match(await page.locator('#dynamicToolMessage').innerText(),/run must be greater/);assert(await page.locator('#roofPitchCopy').isDisabled());
 await page.getByRole('button',{name:'Clear',exact:true}).click();assert.equal(await page.locator('#dynamic-roofRise').inputValue(),'');assert(await page.locator('#roofPitchCopy').isDisabled());
 await page.reload();assert.equal(await page.locator('#dynamic-roofRun').count(),1);
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>navigator.serviceWorker.controller);
 await context.setOffline(true);await page.reload();await page.locator('#dynamic-roofRise').fill('3');await page.locator('#dynamic-roofRun').fill('4');await page.getByRole('button',{name:'Calculate Roof Pitch',exact:true}).click();assert.equal(await page.locator('#dynamicToolDisplay').inputValue(),'9:12');
 assert.deepEqual(errors,[]);console.log('PASS: desktop/tablet/414px/360px, both themes, no horizontal overflow, input above fold, results, Copy, validation, Clear, refresh, offline, no first-party JS exceptions.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
