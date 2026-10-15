import test from 'node:test';
import assert from 'node:assert/strict';
import {EyeTrackingEngine} from '../src/services/eyeTrackingService';
import type {CalibrationProgress,EyeTrackingState} from '../src/services/eyeTrackingService';

test('real engine orchestration with a simulated browser/camera (not measured webcam accuracy)',async t=>{
 const names=['window','document','navigator','screen','localStorage','performance','requestAnimationFrame','cancelAnimationFrame','setTimeout','setInterval','clearInterval','getComputedStyle'] as const;
 const originals=new Map(names.map(n=>[n,Object.getOwnPropertyDescriptor(globalThis,n)]));const nativeTimeout=setTimeout;
 let now=0,opens=0,models=0,stops=0,raf:FrameRequestCallback|null=null,callback:(r:any)=>void=()=>{},cameraTime=0,frameLatency=0,duplicate=false,missing=false,validationBias=0,overlay=true;
 let target={x:640,y:450},current:CalibrationProgress|null=null,failPoint:string|null=null;
 const timers=new Map<number,()=>void>();let timerId=0;
 const events=new Map<string,(()=>void)[]>(),memory=new Map<string,string>();
 const track={stop(){stops++;},getSettings(){return {deviceId:'simulated-camera'};},addEventListener(){}};
 const stream={getTracks:()=>[track],getVideoTracks:()=>[track]};let camera=async()=>{opens++;return stream;};
 const controls=['A','B','C','D','NEXT'].map((slot,i)=>({dataset:{choiceId:slot==='NEXT'?undefined:slot,action:slot==='NEXT'?'next-card':undefined,gazeContext:'q1',gazeLabel:slot},textContent:slot,
  matches:()=>false,getBoundingClientRect:()=>({left:400,top:180+i*135,width:480,height:100,right:880,bottom:280+i*135}),closest(){return this;}}));
 const doc:any={hidden:false,addEventListener:(n:string,fn:()=>void)=>events.set(n,[...(events.get(n)||[]),fn]),removeEventListener(){},querySelector:()=>null,querySelectorAll:()=>controls,
  elementFromPoint:(x:number,y:number)=>overlay?{closest:()=>null}:controls.find(c=>{const r=c.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;})||null,
  createElement:()=>video};
 const win:any={innerWidth:1280,innerHeight:900,devicePixelRatio:1,addEventListener:doc.addEventListener,removeEventListener(){}};
 const video:any={videoWidth:640,videoHeight:480,readyState:2,currentTime:0,srcObject:null,play:async()=>{},pause(){}};
 const landmarks=()=>{
  if(missing||current?.phase==='training'&&current.id===failPoint)return [];
  const px=.5-(target.x/win.innerWidth-.5)*.2+(current?.phase==='validation'?validationBias:0),py=.02+(target.y/win.innerHeight-.5)*.12;
  const points=Array.from({length:478},()=>({x:.5,y:.5,z:0}));const put=(i:number,x:number,y:number)=>{points[i]={x:x/640,y:y/480,z:0};};
  for(const [a,b,top,bottom,iris,left] of [[33,133,159,145,468,200],[362,263,386,374,473,360]]){put(a,left,200);put(b,left+80,200);put(top,left+40,188);put(bottom,left+40,212);put(iris,left+80*px,200+80*py);}put(1,320,280);return [points];
 };
 class Mesh{constructor(){models++;}setOptions(){}onResults(cb:any){callback=cb;}async send(){now+=frameLatency;const result={multiFaceLandmarks:landmarks()};callback(result);if(duplicate)callback(result);}async close(){}}
 win.FaceMesh=Mesh;
 const put=(n:string,value:unknown)=>Object.defineProperty(globalThis,n,{value,writable:true,configurable:true});
 put('window',win);put('document',doc);put('screen',{orientation:{angle:0}});put('navigator',{mediaDevices:{getUserMedia:()=>camera()}});put('localStorage',{getItem:(k:string)=>memory.get(k)||null,setItem:(k:string,v:string)=>memory.set(k,v)});put('performance',{now:()=>now});put('getComputedStyle',()=>({display:'block',visibility:'visible'}));
 put('requestAnimationFrame',(cb:FrameRequestCallback)=>{raf=cb;return 1;});put('cancelAnimationFrame',()=>{raf=null;});
 put('setInterval',(cb:()=>void)=>{const id=++timerId;timers.set(id,cb);return id;});put('clearInterval',(id:number)=>timers.delete(id));
 async function tick(ms=40,produce=true){now+=ms;cameraTime+=ms/1000;video.currentTime=cameraTime;if(produce&&raf){const cb=raf;raf=null;cb(now);await Promise.resolve();await Promise.resolve();await Promise.resolve();}for(const cb of timers.values())cb();}
 put('setTimeout',(fn:()=>void,ms:number)=>nativeTimeout(()=>{void tick(ms).then(fn);},0));
 const progress=(p:CalibrationProgress)=>{current=p;target=p.target;};
 const engines:EyeTrackingEngine[]=[];const engine=()=>{const e=new EyeTrackingEngine();engines.push(e);return e;};
 try{
  await t.test('one camera/model/loop, balanced distinct samples and independent actual-region validation',async()=>{
   const e=engine();const before=opens;await Promise.all([e.start(),e.start()]);assert.equal(opens,before+1);assert.equal(models,opens);
   duplicate=true;const ok=await e.calibrate(progress);duplicate=false;
   assert.equal(ok,true);const report=e.getReport()!;assert.equal(report.regions.length,10);assert.ok(report.regions.some(r=>r.slot==='A'));assert.equal(report.comparison?.selected,'affine');assert.equal(e.isCalibrated(),true);
   const data=JSON.parse(memory.get('teerms_eye_calibration_v4')!);assert.equal(data.fullValidated,true);assert.equal(data.model.kind,'affine');assert.equal((e as any).forceCompleteCalibration,undefined);
   assert.equal(new EyeTrackingEngine().isCalibrated(),false);e.stop();
  });
  await t.test('validation bias cannot train, correct or force-enable the model',async()=>{
   const e=engine();validationBias=.025;let before='';
   assert.equal(await e.calibrate(p=>{progress(p);if(p.phase==='validation'&&!before)before=JSON.stringify(e.getDraftModel());}),false);
   assert.equal(JSON.stringify(e.getDraftModel()),before);assert.equal(e.isCalibrated(),false);assert.ok(e.getReport()!.issues.some(s=>/p90/.test(s)));
   validationBias=0;e.stop();
  });
  await t.test('only unsuccessful training dots are reacquired and valid samples survive retry',async()=>{
   const e=engine();failPoint='train-2';const first=new Set<string>();assert.equal(await e.calibrate(p=>{progress(p);if(p.phase==='training')first.add(p.id);}),false);assert.equal(first.size,9);assert.deepEqual(e.getReport()!.failedTrainingIds,['train-2']);
   failPoint=null;const retried=new Set<string>();assert.equal(await e.calibrate(p=>{progress(p);if(p.phase==='training')retried.add(p.id);}),true);assert.deepEqual([...retried],['train-2']);e.stop();
  });
  await t.test('valid frame freshness, hidden pages, duplicate results, scrolling and context clear selection',async()=>{
   const e=engine();assert.equal(await e.calibrate(progress),true);overlay=false;doc.querySelector=(s:string)=>s==='[data-eye-calibration]'&&overlay?{}:null;current=null;target={x:640,y:230};let state:EyeTrackingState|undefined;e.subscribe(s=>state=s);let actions=0;e.setActionCallback(()=>actions++);e.setContext('q1');e.resume();
   for(let i=0;i<12;i++)await tick();assert.ok((state?.dwellProgress||0)>0);
   missing=true;await tick();assert.equal(state?.dwellProgress,0);assert.equal(state?.isTracking,false);missing=false;
   for(let i=0;i<5;i++)await tick();frameLatency=350;await tick();frameLatency=0;assert.equal(state?.isTracking,false);assert.equal(state?.dwellProgress,0);
   doc.hidden=true;await tick();assert.equal(state?.isTracking,false);doc.hidden=false;
   for(let i=0;i<6;i++)await tick();for(const cb of events.get('scroll')||[])cb();assert.equal(state?.dwellProgress,0);
   e.setContext('q2');assert.equal(actions,0);e.stop();overlay=true;
  });
  await t.test('major resizing invalidates the session and stops selection',async()=>{
   const e=engine();assert.equal(await e.calibrate(progress),true);win.innerWidth=1000;for(const cb of events.get('resize')||[])cb();assert.equal(e.isCalibrated(),false);assert.equal(e.resume(),false);win.innerWidth=1280;e.stop();
  });
  await t.test('guided test records incorrect, missed and correct attempts without answering reviewer questions',async()=>{
   const e=engine();assert.equal(await e.calibrate(progress),true);current=null;overlay=false;let actions=0;e.setActionCallback(()=>actions++);
   e.beginGuidedTest(['A','C'],'With glasses');target={x:640,y:365};for(let i=0;i<32;i++)await tick();assert.equal(e.getReport()!.guided[0]?.result,'incorrect');
   target={x:10,y:10};for(let i=0;i<210;i++)await tick();assert.ok(e.getReport()!.guided.some(r=>r.result==='missed'));assert.equal(actions,0);
   e.beginGuidedTest(['A'],'Normal head movement');target={x:640,y:230};for(let i=0;i<35;i++)await tick();assert.ok(e.getReport()!.guided.some(r=>r.result==='correct'));assert.equal(actions,0);e.stop();overlay=true;
  });
  await t.test('complete persisted model requires a fresh short check; failed full fit cannot bypass it',async()=>{
   const e=engine();await e.start();assert.equal(e.isCalibrated(),false);assert.equal(await e.calibrate(progress,{short:true}),true);assert.ok(e.getReport()!.baselineRegions?.some(r=>r.slot==='B'));
   overlay=false;current=null;target={x:640,y:365};let selected='';e.setActionCallback(a=>{selected=a.id||'';});e.resume();for(let i=0;i<30;i++)await tick();assert.equal(selected,'B');overlay=true;e.stop();
   const bad=engine();bad.discardCalibrationAttempt();assert.equal(await bad.calibrate(progress,{short:true}),false);bad.stop();
  });
  await t.test('stop while camera permission is pending releases the late stream',async()=>{
   const e=engine();let release:(s:any)=>void=()=>{};camera=()=>new Promise(r=>{release=r;});const pending=e.start();await Promise.resolve();await Promise.resolve();const before=stops;e.stop();release(stream);assert.equal(await pending,false);assert.equal(stops,before+1);
  });
 }finally{for(const e of engines)e.stop();for(const [n,d] of originals){if(d)Object.defineProperty(globalThis,n,d);else Reflect.deleteProperty(globalThis,n);}}
});
