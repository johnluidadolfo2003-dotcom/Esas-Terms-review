import test from 'node:test';
import assert from 'node:assert/strict';
import { CALIBRATION_TARGETS, VALIDATION_TARGETS, accuracyPasses, correctConsistentOffset, measureGazeAccuracy, measureRenderedGazeAccuracy, recentFixationFrames, extractEyeSample, fitCalibration, GazeConfidence, GazeDwell, GazeSmoother, poseMatches, projectGaze, summarizeFixation } from '../src/services/eyeTrackingMath';
import type { EyeSample, Landmark } from '../src/services/eyeTrackingMath';
const pose={x:.5,y:.4,yaw:0,pitch:.5,roll:0,scale:.2};
const sample=(px:number,py:number,timestamp=0):EyeSample=>({px,py,pose,timestamp});
const training=CALIBRATION_TARGETS.map(p=>sample(.5-(p.x-.5)*.2+(p.y-.5)*.02,.02+(p.y-.5)*.12));
test('nine-point fit learns individual sensitivity, direction and cross-axis skew',()=>{
 const model=fitCalibration(training);assert.ok(model);
 for(let i=0;i<CALIBRATION_TARGETS.length;i++){const gaze=projectGaze(model,training[i].px,training[i].py);assert.ok(Math.abs(gaze.x-CALIBRATION_TARGETS[i].x)<1e-8);assert.ok(Math.abs(gaze.y-CALIBRATION_TARGETS[i].y)<1e-8);}
 const gaze=projectGaze(model,.5-(.6-.5)*.2+(.7-.5)*.02,.02+(.7-.5)*.12);assert.ok(Math.hypot(gaze.x-.6,gaze.y-.7)<1e-8);
});
test('corner measurements influence the fitted map instead of just using center',()=>{
 const original=fitCalibration(training)!;
 const wide=fitCalibration(training.map(s=>({...s,px:.5+(s.px-.5)*2})))!;
 assert.ok(Math.abs(projectGaze(original,.53,.02).x-projectGaze(wide,.53,.02).x)>.07);
});
test('reject degenerate and inconsistent calibration, too few samples and non-finite values',()=>{
 assert.equal(fitCalibration(Array.from({length:9},()=>sample(.5,.5))),null);
 assert.equal(fitCalibration(training.slice(0,4)),null);
 assert.equal(fitCalibration(training.map(s=>({...s,px:NaN}))),null);
 const shuffled=[...training];[shuffled[1],shuffled[2]]=[shuffled[2],shuffled[1]];
 assert.equal(fitCalibration(shuffled),null);
});
test('fixation rejects unstable data and missing eyes; trims isolated outliers',()=>{
 assert.equal(summarizeFixation([]),null);
 assert.equal(summarizeFixation(Array.from({length:30},(_,i)=>sample(.3+i*.015,.02))),null);
 const stable=Array.from({length:25},(_,i)=>sample(.5+Math.sin(i)*.002,.02,i*50));stable.push(sample(.8,.4,1250));
 assert.ok(summarizeFixation(stable));
 assert.equal(extractEyeSample([],640,480,0).face,false);
});
test('stationary jitter and a single spike do not vibrate the cursor; intentional movement still works',()=>{
 const filter=new GazeSmoother();let p={x:500,y:400};
 filter.update(p,0);
 for(let i=1;i<120;i++){p=filter.update({x:500+Math.sin(i)*4,y:400+Math.cos(i)*4},i*33);assert.ok(Math.hypot(p.x-500,p.y-400)<6);}
 p=filter.update({x:1100,y:20},120*33);assert.ok(Math.hypot(p.x-500,p.y-400)<6);
 for(let i=121;i<151;i++)p=filter.update({x:900,y:650},i*33);
 assert.ok(Math.hypot(p.x-900,p.y-650)<8);
});
test('filter response is time-based across camera frame rates',()=>{
 for(const fps of [15,30,60]){const f=new GazeSmoother();f.update({x:500,y:300},1);let p={x:0,y:0};for(let n=1;n<=fps;n++)p=f.update({x:800,y:500},1+n*1000/fps);assert.ok(Math.hypot(p.x-800,p.y-500)<8);}
});
test('dwell cannot fire from stale frames, target changes, gaze jumps, or repeated staring',()=>{
 const d=new GazeDwell(),p={x:100,y:100};let fires=0;
 for(let t=1;t<3000;t+=33)if(d.update('q1:A','A',p,t).fire)fires++;
 assert.equal(fires,1);
 // Disabling a just-selected button is not the same as looking away.
 for(let t=3001;t<4000;t+=33)assert.equal(d.update(null,null,p,t).fire,false);
 // Even a new question in the same slot requires looking away.
 for(let t=4001;t<5000;t+=33)assert.equal(d.update('q2:A','A',p,t).fire,false);
 for(let t=5001;t<5300;t+=33)d.update(null,null,{x:300,y:300},t);
 for(let t=5301;t<6600;t+=33)if(d.update('q2:A','A',p,t).fire)fires++;
 assert.equal(fires,2);
 d.clear();d.update('A','A',p,1);assert.equal(d.update('A','A',p,1300).fire,false);
 d.clear();for(let t=1;t<1300;t+=33)assert.equal(d.update(t%2?'A':'B',t%2?'A':'B',p,t).fire,false);
 d.clear();for(let t=1;t<1300;t+=33)assert.equal(d.update('A','A',{x:t,y:100},t).fire,false);
});
test('detection loss resets dwell and pose changes pause control',()=>{
 const d=new GazeDwell(),p={x:100,y:100};for(let t=1;t<1000;t+=33)d.update('A','A',p,t);
 d.reset();assert.equal(d.update('A','A',p,1100).progress,0);
 assert.ok(poseMatches(pose,pose));assert.equal(poseMatches({...pose,yaw:.3},pose),false);assert.equal(poseMatches({...pose,scale:.3},pose),false);
});
function face():Landmark[]{
 const points=Array.from({length:478},()=>({x:.5,y:.5,z:0}));
 const put=(index:number,x:number,y:number)=>points[index]={x:x/640,y:y/480,z:0};
 for(const [a,b,top,bottom,iris,left] of [[33,133,159,145,468,200],[362,263,386,374,473,360]]){put(a,left,200);put(b,left+80,200);put(top,left+40,188);put(bottom,left+40,212);put(iris,left+40,200);}
 put(1,320,280);return points;
}
test('iris features withstand head translation, scale and roll; closed eyes never produce gaze',()=>{
 const base=face(), first=extractEyeSample(base,640,480,1).sample;assert.ok(first);
 const transformed=base.map(p=>{const x=p.x*640-320,y=p.y*480-240;return {x:(320+30+1.1*(x*Math.cos(.1)-y*Math.sin(.1)))/640,y:(240+10+1.1*(x*Math.sin(.1)+y*Math.cos(.1)))/480};});
 const next=extractEyeSample(transformed,640,480,2).sample;assert.ok(next);assert.ok(Math.abs(first.px-next.px)<1e-8);assert.ok(Math.abs(first.py-next.py)<1e-8);
 base[159]=base[145];const blink=extractEyeSample(base,640,480,3);assert.equal(blink.blinking,true);assert.equal(blink.sample,null);
});

