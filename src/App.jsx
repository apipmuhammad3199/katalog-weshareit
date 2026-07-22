import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Storefront from './pages/Storefront';
import TrackingStatusView from './pages/TrackingStatusView';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Storefront />} />
            <Route path="/po/:id" element={<Home />} />
            <Route path="/track/:id" element={<TrackingStatusView />} />
            <Route path="/admin-rekap" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
