import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from "../components/Layout/MainLayout";

const PersonalMedico = () => {
    const [personalMedico, setPersonalMedico] = useState([]);
    const [departamentos, setDepartamentos] = useState([]); 
    const [especialidades, setEspecialidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const url = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        axios.get(`${url}/PersonalMedico`)
        .then(response => {
            setPersonalMedico(response.data); 
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching personal medico:", error);
            setLoading(false);
        });

        axios.get(`${url}/departamento`)
            .then(response => {
                setDepartamentos(response.data);
            })
            .catch(error => {
                console.error("Error fetching departamentos:", error);
            });
         
        axios.get(`${url}/especialidad`)
        .then(response => {
            setEspecialidades(response.data); 
        })
        .catch(error => {
            console.error("Error fetching especialidades:", error);
        });

    }, []);

    const manejarClickEditar = (id) => {
        navigate(`/editarPersonalMedico/${id}`); 
    };
 
    const obtenerNombreDepartamento = (departamentoId) => {
        const departamento = departamentos.find(depto => depto.id === departamentoId);
        return departamento ? departamento.nombre : 'No asignado';
    };

    const obtenerNombreEspecialidad = (especialidadId) => {
        const especialidad  = especialidades.find(e => e.id === especialidadId);
        return especialidad ? especialidad.nombre : 'No asignado';
    };

    const obtenerEstado = (estado) => {
        return estado === 1 ? (
            <span style={{ color: "green", fontWeight: "bold" }}>Activo</span>
        ) : (
            <span style={{ color: "red", fontWeight: "bold" }}>Inactivo</span>
        );
    };

    const navigate = useNavigate();
    const manejarClick = () => {
        navigate('/agregarPersonalMedico'); 
      };

    return (
        <MainLayout>
        <div className="w-full h-full">
            <h1 style={{
                textAlign: "center",
                padding: "10px",
                color: "#6482AD",
                fontWeight: "bold",
                fontSize: "36px"
            }}>Administración de Personal Médico</h1>
            <button 
            onClick={manejarClick}
            style={{
                backgroundColor: "#6482AD",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: "14px",
                float: "right",
                marginRight: "325px"
            }}>Registrar Personal Médico</button>

            {loading ? (
                <p style={{ textAlign: "center", marginTop: "20px" }}>Cargando datos...</p>
            ) : (
                <table style={{
                    width: "80%",
                    borderCollapse: "collapse",
                    textAlign: "center",
                    margin: "50px auto",
                    backgroundColor: "#F5EDED"
                }}>
                    <thead>
                        <tr>
                            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#6482AD", color: "white" }}>Nombre</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#6482AD", color: "white" }}>Apellido</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#6482AD", color: "white" }}>Fecha de Nacimiento</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#6482AD", color: "white" }}>Teléfono</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#6482AD", color: "white" }}>Correo</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#6482AD", color: "white" }}>Fecha de Contratación</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#6482AD", color: "white" }}>Departamento</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#6482AD", color: "white" }}>Especialidad ID</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#6482AD", color: "white" }}>Estado</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#6482AD", color: "white" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {personalMedico.length > 0 ? (
                            personalMedico.map((medico) => (
                                <tr key={medico.id}>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{medico.nombre}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{medico.apellido}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{new Date(medico.fechaNacimiento).toLocaleDateString()}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{medico.telefono}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{medico.correo}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{new Date(medico.fechaContratacion).toLocaleDateString()}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{obtenerNombreDepartamento(medico.departamentoId)}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{obtenerNombreEspecialidad(medico.especialidadId)}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{obtenerEstado(medico.estado)}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                        <button 
                                            onClick={() => manejarClickEditar(medico.id)} 
                                            style={{ backgroundColor: "#6482AD", color: "#fff", border: "none", borderRadius: "4px", padding: "5px 10px", cursor: "pointer", fontSize: "14px" }}>
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" style={{ padding: "10px", border: "1px solid #ddd" }}>No hay personal médico disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
        </MainLayout>
    );
};

export default PersonalMedico;
