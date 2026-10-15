import {GazeSmoother,projectGaze,median,distance,quantile} from './eyeTrackingMath';
import type {FrameObservation,GazeModel,Point} from './eyeTrackingMath';
import type {EyeSettings} from './eyeTrackingConfig';
export type ReplayFrame={frame:FrameObservation;label:{target:Point;id:string;phase:string}|null};
export type FilterTrial={minCutoffHz:number;beta:number;fixationP90Px:number;medianTimeToTargetMs:number|null;usableFrames:number;score:number};
/** Uses explicitly labeled TRAINING traces only. Never changes the mapping or validation results. */
export function compareFilters(trace:ReplayFrame[],model:GazeModel,settings:EyeSettings):FilterTrial[] {
 const training=trace.filter(f=>f.label?.id.startsWith('train-'));
 if(training.length<30||training.filter(t=>t.label?.phase==='collecting'&&t.frame.sample).length<15)return [];
 const candidates=[{minCutoffHz:settings.minCutoffHz,beta:settings.beta},{minCutoffHz:.7,beta:.003},{minCutoffHz:1.1,beta:.006},{minCutoffHz:1.6,beta:.01}];
 return candidates.map(candidate=>{
  const filter=new GazeSmoother({...settings,...candidate}),groups=new Map<string,Point[]>(),latencies:number[]=[];
  let lastId='',onset=0,reached=false,usableFrames=0;
  for(const {frame,label} of training){
   if(!label)continue;if(label.id!==lastId){lastId=label.id;onset=frame.timestamp;reached=false;}
   if(!frame.sample)continue;const raw=projectGaze(model,frame.sample.px,frame.sample.py),p=filter.update(raw,frame.timestamp);if(!p)continue;usableFrames++;
   if(!reached&&distance(p,label.target)<=40){latencies.push(frame.timestamp-onset);reached=true;}
   if(label.phase==='collecting')groups.set(label.id,[...(groups.get(label.id)||[]),p]);
  }
  const spreads=[...groups.values()].filter(a=>a.length>=5).map(points=>{const center={x:median(points.map(p=>p.x)),y:median(points.map(p=>p.y))};return quantile(points.map(p=>distance(p,center)),.9);});
  const fixationP90Px=spreads.length?median(spreads):Number.MAX_SAFE_INTEGER,medianTimeToTargetMs=latencies.length?median(latencies):null;
  return {...candidate,fixationP90Px,medianTimeToTargetMs,usableFrames,score:fixationP90Px+(medianTimeToTargetMs??2000)*.02};
 }).sort((a,b)=>a.score-b.score);
}
