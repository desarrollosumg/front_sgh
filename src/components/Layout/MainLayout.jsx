import { useState, useEffect } from 'react';
import { FaUser } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import { Link, useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { BsClipboardPlus } from "react-icons/bs";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { FaHeadSideCough } from "react-icons/fa";

export const MainLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [usuario, setUsuario] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('nombre_usuario');
    if (user) {
      setUsuario(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Limpia el localStorage
    setUsuario(''); // Limpia el estado del usuario
    navigate('/'); // Redirige a la página de inicio
  };

  const modules = [
    {
      id: 1,
      icon: <FaUser className="w-6 h-6" />,
      slug: "/usuarios",
      name: "Usuarios"
    },
    {
      id: 2,
      icon: <FaHeadSideCough className="w-6 h-6" />,
      slug: "/paciente",
      name: "Pacientes"
    },
    {
      id: 3,
      icon: <BsClipboardPlus className='w-6 h-6' />,
      slug: "/historialMedico",
      name: "Historial Médico"
    },
    {
      id: 4,
      icon: <FaUserDoctor className='w-6 h-6' />,
      slug: "/PersonalMedico",
      name: "Personal Médico"
    },
    {
      id: 5,
      icon: <IoCalendarNumberSharp className='w-6 h-6' />,
      slug: "/citas",
      name: "Citas"
    },
    {
      id: 6,
      icon: <GiNotebook className='w-6 h-6' />,
      slug: "/bitacora",
      name: "Bitácora"
    },
    {
      id: 7,
      icon: <CiLogout className="w-6 h-6" />,
      slug: "/",
      name: "Cerrar Sesión"
    }
  ];

  return (
    <div className="w-screen h-screen flex">
      <div className={`flex flex-col h-full transition-all duration-300 ${isOpen ? 'w-40' : 'w-16'} bg-[#6482AD]`}>
        <div className="flex items-center justify-between p-2 ml-4 text-white">
          {isOpen && <span className="ml-6">{usuario}</span>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hover:bg-[#6482AD]"
          >
            {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
          <hr className="my-4 border-gray-300" />
        </div>
        {modules.map(module => (
          module.slug === '/' ? (
            <button
              key={module.id}
              onClick={handleLogout}
              className={`w-full flex items-center py-3 transition-all duration-300 ${isOpen ? 'justify-start ml-2' : 'justify-center'} text-white`}
              data-tooltip-id={`module_${module.id}`}
              data-tooltip-content={module.name}
            >
              {module.icon}
              {isOpen && <span className="ml-2">{module.name}</span>}
            </button>
          ) : (
            <Link
              key={module.id}
              to={module.slug}
              className={`w-full flex items-center py-3 transition-all duration-300 ${isOpen ? 'justify-start ml-2' : 'justify-center'} text-white`}
              data-tooltip-id={`module_${module.id}`}
              data-tooltip-content={module.name}
            >
              {module.icon}
              {isOpen && <span className="ml-2">{module.name}</span>}
            </Link>
          )
        ))}
        <Tooltip />
      </div>
      <div className="flex-1 h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
};
