import test from 'node:test';
import assert from 'node:assert/strict';
import { EyeTrackingEngine } from '../src/services/eyeTrackingService';
import { CALIBRATION_TARGETS, VALIDATION_TARGETS } from '../src/services/eyeTrackingMath';
import type { EyeTrackingState } from '../src/services/eyeTrackingService';

test('engine calibration, cancellation and camera lifecycle with simulated browser and iris landmarks', async (t) => {
  const names=['window','document','navigator','localStorage','performance','requestAnimationFrame','cancelAnimationFrame','setTimeout'] as const;
  const original=new Map(names.map(name=>[name,Object.getOwnPropertyDescriptor(globalThis,name)]));
  const nativeTimeout=setTimeout;let now=0,stops=0,opens=0,models=0,step=0,missing=false,validationOffset=false;
  const memory=new Map<string,string>();let callback:(results:any)=>void=()=>{};
  let getCamera=async()=>{opens++;return stream;};
  const track={stop(){stops++;},getSettings(){return {deviceId:'test-camera'};},addEventListener(){}};
  const stream={getTracks(){return [track];},getVideoTracks(){return [track];}};
  const put=(name:string,value:unknown)=>Object.defineProperty(globalThis,name,{value,configurable:true,writable:true});
  const landmarks=()=>{
    if(missing)return [];
    const target=[...CALIBRATION_TARGETS,...VALIDATION_TARGETS][step]||CALIBRATION_TARGETS[0];
    const px=.5-(target.x-.5)*.2+(target.y-.5)*.02+(validationOffset&&step>=9?.018:0),py=.02+(target.y-.5)*.12;
    const points=Array.from({length:478},()=>({x:.5,y:.5,z:0}));
    const p=(i:number,x:number,y:number)=>{points[i]={x:x/640,y:y/480,z:0};};
    for(const [a,b,top,bottom,iris,left] of [[33,133,159,145,468,200],[362,263,386,374,473,360]]){
      p(a,left,200);p(b,left+80,200);p(top,left+40,188);p(bottom,left+40,212);p(iris,left+80*px,200+80*py);
    }p(1,320,280);return [points];
  };
  class Mesh {constructor(){models++;}setOptions(){}onResults(cb:any){callback=cb;}send(){return Promise.resolve();}close(){return Promise.resolve();}}
  put('window',{innerWidth:1280,innerHeight:900,FaceMesh:Mesh});
  put('document',{hidden:false,elementFromPoint:()=>null,createElement:()=>({playsInline:true,muted:true,srcObject:null,videoWidth:640,videoHeight:480,currentTime:0,readyState:2,play:async()=>{},pause(){}})});
  put('navigator',{mediaDevices:{getUserMedia:()=>getCamera()}});
  put('localStorage',{getItem:(k:string)=>memory.get(k)||null,setItem:(k:string,v:string)=>memory.set(k,v)});
  put('performance',{now:()=>now});put('requestAnimationFrame',()=>1);put('cancelAnimationFrame',()=>{});
  // Advance simulated camera time per calibration wait, delivering a fresh observation each tick.
  put('setTimeout',(cb:()=>void,ms:number)=>nativeTimeout(()=>{now+=ms;callback({multiFaceLandmarks:landmarks()});cb();},0));
  try {
    await t.test('concurrent starts share a single camera and model; all targets plus validation are measured',async()=>{
      const engine=new EyeTrackingEngine();await Promise.all([engine.start(),engine.start()]);assert.equal(opens,1);assert.equal(models,1);
      const visited=new Set<number>();const ok=await engine.calibrate((i)=>{step=i;visited.add(i);});
      assert.equal(ok,true);assert.deepEqual([...visited],Array.from({length:13},(_,i)=>i));assert.equal(engine.isCalibrated(),true);
      const saved=JSON.parse(memory.get('teerms_eye_calibration_v3')!);assert.ok(saved.model.error<1e-6);assert.equal(saved.deviceId,'test-camera');
      assert.equal(saved.checks.length,4);assert.equal(new EyeTrackingEngine().isCalibrated(),false,'persisted data must not authorize a new camera session');
      let state:EyeTrackingState|undefined;engine.subscribe(s=>state=s);
      missing=true;callback({multiFaceLandmarks:landmarks()});assert.equal(state?.faceDetected,false);assert.equal(state?.isTracking,false);assert.equal(state?.dwellProgress,0);
      missing=false;engine.stop();assert.equal(stops,1);
    });
    await t.test('a model that fits training but points away at held-out locations is rejected',async()=>{
      const saved=memory.get('teerms_eye_calibration_v3');const engine=new EyeTrackingEngine();validationOffset=true;
      const ok=await engine.calibrate(i=>{step=i;});assert.equal(ok,false);assert.match(engine.getStatus(),/offset/);assert.equal(memory.get('teerms_eye_calibration_v3'),saved);assert.equal(engine.isCalibrated(),false);engine.stop();validationOffset=false;
    });
    await t.test('invalid measurements cannot replace a good saved calibration',async()=>{
      const saved=memory.get('teerms_eye_calibration_v3');const engine=new EyeTrackingEngine();missing=true;
      const ok=await engine.calibrate(i=>{step=i;});assert.equal(ok,false);assert.equal(memory.get('teerms_eye_calibration_v3'),saved);assert.match(engine.getStatus(),/find both eyes/);engine.stop();missing=false;
    });
    await t.test('cancelled calibration does not save or complete in the background',async()=>{
      const saved=memory.get('teerms_eye_calibration_v3');const engine=new EyeTrackingEngine();
      const ok=await engine.calibrate(i=>{step=i;engine.stop();});assert.equal(ok,false);assert.equal(memory.get('teerms_eye_calibration_v3'),saved);
    });
    await t.test('stopping during a pending camera request releases the late stream',async()=>{
      const engine=new EyeTrackingEngine();let release:(value:any)=>void=()=>{};
      getCamera=()=>new Promise(resolve=>{release=resolve;});
      const pending=engine.start();await Promise.resolve();await Promise.resolve();const before=stops;engine.stop();release(stream);
      assert.equal(await pending,false);assert.equal(stops,before+1);
    });
  } finally {
    for(const [name,descriptor] of original){if(descriptor)Object.defineProperty(globalThis,name,descriptor);else Reflect.deleteProperty(globalThis,name);}
  }
});
