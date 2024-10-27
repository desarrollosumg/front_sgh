import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { MainLayout } from "../components/Layout/MainLayout";

export const EditarPaciente = () => {
    const { id } = useParams();
    const url = process.env.REACT_APP_API_BASE_URL;
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState({
        id: id,
        nombre: "",
        apellido: "",
        genero: "",
        dpi: "",
        correo: "",
        telefono: "",
        direccion: "",
        fechaRegistro: "",
        fechaModificacion: ""
    });
    const [bitacora, setBitacora] = useState({
        accion:"Modificación",
        modulo: 2,
        usuario: localStorage.getItem("userId"),
        fecha: new Date().toISOString()
    });

    useEffect(() => {
        const fetchPaciente = async () => {
            try{
                const response = await axios.get(`${url}/paciente/${id}`);
                setPaciente(response.data);
            }catch(error){
                console.error("Error al obtener el paciente: ", error);
            }
        };
        fetchPaciente();
    }, [id,url]);

    const handlePacienteChange = (e) => {
        setPaciente({
            ...paciente,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const camposObligatorios = ["nombre", "apellido", "genero", "dpi", "correo", "telefono", "direccion", "estado"];
        for (let campo of camposObligatorios) {
            if (!paciente[campo] || paciente[campo].trim() === "") {
                Swal.fire({
                    icon: "error",
                    title: "Campos incompletos",
                    text: `El campo ${campo} no puede estar vacío.`,
                    showConfirmButton: true
                });
                return;
            }
        }

        const textoRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!textoRegex.test(paciente.nombre)) {
            Swal.fire({
                icon: "error",
                title: "Nombre inválido",
                text: "El nombre solo debe contener letras.",
                showConfirmButton: true
            });
            return;
        }

        if (!textoRegex.test(paciente.apellido)) {
            Swal.fire({
                icon: "error",
                title: "Apellido inválido",
                text: "El apellido solo debe contener letras.",
                showConfirmButton: true
            });
            return;
        }

        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correoRegex.test(paciente.correo)) {
            Swal.fire({
                icon: "error",
                title: "Correo inválido",
                text: "Por favor, ingrese un correo electrónico válido.",
                showConfirmButton: true
            });
            return;
        }

        const dpiRegex = /^\d{13}$/;
        if (!dpiRegex.test(paciente.dpi)) {
            Swal.fire({
                icon: "error",
                title: "DPI inválido",
                text: "El DPI debe contener solo números y exactamente 13 dígitos.",
                showConfirmButton: true
            });
            return;
        }

        const telefonoRegex = /^\d{8}$/;
        if (!telefonoRegex.test(paciente.telefono)) {
            Swal.fire({
                icon: "error",
                title: "Teléfono inválido",
                text: "El teléfono debe contener solo números y exactamente 8 dígitos.",
                showConfirmButton: true
            });
            return;
        }

        try{
            const pacienteActualizado = {
                ...paciente,
                usuarioModificacion: localStorage.getItem("userId"),
            };

            const pacienteResponse = await axios.put(
                `${url}/paciente/${id}`, pacienteActualizado
            );

            const bitacoraNuevo = {
                ...bitacora,
                descripcion: "El usuario " + localStorage.getItem("nombre_usuario") + " ha modificado al paciente: " + paciente.nombre + " " + paciente.apellido,
            };
            
            const bitacoraResponse = await axios.post(
                url + "/bitacora", bitacoraNuevo
            );

            Swal.fire({
                icon: "success",
                title: "¡Perfecto!",
                text: "El paciente ha sido modificado exitosamente.",
                showConfirmButton: false,
                timer: 2000
            }).then(() => {
                navigate("/paciente"); 
            });

        }catch(error){
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al modificar el paciente. Inténtelo de nuevo.",
                showConfirmButton: false,
                timer: 2000
            });

            console.error("Error al crear un nuevo paciente: ", error);
        }
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto p-10 bg-gray-100 shadow-md rounded-lg">
                <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">
                    Modificar Paciente
                </h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <h3 className="text-2x1 font-semibold text-gray-700">
                            Datos del Paciente
                        </h3>
                        <hr className="my-4 border-gray-300" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" name="nombre" value={paciente.nombre} placeholder="Nombre del paciente" onChange={handlePacienteChange} required className="block p-4 w-full text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                            <input type="text" name="apellido" value={paciente.apellido} placeholder="Apellido del paciente" onChange={handlePacienteChange} required className="block p-4 w-full text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                            <select name="genero" value={paciente.genero} onChange={handlePacienteChange} required className="block p-4 w-full text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option value={""}>Seleccione genero</option>
                                <option value={"Femenino"}>Femenino</option>
                                <option value={"Masculino"}>Masculino</option>
                            </select>
                            <input type="text" name="dpi" value={paciente.dpi} placeholder="DPI del paciente" onChange={handlePacienteChange} required className="block p-4 w-full text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                            <input type="text" name="correo" value={paciente.correo} placeholder="Correo del paciente" onChange={handlePacienteChange} required className="block p-4 w-full text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                            <input type="text" name="telefono" value={paciente.telefono} placeholder="Teléfono del paciente" onChange={handlePacienteChange} required className="block p-4 w-full text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                            <input type="text" name="direccion" value={paciente.direccion} placeholder="Dirección del paciente" onChange={handlePacienteChange} required className="block p-4 w-full text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                            <select name="estado" value={paciente.estado} onChange={handlePacienteChange} required className="block p-4 w-full text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option value={""}>Seleccione estado</option>
                                <option value={"1"}>Activo</option>
                                <option value={"0"}>Inactivo</option>
                            </select>
                            <div className="flex space-x-[10px]">
                                <Link to="/paciente">
                                    <button type="button" className="block p-4 w-full md:w-auto text-[#C45A5A] hover:text-white border border-red-700
                                    hover:bg-[#C45A5A] focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm text-center
                                    dark:bg-[#C45A5A] dark:text-[#C45A5A] dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                                        Cancelar
                                    </button>
                                </Link>
                                <button type="submit" className="p-4 w-full md:w-auto bg-[#7FA1C3] text-white font-semibold rounded-lg shadow-md
                                hover:bg-[#6482AD] focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300">
                                    Modificar
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
};

export default EditarPaciente;