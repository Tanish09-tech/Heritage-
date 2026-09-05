import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  ChevronRight, 
  Info, 
  Compass, 
  Sparkles,
  Users,
  Search,
  Eye,
  ArrowRight
} from 'lucide-react';

// Highly accurate, crisp SVG state vectors matching the reference image (ViewBox 0 0 1000 1120)
const INDIA_MAP_STATES = [
  {
    id: "Jammu & Kashmir",
    name: "Jammu & Kashmir",
    code: "JK",
    zone: "NORTH",
    center: { x: 305, y: 155 },
    d: "M 270,120 C 275,95 290,75 315,65 C 335,70 345,95 340,125 C 365,130 380,150 375,175 C 360,195 330,205 305,195 C 280,200 260,185 260,160 C 260,140 270,130 270,120 Z"
  },
  {
    id: "Ladakh",
    name: "Ladakh",
    code: "LA",
    zone: "NORTH",
    center: { x: 395, y: 120 },
    d: "M 340,125 C 345,95 335,70 315,65 C 330,45 365,35 400,45 C 435,55 455,85 450,125 C 445,155 415,175 385,175 C 375,175 365,130 340,125 Z"
  },
  {
    id: "Himachal Pradesh",
    name: "Himachal Pradesh",
    code: "HP",
    zone: "NORTH",
    center: { x: 360, y: 215 },
    d: "M 305,195 C 330,205 360,195 375,175 C 385,175 415,175 425,195 C 430,225 405,250 375,255 C 345,260 330,240 315,245 C 305,230 305,210 305,195 Z"
  },
  {
    id: "Punjab",
    name: "Punjab",
    code: "PB",
    zone: "NORTH",
    center: { x: 295, y: 245 },
    d: "M 260,185 C 280,200 305,195 305,210 C 305,230 315,245 320,265 C 310,290 280,295 260,275 C 245,250 250,210 260,185 Z"
  },
  {
    id: "Uttarakhand",
    name: "Uttarakhand",
    code: "UK",
    zone: "NORTH",
    center: { x: 425, y: 240 },
    d: "M 375,255 C 405,250 430,225 425,195 C 445,205 470,220 480,250 C 475,280 440,290 410,285 C 390,280 380,265 375,255 Z"
  },
  {
    id: "Haryana",
    name: "Haryana & Delhi",
    code: "HR",
    zone: "NORTH",
    center: { x: 335, y: 285 },
    d: "M 320,265 C 330,240 345,260 375,255 C 380,265 390,280 375,305 C 355,335 325,330 315,310 C 310,290 320,265 320,265 Z"
  },
  {
    id: "Rajasthan",
    name: "Rajasthan",
    code: "RJ",
    zone: "NORTH",
    center: { x: 250, y: 365 },
    d: "M 260,275 C 280,295 310,290 315,310 C 325,330 355,335 345,370 C 335,410 310,445 270,455 C 220,460 175,420 185,365 C 190,320 225,285 260,275 Z"
  },
  {
    id: "Uttar Pradesh",
    name: "Uttar Pradesh",
    code: "UP",
    zone: "CENTRAL",
    center: { x: 460, y: 345 },
    d: "M 375,305 C 390,280 410,285 440,290 C 480,250 520,290 565,310 C 600,340 610,385 570,415 C 510,435 440,430 380,410 C 345,370 355,335 375,305 Z"
  },
  {
    id: "Gujarat",
    name: "Gujarat",
    code: "GJ",
    zone: "WEST",
    center: { x: 185, y: 495 },
    d: "M 185,365 C 220,420 230,450 250,460 C 275,485 260,545 220,570 C 175,585 140,545 150,505 C 130,515 110,490 120,465 C 145,465 170,440 160,410 C 155,385 170,370 185,365 Z"
  },
  {
    id: "Madhya Pradesh",
    name: "Madhya Pradesh",
    code: "MP",
    zone: "CENTRAL",
    center: { x: 405, y: 465 },
    d: "M 270,455 C 310,445 335,410 380,410 C 440,430 510,435 550,440 C 565,480 540,530 480,550 C 420,565 340,560 280,530 C 250,515 250,485 270,455 Z"
  },
  {
    id: "Bihar",
    name: "Bihar",
    code: "BR",
    zone: "EAST",
    center: { x: 630, y: 360 },
    d: "M 565,310 C 620,295 675,315 690,345 C 685,385 645,405 595,405 C 570,415 600,340 565,310 Z"
  },
  {
    id: "Jharkhand",
    name: "Jharkhand",
    code: "JH",
    zone: "EAST",
    center: { x: 625, y: 440 },
    d: "M 595,405 C 645,405 685,385 680,430 C 675,475 635,490 590,480 C 565,470 550,440 595,405 Z"
  },
  {
    id: "West Bengal",
    name: "West Bengal",
    code: "WB",
    zone: "EAST",
    center: { x: 695, y: 455 },
    d: "M 690,345 C 715,310 735,325 725,370 C 740,420 755,470 730,535 C 700,535 685,490 680,430 C 685,385 675,370 690,345 Z"
  },
  {
    id: "Odisha",
    name: "Odisha",
    code: "OD",
    zone: "EAST",
    center: { x: 595, y: 540 },
    d: "M 590,480 C 635,490 675,475 695,510 C 705,555 660,615 600,620 C 555,605 535,565 550,530 C 565,510 575,495 590,480 Z"
  },
  {
    id: "Chhattisgarh",
    name: "Chhattisgarh",
    code: "CG",
    zone: "CENTRAL",
    center: { x: 510, y: 535 },
    d: "M 480,550 C 540,530 565,480 565,510 C 550,530 535,565 540,630 C 510,655 475,620 480,550 Z"
  },
  {
    id: "Maharashtra",
    name: "Maharashtra",
    code: "MH",
    zone: "WEST",
    center: { x: 315, y: 595 },
    d: "M 220,570 C 260,545 280,530 340,560 C 420,565 480,550 480,600 C 480,645 425,690 350,695 C 285,705 240,665 225,615 C 220,595 215,580 220,570 Z"
  },
  {
    id: "Goa",
    name: "Goa",
    code: "GA",
    zone: "WEST",
    center: { x: 235, y: 715 },
    d: "M 225,705 C 245,705 245,725 235,735 C 220,730 220,715 225,705 Z"
  },
  {
    id: "Telangana",
    name: "Telangana",
    code: "TS",
    zone: "SOUTH",
    center: { x: 420, y: 660 },
    d: "M 350,695 C 425,690 480,645 490,665 C 485,715 440,740 380,745 C 355,735 345,715 350,695 Z"
  },
  {
    id: "Andhra Pradesh",
    name: "Andhra Pradesh",
    code: "AP",
    zone: "SOUTH",
    center: { x: 445, y: 765 },
    d: "M 490,665 C 540,630 600,620 575,685 C 530,765 470,855 410,865 C 395,840 415,790 440,745 C 485,715 485,680 490,665 Z"
  },
  {
    id: "Karnataka",
    name: "Karnataka",
    code: "KA",
    zone: "SOUTH",
    center: { x: 300, y: 770 },
    d: "M 240,665 C 285,705 350,695 355,735 C 380,745 415,790 390,845 C 350,865 315,840 270,780 C 240,740 235,705 240,665 Z"
  },
  {
    id: "Kerala",
    name: "Kerala",
    code: "KL",
    zone: "SOUTH",
    center: { x: 310, y: 920 },
    d: "M 270,780 C 315,840 325,875 325,930 C 320,985 295,1015 285,995 C 275,945 260,865 270,780 Z"
  },
  {
    id: "Tamil Nadu",
    name: "Tamil Nadu",
    code: "TN",
    zone: "SOUTH",
    center: { x: 375, y: 910 },
    d: "M 390,845 C 410,865 435,855 425,905 C 400,990 340,1020 305,1010 C 295,995 320,985 325,930 C 325,875 350,865 390,845 Z"
  },
  {
    id: "Sikkim",
    name: "Sikkim",
    code: "SK",
    zone: "EAST",
    center: { x: 720, y: 310 },
    d: "M 710,295 C 730,290 735,315 725,325 C 710,320 705,305 710,295 Z"
  },
  {
    id: "Assam",
    name: "Assam & North East",
    code: "AS",
    zone: "EAST",
    center: { x: 820, y: 360 },
    d: "M 735,325 C 770,315 825,300 875,310 C 925,335 910,395 860,420 C 825,435 770,410 755,370 C 740,345 735,325 735,325 Z"
  },
  {
    id: "Arunachal Pradesh",
    name: "Arunachal Pradesh",
    code: "AR",
    zone: "EAST",
    center: { x: 875, y: 295 },
    d: "M 825,300 C 860,260 910,270 930,300 C 920,335 875,310 825,300 Z"
  },
  {
    id: "Meghalaya",
    name: "Meghalaya & Tripura",
    code: "ML",
    zone: "EAST",
    center: { x: 795, y: 425 },
    d: "M 755,370 C 770,410 810,420 815,450 C 785,465 765,435 755,370 Z"
  },
  {
    id: "Nagaland & Manipur",
    name: "Nagaland & Manipur",
    code: "NL",
    zone: "EAST",
    center: { x: 885, y: 415 },
    d: "M 875,350 C 905,350 915,420 885,460 C 865,435 860,395 875,350 Z"
  }
];

