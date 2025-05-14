// src/App.tsx
import {BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Pages/LandingPage";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import './index.css'
export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
    </BrowserRouter>
  );
}
