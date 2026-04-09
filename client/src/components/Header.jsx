import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Header = ({ onMenuClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = authService.getCurrentUser();
    setUser(userData);
  }, []);

  // Menú según el rol del usuario
  const getMenuItems = () => {
    const role = user?.rol;
    
    if (role === 'docente') {
    return [
      { name: 'Dashboard', icon: '📊', path: '/dashboard' },
      { name: 'Convocatorias', icon: '📅', path: '/dashboard/convocatorias' }, // ← AGREGAR
      { name: 'Agregar Becas', icon: '➕🎓', path: '/dashboard/formulario-becas' },
      { name: 'Agregar Auxiliar', icon: '➕👤', path: '/dashboard/agregar-auxiliar' },
      { name: 'Reportes', icon: '📋', path: '/dashboard/reportes' },
    ];
  }
  
  if (role === 'auxiliar') {
    return [
      { name: 'Dashboard', icon: '📊', path: '/dashboard' },
      { name: 'Convocatorias', icon: '📅', path: '/dashboard/convocatorias' }, // ← AGREGAR
      { name: 'Agregar Becas', icon: '➕🎓', path: '/dashboard/formulario-becas' },
      { name: 'Reportes', icon: '📋', path: '/dashboard/reportes' },
    ];
  }
  
  if (role === 'estudiante') {
    return [
      { name: 'Dashboard', icon: '📊', path: '/dashboard' },
      { name: 'Convocatorias', icon: '📅', path: '/dashboard/convocatorias' }, // ← AGREGAR
    ];
  }
  
  return [
    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    { name: 'Convocatorias', icon: '📅', path: '/dashboard/convocatorias' },
  ];

    
    // Menú por defecto
    return [
      { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    ];
  };

  const menuItems = getMenuItems();

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-white shadow-sm border-b border-gray-100 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* IZQUIERDA: Logo + Link Univalle */}
        <a 
          href="https://www.univalle.edu/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#8B0D32] hover:opacity-70 transition-all no-underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.533 1.533 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.533 1.533 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span className="font-bold text-lg tracking-tight">Ir a Univalle</span>
        </a>

        {/* CENTRO: Hamburguesa Funcional */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col gap-1.5 p-3 hover:bg-[#fff5f5] rounded-2xl transition-all"
        >
          <motion.div animate={isOpen ? { rotate: 45, y: 10 } : { rotate: 0, y: 0 }} className="w-8 h-1 bg-gray-600 rounded-full" />
          <motion.div animate={isOpen ? { opacity: 0 } : { opacity: 1 }} className="w-8 h-1 bg-gray-600 rounded-full" />
          <motion.div animate={isOpen ? { rotate: -45, y: -10 } : { rotate: 0, y: 0 }} className="w-8 h-1 bg-gray-600 rounded-full" />
        </button>

        {/* DERECHA: Información del usuario y SIU */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden md:flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full">
              <div className="w-8 h-8 bg-[#8B0D32] rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.nombre?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-800">{user.nombre}</p>
                <p className="text-[9px] text-gray-500 capitalize">{user.rol}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 text-[#8B0D32] font-black italic text-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>SIU</span>
          </div>
        </div>
      </div>

      {/* DESPLEGABLE HACIA ABAJO */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full bg-white border-t border-gray-100 overflow-hidden shadow-2xl"
          >
            <div className="max-w-[1400px] mx-auto py-8 px-10">
              {/* Información del usuario en móvil */}
              {user && (
                <div className="md:hidden flex items-center gap-3 bg-gray-50 p-4 rounded-2xl mb-6">
                  <div className="w-12 h-12 bg-[#8B0D32] rounded-full flex items-center justify-center text-white text-lg font-bold">
                    {user.nombre?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{user.nombre}</p>
                    <p className="text-[10px] text-gray-500 capitalize">{user.rol}</p>
                    <p className="text-[9px] text-gray-400">{user.email}</p>
                  </div>
                </div>
              )}
              
              <div className={`grid gap-6 ${menuItems.length === 1 ? 'grid-cols-1 md:grid-cols-1 max-w-xs mx-auto' : 'grid-cols-2 md:grid-cols-4'}`}>
                {menuItems.map((item) => (
                  <button 
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className="flex flex-col items-center justify-center p-6 rounded-[35px] hover:bg-[#8B0D32] text-gray-400 hover:text-white transition-all group border border-gray-50 shadow-sm"
                  >
                    <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="font-black uppercase italic tracking-widest text-[11px] text-center">{item.name}</span>
                  </button>
                ))}
                
                <button 
                  onClick={handleLogout}
                  className="flex flex-col items-center justify-center p-6 rounded-[35px] hover:bg-red-500 text-gray-400 hover:text-white transition-all group border border-gray-50"
                >
                  <span className="text-3xl mb-3">🚪</span>
                  <span className="font-black uppercase italic tracking-widest text-[11px]">Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;