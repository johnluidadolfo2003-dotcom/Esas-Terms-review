import React, { useEffect, useRef, useState } from 'react';
import { eyeTrackingEngine } from '../services/eyeTrackingService';
import { CALIBRATION_TARGETS, VALIDATION_TARGETS } from '../services/eyeTrackingMath';
interface EyeGazeCalibrationModalProps {isOpen:boolean;onClose:()=>void;onComplete:()=>void;}
export const EyeGazeCalibrationModal:React.FC<EyeGazeCalibrationModalProps>=({isOpen,onClose,onComplete})=>{
  const [step,setStep]=useState(0),[progress,setProgress]=useState(0),[attempt,setAttempt]=useState(0);
  const [phase,setPhase]=useState<'loading'|'collecting'|'finished'|'error'>('loading');
  const [error,setError]=useState('');
  // Parent renders every camera frame. Inline callbacks must never restart calibration.
  const callbacks=useRef({onClose,onComplete});callbacks.current={onClose,onComplete};
  useEffect(()=>{
    if(!isOpen)return;
    let cancelled=false,finished=false;
    let timer:ReturnType<typeof setTimeout>|undefined;
    setPhase('loading');setStep(0);setProgress(0);setError('');
    void eyeTrackingEngine.calibrate((point,value)=>{
      if(!cancelled){setPhase('collecting');setStep(point);setProgress(value);}
    }).then(success=>{
      if(cancelled)return;
      if(!success){setError(eyeTrackingEngine.getStatus());setPhase('error');return;}
      finished=true;setPhase('finished');
      timer=setTimeout(()=>{if(!cancelled){callbacks.current.onComplete();callbacks.current.onClose();}},600);
    }).catch(()=>{if(!cancelled){setError('Could not calibrate. Check camera permission and retry.');setPhase('error');}});
    return ()=>{cancelled=true;clearTimeout(timer);if(!finished)eyeTrackingEngine.stop();};
  },[isOpen,attempt]);
  if(!isOpen)return null;
  const target=[...CALIBRATION_TARGETS,...VALIDATION_TARGETS][step] || CALIBRATION_TARGETS[0];
  const validating=step>=CALIBRATION_TARGETS.length;
  return <div role="dialog" aria-modal="true" aria-label="Eye gaze calibration" data-eye-calibration className="fixed inset-0 z-[60] bg-[#0e1015]/95 backdrop-blur-md select-none">
    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#181a21] border border-[#272935] px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
      <span role="status" className="text-xs font-mono text-zinc-200">{phase==='loading'?'Starting camera and eye model…':phase==='finished'?'Calibration complete':phase==='error'?'Calibration needs another try':validating?`Check accuracy (${step-CALIBRATION_TARGETS.length+1}/${VALIDATION_TARGETS.length})`:`Look at the dot (${step+1}/${CALIBRATION_TARGETS.length})`}</span>
      <button type="button" onClick={()=>{eyeTrackingEngine.stop();callbacks.current.onClose();}} className="text-xs text-zinc-400 hover:text-white">Cancel</button>
    </div>
    {phase==='collecting'&&<div className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center" style={{left:`${target.x*100}%`,top:`${target.y*100}%`}}>
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80"><circle cx="40" cy="40" r="34" stroke="#222733" strokeWidth="4" fill="none"/><circle cx="40" cy="40" r="34" stroke="#2dd4bf" strokeWidth="4" fill="none" strokeDasharray="213.6" strokeDashoffset={213.6*(1-progress)} strokeLinecap="round"/></svg>
      <div className="absolute w-4 h-4 rounded-full bg-[#2dd4bf]"/>
    </div>}
    {(phase==='error'||phase==='finished')&&<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center pointer-events-none">
      <p role={phase==='error'?'alert':undefined} className="max-w-md text-sm text-zinc-200">{phase==='error'?error:`${eyeTrackingEngine.getAccuracyReport()}. Ready for eye control.`}</p>
      {phase==='error'&&<button type="button" onClick={()=>setAttempt(a=>a+1)} className="pointer-events-auto rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950">Try again</button>}
    </div>}
    <p className="absolute bottom-6 left-0 right-0 px-6 text-center text-xs text-zinc-400">Keep your head still. Move only your eyes. Each camera session is checked before eye control starts.</p>
  </div>;
};
