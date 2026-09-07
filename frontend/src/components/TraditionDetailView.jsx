import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Activity, 
  Users, 
  Sparkles, 
  Calendar, 
  GraduationCap, 
  Clock, 
  FileText, 
  ShieldAlert,
  Utensils,
  Shirt,
  Music,
  Languages,
  BookOpen,
  Wand2
} from 'lucide-react';
import { api } from '../services/api';
import { getTraditionImage, getCategoryFallback } from '../utils/imageResolver';

export default function TraditionDetailView({ 
  tradition, 
  onBack, 
  onNavigateToMatching, 
  onNavigateToAiAnalysis 
}) {
  const currentTradition = tradition || {
    id: "powada-01",
    name: "Powada",
    categoryDisplay: "Oral Tradition",
    secondaryCategory: "Music",
    state: "Maharashtra",
    score: 32,
    statusLabel: "Critical",
    statusDetail: "Transmission at Critical Risk",
    image: "/images/powada.jpg",
    description: "Powada is a traditional Marathi ballad style that narrates the heroic tales of Maratha warriors and Chhatrapati Shivaji Maharaj. It is primarily performed by Shahirs with energetic storytelling, Daf percussion, and traditional music.",
    activePractitioners: 18,
    activeLearners: 3,
    avgAge: 62,
    trainingAvailability: "Low",
    practiceFrequency: "Monthly",
    traditionalFood: "Puran Poli & Modak",
    traditionalClothes: "Nauvari Saree & Dhoti Pheta",
    folkArts: "Shahiri Powada & Lavani",
    language: "Marathi (Varli Dialect)",
    aiInsights: [
      "Low learner participation",
      "Few identified apprentices",
      "Irregular training opportunities",
      "Knowledge concentrated among few practitioners"
    ]
  };

  const isCritical = currentTradition.score <= 40;
  const isVulnerable = currentTradition.score > 40 && currentTradition.score < 70;

  // Derive attribute images or fetch from Gemini API
  const foodName = currentTradition.traditionalFood || `${currentTradition.state || 'Indian'} Traditional Culinary Feast`;
  const clothesName = currentTradition.traditionalClothes || `${currentTradition.state || 'Indian'} Traditional Heritage Attire`;
  const folkName = currentTradition.folkArts || `${currentTradition.name} Folk & Performing Art`;
  const langName = currentTradition.language || `${currentTradition.state || 'Regional'} Native Dialect`;

  // Visual Image helper based on keyword matching
  const getFoodImage = () => {
    const fn = foodName.toLowerCase();
    if (fn.includes('puran') || fn.includes('modak')) return 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80';
    if (fn.includes('makki') || fn.includes('saag')) return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80';
    if (fn.includes('dhokla') || fn.includes('thali')) return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80';
    if (fn.includes('sadya') || fn.includes('appam')) return 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80';
    return 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80';
  };

  const getClothesImage = () => {
    const cn = clothesName.toLowerCase();
    if (cn.includes('kullu') || cn.includes('shawl') || cn.includes('kinnauri') || cn.includes('pahari') || cn.includes('pattu') || cn.includes('rezta') || cn.includes('chola') || cn.includes('himachal')) return '/images/kullu_shawls.jpg';
    if (cn.includes('nauvari') || cn.includes('paithani')) return 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';
    if (cn.includes('phulkari') || cn.includes('patiala')) return 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80';
    if (cn.includes('garba') || cn.includes('chaniya')) return 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80';
    if (cn.includes('kasavu') || cn.includes('mundu')) return 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80';
    return 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';
  };

  const getFolkImage = () => {
    const fn = folkName.toLowerCase();
    if (fn.includes('powada') || fn.includes('lavani') || fn.includes('warli')) return '/images/warli.jpg';
    if (fn.includes('bhangra') || fn.includes('giddha')) return 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80';
    if (fn.includes('kathakali') || fn.includes('theyyam')) return 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80';
    return '/images/dhangari.jpg';
  };

  return (
    <div className="space-y-6">
      
      {/* Back Button & Title Header */}
      <div>
        <button
          onClick={onBack}
          className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1 mb-2 transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Traditions</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans text-stone-900">
              {currentTradition.name}
            </h1>
            
            {/* Tag Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-[11px] font-semibold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-md border border-stone-200">
                {currentTradition.categoryDisplay || currentTradition.category || "Oral Tradition"}
              </span>
              {currentTradition.secondaryCategory && (
                <span className="text-[11px] font-semibold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-md border border-stone-200">
                  {currentTradition.secondaryCategory}
                </span>
              )}
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-200">
                {currentTradition.state}
              </span>
              {currentTradition.gender && (
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border flex items-center gap-1 ${
                  currentTradition.gender.toLowerCase() === 'women'
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                }`}>
                  <span>{currentTradition.gender.toLowerCase() === 'women' ? '👩' : '👨'}</span>
                  <span>{currentTradition.gender}'s Traditional Clothes</span>
                </span>
              )}
            </div>
          </div>

          {/* Connect Action */}
          <button
            onClick={onNavigateToMatching}
            className="px-4 py-2 rounded-xl bg-[#133e31] hover:bg-[#0e2d23] text-[#f4efe6] text-xs font-bold shadow transition flex items-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Find Master Practitioners</span>
          </button>
        </div>
      </div>

      {/* Top 2-Column Banner: Left Photo Banner + Right Radial Gauge Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Photo Banner */}
        <div className="lg:col-span-7 blueprint-card overflow-hidden h-80 sm:h-[400px] relative bg-stone-900">
          <img
            src={getTraditionImage(currentTradition)}
            alt={currentTradition.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getCategoryFallback(currentTradition.category, currentTradition.state);
            }}
            className="w-full h-full object-cover object-[center_30%] opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
            <div className="text-white space-y-0.5">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Google Gemini AI Cultural Dossier • {currentTradition.state}</span>
              </span>
              <h3 className="text-xl font-black">{currentTradition.name} Living Heritage</h3>
            </div>
          </div>
        </div>

        {/* Right Radial Score Card */}
        <div className="lg:col-span-5 blueprint-card p-6 flex flex-col justify-center items-center text-center">
          <div className="text-xs font-bold text-stone-700 mb-4">
            Heritage Transmission Health Score
          </div>

          {/* Radial Gauge */}
          <div className="relative w-32 h-32 rounded-full radial-gauge-critical flex items-center justify-center shadow-inner">
            <div className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center shadow-xs">
              <span className="text-3xl font-black text-stone-900 leading-none">
                {currentTradition.score}
              </span>
              <span className="text-[10px] text-stone-400 font-semibold mt-0.5">
                / 100
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              isCritical
                ? 'bg-red-50 text-red-700 border border-red-200'
                : isVulnerable
                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {currentTradition.statusLabel}
            </span>
          </div>

          <div className="text-xs text-stone-500 mt-2 font-medium">
            {currentTradition.statusDetail || "Transmission at Risk"}
          </div>
        </div>

      </div>

      {/* State Cultural Attributes Visual Showcase Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-purple-700" />
            <span>State Cultural Heritage Visual Attributes ({currentTradition.state})</span>
          </h3>
          <span className="text-[11px] font-semibold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
            Powered by Google Gemini API
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Traditional Food */}
          <div className="blueprint-card overflow-hidden bg-amber-50/30 border-amber-200/80 p-3.5 space-y-2">
            <div className="relative h-28 w-full rounded-xl overflow-hidden bg-amber-100">
              <img
                src={getFoodImage()}
                alt={foodName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-amber-900/80 text-amber-100 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <Utensils className="w-3 h-3" />
                <span>Culinary Heritage</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-amber-950 line-clamp-1">{foodName}</div>
              <p className="text-[10px] text-amber-800/80 mt-0.5">Authentic recipe & traditional food of {currentTradition.state}</p>
            </div>
          </div>

          {/* Card 2: Traditional Clothes */}
          <div className="blueprint-card overflow-hidden bg-indigo-50/30 border-indigo-200/80 p-3.5 space-y-2">
            <div className="relative h-28 w-full rounded-xl overflow-hidden bg-indigo-100">
              <img
                src={getClothesImage()}
                alt={clothesName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-indigo-900/80 text-indigo-100 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <Shirt className="w-3 h-3" />
                <span>Traditional Attire</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-indigo-950 line-clamp-1">{clothesName}</div>
              <p className="text-[10px] text-indigo-800/80 mt-0.5">Handwoven traditional apparel & ornaments of {currentTradition.state}</p>
            </div>
          </div>

          {/* Card 3: Folk Arts */}
          <div className="blueprint-card overflow-hidden bg-purple-50/30 border-purple-200/80 p-3.5 space-y-2">
            <div className="relative h-28 w-full rounded-xl overflow-hidden bg-purple-100">
              <img
                src={getFolkImage()}
                alt={folkName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-purple-900/80 text-purple-100 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <Music className="w-3 h-3" />
                <span>Folk & Performing Arts</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-purple-950 line-clamp-1">{folkName}</div>
              <p className="text-[10px] text-purple-800/80 mt-0.5">Living oral & musical performance arts of {currentTradition.state}</p>
            </div>
          </div>

          {/* Card 4: Language & Dialects */}
          <div className="blueprint-card overflow-hidden bg-emerald-50/30 border-emerald-200/80 p-3.5 space-y-2">
            <div className="relative h-28 w-full rounded-xl overflow-hidden bg-emerald-900/10 flex items-center justify-center p-3 text-center">
              <div className="space-y-1">
                <Languages className="w-6 h-6 text-emerald-800 mx-auto" />
                <div className="text-xs font-black text-emerald-950">{langName}</div>
                <div className="text-[9px] font-semibold text-emerald-700 uppercase tracking-wider">Indigenous Dialect</div>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-emerald-950 line-clamp-1">{langName}</div>
              <p className="text-[10px] text-emerald-800/80 mt-0.5">Linguistic medium of heritage transmission in {currentTradition.state}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Gemini AI Detailed Cultural Significance Section */}
      <div className="blueprint-card p-6 bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-stone-100 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Detailed Cultural Significance & Historical Roots (Google Gemini AI Analysis)</span>
          </h3>
          <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30">
            Verified Heritage Significance
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-300">
          <div className="bg-stone-800/60 p-4 rounded-xl border border-stone-700/60 space-y-1.5">
            <h4 className="font-bold text-amber-300 text-xs">🏛️ Historical Origin & How It Started</h4>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              {currentTradition.historyOrigin || `${currentTradition.name} originated as an integral living expression in ${currentTradition.state}, holding centuries of intergenerational wisdom passed down orally through master practitioners.`}
            </p>
          </div>

          <div className="bg-stone-800/60 p-4 rounded-xl border border-stone-700/60 space-y-1.5">
            <h4 className="font-bold text-emerald-300 text-xs">🌾 Cultural Purpose & Reason Behind It</h4>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              {currentTradition.reasonBehindIt || `Functions as a cohesive cultural pillar for local communities in ${currentTradition.state}, fostering ritual bonding, seasonal celebration, and identity preservation.`}
            </p>
          </div>

          <div className="bg-stone-800/60 p-4 rounded-xl border border-stone-700/60 space-y-1.5">
            <h4 className="font-bold text-purple-300 text-xs">✨ Craftsmanship & Performance Method</h4>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              {currentTradition.fullDetails || `Practiced using traditional handloom weaving, specialized tools, indigenous dialects, and authentic regional garments of ${currentTradition.state}.`}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom 2-Column Section: About + Key Indicators vs AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: About + 5 Key Indicators */}
        <div className="lg:col-span-7 space-y-6">
          <div className="blueprint-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-800" />
              <span>Full Description & Detailed Heritage Dossier</span>
            </h3>
            <div className="text-xs sm:text-sm text-stone-700 leading-relaxed space-y-3 font-sans border-l-3 border-amber-500 pl-4 py-2 bg-amber-50/20 rounded-r-xl">
              {typeof currentTradition.description === 'string' && currentTradition.description.includes('\n') ? (
                currentTradition.description.split(/\n\s*\n/).map((para, idx) => (
                  <p key={idx} className="leading-relaxed text-stone-800 font-normal">
                    {para.trim()}
                  </p>
                ))
              ) : (
                <p className="leading-relaxed text-stone-800 font-normal">{currentTradition.description}</p>
              )}
            </div>

            {/* Key Indicators Header */}
            <div className="pt-4 border-t border-stone-100">
              <h4 className="text-xs font-bold text-stone-800 mb-3">
                Key Transmission Indicators
              </h4>
              
              {/* 5 Indicators Boxes in a Row */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
                
                {/* Active Practitioners */}
                <div className="bg-stone-50 border border-stone-200/70 p-3 rounded-xl">
                  <div className="text-[10px] text-stone-500 font-medium leading-tight">
                    Active Practitioners
                  </div>
                  <div className="text-base font-extrabold text-stone-900 mt-1">
                    {currentTradition.activePractitioners || 18}
                  </div>
                </div>

                {/* Active Learners */}
                <div className="bg-stone-50 border border-stone-200/70 p-3 rounded-xl">
                  <div className="text-[10px] text-stone-500 font-medium leading-tight">
                    Active Learners
                  </div>
                  <div className="text-base font-extrabold text-stone-900 mt-1">
                    {currentTradition.activeLearners || 3}
                  </div>
                </div>

                {/* Average Age */}
                <div className="bg-stone-50 border border-stone-200/70 p-3 rounded-xl">
                  <div className="text-[10px] text-stone-500 font-medium leading-tight">
                    Average Age
                  </div>
                  <div className="text-base font-extrabold text-stone-900 mt-1">
                    {currentTradition.avgAge || 62} yrs
                  </div>
                </div>

                {/* Training Availability */}
                <div className="bg-stone-50 border border-stone-200/70 p-3 rounded-xl">
                  <div className="text-[10px] text-stone-500 font-medium leading-tight">
                    Training Availability
                  </div>
                  <div className="text-base font-extrabold text-red-600 mt-1">
                    {currentTradition.trainingAvailability || "Low"}
                  </div>
                </div>

                {/* Practice Frequency */}
                <div className="bg-stone-50 border border-stone-200/70 p-3 rounded-xl">
                  <div className="text-[10px] text-stone-500 font-medium leading-tight">
                    Practice Frequency
                  </div>
                  <div className="text-base font-extrabold text-stone-900 mt-1">
                    {currentTradition.practiceFrequency || "Monthly"}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Insights */}
        <div className="lg:col-span-5">
          <div className="blueprint-card p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-stone-900">
                  AI Insights & Action Plan
                </h3>
              </div>

              {/* Bullet list of insights matching Screen 7 */}
              <ul className="space-y-3 text-xs text-stone-600">
                {(currentTradition.aiInsights || [
                  "Low learner participation across regional hubs",
                  "Few identified apprentices for direct transmission",
                  "Irregular training opportunities in remote clusters",
                  "Knowledge concentrated among senior master practitioners"
                ]).map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-stone-400 mt-0.5">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Action Simulation Button */}
            <div className="pt-6 border-t border-stone-100 mt-6">
              <button
                onClick={onNavigateToAiAnalysis}
                className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Activity className="w-4 h-4 text-emerald-700" />
                <span>Simulate Score in AI Analysis</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
