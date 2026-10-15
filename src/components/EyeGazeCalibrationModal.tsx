import React,{useEffect,useRef,useState} from 'react';
import {eyeTrackingEngine} from '../services/eyeTrackingService';
import type {CalibrationProgress,EyeTrackingState} from '../services/eyeTrackingService';
import {getTargetRegions} from '../services/eyeTrackingDom';
interface Props{isOpen:boolean;onClose:()=>void;onComplete:()=>void;onMagnify?:()=>void;mode?:'full'|'short';}
const metric=(value:number|undefined)=>value!==undefined&&Number.isFinite(value)?value.toFixed(1):'—';
const download=(value:unknown)=>{const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='gaze-diagnostics.json';a.click();URL.revokeObjectURL(url);};
export const EyeGazeCalibrationModal:React.FC<Props>=({isOpen,onClose,onComplete,onMagnify,mode='full'})=>{
 const [phase,setPhase]=useState<'setup'|'collecting'|'results'|'guide'>('setup'),[state,setState]=useState<EyeTrackingState|null>(null),[progress,setProgress]=useState<CalibrationProgress|null>(null),[error,setError]=useState(''),[record,setRecord]=useState(false),[confirmDots,setConfirmDots]=useState(false),[condition,setCondition]=useState('Normal lighting');
 const [fresh,setFresh]=useState(false);
 const [profile,setProfile]=useState<'quick'|'detailed'>('quick');
 const [settings,setSettings]=useState(eyeTrackingEngine.getSettings());const [guidedRegions,setGuidedRegions]=useState(()=>getTargetRegions(true));
 const preview=useRef<HTMLVideoElement>(null),mounted=useRef(false),keepCamera=useRef(false),callbacks=useRef({onClose,onComplete});callbacks.current={onClose,onComplete};
 useEffect(()=>{
  if(!isOpen)return;mounted.current=true;keepCamera.current=false;setPhase('setup');setProgress(null);setError('');setFresh(false);
  const unsubscribe=eyeTrackingEngine.subscribe(s=>{if(mounted.current)setState(s);});
  eyeTrackingEngine.pause();void eyeTrackingEngine.start().then(ok=>{if(mounted.current&&!ok)setError(eyeTrackingEngine.getStatus());});
  return ()=>{mounted.current=false;unsubscribe();eyeTrackingEngine.cancelCalibration();if(!keepCamera.current)eyeTrackingEngine.stop();};
 },[isOpen]);
 useEffect(()=>{if(preview.current&&isOpen&&phase==='setup'){preview.current.srcObject=eyeTrackingEngine.getMediaStream();void preview.current.play().catch(()=>{});} },[isOpen,phase,state?.isActive]);
 const guide=eyeTrackingEngine.getGuidedState();
 useEffect(()=>{if(phase==='guide'&&!guide)setPhase('results');},[phase,guide]);
 useEffect(()=>{
  if(!isOpen||phase!=='collecting')return;
  const key=(e:KeyboardEvent)=>{if(e.key==='Enter'||e.code==='Space'){e.preventDefault();e.stopImmediatePropagation();eyeTrackingEngine.confirmPoint();}};
  window.addEventListener('keydown',key,true);return ()=>window.removeEventListener('keydown',key,true);
 },[isOpen,phase]);
 if(!isOpen)return null;
 const report=eyeTrackingEngine.getReport(),ready=state?.setupReady;
 const vw=eyeTrackingEngine.getVideoElement()?.videoWidth||640,vh=eyeTrackingEngine.getVideoElement()?.videoHeight||480;
 const points=state?.detection?.points||[];
 const retryCamera=()=>{setError('');eyeTrackingEngine.stop();void eyeTrackingEngine.start().then(ok=>{if(mounted.current&&!ok)setError(eyeTrackingEngine.getStatus());});};
 const shortMode=mode==='short'&&!fresh&&eyeTrackingEngine.canRunShortCheck();
 const run=async(short=shortMode)=>{
  setError('');setPhase('collecting');setProgress(null);
  const success=await eyeTrackingEngine.calibrate(p=>{if(mounted.current)setProgress(p);},{short,confirmTargets:confirmDots,profile});
  if(mounted.current){if(success&&profile==='quick'){finish();return;}setPhase('results');if(!success)setError(eyeTrackingEngine.getStatus());}
 };
 const finish=()=>{if(!eyeTrackingEngine.resume()){setPhase('results');setError(eyeTrackingEngine.getStatus());return;}keepCamera.current=true;callbacks.current.onComplete();callbacks.current.onClose();};
 const startGuide=()=>{try{const regions=getTargetRegions(true);setGuidedRegions(regions);eyeTrackingEngine.beginGuidedTest(regions.map(r=>r.slot),condition);setPhase('guide');}catch(e){setError((e as Error).message);}};
 return <div role="dialog" aria-modal="true" aria-label="Eye gaze setup and calibration" data-eye-calibration={phase==='guide'?undefined:true} data-gaze-panel={phase==='guide'?true:undefined} data-gaze-guide={phase==='guide'?true:undefined} className="fixed inset-0 z-[80] overflow-auto bg-[#0e1015] text-zinc-100">
  {phase!=='collecting'&&phase!=='guide'&&<div className="mx-auto max-w-4xl px-5 py-5 pb-16">
   <div className="flex justify-between items-center"><h2 className="font-semibold text-lg">Eye control · {phase==='setup'?'setup':'measured results'}</h2><button type="button" onClick={onClose} className="px-3 py-2">Close</button></div>
   {phase==='setup'&&<>
    <div className="grid md:grid-cols-2 gap-5 mt-5"><div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden"><video ref={preview} autoPlay muted playsInline aria-label="Mirrored camera preview" className="w-full h-full object-contain" style={{transform:'scaleX(-1)'}}/>
     <svg aria-label="Detected eye landmarks" viewBox={`0 0 ${vw} ${vh}`} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full pointer-events-none" style={{transform:'scaleX(-1)'}}>{(state?.frameAgeMs??Infinity)<500&&points.map((p,i)=><circle key={i} cx={p.x*vw} cy={p.y*vh} r={i===5||i===11?3.5:1.7} fill={ready?'#2dd4bf':'#fbbf24'}/>)}</svg></div>
    <div className="space-y-3 text-sm"><p>Keep the device steady and sit comfortably.</p><p>Keep both eyes visible with even front lighting. Avoid strong backlighting and reflections on glasses.</p><p>Keep approximately the same position during calibration and use. Move your eyes toward each dot’s center.</p><p role="status" className={ready?'text-teal-300':'text-amber-300'}>{ready?'Camera and fresh eye samples ready':state?.status||'Starting camera…'}</p><p>{state?.effectiveHz?.toFixed(1)||'0.0'} valid eye samples/second. Readiness is based on eye visibility and fresh frames.</p></div></div>
    <div className="mt-4 text-xs text-zinc-300" aria-label="Eye detection diagnostics"><p>Face: {state?.faceDetected?'detected':'not detected'} · Landmarks: {state?.detection?.landmarkCount||0}/478 · Processing: {state?.inferenceMs?.toFixed(0)||'—'} ms</p>
     {state?.detection?.eyeWidths&&<p>Eye widths: {state.detection.eyeWidths.map(v=>v.toFixed(1)).join(' / ')} camera px · Eyelid opening: {state.detection.openness?.map(v=>v.toFixed(2)).join(' / ')}</p>}
     <p className="mt-1">Colored dots show detected eye landmarks. Before calibration they do not indicate a screen gaze position.</p>
     <button type="button" className="underline mt-2 mr-4" onClick={retryCamera}>{error&&!state?.isActive?'Retry camera':'Restart camera'}</button><button type="button" className="underline" onClick={()=>download(eyeTrackingEngine.exportDiagnostics())}>Export setup diagnostics</button>
    </div>
    <details className="mt-4"><summary className="cursor-pointer text-sm">Timing and filter settings</summary><div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">{(['settleMs','validCollectionMs','pointTimeoutMs','dwellMs','minCutoffHz','beta'] as const).map(key=><label key={key} className="text-xs">{key}<input aria-label={key} type="number" min="0.001" step={key==='beta' ? 0.001 : key==='minCutoffHz' ? 0.1 : 100} value={settings[key]} onChange={e=>setSettings({...settings,[key]:Number(e.target.value)})} className="block w-full rounded bg-zinc-800 p-2 mt-1"/></label>)}</div><button type="button" onClick={()=>{try{eyeTrackingEngine.configure(settings);setError('Settings applied; fresh validation is required.');}catch(e){setError((e as Error).message);}}} className="mt-3 underline text-sm">Apply settings</button></details>
    {!shortMode&&<label className="block mt-4 text-sm"><input type="checkbox" checked={profile==='detailed'} onChange={e=>setProfile(e.target.checked?'detailed':'quick')}/> Detailed nine-point setup (optional)</label>}
    <p className="mt-3 text-sm">{shortMode?'Check your saved setup without repeating the calibration dots.':profile==='quick'?'Follow five dots, then the answer-area checks. Eye control starts automatically when they pass.':'Detailed mode: nine dots plus intermediate and answer-area checks.'}</p>
    <label className="block mt-4 text-sm"><input type="checkbox" checked={confirmDots} onChange={e=>setConfirmDots(e.target.checked)}/> Wait for tap, Enter or Space at each dot (helper confirmation)</label>
    <label className="block mt-4 text-sm"><input type="checkbox" checked={record} onChange={e=>{setRecord(e.target.checked);eyeTrackingEngine.setRecording(e.target.checked);}}/> Record diagnostic samples locally (eye features and labels; no video upload)</label>
    <button type="button" disabled={!ready} onClick={()=>void run()} className="mt-5 rounded-lg px-5 py-3 bg-teal-400 text-black font-semibold disabled:opacity-40">{shortMode?'Start short accuracy check':profile==='quick'?'Start eye control':'Start nine-point calibration'}</button>
    {error&&<p role="alert" className="text-amber-300 mt-3">{error}</p>}
   </>}
   {phase==='results'&&<>
    <p role="status" className="mt-4 text-sm">{report?.passed?'Independent checks passed for the tested regions.':'Selection stays paused until the tested regions are distinguishable.'}</p>
    {!!report?.reusedRegionIds?.length&&<p className="text-xs mt-2">Kept {report.reusedRegionIds.length} recent successful checks; retried the unsuccessful areas.</p>}
    {report?.comparison&&<p className="text-xs mt-2 text-zinc-400">Selected {report.comparison.selected}; temporal held-out p90: affine {report.comparison.affineP90Px.toFixed(1)} px / quadratic {report.comparison.quadraticP90Px?.toFixed(1)||'not fit'} px. Separate validation below did not train either model.</p>}
    {!!report?.regions.length&&<div className="overflow-auto mt-4"><table className="w-full text-xs text-left"><thead><tr>{['Region','Filtered median / p90 px','Raw median / p90 px','X / Y bias px','Jitter px','Eye input','Usable gaze','Input / gaze rate','Result'].map(t=><th key={t} className="p-2 border-b border-zinc-700">{t}</th>)}</tr></thead><tbody>{report.regions.map(r=><tr key={r.id}><td className="p-2">{r.label.slice(0,50)}</td><td>{metric(r.medianPx)} / {metric(r.p90Px)}</td><td>{metric(r.rawMedianPx)} / {metric(r.rawP90Px)}</td><td>{metric(r.biasX)} / {metric(r.biasY)}</td><td>{metric(r.jitterPx)}</td><td>{Math.round(r.validFraction*100)}%{r.inputSamples!==undefined&&` (${r.inputSamples})`}</td><td>{r.usableFraction!==undefined?`${Math.round(r.usableFraction*100)}% (${r.usableSamples}/${r.eligibleSamples})`:'—'}</td><td>{metric(r.effectiveHz)} / {metric(r.usableHz)} Hz</td><td>{r.passed?'Checked':r.reason}</td></tr>)}</tbody></table></div>}
    {!!report?.regions.length&&<p className="text-xs mt-2 text-zinc-400">Eye input counts detected eye samples. Usable gaze counts estimates retained after filter warm-up and spike rejection. Neither percentage is an accuracy score. A dash means no estimate was available.</p>}
    {report?.issues.map((issue,i)=><p role="alert" key={i} className="text-amber-300 text-sm mt-2">{issue}</p>)}{!report&&error&&<p role="alert">{error}</p>}
    <div className="flex gap-3 flex-wrap mt-5">{report?.passed&&<button type="button" onClick={finish} className="rounded bg-teal-400 text-black px-4 py-2">Use eye control</button>}
    <button type="button" onClick={()=>void run(false)} className="rounded bg-zinc-700 px-4 py-2">{report?.failedTrainingIds.length?'Retry unsuccessful dots':'Retry answer checks'}</button>
    <button type="button" onClick={()=>{eyeTrackingEngine.discardCalibrationAttempt();setFresh(true);setPhase('setup');}} className="underline px-2">Restart setup</button>
    {onMagnify&&<button type="button" onClick={()=>{onMagnify();setError('Larger targets opened behind this screen. Repeat independent checks to measure their new dimensions.');}} className="underline px-2">Enlarge answer targets</button>}
    <button type="button" onClick={()=>download(eyeTrackingEngine.exportDiagnostics())} className="underline px-2">Export measurements</button></div>
    {error&&<p className="text-sm mt-2 text-amber-300">{error}</p>}
    {eyeTrackingEngine.getFilterTrials().length>0&&<details className="mt-4"><summary>Replay filter settings on this recording</summary><p className="text-xs text-zinc-400">Uses labeled training frames only. Time to target includes eye reaction time. Applying settings requires new independent validation.</p>{eyeTrackingEngine.getFilterTrials().map((trial,i)=><div key={i} className="text-xs mt-2">{trial.minCutoffHz} Hz · beta {trial.beta} · fixation jitter {trial.fixationP90Px.toFixed(1)} px · time to target {trial.medianTimeToTargetMs?.toFixed(0)||'not reached'} ms <button type="button" className="underline" onClick={()=>{eyeTrackingEngine.configure({minCutoffHz:trial.minCutoffHz,beta:trial.beta});setSettings(eyeTrackingEngine.getSettings());setPhase('setup');}}>Apply and revalidate</button></div>)}</details>}
    <div className="mt-6 border-t border-zinc-700 pt-4"><h3 className="font-semibold">Guided real-camera selection test</h3><p className="text-sm mt-2">Look at the requested choice until it activates. Try center/edge checks above, adjacent choices here, glasses, and small normal head movements. Missed targets time out. These are your measured results, not an accuracy promise.</p>
    <select aria-label="Test condition" value={condition} onChange={e=>setCondition(e.target.value)} className="mt-3 rounded bg-zinc-800 p-2"><option>Normal lighting</option><option>With glasses</option><option>Normal head movement</option></select><button disabled={!report?.passed} type="button" onClick={startGuide} className="ml-3 underline disabled:opacity-40">Start guided test</button>
    <p className="text-xs mt-3">{report?.guided.length?`${report.guided.filter(r=>r.result==='correct').length} correct · ${report.guided.filter(r=>r.result==='incorrect').length} incorrect · ${report.guided.filter(r=>r.result==='missed').length} missed`:'Real-camera selection results: not yet measured.'}</p></div>
   </>}
  </div>}
  {phase==='collecting'&&<>
   <div className="absolute top-2 left-1/2 -translate-x-1/2 text-center text-xs max-w-[90vw] bg-zinc-900 px-3 py-2 rounded"><p>{progress?`${progress.phase==='training'?'Calibration':'Independent check'} ${progress.index+1}/${progress.total}`:'Waiting for fresh eye frames…'}</p><p>{progress?.accepted||0} accepted samples · {progress?.message}</p><button type="button" className="underline mt-1" onClick={()=>{eyeTrackingEngine.cancelCalibration();setPhase('results');}}>Pause calibration</button></div>
   {progress&&<button type="button" aria-label="Confirm gaze target" onClick={()=>eyeTrackingEngine.confirmPoint()} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus:ring-2 focus:ring-white" style={{left:progress.target.x,top:progress.target.y}}><svg width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="25" fill="none" stroke="#30353e" strokeWidth="4"/><circle cx="32" cy="32" r="25" fill="none" stroke="#2dd4bf" strokeWidth="4" strokeDasharray="157.08" strokeDashoffset={157.08*(1-progress.progress)}/><circle cx="32" cy="32" r="5" fill="#2dd4bf"/></svg></button>}
   <p className="absolute bottom-2 w-full text-center text-xs pointer-events-none">Look at the dot’s center. No gaze click is required.</p>
  </>}
  {phase==='guide'&&<>
   <div className="fixed top-1 left-1/2 -translate-x-1/2 z-10 text-center text-xs bg-zinc-900 p-2 rounded">Look at {guide?.expected} ({(guide?.index||0)+1}/{guide?.total}) · {condition}<button type="button" className="ml-3 underline" onClick={()=>{eyeTrackingEngine.endGuidedTest();setPhase('results');}}>Stop test</button></div>
   {guidedRegions.map(r=><button key={r.slot} type="button" data-gaze-test-target={r.slot} data-gaze-context="guided" data-gaze-label={r.slot} onClick={()=>{}} style={{position:'fixed',left:r.rect.left,top:r.rect.top,width:r.rect.width,height:r.rect.height}} className="rounded-xl border border-zinc-500 bg-zinc-800 text-lg">{r.slot}</button>)}
   {state?.isTracking&&<div className="fixed pointer-events-none z-[90]" style={{left:state.gazeX-22,top:state.gazeY-22}}><svg width="44" height="44"><circle cx="22" cy="22" r="18" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="113.1" strokeDashoffset={113.1*(1-(state.dwellProgress||0))}/><circle cx="22" cy="22" r="3" fill="#2dd4bf"/></svg></div>}
   {!state?.isTracking&&<p className="fixed bottom-2 left-2 right-2 text-center text-amber-300 text-xs">{state?.status}</p>}
  </>}
 </div>;
};
