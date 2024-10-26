import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const Paciente = () => {
    const [paciente, setPaciente] = useState([]);
    const url = process.env.REACT_APP_API_BASE_URL;

    const [currentPage, setCurrentPage] = useState(1);
    const [pacientesPorPagina] = useState(10);
    const indexOfLastPaciente = currentPage * pacientesPorPagina;
    const indexOfFirstPaciente = indexOfLastPaciente - pacientesPorPagina;
    const currentPacientes = paciente.slice(indexOfFirstPaciente, indexOfLastPaciente);
    // Cambiar de página
    const paginar = (pageNumber) => setCurrentPage(pageNumber);

    // Número total de páginas
    const totalPages = Math.ceil(paciente.length / pacientesPorPagina);

    useEffect(() => {
        const fetchPaciente = async () => {
            try{
                const response = await axios.get(
                    url + "/paciente"
                );
                const sortedData = response.data.sort((a, b) => {
                    return new Date(b.fechaRegistro) - new Date(a.fechaRegistro); 
                });
                setPaciente(sortedData);
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
            <span className="text-[#6AAD64] font-bold">Activo</span>
        ) : (
            <span className="text-[#C45A5A] font-bold">Inactivo</span>
        );
    };    

    return (
        <div className="w-full h-full">
            <h1 className="text-center py-2 font-bold text-4xl">Administración de Pacientes</h1>
            <Link to="/nuevopaciente">
                <button className="bg-[#7FA1C3] text-white rounded-lg px-4 py-2 text-sm float-left ml-36 hover:bg-[#4B6E9F] transition duration-300 mb-6">
                    Registrar Paciente
                </button>
            </Link>
            <table className="w-4/5 mx-auto border-collapse text-center float-left ml-36">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border bg-[#6482AD] text-white">Nombre</th>
                        <th className="px-4 py-2 border bg-[#6482AD] text-white">Apellido</th>
                        <th className="px-4 py-2 border bg-[#6482AD] text-white">DPI</th>
                        <th className="px-4 py-2 border bg-[#6482AD] text-white">Email</th>
                        <th className="px-4 py-2 border bg-[#6482AD] text-white">Teléfono</th>
                        <th className="px-4 py-2 border bg-[#6482AD] text-white">Dirección</th>
                        <th className="px-4 py-2 border bg-[#6482AD] text-white">Fecha de Registro</th>
                        <th className="px-4 py-2 border bg-[#6482AD] text-white">Estado</th>
                        <th className="px-4 py-2 border bg-[#6482AD] text-white"></th>
                    </tr>
                </thead>
                <tbody>
                    {currentPacientes.length > 0 ? (
                            currentPacientes.map((p, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 border">{p.nombre}</td>
                                    <td className="px-4 py-2 border">{p.apellido}</td>
                                    <td className="px-4 py-2 border">{p.dpi}</td>
                                    <td className="px-4 py-2 border">{p.correo}</td>
                                    <td className="px-4 py-2 border">{p.telefono}</td>
                                    <td className="px-4 py-2 border">{p.direccion}</td>
                                    <td className="px-4 py-2 border">{formatearFecha(p.fechaRegistro)}</td>
                                    <td className="px-4 py-2 border">{obtenerEstado(p.estado)}</td>
                                    <td className="px-4 py-2 border">
                                    <Link to={`/editarpaciente/${p.id}`}>
                                       <button className="bg-[#6F91B3] text-white rounded px-4 py-2 text-sm hover:bg-[#4B6E9F] transition duration-300">
                                            Editar
                                        </button>
                                    </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="px-4 py-2 border">No hay pacientes disponibles</td>
                            </tr>
                        )}
                </tbody>
            </table>
            <nav aria-label="Page navigation example" className="w-4/5 mx-auto mt-2 pr-4 float-left ml-36">
                <ul className="inline-flex -space-x-px text-sm">
                    <li>
                        <button
                            onClick={() => paginar(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 rounded-s-lg
                                hover:bg-gray-100 hover:text-gray-700 transition duration-300 ${
                                currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 bg-white'}`}>
                            Anterior
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                        <li key={pageNumber}>
                            <button
                                onClick={() => paginar(pageNumber)}
                                className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 ${
                                    currentPage === pageNumber ? "bg-[#7FA1C3] bg-blue-50 hover:bg-blue-100" : "text-gray-500 bg-white hover:bg-gray-100"}
                                    transition duration-300`}>
                                {pageNumber}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button onClick={() => paginar(currentPage + 1)} disabled={currentPage === totalPages} 
                            className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 rounded-e-lg
                            hover:bg-gray-100 hover:text-gray-700 
                            transition duration-300 ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 bg-white'}`}>
                            Siguiente
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Paciente;