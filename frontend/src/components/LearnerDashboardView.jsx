import React from 'react';
import { 
  GraduationCap, 
  MapPin, 
  Award, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  Users 
} from 'lucide-react';
import { CURRENT_LEARNER } from '../data/heritageData';
import { getTraditionImage, getCategoryFallback } from '../utils/imageResolver';

export default function LearnerDashboardView({ onNavigateToMatching, onSelectTradition, traditions, currentUser }) {
  const learner = {
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    learningJourney: {
      requestsSent: 3,
      connections: 2,
      sessionsAttended: 14,
      badgesEarned: 5
    },
    recommendations: [
      {
        id: 'rec-1',
        tradition: 'Shahiri Powada',
        masterName: 'Shahir Tukaram Jagtap',
        matchPercent: '95%',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'rec-2',
        tradition: 'Koodiyattam',
        masterName: 'Margi Madhu Chakyar',
        matchPercent: '88%',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80'
      }
    ],
    ...CURRENT_LEARNER,
    name: currentUser?.name || CURRENT_LEARNER?.name || 'Aniket Deshmukh',
    location: currentUser?.state ? `${currentUser.state}, India` : (CURRENT_LEARNER?.state ? `${CURRENT_LEARNER.state}, India` : 'Pune, Maharashtra'),
    interests: Array.isArray(currentUser?.hobbies) ? currentUser.hobbies.join(', ') : (currentUser?.hobbies || (Array.isArray(CURRENT_LEARNER?.interests) ? CURRENT_LEARNER.interests.join(', ') : 'Shahiri Powada, Warli Art')),
    dob: currentUser?.dob || '2002-05-15',
    hobbies: Array.isArray(currentUser?.hobbies) ? currentUser.hobbies.join(', ') : (currentUser?.hobbies || (Array.isArray(CURRENT_LEARNER?.interests) ? CURRENT_LEARNER.interests.join(', ') : 'Shahiri Powada, Warli Art'))
  };

  const learningJourney = learner.learningJourney || {
    requestsSent: 3,
    connections: 2,
    sessionsAttended: 14,
    badgesEarned: 5
  };

  const recommendations = learner.recommendations || [];

  return (
    <div className="space-y-6">
      
      {/* Top 2 Cards: My Profile & My Learning Journey */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Card 1: My Profile */}
        <div className="lg:col-span-6 blueprint-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-4">
              My Profile
            </h3>

            <div className="flex items-start gap-4">
              <img
                src={learner.avatar}
                alt={learner.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-600/30 shadow-xs"
              />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-stone-900">
                  {learner.name}
                </h4>
                
                <div className="text-xs text-stone-600 space-y-1">
                  <div><span className="font-semibold text-stone-700">Hobbies:</span> {learner.interests}</div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-stone-500">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{learner.location}</span>
                    </div>
                    {learner.dob && (
                      <span className="text-[11px] text-stone-500 font-medium bg-stone-100 px-2 py-0.5 rounded">
                        DOB: {learner.dob}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              Enrolled Apprentice
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Active Since April 2026
            </span>
          </div>
        </div>

        {/* Card 2: My Learning Journey */}
        <div className="lg:col-span-6 blueprint-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-4">
              My Learning Journey
            </h3>

            {/* 4 Stats Grid matching Screen 10 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              
              <div className="bg-stone-50 border border-stone-100 p-3 rounded-xl">
                <div className="text-[11px] text-stone-500 font-medium">Requests Sent</div>
                <div className="text-xl font-extrabold text-stone-900 mt-1">
                  {learningJourney?.requestsSent ?? 3}
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-100 p-3 rounded-xl">
                <div className="text-[11px] text-stone-500 font-medium">Connections</div>
                <div className="text-xl font-extrabold text-stone-900 mt-1">
                  {learningJourney?.connections ?? 2}
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-100 p-3 rounded-xl">
                <div className="text-[11px] text-stone-500 font-medium">Sessions Attended</div>
                <div className="text-xl font-extrabold text-stone-900 mt-1">
                  {learningJourney?.sessionsAttended ?? 14}
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-100 p-3 rounded-xl">
                <div className="text-[11px] text-stone-500 font-medium">Badges Earned</div>
                <div className="text-xl font-extrabold text-stone-900 mt-1">
                  {learningJourney?.badgesEarned ?? 5}
                </div>
              </div>

            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500">Next Live Gurukul Class: Saturday 10:00 AM</span>
            <button
              onClick={onNavigateToMatching}
              className="text-emerald-800 font-bold hover:underline"
            >
              Explore Masters →
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Section: Recommended For You */}
      <div className="blueprint-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-stone-900">
            Recommended For You
          </h3>
          <button
            onClick={onNavigateToMatching}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>View all matches</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="border border-stone-200/80 rounded-2xl p-4 hover:border-emerald-300 hover:bg-stone-50/50 transition flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={getTraditionImage({ name: rec.tradition, image: rec.image })}
                  alt={rec.tradition}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getCategoryFallback('Music');
                  }}
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    {rec.tradition}
                  </h4>
                  <div className="text-[11px] text-stone-600">
                    {rec.masterName}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                    Match: {rec.matchPercent}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  const trad = traditions.find(t => t.name.toLowerCase().includes(rec.tradition.toLowerCase())) || traditions[0];
                  onSelectTradition(trad);
                }}
                className="px-4 py-1.5 rounded-lg border border-stone-300 hover:bg-white text-stone-800 text-xs font-semibold transition shadow-2xs"
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
