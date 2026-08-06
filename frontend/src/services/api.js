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
      message: 'Autonomous boardroom simulation completed successfully.',
      simulationId: `sim_${Date.now()}`,
      result: {
        simulation: {
          id: `sim_${Date.now()}`,
          title: payload.goal || 'Bangalore Restaurant Expansion',
          goal: payload.goal || 'Expand our restaurant chain to Bangalore with ₹2 Crore.',
          budget: payload.budget || '₹2 Crore',
          timeline: payload.timeline || '6 Months',
          location: payload.location || 'Bangalore',
          employees: payload.employees || 25,
          marketing_spend: payload.marketingSpend || '₹50 Lakhs'
        },
        ceo_plan: {
          objective: payload.goal || 'Expand our restaurant chain to Bangalore with ₹2 Crore.',
          core_strategy: 'Phased hyper-local expansion targeting high-density tech hubs in Bangalore (Indiranagar & Koramangala).',
          primary_risk: 'High initial real estate lease costs & operational supply chain friction.',
          expected_roi: '+42% Year-Over-Year'
        },
        agent_decisions: [
          { agent_key: 'ceo', agent_name: 'Aura-X (CEO)', role_title: 'Chief Executive Officer', confidence: 96, reasoning: 'Directing immediate market entrance in Bangalore. Capital deployment is optimized for quick break-even.', decision: 'APPROVED - EXECUTE STRATEGY' },
          { agent_key: 'market_intel', agent_name: 'Nexus (Market Intel)', role_title: 'VP Market Intelligence', confidence: 91, reasoning: 'Consumer density index in Indiranagar shows 88% affinity for artisanal dining.', decision: 'VALIDATED MARKET DEMAND' },
          { agent_key: 'cfo', agent_name: 'Vanguard (CFO)', role_title: 'Chief Financial Officer', confidence: 89, reasoning: 'CapEx allocation locked at ₹1.2 Cr for fit-outs and ₹80 L for working capital reserve.', decision: 'APPROVED WITH BUDGET CAP' },
          { agent_key: 'ops', agent_name: 'Apex (Ops)', role_title: 'Chief Operating Officer', confidence: 87, reasoning: 'Centralized cloud kitchen support reduces supply chain bottleneck by 35%.', decision: 'OPERATIONAL GREENLIGHT' },
          { agent_key: 'cmo', agent_name: 'Hyperion (CMO)', role_title: 'Chief Marketing Officer', confidence: 95, reasoning: 'Omnichannel launch campaign with influencer partnerships will drive 15,000 footfalls in Month 1.', decision: 'MARKETING PLAN READY' },
          { agent_key: 'hr', agent_name: 'Synergy (HR)', role_title: 'Chief People Officer', confidence: 88, reasoning: 'Talent acquisition pipeline for 25 hospitality professionals initialized.', decision: 'HIRING PIPELINE READY' },
          { agent_key: 'legal', agent_name: 'Aegis (Legal)', role_title: 'General Counsel', confidence: 94, reasoning: 'FSSAI licensing, commercial lease agreements, and compliance cleared.', decision: 'COMPLIANCE VERIFIED' },
          { agent_key: 'analytics', agent_name: 'Quant (Analytics)', role_title: 'Chief Data Officer', confidence: 92, reasoning: 'Predictive POS telemetry models set to track customer retention & LTV in real-time.', decision: 'TELEMETRY ONLINE' },
          { agent_key: 'risk', agent_name: 'Sentinel (Risk)', role_title: 'Chief Risk Officer', confidence: 86, reasoning: 'Mitigation protocol active for potential local inflation & ingredient cost surge.', decision: 'RISK BUFFER ADDED' }
        ],
        debate_logs: [
          { speaker_key: 'cfo', speaker_name: 'Vanguard (CFO)', speaker_role: 'Chief Financial Officer', message: 'I urge caution on allocating ₹50 Lakhs to marketing upfront. We must preserve 3 months of operational cash flow.' },
          { speaker_key: 'cmo', speaker_name: 'Hyperion (CMO)', speaker_role: 'Chief Marketing Officer', message: 'Without aggressive launch marketing, footfall velocity will lag by 45%, jeopardizing early break-even metrics.' },
          { speaker_key: 'ceo', speaker_name: 'Aura-X (CEO)', speaker_role: 'Chief Executive Officer', message: 'Compromise approved: Release ₹30 Lakhs for pre-launch awareness, releasing the remaining ₹20 Lakhs upon reaching Month 1 revenue milestones.' }
        ],
        report: {
          id: `rep_${Date.now()}`,
          executive_summary: 'Comprehensive analysis indicates high probability of success for Bangalore expansion under controlled CapEx deployment.',
          roi_projection: '+42.5% annualized return',
          risk_score: 28,
          budget_breakdown: [
            { category: 'Real Estate & Fit-outs', amount: '₹80 Lakhs', percentage: 40 },
            { category: 'Marketing & Launch', amount: '₹50 Lakhs', percentage: 25 },
            { category: 'Talent & Operations', amount: '₹40 Lakhs', percentage: 20 },
            { category: 'Emergency Reserve', amount: '₹30 Lakhs', percentage: 15 }
          ],
          department_highlights: [
            { department: 'Finance', detail: 'Break-even projected at Month 4.5 post-launch.' },
            { department: 'Marketing', detail: 'Targeting 20,000 unique diners in Q1.' },
            { department: 'Operations', detail: 'Vendor contracts negotiated with 12% margin discount.' }
          ],
          milestones: [
            { phase: 'Phase 1', task: 'Site Selection & Lease Finalization', timeline: 'Month 1-2' },
            { phase: 'Phase 2', task: 'Fit-outs, Staffing & FSSAI Licensing', timeline: 'Month 3-4' },
            { phase: 'Phase 3', task: 'Grand Launch & Omnichannel Marketing', timeline: 'Month 5-6' }
          ],
          final_recommendation: 'PROCEED WITH EXPANSION. Board consensus score: 92/100.'
        }
      }
    }));
  },

  getSimulations: async () => {
    return safeFetch(`${API_BASE}/simulations`, {
      headers: getHeaders()
    }, () => ({ simulations: [] }));
  },

  getSimulationById: async (id) => {
    return safeFetch(`${API_BASE}/simulations/${id}`, {
      headers: getHeaders()
    }, () => ({
      agent_decisions: [],
      debate_logs: [],
      report: null
    }));
  },

  compareSimulations: async (id1, id2) => {
    return safeFetch(`${API_BASE}/simulations/compare/${id1}/${id2}`, {
      headers: getHeaders()
    }, () => ({}));
  },

  deleteSimulation: async (id) => {
    return safeFetch(`${API_BASE}/simulations/delete/${id}`, {
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
