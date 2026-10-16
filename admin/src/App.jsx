import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import Settings from "./pages/Settings";
import HeaderEditor from "./pages/HeaderEditor";
import FooterEditor from "./pages/FooterEditor";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

import HeroEditor from "./pages/home/HeroEditor";
import SpaceAudienceEditor from "./pages/home/SpaceAudienceEditor";
import TrustResultsEditor from "./pages/home/TrustResultsEditor";
import SpacesPricingEditor from "./pages/home/SpacesPricingEditor";
import LocationCTAEditor from "./pages/home/LocationCTAEditor";
import Lead from "./pages/Lead";

function App() {
  return (
    <Routes>
      {/* Public login page */}
      <Route path="/login" element={<Login />} />

      {/* Protected admin pages */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route path="leads" element={<Lead />} />

          <Route path="settings" element={<Settings />} />
          <Route path="header" element={<HeaderEditor />} />
          <Route path="footer" element={<FooterEditor />} />

          <Route path="home/hero" element={<HeroEditor />} />
          <Route
            path="home/space-audience"
            element={<SpaceAudienceEditor />}
          />
          <Route
            path="home/trust-results"
            element={<TrustResultsEditor />}
          />
          <Route
            path="home/spaces-pricing"
            element={<SpacesPricingEditor />}
          />
          <Route
            path="home/location-cta"
            element={<LocationCTAEditor />}
          />
        </Route>
      </Route>

      {/* Redirect unknown URLs */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;