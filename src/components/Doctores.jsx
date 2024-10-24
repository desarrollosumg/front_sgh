import React, { useEffect, useState } from "react";
import axios from "axios";

const Doctores = ({ onSelectDoctor }) => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const url = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${url}/PersonalMedico`);
        const transformedDoctors = response.data.map((doctor) => ({
          id: doctor.id,
          name: `${doctor.nombre} ${doctor.apellido}`,
          specialtyId: doctor.especialidadId,
        }));

        setDoctors(transformedDoctors);
      } catch (error) {
        console.error("Error encontrando doctores:", error);
      }
    };

    const fetchSpecialties = async () => {
      try {
        const response = await axios.get(`${url}/especialidad`);
        setSpecialties(response.data);
      } catch (error) {
        console.error("Error encontrando especialidades:", error);
      }
    };

    fetchDoctors();
    fetchSpecialties();
  }, [url]);

  const getSpecialtyName = (id) => {
    const specialty = specialties.find((spec) => spec.id === id);
    return specialty ? specialty.nombre : "Especialidad desconocida";
  };

  const handleSelectDoctor = (doctorId) => {
    setSelectedDoctorId(doctorId);
    const selectedDoctor = doctors.find((doctor) => doctor.id === doctorId);
    onSelectDoctor(selectedDoctor);
  };

  

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-indigo-800 mb-6">Nuestros Doctores</h2>
      <div className="space-y-6">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className={`flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition duration-300 ${selectedDoctorId === doctor.id ? "bg-[#F5EDED]" : ""}`}
            onClick={() => handleSelectDoctor(doctor.id)}
          >
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-gray-800">{doctor.name}</h3>
              <p className="text-indigo-600">{getSpecialtyName(doctor.specialtyId)}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelectDoctor(doctor.id);
              }}
              className="bg-[#F5EDED] text-black-700 px-4 py-2 rounded-full hover:bg-[#E2DAD6] transition duration-300"
            >
              Seleccionar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctores;
