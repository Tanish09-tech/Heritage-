import React from 'react';
import { Lightbulb, ArrowUpRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function RecommendationEngineView({ traditions, onNavigateTab }) {
  const vulnerableTraditions = traditions.filter(t => t.score < 60);

  const recommendationsList = [
    {
      id: 'rec-01',
      traditionName: 'Shahiri Powada (Maharashtra)',
      score: 38,
      status: 'CRITICAL',
      detectedProblem: 'Severe Apprentice Deficit (Only 2 active learners for 8 elderly masters)',
      recommendedIntervention: 'Launch Zilla Parishad Stipend-backed Master-Apprentice Gurukul Scheme',
      actionSteps: [
        'Sponsor monthly ₹3,500 learner stipend for 10 selected Maharashtra youths',
        'Pair Shahir Tukaramji Kadam with 3 applicants in Satara & Kolhapur',
        'Initiate 10-day audio documentation sprint of unrecorded historical ballads'
      ],
      impact: 'Increases Learner Participation score from 15% to 65%, lifting HTHS to 62/100 🟡'
    },
    {
      id: 'rec-02',
      traditionName: 'Koodiyattam Theatre (Kerala)',
      score: 32,
      status: 'CRITICAL',
      detectedProblem: 'Single-Point Lineage Vulnerability (Only 2 master Gurus, 1 student)',
      recommendedIntervention: 'Emergency Cultural Fellowship & Netrabhinaya Archiving',
      actionSteps: [
        'Establish 5-year full-time student fellowship at Kalamandalam center in Thrissur',
        'Digitize Sanskrit eye mudra recitations and Mizhavu drum rhythms'
      ],
      impact: 'Secures 2,000-year temple lineage continuity and lifts Documentation Availability to 85%'
    },
    {
      id: 'rec-03',
      traditionName: 'Bhavai Folk Street Theatre (Gujarat)',
      score: 42,
      status: 'CRITICAL',
      detectedProblem: 'Severe Loss of Traditional Vesha Performers and Village Mandalis',
      recommendedIntervention: 'North Gujarat Master-Apprentice Performance Residency',
      actionSteps: [
        'Sponsor village mandali seasonal performance grants in Mehsana and Patan',
        'Pair Nayak master actors with 12 young apprentices across Saurashtra and North Gujarat'
      ],
      impact: 'Improves Intergenerational Transmission score from 35% to 70%'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="clean-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#0f2a4a]" />
            <h2 className="font-cinzel text-xl md:text-2xl font-bold text-[#0f2a4a]">
              Intervention Recommendation Engine
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Rule-Based Policy Recommendations & AI-Assisted Safeguarding Strategy
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200 text-xs text-amber-900 font-bold">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          <span>{vulnerableTraditions.length} Vulnerable Traditions Flagged</span>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-6">
        {recommendationsList.map((rec) => (
          <div
            key={rec.id}
            className="clean-card p-6 rounded-2xl space-y-4 border-slate-300 hover:border-[#0f2a4a] transition"
          >
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center font-cinzel font-bold text-red-700 text-lg">
                  {rec.score}
                </div>
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-900">{rec.traditionName}</h3>
                  <span className="text-[10px] font-bold text-red-700 uppercase bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    {rec.status} TRANSMISSION GAP
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('MATCHMAKER')}
                className="px-4 py-1.5 rounded-xl bg-[#0f2a4a] hover:bg-[#091a30] text-white font-bold text-xs shadow transition flex items-center gap-1"
              >
                <span>Execute Master–Learner Match</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-red-50/60 border border-red-200 p-3.5 rounded-xl space-y-1">
                <span className="font-bold text-red-700 uppercase text-[10px] block">Problem Signal Detected:</span>
                <p className="text-red-950 font-semibold">{rec.detectedProblem}</p>
              </div>

              <div className="bg-amber-50/60 border border-amber-200 p-3.5 rounded-xl space-y-1">
                <span className="font-bold text-amber-800 uppercase text-[10px] block">Targeted Intervention Strategy:</span>
                <p className="text-amber-950 font-semibold">{rec.recommendedIntervention}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 uppercase text-[10px] block">Key Action Steps:</span>
              <ul className="space-y-1.5 text-slate-800">
                {rec.actionSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-600 font-semibold">Projected Score Impact:</span>
              <span className="text-emerald-800 font-bold bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-lg">
                ✨ {rec.impact}
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
