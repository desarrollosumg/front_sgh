import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import User from "./routes/User";
import CreateUser from "./routes/CreateUser";
import EditUser from "./routes/EditUser";
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<User />} />
        <Route path="/crear_usuario" element={<CreateUser />} />
        <Route path="/editar_usarios/:id" element={<EditUser />} />
        <Route path="/cita" element={<Cita />} />
        <Route path="/citas" element={<ListaCitas/>} />
        <Route path="/paciente" element={<Paciente />} />
        <Route path="/PersonalMedico" element={<PersonalMedico />} /> 
        <Route path="/AgregarPersonalMedico" element={<AgregarPersonalMedico />} /> 
        <Route path="/EditarPersonalMedico/:id" element={<EditarPersonalMedico />} /> 
        <Route path="/paciente" element={<Paciente/>}/>
        <Route path="/nuevopaciente" element={<CrearPaciente/>}/>
        <Route path="/editarpaciente/:id" element={<EditarPaciente/>}/>
        <Route path="/historialMedico" element={<HistorialMedico/>}/>
        <Route path="/bitacora" element={<Bitacora/>}/>
      </Routes>
    </Router>
  );
}

export default App;
