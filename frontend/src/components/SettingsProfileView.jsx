import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Globe2, 
  Bell, 
  Key, 
  Building2, 
  Edit3, 
  LogOut,
  Flame,
  BadgeCheck
} from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

export default function SettingsProfileView({ currentRole, currentUser, onLogout }) {
  const { language, changeLanguage, t, languages } = useLanguage();
  const [activeTab, setActiveTab] = useState('PROFILE'); // 'PROFILE' | 'PREFERENCES' | 'SECURITY'
  const [alertPref, setAlertPref] = useState(true);
  const [smsPref, setSmsPref] = useState(true);

  // 1. Shishya (Learner) Complete Information
  const shishyaProfile = {
    name: currentUser?.name || 'Aniket Deshmukh',
    sanskritTitle: 'शिष्य • Apprentice Practitioner',
    avatar: '/images/powada.jpg',
    id: 'SHI-2026-MH-084',
    email: currentUser?.email || 'shishya.aniket@gmail.com',
    phone: '+91 98234 56789',
    location: currentUser?.state ? `${currentUser.state}, India` : 'Pune, Maharashtra',
    state: currentUser?.state || 'Maharashtra',
    dob: currentUser?.dob || '2002-05-15',
    hobbies: currentUser?.hobbies || 'Shahiri Ballads, Folk Chorus, Daf Percussion',
    age: currentUser?.dob ? `${Math.max(16, new Date().getFullYear() - new Date(currentUser.dob).getFullYear())} Years` : '22 Years',
    education: 'B.A. Cultural Heritage Studies (SPPU Pune)',
    languages: 'Marathi (Native), Hindi, English, Basic Sanskrit',
    enrollmentDate: '14 April 2026',
    status: 'Active Gurukula Apprentice',
    verification: 'DigiLocker Cultural ID: DL-APPR-9923 (Verified)',
    stipend: 'Ministry of Culture Living Heritage Stipend: Active (₹4,500 / month)',
    assignedGuru: {
      name: 'Shahir Tukaram Jagtap',
      tradition: 'Shahiri Powada',
      experience: '25+ Years Parampara',
      location: 'Pune & Satara'
    },
    traditions: {
      primary: 'Shahiri Powada (Historical Oral Ballads & Daf Percussion)',
      secondary: 'Warli Indigenous Tribal Art & Dhangari Gaja Rhythm'
    },
    metrics: {
      sessionsAttended: '6 Sessions (18 Hours Oral Instruction)',
      balladsMastered: '3 Historical Ballads (Afzal Khan Vadh, Sinhagad Gatha, Tanaji Shaurya)',
      badges: [
        'Daf Percussion Rhythm Level 1',
        'Historical Ballad Recitation Certificate',
        'Folk Chorus Voice Mastery'
      ],
      requestsSent: 5,
      gurusConnected: 2,
      attendanceRate: '94%'
    },
    schedule: {
      nextSession: 'Saturday, 10:00 AM (Gurukula Residency - Pune Kendra)',
      nextExam: 'Quarterly Oral Assessment - 28 Sept 2026'
    }
  };

  // 2. Guru (Practitioner) Complete Information
  const guruProfile = {
    name: currentUser?.name || 'Shahir Tukaram Jagtap',
    sanskritTitle: 'गुरु • Master Practitioner & Custodian',
    avatar: '/images/powada.jpg',
    id: 'GURU-2026-MH-007',
    email: currentUser?.email || 'guru.tukaram@gmail.com',
    phone: '+91 94220 12345',
    location: currentUser?.state ? `${currentUser.state}, India` : 'Satara & Pune, Maharashtra',
    state: currentUser?.state || 'Maharashtra',
    dob: currentUser?.dob || '1968-08-20',
    age: currentUser?.dob ? `${Math.max(25, new Date().getFullYear() - new Date(currentUser.dob).getFullYear())} Years` : '62 Years',
    experience: currentUser?.experience || '25+ Years of Continuous Living Tradition Parampara',
    lineage: 'Satara Shahiri Akhada (4th Generation Balladeer Lineage)',
    tradition: currentUser?.expertTradition || 'Shahiri Powada (Maharashtra Ballad & Heroic Oral Tradition)',
    instruments: 'Daf, Tuntuna, Dimdi, Manjira Percussion',
    status: 'Accredited Living Master (Grade A)',
    verification: 'Ministry of Culture Living Master Certificate: MC-GURU-2026-8812',
    fellowship: 'National Guru-Shishya Parampara Fellowship: Active (₹18,000 / month)',
    metrics: {
      profileCompletion: '90%',
      documentationFiles: '12 HD Master Recitations Uploaded to Knowledge Vault',
      connectedLearners: 4,
      pendingRequests: 2,
      sessionsConducted: '8 Masterclasses (32 Total Training Hours)'
    },
    activeApprentices: [
      { name: 'Aniket Deshmukh', city: 'Pune', progress: 'Advanced Ballad Phase' },
      { name: 'Omkar Patil', city: 'Pune', progress: 'Daf Rhythm Training' },
      { name: 'Rohit Deshmukh', city: 'Satara', progress: 'Vocal Projection Phase' },
      { name: 'Devaki Nambiar', city: 'Palakkad', progress: 'Comparative Dialect Study' }
    ],
    honors: [
      'Maharashtra State Cultural Krantiveer Puraskar (2021)',
      'Sangeet Natak Akademi Living Heritage Citation (2018)',
      'Zilla Parishad Folk Icon Honor (2024)'
    ],
    bio: 'Shahir Tukaram Jagtap has spent over four decades preserving and propagating the fiery ballads of Maharashtra. Born into a family of traditional Shahirs in Satara, he has trained more than 60 performers and remains one of the few masters capable of reciting rare 17th-century historical narratives with traditional Daf and Tuntuna rhythms.'
  };

  // 3. Admin Complete Information
  const adminProfile = {
    name: 'Dr. Rajesh Sharma',
    designation: 'Director of Living Heritage, Ministry of Culture',
    id: 'ADM-GOV-2026-001',
    email: 'admin.sanskriti@gov.in',
    phone: '+91 11 2338 5412',
    location: 'New Delhi (National Registry Headquarters)',
    clearance: 'Level-4 National Cultural Administrator',
    jurisdiction: 'Pan-India 32 Pilot Living Traditions',
    systemStatus: '14 Regional State Nodes Connected',
    encryption: 'Gov-NIC 256-Bit Cryptographic Vault Active'
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Profile Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        
        {/* Top Decorative Border */}
        <div className={`absolute top-0 left-0 right-0 h-2 ${
          currentRole === 'LEARNER' 
            ? 'bg-gradient-to-r from-emerald-600 to-teal-700' 
            : currentRole === 'PRACTITIONER'
            ? 'bg-gradient-to-r from-amber-600 to-orange-700'
            : 'bg-gradient-to-r from-indigo-600 to-blue-700'
        }`} />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-2">
          
          {/* Avatar & Main Identity */}
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={currentRole === 'LEARNER' ? shishyaProfile.avatar : currentRole === 'PRACTITIONER' ? guruProfile.avatar : '/images/dhangari.jpg'}
                alt="Profile"
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-stone-100 shadow-md"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
                  {currentRole === 'LEARNER' ? shishyaProfile.name : currentRole === 'PRACTITIONER' ? guruProfile.name : adminProfile.name}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  currentRole === 'LEARNER' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                    : currentRole === 'PRACTITIONER'
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-indigo-50 text-indigo-900 border-indigo-300'
                }`}>
                  {currentRole === 'LEARNER' ? '1. Shishya (शिष्य)' : currentRole === 'PRACTITIONER' ? '2. Guru (गुरु)' : '3. Admin (प्रशासक)'}
                </span>
              </div>

              <p className="text-xs text-stone-600 font-medium">
                {currentRole === 'LEARNER' ? shishyaProfile.sanskritTitle : currentRole === 'PRACTITIONER' ? guruProfile.sanskritTitle : adminProfile.designation}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {currentRole === 'LEARNER' ? shishyaProfile.location : currentRole === 'PRACTITIONER' ? guruProfile.location : adminProfile.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  {currentRole === 'LEARNER' ? shishyaProfile.email : currentRole === 'PRACTITIONER' ? guruProfile.email : adminProfile.email}
                </span>
                <span>•</span>
                <span className="font-mono text-emerald-700 font-semibold">
                  ID: {currentRole === 'LEARNER' ? shishyaProfile.id : currentRole === 'PRACTITIONER' ? guruProfile.id : adminProfile.id}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Logout / Switch Account */}
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

        </div>

        {/* Tab Switcher */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex gap-2">
          <button
            onClick={() => setActiveTab('PROFILE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'PROFILE'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Detailed Dossier & Information
          </button>
          <button
            onClick={() => setActiveTab('PREFERENCES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'PREFERENCES'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Preferences & Telemetry
          </button>
        </div>

      </div>

      {/* VIEW 1: COMPLETE INFORMATION OF SHISHYA */}
      {currentRole === 'LEARNER' && activeTab === 'PROFILE' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Top 3 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Academic & Personal */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>Personal & Onboarding Details</span>
              </div>
              <div className="text-xs space-y-2 text-stone-600 pt-1">
                <div><span className="font-bold text-stone-800">Full Name:</span> <span className="text-stone-900 font-semibold">{shishyaProfile.name}</span></div>
                <div><span className="font-bold text-stone-800">Date of Birth (DOB):</span> <span className="text-stone-900 font-semibold">{shishyaProfile.dob}</span> ({shishyaProfile.age})</div>
                <div><span className="font-bold text-stone-800">Hobbies & Interests:</span> <span className="text-emerald-800 font-medium">{shishyaProfile.hobbies}</span></div>
                <div><span className="font-bold text-stone-800">State:</span> <span className="text-stone-900 font-semibold">{shishyaProfile.state}</span></div>
                <div><span className="font-bold text-stone-800">Academic Background:</span> {shishyaProfile.education}</div>
                <div><span className="font-bold text-stone-800">Languages:</span> {shishyaProfile.languages}</div>
              </div>
            </div>

            {/* 2. Assigned Master & Lineage */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                <Users className="w-4 h-4 text-amber-700" />
                <span>Assigned Master & Parampara</span>
              </div>
              <div className="text-xs space-y-2 text-stone-600 pt-1">
                <div><span className="font-bold text-stone-800">Guru Name:</span> {shishyaProfile.assignedGuru.name}</div>
                <div><span className="font-bold text-stone-800">Guru Experience:</span> {shishyaProfile.assignedGuru.experience}</div>
                <div><span className="font-bold text-stone-800">Gurukula Kendra:</span> {shishyaProfile.assignedGuru.location}</div>
                <div className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  ✓ Verified Gurukula Apprenticeship Agreement Active
                </div>
              </div>
            </div>

            {/* 3. Government Verification & Grant */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                <BadgeCheck className="w-4 h-4 text-indigo-700" />
                <span>Government Accreditation & Grant</span>
              </div>
              <div className="text-xs space-y-2 text-stone-600 pt-1">
                <div><span className="font-bold text-stone-800">DigiLocker Status:</span> <span className="text-emerald-700 font-semibold">{shishyaProfile.verification}</span></div>
                <div><span className="font-bold text-stone-800">Apprentice Fellowship:</span> {shishyaProfile.stipend}</div>
                <div><span className="font-bold text-stone-800">Apprentice Status:</span> <span className="text-stone-900 font-bold">{shishyaProfile.status}</span></div>
              </div>
            </div>

          </div>

          {/* Traditions Focus & Learning Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Traditions Focus */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>Traditions Focus & Learning Tracks</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="text-xs font-bold text-stone-900">Primary Track</div>
                  <div className="text-xs text-stone-700 mt-0.5">{shishyaProfile.traditions.primary}</div>
                  <div className="text-[11px] text-emerald-700 font-medium mt-1">Level 2 Apprentice • Daf Percussion + Oral Chants</div>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="text-xs font-bold text-stone-900">Secondary Track</div>
                  <div className="text-xs text-stone-700 mt-0.5">{shishyaProfile.traditions.secondary}</div>
                  <div className="text-[11px] text-amber-700 font-medium mt-1">Foundational Workshop Series Enrolled</div>
                </div>
              </div>
            </div>

            {/* Badges & Metrics */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-700" />
                <span>Badges Earned & Mastery Metrics</span>
              </h3>

              <div className="space-y-2.5">
                {shishyaProfile.metrics.badges.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200/80">
                    <span className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      ★
                    </span>
                    <div className="text-xs font-bold text-stone-900">
                      {b}
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    <div className="text-[10px] text-stone-500">Attendance</div>
                    <div className="font-bold text-emerald-800 text-sm">{shishyaProfile.metrics.attendanceRate}</div>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    <div className="text-[10px] text-stone-500">Total Hours</div>
                    <div className="font-bold text-stone-900 text-sm">18 Hrs</div>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    <div className="text-[10px] text-stone-500">Masters Linked</div>
                    <div className="font-bold text-stone-900 text-sm">2 Gurus</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Next Schedule Banner */}
          <div className="p-4 rounded-2xl bg-emerald-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
            <div>
              <div className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Upcoming Gurukula Schedule</div>
              <div className="text-sm font-bold mt-0.5">{shishyaProfile.schedule.nextSession}</div>
              <div className="text-xs text-emerald-100/80">{shishyaProfile.schedule.nextExam}</div>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-800 text-xs font-semibold border border-emerald-600">
              Confirmed Attendance
            </span>
          </div>

        </div>
      )}

      {/* VIEW 2: COMPLETE INFORMATION OF GURU */}
      {currentRole === 'PRACTITIONER' && activeTab === 'PROFILE' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Top 3 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Lineage & Art */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>Master Credentials & Parampara</span>
              </div>
              <div className="text-xs space-y-2 text-stone-600 pt-1">
                <div><span className="font-bold text-stone-800">Full Name:</span> <span className="text-stone-900 font-semibold">{guruProfile.name}</span></div>
                <div><span className="font-bold text-stone-800">State:</span> <span className="text-stone-900 font-semibold">{guruProfile.state}</span></div>
                <div><span className="font-bold text-stone-800">Date of Birth (DOB):</span> <span className="text-stone-900 font-semibold">{guruProfile.dob}</span> ({guruProfile.age})</div>
                <div><span className="font-bold text-stone-800">Experience:</span> <span className="text-amber-800 font-semibold">{guruProfile.experience}</span></div>
                <div><span className="font-bold text-stone-800">Expertise / Tradition:</span> <span className="text-emerald-800 font-medium">{guruProfile.tradition}</span></div>
                <div><span className="font-bold text-stone-800">Gharana / Lineage:</span> {guruProfile.lineage}</div>
              </div>
            </div>

            {/* 2. Teaching & Apprenticeship */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Knowledge Transmission Status</span>
              </div>
              <div className="text-xs space-y-2 text-stone-600 pt-1">
                <div><span className="font-bold text-stone-800">Active Shishyas:</span> {guruProfile.metrics.connectedLearners} Enrolled Apprentices</div>
                <div><span className="font-bold text-stone-800">Training Hours:</span> {guruProfile.metrics.sessionsConducted}</div>
                <div><span className="font-bold text-stone-800">Vault Archives:</span> {guruProfile.metrics.documentationFiles}</div>
                <div><span className="font-bold text-stone-800">Pending Review:</span> <span className="text-amber-700 font-bold">{guruProfile.metrics.pendingRequests} Requests</span></div>
              </div>
            </div>

            {/* 3. Accreditation & Grants */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                <Award className="w-4 h-4 text-indigo-700" />
                <span>National Accreditation & Fellowship</span>
              </div>
              <div className="text-xs space-y-2 text-stone-600 pt-1">
                <div><span className="font-bold text-stone-800">Accreditation:</span> <span className="text-emerald-700 font-semibold">{guruProfile.status}</span></div>
                <div><span className="font-bold text-stone-800">Master ID:</span> {guruProfile.verification}</div>
                <div><span className="font-bold text-stone-800">Guru Fellowship:</span> {guruProfile.fellowship}</div>
              </div>
            </div>

          </div>

          {/* Active Apprentices Roster & Honors */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Active Apprentices Roster */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-stone-900 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-700" />
                  <span>Enrolled Shishyas ({guruProfile.activeApprentices.length})</span>
                </span>
                <span className="text-xs text-stone-400">Under Active Gurukula Guidance</span>
              </h3>

              <div className="space-y-2.5">
                {guruProfile.activeApprentices.map((appr, idx) => (
                  <div key={idx} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-stone-900">{appr.name}</div>
                      <div className="text-[11px] text-stone-500">{appr.city} • Track: {appr.progress}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Enrolled
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Honors, Awards & Master Bio */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-700" />
                <span>Honors & State Recognitions</span>
              </h3>

              <div className="space-y-2">
                {guruProfile.honors.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-2.5 bg-amber-50/50 rounded-xl border border-amber-200/80 text-xs text-stone-800 font-semibold">
                    <span className="text-amber-600">🏆</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <div className="text-xs font-bold text-stone-900 mb-1">Master Biography & Heritage Commitment</div>
                <p className="text-[11px] leading-relaxed text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
                  {guruProfile.bio}
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 3: ADMIN INFORMATION */}
      {currentRole === 'AUTHORITY' && activeTab === 'PROFILE' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                <ShieldCheck className="w-4 h-4 text-indigo-700" />
                <span>Authority Official Details</span>
              </div>
              <div className="text-xs space-y-2 text-stone-600 pt-1">
                <div><span className="font-bold text-stone-800">Officer Name:</span> {adminProfile.name}</div>
                <div><span className="font-bold text-stone-800">Designation:</span> {adminProfile.designation}</div>
                <div><span className="font-bold text-stone-800">Officer ID:</span> {adminProfile.id}</div>
                <div><span className="font-bold text-stone-800">Clearance Level:</span> {adminProfile.clearance}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Jurisdiction & Coverage</span>
              </div>
              <div className="text-xs space-y-2 text-stone-600 pt-1">
                <div><span className="font-bold text-stone-800">Coverage:</span> {adminProfile.jurisdiction}</div>
                <div><span className="font-bold text-stone-800">Regional Telemetry:</span> {adminProfile.systemStatus}</div>
                <div><span className="font-bold text-stone-800">Security Vault:</span> {adminProfile.encryption}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                <Flame className="w-4 h-4 text-red-600" />
                <span>HTHS Early Warning Radar</span>
              </div>
              <div className="text-xs space-y-2 text-stone-600 pt-1">
                <div><span className="font-bold text-stone-800">Engine Version:</span> HTHS v2.4 (Active)</div>
                <div><span className="font-bold text-stone-800">Critical Traditions:</span> 5 Monitored Zones</div>
                <div><span className="font-bold text-stone-800">Interventions Active:</span> 3 Emergency Grants</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW 4: PREFERENCES & TELEMETRY */}
      {activeTab === 'PREFERENCES' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-stone-900">System Preferences & Notification Settings</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Customize your Sanskriti Suraksha portal experience and alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <div className="font-bold text-xs text-stone-900">Preferred Display Language</div>
              <select 
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-white border border-stone-200 focus:ring-1 focus:ring-[#104333] cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.native}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
              <div className="font-bold text-xs text-stone-900">Early Warning Alerts & SMS</div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertPref}
                    onChange={(e) => setAlertPref(e.target.checked)}
                    className="w-4 h-4 rounded text-[#104333] accent-[#104333]"
                  />
                  <span className="text-xs text-stone-700">Email alerts for Critical HTHS Living Heritage risks</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsPref}
                    onChange={(e) => setSmsPref(e.target.checked)}
                    className="w-4 h-4 rounded text-[#104333] accent-[#104333]"
                  />
                  <span className="text-xs text-stone-700">SMS notifications for Gurukula classes & applications</span>
                </label>
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Sanskriti Suraksha System • Pan-India Living Heritage Registry API v2.4</span>
            <span className="font-mono text-emerald-800 font-bold">Node: MH-PUNE-01 (Synced)</span>
          </div>
        </div>
      )}

    </div>
  );
}
