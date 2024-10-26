import React, { useEffect, useState } from "react";
import { Calendar, User, Phone, Mail } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Citas = ({ selectedDoctor }) => {
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_BASE_URL;
  const [pacientes, setPacientes] = useState([]);
  const [formData, setFormData] = useState({
    dpi: "",
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    direccion: "",
    date: "",
  });
  const [isPatientFound, setIsPatientFound] = useState(false);
  const [isDateInputEnabled, setIsDateInputEnabled] = useState(false);
  const [showNotRegisteredMessage, setShowNotRegisteredMessage] =
    useState(false);
  const [usuarioId, setUsuarioId] = useState();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDPIChange = (e) => {
    const dpi = e.target.value;

    // Verificar que el valor solo tenga hasta 13 dígitos numéricos
    if (/^\d{0,13}$/.test(dpi)) {
      setFormData({ ...formData, dpi });

      const foundPatient = pacientes.find((paciente) => paciente.dpi === dpi);
      if (foundPatient) {
        setFormData({
          dpi,
          nombre: foundPatient.nombre,
          apellido: foundPatient.apellido,
          telefono: foundPatient.telefono,
          correo: foundPatient.correo,
          direccion: foundPatient.direccion,
          date: "",
        });
        setIsPatientFound(true);
        setIsDateInputEnabled(true);
        setShowNotRegisteredMessage(false);
      } else {
        setFormData({
          dpi,
          nombre: "",
          apellido: "",
          telefono: "",
          correo: "",
          direccion: "",
          date: "",
        });
        setIsPatientFound(false);
        setIsDateInputEnabled(false);
        setShowNotRegisteredMessage(true);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      await Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, selecciona un doctor antes de registrar la cita.",
      });
      return;
    }

    let selectedDate = new Date(formData.date);
    selectedDate.setDate(selectedDate.getDate() + 1);

    const citaData = {
      fecha_cita: selectedDate.toISOString().split("T")[0],
      estado: "Confirmada",
      paciente_id: pacientes.find((paciente) => paciente.dpi === formData.dpi)
        ?.id,
      personal_medico_id: selectedDoctor?.id,
      usuario_creacion: usuarioId,
    };
    console.log(citaData);

    try {
      await axios.post(`${url}/citas`, citaData);
      await registrarBitacora();
      await Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Cita registrada con éxito!",
      });
      navigate("/citas");
      setFormData({
        dpi: "",
        nombre: "",
        apellido: "",
        telefono: "",
        correo: "",
        direccion: "",
        date: "",
      });
      setIsPatientFound(false);
      setIsDateInputEnabled(false);
      setShowNotRegisteredMessage(false);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al registrar la cita. Inténtalo nuevamente.",
      });
    }
  };

  const registrarBitacora = async () => {
    const fechaActual = new Date().toISOString();
    const bitacoraData = {
      accion: "INSERT",
      descripcion: "Se registro una nueva cita",
      modulo: 5,
      usuario: usuarioId,
      fecha: fechaActual,
    };

    try {
      await axios.post(`${url}/bitacora`, bitacoraData);
    } catch (error) {
      console.error("Error al registrar en bitácora", error);
    }
  };

  useEffect(() => {
    setUsuarioId(localStorage.getItem(`userId`));
    const fetchPacientes = async () => {
      try {
        const response = await axios.get(`${url}/paciente`);
        setPacientes(response.data);
      } catch (error) {
        console.error("Error encontrando pacientes:", error);
      }
    };

    fetchPacientes();
  }, [url]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-indigo-800 mb-6">
        Programar Cita
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dpi"
          >
            Ingrese DPI del Paciente
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="dpi"
            type="text"
            name="dpi"
            value={formData.dpi}
            onChange={handleDPIChange}
            required
          />
        </div>

        {showNotRegisteredMessage && (
          <p className="text-red-500 mb-4">Paciente no registrado</p>
        )}

        {isPatientFound && (
          <>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="nombre"
              >
                <User className="inline mr-2" size={18} />
                Nombre del Paciente
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="nombre"
                type="text"
                name="nombre"
                value={formData.nombre + " " + formData.apellido}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="telefono"
              >
                <Phone className="inline mr-2" size={18} />
                Número de Teléfono
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="telefono"
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="correo"
              >
                <Mail className="inline mr-2" size={18} />
                Correo Electrónico
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="correo"
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="direccion"
              >
                Dirección
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="direccion"
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="date"
              >
                <Calendar className="inline mr-2" size={18} />
                Fecha de la Cita
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                disabled={!isDateInputEnabled}
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className={`px-4 py-2 rounded ${
            isPatientFound
              ? "bg-blue-500 text-white"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
          disabled={!isPatientFound}
        >
          Registrar Cita
        </button>
      </form>
    </div>
  );
};

export default Citas;
