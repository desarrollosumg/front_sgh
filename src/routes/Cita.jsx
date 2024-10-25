import React, { useState } from "react";
import Citas from "../components/Citas";
import Doctores from "../components/Doctores";

function Cita() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-black mb-8">
          Registro de Citas
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          <Doctores onSelectDoctor={setSelectedDoctor} />
          <Citas selectedDoctor={selectedDoctor} />
        </div>
      </main>
    </div>
  );
}

export default Cita;
