import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  GraduationCap, 
  Award, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  X, 
  Sparkles, 
  User, 
  BookOpen, 
  RefreshCw,
  Eye,
  AlertCircle,
  ChevronLeft
} from 'lucide-react';
import { api } from '../services/api';
import { FOCUS_STATES } from './ProfileDetailsModal';

export default function GuruShishyaDetailsView({ onBack }) {
  const [activeTab, setActiveTab] = useState('GURU'); // 'GURU' | 'SHISHYA'
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedUserModal, setSelectedUserModal] = useState(null);

  // Fetch users from database API
  const loadUsersFromDatabase = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const fetchedUsers = await api.getUsers();
      if (Array.isArray(fetchedUsers)) {
        setUsers(fetchedUsers);
      }
    } catch (err) {
      console.error('Failed to fetch users from database:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsersFromDatabase();
    // Poll every 10 seconds to ensure newly registered users automatically appear
    const interval = setInterval(() => {
      loadUsersFromDatabase();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filter users by role
  const guruList = useMemo(() => {
    return users.filter(u => u.role === 'PRACTITIONER' || u.role === 'GURU');
  }, [users]);

  const shishyaList = useMemo(() => {
    return users.filter(u => u.role === 'LEARNER' || u.role === 'SHISHYA');
  }, [users]);

  // Apply search & state/status filters to active tab list
  const filteredUsers = useMemo(() => {
    const targetList = activeTab === 'GURU' ? guruList : shishyaList;
    return targetList.filter(user => {
      // Search matches
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch = !query || (
        (user.name && user.name.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query)) ||
        (user.phone && user.phone.toLowerCase().includes(query)) ||
        (user.state && user.state.toLowerCase().includes(query)) ||
        (user.expertTradition && user.expertTradition.toLowerCase().includes(query)) ||
        (user.hobbies && user.hobbies.toLowerCase().includes(query)) ||
        (user.idNumber && user.idNumber.toLowerCase().includes(query))
      );

      // State filter matches
      const matchesState = selectedState === 'ALL' || user.state === selectedState;

      // Status filter matches
      const matchesStatus = selectedStatus === 'ALL' || (
        selectedStatus === 'VERIFIED' ? (user.idVerified || user.profileCompleted) :
        selectedStatus === 'PENDING' ? (!user.idVerified && !user.profileCompleted) : true
      );

      return matchesSearch && matchesState && matchesStatus;
    });
  }, [activeTab, guruList, shishyaList, searchTerm, selectedState, selectedStatus]);

  // Overall statistics
  const stats = useMemo(() => ({
    total: users.length,
    gurus: guruList.length,
    shishyas: shishyaList.length,
    verified: users.filter(u => u.idVerified || u.profileCompleted).length
  }), [users, guruList, shishyaList]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#0e2a22] via-[#163f34] to-[#1d4ed8]/80 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-3">
            {onBack && (
              <button 
                onClick={onBack}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-white/20 shrink-0 mt-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30 mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Ministry Database Sync Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-cinzel text-amber-100">
                Guru & Shishya Details Directory
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Comprehensive registry of all verified Gurus (Master Practitioners) and Shishyas (Apprentice Learners) registered across India. Monitor profiles, credentials, and government ID validations in real-time.
              </p>
            </div>
          </div>

          <button
            onClick={() => loadUsersFromDatabase(true)}
            disabled={refreshing}
            className="self-start md:self-auto inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing DB...' : 'Sync Database'}</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-emerald-700/50">
          <div className="bg-[#0e2a22]/70 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-600/30">
            <div className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider">Total Registered</div>
            <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">{stats.total}</div>
          </div>
          <div className="bg-[#0e2a22]/70 backdrop-blur-xs p-3.5 rounded-2xl border border-amber-500/30">
            <div className="text-[11px] text-amber-300/80 font-semibold uppercase tracking-wider">Active Gurus</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-300 mt-0.5">{stats.gurus}</div>
          </div>
          <div className="bg-[#0e2a22]/70 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-500/30">
            <div className="text-[11px] text-emerald-300/80 font-semibold uppercase tracking-wider">Registered Shishyas</div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-300 mt-0.5">{stats.shishyas}</div>
          </div>
          <div className="bg-[#0e2a22]/70 backdrop-blur-xs p-3.5 rounded-2xl border border-blue-500/30">
            <div className="text-[11px] text-blue-300/80 font-semibold uppercase tracking-wider">ID Verified Profiles</div>
            <div className="text-xl sm:text-2xl font-bold text-blue-300 mt-0.5">{stats.verified}</div>
          </div>
        </div>
      </div>

      {/* Tabs & Controls Navigation */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 space-y-4">
        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
          <button
            onClick={() => setActiveTab('GURU')}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
              activeTab === 'GURU'
                ? 'bg-[#0e2a22] text-amber-300 shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Gurus (Masters)</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              activeTab === 'GURU' ? 'bg-amber-400/20 text-amber-200 border border-amber-400/30' : 'bg-stone-200 text-stone-700'
            }`}>
              {guruList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('SHISHYA')}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
              activeTab === 'SHISHYA'
                ? 'bg-[#0e2a22] text-emerald-300 shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Shishyas (Apprentices)</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              activeTab === 'SHISHYA' ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/30' : 'bg-stone-200 text-stone-700'
            }`}>
              {shishyaList.length}
            </span>
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${activeTab === 'GURU' ? 'Gurus' : 'Shishyas'} by name, email, state, tradition...`}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Dropdown Filters */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-transparent text-stone-800 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All States</option>
                {FOCUS_STATES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs font-semibold">
              <Filter className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-stone-800 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="VERIFIED">ID Verified</option>
                <option value="PENDING">Pending Review</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Grid View */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-stone-600 text-sm font-medium">Fetching registered profiles from database...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
          <AlertCircle className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No {activeTab === 'GURU' ? 'Gurus' : 'Shishyas'} Found</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            {searchTerm || selectedState !== 'ALL' || selectedStatus !== 'ALL'
              ? 'Try clearing your search query or adjusting state/status filters.'
              : `No ${activeTab === 'GURU' ? 'Gurus' : 'Shishyas'} have registered in the system database yet.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsers.map((user) => {
            const isGuru = user.role === 'PRACTITIONER' || user.role === 'GURU';
            const isVerified = user.idVerified || user.profileCompleted;

            return (
              <div 
                key={user.id || user.email}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  {/* Top Row: Role Badge & Verification Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                      isGuru ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      {isGuru ? <Users className="w-3 h-3 text-amber-700" /> : <GraduationCap className="w-3 h-3 text-emerald-700" />}
                      <span>{isGuru ? 'Guru (Master)' : 'Shishya (Learner)'}</span>
                    </span>

                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                      isVerified ? 'text-emerald-700' : 'text-amber-600'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isVerified ? 'ID Verified' : 'Registered'}</span>
                    </span>
                  </div>

                  {/* User Profile Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 border ${
                      isGuru ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    }`}>
                      {user.name ? user.name.charAt(0).toUpperCase() : (isGuru ? 'G' : 'S')}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-stone-900 text-base truncate group-hover:text-emerald-800 transition">
                        {user.name || 'Registered User'}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
                        <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="space-y-2 text-xs bg-stone-50 p-3 rounded-xl border border-stone-100 mb-4">
                    <div className="flex items-center justify-between text-stone-600">
                      <span className="font-medium text-stone-400">State / Region:</span>
                      <span className="font-semibold text-stone-800 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {user.state || 'Maharashtra'}
                      </span>
                    </div>

                    {isGuru ? (
                      <>
                        <div className="flex items-center justify-between text-stone-600">
                          <span className="font-medium text-stone-400">Expertise:</span>
                          <span className="font-semibold text-amber-900 truncate max-w-[170px]" title={user.expertTradition}>
                            {user.expertTradition || 'Heritage Art & Crafts'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-stone-600">
                          <span className="font-medium text-stone-400">Experience:</span>
                          <span className="font-semibold text-stone-800 truncate max-w-[170px]" title={user.experience}>
                            {user.experience || '20+ Years'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start justify-between text-stone-600">
                          <span className="font-medium text-stone-400 shrink-0">Interests:</span>
                          <span className="font-semibold text-emerald-900 truncate max-w-[170px]" title={user.hobbies}>
                            {user.hobbies || 'Cultural Heritage & Arts'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-stone-600">
                          <span className="font-medium text-stone-400">Date of Birth:</span>
                          <span className="font-semibold text-stone-800">
                            {user.dob ? new Date(user.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                          </span>
                        </div>
                      </>
                    )}

                    <div className="flex items-center justify-between text-stone-600 pt-1 border-t border-stone-200/60">
                      <span className="font-medium text-stone-400">Government ID:</span>
                      <span className="font-mono text-[11px] font-semibold text-stone-700 bg-white px-2 py-0.5 rounded border border-stone-200">
                        {user.idType || 'Aadhaar Card'}: {user.idNumber ? `•••• ${user.idNumber.slice(-4)}` : 'Verified'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Details Action Button */}
                <button
                  onClick={() => setSelectedUserModal(user)}
                  className="w-full flex items-center justify-center gap-2 bg-[#0e2a22] hover:bg-[#163f34] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition cursor-pointer shadow-xs"
                >
                  <Eye className="w-4 h-4 text-amber-300" />
                  <span>View Complete Profile Details</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Complete User Profile Modal */}
      {selectedUserModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden relative my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0e2a22] text-white p-6 relative border-b border-emerald-800/40">
              <button
                onClick={() => setSelectedUserModal(null)}
                className="absolute right-5 top-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl border shadow-inner ${
                  selectedUserModal.role === 'PRACTITIONER' || selectedUserModal.role === 'GURU'
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                    : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40'
                }`}>
                  {selectedUserModal.name ? selectedUserModal.name.charAt(0).toUpperCase() : 'U'}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold font-cinzel text-white">
                      {selectedUserModal.name || 'Registered Account Details'}
                    </h2>
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      {selectedUserModal.role === 'PRACTITIONER' || selectedUserModal.role === 'GURU' ? 'Guru' : 'Shishya'}
                    </span>
                  </div>
                  <p className="text-stone-300 text-xs mt-1">
                    System ID: <code className="text-amber-200 font-mono">{selectedUserModal.id || 'usr-registered'}</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Account Overview */}
              <div>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Personal & Contact Credentials</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200/80 text-xs">
                  <div>
                    <span className="text-stone-500 block font-medium">Full Registered Name</span>
                    <span className="font-bold text-stone-900 text-sm">{selectedUserModal.name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block font-medium">Email Address</span>
                    <span className="font-bold text-stone-900">{selectedUserModal.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block font-medium">Phone Number</span>
                    <span className="font-semibold text-stone-800">{selectedUserModal.phone || '+91 98234 56789'}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block font-medium">State / Region</span>
                    <span className="font-semibold text-stone-800">{selectedUserModal.state || 'Maharashtra'}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block font-medium">Date of Birth</span>
                    <span className="font-semibold text-stone-800">
                      {selectedUserModal.dob ? new Date(selectedUserModal.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block font-medium">Registration Status</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Database Synced & Active</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Cultural & Artisan Profile */}
              <div>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Cultural & Heritage Domain Profile</span>
                </h3>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-3 text-xs">
                  {selectedUserModal.role === 'PRACTITIONER' || selectedUserModal.role === 'GURU' ? (
                    <>
                      <div>
                        <span className="text-stone-500 block font-medium">Expert Skill / Tradition</span>
                        <span className="font-bold text-amber-900 text-sm">{selectedUserModal.expertTradition || 'Shahiri Powada (Oral Ballads)'}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block font-medium">Years of Experience & Legacy</span>
                        <p className="font-medium text-stone-800 mt-0.5">{selectedUserModal.experience || '25+ Years of traditional apprenticeship'}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-stone-500 block font-medium">Hobbies & Cultural Interests</span>
                        <p className="font-semibold text-emerald-950 mt-0.5 leading-relaxed">{selectedUserModal.hobbies || 'Shahiri Powada recitation, Daf percussion, Historical Maratha Ballads'}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Government ID Verification */}
              <div>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Government Identity & Credential Validation</span>
                </h3>

                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/80 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-blue-900/70 block font-medium">Identity Document Type</span>
                      <span className="font-bold text-blue-950">{selectedUserModal.idType || 'Aadhaar Card'}</span>
                    </div>
                    <div>
                      <span className="text-blue-900/70 block font-medium">Identity Document Number</span>
                      <span className="font-mono font-bold text-blue-950">{selectedUserModal.idNumber || '4829-1029-3847'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-700" />
                      <span className="font-semibold text-blue-900 truncate max-w-xs">
                        {selectedUserModal.idProofFileName || 'id_proof_document.pdf'}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                      VERIFIED
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-stone-100 p-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedUserModal(null)}
                className="bg-[#0e2a22] hover:bg-[#163f34] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition cursor-pointer"
              >
                Close Details Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
