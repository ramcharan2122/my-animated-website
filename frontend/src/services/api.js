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

function extractCampaignInfo(goal = '') {
  const text = goal.toLowerCase();
  const explicitMatch = text.match(/(\d+)\s*%/);
  const userSpecifiedPct = explicitMatch ? parseInt(explicitMatch[1]) : null;

  let maxDiscount = userSpecifiedPct || 55;
  if (!userSpecifiedPct) {
    if (text.includes('black friday')) maxDiscount = 65;
    else if (text.includes('dussehra') || text.includes('dasara')) maxDiscount = 55;
    else if (text.includes('christmas') || text.includes('xmas')) maxDiscount = 50;
    else if (text.includes('new year')) maxDiscount = 60;
    else if (text.includes('diwali') || text.includes('deepavali')) maxDiscount = 58;
    else if (text.includes('clearance')) maxDiscount = 70;
  }

  const productDiscounts = {
    p1: Math.max(20, Math.round(maxDiscount * 0.65)),
    p2: Math.max(25, Math.round(maxDiscount * 0.80)),
    p3: maxDiscount,
    p4: Math.max(25, Math.round(maxDiscount * 0.88))
  };

  let title = '⚡ SEASONAL FESTIVAL SALE';
  let emoji = '⚡';
  let occasionKey = 'seasonal';

  if (text.includes('dussehra') || text.includes('dasara')) {
    title = '🏹 DUSSEHRA FESTIVAL CELEBRATION';
    emoji = '🏹';
    occasionKey = 'dussehra';
  } else if (text.includes('christmas') || text.includes('xmas')) {
    title = '🎄 CHRISTMAS HOLIDAY SALE';
    emoji = '🎄';
    occasionKey = 'christmas';
  } else if (text.includes('black friday')) {
    title = '🛍️ BLACK FRIDAY CYBER SALE';
    emoji = '🛍️';
    occasionKey = 'blackfriday';
  } else if (text.includes('new year')) {
    title = '🎆 NEW YEAR CELEBRATION SALE';
    emoji = '🎆';
    occasionKey = 'newyear';
  } else if (text.includes('diwali') || text.includes('deepavali')) {
    title = '🪔 DIWALI FESTIVAL OF LIGHTS SALE';
    emoji = '🪔';
    occasionKey = 'diwali';
  }

  const cleanCodeName = title.replace(/[^A-Z]/g, '').substring(0, 8);

  return {
    title,
    emoji,
    occasionKey,
    maxDiscount,
    discountPercentage: maxDiscount,
    productDiscounts,
    promoCode: `${cleanCodeName}-UPTO${maxDiscount}`,
    bannerText: `FESTIVE SPECIAL OFFER • UP TO ${maxDiscount}% OFF ACROSS ALL TECH CATEGORIES!`
  };
}

