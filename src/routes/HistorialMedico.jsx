import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Calendar, User, Stethoscope, FileText } from 'lucide-react';
import { MainLayout } from "../components/Layout/MainLayout";

const HistorialMedico = () => {
  const [doctores, setDoctores] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [searchedPatient, setSearchedPatient] = useState(null);
  const [error, setError] = useState('');
  const url = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctoresResponse, pacientesResponse, historialResponse] = await Promise.all([
          axios.get(`${url}/PersonalMedico`),
          axios.get(`${url}/paciente`),
          axios.get(`${url}/historial_medico`),
        ]);

        setDoctores(doctoresResponse.data);
        setPacientes(pacientesResponse.data);
        setHistorial(historialResponse.data);
      } catch (error) {
        console.error("Error encontrando datos:", error);
      }
    };

    fetchData();
  }, [url]);

  const handleSearch = async (e) => {
    e.preventDefault();

    const dpiRegex = /^\d{13}$/;
    if (!dpiRegex.test(patientId)) {
        setError('El DPI debe contener solo números y debe tener exactamente 13 dígitos.');
        setSearchedPatient(null);
        return;
    }

    const foundPatient = pacientes.find(p => p.dpi === patientId);
    if (!foundPatient) {
        setError('No se encontró ningún paciente con el DPI proporcionado.');
        setSearchedPatient(null);
        return;
    }

    const patientRecords = historial
        .filter(record => record.pacienteId === foundPatient.id)
        .map(record => {
            const doctor = doctores.find(doc => doc.id === record.personalMedicoId);
            return {
                ...record,
                doctorName: doctor ? `Dr. ${doctor.nombre} ${doctor.apellido}` : "Doctor Desconocido",
            };
        })
        .sort((a, b) => new Date(b.fechaConsulta) - new Date(a.fechaConsulta));

    setSearchedPatient({
        patientName: `${foundPatient.nombre} ${foundPatient.apellido}`,
        records: patientRecords,
    });
    setError('');
};

  return (
    <MainLayout>
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-indigo-800 mb-6">Historial Médico</h2>
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-grow">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patientId">
                DPI del Paciente
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="patientId"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="El DPI debe contener 13 digitos"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-300"
              >
                Buscar
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {searchedPatient && (
          <div>
            <div className="bg-indigo-50 p-4 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-indigo-800 mb-2 flex items-center">
                <User className="mr-2" size={24} />
                {searchedPatient.patientName}
              </h3>
            </div>

            <div className="space-y-6">
              {searchedPatient.records.map((record) => (
                <details key={`${record.id}-${record.fechaConsulta}`} className="border border-gray-200 rounded-lg">

                  <summary className="cursor-pointer bg-gray-50 px-6 py-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Calendar className="text-indigo-600" size={20} />
                        <span className="font-medium">{new Date(record.fechaConsulta).toLocaleDateString()}</span>
                      </div>
                      <span className="text-indigo-600">{record.doctorName}</span>
                    </div>
                  </summary>
                  <div className="px-6 py-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <Stethoscope className="text-gray-400 mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Tratamiento</h4>
                        <p className="text-gray-600">{record.tratamiento}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="text-gray-400 mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Notas</h4>
                        <p className="text-gray-600">{record.notas}</p>
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </MainLayout>
  );
};

export default HistorialMedico;
