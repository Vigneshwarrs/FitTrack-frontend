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

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify/:token" element={<Activation />} />
        <Route path='/workouts' element={<WorkoutPage />} />
        <Route path='/nutrition' element={<NutrtionPage />} />
        <Route path='/goals' element={<GoalPage />} />
      </Routes>
    </div>
  );
}

export default App;
