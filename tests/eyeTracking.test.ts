import test from 'node:test';
import assert from 'node:assert/strict';
import {EYE_DEFAULTS,validateSettings} from '../src/services/eyeTrackingConfig';
import {CALIBRATION_TARGETS,extractEyeSample,poseMatches,chooseModel,fitModel,projectGaze,GazeSmoother,GazeDwell,detectTarget,collectionStats,measureRegion,distance,quantile} from '../src/services/eyeTrackingMath';
import type {EyeSample,LabeledSample,Landmark,FrameObservation,TargetRegion} from '../src/services/eyeTrackingMath';
import {previewPoint,sameGeometry,targetTolerance} from '../src/services/eyeTrackingDom';
import type {EyeGeometry} from '../src/services/eyeTrackingDom';
const pose={x:.5,y:.4,yaw:0,pitch:.5,roll:0,scale:.2};
const sample=(px:number,py:number,timestamp=0):EyeSample=>({px,py,timestamp,pose});
const region=(id:string,x=0,y=0,width=100,height=100):TargetRegion=>({id,slot:id,label:id,rect:{left:x,top:y,width,height}});
function groups(nonlinear=false){const map=new Map<string,LabeledSample[]>();for(const [i,target] of CALIBRATION_TARGETS.entries()){
 const invert=(v:number,c:number)=>(Math.sqrt(1+4*c*(v-.5))-1)/(2*c);
 const px=.5-.2*(nonlinear?invert(target.x,.3):target.x-.5),py=.02+.12*(nonlinear?invert(target.y,.4):target.y-.5);
 map.set(`train-${i}`,Array.from({length:24},(_,j)=>({sample:sample(px,py,j*40),target:{x:target.x*1280,y:target.y*900},targetId:`train-${i}`})));}return map;}
