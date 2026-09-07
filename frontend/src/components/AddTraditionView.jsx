import React, { useState } from 'react';
import { ChevronLeft, Plus, Sparkles, CheckCircle2, Utensils, Shirt, Music, Languages, Image, Loader2, Wand2 } from 'lucide-react';
import { TRADITION_CATEGORIES } from '../data/heritageData';
import { api } from '../services/api';

export const STATE_PRESETS = {
  Maharashtra: {
    foods: ['Puran Poli & Modak', 'Misal Pav', 'Pitla Bhakri', 'Sol Kadhi', 'Vada Pav'],
    languages: ['Marathi', 'Varli Dialect', 'Koli Marathi', 'Malvani', 'Konkani'],
    clothes: ['Nauvari Saree', 'Paithani Saree', 'Dhoti & Pheta', 'Kolhapuri Chappal'],
    folkArts: ['Lavani Folk Dance', 'Shahiri Powada', 'Gondhal'],
    oralTraditions: ['Shahiri Powada Akhada', 'Dhangari Gaja Chants', 'Bharud Oral Satire', 'Abhang Varkari Recitation']
  },
  Punjab: {
    foods: ['Makki di Roti & Sarson da Saag', 'Amritsari Kulcha', 'Chole Bhature', 'Lassi & Butter'],
    languages: ['Punjabi (Gurmukhi)', 'Puadhi', 'Majhi', 'Doabi'],
    clothes: ['Phulkari Dupatta & Suit', 'Patiala Salwar', 'Kurta-Pajama & Turban (Pagg)', 'Jutti'],
    folkArts: ['Bhangra Folk Dance', 'Giddha Folk Dance', 'Gatka Martial Art', 'Jugni Folk Music'],
    oralTraditions: ['Punjabi Qissa Recitation', 'Dhadhi Vaar Heroic Ballads', 'Heer Ranjha Qissa']
  },
  Gujarat: {
    foods: ['Gujarati Thali & Undhiyu', 'Dhokla & Fafda', 'Kutchi Dabeli', 'Handvo & Thepla'],
    languages: ['Gujarati', 'Kutchi Dialect', 'Surti', 'Kathiyawadi'],
    clothes: ['Chaniya Choli (Garba)', 'Patan Patola Saree', 'Kediyu & Chorno', 'Bandhani Dupatta'],
    folkArts: ['Navratri Garba Folk Dance', 'Dandiya Raas Dance', 'Bhavai Folk Theatre', 'Rogan Fabric Art', 'Dayro'],
    oralTraditions: ['Bhavai Oral Legend Recitation', 'Kutchi Folk Dayro Storytelling', 'Garba Oral Chants']
  },
  Delhi: {
    foods: ['Purani Dilli Mughlai Biryani', 'Awadhi Dum Pukht', 'Nihari & Sheermal', 'Chandni Chowk Chaat'],
    languages: ['Hindi', 'Urdu', 'Hindustani', 'Punjabi', 'Haryanvi'],
    clothes: ['Purani Dilli Zardozi Silk Lehenga & Anarkali Suit (Women)', 'Purani Dilli Royal Brocade Sherwani & Kurta Pyjama (Men)'],
    folkArts: ['Kathak Classical Dance', 'Dilli Gharana Khayal', 'Qawwali Heritage', 'Zardozi Embroidery'],
    oralTraditions: ['Dastangoi Urdu Storytelling', 'Dilli Gharana Oral Bandish Transmission', 'Sufi Qawwali Verses']
  },
  'Madhya Pradesh': {
    foods: ['Malwi Bafla & Dal', 'Bhutte Ka Kees', 'Poha Jalebi', 'Gondi Mahua Stew'],
    languages: ['Hindi', 'Malwi', 'Nimadi', 'Gondi', 'Bhili', 'Bundelkhandi'],
    clothes: ['Chanderi Silk Saree', 'Maheshwari Handloom', 'Lugra & Bandi'],
    folkArts: ['Matki Folk Dance', 'Rai Folk Dance', 'Gond Tribal Painting', 'Bhagoria Tribal Art', 'Dhrupad Vocal'],
    oralTraditions: ['Pandavani Epic Recitation', 'Alha-Udal Heroic Ballads', 'Gondi Oral Lore']
  },
  'Uttar Pradesh': {
    foods: ['Awadhi Dum Biryani', 'Galouti Kebab', 'Banarasi Paan', 'Mathura Peda & Bedmi Puri'],
    languages: ['Hindi', 'Awadhi', 'Bhojpuri', 'Braj Bhasha', 'Urdu'],
    clothes: ['Banarasi Katan Silk Saree', 'Lucknowi Chikankari Kurta', 'Dhoti-Kurta & Topi'],
    folkArts: ['Kathak Classical Dance', 'Charkula Folk Dance', 'Raslila Dance Performance', 'Kajari Folk Song', 'Nautanki'],
    oralTraditions: ['Alha-Khand Epic Recitation', 'Awadhi Birha Ballad Storytelling', 'Bhojpuri Kajari Lore']
  },
  Assam: {
    foods: ['Masor Tenga (Sour Fish)', 'Pitha & Laru', 'Khaar (Alkaline Stew)', 'Duck Meat Curry'],
    languages: ['Assamese', 'Brajavali', 'Bodo', 'Mishing'],
    clothes: ['Muga Silk Mekhela Chador', 'Gamosa (Sacred Towel)', 'Tangaliya'],
    folkArts: ['Bihu Folk Dance', 'Sattriya Classical Dance', 'Sattriya Borgeet', 'Ojapali Chorus', 'Pepa & Dhol Music'],
    oralTraditions: ['Borgeet Sattriya Oral Chanting', 'Kirtan Ghosha Recitation', 'Ojapali Oral Chorus']
  },
  Kerala: {
    foods: ['Authentic Sadya Feast', 'Appam & Stew', 'Puttu & Kadala', 'Malabar Biryani', 'Payasam'],
    languages: ['Malayalam', 'Sanskrit (Koodiyattam)', 'Tulu'],
    clothes: ['Kasavu Mundu & Setu Saree', 'Neriyathu', 'Mundu-Vetti'],
    folkArts: ['Kathakali Classical Dance', 'Mohiniyattam Classical Dance', 'Theyyam Ritual Dance', 'Koodiyattam Sanskrit Theatre', 'Kalaripayattu', 'Thrissur Pooram'],
    oralTraditions: ['Chakyar Koothu Temple Monologue', 'Villuppattu Bow-Song Storytelling', 'Vadakkan Pattukal Legends']
  },
  'Himachal Pradesh': {
    foods: ['Kangri Dham Feast', 'Siddu & Ghee', 'Madra & Chha Gosht', 'Tudkiya Bhath'],
    languages: ['Pahari', 'Himachali', 'Kangri', 'Mandiali', 'Kinnauri'],
    clothes: ['Kullu & Kinnauri Shawls', 'Himachal Pahari Cap', 'Pattu & Rezta', 'Chola-Dora'],
    folkArts: ['Nati Folk Dance', 'Kullu Dussehra Procession', 'Chamba Rumal Craft', 'Pahari Miniature Painting'],
    oralTraditions: ['Himachali Ainchali Devotional Ballads', 'Jhoori Pahari Folk Couplets', 'Gaddi Himalayan Lore']
  }
};

