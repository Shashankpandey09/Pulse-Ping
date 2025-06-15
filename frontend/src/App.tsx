// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { Suspense, lazy } from "react";
import HistoryGraph from "./Pages/HistoryGraph";
const Landing = lazy(() => import("./Pages/LandingPage"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const ProtectedRoute = lazy(() => import("./Components/ProtectedRoute"));
const AddMonitor = lazy(() => import("./Pages/Form"));
const Monitors = lazy(() => import("./Pages/Monitors"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p className="text-white">loading....</p>}>
        <Routes>
          <Route path="/" element={<Landing />} />
           <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/addMonitor" element={<AddMonitor />} />
            <Route path="/Monitors" element={<Monitors />} />
            <Route path="/history/:id" element={<HistoryGraph />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
