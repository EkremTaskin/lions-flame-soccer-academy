import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import BookingPage from './pages/BookingPage';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Account from './pages/Account';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, userRole } = useAuth();
  
  if (!currentUser) return <Navigate to="/login" replace />;
  // If specific role required (like admin), verify role matches
  if (requiredRole && userRole !== requiredRole) return <Navigate to="/" replace />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:productId" element={<ProductDetail />} />
        
        {/* Only logged in users can book */}
        <Route path="/book" element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        } />

        {/* User Account Page */}
        <Route path="/account" element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        } />
        
        {/* Only Admins can see the dashboard */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
