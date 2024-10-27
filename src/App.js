import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import User from "./routes/User";
import CreateUser from "./routes/CrearUsuario";
import Cita from "./routes/Cita";
import ListaCitas from "./routes/ListaCitas";
import Home from "./routes/login";
import PersonalMedico from "./routes/PersonalMedico";  
import AgregarPersonalMedico from "./routes/AgregarPersonalMedico";  
import EditarPersonalMedico from "./routes/EditarPersonalMedico"; 
import Paciente from "./routes/Paciente";
import CrearPaciente from "./routes/CrearPaciente";
import EditarPaciente from "./routes/EditarPaciente";
import Bitacora from "./routes/bitacora";
import HistorialMedico from "./routes/HistorialMedico";
import ProtectedRoute from "./components/Security/ProtectedRoute";
import EditarUsuario from "./routes/EditarUsario";
import Logout from "./routes/logout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<ProtectedRoute><User /></ProtectedRoute>} />
        <Route path="/crear_usuario" element={<ProtectedRoute><CreateUser /></ProtectedRoute>} />
        <Route path="/editar_usuario/:id" element={<ProtectedRoute><EditarUsuario /></ProtectedRoute>} />
        <Route path="/cita" element={<ProtectedRoute><Cita /></ProtectedRoute>} />
        <Route path="/citas" element={<ProtectedRoute><ListaCitas/></ProtectedRoute>} />
        <Route path="/paciente" element={<ProtectedRoute><Paciente/></ProtectedRoute>} />
        <Route path="/PersonalMedico" element={<ProtectedRoute><PersonalMedico /></ProtectedRoute>} /> 
        <Route path="/AgregarPersonalMedico" element={<ProtectedRoute><AgregarPersonalMedico /></ProtectedRoute>} /> 
        <Route path="/EditarPersonalMedico/:id" element={<ProtectedRoute><EditarPersonalMedico /></ProtectedRoute>} /> 
        <Route path="/paciente" element={<ProtectedRoute><Paciente/></ProtectedRoute>}/>
        <Route path="/nuevopaciente" element={<ProtectedRoute><CrearPaciente/></ProtectedRoute>}/>
        <Route path="/editarpaciente/:id" element={<ProtectedRoute><EditarPaciente/></ProtectedRoute>}/>
        <Route path="/historialMedico" element={<ProtectedRoute><HistorialMedico/></ProtectedRoute>}/>
        <Route path="/bitacora" element={<ProtectedRoute><Bitacora/></ProtectedRoute>}/>
        <Route path="/cerrar_sesion" element={<ProtectedRoute><Logout/></ProtectedRoute>}/>
      </Routes>
    </Router>
  );
}

export default App;
