/** Iris-based gaze control. Camera frames stay in the browser; only model assets are fetched. */
import { VALIDATION_TARGETS, accuracyPasses, measureGazeAccuracy, CALIBRATION_TARGETS, extractEyeSample, fitCalibration, GazeConfidence, GazeDwell, GazeSmoother, poseMatches, projectGaze, summarizeFixation } from './eyeTrackingMath';
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
  public getStatus() {return this.status;}
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
    ++this.generation;this.starting=null;this.sessionVerified=false;this.cancelCalibration();
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
    if(this.isCalibrating){this.collecting?.push(sample);this.tracking=false;this.notify();return;}
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
  public async calibrate(onProgress:(point:number,progress:number)=>void):Promise<boolean> {
    this.cancelCalibration();const generation=this.calibrationGeneration;
    const started=await this.start();
    if(!started||generation!==this.calibrationGeneration)return false;
    this.sessionVerified=false;this.isCalibrating=true;this.dwell.clear();this.hovered=null;this.progress=0;this.tracking=false;this.notify();
    const samples:EyeSample[]=[];
    const viewport={width:window.innerWidth,height:window.innerHeight};
    const delay=(ms:number)=>new Promise<void>(resolve=>setTimeout(resolve,ms));
    try {
      // WASM/model initialization can outlast camera startup. Never train on empty startup frames.
      const warmupStart=performance.now();
      while(!this.lastSample||performance.now()-this.lastSample.timestamp>200){
        await delay(40);if(generation!==this.calibrationGeneration)return false;
        if(performance.now()-warmupStart>20000)throw new Error('Could not find both eyes. Check lighting, camera position and model connection, then retry.');
      }
      for(let index=0;index<CALIBRATION_TARGETS.length;index++) {
        onProgress(index,0);this.collecting=null;
        // Let eyes settle after the dot moves. Transition frames must not become training samples.
        for(let i=0;i<18;i++){await delay(40);if(generation!==this.calibrationGeneration)return false;}
        this.collecting=[];const begin=performance.now();
        while(performance.now()-begin<1800){await delay(40);if(generation!==this.calibrationGeneration)return false;onProgress(index,Math.min(.99,(performance.now()-begin)/1800));}
        const fixation=summarizeFixation(this.collecting);this.collecting=null;
        if(!fixation||performance.now()-fixation.timestamp>200)throw new Error('Could not measure a steady gaze. Improve lighting, keep your head still, and retry.');
        if(samples.length&&!poseMatches(fixation.pose,samples[0].pose))throw new Error('Your head moved during calibration. Keep the same position and retry.');
        samples.push(fixation);onProgress(index,1);
      }
      if(viewport.width!==window.innerWidth||viewport.height!==window.innerHeight)throw new Error('Screen size changed. Please calibrate again.');
      const model=fitCalibration(samples);
      if(!model)throw new Error('Calibration was not accurate enough. Look directly at each dot and retry.');
      const checks:GazeAccuracy[]=[];
      for(let index=0;index<VALIDATION_TARGETS.length;index++) {
        const step=CALIBRATION_TARGETS.length+index;
        onProgress(step,0);this.collecting=null;
        for(let i=0;i<18;i++){await delay(40);if(generation!==this.calibrationGeneration)return false;}
        this.collecting=[];const validationStart=performance.now();
        while(performance.now()-validationStart<1600){await delay(40);if(generation!==this.calibrationGeneration)return false;onProgress(step,Math.min(.99,(performance.now()-validationStart)/1600));}
        const frames=this.collecting;const check=summarizeFixation(frames);this.collecting=null;
        if(!check||performance.now()-check.timestamp>200||!poseMatches(check.pose,samples[0].pose))throw new Error('Could not confirm calibration. Keep your head still and retry.');
        const accuracy=measureGazeAccuracy(model,frames,VALIDATION_TARGETS[index],viewport);
        if(!accuracy||!accuracyPasses(accuracy,viewport))throw new Error(`Eye control is not accurate enough at this point${accuracy?` (offset ${Math.round(accuracy.errorPx)} px, shake ${Math.round(accuracy.jitterPx)} px)`:''}. Retry calibration or use touch/mouse.`);
        checks.push(accuracy);onProgress(step,1);
      }
      if(viewport.width!==window.innerWidth||viewport.height!==window.innerHeight||window.visualViewport&&Math.abs(window.visualViewport.scale-1)>.01)throw new Error('Screen size or zoom changed. Reset zoom and calibrate again.');
      this.saveCalibration({version:3,checks,model,pose:samples[0].pose,viewport,deviceId:this.stream!.getVideoTracks()[0].getSettings().deviceId||'',calibratedAt:Date.now()});
      this.status=`Calibration test error: ${Math.ceil(Math.max(...checks.map(c=>c.errorPx)))} px`;this.filter.reset();return true;
    } catch(error) {this.status=error instanceof Error?error.message:'Calibration failed.';return false;}
    finally {if(generation===this.calibrationGeneration){this.isCalibrating=false;this.collecting=null;this.validSince=0;this.notify();}}
  }
}
export const eyeTrackingEngine=new EyeTrackingEngine();
