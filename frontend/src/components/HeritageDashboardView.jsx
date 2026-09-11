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
  RefreshCw,
  CreditCard,
  FileText
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

  // Registered Shishya & Guru Admin Directory State
  const [applications, setApplications] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [learners, setLearners] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeRosterTab, setActiveRosterTab] = useState('REGISTERED_USERS'); // 'REGISTERED_USERS', 'SHISHYAS', 'GURUS', 'APPLICATIONS'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchRoster, setSearchRoster] = useState('');

  const loadMatchmakingData = async () => {
    setLoadingData(true);
    try {
      const [appsData, pracData, learnData, usersData] = await Promise.all([
        api.getApplications(),
        api.getPractitioners(),
        api.getLearners(),
        api.getUsers()
      ]);
      setApplications(appsData || []);
      setPractitioners(pracData || []);
      setLearners(learnData || []);
      setRegisteredUsers(usersData || []);
    } catch (err) {
      console.warn('Error loading admin directory data:', err);
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

      {/* REGISTERED GURU & SHISHYA DETAILS ADMIN PANEL DIRECTORY */}
      <div className="blueprint-card p-6 space-y-6 border-2 border-emerald-900/10 shadow-lg">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-900">
                <ShieldCheck className="w-5 h-5 text-indigo-800" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-bold text-stone-900">
                  Registered Guru & Shishya Details Directory
                </h3>
                <p className="text-xs text-stone-500">
                  Official administrative inspection ledger of all Shishya (Learners) and Guru (Masters) registered and authenticated in the project
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={loadMatchmakingData}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Refresh Directory</span>
          </button>
        </div>

        {/* KPI Mini Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <span className="text-[11px] font-bold text-stone-500 uppercase block">Registered Gurus</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-800">
                {registeredUsers.filter(u => u.role === 'PRACTITIONER').length || practitioners.length}
              </span>
              <span className="text-xs text-stone-500 font-medium">Verified Masters</span>
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <span className="text-[11px] font-bold text-stone-500 uppercase block">Registered Shishyas</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-800">
                {registeredUsers.filter(u => u.role === 'LEARNER').length || learners.length}
              </span>
              <span className="text-xs text-stone-500 font-medium">Enrolled Learners</span>
            </div>
          </div>

          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-800 uppercase block">Total System Users</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-700">{registeredUsers.length || 7}</span>
              <span className="text-xs text-emerald-700 font-semibold">Active Accounts</span>
            </div>
          </div>

          <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200">
            <span className="text-[11px] font-bold text-indigo-900 uppercase block">Mandatory ID Uploaded</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-indigo-800">100%</span>
              <span className="text-xs text-indigo-700 font-semibold">Aadhaar / Voter / PAN</span>
            </div>
          </div>
        </div>

        {/* Directory Navigation Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
          
          {/* Main Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-stone-100 p-1 rounded-xl w-full md:w-auto">
            <button
              onClick={() => setActiveRosterTab('REGISTERED_USERS')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeRosterTab === 'REGISTERED_USERS'
                  ? 'bg-[#0e2a22] text-white shadow'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>All Registered Accounts ({registeredUsers.length})</span>
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
              <span>Registered Shishyas ({registeredUsers.filter(u => u.role === 'LEARNER').length})</span>
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
              <span>Registered Gurus ({registeredUsers.filter(u => u.role === 'PRACTITIONER').length})</span>
            </button>

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
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search registered details..."
                value={searchRoster}
                onChange={(e) => setSearchRoster(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
              />
            </div>
          </div>

        </div>

        {/* Tab Content 1: All Registered Shishya & Guru Master Table */}
        {activeRosterTab === 'REGISTERED_USERS' && (
          <div className="overflow-x-auto border border-stone-200 rounded-xl shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 uppercase font-extrabold border-b border-stone-200">
                <tr>
                  <th className="p-3.5">Name & Role</th>
                  <th className="p-3.5">Contact Details</th>
                  <th className="p-3.5">State & DOB</th>
                  <th className="p-3.5">Cultural Profile / Skill</th>
                  <th className="p-3.5">Mandatory ID Proof</th>
                  <th className="p-3.5">Document File</th>
                  <th className="p-3.5">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {registeredUsers.filter(u => {
                  return !searchRoster ||
                    u.name?.toLowerCase().includes(searchRoster.toLowerCase()) ||
                    u.email?.toLowerCase().includes(searchRoster.toLowerCase()) ||
                    u.state?.toLowerCase().includes(searchRoster.toLowerCase()) ||
                    u.idNumber?.toLowerCase().includes(searchRoster.toLowerCase()) ||
                    u.idType?.toLowerCase().includes(searchRoster.toLowerCase());
                }).length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-stone-500 font-medium">
                      No registered users found matching the search query.
                    </td>
                  </tr>
                ) : (
                  registeredUsers.filter(u => {
                    return !searchRoster ||
                      u.name?.toLowerCase().includes(searchRoster.toLowerCase()) ||
                      u.email?.toLowerCase().includes(searchRoster.toLowerCase()) ||
                      u.state?.toLowerCase().includes(searchRoster.toLowerCase()) ||
                      u.idNumber?.toLowerCase().includes(searchRoster.toLowerCase()) ||
                      u.idType?.toLowerCase().includes(searchRoster.toLowerCase());
                  }).map((user) => (
                    <tr key={user.id} className="hover:bg-stone-50 transition">
                      <td className="p-3.5">
                        <div className="font-bold text-stone-900 text-sm">{user.name}</div>
                        <div className="mt-1">
                          {user.role === 'LEARNER' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold">
                              <GraduationCap className="w-3 h-3 text-emerald-700" />
                              <span>SHISHYA (LEARNER)</span>
                            </span>
                          ) : user.role === 'PRACTITIONER' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-extrabold">
                              <Users className="w-3 h-3 text-amber-700" />
                              <span>GURU (PRACTITIONER)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-900 border border-indigo-200 text-[10px] font-extrabold">
                              <ShieldCheck className="w-3 h-3 text-indigo-700" />
                              <span>ADMIN AUTHORITY</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-stone-800">{user.email}</div>
                        <div className="text-[11px] text-stone-500 font-medium">{user.phone || '+91 98234 56789'}</div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-stone-800">{user.state || 'Maharashtra'}</div>
                        <div className="text-[11px] text-stone-500 font-medium">DOB: {user.dob || '2002-05-15'}</div>
                      </td>

                      <td className="p-3.5 max-w-xs">
                        {user.role === 'LEARNER' ? (
                          <div>
                            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Hobbies & Interests</span>
                            <div className="text-[11px] text-stone-700 font-medium line-clamp-2">{user.hobbies || 'Shahiri Powada, Daf Percussion'}</div>
                          </div>
                        ) : user.role === 'PRACTITIONER' ? (
                          <div>
                            <span className="text-[10px] font-bold text-amber-900 uppercase block">{user.expertTradition || 'Shahiri Powada'}</span>
                            <div className="text-[11px] text-stone-700 font-medium line-clamp-2">{user.experience || '25+ Yrs Parampara'}</div>
                          </div>
                        ) : (
                          <div className="text-[11px] text-stone-600 font-medium">{user.designation || 'Ministry of Culture Administrator'}</div>
                        )}
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                          <span className="font-bold text-stone-900 text-xs">{user.idType || 'Aadhaar Card'}</span>
                        </div>
                        <div className="font-mono text-[11px] text-stone-700 font-bold mt-0.5 tracking-wider bg-stone-100 px-1.5 py-0.5 rounded w-fit">
                          {user.idNumber || '4829-1029-3847'}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-1 text-indigo-700 font-semibold text-[11px] bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 w-fit">
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-[110px]">{user.idProofFileName || `${(user.idType || 'aadhaar').toLowerCase().replace(/\s+/g, '_')}_doc.pdf`}</span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-extrabold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>VERIFIED</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Content 2: Registered Shishyas Cards */}
        {activeRosterTab === 'SHISHYAS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {registeredUsers.filter(u => u.role === 'LEARNER' && (!searchRoster || u.name?.toLowerCase().includes(searchRoster.toLowerCase()) || u.state?.toLowerCase().includes(searchRoster.toLowerCase()))).map((shishya) => (
              <div key={shishya.id} className="bg-white p-4 rounded-xl border border-stone-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 font-extrabold flex items-center justify-center text-xs">
                      {shishya.name ? shishya.name.charAt(0) : 'S'}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs">{shishya.name}</h4>
                      <span className="text-[11px] text-stone-500">{shishya.state}, India</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                    DOB: {shishya.dob || '2002-05-15'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Hobbies & Cultural Interests</span>
                  <p className="text-xs text-stone-700 bg-stone-50 p-2 rounded-lg border border-stone-100 font-medium">
                    {shishya.hobbies || 'Shahiri Powada recitation, Daf percussion, Historical Maratha Ballads'}
                  </p>
                </div>

                <div className="p-2 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-medium">Mandatory ID:</span>
                    <span className="font-bold text-stone-900">{shishya.idType || 'Aadhaar Card'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-medium">ID Number:</span>
                    <span className="font-mono font-bold text-stone-800">{shishya.idNumber || '4829-1029-3847'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-indigo-700 pt-0.5">
                    <span>Document File:</span>
                    <span className="font-semibold underline">{shishya.idProofFileName || 'aniket_aadhaar_card.pdf'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                  <span className="text-stone-500 font-medium">{shishya.email}</span>
                  <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content 3: Registered Gurus Cards */}
        {activeRosterTab === 'GURUS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {registeredUsers.filter(u => u.role === 'PRACTITIONER' && (!searchRoster || u.name?.toLowerCase().includes(searchRoster.toLowerCase()) || u.state?.toLowerCase().includes(searchRoster.toLowerCase()))).map((guru) => (
              <div key={guru.id} className="bg-white p-4 rounded-xl border border-stone-200 space-y-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 font-black flex items-center justify-center text-sm border border-amber-200 shrink-0">
                    {guru.name ? guru.name.charAt(0) : 'G'}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1">
                      {guru.name}
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </h4>
                    <span className="text-xs font-semibold text-amber-800 block">{guru.expertTradition || 'Shahiri Powada'}</span>
                    <span className="text-[11px] text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" /> {guru.state}, India
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed bg-stone-50 p-2 rounded-lg border border-stone-100 font-medium">
                  {guru.experience || '28 Years of continuous Shahiri Akhada & Daf oral tradition'}
                </p>

                <div className="p-2 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-medium">Mandatory ID:</span>
                    <span className="font-bold text-stone-900">{guru.idType || 'Aadhaar Card'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-medium">ID Number:</span>
                    <span className="font-mono font-bold text-stone-800">{guru.idNumber || '8910-2345-6789'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-indigo-700 pt-0.5">
                    <span>Document File:</span>
                    <span className="font-semibold underline">{guru.idProofFileName || 'shahir_jagtap_aadhaar.pdf'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                  <span className="text-stone-500 font-medium">{guru.email}</span>
                  <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED MASTER
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content 4: Applications & Requests Table */}
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
      </div>

    </div>
  );
}

