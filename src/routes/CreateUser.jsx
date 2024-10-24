import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../components/Layout/MainLayout";
import axios from "axios";
import Swal from "sweetalert2";
import SHA256 from "crypto-js/sha256"; // Importar SHA256 para encriptar

const CrearUsuario = () => {
    const navigate = useNavigate();

    const rolesOptions = [
        { value: 1, label: "Super Admin" },
        { value: 2, label: "Directivo" },
        { value: 3, label: "Médico" },
        { value: 4, label: "Administración" },
        { value: 5, label: "Usuario" },
    ];

    const [usuario, setUsuario] = useState({
        nombreUsuario: "",
        correo_electronico: "",
        clave: "",
        rol_id: 1,
        activo: 1,
        usuario_creador: "", // Selección de usuario creador
        fecha_creacion: new Date().toISOString(), // Fecha de creación actual
        fecha_modificacion: null, // Inicialmente nulo
    });

    const [usuarios, setUsuarios] = useState([]);

    // Obtener la lista de usuarios para seleccionar el creador
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get("http://localhost:8080/usuario/buscar");
                setUsuarios(response.data);
            } catch (error) {
                console.error("Error al obtener los usuarios:", error);
                Swal.fire("Error", "Error al obtener la lista de usuarios", "error");
            }
        };
        fetchUsuarios();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        const parsedValue = name === "rol_id" || name === "activo" ? parseInt(value) : value;

        setUsuario((prevUsuario) => ({
            ...prevUsuario,
            [name]: parsedValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const claveEncriptada = SHA256(usuario.clave).toString();

            const usuarioConClaveEncriptada = {
                ...usuario,
                clave: claveEncriptada,
            };

            const response = await axios.post(
                "http://localhost:8080/usuario/guardar",
                usuarioConClaveEncriptada
            );

            Swal.fire("Éxito", "Usuario creado con éxito", "success");
            navigate("/User");
        } catch (error) {
            console.error("Error al crear el usuario:", error);
            Swal.fire("Error", "Error al crear el usuario", "error");
        }
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-md">
                <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">
                    Crear Usuario
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="text"
                            name="nombreUsuario"
                            placeholder="Nombre de Usuario"
                            onChange={handleChange}
                            required
                            className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="email"
                            name="correo_electronico"
                            placeholder="Correo Electrónico"
                            onChange={handleChange}
                            required
                            className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="password"
                            name="clave"
                            placeholder="Clave"
                            onChange={handleChange}
                            required
                            className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <select
                            name="rol_id"
                            value={usuario.rol_id}
                            onChange={handleChange}
                            required
                            className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccione un Rol</option>
                            {rolesOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <select
                            name="usuario_creador"
                            value={usuario.usuario_creador}
                            onChange={handleChange}
                            required
                            className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccione el Usuario Creador</option>
                            {usuarios.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.nombreUsuario}
                                </option>
                            ))}
                        </select>

                        <select
                            name="activo"
                            value={usuario.activo}
                            onChange={handleChange}
                            required
                            className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={1}>Activo</option>
                            <option value={0}>Inactivo</option>
                        </select>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            className="bg-black text-white font-bold py-2 px-6 rounded-md hover:bg-blue-600 transition"
                        >
                            Crear Usuario
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
};

export default CrearUsuario;
