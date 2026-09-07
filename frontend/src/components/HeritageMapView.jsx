import React, { useState, useMemo, useRef } from 'react';
import { 
  MapPin, 
  Layers, 
  ChevronRight, 
  Compass, 
  Sparkles,
  Eye,
  Flame,
  Info
} from 'lucide-react';
import { getTraditionImage, getCategoryFallback } from '../utils/imageResolver';

// Indian states data - Strictly containing the 9 active focus states
export const INDIA_STATES_DATA = [
  {
    id: "MH",
    name: "Maharashtra",
    aliases: ["Maharashtra", "MH"],
    zone: "WEST",
    code: "MH",
    center: { x: 33.1, y: 62.6 }
  },
  {
    id: "PB",
    name: "Punjab",
    aliases: ["Punjab", "PB"],
    zone: "NORTH",
    code: "PB",
    center: { x: 31.5, y: 22.7 }
  },
  {
    id: "GJ",
    name: "Gujarat",
    aliases: ["Gujarat", "Gujrat", "GJ"],
    zone: "WEST",
    code: "GJ",
    center: { x: 17.7, y: 50.3 }
  },
  {
    id: "DL",
    name: "Delhi",
    aliases: ["Delhi", "New Delhi", "DL", "NCT of Delhi"],
    zone: "NORTH",
    code: "DL",
    center: { x: 36.5, y: 28.5 }
  },
  {
    id: "MP",
    name: "Madhya Pradesh",
    aliases: ["Madhya Pradesh", "MP"],
    zone: "CENTRAL",
    code: "MP",
    center: { x: 46.4, y: 51.4 }
  },
  {
    id: "UP",
    name: "Uttar Pradesh",
    aliases: ["Uttar Pradesh", "UP"],
    zone: "CENTRAL",
    code: "UP",
    center: { x: 52.6, y: 35.0 }
  },
  {
    id: "AS",
    name: "Assam",
    aliases: ["Assam", "Assaam", "AS"],
    zone: "EAST",
    code: "AS",
    center: { x: 86.0, y: 36.5 }
  },
  {
    id: "KL",
    name: "Kerala",
    aliases: ["Kerala", "KL"],
    zone: "SOUTH",
    code: "KL",
    center: { x: 29.2, y: 88.0 }
  },
  {
    id: "HP",
    name: "Himachal Pradesh",
    aliases: ["Himachal Pradesh", "HP"],
    zone: "NORTH",
    code: "HP",
    center: { x: 39.1, y: 18.9 }
  }
];

// Helper to find corresponding state data from a tradition state name
export function matchStateObject(stateName) {
  if (!stateName) return null;
  const clean = stateName.toLowerCase().trim();
  const directMatch = INDIA_STATES_DATA.find(s => 
    s.name.toLowerCase() === clean || 
    s.aliases.some(a => a.toLowerCase() === clean)
  );
  if (directMatch) return directMatch;
  // Partial match
  const partialMatch = INDIA_STATES_DATA.find(s => 
    clean.includes(s.name.toLowerCase()) || 
    s.aliases.some(a => clean.includes(a.toLowerCase()))
  );
  return partialMatch || null;
}

