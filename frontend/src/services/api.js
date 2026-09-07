import { 
  PILOT_TRADITIONS, 
  VALIDATION_QUEUE, 
  ARCHIVED_KNOWLEDGE_ITEMS, 
  MASTER_PRACTITIONERS, 
  LEARNER_PROFILES 
} from '../data/heritageData.js';

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_API_URL) || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.isOnline = true;
  }

  async request(endpoint, options = {}) {
    const urlsToTry = [this.baseUrl];
    if (this.baseUrl.includes(':5000')) {
      urlsToTry.push(this.baseUrl.replace(':5000', ':5001'));
    }

    let lastError = null;
    const savedRole = localStorage.getItem('sanskriti_role') || 'AUTHORITY';

    for (const base of urlsToTry) {
      const url = `${base}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        'x-user-role': savedRole,
        ...options.headers
      };

      try {
        const response = await fetch(url, {
          ...options,
          headers
        });

        this.baseUrl = base;
        this.isOnline = true;

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errMsg = errorData.error || `HTTP error! status: ${response.status}`;
          const err = new Error(errMsg);
          err.status = response.status;
          throw err;
        }

        return await response.json();
      } catch (err) {
        lastError = err;
        // If this was an HTTP response from an active server, re-throw immediately
        if (err.status) {
          throw err;
        }
      }
    }

    console.warn(`[API] Request to ${endpoint} failed:`, lastError?.message, 'Using local fallback.');
    this.isOnline = false;
    throw lastError;
  }

  // Health
  async checkHealth() {
    try {
      const res = await this.request('/health');
      return res.status === 'ok';
    } catch {
      return false;
    }
  }

  // Auth & Profile
  async loginUser(credentials) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    return res.user;
  }

  async registerUser(userData) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return res.user;
  }

  // Traditions
  async getTraditions(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const endpoint = query ? `/traditions?${query}` : '/traditions';
      const res = await this.request(endpoint);
      return res.traditions || [];
    } catch {
      // Fallback to local pilot traditions
      let list = [...PILOT_TRADITIONS];
      if (params.state && params.state !== 'All') {
        list = list.filter(t => t.state?.toLowerCase() === params.state.toLowerCase());
      }
      if (params.category && params.category !== 'All') {
        list = list.filter(t => t.category?.toLowerCase() === params.category.toLowerCase());
      }
      return list;
    }
  }

  async getTraditionById(id) {
    try {
      const res = await this.request(`/traditions/${id}`);
      return res.tradition;
    } catch {
      return PILOT_TRADITIONS.find(t => t.id === id) || null;
    }
  }

  async createTradition(traditionData) {
    try {
      const res = await this.request('/traditions', {
        method: 'POST',
        body: JSON.stringify(traditionData)
      });
      return res.tradition;
    } catch {
      return {
        ...traditionData,
        id: `tra-${Date.now()}`,
        score: traditionData.score || 60,
        status: traditionData.status || 'VULNERABLE',
        statusLabel: 'Vulnerable',
        color: '#ea580c'
      };
    }
  }

  // Validation Queue
  async getValidationQueue() {
    try {
      const res = await this.request('/validation');
      return res.queue || [];
    } catch {
      return VALIDATION_QUEUE || [];
    }
  }

  async addValidationItem(itemData) {
    try {
      const res = await this.request('/validation', {
        method: 'POST',
        body: JSON.stringify(itemData)
      });
      return res.item;
    } catch {
      return {
        id: `val-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        status: 'PENDING_REVIEW',
        ...itemData
      };
    }
  }

  async verifyValidationItem(id) {
    try {
      const res = await this.request(`/validation/${id}/verify`, {
        method: 'PUT'
      });
      return res.item;
    } catch {
      return { id, status: 'COMMUNITY_VALIDATED' };
    }
  }

  // Knowledge Vault
  async getVaultItems() {
    try {
      const res = await this.request('/vault');
      return res.items || [];
    } catch {
      return ARCHIVED_KNOWLEDGE_ITEMS || [];
    }
  }

  async addVaultItem(itemData) {
    try {
      const res = await this.request('/vault', {
        method: 'POST',
        body: JSON.stringify(itemData)
      });
      return res.item;
    } catch {
      return {
        id: `kn-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        ...itemData
      };
    }
  }

  // Mentorship / Matchmaking
  async getPractitioners() {
    try {
      const res = await this.request('/match/practitioners');
      return res.practitioners || [];
    } catch {
      return MASTER_PRACTITIONERS || [];
    }
  }

  async getLearners() {
    try {
      const res = await this.request('/match/learners');
      return res.learners || [];
    } catch {
      return LEARNER_PROFILES || [];
    }
  }

  async getApplications(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const endpoint = query ? `/match/applications?${query}` : '/match/applications';
      const res = await this.request(endpoint);
      return res.applications || [];
    } catch {
      return [];
    }
  }

  async applyForMentorship(applicationData) {
    try {
      const res = await this.request('/match/apply', {
        method: 'POST',
        body: JSON.stringify(applicationData)
      });
      return res.application;
    } catch {
      return {
        id: `app-${Date.now()}`,
        status: 'PENDING',
        ...applicationData
      };
    }
  }

  async respondToLearnerRequest(id, status) {
    try {
      const res = await this.request(`/match/requests/${id}/respond`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      return res.application;
    } catch {
      return { id, status };
    }
  }

  async getMessages(applicationId) {
    try {
      const res = await this.request(`/match/applications/${applicationId}/messages`);
      return res;
    } catch {
      return { status: 'PENDING', messages: [] };
    }
  }

  async sendMessage(applicationId, messageData) {
    try {
      const res = await this.request(`/match/applications/${applicationId}/messages`, {
        method: 'POST',
        body: JSON.stringify(messageData)
      });
      return res;
    } catch (err) {
      console.warn('API error sending message:', err.message);
      throw err;
    }
  }

  async createSession(applicationId, sessionData) {
    try {
      const res = await this.request(`/match/applications/${applicationId}/sessions`, {
        method: 'POST',
        body: JSON.stringify(sessionData)
      });
      return res;
    } catch (err) {
      console.warn('API error creating session:', err.message);
      return {
        success: true,
        session: {
          id: `ses-${Date.now()}`,
          status: 'SCHEDULED',
          ...sessionData
        }
      };
    }
  }

  async updateSessionStatus(applicationId, sessionId, status) {
    try {
      const res = await this.request(`/match/applications/${applicationId}/sessions/${sessionId}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      return res;
    } catch (err) {
      console.warn('API error updating session status:', err.message);
      return { success: true };
    }
  }

  // Analytics
  async getAnalytics() {
    try {
      const res = await this.request('/analytics/summary');
      return res;
    } catch {
      return null;
    }
  }

  // Gemini AI Image Generation
  async generateGeminiImage(data) {
    try {
      const res = await this.request('/gemini/generate-image', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return res;
    } catch (err) {
      console.warn('Gemini endpoint offline or error, generating prompt fallback:', err);
      const title = data.traditionTitle || 'Heritage Tradition';
      const state = data.state || '';
      return {
        success: true,
        imageUrl: `https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80`,
        promptUsed: `${title} ${state} traditional cultural Indian art photorealistic`,
        source: 'client_fallback',
        message: 'Using visual fallback for heritage tradition.'
      };
    }
  }
}

export const api = new ApiService();