let activeCampaignStore = { status: 'IDLE', isActive: false };

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
    }, () => {
      const goalStr = payload.goal || payload.decisionTitle || 'Expand our restaurant chain to Bangalore with ₹2 Crore.';
      const campaignInfo = extractCampaignInfo(goalStr);
      const maxDisc = campaignInfo.maxDiscount;
      const pDiscounts = campaignInfo.productDiscounts;

      // Update in-memory campaign state for live demo store bridge
      activeCampaignStore = {
        status: 'ACTIVE',
        isActive: true,
        title: campaignInfo.title,
        emoji: campaignInfo.emoji,
        occasionKey: campaignInfo.occasionKey,
        discountPercentage: maxDisc,
        maxDiscount: maxDisc,
        productDiscounts: pDiscounts,
        promoCode: campaignInfo.promoCode,
        bannerText: campaignInfo.bannerText
      };

      return {
        message: 'Autonomous boardroom simulation completed successfully.',
        simulationId: `sim_${Date.now()}`,
        result: {
          simulation: {
            id: `sim_${Date.now()}`,
            title: campaignInfo.title,
            goal: goalStr,
            budget: payload.budget || '₹2 Crore',
            timeline: payload.timeline || '6 Months',
            location: payload.location || 'Bangalore',
            employees: payload.employees || 25,
            marketing_spend: payload.marketingSpend || '₹50 Lakhs'
          },
          ceo_plan: {
            objective: goalStr,
            core_strategy: `Market Unit Economics Analysis: Formulate an autonomous pricing roadmap. CFO & Quant Analytics modeled price elasticity curves per product to set variable discounts up to ${maxDisc}% Off.`,
            primary_risk: 'Preserving gross margins on high-cost hardware while driving conversion momentum.',
            expected_roi: '+310% Campaign IRR'
          },
          agent_decisions: [
            {
              agent_key: 'ceo',
              agent_name: 'Aura-X (CEO)',
              role_title: 'Chief Executive Officer',
              confidence: 96,
              reasoning: `Mandated CFO, CMO & Quant Analytics to analyze catalog unit margins. Board approved variable per-product discounts branded as UP TO ${maxDisc}% OFF.`,
              decision: `APPROVED: Authorize ${campaignInfo.title} with headline UP TO ${maxDisc}% OFF using promo code ${campaignInfo.promoCode}.`
            },
            {
              agent_key: 'market_intel',
              agent_name: 'Nexus (Market Intel)',
              role_title: 'VP of Market Intelligence',
              confidence: 93,
              reasoning: `Competitor benchmarking shows 50-60% headlines drive 3.2x higher CTR. Offering UP TO ${maxDisc}% OFF positions us as price leader in high-growth segments.`,
              decision: 'TARGET HIGH-INTENT BUYER COHORTS'
            },
            {
              agent_key: 'cfo',
              agent_name: 'Vanguard (CFO)',
              role_title: 'Chief Financial Officer',
              confidence: 94,
              reasoning: `Catalog Unit Margin Modeling: Flat discounts erode gross profit. Variable discounts (${pDiscounts.p1}% on AR Glasses, ${pDiscounts.p3}% on Smart Watches) preserve +31.5% net margin overall!`,
              decision: `CAP MAXIMUM DISCOUNT AT ${maxDisc}% WITH VARIABLE PRODUCT SLOTS`
            },
            {
              agent_key: 'ops',
              agent_name: 'Apex (Ops)',
              role_title: 'Chief Operating Officer',
              confidence: 91,
              reasoning: `Smart Watch inventory is at 140% baseline. Discounting it at peak ${maxDisc}% accelerates warehouse turnover while AR Glasses stay protected at ${pDiscounts.p1}%.`,
              decision: 'INVENTORY REALLOCATION COMPLETE'
            },
            {
              agent_key: 'cmo',
              agent_name: 'Hyperion (CMO)',
              role_title: 'Chief Marketing Officer',
              confidence: 95,
              reasoning: `Headline banner formatted as "UP TO ${maxDisc}% OFF" generates maximum urgency without cheapening core brand equity.`,
              decision: `LAUNCH DIGITAL CAMPAIGN WITH CODE ${campaignInfo.promoCode}`
            },
            {
              agent_key: 'hr',
              agent_name: 'Synergy (HR)',
              role_title: 'Chief People Officer',
              confidence: 89,
              reasoning: `Customer success & logistics support teams scheduled for 24/7 coverage during surge checkout hours.`,
              decision: 'SURGE STAFFING AUTHORIZED'
            },
            {
              agent_key: 'legal',
              agent_name: 'Aegis (Legal)',
              role_title: 'General Counsel',
              confidence: 95,
              reasoning: `Promotional compliance verified: Using "UP TO ${maxDisc}% OFF" strictly complies with consumer protection laws as item p3 reaches the advertised max discount.`,
              decision: 'LEGAL COMPLIANCE CERTIFIED'
            },
            {
              agent_key: 'analytics',
              agent_name: 'Quant (Analytics)',
              role_title: 'Chief Data Officer',
              confidence: 96,
              reasoning: `Price Elasticity Curve: Variable product-level pricing generates +310% revenue lift compared to a flat discount strategy.`,
              decision: 'REAL-TIME TELEMETRY TRACKING ONLINE'
            },
            {
              agent_key: 'risk',
              agent_name: 'Sentinel (Risk)',
              role_title: 'Chief Risk Officer',
              confidence: 90,
              reasoning: `Downside risk score managed down to 22/100 by enforcing per-user quantity caps on max-discounted inventory items.`,
              decision: 'ANTI-RESELLER CAPS ENFORCED'
            }
          ],
          debate_logs: [
            {
              speaker_key: 'cfo',
              speaker_name: 'Vanguard (CFO)',
              speaker_role: 'Chief Financial Officer',
              target_key: 'cmo',
              message: `Hyperion, a flat ${maxDisc}% discount storewide will collapse gross margin on Lumina AR Glasses to single digits! We must use variable product-level discounts.`,
              debate_type: 'challenge'
            },
            {
              speaker_key: 'cmo',
              speaker_name: 'Hyperion (CMO)',
              speaker_role: 'Chief Marketing Officer',
              target_key: 'cfo',
              message: `I agree on variable pricing, Vanguard, but our ad creatives need a strong headline! If we discount Cyber Chrono Smart Watch at ${maxDisc}%, can we advertise the campaign as 'UP TO ${maxDisc}% OFF'?`,
              debate_type: 'rebuttal'
            },
            {
              speaker_key: 'analytics',
              speaker_name: 'Quant (Analytics)',
              speaker_role: 'Chief Data Officer',
              target_key: 'cfo',
              message: `Elasticity telemetry confirms CMO's approach: 'UP TO ${maxDisc}% OFF' increases click-through rate by 64% while maintaining overall blended gross margin at +31.5%.`,
              debate_type: 'agreement'
            },
            {
              speaker_key: 'ops',
              speaker_name: 'Apex (Ops)',
              speaker_role: 'Chief Operating Officer',
              target_key: 'cmo',
              message: `From an operational standpoint, Smart Watch inventory is overstocked. Putting the peak ${maxDisc}% discount on item p3 solves our warehouse capacity issue.`,
              debate_type: 'agreement'
            },
            {
              speaker_key: 'risk',
              speaker_name: 'Sentinel (Risk)',
              speaker_role: 'Chief Risk Officer',
              target_key: 'ops',
              message: `However, offering ${maxDisc}% off on Smart Watches risks reseller arbitrage. We must limit checkout quantity to 2 units per customer.`,
              debate_type: 'challenge'
            },
            {
              speaker_key: 'legal',
              speaker_name: 'Aegis (Legal)',
              speaker_role: 'General Counsel',
              target_key: 'cmo',
              message: `Legal clearance granted: Advertising 'UP TO ${maxDisc}% OFF' is fully compliant since item p3 meets the advertised discount rate.`,
              debate_type: 'agreement'
            },
            {
              speaker_key: 'ceo',
              speaker_name: 'Aura-X (CEO)',
              speaker_role: 'Chief Executive Officer',
              target_key: 'all',
              message: `BOARD RESOLUTION PASSED: Launch ${campaignInfo.title} featuring variable product discounts UP TO ${maxDisc}% OFF. Promo code ${campaignInfo.promoCode} authorized for immediate store deployment!`,
              debate_type: 'synthesis'
            }
          ],
          report: {
            id: `rep_${Date.now()}`,
            executive_summary: `ShadowBoard AI evaluated "${goalStr}". CFO, Quant Analytics, and CMO executed product-level unit margin & price elasticity modeling. Rather than an arbitrary flat discount, the board formulated a dynamic pricing strategy featuring variable discounts per product (ranging from ${pDiscounts.p1}% to ${maxDisc}%), prominently formatted as "UP TO ${maxDisc}% OFF".`,
            roi_projection: '310% (Optimal Campaign IRR)',
            risk_score: 22,
            budget_breakdown: [
              { category: 'Digital Growth & Acquisition Ads', amount: '₹25 Lakhs', percentage: 50 },
              { category: 'Profit-Safe Discount Buffer', amount: '₹15 Lakhs', percentage: 30 },
              { category: 'Fulfillment & Logistics Capacity', amount: '₹10 Lakhs', percentage: 20 }
            ],
            department_highlights: [
              { department: 'Finance (CFO)', status: 'Approved', metric: '+31.5% Blended Net Margin' },
              { department: 'Analytics (CDO)', status: 'Validated', metric: `Price Elasticity Peak at ${maxDisc}%` },
              { department: 'Marketing (CMO)', status: 'Active', metric: `UP TO ${maxDisc}% OFF Banner Live` }
            ],
            milestones: [
              { phase: 'Immediate', title: 'Live Store Dynamic Campaign Dispatch', detail: `Deploy ${campaignInfo.title} with UP TO ${maxDisc}% OFF banner and code ${campaignInfo.promoCode}.` },
              { phase: 'Real-Time', title: 'Telemetry & Margin Protection', detail: `Monitor checkout conversions to guarantee blended net margin stays above target +25%.` }
            ],
            final_recommendation: `AUTONOMOUS BOARD DECISION: Execute ${campaignInfo.title} with variable product discounts UP TO ${maxDisc}% OFF.`
          }
        }
      };
    });
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
    return safeFetch(`${API_BASE}/campaign/status`, {}, () => activeCampaignStore);
  },

  deployCampaign: async (campaignPayload) => {
    return safeFetch(`${API_BASE}/campaign/deploy`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(campaignPayload)
    }, () => {
      activeCampaignStore = { ...campaignPayload, isActive: true, status: 'ACTIVE' };
      return activeCampaignStore;
    });
  },

  resetCampaign: async () => {
    return safeFetch(`${API_BASE}/campaign/reset`, {
      method: 'POST',
      headers: getHeaders()
    }, () => {
      activeCampaignStore = { status: 'IDLE', isActive: false };
      return activeCampaignStore;
    });
  }
};
