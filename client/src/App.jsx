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
import ProtectedRoute from './components/ProtectedRoute';

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
              <ProtectedRoute>
                <AnimatedPage>
                  <Dashboard />
                </AnimatedPage>
              </ProtectedRoute>
            } />

            {/* Solo Docente y Auxiliar pueden crear/editar becas */}
            <Route path="/dashboard/formulario-becas" element={
              <ProtectedRoute allowedRoles={['docente', 'auxiliar']}>
                <AnimatedPage>
                  <RegistroBeca />
                </AnimatedPage>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/editar-beca/:id" element={
              <ProtectedRoute allowedRoles={['docente', 'auxiliar']}>
                <AnimatedPage>
                  <EditarBeca />
                </AnimatedPage>
              </ProtectedRoute>
            } />

            {/* Solo Docente (admin) puede agregar auxiliares */}
            <Route path="/dashboard/agregar-auxiliar" element={
              <ProtectedRoute allowedRoles={['docente']}>
                <AnimatedPage>
                  <AgregarAuxiliar />
                </AnimatedPage>
              </ProtectedRoute>
            } />

            {/* Solo Docente y Auxiliar pueden ver reportes */}
            <Route path="/dashboard/reportes" element={
              <ProtectedRoute allowedRoles={['docente', 'auxiliar']}>
                <AnimatedPage>
                  <Reportes />
                </AnimatedPage>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/reportes-premios" element={
              <ProtectedRoute allowedRoles={['docente', 'auxiliar']}>
                <AnimatedPage>
                  <ReportesPremios />
                </AnimatedPage>
              </ProtectedRoute>
            } />

            {/* Accesibles para cualquier usuario logeado (docente, auxiliar, estudiante) */}
            <Route path="/dashboard/convocatorias" element={
              <ProtectedRoute>
                <AnimatedPage>
                  <Convocatorias />
                </AnimatedPage>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/practicas-internacionales" element={
              <ProtectedRoute>
                <AnimatedPage>
                  <PracticasInternacionales />
                </AnimatedPage>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/premios-internacionales" element={
              <ProtectedRoute>
                <AnimatedPage>
                  <PremiosInternacionales />
                </AnimatedPage>
              </ProtectedRoute>
            } />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
