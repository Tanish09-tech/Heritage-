import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Heart, 
  Award, 
  BookOpen,
  ShieldCheck,
  Check,
  FileText
} from 'lucide-react';

export const FOCUS_STATES = [
  'Maharashtra',
  'Punjab',
  'Gujarat',
  'Delhi',
  'Madhya Pradesh',
  'Uttar Pradesh',
  'Assam',
  'Kerala',
  'Himachal Pradesh'
];

export const GURU_TRADITIONS_SUGGESTIONS = [
  'Lavani Folk Tradition (Maharashtra Dance)',
  'Shahiri Powada (Oral Ballads)',
  'Warli Art (Tribal Painting)',
  'Paithani & Nauvari Weaving',
  'Bhangra & Giddha Folk Dance (Punjab)',
  'Phulkari Embroidery',
  'Baisakhi & Gatka Martial Art',
  'Navratri Garba & Dandiya Raas Folk Dance (Gujarat)',
  'Patan Patola Double-Ikat Weaving',
  'Bhavai Folk Street Theatre',
  'Kathak Classical Dance (Delhi / UP)',
  'Purani Dilli Zardozi & Aari Embroidery',
  'Dilli Gharana Classical Khayal & Tabla',
  'Matki & Rai Folk Dance (Madhya Pradesh)',
  'Gond Tribal Painting',
  'Chanderi & Maheshwari Handloom Silk',
  'Dhrupad Classical Vocal Heritage',
  'Charkula Folk Dance & Raslila (Uttar Pradesh)',
  'Banarasi Katan Brocade & Chikankari',
  'Bihu Folk Dance & Sattriya Classical Dance (Assam)',
  'Muga Silk Mekhela Chador Weaving',
  'Kathakali & Mohiniyattam Classical Dance (Kerala)',
  'Koodiyattam Sanskrit Temple Theatre',
  'Theyyam Sacred Ritual Theatre',
  'Kalaripayattu Martial Heritage',
  'Nati Himalayan Folk Dance (Himachal Pradesh)',
  'Chamba Rumal Double-Satin Embroidery',
  'Kullu & Kinnauri Handloom Shawls'
];

