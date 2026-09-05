import React, { useState } from 'react';
import { 
  Activity, 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  ShieldCheck, 
  Sliders,
  CheckCircle2 
} from 'lucide-react';

export default function AiAnalysisView({ onUpdateTraditionScore, traditions }) {
  const [practitioners, setPractitioners] = useState(18);
  const [learners, setLearners] = useState(3);
  const [trainingFrequency, setTrainingFrequency] = useState('Monthly');
  const [youthParticipation, setYouthParticipation] = useState('Low');
  const [trainingAvailability, setTrainingAvailability] = useState('Low');
  const [documentationAvailability, setDocumentationAvailability] = useState('Low');

  const [analyzedScore, setAnalyzedScore] = useState(32);
  const [analyzedStatus, setAnalyzedStatus] = useState('Critical');
  const [analyzedRiskText, setAnalyzedRiskText] = useState('High risk of transmission gap');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const calculateDynamicScore = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      let score = 0;

      // Practitioners impact (0-25)
      if (practitioners > 40) score += 25;
      else if (practitioners > 20) score += 18;
      else if (practitioners > 10) score += 10;
      else score += 5;

      // Learners impact (0-30)
      if (learners > 20) score += 30;
      else if (learners > 10) score += 20;
      else if (learners > 5) score += 12;
      else score += 5;

      // Frequency impact (0-15)
      if (trainingFrequency === 'Daily') score += 15;
      else if (trainingFrequency === 'Weekly') score += 10;
      else if (trainingFrequency === 'Monthly') score += 5;
      else score += 2;

      // Youth participation (0-15)
      if (youthParticipation === 'High') score += 15;
      else if (youthParticipation === 'Moderate') score += 10;
      else score += 4;

      // Availability (0-10)
      if (trainingAvailability === 'High') score += 10;
      else if (trainingAvailability === 'Medium') score += 6;
      else score += 3;

      // Documentation (0-5)
      if (documentationAvailability === 'High') score += 5;
      else if (documentationAvailability === 'Medium') score += 3;
      else score += 1;

      const finalScore = Math.min(100, Math.max(10, score));
      setAnalyzedScore(finalScore);

      if (finalScore >= 70) {
        setAnalyzedStatus('Strong');
        setAnalyzedRiskText('Low risk of transmission gap • Healthy transmission');
      } else if (finalScore >= 50) {
        setAnalyzedStatus('Vulnerable');
        setAnalyzedRiskText('Moderate transmission risk • Needs support');
      } else {
        setAnalyzedStatus('Critical');
        setAnalyzedRiskText('High risk of transmission gap');
      }

      setIsAnalyzing(false);
    }, 400);
  };

  const getContributingFactors = () => {
    const factors = [];
    if (learners < 10) factors.push('Low learner participation');
    if (learners < 5) factors.push('Few identified apprentices');
    if (trainingFrequency === 'Monthly' || trainingFrequency === 'Seasonal') factors.push('Irregular training opportunities');
    if (practitioners < 25) factors.push('Knowledge concentrated among few practitioners');
    if (youthParticipation === 'Low' || youthParticipation === 'Very Low') factors.push('Aging practitioner demographic without succession');
    if (documentationAvailability === 'Low') factors.push('Lack of digital audio-visual repertoire archives');

    return factors.length > 0 ? factors : ['Robust intergenerational practice and active training ecosystem'];
  };

  const isCritical = analyzedScore <= 45;
  const isVulnerable = analyzedScore > 45 && analyzedScore < 70;

  return (
    <div className="space-y-6">
      
      {/* View Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-sans text-stone-900">
            AI Heritage Analysis
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Living Heritage Transmission Risk Predictor
          </p>
        </div>
      </div>

      {/* Main 2 Columns matching Screen 12 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Indicators Form */}
        <div className="lg:col-span-6">
          <div className="blueprint-card p-6 sm:p-7 space-y-4">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-3">
              Input Indicators
            </h3>

            {/* Form Fields */}
            <div className="space-y-3.5 text-xs">
              
              {/* Active Practitioners */}
              <div className="flex items-center justify-between gap-4">
                <label className="font-semibold text-stone-700">
                  Active Practitioners
                </label>
                <input
                  type="number"
                  value={practitioners}
                  onChange={(e) => setPractitioners(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-bold text-right focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>

              {/* Active Learners */}
              <div className="flex items-center justify-between gap-4">
                <label className="font-semibold text-stone-700">
                  Active Learners
                </label>
                <input
                  type="number"
                  value={learners}
                  onChange={(e) => setLearners(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-bold text-right focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>

              {/* Training Frequency */}
              <div className="flex items-center justify-between gap-4">
                <label className="font-semibold text-stone-700">
                  Training Frequency
                </label>
                <select
                  value={trainingFrequency}
                  onChange={(e) => setTrainingFrequency(e.target.value)}
                  className="w-32 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
              </div>

              {/* Youth Participation */}
              <div className="flex items-center justify-between gap-4">
                <label className="font-semibold text-stone-700">
                  Youth Participation
                </label>
                <select
                  value={youthParticipation}
                  onChange={(e) => setYouthParticipation(e.target.value)}
                  className="w-32 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30"
                >
                  <option value="High">High</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Low">Low</option>
                  <option value="Very Low">Very Low</option>
                </select>
              </div>

              {/* Training Availability */}
              <div className="flex items-center justify-between gap-4">
                <label className="font-semibold text-stone-700">
                  Training Availability
                </label>
                <select
                  value={trainingAvailability}
                  onChange={(e) => setTrainingAvailability(e.target.value)}
                  className="w-32 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Documentation Availability */}
              <div className="flex items-center justify-between gap-4">
                <label className="font-semibold text-stone-700">
                  Documentation Availability
                </label>
                <select
                  value={documentationAvailability}
                  onChange={(e) => setDocumentationAvailability(e.target.value)}
                  className="w-32 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

            </div>

            {/* Analyze Now Button matching Screen 12 */}
            <div className="pt-4 border-t border-stone-100">
              <button
                onClick={calculateDynamicScore}
                disabled={isAnalyzing}
                className="w-full py-3 rounded-xl bg-[#133e31] hover:bg-[#0e2d23] text-white font-bold text-xs tracking-wide shadow-md transition transform active:scale-98 flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Analyze Now</span>
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: AI Analysis Result matching Screen 12 */}
        <div className="lg:col-span-6">
          <div className="blueprint-card p-6 sm:p-7 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-3">
                AI Analysis Result
              </h3>

              {/* Radial Score Gauge & Status Tag */}
              <div className="flex flex-col sm:flex-row items-center gap-6 py-6 border-b border-stone-100">
                
                {/* Radial Gauge */}
                <div 
                  style={{
                    background: `conic-gradient(${isCritical ? '#dc2626' : isVulnerable ? '#ea580c' : '#16a34a'} 0% ${analyzedScore}%, #e2e8f0 ${analyzedScore}% 100%)`
                  }}
                  className="relative w-28 h-28 rounded-full flex items-center justify-center shadow-inner shrink-0"
                >
                  <div className="w-20 h-20 rounded-full bg-white flex flex-col items-center justify-center shadow-xs">
                    <span className="text-2xl font-black text-stone-900 leading-none">
                      {analyzedScore}
                    </span>
                    <span className="text-[10px] text-stone-400 font-semibold mt-0.5">
                      /100
                    </span>
                  </div>
                </div>

                {/* Status Text */}
                <div className="space-y-1.5 text-center sm:text-left">
                  <span className={`text-xs font-bold px-3 py-1 rounded-md inline-block ${
                    isCritical
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : isVulnerable
                      ? 'bg-orange-50 text-orange-700 border border-orange-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {analyzedStatus}
                  </span>
                  <p className="text-xs text-stone-500 font-medium">
                    {analyzedRiskText}
                  </p>
                </div>

              </div>

              {/* Top Contributing Factors List matching Screen 12 */}
              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-bold text-stone-800">
                  Top Contributing Factors
                </h4>

                <ul className="space-y-2.5 text-xs text-stone-600">
                  {getContributingFactors().map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-stone-400 mt-0.5">•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Summary Pill */}
            <div className="pt-4 border-t border-stone-100 mt-6 text-right">
              <span className="text-[11px] text-stone-400 font-medium">
                Algorithm: HTHS 7-Factor Weighted Early Warning Engine
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
