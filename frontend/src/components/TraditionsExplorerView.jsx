import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Sparkles, ChevronRight } from 'lucide-react';
import { TRADITION_CATEGORIES } from '../data/heritageData';
import { getTraditionImage, getCategoryFallback, validateTraditionImages } from '../utils/imageResolver';

export default function TraditionsExplorerView({ 
  traditions, 
  onSelectTradition, 
  onOpenAddTradition,
  currentRole = 'AUTHORITY'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [genderFilter, setGenderFilter] = useState('ALL'); // 'ALL' | 'Women' | 'Men'

  const isAdmin = currentRole === 'AUTHORITY';

  useEffect(() => {
    if (import.meta?.env?.MODE !== 'production') {
      validateTraditionImages(traditions);
    }
  }, [traditions]);

  const filteredTraditions = traditions.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || 
                            t.category.toLowerCase() === activeCategory.toLowerCase();
    
    // Gender match filter for Traditional Clothes
    let matchesGender = true;
    if (activeCategory === 'Traditional Clothes' && genderFilter !== 'ALL') {
      matchesGender = t.gender ? t.gender.toLowerCase() === genderFilter.toLowerCase() : false;
    } else if (genderFilter !== 'ALL') {
      matchesGender = !t.gender || (t.gender && t.gender.toLowerCase() === genderFilter.toLowerCase());
    }

    return matchesSearch && matchesCategory && matchesGender;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search traditions..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition shadow-2xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
        </div>

        {/* Add Tradition Button - ADMIN (AUTHORITY) ONLY */}
        {isAdmin ? (
          <button
            onClick={onOpenAddTradition}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#133e31] hover:bg-[#0e2d23] text-[#f4efe6] text-xs font-bold shadow transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Tradition (Admin Only)</span>
          </button>
        ) : (
          <div className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-3 py-2 rounded-xl border border-stone-200">
            ℹ️ Tradition registration restricted to Admin (Ministry Authority)
          </div>
        )}

      </div>

      {/* Category Filter Pills & Gender Sub-Filter */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {TRADITION_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  if (cat !== 'Traditional Clothes') {
                    setGenderFilter('ALL');
                  }
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white font-bold shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Gender Toggle Sub-Bar - ONLY APPEARS IN TRADITIONAL CLOTHES */}
        {activeCategory === 'Traditional Clothes' && (
          <div className="flex items-center gap-2 bg-stone-100/90 p-1.5 rounded-xl border border-stone-200/80 w-fit animate-fadeIn">
            <button
              onClick={() => setGenderFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                genderFilter === 'ALL'
                  ? 'bg-[#133e31] text-[#f4efe6] shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              <span>👔</span> All Attire
            </button>
            <button
              onClick={() => setGenderFilter('Women')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                genderFilter === 'Women'
                  ? 'bg-[#133e31] text-[#f4efe6] shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              <span>👩</span> Women's Clothes
            </button>
            <button
              onClick={() => setGenderFilter('Men')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                genderFilter === 'Men'
                  ? 'bg-[#133e31] text-[#f4efe6] shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              <span>👨</span> Men's Clothes
            </button>
          </div>
        )}
      </div>

      {/* 3x2 / Grid of Tradition Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTraditions.map((tradition) => {
          const isCritical = tradition.status === 'CRITICAL';
          const isVulnerable = tradition.status === 'VULNERABLE';

          return (
            <div
              key={tradition.id}
              onClick={() => onSelectTradition(tradition)}
              className="blueprint-card overflow-hidden cursor-pointer group transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative h-64 sm:h-72 w-full bg-stone-100 overflow-hidden">
                <img
                  src={getTraditionImage(tradition)}
                  alt={tradition.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getCategoryFallback(tradition.category, tradition.state);
                  }}
                  className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* State Tag */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-stone-800 px-2.5 py-0.5 rounded-md shadow-xs">
                  {tradition.state}
                </div>

                {/* Gender Tag (if traditional clothes or tagged) */}
                {tradition.gender && (
                  <div className={`absolute top-3 right-3 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md shadow-xs flex items-center gap-1 backdrop-blur-xs ${
                    tradition.gender.toLowerCase() === 'women'
                      ? 'bg-amber-100/95 text-amber-900 border border-amber-300'
                      : 'bg-emerald-100/95 text-emerald-900 border border-emerald-300'
                  }`}>
                    <span>{tradition.gender.toLowerCase() === 'women' ? '👩' : '👨'}</span>
                    <span>{tradition.gender}'s Clothes</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-900 transition">
                      {tradition.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-1">
                    {tradition.description}
                  </p>
                </div>

                {/* Score & Status Pill Footer */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-xs font-bold text-stone-800">
                    <span className="text-sm font-black">{tradition.score}</span>
                    <span className="text-stone-400 font-normal">/100</span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isCritical
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : isVulnerable
                      ? 'bg-orange-50 text-orange-700 border border-orange-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {tradition.statusLabel}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
