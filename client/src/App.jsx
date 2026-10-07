import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import { ToastProvider } from './components/common/Toast';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';

import AdminLayout from './admin/layouts/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import HeroEditor from './admin/pages/home/HeroEditor';
import SpaceAudienceEditor from './admin/pages/home/SpaceAudienceEditor';
import TrustResultsEditor from './admin/pages/home/TrustResultsEditor';
import SpacesPricingEditor from './admin/pages/home/SpacesPricingEditor';
import LocationCTAEditor from './admin/pages/home/LocationCTAEditor';
import Settings from './admin/pages/Settings';

function AppContent() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleOpenBooking = (planInfo) => {
    const info =
      typeof planInfo === 'string'
        ? {
            duration: 'monthly',
            planType: planInfo,
          }
        : planInfo;

    setSelectedPlan(info);

    const element = document.getElementById('booking-form');

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  return (
    <Routes>
      {/* ADMIN */}
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />

        <Route path="settings" element={<Settings />} />

        <Route path="home" element={<AdminDashboard />} />
        <Route path="home/hero" element={<HeroEditor />} />

        <Route path="home/space-audience" element={<SpaceAudienceEditor />} />

        <Route path="home/space-audience" element={<SpaceAudienceEditor />} />

        <Route path="home/trust-results" element={<TrustResultsEditor />} />

        <Route path="home/spaces-pricing" element={<SpacesPricingEditor />} />

        <Route path="home/location-cta" element={<LocationCTAEditor />} />

      </Route>

      {/* PUBLIC WEBSITE */}
      <Route
        path="*"
        element={
          <MainLayout onOpenBooking={handleOpenBooking}>
            <Home
              onOpenBooking={handleOpenBooking}
              selectedPlan={selectedPlan}
            />
          </MainLayout>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppContent />
      </Router>
    </ToastProvider>
  );
}

export default App;