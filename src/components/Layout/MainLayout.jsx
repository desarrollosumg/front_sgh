// src/components/Layout/MainLayout.jsx
import React, { useState } from 'react';
import { AiOutlineCalendar, AiOutlineEye } from 'react-icons/ai'; // Iconos para citas
import { Tooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';
import { FaUserMd } from 'react-icons/fa';
import { IoIosExit } from 'react-icons/io';
import './MainLayout.css';

export const MainLayout = ({ children }) => {
  const [activeContent, setActiveContent] = useState(''); // Controla el contenido de la segunda sidebar
  const [isSecondSidebarOpen, setIsSecondSidebarOpen] = useState(false); // Controla la visibilidad de la segunda sidebar

  const handleOpenSecondSidebar = (content) => {
    setActiveContent(content);
    setIsSecondSidebarOpen(true);
  };

  const handleCloseSecondSidebar = () => {
    setIsSecondSidebarOpen(false);
  };

  const modules = [
    {
      id: 1,
      icon: <FaUserMd />,
      slug: '/user',
      name: 'Usuarios'
    },
    {
      id: 2,
      icon: <IoIosExit />,
      slug: '/',
      name: 'Cerrar Sesión'
    }
  ];

  return (
    <div className="layout">
      {/* Sidebar Principal */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Citas</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <button
                className="sidebar-button"
                onClick={() => handleOpenSecondSidebar('programar')}
              >
                <AiOutlineCalendar size={24} /> {/* Icono Programar Citas */}
              </button>
            </li>
            <li>
              <button
                className="sidebar-button"
                onClick={() => handleOpenSecondSidebar('ver')}
              >
                <AiOutlineEye size={24} /> {/* Icono Ver Citas */}
              </button>
            </li>
          </ul>
        </nav>

        {/* Módulos con iconos */}
        <div className="modules">
          {modules.map((module) => (
            <Link key={module.id} to={module.slug}>
              <div
                className="module-icon"
                data-tooltip-id={`module_${module.id}`}
                data-tooltip-content={module.name}
              >
                {module.icon}
              </div>
              <Tooltip id={`module_${module.id}`} />
            </Link>
          ))}
        </div>
      </aside>

      {/* Segunda Sidebar Desplegable */}
      <aside className={`second-sidebar ${isSecondSidebarOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={handleCloseSecondSidebar}>
          Cerrar
        </button>
        <div className="sidebar-content">
          {activeContent === 'programar' && (
            <div>
              <h3>Programar Citas</h3>
              <p>Aquí puedes programar una nueva cita.</p>
            </div>
          )}
  
