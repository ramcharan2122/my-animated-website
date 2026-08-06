import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SimulationProvider } from './context/SimulationContext';

import { IntroLoader } from './components/common/IntroLoader';
import { NeuralBackground } from './components/common/NeuralBackground';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { CommandPalette } from './components/common/CommandPalette';

import { DashboardPage } from './pages/DashboardPage';
import { PastSimulationsPage } from './pages/PastSimulationsPage';
import { ExecutiveReportsPage } from './pages/ExecutiveReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DemoStorePage } from './pages/DemoStorePage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const MainLayout = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col relative">
      <NeuralBackground />
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      <div className="flex flex-1 relative z-10">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/simulations" element={<PastSimulationsPage />} />
            <Route path="/reports" element={<ExecutiveReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>

      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  );
};

export function App() {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <AuthProvider>
      <SimulationProvider>
        <Router>
          {showLoader ? (
            <IntroLoader onComplete={() => setShowLoader(false)} />
          ) : (
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/demo-store" element={<DemoStorePage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </Router>
      </SimulationProvider>
    </AuthProvider>
  );
}

export default App;
