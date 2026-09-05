import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, ShieldCheck, Activity, Users, MapPin, ChevronRight, BookOpen, Layers, Globe } from 'lucide-react';

export default function DashboardView({ traditions, onSelectTradition, onNavigateTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedState, setSelectedState] = useState('ALL');

  // KPI Calculations
  const totalTraditions = traditions.length;
  const criticalCount = traditions.filter(t => t.status === 'CRITICAL').length;
  const vulnerableCount = traditions.filter(t => t.status === 'VULNERABLE').length;
  const monitoringCount = traditions.filter(t => t.status === 'MONITORING').length;
  const strongCount = traditions.filter(t => t.status === 'STRONG').length;

  const statesList = ['ALL', 'Maharashtra', 'Punjab', 'Gujarat', 'Delhi', 'Madhya Pradesh', 'Uttar Pradesh', 'Assam', 'Kerala', 'Himachal Pradesh'];

  const filteredTraditions = traditions.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.marathiName.includes(searchQuery);
    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    const matchesState = selectedState === 'ALL' || t.state.includes(selectedState.split(' ')[0]);
    return matchesSearch && matchesStatus && matchesState;
  });

  return (
    <div className="space-y-6">
      
      {/* Hero Banner Section */}
      <div className="relative rounded-2xl overflow-hidden indigo-gradient-bg text-white p-6 md:p-8 shadow-lg border border-indigo-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>All-India Living Heritage Protection System • 28 States & UTs</span>
            </div>
            <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-amber-100 leading-tight">
              Safeguarding India's Living Heritage Knowledge Chain
            </h2>
            <p className="text-amber-100/90 text-sm leading-relaxed max-w-2xl font-sans">
              Sanskriti Suraksha continuously monitors whether living Indian traditions across North, South, East, West, and Central India are successfully being transmitted to the next generation. Detect early risk signals, explain reasons, and connect master practitioners with learners.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('HTHS')}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow transition flex items-center gap-2"
              >
                <Activity className="w-4 h-4 text-slate-950" />
                <span>Simulate HTHS Score Engine</span>
              </button>
              <button
                onClick={() => onNavigateTab('MATCHMAKER')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-amber-300/40 text-amber-100 font-semibold text-xs transition flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-amber-300" />
                <span>Master–Learner Matchmaker</span>
              </button>
            </div>
          </div>

          {/* Quick Hero Artwork Feature */}
          <div className="relative rounded-xl overflow-hidden border-2 border-amber-300/40 shadow-md group hidden lg:block lg:col-span-4">
            <img 
              src="/images/hero.jpg" 
              alt="Living Indian Heritage" 
              className="w-full h-44 object-cover object-center group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-3">
              <div className="text-xs">
                <span className="font-cinzel font-bold text-amber-300">National Heritage Registry</span>
                <p className="text-amber-100/80 text-[11px]">Pan-India Traditions Tracked in Real-Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        {/* Total Traditions */}
        <div className="clean-card p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Total Traditions</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-cinzel text-3xl font-extrabold text-slate-900">{totalTraditions}</span>
            <span className="text-xs text-slate-500">Pan-India</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-800 font-medium">100% Verified Indicators</div>
        </div>

        {/* Critical Gap */}
        <button 
          onClick={() => setSelectedStatus(selectedStatus === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
          className={`clean-card p-4 rounded-xl flex flex-col justify-between text-left transition ${selectedStatus === 'CRITICAL' ? 'ring-2 ring-red-500 bg-red-50/50' : ''}`}
        >
          <div className="flex items-center justify-between text-red-600 text-xs font-bold uppercase">
            <span>Critical Gap</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-cinzel text-3xl font-extrabold text-red-600">{criticalCount}</span>
            <span className="text-xs text-red-700 font-semibold">🔴 HTHS 0–39</span>
          </div>
          <div className="mt-1 text-[11px] text-red-600 font-semibold">Immediate Action Needed</div>
        </button>

        {/* Vulnerable */}
        <button 
          onClick={() => setSelectedStatus(selectedStatus === 'VULNERABLE' ? 'ALL' : 'VULNERABLE')}
          className={`clean-card p-4 rounded-xl flex flex-col justify-between text-left transition ${selectedStatus === 'VULNERABLE' ? 'ring-2 ring-orange-500 bg-orange-50/50' : ''}`}
        >
          <div className="flex items-center justify-between text-orange-600 text-xs font-bold uppercase">
            <span>Vulnerable</span>
            <Activity className="w-4 h-4 text-orange-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-cinzel text-3xl font-extrabold text-orange-600">{vulnerableCount}</span>
            <span className="text-xs text-orange-700 font-semibold">🟠 HTHS 40–59</span>
          </div>
          <div className="mt-1 text-[11px] text-orange-600 font-semibold">Intervention Strategy</div>
        </button>

        {/* Needs Monitoring */}
        <button 
          onClick={() => setSelectedStatus(selectedStatus === 'MONITORING' ? 'ALL' : 'MONITORING')}
          className={`clean-card p-4 rounded-xl flex flex-col justify-between text-left transition ${selectedStatus === 'MONITORING' ? 'ring-2 ring-amber-500 bg-amber-50/50' : ''}`}
        >
          <div className="flex items-center justify-between text-amber-700 text-xs font-bold uppercase">
            <span>Monitoring</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-cinzel text-3xl font-extrabold text-amber-700">{monitoringCount}</span>
            <span className="text-xs text-amber-800 font-semibold">🟡 HTHS 60–79</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-700 font-semibold">Moderate Continuity</div>
        </button>

        {/* Strong Transmission */}
        <button 
          onClick={() => setSelectedStatus(selectedStatus === 'STRONG' ? 'ALL' : 'STRONG')}
          className={`clean-card p-4 rounded-xl flex flex-col justify-between text-left transition ${selectedStatus === 'STRONG' ? 'ring-2 ring-emerald-500 bg-emerald-50/50' : ''}`}
        >
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold uppercase">
            <span>Strong</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-cinzel text-3xl font-extrabold text-emerald-700">{strongCount}</span>
            <span className="text-xs text-emerald-800 font-semibold">🟢 HTHS 80–100</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-semibold">Healthy Transfer</div>
        </button>

      </div>

      {/* Toolbar: Search & State Filters */}
      <div className="clean-card p-4 rounded-xl space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tradition, state, district, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0f2a4a] focus:bg-white transition"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs text-slate-600 font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            {['ALL', 'CRITICAL', 'VULNERABLE', 'MONITORING', 'STRONG'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  selectedStatus === status
                    ? 'bg-[#0f2a4a] text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {status === 'ALL' ? 'All Status' : status}
              </button>
            ))}
          </div>

        </div>

        {/* State Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-600 font-semibold mr-1 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-[#0f2a4a]" /> Region / State:
          </span>
          {statesList.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                selectedState === st
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All India' : st}
            </button>
          ))}
        </div>

      </div>

      {/* Pan-India Tradition Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTraditions.map((tradition) => (
          <div
            key={tradition.id}
            className="clean-card rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1"
          >
            {/* Header Image & Badges */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={tradition.image}
                alt={tradition.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
              
              {/* Score Badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200">
                <span className="text-[11px] text-slate-600 font-bold">HTHS:</span>
                <span className="font-cinzel font-extrabold text-sm" style={{ color: tradition.color }}>
                  {tradition.score}/100
                </span>
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-sm ${tradition.bgClass}`}>
                  {tradition.statusLabel}
                </span>
              </div>

              {/* Title & State */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-cinzel text-xl font-bold tracking-wide">
                    {tradition.name}
                  </h3>
                  <span className="bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[10px]">
                    {tradition.state}
                  </span>
                </div>
                <p className="text-xs text-amber-200 font-sans font-medium">{tradition.marathiName}</p>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-4 space-y-3 flex-1 bg-white">
              
              <div className="flex items-center justify-between text-xs text-slate-600 border-b border-slate-100 pb-2">
                <span className="flex items-center gap-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#0f2a4a]" />
                  {tradition.region}
                </span>
                <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                  {tradition.category.split(' ')[0]}
                </span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {tradition.description}
              </p>

              {/* 3 Metric Summary Boxes */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Masters</span>
                  <span className="font-bold text-sm text-slate-900">{tradition.masterPractitioners}</span>
                </div>
                <div className="border-x border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Learners</span>
                  <span className={`font-bold text-sm ${tradition.learners <= 2 ? 'text-red-600' : 'text-emerald-700'}`}>
                    {tradition.learners}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Avg Age</span>
                  <span className="font-bold text-sm text-slate-800">{tradition.avgPractitionerAge} yrs</span>
                </div>
              </div>

              {/* AI Risk Snippet */}
              <div className="bg-red-50/70 border border-red-200 rounded-xl p-2.5 text-xs text-red-900 space-y-0.5">
                <span className="font-bold text-red-700 flex items-center gap-1 text-[11px] uppercase">
                  <AlertTriangle className="w-3 h-3" /> Key Transmission Risk:
                </span>
                <p className="line-clamp-2 text-xs text-red-950 font-medium">
                  {tradition.riskFactors[0]}
                </p>
              </div>

            </div>

            {/* Card Action Footer */}
            <div className="p-4 pt-0 bg-white">
              <button
                onClick={() => onSelectTradition(tradition)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#0f2a4a] text-slate-800 hover:text-white border border-slate-300 hover:border-[#0f2a4a] text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>View Living Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
