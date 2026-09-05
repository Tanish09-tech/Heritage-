import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import AppHeader from './components/AppHeader';
import LandingPageView from './components/LandingPageView';
import LoginPageView from './components/LoginPageView';
import AuthModal from './components/AuthModal';
import RoleSelectionModal from './components/RoleSelectionModal';
import HeritageDashboardView from './components/HeritageDashboardView';
import HeritageMapView from './components/HeritageMapView';
import TraditionsExplorerView from './components/TraditionsExplorerView';
import TraditionDetailView from './components/TraditionDetailView';
import AddTraditionView from './components/AddTraditionView';
import PractitionerDashboardView from './components/PractitionerDashboardView';
import LearnerDashboardView from './components/LearnerDashboardView';
import MasterMatchingView from './components/MasterMatchingView';
import AiAnalysisView from './components/AiAnalysisView';
import KnowledgeVaultView from './components/KnowledgeVaultView';
import ValidationQueueView from './components/ValidationQueueView';
import RecommendationEngineView from './components/RecommendationEngineView';
import SettingsProfileView from './components/SettingsProfileView';

import { 
  PILOT_TRADITIONS, 
  MASTER_PRACTITIONERS, 
  LEARNER_PROFILES, 
  VALIDATION_QUEUE, 
  ARCHIVED_KNOWLEDGE_ITEMS 
} from './data/heritageData';

