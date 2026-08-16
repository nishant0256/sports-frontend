import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import SubNavbar from './components/layout/SubNavbar';
import Footer from './components/layout/Footer';

import CricketView from './pages/CricketView';
import ScheduleView from './pages/ScheduleView';
import TeamsView from './pages/TeamsView';
import SeriesView from './pages/SeriesView';
import MatchesInfoView from './pages/MatchesInfoView';
import FootballView from './pages/FootballView';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
        <Navbar />
        <SubNavbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/cricket" replace />} />
            <Route path="/cricket" element={<CricketView />} />
            <Route path="/cricket/schedule" element={<ScheduleView />} />
            <Route path="/cricket/teams" element={<TeamsView />} />
            <Route path="/cricket/series" element={<SeriesView />} />
            <Route path="/cricket/match-info" element={<MatchesInfoView />} />
            <Route path="/football" element={<FootballView />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}