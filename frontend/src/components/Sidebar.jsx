import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  BookOpen, 
  Users, 
  GraduationCap, 
  Activity, 
  FileText, 
  ShieldCheck, 
  Lightbulb, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

export default function Sidebar({ activeView, setActiveView, onLogout, currentRole }) {
  const { t } = useLanguage();

  // Dynamic Role-based navigation items filtering
  const getMenuItems = () => {
    // 1. Shishya (Learner) Role: NO Admin Dashboard, NO Guru Portal, NO Validation Queue
    if (currentRole === 'LEARNER') {
      return [
        { id: 'LEARNER_DASHBOARD', label: t('shishyaPortal'), icon: GraduationCap },
        { id: 'MATCHING', label: t('matchmaker'), icon: Users },
        { id: 'MAP', label: t('map'), icon: MapPin },
        { id: 'EXPLORER', label: t('explorer'), icon: BookOpen },
        { id: 'SETTINGS', label: t('settings'), icon: Settings },
      ];
    }

    // 2. Guru (Practitioner) Role: NO Admin Dashboard, NO Shishya Portal, NO Validation Queue
    if (currentRole === 'PRACTITIONER') {
      return [
        { id: 'PRACTITIONER_DASHBOARD', label: t('guruPortal'), icon: Users },
        { id: 'MAP', label: t('map'), icon: MapPin },
        { id: 'EXPLORER', label: t('explorer'), icon: BookOpen },
        { id: 'DOCUMENTATION', label: t('knowledgeVault'), icon: FileText },
        { id: 'SETTINGS', label: t('settings'), icon: Settings },
      ];
    }

    // 3. Admin (Authority) Role: NO Guru Portal, NO Shishya Portal
    return [
      { id: 'DASHBOARD', label: t('adminPortal'), icon: LayoutDashboard },
      { id: 'MATCHING', label: t('matchmaker'), icon: Users },
      { id: 'MAP', label: t('map'), icon: MapPin },
      { id: 'EXPLORER', label: t('explorer'), icon: BookOpen },
      { id: 'AI_ANALYSIS', label: t('aiInsights'), icon: Activity },
      { id: 'DOCUMENTATION', label: t('knowledgeVault'), icon: FileText },
      { id: 'VALIDATION', label: t('validationQueue'), icon: ShieldCheck },
      { id: 'SETTINGS', label: t('settings'), icon: Settings },
    ];
  };

  const menuItems = getMenuItems();

  const getRoleBadge = () => {
    if (currentRole === 'LEARNER') return { label: t('shishya'), color: 'text-emerald-400' };
    if (currentRole === 'PRACTITIONER') return { label: t('guru'), color: 'text-amber-400' };
    return { label: t('admin'), color: 'text-indigo-400' };
  };

  const roleInfo = getRoleBadge();

  return (
    <aside className="w-64 bg-[#0e2a22] text-stone-200 flex flex-col justify-between shrink-0 min-h-screen border-r border-[#163f34]">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-[#184539] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-700/60 border border-emerald-500/40 flex items-center justify-center text-amber-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-cinzel font-bold text-sm tracking-wide text-white">
              Sanskriti Suraksha
            </h1>
            <p className={`text-[10px] font-semibold ${roleInfo.color}`}>
              {roleInfo.label}
            </p>
          </div>
        </div>

        {/* Dynamic Navigation Menu strictly filtered by role */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id || 
              (item.id === 'EXPLORER' && activeView === 'TRADITION_DETAIL') ||
              (item.id === 'EXPLORER' && activeView === 'ADD_TRADITION');

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#184539] text-white font-semibold shadow-inner border border-emerald-600/30'
                    : 'text-stone-300 hover:bg-[#13382e] hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls: Logout */}
      <div className="p-3 border-t border-[#184539]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-stone-300 hover:bg-[#13382e] hover:text-red-300 transition"
        >
          <LogOut className="w-4 h-4 text-stone-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
