import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Edit, 
  Trash2, 
  Download, 
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Building,
  Loader
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import authService from '../services/authService';
import becaService from '../services/becaService';

const Reportes = () => {
  const navigate = useNavigate();
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [user, setUser] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const userData = authService.getCurrentUser();
    setUser(userData);
  }, []);

  useEffect(() => {
    if (user) {
      loadBecas();
    }
  }, [user]);

  const loadBecas = async () => {
    setLoading(true);
    try {
      let data;
      if (user?.rol === 'auxiliar') {
        data = await becaService.getMisBecas();
      } else {
        data = await becaService.getAll();
      }
      setBecas(data);
    } catch (error) {
      console.error('Error cargando becas:', error);
      setBecas([]);
    } finally {
      setLoading(false);
    }
  };

  const getTipoColor = (tipo) => {
    const colors = {
      beca: 'bg-blue-100 text-blue-600',
      curso: 'bg-green-100 text-green-600',
      pasantia: 'bg-purple-100 text-purple-600',
      intercambio: 'bg-cyan-100 text-cyan-600',
      webinar: 'bg-orange-100 text-orange-600',
      concurso: 'bg-yellow-100 text-yellow-600'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-600';
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

  const canEdit = () => {
    const rol = user?.rol;
    return rol === 'docente' || rol === 'auxiliar';
  };

  // Función para cargar imagen como base64
  const loadImageAsBase64 = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  const generatePDF = async (mes, anio) => {
    setReportLoading(true);

    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

    const becasFiltradas = becas.filter(beca => {
      if (!beca.created_at) return false;
      const fecha = new Date(beca.created_at);
      return (fecha.getMonth() + 1 === mes && fecha.getFullYear() === anio);
    });

    const doc = new jsPDF();

    // CARGAR LOGO UNIVALLE
    const logoUnivalle = await loadImageAsBase64('/logo-univalle.png');

    // Encabezado
    doc.setFillColor(139, 13, 50);
    doc.rect(0, 0, 210, 45, 'F');

    // INSERTAR LOGO
    if (logoUnivalle) {
      doc.addImage(logoUnivalle, 'JPEG', 15, 10, 25, 25);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('UNIVERSIDAD DEL VALLE', 105, 22, { align: 'center' });

    doc.setFontSize(11);
    doc.text('Sistema de Becas - Reporte', 105, 35, { align: 'center' });
    
    // Información
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.text(`Período: ${meses[mes - 1]} de ${anio}`, 20, 65);
    doc.text(`Fecha De Creacion del Reporte: ${new Date().toLocaleDateString('es-ES')}`, 20, 73);
    doc.text(`Total De Becas: ${becasFiltradas.length} becas`, 20, 81);
    
    doc.line(20, 88, 190, 88);
    
    // CARGAR IMÁGENES DE LAS BECAS
    const becasConImagenes = await Promise.all(
      becasFiltradas.map(async (beca) => {
        let imgBase64 = null;
        if (beca.logo) {
          imgBase64 = await loadImageAsBase64(`http://localhost:5000${beca.logo}`);
        }
        return { ...beca, logoBase64: imgBase64 };
      })
    );

    const tableData = becasConImagenes.map(beca => ([
      '',
      beca.titulo || '—',
      getTipoLabel(beca.tipo),
      beca.institucion,
      beca.pais,
      beca.area || '—',
      beca.creador_nombre || beca.creado_por || '—'
    ]));

    // Array para guardar las posiciones de los logos para los enlaces
    const logoPositions = [];

    if (tableData.length > 0) {
      doc.autoTable({
        startY: 95,
        head: [['Logo', 'Título', 'Tipo', 'Institución', 'País', 'Área', 'Creado por']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [139, 13, 50],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          textColor: [60, 60, 60],
          fontSize: 8
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        styles: {
          cellPadding: 3
        },
        didDrawCell: (data) => {
          if (data.column.index === 0 && data.cell.section === 'body') {
            const beca = becasConImagenes[data.row.index];
            if (beca.logoBase64) {
              doc.addImage(
                beca.logoBase64,
                'JPEG',
                data.cell.x + 2,
                data.cell.y + 2,
                10,
                10
              );
            }
            // Guardar la posición de la celda del logo para agregar enlace después
            logoPositions.push({
              beca,
              x: data.cell.x,
              y: data.cell.y,
              w: data.cell.width,
              h: data.cell.height
            });
          }
        },
        columnStyles: {
          0: { cellWidth: 15 }
        }
      });
      
      // AGREGAR ENLACES CLICKEABLES A LOS LOGOS DESPUÉS DE DIBUJAR LA TABLA
      logoPositions.forEach(position => {
        const { beca, x, y, w, h } = position;
        if (beca.link_oficial && beca.link_oficial !== '') {
          doc.link(x, y, w, h, { url: beca.link_oficial });
        }
      });
      
    } else {
      doc.text('No hay becas registradas en este período', 105, 110, { align: 'center' });
    }
    
    // Pie de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Universidad del Valle - Página ${i} de ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
    }
    
    doc.save(`reporte_becas_${meses[mes - 1]}_${anio}.pdf`);
    setReportLoading(false);
    setShowReportModal(false);
  };

  // Filtrar becas
  const filteredBecas = becas.filter(beca => {
    const matchesSearch = beca.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          beca.institucion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          beca.pais?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = !filterTipo || beca.tipo === filterTipo;
    return matchesSearch && matchesTipo;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBecas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBecas.length / itemsPerPage);
  const tipos = ['beca', 'curso', 'pasantia', 'intercambio', 'webinar', 'concurso'];

  const handleEdit = (beca) => {
    navigate(`/dashboard/editar-beca/${beca.id}`);
  };

  const handleDelete = async (beca) => {
    if (window.confirm(`¿Estás seguro de eliminar "${beca.titulo}"?`)) {
      try {
        await becaService.delete(beca.id);
        alert('Beca eliminada exitosamente');
        loadBecas();
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert(error.message || 'Error al eliminar la beca');
      }
    }
  };

  const ReportModal = ({ isOpen, onClose, onGenerate, loading }) => {
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [anio, setAnio] = useState(new Date().getFullYear());
    const mesesLista = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full mx-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-black text-[#8B0D32]">Generar Reporte</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <p className="text-gray-500 text-sm mb-6">Seleccione el período para generar el reporte</p>
          <div className="space-y-4">
            <div>
              <label className="block text-[#8B0D32] text-[10px] font-black uppercase mb-2">Mes</label>
              <select value={mes} onChange={(e) => setMes(parseInt(e.target.value))} className="w-full p-3 border border-gray-200 rounded-xl">
                {mesesLista.map((m, i) => (<option key={i} value={i + 1}>{m}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-[#8B0D32] text-[10px] font-black uppercase mb-2">Año</label>
              <input type="number" value={anio} onChange={(e) => setAnio(parseInt(e.target.value))} className="w-full p-3 border border-gray-200 rounded-xl" min="2000" max="2030" />
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold text-xs">Cancelar</button>
            <button onClick={() => onGenerate(mes, anio)} disabled={loading} className="flex-1 bg-gradient-to-r from-[#8B0D32] to-[#a30046] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Generar PDF
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0D32]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] to-white pt-28 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-black italic text-[#8B0D32] mb-2">Reportes de Becas</h1>
              <p className="text-gray-500 text-sm">
                {user?.rol === 'auxiliar' ? 'Visualiza y gestiona las becas que has creado' : 'Visualiza y gestiona todas las becas registradas en el sistema'}
              </p>
              {user && <p className="text-xs text-gray-400 mt-1">Rol: <span className="capitalize font-bold">{user.rol}</span>{user?.rol === 'auxiliar' && ' (Solo tus becas)'}</p>}
            </div>
            <button onClick={() => setShowReportModal(true)} className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              <FileText className="w-4 h-4" /> Generar Reporte
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Buscar por título, institución o país..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#8B0D32] outline-none" />
            </div>
            <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)} className="px-4 py-3 border border-gray-200 rounded-xl">
              <option value="">Todos los tipos</option>
              {tipos.map(tipo => (<option key={tipo} value={tipo}>{getTipoLabel(tipo)}</option>))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-4 text-[10px] font-black uppercase text-gray-500">Logo</th>
                  <th className="text-left py-4 px-4 text-[10px] font-black uppercase text-gray-500">Título</th>
                  <th className="text-left py-4 px-4 text-[10px] font-black uppercase text-gray-500">Tipo</th>
                  <th className="text-left py-4 px-4 text-[10px] font-black uppercase text-gray-500">Institución</th>
                  <th className="text-left py-4 px-4 text-[10px] font-black uppercase text-gray-500">País</th>
                  <th className="text-left py-4 px-4 text-[10px] font-black uppercase text-gray-500">Área</th>
                  <th className="text-left py-4 px-4 text-[10px] font-black uppercase text-gray-500">Creado por</th>
                  {canEdit() && <th className="text-center py-4 px-4 text-[10px] font-black uppercase text-gray-500">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((beca, index) => (
                  <tr key={beca.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {beca.logo ? (
                        <img 
                          src={`http://localhost:5000${beca.logo}`} 
                          alt="logo" 
                          className="w-8 h-8 rounded-lg object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Building className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4"><p className="font-bold text-sm text-gray-800">{beca.titulo}</p></td>
                    <td className="py-3 px-4"><span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${getTipoColor(beca.tipo)}`}>{getTipoLabel(beca.tipo)}</span></td>
                    <td className="py-3 px-4 text-sm text-gray-600">{beca.institucion}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{beca.pais}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{beca.area || '—'}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{beca.creador_nombre || beca.creado_por || '—'}</td>
                    {canEdit() && (
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(beca)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(beca)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg border disabled:opacity-50">←</button>
              <span className="px-4 py-2 text-sm">Página {currentPage} de {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-lg border disabled:opacity-50">→</button>
            </div>
          )}

          {filteredBecas.length === 0 && (
            <div className="text-center py-20">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">{user?.rol === 'auxiliar' ? 'No has creado ninguna beca aún' : 'No se encontraron becas'}</p>
            </div>
          )}
        </motion.div>
      </div>
      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} onGenerate={generatePDF} loading={reportLoading} />
    </div>
  );
};

export default Reportes;