import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Award, 
  Sparkles, 
  Check, 
  X,
  MessageSquare,
  Clock
} from 'lucide-react';
import { CURRENT_PRACTITIONER } from '../data/heritageData';
import { api } from '../services/api';
import ChatModal from './ChatModal';

export default function PractitionerDashboardView({ currentUser }) {
  const initialPractitioner = {
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    documentationFiles: 18,
    learnersConnected: 4,
    sessionsConducted: 32,
    profileCompletion: 92,
    ...CURRENT_PRACTITIONER,
    name: currentUser?.name || CURRENT_PRACTITIONER?.name || 'Shahir Tukaram Jagtap',
    location: currentUser?.state ? `${currentUser.state}, India` : (CURRENT_PRACTITIONER?.location || 'Pune, Maharashtra'),
    tradition: currentUser?.expertTradition || CURRENT_PRACTITIONER?.tradition || 'Shahiri Powada Balladry',
    experience: currentUser?.experience ? `${currentUser.experience}` : (CURRENT_PRACTITIONER?.experience || '35+ Years'),
    dob: currentUser?.dob || '1968-08-20'
  };

  const [practitioner, setPractitioner] = useState(initialPractitioner);
  const [requests, setRequests] = useState([]);
  const [activeChatApp, setActiveChatApp] = useState(null);

  useEffect(() => {
    fetchLearnerRequests();
  }, [practitioner.name]);

  const fetchLearnerRequests = async () => {
    try {
      const apps = await api.getApplications({ practitionerId: practitioner.name });
      if (apps.length > 0) {
        setRequests(apps);
      } else {
        // Fallback demo request
        setRequests([
          {
            id: 'app-demo-01',
            learnerId: 'user-shishya-01',
            learnerName: 'Aniket Deshmukh',
            practitionerName: practitioner.name,
            tradition: practitioner.tradition,
            note: 'Respected Guru ji, I wish to learn the traditional rhythms and ballads of Shahiri Powada.',
            status: 'PENDING',
            submittedAt: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.warn('Failed to fetch practitioner requests:', err);
    }
  };

  const handleAccept = async (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'ACCEPTED' } : r));
    setPractitioner(prev => ({
      ...prev,
      learnersConnected: prev.learnersConnected + 1
    }));
    try {
      await api.respondToLearnerRequest(id, 'ACCEPTED');
    } catch (err) {
      console.warn('Backend sync for apprentice accept failed:', err);
    }
  };

  const handleReject = async (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
    try {
      await api.respondToLearnerRequest(id, 'REJECTED');
    } catch (err) {
      console.warn('Backend sync for apprentice reject failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top 2 Cards: My Profile & My Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Card 1: My Profile */}
        <div className="lg:col-span-6 blueprint-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-4">
              Guru Profile Overview
            </h3>

            <div className="flex items-start gap-4">
              <img
                src={practitioner.avatar}
                alt={practitioner.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-600/30 shadow-xs"
              />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-stone-900">
                  {practitioner.name}
                </h4>
                
                <div className="text-xs text-stone-600 space-y-1">
                  <div><span className="font-semibold text-stone-700">Expertise:</span> {practitioner.tradition}</div>
                  <div><span className="font-semibold text-stone-700">Experience:</span> {practitioner.experience}</div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-stone-500">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{practitioner.location}</span>
                    </div>
                    {practitioner.dob && (
                      <span className="text-[11px] text-stone-500 font-medium bg-stone-100 px-2 py-0.5 rounded">
                        DOB: {practitioner.dob}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              Verified Master Practitioner
            </span>
            <span className="text-xs text-stone-500 font-medium">
              {practitioner.learnersConnected} Active Apprentices
            </span>
          </div>
        </div>

        {/* Card 2: My Activities */}
        <div className="lg:col-span-6 blueprint-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-4">
              My Activities & Apprenticeships
            </h3>

            {/* Profile Completion Bar */}
            <div className="space-y-1.5 mb-5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-700">Profile Completion</span>
                <span className="font-bold text-emerald-800">{practitioner.profileCompletion}%</span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-700 rounded-full transition-all duration-500" 
                  style={{ width: `${practitioner.profileCompletion}%` }}
                />
              </div>
            </div>

            {/* 3 Activity Stats */}
            <div className="grid grid-cols-3 gap-3 text-center">
              
              <div className="bg-stone-50 border border-stone-100 p-3 rounded-xl">
                <div className="text-[11px] text-stone-500 font-medium">Documentation</div>
                <div className="text-lg font-extrabold text-stone-900 mt-0.5">
                  {practitioner.documentationFiles} Files
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-100 p-3 rounded-xl">
                <div className="text-[11px] text-stone-500 font-medium">Learners Connected</div>
                <div className="text-lg font-extrabold text-stone-900 mt-0.5">
                  {practitioner.learnersConnected}
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-100 p-3 rounded-xl">
                <div className="text-[11px] text-stone-500 font-medium">Sessions Conducted</div>
                <div className="text-lg font-extrabold text-stone-900 mt-0.5">
                  {practitioner.sessionsConducted}
                </div>
              </div>

            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-right">
            <span className="text-[11px] text-stone-500">
              Last active today • Next session scheduled for Sunday
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Section: Apprentice Requests & Chat */}
      <div className="blueprint-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Incoming Apprentice Requests & Chat
            </h3>
            <p className="text-xs text-stone-500">
              Review Shishya applications, inspect initial request messages, approve apprenticeship, and chat
            </p>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {requests.filter(r => r.status === 'PENDING').length} Pending Requests
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {requests.map((req) => {
            const isAccepted = req.status === 'ACCEPTED';
            const isRejected = req.status === 'REJECTED';
            const isPending = !isAccepted && !isRejected;

            return (
              <div key={req.id} className="py-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Learner Info */}
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#2e3e55] text-amber-300 font-bold flex items-center justify-center text-xs shrink-0">
                      {req.learnerName ? req.learnerName.slice(0, 2).toUpperCase() : 'SH'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-stone-900">
                          {req.learnerName}
                        </h4>
                        <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded font-medium">
                          Shishya Applicant
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Tradition: <strong>{req.tradition}</strong> • Requested on {req.submittedAt ? new Date(req.submittedAt).toLocaleDateString() : 'Today'}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 self-end sm:self-center">
                    {isAccepted ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Approved Apprentice</span>
                        </span>
                        <button
                          onClick={() => setActiveChatApp(req)}
                          className="px-4 py-1.5 rounded-lg bg-[#133e31] hover:bg-[#0e2d23] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat with Shishya</span>
                        </button>
                      </div>
                    ) : isRejected ? (
                      <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                        Declined Request
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAccept(req.id)}
                          className="px-4 py-1.5 rounded-lg bg-[#133e31] hover:bg-[#0e2d23] text-white text-xs font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Accept</span>
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="px-4 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>

                </div>

                {/* Shishya's Initial Message Note */}
                {req.note && (
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 text-xs text-stone-700 ml-14">
                    <span className="font-bold text-stone-900 block text-[10px] uppercase tracking-wider text-stone-500 mb-0.5">
                      Shishya's Request Message:
                    </span>
                    <p className="italic text-stone-800">"{req.note}"</p>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Modal */}
      {activeChatApp && (
        <ChatModal
          application={activeChatApp}
          currentUser={currentUser}
          onClose={() => setActiveChatApp(null)}
          onStatusChange={(id, newStatus) => {
            setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
          }}
        />
      )}

    </div>
  );
}
