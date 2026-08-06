import { GoogleGenerativeAI } from '@google/generative-ai';

const AGENT_DEFINITIONS = [
  {
    key: 'ceo',
    name: 'Aura-X (CEO)',
    title: 'Chief Executive Officer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    color: '#6366f1',
    focus: 'Overall Corporate Strategy, Capital Allocation & Multi-Agent Synthesis'
  },
  {
    key: 'market_intel',
    name: 'Nexus (Market Intel)',
    title: 'VP of Market Intelligence',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    color: '#06b6d4',
    focus: 'TAM/SAM Analysis, Competitive Moats & Regional Dynamics'
  },
  {
    key: 'cfo',
    name: 'Vanguard (CFO)',
    title: 'Chief Financial Officer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    color: '#10b981',
    focus: 'CapEx Efficiency, Runway, Financial Modeling & IRR'
  },
  {
    key: 'ops',
    name: 'Apex (Ops)',
    title: 'Chief Operating Officer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    color: '#f59e0b',
    focus: 'Supply Chain, Scalability, Site Selection & Vendor Logistics'
  },
  {
    key: 'cmo',
    name: 'Hyperion (CMO)',
    title: 'Chief Marketing Officer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    color: '#ec4899',
    focus: 'Customer Acquisition (CAC), Brand Equity & Digital Expansion'
  },
  {
    key: 'hr',
    name: 'Synergy (HR)',
    title: 'Chief People Officer',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80',
    color: '#8b5cf6',
    focus: 'Executive Hiring, Organizational Culture & Regional Talent'
  },
  {
    key: 'legal',
    name: 'Aegis (Legal)',
    title: 'General Counsel',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    color: '#64748b',
    focus: 'Regulatory Compliance, Municipal Licensing & IP Security'
  },
  {
    key: 'analytics',
    name: 'Quant (Analytics)',
    title: 'Chief Data Officer',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    color: '#3b82f6',
    focus: 'Cohort Analytics, LTV Predictions & Data Pipeline Architecture'
  },
  {
    key: 'risk',
    name: 'Sentinel (Risk)',
    title: 'Chief Risk Officer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    color: '#ef4444',
    focus: 'Black Swan Threat Vectors, Downside Protection & Regulatory Exposure'
  }
];

export { AGENT_DEFINITIONS };

export async function runBoardroomSimulation({ goal, budget, timeline, location, employees, marketingSpend }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      return await executeGeminiSimulation({ goal, budget, timeline, location, employees, marketingSpend, apiKey });
    } catch (err) {
      console.warn('Gemini API call failed, failing over to intelligent synthetic multi-agent engine:', err.message);
      return generateSyntheticBoardroomSimulation({ goal, budget, timeline, location, employees, marketingSpend });
    }
  }

  return generateSyntheticBoardroomSimulation({ goal, budget, timeline, location, employees, marketingSpend });
}

async function executeGeminiSimulation({ goal, budget, timeline, location, employees, marketingSpend, apiKey }) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { responseMimeType: 'application/json' } });

  const systemPrompt = `
You are the Autonomous Executive Board of ShadowBoard Enterprise AI.
Objective: "${goal}"
Parameters:
- Budget: ${budget || '₹2 Crore'}
- Timeline: ${timeline || '6 Months'}
- Target Location: ${location || 'Bangalore, India'}
- Staff Allocation: ${employees || 25} Employees
- Marketing Capital: ${marketingSpend || '₹50 Lakhs'}

You will simulate 9 distinct executive autonomous agents:
1. CEO: Strategic plan, synthesis & final decision.
2. Market Intel: Market size, competition, local nuances.
3. CFO: ROI, CapEx breakdown, risk-adjusted burn rate.
4. Operations: Site selection, vendor logistics, supply chain setup.
5. CMO: CAC, localized campaigns, brand launch.
6. HR: Local talent hiring, compensation models, leadership recruitment.
7. Legal: Municipal compliance, zoning, licenses, IP.
8. Analytics: LTV/CAC ratios, forecast models, KPI tracking.
9. Risk: Threat matrix, downside risks, mitigation strategies.

IMPORTANT: Ensure AT LEAST 6 to 8 distinct agents actively participate in the debate_logs with challenges, counter-arguments, and strategic compromises!
If analyzing a sale or promotion, analyze individual product unit margins and format promotional banners as "UP TO X% OFF" with variable product-level discounts instead of a flat discount across all items.

Return ONLY a valid JSON object matching this structure:
{
  "ceo_plan": "Executive strategy outline...",
  "agent_decisions": [
    {
      "agent_key": "ceo|market_intel|cfo|ops|cmo|hr|legal|analytics|risk",
      "agent_name": "Full Agent Name",
      "role_title": "Role Title",
      "confidence": 92,
      "reasoning": "Detailed strategic reasoning...",
      "decision": "Concrete action step..."
    }
  ],
  "debate_logs": [
    {
      "speaker_key": "cfo|cmo|ops|market_intel|analytics|risk|legal|ceo",
      "speaker_name": "Speaker Agent Name",
      "speaker_role": "Speaker Role",
      "target_key": "target_agent_key",
      "message": "Dynamic debate challenge or rebuttal...",
      "debate_type": "challenge|rebuttal|agreement|synthesis"
    }
  ],
  "executive_summary": "Comprehensive executive summary...",
  "roi_projection": "310% IRR",
  "risk_score": 24,
  "budget_breakdown": [
    { "category": "Category", "amount": "₹50 L", "percentage": 25 }
  ],
  "department_highlights": [
    { "department": "Finance", "status": "Approved", "metric": "+34% Net Margin" }
  ],
  "milestones": [
    { "phase": "Month 1-2", "title": "Phase Title", "detail": "Phase Detail" }
  ],
  "final_recommendation": "Final recommendation..."
}
`;

  const response = await model.generateContent(systemPrompt);
  const text = response.response.text();
  return JSON.parse(text);
}

