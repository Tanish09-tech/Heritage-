import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  ChevronRight,
  Send
} from 'lucide-react';
import { MASTER_PRACTITIONERS } from '../data/heritageData';
import { api } from '../services/api';

export default function MasterMatchingView({ onSelectTradition, traditions }) {
  const [activeSubTab, setActiveSubTab] = useState('FIND_MASTERS'); // 'FIND_MASTERS' or 'MY_CONNECTIONS'
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedIds, setConnectedIds] = useState([]);
  const [selectedMasterModal, setSelectedMasterModal] = useState(null);

  const filteredMasters = MASTER_PRACTITIONERS.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.tradition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConnect = async (masterId) => {
    if (!connectedIds.includes(masterId)) {
      setConnectedIds(prev => [...prev, masterId]);
      const targetMaster = MASTER_PRACTITIONERS.find(m => m.id === masterId);
      try {
        await api.applyForMentorship({
          practitionerId: masterId,
          practitionerName: targetMaster?.name || 'Master Practitioner',
          tradition: targetMaster?.tradition || 'Living Tradition',
          learnerName: 'Aniket Deshmukh'
        });
      } catch (err) {
        console.warn('Mentorship application sync to backend failed:', err);
      }
      alert(`Apprenticeship connection request sent to ${targetMaster?.name || 'Master Practitioner'}!`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold font-sans text-stone-900">
          Master-Learner Matching
        </h1>

        {/* Sub-tabs matching Screen 11 */}
        <div className="flex bg-stone-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveSubTab('FIND_MASTERS')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'FIND_MASTERS'
                ? 'bg-[#133e31] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Find Masters
          </button>
          <button
            onClick={() => setActiveSubTab('MY_CONNECTIONS')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'MY_CONNECTIONS'
                ? 'bg-[#133e31] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            My Connections
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tradition or name..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition shadow-2xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
        </div>

        <button className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-2 shadow-2xs">
          <Filter className="w-3.5 h-3.5 text-stone-500" />
          <span>Filters</span>
        </button>
      </div>

      {/* Masters List matching Screen 11 */}
      <div className="space-y-4">
        {filteredMasters.map((master) => {
          const isConnected = connectedIds.includes(master.id);

          return (
            <div
              key={master.id}
              className="blueprint-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-emerald-300"
            >
              {/* Left Details */}
              <div className="flex items-center gap-4">
                <img
                  src={master.avatar}
                  alt={master.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-600/20 shadow-xs"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-stone-900">
                      {master.name}
                    </h3>
                  </div>

                  <div className="text-xs text-stone-600">
                    <span className="font-semibold text-stone-800">{master.tradition}</span>
                    <span className="text-stone-400 mx-1.5">•</span>
                    <span>{master.experience}</span>
                    <span className="text-stone-400 mx-1.5">•</span>
                    <span>{master.location.split(',')[0]}</span>
                  </div>

                  {/* Match Pill */}
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md mt-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Match {master.matchPercent}</span>
                  </div>
                </div>
              </div>

              {/* Right Action */}
              <div className="flex items-center gap-2.5 self-end sm:self-center">
                <button
                  onClick={() => setSelectedMasterModal(master)}
                  className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold transition"
                >
                  View Profile
                </button>

                <button
                  onClick={() => handleConnect(master.id)}
                  disabled={isConnected}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isConnected
                      ? 'bg-stone-100 text-emerald-800 border border-emerald-200 cursor-default'
                      : 'bg-[#133e31] hover:bg-[#0e2d23] text-white shadow-xs'
                  }`}
                >
                  {isConnected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Connect</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Master Profile Modal */}
      {selectedMasterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
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

            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="bg-emerald-50 text-emerald-900 p-2.5 rounded-xl border border-emerald-200">
                <span className="font-bold">Match Score: {selectedMasterModal.matchPercent}</span>
              </div>
              <div className="bg-stone-50 text-stone-700 p-2.5 rounded-xl border border-stone-200">
                <span className="font-bold">Mode: Offline & Hybrid</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  handleConnect(selectedMasterModal.id);
                  setSelectedMasterModal(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#133e31] hover:bg-[#0e2d23] text-white text-xs font-bold transition shadow-xs"
              >
                Send Apprenticeship Request
              </button>
              <button
                onClick={() => setSelectedMasterModal(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
