const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('shadowboard_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  demoLogin: async () => {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Demo login failed');
    return data;
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch user profile');
    return data;
  },

  // Simulations
  runSimulation: async (payload) => {
    const res = await fetch(`${API_BASE}/simulations/run`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to execute boardroom simulation');
    return data;
  },

  getSimulations: async () => {
    const res = await fetch(`${API_BASE}/simulations`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch simulations');
    return data;
  },

  getSimulationById: async (id) => {
    const res = await fetch(`${API_BASE}/simulations/${id}`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch simulation details');
    return data;
  },

  compareSimulations: async (id1, id2) => {
    const res = await fetch(`${API_BASE}/simulations/compare/${id1}/${id2}`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to compare simulations');
    return data;
  },

  deleteSimulation: async (id) => {
    const res = await fetch(`${API_BASE}/simulations/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete simulation');
    return data;
  },

  // Reports
  getLatestReport: async () => {
    const res = await fetch(`${API_BASE}/reports/latest`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch report');
    return data;
  },

  getReportBySimId: async (simId) => {
    const res = await fetch(`${API_BASE}/reports/${simId}`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch report');
    return data;
  },

  // Settings
  getSettings: async () => {
    const res = await fetch(`${API_BASE}/settings`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch settings');
    return data;
  },

  updateSettings: async (settingsData) => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(settingsData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings');
    return data;
  },

  // Live Demo Store Campaign Bridge
  getCampaignStatus: async () => {
    const res = await fetch(`${API_BASE}/campaign/status`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch campaign status');
    return data;
  },

  deployCampaign: async (campaignPayload) => {
    const res = await fetch(`${API_BASE}/campaign/deploy`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(campaignPayload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to deploy campaign');
    return data;
  },

  resetCampaign: async () => {
    const res = await fetch(`${API_BASE}/campaign/reset`, {
      method: 'POST',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reset campaign');
    return data;
  }
};
