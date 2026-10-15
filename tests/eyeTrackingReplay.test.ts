import test from 'node:test';import assert from 'node:assert/strict';
import {compareFilters} from '../src/services/eyeTrackingReplay';import {EYE_DEFAULTS} from '../src/services/eyeTrackingConfig';import type {GazeModel} from '../src/services/eyeTrackingMath';
test('recorded filter comparison uses explicit training labels and does not tune on validation',()=>{
 const model:GazeModel={kind:'affine',mean:{x:0,y:0},scale:{x:1,y:1},x:[0,1,0],y:[0,0,1]};
 const trace=Array.from({length:90},(_,i)=>({frame:{frameId:i+1,videoTime:i/30,timestamp:i*33,sample:{px:500+Math.sin(i)*8,py:400,timestamp:i*33,pose:{x:0,y:0,yaw:0,pitch:0,roll:0,scale:1}}},label:{target:{x:500,y:400},id:'train-0',phase:i<20?'settling':'collecting'}}));
 const before=JSON.stringify(model),trials=compareFilters(trace,model,EYE_DEFAULTS);assert.equal(trials.length,4);assert.ok(trials.every(t=>Number.isFinite(t.fixationP90Px)));assert.equal(JSON.stringify(model),before);
 assert.deepEqual(compareFilters(trace.map(t=>({...t,label:{...t.label,id:'validation-0'}})),model,EYE_DEFAULTS),[]);
});
