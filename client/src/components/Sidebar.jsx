import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  UserPlus,
  FileText,
  ImagePlus,
  LogOut,
  X,
  Trophy
} from 'lucide-react';
import authService from '../services/authService';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const role = user?.rol;

  const getMenuItems = () => {
    const base = [
      { name: 'Inicio', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'Convocatorias', icon: Calendar, path: '/dashboard/convocatorias' },
    ];

    if (role === 'docente') {
      return [
        ...base,
        { name: 'Nueva Beca', icon: PlusCircle, path: '/dashboard/formulario-becas' },
        { name: 'Premios', icon: ImagePlus, path: '/dashboard/premios-internacionales' },
        { name: 'Rep. Premios', icon: Trophy, path: '/dashboard/reportes-premios' },
        { name: 'Auxiliar', icon: UserPlus, path: '/dashboard/agregar-auxiliar' },
        { name: 'Reportes', icon: FileText, path: '/dashboard/reportes' },
      ];
    }

    if (role === 'auxiliar') {
      return [
        ...base,
        { name: 'Nueva Beca', icon: PlusCircle, path: '/dashboard/formulario-becas' },
        { name: 'Premios', icon: ImagePlus, path: '/dashboard/premios-internacionales' },
        { name: 'Rep. Premios', icon: Trophy, path: '/dashboard/reportes-premios' },
        { name: 'Reportes', icon: FileText, path: '/dashboard/reportes' },
      ];
    }

    return base;
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    onClose?.();
  };

  const menuItems = getMenuItems();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-[95] transition-opacity md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 z-[100] h-screen w-32 bg-[#454545] text-white shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col items-center py-5">
          <button
            type="button"
            onClick={onClose}
            className="md:hidden absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
            aria-label="Cerrar menu"
          >
            <X size={16} />
          </button>

          <div className="w-16 h-16 flex items-center justify-center mb-8">
            <img
              src="/logo-univalle.png"
              alt="Logo Univalle"
              className="w-14 h-14 object-contain"
            />
          </div>

          <nav className="w-full flex-1 flex flex-col items-center gap-2 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavigation(item.path)}
                  className={`relative w-full min-h-[48px] rounded-full px-3 py-2 flex flex-col items-center justify-center gap-1 text-[9px] font-bold leading-tight transition-all ${
                    isActive
                      ? 'bg-[#967292] text-white shadow-lg'
                      : 'bg-[#7C7C7C]/60 text-white hover:bg-[#8F808A]'
                  }`}
                >
                  {isActive && (
                    <span className="hidden md:block absolute -right-7 top-1/2 -translate-y-1/2 w-7 h-9 rounded-l-full bg-[#F4F4F4]" />
                  )}
                  <Icon size={15} strokeWidth={2} className="relative z-10" />
                  <span className="relative z-10 text-center">{item.name}</span>
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="w-[calc(100%-24px)] min-h-[48px] rounded-full px-3 py-2 flex flex-col items-center justify-center gap-1 text-[9px] font-bold leading-tight bg-[#666666]/70 hover:bg-[#614B59] transition-all"
          >
            <LogOut size={15} strokeWidth={2} />
            <span>Cerrar</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
