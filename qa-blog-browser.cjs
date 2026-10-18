// Run with the existing Electron runtime; no extra package is required.
// ELECTRON_RUN_AS_NODE must be unset. Screenshots/user data are written outside the repository.
const {app,BrowserWindow,session}=require('electron');
const fs=require('fs'),path=require('path'),os=require('os'),assert=require('assert/strict');
const articles=require('./content/articles.json');
const output=fs.mkdtempSync(path.join(os.tmpdir(),'onlinecalmaster-blog-qa-'));
app.setPath('userData',path.join(output,'browser-data'));app.disableHardwareAcceleration();
app.whenReady().then(async()=>{
 const base='http://127.0.0.1:5501';const errors=[];let pages=0,offline=false;
 // Avoid local analytics traffic and ad requests. This suite verifies first-party behavior only.
 session.defaultSession.webRequest.onBeforeRequest((details,done)=>done({cancel:offline||(!details.url.startsWith(base)&&!details.url.startsWith('devtools:'))}));
 const win=new BrowserWindow({show:false,width:1440,height:1000,webPreferences:{nodeIntegration:false,contextIsolation:true,backgroundThrottling:false}});
 win.webContents.on('console-message',event=>{if(event.level==='error'&&!/ERR_BLOCKED_BY_CLIENT|ERR_INTERNET_DISCONNECTED/.test(event.message))errors.push(event.message);});
 const run=async s=>{try{return await win.webContents.executeJavaScript(s);}catch(e){console.error('Browser expression failed:',s,errors);throw e;}};
 const load=async p=>{await win.loadURL(base+p);await run('document.fonts.ready.then(()=>true)');};
 for(const width of [1440,390,320]){
  win.setContentSize(width,1000);
  for(const route of ['/blog/',...articles.map(a=>'/blog/'+a.slug+'/')]){
   await load(route);
   for(const theme of ['light','dark']){
    await run(`if(document.body.classList.contains('dark-mode')!==${theme==='dark'})document.getElementById('knowledge-theme').click();`);
    await run(`Promise.all(document.getAnimations().map(animation=>animation.finished)).then(()=>true)`);
    const state=await run(`({overflow:document.documentElement.scrollWidth>innerWidth+1,theme:document.body.classList.contains('dark-mode'),button:document.getElementById('knowledge-theme').textContent,main:!!document.querySelector('main h1'),font:parseFloat(getComputedStyle(document.querySelector('main p:not(.kb-category)')).fontSize)})`);
    assert(!state.overflow,`${width} ${route} horizontal overflow`);assert.equal(state.theme,theme==='dark');assert(state.main&&state.font>=16);pages++;
    if(theme==='light')assert.equal(await run(`getComputedStyle(document.querySelector('.top-nav a')).backgroundColor`),'rgba(0, 0, 0, 0)','Light navigation background');
    if((width===1440||width===390)&&(route==='/blog/'||route.includes('volume-common')||route.includes('how-emi-is')||route.includes('compound-interest-regular')))fs.writeFileSync(path.join(output,`${width}-${theme}-${route==='/blog/'?'index':route.split('/')[2]}.png`),(await win.webContents.capturePage()).toPNG());
    if(width===390&&route.includes('volume-common')){
     await run(`document.getElementById('formulas').scrollIntoView()`);await new Promise(resolve=>setTimeout(resolve,100));
     fs.writeFileSync(path.join(output,`${width}-${theme}-volume-diagram.png`),(await win.webContents.capturePage()).toPNG());
     await run('scrollTo(0,0)');
    }
   }
   await win.webContents.reload();
   await new Promise(resolve=>win.webContents.once('did-finish-load',resolve));
   assert(await run(`document.body.classList.contains('dark-mode')`),'theme did not persist');
  }
 }
 for(const width of [1440,390]){
  win.setContentSize(width,1000);
  for(const p of ['/','/age-calculator/','/volume-calculator/','/tip-calculator/','/percentage-change-calculator/','/date-difference-calculator/','/loan-emi-calculator/','/compound-interest-calculator/']){
   await load(p);assert(await run(`document.documentElement.scrollWidth<=innerWidth+1`),p+' overflow');
   assert(await run(`!!document.querySelector('a[href="/blog/"]')`));
  }
 }
 await load('/tip-calculator/');assert(await run(`billAmount.value='48';tipPercent.value='18';calculateTip();tipDisplay.value.includes('56.64')`));
 await run(`showCalculator('age');`);assert(await run(`document.getElementById('calculatorGuide').innerHTML.includes('/blog/how-to-calculate-age-from-date-of-birth/')`),'SPA guide link');
 await load('/volume-calculator/');
 for(const [shape,a,b,c,result] of [['rectangular',40,25,20,'20,000.00'],['cube',5,0,0,'125.00'],['cylinder',3,10,0,'282.74'],['sphere',3,0,0,'113.10'],['cone',3,10,0,'94.25']]){
  const actual=await run(`volumeShapeInput.value=${JSON.stringify(shape)};updateVolumeFields();document.getElementById('volumeDimensionOneInput').value=${a};document.getElementById('volumeDimensionTwoInput').value=${b};document.getElementById('volumeDimensionThreeInput').value=${c};calculateVolume();volumeDisplay.value;`);
  assert(actual.includes(result),shape+': '+actual);
 }
 await load('/blog/'+articles[0].slug+'/');await run(`navigator.serviceWorker.ready.then(()=>true)`);await load('/blog/'+articles[0].slug+'/');
 await run(`(async()=>{for(const k of await caches.keys())await(await caches.open(k)).delete('/blog/${articles[9].slug}/');return true;})()`);
 await session.defaultSession.clearCache();
 offline=true;
 await session.defaultSession.enableNetworkEmulation({offline:true});
 await load('/blog/'+articles[0].slug+'/');assert(await run(`document.querySelector('h1').textContent.includes('Calculate Age')`),'visited article offline');
 await load('/blog/'+articles[9].slug+'/');const offlineHeading=await run(`document.querySelector('h1').textContent`);assert(offlineHeading.includes('not saved offline'),'uncached article offline: '+offlineHeading);
 await load('/bmi-calculator/');assert(await run(`!!document.getElementById('mainCalculator')`),'calculator offline shell');
 offline=false;await session.defaultSession.disableNetworkEmulation();
 assert.deepEqual(errors,[],'First-party browser console errors');
 const result={result:'PASS',articleLayoutThemeChecks:pages,calculatorLayoutChecks:16,volumeExamples:5,consoleErrors:errors,offline:'visited article, unvisited article, calculator fallback',screenshots:output,thirdParty:'blocked locally; existing configuration preserved, account behavior not tested'};
 fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));win.destroy();app.quit();
}).catch(e=>{console.error(e.stack||e);app.exit(1);});
