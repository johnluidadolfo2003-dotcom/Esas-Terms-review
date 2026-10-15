/** Pure gaze geometry, calibration, filtering and dwell logic. No camera or DOM. */
export type Point = { x: number; y: number };
export type Landmark = Point & { z?: number };
export type Pose = { x: number; y: number; yaw: number; pitch: number; roll: number; scale: number };
export type EyeSample = { px: number; py: number; pose: Pose; timestamp: number };
export const CALIBRATION_TARGETS = [
  { label: 'Center', x: .5, y: .5 },
  { label: 'Top left', x: .12, y: .16 },
  { label: 'Top center', x: .5, y: .16 },
  { label: 'Top right', x: .88, y: .16 },
  { label: 'Middle left', x: .12, y: .5 },
  { label: 'Middle right', x: .88, y: .5 },
  { label: 'Bottom left', x: .12, y: .84 },
  { label: 'Bottom center', x: .5, y: .84 },
  { label: 'Bottom right', x: .88, y: .84 },
] as const;
// These locations are not used for fitting. Center-only validation misses edge/interior offsets.
export const VALIDATION_TARGETS = [
  { label: 'Check upper left', x: .31, y: .33 },
  { label: 'Check upper right', x: .69, y: .33 },
  { label: 'Check lower left', x: .31, y: .67 },
  { label: 'Check lower right', x: .69, y: .67 },
] as const;
export const median = (values: number[]) => {
  const sorted = [...values].sort((a,b) => a-b);
  const m = Math.floor(sorted.length / 2);
  return sorted.length ? (sorted[m] + sorted[Math.max(0, Math.ceil(sorted.length / 2) - 1)]) / 2 : NaN;
};
const distance = (a: Point, b: Point) => Math.hypot(a.x-b.x, a.y-b.y);
export function extractEyeSample(landmarks: Landmark[], width: number, height: number, timestamp: number): { sample: EyeSample | null; blinking: boolean; face: boolean } {
  if (landmarks.length < 478 || !width || !height) return { sample: null, blinking: false, face: false };
  const p = landmarks.map(l => ({ x: l.x * width, y: l.y * height }));
  if (p.some(l=>!Number.isFinite(l.x) || !Number.isFinite(l.y))) return { sample: null, blinking: false, face: false };
  // Eye-local axes remove image translation, camera scale and head roll.
  const eye = (a: number, b: number, top: number, bottom: number, iris: number) => {
    const left = p[a].x < p[b].x ? p[a] : p[b];
    const right = p[a].x < p[b].x ? p[b] : p[a];
    const span = distance(left, right);
    if (span < 12) return null;
    const ux = (right.x-left.x) / span, uy = (right.y-left.y) / span;
    const dx = p[iris].x-left.x, dy = p[iris].y-left.y;
    const center = { x: (left.x+right.x)/2, y: (left.y+right.y)/2 };
    const vx = p[iris].x-center.x, vy = p[iris].y-center.y;
    return { x: (dx*ux+dy*uy)/span, y: (-vx*uy+vy*ux)/span, openness: distance(p[top],p[bottom])/span, center };
  };
  const l = eye(33,133,159,145,468), r = eye(362,263,386,374,473);
  if (!l || !r) return { sample: null, blinking: false, face: true };
  const blinking = Math.min(l.openness,r.openness) < .16;
  if (blinking || Math.abs(l.x-r.x) > .18 || Math.abs(l.y-r.y) > .10 || [l,r].some(e=>e.x < .12 || e.x > .88 || Math.abs(e.y) > .24)) return { sample: null, blinking, face: true };
  const span = distance(l.center,r.center);
  if (span < 30) return { sample: null, blinking: false, face: true };
  const cx = (l.center.x+r.center.x)/2, cy = (l.center.y+r.center.y)/2;
  return { face: true, blinking: false, sample: {
    px: (l.x+r.x)/2, py: (l.y+r.y)/2, timestamp,
    pose: { x: cx/width, y: cy/height, yaw: (p[1].x-cx)/span, pitch: (p[1].y-cy)/span, roll: Math.atan2(r.center.y-l.center.y,r.center.x-l.center.x), scale: span/width },
  } };
}
export function poseMatches(p: Pose, baseline: Pose): boolean {
  return Math.abs(p.x-baseline.x) < .05 && Math.abs(p.y-baseline.y) < .05 && Math.abs(p.yaw-baseline.yaw) < .055 && Math.abs(p.pitch-baseline.pitch) < .07 && Math.abs(p.roll-baseline.roll) < .12 && Math.abs(p.scale / baseline.scale - 1) < .12;
}
export function summarizeFixation(samples: EyeSample[]): EyeSample | null {
  if (samples.length < 12 || samples.at(-1)!.timestamp-samples[0].timestamp<1000 || samples.some((s,i)=>i>0&&(s.timestamp<=samples[i-1].timestamp||s.timestamp-samples[i-1].timestamp>250))) return null;
  const px = median(samples.map(s=>s.px)), py = median(samples.map(s=>s.py));
  const good = samples.filter(s=>Math.abs(s.px-px)<.035 && Math.abs(s.py-py)<.022);
  if (good.length < 12 || good.length < samples.length*.75 || median(good.map(s=>Math.abs(s.px-px))) > .012 || median(good.map(s=>Math.abs(s.py-py))) > .008) return null;
  const pose = Object.fromEntries(Object.keys(good[0].pose).map(key=>[key,median(good.map(s=>s.pose[key as keyof Pose]))])) as Pose;
  if (good.some(s=>!poseMatches(s.pose,pose))) return null;
  return { px, py, pose, timestamp: good.at(-1)!.timestamp };
}
export type GazeModel = { mean: Point; scale: Point; x: number[]; y: number[]; error: number };
const solve = (matrix: number[][], vector: number[]): number[] | null => {
  const n=vector.length, rows=matrix.map((r,i)=>[...r,vector[i]]);
  for(let col=0;col<n;col++) {
    let pivot=col;
    for(let r=col+1;r<n;r++) if(Math.abs(rows[r][col])>Math.abs(rows[pivot][col])) pivot=r;
    if(Math.abs(rows[pivot][col])<1e-7) return null;
    [rows[col],rows[pivot]]=[rows[pivot],rows[col]];
    const divisor=rows[col][col]; for(let c=col;c<=n;c++) rows[col][c]/=divisor;
    for(let r=0;r<n;r++) if(r!==col) {const f=rows[r][col];for(let c=col;c<=n;c++)rows[r][c]-=f*rows[col][c];}
  }
  return rows.map(r=>r[n]);
};
const features=(model:Pick<GazeModel,'mean'|'scale'>,px:number,py:number)=>{
  const x=(px-model.mean.x)/model.scale.x,y=(py-model.mean.y)/model.scale.y;
  return [1,x,y,x*y,x*x,y*y];
};
export function fitCalibration(samples: EyeSample[]): GazeModel | null {
  const count=CALIBRATION_TARGETS.length;
  if(samples.length!==count || samples.some(s=>![s.px,s.py].every(Number.isFinite))) return null;
  const mean={x:samples.reduce((a,s)=>a+s.px,0)/count,y:samples.reduce((a,s)=>a+s.py,0)/count};
  const scale={x:Math.max(...samples.map(s=>s.px))-Math.min(...samples.map(s=>s.px)),y:Math.max(...samples.map(s=>s.py))-Math.min(...samples.map(s=>s.py))};
  if(scale.x<.025||scale.y<.008)return null;
  const rows=samples.map(s=>features({mean,scale},s.px,s.py));
  const matrix=Array.from({length:6},(_,i)=>Array.from({length:6},(_,j)=>rows.reduce((a,f)=>a+f[i]*f[j],0)));
  // Penalize curvature slightly to avoid amplifying small landmark noise.
  for(let i=3;i<6;i++)matrix[i][i]+=.0001;
  const fit=(axis:'x'|'y')=>solve(matrix,Array.from({length:6},(_,i)=>rows.reduce((a,f,j)=>a+f[i]*CALIBRATION_TARGETS[j][axis],0)));
  const x=fit('x'),y=fit('y');if(!x||!y)return null;
  const error=Math.sqrt(rows.reduce((a,f,i)=>a+Math.pow(f.reduce((v,k,j)=>v+k*x[j],0)-CALIBRATION_TARGETS[i].x,2)+Math.pow(f.reduce((v,k,j)=>v+k*y[j],0)-CALIBRATION_TARGETS[i].y,2),0)/count);
  return error<=.045?{mean,scale,x,y,error}:null;
}
export function projectGaze(model:GazeModel,px:number,py:number):Point {
  const f=features(model,px,py);
  return {x:f.reduce((a,v,i)=>a+v*model.x[i],0),y:f.reduce((a,v,i)=>a+v*model.y[i],0)};
}
export type GazeAccuracy = { errorPx:number; p90ErrorPx:number; jitterPx:number; offsetX?:number; offsetY?:number };
const percentile90=(values:number[])=>[...values].sort((a,b)=>a-b)[Math.min(values.length-1,Math.floor(values.length*.9))];
export function measureGazeAccuracy(model:GazeModel,samples:EyeSample[],target:Point,viewport:{width:number;height:number}):GazeAccuracy|null {
  if(!summarizeFixation(samples))return null;
  const projected=samples.map(s=>projectGaze(model,s.px,s.py)).map(p=>({x:p.x*viewport.width,y:p.y*viewport.height}));
  if(projected.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y)))return null;
  return summarizeAccuracy(projected,target,viewport);
}
function summarizeAccuracy(projected:Point[],target:Point,viewport:{width:number;height:number}):GazeAccuracy {
  const center={x:median(projected.map(p=>p.x)),y:median(projected.map(p=>p.y))};
  const expected={x:target.x*viewport.width,y:target.y*viewport.height};
  return {errorPx:distance(center,expected),p90ErrorPx:percentile90(projected.map(p=>distance(p,expected))),jitterPx:percentile90(projected.map(p=>distance(p,center))),offsetX:center.x-expected.x,offsetY:center.y-expected.y};
}
/** Evaluate the same confidence/filter pipeline used by the cursor, after settling. */
export function measureRenderedGazeAccuracy(model:GazeModel,samples:EyeSample[],target:Point,viewport:{width:number;height:number}):GazeAccuracy|null {
  if(!summarizeFixation(samples))return null;
  const confidence=new GazeConfidence(),filter=new GazeSmoother();
  const output:(Point&{time:number})[]=[];
  let eligible=0;
  for(const sample of samples){
    const gaze=projectGaze(model,sample.px,sample.py);
    const fixation=confidence.update({x:gaze.x*viewport.width,y:gaze.y*viewport.height},sample.timestamp);
    const settled=sample.timestamp-samples[0].timestamp>=400;
    if(settled)eligible++;
    if(!fixation){filter.suspend();continue;}
    const point=filter.update(fixation,sample.timestamp);
    if(settled)output.push({...point,time:sample.timestamp});
  }
  // Filtering may not hide an unusable camera: require enough usable frames and duration.
  if(output.length<8||output.length<eligible*.5||output.at(-1)!.time-output[0].time<500)return null;
  return summarizeAccuracy(output,target,viewport);
}
/** A translation is repairable only when all independent checks agree on it. */
export function correctConsistentOffset(model:GazeModel,checks:GazeAccuracy[],viewport:{width:number;height:number}):GazeModel|null {
  if(checks.length!==VALIDATION_TARGETS.length||checks.some(c=>!Number.isFinite(c.offsetX)||!Number.isFinite(c.offsetY)||c.jitterPx>Math.min(18,accuracyLimit(viewport)*.6)))return null;
  const offset={x:median(checks.map(c=>c.offsetX!)),y:median(checks.map(c=>c.offsetY!))};
  if(distance(offset,{x:0,y:0})>Math.min(viewport.width,viewport.height)*.18||checks.some(c=>distance({x:c.offsetX!,y:c.offsetY!},offset)>accuracyLimit(viewport)*.7))return null;
  const corrected={...model,x:[...model.x],y:[...model.y]};
  corrected.x[0]-=offset.x/viewport.width;corrected.y[0]-=offset.y/viewport.height;
  return corrected;
}
/** Most recent uninterrupted observations; a blink need not spoil the entire point. */
export function recentFixationFrames(samples:EyeSample[],now:number):EyeSample[] {
  const recent=samples.filter(s=>now-s.timestamp<=1800);
  let start=0;
  for(let i=1;i<recent.length;i++)if(recent[i].timestamp-recent[i-1].timestamp>250)start=i;
  return recent.slice(start);
}

