import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Award, 
  Sparkles, 
  Check, 
  X 
} from 'lucide-react';
import { CURRENT_PRACTITIONER } from '../data/heritageData';

export default function PractitionerDashboardView({ currentUser }) {
  const initialPractitioner = {
    ...CURRENT_PRACTITIONER,
    name: currentUser?.name || CURRENT_PRACTITIONER.name,
    location: currentUser?.state ? `${currentUser.state}, India` : CURRENT_PRACTITIONER.location,
    tradition: currentUser?.expertTradition || CURRENT_PRACTITIONER.tradition,
    experience: currentUser?.experience ? `${currentUser.experience}` : CURRENT_PRACTITIONER.experience,
    dob: currentUser?.dob || '1968-08-20'
  };

  const [practitioner, setPractitioner] = useState(initialPractitioner);
  const [requests, setRequests] = useState(CURRENT_PRACTITIONER.learnerRequests);

  const handleAccept = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'ACCEPTED' } : r));
    setPractitioner(prev => ({
      ...prev,
      learnersConnected: prev.learnersConnected + 1
    }));
  };

  const handleReject = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* Top 2 Cards: My Profile & My Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Card 1: My Profile */}
        <div className="lg:col-span-6 blueprint-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-4">
              My Profile
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
              4 Active Apprentices
            </span>
          </div>
        </div>

        {/* Card 2: My Activities */}
        <div className="lg:col-span-6 blueprint-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-4">
              My Activities
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

      {/* Bottom Section: Recent Learner Requests */}
      <div className="blueprint-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-stone-900">
            Recent Learner Requests
          </h3>
          <span className="text-xs text-stone-500 font-medium">
            {requests.filter(r => r.status === 'PENDING').length} Pending
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {requests.map((req) => (
            <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Learner Info */}
              <div className="flex items-center gap-3">
                <img
                  src={req.avatar}
                  alt={req.name}
                  className="w-11 h-11 rounded-xl object-cover border border-stone-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    {req.name}
                  </h4>
                  <div className="text-[11px] text-stone-500">
                    {req.location} • <span className="text-stone-400">Requested on {req.requestedDate}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {req.status === 'ACCEPTED' ? (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accepted • Connected</span>
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => handleAccept(req.id)}
                      className="px-4 py-1.5 rounded-lg bg-[#133e31] hover:bg-[#0e2d23] text-white text-xs font-bold transition shadow-xs"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="px-4 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
