import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegistroBeca from './pages/RegistroBeca';
import AgregarAuxiliar from './pages/AgregarAuxiliar';
import Reportes from './pages/Reportes';
import Convocatorias from './pages/Convocatorias'; // ← IMPORTAR
import AnimatedPage from './components/AnimatedPage';
import EditarBeca from './pages/EditarBeca';
import PracticasInternacionales from './pages/PracticasInternacionales';
import PremiosInternacionales from './pages/PremiosInternacionales';
import ReportesPremios from './pages/ReportesPremios';

function App() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoginPage = location.pathname === '/';

  return (
    <div className={`min-h-screen flex flex-col ${isLoginPage ? 'bg-white' : 'bg-[#F4F4F4]'} overflow-x-hidden`}>
      
      {!isLoginPage && (
        <Header 
          onMenuClick={() => setMenuOpen(!menuOpen)} 
          isMenuOpen={menuOpen} 
          showMenuButton={true} 
        />
      )}

      {!isLoginPage && (
        <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      )}
      
      <main className={`flex-1 ${isLoginPage ? '' : 'pt-[70px] md:pl-32'}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={
              <AnimatedPage>
                <Dashboard />
              </AnimatedPage>
            } />
            <Route path="/dashboard/formulario-becas" element={
              <AnimatedPage>
                <RegistroBeca />
              </AnimatedPage>
            } />
            <Route path="/dashboard/agregar-auxiliar" element={
              <AnimatedPage>
                <AgregarAuxiliar />
              </AnimatedPage>
            } />
            <Route path="/dashboard/reportes" element={
              <AnimatedPage>
                <Reportes />
              </AnimatedPage>
            } />
            <Route path="/dashboard/reportes-premios" element={
              <AnimatedPage>
                <ReportesPremios />
              </AnimatedPage>
            } />
            {/* NUEVA RUTA PARA CONVOCATORIAS */}
            <Route path="/dashboard/convocatorias" element={
              <AnimatedPage>
                <Convocatorias />
              </AnimatedPage>
            } />
            <Route path="/dashboard/editar-beca/:id" element={
              <AnimatedPage>
                <EditarBeca />
              </AnimatedPage>
            } />
            <Route path="/dashboard/practicas-internacionales" element={
              <AnimatedPage>
                <PracticasInternacionales />
              </AnimatedPage>
            } />
            <Route path="/dashboard/premios-internacionales" element={
              <AnimatedPage>
                <PremiosInternacionales />
              </AnimatedPage>
            } />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
