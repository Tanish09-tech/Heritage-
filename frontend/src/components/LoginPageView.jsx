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
import { api } from '../services/api';

export const FIXED_CREDENTIALS = [
  {
    roleId: 'SHISHYA',
    label: 'Shishya 1 (Aniket)',
    email: 'shishya1@sanskriti.gov.in',
    password: 'password123',
    name: 'Aniket Deshmukh',
    state: 'Maharashtra',
    dob: '2002-05-15',
    hobbies: 'Shahiri Powada recitation, Daf percussion, Historical Maratha Ballads'
  },
  {
    roleId: 'SHISHYA',
    label: 'Shishya 2 (Simran)',
    email: 'shishya2@sanskriti.gov.in',
    password: 'password123',
    name: 'Simran Kaur',
    state: 'Punjab',
    dob: '2003-11-20',
    hobbies: 'Phulkari folk embroidery, Giddha folk dance, Punjabi folk music'
  },
  {
    roleId: 'SHISHYA',
    label: 'Shishya 3 (Aarav)',
    email: 'shishya3@sanskriti.gov.in',
    password: 'password123',
    name: 'Aarav Patel',
    state: 'Gujarat',
    dob: '2001-09-10',
    hobbies: 'Bhavai vesha acting, Garba drumming, Kutchi embroidery'
  },
  {
    roleId: 'SHISHYA',
    label: 'Shishya 4 (Meera)',
    email: 'shishya4@sanskriti.gov.in',
    password: 'password123',
    name: 'Meera Menon',
    state: 'Kerala',
    dob: '2004-03-08',
    hobbies: 'Koodiyattam facial expressions, Mizhavu drumming, Mohiniyattam'
  },
  {
    roleId: 'SHISHYA',
    label: 'Shishya 5 (Bishal)',
    email: 'shishya5@sanskriti.gov.in',
    password: 'password123',
    name: 'Bishal Saikia',
    state: 'Assam',
    dob: '2002-12-14',
    hobbies: 'Bihu Dhol playing, Pepa flute, Assamese oral legends'
  },
  {
    roleId: 'GURU',
    label: 'Guru 1 (Tukaram)',
    email: 'guru1@sanskriti.gov.in',
    password: 'password123',
    name: 'Shahir Tukaram Jagtap',
    state: 'Maharashtra',
    dob: '1968-08-20',
    experience: '28 Years of continuous Shahiri Akhada & Daf oral tradition',
    expertTradition: 'Shahiri Powada (Oral Ballads)'
  },
  {
    roleId: 'GURU',
    label: 'Guru 2 (Harinder)',
    email: 'guru2@sanskriti.gov.in',
    password: 'password123',
    name: 'Ustad Harinder Singh',
    state: 'Punjab',
    dob: '1965-03-12',
    experience: '32 Years of traditional Gatka Shastar Vidiya & folk rhythms',
    expertTradition: 'Baisakhi & Gatka Martial Art'
  },
  {
    roleId: 'GURU',
    label: 'Guru 3 (Raghunath)',
    email: 'guru3@sanskriti.gov.in',
    password: 'password123',
    name: 'Pandit Raghunath Joshi',
    state: 'Gujarat',
    dob: '1970-11-05',
    experience: '25 Years of Bhavai Folk Theatre & Garba compositions',
    expertTradition: 'Bhavai Folk Theatre'
  },
  {
    roleId: 'GURU',
    label: 'Guru 4 (Manikandan)',
    email: 'guru4@sanskriti.gov.in',
    password: 'password123',
    name: 'Guru Manikandan Nair',
    state: 'Kerala',
    dob: '1967-04-18',
    experience: '30 Years of Koodiyattam Sanskrit Theatre & Mudras',
    expertTradition: 'Koodiyattam Sanskrit Theatre'
  },
  {
    roleId: 'GURU',
    label: 'Guru 5 (Hemlata)',
    email: 'guru5@sanskriti.gov.in',
    password: 'password123',
    name: 'Shrimati Hemlata Gogoi',
    state: 'Assam',
    dob: '1972-09-25',
    experience: '22 Years of Bihu Folk Dance & Muga Silk Weaving',
    expertTradition: 'Rongali Bihu & Folk Instruments'
  },
  {
    roleId: 'ADMIN',
    label: 'Admin (Dr. Rajesh)',
    email: 'admin@sanskriti.gov.in',
    password: 'adminpassword123',
    name: 'Dr. Rajesh Sharma',
    state: 'Delhi'
  }
];

