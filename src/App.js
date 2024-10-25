import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import User from "./routes/User";
import CreateUser from "./routes/CreateUser";
import EditUser from "./routes/EditUser";
import Cita from "./routes/Cita";
import Home from "./routes/login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<User />} />
        <Route path="/crear_usuario" element={<CreateUser />} />
        <Route path="/editar_usarios/:id" element={<EditUser />} />
        <Route path="/cita" element={<Cita />} />
      </Routes>
    </Router>
  );
}

export default App;
