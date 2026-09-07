import React from 'react';
import { 
  Layers, 
  ChevronRight, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Flame 
} from 'lucide-react';
import { RECENT_ACTIVITIES, TOP_AT_RISK_TRADITIONS } from '../data/heritageData';
import { getTraditionImage, getCategoryFallback } from '../utils/imageResolver';

export default function HeritageDashboardView({ traditions, onSelectTradition, onNavigateView }) {
  const totalCount = traditions && traditions.length > 0 ? traditions.length : 32;
  const strongCount = traditions && traditions.length > 0 ? traditions.filter(t => t.status === 'STRONG').length : 12;
  const vulnerableCount = traditions && traditions.length > 0 ? traditions.filter(t => t.status === 'VULNERABLE').length : 11;
  const criticalCount = traditions && traditions.length > 0 ? traditions.filter(t => t.status === 'CRITICAL').length : 9;

  const strongPct = ((strongCount / totalCount) * 100).toFixed(1);
  const vulnerablePct = ((vulnerableCount / totalCount) * 100).toFixed(1);
  const criticalPct = ((criticalCount / totalCount) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Traditions */}
        <div className="blueprint-card p-5">
          <div className="text-xs font-semibold text-stone-500">
            Total Traditions
          </div>
          <div className="mt-2 text-3xl font-extrabold text-stone-900">
            {totalCount}
          </div>
        </div>

        {/* Strong */}
        <div className="blueprint-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Strong</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              {strongPct}%
            </span>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-stone-900">
            {strongCount}
          </div>
        </div>

        {/* Vulnerable */}
        <div className="blueprint-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Vulnerable</span>
            <span className="text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
              {vulnerablePct}%
            </span>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-stone-900">
            {vulnerableCount}
          </div>
        </div>

        {/* Critical */}
        <div className="blueprint-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Critical</span>
            <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
              {criticalPct}%
            </span>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-red-600">
            {criticalCount}
          </div>
        </div>

      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Heritage Health Overview & Donut Chart */}
        <div className="lg:col-span-6 space-y-6">
          <div className="blueprint-card p-6">
            <h3 className="text-sm font-bold text-stone-900 mb-6">
              Heritage Health Overview
            </h3>

            {/* Donut Chart with Legend */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-2">
              
              {/* Donut graphic */}
              <div className="relative w-36 h-36 rounded-full donut-conic flex items-center justify-center shadow-inner">
                <div className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center shadow-xs">
                  <span className="text-2xl font-black text-stone-900 leading-none">
                    {totalCount}
                  </span>
                  <span className="text-[10px] text-stone-400 font-semibold uppercase mt-0.5">
                    Total
                  </span>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
                  <span className="text-stone-700 font-medium">Strong</span>
                  <span className="text-stone-500 font-bold ml-auto">(37.5%)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-orange-600 shrink-0" />
                  <span className="text-stone-700 font-medium">Vulnerable</span>
                  <span className="text-stone-500 font-bold ml-auto">(34.4%)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-red-600 shrink-0" />
                  <span className="text-stone-700 font-medium">Critical</span>
                  <span className="text-stone-500 font-bold ml-auto">(28.1%)</span>
                </div>
              </div>

            </div>

            {/* Recent Activities Feed */}
            <div className="mt-8 pt-6 border-t border-stone-100">
              <h4 className="text-xs font-bold text-stone-800 mb-3 uppercase tracking-wider">
                Recent Activities
              </h4>
              <div className="space-y-3">
                {RECENT_ACTIVITIES.map((act) => (
                  <div key={act.id} className="flex items-start justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400 shrink-0" />
                      <span className="text-stone-700 font-medium">{act.title}</span>
                    </div>
                    <span className="text-[11px] text-stone-400 shrink-0 ml-2">{act.timeAgo}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Top At-Risk Traditions List */}
        <div className="lg:col-span-6">
          <div className="blueprint-card p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-stone-900">
                  Top At-Risk Traditions
                </h3>
                <button
                  onClick={() => onNavigateView('EXPLORER')}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                >
                  <span>View all</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Traditions List */}
              <div className="divide-y divide-stone-100">
                {TOP_AT_RISK_TRADITIONS.map((tradition) => (
                  <div
                    key={tradition.id}
                    onClick={() => {
                      const found = traditions.find(t => t.id === tradition.id) || traditions[0];
                      onSelectTradition(found);
                    }}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-stone-50/80 px-2 rounded-xl cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={getTraditionImage(tradition)}
                        alt={tradition.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getCategoryFallback(tradition.category, tradition.state);
                        }}
                        className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-stone-900">
                          {tradition.name}
                        </h4>
                        <div className="text-[11px] text-stone-500">
                          {tradition.score}/100
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${
                      tradition.status === 'Critical'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : tradition.status === 'Vulnerable'
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {tradition.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="pt-4 border-t border-stone-100 mt-4">
              <button
                onClick={() => onNavigateView('AI_ANALYSIS')}
                className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Run AI Risk Prediction Simulation</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
