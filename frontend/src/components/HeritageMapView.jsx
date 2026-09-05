import React, { useState, useMemo, useRef } from 'react';
import { 
  MapPin, 
  Layers, 
  ChevronRight, 
  Compass, 
  Sparkles,
  Users,
  Eye,
  CheckCircle,
  AlertTriangle,
  Flame,
  Info
} from 'lucide-react';

// Indian states data with exact percentage coordinates matching the user's provided map
export const INDIA_STATES_DATA = [
  {
    id: "JK",
    name: "Jammu and Kashmir",
    aliases: ["Jammu and Kashmir", "Jammu & Kashmir", "Ladakh"],
    zone: "NORTH",
    code: "JK",
    center: { x: 36.8, y: 11.8 }
  },
  {
    id: "HP",
    name: "Himachal Pradesh",
    aliases: ["Himachal Pradesh"],
    zone: "NORTH",
    code: "HP",
    center: { x: 39.1, y: 18.9 }
  },
  {
    id: "PB",
    name: "Punjab",
    aliases: ["Punjab"],
    zone: "NORTH",
    code: "PB",
    center: { x: 31.5, y: 22.7 }
  },
  {
    id: "UK",
    name: "Uttarakhand",
    aliases: ["Uttarakhand"],
    zone: "NORTH",
    code: "UK",
    center: { x: 45.9, y: 24.6 }
  },
  {
    id: "HR",
    name: "Haryana",
    aliases: ["Haryana", "Delhi"],
    zone: "NORTH",
    code: "HR",
    center: { x: 35.1, y: 27.3 }
  },
  {
    id: "RJ",
    name: "Rajasthan",
    aliases: ["Rajasthan"],
    zone: "NORTH",
    code: "RJ",
    center: { x: 32.0, y: 36.8 }
  },
  {
    id: "UP",
    name: "Uttar Pradesh",
    aliases: ["Uttar Pradesh"],
    zone: "CENTRAL",
    code: "UP",
    center: { x: 52.6, y: 35.0 }
  },
  {
    id: "BR",
    name: "Bihar",
    aliases: ["Bihar"],
    zone: "EAST",
    code: "BR",
    center: { x: 67.6, y: 41.5 }
  },
  {
    id: "SK",
    name: "Sikkim",
    aliases: ["Sikkim"],
    zone: "EAST",
    code: "SK",
    center: { x: 74.9, y: 33.0 }
  },
  {
    id: "WB",
    name: "West Bengal",
    aliases: ["West Bengal", "Bengal"],
    zone: "EAST",
    code: "WB",
    center: { x: 75.5, y: 48.1 }
  },
  {
    id: "JH",
    name: "Jharkhand",
    aliases: ["Jharkhand"],
    zone: "EAST",
    code: "JH",
    center: { x: 65.2, y: 46.5 }
  },
  {
    id: "OD",
    name: "Odisha",
    aliases: ["Odisha", "Orissa"],
    zone: "EAST",
    code: "OD",
    center: { x: 63.6, y: 58.0 }
  },
  {
    id: "CG",
    name: "Chhattisgarh",
    aliases: ["Chhattisgarh"],
    zone: "CENTRAL",
    code: "CG",
    center: { x: 55.4, y: 52.7 }
  },
  {
    id: "MP",
    name: "Madhya Pradesh",
    aliases: ["Madhya Pradesh"],
    zone: "CENTRAL",
    code: "MP",
    center: { x: 46.4, y: 51.4 }
  },
  {
    id: "GJ",
    name: "Gujarat",
    aliases: ["Gujarat"],
    zone: "WEST",
    code: "GJ",
    center: { x: 17.7, y: 50.3 }
  },
  {
    id: "MH",
    name: "Maharashtra",
    aliases: ["Maharashtra"],
    zone: "WEST",
    code: "MH",
    center: { x: 33.1, y: 62.6 }
  },
  {
    id: "GA",
    name: "Goa",
    aliases: ["Goa"],
    zone: "WEST",
    code: "GA",
    center: { x: 19.8, y: 75.9 }
  },
  {
    id: "KA",
    name: "Karnataka",
    aliases: ["Karnataka"],
    zone: "SOUTH",
    code: "KA",
    center: { x: 32.1, y: 80.8 }
  },
  {
    id: "AP",
    name: "Andhra Pradesh",
    aliases: ["Andhra Pradesh", "Telangana"],
    zone: "SOUTH",
    code: "AP",
    center: { x: 45.1, y: 72.0 }
  },
  {
    id: "TN",
    name: "Tamil Nadu",
    aliases: ["Tamil Nadu"],
    zone: "SOUTH",
    code: "TN",
    center: { x: 38.4, y: 90.7 }
  },
  {
    id: "KL",
    name: "Kerala",
    aliases: ["Kerala"],
    zone: "SOUTH",
    code: "KL",
    center: { x: 29.2, y: 94.0 }
  },
  {
    id: "AS",
    name: "Assam",
    aliases: ["Assam"],
    zone: "EAST",
    code: "AS",
    center: { x: 86.0, y: 36.5 }
  },
  {
    id: "AR",
    name: "Arunachal Pradesh",
    aliases: ["Arunachal Pradesh"],
    zone: "EAST",
    code: "AR",
    center: { x: 92.5, y: 28.5 }
  },
  {
    id: "NL",
    name: "Nagaland",
    aliases: ["Nagaland"],
    zone: "EAST",
    code: "NL",
    center: { x: 92.5, y: 36.5 }
  },
  {
    id: "MN",
    name: "Manipur",
    aliases: ["Manipur"],
    zone: "EAST",
    code: "MN",
    center: { x: 90.5, y: 41.0 }
  },
  {
    id: "MZ",
    name: "Mizoram",
    aliases: ["Mizoram"],
    zone: "EAST",
    code: "MZ",
    center: { x: 87.0, y: 46.5 }
  },
  {
    id: "TR",
    name: "Tripura",
    aliases: ["Tripura"],
    zone: "EAST",
    code: "TR",
    center: { x: 83.5, y: 46.0 }
  },
  {
    id: "ML",
    name: "Meghalaya",
    aliases: ["Meghalaya"],
    zone: "EAST",
    code: "ML",
    center: { x: 82.5, y: 39.5 }
  }
];

