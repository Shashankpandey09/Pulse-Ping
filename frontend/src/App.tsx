// src/App.tsx
import {BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import { Suspense,lazy } from "react";
import HistoryGraph from "./Pages/HistoryGraph";
const Landing=lazy(()=>import("./Pages/LandingPage"))
const Dashboard=lazy(()=>import("./Pages/Dashboard"))
const ProtectedRoute=lazy(()=>import("./Components/ProtectedRoute"))
const  AddMonitor=lazy(()=>import("./Pages/Form"))
const Monitors=lazy(()=>import("./Pages/Monitors"))




export default function App() {
  return (
    <BrowserRouter>
    <Suspense fallback={<p className="text-white">loading....</p>}>
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
      <Route path="/addMonitor" element={<ProtectedRoute>
        <AddMonitor/>
      </ProtectedRoute>}/>
      <Route path="/Monitors" element={<ProtectedRoute>
       <Monitors/>
      </ProtectedRoute>}/>
       <Route path="/history/:id" element={<ProtectedRoute>
       <HistoryGraph/>
      </ProtectedRoute>}/>
    </Routes>
    </Suspense>
    </BrowserRouter>
  );
}
