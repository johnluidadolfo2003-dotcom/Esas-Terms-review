import { EYE_DEFAULTS } from './eyeTrackingConfig';
import type { EyeSettings } from './eyeTrackingConfig';
export type Point = {x:number;y:number};
export type Landmark = Point & {z?:number};
export type Pose = {x:number;y:number;yaw:number;pitch:number;roll:number;scale:number};
export type EyeSample = {px:number;py:number;pose:Pose;timestamp:number;frameId?:number;videoTime?:number};
export type LabeledSample = {sample:EyeSample;target:Point;targetId:string};
export const CALIBRATION_TARGETS = [
 {label:'Center',x:.5,y:.5},{label:'Top left',x:.1,y:.1},{label:'Top center',x:.5,y:.1},
 {label:'Top right',x:.9,y:.1},{label:'Middle left',x:.1,y:.5},{label:'Middle right',x:.9,y:.5},
 {label:'Bottom left',x:.1,y:.9},{label:'Bottom center',x:.5,y:.9},{label:'Bottom right',x:.9,y:.9},
] as const;
export const QUICK_CALIBRATION_TARGETS=[CALIBRATION_TARGETS[0],CALIBRATION_TARGETS[1],CALIBRATION_TARGETS[3],CALIBRATION_TARGETS[6],CALIBRATION_TARGETS[8]];
export const VALIDATION_TARGETS=[{label:'Center',x:.5,y:.5},{label:'Upper left',x:.3,y:.3},{label:'Upper right',x:.7,y:.3},{label:'Lower left',x:.3,y:.7},{label:'Lower right',x:.7,y:.7}] as const;
export const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y);
export function quantile(values:number[],q:number):number {if(!values.length)return NaN;const a=[...values].sort((x,y)=>x-y);return a[Math.min(a.length-1,Math.floor(q*(a.length-1)))];}
export const median=(values:number[])=>quantile(values,.5);
export type EyeDetection = {landmarkCount:number;reason:string;eyeWidths?:number[];openness?:number[];points:Point[]};
export function extractEyeSample(landmarks: Landmark[], width: number, height: number, timestamp: number): { sample: EyeSample | null; blinking: boolean; face: boolean; detection:EyeDetection } {
  const detection:EyeDetection={landmarkCount:landmarks.length,reason:'',points:[]};
  const reject=(reason:string,blinking=false,face=landmarks.length>=468)=>{detection.reason=reason;return {sample:null,blinking,face,detection};};
  if (!landmarks.length) return reject('Face not detected. Face the camera and check front lighting.');
  if (!width || !height) return reject('Camera video dimensions are not ready.');
  if (landmarks.length < 478) return reject(`Iris landmarks missing (${landmarks.length}/478). Restart the eye model.`);
  const p = landmarks.map(l => ({ x: l.x * width, y: l.y * height }));
  if (p.some(l=>!Number.isFinite(l.x) || !Number.isFinite(l.y))) return reject('Eye model returned invalid landmark coordinates.');
  detection.points=[33,159,133,145,33,468,362,386,263,374,362,473].map(i=>landmarks[i]);
  // Eye-local axes remove image translation, camera scale and head roll.
  const eye = (a: number, b: number, top: number, bottom: number, iris: number) => {
    const left = p[a].x < p[b].x ? p[a] : p[b];
    const right = p[a].x < p[b].x ? p[b] : p[a];
    const span = distance(left, right);
    if (span < 1) return null;
    const ux = (right.x-left.x) / span, uy = (right.y-left.y) / span;
    const dx = p[iris].x-left.x, dy = p[iris].y-left.y;
    const center = { x: (left.x+right.x)/2, y: (left.y+right.y)/2 };
    const vx = p[iris].x-center.x, vy = p[iris].y-center.y;
    return { x: (dx*ux+dy*uy)/span, y: (-vx*uy+vy*ux)/span, openness: distance(p[top],p[bottom])/span, center,span };
  };
  const l = eye(33,133,159,145,468), r = eye(362,263,386,374,473);
  if (!l || !r) return reject('Eye corners could not be resolved. Face the camera.');
  detection.eyeWidths=[l.span,r.span];detection.openness=[l.openness,r.openness];
  if(Math.min(l.span,r.span)<12)return reject('Eyes are too small in the camera image. Move closer or use a sharper camera.');
  const blinking = Math.min(l.openness,r.openness) < .16;
  if(blinking)return reject('Eyelids appear closed or narrowed. Open both eyes; check reflections and camera angle.',true);
  if(Math.abs(l.x-r.x)>.18||Math.abs(l.y-r.y)>.10)return reject('Eye measurements disagree. Face the camera and reduce reflections on glasses.');
  if([l,r].some(e=>e.x<.12||e.x>.88||Math.abs(e.y)>.24))return reject('Iris is outside usable eye geometry. Look toward the screen and check eye visibility.');
  const span = distance(l.center,r.center);
  if (span < 30) return reject('Face is too small in the camera image. Move closer.');
  const cx = (l.center.x+r.center.x)/2, cy = (l.center.y+r.center.y)/2;
  detection.reason='Both irises detected';
  return { face: true, blinking: false, detection, sample: {
    px: (l.x+r.x)/2, py: (l.y+r.y)/2, timestamp,
    pose: { x: cx/width, y: cy/height, yaw: (p[1].x-cx)/span, pitch: (p[1].y-cy)/span, roll: Math.atan2(r.center.y-l.center.y,r.center.x-l.center.x), scale: span/width },
  } };
}
export function poseMatches(p: Pose, baseline: Pose): boolean {
  return Math.abs(p.x-baseline.x) < .05 && Math.abs(p.y-baseline.y) < .05 && Math.abs(p.yaw-baseline.yaw) < .055 && Math.abs(p.pitch-baseline.pitch) < .07 && Math.abs(p.roll-baseline.roll) < .12 && Math.abs(p.scale / baseline.scale - 1) < .12;
}
export type GazeModel={kind:'affine'|'quadratic';mean:Point;scale:Point;x:number[];y:number[]};
const features=(model:Pick<GazeModel,'kind'|'mean'|'scale'>,p:EyeSample)=>{
 const x=(p.px-model.mean.x)/model.scale.x,y=(p.py-model.mean.y)/model.scale.y;
 return model.kind==='affine'?[1,x,y]:[1,x,y,x*y,x*x,y*y];
};
function solve(a:number[][],b:number[]):number[]|null {
 const n=b.length,r=a.map((row,i)=>[...row,b[i]]);
 for(let c=0;c<n;c++){
  let pivot=c;for(let i=c+1;i<n;i++)if(Math.abs(r[i][c])>Math.abs(r[pivot][c]))pivot=i;
  if(!Number.isFinite(r[pivot][c])||Math.abs(r[pivot][c])<1e-9)return null;
  [r[c],r[pivot]]=[r[pivot],r[c]];const divisor=r[c][c];for(let j=c;j<=n;j++)r[c][j]/=divisor;
  for(let i=0;i<n;i++)if(i!==c){const f=r[i][c];for(let j=c;j<=n;j++)r[i][j]-=f*r[c][j];}
 }
 const out=r.map(row=>row[n]);return out.every(Number.isFinite)?out:null;
}
export function fitModel(data:LabeledSample[],kind:GazeModel['kind'],ridge=EYE_DEFAULTS.ridge):GazeModel|null {
 if(data.length<12||data.some(d=>![d.sample.px,d.sample.py,d.target.x,d.target.y].every(Number.isFinite)))return null;
 const groups=new Map<string,LabeledSample[]>();for(const d of data)groups.set(d.targetId,[...(groups.get(d.targetId)||[]),d]);
 if(groups.size<(kind==='affine'?3:6))return null;
 const mean={x:median([...groups.values()].map(g=>median(g.map(d=>d.sample.px)))),y:median([...groups.values()].map(g=>median(g.map(d=>d.sample.py))))};
 const scale={x:Math.max(...data.map(d=>d.sample.px))-Math.min(...data.map(d=>d.sample.px)),y:Math.max(...data.map(d=>d.sample.py))-Math.min(...data.map(d=>d.sample.py))};
 if(scale.x<.025||scale.y<.008)return null;
 // Reject collinear features before adding ridge (ridge must not conceal missing variation).
 const px=data.map(d=>(d.sample.px-mean.x)/scale.x),py=data.map(d=>(d.sample.py-mean.y)/scale.y);
 const xx=px.reduce((a,v)=>a+v*v,0),yy=py.reduce((a,v)=>a+v*v,0),xy=px.reduce((a,v,i)=>a+v*py[i],0);
 if(xx*yy-xy*xy<1e-5)return null;
 const model={kind,mean,scale,x:[],y:[]} as GazeModel,n=kind==='affine'?3:6;
 const matrix=Array.from({length:n},()=>Array(n).fill(0)),bx=Array(n).fill(0),by=Array(n).fill(0);
 for(const d of data){const f=features(model,d.sample),weight=1/groups.get(d.targetId)!.length;
  for(let i=0;i<n;i++){bx[i]+=weight*f[i]*d.target.x;by[i]+=weight*f[i]*d.target.y;for(let j=0;j<n;j++)matrix[i][j]+=weight*f[i]*f[j];}
 }
 for(let i=1;i<n;i++)matrix[i][i]+=ridge*(i>=3?4:1);
 const x=solve(matrix,bx),y=solve(matrix,by);return x&&y?{...model,x,y}:null;
}
export function projectGaze(model:GazeModel,px:number,py:number):Point {
 const f=features(model,{px,py} as EyeSample);
 return {x:f.reduce((a,v,i)=>a+v*model.x[i],0),y:f.reduce((a,v,i)=>a+v*model.y[i],0)};
}
export type ModelComparison={selected:GazeModel['kind'];affineP90Px:number;quadraticP90Px:number|null;heldOutFrames:number};
export function chooseModel(groups:Map<string,LabeledSample[]>,viewport:Point,settings:EyeSettings):{model:GazeModel;comparison:ModelComparison}|null {
 const train:LabeledSample[]=[],held:LabeledSample[]=[];const holdGroups:LabeledSample[][]=[];
 for(const group of groups.values()){
  const cut=Math.max(2,Math.floor(group.length*.65));train.push(...group.slice(0,cut));holdGroups.push(group.slice(cut));
 }
 const balancedCount=Math.min(...holdGroups.map(g=>g.length));
 for(const group of holdGroups)for(let i=0;i<balancedCount;i++)held.push(group[Math.floor(i*group.length/balancedCount)]);
 const affine=fitModel(train,'affine',settings.ridge),quad=fitModel(train,'quadratic',settings.ridge);if(!affine||held.length<9)return null;
 const errors=(model:GazeModel)=>held.map(d=>{const p=projectGaze(model,d.sample.px,d.sample.py);return distance(p,d.target);});
 const ea=errors(affine),eq=quad?errors(quad):[];const ap=quantile(ea,.9),qp=eq.length?quantile(eq,.9):Number.MAX_SAFE_INTEGER;
 const useQuad=quad&&qp<ap*(1-settings.complexImprovement)&&ap-qp>=settings.complexImprovementPx&&median(eq)<=median(ea);
 return {model:useQuad?quad!:affine,comparison:{selected:useQuad?'quadratic':'affine',affineP90Px:ap,quadraticP90Px:quad?qp:null,heldOutFrames:held.length}};
}
/** Timestamp-aware One Euro, CSS px and milliseconds. No median/second low-pass stack. */
export class GazeSmoother {
 private value:Point|null=null;private previous:Point|null=null;private velocity:Point={x:0,y:0};private time:number|null=null;
 private pendingSpike:Point|null=null;
 constructor(private settings:Pick<EyeSettings,'minCutoffHz'|'beta'|'derivativeCutoffHz'|'prolongedLossMs'>=EYE_DEFAULTS){}
 reset(){this.value=this.previous=null;this.time=null;this.velocity={x:0,y:0};this.pendingSpike=null;}
 update(raw:Point,time:number):Point|null {
  if(![raw.x,raw.y,time].every(Number.isFinite)||this.time!==null&&time<=this.time)return null;
  if(this.time===null||time-this.time>this.settings.prolongedLossMs){this.value={...raw};this.previous={...raw};this.time=time;return {...raw};}
  // Quarantine one extreme spike; a second consistent observation confirms a deliberate saccade.
  if(distance(raw,this.previous!)>100&&(!this.pendingSpike||distance(raw,this.pendingSpike)>60)){this.pendingSpike={...raw};return null;}
  this.pendingSpike=null;
  const dt=Math.max(.001,(time-this.time)/1000),alpha=(hz:number)=>1/(1+1/(2*Math.PI*hz*dt));
  for(const axis of ['x','y'] as const){const derivative=(raw[axis]-this.previous![axis])/dt;this.velocity[axis]+=alpha(this.settings.derivativeCutoffHz)*(derivative-this.velocity[axis]);
   const cutoff=this.settings.minCutoffHz+this.settings.beta*Math.abs(this.velocity[axis]);this.value![axis]+=alpha(cutoff)*(raw[axis]-this.value![axis]);}
  this.previous={...raw};this.time=time;return {...this.value!};
 }
}
export type Rect={left:number;top:number;width:number;height:number};
export type TargetRegion={id:string;slot:string;label:string;rect:Rect};
export const rectCenter=(r:Rect):Point=>({x:r.left+r.width/2,y:r.top+r.height/2});
export function inside(p:Point,r:Rect,margin=0):boolean{return p.x>=r.left-margin&&p.x<=r.left+r.width+margin&&p.y>=r.top-margin&&p.y<=r.top+r.height+margin;}
export function detectTarget(point:Point,regions:TargetRegion[],previous:string|null,margin=EYE_DEFAULTS.boundaryPx):TargetRegion|null {
 const acquired=regions.filter(r=>inside(point,r.rect));if(acquired.length!==1&&acquired.length>0)return null;
 if(acquired.length===1)return acquired[0];
 const kept=regions.filter(r=>r.id===previous&&inside(point,r.rect,Math.min(margin,Math.min(r.rect.width,r.rect.height)*.1)));
 return kept.length===1?kept[0]:null;
}
export type DwellResult={target:string|null;progress:number;fire:boolean};
export class GazeDwell {
 private candidate:string|null=null;private last:number|null=null;private elapsed=0;private fired:string|null=null;private away:number|null=null;
 private samples:(Point&{time:number})[]=[];private context='';private firedRect:Rect|null=null;
 constructor(private settings:Pick<EyeSettings,'dwellMs'|'releaseMs'|'maxSampleGapMs'>=EYE_DEFAULTS){}
 reset(){this.candidate=null;this.last=null;this.elapsed=0;this.samples=[];this.away=null;}
 clear(){this.reset();this.fired=null;this.firedRect=null;}
 setContext(context:string){if(context!==this.context){this.context=context;this.reset();}}
 update(target:TargetRegion|null,point:Point,now:number,valid=true):DwellResult {
  if(!valid||!Number.isFinite(now)||this.last!==null&&now<=this.last){this.reset();return {target:null,progress:0,fire:false};}
  const delta=this.last===null?0:now-this.last;if(delta>this.settings.maxSampleGapMs){this.reset();}
  if(this.fired&&target?.id!==this.fired&&(!this.firedRect||!inside(point,this.firedRect,6))){if(this.away===null)this.away=now;if(now-this.away>=this.settings.releaseMs)this.fired=null;}else this.away=null;
  if(!target||target.id===this.fired||this.fired&&this.firedRect&&inside(point,this.firedRect,6)){this.candidate=null;this.elapsed=0;this.samples=[];this.last=now;return {target:null,progress:0,fire:false};}
  if(target.id!==this.candidate){this.candidate=target.id;this.elapsed=0;this.samples=[];this.last=now;}
  this.samples.push({...point,time:now});this.samples=this.samples.filter(p=>now-p.time<=200);
  const center={x:median(this.samples.map(p=>p.x)),y:median(this.samples.map(p=>p.y))};
  const spread=quantile(this.samples.map(p=>distance(p,center)),.9),radius=Math.max(4,Math.min(target.rect.width,target.rect.height)*.22);
  if(spread>radius){this.elapsed=0;this.samples=[{...point,time:now}];this.last=now;return {target:target.id,progress:0,fire:false};}
  if(this.last!==null&&delta<=this.settings.maxSampleGapMs&&this.samples.length>1)this.elapsed+=now-this.last;
  this.last=now;
  if(this.elapsed>=this.settings.dwellMs){this.fired=target.id;this.firedRect={...target.rect};this.candidate=null;this.elapsed=0;this.samples=[];return {target:target.id,progress:0,fire:true};}
  return {target:target.id,progress:Math.min(1,this.elapsed/this.settings.dwellMs),fire:false};
 }
}
export type FrameObservation={timestamp:number;frameId:number;videoTime:number;sample:EyeSample|null;reason?:string};
export function collectionStats(frames:FrameObservation[],maxGapMs:number){
 const unique:FrameObservation[]=[];
 for(const frame of frames){const previous=unique.at(-1);if(!previous||frame.frameId>previous.frameId&&frame.videoTime>previous.videoTime&&frame.timestamp>previous.timestamp)unique.push(frame);}

 const valid=unique.filter(f=>f.sample);let validMs=0;
 for(let i=1;i<unique.length;i++){const a=unique[i-1],b=unique[i];if(a.sample&&b.sample&&b.timestamp-a.timestamp<=maxGapMs)validMs+=b.timestamp-a.timestamp;}
 const duration=unique.length>1?unique.at(-1)!.timestamp-unique[0].timestamp:0;
 return {valid:valid.map(f=>f.sample!),validMs,validFraction:unique.length?valid.length/unique.length:0,effectiveHz:duration>0?Math.max(0,valid.length-1)*1000/duration:0,total:unique.length};
}
export type RegionMetrics={id:string;slot?:string;label:string;target:Point;rect?:Rect;medianPx:number;p90Px:number;biasX:number;biasY:number;jitterPx:number;validFraction:number;effectiveHz:number;rawMedianPx:number;rawP90Px:number;passed:boolean;reason:string};
export function measureRegion(model:GazeModel,frames:FrameObservation[],target:Point,region:TargetRegion|undefined,settings:EyeSettings,label:string,id:string,tolerancePx=40):RegionMetrics|null {
 const stats=collectionStats(frames,settings.maxSampleGapMs);if(stats.valid.length<settings.minSamples)return null;
 const filter=new GazeSmoother(settings),raw:Point[]=[],out:Point[]=[];
 for(const f of frames){if(!f.sample)continue;const p=projectGaze(model,f.sample.px,f.sample.py);if(![p.x,p.y].every(Number.isFinite))continue;raw.push(p);const value=filter.update(p,f.timestamp);if(value&&f.timestamp-frames[0].timestamp>=250)out.push(value);}
 if(out.length<5)return null;
 const center={x:median(out.map(p=>p.x)),y:median(out.map(p=>p.y))},error=out.map(p=>distance(p,target));
 const medianPx=median(error),p90Px=quantile(error,.9),jitterPx=quantile(out.map(p=>distance(p,center)),.9);
 const radius=tolerancePx;
 const passed=p90Px<=radius&&jitterPx<=radius*.6&&stats.validFraction>=settings.minValidFraction&&stats.effectiveHz>=settings.minEffectiveHz;
 return {id,slot:region?.slot,label,target,rect:region?.rect,medianPx,p90Px,biasX:center.x-target.x,biasY:center.y-target.y,jitterPx,validFraction:stats.validFraction,effectiveHz:stats.effectiveHz,rawMedianPx:median(raw.map(p=>distance(p,target))),rawP90Px:quantile(raw.map(p=>distance(p,target)),.9),passed,reason:passed?'Checked':stats.validFraction<settings.minValidFraction?'Too many missing eye samples':stats.effectiveHz<settings.minEffectiveHz?'Camera/model frame rate is too low':region?'Neighboring choices need larger, separated targets':'Repeat this location while looking at the dot center'};
}
