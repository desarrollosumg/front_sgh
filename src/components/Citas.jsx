import React, { useEffect, useState } from 'react';
import { Calendar, User, Phone, Mail } from 'lucide-react';
import axios from "axios";

const Citas = ({ selectedDoctor }) => {
  const url = process.env.REACT_APP_API_BASE_URL;
  const [pacientes, setPacientes] = useState([]);
  const [formData, setFormData] = useState({
    dpi: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    direccion: '',
    date: '',
  });
  const [isPatientFound, setIsPatientFound] = useState(false);
  const [isDateInputEnabled, setIsDateInputEnabled] = useState(false);
  const [showNotRegisteredMessage, setShowNotRegisteredMessage] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDPIChange = (e) => {
    const dpi = e.target.value;
    setFormData({ ...formData, dpi });

    const foundPatient = pacientes.find(paciente => paciente.dpi === dpi);
    if (foundPatient) {
      setFormData({
        dpi,
        nombre: foundPatient.nombre,
        apellido: foundPatient.apellido,
        telefono: foundPatient.telefono,
        correo: foundPatient.correo,
        direccion: foundPatient.direccion,
        date: ''
      });
      setIsPatientFound(true);
      setIsDateInputEnabled(true);
      setShowNotRegisteredMessage(false);
    } else {
      setFormData({
        dpi,
        nombre: '',
        apellido: '',
        telefono: '',
        correo: '',
        direccion: '',
        date: ''
      });
      setIsPatientFound(false);
      setIsDateInputEnabled(false);
      setShowNotRegisteredMessage(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const citaData = {
      fecha_cita: formData.date,
      estado: "Confirmada", // Estado fijo
      paciente_id: pacientes.find(paciente => paciente.dpi === formData.dpi)?.id, // ID del paciente
      personal_medico_id: selectedDoctor?.id, // ID del doctor
      usuario_creacion: 1 // Ajusta este valor según corresponda
    };
    console.log(citaData);

    try {
      await axios.post(`${url}/citas`, citaData);
      alert('Cita registrada con éxito!');
      // Resetea el formulario
      setFormData({
        dpi: '',
        nombre: '',
        apellido: '',
        telefono: '',
        correo: '',
        direccion: '',
        date: '',
      });
      setIsPatientFound(false);
      setIsDateInputEnabled(false);
      setShowNotRegisteredMessage(false);
    } catch (error) {
      console.error("Error registrando cita:", error);
      alert('Hubo un error al registrar la cita. Inténtalo nuevamente.');
    }
  };

  useEffect(() => {
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
      <h2 className="text-2xl font-semibold text-indigo-800 mb-6">Programar Cita</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dpi">
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                <User className="inline mr-2" size={18} />
                Nombre del Paciente
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="nombre"
                type="text"
                name="nombre"
                value={formData.nombre + " "+ formData.apellido}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="correo">
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="direccion">
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
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

        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">
          Registrar Cita
        </button>
      </form>
    </div>
  );
};

export default Citas;