export default function AddTraditionView({ onBack, onSaveTradition }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cultural Art',
    description: '',
    state: 'Maharashtra',
    district: '',
    community: '',
    language: 'Marathi',
    traditionalFood: '',
    traditionalClothes: '',
    folkArts: '',
    image: '/images/powada.jpg'
  });

  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const states = Object.keys(STATE_PRESETS);
  const currentPresets = STATE_PRESETS[formData.state] || STATE_PRESETS['Maharashtra'];

  const handleGenerateGeminiImage = async () => {
    if (!formData.name) {
      alert('Please enter a Tradition Name first!');
      return;
    }
    setIsGeneratingImage(true);
    setAiMessage('🤖 Gemini AI is generating authentic cultural image...');

    try {
      const res = await api.generateGeminiImage({
        traditionTitle: formData.name,
        state: formData.state,
        category: formData.category,
        description: formData.description
      });

      if (res && res.imageUrl) {
        setFormData(prev => ({ ...prev, image: res.imageUrl }));
        setAiMessage(`✨ ${res.message || 'Image generated successfully!'}`);
      }
    } catch (err) {
      console.error(err);
      setAiMessage('⚠️ Gemini AI image generation fallback applied.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newTradition = {
      id: `tradition-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      state: formData.state,
      district: formData.district || 'State Wide',
      community: formData.community || 'All Communities',
      language: formData.language,
      description: formData.description || `Authentic living heritage tradition of ${formData.name} native to ${formData.state}.`,
      traditionalFood: formData.traditionalFood,
      traditionalClothes: formData.traditionalClothes,
      folkArts: formData.folkArts,
      image: formData.image || ((formData.state === 'Himachal Pradesh' || (formData.traditionalClothes && formData.traditionalClothes.toLowerCase().includes('shawl'))) ? '/images/kullu_shawls.jpg' : '/images/powada.jpg'),
      urgency: 'Medium',
      preservationScore: 68,
      practitionerCount: 1500,
      vulnerabilityMetrics: {
        practitionerAgeDistribution: { youth: 15, adult: 40, elder: 45 },
        learnerParticipation: 25,
        intergenerationalParticipation: 30,
        transmissionFrequency: 45,
        trainingEcosystem: 30,
        practiceContinuity: 50,
        documentationAvailability: 40
      },
      aiInsights: [
        "State preset cultural attributes applied",
        "Gemini Cultural AI Image generated"
      ]
    };

    onSaveTradition(newTradition);
    setSubmitted(true);
    setTimeout(() => {
      onBack();
    }, 1200);
  };

  const handleSelectState = (selectedState) => {
    const presets = STATE_PRESETS[selectedState] || {};
    setFormData({
      ...formData,
      state: selectedState,
      language: presets.languages ? presets.languages[0] : formData.language,
      traditionalFood: presets.foods ? presets.foods[0] : '',
      traditionalClothes: presets.clothes ? presets.clothes[0] : '',
      folkArts: presets.folkArts ? presets.folkArts[0] : ''
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1 mb-2 transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Traditions</span>
        </button>

        <h1 className="text-2xl font-bold font-sans text-stone-900">
          Register Living Heritage Tradition
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Select state to unlock authentic traditional foods, languages, attire, and AI image generation.
        </p>
      </div>

      {submitted ? (
        <div className="blueprint-card p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">
            Tradition Successfully Registered!
          </h3>
          <p className="text-xs text-stone-500">
            Saved to PostgreSQL & Living Heritage Database. Redirecting...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="blueprint-card p-6 sm:p-8 space-y-6">
          
          <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>1. Basic Tradition Info & State Selection</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* State Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                Select State (9 Focus Regions)
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleSelectState(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-emerald-50/60 border border-emerald-300 text-stone-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 transition cursor-pointer"
                required
              >
                {states.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                Heritage Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
                required
              >
                {TRADITION_CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Gender Attire Option - ONLY APPEARS IF CATEGORY IS TRADITIONAL CLOTHES */}
            {formData.category === 'Traditional Clothes' && (
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  Target Gender (For Attire / Clothes)
                </label>
                <select
                  value={formData.gender || 'Women'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-amber-50/60 border border-amber-300 text-stone-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 transition cursor-pointer"
                >
                  <option value="Women">Women's Traditional Attire</option>
                  <option value="Men">Men's Traditional Attire</option>
                </select>
              </div>
            )}

            {/* Tradition Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Tradition Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Shahiri Powada, Garba, Kalaripayattu, Siddu Feast"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
                required
              />
            </div>

          </div>

          {/* Gemini AI Image Generator Field */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Image className="w-4 h-4 text-indigo-600" />
                <span>Heritage Image URL & Gemini AI Generator</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateGeminiImage}
                disabled={isGeneratingImage}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white flex items-center gap-1.5 shadow-xs transition transform active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Gemini AI Thinking...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5 text-purple-200" />
                    <span>✨ Generate Image with Gemini API</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Image URL or generated Gemini image..."
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600/30"
              />
              <img
                src={formData.image}
                alt="Preview"
                onError={(e) => { e.target.onerror = null; e.target.src = '/images/hero.jpg'; }}
                className="w-12 h-12 rounded-xl object-cover border border-stone-300 shadow-2xs bg-stone-100"
              />
            </div>

            {aiMessage && (
              <p className="text-[11px] font-medium text-purple-900 bg-purple-50 p-2 rounded-xl border border-purple-100">
                {aiMessage}
              </p>
            )}
          </div>

          {/* Dynamic State Options Header */}
          <div className="pt-2 border-t border-stone-100">
            <h2 className="text-sm font-bold text-stone-900 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-700" />
                <span>2. State Cultural Attributes ({formData.state})</span>
              </span>
              <span className="text-[10px] font-medium bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                Click chips to fill
              </span>
            </h2>
            <p className="text-[11px] text-stone-500">
              State-specific options populated automatically for {formData.state}:
            </p>
          </div>

          {/* 4 State Attribute Options Grid */}
          <div className="space-y-4">
            
            {/* A. Traditional Food */}
            <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-2">
              <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-amber-700" />
                <span>Traditional Food / Culinary Heritage ({formData.state})</span>
              </label>
              <input
                type="text"
                value={formData.traditionalFood}
                onChange={(e) => setFormData({ ...formData, traditionalFood: e.target.value })}
                placeholder={`Traditional food of ${formData.state}...`}
                className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-amber-200 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-amber-600"
              />
              {/* Presets Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentPresets.foods?.map((food, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, traditionalFood: food })}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 transition shadow-2xs cursor-pointer"
                  >
                    + {food}
                  </button>
                ))}
              </div>
            </div>

            {/* B. Language & Dialects */}
            <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-2">
              <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-emerald-700" />
                <span>Regional Language & Native Dialects ({formData.state})</span>
              </label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                placeholder={`Native language of ${formData.state}...`}
                className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-emerald-200 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
              />
              {/* Presets Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentPresets.languages?.map((lang, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, language: lang })}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 transition shadow-2xs cursor-pointer"
                  >
                    + {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* C. Traditional Clothes */}
            <div className="p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-200/80 space-y-2">
              <label className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-indigo-700" />
                <span>Traditional Clothes & Attire ({formData.state})</span>
              </label>
              <input
                type="text"
                value={formData.traditionalClothes}
                onChange={(e) => setFormData({ ...formData, traditionalClothes: e.target.value })}
                placeholder={`Traditional clothes of ${formData.state}...`}
                className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-indigo-200 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              />
              {/* Presets Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentPresets.clothes?.map((cloth, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, traditionalClothes: cloth })}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white hover:bg-indigo-100 border border-indigo-300 text-indigo-900 transition shadow-2xs cursor-pointer"
                  >
                    + {cloth}
                  </button>
                ))}
              </div>
            </div>

            {/* D. Folk / Performing Arts */}
            <div className="p-3.5 bg-purple-50/50 rounded-2xl border border-purple-200/80 space-y-2">
              <label className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-purple-700" />
                <span>Folk & Performing Arts Traditions ({formData.state})</span>
              </label>
              <input
                type="text"
                value={formData.folkArts}
                onChange={(e) => setFormData({ ...formData, folkArts: e.target.value })}
                placeholder={`Folk art or dance of ${formData.state}...`}
                className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-purple-200 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-purple-600"
              />
              {/* Presets Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentPresets.folkArts?.map((folk, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, folkArts: folk })}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white hover:bg-purple-100 border border-purple-300 text-purple-900 transition shadow-2xs cursor-pointer"
                  >
                    + {folk}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Additional Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                District / Region
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="e.g. Pune, Palghar, Kullu, Thrissur"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Community / Clan
              </label>
              <input
                type="text"
                value={formData.community}
                onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                placeholder="e.g. Shahirs, Warli Community, Artisans"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
              />
            </div>
          </div>



          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Cultural Description & Historical Notes (Paragraph Format)
            </label>
            <textarea
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter detailed multi-paragraph description of the living heritage tradition (Origins, Cultural Rationale, Craftsmanship & Performance)..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
            />
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-stone-100">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#133e31] hover:bg-[#0e2d23] text-white font-bold text-xs tracking-wide shadow-md transition transform active:scale-98 cursor-pointer"
            >
              Save & Register Living Tradition
            </button>
          </div>

        </form>
      )}

    </div>
  );
}