export default function App() {
  // Session persistence: Don't automatically log out unless user explicitly logs out
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sanskriti_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const savedRole = localStorage.getItem('sanskriti_role');
      return savedRole || 'AUTHORITY';
    } catch {
      return 'AUTHORITY';
    }
  });

  const [activeView, setActiveView] = useState(() => {
    try {
      const savedUser = localStorage.getItem('sanskriti_user');
      const savedRole = localStorage.getItem('sanskriti_role');
      const savedView = localStorage.getItem('sanskriti_view');
      if (savedUser) {
        if (savedView && savedView !== 'LANDING' && savedView !== 'LOGIN') return savedView;
        if (savedRole === 'LEARNER') return 'LEARNER_DASHBOARD';
        if (savedRole === 'PRACTITIONER') return 'PRACTITIONER_DASHBOARD';
        return 'DASHBOARD';
      }
      return 'LANDING';
    } catch {
      return 'LANDING';
    }
  });

  const [traditions, setTraditions] = useState(PILOT_TRADITIONS);
  const [selectedTradition, setSelectedTradition] = useState(PILOT_TRADITIONS[0]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [queue, setQueue] = useState(VALIDATION_QUEUE || []);
  const [archivedItems, setArchivedItems] = useState(ARCHIVED_KNOWLEDGE_ITEMS || []);

  // Handlers
  const handleSelectTradition = (tradition) => {
    setSelectedTradition(tradition);
    handleNavigateView('TRADITION_DETAIL');
  };

  const handleSaveNewTradition = (newTradition) => {
    setTraditions([newTradition, ...traditions]);
    setSelectedTradition(newTradition);
  };

  const handleNavigateView = (view) => {
    setActiveView(view);
    if (currentUser && view !== 'LANDING' && view !== 'LOGIN') {
      try {
        localStorage.setItem('sanskriti_view', view);
      } catch {}
    }
  };

  const handleRoleSelection = (roleId, targetView) => {
    setCurrentRole(roleId);
    setIsRoleModalOpen(false);
    if (targetView) {
      handleNavigateView(targetView);
    }
  };

  const handleSuccessfulAuth = (roleId, targetView) => {
    setIsAuthModalOpen(false);
    if (roleId) {
      setCurrentRole(roleId);
      if (targetView) {
        handleNavigateView(targetView);
        return;
      }
    }
    setIsRoleModalOpen(true);
  };

  const handleLogout = () => {
    // Clear persisted session so user can log in again later
    try {
      localStorage.removeItem('sanskriti_user');
      localStorage.removeItem('sanskriti_role');
      localStorage.removeItem('sanskriti_view');
    } catch (err) {
      console.error('Failed to clear session:', err);
    }
    setCurrentUser(null);
    setActiveView('LANDING'); // Show landing page first after logout
  };

  const handleLoginSuccess = (roleKey, targetView, userData) => {
    const userObj = userData || { 
      name: roleKey === 'LEARNER' ? 'Aniket Deshmukh' : (roleKey === 'PRACTITIONER' ? 'Shahir Tukaram Jagtap' : 'Ministry Heritage Authority'), 
      role: roleKey,
      email: roleKey === 'LEARNER' ? 'shishya.aniket@gmail.com' : (roleKey === 'PRACTITIONER' ? 'guru.tukaram@gmail.com' : 'admin.sanskriti@gov.in')
    };

    const destView = targetView || (roleKey === 'LEARNER' ? 'LEARNER_DASHBOARD' : (roleKey === 'PRACTITIONER' ? 'PRACTITIONER_DASHBOARD' : 'DASHBOARD'));

    setCurrentRole(roleKey);
    setCurrentUser(userObj);
    setActiveView(destView);

    // Save session in localStorage so user doesn't get automatically logged out
    try {
      localStorage.setItem('sanskriti_user', JSON.stringify(userObj));
      localStorage.setItem('sanskriti_role', roleKey);
      localStorage.setItem('sanskriti_view', destView);
    } catch (err) {
      console.error('Failed to save session:', err);
    }
  };

  // Screen 1: Landing Page
  if (activeView === 'LANDING') {
    return (
      <div className="relative min-h-screen bg-[#0d0d0d] font-sans">
        <LandingPageView
          onExploreHeritage={() => setActiveView('LOGIN')}
          onOpenDashboard={() => setActiveView('LOGIN')}
          onOpenPractitioners={() => setActiveView('LOGIN')}
          onOpenLearn={() => setActiveView('LOGIN')}
          onOpenAiAnalysis={() => setActiveView('LOGIN')}
          onOpenDocumentation={() => setActiveView('LOGIN')}
          onOpenLogin={() => setActiveView('LOGIN')}
          onJoinMission={() => setActiveView('LOGIN')}
        />

        {/* Global Modals on Landing Page */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccessfulAuth={handleSuccessfulAuth}
        />

        <RoleSelectionModal
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          onSelectRole={handleRoleSelection}
        />
      </div>
    );
  }

  // Screen 2: Dedicated 3-Role Login Page (1st Shishya, 2nd Guru, 3rd Admin)
  // Strict Auth Guard: User MUST log in before any home or dashboard pages are accessible!
  if (!currentUser || activeView === 'LOGIN') {
    return (
      <LoginPageView
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={() => setActiveView('LANDING')}
      />
    );
  }

  // Workspace Layout with Left Forest-Green Sidebar & Top Navigation Bar (Screens 4-12)
  return (
    <div className="flex h-screen w-full bg-[#f3f5f4] text-stone-900 font-sans overflow-hidden">
      
      {/* Left Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={handleNavigateView}
        onLogout={handleLogout}
        currentRole={currentRole}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header */}
        <AppHeader
          activeView={activeView}
          setActiveView={handleNavigateView}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenRoleSelection={() => setIsRoleModalOpen(true)}
        />

        {/* View Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            
            {/* Screen 4: Heritage Dashboard */}
            {activeView === 'DASHBOARD' && (
              <HeritageDashboardView
                traditions={traditions}
                onSelectTradition={handleSelectTradition}
                onNavigateView={handleNavigateView}
              />
            )}

            {/* Screen 5: Heritage Map */}
            {activeView === 'MAP' && (
              <HeritageMapView
                traditions={traditions}
                onSelectTradition={handleSelectTradition}
              />
            )}

            {/* Screen 6: Traditions Explorer */}
            {activeView === 'EXPLORER' && (
              <TraditionsExplorerView
                traditions={traditions}
                onSelectTradition={handleSelectTradition}
                onOpenAddTradition={() => handleNavigateView('ADD_TRADITION')}
              />
            )}

            {/* Screen 7: Tradition Details */}
            {activeView === 'TRADITION_DETAIL' && (
              <TraditionDetailView
                tradition={selectedTradition}
                onBack={() => handleNavigateView('EXPLORER')}
                onNavigateToMatching={() => handleNavigateView('MATCHING')}
                onNavigateToAiAnalysis={() => handleNavigateView('AI_ANALYSIS')}
              />
            )}

            {/* Screen 8: Add / Register Tradition */}
            {activeView === 'ADD_TRADITION' && (
              <AddTraditionView
                onBack={() => handleNavigateView('EXPLORER')}
                onSaveTradition={handleSaveNewTradition}
              />
            )}

            {/* Screen 9: Practitioner Dashboard */}
            {activeView === 'PRACTITIONER_DASHBOARD' && (
              <PractitionerDashboardView />
            )}

            {/* Screen 10: Learner Dashboard */}
            {activeView === 'LEARNER_DASHBOARD' && (
              <LearnerDashboardView
                onNavigateToMatching={() => handleNavigateView('MATCHING')}
                onSelectTradition={handleSelectTradition}
                traditions={traditions}
              />
            )}

            {/* Screen 11: Master-Learner Matching */}
            {activeView === 'MATCHING' && (
              <MasterMatchingView
                onSelectTradition={handleSelectTradition}
                traditions={traditions}
              />
            )}

            {/* Screen 12: AI Heritage Analysis */}
            {activeView === 'AI_ANALYSIS' && (
              <AiAnalysisView
                traditions={traditions}
                onUpdateTraditionScore={() => {}}
              />
            )}

            {/* Supporting View: Documentation Vault */}
            {activeView === 'DOCUMENTATION' && (
              <KnowledgeVaultView
                archivedItems={archivedItems}
                onAddArchivedItem={(item) => setArchivedItems([item, ...archivedItems])}
              />
            )}

            {/* Supporting View: Validation Queue */}
            {activeView === 'VALIDATION' && (
              <ValidationQueueView
                queue={queue}
                onApproveItem={(id) => {
                  setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'COMMUNITY_VALIDATED' } : q));
                }}
              />
            )}

            {/* Supporting View: Recommendations */}
            {activeView === 'RECOMMENDATIONS' && (
              <RecommendationEngineView
                traditions={traditions}
                onNavigateTab={(tab) => {
                  if (tab === 'MATCHMAKER') handleNavigateView('MATCHING');
                  else if (tab === 'HTHS') handleNavigateView('AI_ANALYSIS');
                  else handleNavigateView('DASHBOARD');
                }}
              />
            )}

            {/* Supporting View: Settings Profile & Information (Full Shishya / Guru Details) */}
            {activeView === 'SETTINGS' && (
              <SettingsProfileView
                currentRole={currentRole}
                onLogout={handleLogout}
              />
            )}

          </div>
        </main>

      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessfulAuth={handleSuccessfulAuth}
      />

      <RoleSelectionModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onSelectRole={handleRoleSelection}
      />

    </div>
  );
}
