import React, { useState, useEffect } from 'react';
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
import ProfileDetailsModal from './components/ProfileDetailsModal';
import { api } from './services/api';

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
      const savedUserStr = localStorage.getItem('sanskriti_user');
      const savedRole = localStorage.getItem('sanskriti_role');
      const savedView = localStorage.getItem('sanskriti_view');
      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        if (savedUser) {
          if (savedView && savedView !== 'LANDING' && savedView !== 'LOGIN') return savedView;
          if (savedRole === 'LEARNER' || savedUser.role === 'LEARNER') return 'LEARNER_DASHBOARD';
          if (savedRole === 'PRACTITIONER' || savedUser.role === 'PRACTITIONER') return 'PRACTITIONER_DASHBOARD';
          return 'DASHBOARD';
        }
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
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [pendingTargetView, setPendingTargetView] = useState(null);
  const [queue, setQueue] = useState(VALIDATION_QUEUE || []);
  const [archivedItems, setArchivedItems] = useState(ARCHIVED_KNOWLEDGE_ITEMS || []);

  // Sync with Backend on Component Mount
  useEffect(() => {
    let isMounted = true;

    // Load living traditions from backend
    api.getTraditions().then(backendTraditions => {
      if (isMounted && backendTraditions && backendTraditions.length > 0) {
        setTraditions(backendTraditions);
        if (!selectedTradition) setSelectedTradition(backendTraditions[0]);
      }
    }).catch(err => {
      console.warn('Using local traditions fallback:', err.message);
    });

    // Load validation queue from backend
    api.getValidationQueue().then(backendQueue => {
      if (isMounted && backendQueue && backendQueue.length > 0) {
        setQueue(backendQueue);
      }
    }).catch(err => {
      console.warn('Using local validation queue fallback:', err.message);
    });

    // Load knowledge vault items from backend
    api.getVaultItems().then(backendVault => {
      if (isMounted && backendVault && backendVault.length > 0) {
        setArchivedItems(backendVault);
      }
    }).catch(err => {
      console.warn('Using local knowledge vault fallback:', err.message);
    });

    return () => { isMounted = false; };
  }, []);

  // Handlers
  const handleSelectTradition = (tradition) => {
    setSelectedTradition(tradition);
    handleNavigateView('TRADITION_DETAIL');
  };

  const handleSaveNewTradition = async (newTradition) => {
    try {
      const saved = await api.createTradition(newTradition);
      setTraditions(prev => [saved, ...prev]);
      setSelectedTradition(saved);
    } catch (err) {
      console.warn('Error saving to backend, saving locally:', err);
      setTraditions(prev => [newTradition, ...prev]);
      setSelectedTradition(newTradition);
    }
  };

  const handleNavigateView = (view) => {
    setActiveView(view);
    if (currentUser && view !== 'LANDING' && view !== 'LOGIN') {
      try {
        localStorage.setItem('sanskriti_view', view);
      } catch {}
    }
  };

  const handleRoleSelection = async (roleId, targetView) => {
    setIsRoleModalOpen(false);
    if (roleId === 'AUTHORITY') {
      handleLoginSuccess('AUTHORITY', targetView || 'DASHBOARD', {
        name: 'Dr. Rajesh Sharma',
        role: 'AUTHORITY',
        email: 'admin@sanskriti.gov.in',
        profileCompleted: true
      });
      return;
    }

    // Check if current user already has completed details
    if (currentUser && (currentUser.role === roleId || currentUser.profileCompleted)) {
      setCurrentRole(roleId);
      handleNavigateView(targetView || (roleId === 'LEARNER' ? 'LEARNER_DASHBOARD' : 'PRACTITIONER_DASHBOARD'));
      return;
    }

    const defaultEmail = roleId === 'LEARNER' ? 'shishya1@sanskriti.gov.in' : 'guru1@sanskriti.gov.in';

    // Check backend if account is already registered with completed profile
    try {
      const existingUser = await api.loginUser({ email: defaultEmail, role: roleId });
      if (existingUser) {
        handleLoginSuccess(roleId, targetView, { ...existingUser, profileCompleted: true });
        return;
      }
    } catch (e) {}

    // Existing demo user fallback: demo accounts already have mandatory details
    const defaultUser = {
      name: roleId === 'LEARNER' ? 'Aniket Deshmukh' : 'Shahir Tukaram Jagtap',
      role: roleId,
      email: defaultEmail,
      dob: roleId === 'LEARNER' ? '2002-05-15' : '1968-08-20',
      state: 'Maharashtra',
      hobbies: roleId === 'LEARNER' ? 'Shahiri Powada recitation, Daf percussion' : undefined,
      experience: roleId === 'PRACTITIONER' ? '28 Years of continuous Shahiri Akhada' : undefined,
      expertTradition: roleId === 'PRACTITIONER' ? 'Shahiri Powada (Oral Ballads)' : undefined,
      profileCompleted: true
    };
    handleLoginSuccess(roleId, targetView, defaultUser);
  };

  const handleSuccessfulAuth = async (roleId, targetView, userEmail) => {
    setIsAuthModalOpen(false);
    if (roleId === 'AUTHORITY') {
      handleLoginSuccess('AUTHORITY', targetView || 'DASHBOARD', {
        name: 'Dr. Rajesh Sharma',
        role: 'AUTHORITY',
        email: 'admin@sanskriti.gov.in',
        profileCompleted: true
      });
      return;
    }

    const defaultEmail = userEmail || (roleId === 'LEARNER' ? 'shishya1@sanskriti.gov.in' : 'guru1@sanskriti.gov.in');

    // Check backend if account is already registered with completed profile
    try {
      const existingUser = await api.loginUser({ email: defaultEmail, role: roleId });
      if (existingUser) {
        handleLoginSuccess(roleId, targetView, { ...existingUser, profileCompleted: true });
        return;
      }
    } catch (e) {}

    // Existing demo user fallback: demo accounts already have mandatory details
    const defaultUser = {
      name: roleId === 'LEARNER' ? 'Aniket Deshmukh' : 'Shahir Tukaram Jagtap',
      role: roleId,
      email: defaultEmail,
      dob: roleId === 'LEARNER' ? '2002-05-15' : '1968-08-20',
      state: 'Maharashtra',
      hobbies: roleId === 'LEARNER' ? 'Shahiri Powada recitation, Daf percussion' : undefined,
      experience: roleId === 'PRACTITIONER' ? '28 Years of continuous Shahiri Akhada' : undefined,
      expertTradition: roleId === 'PRACTITIONER' ? 'Shahiri Powada (Oral Ballads)' : undefined,
      profileCompleted: true
    };
    handleLoginSuccess(roleId, targetView, defaultUser);
  };

  const handleProfileComplete = (completedData) => {
    const updatedUser = {
      ...currentUser,
      ...completedData,
      profileCompleted: true
    };
    setCurrentUser(updatedUser);
    setIsProfileModalOpen(false);

    // Sync to backend database
    api.registerUser(updatedUser).catch(err => {
      console.warn('Backend user registration sync error:', err.message);
    });

    const destView = pendingTargetView || (updatedUser.role === 'LEARNER' ? 'LEARNER_DASHBOARD' : (updatedUser.role === 'PRACTITIONER' ? 'PRACTITIONER_DASHBOARD' : 'DASHBOARD'));
    setActiveView(destView);
    setPendingTargetView(null);

    try {
      localStorage.setItem('sanskriti_user', JSON.stringify(updatedUser));
      localStorage.setItem('sanskriti_role', updatedUser.role);
      localStorage.setItem('sanskriti_view', destView);
    } catch (err) {
      console.error('Failed to save updated session:', err);
    }
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
    setIsProfileModalOpen(false);
    setActiveView('LANDING'); // Show landing page first after logout
  };

  const handleLoginSuccess = (roleKey, targetView, userData) => {
    const userObj = userData || { 
      name: roleKey === 'LEARNER' ? 'Aniket Deshmukh' : (roleKey === 'PRACTITIONER' ? 'Shahir Tukaram Jagtap' : 'Dr. Rajesh Sharma'), 
      role: roleKey,
      email: roleKey === 'LEARNER' ? 'shishya1@sanskriti.gov.in' : (roleKey === 'PRACTITIONER' ? 'guru1@sanskriti.gov.in' : 'admin@sanskriti.gov.in'),
      profileCompleted: true
    };

    const destView = targetView || (roleKey === 'LEARNER' ? 'LEARNER_DASHBOARD' : (roleKey === 'PRACTITIONER' ? 'PRACTITIONER_DASHBOARD' : 'DASHBOARD'));

    // Sync to backend database
    api.registerUser(userObj).catch(err => {
      console.warn('Backend user sync on login error:', err.message);
    });

    setCurrentRole(roleKey);
    setCurrentUser(userObj);
    setIsProfileModalOpen(false);
    setActiveView(destView);

    // Save session in localStorage so user doesn't get automatically logged out or asked for login again
    try {
      localStorage.setItem('sanskriti_user', JSON.stringify(userObj));
      localStorage.setItem('sanskriti_role', roleKey);
      localStorage.setItem('sanskriti_view', destView);
    } catch (err) {
      console.error('Failed to save session:', err);
    }
  };

  const handleLandingAction = () => {
    if (currentUser) {
      const destView = currentRole === 'LEARNER' ? 'LEARNER_DASHBOARD' : (currentRole === 'PRACTITIONER' ? 'PRACTITIONER_DASHBOARD' : 'DASHBOARD');
      setActiveView(destView);
    } else {
      setActiveView('LOGIN');
    }
  };

  // Screen 1: Landing Page
  if (activeView === 'LANDING') {
    return (
      <div className="relative min-h-screen bg-[#0d0d0d] font-sans">
        <LandingPageView
          onExploreHeritage={handleLandingAction}
          onOpenDashboard={handleLandingAction}
          onOpenPractitioners={handleLandingAction}
          onOpenLearn={handleLandingAction}
          onOpenAiAnalysis={handleLandingAction}
          onOpenDocumentation={handleLandingAction}
          onOpenLogin={handleLandingAction}
          onJoinMission={handleLandingAction}
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

  // Screen 2: Dedicated 3-Role Login Page
  // Strict Auth Guard: Do NOT ask for login credentials again if user is already logged in!
  if (!currentUser || (activeView === 'LOGIN' && !currentUser)) {
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
                currentRole={currentRole}
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
              <PractitionerDashboardView currentUser={currentUser} />
            )}

            {/* Screen 10: Learner Dashboard */}
            {activeView === 'LEARNER_DASHBOARD' && (
              <LearnerDashboardView
                onNavigateToMatching={() => handleNavigateView('MATCHING')}
                onSelectTradition={handleSelectTradition}
                traditions={traditions}
                currentUser={currentUser}
              />
            )}

            {/* Screen 11: Master-Learner Matching */}
            {activeView === 'MATCHING' && (
              <MasterMatchingView
                onSelectTradition={handleSelectTradition}
                traditions={traditions}
              />
            )}

            {/* Screen 12: AI Heritage Analysis (Admin Only) */}
            {activeView === 'AI_ANALYSIS' && currentRole === 'AUTHORITY' && (
              <AiAnalysisView
                traditions={traditions}
                onUpdateTraditionScore={() => {}}
              />
            )}

            {/* Supporting View: Documentation Vault */}
            {activeView === 'DOCUMENTATION' && (
              <KnowledgeVaultView
                archivedItems={archivedItems}
                onAddArchivedItem={async (item) => {
                  try {
                    const created = await api.addVaultItem(item);
                    setArchivedItems(prev => [created, ...prev]);
                  } catch (e) {
                    setArchivedItems(prev => [item, ...prev]);
                  }
                }}
              />
            )}

            {/* Supporting View: Validation Queue */}
            {activeView === 'VALIDATION' && (
              <ValidationQueueView
                queue={queue}
                onApproveItem={async (id) => {
                  try {
                    await api.verifyValidationItem(id);
                  } catch (e) {
                    console.warn('API verification call failed:', e);
                  }
                  setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'COMMUNITY_VALIDATED' } : q));
                }}
              />
            )}

            {/* Supporting View: Recommendations -> Direct Guru-Shishya Matchmaker */}
            {activeView === 'RECOMMENDATIONS' && (
              <MasterMatchingView
                onSelectTradition={handleSelectTradition}
                traditions={traditions}
                currentUser={currentUser}
              />
            )}

            {/* Supporting View: Settings Profile & Information (Full Shishya / Guru Details) */}
            {activeView === 'SETTINGS' && (
              <SettingsProfileView
                currentRole={currentRole}
                currentUser={currentUser}
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

      {/* Mandatory Profile Details Modal for Shishya & Guru */}
      <ProfileDetailsModal
        isOpen={isProfileModalOpen && Boolean(currentUser) && !currentUser.profileCompleted}
        role={currentUser?.role || currentRole}
        initialData={currentUser || {}}
        onComplete={handleProfileComplete}
      />

    </div>
  );
}
