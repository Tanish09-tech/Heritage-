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
    const savedToken = localStorage.getItem('sanskriti_token');

    for (const base of urlsToTry) {
      const url = `${base}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        'x-user-role': savedRole,
        ...(savedToken ? { 'Authorization': `Bearer ${savedToken}` } : {}),
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
    if (res.token) {
      localStorage.setItem('sanskriti_token', res.token);
    }
    return res.user;
  }

  async registerUser(userData) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (res.token) {
      localStorage.setItem('sanskriti_token', res.token);
    }
    return res.user;
  }

  async getUsers() {
    try {
      const res = await this.request('/auth/users');
      return res.users || [];
    } catch {
      return [
        {
          id: 'user-shishya-01',
          name: 'Aniket Deshmukh',
          role: 'LEARNER',
          email: 'shishya1@sanskriti.gov.in',
          phone: '+91 98234 56789',
          dob: '2002-05-15',
          state: 'Maharashtra',
          hobbies: 'Shahiri Powada recitation, Daf percussion, Historical Maratha Ballads',
          idType: 'Aadhaar Card',
          idNumber: '4829-1029-3847',
          idProofFileName: 'aniket_aadhaar_card.pdf',
          idVerified: true
        },
        {
          id: 'user-shishya-02',
          name: 'Simran Kaur',
          role: 'LEARNER',
          email: 'shishya2@sanskriti.gov.in',
          phone: '+91 98112 34567',
          dob: '2003-11-20',
          state: 'Punjab',
          hobbies: 'Phulkari folk embroidery, Giddha folk dance, Punjabi folk music',
          idType: 'Voter ID',
          idNumber: 'PBV9823412',
          idProofFileName: 'simran_voter_id.pdf',
          idVerified: true
        },
        {
          id: 'user-shishya-03',
          name: 'Aarav Patel',
          role: 'LEARNER',
          email: 'shishya3@sanskriti.gov.in',
          phone: '+91 97234 56781',
          dob: '2001-09-10',
          state: 'Gujarat',
          hobbies: 'Bhavai vesha acting, Garba drumming, Kutchi embroidery',
          idType: 'PAN Card',
          idNumber: 'APATE7890K',
          idProofFileName: 'aarav_pan_card.jpg',
          idVerified: true
        },
        {
          id: 'user-guru-01',
          name: 'Shahir Tukaram Jagtap',
          role: 'PRACTITIONER',
          email: 'guru1@sanskriti.gov.in',
          phone: '+91 94220 12345',
          dob: '1968-08-20',
          state: 'Maharashtra',
          experience: '28 Years of continuous Shahiri Akhada & Daf oral tradition',
          expertTradition: 'Shahiri Powada (Oral Ballads)',
          idType: 'Aadhaar Card',
          idNumber: '8910-2345-6789',
          idProofFileName: 'shahir_jagtap_aadhaar.pdf',
          idVerified: true
        },
        {
          id: 'user-guru-02',
          name: 'Ustad Harinder Singh',
          role: 'PRACTITIONER',
          email: 'guru2@sanskriti.gov.in',
          phone: '+91 98140 98765',
          dob: '1965-03-12',
          state: 'Punjab',
          experience: '32 Years of traditional Gatka Shastar Vidiya & folk rhythms',
          expertTradition: 'Baisakhi & Gatka Martial Art',
          idType: 'Voter ID',
          idNumber: 'PBV4567890',
          idProofFileName: 'ustad_harinder_voterid.pdf',
          idVerified: true
        },
        {
          id: 'user-guru-03',
          name: 'Pandit Raghunath Joshi',
          role: 'PRACTITIONER',
          email: 'guru3@sanskriti.gov.in',
          phone: '+91 98250 43210',
          dob: '1970-11-05',
          state: 'Gujarat',
          experience: '25 Years of Bhavai Folk Theatre & Garba compositions',
          expertTradition: 'Bhavai Folk Theatre',
          idType: 'PAN Card',
          idNumber: 'PRJOS5678L',
          idProofFileName: 'raghunath_pan_card.jpg',
          idVerified: true
        }
      ];
    }
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

  async deleteVaultItem(id) {
    try {
      const res = await this.request(`/vault/${id}`, {
        method: 'DELETE'
      });
      return res;
    } catch (err) {
      console.warn('API vault delete error:', err.message);
      return { success: true };
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

  // Gemini AI 2026 Survival Prediction Engine
  async predictTraditionSurvival(data) {
    try {
      const res = await this.request('/gemini/predict-survival', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return res;
    } catch (err) {
      console.warn('Gemini 2026 survival prediction endpoint offline or error, using client fallback:', err);
      
      let score = 40;
      if (data.score && typeof data.score === 'number' && data.score > 0) {
        score = Math.min(98, Math.max(12, Math.round(data.score)));
      } else {
        const title = data.traditionTitle || 'Heritage';
        let hash = 0;
        for (let i = 0; i < title.length; i++) {
          hash = (hash << 5) - hash + title.charCodeAt(i);
          hash |= 0;
        }
        score = Math.min(95, Math.max(22, 28 + (Math.abs(hash) % 40) + ((data.activeLearners || 2) * 3)));
      }

      const status = score >= 75 ? 'Strong' : score >= 45 ? 'Medium' : 'Critical';

      return {
        success: true,
        survivalPercentage2026: score,
        status: status,
        decayVelocity: score < 45 ? '3.5% per year' : score < 75 ? '1.8% per year' : '0.4% per year',
        estimatedSurvivingPractitioners2026: data.activePractitioners || 15,
        aiSummary2026: `In 2026, ${data.traditionTitle} retains approximately ${score}% of its living transmission vitality in ${data.state || 'India'} (${status} risk level).`,
        keyThreats2026: [
          "Aging practitioner demographic without successors",
          "Economic shifts reducing full-time artisans",
          "Lack of digital archival recording"
        ],
        policyIntervention2026: `Institute immediate Gurukul stipend scheme and digital masterclass archiving for ${data.traditionTitle}.`,
        source: 'client_fallback_2026'
      };
    }
  }
}

export const api = new ApiService();
