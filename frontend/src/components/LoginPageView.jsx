import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Sparkles,
  Check,
  Calendar,
  Heart,
  MapPin,
  Award,
  BookOpen,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { FOCUS_STATES, GURU_TRADITIONS_SUGGESTIONS } from './ProfileDetailsModal';

export default function LoginPageView({ onLoginSuccess, onBackToLanding }) {
  // Step state: 'AUTH' (credentials) | 'DETAILS' (mandatory details form for Shishya & Guru)
  const [step, setStep] = useState('AUTH');

  // Tab state: 'LOGIN' | 'SIGNUP'
  const [activeTab, setActiveTab] = useState('LOGIN');
  
  // Role state: 'SHISHYA' | 'GURU' | 'ADMIN'
  const [selectedRole, setSelectedRole] = useState('SHISHYA');

  // Credentials form states
  const [email, setEmail] = useState('shishya.aniket@gmail.com');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Mandatory Profile Details States
  const [detailFullName, setDetailFullName] = useState('Aniket Deshmukh');
  const [dob, setDob] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [hobbies, setHobbies] = useState('');
  const [experience, setExperience] = useState('');
  const [expertTradition, setExpertTradition] = useState('Shahiri Powada (Oral Ballads)');
  const [errorMsg, setErrorMsg] = useState('');

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
    setDetailFullName(fullName || roleData[roleId].name);
  };

  // Step 1: Submit Credentials
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const current = roleData[selectedRole];

    // Admin can proceed directly without details
    if (selectedRole === 'ADMIN') {
      onLoginSuccess(current.roleKey, current.targetView, {
        email,
        name: fullName || current.name,
        role: current.roleKey,
        profileCompleted: true
      });
      return;
    }

    // For Shishya and Guru, mandatory details form MUST appear
    setDetailFullName(fullName.trim() || current.name);
    setErrorMsg('');
    setStep('DETAILS');
  };

  const handleSocialLogin = (provider) => {
    const current = roleData[selectedRole];
    if (selectedRole === 'ADMIN') {
      onLoginSuccess(current.roleKey, current.targetView, {
        email: current.email,
        name: current.name,
        role: current.roleKey,
        provider,
        profileCompleted: true
      });
      return;
    }
    setDetailFullName(current.name);
    setErrorMsg('');
    setStep('DETAILS');
  };

  // Step 2: Submit Mandatory Profile Details
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const current = roleData[selectedRole];

    if (selectedRole === 'SHISHYA') {
      // Mandatory for Shishya: full name, dob, hobbies, state
      if (!detailFullName.trim()) {
        setErrorMsg('Full Name is mandatory for Shishya.');
        return;
      }
      if (!dob) {
        setErrorMsg('Date of Birth (DOB) is mandatory.');
        return;
      }
      if (!hobbies.trim()) {
        setErrorMsg('Hobbies & Interests are mandatory for Shishya.');
        return;
      }
      if (!state) {
        setErrorMsg('State selection is mandatory.');
        return;
      }

      onLoginSuccess(current.roleKey, current.targetView, {
        email,
        name: detailFullName.trim(),
        role: current.roleKey,
        dob,
        hobbies: hobbies.trim(),
        state,
        profileCompleted: true
      });
    } else if (selectedRole === 'GURU') {
      // Mandatory for Guru: full name, state, dob, experience, expert of which skills/tradition
      if (!detailFullName.trim()) {
        setErrorMsg('Full Name is mandatory for Guru.');
        return;
      }
      if (!state) {
        setErrorMsg('State selection is mandatory.');
        return;
      }
      if (!dob) {
        setErrorMsg('Date of Birth (DOB) is mandatory.');
        return;
      }
      if (!experience.trim()) {
        setErrorMsg('Experience in art form / tradition is mandatory for Guru.');
        return;
      }
      if (!expertTradition.trim()) {
        setErrorMsg('Expert of which skills / tradition is mandatory for Guru.');
        return;
      }

      onLoginSuccess(current.roleKey, current.targetView, {
        email,
        name: detailFullName.trim(),
        role: current.roleKey,
        state,
        dob,
        experience: experience.trim(),
        expertTradition: expertTradition.trim(),
        profileCompleted: true
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fbf9f5] text-stone-800 flex flex-col justify-between items-center relative overflow-x-hidden selection:bg-[#104333] selection:text-white font-sans">
      
      {/* Subtle Top Navigation */}
      <header className="w-full max-w-4xl mx-auto px-6 py-4 flex items-center justify-between z-20">
        <button
          onClick={step === 'DETAILS' ? () => setStep('AUTH') : onBackToLanding}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white/70 hover:bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{step === 'DETAILS' ? 'Back to Login' : 'Home'}</span>
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
        
        {/* ========================================================================= */}
        {/* STEP 1: AUTHENTICATION (CREDENTIALS) */}
        {/* ========================================================================= */}
        {step === 'AUTH' && (
          <>
            {/* Top Header Text */}
            <div className="text-center mb-5">
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
                {activeTab === 'LOGIN' ? 'Welcome Back!' : 'Create Account'}
              </h1>
              <p className="text-xs text-stone-500 mt-1 font-medium">
                {activeTab === 'LOGIN' ? 'Login to continue your cultural journey' : 'Join the mission to preserve living heritage'}
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
              
              {/* Top Tabs: Login / Sign Up */}
              <div className="flex bg-stone-100/90 p-1 border-b border-stone-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('LOGIN')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
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
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                    activeTab === 'SIGNUP'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleAuthSubmit} className="p-6 sm:p-7 space-y-4">
                
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
                        className="text-[11px] text-stone-500 hover:text-stone-900 font-medium hover:underline cursor-pointer"
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
                      className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
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

                {/* Primary Action Button */}
                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-lg text-white font-bold text-xs tracking-wide shadow-md transition transform active:scale-98 cursor-pointer mt-2 ${
                    selectedRole === 'SHISHYA'
                      ? 'bg-[#104333] hover:bg-[#0b3327]'
                      : selectedRole === 'GURU'
                      ? 'bg-[#845314] hover:bg-[#6c430e]'
                      : 'bg-[#1e3a68] hover:bg-[#15294b]'
                  }`}
                >
                  {selectedRole === 'ADMIN'
                    ? (activeTab === 'LOGIN' ? 'Login as Admin' : 'Sign Up as Admin')
                    : `Continue to ${roleData[selectedRole].title} Details →`}
                </button>

                {/* 'or login with' Divider */}
                <div className="relative flex items-center justify-center my-3 pt-1">
                  <div className="border-t border-stone-200 w-full" />
                  <span className="bg-white px-3 text-[11px] text-stone-400 lowercase font-medium">
                    or login with
                  </span>
                </div>

                {/* Circular Social Login Buttons */}
                <div className="flex items-center justify-center gap-4 pt-0.5">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
                    className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition shadow-2xs font-bold text-xs text-red-600 cursor-pointer"
                    title="Login with Google"
                  >
                    G
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Apple')}
                    className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition shadow-2xs font-bold text-xs text-stone-800 cursor-pointer"
                    title="Login with Apple"
                  >
                    
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('DigiLocker')}
                    className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition shadow-2xs font-bold text-[10px] text-blue-600 cursor-pointer"
                    title="Login with DigiLocker"
                  >
                    DL
                  </button>
                </div>

              </form>

            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: MANDATORY PROFILE DETAILS FOR SHISHYA & GURU */}
        {/* ========================================================================= */}
        {step === 'DETAILS' && (
          <div className="w-full bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Banner */}
            <div className={`p-6 pb-5 text-white ${
              selectedRole === 'SHISHYA'
                ? 'bg-gradient-to-br from-[#104333] to-[#1e5e4a]'
                : 'bg-gradient-to-br from-[#845314] to-[#a3671a]'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  Step 2 of 2 • Mandatory
                </span>
                <span className="text-xs font-cinzel text-amber-300 font-bold">
                  {roleData[selectedRole].sanskrit}
                </span>
              </div>
              
              <h2 className="text-xl font-bold font-serif">
                {selectedRole === 'SHISHYA' ? 'Shishya Profile Details' : 'Guru Profile Details'}
              </h2>
              <p className="text-xs text-white/80 mt-1">
                {selectedRole === 'SHISHYA'
                  ? 'All fields below are mandatory before entering the Shishya Portal.'
                  : 'All fields below are mandatory before entering the Guru Portal.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleDetailsSubmit} className="p-6 sm:p-7 space-y-4">
              
              {/* Error Message */}
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Full Name (Mandatory for both) */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center justify-between">
                  <span>Full Name <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-stone-400 font-normal">Required</span>
                </label>
                <input
                  type="text"
                  value={detailFullName}
                  onChange={(e) => setDetailFullName(e.target.value)}
                  placeholder={selectedRole === 'SHISHYA' ? 'e.g. Aniket Deshmukh' : 'e.g. Shahir Tukaram Jagtap'}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#104333] focus:bg-white transition"
                  required
                />
              </div>

              {/* =============================================================== */}
              {/* SHISHYA FIELDS: Full Name, DOB, Hobbies, State */}
              {/* =============================================================== */}
              {selectedRole === 'SHISHYA' && (
                <>
                  {/* Date of Birth */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-500" />
                        <span>Date of Birth (DOB) <span className="text-red-500">*</span></span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-normal">Required</span>
                    </label>
                    <input
                      type="date"
                      value={dob}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#104333] focus:bg-white transition"
                      required
                    />
                  </div>

                  {/* Hobbies */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-stone-500" />
                        <span>Hobbies <span className="text-red-500">*</span></span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-normal">Required</span>
                    </label>
                    <input
                      type="text"
                      value={hobbies}
                      onChange={(e) => setHobbies(e.target.value)}
                      placeholder="e.g. Classical Singing, Flute Playing, Folk Lore, Sketching"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#104333] focus:bg-white transition"
                      required
                    />
                  </div>

                  {/* State (from 9 focus states) */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-500" />
                        <span>State <span className="text-red-500">*</span></span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-normal">Required</span>
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#104333] focus:bg-white transition cursor-pointer font-medium"
                      required
                    >
                      {FOCUS_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* =============================================================== */}
              {/* GURU FIELDS: Full Name, State, DOB, Experience, Expert Skill */}
              {/* =============================================================== */}
              {selectedRole === 'GURU' && (
                <>
                  {/* State */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-500" />
                        <span>State <span className="text-red-500">*</span></span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-normal">Required</span>
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#845314] focus:bg-white transition cursor-pointer font-medium"
                      required
                    >
                      {FOCUS_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-500" />
                        <span>Date of Birth (DOB) <span className="text-red-500">*</span></span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-normal">Required</span>
                    </label>
                    <input
                      type="date"
                      value={dob}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#845314] focus:bg-white transition"
                      required
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-stone-500" />
                        <span>Experience <span className="text-red-500">*</span></span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-normal">Required</span>
                    </label>
                    <input
                      type="text"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="e.g. 25 Years of Active Practice & Lineage"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#845314] focus:bg-white transition"
                      required
                    />
                  </div>

                  {/* Expert of Which Skills / Tradition */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-stone-500" />
                        <span>Expert of Which Skills / Tradition <span className="text-red-500">*</span></span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-normal">Required</span>
                    </label>
                    <input
                      type="text"
                      value={expertTradition}
                      onChange={(e) => setExpertTradition(e.target.value)}
                      placeholder="e.g. Shahiri Powada, Warli Art, Kathakali, Purani Dilli Zardozi..."
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#845314] focus:bg-white transition mb-2"
                      required
                    />

                    {/* Quick Selection Suggestions */}
                    <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
                      {GURU_TRADITIONS_SUGGESTIONS.slice(0, 8).map((trad) => (
                        <button
                          key={trad}
                          type="button"
                          onClick={() => setExpertTradition(trad)}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition cursor-pointer ${
                            expertTradition === trad 
                              ? 'bg-[#845314] text-white border-[#845314]' 
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                          }`}
                        >
                          {trad.split(' (')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl text-white font-bold text-xs tracking-wide shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                    selectedRole === 'SHISHYA'
                      ? 'bg-[#104333] hover:bg-[#0b3327]'
                      : 'bg-[#845314] hover:bg-[#6c430e]'
                  }`}
                >
                  <span>Submit & Enter {roleData[selectedRole].title} Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-stone-400 text-center mt-2 font-medium">
                  All fields marked with <span className="text-red-500 font-bold">*</span> are strictly mandatory to proceed to the next page.
                </p>
              </div>

            </form>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto px-6 py-4 text-center text-xs text-stone-500 z-10 border-t border-stone-200/60">
        © 2026 Sanskriti Suraksha • Ministry of Culture Pilot & Hackathon Platform
      </footer>

    </div>
  );
}
