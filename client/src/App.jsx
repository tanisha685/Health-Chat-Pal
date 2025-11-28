import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import MainLayout from "./components/Layout/MainLayout";
import MythBusterPage from "./pages/MythBusterPage";
import DoctorRecommender from "./pages/DoctorRecommender";
import SymptomCheckerPage from "./pages/SymptomCheckerPage";
import NotFoundPage from "./pages/NotFoundPage";

import WellnessHub from "./pages/WellnessHub";
import HumanBodyExplorer from "./pages/HumanBodyExplorer";
import AirQualityForecaster from "./pages/AirQualityForecaster";
import ClinicalTrialFinder from "./pages/ClinicalTrialFinder";
import Hub from "./pages/Hub";
import FAQ from "./pages/FAQ";
import EmergencyProtocols from './pages/EmergencyProtocols'



const App = () => {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/myth-busters" element={<MythBusterPage />} />

          <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
          <Route path="/doctor-recommender" element={<DoctorRecommender />} />
          
          <Route path="/wellness-hub" element={<WellnessHub />} />
          <Route path="/human-body-explorer" element={<HumanBodyExplorer />} />
          <Route path="/air-quality-forecaster" element={<AirQualityForecaster />} />
          <Route path="/clinical-trial-finder" element={<ClinicalTrialFinder />} />

          <Route path="/hub" element={<Hub />} />
          <Route path="/literacy" element={<FAQ />} />

          <Route path="/emer-pro" element={<EmergencyProtocols />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