test('nonlinear mapping corrects position-dependent offsets at unfitted screen locations',()=>{
  const inverse=(screen:number,curvature:number)=>(Math.sqrt(1+4*curvature*(screen-.5))-1)/(2*curvature);
  const observations=CALIBRATION_TARGETS.map(p=>sample(.5-.2*inverse(p.x,.3),.02+.12*inverse(p.y,.4)));
  const model=fitCalibration(observations);assert.ok(model);
  for(const target of VALIDATION_TARGETS){
    const px=.5-.2*inverse(target.x,.3),py=.02+.12*inverse(target.y,.4);
    const predicted=projectGaze(model,px,py);
    assert.ok(Math.hypot(predicted.x-target.x,predicted.y-target.y)<.001);
  }
});
test('multi-location pixel checks reject systematic wrong-position and unstable fixations',()=>{
 const model=fitCalibration(training)!,viewport={width:1280,height:900},target=VALIDATION_TARGETS[0];
 const good=Array.from({length:30},(_,i)=>sample(.5-(target.x-.5)*.2+(target.y-.5)*.02,.02+(target.y-.5)*.12,i*50));
 const accurate=measureGazeAccuracy(model,good,target,viewport);assert.ok(accurate);assert.ok(accuracyPasses(accurate,viewport));
 const offset=measureGazeAccuracy(model,good.map(s=>({...s,px:s.px+.02})),target,viewport);assert.ok(offset);assert.equal(accuracyPasses(offset,viewport),false);
 const noise=measureGazeAccuracy(model,good.map((s,i)=>({...s,px:s.px+Math.sin(i)*.006})),target,viewport);assert.ok(noise);assert.equal(accuracyPasses(noise,viewport),false);
});
test('live confidence waits for a stable position and pauses broad camera jitter',()=>{
 const confidence=new GazeConfidence();let point:null|{x:number;y:number}=null;
 for(let i=0;i<12;i++)point=confidence.update({x:500+Math.sin(i)*3,y:400},i*33);
 assert.ok(point);assert.ok(Math.abs(point.x-500)<4);
 for(let i=12;i<30;i++)point=confidence.update({x:500+Math.sin(i)*90,y:400},i*33);
 assert.equal(point,null);
 for(let i=30;i<44;i++)point=confidence.update({x:800,y:600},i*33);
 assert.deepEqual(point,{x:800,y:600});
});
test('a brief loss does not restart smoothing at the first noisy reacquired sample',()=>{
 const filter=new GazeSmoother();filter.update({x:500,y:400},1);filter.suspend();
 assert.deepEqual(filter.update({x:700,y:500},300),{x:500,y:400});
 let p={x:500,y:400};for(let i=1;i<35;i++)p=filter.update({x:520,y:410},300+i*33);
 assert.ok(Math.hypot(p.x-520,p.y-410)<8);
});

