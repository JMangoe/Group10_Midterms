import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Borrow from './pages/Borrow';
import Return from './pages/Return';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/return" element={<Return />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
