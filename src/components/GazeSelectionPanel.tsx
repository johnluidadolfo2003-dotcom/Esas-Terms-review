import React from 'react';
import type {FlashcardQuestion} from '../services/questionParser';
interface Props{question:FlashcardQuestion|null;selected:string|null;onChoice:(id:string)=>void;onNext:()=>void;onClose:()=>void;onCheck:()=>void;hasNext:boolean;}
/** Real larger acquisition targets, not cursor snapping. They must pass a new region check. */
export function GazeSelectionPanel({question,selected,onChoice,onNext,onClose,onCheck,hasNext}:Props){
 if(!question)return null;
 return <div data-gaze-panel role="dialog" aria-modal="true" aria-label="Large eye selection targets" className="fixed inset-0 z-[60] bg-[#0e1015] text-zinc-100 overflow-auto p-4">
  <div className="mx-auto max-w-4xl"><div className="flex justify-between gap-4"><h2 className="font-semibold">Large answer targets</h2><button type="button" onClick={onClose}>Close</button></div>
  <p className="text-sm my-3">{question.question}</p><button type="button" onClick={onCheck} className="text-teal-300 underline mb-4">Check these target sizes before eye selection</button>
  <div className="grid grid-cols-2 gap-6">{question.choices.map(c=><button key={c.id} type="button" data-choice-id={c.id} data-gaze-context={question.id} data-gaze-label={c.text} disabled={!!selected} onClick={()=>onChoice(c.id)} className={`min-h-[130px] rounded-xl border-2 p-4 text-left ${selected===c.id?'border-teal-400 bg-teal-950':'border-zinc-600 bg-zinc-800'} disabled:opacity-50`}><strong className="block text-xl mb-2">{c.id}</strong>{c.text}</button>)}</div>
  <button type="button" disabled={!hasNext} data-action="next-card" data-gaze-context={question.id} data-gaze-label="next" onClick={onNext} className="w-full min-h-[90px] mt-6 mb-8 rounded-xl border-2 border-zinc-600 bg-zinc-800 disabled:opacity-40">Next question</button></div>
 </div>;
}
