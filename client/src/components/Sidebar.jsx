import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const role = user?.rol;

  // EFECTO PARA CERRAR AL HACER SCROLL
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen, onClose]);

  // Menú según el rol del usuario
  const getMenuItems = () => {
    // Menú para ADMIN (docente)
    if (role === 'docente') {
      return [
        { name: 'Dashboard', icon: '📊', path: '/dashboard' },
        { name: 'Convocatorias', icon: '📅', path: '/dashboard/convocatorias' },
        { name: 'Nueva Beca', icon: '➕', path: '/dashboard/formulario-becas' },
        { name: 'Agregar Auxiliar', icon: '👤', path: '/dashboard/agregar-auxiliar' },
        { name: 'Reportes', icon: '📑', path: '/dashboard/reportes' },
        { name: 'Cerrar Sesión', icon: '🚪', path: '/' },
      ];
    }
    
    // Menú para AUXILIAR
    if (role === 'auxiliar') {
      return [
        { name: 'Dashboard', icon: '📊', path: '/dashboard' },
        { name: 'Convocatorias', icon: '📅', path: '/dashboard/convocatorias' },
        { name: 'Nueva Beca', icon: '➕', path: '/dashboard/formulario-becas' },
        { name: 'Reportes', icon: '📑', path: '/dashboard/reportes' },
        { name: 'Cerrar Sesión', icon: '🚪', path: '/' },
      ];
    }
    
    // Menú para ESTUDIANTE
    if (role === 'estudiante') {
      return [
        { name: 'Dashboard', icon: '📊', path: '/dashboard' },
        { name: 'Convocatorias', icon: '📅', path: '/dashboard/convocatorias' },
        { name: 'Cerrar Sesión', icon: '🚪', path: '/' },
      ];
    }
    
    // Menú por defecto
    return [
      { name: 'Dashboard', icon: '📊', path: '/dashboard' },
      { name: 'Convocatorias', icon: '📅', path: '/dashboard/convocatorias' },
      { name: 'Cerrar Sesión', icon: '🚪', path: '/' },
    ];
  };

  const menuItems = getMenuItems();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay sutil */}
      <div 
        className={`fixed inset-0 bg-black/5 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Menú Desplegable Horizontal */}
      <nav className={`fixed top-[88px] left-0 w-full bg-white shadow-md z-50 border-b border-gray-200 transform transition-all duration-300 ease-out ${
        isOpen 
          ? 'translate-y-0 opacity-100 visible' 
          : '-translate-y-4 opacity-0 invisible'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between flex-wrap gap-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const isLogout = item.name === 'Cerrar Sesión';
            
            return (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 border ${
                  isActive 
                    ? 'bg-[#a30046] text-white border-[#a30046] shadow-sm' 
                    : 'bg-white text-gray-600 border-transparent hover:border-[#a30046] hover:text-[#a30046]'
                } ${isLogout ? 'hover:bg-red-50 hover:text-red-600' : ''}`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;