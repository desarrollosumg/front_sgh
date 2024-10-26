import React, { useEffect, useState } from "react";
import { Calendar, User, CalendarPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const ListaCitas = () => {
  const [doctores, setDoctores] = useState([]);
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCita, setEditCita] = useState(null);
  const url = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [usuarioId, setUsuarioId]= useState();

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800"; // Manejo de status undefined

    switch (status.toLowerCase()) {
      case "confirmada":
        return "bg-green-100 text-green-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    setUsuarioId(localStorage.getItem(`userId`))
    const fetchData = async () => {
      try {
        const [doctoresResponse, citasResponse, pacientesResponse] =
          await Promise.all([
            axios.get(`${url}/PersonalMedico`),
            axios.get(`${url}/citas`),
            axios.get(`${url}/paciente`),
          ]);

        setDoctores(doctoresResponse.data);
        setPacientes(pacientesResponse.data);
        const sortedCitas = citasResponse.data.sort((a, b) => {
          return new Date(a.fecha_cita) - new Date(b.fecha_cita);
        });

        setCitas(sortedCitas);
      } catch (error) {
        console.error("Error encontrando datos:", error);
      }
    };

    fetchData();
  }, [url]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("es-GT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPacienteName = (pacienteId) => {
    const paciente = pacientes.find((p) => p.id === pacienteId);
    return paciente ? paciente.nombre + " " + paciente.apellido : "Desconocido";
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctores.find((d) => d.id === doctorId);
    return doctor ? doctor.nombre + " " + doctor.apellido : "Desconocido";
  };

  const cancelarCita = async (cita) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres cancelar esta cita?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, mantener",
    });

    if (result.isConfirmed) {
      try {
        const updatedCita = { ...cita, estado: "Cancelada" };
        const response = await axios.put(`${url}/citas/cancelar`, updatedCita);
        setCitas((prevCitas) =>
          prevCitas.map((item) => (item.id === cita.id ? response.data : item))
        );

        Swal.fire("Cancelada", "La cita ha sido cancelada.", "success");
      } catch (error) {
        console.error("Error cancelando la cita:", error);
        Swal.fire("Error", "Hubo un problema al cancelar la cita.", "error");
      }
    }
  };

  const abrirModalEditar = (cita) => {
    const formattedDate = new Date(cita.fecha_cita).toISOString().split("T")[0];
    setEditCita({ ...cita, fecha_cita: formattedDate });
    setIsModalOpen(true);
  };

  const manejarEdicionCita = async () => {
    try {
      const dateO = new Date(editCita.fecha_cita);
      const response = await axios.put(`${url}/citas`, {
        ...editCita,
        fecha_cita: new Date(dateO.getTime() + 6 * 60 * 60 * 1000),
        usuario_modificacion: usuarioId,
        fecha_modificacion: new Date(dateO.getTime() + 6 * 60 * 60 * 1000),
      });
      setCitas((prevCitas) =>
        prevCitas.map((item) =>
          item.id === editCita.id ? response.data : item
        )
      );
      await registrarBitacora();
      Swal.fire("Actualizada", "La cita ha sido actualizada.", "success");
      setIsModalOpen(false);
      setEditCita(null);
    } catch (error) {
      console.error("Error actualizando la cita:", error);
      Swal.fire("Error", "Hubo un problema al actualizar la cita.", "error");
    }
  };

  const registrarBitacora = async () => {
    const fechaActual = new Date().toISOString();
    const bitacoraData = {
        accion: "UPDATE",
        descripcion: "Se actualizo cita",
        modulo: 5,
        usuario: usuarioId,
        fecha: fechaActual
    };

    try {
        await axios.post(`${url}/bitacora`, bitacoraData);
    } catch (error) {
        console.error('Error al registrar en bitácora', error);
    }
};

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-lg p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-800">
            LISTADO DE CITAS
          </h2>
          <button
           onClick={() => navigate("/cita")}
            className="absolute top-6 right-6 flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <CalendarPlus className="h-5 w-5 mr-2" />
            Agendar Cita
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#E2DAD6]">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre del Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de la Cita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {citas.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-[#F5EDED]">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {getPacienteName(appointment.paciente_id)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getDoctorName(appointment.personal_medico_id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">
                        {formatDate(appointment.fecha_cita)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        appointment.estado
                      )}`}
                    >
                      {appointment.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => abrirModalEditar(appointment)}
                      disabled={
                        appointment.estado.toLowerCase() === "cancelada"
                      }
                      className={`relative px-4 py-1 rounded-full ${
                        appointment.estado.toLowerCase() === "cancelada"
                          ? "bg-gray-300 border-gray-500 text-gray-600 cursor-not-allowed"
                          : "bg-white border-[#BA0217] text-black hover:bg-gray-50"
                      }relative px-4 py-1 rounded-full bg-white isolation-auto z-10 border-2 border-blue-500 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full hover:text-white before:-right-full before:hover:right-0 before:rounded-full before:bg-[#032394] before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700 inline-flex items-center justify-center text-xs font-semibold text-black bg-white border border-gray-200 shadow-sm gap-x-2 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none mr-2`}
                    >
                      {appointment.estado.toLowerCase() === "cancelada"
                        ? "Editar"
                        : "Editar"}
   
                    </button>

                    <button
                      onClick={() => {
                        if (appointment.estado.toLowerCase() !== "cancelada") {
                          cancelarCita(appointment);
                        }
                      }}
                      disabled={
                        appointment.estado.toLowerCase() === "cancelada"
                      }
                      className={`relative px-4 py-1 rounded-full ${
                        appointment.estado.toLowerCase() === "cancelada"
                          ? "bg-gray-300 border-gray-500 text-gray-600 cursor-not-allowed"
                          : "bg-white border-[#BA0217] text-black hover:bg-gray-50"
                      } isolation-auto z-10 border-2 border-red-700  before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full hover:text-white before:-right-full before:hover:right-0 before:rounded-full before:bg-[#BA0217] before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700 inline-flex items-center justify-center text-xs font-semibold text-black bg-white border border-gray-200 shadow-sm gap-x-2 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none`}
                    >
                      {appointment.estado.toLowerCase() === "cancelada"
                        ? "Cancelada"
                        : "Cancelar"}
                    </button>
                  </td>
                </tr>
              ))}

              {citas.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <p className="text-gray-500">
                      No se encontraron citas registradas
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Editar Cita</h3>
            {editCita && (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Paciente
                  </label>
                  <input
                    type="text"
                    value={getPacienteName(editCita.paciente_id)}
                    disabled
                    className="mt-1 block w-full bg-gray-100 text-gray-500 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Doctor
                  </label>
                  <select
                    value={editCita.personal_medico_id}
                    onChange={(e) =>
                      setEditCita({
                        ...editCita,
                        personal_medico_id: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {doctores.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.nombre} {doctor.apellido}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha de Cita
                  </label>
                  <input
                    type="date"
                    id="fecha_cita"
                    value={editCita.fecha_cita}
                    onChange={(e) =>
                      setEditCita({ ...editCita, fecha_cita: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={manejarEdicionCita}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaCitas;
