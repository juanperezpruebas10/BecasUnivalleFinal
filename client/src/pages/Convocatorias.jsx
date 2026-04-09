import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Search, 
  ExternalLink,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Globe,
  BookOpen,
  Video,
  Trophy,
  Eye,
  Building  // ← Asegúrate de tener Building importado
} from 'lucide-react';
import Header from '../components/Header';
import becaService from '../services/becaService';
import authService from '../services/authService';


const Convocatorias = () => {
  const navigate = useNavigate();
  const [convocatorias, setConvocatorias] = useState([]);
  const [filteredConvocatorias, setFilteredConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null);
  const itemsPerPage = 12;

  // Tipos de becas
  const tipos = [
    { value: 'beca', label: '🎓 Beca', icon: GraduationCap },
    { value: 'curso', label: '📚 Curso', icon: BookOpen },
    { value: 'pasantia', label: '💼 Pasantía', icon: Briefcase },
    { value: 'intercambio', label: '🌍 Intercambio', icon: Globe },
    { value: 'webinar', label: '🎥 Webinar', icon: Video },
    { value: 'concurso', label: '🏆 Concurso', icon: Trophy }
  ];

  const estados = [
    { value: 'activa', label: 'Activas' },
    { value: 'vencida', label: 'Vencidas' }
  ];

  useEffect(() => {
    const userData = authService.getCurrentUser();
    setUser(userData);
    loadConvocatorias();
  }, []);

  useEffect(() => {
    filterConvocatorias();
  }, [searchTerm, filterTipo, filterEstado, convocatorias]);

  const loadConvocatorias = async () => {
  setLoading(true);
  try {
    // Simplemente obtener todas las becas - el backend ya maneja qué mostrar según el rol
    const data = await becaService.getAll();
    
    const convData = data.map(conv => ({
      ...conv,
      estado: getEstadoBeca(conv.fecha_cierre),
      diasRestantes: getDiasRestantes(conv.fecha_cierre)
    }));
    setConvocatorias(convData);
    setFilteredConvocatorias(convData);
  } catch (error) {
    console.error('Error cargando convocatorias:', error);
  } finally {
    setLoading(false);
  }
};

  const getEstadoBeca = (fechaCierre) => {
    const hoy = new Date();
    const cierre = new Date(fechaCierre);
    if (cierre >= hoy) return 'activa';
    return 'vencida';
  };

  const getDiasRestantes = (fechaCierre) => {
    const hoy = new Date();
    const cierre = new Date(fechaCierre);
    const diffTime = cierre - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filterConvocatorias = () => {
    let filtered = [...convocatorias];
    
    if (searchTerm) {
      filtered = filtered.filter(conv =>
        conv.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.institucion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.pais?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.area?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterTipo) {
      filtered = filtered.filter(conv => conv.tipo === filterTipo);
    }
    
    if (filterEstado) {
      filtered = filtered.filter(conv => conv.estado === filterEstado);
    }
    
    setFilteredConvocatorias(filtered);
    setCurrentPage(1);
  };

  // ✅ FUNCIÓN MODIFICADA - Solo estudiantes cuentan visitas
const handleCardClick = async (beca) => {
  if (beca.link_oficial) {
    // Solo registrar visita si es estudiante
    if (user?.rol === 'estudiante') {
      try {
        await becaService.getById(beca.id);
        console.log(`📊 Visita registrada para: ${beca.titulo}`);
      } catch (error) {
        console.error('Error registrando visita:', error);
      }
    } else {
      console.log(`👁️ Visualización sin conteo: ${beca.titulo} (${user?.rol})`);
    }
    // Abrir el enlace en nueva pestaña
    window.open(beca.link_oficial, '_blank');
  } else {
    alert('Esta beca no tiene enlace disponible');
  }
};

  const getTipoIcon = (tipo) => {
    const icons = {
      beca: '🎓',
      curso: '📚',
      pasantia: '💼',
      intercambio: '🌍',
      webinar: '🎥',
      concurso: '🏆'
    };
    return icons[tipo] || '📖';
  };

  const getTipoColor = (tipo) => {
    const colors = {
      beca: 'from-blue-500 to-blue-600',
      curso: 'from-green-500 to-green-600',
      pasantia: 'from-purple-500 to-purple-600',
      intercambio: 'from-cyan-500 to-cyan-600',
      webinar: 'from-orange-500 to-orange-600',
      concurso: 'from-yellow-500 to-yellow-600'
    };
    return colors[tipo] || 'from-gray-500 to-gray-600';
  };

  const getEstadoColor = (estado) => {
    if (estado === 'activa') return 'bg-green-100 text-green-600';
    return 'bg-red-100 text-red-600';
  };

  const getEstadoLabel = (estado) => {
    if (estado === 'activa') return 'Activa';
    return 'Vencida';
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredConvocatorias.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredConvocatorias.length / itemsPerPage);

  const ConvocatoriaCard = ({ beca }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -8, scale: 1.02 }}
    onClick={() => handleCardClick(beca)}
    className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer transition-all hover:shadow-2xl"
  >
    {/* Header con tipo y estado */}
    <div className={`bg-gradient-to-r ${getTipoColor(beca.tipo)} p-4 text-white`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getTipoIcon(beca.tipo)}</span>
          <span className="text-xs font-black uppercase">
            {tipos.find(t => t.value === beca.tipo)?.label || beca.tipo}
          </span>
        </div>
        <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${getEstadoColor(beca.estado)} bg-white/90`}>
          {getEstadoLabel(beca.estado)}
        </span>
      </div>
    </div>
    
    {/* Contenido */}
    <div className="p-5">
      {/* LOGO DE LA INSTITUCIÓN */}
      <div className="flex justify-center mb-4">
        {beca.logo ? (
          <img 
            src={`http://localhost:5000${beca.logo}`} 
            alt="logo" 
            className="w-16 h-16 rounded-xl object-contain bg-white p-2 shadow-sm"
            onError={(e) => { 
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="2" y="3" width="20" height="14" rx="2" ry="2"%3E%3C/rect%3E%3Cline x1="8" y1="21" x2="16" y2="21"%3E%3C/line%3E%3Cline x1="12" y1="17" x2="12" y2="21"%3E%3C/line%3E%3C/svg%3E';
            }}
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
            <Building className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
      
      <h3 className="font-black text-gray-800 text-base mb-2 line-clamp-2 text-center">
        {beca.titulo}
      </h3>
      
      <div className="space-y-2 mb-4">
        <p className="text-xs text-gray-500 flex items-center gap-1 justify-center">
          <span>🏛️</span> {beca.institucion}
        </p>
        <p className="text-xs text-gray-500 flex items-center gap-1 justify-center">
          <span>📍</span> {beca.pais}
        </p>
        {beca.area && (
          <p className="text-xs text-gray-500 flex items-center gap-1 justify-center">
            <span>📚</span> {beca.area}
          </p>
        )}
      </div>
      
      {/* Fechas y plazas */}
      <div className="border-t border-gray-100 pt-3 mt-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Cierre: {new Date(beca.fecha_cierre).toLocaleDateString('es-ES')}</span>
          </div>
          {beca.diasRestantes > 0 && beca.estado === 'activa' && (
            <span className="text-[9px] font-bold text-green-500">
              {beca.diasRestantes} días
            </span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-gray-600">
              🎯 Plazas: {beca.plazas_disponibles || 'N/A'}
            </span>
            <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {beca.visitas || 0}
            </span>
          </div>
          <span className="text-[9px] font-bold text-[#8B0D32] flex items-center gap-1">
            Ver más <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  </motion.div>
  );

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-28">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0D32] mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando convocatorias...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] to-white pt-28 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-black italic text-[#8B0D32] mb-2">
              Convocatorias Activas
            </h1>
            <p className="text-gray-500 text-sm">
              Explora todas las becas, cursos y oportunidades disponibles
            </p>
          </motion.div>

          {/* Filtros */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por título, institución, país o área..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#8B0D32] outline-none transition-all"
                />
              </div>
              
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:border-[#8B0D32] outline-none transition-all"
              >
                <option value="">Todos los tipos</option>
                {tipos.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                ))}
              </select>
              
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:border-[#8B0D32] outline-none transition-all"
              >
                <option value="">Todos los estados</option>
                {estados.map(estado => (
                  <option key={estado.value} value={estado.value}>{estado.label}</option>
                ))}
              </select>
              
              {(searchTerm || filterTipo || filterEstado) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterTipo('');
                    setFilterEstado('');
                  }}
                  className="px-4 py-3 text-[#8B0D32] font-bold text-xs uppercase tracking-wider hover:bg-gray-50 rounded-xl transition-all"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              Mostrando {currentItems.length} de {filteredConvocatorias.length} convocatorias
            </div>
          </motion.div>

          {/* Grid de convocatorias */}
          {currentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentItems.map((beca, index) => (
                <ConvocatoriaCard key={beca.id} beca={beca} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">No se encontraron convocatorias</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterTipo('');
                  setFilterEstado('');
                }}
                className="mt-4 text-[#8B0D32] font-bold text-sm"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Convocatorias;