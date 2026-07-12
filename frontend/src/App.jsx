// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Trips from './pages/Trips';

// 1. ADD THE MISSING IMPORTS HERE
// (Note: Change './pages/' to './components/' if your files are in the components folder)
import Maintenance from './pages/Maintenance';
import FuelExpenses from './pages/FuelExpenses';
import Drivers from './pages/Drivers';
import Reports from './pages/Reports';

// Simple Protected Route wrapper for RBAC
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Enforce strict RBAC rules as per hackathon requirements */}
        <Route path="vehicles" element={<ProtectedRoute allowedRoles={['Fleet Manager', 'Admin']}><Vehicles /></ProtectedRoute>} />
        
        <Route path="trips" element={<ProtectedRoute allowedRoles={['Dispatcher', 'Driver', 'Admin']}><Trips /></ProtectedRoute>} />
        
        {/* 2. ADD THE MISSING ROUTES HERE WITH PROPER ROLES */}
        {/* Fleet Manager oversees maintenance */}
        <Route path="maintenance" element={<ProtectedRoute allowedRoles={['Fleet Manager', 'Admin']}><Maintenance /></ProtectedRoute>} />
        
        {/* Financial Analyst oversees expenses and reports */}
        <Route path="fuel-expenses" element={<ProtectedRoute allowedRoles={['Financial Analyst', 'Admin']}><FuelExpenses /></ProtectedRoute>} />
        <Route path="reports" element={<ProtectedRoute allowedRoles={['Financial Analyst', 'Admin']}><Reports /></ProtectedRoute>} />
        
        {/* Safety Officer oversees drivers */}
        <Route path="drivers" element={<ProtectedRoute allowedRoles={['Safety Officer', 'Admin']}><Drivers /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;