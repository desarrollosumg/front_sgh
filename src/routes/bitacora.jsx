import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MainLayout } from "../components/Layout/MainLayout";

export const Bitacora = () => {
    const [bitacora, setBitacora] = useState([]);
    const [modulo, setModulo] = useState([]);
    const [usuario, setUsuario] = useState([]);
    const [bitacoraConDetalle, setBitacoraConDetalle] = useState([]);
    const url = process.env.REACT_APP_API_BASE_URL;

    const [currentPage, setCurrentPage] = useState(1);
    const [bitacorasPorPagina] = useState(10);
    const indexOfLastBitacora = currentPage * bitacorasPorPagina;
    const indexOfFirstBitacora = indexOfLastBitacora - bitacorasPorPagina;
    
    const paginar = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(bitacora.length / bitacorasPorPagina);

    useEffect(() => {
        const fetchBitacora = async () => {
            try{
                const response = await axios.get(
                    url + "/bitacora"
                );
                const sortedData = response.data.sort((a, b) => {
                    return new Date(b.fecha) - new Date(a.fecha); 
                });
                setBitacora(sortedData);
            }catch(error){
                console.error("Error al obtener la bitacora: ", error);
            }
        };

        const fetchModulo = async () => {
            try{
                const response = await axios.get(
                    url + "/modulo"
                );
                setModulo(response.data);
            }catch(error){
                console.error("Error al obtener los modulos: ", error);
            }
        };

        const fetchUsuario = async () => {
            try{
                const response = await axios.get(
                    url + "/usuario"
                );
                setUsuario(response.data);
            }catch(error){
                console.error("Error al obtener los usuarios: ", error);
            }
        };

        fetchBitacora();
        fetchModulo();
        fetchUsuario();
    }, []); 

    useEffect(() =>{
        const compararDatos = () => {
            const bitacoraConDetalle = bitacora.map((bit) => {
                const moduloEncontrado = modulo.find(
                    (p) => p.id === bit.modulo
                );
                const usuarioEncontrado = usuario.find(
                    (p) => p.id === bit.usuario
                );

                if(moduloEncontrado && usuarioEncontrado){
                    return {
                        ... bit,
                        id: bit.id,
                        accion: bit.accion,
                        descripcion: bit.descripcion,
                        modulo: moduloEncontrado.nombre,
                        usuario: usuarioEncontrado.nombre_usuario,
                        ip: bit.ip,
                        fecha: bit.fecha
                    };
                }else{
                    return null;
                }

            }).filter((bit) => bit !== null);
            setBitacoraConDetalle(bitacoraConDetalle);
        };
        if(modulo.length > 0 && usuario.length > 0){
            compararDatos();
        }
    }, [bitacora,modulo,usuario]);
    
    const formatearFecha = (fecha) => { 
        const nuevaFecha = new Date(fecha);
        return nuevaFecha.toLocaleDateString();
    };

    const currentBitacoras = bitacoraConDetalle.slice(indexOfFirstBitacora, indexOfLastBitacora);

    return(
        <MainLayout>
            <div className="w-full h-full">
                <h1 className="text-center py-2 font-bold text-4xl">Registros de Bitácora</h1>
                <table className="w-4/5 mx-auto border-collapse text-center float-left ml-36">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border bg-[#6482AD] text-white">Id</th>
                            <th className="px-4 py-2 border bg-[#6482AD] text-white">Acción</th>
                            <th className="px-4 py-2 border bg-[#6482AD] text-white">Descripción</th>
                            <th className="px-4 py-2 border bg-[#6482AD] text-white">Modulo</th>
                            <th className="px-4 py-2 border bg-[#6482AD] text-white">Usuario</th>
                            <th className="px-4 py-2 border bg-[#6482AD] text-white">IP</th>
                            <th className="px-4 py-2 border bg-[#6482AD] text-white">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBitacoras.length > 0 ? (
                                currentBitacoras.map((p, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2 border">{p.id}</td>
                                        <td className="px-4 py-2 border">{p.accion}</td>
                                        <td className="px-4 py-2 border">{p.descripcion}</td>
                                        <td className="px-4 py-2 border">{p.modulo}</td>
                                        <td className="px-4 py-2 border">{p.usuario}</td>
                                        <td className="px-4 py-2 border">{p.ip}</td>
                                        <td className="px-4 py-2 border">{formatearFecha(p.fecha)}</td>
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
        </MainLayout>
    );
};

export default Bitacora;