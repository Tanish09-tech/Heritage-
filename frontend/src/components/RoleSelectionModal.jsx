import React from 'react';
import { 
  Users, 
  GraduationCap, 
  ShieldCheck, 
  UserCog, 
  Sparkles, 
  X, 
  ChevronRight 
} from 'lucide-react';

export default function RoleSelectionModal({ isOpen, onClose, onSelectRole }) {
  if (!isOpen) return null;

  const roles = [
    {
      id: 'LEARNER',
      order: '1',
      title: '1. Shishya (शिष्य)',
      subTitle: 'Learner & Apprentice',
      description: 'Learn sacred arts, connect with master Gurus, and preserve living traditions.',
      icon: GraduationCap,
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      borderHover: 'hover:border-emerald-500 hover:bg-emerald-50/50',
      targetView: 'LEARNER_DASHBOARD'
    },
    {
      id: 'PRACTITIONER',
      order: '2',
      title: '2. Guru (गुरु)',
      subTitle: 'Master & Custodian',
      description: 'Transmit ancient Parampara, mentor Shishyas, and archive sacred heritage.',
      icon: Users,
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
      borderHover: 'hover:border-amber-500 hover:bg-amber-50/50',
      targetView: 'PRACTITIONER_DASHBOARD'
    },
    {
      id: 'AUTHORITY',
      order: '3',
      title: '3. Admin (प्रशासक)',
      subTitle: 'Heritage Authority',
      description: 'Monitor early-warning threat radar, review validation queues, and govern registry.',
      icon: UserCog,
      iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      borderHover: 'hover:border-indigo-500 hover:bg-indigo-50/50',
      targetView: 'DASHBOARD'
    }
  ];

  const handleRoleClick = (role) => {
    onSelectRole(role.id, role.targetView);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-800">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="pt-8 pb-4 px-6 text-center arch-card-header">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shadow-xs mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold font-sans text-stone-900">
            Select Your Role
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Choose how you want to contribute
          </p>
        </div>

        {/* 3 Grid Cards */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                onClick={() => handleRoleClick(role)}
                className={`p-4 rounded-2xl border border-stone-200 bg-white ${role.borderHover} cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 shadow-xs flex flex-col items-center text-center group`}
              >
                <div className={`w-11 h-11 rounded-full border ${role.iconBg} flex items-center justify-center mb-2.5 shadow-xs group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xs text-stone-900 group-hover:text-stone-950">
                  {role.title}
                </h3>
                <span className="text-[10px] font-semibold text-stone-600 mb-1">
                  {role.subTitle}
                </span>
                <p className="text-[11px] text-stone-500 leading-snug">
                  {role.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Silhouette Ornament */}
        <div className="h-3 bg-gradient-to-r from-amber-600/20 via-emerald-700/30 to-amber-600/20" />
      </div>
    </div>
  );
}
