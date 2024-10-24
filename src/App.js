// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./routes/Home"; // Ruta principal
import User from "./routes/User"; // Lista de usuarios
import CreateUser from "./routes/CreateUser"; // Crear usuario
import EditUser from "./routes/EditUser"; // Editar usuario

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} /> {/* Página principal */}
                <Route path="/user" element={<User />} /> {/* Lista de usuarios */}
                <Route path="/crearusuario" element={<CreateUser />} /> {/* Crear usuario */}
                <Route path="/EditUser/:id" element={<EditUser />} /> {/* Ruta dinámica */}
            </Routes>
        </Router>
    );
}

export default App;
