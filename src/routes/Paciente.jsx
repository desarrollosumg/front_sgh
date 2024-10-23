import React, { useState, useEffect } from "react";
import axios from "axios";

export const Paciente = () => {
    const [paciente, setPaciente] = useState([]);
    const url = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const fetchPaciente = async () => {
            try{
                const response = await axios.get(
                    url + "/paciente"
                );
                setPaciente(response.data);
            }catch(error){
                console.error("Error al obtener los pacientes: ", error);
            }
        };

        fetchPaciente();
    }, []);

    const formatearFecha = (fecha) => {
        const nuevaFecha = new Date(fecha);
        return nuevaFecha.toLocaleDateString();
    };

    const obtenerEstado = (estado) => {
        return estado == 1 ? (
            <span style={{ color: "green", fontWeight: "bold" }}>Activo</span>
        ) : (
            <span style={{ color: "red", fontWeight: "bold" }}>Inactivo</span>
        );
    };

    return (
        <div className="w-full h-full">
            <h1 style={{textAlign: "center", padding: "10px", color: "", fontWeight: "bold", fontSize:"36px"}}>Administración de Pacientes</h1>
            <button style={{backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", padding: "8px 16px", cursor: "pointer", fontSize: "14px", float: "right", marginRight: "325px"}}> Registrar Paciente </button>
            <table style={{width: "80%", borderCollapse: "collapse", textAlign: "center", margin: "50px"}}>
                <thead>
                    <tr>
                        <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#ADD8E6", color: "black"}}> Nombre </th>
                        <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#ADD8E6", color: "black"}}> Apellido </th>
                        <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#ADD8E6", color: "black"}}> DPI </th>
                        <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#ADD8E6", color: "black"}}> Email </th>
                        <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#ADD8E6", color: "black"}}> Teléfono </th>
                        <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#ADD8E6", color: "black"}}> Dirección </th>
                        <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#ADD8E6", color: "black"}}> Fecha de Registro </th>
                        <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#ADD8E6", color: "black"}}> Estado </th>
                        <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#ADD8E6", color: "black"}}> </th>
                    </tr>
                </thead>
                <tbody>
                    {paciente.length > 0 ? (
                        paciente.map((p, index) => (
                            <tr key={index}>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{p.nombre}</td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{p.apellido}</td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{p.dpi}</td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{p.correo}</td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{p.telefono}</td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{p.direccion}</td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{formatearFecha(p.fechaRegistro)}</td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{obtenerEstado(p.estado)}</td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}> 
                                    <button style={{ backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", padding: "8px 16px", cursor: "pointer", fontSize: "14px",}}> Editar </button> 
                                </td>
                            </tr>
                        )) 
                    ) : (
                        <tr>
                            <td colSpan="9" style={{ padding: "10px", border: "1px solid #ddd" }}> No hay pacientes disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Paciente;