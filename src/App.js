// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';

// Rutas originales del proyecto
import Home from './routes/Home';
import ProgramarCitas from './routes/ProgramarCitas';
import VerCitas from './routes/VerCitas';

// Rutas adicionales del proyecto principal
import User from './routes/User';
import CreateUser from './routes/CreateUser';
import EditUser from './routes/EditUser';
import Cita from './routes/Cita';
import Paciente from './routes/Paciente';
import PersonalMedico from './routes/PersonalMedico';
import AgregarPersonalMedico from './routes/AgregarPersonalMedico';
import EditarPersonalMedico from './routes/EditarPersonalMedico';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Rutas de tu proyecto */}
          <Route path="/" element={<Home />} />
          <Route path="/programar" element={<ProgramarCitas />} />
          <Route path="/ver" element={<VerCitas />} />

          {/* Rutas del proyecto principal */}
          <Route path="/usuarios" element={<User />} />
          <Route path="/crear_usuario" element={<CreateUser />} />
          <Route path="/editar_usuarios/:id" element={<EditUser />} />
          <Route path="/cita" element={<Cita />} />
          <Route path="/paciente" element={<Paciente />} />
          <Route path="/PersonalMedico" element={<PersonalMedico />} />
          <Route path="/AgregarPersonalMedico" element={<AgregarPersonalMedico />} />
          <Route path="/EditarPersonalMedico/:id" element={<EditarPersonalMedico />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