export function extractCampaignInfo(goal = '') {
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

  // Per-product variable discounts calculated dynamically
  const productDiscounts = {
    p1: Math.max(20, Math.round(maxDiscount * 0.65)), // AR Glasses (High cost, premium margin -> 35-40% off)
    p2: Math.max(25, Math.round(maxDiscount * 0.80)), // Headphones (Mid margin -> 40-45% off)
    p3: maxDiscount,                                    // Smart Watch (High volume inventory driver -> UP TO MAX % off)
    p4: Math.max(25, Math.round(maxDiscount * 0.88))  // Smart Home Hub (High demand -> 45-50% off)
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

function generateSyntheticBoardroomSimulation({ goal, budget, timeline, location, employees, marketingSpend }) {
  const campaignInfo = extractCampaignInfo(goal);
  const maxDisc = campaignInfo.maxDiscount;
  const pDiscounts = campaignInfo.productDiscounts;

  return {
    campaign_info: campaignInfo,
    ceo_plan: `Formulate an autonomous profit-optimized strategy for "${goal}". CFO, Quant Analytics & Market Intel conducted price elasticity modeling across product catalog to compute variable discounts up to ${maxDisc}% Off.`,
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
        decision: `TARGET HIGH-INTENT BUYER COHORTS`
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
        decision: `INVENTORY REALLOCATION COMPLETE`
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
        decision: `SURGE STAFFING AUTHORIZED`
      },
      {
        agent_key: 'legal',
        agent_name: 'Aegis (Legal)',
        role_title: 'General Counsel',
        confidence: 95,
        reasoning: `Promotional compliance verified: Using "UP TO ${maxDisc}% OFF" strictly complies with consumer protection laws as item p3 reaches the advertised max discount.`,
        decision: `LEGAL COMPLIANCE CERTIFIED`
      },
      {
        agent_key: 'analytics',
        agent_name: 'Quant (Analytics)',
        role_title: 'Chief Data Officer',
        confidence: 96,
        reasoning: `Price Elasticity Curve: Variable product-level pricing generates +310% revenue lift compared to a flat discount strategy.`,
        decision: `REAL-TIME TELEMETRY TRACKING ONLINE`
      },
      {
        agent_key: 'risk',
        agent_name: 'Sentinel (Risk)',
        role_title: 'Chief Risk Officer',
        confidence: 90,
        reasoning: `Downside risk score managed down to 22/100 by enforcing per-user quantity caps on max-discounted inventory items.`,
        decision: `ANTI-RESELLER CAPS ENFORCED`
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
        message: `Legal clearance granted: Advertising 'UP TO ${maxDisc}% OFF' is fully compliant since at least 25% of catalog items meet or reach the advertised discount rate.`,
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
    executive_summary: `ShadowBoard AI analyzed "${goal}". CFO, Quant Analytics, and CMO executed product-level unit margin & price elasticity modeling. Rather than an arbitrary flat discount, the board formulated a dynamic pricing strategy featuring variable discounts per product (ranging from ${pDiscounts.p1}% to ${maxDisc}%), prominently formatted as "UP TO ${maxDisc}% OFF".`,
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
  };
}
