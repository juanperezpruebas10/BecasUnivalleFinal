import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, Save, UploadCloud, AlertCircle, CheckCircle } from 'lucide-react';
import authService from '../services/authService';
import practicaService from '../services/practicaService';
import PracticasCarousel from '../components/PracticasCarousel';

const PracticasInternacionales = () => {
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [texto, setTexto] = useState('');
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  const canCreate = user?.rol === 'docente' || user?.rol === 'auxiliar';

  const handleImage = (file) => {
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      setError('Solo se permiten imágenes JPG, PNG o WEBP');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5MB');
      return;
    }

    setImagen(file);
    setPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!imagen || !texto.trim()) {
      setError('Agrega una foto y un texto para registrar la práctica.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('imagen', imagen);
      formData.append('texto', texto.trim());
      await practicaService.create(formData);
      setTexto('');
      setImagen(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setRefreshKey((key) => key + 1);
      setSuccess('Práctica internacional registrada correctamente.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'No se pudo registrar la práctica.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen page-surface py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
        >
          <h1 className="text-3xl md:text-4xl font-black italic text-[#967292] uppercase mb-2">
            Prácticas Internacionales
          </h1>
          <p className="text-sm text-gray-500">
            Registra experiencias con una foto y una descripción breve.
          </p>
        </motion.div>

        {canCreate ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[260px] rounded-2xl border-2 border-dashed border-gray-200 bg-[#F4F4F4] hover:border-[#967292] transition-all overflow-hidden flex items-center justify-center"
              >
                {preview ? (
                  <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-400 px-6">
                    <UploadCloud className="w-12 h-12 mx-auto mb-3" />
                    <p className="text-xs font-black uppercase tracking-widest">Subir foto</p>
                    <p className="text-[10px] mt-1">JPG, PNG o WEBP</p>
                  </div>
                )}
              </button>

              <div className="flex flex-col gap-5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  className="hidden"
                  onChange={(e) => handleImage(e.target.files[0])}
                />

                <label className="flex flex-col gap-2">
                  <span className="text-[#967292] text-[10px] font-black uppercase tracking-[0.2em]">
                    Texto de la experiencia
                  </span>
                  <textarea
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    rows={8}
                    maxLength={500}
                    placeholder="Describe qué sucedió durante la práctica internacional..."
                    className="w-full p-4 bg-[#F4F4F4] border-2 border-gray-100 rounded-[20px] focus:border-[#967292] outline-none transition-all text-sm resize-none"
                  />
                </label>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <p className="text-[10px] text-gray-400 font-bold">{texto.length}/500 caracteres</p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-[#967292] to-[#9C7A98] text-white px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-lg disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Guardar práctica
                  </button>
                </div>

                {error && (
                  <p className="text-red-500 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </p>
                )}
                {success && (
                  <p className="text-green-600 text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> {success}
                  </p>
                )}
              </div>
            </div>
          </motion.form>
        ) : (
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
            <ImagePlus className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Solo administradores y auxiliares pueden crear prácticas internacionales.</p>
          </div>
        )}

        <PracticasCarousel key={refreshKey} />
      </div>
    </div>
  );
};

export default PracticasInternacionales;
