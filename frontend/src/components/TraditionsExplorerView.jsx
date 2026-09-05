import React, { useState } from 'react';
import { Search, Plus, Filter, Sparkles, ChevronRight } from 'lucide-react';
import { TRADITION_CATEGORIES } from '../data/heritageData';

export default function TraditionsExplorerView({ 
  traditions, 
  onSelectTradition, 
  onOpenAddTradition 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTraditions = traditions.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || 
                            t.category.toLowerCase() === activeCategory.toLowerCase() ||
                            (t.secondaryCategory && t.secondaryCategory.toLowerCase() === activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
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

        {/* Add Tradition Button */}
        <button
          onClick={onOpenAddTradition}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#133e31] hover:bg-[#0e2d23] text-white text-xs font-bold shadow transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Tradition</span>
        </button>

      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TRADITION_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
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
              <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                <img
                  src={tradition.image}
                  alt={tradition.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* State Tag */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-stone-800 px-2.5 py-0.5 rounded-md shadow-xs">
                  {tradition.state}
                </div>
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
