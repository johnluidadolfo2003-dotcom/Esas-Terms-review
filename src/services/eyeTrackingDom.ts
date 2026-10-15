import type {Point,TargetRegion,Rect} from './eyeTrackingMath';
import {rectCenter} from './eyeTrackingMath';
export type EyeGeometry={width:number;height:number;dpr:number;visualWidth:number;visualHeight:number;offsetX:number;offsetY:number;scale:number;orientation:number;cameraId:string;videoWidth:number;videoHeight:number};
export function captureGeometry(video:HTMLVideoElement|null,stream:MediaStream|null):EyeGeometry {
 const v=window.visualViewport;
 return {width:window.innerWidth,height:window.innerHeight,dpr:window.devicePixelRatio||1,visualWidth:v?.width||window.innerWidth,visualHeight:v?.height||window.innerHeight,offsetX:v?.offsetLeft||0,offsetY:v?.offsetTop||0,scale:v?.scale||1,orientation:screen.orientation?.angle||0,cameraId:stream?.getVideoTracks()[0]?.getSettings().deviceId||'',videoWidth:video?.videoWidth||0,videoHeight:video?.videoHeight||0};
}
export function sameGeometry(a:EyeGeometry,b:EyeGeometry):boolean {
 return a.cameraId===b.cameraId&&a.videoWidth===b.videoWidth&&a.videoHeight===b.videoHeight&&a.orientation===b.orientation&&Math.abs(a.dpr-b.dpr)<.01&&Math.abs(a.scale-b.scale)<.01&&Math.abs(a.offsetX-b.offsetX)<2&&Math.abs(a.offsetY-b.offsetY)<2&&Math.abs(a.width-b.width)<8&&Math.abs(a.height-b.height)<8&&Math.abs(a.visualWidth-b.visualWidth)<8&&Math.abs(a.visualHeight-b.visualHeight)<8;
}
// Preview mirroring/cropping is cosmetic. Inference always uses full, unmirrored native video.
export function previewPoint(native:Point,video:{width:number;height:number},box:{width:number;height:number},mirror=true):Point {
 const factor=Math.min(box.width/video.width,box.height/video.height);
 return {x:(box.width-video.width*factor)/2+(mirror?video.width-native.x:native.x)*factor,y:(box.height-video.height*factor)/2+native.y*factor};
}
const selector='[data-choice-id], [data-action="next-card"], [data-gaze-test-target]';
export function getTargetRegions(includeOccluded=false):TargetRegion[] {
 const panel=document.querySelector('[data-gaze-guide]')||document.querySelector('[data-gaze-panel]');
 const root=panel||document;
 return [...root.querySelectorAll<HTMLElement>(selector)].filter(el=>{
  const r=el.getBoundingClientRect(),style=getComputedStyle(el);
  if(el.matches(':disabled,[aria-disabled="true"]')||style.display==='none'||style.visibility==='hidden'||r.width<1||r.height<1||r.left<0||r.top<0||r.right>window.innerWidth||r.bottom>window.innerHeight)return false;
  if(includeOccluded)return true;
  return document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)?.closest(selector)===el;
 }).map(el=>{
  const slot=el.dataset.choiceId||(el.dataset.action?'NEXT':el.dataset.gazeTestTarget||'');
  const r=el.getBoundingClientRect();
  return {id:`${el.dataset.gazeContext||'review'}:${slot}:${el.dataset.gazeLabel||''}`,slot,label:el.dataset.gazeLabel||el.textContent?.trim()||slot,rect:{left:r.left,top:r.top,width:r.width,height:r.height}};
 });
}
export function targetTolerance(region:TargetRegion,all:TargetRegion[]):number {
 const c=rectCenter(region.rect);
 const toRect=(r:Rect)=>Math.hypot(Math.max(r.left-c.x,0,c.x-r.left-r.width),Math.max(r.top-c.y,0,c.y-r.top-r.height));
 return Math.min(Math.min(region.rect.width,region.rect.height)*.4,...all.filter(r=>r.id!==region.id).map(r=>toRect(r.rect)*.45));
}
export function pointHasTarget(point:Point,target:TargetRegion):boolean {
 const el=document.elementFromPoint(point.x,point.y)?.closest<HTMLElement>(selector);
 return !!el&&`${el.dataset.gazeContext||'review'}:${el.dataset.choiceId||(el.dataset.action?'NEXT':el.dataset.gazeTestTarget||'')}:${el.dataset.gazeLabel||''}`===target.id;
}