test('consistent-offset repair changes only translation and is checked on new observations',()=>{
 const original=fitCalibration(training)!,viewport={width:1280,height:900};
 const cloud=(target:{x:number;y:number})=>Array.from({length:40},(_,i)=>sample(.5-(target.x-.5)*.2+(target.y-.5)*.02+.01,.02+(target.y-.5)*.12,i*50));
 const checks=VALIDATION_TARGETS.map(target=>measureRenderedGazeAccuracy(original,cloud(target),target,viewport)!);
 assert.ok(checks.every(c=>!accuracyPasses(c,viewport)));
 const repaired=correctConsistentOffset(original,checks,viewport);assert.ok(repaired);assert.notDeepEqual(repaired.x,original.x);assert.deepEqual(repaired.x.slice(1),original.x.slice(1));
 for(const target of VALIDATION_TARGETS){const fresh=measureRenderedGazeAccuracy(repaired,cloud(target),target,viewport);assert.ok(fresh&&accuracyPasses(fresh,viewport));}
 const inconsistent=checks.map((c,i)=>({...c,offsetX:i%2?80:-80}));assert.equal(correctConsistentOffset(original,inconsistent,viewport),null);
 assert.equal(correctConsistentOffset(original,checks.map(c=>({...c,jitterPx:60})),viewport),null);
});
test('accuracy is measured on rendered cursor while raw noise is still rejected when unusable',()=>{
 const model=fitCalibration(training)!,target=VALIDATION_TARGETS[0],viewport={width:1280,height:900};
 const frames=Array.from({length:60},(_,i)=>sample(.5-(target.x-.5)*.2+(target.y-.5)*.02+Math.sin(i)*.003,.02+(target.y-.5)*.12,i*50));
 const raw=measureGazeAccuracy(model,frames,target,viewport)!,rendered=measureRenderedGazeAccuracy(model,frames,target,viewport);
 assert.equal(accuracyPasses(raw,viewport),false);assert.ok(rendered&&accuracyPasses(rendered,viewport));
 const noisy=frames.map((s,i)=>({...s,px:s.px+(i%2?.015:-.015)}));assert.equal(measureRenderedGazeAccuracy(model,noisy,target,viewport),null);
});
test('recent fixation recovery discards the segment before a blink gap',()=>{
 const before=Array.from({length:15},(_,i)=>sample(.5,.02,i*50));const after=Array.from({length:25},(_,i)=>sample(.5,.02,1200+i*50));
 assert.equal(summarizeFixation([...before,...after]),null);
 const recent=recentFixationFrames([...before,...after],2400);assert.equal(recent[0].timestamp,1200);assert.ok(summarizeFixation(recent));
});
