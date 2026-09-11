import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  ChevronRight,
  ChevronLeft,
  Send,
  Clock,
  Lock,
  X,
  UserPlus,
  Calendar,
  Award,
  Globe,
  Check
} from 'lucide-react';
import { MASTER_PRACTITIONERS } from '../data/heritageData';
import { api } from '../services/api';
import ChatModal from './ChatModal';

export default function MasterMatchingView({ onSelectTradition, traditions, currentUser, onBack }) {
  const [activeSubTab, setActiveSubTab] = useState('FIND_MASTERS'); // 'FIND_MASTERS' or 'MY_CONNECTIONS'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');
  const [selectedMasterModal, setSelectedMasterModal] = useState(null);
  
  // Request Modal State
  const [requestModalMaster, setRequestModalMaster] = useState(null);
  const [requestNote, setRequestNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Applications & Connections State
  const [applications, setApplications] = useState([]);
  const [activeChatApp, setActiveChatApp] = useState(null);

  const learnerName = currentUser?.name || 'Aniket Deshmukh';
  const isPractitioner = currentUser?.role === 'PRACTITIONER';

  useEffect(() => {
    fetchApplications();
  }, [learnerName, isPractitioner]);

  const fetchApplications = async () => {
    try {
      const query = isPractitioner ? { practitionerId: currentUser?.name } : { learnerId: learnerName };
      const apps = await api.getApplications(query);
      // Fallback: get all applications if filtered count is empty for demo/testing
      if (!apps || apps.length === 0) {
        const allApps = await api.getApplications();
        setApplications(allApps || []);
      } else {
        setApplications(apps);
      }
    } catch (err) {
      console.warn('Failed to fetch applications:', err);
    }
  };

  const statesList = ['ALL', 'Maharashtra', 'Kerala', 'Gujarat', 'Punjab', 'Assam', 'Delhi', 'Madhya Pradesh'];

  const filteredMasters = MASTER_PRACTITIONERS.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tradition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedStateFilter === 'ALL' || m.location.toLowerCase().includes(selectedStateFilter.toLowerCase()) || (m.state && m.state.toLowerCase() === selectedStateFilter.toLowerCase());
    return matchesSearch && matchesState;
  });

  const handleOpenRequestModal = (master) => {
    setRequestModalMaster(master);
    setRequestNote(`Respected ${master.name} ji, I am eager to learn ${master.tradition} under your guidance.`);
  };

  const handleSendRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestModalMaster || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newApp = await api.applyForMentorship({
        learnerId: currentUser?.id || `user-shishya-01`,
        learnerName: learnerName,
        practitionerId: requestModalMaster.id,
        practitionerName: requestModalMaster.name,
        tradition: requestModalMaster.tradition,
        note: requestNote
      });

      setApplications(prev => [newApp, ...prev]);
      setRequestModalMaster(null);
      alert(`Apprenticeship request and initial message successfully sent to ${requestModalMaster.name}!`);
      setActiveSubTab('MY_CONNECTIONS');
    } catch (err) {
      console.error('Failed to submit mentorship application:', err);
      alert('Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuruApproveApprentice = async (appId) => {
    try {
      await api.respondToLearnerRequest(appId, 'ACCEPTED');
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'ACCEPTED' } : a));
      alert('Apprentice successfully added! You can now chat and schedule Gurukul sessions.');
    } catch (err) {
      console.error('Failed to approve apprentice:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <h1 className="text-2xl font-bold font-sans text-stone-900 flex items-center gap-2">
              <span>Guru-Shishya Matchmaker System</span>
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                Real-Time Mentorship
              </span>
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Connect directly with verified master practitioners across India's living heritage traditions
            </p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex bg-stone-100 p-1 rounded-xl w-fit shrink-0">
          <button
            onClick={() => setActiveSubTab('FIND_MASTERS')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'FIND_MASTERS'
                ? 'bg-[#133e31] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Find & Match Gurus ({MASTER_PRACTITIONERS.length})
          </button>
          <button
            onClick={() => setActiveSubTab('MY_CONNECTIONS')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'MY_CONNECTIONS'
                ? 'bg-[#133e31] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>{isPractitioner ? 'Incoming Requests' : 'My Connections'}</span>
            {applications.length > 0 && (
              <span className="bg-amber-400 text-stone-950 px-1.5 py-0.2 rounded-full text-[10px] font-black">
                {applications.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* FIND MASTERS TAB */}
      {activeSubTab === 'FIND_MASTERS' && (
        <div className="space-y-4">
          
          {/* Search & State Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by master name, tradition, or state..."
                className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition shadow-2xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>

            {/* State Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-xs text-stone-500 font-semibold flex items-center gap-1 shrink-0">
                <Globe className="w-3.5 h-3.5 text-emerald-800" /> State:
              </span>
              {statesList.map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedStateFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition shrink-0 ${
                    selectedStateFilter === st
                      ? 'bg-[#133e31] text-white shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Masters List Grid */}
          <div className="space-y-4">
            {filteredMasters.map((master) => {
              const existingApp = applications.find(a => a.practitionerId === master.id || a.practitionerName === master.name);
              const isAccepted = existingApp?.status === 'ACCEPTED';
              const isPending = existingApp?.status === 'PENDING';

              return (
                <div
                  key={master.id}
                  className="blueprint-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-emerald-300 shadow-xs"
                >
                  {/* Left Details */}
                  <div className="flex items-center gap-4">
                    <img
                      src={master.avatar}
                      alt={master.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-600/20 shadow-xs shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-stone-900">
                          {master.name}
                        </h3>
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Master
                        </span>
                      </div>

                      <div className="text-xs text-stone-600">
                        <span className="font-semibold text-stone-800">{master.tradition}</span>
                        <span className="text-stone-400 mx-1.5">•</span>
                        <span>{master.experience}</span>
                        <span className="text-stone-400 mx-1.5">•</span>
                        <span>{master.location}</span>
                      </div>

                      {/* Match Pill & Reason */}
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>AI Compatibility: {master.matchPercent}</span>
                        </div>
                        <span className="text-[11px] text-stone-500 font-medium italic">
                          District proximity & weekend availability match
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex items-center gap-2.5 self-end sm:self-center">
                    <button
                      onClick={() => setSelectedMasterModal(master)}
                      className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold transition cursor-pointer"
                    >
                      View Match Details
                    </button>

                    {isAccepted ? (
                      <button
                        onClick={() => setActiveChatApp(existingApp)}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat & Sessions</span>
                      </button>
                    ) : isPending ? (
                      <button
                        onClick={() => setActiveSubTab('MY_CONNECTIONS')}
                        className="px-4 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pending Approval</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenRequestModal(master)}
                        className="px-4 py-2 rounded-xl bg-[#133e31] hover:bg-[#0e2d23] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Request & Message</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MY CONNECTIONS TAB */}
      {activeSubTab === 'MY_CONNECTIONS' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-stone-900">
                {isPractitioner ? 'Incoming Apprentice Requests' : 'My Guru Connections & Applications'}
              </h3>
              <p className="text-xs text-stone-500">
                {isPractitioner ? 'Approve requests to add apprentices, unlock chat & schedule sessions' : 'Track your mentorship requests and chat with your connected Gurus'}
              </p>
            </div>
            <span className="text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
              {applications.length} {isPractitioner ? 'Incoming Requests' : 'Connections Total'}
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="blueprint-card p-12 text-center text-stone-500 space-y-3">
              <Users className="w-10 h-10 mx-auto text-stone-300" />
              <h4 className="font-bold text-sm text-stone-800">No active connection requests yet</h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Explore available master practitioners under "Find & Match Gurus" to choose a Guru and send your apprenticeship request!
              </p>
              <button
                onClick={() => setActiveSubTab('FIND_MASTERS')}
                className="mt-2 px-5 py-2 rounded-xl bg-[#133e31] text-white font-bold text-xs hover:bg-[#0e2d23] transition shadow-xs"
              >
                Find & Match Gurus Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const isAccepted = app.status === 'ACCEPTED';
                const isRejected = app.status === 'REJECTED';
                const isPending = !isAccepted && !isRejected;

                return (
                  <div
                    key={app.id}
                    className="blueprint-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#2e3e55] text-amber-300 font-bold flex items-center justify-center text-xs">
                          {app.practitionerName ? app.practitionerName.slice(0, 2).toUpperCase() : 'GU'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-stone-900">{app.practitionerName}</h4>
                            <span className="text-[11px] text-stone-400 font-semibold">↔ Learner: {app.learnerName}</span>
                          </div>
                          <p className="text-xs text-stone-500">{app.tradition} • Submitted on {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Today'}</p>
                        </div>
                      </div>

                      {/* Request Message Note */}
                      {app.note && (
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 text-xs text-stone-700 space-y-0.5">
                          <span className="font-bold text-stone-900 block text-[11px] uppercase tracking-wide">
                            Request Note / Message:
                          </span>
                          <p className="italic">"{app.note}"</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-center">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${
                        isAccepted 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : isRejected 
                          ? 'bg-red-50 text-red-800 border-red-200' 
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {isAccepted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Accepted Apprentice</span>
                          </>
                        ) : isRejected ? (
                          <>
                            <X className="w-3.5 h-3.5 text-red-600" />
                            <span>Declined</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pending Guru Approval</span>
                          </>
                        )}
                      </span>

                      {/* Guru Access: Approve / Add Apprentice Button (ONLY visible to Guru) */}
                      {isPending && isPractitioner && (
                        <button
                          onClick={() => handleGuruApproveApprentice(app.id)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Accept & Add Apprentice</span>
                        </button>
                      )}

                      <button
                        onClick={() => setActiveChatApp(app)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isAccepted
                            ? 'bg-[#133e31] hover:bg-[#0e2d23] text-white'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{isAccepted ? 'Chat & Sessions' : 'View Message Status'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: Choose Guru & Send Request + Message Box Modal */}
      {requestModalMaster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <form onSubmit={handleSendRequestSubmit} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 space-y-4 text-stone-800">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Send Apprenticeship Request & Message
                </h3>
                <p className="text-xs text-stone-500">
                  To {requestModalMaster.name} • {requestModalMaster.tradition}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRequestModalMaster(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
              <img
                src={requestModalMaster.avatar}
                alt={requestModalMaster.name}
                className="w-14 h-14 rounded-xl object-cover border border-emerald-300"
              />
              <div>
                <h4 className="font-bold text-xs text-emerald-950">{requestModalMaster.name}</h4>
                <p className="text-[11px] text-emerald-800">{requestModalMaster.experience} • {requestModalMaster.location}</p>
                <span className="inline-block text-[10px] font-bold bg-white text-emerald-900 px-2 py-0.5 rounded border border-emerald-300 mt-1">
                  AI Match Score: {requestModalMaster.matchPercent}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800">
                Personal Message to Guru:
              </label>
              <textarea
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                rows={4}
                required
                placeholder="Introduce yourself, your background, and why you wish to learn this tradition..."
                className="w-full text-xs p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
              />
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-[11px] text-stone-500 flex items-start gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Once sent, your request will be queued for approval by {requestModalMaster.name}. Messaging and Gurukul sessions unlock immediately upon approval.
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#133e31] hover:bg-[#0e2d23] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Send Request & Message'}</span>
              </button>
              <button
                type="button"
                onClick={() => setRequestModalMaster(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: Master Profile & Match Breakdown Modal */}
      {selectedMasterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 space-y-4 text-stone-800">
            <div className="flex items-start gap-4">
              <img
                src={selectedMasterModal.avatar}
                alt={selectedMasterModal.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-600/30"
              />
              <div>
                <h3 className="text-base font-bold text-stone-900">{selectedMasterModal.name}</h3>
                <div className="text-xs text-stone-600">{selectedMasterModal.tradition} • {selectedMasterModal.experience}</div>
                <div className="text-xs text-stone-500 mt-1">{selectedMasterModal.location}</div>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200/60">
              {selectedMasterModal.bio}
            </p>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-stone-800 uppercase text-[10px] block">AI Match Score Breakdown:</span>
              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-emerald-950">
                  <span>Compatibility Score</span>
                  <span>{selectedMasterModal.matchPercent} Match</span>
                </div>
                <ul className="space-y-1 text-[11px] text-emerald-900">
                  <li className="flex items-center gap-1.5">✓ Tradition interest alignment in {selectedMasterModal.tradition}</li>
                  <li className="flex items-center gap-1.5">✓ Proximity & regional language match ({selectedMasterModal.location})</li>
                  <li className="flex items-center gap-1.5">✓ Active learner capacity available</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  const m = selectedMasterModal;
                  setSelectedMasterModal(null);
                  handleOpenRequestModal(m);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#133e31] hover:bg-[#0e2d23] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Request & Message</span>
              </button>
              <button
                onClick={() => setSelectedMasterModal(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Chat & Gurukul Sessions Modal */}
      {activeChatApp && (
        <ChatModal
          application={activeChatApp}
          currentUser={currentUser}
          onClose={() => setActiveChatApp(null)}
          onStatusChange={(id, newStatus) => {
            setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
          }}
        />
      )}

    </div>
  );
}

