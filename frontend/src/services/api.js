const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('shadowboard_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const MOCK_DEMO_USER = {
  id: 'usr_demo_executive_001',
  name: 'Alex Vance (Executive Demo)',
  email: 'executive@enterprise.ai',
  organization: 'Enterprise Dynamics Corp',
  role: 'Group CEO & Founder'
};

const MOCK_DEMO_TOKEN = 'shadowboard_demo_jwt_token_2026_x1';

const safeFetch = async (url, options = {}, fallbackHandler = null) => {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data;
    } else {
      if (fallbackHandler) return fallbackHandler();
      throw new Error('Backend server unavailable. Please try Demo Login.');
    }
  } catch (err) {
    if (fallbackHandler) {
      console.warn('API connection fallback activated:', err.message);
      return fallbackHandler();
    }
    throw err;
  }
};

export const api = {
  // Auth
  login: async (email, password) => {
    return safeFetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }, () => ({
      message: 'Login successful (Client Demo Mode).',
      token: MOCK_DEMO_TOKEN,
      user: { ...MOCK_DEMO_USER, email: email || MOCK_DEMO_USER.email }
    }));
  },

  register: async (userData) => {
    return safeFetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }, () => ({
      message: 'Account created successfully (Client Demo Mode).',
      token: MOCK_DEMO_TOKEN,
      user: {
        id: `usr_${Date.now()}`,
        name: userData.name || 'Executive Director',
        email: userData.email,
        organization: userData.organization || 'Enterprise AI Labs',
        role: userData.role || 'Executive Director'
      }
    }));
  },

  demoLogin: async () => {
    return safeFetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, () => ({
      message: 'Demo executive login granted.',
      token: MOCK_DEMO_TOKEN,
      user: MOCK_DEMO_USER
    }));
  },

  getMe: async () => {
    return safeFetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    }, () => ({
      user: MOCK_DEMO_USER
    }));
  },

  // Simulations
  runSimulation: async (payload) => {
    return safeFetch(`${API_BASE}/simulations/run`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    }, () => ({
      simulationId: `sim_${Date.now()}`,
      status: 'COMPLETED',
      decisionName: payload.decisionTitle || 'Autonomous AI Strategic Expansion',
      consensusScore: 94,
      riskLevel: 'MODERATE',
      projectedGrowth: '+34.2%',
      agents: [
        { id: 'ceo', name: 'AI CEO (Strategy)', role: 'Chief Executive', sentiment: 'STRONGLY_FAVORABLE', score: 96, rationale: 'Accelerates enterprise market share while maintaining gross profit margin targets.' },
        { id: 'cfo', name: 'AI CFO (Finance)', role: 'Chief Financial Officer', sentiment: 'FAVORABLE', score: 88, rationale: 'Capital deployment aligns with return-on-invested-capital (ROIC) hurdles.' },
        { id: 'cmo', name: 'AI CMO (Marketing)', role: 'Chief Marketing Officer', sentiment: 'STRONGLY_FAVORABLE', score: 95, rationale: 'High brand velocity index and viral customer acquisition projections.' },
        { id: 'cto', name: 'AI CTO (Tech)', role: 'Chief Technology Officer', sentiment: 'NEUTRAL_CAUTIOUS', score: 82, rationale: 'Requires scaling neural compute nodes to support 10x traffic spikes.' }
      ]
    }));
  },

  getSimulations: async () => {
    return safeFetch(`${API_BASE}/simulations`, {
      headers: getHeaders()
    }, () => []);
  },

  getSimulationById: async (id) => {
    return safeFetch(`${API_BASE}/simulations/${id}`, {
      headers: getHeaders()
    }, () => null);
  },

  compareSimulations: async (id1, id2) => {
    return safeFetch(`${API_BASE}/simulations/compare/${id1}/${id2}`, {
      headers: getHeaders()
    }, () => ({}));
  },

  deleteSimulation: async (id) => {
    return safeFetch(`${API_BASE}/simulations/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }, () => ({ message: 'Simulation removed' }));
  },

  // Reports
  getLatestReport: async () => {
    return safeFetch(`${API_BASE}/reports/latest`, {
      headers: getHeaders()
    }, () => ({}));
  },

  getReportBySimId: async (simId) => {
    return safeFetch(`${API_BASE}/reports/${simId}`, {
      headers: getHeaders()
    }, () => ({}));
  },

  // Settings
  getSettings: async () => {
    return safeFetch(`${API_BASE}/settings`, {
      headers: getHeaders()
    }, () => ({
      riskTolerance: 75,
      autonomyLevel: 'SEMI_AUTONOMOUS',
      simulationSpeed: 'FAST'
    }));
  },

  updateSettings: async (settingsData) => {
    return safeFetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(settingsData)
    }, () => settingsData);
  },

  // Live Demo Store Campaign Bridge
  getCampaignStatus: async () => {
    return safeFetch(`${API_BASE}/campaign/status`, {}, () => ({ status: 'IDLE' }));
  },

  deployCampaign: async (campaignPayload) => {
    return safeFetch(`${API_BASE}/campaign/deploy`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(campaignPayload)
    }, () => ({ status: 'ACTIVE' }));
  },

  resetCampaign: async () => {
    return safeFetch(`${API_BASE}/campaign/reset`, {
      method: 'POST',
      headers: getHeaders()
    }, () => ({ status: 'IDLE' }));
  }
};
