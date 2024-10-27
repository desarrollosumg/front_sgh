import React from "react";
import {
  Calendar,
  ClipboardList,
  Users,
  AlertCircle,
  Clock,
  Phone,
  Mail,
} from "lucide-react";
import { MainLayout } from "../components/Layout/MainLayout";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <MainLayout>
      <div className="space-y-16">
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-blue-600/90 rounded-3xl" />
          <div
            className="relative h-[400px] rounded-3xl overflow-hidden flex items-center"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="container mx-auto px-6">
              <div className="max-w-2xl text-white">
                <h1 className="text-5xl font-bold mb-6">
                  Sistema de Gestion Hospitalario
                </h1>
                <p className="text-xl mb-8">
                  Gestión eficiente de citas médicas, registros de pacientes y
                  administración hospitalaria.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 800, behavior: "smooth" });
                      navigate("/citas");
                    }}
                    className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-indigo-50 transition duration-300"
                  >
                    Gestionar Citas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Acceso Rápido
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Calendar className="w-8 h-8 text-indigo-600" />,
                title: "Gestión de Citas",
                description:
                  "Administre las citas médicas, horarios y disponibilidad de especialistas.",
                navigateTo: "/citas",
              },
              {
                icon: <Users className="w-8 h-8 text-indigo-600" />,
                title: "Registro de Pacientes",
                description:
                  "Acceda y gestione la información de los pacientes y sus historiales médicos.",
                  navigateTo: "/paciente",
              },
              {
                icon: <ClipboardList className="w-8 h-8 text-indigo-600" />,
                title: "Consulta de Historial Médico",
                description:
                  "Consulte el Historial médico de sus pacientes.",
                  navigateTo: "/historialMedico",
              },
            ].map((feature, index) => (
              <div
                key={index}
                onClick={() => {
                  if (feature.navigateTo) {
                    navigate(feature.navigateTo);
                  }
                }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="container mx-auto px-4">
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Información Importante
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">
                    Protocolos de Seguridad
                  </h3>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>
                        Verificación de identidad obligatoria para acceso al
                        sistema
                      </span>
                    </li>
                    <li className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>
                        Registro de todas las acciones realizadas en el sistema
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">
                    Horarios de Atención
                  </h3>
                  <div className="space-y-2 text-green-700">
                    <p className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Lunes a Viernes: 7:00 AM - 9:00 PM</span>
                    </p>
                    <p className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Sábados: 8:00 AM - 2:00 PM</span>
                    </p>
                    <p className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Emergencias: Atención 24/7</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-purple-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">
                    Recordatorios del Sistema
                  </h3>
                  <ul className="space-y-2 text-purple-700">
                    <li className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>
                        Actualizar la información del paciente en cada visita
                      </span>
                    </li>
                    <li className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>
                        Verificar la disponibilidad del médico antes de agendar
                      </span>
                    </li>
                    <li className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Confirmar datos de contacto del paciente</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-orange-800 mb-3">
                    Contacto de Soporte Técnico
                  </h3>
                  <div className="space-y-2 text-orange-700">
                    <p className="flex items-center">
                      <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Teléfono: (502) 2282-6709</span>
                    </p>
                    <p className="flex items-center">
                      <Mail className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Email: soporte@sgh.com</span>
                    </p>
                    <p className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Disponible: Lun-Vie 8:00 AM - 6:00 PM</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;
