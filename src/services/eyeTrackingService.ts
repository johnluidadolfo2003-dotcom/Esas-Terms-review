/** Iris-based gaze control. Camera frames stay in the browser; only model assets are fetched. */
import { VALIDATION_TARGETS, accuracyPasses, correctConsistentOffset, measureRenderedGazeAccuracy, recentFixationFrames, CALIBRATION_TARGETS, extractEyeSample, fitCalibration, GazeConfidence, GazeDwell, GazeSmoother, poseMatches, projectGaze, summarizeFixation } from './eyeTrackingMath';
import type { EyeSample, GazeAccuracy, GazeModel, Landmark, Pose } from './eyeTrackingMath';
export interface EyeCalibrationData {
  version: 3;
  checks: GazeAccuracy[];
  model: GazeModel;
  pose: Pose;
  viewport: { width: number; height: number };
  deviceId: string;
  calibratedAt: number;
}
export interface EyeTrackingState {
  isActive: boolean;
  isCalibrated: boolean;
  isTracking: boolean;
  faceDetected: boolean;
  gazeX: number;
  gazeY: number;
  hoveredChoiceId: string | null;
  dwellProgress: number;
  isBlinking: boolean;
  status?: string;
}
export type EyeTrackingListener = (state: EyeTrackingState) => void;
type FaceMesh = { setOptions(options: Record<string, unknown>): void; onResults(cb: (results: {multiFaceLandmarks?: Landmark[][]}) => void): void; send(input: {image: HTMLVideoElement}): Promise<void>; close(): Promise<void> };
declare global { interface Window { FaceMesh?: new (options: {locateFile: (file: string) => string}) => FaceMesh } }
const ASSETS = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/';
const STORAGE_KEY = 'teerms_eye_calibration_v3';
let modelScript: Promise<void> | null = null;
function loadModelScript(): Promise<void> {
  if (window.FaceMesh) return Promise.resolve();
  if (!modelScript) modelScript = new Promise<void>((resolve,reject) => {
    const script = document.createElement('script');
    const timer = setTimeout(() => fail(),20000);
    const fail = () => { clearTimeout(timer); script.remove(); reject(new Error('Eye model could not load. Check your connection and retry.')); };
    script.src = `${ASSETS}face_mesh.js`;script.crossOrigin='anonymous';script.async=true;
    script.onload=()=>{clearTimeout(timer);window.FaceMesh ? resolve() : fail();};script.onerror=fail;
    document.head.appendChild(script);
  }).catch(error=>{modelScript=null;throw error;});
  return modelScript;
}
export class EyeTrackingEngine {
  private video: HTMLVideoElement | null=null;
  private stream: MediaStream | null=null;
  private mesh: FaceMesh | null=null;
  private frame: number | null=null;
  private watchdog: ReturnType<typeof setInterval> | null=null;
  private generation=0;
  private starting: Promise<boolean> | null=null;
  private calibrationGeneration=0;
  private isCalibrating=false;
  private collecting: EyeSample[] | null=null;
  private calibration: EyeCalibrationData | null=null;
  private sessionVerified=false;
  private draft:{samples:EyeSample[];model:GazeModel;viewport:{width:number;height:number};deviceId:string}|null=null;
  private listeners=new Set<EyeTrackingListener>();
  private filter=new GazeSmoother();
  private confidence=new GazeConfidence();
  private dwell=new GazeDwell();
  private face=false;
  private blinking=false;
  private tracking=false;
  private status='Eye tracking is off';
  private gaze={x:0,y:0};
  private hovered:string|null=null;
  private progress=0;
  private previousTarget: HTMLElement | null=null;
  private lastVideoTime=-1;
  private lastFrameAt=0;
  private lastSample:EyeSample|null=null;
  private validSince=0;
  private audio:AudioContext|null=null;
  private onAction:((action:{type:'choice'|'next';id?:string})=>void)|null=null;
  constructor() { this.loadSavedCalibration(); }
  public loadSavedCalibration(): EyeCalibrationData|null {
    this.calibration=null;
    try {
      const data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
      const finite=(n: unknown)=>typeof n==='number' && Number.isFinite(n);
      if(data?.version===3 && data.model && [data.model.x,data.model.y].every(a=>Array.isArray(a)&&a.length===6&&a.every(finite)) && [data.model.mean?.x,data.model.mean?.y,data.model.scale?.x,data.model.scale?.y,data.model.error,data.viewport?.width,data.viewport?.height,data.calibratedAt].every(finite) && data.model.scale.x>=.025 && data.model.scale.y>=.008 && data.model.error<=.045 && Array.isArray(data.checks)&&data.checks.length===VALIDATION_TARGETS.length&&data.checks.every((c:GazeAccuracy)=>(['errorPx','p90ErrorPx','jitterPx'] as const).every(k=>finite(c[k])&&c[k]>=0)&&accuracyPasses(c,data.viewport)) && data.viewport.width>0 && data.viewport.height>0 && data.pose && ['x','y','yaw','pitch','roll','scale'].every(k=>finite(data.pose[k])) && data.pose.scale>0 && typeof data.deviceId==='string') this.calibration=data;
    } catch { this.calibration=null; }
    return this.calibration;
  }
  public saveCalibration(data:EyeCalibrationData) {this.calibration=data;this.sessionVerified=true;try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}catch{/* Current session can still use calibration. */}}
  public isCalibrated():boolean {
    if(!this.calibration || !this.sessionVerified || typeof window==='undefined') return false;
    const v=this.calibration.viewport;
    return Math.abs(window.innerWidth/v.width-1)<.02 && Math.abs(window.innerHeight/v.height-1)<.02 && (!window.visualViewport || Math.abs(window.visualViewport.scale-1)<.01);
  }
  public setActionCallback(cb:(action:{type:'choice'|'next';id?:string})=>void) {this.onAction=cb;}
  public subscribe(listener:EyeTrackingListener) {this.listeners.add(listener);return ()=>{this.listeners.delete(listener);};}
  private notify() {
    const state:EyeTrackingState={isActive:Boolean(this.stream),isCalibrated:this.isCalibrated(),isTracking:this.tracking&&!this.isCalibrating,faceDetected:this.face,gazeX:this.gaze.x,gazeY:this.gaze.y,hoveredChoiceId:this.hovered,dwellProgress:this.progress,isBlinking:this.blinking,status:this.status};
    this.listeners.forEach(listener=>listener(state));
  }
  public getMediaStream(): MediaStream | null { return this.stream; }
  public getVideoElement(): HTMLVideoElement | null { return this.video; }
  public getLatestSample(): EyeSample | null { return this.lastSample; }
  public getDraftModel(): GazeModel | null { return this.draft?.model || null; }
  public getStatus() {return this.status;}
  public canRetryAccuracy():boolean {return Boolean(this.draft&&this.stream&&this.draft.viewport.width===window.innerWidth&&this.draft.viewport.height===window.innerHeight&&this.draft.deviceId===(this.stream.getVideoTracks()[0].getSettings().deviceId||''));}
  public discardCalibrationAttempt():void {this.draft=null;}
  public getAccuracyReport():string {return this.sessionVerified&&this.calibration?`Calibration test error: ${Math.ceil(Math.max(...this.calibration.checks.map(c=>c.errorPx)))} px`:'Calibration not verified';}
  private pause(status:string,keepWindow=false) {if(!keepWindow)this.confidence.reset();this.tracking=false;this.status=status;this.hovered=null;this.progress=0;this.previousTarget=null;this.validSince=0;this.dwell.reset();this.filter.suspend();this.notify();}
  public async start():Promise<boolean> {
    if(this.starting) return this.starting;
    if(this.stream) return true;
    const generation=++this.generation;
    this.starting=this.openCamera(generation);
    try{return await this.starting;}finally{if(generation===this.generation)this.starting=null;}
  }
  private async openCamera(generation:number):Promise<boolean> {
    let stream:MediaStream|null=null, mesh:FaceMesh|null=null;
    try {
      this.status='Loading eye model and camera…';this.notify();
      if(!navigator.mediaDevices?.getUserMedia) throw new Error('Camera needs HTTPS and a supported browser.');
      await loadModelScript();
      if(generation!==this.generation)return false;
      stream=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480},frameRate:{ideal:30,max:30},facingMode:'user'},audio:false});
      if(generation!==this.generation){stream.getTracks().forEach(t=>t.stop());return false;}
      const video=document.createElement('video');video.playsInline=true;video.muted=true;video.srcObject=stream;
      await video.play();
      if(generation!==this.generation){video.srcObject=null;stream.getTracks().forEach(t=>t.stop());return false;}
      mesh=new window.FaceMesh!({locateFile:file=>`${ASSETS}${file}`});
      mesh.setOptions({maxNumFaces:1,refineLandmarks:true,minDetectionConfidence:.7,minTrackingConfidence:.7,selfieMode:false});
      mesh.onResults(results=>{if(generation===this.generation)this.processResults(results.multiFaceLandmarks?.[0]||[]);});
      this.video=video;this.stream=stream;this.mesh=mesh;
      if(this.calibration?.deviceId!==(stream.getVideoTracks()[0].getSettings().deviceId||''))this.calibration=null;
      this.lastVideoTime=-1;this.lastFrameAt=performance.now();this.lastSample=null;this.confidence.reset();this.dwell.clear();this.filter.reset();
      this.status=this.isCalibrated()?'Finding your eyes…':'Calibration required';
      stream.getVideoTracks()[0].addEventListener('ended',()=>{if(generation===this.generation)this.stop();});
      this.watchdog=setInterval(()=>{if(performance.now()-this.lastFrameAt>500)this.pause('Waiting for a clear camera frame…');},250);
      const loop=async()=>{
        if(generation!==this.generation)return;
        try {
          if(document.hidden)this.pause('Tracking paused while the page is hidden');
          else if(video.readyState>=2 && video.currentTime!==this.lastVideoTime) {this.lastVideoTime=video.currentTime;await mesh!.send({image:video});}
        } catch {if(generation===this.generation)this.pause('Eye model failed. Turn eye tracking off and retry.');}
        if(generation===this.generation)this.frame=requestAnimationFrame(loop);
      };
      this.frame=requestAnimationFrame(loop);this.notify();return true;
    } catch(error) {
      stream?.getTracks().forEach(t=>t.stop());await mesh?.close().catch(()=>{});
      if(generation===this.generation){this.stream=null;this.video=null;this.mesh=null;this.pause(error instanceof Error?error.message:'Camera could not start.');}
      return false;
    }
  }
  public cancelCalibration() {++this.calibrationGeneration;this.isCalibrating=false;this.collecting=null;this.dwell.reset();this.filter.reset();}
  public stop() {
    ++this.generation;this.starting=null;this.sessionVerified=false;this.draft=null;this.cancelCalibration();
    if(this.frame!==null)cancelAnimationFrame(this.frame);this.frame=null;
    if(this.watchdog)clearInterval(this.watchdog);this.watchdog=null;
    const mesh=this.mesh;this.mesh=null;void mesh?.close().catch(()=>{});
    this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;
    if(this.video){this.video.pause();this.video.srcObject=null;this.video=null;}
    this.face=false;this.blinking=false;this.dwell.clear();this.pause('Eye tracking is off');
  }
  private processResults(landmarks:Landmark[]) {
    if(!this.video || document.hidden){this.pause('Tracking paused');return;}
    const now=performance.now();this.lastFrameAt=now;
    const result=extractEyeSample(landmarks,this.video.videoWidth,this.video.videoHeight,now);
    this.face=result.face;this.blinking=result.blinking;
    this.lastSample=result.sample;
    if(!result.sample){this.pause(result.blinking?'Blink detected — selection paused':result.face?'Keep both eyes visible and face the camera':'Face not detected');return;}
    const sample=result.sample;
    if(this.isCalibrating){
      this.collecting?.push(sample);
      const activeModel = this.draft?.model || this.calibration?.model;
      if (activeModel) {
        const normalized = projectGaze(activeModel, sample.px, sample.py);
        if (Number.isFinite(normalized.x) && Number.isFinite(normalized.y)) {
          const fixation = this.confidence.update({x: normalized.x * window.innerWidth, y: normalized.y * window.innerHeight}, now);
          if (fixation) {
            this.gaze = this.filter.update({x: Math.max(0, Math.min(window.innerWidth, fixation.x)), y: Math.max(0, Math.min(window.innerHeight, fixation.y))}, now);
          }
        }
      } else if (this.collecting && this.collecting.length > 2) {
        const interimX = Math.max(0, Math.min(window.innerWidth, (sample.px - 0.2) / 0.6 * window.innerWidth));
        const interimY = Math.max(0, Math.min(window.innerHeight, (sample.py - 0.05) / 0.2 * window.innerHeight));
        this.gaze = this.filter.update({x: interimX, y: interimY}, now);
      }
      this.tracking=true;
      this.notify();
      return;
    }
    if(!this.isCalibrated()){this.pause('Recalibrate for this screen and camera');return;}
    if(!poseMatches(sample.pose,this.calibration!.pose)){this.pause('Return to your calibration position or recalibrate');return;}
    const normalized=projectGaze(this.calibration!.model,sample.px,sample.py);
    if(!Number.isFinite(normalized.x)||!Number.isFinite(normalized.y)||normalized.x<-.15||normalized.x>1.15||normalized.y<-.15||normalized.y>1.15){this.pause('Look back at the screen');return;}
    const fixation=this.confidence.update({x:normalized.x*window.innerWidth,y:normalized.y*window.innerHeight},now);
    if(!fixation){this.pause('Hold your gaze steady — selection paused',true);return;}
    this.gaze=this.filter.update({x:Math.max(0,Math.min(window.innerWidth,fixation.x)),y:Math.max(0,Math.min(window.innerHeight,fixation.y))},now);
    this.tracking=true;this.status='Eye gaze active';
    if(!this.validSince)this.validSince=now;
    if(now-this.validSince<250){this.notify();return;}
    const target=this.findTarget(this.gaze.x,this.gaze.y);
    const slot=target?.getAttribute('data-choice-id')||(target?'NEXT':null);
    const key=target ? `${slot}:${target.dataset.gazeContext||''}:${target.dataset.gazeLabel||''}`:null;
    const dwell=this.dwell.update(key,slot,this.gaze,now);
    this.previousTarget=target;this.hovered=slot;this.progress=dwell.progress;
    if(dwell.fire && slot) {this.hovered=null;this.progress=0;this.clickSound();this.onAction?.(slot==='NEXT'?{type:'next'}:{type:'choice',id:slot});}
    this.notify();
  }
  private findTarget(x:number,y:number):HTMLElement|null {
    const selector='[data-choice-id], [data-action="next-card"]';
    const eligible=(el:HTMLElement)=>!el.matches(':disabled, [aria-disabled="true"]')&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden';
    const hit=document.elementFromPoint(x,y)?.closest<HTMLElement>(selector);
    if(hit&&eligible(hit))return hit;
    // Retain only in a small gap next to the current control, never through a modal or another control.
    const prior=this.previousTarget;
    if(prior&&eligible(prior)&&prior.isConnected) {
      const rect=prior.getBoundingClientRect();
      if(x>=rect.left-8&&x<=rect.right+8&&y>=rect.top-8&&y<=rect.bottom+8){
        const sx=Math.max(rect.left+1,Math.min(rect.right-1,x)),sy=Math.max(rect.top+1,Math.min(rect.bottom-1,y));
        if(document.elementFromPoint(sx,sy)?.closest(selector)===prior)return prior;
      }
    }
    return null;
  }
  private clickSound() {try{this.audio ||= new AudioContext();void this.audio.resume();const o=this.audio.createOscillator(),g=this.audio.createGain();o.frequency.value=880;g.gain.setValueAtTime(.04,this.audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,this.audio.currentTime+.08);o.connect(g);g.connect(this.audio.destination);o.start();o.stop(this.audio.currentTime+.08);}catch{/* Optional audio. */}}
  public async calibrate(onProgress:(point:number,progress:number,message?:string)=>void):Promise<boolean> {
    this.cancelCalibration();
    const generation=this.calibrationGeneration;
    const started=await this.start();
    if(!started||generation!==this.calibrationGeneration)return false;
    this.sessionVerified=false;this.isCalibrating=true;this.dwell.clear();
    this.hovered=null;this.progress=0;this.tracking=false;this.notify();
    const viewport={width:window.innerWidth,height:window.innerHeight};
    const deviceId=this.stream!.getVideoTracks()[0].getSettings().deviceId||'';
    if(this.draft&&(this.draft.deviceId!==deviceId||this.draft.viewport.width!==viewport.width||this.draft.viewport.height!==viewport.height))this.draft=null;
    const delay=(ms:number)=>new Promise<void>(resolve=>setTimeout(resolve,ms));
    const guard=()=>{if(generation!==this.calibrationGeneration)throw new Error('Calibration cancelled');};
    const collectPoint=async(index:number,baseline?:Pose,hint?:string):Promise<EyeSample[]>=>{
      this.collecting=null;onProgress(index,0,hint);
      for(let i=0;i<18;i++){await delay(40);guard();}
      this.collecting=[];
      const begin=performance.now();
      try {
        while(performance.now()-begin<6000){
          await delay(40);guard();
          const elapsed=performance.now()-begin;
          const frames=recentFixationFrames(this.collecting,performance.now());
          const fixation=summarizeFixation(frames);
          onProgress(index,Math.min(.95,elapsed/1800),elapsed>2200?'Keep looking at this dot — collecting clearer frames':hint);
          if(elapsed>=1800&&fixation&&performance.now()-fixation.timestamp<200&&(!baseline||poseMatches(fixation.pose,baseline))){onProgress(index,1);return frames;}
        }
        throw new Error('This dot needs a clearer view. Keep both eyes visible and your head in the same position, then retry.');
      } finally {if(generation===this.calibrationGeneration)this.collecting=null;}
    };
    try {
      const warmupStart=performance.now();
      while(!this.lastSample||performance.now()-this.lastSample.timestamp>200){
        await delay(40);guard();
        if(performance.now()-warmupStart>20000)throw new Error('Could not find both eyes. Check lighting, camera position and model connection, then retry.');
      }
      if(!this.draft){
        const samples:EyeSample[]=[];
        for(let index=0;index<CALIBRATION_TARGETS.length;index++){
          const frames=await collectPoint(index,samples[0]?.pose);
          samples.push(summarizeFixation(frames)!);
        }
        const model=fitCalibration(samples);
        if(!model)throw new Error('The nine dots did not form a reliable mapping. Look directly at each dot and restart calibration.');
        this.draft={samples,model,viewport,deviceId};
      }
      let model=this.draft.model;
      const baseline=this.draft.samples[0].pose;
      let checks:GazeAccuracy[]=[];
      // One bounded correction attempt, followed by an entirely fresh validation round.
      for(let round=0;round<2;round++){
        checks=[];
        for(let index=0;index<VALIDATION_TARGETS.length;index++){
          const step=CALIBRATION_TARGETS.length+index;
          let accuracy:GazeAccuracy|null=null;
          for(let attempt=0;attempt<2&&!accuracy;attempt++){
            const frames=await collectPoint(step,baseline,round===1?'Offset adjusted — verifying again':undefined);
            accuracy=measureRenderedGazeAccuracy(model,frames,VALIDATION_TARGETS[index],viewport);
            if(!accuracy)onProgress(step,0,'Hold this dot — checking the stabilized cursor again');
          }
          if(!accuracy)throw new Error('The cursor cannot stay stable yet. Your nine calibration dots are kept; retry the accuracy checks or use touch/mouse.');
          checks.push(accuracy);
        }
        if(checks.every(c=>accuracyPasses(c,viewport)))break;
        const corrected=round===0?correctConsistentOffset(model,checks,viewport):null;
        if(corrected){
          model=corrected;this.draft.model=corrected;
          continue;
        }
        const worst=checks.reduce((a,b)=>a.errorPx>b.errorPx?a:b);
        throw new Error(`Accuracy still needs improvement (offset ${Math.round(worst.errorPx)} px, shake ${Math.round(worst.jitterPx)} px). Retry checks to keep your nine dots, or restart if your position changed.`);
      }
      if(!checks.every(c=>accuracyPasses(c,viewport)))throw new Error('Accuracy checks did not pass. Retry the checks.');
      if(viewport.width!==window.innerWidth||viewport.height!==window.innerHeight||window.visualViewport&&Math.abs(window.visualViewport.scale-1)>.01)throw new Error('Screen size or zoom changed. Reset zoom and restart calibration.');
      this.saveCalibration({version:3,checks,model,pose:baseline,viewport,deviceId,calibratedAt:Date.now()});
      this.draft=null;this.status=this.getAccuracyReport();this.confidence.reset();this.filter.reset();return true;
    } catch(error) {
      if(generation===this.calibrationGeneration)this.status=error instanceof Error?error.message:'Calibration failed.';
      return false;
    } finally {
      if(generation===this.calibrationGeneration){this.isCalibrating=false;this.collecting=null;this.validSince=0;this.notify();}
    }
  }
}
export const eyeTrackingEngine=new EyeTrackingEngine();
