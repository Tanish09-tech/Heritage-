import React, { useState } from 'react';
import { ChevronLeft, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { TRADITION_CATEGORIES } from '../data/heritageData';

export default function AddTraditionView({ onBack, onSaveTradition }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    state: '',
    district: '',
    community: '',
    language: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const states = [
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

  const languages = [
    'Marathi',
    'Hindi',
    'Rajasthani',
    'Malayalam',
    'Bengali',
    'Assamese',
    'Gondi',
    'Gujarati',
    'Kannada',
    'Tamil'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      alert('Please fill out the tradition name and category.');
      return;
    }

    const newTradition = {
      id: `trad-${Date.now()}`,
      name: formData.name,
      displayName: formData.name,
      marathiName: formData.name,
      category: formData.category,
      categoryDisplay: formData.category,
      secondaryCategory: "Heritage",
      region: `${formData.district || 'Regional'}, ${formData.state || 'India'}`,
      district: formData.district || 'Regional',
      state: formData.state || 'Maharashtra',
      community: formData.community || 'Local Knowledge Holders',
      language: formData.language || 'Regional',
      score: 48,
      status: "VULNERABLE",
      statusLabel: "Vulnerable",
      statusDetail: "Recently Registered Tradition",
      color: "#ea580c",
      bgClass: "bg-orange-50 text-orange-700 border-orange-200",
      image: "/images/powada.jpg",
      description: formData.description || "Newly registered living heritage tradition.",
      activePractitioners: 10,
      activeLearners: 2,
      avgAge: 58,
      trainingAvailability: "Low",
      practiceFrequency: "Monthly",
      aiInsights: [
        "New community submission",
        "Verification pending by Zonal Reviewer"
      ]
    };

    onSaveTradition(newTradition);
    setSubmitted(true);
    setTimeout(() => {
      onBack();
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1 mb-2 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Traditions</span>
        </button>

        <h1 className="text-2xl font-bold font-sans text-stone-900">
          Add Tradition
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Register a New Tradition
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
            Added to living heritage database. Redirecting to traditions explorer...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="blueprint-card p-6 sm:p-8 space-y-6">
          
          <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-3">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Tradition Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Tradition Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter tradition name"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
                required
              >
                <option value="">Select category</option>
                {TRADITION_CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* State */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                State
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
              >
                <option value="">Select state</option>
                {states.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                District
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="Enter district (e.g. Pune, Satara)"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
              />
            </div>

            {/* Community / Region */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Community / Region
              </label>
              <input
                type="text"
                value={formData.community}
                onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                placeholder="Enter community or region"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
              >
                <option value="">Select language</option>
                {languages.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-stone-100">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#133e31] hover:bg-[#0e2d23] text-white font-bold text-xs tracking-wide shadow-md transition transform active:scale-98"
            >
              Save & Continue
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
