import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2"; // Importar SweetAlert2
import SHA256 from "crypto-js/sha256"; // Importar SHA256 para encriptar

const EditUser = () => {
    const { id } = useParams(); // Captura el ID desde la URL
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState({
        nombreUsuario: "",
        correo_electronico: "",
        clave: "",
        activo: 1,
        rol_id: 1,
        usuario_modificacion: 1, // ID del usuario que modifica
        fecha_modificacion: new Date().toISOString(),
    });

    // Cargar los datos del usuario al montar el componente
    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/usuario/${id}`);
                setUsuario(response.data);
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
                Swal.fire("Error", "No se pudo cargar la información del usuario", "error");
            }
        };

        fetchUsuario();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario((prevUsuario) => ({
            ...prevUsuario,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let usuarioActualizado = {
                ...usuario,
                fecha_modificacion: new Date().toISOString()
            };

            // Encriptar la contraseña solo si fue modificada
            if (usuario.clave) {
                const claveEncriptada = SHA256(usuario.clave).toString();
                usuarioActualizado = { ...usuarioActualizado, clave: claveEncriptada };
            }

            // Enviar los datos al backend
            await axios.put(`http://localhost:8080/usuario/${id}`, usuarioActualizado);

            // Mostrar SweetAlert de éxito
            Swal.fire("Éxito", "Usuario actualizado correctamente", "success");

            // Redirigir a la lista de usuarios
            navigate("/user");
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            // Mostrar SweetAlert de error
            Swal.fire("Error", "No se pudo actualizar el usuario", "error");
        }
    };

    return (
        <MainLayout>
            <div className="w-full h-full">
                <h1 style={styles.title}>Editar Usuario</h1>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        name="nombreUsuario"
                        placeholder="Nombre de Usuario"
                        value={usuario.nombreUsuario}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    <input
                        type="email"
                        name="correo_electronico"
                        placeholder="Correo Electrónico"
                        value={usuario.correo_electronico}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    <input
                        type="password"
                        name="clave"
                        placeholder="Contraseña (Dejar vacío para no cambiar)"
                        value={usuario.clave}
                        onChange={handleChange}
                        style={styles.input}
                    />
                    <select
                        name="rol_id"
                        value={usuario.rol_id}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    >
                        <option value={1}>Directivo</option>
                        <option value={2}>Medico</option>
                        <option value={3}>Administración</option>
                        <option value={4}>Usuarios</option>
                    </select>
                    <button type="submit" style={styles.button}>
                        Guardar Cambios
                    </button>
                </form>
            </div>
        </MainLayout>
    );
};

const styles = {
    title: {
        textAlign: "center",
        padding: "10px",
        color: "black",
        fontWeight: "bold",
        fontSize: "36px",
    },
    form: {
        width: "50%",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    input: {
        padding: "10px",
        fontSize: "16px",
        borderRadius: "4px",
        border: "1px solid #ddd",
    },
    button: {
        padding: "10px",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
};

export default EditUser;
