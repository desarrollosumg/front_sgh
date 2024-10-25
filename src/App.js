// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Home from './routes/Home';
import ProgramarCitas from './routes/ProgramarCitas';
import VerCitas from './routes/VerCitas';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/programar" element={<ProgramarCitas />} />
          <Route path="/ver" element={<VerCitas />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;