// Helper to find corresponding state data from a tradition state name
export function matchStateObject(stateName) {
  if (!stateName) return INDIA_STATES_DATA.find(s => s.id === 'MH');
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
  return partialMatch || INDIA_STATES_DATA.find(s => s.id === 'MH');
}

export default function HeritageMapView({ traditions, onSelectTradition }) {
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedPinId, setSelectedPinId] = useState('powada-01');
  const [hoveredState, setHoveredState] = useState(null);
  const mapContainerRef = useRef(null);

  // Harmonize traditions with mapped state
  const allTraditions = useMemo(() => {
    return (traditions || []).map((t) => {
      const stateObj = matchStateObject(t.state);
      return {
        ...t,
        marathi: t.marathiName || t.marathi || t.name,
        stateObj: stateObj,
        zone: t.zone || stateObj.zone,
        state: t.state || stateObj.name
      };
    });
  }, [traditions]);

  // Current active state object
  const activeStateName = hoveredState || selectedState;
  const activeStateObj = useMemo(() => {
    return matchStateObject(activeStateName);
  }, [activeStateName]);

  // Traditions belonging to the active state
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

  // Calculate pan-India risk stats
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
    if (selectedZone !== 'ALL' && selectedZone !== targetObj.zone) {
      setSelectedZone('ALL');
    }
    // Auto-select first tradition in this state if available
    const traditionsInTarget = allTraditions.filter(t => t.stateObj.id === targetObj.id);
    if (traditionsInTarget.length > 0) {
      setSelectedPinId(traditionsInTarget[0].id);
    }
  };

  // Click on the map image calculates the closest state
  const handleMapClick = (e) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    let closest = null;
    let minDistance = Infinity;

    INDIA_STATES_DATA.forEach((st) => {
      // Zone filter check
      if (selectedZone !== 'ALL' && st.zone !== selectedZone) return;
      const dist = Math.hypot(clickX - st.center.x, clickY - st.center.y);
      if (dist < minDistance) {
        minDistance = dist;
        closest = st;
      }
    });

    // If within reasonable proximity (15% radius), select the state
    if (closest && minDistance < 15) {
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
              Interactive cultural cartography • Select or touch any state on the map to inspect living traditions
            </p>
          </div>
        </div>

        {/* Upper Right: Zone Dropdown & State Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Zone Dropdown List: West, North, South, East, Central */}
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
              <option value="ALL">All India (Pan-India)</option>
              <option value="WEST">West Zone (Maharashtra, Gujarat, Goa)</option>
              <option value="NORTH">North Zone (Punjab, Rajasthan, HP, J&K, Haryana, UK)</option>
              <option value="SOUTH">South Zone (Kerala, Tamil Nadu, Karnataka, AP...)</option>
              <option value="EAST">East & NE Zone (Bengal, Odisha, Assam, NE...)</option>
              <option value="CENTRAL">Central Zone (Madhya Pradesh, UP, Chhattisgarh)</option>
            </select>
          </div>

          {/* State Quick Selector */}
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3.5 py-2 rounded-xl shadow-2xs">
            <MapPin className="w-4 h-4 text-[#3b4d66]" />
            <span className="text-xs font-semibold text-stone-500">State:</span>
            <select
              value={selectedState}
              onChange={(e) => handleStateSelect(e.target.value)}
              className="bg-transparent text-xs font-bold text-stone-900 focus:outline-hidden cursor-pointer max-w-[190px]"
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

      {/* Main Map Container: Clean Ivory Canvas displaying the user's authentic map */}
      <div className="relative bg-[#fbfaf6] rounded-3xl border border-stone-300/80 overflow-hidden shadow-md min-h-[640px] flex flex-col lg:flex-row items-center justify-between p-4 sm:p-6 gap-6">
        
        {/* Top-Left Status Bar */}
        <div className="absolute top-5 left-5 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl border border-stone-200/90 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-stone-800">
            Active State: <span className="text-[#2e3e55] font-extrabold">{activeStateObj.name}</span>
          </span>
          <span className="text-stone-300 text-xs">•</span>
          <span className="text-xs text-stone-600 font-semibold">
            {stateTraditions.length} Traditions Recorded
          </span>
          <span className="text-stone-300 text-xs">•</span>
          <span className="text-[10px] uppercase tracking-wider font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
            {activeStateObj.zone} ZONE
          </span>
        </div>

        {/* Center: Real Political Heritage Map with Overlay Layers */}
        <div className="relative flex-1 w-full flex items-center justify-center my-4 lg:my-0">
          <div 
            ref={mapContainerRef}
            onClick={handleMapClick}
            className="relative w-full max-w-[620px] aspect-[701/788] cursor-crosshair rounded-2xl overflow-visible select-none transition-all duration-300 group"
          >
            {/* The Authentic Map Image */}
            <img 
              src="/images/india_map.jpg" 
              alt="India Living Heritage Political Map"
              className="w-full h-full object-contain filter drop-shadow-md rounded-2xl pointer-events-auto"
              draggable="false"
            />

            {/* Zone Filter Dimming Mask (if a specific zone is selected) */}
            {selectedZone !== 'ALL' && (
              <div className="absolute inset-0 rounded-2xl pointer-events-none bg-stone-900/10 transition-opacity duration-300" />
            )}

            {/* State Badges and Hotspot Targets */}
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

                  {/* State Heritage Marker */}
                  {count > 0 ? (
                    <div className={`relative flex items-center justify-center transition-transform duration-200 ${
                      isSelected 
                        ? 'scale-125 z-30' 
                        : isHovered 
                        ? 'scale-115 z-20' 
                        : 'hover:scale-110'
                    }`}>
                      <div className={`px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-md border transition-colors ${
                        isSelected
                          ? 'bg-[#2e3e55] text-amber-300 border-amber-400 ring-2 ring-amber-400/50'
                          : isHovered
                          ? 'bg-[#2563eb] text-white border-white ring-2 ring-blue-300'
                          : 'bg-white/90 text-stone-800 border-stone-300 hover:bg-[#2e3e55] hover:text-white'
                      }`}>
                        <Sparkles className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                        <span>{count}</span>
                      </div>
                    </div>
                  ) : (
                    /* Subtle Dot for states with 0 recorded traditions */
                    <div className={`w-3.5 h-3.5 rounded-full border transition-all ${
                      isSelected
                        ? 'bg-amber-500 border-white ring-2 ring-amber-400 scale-125'
                        : isHovered
                        ? 'bg-blue-600 border-white scale-125'
                        : 'bg-stone-800/40 hover:bg-stone-800 border-white/80'
                    }`} />
                  )}

                  {/* Hover Tooltip for State */}
                  {(isHovered || isSelected) && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-40 whitespace-nowrap bg-stone-900/95 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-xl border border-stone-700 pointer-events-none text-center animate-fade-in">
                      <div className="font-bold text-xs text-white flex items-center justify-center gap-1">
                        <span>{st.name}</span>
                        {isSelected && <span className="text-[10px] text-amber-400 font-extrabold">• Active</span>}
                      </div>
                      <div className="text-[10px] text-stone-300 flex items-center justify-center gap-2 mt-0.5">
                        <span className="text-amber-300 font-bold">{count} traditions</span>
                        <span>•</span>
                        <span className="text-stone-400">{st.zone} Zone</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Individual Tradition Pins for the Selected Active State */}
            <div className="absolute inset-0 pointer-events-none">
              {stateTraditions.map((trad, idx) => {
                const isSelected = selectedPinId === trad.id;
                const isCritical = trad.status === 'CRITICAL';
                const isVulnerable = trad.status === 'VULNERABLE';

                // Scatter tradition pins neatly around the state center
                const offsets = [
                  { x: 0, y: -2.5 },
                  { x: -3.8, y: -0.5 },
                  { x: 3.8, y: -0.5 },
                  { x: -3.0, y: 3.5 },
                  { x: 3.0, y: 3.5 },
                  { x: 0, y: 4.8 },
                  { x: -4.5, y: -4.0 },
                  { x: 4.5, y: -4.0 }
                ];
                const offset = offsets[idx % offsets.length];

                const posX = Math.min(96, Math.max(4, activeStateObj.center.x + offset.x));
                const posY = Math.min(96, Math.max(4, activeStateObj.center.y + offset.y));

                const pinColor = isCritical 
                  ? 'text-red-600 fill-red-500' 
                  : isVulnerable 
                  ? 'text-amber-500 fill-amber-400' 
                  : 'text-emerald-600 fill-emerald-500';

                return (
                  <div
                    key={trad.id}
                    style={{ left: `${posX}%`, top: `${posY}%` }}
                    className="absolute -translate-x-1/2 -translate-y-full pointer-events-auto cursor-pointer group z-30 transition-transform duration-200 hover:scale-125"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPinId(trad.id);
                    }}
                  >
                    <div className="relative flex flex-col items-center">
                      <div className={`p-0.5 rounded-full transition-all ${
                        isSelected 
                          ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-white animate-bounce-short' 
                          : 'group-hover:ring-2 group-hover:ring-white'
                      }`}>
                        <MapPin className={`w-7 h-7 ${pinColor} drop-shadow-lg filter`} />
                      </div>

                      {/* Small Center Dot */}
                      <span className="absolute top-2 w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center shadow-xs">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isCritical ? 'bg-red-600' : isVulnerable ? 'bg-amber-600' : 'bg-emerald-600'
                        }`} />
                      </span>

                      {/* Pin Hover / Selected Tooltip */}
                      <div className={`absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-stone-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xl pointer-events-none z-40 flex items-center gap-1.5 border border-stone-700 ${
                        isSelected ? 'opacity-100' : ''
                      }`}>
                        <span>{trad.name}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] ${
                          isCritical ? 'bg-red-950 text-red-300' : isVulnerable ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
                        }`}>
                          {trad.score}/100
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom-Right Stamp */}
            <div className="absolute bottom-2 right-2 pointer-events-none bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-stone-200 text-[9px] font-bold text-stone-500 tracking-wider uppercase">
              Living Heritage GIS
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
                <span>Pan-India Risk Overview</span>
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
                        src={trad.image || '/images/hero.jpg'} 
                        alt={trad.name} 
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-stone-200 shadow-2xs" 
                        onError={(e) => { e.target.src = '/images/hero.jpg'; }}
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
                    Touch any state with a heritage marker on the map to view its active traditions.
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
              src={selectedTradition.image || '/images/hero.jpg'} 
              alt={selectedTradition.name} 
              className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-xs shrink-0" 
              onError={(e) => { e.target.src = '/images/hero.jpg'; }}
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
