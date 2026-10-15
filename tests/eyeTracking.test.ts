import test from 'node:test';
import assert from 'node:assert/strict';
import { CALIBRATION_TARGETS, extractEyeSample, fitCalibration, GazeDwell, GazeSmoother, poseMatches, projectGaze, summarizeFixation } from '../src/services/eyeTrackingMath';
import type { EyeSample, Landmark } from '../src/services/eyeTrackingMath';
const pose={x:.5,y:.4,yaw:0,pitch:.5,roll:0,scale:.2};
const sample=(px:number,py:number,timestamp=0):EyeSample=>({px,py,pose,timestamp});
const training=CALIBRATION_TARGETS.map(p=>sample(.5-(p.x-.5)*.2+(p.y-.5)*.02,.02+(p.y-.5)*.12));
test('five-point fit learns individual sensitivity, direction and cross-axis skew',()=>{
 const model=fitCalibration(training);assert.ok(model);
 for(let i=0;i<5;i++){const gaze=projectGaze(model,training[i].px,training[i].py);assert.ok(Math.abs(gaze.x-CALIBRATION_TARGETS[i].x)<1e-8);assert.ok(Math.abs(gaze.y-CALIBRATION_TARGETS[i].y)<1e-8);}
 const gaze=projectGaze(model,.5-(.6-.5)*.2+(.7-.5)*.02,.02+(.7-.5)*.12);assert.ok(Math.hypot(gaze.x-.6,gaze.y-.7)<1e-8);
});
test('corner measurements influence the fitted map instead of just using center',()=>{
 const original=fitCalibration(training)!;
 const wide=fitCalibration(training.map(s=>({...s,px:.5+(s.px-.5)*2})))!;
 assert.ok(Math.abs(projectGaze(original,.53,.02).x-projectGaze(wide,.53,.02).x)>.07);
});
test('reject degenerate and inconsistent calibration, too few samples and non-finite values',()=>{
 assert.equal(fitCalibration(Array.from({length:5},()=>sample(.5,.5))),null);
 assert.equal(fitCalibration(training.slice(0,4)),null);
 assert.equal(fitCalibration(training.map(s=>({...s,px:NaN}))),null);
 assert.equal(fitCalibration([training[0],training[2],training[1],training[3],training[4]]),null);
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
