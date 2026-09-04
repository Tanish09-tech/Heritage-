import React from 'react';
import { ShieldAlert, Award, Users, CheckCircle2, Flame, MapPin, Sparkles } from 'lucide-react';

export default function Header({ currentRole, setCurrentRole, activeTab, setActiveTab, onStartDemoTour, demoStep }) {
  const roles = [
    { id: 'AUTHORITY', label: 'Cultural Authority / Govt', icon: Award },
    { id: 'PRACTITIONER', label: 'Master Practitioner', icon: Flame },
    { id: 'LEARNER', label: 'Student / Learner', icon: Users },
    { id: 'REVIEWER', label: 'Community Reviewer', icon: CheckCircle2 }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0f2a4a] text-white shadow-md border-b border-amber-400/30 px-4 sm:px-6 lg:px-8 xl:px-12 py-3 w-full">
      <div className="w-full max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-400 text-slate-950 shadow-md">
            <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-cinzel text-xl lg:text-2xl font-bold tracking-wider text-amber-200">
                संस्कृती सुरक्षा <span className="text-amber-100 text-xs font-sans tracking-widest font-normal uppercase border border-amber-300/40 px-2 py-0.5 rounded-md ml-1 bg-black/20">SANSKRITI SURAKSHA</span>
              </h1>
            </div>
            <p className="text-xs text-amber-100/90 font-sans tracking-wide">
              AI-Powered Living Heritage Early Warning & Knowledge Transmission System
            </p>
          </div>
        </div>

        {/* Controls: Role Selector & Demo Walkthrough Button */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Demo Walkthrough Button */}
          <button
            onClick={onStartDemoTour}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow transition transform hover:scale-105 active:scale-95"
            title="Start Competition Demo Walkthrough"
          >
            <Sparkles className="w-4 h-4 text-slate-900" />
            <span>Judge Demo Walkthrough</span>
            {demoStep > 0 && (
              <span className="bg-slate-950 text-amber-300 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                Step {demoStep}/8
              </span>
            )}
          </button>

          {/* Role Switcher */}
          <div className="flex items-center bg-black/30 p-1 rounded-xl border border-amber-400/30">
            <span className="text-[11px] text-amber-200 uppercase font-bold px-2 hidden lg:inline">Role:</span>
            {roles.map((r) => {
              const Icon = r.icon;
              const active = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setCurrentRole(r.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    active
                      ? 'bg-amber-400 text-slate-950 shadow'
                      : 'text-amber-100/80 hover:text-white hover:bg-white/10'
                  }`}
                  title={`Switch to ${r.label}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{r.id}</span>
                </button>
              );
            })}
          </div>

          {/* National Pilot Tag */}
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-semibold text-amber-200 bg-black/20 border border-amber-300/30 px-2.5 py-1 rounded-lg">
            <MapPin className="w-3 h-3 text-amber-300" />
            <span>Pan-India Heritage Registry (28 States)</span>
          </div>

        </div>

      </div>
    </header>
  );
}
