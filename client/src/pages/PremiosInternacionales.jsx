import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Save, AlertCircle, CheckCircle, Link as LinkIcon,
  Users, BookOpen, Globe, Award, UploadCloud, Pencil, Trash2, X, Calendar
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import authService from '../services/authService';
import premioService from '../services/premioService';
import API_URL from '../config/api';

const API_BASE = API_URL.replace('/api', '');

const CARRERAS_COLORS = ['#967292','#9C7A98','#614B59','#B59BB2','#AF93AC','#7C6375','#D4B8D0','#4A3545','#C2A1BE','#6A5663'];
const AMBITO_COLORS = { nacional: '#967292', internacional: '#614B59' };

const FormField = ({ label, children }) => (
  <label className="flex flex-col gap-1">
    <span className="text-[#967292] text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    {children}
  </label>
);
const inputClass = 'w-full p-3 bg-[#F4F4F4] border-2 border-gray-100 rounded-[16px] focus:border-[#967292] outline-none transition-all text-sm';

const EMPTY_FORM = { titulo: '', premio: '', ambito: 'internacional', carrera: '', miembros: '', link: '', fecha: '' };

const PremiosInternacionales = () => {
  const fileInputRef = useRef(null);
  const editFileRef = useRef(null);
  const [user, setUser] = useState(null);
  const [premios, setPremios] = useState([]);
  const [estadisticas, setEstadisticas] = useState({ porCarrera: [], porAmbito: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // Modal de edición
  const [editando, setEditando] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [editImagen, setEditImagen] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  // Confirmación de eliminar
  const [eliminando, setEliminando] = useState(null);

  useEffect(() => { setUser(authService.getCurrentUser()); loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [listData, statsData] = await Promise.all([premioService.getAll(), premioService.getEstadisticas()]);
      setPremios(listData);
      setEstadisticas(statsData);
    } catch { setPremios([]); } finally { setLoading(false); }
  };

  const canCreate = user?.rol === 'docente' || user?.rol === 'auxiliar';
  const isAdmin   = user?.rol === 'docente';

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImage = (file, setImg, setPrev) => {
    if (!file) return;
    if (!['image/jpeg','image/png','image/jpg','image/webp'].includes(file.type)) { setError('Solo JPG, PNG o WEBP'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Máx 5MB'); return; }
    setImg(file);
    setPrev(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (!form.titulo.trim() || !form.premio.trim() || !form.carrera.trim() || !form.miembros.trim()) {
      setError('Completa todos los campos obligatorios.'); return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imagen) fd.append('imagen', imagen);
      await premioService.create(fd);
      setForm(EMPTY_FORM); setImagen(null); setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setSuccess('Premio registrado correctamente.');
      setTimeout(() => setSuccess(''), 3000);
      loadData();
    } catch (err) { setError(err.message || 'No se pudo registrar.'); }
    finally { setSaving(false); }
  };

  // ── Editar ─────────────────────────────────────────────────────────
  const abrirEdicion = (premio) => {
    setEditando(premio);
    setEditForm({
      titulo: premio.titulo || '', premio: premio.premio || '',
      ambito: premio.ambito || 'internacional', carrera: premio.carrera || '',
      miembros: premio.miembros || '', link: premio.link || '',
      fecha: premio.fecha ? premio.fecha.split('T')[0] : ''
    });
    setEditImagen(null);
    setEditPreview(premio.imagen ? `${API_BASE}${premio.imagen}` : null);
    setEditError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault(); setEditError('');
    if (!editForm.titulo.trim() || !editForm.premio.trim() || !editForm.carrera.trim() || !editForm.miembros.trim()) {
      setEditError('Completa todos los campos obligatorios.'); return;
    }
    setEditSaving(true);
    try {
      const fd = new FormData();
      Object.entries(editForm).forEach(([k, v]) => fd.append(k, v));
      if (editImagen) fd.append('imagen', editImagen);
      await premioService.update(editando.id, fd);
      setEditando(null);
      loadData();
    } catch (err) { setEditError(err.message || 'No se pudo actualizar.'); }
    finally { setEditSaving(false); }
  };

  // ── Eliminar ───────────────────────────────────────────────────────
  const confirmarEliminar = async () => {
    try {
      await premioService.delete(eliminando.id);
      setEliminando(null);
      loadData();
    } catch { alert('No se pudo eliminar el premio.'); }
  };

  const pieData = estadisticas.porCarrera.map(i => ({ name: i.carrera, value: Number(i.cantidad) }));
  const barData = estadisticas.porAmbito.map(i => ({
    name: i.ambito === 'nacional' ? 'Nacional' : 'Internacional',
    cantidad: Number(i.cantidad), fill: AMBITO_COLORS[i.ambito] || '#967292'
  }));

  return (
    <div className="min-h-screen page-surface py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#967292] via-[#9C7A98] to-[#614B59] rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={24} className="text-white" strokeWidth={1.5} />
            <span className="text-white/80 text-xs font-black uppercase tracking-[0.3em]">Universidad Privada del Valle</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black italic text-white uppercase">Premios Internacionales</h1>
          <p className="text-white/70 text-sm mt-2">Registro de logros y reconocimientos.</p>
        </motion.div>

        {/* Formulario */}
        {canCreate ? (
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-[#967292] font-black uppercase italic tracking-widest text-sm mb-6">Registrar Nuevo Premio</h2>

            {/* Imagen */}
            <div className="mb-6">
              <span className="text-[#967292] text-[10px] font-black uppercase tracking-[0.2em] block mb-2">Imagen (opcional)</span>
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="w-full md:w-64 h-44 rounded-2xl border-2 border-dashed border-gray-200 bg-[#F4F4F4] hover:border-[#967292] transition-all overflow-hidden flex items-center justify-center">
                {preview ? <img src={preview} alt="Vista previa" className="w-full h-full object-cover" /> : (
                  <div className="text-center text-gray-400 px-6">
                    <UploadCloud className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-xs font-black uppercase tracking-widest">Subir foto</p>
                    <p className="text-[10px] mt-1">JPG, PNG o WEBP · máx 5MB</p>
                  </div>
                )}
              </button>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/jpg,image/webp" className="hidden"
                onChange={(e) => handleImage(e.target.files[0], setImagen, setPreview)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Título *">
                <input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Nombre del proyecto" className={inputClass} maxLength={255} />
              </FormField>
              <FormField label="Premio *">
                <input name="premio" value={form.premio} onChange={handleChange} placeholder="Ej: Primer lugar..." className={inputClass} maxLength={255} />
              </FormField>
              <FormField label="Ámbito *">
                <select name="ambito" value={form.ambito} onChange={handleChange} className={inputClass}>
                  <option value="nacional">Nacional</option>
                  <option value="internacional">Internacional</option>
                </select>
              </FormField>
              <FormField label="Fecha">
                <input name="fecha" value={form.fecha} onChange={handleChange} type="date" className={inputClass} />
              </FormField>
              <FormField label="Carrera *">
                <input name="carrera" value={form.carrera} onChange={handleChange} placeholder="Ej: Ingeniería de Sistemas" className={inputClass} maxLength={255} />
              </FormField>
              <FormField label="Miembros *">
                <input name="miembros" value={form.miembros} onChange={handleChange} placeholder="Nombres separados por coma" className={inputClass} maxLength={500} />
              </FormField>
              <FormField label="Link (opcional)">
                <input name="link" value={form.link} onChange={handleChange} placeholder="https://..." className={inputClass} maxLength={500} type="url" />
              </FormField>
            </div>

            <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                {error && <p className="text-red-500 text-xs font-bold flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</p>}
                {success && <p className="text-green-600 text-xs font-bold flex items-center gap-2"><CheckCircle className="w-4 h-4" />{success}</p>}
              </div>
              <button type="submit" disabled={saving}
                className="bg-gradient-to-r from-[#967292] to-[#9C7A98] text-white px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-lg disabled:opacity-50 flex items-center gap-2">
                {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar premio
              </button>
            </div>
          </motion.form>
        ) : (
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
            <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-3" strokeWidth={1} />
            <p className="text-sm text-gray-500">Solo docentes y auxiliares pueden registrar premios.</p>
          </div>
        )}

        {/* Gráfico torta — solo admin */}
        {!loading && isAdmin && estadisticas.porCarrera.length > 0 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen size={18} className="text-[#967292]" strokeWidth={1.5} />
              <h3 className="text-[#967292] font-black uppercase italic tracking-widest text-[11px]">Premios por Carrera</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                  {pieData.map((e, i) => <Cell key={e.name} fill={CARRERAS_COLORS[i % CARRERAS_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius:'12px', border:'none', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' }} formatter={(v, n) => [v, n]} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize:'10px', fontWeight:700, color:'#555' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Gráfico barras — docente y auxiliar */}
        {!loading && canCreate && estadisticas.porAmbito.length > 0 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Globe size={18} className="text-[#967292]" strokeWidth={1.5} />
              <h3 className="text-[#967292] font-black uppercase italic tracking-widest text-[11px]">Nacional vs Internacional</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} barSize={60}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize:11, fontWeight:700, fill:'#555' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize:10, fill:'#aaa' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius:'12px', border:'none', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' }} formatter={(v) => [v,'Premios']} />
                <Bar dataKey="cantidad" radius={[8,8,0,0]}>
                  {barData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Listado con editar/eliminar */}
        {canCreate && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Award size={18} className="text-[#967292]" strokeWidth={1.5} />
              <h3 className="text-[#967292] font-black uppercase italic tracking-widest text-[11px]">
                Todos los Premios ({estadisticas.total})
              </h3>
            </div>

            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
            ) : premios.length === 0 ? (
              <div className="text-center py-10">
                <Trophy className="w-12 h-12 text-gray-200 mx-auto mb-3" strokeWidth={1} />
                <p className="text-gray-400 text-sm">No hay premios registrados aún.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {premios.map((premio, index) => (
                  <motion.div key={premio.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: index * 0.05 }}
                    className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all">
                    <div className="flex flex-wrap items-start gap-4">
                      {premio.imagen && (
                        <img src={`${API_BASE}${premio.imagen}`} alt={premio.titulo} className="w-20 h-20 object-cover rounded-xl shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="font-black text-gray-800 text-sm">{premio.titulo}</h4>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            premio.ambito === 'internacional' ? 'bg-[#614B59]/15 text-[#614B59]' : 'bg-[#967292]/15 text-[#967292]'
                          }`}>{premio.ambito === 'internacional' ? 'Internacional' : 'Nacional'}</span>
                        </div>
                        <p className="text-[#967292] text-xs font-bold mb-1">{premio.premio}</p>
                        <div className="flex flex-wrap gap-4 text-[10px] text-gray-400">
                          <span className="flex items-center gap-1"><BookOpen size={10} />{premio.carrera}</span>
                          <span className="flex items-center gap-1"><Users size={10} />{premio.miembros}</span>
                          {premio.fecha && <span className="flex items-center gap-1"><Calendar size={10} />{new Date(premio.fecha).toLocaleDateString('es-ES')}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {premio.link && (
                          <a href={premio.link} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] text-[#967292] font-bold hover:underline">
                            <LinkIcon size={12} /> Ver
                          </a>
                        )}
                        <button type="button" onClick={() => abrirEdicion(premio)}
                          className="p-2 rounded-xl bg-[#967292]/10 hover:bg-[#967292]/20 text-[#967292] transition-all">
                          <Pencil size={14} />
                        </button>
                        <button type="button" onClick={() => setEliminando(premio)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Modal Editar */}
      <AnimatePresence>
        {editando && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setEditando(null)}>
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
              className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#967292] font-black uppercase italic tracking-widest text-sm">Editar Premio</h2>
                <button type="button" onClick={() => setEditando(null)} className="p-2 rounded-full hover:bg-gray-100">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-5">
                {/* Imagen edición */}
                <div>
                  <span className="text-[#967292] text-[10px] font-black uppercase tracking-[0.2em] block mb-2">Imagen</span>
                  <button type="button" onClick={() => editFileRef.current?.click()}
                    className="w-full md:w-48 h-36 rounded-2xl border-2 border-dashed border-gray-200 bg-[#F4F4F4] hover:border-[#967292] transition-all overflow-hidden flex items-center justify-center">
                    {editPreview ? <img src={editPreview} alt="preview" className="w-full h-full object-cover" /> : (
                      <div className="text-center text-gray-400"><UploadCloud className="w-8 h-8 mx-auto mb-1" /><p className="text-[10px]">Cambiar imagen</p></div>
                    )}
                  </button>
                  <input ref={editFileRef} type="file" accept="image/jpeg,image/png,image/jpg,image/webp" className="hidden"
                    onChange={(e) => handleImage(e.target.files[0], setEditImagen, setEditPreview)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="Título *">
                    <input name="titulo" value={editForm.titulo} onChange={e => setEditForm(p=>({...p, titulo:e.target.value}))} className={inputClass} maxLength={255} />
                  </FormField>
                  <FormField label="Premio *">
                    <input name="premio" value={editForm.premio} onChange={e => setEditForm(p=>({...p, premio:e.target.value}))} className={inputClass} maxLength={255} />
                  </FormField>
                  <FormField label="Ámbito *">
                    <select value={editForm.ambito} onChange={e => setEditForm(p=>({...p, ambito:e.target.value}))} className={inputClass}>
                      <option value="nacional">Nacional</option>
                      <option value="internacional">Internacional</option>
                    </select>
                  </FormField>
                  <FormField label="Fecha">
                    <input type="date" value={editForm.fecha} onChange={e => setEditForm(p=>({...p, fecha:e.target.value}))} className={inputClass} />
                  </FormField>
                  <FormField label="Carrera *">
                    <input value={editForm.carrera} onChange={e => setEditForm(p=>({...p, carrera:e.target.value}))} className={inputClass} maxLength={255} />
                  </FormField>
                  <FormField label="Miembros *">
                    <input value={editForm.miembros} onChange={e => setEditForm(p=>({...p, miembros:e.target.value}))} className={inputClass} maxLength={500} />
                  </FormField>
                  <FormField label="Link (opcional)">
                    <input type="url" value={editForm.link} onChange={e => setEditForm(p=>({...p, link:e.target.value}))} className={inputClass} maxLength={500} />
                  </FormField>
                </div>

                {editError && <p className="text-red-500 text-xs font-bold flex items-center gap-2"><AlertCircle className="w-4 h-4" />{editError}</p>}

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setEditando(null)}
                    className="px-6 py-2 rounded-full text-gray-500 font-black text-[10px] uppercase border border-gray-200 hover:bg-gray-50">
                    Cancelar
                  </button>
                  <button type="submit" disabled={editSaving}
                    className="bg-gradient-to-r from-[#967292] to-[#9C7A98] text-white px-8 py-2 rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-lg disabled:opacity-50 flex items-center gap-2">
                    {editSaving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    Guardar cambios
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Confirmar Eliminar */}
      <AnimatePresence>
        {eliminando && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center p-4">
            <motion.div initial={{ scale:0.9 }} animate={{ scale:1 }} exit={{ scale:0.9 }}
              className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-sm text-center">
              <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-4" strokeWidth={1} />
              <h3 className="font-black text-gray-800 mb-2">¿Eliminar premio?</h3>
              <p className="text-gray-500 text-sm mb-6">"{eliminando.titulo}" será eliminado permanentemente.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setEliminando(null)}
                  className="px-6 py-2 rounded-full border border-gray-200 text-gray-500 font-black text-[10px] uppercase hover:bg-gray-50">
                  Cancelar
                </button>
                <button onClick={confirmarEliminar}
                  className="px-6 py-2 rounded-full bg-red-500 text-white font-black text-[10px] uppercase hover:bg-red-600">
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PremiosInternacionales;
