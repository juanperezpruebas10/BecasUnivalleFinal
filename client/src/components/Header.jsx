import React, { useEffect, useState } from 'react';
import { Menu, GraduationCap } from 'lucide-react';
import authService from '../services/authService';

const Header = ({ onMenuClick }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  return (
    <header className="fixed top-0 left-0 md:left-32 right-0 z-[90] h-[70px] bg-[#454545] text-white shadow-md">
      <div className="h-full px-4 md:px-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden w-11 h-11 rounded-full bg-[#967292] text-white flex items-center justify-center shadow-lg"
          aria-label="Abrir menu"
        >
          <Menu size={22} strokeWidth={2} />
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-sm md:text-xl font-black uppercase tracking-tight">
            Sistema Integral de Becas
          </h1>
          <p className="mt-1 text-[10px] md:text-xs text-white/75">
            {user ? `${user.nombre || 'Usuario'} - ${user.rol || 'Rol'}` : 'Universidad Privada del Valle'}
          </p>
        </div>

        <div className="hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[#B59BB2]">
          <GraduationCap size={24} strokeWidth={1.8} />
        </div>
      </div>
    </header>
  );
};

export default Header;
