import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header.jsx";
import ModernPieChart from '../components/ModernPieChart';
import MostVisitedBecas from '../components/MostVisitedBecas';
import becaService from '../services/becaService';
import authService from '../services/authService';
import { AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const [stats, setStats] = useState({
    totalBecas: 0,
    becasActivas: 0,
    estudiantesBeneficiados: 0,
    paisesDisponibles: 0
  });
  const [user, setUser] = useState(null);
  const [becasPorTipo, setBecasPorTipo] = useState([]);
  const [masVisitadas, setMasVisitadas] = useState([]);
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar autenticación
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }

    const userData = authService.getCurrentUser();
    setUser(userData);

    // Cargar datos del dashboard
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener estadísticas
      const estadisticas = await becaService.getEstadisticas();
      setStats({
        totalBecas: estadisticas.total_becas || 0,
        becasActivas: estadisticas.becas_activas || 0,
        estudiantesBeneficiados: estadisticas.total_estudiantes || 0,
        paisesDisponibles: estadisticas.paises_disponibles || 0
      });

      // Obtener datos para gráficos
      const graficos = await becaService.getGraficos();
      
      // Transformar datos para el gráfico de pastel
      const coloresMap = {
        beca: '#8B0D32',
        curso: '#a30046',
        pasantia: '#6b0a26',
        intercambio: '#4a071b',
        webinar: '#FF6B6B',
        concurso: '#4ECDC4'
      };
      
      const pieData = (graficos.becasPorTipo || []).map(item => ({
        name: getTipoLabel(item.tipo),
        value: item.cantidad,
        color: coloresMap[item.tipo] || '#8B0D32'
      }));
      
      setBecasPorTipo(pieData);
      setMasVisitadas(graficos.masVisitadas || []);
      
      // Procesar convocatorias
      const convData = (graficos.convocatorias || []).map(conv => ({
        id: conv.id,
        titulo: conv.titulo,
        fecha_cierre: conv.fecha_cierre,
        plazas_disponibles: conv.plazas_disponibles,
        estado: conv.estado || (new Date(conv.fecha_cierre) >= new Date() ? 'activa' : 'proxima')
      }));
      
      setConvocatorias(convData);
      
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      setError('Error al cargar los datos. Por favor, recarga la página.');
      
      // Datos de respaldo en caso de error
      setStats({
        totalBecas: 124,
        becasActivas: 45,
        estudiantesBeneficiados: 892,
        paisesDisponibles: 28
      });
      
      setBecasPorTipo([
        { name: 'Beca', value: 48, color: '#8B0D32' },
        { name: 'Curso', value: 32, color: '#a30046' },
        { name: 'Pasantía', value: 28, color: '#6b0a26' },
        { name: 'Intercambio', value: 16, color: '#4a071b' }
      ]);
      
      setConvocatorias([
        { id: 1, titulo: "Beca Excelencia Académica", fecha_cierre: "2024-12-15", plazas_disponibles: 15, estado: "activa" },
        { id: 2, titulo: "Programa Internacional", fecha_cierre: "2024-12-20", plazas_disponibles: 8, estado: "activa" },
        { id: 3, titulo: "Investigación Doctoral", fecha_cierre: "2024-12-25", plazas_disponibles: 5, estado: "proxima" },
        { id: 4, titulo: "Movilidad Estudiantil", fecha_cierre: "2025-01-10", plazas_disponibles: 20, estado: "proxima" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      beca: 'Beca',
      curso: 'Curso',
      pasantia: 'Pasantía',
      intercambio: 'Intercambio',
      webinar: 'Webinar',
      concurso: 'Concurso'
    };
    return labels[tipo] || tipo;
  };

  const coloresNivel = ['#8B0D32', '#a30046', '#6b0a26', '#4a071b', '#FF6B6B', '#4ECDC4'];

  const StatCard = ({ title, value, color, delay, icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring" }}
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider mb-1">
              {title}
            </p>
            <motion.p 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, type: "spring" }}
              className="text-4xl font-black text-gray-800"
            >
              {value.toLocaleString()}
            </motion.p>
          </div>
          <div className={`bg-gradient-to-br ${color} p-3 rounded-2xl shadow-lg`}>
            <span className="text-white text-xl">{icon}</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B0D32] to-[#a30046]" />
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0D32] mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28">
        <div className="text-center bg-red-50 p-8 rounded-2xl max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 font-bold mb-2">Error</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="mt-4 bg-[#8B0D32] text-white px-4 py-2 rounded-xl text-sm font-bold"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#fff5f5] to-white min-h-screen font-sans w-full overflow-x-hidden">
      <Header />

      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 pt-28 pb-10">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="relative bg-gradient-to-r from-[#8B0D32] via-[#a30046] to-[#6b0a26] rounded-3xl p-8 md:p-12 mb-10 overflow-hidden shadow-2xl"
        >
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white text-2xl">🎓</span>
              <span className="text-white/80 text-xs font-bold uppercase tracking-[0.3em]">
                Sistema Integral de Becas
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white leading-tight">
              INFORMACION DE BECAS
            </h1>
            <p className="text-white/80 mt-4 text-sm max-w-2xl">
              Bienvenido, {user?.nombre || 'Usuario'} ({user?.rol === 'docente' ? 'Docente' : user?.rol === 'auxiliar' ? 'Auxiliar' : 'Estudiante'})
            </p>
          </motion.div>
          
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 45, 0]
            }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" 
          />
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Becas" value={stats.totalBecas} color="from-[#8B0D32] to-[#a30046]" delay={0.1} icon="🏆" />
          <StatCard title="Becas Activas" value={stats.becasActivas} color="from-[#a30046] to-[#6b0a26]" delay={0.2} icon="✅" />
          <StatCard title="Estudiantes" value={stats.estudiantesBeneficiados} color="from-[#6b0a26] to-[#4a071b]" delay={0.3} icon="👥" />
          <StatCard title="Países" value={stats.paisesDisponibles} color="from-[#4a071b] to-[#2d0410]" delay={0.4} icon="🌍" />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
          >
            <ModernPieChart 
              data={becasPorTipo.length > 0 ? becasPorTipo : [
                { name: 'Beca', value: 48 },
                { name: 'Curso', value: 32 },
                { name: 'Pasantía', value: 28 },
                { name: 'Intercambio', value: 16 }
              ]}
              title="Distribución por Tipo de Beca"
              colors={coloresNivel}
            />
          </motion.div>

          <motion.div
            initial="hidden"
            animate={controls}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MostVisitedBecas becas={masVisitadas} />
          </motion.div>
        </div>

        {/* Convocatorias Recientes */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-between items-center mb-6"
          >
            <div>
              <h2 className="text-[#8B0D32] font-black uppercase italic tracking-widest text-[11px] mb-2">
                Convocatorias Activas
              </h2>
              <p className="text-gray-500 text-sm">Gestión de becas disponibles</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard/convocatorias')}  // ← Cambiar esta línea
              className="bg-[#8B0D32] text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg hover:bg-black transition-all"
            >
              Ver todas
            </motion.button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {convocatorias.map((conv, index) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-2xl">📅</span>
                  <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${
                    conv.estado === 'activa' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {conv.estado === 'activa' ? 'Activa' : 'Próxima'}
                  </span>
                </div>
                <h3 className="font-black text-gray-800 text-sm mb-2 line-clamp-2">{conv.titulo}</h3>
                <p className="text-[10px] text-gray-400 mb-3">
                  Cierre: {new Date(conv.fecha_cierre).toLocaleDateString('es-ES')}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-gray-600">
                    Plazas: {conv.plazas_disponibles || 'N/A'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {convocatorias.length === 0 && (
            <div className="text-center py-10 bg-white rounded-2xl">
              <p className="text-gray-400 text-sm">No hay convocatorias activas en este momento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;