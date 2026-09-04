import React, { useState } from 'react';
import Header from './components/Header';
import JudgeDemoBanner from './components/JudgeDemoBanner';
import DashboardView from './components/DashboardView';
import TransmissionEngineView from './components/TransmissionEngineView';
import MatchmakerView from './components/MatchmakerView';
import KnowledgeVaultView from './components/KnowledgeVaultView';
import ValidationQueueView from './components/ValidationQueueView';
import RecommendationEngineView from './components/RecommendationEngineView';
import TraditionModal from './components/TraditionModal';

import { PILOT_TRADITIONS, MASTER_PRACTITIONERS, LEARNER_PROFILES, VALIDATION_QUEUE, ARCHIVED_KNOWLEDGE_ITEMS } from './data/heritageData';
import { Layers, Activity, Users, Mic, ShieldCheck, Lightbulb } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState('AUTHORITY');
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [traditions, setTraditions] = useState(PILOT_TRADITIONS);
  const [masters, setMasters] = useState(MASTER_PRACTITIONERS);
  const [learners, setLearners] = useState(LEARNER_PROFILES);
  const [queue, setQueue] = useState(VALIDATION_QUEUE);
  const [archivedItems, setArchivedItems] = useState(ARCHIVED_KNOWLEDGE_ITEMS);
  const [selectedTradition, setSelectedTradition] = useState(null);
  const [demoStep, setDemoStep] = useState(0);

  const tabs = [
    { id: 'DASHBOARD', label: 'Heritage Intelligence', icon: Layers },
    { id: 'HTHS', label: 'HTHS Health Engine', icon: Activity },
    { id: 'MATCHMAKER', label: 'Master–Learner Match', icon: Users },
    { id: 'VAULT', label: 'Knowledge Vault', icon: Mic },
    { id: 'VALIDATION', label: 'Community Validation', icon: ShieldCheck },
    { id: 'RECOMMENDATIONS', label: 'Interventions', icon: Lightbulb }
  ];

  const handleUpdateTraditionScore = (id, newScore, newIndicators, newStatus) => {
    setTraditions(prev => prev.map(t => {
      if (t.id === id) {
        let statusLabel = "Critical Transmission Gap";
        let color = "#dc2626";
        let bgClass = "bg-red-50 text-red-700 border-red-200";

        if (newStatus === 'STRONG') {
          statusLabel = "Strong Transmission";
          color = "#16a34a";
          bgClass = "bg-emerald-50 text-emerald-800 border-emerald-200";
        } else if (newStatus === 'MONITORING') {
          statusLabel = "Needs Monitoring";
          color = "#d97706";
          bgClass = "bg-amber-50 text-amber-800 border-amber-200";
        } else if (newStatus === 'VULNERABLE') {
          statusLabel = "Vulnerable Transmission";
          color = "#ea580c";
          bgClass = "bg-orange-50 text-orange-700 border-orange-200";
        }

        return {
          ...t,
          score: newScore,
          indicators: newIndicators,
          status: newStatus,
          statusLabel,
          color,
          bgClass
        };
      }
      return t;
    }));
  };

  const handleExecuteDemoStep = (stepNum) => {
    setDemoStep(stepNum);
    if (stepNum === 1) {
      setActiveTab('HTHS');
      setCurrentRole('PRACTITIONER');
    } else if (stepNum === 2) {
      setActiveTab('VALIDATION');
      setCurrentRole('REVIEWER');
    } else if (stepNum === 3 || stepNum === 4) {
      setActiveTab('HTHS');
      setCurrentRole('AUTHORITY');
    } else if (stepNum === 5) {
      setActiveTab('RECOMMENDATIONS');
      setCurrentRole('AUTHORITY');
    } else if (stepNum === 6 || stepNum === 7) {
      setActiveTab('MATCHMAKER');
      setCurrentRole('LEARNER');
    } else if (stepNum === 8) {
      setActiveTab('VAULT');
      setCurrentRole('PRACTITIONER');
    }
  };

  const handleStartDemoTour = () => {
    handleExecuteDemoStep(1);
  };

  const handleResetDemo = () => {
    setDemoStep(0);
    setActiveTab('DASHBOARD');
  };

  return (
    <div className="min-h-screen bg-[#fcfaf6] text-stone-900 font-sans flex flex-col justify-between selection:bg-[#8c1c1c] selection:text-white">
      
      <div>
        {/* Header */}
        <Header
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onStartDemoTour={handleStartDemoTour}
          demoStep={demoStep}
        />

        {/* Demo Banner */}
        <JudgeDemoBanner
          demoStep={demoStep}
          setDemoStep={setDemoStep}
          onExecuteStep={handleExecuteDemoStep}
          onResetDemo={handleResetDemo}
        />

        {/* Main Content Area */}
        <main className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 space-y-6 flex-1">
          
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    active
                      ? 'bg-[#0f2a4a] text-white shadow'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-[#0f2a4a]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Views */}
          {activeTab === 'DASHBOARD' && (
            <DashboardView
              traditions={traditions}
              onSelectTradition={(t) => setSelectedTradition(t)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'HTHS' && (
            <TransmissionEngineView
              traditions={traditions}
              selectedTradition={traditions[0]}
              onUpdateTraditionScore={handleUpdateTraditionScore}
            />
          )}

          {activeTab === 'MATCHMAKER' && (
            <MatchmakerView
              masters={masters}
              learners={learners}
            />
          )}

          {activeTab === 'VAULT' && (
            <KnowledgeVaultView
              archivedItems={archivedItems}
              onAddArchivedItem={(item) => setArchivedItems([item, ...archivedItems])}
            />
          )}

          {activeTab === 'VALIDATION' && (
            <ValidationQueueView
              queue={queue}
              onApproveItem={(id) => {
                setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'COMMUNITY_VALIDATED' } : q));
                handleUpdateTraditionScore('powada-01', 42, traditions[0].indicators, 'VULNERABLE');
              }}
            />
          )}

          {activeTab === 'RECOMMENDATIONS' && (
            <RecommendationEngineView
              traditions={traditions}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

        </main>
      </div>

      {/* Tradition Detail Modal */}
      {selectedTradition && (
        <TraditionModal
          tradition={selectedTradition}
          onClose={() => setSelectedTradition(null)}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      )}

      {/* Footer */}
      <footer className="w-full mt-12 border-t border-stone-200 bg-white py-6 px-4 sm:px-6 lg:px-12 text-stone-600 text-xs">
        <div className="w-full max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-cinzel font-bold text-[#8c1c1c] text-sm">संस्कृती सुरक्षा • SANSKRITI SURAKSHA</span>
            <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">
              Pan-India Living Heritage Registry
            </span>
          </div>

          <p className="text-stone-500 font-medium">
            Detect → Explain → Connect → Preserve • AI-Powered Living Heritage Early Warning System
          </p>

          <div className="text-stone-500 font-semibold">
            Competitively Validated Innovation System
          </div>
        </div>
      </footer>

    </div>
  );
}
