import React, { useState } from 'react';
import { X, Mail, Lock, Sparkles, GraduationCap, Users, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onSuccessfulAuth }) {
  const [tab, setTab] = useState('LOGIN'); // 'LOGIN' or 'SIGNUP'
  const [role, setRole] = useState('SHISHYA'); // 'SHISHYA' | 'GURU' | 'ADMIN'
  const [email, setEmail] = useState('shishya.aniket@sanskriti.gov.in');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  if (!isOpen) return null;

  const roleMap = {
    SHISHYA: {
      id: 'SHISHYA',
      roleKey: 'LEARNER',
      targetView: 'LEARNER_DASHBOARD',
      label: '1. Shishya',
      sanskrit: 'शिष्य',
      icon: GraduationCap,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-300'
    },
    GURU: {
      id: 'GURU',
      roleKey: 'PRACTITIONER',
      targetView: 'PRACTITIONER_DASHBOARD',
      label: '2. Guru',
      sanskrit: 'गुरु',
      icon: Users,
      color: 'text-amber-700 bg-amber-50 border-amber-300'
    },
    ADMIN: {
      id: 'ADMIN',
      roleKey: 'AUTHORITY',
      targetView: 'DASHBOARD',
      label: '3. Admin',
      sanskrit: 'प्रशासक',
      icon: ShieldCheck,
      color: 'text-indigo-700 bg-indigo-50 border-indigo-300'
    }
  };

  const handleRoleSelect = (roleKey) => {
    setRole(roleKey);
    if (roleKey === 'SHISHYA') {
      setEmail('shishya.aniket@sanskriti.gov.in');
    } else if (roleKey === 'GURU') {
      setEmail('guru.tukaram@sanskriti.gov.in');
    } else {
      setEmail('admin.sanskriti@gov.in');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const current = roleMap[role];
    onSuccessfulAuth(current.roleKey, current.targetView);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-800">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Arch Decoration & Welcome Copy */}
        <div className="pt-7 pb-2 px-6 text-center arch-card-header relative">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shadow-xs mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold font-sans text-stone-900">
            {tab === 'LOGIN' ? 'Heritage Portal Login' : 'Create Account'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Select your role to access living heritage
          </p>
        </div>

        {/* 3 Role Selection Pill Tabs (1st Shishya, 2nd Guru, 3rd Admin) */}
        <div className="px-6 pt-2">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 text-center">
            Choose Portal
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(roleMap).map((r) => {
              const Icon = r.icon;
              const isSelected = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleSelect(r.id)}
                  className={`py-2 px-1.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    isSelected
                      ? `${r.color} shadow-xs ring-2 ring-amber-400/50`
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px] leading-tight">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Switcher: Login / Sign Up */}
        <div className="px-6 pt-3">
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setTab('LOGIN')}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition ${
                tab === 'LOGIN'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('SIGNUP')}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition ${
                tab === 'SIGNUP'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 pt-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email / ID ({roleMap[role].label})
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youremail@sanskriti.gov.in"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-700">
                Password
              </label>
              {tab === 'LOGIN' && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to ' + email)}
                  className="text-[11px] text-emerald-800 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
                required
              />
            </div>
          </div>

          {tab === 'LOGIN' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberModal"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-600 accent-emerald-800 border-stone-300"
              />
              <label htmlFor="rememberModal" className="text-xs text-stone-600 font-normal">
                Remember me
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#133e31] hover:bg-[#0e2d23] text-white font-bold text-xs tracking-wide shadow-md transition transform active:scale-98 flex items-center justify-center gap-1.5"
          >
            <span>{tab === 'LOGIN' ? `Login as ${roleMap[role].label}` : `Register as ${roleMap[role].label}`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-white px-2 text-[10px] text-stone-400 uppercase font-medium">
              or connect with
            </span>
          </div>

          {/* Social Logins */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onSuccessfulAuth(roleMap[role].roleKey, roleMap[role].targetView)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center gap-1.5 text-xs font-semibold text-stone-700 shadow-2xs transition"
            >
              <span className="text-amber-600 font-bold">🏛️</span>
              <span>MeriPehchaan</span>
            </button>
            <button
              type="button"
              onClick={() => onSuccessfulAuth(roleMap[role].roleKey, roleMap[role].targetView)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center gap-1.5 text-xs font-semibold text-stone-700 shadow-2xs transition"
            >
              <span className="text-red-500 font-bold">G</span>
              <span>Google</span>
            </button>
          </div>
        </form>

        {/* Bottom Silhouette Ornament Pattern */}
        <div className="h-3 bg-gradient-to-r from-amber-600/20 via-emerald-700/30 to-amber-600/20" />
      </div>
    </div>
  );
}
