// src/components/Layout/MainLayout.jsx
import React, { useState } from 'react';
import { AiOutlineCalendar, AiOutlineEye } from 'react-icons/ai'; // Importar iconos
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const [activeContent, setActiveContent] = useState(''); // Controla el contenido de la segunda sidebar
  const [isSecondSidebarOpen, setIsSecondSidebarOpen] = useState(false); // Controla la visibilidad de la segunda sidebar

  const handleOpenSecondSidebar = (content) => {
    setActiveContent(content);
    setIsSecondSidebarOpen(true);
  };

  const handleCloseSecondSidebar = () => {
    setIsSecondSidebarOpen(false);
  };

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
          {activeContent === 'ver' && (
            <div>
              <h3>Ver Citas</h3>
              <p>Aquí puedes ver todas las citas programadas.</p>
            </div>
          )}
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <main className="content">{children}</main>
    </div>
  );
};

export default MainLayout;