export function accuracyLimit(viewport:{width:number;height:number}):number{return Math.max(24,Math.min(40,Math.min(viewport.width,viewport.height)*.04));}
export function accuracyPasses(result:GazeAccuracy,viewport:{width:number;height:number}):boolean {
  const limit=accuracyLimit(viewport);
  return result.errorPx<=limit&&result.p90ErrorPx<=limit*1.5&&result.jitterPx<=Math.min(18,limit*.6);
}
/** Live screen-space confidence: do not follow a noisy fixation or a moving saccade. */
export class GazeConfidence {
  private frames:(Point&{time:number})[]=[];
  reset(){this.frames=[];}
  update(point:Point,time:number):Point|null {
    if(this.frames.length&&time-this.frames.at(-1)!.time>250)this.reset();
    this.frames.push({...point,time});this.frames=this.frames.filter(p=>time-p.time<=200);
    if(this.frames.length<3||time-this.frames[0].time<100)return null;
    const center={x:median(this.frames.map(p=>p.x)),y:median(this.frames.map(p=>p.y))};
    // A single landmark spike must not disqualify an otherwise stable median.
    const dispersion=median(this.frames.map(p=>distance(p,center)));
    return dispersion<=16&&distance(point,center)<=48?center:null;
  }
}
/** Median rejects isolated jumps; time-based adaptive smoothing reduces fixation noise without fixed-frame lag. */
export class GazeSmoother {
  private history: Point[]=[];
  private value: Point | null=null;
  private output: Point | null=null;
  private previous: Point | null=null;
  private velocity: Point={x:0,y:0};
  private time=0;
  reset() { this.history=[]; this.value=this.output=this.previous=null; this.velocity={x:0,y:0}; this.time=0; }
  suspend() { this.history=[];this.previous=null;this.time=0;this.velocity={x:0,y:0}; }
  update(raw:Point,time:number):Point {
    if(this.time && time-this.time>250) this.suspend();
    this.history.push(raw); if(this.history.length>5) this.history.shift();
    const target={x:median(this.history.map(p=>p.x)),y:median(this.history.map(p=>p.y))};
    if(!this.value) {this.value={...target};this.output={...target};this.previous={...target};this.time=time;return {...target};}
    if(!this.previous){this.previous={...target};this.time=time;return {...this.output!};}
    const dt=Math.max(.001,Math.min(.1,(time-this.time)/1000));this.time=time;
    const alpha=(cutoff:number)=>1/(1+1/(2*Math.PI*cutoff*dt));
    for(const axis of ['x','y'] as const) {
      const speed=(target[axis]-this.previous![axis])/dt;
      this.velocity[axis]+=alpha(1)*(speed-this.velocity[axis]);
      this.value[axis]+=alpha(.9+.006*Math.abs(this.velocity[axis]))*(target[axis]-this.value[axis]);
    }
    this.previous=target;
    if(distance(this.value,this.output!)>5) this.output={...this.value};
    return {...this.output!};
  }
}
export class GazeDwell {
  private target:string|null=null;
  private start=0;
  private fired:string|null=null;
  private awaySince:number|null=null;
  private firedPoint:Point|null=null;
  private lastTime=0;
  private anchor:Point|null=null;
  reset() { this.target=null;this.start=0;this.lastTime=0;this.anchor=null;this.awaySince=null; }
  clear() { this.reset();this.fired=null;this.firedPoint=null;this.awaySince=null; }
  update(target:string|null,slot:string|null,point:Point,now:number):{progress:number;fire:boolean} {
    if(this.lastTime && now-this.lastTime>250) this.reset();
    this.lastTime=now;
    if(slot!==this.fired && (!this.firedPoint || distance(point,this.firedPoint)>48)) {
      if(this.awaySince===null) this.awaySince=now;
      if(now-this.awaySince>=200) {this.fired=null;this.firedPoint=null;}
    } else this.awaySince=null;
    if(!target || slot===this.fired) {this.target=null;this.anchor=null;return {progress:0,fire:false};}
    if(target!==this.target || !this.anchor || distance(point,this.anchor)>38) {this.target=target;this.anchor={...point};this.start=now;return {progress:0,fire:false};}
    const progress=Math.min(1,(now-this.start)/1100);
    if(progress===1) {this.fired=slot;this.firedPoint={...point};this.reset();return {progress:0,fire:true};}
    return {progress,fire:false};
  }
}
