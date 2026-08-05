import React from 'react';
import { BoardroomHero } from '../components/boardroom/BoardroomHero';
import { WorkflowTimeline } from '../components/boardroom/WorkflowTimeline';
import { AgentOrbit } from '../components/boardroom/AgentOrbit';
import { AgentDetailsInspector } from '../components/boardroom/AgentDetailsInspector';
import { LiveDebateFeed } from '../components/boardroom/LiveDebateFeed';
import { useSimulation } from '../context/SimulationContext';
import { api } from '../services/api';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

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
                Deploy strategy directly to live Demo Store ("Lumina Tech & Lifestyle")
              </div>
            </div>
          </div>

          <a
            href="/demo-store"
            target="_blank"
            rel="noopener noreferrer"
            onClick={async () => {
              try {
                const goal = currentSimulation.simulation?.goal || 'Special Sale';
                // Helper parser
                const text = goal.toLowerCase();
                const discountMatch = text.match(/(\d+)\s*%/);
                const discountPercentage = discountMatch ? parseInt(discountMatch[1]) : 40;

                let title = '⚡ FESTIVAL MEGA SALE';
                let promoCode = `FESTIVAL-SHADOW${discountPercentage}`;
                let occasionKey = 'seasonal';

                if (text.includes('dussehra') || text.includes('dasara')) {
                  title = '🏹 DUSSEHRA FESTIVAL CELEBRATION';
                  promoCode = `DUSSEHRA-${discountMatch ? 'SHADOW' + discountPercentage : 'PROFIT35'}`;
                  occasionKey = 'dussehra';
                } else if (text.includes('christmas') || text.includes('xmas')) {
                  title = '🎄 CHRISTMAS HOLIDAY SALE';
                  promoCode = `XMAS-${discountMatch ? 'SHADOW' + discountPercentage : 'PROFIT35'}`;
                  occasionKey = 'christmas';
                } else if (text.includes('black friday')) {
                  title = '🛍️ BLACK FRIDAY CYBER SALE';
                  promoCode = `BLACKFRIDAY-${discountMatch ? 'SHADOW' + discountPercentage : 'PROFIT35'}`;
                  occasionKey = 'blackfriday';
                } else if (text.includes('new year')) {
                  title = '🎆 NEW YEAR CELEBRATION SALE';
                  promoCode = `NEWYEAR-${discountMatch ? 'SHADOW' + discountPercentage : 'PROFIT35'}`;
                  occasionKey = 'newyear';
                } else if (text.includes('diwali') || text.includes('deepavali')) {
                  title = '🪔 DIWALI FESTIVAL OF LIGHTS SALE';
                  promoCode = `DIWALI-${discountMatch ? 'SHADOW' + discountPercentage : 'PROFIT35'}`;
                  occasionKey = 'diwali';
                } else {
                  const saleMatch = goal.match(/(?:launch|run|start|create)?\s*(?:a|an)?\s*([a-zA-Z0-9\s]+(?:sale|campaign|offer|discount|promo))/i);
                  const name = saleMatch ? saleMatch[1].trim().toUpperCase() : 'SPECIAL MEGA SALE';
                  title = `⚡ ${name}`;
                  promoCode = `${name.replace(/[^A-Z0-9]/g, '').substring(0, 10)}-PROFIT35`;
                  occasionKey = 'seasonal';
                }

                await api.deployCampaign({
                  title,
                  discountPercentage,
                  promoCode,
                  bannerText: `SPECIAL CELEBRATION • ${discountPercentage}% OFF ACROSS ALL CATEGORIES!`,
                  marketingSpend: currentSimulation.simulation?.marketing_spend || '₹50 Lakhs',
                  occasionKey
                });
              } catch (e) {
                console.warn(e);
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-black text-amber-300 font-extrabold text-xs shadow-xl hover:bg-slate-900 transition-all shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>🚀 DEPLOY TO LIVE DEMO STORE</span>
          </a>
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
