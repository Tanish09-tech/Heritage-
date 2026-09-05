import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Sparkles,
  Check
} from 'lucide-react';

export default function LoginPageView({ onLoginSuccess, onBackToLanding }) {
  // Tab state: 'LOGIN' | 'SIGNUP'
  const [activeTab, setActiveTab] = useState('LOGIN');
  
  // Role state: 'SHISHYA' | 'GURU' | 'ADMIN'
  const [selectedRole, setSelectedRole] = useState('SHISHYA');

  // Form states
  const [email, setEmail] = useState('shishya.aniket@gmail.com');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 3 Role definitions
  const roleData = {
    SHISHYA: {
      id: 'SHISHYA',
      roleKey: 'LEARNER',
      targetView: 'LEARNER_DASHBOARD',
      orderNum: '1',
      title: 'Shishya',
      sanskrit: 'शिष्य',
      subtitle: 'Learner & Disciple',
      email: 'shishya.aniket@gmail.com',
      name: 'Aniket Deshmukh',
      icon: GraduationCap,
      activeColor: 'bg-[#104333] text-white border-[#104333]',
      inactiveColor: 'bg-white/80 text-stone-700 border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/50'
    },
    GURU: {
      id: 'GURU',
      roleKey: 'PRACTITIONER',
      targetView: 'PRACTITIONER_DASHBOARD',
      orderNum: '2',
      title: 'Guru',
      sanskrit: 'गुरु',
      subtitle: 'Master & Custodian',
      email: 'guru.tukaram@gmail.com',
      name: 'Shahir Tukaram Jagtap',
      icon: Users,
      activeColor: 'bg-[#845314] text-white border-[#845314]',
      inactiveColor: 'bg-white/80 text-stone-700 border-stone-200 hover:border-amber-600 hover:bg-amber-50/50'
    },
    ADMIN: {
      id: 'ADMIN',
      roleKey: 'AUTHORITY',
      targetView: 'DASHBOARD',
      orderNum: '3',
      title: 'Admin',
      sanskrit: 'प्रशासक',
      subtitle: 'Heritage Authority',
      email: 'admin.sanskriti@gov.in',
      name: 'Ministry Heritage Authority',
      icon: ShieldCheck,
      activeColor: 'bg-[#1e3a68] text-white border-[#1e3a68]',
      inactiveColor: 'bg-white/80 text-stone-700 border-stone-200 hover:border-indigo-600 hover:bg-indigo-50/50'
    }
  };

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    setEmail(roleData[roleId].email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const current = roleData[selectedRole];
    onLoginSuccess(current.roleKey, current.targetView, {
      email,
      name: fullName || current.name,
      role: current.roleKey
    });
  };

  const handleSocialLogin = (provider) => {
    const current = roleData[selectedRole];
    onLoginSuccess(current.roleKey, current.targetView, {
      email: current.email,
      name: current.name,
      role: current.roleKey,
      provider
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#fbf9f5] text-stone-800 flex flex-col justify-between items-center relative overflow-x-hidden selection:bg-[#104333] selection:text-white font-sans">
      
      {/* Subtle Top Navigation */}
      <header className="w-full max-w-4xl mx-auto px-6 py-4 flex items-center justify-between z-20">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white/70 hover:bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        <div className="flex items-center gap-2 text-stone-700">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-xs font-bold shadow-xs">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="font-cinzel text-xs font-bold tracking-wider text-stone-800">
            SANSKRITI SURAKSHA
          </span>
        </div>
      </header>

      {/* Main Center Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 w-full max-w-md z-10">
        
        {/* Top Header Text matching image */}
        <div className="text-center mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
            {activeTab === 'LOGIN' ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="text-xs text-stone-500 mt-1 font-medium">
            {activeTab === 'LOGIN' ? 'Login to continue your journey' : 'Join the mission to preserve living heritage'}
          </p>
        </div>

        {/* 3-Role Selector Option: 1. Shishya, 2. Guru, 3. Admin */}
        <div className="w-full mb-3.5">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 text-center">
            Select Your Role
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(roleData).map((role) => {
              const isSelected = selectedRole === role.id;
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleChange(role.id)}
                  className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center gap-0.5 shadow-2xs cursor-pointer ${
                    isSelected
                      ? `${role.activeColor} shadow-md ring-2 ring-stone-900/10 scale-102`
                      : role.inactiveColor
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="font-bold">{role.orderNum}. {role.title}</span>
                  </div>
                  <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-stone-400'}`}>
                    ({role.sanskrit})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Card with Tabs on Top */}
        <div className="w-full bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden">
          
          {/* Top Tabs: Login / Sign Up matching image */}
          <div className="flex bg-stone-100/90 p-1 border-b border-stone-100">
            <button
              type="button"
              onClick={() => setActiveTab('LOGIN')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === 'LOGIN'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('SIGNUP')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === 'SIGNUP'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
            
            {/* Full Name (Sign Up only) */}
            {activeTab === 'SIGNUP' && (
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg bg-stone-50/70 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-[#104333] focus:border-[#104333] focus:bg-white transition"
                  required
                />
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youremail@gmail.com"
                className="w-full text-xs px-3.5 py-2.5 rounded-lg bg-stone-50/70 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-[#104333] focus:border-[#104333] focus:bg-white transition"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-stone-800">
                  Password
                </label>
                {activeTab === 'LOGIN' && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to ' + email)}
                    className="text-[11px] text-stone-500 hover:text-stone-900 font-medium hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full text-xs px-3.5 py-2.5 pr-9 rounded-lg bg-stone-50/70 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-[#104333] focus:border-[#104333] focus:bg-white transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me checkbox */}
            {activeTab === 'LOGIN' && (
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  id="rememberUser"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#104333] focus:ring-[#104333] accent-[#104333] border-stone-300 cursor-pointer"
                />
                <label htmlFor="rememberUser" className="text-xs text-stone-600 cursor-pointer select-none font-medium">
                  Remember me
                </label>
              </div>
            )}

            {/* Primary Login Button matching deep green from image */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#104333] hover:bg-[#0b3327] text-white font-bold text-xs tracking-wide shadow-md transition transform active:scale-98 cursor-pointer mt-2"
            >
              {activeTab === 'LOGIN' ? `Login as ${roleData[selectedRole].title}` : `Sign Up as ${roleData[selectedRole].title}`}
            </button>

            {/* 'or login with' Divider */}
            <div className="relative flex items-center justify-center my-3 pt-1">
              <div className="border-t border-stone-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-stone-400 lowercase font-medium">
                or login with
              </span>
            </div>

            {/* 3 Circular Social Login Buttons matching image */}
            <div className="flex items-center justify-center gap-4 pt-0.5">
              
              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="w-9 h-9 rounded-full border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 flex items-center justify-center shadow-2xs transition transform hover:scale-105"
                title="Sign in with Google"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="w-9 h-9 rounded-full border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 flex items-center justify-center shadow-2xs transition transform hover:scale-105"
                title="Sign in with Facebook"
              >
                <span className="text-[#1877F2] font-bold text-sm">f</span>
              </button>

              {/* Government / SSO ID */}
              <button
                type="button"
                onClick={() => handleSocialLogin('GovID')}
                className="w-9 h-9 rounded-full border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 flex items-center justify-center shadow-2xs transition transform hover:scale-105"
                title="Sign in with MeriPehchaan / Government ID"
              >
                <span className="text-stone-800 text-xs font-black">✦</span>
              </button>

            </div>

          </form>

        </div>

      </main>

      {/* Traditional Indian Temple & Monument Silhouette Artwork at Bottom matching image */}
      <div className="w-full relative pointer-events-none mt-2 overflow-hidden flex justify-center opacity-80">
        <svg
          viewBox="0 0 1200 160"
          className="w-full h-20 sm:h-28 text-[#d4af37]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Detailed Golden Temple & Palace Skyline */}
          <path
            d="M0 160 L0 145 L40 145 L50 125 L60 145 L90 145 L100 110 L110 85 L120 70 L130 85 L140 110 L150 145 L190 145 L200 130 L210 100 L220 75 L225 60 L230 75 L240 100 L250 130 L260 145 L300 145 L320 120 L330 90 L340 50 L350 30 L360 50 L370 90 L380 120 L400 145 L440 145 L450 130 L460 105 L470 80 L480 105 L490 130 L500 145 L540 145 L560 115 L570 70 L580 40 L590 20 L600 10 L610 20 L620 40 L630 70 L640 115 L660 145 L700 145 L710 130 L720 105 L730 80 L740 105 L750 130 L760 145 L800 145 L820 120 L830 90 L840 50 L850 30 L860 50 L870 90 L880 120 L900 145 L940 145 L950 130 L960 100 L970 75 L975 60 L980 75 L990 100 L1000 130 L1010 145 L1050 145 L1060 110 L1070 85 L1080 70 L1090 85 L1100 110 L1110 145 L1160 145 L1170 125 L1180 145 L1200 145 L1200 160 Z"
            fill="url(#goldGradient)"
            opacity="0.25"
          />
          <path
            d="M0 160 L0 150 L50 150 L70 130 L80 110 L90 80 L100 60 L110 80 L120 110 L130 130 L150 150 L200 150 L230 125 L245 95 L250 85 L255 95 L270 125 L300 150 L350 150 L380 110 L395 70 L400 45 L405 70 L420 110 L450 150 L500 150 L540 115 L560 65 L570 35 L580 65 L600 115 L640 150 L700 150 L740 115 L760 65 L770 35 L780 65 L800 115 L840 150 L890 150 L920 110 L935 70 L940 45 L945 70 L960 110 L990 150 L1040 150 L1070 125 L1085 95 L1090 85 L1095 95 L1110 125 L1140 150 L1200 150 L1200 160 Z"
            stroke="#c89d54"
            strokeWidth="1.5"
            strokeOpacity="0.45"
            fill="url(#goldGradient2)"
          />
          {/* Architectural Arches & Pillars Line Details */}
          <line x1="100" y1="60" x2="100" y2="150" stroke="#c89d54" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="250" y1="85" x2="250" y2="150" stroke="#c89d54" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="400" y1="45" x2="400" y2="150" stroke="#c89d54" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="570" y1="35" x2="570" y2="150" stroke="#c89d54" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="770" y1="35" x2="770" y2="150" stroke="#c89d54" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="940" y1="45" x2="940" y2="150" stroke="#c89d54" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="1090" y1="85" x2="1090" y2="150" stroke="#c89d54" strokeWidth="1" strokeOpacity="0.3" />

          {/* Gradients */}
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="160" gradientUnits="userSpaceOnUse">
              <stop stopColor="#d4af37" stopOpacity="0.6" />
              <stop offset="1" stopColor="#c89d54" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="goldGradient2" x1="0" y1="0" x2="0" y2="160" gradientUnits="userSpaceOnUse">
              <stop stopColor="#e8c97a" stopOpacity="0.25" />
              <stop offset="1" stopColor="#fbf9f5" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Minimal Footer */}
      <footer className="w-full text-center pb-2 text-[10px] text-stone-400 z-10">
        © 2026 Sanskriti Suraksha • Living Heritage Registry
      </footer>

    </div>
  );
}