export default function HeritageMapView({ traditions, onSelectTradition }) {
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedPinId, setSelectedPinId] = useState('powada-01');
  const [hoveredState, setHoveredState] = useState(null);
  const mapContainerRef = useRef(null);

  // Harmonize traditions with only the 9 allowed states
  const allTraditions = useMemo(() => {
    return (traditions || [])
      .map((t) => {
        const stateObj = matchStateObject(t.state);
        if (!stateObj) return null;
        return {
          ...t,
          marathi: t.marathiName || t.marathi || t.name,
          stateObj: stateObj,
          zone: t.zone || stateObj.zone,
          state: stateObj.name
        };
      })
      .filter(Boolean);
  }, [traditions]);

  // Current active state object strictly follows selectedState
  const activeStateObj = useMemo(() => {
    return matchStateObject(selectedState) || INDIA_STATES_DATA[0];
  }, [selectedState]);

  // Display state for header/badges (shows hovered or selected)
  const displayStateObj = useMemo(() => {
    return matchStateObject(hoveredState || selectedState) || activeStateObj;
  }, [hoveredState, selectedState, activeStateObj]);

  // Traditions belonging to the active selected state
  const stateTraditions = useMemo(() => {
    return allTraditions.filter(t => t.stateObj.id === activeStateObj.id);
  }, [allTraditions, activeStateObj]);

  // Selected tradition for the bottom dossier card
  const selectedTradition = useMemo(() => {
    return allTraditions.find(t => t.id === selectedPinId) || stateTraditions[0] || allTraditions[0];
  }, [allTraditions, selectedPinId, stateTraditions]);

  // Pre-calculate count of traditions per state for quick map badges
  const stateTraditionCounts = useMemo(() => {
    const counts = {};
    allTraditions.forEach(t => {
      const sid = t.stateObj.id;
      counts[sid] = (counts[sid] || 0) + 1;
    });
    return counts;
  }, [allTraditions]);

  // Calculate risk stats for the 9 states
  const riskStats = useMemo(() => {
    const counts = { STRONG: 0, VULNERABLE: 0, CRITICAL: 0 };
    allTraditions.forEach(t => {
      if (counts[t.status] !== undefined) counts[t.status]++;
    });
    return counts;
  }, [allTraditions]);

  // Handle selecting a state
  const handleStateSelect = (stateName) => {
    setSelectedState(stateName);
    const targetObj = matchStateObject(stateName);
    if (targetObj && selectedZone !== 'ALL' && selectedZone !== targetObj.zone) {
      setSelectedZone('ALL');
    }
    // Auto-select first tradition in this state if available
    if (targetObj) {
      const traditionsInTarget = allTraditions.filter(t => t.stateObj.id === targetObj.id);
      if (traditionsInTarget.length > 0) {
        setSelectedPinId(traditionsInTarget[0].id);
      }
    }
  };

  // Click on the map image calculates the closest state among the 9 active states
  const handleMapClick = (e) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    let closest = null;
    let minDistance = Infinity;

    INDIA_STATES_DATA.forEach((st) => {
      if (selectedZone !== 'ALL' && st.zone !== selectedZone) return;
      const dist = Math.hypot(clickX - st.center.x, clickY - st.center.y);
      if (dist < minDistance) {
        minDistance = dist;
        closest = st;
      }
    });

    // Proximity threshold: select closest state when clicking on map
    if (closest && minDistance < 25) {
      handleStateSelect(closest.name);
    }
  };

  return (
    <div className="space-y-4 font-sans text-stone-800">
      
      {/* Top Header & Dropdown Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Left Header Title */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#2e3e55] flex items-center justify-center text-amber-300 font-bold shadow-xs">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-stone-900 font-cinzel">
                Pan-India Living Heritage Map
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#3b4d66]/10 text-[#2e3e55] border border-[#3b4d66]/30">
                {activeStateObj.name} Focus
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Living cultural cartography across 9 focus states • Click any state on the map to inspect its living traditions
            </p>
          </div>
        </div>

        {/* Upper Right: Zone Dropdown & State Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Zone Dropdown List restricted to active zones */}
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3.5 py-2 rounded-xl shadow-2xs">
            <Layers className="w-4 h-4 text-stone-400" />
            <span className="text-xs font-semibold text-stone-500">Zone:</span>
            <select
              value={selectedZone}
              onChange={(e) => {
                const z = e.target.value;
                setSelectedZone(z);
                if (z !== 'ALL') {
                  const stateInZone = INDIA_STATES_DATA.find(s => s.zone === z);
                  if (stateInZone) handleStateSelect(stateInZone.name);
                }
              }}
              className="bg-transparent text-xs font-bold text-stone-900 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Focus States ({INDIA_STATES_DATA.length})</option>
              <option value="WEST">West Zone (Maharashtra, Gujarat)</option>
              <option value="NORTH">North Zone (Punjab, Himachal Pradesh, Delhi)</option>
              <option value="CENTRAL">Central Zone (Madhya Pradesh, Uttar Pradesh)</option>
              <option value="SOUTH">South Zone (Kerala)</option>
              <option value="EAST">East Zone (Assam)</option>
            </select>
          </div>

          {/* State Quick Selector restricted to the 9 states */}
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3.5 py-2 rounded-xl shadow-2xs">
            <MapPin className="w-4 h-4 text-[#3b4d66]" />
            <span className="text-xs font-semibold text-stone-500">State:</span>
            <select
              value={selectedState}
              onChange={(e) => handleStateSelect(e.target.value)}
              className="bg-transparent text-xs font-bold text-stone-900 focus:outline-hidden cursor-pointer max-w-[200px]"
            >
              {INDIA_STATES_DATA.map((st) => {
                const count = stateTraditionCounts[st.id] || 0;
                return (
                  <option key={st.id} value={st.name}>
                    {st.name} {count > 0 ? `(${count} traditions)` : ''}
                  </option>
                );
              })}
            </select>
          </div>

        </div>

      </div>

      {/* Main Map Container: Clean Ivory Canvas displaying the authentic political map */}
      <div className="relative bg-[#fbfaf6] rounded-3xl border border-stone-300/80 overflow-hidden shadow-md min-h-[640px] flex flex-col lg:flex-row items-center justify-between p-4 sm:p-6 gap-6">
        

        {/* Center: Real Political Heritage Map with Overlay Layers */}
        <div className="relative flex-1 w-full flex items-center justify-center my-4 lg:my-0">
          <div 
            ref={mapContainerRef}
            onClick={handleMapClick}
            className="relative w-full max-w-[620px] aspect-[701/788] cursor-pointer rounded-2xl overflow-visible select-none transition-all duration-300 group"
          >
            {/* The Authentic Map Image */}
            <img 
              src="/images/india_map.jpg" 
              alt="India Living Heritage Political Map"
              className="w-full h-full object-contain filter drop-shadow-md rounded-2xl pointer-events-auto"
              draggable="false"
            />

            {/* Zone Filter Dimming Mask */}
            {selectedZone !== 'ALL' && (
              <div className="absolute inset-0 rounded-2xl pointer-events-none bg-stone-900/10 transition-opacity duration-300" />
            )}

            {/* Clean State Markers for the 9 states */}
            {INDIA_STATES_DATA.map((st) => {
              const isSelected = activeStateObj.id === st.id;
              const isHovered = hoveredState === st.name;
              const count = stateTraditionCounts[st.id] || 0;
              const isZoneMatch = selectedZone === 'ALL' || st.zone === selectedZone;

              return (
                <div
                  key={st.id}
                  style={{ left: `${st.center.x}%`, top: `${st.center.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-200 pointer-events-auto cursor-pointer ${
                    !isZoneMatch ? 'opacity-30 pointer-events-none' : 'opacity-100'
                  }`}
                  onMouseEnter={() => setHoveredState(st.name)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStateSelect(st.name);
                  }}
                >
                  {/* Selected State Highlight Pulse / Ring */}
                  {isSelected && (
                    <div className="absolute -inset-4 flex items-center justify-center pointer-events-none">
                      <span className="absolute w-12 h-12 rounded-full bg-amber-500/25 animate-ping" />
                      <span className="absolute w-8 h-8 rounded-full bg-amber-600/30 border-2 border-amber-500 animate-pulse" />
                    </div>
                  )}

                  {/* Clean State Heritage Marker Badge */}
                  <div className={`relative flex items-center justify-center transition-transform duration-200 ${
                    isSelected 
                      ? 'scale-125 z-30' 
                      : isHovered 
                      ? 'scale-115 z-20' 
                      : 'hover:scale-110'
                  }`}>
                    <div className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 shadow-md border transition-all ${
                      isSelected
                        ? 'bg-[#2e3e55] text-amber-300 border-amber-400 ring-2 ring-amber-400/50'
                        : isHovered
                        ? 'bg-[#2563eb] text-white border-white ring-2 ring-blue-300'
                        : 'bg-white/95 text-stone-800 border-stone-300 hover:bg-[#2e3e55] hover:text-white'
                    }`}>
                      <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{st.name}</span>
                      <span className="bg-amber-400/30 text-amber-900 px-1.5 py-0.2 rounded-full text-[10px] font-black">
                        {count}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}

            {/* Bottom-Right Stamp */}
            <div className="absolute bottom-2 right-2 pointer-events-none bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-stone-200 text-[9px] font-bold text-stone-500 tracking-wider uppercase">
              9 Focus States GIS
            </div>

          </div>
        </div>

        {/* Right Side: Floating Information Panels */}
        <div className="w-full lg:w-[310px] shrink-0 flex flex-col gap-4 pointer-events-auto">
          
          {/* CARD 1: Risk Overview */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-xs text-stone-900 tracking-wide uppercase flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Focus States Risk Overview</span>
              </h4>
              <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                {allTraditions.length} Total
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-2.5">
                <div className="font-extrabold text-sm text-emerald-700">{riskStats.STRONG}</div>
                <div className="text-[10px] font-semibold text-emerald-800">Strong</div>
              </div>
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5">
                <div className="font-extrabold text-sm text-amber-700">{riskStats.VULNERABLE}</div>
                <div className="text-[10px] font-semibold text-amber-800">Vulnerable</div>
              </div>
              <div className="bg-red-50/70 border border-red-200 rounded-xl p-2.5">
                <div className="font-extrabold text-sm text-red-700">{riskStats.CRITICAL}</div>
                <div className="text-[10px] font-semibold text-red-800">Critical</div>
              </div>
            </div>
          </div>

          {/* CARD 2: Traditions in Active State */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-xs text-stone-900 truncate">
                  Traditions in {activeStateObj.name}
                </h4>
                <p className="text-[10px] text-stone-500">
                  {stateTraditions.length} cultural forms documented
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#2e3e55] bg-[#3b4d66]/10 px-2 py-0.5 rounded-md">
                {activeStateObj.code}
              </span>
            </div>

            {/* Scrollable list of traditions */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              {stateTraditions.length > 0 ? (
                stateTraditions.map((trad) => {
                  const isSelected = selectedPinId === trad.id;
                  const isCritical = trad.status === 'CRITICAL';
                  const isVulnerable = trad.status === 'VULNERABLE';

                  return (
                    <div
                      key={trad.id}
                      onClick={() => setSelectedPinId(trad.id)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl transition cursor-pointer border ${
                        isSelected 
                          ? 'bg-amber-50/90 border-amber-400 shadow-xs ring-1 ring-amber-300' 
                          : 'bg-stone-50/70 hover:bg-stone-100 border-stone-200/70'
                      }`}
                    >
                      {/* Avatar */}
                      <img 
                        src={getTraditionImage(trad)} 
                        alt={trad.name} 
                        loading="lazy"
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-stone-200 shadow-2xs" 
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getCategoryFallback(trad.category, trad.state); }}
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-stone-900 truncate">
                          {trad.name}
                        </div>
                        <div className="text-[10px] text-stone-500 truncate">
                          {trad.categoryDisplay || trad.category}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] mt-1">
                          <span className={`font-bold px-1.5 py-0.2 rounded text-[9px] ${
                            isCritical 
                              ? 'bg-red-100 text-red-800' 
                              : isVulnerable 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {trad.status}
                          </span>
                          <span className="text-stone-300">•</span>
                          <span className="text-stone-600 font-semibold">{trad.score}/100</span>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-amber-600 translate-x-0.5' : 'text-stone-300'
                      }`} />
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-stone-500 py-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200 px-4">
                  <Info className="w-5 h-5 mx-auto mb-2 text-stone-400" />
                  <p className="font-medium text-stone-700 mb-1">No traditions registered yet</p>
                  <p className="text-[11px] text-stone-400">
                    Select any of the 9 states to view its active traditions.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Action Button to inspect details */}
            {selectedTradition && (
              <button
                onClick={() => onSelectTradition && onSelectTradition(selectedTradition)}
                className="mt-3 w-full py-2.5 rounded-xl bg-[#2e3e55] hover:bg-[#202d3f] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Eye className="w-3.5 h-3.5 text-amber-300" />
                <span>Open {selectedTradition.name} Dossier</span>
              </button>
            )}

          </div>

        </div>

      </div>

      {/* Bottom Summary Bar for the Selected Tradition */}
      {selectedTradition && (
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={getTraditionImage(selectedTradition)} 
              alt={selectedTradition.name} 
              loading="lazy"
              className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-xs shrink-0" 
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getCategoryFallback(selectedTradition.category, selectedTradition.state); }}
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-bold text-base text-stone-900">
                  {selectedTradition.name}
                </h4>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  selectedTradition.status === 'CRITICAL'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : selectedTradition.status === 'VULNERABLE'
                    ? 'bg-orange-50 text-orange-700 border border-orange-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {selectedTradition.statusLabel || selectedTradition.status} ({selectedTradition.score}/100)
                </span>
                <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                  {selectedTradition.category}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1 line-clamp-1 max-w-2xl">
                {selectedTradition.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 mt-2">
                <span>📍 <strong>State:</strong> {selectedTradition.state}</span>
                <span>👥 <strong>Active Masters:</strong> {selectedTradition.activePractitioners || selectedTradition.masters || 20}</span>
                <span>🎓 <strong>Learners:</strong> {selectedTradition.activeLearners || selectedTradition.learners || 8}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectTradition && onSelectTradition(selectedTradition)}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-[#2e3e55] hover:bg-[#202d3f] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-98"
          >
            <span>View Full Dossier</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
