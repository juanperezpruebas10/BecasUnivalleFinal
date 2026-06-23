import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import ModernPieChart from '../components/ModernPieChart';
import MostVisitedBecas from '../components/MostVisitedBecas';
import PremiosCarousel from '../components/PremiosCarousel';
import becaService from '../services/becaService';
import authService from '../services/authService';
import { getOpportunityType, opportunityChartColors } from '../config/opportunityTypes';
// Importar Ã­conos de Lucide React
import { 
  AlertCircle, 
  Trophy, 
  CheckCircle, 
  Users, 
  Globe,
  Calendar,
  TrendingUp,
  Award,
  BookOpen,
  Briefcase,
  Plane,
  GraduationCap,
  Clock,
  ChevronRight
} from 'lucide-react';

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
    // Verificar autenticaciÃ³n
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
      // Obtener estadÃ­sticas
      const estadisticas = await becaService.getEstadisticas();
      setStats({
        totalBecas: estadisticas.total_becas || 0,
        becasActivas: estadisticas.becas_activas || 0,
        estudiantesBeneficiados: estadisticas.total_estudiantes || 0,
        paisesDisponibles: estadisticas.paises_disponibles || 0
      });

      // Obtener datos para grÃ¡ficos
      const graficos = await becaService.getGraficos();
      
      // Transformar datos para el grÃ¡fico de pastel
      
      const pieData = (graficos.becasPorTipo || []).map(item => ({
        name: getTipoLabel(item.tipo),
        value: item.cantidad,
        color: getOpportunityType(item.tipo).chartColor
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
      setError('Error al cargar los datos. Por favor, recarga la pÃ¡gina.');
      
      // Datos de respaldo en caso de error
      setStats({
        totalBecas: 124,
        becasActivas: 45,
        estudiantesBeneficiados: 892,
        paisesDisponibles: 28
      });
      
      setBecasPorTipo([
        { name: 'Beca', value: 48, color: getOpportunityType('beca').chartColor },
        { name: 'Curso', value: 32, color: getOpportunityType('curso').chartColor },
        { name: 'Pasantía', value: 28, color: getOpportunityType('pasantia').chartColor },
        { name: 'Intercambio', value: 16, color: getOpportunityType('intercambio').chartColor }
      ]);
      
      setConvocatorias([
        { id: 1, titulo: "Beca Excelencia AcadÃ©mica", fecha_cierre: "2024-12-15", plazas_disponibles: 15, estado: "activa" },
        { id: 2, titulo: "Programa Internacional", fecha_cierre: "2024-12-20", plazas_disponibles: 8, estado: "activa" },
        { id: 3, titulo: "InvestigaciÃ³n Doctoral", fecha_cierre: "2024-12-25", plazas_disponibles: 5, estado: "proxima" },
        { id: 4, titulo: "Movilidad Estudiantil", fecha_cierre: "2025-01-10", plazas_disponibles: 20, estado: "proxima" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getTipoLabel = (tipo) => {
    return getOpportunityType(tipo).label;
  };

  const coloresNivel = opportunityChartColors;

  // Componente StatCard mejorado con Ã­conos profesionales
  const StatCard = ({ title, value, color, delay, icon: IconComponent }) => (
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
            <IconComponent size={24} strokeWidth={1.5} className="text-white" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#967292] to-[#9C7A98]" />
    </motion.div>
  );

  // Componente para el Ã­cono segÃºn tipo de beca
  const getBecaIcon = (tipo) => {
    const icons = {
      'Beca': Award,
      'Curso': BookOpen,
      'PasantÃ­a': Briefcase,
      'Intercambio': Plane,
      'Webinar': TrendingUp,
      'Concurso': Trophy
    };
    const Icon = icons[tipo] || GraduationCap;
    return <Icon size={20} strokeWidth={1.5} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#967292] mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-8">
        <div className="text-center bg-red-50 p-8 rounded-2xl max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 font-bold mb-2">Error</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="mt-4 bg-[#967292] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#614B59] transition-all"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-surface min-h-screen font-sans w-full overflow-x-hidden">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 pt-8 pb-10">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="relative bg-gradient-to-r from-[#967292] via-[#9C7A98] to-[#614B59] rounded-3xl p-8 md:p-12 mb-10 overflow-hidden shadow-2xl"
        >
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap size={24} strokeWidth={1.5} className="text-white" />
              <span className="text-white/80 text-xs font-bold uppercase tracking-[0.3em]">
                Sistema Integral de Becas
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white leading-tight">
              INFORMACIÓN DE OPORTUNIDADES
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

        <div className="mb-10 space-y-6">
          <PremiosCarousel ambito="internacional" />
          <PremiosCarousel ambito="nacional" />
        </div>

        {/* Stats Cards con Ã­conos profesionales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Becas" value={stats.totalBecas} color="from-[#967292] to-[#9C7A98]" delay={0.1} icon={Trophy} />
          <StatCard title="Premios Totales" value={stats.estudiantesBeneficiados} color="from-[#614B59] to-[#6A5663]" delay={0.3} icon={Users} />
          <StatCard title="Total Países de Convenio" value={stats.paisesDisponibles} color="from-[#6A5663] to-[#454545]" delay={0.4} icon={Globe} />
        </div>

        {/* GrÃ¡ficos */}
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
                { name: 'PasantÃ­a', value: 28 },
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
              <h2 className="text-[#967292] font-black uppercase italic tracking-widest text-[11px] mb-2">
                Total Convocatorias 
              </h2>
              <p className="text-gray-500 text-sm">Gestión de becas disponibles</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard/convocatorias')}
              className="bg-[#967292] text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg hover:bg-[#614B59] transition-all flex items-center gap-2"
            >
              Ver todas
              <ChevronRight size={14} strokeWidth={2} />
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
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all"
                onClick={() => navigate(`/dashboard/convocatorias/${conv.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <Calendar size={24} strokeWidth={1.5} className="text-[#967292]" />
                  <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${
                    conv.estado === 'activa' 
                      ? 'bg-[#AF93AC]/30 text-[#614B59]' 
                      : 'bg-[#B59BB2]/35 text-[#614B59]'
                  }`}>
                    {conv.estado === 'activa' ? 'Activa' : 'Próxima'} 
                  </span>
                </div>
                <h3 className="font-black text-gray-800 text-sm mb-2 line-clamp-2">{conv.titulo}</h3>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-3">
                  <Clock size={12} strokeWidth={1.5} />
                  <span>Cierre: {new Date(conv.fecha_cierre).toLocaleDateString('es-ES')}</span>
                </div>
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
              <Calendar size={48} strokeWidth={1} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No hay convocatorias activas en este momento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
