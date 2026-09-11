import React, { useState } from 'react';
import { CheckCircle2, XCircle, Check, ShieldCheck, UserCheck, ChevronLeft } from 'lucide-react';

export default function ValidationQueueView({ onBack, queue, onApproveItem }) {
  const [queueItems, setQueueItems] = useState(queue);

  const handleApprove = (id) => {
    setQueueItems(prev => prev.map(item => item.id === id ? { ...item, status: 'COMMUNITY_VALIDATED' } : item));
    onApproveItem(id);
    alert("✅ Field Submission Approved & Validated! HTHS scores updated.");
  };

  const handleReject = (id) => {
    setQueueItems(prev => prev.filter(item => item.id !== id));
    alert("❌ Submission Returned to Field Officer for Data Correction.");
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="clean-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-stone-200"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0f2a4a]" />
              <h2 className="font-cinzel text-xl md:text-2xl font-bold text-[#0f2a4a]">
                Community Data Validation Queue
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Human-in-the-Loop Governance: Peer verification of indicator submissions before score integration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-purple-50 px-3.5 py-1.5 rounded-xl border border-purple-200 text-xs text-purple-900 font-bold">
          <UserCheck className="w-4 h-4 text-purple-700" />
          <span>Role: Authorised Reviewer / Community Delegate</span>
        </div>
      </div>

      {/* Queue */}
      <div className="space-y-4">
        {queueItems.map((item) => {
          const isValidated = item.status === 'COMMUNITY_VALIDATED';

          return (
            <div
              key={item.id}
              className={`clean-card p-6 rounded-2xl space-y-4 transition ${
                isValidated ? 'bg-emerald-50/40 border-emerald-300' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-900">{item.traditionName}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium mt-0.5">
                    <span>Submitted by: <strong className="text-slate-900">{item.submittedBy}</strong></span>
                    <span>• {item.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold">Field Target:</span>
                  <span className="text-xs font-bold bg-slate-100 border border-slate-300 px-3 py-1 rounded-lg text-slate-800">
                    {item.field}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Field Data Report:</span>
                <p className="text-slate-800 leading-relaxed font-sans font-medium">{item.dataSummary}</p>
                
                <div className="flex items-center gap-4 pt-2 text-[11px] text-slate-600 border-t border-slate-200">
                  <span>Confidence: <strong className="text-emerald-700">{item.confidence}</strong></span>
                  <span>Evidence: <strong className="text-slate-800">{item.evidence}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-500 font-semibold">Workflow Status: {item.status}</span>

                {isValidated ? (
                  <span className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Validated & Integrated into HTHS
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-red-700 border border-slate-300 text-xs font-bold transition flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject / Request Data Edit
                    </button>
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-4 py-1.5 rounded-xl bg-[#0f2a4a] hover:bg-[#091a30] text-white text-xs font-bold shadow transition flex items-center gap-1"
                    >
                      <Check className="w-4 h-4 text-amber-400" /> Approve & Update Health Score
                    </button>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
