import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Para alertas

const User = () => {
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate(); // Navegar entre páginas

    // Obtener usuarios del backend
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get("http://localhost:8080/usuario/buscar");
                setUsuarios(response.data);
            } catch (error) {
                console.error("Error al obtener los usuarios:", error);
                Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
            }
        };
        fetchUsuarios();
    }, []);

    // Navegar a la página de edición con el ID del usuario
    const openEditarUsuario = (id) => {
        navigate(`/EditUser/${id}`);
    };

    // Cambiar el estado entre Activo/Inactivo
    const toggleEstadoUsuario = async (usuario) => {
        try {
            const nuevoEstado = usuario.activo === 1 ? 0 : 1;
            const usuarioActualizado = { ...usuario, activo: nuevoEstado };

            await axios.put(`http://localhost:8080/usuario/${usuario.id}`, usuarioActualizado);

            setUsuarios((prevUsuarios) =>
                prevUsuarios.map((u) => (u.id === usuario.id ? usuarioActualizado : u))
            );

            Swal.fire("Éxito", "El estado del usuario ha sido actualizado", "success");
        } catch (error) {
            console.error("Error al actualizar el estado del usuario:", error);
            Swal.fire("Error", "No se pudo actualizar el estado del usuario", "error");
        }
    };

    // Filtrar usuarios activos
    const usuariosActivos = usuarios.filter((usuario) => usuario.activo === 1);

    return (
        <MainLayout>
            <div className="w-full h-full">
                <h1 style={styles.header}>Gestión de Usuarios</h1>
                <Link to="/crearusuario">
                    <button style={styles.button}>Registrar Usuario</button>
                </Link>
                <table style={styles.table}>
                    <thead>
                    <tr>
                        <th style={styles.headerCell}>ID</th>
                        <th style={styles.headerCell}>Nombre de Usuario</th>
                        <th style={styles.headerCell}>Correo Electrónico</th>
                        <th style={styles.headerCell}>Rol</th>
                        <th style={styles.headerCell}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usuariosActivos.map((usuario) => (
                        <tr key={usuario.id}>
                            <td style={styles.cell}>{usuario.id}</td>
                            <td style={styles.cell}>{usuario.nombreUsuario}</td>
                            <td style={styles.cell}>{usuario.correo_electronico}</td>
                            <td style={styles.cell}>{usuario.rol_id}</td>
                            <td style={styles.cell}>
                                <button
                                    onClick={() => openEditarUsuario(usuario.id)}
                                    style={styles.editButton}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => toggleEstadoUsuario(usuario)}
                                    style={styles.toggleButton}
                                >
                                    Desactivar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
};

const styles = {
    header: {
        textAlign: "center",
        padding: "10px",
        color: "black",
        fontWeight: "bold",
        fontSize: "36px",
    },
    table: {
        width: "80%",
        borderCollapse: "collapse",
        textAlign: "center",
        margin: "50px auto",
    },
    headerCell: {
        padding: "10px",
        border: "1px solid #ddd",
        backgroundColor: "#ADD8E6",
        color: "black",
    },
    cell: {
        padding: "10px",
        border: "1px solid #ddd",
    },
    editButton: {
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        padding: "8px 16px",
        cursor: "pointer",
        fontSize: "14px",
        marginRight: "5px",
    },
    toggleButton: {
        backgroundColor: "#ff6347",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        padding: "8px 16px",
        cursor: "pointer",
        fontSize: "14px",
    },
    button: {
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        padding: "8px 16px",
        cursor: "pointer",
        fontSize: "14px",
        float: "right",
        marginRight: "325px",
    },
};

export default User;