export default function LoginPageView({ onLoginSuccess, onBackToLanding }) {
  // Step state: 'AUTH' (credentials) | 'DETAILS' (mandatory details form for Shishya & Guru)
  const [step, setStep] = useState('AUTH');

  // Tab state: 'LOGIN' | 'SIGNUP'
  const [activeTab, setActiveTab] = useState('LOGIN');
  
  // Role state: 'SHISHYA' | 'GURU' | 'ADMIN'
  const [selectedRole, setSelectedRole] = useState('SHISHYA');

  // Credentials form states
  const [email, setEmail] = useState('shishya1@sanskriti.gov.in');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('Aniket Deshmukh');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Mandatory Profile Details States
  const [detailFullName, setDetailFullName] = useState('Aniket Deshmukh');
  const [dob, setDob] = useState('2002-05-15');
  const [state, setState] = useState('Maharashtra');
  const [hobbies, setHobbies] = useState('Shahiri Powada recitation, Daf percussion, Historical Maratha Ballads');
  const [experience, setExperience] = useState('');
  const [expertTradition, setExpertTradition] = useState('Shahiri Powada (Oral Ballads)');

  // Mandatory ID Proof States (Aadhaar, PAN, Voter ID, Passport)
  const [idType, setIdType] = useState('Aadhaar Card');
  const [idNumber, setIdNumber] = useState('1234-5678-9012');
  const [idProofFile, setIdProofFile] = useState(null);
  const [idProofFileName, setIdProofFileName] = useState('aadhaar_card_verified.pdf');

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
      email: 'shishya1@sanskriti.gov.in',
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
      email: 'guru1@sanskriti.gov.in',
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
      email: 'admin@sanskriti.gov.in',
      name: 'Dr. Rajesh Sharma',
      icon: ShieldCheck,
      activeColor: 'bg-[#1e3a68] text-white border-[#1e3a68]',
      inactiveColor: 'bg-white/80 text-stone-700 border-stone-200 hover:border-indigo-600 hover:bg-indigo-50/50'
    }
  };

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    const defaultPreset = FIXED_CREDENTIALS.find(c => c.roleId === roleId);
    if (defaultPreset) {
      setEmail(defaultPreset.email);
      setPassword(defaultPreset.password);
      setFullName(defaultPreset.name);
      setDetailFullName(defaultPreset.name);
      if (defaultPreset.dob) setDob(defaultPreset.dob);
      if (defaultPreset.state) setState(defaultPreset.state);
      if (defaultPreset.hobbies) setHobbies(defaultPreset.hobbies);
      if (defaultPreset.experience) setExperience(defaultPreset.experience);
      if (defaultPreset.expertTradition) setExpertTradition(defaultPreset.expertTradition);
    }
    setErrorMsg('');
  };

  const handleSelectPreset = (preset) => {
    setSelectedRole(preset.roleId);
    setEmail(preset.email);
    setPassword(preset.password);
    setFullName(preset.name);
    setDetailFullName(preset.name);
    if (preset.dob) setDob(preset.dob);
    if (preset.state) setState(preset.state);
    if (preset.hobbies) setHobbies(preset.hobbies);
    if (preset.experience) setExperience(preset.experience);
    if (preset.expertTradition) setExpertTradition(preset.expertTradition);
    setActiveTab('LOGIN');
    setErrorMsg('');
  };

  // Step 1: Submit Credentials
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const current = roleData[selectedRole];

    // If User is Logging In: Must verify against Backend Database
    if (activeTab === 'LOGIN') {
      try {
        const user = await api.loginUser({
          email: email.trim(),
          password,
          role: current.roleKey
        });

        // Backend login succeeded! Proceed to dashboard
        onLoginSuccess(current.roleKey, current.targetView, user);
      } catch (err) {
        // Shishya/Guru must register first before login
        setErrorMsg(err.message || 'Account not found. Please register first.');
      }
      return;
    }

    // If User is Signing Up (Registering first):
    if (selectedRole === 'ADMIN') {
      try {
        const user = await api.registerUser({
          email: email.trim(),
          password,
          role: 'AUTHORITY',
          name: fullName || current.name,
          profileCompleted: true
        });
        onLoginSuccess('AUTHORITY', current.targetView, user);
      } catch (err) {
        setErrorMsg(err.message || 'Admin registration failed.');
      }
      return;
    }

    // For Shishya and Guru, open mandatory details form to complete registration
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
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const current = roleData[selectedRole];

    // Mandatory validation for ID proof across both roles
    if (!idNumber.trim()) {
      setErrorMsg(`Mandatory ${idType} Number is required.`);
      return;
    }
    if (!idProofFileName.trim() && !idProofFile) {
      setErrorMsg(`Mandatory upload of ${idType} Document is required.`);
      return;
    }

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
        setErrorMsg('Hobbies & Cultural Interests are mandatory for Shishya.');
        return;
      }
      if (!state) {
        setErrorMsg('State selection is mandatory.');
        return;
      }

      try {
        const registeredUser = await api.registerUser({
          email: email.trim(),
          password: password || 'password123',
          name: detailFullName.trim(),
          role: current.roleKey,
          dob,
          hobbies: hobbies.trim(),
          state,
          idType,
          idNumber: idNumber.trim(),
          idProofFileName: idProofFileName || `${idType.toLowerCase().replace(/\s+/g, '_')}_document.pdf`,
          profileCompleted: true
        });

        onLoginSuccess(current.roleKey, current.targetView, registeredUser);
      } catch (err) {
        setErrorMsg(err.message || 'Registration failed in backend.');
      }
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

      try {
        const registeredUser = await api.registerUser({
          email: email.trim(),
          password: password || 'password123',
          name: detailFullName.trim(),
          role: current.roleKey,
          state,
          dob,
          experience: experience.trim(),
          expertTradition: expertTradition.trim(),
          idType,
          idNumber: idNumber.trim(),
          idProofFileName: idProofFileName || `${idType.toLowerCase().replace(/\s+/g, '_')}_document.pdf`,
          profileCompleted: true
        });

        onLoginSuccess(current.roleKey, current.targetView, registeredUser);
      } catch (err) {
        setErrorMsg(err.message || 'Registration failed in backend.');
      }
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
                  onClick={() => {
                    setActiveTab('LOGIN');
                    setErrorMsg('');
                  }}
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
                  onClick={() => {
                    setActiveTab('SIGNUP');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                    activeTab === 'SIGNUP'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Sign Up (Register)
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleAuthSubmit} className="p-6 sm:p-7 space-y-4">
                
                {/* Error Banner with helpful register link */}
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex flex-col gap-1.5 animate-shake">
                    <div className="flex items-start gap-2 font-semibold">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                    {activeTab === 'LOGIN' && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('SIGNUP');
                          setErrorMsg('');
                        }}
                        className="text-[11px] font-bold text-red-700 underline text-left hover:text-red-900 cursor-pointer pl-6"
                      >
                        → Click here to Register as {roleData[selectedRole].title} with your details first
                      </button>
                    )}
                  </div>
                )}
                
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
                    : activeTab === 'LOGIN'
                      ? `Log In as ${roleData[selectedRole].title}`
                      : `Continue to Mandatory ${roleData[selectedRole].title} Details →`}
                </button>



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

              {/* MANDATORY ID PROOF UPLOAD SECTION (Aadhaar, PAN, Voter ID, Passport) */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-800" />
                    <span>Mandatory Identity Verification (ID Proof) <span className="text-red-500">*</span></span>
                  </label>
                  <span className="text-[10px] font-extrabold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    Mandatory
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* ID Type */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Select ID Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={idType}
                      onChange={(e) => setIdType(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#104333] cursor-pointer font-medium"
                      required
                    >
                      <option value="Aadhaar Card">Aadhaar Card</option>
                      <option value="PAN Card">PAN Card</option>
                      <option value="Voter ID">Voter ID</option>
                      <option value="Passport">Passport</option>
                      <option value="Government Cultural ID">Government Cultural ID</option>
                    </select>
                  </div>

                  {/* ID Number */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      {idType} Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder={idType === 'Aadhaar Card' ? 'e.g. 1234-5678-9012' : idType === 'PAN Card' ? 'e.g. ABCDE1234F' : 'e.g. WB123456789'}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#104333]"
                      required
                    />
                  </div>
                </div>

                {/* File Upload Box */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1 flex items-center justify-between">
                    <span>Upload {idType} Document / Photo <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-stone-400 font-normal">PDF, JPG, PNG (Max 5MB)</span>
                  </label>
                  
                  <div className="relative border-2 border-dashed border-stone-300 hover:border-emerald-600 bg-white p-3 rounded-xl text-center transition cursor-pointer group">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setIdProofFile(e.target.files[0]);
                          setIdProofFileName(e.target.files[0].name);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    
                    {idProofFileName ? (
                      <div className="flex items-center justify-between px-2 text-xs font-bold text-emerald-800">
                        <span className="flex items-center gap-1.5 truncate">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="truncate">{idProofFileName}</span>
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md shrink-0">
                          Uploaded & Verified
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-1 text-stone-500">
                        <span className="text-xs font-bold text-stone-700 group-hover:text-emerald-800">
                          📁 Click or drag file to upload mandatory {idType} proof
                        </span>
                        <span className="text-[10px] text-stone-400 mt-0.5">Mandatory government identity verification</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

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
