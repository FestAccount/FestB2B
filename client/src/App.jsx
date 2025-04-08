import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Menu from './components/Menu';
import Homepage from './components/Homepage';
import Restaurant from './components/Restaurant';
import Reservations from './components/Reservations';
import Integrations from './components/Integrations';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:category" element={<Menu />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
