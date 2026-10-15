/** Pure gaze geometry, calibration, filtering and dwell logic. No camera or DOM. */
export type Point = { x: number; y: number };
export type Landmark = Point & { z?: number };
export type Pose = { x: number; y: number; yaw: number; pitch: number; roll: number; scale: number };
export type EyeSample = { px: number; py: number; pose: Pose; timestamp: number };
export const CALIBRATION_TARGETS = [
  { label: 'Center', x: .5, y: .5 },
  { label: 'Top left', x: .18, y: .22 },
  { label: 'Top right', x: .82, y: .22 },
  { label: 'Bottom left', x: .18, y: .78 },
  { label: 'Bottom right', x: .82, y: .78 },
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
  return Math.abs(p.x-baseline.x) < .10 && Math.abs(p.y-baseline.y) < .10 && Math.abs(p.yaw-baseline.yaw) < .10 && Math.abs(p.pitch-baseline.pitch) < .12 && Math.abs(p.roll-baseline.roll) < .18 && Math.abs(p.scale / baseline.scale - 1) < .22;
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
const solve3 = (matrix: number[][], vector: number[]): number[] | null => {
  const rows=matrix.map((r,i)=>[...r,vector[i]]);
  for(let col=0;col<3;col++) {
    let pivot=col;
    for(let r=col+1;r<3;r++) if(Math.abs(rows[r][col])>Math.abs(rows[pivot][col])) pivot=r;
    if(Math.abs(rows[pivot][col])<1e-6) return null;
    [rows[col],rows[pivot]]=[rows[pivot],rows[col]];
    const divisor=rows[col][col]; for(let c=col;c<4;c++) rows[col][c]/=divisor;
    for(let r=0;r<3;r++) if(r!==col) { const f=rows[r][col]; for(let c=col;c<4;c++) rows[r][c]-=f*rows[col][c]; }
  }
  return rows.map(r=>r[3]);
};
export function fitCalibration(samples: EyeSample[]): GazeModel | null {
  if(samples.length!==5 || samples.some(s=>![s.px,s.py].every(Number.isFinite))) return null;
  const mean={x:samples.reduce((a,s)=>a+s.px,0)/5,y:samples.reduce((a,s)=>a+s.py,0)/5};
  const scale={x:Math.max(...samples.map(s=>s.px))-Math.min(...samples.map(s=>s.px)),y:Math.max(...samples.map(s=>s.py))-Math.min(...samples.map(s=>s.py))};
  if(scale.x<.025 || scale.y<.008) return null;
  const features=samples.map(s=>[1,(s.px-mean.x)/scale.x,(s.py-mean.y)/scale.y]);
  const matrix=Array.from({length:3},(_,i)=>Array.from({length:3},(_,j)=>features.reduce((a,f)=>a+f[i]*f[j],0)));
  const fit=(axis:'x'|'y')=>solve3(matrix,[0,1,2].map(i=>features.reduce((a,f,j)=>a+f[i]*CALIBRATION_TARGETS[j][axis],0)));
  const x=fit('x'), y=fit('y'); if(!x || !y) return null;
  const error=Math.sqrt(features.reduce((a,f,i)=>a+Math.pow(f.reduce((s,v,k)=>s+v*x[k],0)-CALIBRATION_TARGETS[i].x,2)+Math.pow(f.reduce((s,v,k)=>s+v*y[k],0)-CALIBRATION_TARGETS[i].y,2),0)/5);
  return error<=.085 ? {mean,scale,x,y,error} : null;
}
export function projectGaze(model: GazeModel, px:number,py:number): Point {
  const f=[1,(px-model.mean.x)/model.scale.x,(py-model.mean.y)/model.scale.y];
  return {x:f.reduce((s,v,i)=>s+v*model.x[i],0),y:f.reduce((s,v,i)=>s+v*model.y[i],0)};
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
  update(raw:Point,time:number):Point {
    if(this.time && time-this.time>250) this.reset();
    this.history.push(raw); if(this.history.length>5) this.history.shift();
    const target={x:median(this.history.map(p=>p.x)),y:median(this.history.map(p=>p.y))};
    if(!this.value) {this.value={...target};this.output={...target};this.previous={...target};this.time=time;return {...target};}
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
