import React from 'react';
import { ChevronRight, RotateCcw, CheckCircle } from 'lucide-react';

export default function JudgeDemoBanner({ demoStep, setDemoStep, onExecuteStep, onResetDemo }) {
  const steps = [
    { num: 1, title: 'Submit Data', desc: 'Practitioner submits Shahiri Powada indicators', tab: 'HTHS' },
    { num: 2, title: 'Validate Data', desc: 'Community reviewer validates indicator fields', tab: 'VALIDATION' },
    { num: 3, title: 'Calculate HTHS', desc: 'System evaluates HTHS score: 38/100 (Critical 🔴)', tab: 'HTHS' },
    { num: 4, title: 'AI Risk Insight', desc: 'AI explains factor breakdown (Few apprentices)', tab: 'HTHS' },
    { num: 5, title: 'Recommend Action', desc: 'Intervention Engine triggers Apprenticeship program', tab: 'RECOMMENDATIONS' },
    { num: 6, title: 'Smart Match', desc: 'Matches Shahir Tukaramji with Learner Rohan Patil', tab: 'MATCHMAKER' },
    { num: 7, title: 'Accept Apprentice', desc: 'Master accepts request & initiates learning', tab: 'MATCHMAKER' },
    { num: 8, title: 'Preserve Knowledge', desc: 'Voice recording archived with consent', tab: 'VAULT' }
  ];

  if (demoStep === 0) return null;

  const current = steps[demoStep - 1];

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 lg:px-8 xl:px-12 py-2.5 shadow-sm text-slate-900 relative z-30 animate-fadeIn w-full">
      <div className="w-full max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Step Indicator & Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0f2a4a] text-amber-300 font-bold text-sm shadow">
            {demoStep}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-900">
                Judges Demo Walkthrough — Step {demoStep} of 8:
              </span>
              <span className="text-sm font-bold text-[#0f2a4a] font-cinzel">
                {current.title}
              </span>
            </div>
            <p className="text-xs text-slate-700">
              {current.desc}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {demoStep < 8 ? (
            <button
              onClick={() => onExecuteStep(demoStep + 1)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0f2a4a] hover:bg-[#091a30] text-white font-bold text-xs transition shadow"
            >
              <span>Next Step ({steps[demoStep].title})</span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-emerald-800 font-bold bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-lg">
                <CheckCircle className="w-4 h-4 text-emerald-700" /> Heritage Transmission Preserved!
              </span>
              <button
                onClick={onResetDemo}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300 text-xs font-semibold transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Replay Demo
              </button>
            </div>
          )}
          
          <button
            onClick={onResetDemo}
            className="text-xs text-slate-500 hover:text-slate-900 underline ml-2"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
