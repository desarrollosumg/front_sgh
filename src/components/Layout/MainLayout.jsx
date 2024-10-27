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
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [modules, setModules] = useState([]);

  const IconComponent = {
    usuarios: <FaUser className="w-6 h-6" />,
    pacientes: <FaHeadSideCough className="w-6 h-6" />,
    historialMedico: <BsClipboardPlus className='w-6 h-6' />,
    personalMedico: <FaUserDoctor className='w-6 h-6' />,
    citas: <IoCalendarNumberSharp className='w-6 h-6' />,
    bitacora: <GiNotebook className='w-6 h-6' />,
    cerrarSesion: <CiLogout className="w-6 h-6" />
  };

  useEffect(() => {
    const user = localStorage.getItem('nombre_usuario');
    const modulos = JSON.parse(localStorage.getItem('modulos') || "[]");
    
    if (user) {
      setUsuario(user);
    }
    if(modules){
      setModules(modulos.map(modulo => {
        const icon = IconComponent[modulo.icono];
        return {
          id: modulo.id,
          icon: icon,
          slug: modulo.ruta,
          name: modulo.nombre
        }
      }));
    }
  }, []);

  return (
    <div className="w-screen h-screen flex">
      <div className={`flex flex-col h-full transition-all duration-300 ${isOpen ? 'w-40' : 'w-16'} bg-[#6482AD]`}>
        <div className="flex items-center justify-between p-2 ml-4 text-white">
          {isOpen && <span className="ml-6">{usuario}</span>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hover:bg-[#6482AD]"
          >
            {isOpen ? <FaChevronLeft onClick={() => navigate("/home")}/> : <FaChevronRight />}
          </button>
          <hr className="my-4 border-gray-300" />
        </div>
        {modules.map(module => (
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
        ))}
        <Tooltip />
      </div>
      <div className="flex-1 h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
};
