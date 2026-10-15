import {compareFilters} from './eyeTrackingReplay';
import type {ReplayFrame} from './eyeTrackingReplay';
import {EYE_DEFAULTS,validateSettings} from './eyeTrackingConfig';
import type {EyeSettings} from './eyeTrackingConfig';
import {CALIBRATION_TARGETS,VALIDATION_TARGETS,extractEyeSample,poseMatches,median,chooseModel,projectGaze,GazeSmoother,GazeDwell,collectionStats,measureRegion,detectTarget,rectCenter,inside} from './eyeTrackingMath';
import type {EyeSample,Landmark,FrameObservation,LabeledSample,GazeModel,ModelComparison,RegionMetrics,TargetRegion,Pose,Point,EyeDetection} from './eyeTrackingMath';
import {captureGeometry,sameGeometry,getTargetRegions,targetTolerance,pointHasTarget} from './eyeTrackingDom';
import type {EyeGeometry} from './eyeTrackingDom';
export interface EyeTrackingState {
 isActive:boolean;isCalibrated:boolean;isTracking:boolean;faceDetected:boolean;gazeX:number;gazeY:number;hoveredChoiceId:string|null;dwellProgress:number;isBlinking:boolean;
 status?:string;isPaused?:boolean;setupReady?:boolean;effectiveHz?:number;qualityReason?:string;detection?:EyeDetection;inferenceMs?:number;frameAgeMs?:number;
}
export type EyeTrackingListener=(state:EyeTrackingState)=>void;
export type CalibrationProgress={phase:'training'|'validation';index:number;total:number;id:string;label:string;target:Point;accepted:number;required:number;progress:number;message:string};
export type GuidedRow={condition:string;expected:string;selected:string|null;result:'correct'|'incorrect'|'missed';elapsedMs:number;recordedAt:number};
export type CalibrationReport={version:4;createdAt:number;mode:'full'|'short';passed:boolean;geometry:EyeGeometry;comparison?:ModelComparison;regions:RegionMetrics[];issues:string[];failedTrainingIds:string[];guided:GuidedRow[];baselineRegions?:RegionMetrics[]};
export type EyeCalibrationData={version:4;model:GazeModel;pose:Pose;geometry:EyeGeometry;report:CalibrationReport;fullValidated:boolean;fullReport:CalibrationReport};
type FaceMesh={setOptions(options:Record<string,unknown>):void;onResults(cb:(r:{multiFaceLandmarks?:Landmark[][]})=>void):void;send(input:{image:HTMLVideoElement}):Promise<void>;close():Promise<void>;initialize?():Promise<void>};
declare global {interface Window {FaceMesh?:new(options:{locateFile:(file:string)=>string})=>FaceMesh}}
const ASSETS='/eye-model/0.4.1633559619/';
const STORAGE='teerms_eye_calibration_v4';
let scriptPromise:Promise<void>|null=null;
function loadModel():Promise<void>{
 if(window.FaceMesh)return Promise.resolve();
 if(!scriptPromise)scriptPromise=new Promise<void>((resolve,reject)=>{
  const script=document.createElement('script');let settled=false;
  const finish=(error?:Error)=>{if(settled)return;settled=true;clearTimeout(timer);if(error){script.remove();reject(error);}else resolve();};
  const timer=setTimeout(()=>finish(new Error('Eye model download timed out. Check your connection and retry.')),20000);
  script.src=ASSETS+'face_mesh.js';script.crossOrigin='anonymous';script.async=true;
  script.onload=()=>finish(window.FaceMesh?undefined:new Error('Eye model did not initialize.'));script.onerror=()=>finish(new Error('Eye model failed to load from this app. Refresh after deployment and retry.'));
  document.head.appendChild(script);
 }).catch(error=>{scriptPromise=null;throw error;});return scriptPromise;
}
function cameraError(error:unknown):string {
 const name=(error as {name?:string})?.name;
 if(name==='NotAllowedError'||name==='PermissionDeniedError')return 'Camera permission denied. Allow camera access in browser settings, then retry.';
 if(name==='NotFoundError')return 'No camera was found. Connect a camera and retry.';
 if(name==='NotReadableError')return 'Camera is busy or unavailable. Close other camera apps and retry.';
 return error instanceof Error?error.message:'Camera could not start.';
}
export class EyeTrackingEngine {
 private video:HTMLVideoElement|null=null;private stream:MediaStream|null=null;private mesh:FaceMesh|null=null;
 private raf:number|null=null;private videoFrame:number|null=null;private watchdog:ReturnType<typeof setInterval>|null=null;
 private generation=0;private startPromise:Promise<boolean>|null=null;private run=0;private collecting:FrameObservation[]|null=null;private calibrating=false;
 private frameCounter=0;private lastProcessed=0;private pending:{frameId:number;timestamp:number;videoTime:number}|null=null;private lastVideoTime=-1;
 private detection:EyeDetection|undefined;private inferenceMs=0;private openedAt=0;
 private observations:FrameObservation[]=[];private latest:EyeSample|null=null;private lastResult=0;private lastValid=0;
 private listeners=new Set<EyeTrackingListener>();private settings:EyeSettings=validateSettings({});
 private filter=new GazeSmoother(this.settings);private dwell=new GazeDwell(this.settings);
 private model:GazeModel|null=null;private baseline:Pose|null=null;private geometry:EyeGeometry|null=null;private verified=false;private fullValidated=false;private userPaused=true;private collectionPose:Pose|null=null;private activeLabel:{target:Point;id:string;phase:string}|null=null;
 private training=new Map<string,LabeledSample[]>();private report:CalibrationReport|null=null;private fullReport:CalibrationReport|null=null;private comparison:ModelComparison|undefined;
 private face=false;private blink=false;private tracking=false;private status='Eye tracking is off';private gaze:Point={x:0,y:0};private hovered:TargetRegion|null=null;private progress=0;private context='';
 private onAction:((action:{type:'choice'|'next';id?:string})=>void)|null=null;
 private recording=false;private trace:unknown[]=[];private lastEmit=0;private trainingTraceVersion=0;private filterCache:{key:string;value:ReturnType<typeof compareFilters>}|null=null;private confirmTargets=false;private pointConfirmed=false;
 private guide:{sequence:string[];index:number;start:number;condition:string;rows:GuidedRow[]}|null=null;private guidedRows:GuidedRow[]=[];
 private removeLifecycle:(()=>void)|null=null;
 constructor(){this.loadSavedCalibration();}
 public getSettings(){return {...this.settings};}
 public configure(values:Partial<EyeSettings>){if(this.calibrating)throw new Error('Pause calibration before changing settings.');this.settings=validateSettings(values);this.filter=new GazeSmoother(this.settings);this.dwell=new GazeDwell(this.settings);this.verified=false;this.fullValidated=false;this.fullReport=null;}
 public getMediaStream(){return this.stream;}public getVideoElement(){return this.video;}public getLatestSample(){return this.latest;}
 public getDraftModel(){return this.model?structuredClone(this.model):null;}public getStatus(){return this.status;}public getReport(){return this.report;}
 public getAccuracyReport(){return this.report?.regions.length?`Worst checked p90 error: ${Math.ceil(Math.max(...this.report.regions.map(r=>r.p90Px)))} CSS px`:'Not measured';}
 public isCalibrated(){return this.verified&&!!this.model&&!!this.geometry&&!!this.video&&sameGeometry(this.geometry,captureGeometry(this.video,this.stream));}
 public canRetryAccuracy(){return !!this.model&&this.training.size===9;}
 public discardCalibrationAttempt(){this.training.clear();this.model=null;this.baseline=null;this.verified=false;this.fullValidated=false;this.fullReport=null;this.report=null;}
 public setActionCallback(cb:(action:{type:'choice'|'next';id?:string})=>void){this.onAction=cb;}
 public setContext(context:string){if(this.context!==context){this.context=context;this.dwell.setContext(context);this.hovered=null;this.progress=0;}}
 public subscribe(listener:EyeTrackingListener){this.listeners.add(listener);listener(this.snapshot());return ()=>{this.listeners.delete(listener);};}
 public getSetup(){const stats=collectionStats(this.observations,this.settings.maxSampleGapMs);return {ready:!!this.stream&&!!this.video&&this.video.readyState>=2&&!!this.latest&&performance.now()-this.lastValid<this.settings.maxFrameAgeMs&&stats.valid.length>=3,validFraction:stats.validFraction,effectiveHz:stats.effectiveHz,reason:this.status};}
 private snapshot():EyeTrackingState {const setup=this.getSetup();return {isActive:!!this.stream,isCalibrated:this.isCalibrated(),isTracking:this.tracking&&!this.calibrating,isPaused:this.userPaused,faceDetected:this.face,isBlinking:this.blink,gazeX:this.gaze.x,gazeY:this.gaze.y,hoveredChoiceId:this.hovered?.slot||null,dwellProgress:this.progress,status:this.status,setupReady:setup.ready,effectiveHz:setup.effectiveHz,qualityReason:this.status,detection:this.detection,inferenceMs:this.inferenceMs,frameAgeMs:this.lastResult?Math.max(0,performance.now()-this.lastResult):undefined};}
 private emit(force=false){const now=performance.now();if(!force&&now-this.lastEmit<50)return;this.lastEmit=now;const state=this.snapshot();this.listeners.forEach(l=>l(state));}
 private unavailable(message:string){this.status=message;this.tracking=false;this.hovered=null;this.progress=0;this.dwell.reset();if(performance.now()-this.lastValid>this.settings.prolongedLossMs)this.filter.reset();this.emit(true);}
 public pause(){this.userPaused=true;this.unavailable('Eye control paused');}
 public resume():boolean {if(!this.isCalibrated()){this.unavailable('Run an accuracy check before resuming');return false;}this.userPaused=false;this.filter.reset();this.dwell.clear();this.emit(true);return true;}
 public loadSavedCalibration():EyeCalibrationData|null {
  try{const d=JSON.parse(localStorage.getItem(STORAGE)||'null') as EyeCalibrationData|null;
   if(d?.version!==4||!d.fullValidated||!d.fullReport?.passed||!d.report?.passed||!d.geometry||!d.pose||!d.model||!['affine','quadratic'].includes(d.model.kind))return null;
   const geometryKeys=['width','height','dpr','visualWidth','visualHeight','offsetX','offsetY','scale','orientation','videoWidth','videoHeight'] as const;
   if(!geometryKeys.every(k=>Number.isFinite(d.geometry[k]))||!d.geometry.cameraId||d.geometry.width<=0||d.geometry.height<=0||!['x','y','yaw','pitch','roll','scale'].every(k=>Number.isFinite(d.pose[k as keyof Pose])))return null;
   if(!Array.isArray(d.report.regions)||!d.report.regions.length||d.report.regions.some(r=>![r.p90Px,r.medianPx,r.jitterPx,r.validFraction,r.effectiveHz].every(Number.isFinite)||!r.passed))return null;
   const n=d.model.kind==='affine'?3:6;
   if([d.model.x,d.model.y].some(a=>!Array.isArray(a)||a.length!==n||a.some(v=>!Number.isFinite(v)))||![d.model.mean.x,d.model.mean.y,d.model.scale.x,d.model.scale.y].every(Number.isFinite)||d.model.scale.x<=0||d.model.scale.y<=0)return null;
   this.model=d.model;this.baseline=d.pose;this.geometry=d.geometry;this.report=d.report;this.guidedRows=d.report.guided||[];this.fullReport=d.fullReport;this.fullValidated=true;this.verified=false;return d;
  }catch{return null;}
 }
 private persist(){if(!this.model||!this.baseline||!this.geometry||!this.report?.passed)return;try{localStorage.setItem(STORAGE,JSON.stringify({version:4,model:this.model,pose:this.baseline,geometry:this.geometry,report:this.report,fullValidated:this.fullValidated,fullReport:this.fullReport!} satisfies EyeCalibrationData));}catch{this.status+=' (browser storage unavailable)';}}
 public setRecording(value:boolean){this.recording=value;if(value){this.trace=[];this.trainingTraceVersion=0;this.filterCache=null;}}
 public confirmPoint(){this.pointConfirmed=true;}
 public exportDiagnostics(){return {version:4,units:'viewport CSS pixels and performance milliseconds',containsObservations:this.trace.length>0,settings:this.settings,report:this.report,detection:this.detection,inferenceMs:this.inferenceMs,status:this.status,guided:this.guidedRows,frames:this.trace};}
 public getFilterTrials(){if(!this.model)return [];const key=String(this.trainingTraceVersion)+JSON.stringify([this.model,this.settings]);if(this.filterCache?.key===key)return this.filterCache.value;const value=compareFilters(this.trace as ReplayFrame[],this.model,this.settings);this.filterCache={key,value};return value;}
 public getGuidedState(){return this.guide?{expected:this.guide.sequence[this.guide.index],index:this.guide.index,total:this.guide.sequence.length,rows:this.guide.rows,condition:this.guide.condition}:null;}
 public beginGuidedTest(sequence:string[],condition:string){if(!this.isCalibrated())throw new Error('Pass validation before guided selection testing.');this.guide={sequence,index:0,start:performance.now(),condition,rows:[]};this.userPaused=false;this.dwell.clear();this.emit(true);}
 public endGuidedTest(){this.guide=null;this.dwell.clear();this.emit(true);}
 private guideResult(selected:string|null,now:number){if(!this.guide)return;const g=this.guide;const row:GuidedRow={condition:g.condition,expected:g.sequence[g.index],selected,result:selected===null?'missed':selected===g.sequence[g.index]?'correct':'incorrect',elapsedMs:now-g.start,recordedAt:Date.now()};g.rows.push(row);this.guidedRows.push(row);g.index++;g.start=now;this.dwell.clear();if(g.index>=g.sequence.length)this.guide=null;if(this.report){this.report.guided=[...this.guidedRows];this.persist();}this.emit(true);}
 public async start():Promise<boolean>{if(this.startPromise)return this.startPromise;if(this.stream)return true;const gen=++this.generation;this.startPromise=this.open(gen);try{return await this.startPromise;}finally{if(gen===this.generation)this.startPromise=null;}}
 private async open(gen:number):Promise<boolean>{
  let stream:MediaStream|null=null,mesh:FaceMesh|null=null;
  try{
   this.status='Opening camera…';this.emit(true);if(!navigator.mediaDevices?.getUserMedia)throw new Error('Use HTTPS or localhost with a camera-capable browser.');
   stream=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480},frameRate:{ideal:30,max:30},facingMode:'user'},audio:false});
   if(gen!==this.generation){stream.getTracks().forEach(t=>t.stop());return false;}
   const video=document.createElement('video');video.playsInline=true;video.muted=true;video.srcObject=stream;
   // Keep the source video rendered for browsers that suspend detached video decoding.
   if(video.style){video.style.cssText='position:fixed;left:0;bottom:0;width:1px;height:1px;opacity:0;pointer-events:none';video.setAttribute('aria-hidden','true');document.body?.appendChild(video);}
   this.video=video;this.stream=stream;await video.play();
   if(gen!==this.generation){video.srcObject=null;video.remove?.();stream.getTracks().forEach(t=>t.stop());return false;}
   this.status='Camera ready — loading iris model…';this.emit(true);
   await loadModel();if(gen!==this.generation)return false;
   mesh=new window.FaceMesh!({locateFile:f=>ASSETS+f});mesh.setOptions({maxNumFaces:1,refineLandmarks:true,minDetectionConfidence:.7,minTrackingConfidence:.7,selfieMode:false});
   this.status='Initializing iris model…';this.emit(true);
   if(mesh.initialize){let timer:ReturnType<typeof setTimeout>|undefined;try{await Promise.race([mesh.initialize(),new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(new Error('Eye model initialization timed out. Retry camera; check that this deployment includes eye-model assets.')),30000);})]);}finally{clearTimeout(timer);}}
   if(gen!==this.generation){await mesh.close();return false;}
   mesh.onResults(r=>{if(gen===this.generation)this.process(r.multiFaceLandmarks?.[0]||[]);});
   this.video=video;this.stream=stream;this.mesh=mesh;this.lastVideoTime=-1;this.pending=null;this.latest=null;this.observations=[];this.verified=false;this.userPaused=true;this.status='Face the camera with both eyes visible';this.openedAt=performance.now();this.lastResult=0;this.lastValid=0;this.detection=undefined;
   const geometry=captureGeometry(video,stream);if(this.geometry&&!sameGeometry(this.geometry,geometry)){this.model=null;this.fullValidated=false;this.fullReport=null;this.training.clear();this.report=null;}this.geometry=geometry;
   const invalidate=()=>{if(this.geometry&&!sameGeometry(this.geometry,captureGeometry(this.video,this.stream))){this.verified=false;this.cancelCalibration();this.training.clear();this.unavailable('Screen/camera geometry changed — recalibrate');}};
   const resetDwell=()=>{this.hovered=null;this.progress=0;this.dwell.reset();this.emit(true);};
   window.addEventListener('resize',invalidate);window.addEventListener('orientationchange',invalidate);window.visualViewport?.addEventListener('resize',invalidate);window.visualViewport?.addEventListener('scroll',invalidate);window.addEventListener('scroll',resetDwell,true);
   const hidden=()=>{if(document.hidden)this.unavailable('Tracking unavailable while the app is hidden');};document.addEventListener('visibilitychange',hidden);
   this.removeLifecycle=()=>{window.removeEventListener('resize',invalidate);window.removeEventListener('orientationchange',invalidate);window.visualViewport?.removeEventListener('resize',invalidate);window.visualViewport?.removeEventListener('scroll',invalidate);window.removeEventListener('scroll',resetDwell,true);document.removeEventListener('visibilitychange',hidden);};
   stream.getVideoTracks()[0].addEventListener('ended',()=>{if(gen===this.generation)this.stop();});
   let useVideoCallback=!!video.requestVideoFrameCallback,scheduledAt=0;
   this.watchdog=setInterval(()=>{const now=performance.now();if(useVideoCallback&&this.videoFrame!==null&&now-scheduledAt>1000){video.cancelVideoFrameCallback?.(this.videoFrame);this.videoFrame=null;useVideoCallback=false;schedule();}if(!this.lastResult&&now-this.openedAt>3000)this.unavailable('Camera is playing but no eye-model results arrived. Retry camera.');if(this.lastResult&&now-this.lastResult>this.settings.maxFrameAgeMs)this.unavailable('Camera frames are stale — selection stopped');if(this.guide&&now-this.guide.start>=this.settings.guidedTimeoutMs)this.guideResult(null,now);invalidate();},80);
   const schedule=()=>{if(gen!==this.generation)return;scheduledAt=performance.now();if(useVideoCallback)this.videoFrame=video.requestVideoFrameCallback((_t,m)=>{this.videoFrame=null;if(useVideoCallback)void predict(m.mediaTime);});else this.raf=requestAnimationFrame(()=>{this.raf=null;void predict(video.currentTime);});};
   const predict=async(mediaTime:number)=>{
    if(gen!==this.generation)return;
    try{if(document.hidden)this.unavailable('Tracking unavailable while the app is hidden');else if(video.readyState>=2&&mediaTime>this.lastVideoTime){this.lastVideoTime=mediaTime;this.pending={frameId:++this.frameCounter,timestamp:performance.now(),videoTime:mediaTime};await mesh!.send({image:video});}}
    catch(error){if(gen===this.generation)this.unavailable('Iris model inference failed. Retry camera. '+(error instanceof Error?error.message:''));}finally{if(gen===this.generation)schedule();}
   };
   schedule();this.emit(true);return true;
  }catch(error){stream?.getTracks().forEach(t=>t.stop());await mesh?.close().catch(()=>{});if(gen===this.generation){this.video?.pause();if(this.video){this.video.srcObject=null;this.video.remove?.();}this.stream=null;this.video=null;this.mesh=null;this.unavailable(cameraError(error));}return false;}
 }
 public cancelCalibration(){this.run++;this.collecting=null;this.activeLabel=null;this.calibrating=false;this.dwell.clear();}
 public stop(){++this.generation;this.startPromise=null;this.cancelCalibration();this.removeLifecycle?.();this.removeLifecycle=null;if(this.raf!==null)cancelAnimationFrame(this.raf);if(this.videoFrame!==null)this.video?.cancelVideoFrameCallback?.(this.videoFrame);this.raf=this.videoFrame=null;if(this.watchdog)clearInterval(this.watchdog);this.watchdog=null;const mesh=this.mesh;this.mesh=null;void mesh?.close().catch(()=>{});this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;if(this.video){this.video.pause();this.video.srcObject=null;this.video.remove?.();}this.video=null;this.training.clear();this.verified=false;this.face=false;this.detection=undefined;this.latest=null;this.pending=null;this.filter.reset();this.userPaused=true;this.guide=null;this.unavailable('Eye tracking is off');}
 private process(landmarks:Landmark[]){
  const pending=this.pending,now=performance.now();if(!pending||pending.frameId<=this.lastProcessed||!this.video)return;this.lastProcessed=pending.frameId;this.lastResult=now;
  const result=extractEyeSample(landmarks,this.video.videoWidth,this.video.videoHeight,pending.timestamp);this.face=result.face;this.blink=result.blinking;this.detection=result.detection;this.inferenceMs=now-pending.timestamp;
  const reason=now-pending.timestamp>this.settings.maxFrameAgeMs?`Eye processing took ${Math.round(now-pending.timestamp)} ms (limit ${this.settings.maxFrameAgeMs} ms). Close other apps or try a faster browser/device.`:document.hidden?'App hidden':!result.sample?result.detection.reason:this.calibrating&&this.collectionPose&&result.sample&&!poseMatches(result.sample.pose,this.collectionPose)?'Keep approximately the same head position':undefined;
  const sample=reason?null:{...result.sample!,frameId:pending.frameId,videoTime:pending.videoTime};
  const observation:FrameObservation={...pending,sample,reason};this.observations.push(observation);this.observations=this.observations.filter(f=>now-f.timestamp<1500);this.collecting?.push(observation);this.latest=sample;if(sample)this.lastValid=pending.timestamp;
  if(this.recording){if(this.activeLabel?.id.startsWith('train-'))this.trainingTraceVersion++;this.trace.push({frame:observation,label:this.activeLabel?{...this.activeLabel}:null,raw:null,filtered:null});if(this.trace.length>6000)this.trace.shift();}
  if(!sample){this.unavailable(reason||'Eyes unavailable');return;}
  if(this.calibrating){this.tracking=false;this.status='Valid eye frame';this.emit();return;}
  if(this.userPaused){this.tracking=false;this.status=this.verified?'Eye control paused':'Eyes ready — calibration or accuracy check required';this.emit();return;}
  if(!this.isCalibrated()){this.verified=false;this.unavailable('Geometry changed or calibration unverified — run a check');return;}
  if(!this.baseline||!poseMatches(sample.pose,this.baseline)){this.verified=false;this.unavailable('Your position changed — run an accuracy check or recalibrate');return;}
  const raw=projectGaze(this.model!,sample.px,sample.py),filtered=this.filter.update(raw,pending.timestamp);
  if(this.recording)Object.assign(this.trace.at(-1) as object,{raw,filtered});
  if(!filtered){this.unavailable('Isolated tracking spike — selection paused');return;}
  if(filtered.x<0||filtered.y<0||filtered.x>window.innerWidth||filtered.y>window.innerHeight){this.unavailable('Look back at the screen');return;}
  this.gaze=filtered;this.tracking=true;this.status='Eye control active';
  if(document.querySelector('[data-eye-calibration]')){this.hovered=null;this.progress=0;this.dwell.reset();this.emit();return;}
  const regions=getTargetRegions(),target=detectTarget(filtered,regions,this.hovered?.id||null,this.settings.boundaryPx);
  const measuredRegions=[...(this.report?.regions||[]),...(this.report?.baselineRegions||[])];
  const worst=measuredRegions.length?Math.max(...measuredRegions.map(r=>r.p90Px)):Infinity;
  const visible=target&&(pointHasTarget(filtered,target)||pointHasTarget({x:Math.max(target.rect.left+1,Math.min(target.rect.left+target.rect.width-1,filtered.x)),y:Math.max(target.rect.top+1,Math.min(target.rect.top+target.rect.height-1,filtered.y))},target));
  const measured=target&&measuredRegions.find(r=>r.slot===target.slot&&r.rect);
  const sameLayout=measured?.rect&&target?Math.hypot(rectCenter(measured.rect).x-rectCenter(target.rect).x,rectCenter(measured.rect).y-rectCenter(target.rect).y)<Math.max(30,Math.min(target.rect.width,target.rect.height)*.25):false;
  const validTarget=target&&visible&&sameLayout&&worst<=targetTolerance(target,regions)?target:null;
  if(target&&!validTarget){this.status='Target layout or precision changed — check accuracy or enlarge targets';}
  this.dwell.setContext(this.guide?`guided-${this.guide.index}`:this.context);
  const dwell=this.dwell.update(validTarget,filtered,pending.timestamp,true);this.hovered=validTarget;this.progress=dwell.progress;
  if(dwell.fire&&validTarget){this.hovered=null;this.progress=0;if(this.guide)this.guideResult(validTarget.slot,now);else this.onAction?.(validTarget.slot==='NEXT'?{type:'next'}:{type:'choice',id:validTarget.slot});}
  this.emit();
 }
 private async collect(target:{id:string;label:string;point:Point},phase:CalibrationProgress['phase'],index:number,total:number,progress:(p:CalibrationProgress)=>void,token:number):Promise<FrameObservation[]> {
  const guard=()=>{if(token!==this.run)throw new Error('Calibration cancelled');};
  const show=(frames:FrameObservation[],message:string)=>{const stats=collectionStats(frames,this.settings.maxSampleGapMs);progress({phase,index,total,id:target.id,label:target.label,target:target.point,accepted:stats.valid.length,required:this.settings.minSamples,progress:Math.min(1,stats.validMs/this.settings.validCollectionMs,stats.valid.length/this.settings.minSamples),message});};
  this.collecting=null;this.pointConfirmed=false;this.activeLabel={target:target.point,id:target.id,phase:'waiting'};show([],this.confirmTargets?'Look at the dot, then tap it or press Enter/Space':'Look at the center of this dot');
  while(this.confirmTargets&&!this.pointConfirmed){await new Promise<void>(r=>setTimeout(r,30));guard();}
  this.activeLabel={target:target.point,id:target.id,phase:'settling'};
  const delay=()=>new Promise<void>(r=>setTimeout(r,30));const settle=performance.now();while(performance.now()-settle<this.settings.settleMs){await delay();guard();}
  this.collecting=[];this.activeLabel={target:target.point,id:target.id,phase:'collecting'};const begin=performance.now();
  try{while(performance.now()-begin<this.settings.pointTimeoutMs){await delay();guard();const frames=[...this.collecting],stats=collectionStats(frames,this.settings.maxSampleGapMs);show(frames,stats.valid.length?'Keep looking at the dot center':this.status);
    if(stats.validMs>=this.settings.validCollectionMs&&stats.valid.length>=this.settings.minSamples&&performance.now()-(stats.valid.at(-1)?.timestamp||0)<this.settings.maxFrameAgeMs)return frames;}
   const stats=collectionStats(this.collecting,this.settings.maxSampleGapMs);throw new Error(`${target.label}: ${stats.valid.length} valid samples, ${Math.round(stats.validFraction*100)}% valid, ${stats.effectiveHz.toFixed(1)} Hz. Check eye visibility and retry this point.`);
  }finally{if(token===this.run){this.collecting=null;this.activeLabel=null;}}
 }
 public async calibrate(progress:(p:CalibrationProgress)=>void,options:{short?:boolean;confirmTargets?:boolean}={}):Promise<boolean>{
  this.cancelCalibration();this.confirmTargets=options.confirmTargets||false;const token=this.run;this.userPaused=true;this.verified=false;
  if(!await this.start()||token!==this.run)return false;
  const geometry=captureGeometry(this.video,this.stream);this.calibrating=true;this.collectionPose=this.latest?.pose||null;this.filter.reset();
  const report:CalibrationReport={version:4,createdAt:Date.now(),mode:options.short?'short':'full',passed:false,geometry,regions:[],issues:[],failedTrainingIds:[],guided:[...this.guidedRows]};this.report=report;
  try{
   if(geometry.scale!==1)throw new Error('Reset page pinch zoom to 100% before calibration.');
   const setupDeadline=performance.now()+20000;while(!this.getSetup().ready){if(token!==this.run)return false;if(performance.now()>setupDeadline)throw new Error(this.status||'Eyes not ready');await new Promise(r=>setTimeout(r,40));}
   if(options.short){if(!this.fullValidated||!this.model||!this.geometry||!sameGeometry(this.geometry,geometry))throw new Error('The restored model does not match this camera/viewport. Run all nine dots.');}
   else{
    this.fullValidated=false;this.fullReport=null;
    for(let i=0;i<CALIBRATION_TARGETS.length;i++){
     const target=CALIBRATION_TARGETS[i],id=`train-${i}`;if(this.training.has(id))continue;
     try{const frames=await this.collect({id,label:target.label,point:{x:target.x*geometry.width,y:target.y*geometry.height}},'training',i,9,progress,token);const stats=collectionStats(frames,this.settings.maxSampleGapMs);
      this.training.set(id,stats.valid.map(sample=>({sample,target:{x:target.x*geometry.width,y:target.y*geometry.height},targetId:id})));
     }catch(error){if(token!==this.run)return false;report.failedTrainingIds.push(id);report.issues.push(error instanceof Error?error.message:String(error));}
    }
    if(this.training.size!==9){this.status=report.issues[0]||'Some calibration dots need another attempt';return false;}
    const selection=chooseModel(this.training,{x:geometry.width,y:geometry.height},this.settings);if(!selection){this.training.clear();report.failedTrainingIds=CALIBRATION_TARGETS.map((_,i)=>`train-${i}`);throw new Error('Insufficient independent eye-feature variation or a numerical fit failure. Retry the nine dots with only your eyes moving.');}
    this.model=selection.model;this.comparison=selection.comparison;report.comparison=selection.comparison;
    const center=this.training.get('train-0')!;this.baseline=Object.fromEntries(Object.keys(center[0].sample.pose).map(k=>[k,median(center.map(d=>d.sample.pose[k as keyof Pose]))])) as Pose;
   }
   const actual=getTargetRegions(true);if(!actual.length)throw new Error('Open a question with visible enabled answer choices before validating selection.');
   if(options.short&&actual.some(r=>!this.fullReport?.regions.some(m=>m.slot===r.slot&&m.rect&&Math.hypot(rectCenter(m.rect).x-rectCenter(r.rect).x,rectCenter(m.rect).y-rectCenter(r.rect).y)<30)))throw new Error('The answer layout changed. Run the full independent region checks.');
   const reference=Math.min(...actual.map(r=>targetTolerance(r,actual)));
   const fixed=options.short?[VALIDATION_TARGETS[0]]:VALIDATION_TARGETS;
   const tests:{id:string;label:string;point:Point;region?:TargetRegion;tolerance:number}[]=fixed.map((t,i)=>({id:`validation-${i}`,label:t.label,point:{x:t.x*geometry.width,y:t.y*geometry.height},tolerance:reference}));
   const testedRegions=options.short?[actual[0],actual.at(-1)!]:actual;
   tests.push(...testedRegions.map(r=>({id:r.id,label:`Choice ${r.slot}`,point:rectCenter(r.rect),region:r,tolerance:targetTolerance(r,actual)})));
   // Freeze model coefficients. Fresh validation observations are NEVER fed to fitModel/chooseModel.
   const frozen=structuredClone(this.model!);const validationPoses:Pose[]=[];
   for(let i=0;i<tests.length;i++){
    const t=tests[i];try{
     const frames=await this.collect(t,'validation',i,tests.length,progress,token),metrics=measureRegion(frozen,frames,t.point,t.region,this.settings,t.label,t.id,t.tolerance);
     validationPoses.push(...frames.flatMap(f=>f.sample?[f.sample.pose]:[]));
     if(!metrics){report.issues.push(`${t.label}: insufficient valid validation frames`);continue;}
     report.regions.push(metrics);if(!metrics.passed)report.issues.push(`${t.label}: median ${Math.round(metrics.medianPx)} px, p90 ${Math.round(metrics.p90Px)} px. ${metrics.reason}`);
    }catch(error){if(token!==this.run)return false;report.issues.push(error instanceof Error?error.message:String(error));}
   }
   if(!sameGeometry(geometry,captureGeometry(this.video,this.stream)))throw new Error('Camera/viewport changed during calibration. Restart the nine dots.');
   if(options.short&&validationPoses.length)this.baseline=Object.fromEntries(Object.keys(validationPoses[0]).map(k=>[k,median(validationPoses.map(p=>p[k as keyof Pose]))])) as Pose;
   report.passed=report.issues.length===0&&report.regions.length===tests.length&&report.regions.every(r=>r.passed);
   this.geometry=geometry;this.verified=report.passed;if(report.passed&&!options.short){this.fullValidated=true;this.fullReport=structuredClone(report);}if(report.passed&&options.short)report.baselineRegions=this.fullReport?.regions;this.status=report.passed?'Independent validation passed':report.issues[0]||'Validation incomplete';if(report.passed)this.persist();return report.passed;
  }catch(error){if(token===this.run){this.status=error instanceof Error?error.message:'Calibration failed';report.issues.push(this.status);}return false;}
  finally{if(token===this.run){this.calibrating=false;this.collecting=null;this.dwell.clear();this.filter.reset();this.emit(true);}}
 }
}
export const eyeTrackingEngine=new EyeTrackingEngine();
