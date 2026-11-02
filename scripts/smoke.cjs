const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../dist');
const output=process.env.QA_OUTPUT||'/tmp/uva-launch-qa';
fs.mkdirSync(output,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.svg':'image/svg+xml','.pdf':'application/pdf'};
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(!url.pathname.startsWith('/uva-engineering/')){res.writeHead(404).end();return}
 const file=path.resolve(root,decodeURIComponent(url.pathname.slice('/uva-engineering/'.length))||'index.html');
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return}
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'text/plain'});
 if(req.method==='HEAD'){res.end();return}fs.createReadStream(file).pipe(res);
});
(async()=>{
 let browser;
 try{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const url=`http://127.0.0.1:${server.address().port}/uva-engineering/`;
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();const errors=[],failed=[];const requests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url())});page.on('request',r=>requests.push(r.url()));
  await page.goto(url+'#research');
  assert.equal(await page.locator('#previewGate').isVisible(),true);
  assert.equal(await page.locator('#app').innerHTML(),'');
  assert.ok(!requests.some(u=>/\/(data|app)\.js/.test(u)));
  await page.locator('#previewPassword').fill('wrong');await page.locator('#previewSubmit').click();
  assert.equal(await page.locator('#previewPassword').getAttribute('aria-invalid'),'true');
  await page.locator('#previewPassword').fill('');
  await page.screenshot({path:path.join(output,'password-desktop.png')});
  await page.locator('#previewPassword').fill('uva');await page.locator('#previewSubmit').click();
  await page.waitForFunction(()=>document.getElementById('previewGate').hidden);
  await page.waitForFunction(()=>document.getElementById('currentTitle').textContent==='Faculty and Research');
  await page.locator('#sectionTrigger').hover();assert.equal(await page.locator('#sectionPanel').evaluate(el=>el.inert),false);
  await page.screenshot({path:path.join(output,'folio-desktop.png')});
  await page.locator('[data-section-link="6"]').click();await page.waitForFunction(()=>document.getElementById('currentTitle').textContent==='Entrepreneurship and Innovation Partnerships');
  await page.reload();await page.waitForFunction(()=>document.getElementById('previewGate').hidden);
  await page.locator('#sectionTrigger').focus();await page.keyboard.press('ArrowDown');await page.keyboard.press('End');
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.sectionLink),'13');await page.keyboard.press('Escape');
  await page.locator('#openSearch').click();await page.locator('#searchInput').fill('revenue');await page.locator('.search-result[href="#operations"]').click();
  assert.ok(page.url().endsWith('#operations'));
  for(let i=0;i<4;i++){
   await page.locator(`[data-team="${i}"]`).click();assert.equal(await page.locator(`[data-team="${i}"]`).getAttribute('aria-pressed'),'true');
   await page.locator(`[data-venture="${i}"]`).click();assert.equal(await page.locator(`[data-venture="${i}"]`).getAttribute('aria-pressed'),'true');
  }
  await page.locator('#researchNext').click();assert.equal(await page.locator('#researchCounter').innerText(),'02 / 04');
  await page.mouse.move(0,0);await page.locator('.revenue-row[data-rev="0"]').focus();
  assert.equal(await page.locator('#revenueCategory').innerText(),await page.evaluate(()=>window.UVA_REPORT.revenue[0].name));
  await page.locator('[data-person="1"]').click();assert.ok(await page.locator('#leaderDetail').evaluate(e=>e.classList.contains('visible')));await page.locator('#leaderClose').click();
  // Validate every rendered image, including lazy-loaded chapter and portrait images.
  await page.evaluate(()=>{document.querySelectorAll('img').forEach(img=>img.loading='eager')});
  await page.waitForFunction(()=>Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0));
  assert.equal(await page.locator('.chapter-rail,[data-page]').count(),0);
  for(const width of [1440,1024,768,390,320]){
   await page.setViewportSize({width,height:844});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}`);
  }
  assert.equal((await page.request.head(url+'assets/ImpactReport26_Complete.pdf')).status(),200);
  await page.locator('#lockPreview').click();await page.waitForSelector('#previewGate');assert.equal(await page.locator('#app').innerHTML(),'');
  await page.screenshot({path:path.join(output,'password-small.png')});
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  mobile.on('pageerror',e=>errors.push(e.message));await mobile.goto(url);await mobile.locator('#previewPassword').fill('uva');await mobile.locator('#previewSubmit').tap();
  await mobile.waitForFunction(()=>document.getElementById('previewGate').hidden);
  await mobile.locator('#sectionTrigger').tap();await mobile.locator('[data-section-link="5"]').tap();
  await mobile.waitForFunction(()=>document.getElementById('currentTitle').textContent==='Faculty and Research');
  await mobile.screenshot({path:path.join(output,'folio-mobile.png')});
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  console.log('PASS: password gate, wrong-password handling, delayed loading, session persistence, locking, deep links, Folio hover/tap/keyboard navigation, search, stories, chart, leadership, all images, PDF, project-subpath hosting, 320–1440px layouts; no errors or missing assets.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
