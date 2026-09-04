import React, { useState, useEffect } from 'react';
import { Activity, Sliders, CheckCircle2, Sparkles, RefreshCw, Info } from 'lucide-react';

export default function TransmissionEngineView({ traditions, selectedTradition, onUpdateTraditionScore }) {
  const [activeTradition, setActiveTradition] = useState(selectedTradition || traditions[0]);
  const [indicators, setIndicators] = useState({ ...activeTradition.indicators });

  useEffect(() => {
    if (selectedTradition) {
      setActiveTradition(selectedTradition);
      setIndicators({ ...selectedTradition.indicators });
    }
  }, [selectedTradition]);

  const calculateScore = (ind) => {
    const score = Math.round(
      (ind.practitionerStrength * 0.20) +
      (ind.learnerParticipation * 0.25) +
      (ind.intergenerationalParticipation * 0.15) +
      (ind.transmissionFrequency * 0.15) +
      (ind.trainingEcosystem * 0.10) +
      (ind.practiceContinuity * 0.10) +
      (ind.documentationAvailability * 0.05)
    );
    return Math.min(100, Math.max(0, score));
  };

  const calculatedScore = calculateScore(indicators);

  const getStatus = (score) => {
    if (score >= 80) return { label: '🟢 Strong Transmission', status: 'STRONG', color: '#16a34a', bg: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
    if (score >= 60) return { label: '🟡 Needs Monitoring', status: 'MONITORING', color: '#d97706', bg: 'bg-amber-50 text-amber-800 border-amber-300' };
    if (score >= 40) return { label: '🟠 Vulnerable', status: 'VULNERABLE', color: '#ea580c', bg: 'bg-orange-50 text-orange-800 border-orange-300' };
    return { label: '🔴 Critical Transmission Gap', status: 'CRITICAL', color: '#dc2626', bg: 'bg-red-50 text-red-800 border-red-300' };
  };

  const currentStatus = getStatus(calculatedScore);

  const handleSliderChange = (key, value) => {
    setIndicators(prev => ({ ...prev, [key]: Number(value) }));
  };

  const handleResetToBaseline = () => {
    setIndicators({ ...activeTradition.indicators });
  };

  const handleSaveIndicators = () => {
    onUpdateTraditionScore(activeTradition.id, calculatedScore, indicators, currentStatus.status);
    alert(`Applied updated HTHS score ${calculatedScore}/100 (${currentStatus.label}) to dashboard!`);
  };

  const generateAiInsight = () => {
    const lowFactors = [];
    if (indicators.learnerParticipation < 40) lowFactors.push("severe scarcity of active learners");
    if (indicators.practitionerStrength < 40) lowFactors.push("small pool of elderly master practitioners");
    if (indicators.trainingEcosystem < 40) lowFactors.push("absence of structured training academies");
    if (indicators.transmissionFrequency < 40) lowFactors.push("irregular practice & transmission frequency");

    if (lowFactors.length === 0) {
      return `The transmission health for ${activeTradition.name} is robust. Active master practitioners, enthusiastic learners, and regular practice frequency maintain a healthy intergenerational chain.`;
    }

    return `Primary risk signals identified for ${activeTradition.name}: ${lowFactors.join(", and ")}. Available data indicates high risk of knowledge loss unless structured master-learner matching is prioritized.`;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="clean-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#0f2a4a]" />
            <h2 className="font-cinzel text-xl md:text-2xl font-bold text-[#0f2a4a]">
              Heritage Transmission Health Engine (HTHS)
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Transparent 7-Factor Weighted Scoring Model & AI Risk Explanation Pipeline
          </p>
        </div>

        {/* Dropdown Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 font-semibold">Select Tradition:</span>
          <select
            value={activeTradition.id}
            onChange={(e) => {
              const found = traditions.find(t => t.id === e.target.value);
              if (found) {
                setActiveTradition(found);
                setIndicators({ ...found.indicators });
              }
            }}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#0f2a4a]"
          >
            {traditions.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.score}/100)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Dial & AI Explanation (Col 5 / xl:4) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          
          {/* Circular Gauge Card */}
          <div className="clean-card p-6 rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">
              Calculated Transmission Score
            </div>

            {/* Circular Gauge */}
            <div className="relative w-48 h-48 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={currentStatus.color}
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * calculatedScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-cinzel text-5xl font-extrabold text-slate-900">
                  {calculatedScore}
                </span>
                <span className="text-xs font-sans text-slate-500 uppercase font-bold">Out of 100</span>
              </div>
            </div>

            {/* Status Pill */}
            <div className={`mt-3 px-4 py-1.5 rounded-full text-xs font-bold border ${currentStatus.bg}`}>
              {currentStatus.label}
            </div>

            <p className="text-[11px] text-slate-500 mt-3 max-w-xs italic">
              "This is an AI/data-assisted assessment based on available and validated community indicators."
            </p>
          </div>

          {/* AI Explanation Card */}
          <div className="clean-card p-6 rounded-2xl space-y-3 border-amber-200 bg-amber-50/40">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0f2a4a]" />
              <h3 className="font-cinzel text-sm font-bold text-[#0f2a4a]">
                AI Risk Explanation Generator
              </h3>
            </div>
            
            <div className="bg-white p-3.5 rounded-xl border border-amber-200 text-xs text-slate-800 leading-relaxed font-sans shadow-sm">
              <p>"{generateAiInsight()}"</p>
            </div>

            <div className="text-[11px] text-slate-600 flex items-center gap-1.5 font-medium">
              <Info className="w-3.5 h-3.5 text-amber-700" />
              <span>Traceable strictly to community-submitted indicators. Zero hallucinated reasons.</span>
            </div>
          </div>

        </div>

        {/* Right Sliders Simulator (Col 7 / xl:8) */}
        <div className="lg:col-span-7 xl:col-span-8 clean-card p-6 rounded-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-cinzel text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#0f2a4a]" />
                Live Indicator Simulator (7 Weighted Factors)
              </h3>
              <p className="text-xs text-slate-500">
                Adjust sliders to test how community interventions affect the Heritage Transmission Health Score
              </p>
            </div>
            <button
              onClick={handleResetToBaseline}
              className="text-xs text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Sliders */}
          <div className="space-y-3.5">
            {[
              { key: 'learnerParticipation', label: 'Learner / Apprentice Participation', weight: '25%' },
              { key: 'practitionerStrength', label: 'Active Practitioner Strength', weight: '20%' },
              { key: 'intergenerationalParticipation', label: 'Intergenerational Participation', weight: '15%' },
              { key: 'transmissionFrequency', label: 'Knowledge Transmission Frequency', weight: '15%' },
              { key: 'trainingEcosystem', label: 'Training Ecosystem Availability', weight: '10%' },
              { key: 'practiceContinuity', label: 'Practice Continuity', weight: '10%' },
              { key: 'documentationAvailability', label: 'Documentation Availability', weight: '5%' }
            ].map((factor) => (
              <div key={factor.key} className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    {factor.label} <span className="text-[10px] text-slate-500 font-normal">(Weight: {factor.weight})</span>
                  </span>
                  <span className="font-extrabold text-[#0f2a4a] text-sm">{indicators[factor.key]} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={indicators[factor.key]}
                  onChange={(e) => handleSliderChange(factor.key, e.target.value)}
                  className="w-full accent-[#0f2a4a] cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveIndicators}
              className="px-5 py-2.5 rounded-xl bg-[#0f2a4a] hover:bg-[#091a30] text-white font-bold text-xs shadow transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Apply Simulated Indicators to Dashboard</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
