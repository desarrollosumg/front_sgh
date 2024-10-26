import React, { useState } from "react";
import Citas from "../components/Citas";
import Doctores from "../components/Doctores";
import { useNavigate } from "react-router-dom";
import { ArrowBigLeft} from "lucide-react";

function Cita() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-black mb-8">
          Registro de Citas
        </h1>
        <button
           onClick={() => navigate("/citas")}
            className="absolute top-6 right-6 flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <ArrowBigLeft className="h-5 w-5 mr-2" />
            Regresar
          </button>
        <div className="grid md:grid-cols-2 gap-8">
          <Doctores onSelectDoctor={setSelectedDoctor} />
          <Citas selectedDoctor={selectedDoctor} />
        </div>
      </main>
    </div>
  );
}

export default Cita;
