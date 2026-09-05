import React from 'react';
import { 
  Radar, 
  BrainCircuit, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Flame 
} from 'lucide-react';

export default function LandingPageView({ 
  onExploreHeritage, 
  onOpenDashboard, 
  onOpenPractitioners, 
  onOpenLearn, 
  onOpenAiAnalysis, 
  onOpenDocumentation,
  onOpenLogin
}) {
  const handleAction = onOpenLogin || onExploreHeritage;

  const pillars = [
    {
      title: 'Detect',
      subtitle: 'Identify at-risk traditions',
      icon: Radar,
      action: handleAction
    },
    {
      title: 'Explain',
      subtitle: 'AI insights & risk factors',
      icon: BrainCircuit,
      action: handleAction
    },
    {
      title: 'Connect',
      subtitle: 'Link masters with learners',
      icon: Users,
      action: handleAction
    },
    {
      title: 'Preserve',
      subtitle: 'Document & sustain knowledge',
      icon: ShieldCheck,
      action: handleAction
    }
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col justify-between selection:bg-amber-600 selection:text-white">
      {/* Top Header / Branding */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4 border-b border-stone-800/60 z-20">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-bold shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-cinzel font-bold text-sm tracking-widest text-amber-200">
              SANSKRITI
            </div>
            <div className="font-cinzel text-xs tracking-wider text-amber-100/80 -mt-1">
              SURAKSHA
            </div>
          </div>
        </div>

      </header>

      {/* Hero Main Content */}
      <main className="relative flex-1 flex flex-col justify-center items-center text-center px-4 py-16 overflow-hidden">
        {/* Classical Indian Dancer Background Artwork */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none flex items-center justify-center">
          <img
            src="/images/hero.jpg"
            alt="Living Indian Heritage"
            className="w-full h-full object-cover object-center filter saturate-125 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-[#0d0d0d]/80" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#0d0d0d]/60 to-[#0d0d0d]" />
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold backdrop-blur-xs">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Pan-India Living Heritage Early Warning System</span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide text-white leading-tight">
            Protecting India's <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
              Living Heritage
            </span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Detect risks. Explain gaps. Connect generations. <br className="hidden sm:inline" />
            Preserve our cultural legacy for the future.
          </p>

          {/* 4 Pillars in a row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  onClick={p.action}
                  className="group bg-stone-900/80 hover:bg-stone-800/90 border border-stone-800 hover:border-amber-400/40 p-4 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md shadow-lg"
                >
                  <div className="w-12 h-12 rounded-full border border-amber-400/40 bg-amber-400/10 group-hover:bg-amber-400/20 flex items-center justify-center text-amber-400 mb-3 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-amber-200 group-hover:text-amber-300">
                    {p.title}
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                    {p.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Hero CTA Button: Explore Heritage */}
          <div className="pt-6">
            <button
              onClick={onExploreHeritage}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
            >
              <span>Explore Heritage</span>
              <ChevronRight className="w-4 h-4 text-stone-950" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 border-t border-stone-800/50 z-10">
        <div>© 2026 Sanskriti Suraksha • Ministry of Culture Pilot & Hackathon Innovation</div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <span>32 Pilot Living Traditions</span>
          <span>•</span>
          <span>Pan-India Coverage</span>
        </div>
      </footer>
    </div>
  );
}
