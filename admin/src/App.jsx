import { Routes, Route } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";

import AdminDashboard from "./pages/AdminDashboard";
import Settings from "./pages/Settings";

import HeroEditor from "./pages/home/HeroEditor";
import SpaceAudienceEditor from "./pages/home/SpaceAudienceEditor";
import TrustResultsEditor from "./pages/home/TrustResultsEditor";
import SpacesPricingEditor from "./pages/home/SpacesPricingEditor";
import LocationCTAEditor from "./pages/home/LocationCTAEditor";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />

        <Route path="settings" element={<Settings />} />

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
    </Routes>
  );
}

export default App;