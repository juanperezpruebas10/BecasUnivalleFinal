import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Trophy, Loader } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import authService from '../services/authService';
import premioService from '../services/premioService';
import API_URL from '../config/api';

const API_BASE = API_URL.replace('/api', '');

const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const ReportesPremios = () => {
  const [premios, setPremios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());

  useEffect(() => { loadPremios(); }, []);

  const loadPremios = async () => {
    setLoading(true);
    try { setPremios(await premioService.getAll()); }
    catch { setPremios([]); }
    finally { setLoading(false); }
  };

  const loadImageAsBase64 = (url) => new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), 4000);
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      clearTimeout(timer);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } catch { resolve(null); }
    };
    img.onerror = () => { clearTimeout(timer); resolve(null); };
    img.src = url;
  });

  const generatePDF = async () => {
    setReportLoading(true);
    try {
      // Filtrar por mes y año usando la fecha del premio, o created_at si no tiene fecha
      const filtrados = premios.filter(p => {
        const raw = p.fecha || p.created_at;
        if (!raw) return false;
        const d = new Date(raw);
        return d.getUTCMonth() + 1 === mes && d.getUTCFullYear() === anio;
      });

      const doc = new jsPDF();

      // ── Encabezado ──────────────────────────────────────────────────
      doc.setFillColor(150, 114, 146);
      doc.rect(0, 0, 210, 45, 'F');

      const logoUnivalle = await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width; canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#967292';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.onerror = () => resolve(null);
        img.src = '/logo-univalle.png';
      });
      if (logoUnivalle) doc.addImage(logoUnivalle, 'JPEG', 15, 8, 27, 27);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18); doc.setFont('helvetica', 'bold');
      doc.text('UNIVERSIDAD PRIVADA DEL VALLE', 105, 22, { align: 'center' });
      doc.setFontSize(11);
      doc.text('Sistema de Becas – Reporte de Premios', 105, 35, { align: 'center' });

      // ── Info ─────────────────────────────────────────────────────────
      doc.setTextColor(80, 80, 80); doc.setFontSize(10);
      doc.text(`Período: ${meses[mes - 1]} de ${anio}`, 20, 60);
      doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 20, 68);
      doc.text(`Total de premios: ${filtrados.length}`, 20, 76);
      doc.line(20, 82, 190, 82);

      if (filtrados.length === 0) {
        doc.setFontSize(11); doc.setTextColor(120, 120, 120);
        doc.text('No hay premios registrados en este período.', 105, 105, { align: 'center' });
      } else {
        // Cargar imágenes
        const premiosConImg = await Promise.all(filtrados.map(async (p) => ({
          ...p,
          imgBase64: p.imagen ? await loadImageAsBase64(`${API_BASE}${p.imagen}`) : null
        })));

        const tableData = premiosConImg.map(p => ([
          '',
          p.titulo || '—',
          p.ambito === 'internacional' ? 'Internacional' : 'Nacional',
          p.carrera || '—',
          p.miembros || '—',
          p.fecha ? new Date(p.fecha).toLocaleDateString('es-ES') : '—',
        ]));

        doc.autoTable({
          startY: 90,
          head: [['Img', 'Título', 'Ámbito', 'Carrera', 'Miembros', 'Fecha']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [150, 114, 146], textColor: [255,255,255], fontStyle: 'bold', halign: 'center' },
          bodyStyles: { textColor: [60,60,60], fontSize: 8 },
          alternateRowStyles: { fillColor: [245,245,245] },
          styles: { cellPadding: 3 },
          willDrawCell: (data) => {
            // Título en azul si tiene link
            if (data.column.index === 1 && data.cell.section === 'body') {
              const p = premiosConImg[data.row.index];
              if (p && p.link) data.cell.styles.textColor = [0, 102, 204];
            }
          },
          didDrawCell: (data) => {
            if (data.cell.section !== 'body') return;
            const p = premiosConImg[data.row.index];
            if (!p) return;

            // Logo en columna 0
            if (data.column.index === 0 && p.imgBase64) {
              const size = Math.min(data.cell.width - 4, data.cell.height - 4, 12);
              doc.addImage(p.imgBase64, 'JPEG',
                data.cell.x + (data.cell.width - size) / 2,
                data.cell.y + (data.cell.height - size) / 2,
                size, size
              );
            }

            // Link clicable en imagen
            if (data.column.index === 0 && p.link) {
              doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: p.link });
            }
          },
          columnStyles: {
            0: { cellWidth: 14 },
            1: { cellWidth: 52 },
            4: { cellWidth: 35 },
          }
        });

        // Pie de página
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8); doc.setTextColor(150,150,150);
          doc.text(`Universidad Privada del Valle – Página ${i} de ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
        }
      }

      doc.save(`reporte_premios_${meses[mes - 1]}_${anio}.pdf`);
      setShowModal(false);
    } catch (err) {
      console.error('Error generando PDF de premios:', err);
      alert('Error al generar el reporte.');
    } finally {
      setReportLoading(false);
    }
  };

  // Agrupar por ámbito para la tabla
  const internacionales = premios.filter(p => p.ambito === 'internacional');
  const nacionales = premios.filter(p => p.ambito === 'nacional');

  return (
    <div className="min-h-screen page-surface py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
          className="bg-gradient-to-r from-[#967292] via-[#9C7A98] to-[#614B59] rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Trophy size={24} className="text-white" strokeWidth={1.5} />
                <span className="text-white/80 text-xs font-black uppercase tracking-[0.3em]">Universidad Privada del Valle</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black italic text-white uppercase">Reportes de Premios</h1>
              <p className="text-white/70 text-sm mt-2">Exporta reconocimientos en PDF por período.</p>
            </div>
            <button onClick={() => setShowModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all">
              <Download size={16} /> Generar PDF
            </button>
          </div>
        </motion.div>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Premios', value: premios.length, color: 'from-[#967292] to-[#9C7A98]' },
            { label: 'Internacionales', value: internacionales.length, color: 'from-[#614B59] to-[#967292]' },
            { label: 'Nacionales', value: nacionales.length, color: 'from-[#9C7A98] to-[#B59BB2]' },
          ].map(card => (
            <motion.div key={card.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider mb-1">{card.label}</p>
              <p className={`text-4xl font-black bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabla de premios */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
          className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-[#967292] font-black uppercase italic tracking-widest text-[11px] mb-6">Todos los Premios</h3>
          {loading ? (
            <div className="flex justify-center py-10"><Loader className="animate-spin text-[#967292]" size={32} /></div>
          ) : premios.length === 0 ? (
            <p className="text-gray-400 text-center py-10 text-sm">No hay premios registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    {['Título','Ámbito','Carrera','Miembros','Fecha','Link'].map(h => (
                      <th key={h} className="text-left py-3 px-3 text-[10px] font-black uppercase text-[#967292] tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {premios.map((p, i) => (
                    <tr key={p.id} className={`border-b border-gray-50 hover:bg-[#F9F5F9] transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                      <td className="py-3 px-3 font-bold text-gray-800 max-w-[200px]">
                        <div className="line-clamp-2">{p.titulo}</div>
                        <div className="text-[10px] text-[#967292] mt-0.5">{p.premio}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${
                          p.ambito === 'internacional' ? 'bg-[#614B59]/15 text-[#614B59]' : 'bg-[#967292]/15 text-[#967292]'
                        }`}>{p.ambito === 'internacional' ? 'Internacional' : 'Nacional'}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-600 text-xs">{p.carrera}</td>
                      <td className="py-3 px-3 text-gray-500 text-xs max-w-[150px]">
                        <div className="line-clamp-2">{p.miembros}</div>
                      </td>
                      <td className="py-3 px-3 text-gray-500 text-xs whitespace-nowrap">
                        {p.fecha ? new Date(p.fecha).toLocaleDateString('es-ES') : '—'}
                      </td>
                      <td className="py-3 px-3">
                        {p.link ? (
                          <a href={p.link} target="_blank" rel="noopener noreferrer"
                            className="text-[#967292] text-xs font-bold hover:underline">Ver</a>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal Generar PDF */}
      {showModal && (
        <div className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center p-4">
          <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
            className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-sm">
            <h3 className="text-xl font-black text-gray-800 mb-2">Generar Reporte</h3>
            <p className="text-gray-500 text-sm mb-6">Seleccione el período</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-[#967292] text-[10px] font-black uppercase tracking-widest block mb-1">Mes</label>
                <select value={mes} onChange={e => setMes(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm">
                  {meses.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[#967292] text-[10px] font-black uppercase tracking-widest block mb-1">Año</label>
                <input type="number" value={anio} onChange={e => setAnio(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm" min="2020" max="2030" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-500 font-black text-xs uppercase hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={generatePDF} disabled={reportLoading}
                className="flex-1 bg-gradient-to-r from-[#967292] to-[#9C7A98] text-white py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 disabled:opacity-50">
                {reportLoading ? <><Loader size={14} className="animate-spin" /> Generando...</> : <><Download size={14} /> Exportar PDF</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ReportesPremios;
