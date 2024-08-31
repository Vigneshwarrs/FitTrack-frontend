import { Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/verify/:token" element={<Activation />} />
        <Route path='/workouts' element={<ProtectedRoute><WorkoutPage /></ProtectedRoute>} />
        <Route path='/nutrition' element={<ProtectedRoute><NutrtionPage /></ProtectedRoute>} />
        <Route path='/goals' element={<ProtectedRoute><GoalPage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
