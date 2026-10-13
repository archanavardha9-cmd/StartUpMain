import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import { ToastProvider } from './components/common/Toast';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';


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