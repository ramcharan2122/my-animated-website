import React from 'react';
import { BoardroomHero } from '../components/boardroom/BoardroomHero';
import { WorkflowTimeline } from '../components/boardroom/WorkflowTimeline';
import { AgentOrbit } from '../components/boardroom/AgentOrbit';
import { AgentDetailsInspector } from '../components/boardroom/AgentDetailsInspector';
import { LiveDebateFeed } from '../components/boardroom/LiveDebateFeed';
import { useSimulation } from '../context/SimulationContext';
import { api } from '../services/api';
import { motion } from 'framer-motion';
import { Sparkles, Github } from 'lucide-react';

export const DashboardPage = () => {
  const { currentSimulation } = useSimulation();

  return (
    <div className="w-full space-y-6">
      {/* Deploy Banner when Board decision is complete */}
      {currentSimulation && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 text-black flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(245,158,11,0.3)] font-mono"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">🪔</span>
            <div>
              <div className="font-extrabold text-xs tracking-wider uppercase text-black">
                BOARDROOM DECISION READY FOR REAL-TIME EXECUTION
              </div>
              <div className="text-[11px] text-slate-950 font-bold">
                Deploy strategy directly to live store & connected GitHub repository
              </div>
            </div>
          </div>

          <button
            onClick={async (e) => {
              e.preventDefault();
              try {
                const goal = currentSimulation.simulation?.goal || 'Special Sale';
                const text = goal.toLowerCase();
                const discountMatch = text.match(/(\d+)\s*%/);
                const discountPercentage = discountMatch ? parseInt(discountMatch[1]) : 55;

                let title = '⚡ FESTIVAL MEGA SALE';
                let promoCode = `FESTIVAL-UPTO${discountPercentage}`;
                let occasionKey = 'seasonal';

                if (text.includes('spiderman') || text.includes('spider-man')) {
                  title = '🕷️ SPIDER-MAN LIMITED EDITION SALE';
                  promoCode = `SPIDER-UPTO${discountPercentage}`;
                  occasionKey = 'spiderman';
                } else if (text.includes('dussehra') || text.includes('dasara')) {
                  title = '🏹 DUSSEHRA FESTIVAL CELEBRATION';
                  promoCode = `DUSSEHRA-UPTO${discountPercentage}`;
                  occasionKey = 'dussehra';
                } else if (text.includes('christmas') || text.includes('xmas')) {
                  title = '🎄 CHRISTMAS HOLIDAY SALE';
                  promoCode = `XMAS-UPTO${discountPercentage}`;
                  occasionKey = 'christmas';
                } else if (text.includes('black friday')) {
                  title = '🛍️ BLACK FRIDAY CYBER SALE';
                  promoCode = `BLACKFRIDAY-UPTO${discountPercentage}`;
                  occasionKey = 'blackfriday';
                } else if (text.includes('new year')) {
                  title = '🎆 NEW YEAR CELEBRATION SALE';
                  promoCode = `NEWYEAR-UPTO${discountPercentage}`;
                  occasionKey = 'newyear';
                } else if (text.includes('diwali') || text.includes('deepavali')) {
                  title = '🪔 DIWALI FESTIVAL OF LIGHTS SALE';
                  promoCode = `DIWALI-UPTO${discountPercentage}`;
                  occasionKey = 'diwali';
                } else {
                  const cleanGoal = goal.replace(/^(run|launch)\s+(a\s+)?/i, '').trim().toUpperCase();
                  title = `⚡ ${cleanGoal.endsWith('SALE') ? cleanGoal : cleanGoal + ' SALE'}`;
                  promoCode = `${cleanGoal.replace(/[^A-Z0-9]/g, '').substring(0, 8)}-UPTO${discountPercentage}`;
                  occasionKey = 'seasonal';
                }

                const campaignData = {
                  title,
                  maxDiscount: discountPercentage,
                  discountPercentage,
                  promoCode,
                  bannerText: `SPECIAL CELEBRATION • UP TO ${discountPercentage}% OFF ACROSS ALL CATEGORIES!`,
                  marketingSpend: currentSimulation.simulation?.marketing_spend || '₹50 Lakhs',
                  occasionKey,
                  isActive: true,
                  status: 'ACTIVE'
                };

                await api.deployCampaign(campaignData);
                await api.commitCampaignToGithubRepo(campaignData);
              } catch (err) {
                console.warn('Deploy error:', err);
              }
              window.open('#/demo-store', '_blank');
            }}
            className="px-5 py-2.5 rounded-xl bg-black text-amber-300 font-extrabold text-xs shadow-xl hover:bg-slate-900 transition-all shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <Github className="w-4 h-4 text-cyan-400" />
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>🚀 DEPLOY TO LIVE STORE & LINKED GITHUB REPO</span>
          </button>
        </motion.div>
      )}

      {/* Hero Scenario Console */}
      <BoardroomHero />

      {/* Workflow Execution Progress Timeline */}
      <WorkflowTimeline />

      {/* Orbiting Executive Boardroom Matrix */}
      <AgentOrbit />

      {/* Selected Agent Inspector */}
      <AgentDetailsInspector />

      {/* Live Agent Debate & Conflict Stream */}
      <LiveDebateFeed />
    </div>
  );
};
