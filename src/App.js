import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/HomePage';
import Activation from './pages/Activation';
import WorkoutPage from './pages/WorkoutPage';
import NutrtionPage from './pages/NutrtionPage';
import GoalPage from './pages/GoalPage';
import ProtectedRoute from './components/ProtectedRoutes';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Example: Check if the user is logged in by looking for a token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists, false otherwise
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
  };

  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register', '/verify/:token', '/forgot-password', '/reset-password/:token'];

  return (
    <div className="App">
      {!hideNavbarRoutes.includes(location.pathname) && (
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify/:token" element={<Activation />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ForgotPassword />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/workouts' element={<ProtectedRoute><WorkoutPage /></ProtectedRoute>} />
        <Route path='/nutrition' element={<ProtectedRoute><NutrtionPage /></ProtectedRoute>} />
        <Route path='/goals' element={<ProtectedRoute><GoalPage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
