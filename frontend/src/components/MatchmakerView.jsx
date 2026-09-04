import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Users, MapPin, CheckCircle, Sparkles, UserPlus, Send } from 'lucide-react';

export default function MatchmakerView({ masters, learners }) {
  const [selectedMaster, setSelectedMaster] = useState(masters[0]);
  const [learnerRequests, setLearnerRequests] = useState(learners);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0f2a4a', '#d97706', '#16a34a', '#f59e0b']
    });
  };

  const handleAcceptRequest = (learnerId) => {
    setLearnerRequests(prev => prev.map(l => l.id === learnerId ? { ...l, status: 'CONNECTED' } : l));
    triggerConfetti();
    alert("✨ Apprenticeship Request Accepted! Gurukul Connection Created.");
  };

  const handleApplyRequest = (learnerId) => {
    setLearnerRequests(prev => prev.map(l => l.id === learnerId ? { ...l, status: 'APPLIED' } : l));
    triggerConfetti();
    alert("🚀 Apprenticeship Application Sent to Master Practitioner!");
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="clean-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0f2a4a]" />
            <h2 className="font-cinzel text-xl md:text-2xl font-bold text-[#0f2a4a]">
              Master–Learner Matchmaker Engine
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Intervention Feature: Connecting Master Cultural Practitioners with Verified Young Apprentices
          </p>
        </div>

        <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <div className="text-xs">
            <span className="text-amber-900 font-bold block">Smart Compatibility Matching</span>
            <span className="text-amber-800">Tradition + Location + Language + Schedule</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Masters List */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 px-1">
            <span>Verified Master Practitioners ({masters.length})</span>
            <span className="text-[10px] text-slate-400">Pan-India</span>
          </div>

          <div className="space-y-3">
            {masters.map(master => {
              const isSelected = selectedMaster.id === master.id;
              return (
                <div
                  key={master.id}
                  onClick={() => setSelectedMaster(master)}
                  className={`clean-card p-4 rounded-xl cursor-pointer transition flex items-start gap-3.5 ${
                    isSelected ? 'ring-2 ring-[#0f2a4a] bg-amber-50/40 border-[#0f2a4a]' : 'hover:border-slate-400'
                  }`}
                >
                  <img
                    src={master.avatar}
                    alt={master.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-300 shadow-sm"
                  />
                  
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-cinzel font-bold text-sm text-slate-900">
                        {master.name}
                      </h3>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {master.verificationStatus}
                      </span>
                    </div>

                    <p className="text-xs text-[#0f2a4a] font-bold">{master.traditionName}</p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 font-medium pt-1">
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-[#0f2a4a]" />
                        {master.district}, {master.state}
                      </span>
                      <span>• {master.experienceYears} yrs exp</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Master & Learner Applications */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          
          {/* Master Detail Card */}
          <div className="clean-card p-6 rounded-2xl space-y-4 border-[#0f2a4a]">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMaster.avatar}
                  alt={selectedMaster.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#0f2a4a] shadow"
                />
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-900">{selectedMaster.name}</h3>
                  <p className="text-xs text-[#0f2a4a] font-bold">{selectedMaster.marathiName}</p>
                  <span className="inline-block mt-1 text-[11px] bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">
                    {selectedMaster.traditionName} Custodian ({selectedMaster.state})
                  </span>
                </div>
              </div>

              <div className="text-right text-xs space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200 w-full sm:w-auto">
                <div className="text-slate-500 font-medium">Teaching Status:</div>
                <div className="font-bold text-emerald-700 flex items-center gap-1 justify-end">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Accepting Learners ({selectedMaster.activeLearnersCount}/{selectedMaster.maxLearners})
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-200">
              "{selectedMaster.bio}"
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Mode</span>
                <span className="font-bold text-slate-900">{selectedMaster.mode}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Preferred Age</span>
                <span className="font-bold text-slate-900">{selectedMaster.preferredAge}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Consent</span>
                <span className="font-bold text-amber-800">{selectedMaster.consentStatus}</span>
              </div>
            </div>

          </div>

          {/* Matched Learner Applications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-cinzel text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0f2a4a]" />
                Matched Learner Applications for {selectedMaster.traditionName}
              </h3>
              <span className="text-xs text-slate-500 font-semibold">Sorted by Compatibility %</span>
            </div>

            <div className="space-y-3">
              {learnerRequests
                .slice(0, 3)
                .map(learner => {
                  const isConnected = learner.status === 'CONNECTED';
                  const isApplied = learner.status === 'APPLIED';

                  return (
                    <div
                      key={learner.id}
                      className="clean-card p-4 rounded-xl space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900">{learner.name}</h4>
                            <span className="text-xs text-slate-500">({learner.age} yrs • {learner.district}, {learner.state})</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            {learner.interests.map((int, idx) => (
                              <span key={idx} className="text-[10px] bg-slate-100 border border-slate-300 text-slate-700 px-2 py-0.5 rounded font-semibold">
                                {int}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Compatibility Pill */}
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] text-slate-500 uppercase font-bold">Match Score</span>
                          <span className="font-cinzel font-extrabold text-base text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                            {learner.compatibilityScore}%
                          </span>
                        </div>
                      </div>

                      {/* Rationale */}
                      <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 italic">
                        💡 {learner.matchReason}
                      </p>

                      {/* Action */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-slate-500 font-medium">Availability: {learner.availability}</span>
                        
                        {isConnected ? (
                          <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Apprenticeship Active
                          </span>
                        ) : isApplied ? (
                          <button
                            onClick={() => handleAcceptRequest(learner.id)}
                            className="px-4 py-1.5 rounded-xl bg-[#0f2a4a] hover:bg-[#091a30] text-white text-xs font-bold shadow transition flex items-center gap-1.5"
                          >
                            <UserPlus className="w-3.5 h-3.5 text-amber-400" /> Accept Apprentice Request
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApplyRequest(learner.id)}
                            className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5 text-[#0f2a4a]" /> Apply to Master
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