export default function HeritageMapView({ traditions, onSelectTradition }) {
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedPinId, setSelectedPinId] = useState('powada-01');
  const [hoveredState, setHoveredState] = useState(null);

  // Helper to categorize states into standard zones
  const getStateZone = (stateName) => {
    const s = (stateName || '').toLowerCase();
    if (s.includes('punjab') || s.includes('kashmir') || s.includes('ladakh') || s.includes('himachal') || s.includes('delhi') || s.includes('haryana') || s.includes('rajasthan') || s.includes('uttarakhand')) return 'NORTH';
    if (s.includes('maharashtra') || s.includes('gujarat') || s.includes('goa')) return 'WEST';
    if (s.includes('kerala') || s.includes('tamil') || s.includes('karnataka') || s.includes('telangana') || s.includes('andhra')) return 'SOUTH';
    if (s.includes('bengal') || s.includes('odisha') || s.includes('bihar') || s.includes('assam') || s.includes('jharkhand') || s.includes('manipur') || s.includes('nagaland')) return 'EAST';
    return 'CENTRAL';
  };

  // Harmonize traditions with state and coordinates
  const allTraditions = (traditions || []).map((t) => {
    return {
      ...t,
      marathi: t.marathiName || t.marathi || t.name,
      zone: t.zone || getStateZone(t.state),
      state: t.state || 'Maharashtra'
    };
  });

  // Traditions belonging to the currently hovered / selected state
  const activeStateName = hoveredState || selectedState;
  const stateTraditions = allTraditions.filter(t => 
    t.state.toLowerCase() === activeStateName.toLowerCase()
  );

  const selectedTradition = allTraditions.find(t => t.id === selectedPinId) || stateTraditions[0] || allTraditions[0];

  // Touch / Click handler for a state
  const handleStateSelect = (stateName) => {
    setSelectedState(stateName);
    const z = getStateZone(stateName);
    if (selectedZone !== 'ALL' && selectedZone !== z) {
      setSelectedZone('ALL');
    }
  };

  return (
    <div className="space-y-4 font-sans text-stone-800">
      
      {/* Top Header & Dropdown Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Left Header Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2e3e55] flex items-center justify-center text-amber-300 font-bold shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-stone-900 font-cinzel">
                Pan-India Living Heritage Map
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#3b4d66]/10 text-[#2e3e55] border border-[#3b4d66]/30">
                {activeStateName} Focus
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Select or touch any state on the map of India to inspect living traditions
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
                setSelectedZone(e.target.value);
                if (e.target.value !== 'ALL') {
                  const stateInZone = INDIA_MAP_STATES.find(s => s.zone === e.target.value);
                  if (stateInZone) setSelectedState(stateInZone.name);
                }
              }}
              className="bg-transparent text-xs font-bold text-stone-900 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All India (Pan-India)</option>
              <option value="WEST">West Zone (Maharashtra, Gujarat, Goa)</option>
              <option value="NORTH">North Zone (Punjab, Rajasthan, HP, J&K)</option>
              <option value="SOUTH">South Zone (Kerala, Tamil Nadu, Karnataka, Telangana...)</option>
              <option value="EAST">East Zone (West Bengal, Odisha, Assam...)</option>
              <option value="CENTRAL">Central Zone (Madhya Pradesh, Uttar Pradesh...)</option>
            </select>
          </div>

          {/* State Quick Selector */}
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3.5 py-2 rounded-xl shadow-2xs">
            <MapPin className="w-4 h-4 text-[#3b4d66]" />
            <span className="text-xs font-semibold text-stone-500">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent text-xs font-bold text-stone-900 focus:outline-hidden cursor-pointer"
            >
              {[
                'Maharashtra', 'Punjab', 'Rajasthan', 'Gujarat', 'Kerala', 
                'West Bengal', 'Madhya Pradesh', 'Tamil Nadu', 'Uttar Pradesh', 
                'Odisha', 'Karnataka', 'Himachal Pradesh', 'Telangana', 'Goa', 
                'Jammu & Kashmir', 'Assam'
              ].map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Main Map Container: Clean Ivory Canvas matching the Reference Image */}
      <div className="relative bg-[#faf9f5] rounded-3xl border border-stone-300/80 overflow-hidden shadow-md min-h-[640px] flex items-center justify-center p-4">
        
        {/* Top-Left Status Bar */}
        <div className="absolute top-5 left-5 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-stone-200/80 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-stone-800">
            Active State: <span className="text-[#2e3e55] font-extrabold">{activeStateName}</span>
          </span>
          <span className="text-stone-400 text-xs">•</span>
          <span className="text-xs text-stone-500 font-medium">
            {stateTraditions.length} Traditions Recorded
          </span>
        </div>

        {/* Center: Neat SVG Map of India (Exact Vector Silhouette & State Grid) */}
        <div className="relative w-full max-w-3xl h-[580px] flex items-center justify-center">
          <svg 
            viewBox="0 0 1000 1120" 
            className="w-full h-full max-h-[560px] object-contain select-none filter drop-shadow-sm"
          >
            {/* Background */}
            <rect width="1000" height="1120" fill="transparent" />

            {/* Individual Indian States with crisp white boundary lines */}
            {INDIA_MAP_STATES.map((st) => {
              const isSelected = selectedState.toLowerCase() === st.name.toLowerCase();
              const isHovered = hoveredState === st.name;
              const isZoneMatch = selectedZone === 'ALL' || st.zone === selectedZone;

              return (
                <g key={st.id}>
                  <path
                    d={st.d}
                    onClick={() => handleStateSelect(st.name)}
                    onMouseEnter={() => setHoveredState(st.name)}
                    onMouseLeave={() => setHoveredState(null)}
                    onTouchStart={() => handleStateSelect(st.name)}
                    className={`transition-all duration-200 cursor-pointer ${
                      isSelected 
                        ? 'fill-amber-600 stroke-white stroke-[2.5px] filter drop-shadow-md' 
                        : isHovered
                        ? 'fill-[#2563eb] stroke-white stroke-[2px]'
                        : isZoneMatch
                        ? 'fill-[#384860] hover:fill-[#2d3b4f] stroke-white stroke-[1.2px]'
                        : 'fill-[#384860]/40 stroke-white stroke-[1px]'
                    }`}
                  />
                  {/* Subtle State Code on Map */}
                  <text
                    x={st.center.x}
                    y={st.center.y}
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    pointerEvents="none"
                    opacity={isSelected || isHovered ? 1 : isZoneMatch ? 0.75 : 0.3}
                  >
                    {st.code}
                  </text>
                </g>
              );
            })}

            {/* Clean Typography "INDIA" on Bottom-Right (Matching Reference Image) */}
            <text
              x="820"
              y="1020"
              fill="#2e3e55"
              fontSize="34"
              fontWeight="900"
              letterSpacing="6"
              className="font-sans select-none opacity-90"
            >
              INDIA
            </text>
          </svg>

          {/* Interactive State Pin Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {stateTraditions.map((trad, idx) => {
              const matchingState = INDIA_MAP_STATES.find(s => s.name.toLowerCase() === trad.state.toLowerCase());
              if (!matchingState) return null;

              const isSelected = selectedPinId === trad.id;
              const isCritical = trad.status === 'CRITICAL';
              const isVulnerable = trad.status === 'VULNERABLE';

              // Distribute multiple pins around the state center
              const offsets = [
                { x: 0, y: 0 },
                { x: -18, y: -14 },
                { x: 18, y: -14 },
                { x: -14, y: 16 },
                { x: 16, y: 16 },
                { x: 0, y: -24 }
              ];
              const offset = offsets[idx % offsets.length];

              const posX = (matchingState.center.x + offset.x) / 10;
              const posY = (matchingState.center.y + offset.y) / 11.2;

              const pinColor = isCritical ? 'text-red-500' : isVulnerable ? 'text-amber-400' : 'text-emerald-400';

              return (
                <div
                  key={trad.id}
                  style={{ left: `${posX}%`, top: `${posY}%` }}
                  className="absolute -translate-x-1/2 -translate-y-full pointer-events-auto cursor-pointer group z-10 transition-transform duration-200 hover:scale-125"
                  onClick={() => setSelectedPinId(trad.id)}
                >
                  <div className="relative flex flex-col items-center">
                    <MapPin className={`w-7 h-7 fill-current ${pinColor} drop-shadow-lg`} />
                    <span className="absolute top-1.5 w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center shadow-xs">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isCritical ? 'bg-red-600' : isVulnerable ? 'bg-amber-500' : 'bg-emerald-600'
                      }`} />
                    </span>

                    {/* Hover Tooltip */}
                    <div className={`absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg pointer-events-none z-30 flex items-center gap-1 ${
                      isSelected ? 'opacity-100' : ''
                    }`}>
                      <span>{trad.name}</span>
                      <span className="text-amber-300">({trad.score}/100)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* FLOATING OVERLAY CARDS (RIGHT SIDE - MATCHING REFERENCE IMAGE 2) */}
        {/* ========================================================================= */}
        <div className="absolute top-5 right-5 z-20 flex flex-col gap-3 max-w-[270px] w-full pointer-events-auto">
          
          {/* CARD 1: Risk Overview */}
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-md border border-stone-200/90">
            <h4 className="font-bold text-xs text-stone-900 mb-3 tracking-wide">
              Risk Overview
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5 text-stone-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                <span className="font-semibold text-xs">Strong</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-100" />
                <span className="font-semibold text-xs">Vulnerable</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-700">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-100" />
                <span className="font-semibold text-xs">Critical</span>
              </div>
            </div>
          </div>

          {/* CARD 2: Traditions in this Region */}
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-md border border-stone-200/90 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-xs text-stone-900 truncate">
                Traditions in {activeStateName}
              </h4>
              <span className="text-[10px] font-bold text-[#2e3e55] bg-[#3b4d66]/10 px-1.5 py-0.5 rounded">
                {stateTraditions.length}
              </span>
            </div>

            {/* Scrollable list of traditions */}
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin">
              {stateTraditions.length > 0 ? (
                stateTraditions.map((trad) => {
                  const isSelected = selectedPinId === trad.id;
                  const isCritical = trad.status === 'CRITICAL';
                  const isVulnerable = trad.status === 'VULNERABLE';

                  return (
                    <div
                      key={trad.id}
                      onClick={() => {
                        setSelectedPinId(trad.id);
                        if (onSelectTradition) onSelectTradition(trad);
                      }}
                      className={`flex items-center gap-2.5 p-2 rounded-xl transition cursor-pointer border ${
                        isSelected 
                          ? 'bg-amber-50 border-amber-300 shadow-2xs' 
                          : 'bg-stone-50/80 hover:bg-stone-100 border-stone-200/60'
                      }`}
                    >
                      {/* Avatar */}
                      <img 
                        src={trad.image} 
                        alt={trad.name} 
                        className="w-9 h-9 rounded-lg object-cover shrink-0 border border-stone-200" 
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-stone-900 truncate">
                          {trad.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                          <span className={`font-bold ${
                            isCritical ? 'text-red-600' : isVulnerable ? 'text-amber-600' : 'text-emerald-700'
                          }`}>
                            {isCritical ? 'Critical' : isVulnerable ? 'Vulnerable' : 'Strong'}
                          </span>
                          <span className="text-stone-300">•</span>
                          <span className="text-stone-600 font-semibold">{trad.score}/100</span>
                        </div>
                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-stone-500 py-4 text-center">
                  Touch any state to view its living traditions.
                </div>
              )}
            </div>

            {/* Quick Action Button */}
            {selectedTradition && (
              <button
                onClick={() => onSelectTradition && onSelectTradition(selectedTradition)}
                className="mt-3 w-full py-2 rounded-xl bg-[#2e3e55] hover:bg-[#202d3f] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Tradition Details</span>
              </button>
            )}

          </div>

        </div>

      </div>

      {/* Bottom Summary Bar */}
      {selectedTradition && (
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={selectedTradition.image} 
              alt={selectedTradition.name} 
              className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-xs" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-base text-stone-900">
                  {selectedTradition.name}
                </h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedTradition.status === 'CRITICAL'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : selectedTradition.status === 'VULNERABLE'
                    ? 'bg-orange-50 text-orange-700 border border-orange-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {selectedTradition.statusLabel || selectedTradition.status} ({selectedTradition.score}/100)
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 line-clamp-1 max-w-xl">
                {selectedTradition.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-stone-600 mt-2">
                <span>📍 <strong>State:</strong> {selectedTradition.state}</span>
                <span>👥 <strong>Active Masters:</strong> {selectedTradition.activePractitioners || selectedTradition.masters || 20}</span>
                <span>🎓 <strong>Learners:</strong> {selectedTradition.activeLearners || selectedTradition.learners || 8}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectTradition && onSelectTradition(selectedTradition)}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-[#2e3e55] hover:bg-[#202d3f] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Open Tradition Dossier</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
