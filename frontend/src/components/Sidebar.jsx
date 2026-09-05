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

export default function Sidebar({ activeView, setActiveView, onLogout, currentRole }) {
  // Dynamic Role-based navigation items filtering
  const getMenuItems = () => {
    // 1. Shishya (Learner) Role: NO Admin Dashboard, NO Guru Portal, NO Validation Queue
    if (currentRole === 'LEARNER') {
      return [
        { id: 'LEARNER_DASHBOARD', label: 'Shishya Portal', icon: GraduationCap },
        { id: 'MAP', label: 'Heritage Map', icon: MapPin },
        { id: 'EXPLORER', label: 'Traditions', icon: BookOpen },
        { id: 'AI_ANALYSIS', label: 'AI Heritage Insights', icon: Activity },
        { id: 'RECOMMENDATIONS', label: 'Mentorship Matches', icon: Lightbulb },
        { id: 'SETTINGS', label: 'Settings', icon: Settings },
      ];
    }

    // 2. Guru (Practitioner) Role: NO Admin Dashboard, NO Shishya Portal, NO Validation Queue
    if (currentRole === 'PRACTITIONER') {
      return [
        { id: 'PRACTITIONER_DASHBOARD', label: 'Guru Portal', icon: Users },
        { id: 'MAP', label: 'Heritage Map', icon: MapPin },
        { id: 'EXPLORER', label: 'Traditions', icon: BookOpen },
        { id: 'DOCUMENTATION', label: 'Documentation Vault', icon: FileText },
        { id: 'RECOMMENDATIONS', label: 'Interventions', icon: Lightbulb },
        { id: 'SETTINGS', label: 'Settings', icon: Settings },
      ];
    }

    // 3. Admin (Authority) Role: NO Guru Portal, NO Shishya Portal
    return [
      { id: 'DASHBOARD', label: 'Admin Dashboard', icon: LayoutDashboard },
      { id: 'MAP', label: 'Heritage Map', icon: MapPin },
      { id: 'EXPLORER', label: 'Traditions', icon: BookOpen },
      { id: 'AI_ANALYSIS', label: 'AI Early Warning', icon: Activity },
      { id: 'DOCUMENTATION', label: 'Documentation Vault', icon: FileText },
      { id: 'VALIDATION', label: 'Validation Queue', icon: ShieldCheck },
      { id: 'RECOMMENDATIONS', label: 'Recommendations', icon: Lightbulb },
      { id: 'SETTINGS', label: 'Settings', icon: Settings },
    ];
  };

  const menuItems = getMenuItems();

  const getRoleBadge = () => {
    if (currentRole === 'LEARNER') return { label: 'Shishya (Apprentice)', color: 'text-emerald-400' };
    if (currentRole === 'PRACTITIONER') return { label: 'Guru (Master)', color: 'text-amber-400' };
    return { label: 'Admin (Authority)', color: 'text-indigo-400' };
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
          <span>Sign Out / Switch Role</span>
        </button>
      </div>
    </aside>
  );
}
