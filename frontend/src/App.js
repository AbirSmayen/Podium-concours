// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import LeaderRequest from './pages/LeaderRequest';
import JoinTeamRequest from './pages/JoinTeamRequest';
import PublicLeaderboard from './pages/PublicLeaderboard';
import LeaderDashboard from './components/leader/LeaderDashboard';
import MemberDashboard from './components/member/MemberDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Navigate to="/leaderboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/leader-request" element={<LeaderRequest />} />
        <Route path="/join-team" element={<JoinTeamRequest />} />
        <Route path="/leaderboard" element={<PublicLeaderboard />} />

        {/* Routes Leader */}
        <Route
          path="/leader/dashboard"
          element={
            <PrivateRoute allowedRoles={['leader']}>
              <LeaderDashboard />
            </PrivateRoute>
          }
        />

        {/* Routes Member */}
        <Route
          path="/member/dashboard"
          element={
            <PrivateRoute allowedRoles={['member']}>
              <MemberDashboard />
            </PrivateRoute>
          }
        />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;