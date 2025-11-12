import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import AdminLogin from './AdminLogin';
import AdminSignup from './AdminSignup';
import AdminDashboard from './AdminDashboard';

const AdminRoutes = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          user ? <Navigate to="/admin" replace /> : <AdminLogin onLoginSuccess={() => window.location.href = '/admin'} />
        } 
      />
      <Route 
        path="/signup" 
        element={
          user ? <Navigate to="/admin" replace /> : <AdminSignup onSignupSuccess={() => window.location.href = '/admin'} />
        } 
      />
      <Route 
        path="/" 
        element={
          user ? <AdminDashboard /> : <Navigate to="/admin/login" replace />
        } 
      />
    </Routes>
  );
};

export default AdminRoutes;
