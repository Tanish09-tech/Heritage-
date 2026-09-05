import React from 'react';
import { 
  ChevronLeft, 
  Activity, 
  Users, 
  Sparkles, 
  Calendar, 
  GraduationCap, 
  Clock, 
  FileText, 
  ShieldAlert 
} from 'lucide-react';

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
    aiInsights: [
      "Low learner participation",
      "Few identified apprentices",
      "Irregular training opportunities",
      "Knowledge concentrated among few practitioners"
    ]
  };

  const isCritical = currentTradition.score <= 40;
  const isVulnerable = currentTradition.score > 40 && currentTradition.score < 70;

  return (
    <div className="space-y-6">
      
      {/* Back Button & Title Header */}
      <div>
        <button
          onClick={onBack}
          className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1 mb-2 transition"
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
                {currentTradition.categoryDisplay || "Oral Tradition"}
              </span>
              {currentTradition.secondaryCategory && (
                <span className="text-[11px] font-semibold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-md border border-stone-200">
                  {currentTradition.secondaryCategory}
                </span>
              )}
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-200">
                {currentTradition.state}
              </span>
            </div>
          </div>

          {/* Connect Action */}
          <button
            onClick={onNavigateToMatching}
            className="px-4 py-2 rounded-xl bg-[#133e31] hover:bg-[#0e2d23] text-white text-xs font-bold shadow transition flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>Find Master Practitioners</span>
          </button>
        </div>
      </div>

      {/* Top 2-Column Banner: Left Photo Banner + Right Radial Gauge Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Photo Banner */}
        <div className="lg:col-span-7 blueprint-card overflow-hidden h-64 relative bg-stone-900">
          <img
            src={currentTradition.image || "/images/powada.jpg"}
            alt={currentTradition.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
            <div className="text-white">
              <span className="text-xs font-medium text-amber-300">Intangible Cultural Legacy</span>
              <h3 className="text-lg font-bold">{currentTradition.name} Performance Guild</h3>
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
            {currentTradition.statusDetail || "Transmission at Critical Risk"}
          </div>
        </div>

      </div>

      {/* Bottom 2-Column Section: About + Key Indicators vs AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: About + 5 Key Indicators */}
        <div className="lg:col-span-7 space-y-6">
          <div className="blueprint-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-stone-900">
              About this Tradition
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {currentTradition.description}
            </p>

            {/* Key Indicators Header */}
            <div className="pt-4 border-t border-stone-100">
              <h4 className="text-xs font-bold text-stone-800 mb-3">
                Key Indicators
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
                  AI Insights
                </h3>
              </div>

              {/* Bullet list of insights matching Screen 7 */}
              <ul className="space-y-3 text-xs text-stone-600">
                {(currentTradition.aiInsights || [
                  "Low learner participation",
                  "Few identified apprentices",
                  "Irregular training opportunities",
                  "Knowledge concentrated among few practitioners"
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
                className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200 transition flex items-center justify-center gap-2"
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
