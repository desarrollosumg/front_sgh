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
import Dashboard from "./routes/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<ProtectedRoute moduleId={0}><Dashboard/></ProtectedRoute>}/>
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute moduleId={1}>
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crear_usuario"
          element={
            <ProtectedRoute moduleId={1}>
              <CreateUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editar_usuario/:id"
          element={
            <ProtectedRoute moduleId={1}>
              <EditarUsuario />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cita"
          element={
            <ProtectedRoute moduleId={5}>
              <Cita />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citas"
          element={
            <ProtectedRoute moduleId={5}>
              <ListaCitas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/paciente"
          element={
            <ProtectedRoute moduleId={2}>
              <Paciente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/PersonalMedico"
          element={
            <ProtectedRoute moduleId={4}>
              <PersonalMedico />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AgregarPersonalMedico"
          element={
            <ProtectedRoute moduleId={4}>
              <AgregarPersonalMedico />
            </ProtectedRoute>
          }
        />
        <Route
          path="/EditarPersonalMedico/:id"
          element={
            <ProtectedRoute moduleId={4}>
              <EditarPersonalMedico />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nuevopaciente"
          element={
            <ProtectedRoute moduleId={2}>
              <CrearPaciente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editarpaciente/:id"
          element={
            <ProtectedRoute moduleId={2}>
              <EditarPaciente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historialMedico"
          element={
            <ProtectedRoute moduleId={3}>
              <HistorialMedico />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bitacora"
          element={
            <ProtectedRoute moduleId={6}>
              <Bitacora />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cerrar_sesion"
          element={
            <Logout />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
