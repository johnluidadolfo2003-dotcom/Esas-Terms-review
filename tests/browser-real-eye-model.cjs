/* Real MediaPipe model smoke test with a supplied face photo streamed as camera video.
   It establishes model loading/detection, not physical webcam or screen-gaze accuracy. */
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const {readFileSync}=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
 if(!process.env.EYE_TEST_IMAGE)throw new Error('Set EYE_TEST_IMAGE to a local, clear face photograph. Run npm run build first.');
 const photograph=readFileSync(process.env.EYE_TEST_IMAGE);
 const server=spawn(process.execPath,['server.js'],{env:{...process.env,PORT:'3113'},stdio:['ignore','pipe','pipe']});let browser;
 try{
  await new Promise((resolve,reject)=>{server.stdout.on('data',d=>{if(d.toString().includes('3113'))resolve();});server.once('error',reject);setTimeout(()=>reject(new Error('Server startup timed out')),15000).unref();});
  browser=await chromium.launch({args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],assets=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().includes('/eye-model/'))assets.push({url:r.url(),status:r.status()});});
  await page.route('**/*',route=>{
   if(route.request().url().endsWith('/__eye-test-photo'))return route.fulfill({body:photograph,contentType:'image/jpeg'});
   if(!route.request().url().startsWith('http://127.0.0.1:3113/'))return route.abort();
   return route.continue();
  });
  await page.addInitScript(()=>{
   navigator.mediaDevices.getUserMedia=async()=>{
    const image=new Image();image.src='/__eye-test-photo';await image.decode();
    const canvas=document.createElement('canvas');canvas.width=640;canvas.height=480;const ctx=canvas.getContext('2d');
    const draw=()=>{ctx.fillStyle='black';ctx.fillRect(0,0,640,480);const scale=Math.min(640/image.width,480/image.height);ctx.drawImage(image,(640-image.width*scale)/2,(480-image.height*scale)/2,image.width*scale,image.height*scale);};
    draw();const timer=setInterval(draw,33),stream=canvas.captureStream(30);stream.getVideoTracks()[0].addEventListener('ended',()=>clearInterval(timer));return stream;
   };
  });
  await page.goto('http://127.0.0.1:3113/');await page.locator('button[aria-label="Toggle Eye Gaze Answer Control"]:visible').first().click();
  await page.getByText('Camera and fresh eye samples ready',{exact:true}).waitFor({timeout:60000});
  const diagnostic=await page.getByLabel('Eye detection diagnostics').innerText();
  assert.match(diagnostic,/Face: detected/);assert.match(diagnostic,/Landmarks: 478\/478/);
  assert.equal(await page.getByLabel('Detected eye landmarks').locator('circle').count(),12);
  assert.ok(assets.some(r=>r.url.endsWith('.wasm')));assert.ok(assets.every(r=>r.status===200));assert.deepEqual(errors,[]);
  await page.evaluate(()=>{HTMLVideoElement.prototype.requestVideoFrameCallback=function(){return 999;};HTMLVideoElement.prototype.cancelVideoFrameCallback=function(){};});
  await page.getByRole('button',{name:'Restart camera',exact:true}).click();
  await page.getByText('Camera and fresh eye samples ready',{exact:true}).waitFor({timeout:15000});
  assert.deepEqual(errors,[]);
  console.log('Stalled native video-frame callbacks recovered through the distinct-video-time fallback.');
  console.log('Real local MediaPipe model loaded with all third-party requests blocked; photo video produced fresh, usable iris samples. '+diagnostic.split('\n').slice(0,2).join(' '));
  console.log('Photo-stream detection is not a physical webcam or calibrated gaze-accuracy measurement.');
 }finally{await browser?.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
