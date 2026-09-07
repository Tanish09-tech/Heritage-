import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  ChevronRight, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Flame,
  GraduationCap,
  Users,
  MessageSquare,
  XCircle,
  Search,
  Filter,
  ShieldCheck,
  Award,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { RECENT_ACTIVITIES } from '../data/heritageData';
import { getTraditionImage, getCategoryFallback } from '../utils/imageResolver';
import { api } from '../services/api';

export default function HeritageDashboardView({ traditions, onSelectTradition, onNavigateView }) {
  const totalCount = traditions && traditions.length > 0 ? traditions.length : 32;
  const strongCount = traditions && traditions.length > 0 ? traditions.filter(t => t.status === 'STRONG').length : 12;
  const vulnerableCount = traditions && traditions.length > 0 ? traditions.filter(t => t.status === 'VULNERABLE').length : 11;
  const criticalCount = traditions && traditions.length > 0 ? traditions.filter(t => t.status === 'CRITICAL').length : 9;

  const strongPct = ((strongCount / totalCount) * 100).toFixed(1);
  const vulnerablePct = ((vulnerableCount / totalCount) * 100).toFixed(1);
  const criticalPct = ((criticalCount / totalCount) * 100).toFixed(1);

  // Matchmaking Roster State
  const [applications, setApplications] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [learners, setLearners] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeRosterTab, setActiveRosterTab] = useState('APPLICATIONS'); // 'APPLICATIONS', 'GURUS', 'SHISHYAS'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchRoster, setSearchRoster] = useState('');

  const loadMatchmakingData = async () => {
    setLoadingData(true);
    try {
      const [appsData, pracData, learnData] = await Promise.all([
        api.getApplications(),
        api.getPractitioners(),
        api.getLearners()
      ]);
      setApplications(appsData || []);
      setPractitioners(pracData || []);
      setLearners(learnData || []);
    } catch (err) {
      console.warn('Error loading admin matchmaking roster:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadMatchmakingData();
  }, []);

  const atRiskList = traditions && traditions.length > 0 
    ? traditions.filter(t => t.status === 'CRITICAL' || t.status === 'VULNERABLE').slice(0, 5)
    : [];

  const acceptedCount = applications.filter(a => a.status === 'ACCEPTED').length;
  const pendingCount = applications.filter(a => a.status === 'PENDING').length;

  const filteredApps = applications.filter(app => {
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesSearch = !searchRoster || 
      app.learnerName?.toLowerCase().includes(searchRoster.toLowerCase()) ||
      app.practitionerName?.toLowerCase().includes(searchRoster.toLowerCase()) ||
      app.traditionName?.toLowerCase().includes(searchRoster.toLowerCase()) ||
      app.note?.toLowerCase().includes(searchRoster.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredGurus = practitioners.filter(p => {
    return !searchRoster ||
      p.name?.toLowerCase().includes(searchRoster.toLowerCase()) ||
      p.tradition?.toLowerCase().includes(searchRoster.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchRoster.toLowerCase());
  });

  const filteredShishyas = learners.filter(l => {
    return !searchRoster ||
      l.name?.toLowerCase().includes(searchRoster.toLowerCase()) ||
      l.district?.toLowerCase().includes(searchRoster.toLowerCase()) ||
      (l.interests && l.interests.join(' ').toLowerCase().includes(searchRoster.toLowerCase()));
  });

  return (
    <div className="space-y-8">
      
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
                  <span className="text-stone-500 font-bold ml-auto">({strongPct}%)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-orange-600 shrink-0" />
                  <span className="text-stone-700 font-medium">Vulnerable</span>
                  <span className="text-stone-500 font-bold ml-auto">({vulnerablePct}%)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-red-600 shrink-0" />
                  <span className="text-stone-700 font-medium">Critical</span>
                  <span className="text-stone-500 font-bold ml-auto">({criticalPct}%)</span>
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
                      <span className="text-stone-700 font-medium">{act.title || act.action}</span>
                    </div>
                    <span className="text-[11px] text-stone-400 shrink-0 ml-2">{act.timeAgo || act.time}</span>
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
                {atRiskList.map((tradition) => (
                  <div
                    key={tradition.id}
                    onClick={() => onSelectTradition(tradition)}
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
                          HTHS Score: {tradition.score}/100
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${
                      tradition.status === 'CRITICAL' || tradition.status === 'Critical'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : tradition.status === 'VULNERABLE' || tradition.status === 'Vulnerable'
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {tradition.statusLabel || tradition.status}
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

      {/* DEDICATED GURU-SHISHYA APPRENTICESHIP & MATCHMAKING ADMIN PANEL ROSTER */}
      <div className="blueprint-card p-6 space-y-6 border-2 border-emerald-900/10 shadow-lg">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-bold text-stone-900">
                  Guru-Shishya Matchmaking & Apprenticeship Roster
                </h3>
                <p className="text-xs text-stone-500">
                  Real-time administration of master practitioners, registered learners, request messages & approval statuses
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={loadMatchmakingData}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Refresh Roster</span>
          </button>
        </div>

        {/* KPI Mini Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <span className="text-[11px] font-bold text-stone-500 uppercase block">Active Gurus</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-800">{practitioners.length}</span>
              <span className="text-xs text-stone-500 font-medium">Verified Masters</span>
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <span className="text-[11px] font-bold text-stone-500 uppercase block">Registered Shishyas</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-800">{learners.length}</span>
              <span className="text-xs text-stone-500 font-medium">Enrolled Learners</span>
            </div>
          </div>

          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-800 uppercase block">Approved Apprenticeships</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-700">{acceptedCount}</span>
              <span className="text-xs text-emerald-700 font-semibold">Active Pairs</span>
            </div>
          </div>

          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
            <span className="text-[11px] font-bold text-amber-800 uppercase block">Pending Guru Approvals</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-700">{pendingCount}</span>
              <span className="text-xs text-amber-700 font-semibold">Awaiting Guru</span>
            </div>
          </div>
        </div>

        {/* Roster Navigation Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
          
          {/* Main Tabs */}
          <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl w-full md:w-auto">
            <button
              onClick={() => setActiveRosterTab('APPLICATIONS')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeRosterTab === 'APPLICATIONS'
                  ? 'bg-[#0e2a22] text-white shadow'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Apprenticeship Requests ({applications.length})</span>
            </button>
            
            <button
              onClick={() => setActiveRosterTab('GURUS')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeRosterTab === 'GURUS'
                  ? 'bg-[#0e2a22] text-white shadow'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Active Gurus ({practitioners.length})</span>
            </button>

            <button
              onClick={() => setActiveRosterTab('SHISHYAS')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeRosterTab === 'SHISHYAS'
                  ? 'bg-[#0e2a22] text-white shadow'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Active Shishyas ({learners.length})</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search roster..."
                value={searchRoster}
                onChange={(e) => setSearchRoster(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
              />
            </div>

            {activeRosterTab === 'APPLICATIONS' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-800 font-semibold focus:outline-none focus:border-emerald-700"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending Approval</option>
                <option value="ACCEPTED">Accepted (Active)</option>
                <option value="REJECTED">Declined</option>
              </select>
            )}
          </div>

        </div>

        {/* Tab Content 1: Applications & Requests Table */}
        {activeRosterTab === 'APPLICATIONS' && (
          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-600 uppercase font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3">Shishya (Learner)</th>
                  <th className="p-3">Guru (Master)</th>
                  <th className="p-3">Tradition</th>
                  <th className="p-3">Applied Date</th>
                  <th className="p-3">Request Message Note</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-stone-500 font-medium">
                      No apprenticeship requests found matching the current search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-stone-50 transition">
                      <td className="p-3">
                        <div className="font-bold text-stone-900">{app.learnerName || 'Aniket Deshmukh'}</div>
                        <div className="text-[11px] text-stone-500">{app.learnerEmail || 'shishya.aniket@gmail.com'}</div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-amber-900">{app.practitionerName || 'Master Guru'}</div>
                      </td>

                      <td className="p-3 font-semibold text-stone-800">
                        {app.traditionName || 'Indian Heritage'}
                      </td>

                      <td className="p-3 text-stone-500 font-medium">
                        {app.date || new Date().toISOString().split('T')[0]}
                      </td>

                      <td className="p-3 max-w-xs">
                        <div className="p-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 text-[11px] italic line-clamp-2">
                          "{app.note || app.message || 'Respected Guru, I request to learn under your mentorship.'}"
                        </div>
                      </td>

                      <td className="p-3">
                        {app.status === 'ACCEPTED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>APPROVED</span>
                          </span>
                        ) : app.status === 'REJECTED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 text-red-800 border border-red-200 text-[11px] font-bold">
                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                            <span>DECLINED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                            <span>PENDING GURU</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Content 2: Active Gurus Directory */}
        {activeRosterTab === 'GURUS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGurus.map((guru) => (
              <div key={guru.id} className="bg-white p-4 rounded-xl border border-stone-200 space-y-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <img
                    src={guru.avatar || '/images/hero.jpg'}
                    alt={guru.name}
                    className="w-12 h-12 rounded-xl object-cover border border-amber-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1">
                      {guru.name}
                      {guru.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    </h4>
                    <span className="text-xs font-semibold text-amber-800 block">{guru.tradition}</span>
                    <span className="text-[11px] text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" /> {guru.location}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed bg-stone-50 p-2 rounded-lg border border-stone-100">
                  {guru.bio || 'Master practitioner dedicated to preserving traditional heritage knowledge.'}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                  <span className="text-stone-500 font-medium">{guru.experience || '15+ Yrs Exp'}</span>
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {guru.activeLearnersCount || 2} Active Shishyas
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content 3: Active Shishyas Directory */}
        {activeRosterTab === 'SHISHYAS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredShishyas.map((shishya) => (
              <div key={shishya.id} className="bg-white p-4 rounded-xl border border-stone-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 font-extrabold flex items-center justify-center text-xs">
                      {shishya.name ? shishya.name.charAt(0) : 'S'}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs">{shishya.name}</h4>
                      <span className="text-[11px] text-stone-500">{shishya.district}, {shishya.state}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                    Age {shishya.age || 20}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Interests</span>
                  <div className="flex flex-wrap gap-1">
                    {(shishya.interests || ['Heritage Art']).map((int, i) => (
                      <span key={i} className="text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
                        {int}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                  <span className="text-stone-500 font-medium">{shishya.learningMode || 'Offline Gurukul'}</span>
                  <span className="font-bold text-stone-700">
                    Status: <span className="text-emerald-700">{shishya.status || 'Active'}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

