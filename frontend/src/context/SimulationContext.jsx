import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

const SimulationContext = createContext(null);

export const AGENT_LIST = [
  { key: 'ceo', name: 'Aura-X (CEO)', title: 'Chief Executive Officer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', color: '#6366f1' },
  { key: 'market_intel', name: 'Nexus (Market Intel)', title: 'VP Market Intelligence', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', color: '#06b6d4' },
  { key: 'cfo', name: 'Vanguard (CFO)', title: 'Chief Financial Officer', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80', color: '#10b981' },
  { key: 'ops', name: 'Apex (Ops)', title: 'Chief Operating Officer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', color: '#f59e0b' },
  { key: 'cmo', name: 'Hyperion (CMO)', title: 'Chief Marketing Officer', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80', color: '#ec4899' },
  { key: 'hr', name: 'Synergy (HR)', title: 'Chief People Officer', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80', color: '#8b5cf6' },
  { key: 'legal', name: 'Aegis (Legal)', title: 'General Counsel', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80', color: '#64748b' },
  { key: 'analytics', name: 'Quant (Analytics)', title: 'Chief Data Officer', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', color: '#3b82f6' },
  { key: 'risk', name: 'Sentinel (Risk)', title: 'Chief Risk Officer', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80', color: '#ef4444' }
];

export const SimulationProvider = ({ children }) => {
  const [currentSimulation, setCurrentSimulation] = useState(null);
  const [simulationsHistory, setSimulationsHistory] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: Idle, 1: Objective Received, 2: CEO Plan, 3: Agents Spawned, 4: Parallel Reasoning, 5: Debate, 6: Completed
  const [stepLabel, setStepLabel] = useState('');
  const [agentStatuses, setAgentStatuses] = useState({});
  const [liveDebateMessages, setLiveDebateMessages] = useState([]);
  const [activeDebateSpeaker, setActiveDebateSpeaker] = useState(null);
  const [selectedAgentKey, setSelectedAgentKey] = useState('ceo');
  const [comparedSimulations, setComparedSimulations] = useState(null);

  // Default scenario parameters
  const [scenarioConfig, setScenarioConfig] = useState({
    goal: 'Expand our restaurant chain to Bangalore with ₹2 Crore.',
    budget: '₹2 Crore',
    timeline: '6 Months',
    location: 'Bangalore',
    employees: 25,
    marketingSpend: '₹50 Lakhs'
  });

  const fetchHistory = async () => {
    try {
      const data = await api.getSimulations();
      setSimulationsHistory(data.simulations || []);
    } catch (err) {
      console.warn('Failed to load history:', err.message);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const startSimulation = async (customPayload) => {
    const payload = customPayload || scenarioConfig;
    setIsRunning(true);
    setCurrentStep(1);
    setStepLabel('CEO receiving objective & formulating strategic roadmap...');
    setLiveDebateMessages([]);
    
    // Initialize all agents as 'THINKING'
    const initialStatuses = {};
    AGENT_LIST.forEach((agent) => {
      initialStatuses[agent.key] = { status: 'thinking', confidence: 0, reasoning: 'Initializing neural context...', decision: '' };
    });
    setAgentStatuses(initialStatuses);

    try {
      // API call to run backend simulation
      const res = await api.runSimulation(payload);
      const { simulationId, result } = res;

      // Simulate cinematic live workflow steps
      await new Promise((r) => setTimeout(r, 1200));

      setCurrentStep(2);
      setStepLabel('CEO formulated execution framework. Spawning executive board...');
      await new Promise((r) => setTimeout(r, 1200));

      setCurrentStep(3);
      setStepLabel('All 8 specialized autonomous agents analyzing multi-dimensional impact...');

      // Update agent confidence & reasoning sequentially for visual wow factor
      for (let i = 0; i < result.agent_decisions.length; i++) {
        const dec = result.agent_decisions[i];
        await new Promise((r) => setTimeout(r, 400));
        setAgentStatuses((prev) => ({
          ...prev,
          [dec.agent_key]: {
            status: 'reasoned',
            confidence: dec.confidence || Math.floor(Math.random() * 15 + 85),
            reasoning: dec.reasoning,
            decision: dec.decision
          }
        }));
      }

      setCurrentStep(4);
      setStepLabel('Conflict detected between CFO & CMO! Initiating autonomous debate phase...');

      // Stream debate messages
      for (let i = 0; i < result.debate_logs.length; i++) {
        const msg = result.debate_logs[i];
        setActiveDebateSpeaker(msg.speaker_key);
        setAgentStatuses((prev) => ({
          ...prev,
          [msg.speaker_key]: { ...prev[msg.speaker_key], status: 'debating' }
        }));

        await new Promise((r) => setTimeout(r, 1500));
        setLiveDebateMessages((prev) => [...prev, msg]);
      }

      setActiveDebateSpeaker(null);
      setCurrentStep(5);
      setStepLabel('CEO resolving conflict & synthesizing final executive decision...');
      await new Promise((r) => setTimeout(r, 1200));

      // Finalize all statuses
      const finalStatuses = {};
      result.agent_decisions.forEach((dec) => {
        finalStatuses[dec.agent_key] = {
          status: 'completed',
          confidence: dec.confidence || 92,
          reasoning: dec.reasoning,
          decision: dec.decision
        };
      });
      setAgentStatuses(finalStatuses);

      setCurrentSimulation({
        simulation: result.simulation,
        ceo_plan: result.ceo_plan,
        agent_decisions: result.agent_decisions,
        debate_logs: result.debate_logs,
        report: result.report
      });

      setCurrentStep(6);
      setStepLabel('Autonomous boardroom simulation complete! Executive strategy generated.');
      setIsRunning(false);
      triggerConfetti();
      fetchHistory();
    } catch (err) {
      console.error('Simulation run failed:', err);
      setIsRunning(false);
      setStepLabel(`Error: ${err.message}`);
    }
  };

  const loadSimulation = async (id) => {
    try {
      const data = await api.getSimulationById(id);
      setCurrentSimulation(data);
      
      const loadedStatuses = {};
      data.agent_decisions.forEach((dec) => {
        loadedStatuses[dec.agent_key] = {
          status: 'completed',
          confidence: dec.confidence || 90,
          reasoning: dec.reasoning,
          decision: dec.decision
        };
      });
      setAgentStatuses(loadedStatuses);
      setLiveDebateMessages(data.debate_logs || []);
    } catch (err) {
      console.error('Failed to load simulation:', err);
    }
  };

  const compareWith = async (id1, id2) => {
    try {
      const res = await api.compareSimulations(id1, id2);
      setComparedSimulations(res);
    } catch (err) {
      console.error('Failed to compare simulations:', err);
    }
  };

  return (
    <SimulationContext.Provider
      value={{
        currentSimulation,
        simulationsHistory,
        isRunning,
        currentStep,
        stepLabel,
        agentStatuses,
        liveDebateMessages,
        activeDebateSpeaker,
        selectedAgentKey,
        setSelectedAgentKey,
        scenarioConfig,
        setScenarioConfig,
        startSimulation,
        loadSimulation,
        compareWith,
        comparedSimulations,
        setComparedSimulations,
        fetchHistory
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within SimulationProvider');
  return context;
};
