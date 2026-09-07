import React from 'react';
import { 
  Layers, 
  Home, 
  Sparkles, 
  Globe, 
  ChevronDown 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AppHeader({ 
  activeView, 
  setActiveView, 
  currentRole, 
  setCurrentRole, 
  currentUser,
  onLogout,
  onOpenAuth, 
  onOpenRoleSelection 
}) {
  const { language, changeLanguage, t, languages } = useLanguage();

  // Screens strictly filtered by user role
  const getScreensForRole = () => {
    if (currentRole === 'LEARNER') {
      return [
        { id: 'LEARNER_DASHBOARD', label: '1. Shishya Portal (Dashboard)' },
        { id: 'MATCHING', label: '2. Master Gurukula Matching' },
        { id: 'EXPLORER', label: '3. Traditions Explorer' },
        { id: 'TRADITION_DETAIL', label: '4. Tradition Details' },
        { id: 'MAP', label: '5. Heritage Map' },
        { id: 'AI_ANALYSIS', label: '6. AI Heritage Insights' },
        { id: 'RECOMMENDATIONS', label: '7. Learning Recommendations' },
        { id: 'SETTINGS', label: '8. Profile & Settings' },
      ];
    }

    if (currentRole === 'PRACTITIONER') {
      return [
        { id: 'PRACTITIONER_DASHBOARD', label: '1. Guru Portal (Dashboard)' },
        { id: 'EXPLORER', label: '2. Traditions Explorer' },
        { id: 'TRADITION_DETAIL', label: '3. Tradition Details' },
        { id: 'ADD_TRADITION', label: '4. Add / Register Tradition' },
        { id: 'DOCUMENTATION', label: '5. Knowledge Documentation Vault' },
        { id: 'MAP', label: '6. Heritage Map' },
        { id: 'RECOMMENDATIONS', label: '7. Heritage Interventions' },
        { id: 'SETTINGS', label: '8. Profile & Settings' },
      ];
    }

    // Admin (Authority)
    return [
      { id: 'DASHBOARD', label: '1. Admin Heritage Radar Dashboard' },
      { id: 'MAP', label: '2. Heritage Map & Clusters' },
      { id: 'EXPLORER', label: '3. Traditions Explorer' },
      { id: 'TRADITION_DETAIL', label: '4. Tradition Details' },
      { id: 'ADD_TRADITION', label: '5. Add / Register Tradition' },
      { id: 'AI_ANALYSIS', label: '6. AI Early Warning System' },
      { id: 'VALIDATION', label: '7. Community Validation Queue' },
      { id: 'DOCUMENTATION', label: '8. Documentation Vault' },
      { id: 'RECOMMENDATIONS', label: '9. Platform Recommendations' },
      { id: 'SETTINGS', label: '10. Platform Settings' },
    ];
  };

  const screens = getScreensForRole();

  const getTitle = () => {
    switch (activeView) {
      case 'LOGIN': return 'Heritage Portal Single Sign-On';
      case 'DASHBOARD': return 'Heritage Threat & Protection Radar';
      case 'MAP': return 'Heritage Map & Geographic Clusters';
      case 'EXPLORER': return 'Living Traditions Explorer';
      case 'TRADITION_DETAIL': return 'Tradition Details & Parampara';
      case 'ADD_TRADITION': return 'Add / Register Tradition';
      case 'PRACTITIONER_DASHBOARD': return 'Guru & Master Practitioner Portal';
      case 'LEARNER_DASHBOARD': return 'Shishya & Apprentice Learner Portal';
      case 'MATCHING': return 'Master-Learner Gurukula Matching';
      case 'AI_ANALYSIS': return 'AI Living Heritage Early Warning Analysis';
      case 'DOCUMENTATION': return 'Knowledge Documentation Vault';
      case 'VALIDATION': return 'Community Validation Queue';
      case 'RECOMMENDATIONS': return 'Intervention & Learning Recommendations';
      case 'SETTINGS': return 'Profile & Platform Settings';
      default: return 'Heritage Portal';
    }
  };

  const getRoleDisplayName = () => {
    if (currentUser?.name) return currentUser.name;
    if (currentRole === 'PRACTITIONER') return 'Guru Shahir Tukaram';
    if (currentRole === 'LEARNER') return 'Shishya Aniket Deshmukh';
    return 'Admin (Heritage Authority)';
  };

  const getRoleSubtitle = () => {
    if (currentRole === 'PRACTITIONER') return 'Guru • Master Custodian';
    if (currentRole === 'LEARNER') return 'Shishya • Apprentice';
    return 'Ministry Heritage Authority';
  };

  return (
    <header className="bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      {/* Left: View Title */}
      <div className="flex items-center gap-3 min-w-0">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 font-sans tracking-tight truncate">
          {getTitle()}
        </h2>
      </div>

      {/* Center Controls: Role-Specific View Switcher (Hidden for Shishya & Guru) & Home Button */}
      <div className="flex items-center gap-2">
        {currentRole !== 'LEARNER' && currentRole !== 'PRACTITIONER' && (
          <div className="flex items-center gap-1.5 bg-[#f0f4f2] border border-[#d1ded8] px-3 py-1.5 rounded-xl">
            <Layers className="w-3.5 h-3.5 text-emerald-800" />
            <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider hidden md:inline">
              Active Views:
            </span>
            <select
              value={activeView}
              onChange={(e) => setActiveView(e.target.value)}
              className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-hidden cursor-pointer"
            >
              {screens.map(s => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right Controls: Multilingual Selector & User Profile */}
      <div className="flex items-center gap-3">
        
        {/* Multilingual Selector (English, Marathi, Hindi, Bengali, Telugu, Tamil, Malayalam) */}
        <div className="flex items-center gap-1.5 bg-[#f8faf9] hover:bg-[#edf3f0] border border-stone-200 px-2.5 py-1.5 rounded-xl transition shadow-2xs">
          <Globe className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-hidden cursor-pointer"
            title="Select Language / भाषा निवडा"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.native}
              </option>
            ))}
          </select>
        </div>

        {/* User Profile Block */}
        <div 
          onClick={() => setActiveView('SETTINGS')}
          className="flex items-center gap-2.5 pl-1 sm:pl-2 sm:border-l border-stone-200 cursor-pointer hover:opacity-90 transition"
          title="View Profile & Settings"
        >
          <div className="relative">
            <img
              src="/images/powada.jpg"
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-600/30"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-stone-900">{getRoleDisplayName()}</div>
            <div className="text-[10px] text-stone-500 font-medium">{getRoleSubtitle()}</div>
          </div>
        </div>

      </div>
    </header>
  );
}
