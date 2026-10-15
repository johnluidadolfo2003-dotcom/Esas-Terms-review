/* Browser regression uses fake video and synthetic iris landmarks. It does not measure physical webcam accuracy. */
const {chromium}=require('playwright');const {spawn}=require('node:child_process');const assert=require('node:assert/strict');
(async()=>{
 const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','3107'],{cwd:process.cwd(),stdio:['ignore','pipe','pipe']});let browser;
 try{
  await new Promise((resolve,reject)=>{server.stdout.on('data',d=>{if(d.toString().includes('3107'))resolve();});server.once('error',reject);setTimeout(()=>reject(new Error('Vite startup timed out')),15000).unref();});
  browser=await chromium.launch({headless:true,args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--no-sandbox']});
  const context=await browser.newContext({permissions:['camera'],viewport:{width:1440,height:1100}}),page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   window.__models=0;window.__manualGaze=null;window.__faceLost=false;
   window.FaceMesh=class{constructor(){window.__models++;}setOptions(){}onResults(cb){this.cb=cb;}close(){return Promise.resolve();}
    async send(){
     if(window.__faceLost){this.cb({multiFaceLandmarks:[]});return;}
     let point=window.__manualGaze||{x:innerWidth/2,y:innerHeight/2};
     const dot=document.querySelector('[aria-label="Confirm gaze target"]');if(dot){const r=dot.getBoundingClientRect();point={x:r.left+r.width/2,y:r.top+r.height/2};}
     const guide=document.querySelector('[data-gaze-guide]');if(guide){const text=guide.innerText.match(/Look at (\w+)/),button=text&&guide.querySelector(`[data-gaze-test-target="${text[1]}"]`);if(button){const r=button.getBoundingClientRect();point={x:r.left+r.width/2,y:r.top+r.height/2};}}
     const px=.5-(point.x/innerWidth-.5)*.2,py=.02+(point.y/innerHeight-.5)*.12;
     const points=Array.from({length:478},()=>({x:.5,y:.5,z:0}));const put=(i,x,y)=>points[i]={x:x/640,y:y/480,z:0};
     for(const [a,b,top,bottom,iris,left] of [[33,133,159,145,468,200],[362,263,386,374,473,360]]){put(a,left,200);put(b,left+80,200);put(top,left+40,188);put(bottom,left+40,212);put(iris,left+80*px,200+80*py);}put(1,320,280);this.cb({multiFaceLandmarks:[points]});
    }};
  });
  await page.goto('http://127.0.0.1:3107/');await page.locator('button[aria-label="Toggle Eye Gaze Answer Control"]:visible').first().click();
  const modal=page.getByRole('dialog',{name:'Eye gaze setup and calibration'});await modal.waitFor();
  await page.getByText('Camera and fresh eye samples ready',{exact:true}).waitFor({timeout:15000});
  assert.equal(await page.getByLabel('Mirrored camera preview').evaluate(el=>!!el.srcObject),true);
  assert.equal(await page.getByRole('button',{name:/force|finish immediately/i}).count(),0);
  if(process.env.EYE_QUICK==='1'){
   await page.getByRole('button',{name:'Start eye control',exact:true}).click();await modal.waitFor({state:'hidden',timeout:45000});
   const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('teerms_eye_calibration_v4')));assert.equal(saved.report.profile,'quick');assert.equal(saved.model.kind,'affine');assert.equal(saved.report.regions.length,5);
   const panel=page.getByRole('dialog',{name:'Large eye selection targets'});await panel.waitFor();const a=panel.locator('[data-choice-id="A"]');
   const r=await a.boundingBox();await page.evaluate(p=>window.__manualGaze=p,{x:r.x+r.width/2,y:r.y+r.height/2});await page.waitForFunction(()=>document.querySelector('[data-gaze-panel] [data-choice-id="A"]')?.disabled,{timeout:5000});
   const before=await a.getAttribute('data-gaze-context');const n=await panel.locator('[data-action="next-card"]').boundingBox();await page.evaluate(p=>window.__manualGaze=p,{x:n.x+n.width/2,y:n.y+n.height/2});
   await page.waitForFunction(id=>document.querySelector('[data-gaze-panel] [data-choice-id="A"]')?.getAttribute('data-gaze-context')!==id,before,{timeout:6000});
   const after=await panel.locator('[data-choice-id="A"]').getAttribute('data-gaze-context');await page.waitForTimeout(1400);assert.equal(await panel.locator('[data-choice-id="A"]').getAttribute('data-gaze-context'),after,'one Next fixation must not skip multiple questions');
   assert.equal(await modal.isVisible(),false);assert.ok(await page.locator('[title="Turn off eye tracking"]').isVisible());assert.deepEqual(errors,[]);
   console.log('Quick browser flow passed: five-dot affine setup, only five independent control checks, automatic start, actual gaze answer and Next actions, no repeated Next activation and no recalibration between questions. Synthetic camera input only.');return;
  }
  await page.getByLabel('Detailed nine-point setup (optional)').check();await page.getByLabel(/Wait for tap/).check();await page.getByLabel(/Record diagnostic/).check();
  await page.getByRole('button',{name:'Start nine-point calibration'}).click();
  let last='',start=Date.now();
  while(Date.now()-start<65000){
   if(await page.getByText('Independent checks passed for the tested regions.',{exact:true}).count())break;
   const header=await modal.locator('p').first().textContent().catch(()=> '');
   if(header&&/^(Calibration|Independent check) \d+\//.test(header)&&header!==last){last=header;await page.keyboard.press('Enter');}
   await new Promise(r=>setTimeout(r,100));
  }
  if(!await page.getByText('Independent checks passed for the tested regions.',{exact:true}).count()){await page.screenshot({path:'/tmp/gaze-browser-failure.png'});throw new Error('Calibration did not pass: '+await modal.innerText());}
  await page.getByText('Independent checks passed for the tested regions.',{exact:true}).waitFor({timeout:1000});
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('teerms_eye_calibration_v4')));assert.equal(saved.version,4);assert.equal(saved.report.comparison.selected,'affine');assert.ok(saved.report.regions.some(r=>r.slot==='A'));assert.ok(saved.report.regions.every(r=>r.passed));assert.equal(await page.evaluate(()=>window.__models),1);
  await page.screenshot({path:'/tmp/gaze-results.png',fullPage:true});
  await page.getByLabel('Test condition').selectOption('With glasses');await page.getByRole('button',{name:'Start guided test'}).click();
  await page.getByText(/5 correct · 0 incorrect · 0 missed/).waitFor({timeout:15000});
  assert.equal(await page.locator('[data-choice-id]:disabled').count(),0,'guided test must not answer the reviewer');
  await page.getByRole('button',{name:'Use eye control',exact:true}).click();await modal.waitFor({state:'hidden'});
  await page.getByRole('button',{name:'Pause',exact:true}).click();await page.getByRole('button',{name:'Resume',exact:true}).click();
  await page.evaluate(()=>window.__faceLost=true);await page.getByText('Face not detected. Face the camera and check front lighting.',{exact:true}).waitFor();await page.evaluate(()=>window.__faceLost=false);
  await page.setViewportSize({width:1200,height:900});await page.getByText(/geometry changed|recalibrate|unverified/i).first().waitFor({timeout:3000});
  await page.locator('button[title="Turn off eye tracking"]').click();
  await page.evaluate(()=>{const original=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);let fail=true;navigator.mediaDevices.getUserMedia=(constraints)=>{if(fail){fail=false;return Promise.reject(new DOMException('Denied for regression','NotAllowedError'));}return original(constraints);};});
  await page.locator('button[aria-label="Toggle Eye Gaze Answer Control"]:visible').first().click();
  await page.getByRole('alert').filter({hasText:'Camera permission denied'}).waitFor();
  await page.getByRole('button',{name:'Retry camera',exact:true}).click();
  await page.getByText('Camera and fresh eye samples ready',{exact:true}).waitFor({timeout:15000});
  assert.deepEqual(errors,[]);
  console.log('Browser regression passed: camera setup/preview, keyboard dot confirmation, nine-point calibration, independent CSS-region metrics, one model instance, guided 5/5 synthetic selections without reviewer side effects, pause/resume, face loss, resizing, permission-denied recovery. This is not a real-camera accuracy result.');
 }finally{await browser?.close();server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
