import React from 'react';
import { X, MapPin, AlertTriangle } from 'lucide-react';

export default function TraditionModal({ tradition, onClose, onNavigateTab }) {
  if (!tradition) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="clean-card max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 space-y-6 relative shadow-2xl bg-white border-slate-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
          <img
            src={tradition.image}
            alt={tradition.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-[#0f2a4a] shadow"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${tradition.bgClass}`}>
                {tradition.statusLabel}
              </span>
              <span className="text-xs text-slate-600 font-bold">HTHS: {tradition.score}/100</span>
            </div>
            <h2 className="font-cinzel text-2xl font-bold text-slate-900">{tradition.name}</h2>
            <p className="text-xs text-[#0f2a4a] font-bold">{tradition.marathiName} • {tradition.category}</p>
            <p className="text-xs text-slate-600 flex items-center gap-1 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#0f2a4a]" />
              {tradition.region} ({tradition.state})
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="font-cinzel text-xs font-bold text-slate-800 uppercase tracking-wider">Historical Overview & Practice</h3>
          <p className="text-xs text-slate-800 leading-relaxed font-sans bg-slate-50 p-4 rounded-xl border border-slate-200">
            {tradition.description}
          </p>
        </div>

        {/* Transmission Indicators Grid */}
        <div className="space-y-2">
          <h3 className="font-cinzel text-xs font-bold text-slate-800 uppercase tracking-wider">Transmission Metrics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Active Masters</span>
              <span className="font-bold text-lg text-slate-900">{tradition.masterPractitioners}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Active Learners</span>
              <span className={`font-bold text-lg ${tradition.learners <= 2 ? 'text-red-600' : 'text-emerald-700'}`}>
                {tradition.learners}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Avg Master Age</span>
              <span className="font-bold text-lg text-slate-900">{tradition.avgPractitionerAge} yrs</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Youth Ratio</span>
              <span className="font-bold text-lg text-slate-900">{tradition.youthRatio}</span>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="space-y-2">
          <h3 className="font-cinzel text-xs font-bold text-red-700 flex items-center gap-1.5 uppercase">
            <AlertTriangle className="w-4 h-4 text-red-600" /> AI Risk Factors Breakdown
          </h3>
          <div className="bg-red-50/70 border border-red-200 p-4 rounded-xl space-y-2 text-xs text-red-950">
            <p className="font-bold text-red-800">"{tradition.aiInsight}"</p>
            <ul className="list-disc pl-4 space-y-1 text-red-900 font-medium">
              {tradition.riskFactors.map((rf, i) => (
                <li key={i}>{rf}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Action */}
        <div className="space-y-2">
          <h3 className="font-cinzel text-xs font-bold text-slate-800 uppercase tracking-wider">Recommended Strategy</h3>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-950 font-semibold">
            💡 {tradition.recommendedAction}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => {
              onClose();
              onNavigateTab('HTHS');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs transition"
          >
            Simulate HTHS Score
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigateTab('MATCHMAKER');
            }}
            className="px-5 py-2 rounded-xl bg-[#0f2a4a] hover:bg-[#091a30] text-white font-bold text-xs shadow transition"
          >
            Find Master Practitioner Match
          </button>
        </div>

      </div>
    </div>
  );
}