const model=chooseModel(groups(),{x:1280,y:900},EYE_DEFAULTS)!.model;
test('nine-point 3x3 CSS grid and configurable settings are explicit',()=>{
 assert.equal(CALIBRATION_TARGETS.length,9);assert.deepEqual([...new Set(CALIBRATION_TARGETS.map(p=>p.x))].sort(),[.1,.5,.9]);assert.equal(EYE_DEFAULTS.dwellMs,900);assert.equal(EYE_DEFAULTS.settleMs,700);assert.equal(EYE_DEFAULTS.validCollectionMs,1200);assert.throws(()=>validateSettings({dwellMs:-1}));
});
test('balanced regularized model keeps affine unless held-out data supports curvature',()=>{
 const affine=chooseModel(groups(),{x:1280,y:900},EYE_DEFAULTS)!;assert.equal(affine.model.kind,'affine');
 const complex=chooseModel(groups(true),{x:1280,y:900},EYE_DEFAULTS)!;assert.equal(complex.model.kind,'quadratic');assert.ok(complex.comparison.quadraticP90Px!<complex.comparison.affineP90Px*.9);
 for(const g of groups().values()){const p=g[0];assert.ok(distance(projectGaze(affine.model,p.sample.px,p.sample.py),p.target)<3);}
});
test('target contribution is balanced and insufficient feature variation is rejected',()=>{
 const data=[...groups().values()].flat(),base=fitModel(data,'affine')!;const repeated=fitModel([...data,...Array.from({length:400},()=>data[0])],'affine')!;
 assert.ok(Math.abs(base.x[1]-repeated.x[1])<1e-6);
 assert.equal(fitModel(data.map(d=>({...d,sample:{...d.sample,px:.5,py:.02}})),'affine'),null);
 assert.equal(fitModel(data.map(d=>({...d,sample:{...d.sample,py:d.sample.px}})),'quadratic'),null);
});
test('One Euro reduces fixation jitter without stacking heavy filters',()=>{
 const filter=new GazeSmoother(),raw:number[]=[],filtered:number[]=[];
 for(let i=0;i<180;i++){const x=500+Math.sin(i*2)*12,p=filter.update({x,y:400},i*33);if(i>40){raw.push(Math.abs(x-500));if(p)filtered.push(Math.abs(p.x-500));}}
 assert.ok(quantile(filtered,.9)<quantile(raw,.9)*.6);
 assert.equal(filter.update({x:NaN,y:0},6000),null);
});
test('isolated spikes pause, sustained saccades move, and long gaps reinitialize',()=>{
 const f=new GazeSmoother();f.update({x:100,y:100},0);assert.equal(f.update({x:900,y:600},33),null);let p=f.update({x:100,y:100},66)!;assert.ok(distance(p,{x:100,y:100})<1);
 let arrived=0;for(let t=99;t<500;t+=33){p=f.update({x:700,y:400},t)!;if(p&&distance(p,{x:700,y:400})<12&&!arrived)arrived=t;}
 assert.ok(arrived>0&&arrived-99<250);assert.deepEqual(f.update({x:400,y:200},2000),{x:400,y:200});assert.equal(f.update({x:400,y:200},2000),null);
});
test('900 ms dwell uses valid elapsed time and only fires once per fixation',()=>{
 const d=new GazeDwell(),a=region('A'),p={x:50,y:50};let fires=0;
 for(let t=0;t<=3000;t+=100){const r=d.update(a,p,t);if(r.fire){assert.equal(t,900);fires++;}}
 assert.equal(fires,1);for(let t=3100;t<=3400;t+=100)d.update(null,{x:200,y:200},t);
 for(let t=3500;t<=4500;t+=100)if(d.update(a,p,t).fire)fires++;assert.equal(fires,2);
});
test('switching, invalid observations, stale gaps and question changes reset dwell',()=>{
 const d=new GazeDwell(),a=region('A'),b=region('B',120),pa={x:50,y:50},pb={x:170,y:50};
 for(let t=0;t<900;t+=100)d.update(a,pa,t);assert.equal(d.update(b,pb,900).progress,0);assert.equal(d.update(b,pb,1000).fire,false);
 d.update(null,pb,1100,false);assert.equal(d.update(b,pb,1200).progress,0);assert.equal(d.update(b,pb,2000).progress,0);
 d.setContext('new-question');assert.equal(d.update(a,pa,2100).progress,0);
 assert.equal(d.update(a,pa,2100).fire,false);
});
test('disabled/disappeared target does not rearm until physical gaze leaves it',()=>{
 const d=new GazeDwell(),a=region('A'),p={x:50,y:50};for(let t=0;t<=900;t+=100)d.update(a,p,t);
 for(let t=1000;t<2000;t+=100)d.update(null,p,t);for(let t=2000;t<3300;t+=100)assert.equal(d.update(a,p,t).fire,false);
});
test('acquisition areas remain non-overlapping with modest retention hysteresis',()=>{
 const a=region('A'),b=region('B',120);assert.equal(detectTarget({x:103,y:50},[a,b],'A')?.id,'A');assert.equal(detectTarget({x:110,y:50},[a,b],'A'),null);assert.equal(detectTarget({x:125,y:50},[a,b],'A')?.id,'B');assert.equal(detectTarget({x:100,y:50},[a,region('B',100)],'A'),null);
});
test('collection rejects duplicate predictions and missing/stale frames never contribute time',()=>{
 const frames:FrameObservation[]=[{frameId:1,videoTime:1,timestamp:0,sample:sample(.5,.02)},{frameId:1,videoTime:1,timestamp:40,sample:sample(.5,.02)},{frameId:2,videoTime:2,timestamp:80,sample:null},{frameId:3,videoTime:3,timestamp:120,sample:sample(.5,.02)},{frameId:4,videoTime:4,timestamp:160,sample:sample(.5,.02)}];
 const stats=collectionStats(frames,180);assert.equal(stats.total,4);assert.equal(stats.valid.length,3);assert.equal(stats.validMs,40);assert.equal(stats.validFraction,.75);
});
test('independent region measurement is immutable and depends on real target dimensions',()=>{
 const target={x:640,y:450},frames=Array.from({length:40},(_,i)=>({frameId:i+1,videoTime:i/25,timestamp:i*40,sample:sample(.5-.006,.02,i*40)}));
 const before=JSON.stringify(model),small=region('A',600,428,80,44),large=region('A',500,350,280,200);
 const a=measureRegion(model,frames,target,small,EYE_DEFAULTS,'A','A',targetTolerance(small,[small]))!,b=measureRegion(model,frames,target,large,EYE_DEFAULTS,'A','A',targetTolerance(large,[large]))!;
 assert.equal(a.passed,false);assert.equal(b.passed,true);assert.equal(JSON.stringify(model),before);assert.ok(a.p90Px>25);assert.equal(a.validFraction,1);assert.ok(a.effectiveHz>20);
});
test('preview mirroring and letterboxing do not change native inference coordinates',()=>{
 assert.deepEqual(previewPoint({x:0,y:0},{width:640,height:480},{width:320,height:320},true),{x:320,y:40});assert.deepEqual(previewPoint({x:640,y:480},{width:640,height:480},{width:320,height:320},false),{x:320,y:280});
});
test('geometry detects DPR, viewport, camera, orientation and visual viewport changes',()=>{
 const g:EyeGeometry={width:1280,height:900,dpr:1,visualWidth:1280,visualHeight:900,offsetX:0,offsetY:0,scale:1,orientation:0,cameraId:'one',videoWidth:640,videoHeight:480};assert.ok(sameGeometry(g,{...g}));
 for(const change of [{dpr:2},{width:1000},{cameraId:'two'},{orientation:90},{scale:1.2},{offsetX:20},{visualHeight:650}])assert.equal(sameGeometry(g,{...g,...change}),false);
});
function face():Landmark[]{const points=Array.from({length:478},()=>({x:.5,y:.5,z:0})),put=(i:number,x:number,y:number)=>{points[i]={x:x/640,y:y/480,z:0};};for(const [a,b,top,bottom,iris,left] of [[33,133,159,145,468,200],[362,263,386,374,473,360]]){put(a,left,200);put(b,left+80,200);put(top,left+40,188);put(bottom,left+40,212);put(iris,left+40,200);}put(1,320,280);return points;}
test('eye-local iris features normalize translation, scale and roll; blinks are not gaze',()=>{
 const original=face(),a=extractEyeSample(original,640,480,0).sample!;assert.ok(a);
 const transformed=original.map(p=>{const x=p.x*640-320,y=p.y*480-240;return {x:(350+1.1*(x*Math.cos(.1)-y*Math.sin(.1)))/640,y:(250+1.1*(x*Math.sin(.1)+y*Math.cos(.1)))/480};});const b=extractEyeSample(transformed,640,480,0).sample!;assert.ok(Math.abs(a.px-b.px)<1e-8&&Math.abs(a.py-b.py)<1e-8);
 original[159]=original[145];assert.equal(extractEyeSample(original,640,480,0).sample,null);assert.equal(extractEyeSample([],640,480,0).face,false);assert.equal(poseMatches({...pose,yaw:.5},pose),false);
});