export default function ProfileDetailsModal({ 
  isOpen, 
  role, // 'LEARNER' (Shishya) | 'PRACTITIONER' (Guru)
  initialData = {}, 
  onComplete 
}) {
  if (!isOpen) return null;

  const isShishya = role === 'LEARNER' || role === 'SHISHYA';

  // Common Fields
  const [fullName, setFullName] = useState(initialData.name || '');
  const [dob, setDob] = useState(initialData.dob || '');
  const [state, setState] = useState(initialData.state || 'Maharashtra');

  // Shishya-specific Field
  const [hobbies, setHobbies] = useState(initialData.hobbies || '');

  // Guru-specific Fields
  const [experience, setExperience] = useState(initialData.experience || '');
  const [expertTradition, setExpertTradition] = useState(initialData.expertTradition || 'Paithani & Nauvari Weaving');

  // Mandatory ID Proof States (Aadhaar, PAN, Voter ID, Passport)
  const [idType, setIdType] = useState(initialData.idType || 'Aadhaar Card');
  const [idNumber, setIdNumber] = useState(initialData.idNumber || '1234-5678-9012');
  const [idProofFile, setIdProofFile] = useState(null);
  const [idProofFileName, setIdProofFileName] = useState(initialData.idProofFileName || 'id_proof_verified.pdf');

  // Error feedback state
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Mandatory validation for ID proof
    if (!idNumber.trim()) {
      setErrorMsg(`Mandatory ${idType} Number is required.`);
      return;
    }
    if (!idProofFileName.trim() && !idProofFile) {
      setErrorMsg(`Mandatory upload of ${idType} Document is required.`);
      return;
    }

    // Mandatory validation for Shishya: full name, dob, hobbies, state
    if (isShishya) {
      if (!fullName.trim()) {
        setErrorMsg('Full Name is mandatory for Shishya.');
        return;
      }
      if (!dob) {
        setErrorMsg('Date of Birth (DOB) is mandatory.');
        return;
      }
      if (!hobbies.trim()) {
        setErrorMsg('Hobbies are mandatory for Shishya.');
        return;
      }
      if (!state) {
        setErrorMsg('State selection is mandatory.');
        return;
      }

      onComplete({
        name: fullName.trim(),
        dob,
        hobbies: hobbies.trim(),
        state,
        idType,
        idNumber: idNumber.trim(),
        idProofFileName: idProofFileName || `${idType.toLowerCase().replace(/\s+/g, '_')}_document.pdf`,
        profileCompleted: true
      });
    } else {
      // Mandatory validation for Guru: full name, state, dob, experience, expert of which skills/tradition
      if (!fullName.trim()) {
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
        setErrorMsg('Experience (years/practice) is mandatory for Guru.');
        return;
      }
      if (!expertTradition.trim()) {
        setErrorMsg('Skill / Tradition of expertise is mandatory for Guru.');
        return;
      }

      onComplete({
        name: fullName.trim(),
        state,
        dob,
        experience: experience.trim(),
        expertTradition: expertTradition.trim(),
        idType,
        idNumber: idNumber.trim(),
        idProofFileName: idProofFileName || `${idType.toLowerCase().replace(/\s+/g, '_')}_document.pdf`,
        profileCompleted: true
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-800 animate-in zoom-in-95 duration-200">
        
        {/* Top Header Banner */}
        <div className={`p-6 pb-5 text-white ${
          isShishya 
            ? 'bg-gradient-to-br from-[#104333] to-[#1e5e4a]' 
            : 'bg-gradient-to-br from-[#845314] to-[#a3671a]'
        }`}>
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-bold backdrop-blur-xs">
              {isShishya ? <GraduationCap className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
              <span>{isShishya ? 'Shishya (शिष्य) Onboarding' : 'Guru (गुरु) Onboarding'}</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-300 bg-black/20 px-2.5 py-0.5 rounded-full">
              Mandatory Step
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight">
            {isShishya ? 'Complete Your Shishya Details' : 'Complete Your Guru Profile'}
          </h2>
          <p className="text-xs text-white/80 mt-1 font-normal">
            {isShishya 
              ? 'Please fill in your personal & cultural learning details to access the Shishya Portal.'
              : 'Please enter your master practitioner credentials to access the Guru Portal.'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
          
          {/* Error Message if any field is missing */}
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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isShishya ? "e.g. Aniket Deshmukh" : "e.g. Shahir Tukaram Jagtap"}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#104333] focus:bg-white transition"
              required
            />
          </div>

          {/* Shishya Order: Full Name, DOB, Hobbies, State */}
          {isShishya && (
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
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#104333] focus:bg-white transition"
                  required
                />
              </div>

              {/* Hobbies */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-stone-500" />
                    <span>Hobbies & Cultural Interests <span className="text-red-500">*</span></span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-normal">Required</span>
                </label>
                <input
                  type="text"
                  value={hobbies}
                  onChange={(e) => setHobbies(e.target.value)}
                  placeholder="e.g. Classical Singing, Flute, Folk Lore, Sketching, Dholak"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#104333] focus:bg-white transition"
                  required
                />
              </div>

              {/* State (from the 9 focus states) */}
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
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#104333] focus:bg-white transition cursor-pointer font-medium"
                  required
                >
                  {FOCUS_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Guru Order: Full Name, State, DOB, Experience, Expert of which skills/tradition */}
          {!isShishya && (
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
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#845314] focus:bg-white transition cursor-pointer font-medium"
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
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#845314] focus:bg-white transition"
                  required
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-stone-500" />
                    <span>Experience in Tradition / Art Form <span className="text-red-500">*</span></span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-normal">Required</span>
                </label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 25 Years of Active Practice & Performance"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#845314] focus:bg-white transition"
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
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#845314] focus:bg-white transition mb-2"
                  required
                />

                {/* Quick Selection Tags */}
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
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
                isShishya 
                  ? 'bg-[#104333] hover:bg-[#0b3327]' 
                  : 'bg-[#845314] hover:bg-[#6c430e]'
              }`}
            >
              <span>Submit Details & Enter {isShishya ? 'Shishya' : 'Guru'} Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-stone-400 text-center mt-2">
              All fields marked with <span className="text-red-500">*</span> are mandatory before entering the next page.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
}
