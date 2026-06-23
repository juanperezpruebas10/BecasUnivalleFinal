import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { 
  GraduationCap, 
  Building2, 
  Globe, 
  BookOpen, 
  Link as LinkIcon,
  Calendar,
  Users,
  Award,
  FileText,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Video,
  Trophy,
  Building,
  X,
  Save
} from 'lucide-react';
import becaService from '../services/becaService';
import { getOpportunityOptions } from '../config/opportunityTypes';

// Lista de países (la misma que en RegistroBeca)
const paisesLista = [
  { value: 'Afganistán', label: '🇦🇫 Afganistán' }, { value: 'Albania', label: '🇦🇱 Albania' },
  { value: 'Alemania', label: '🇩🇪 Alemania' }, { value: 'Andorra', label: '🇦🇩 Andorra' },
  { value: 'Argentina', label: '🇦🇷 Argentina' }, { value: 'Bolivia', label: '🇧🇴 Bolivia' },
  { value: 'Brasil', label: '🇧🇷 Brasil' }, { value: 'Chile', label: '🇨🇱 Chile' },
  { value: 'China', label: '🇨🇳 China' }, { value: 'Colombia', label: '🇨🇴 Colombia' },
  { value: 'España', label: '🇪🇸 España' }, { value: 'Estados Unidos', label: '🇺🇸 Estados Unidos' },
  { value: 'Francia', label: '🇫🇷 Francia' }, { value: 'México', label: '🇲🇽 México' },
  { value: 'Perú', label: '🇵🇪 Perú' }, { value: 'Reino Unido', label: '🇬🇧 Reino Unido' },
  { value: 'Suiza', label: '🇨🇭 Suiza' }, { value: 'Uruguay', label: '🇺🇾 Uruguay' },
  { value: 'Venezuela', label: '🇻🇪 Venezuela' },
];

// Componente InputField
const InputField = ({ 
  label, name, type = "text", icon: Icon, required = true, 
  placeholder, options, rows, formData, errors, touched, 
  handleChange, handleBlur 
}) => {
  const isTextarea = rows;
  const value = formData[name] || '';
  const error = errors[name];
  const isTouched = touched[name];

  return (
    <div className="flex flex-col">
      <label className="text-[#967292] text-[10px] font-black uppercase mb-2 ml-1 tracking-[0.2em]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && !isTextarea && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
        )}
        
        {isTextarea ? (
          <textarea
            name={name} value={value} onChange={handleChange} onBlur={handleBlur}
            placeholder={placeholder} rows={rows}
            className={`w-full p-4 bg-[#F4F4F4] border-2 rounded-[20px] focus:border-[#967292] outline-none transition-all shadow-sm text-sm resize-none ${
              isTouched && error ? 'border-red-300 bg-red-50' : 'border-gray-100'
            }`}
          />
        ) : options ? (
          <select
            name={name} value={value} onChange={handleChange} onBlur={handleBlur}
            className={`w-full p-4 bg-[#F4F4F4] border-2 rounded-[20px] focus:border-[#967292] outline-none transition-all shadow-sm text-sm appearance-none ${
              isTouched && error ? 'border-red-300 bg-red-50' : 'border-gray-100'
            }`}
          >
            <option value="">Seleccionar...</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input
            type={type} name={name} value={value} onChange={handleChange} onBlur={handleBlur}
            placeholder={placeholder}
            className={`w-full p-4 ${Icon ? 'pl-12' : 'pl-4'} pr-12 bg-[#F4F4F4] border-2 rounded-[20px] focus:border-[#967292] outline-none transition-all shadow-sm text-sm ${
              isTouched && error ? 'border-red-300 bg-red-50' : 'border-gray-100'
            }`}
          />
        )}
        
        {isTouched && !error && value && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
        )}
      </div>
      <AnimatePresence>
        {isTouched && error && (
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-[9px] font-bold mt-1 ml-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente para carga de logo
const LogoUpload = ({ logoPreview, logoFile, onFileChange, onRemove, errors }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      alert('Formato no permitido');
      return;
    }
    onFileChange(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragActive(false); };
  const handleDrop = (e) => { e.preventDefault(); setDragActive(false); handleFileChange(e.dataTransfer.files[0]); };

  return (
    <div className="flex flex-col">
      <label className="text-[#967292] text-[10px] font-black uppercase mb-2 tracking-widest">
        LOGO DE LA INSTITUCIÓN
      </label>
      <div 
        onClick={() => fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-[30px] p-8 transition-all cursor-pointer text-center ${dragActive ? 'border-[#967292] bg-red-50' : 'border-gray-200'}`}
      >
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e.target.files[0])} />
        {logoPreview ? (
          <div className="relative inline-block">
            <img src={logoPreview} alt="Preview" className="h-32 w-32 object-contain bg-white p-2 rounded-2xl shadow-md" />
            <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={14}/></button>
          </div>
        ) : (
          <div className="text-gray-400">
            <Building className="mx-auto mb-4 opacity-20" size={48} />
            <p className="text-[10px] font-black uppercase tracking-widest">Haz clic o arrastra el logo</p>
          </div>
        )}
      </div>
      {errors.logo && <p className="text-red-500 text-[9px] font-bold mt-1">{errors.logo}</p>}
    </div>
  );
};

const EditarBeca = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    tipo: '', titulo: '', institucion: '', pais: '', area: '',
    descripcion: '', linkOficial: '', logoPreview: null, logoFile: null,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const tiposOportunidad = getOpportunityOptions();

  const nivelesEstudio = ['Pregrado', 'Postgrado', 'Maestría', 'Doctorado', 'Técnico', 'Todos'];
  const idiomas = ['Español', 'Inglés', 'Portugués', 'Francés', 'Alemán', 'Chino', 'Italiano', 'No requiere'];

  // Cargar datos de la beca
  useEffect(() => {
    const loadBeca = async () => {
      try {
        const beca = await becaService.getById(id);
        setFormData({
          tipo: beca.tipo || '',
          titulo: beca.titulo || '',
          institucion: beca.institucion || '',
          pais: beca.pais || '',
          area: beca.area || '',
          descripcion: beca.descripcion || '',
          linkOficial: beca.link_oficial || '',
          logoPreview: beca.logo || null,
          logoFile: null,
        });
      } catch (err) {
        console.error('Error cargando beca:', err);
        setError('No se pudo cargar la beca');
      } finally {
        setLoadingData(false);
      }
    };
    loadBeca();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.tipo) newErrors.tipo = 'Seleccione un tipo';
    if (!formData.titulo) newErrors.titulo = 'El título es requerido';
    if (!formData.institucion) newErrors.institucion = 'La institución es requerida';
    if (!formData.pais) newErrors.pais = 'El país es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => setTouched(prev => ({ ...prev, [e.target.name]: true }));

  const handleFileChange = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, logoFile: file, logoPreview: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, logoFile: null, logoPreview: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'logoPreview' && formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (formData.logoFile) {
        formDataToSend.append('logo', formData.logoFile);
      }
      
      await becaService.update(id, formDataToSend);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard/reportes'), 2000);
    } catch (err) {
      console.error('Error al actualizar:', err);
      alert(err.message || 'Error al actualizar la beca');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#967292]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center page-surface">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-800 uppercase italic">¡Beca Actualizada!</h2>
          <p className="text-gray-500 mt-2">Redirigiendo...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-surface py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black italic text-[#967292] mb-2 uppercase">Editar Beca</h1>
          <p className="text-gray-500 text-sm">Modifica los datos de la beca seleccionada</p>
        </div>

        <div className="bg-white rounded-[45px] shadow-[0_30px_80px_rgba(150,114,146,0.1)] overflow-hidden">
          <form onSubmit={handleSubmit} className="p-10 md:p-14">
            <div className="space-y-6">
              {/* Tipo */}
              <div>
                <label className="text-[#967292] text-[10px] font-black uppercase mb-4 block tracking-widest">Tipo de Oportunidad *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {tiposOportunidad.map(tipo => (
                    <button key={tipo.value} type="button" 
                      onClick={() => { setFormData(p => ({ ...p, tipo: tipo.value })); setErrors(e => ({ ...e, tipo: '' })); }}
                      className={`p-4 rounded-2xl border-2 transition-all text-left ${formData.tipo === tipo.value ? `border-[#967292] bg-gradient-to-r ${tipo.color} text-white shadow-lg` : 'border-gray-100 bg-white hover:border-[#967292]'}`}
                    >
                      <tipo.icon className={`w-6 h-6 mb-2 ${formData.tipo === tipo.value ? 'text-white' : 'text-[#967292]'}`} />
                      <p className="font-black text-[10px] uppercase">{tipo.label}</p>
                    </button>
                  ))}
                </div>
                {touched.tipo && errors.tipo && <p className="text-red-500 text-[9px] font-bold mt-2">{errors.tipo}</p>}
              </div>

              <InputField label="TÍTULO" name="titulo" icon={Award} formData={formData} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="INSTITUCIÓN" name="institucion" icon={Building2} formData={formData} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
                <div className="flex flex-col">
                  <label className="text-[#967292] text-[10px] font-black uppercase mb-2 ml-1 tracking-[0.2em]">PAÍS *</label>
                  <Select options={paisesLista} placeholder="Buscar país..." 
                    value={paisesLista.find(p => p.value === formData.pais)}
                    onChange={(opt) => setFormData(p => ({ ...p, pais: opt?.value }))}
                    styles={{ control: (b) => ({ ...b, borderRadius: '20px', border: `2px solid ${touched.pais && errors.pais ? '#fca5a5' : '#f3f4f6'}`, padding: '6px' }) }}
                  />
                  {touched.pais && errors.pais && <p className="text-red-500 text-[9px] font-bold mt-1">{errors.pais}</p>}
                </div>
              </div>

              <InputField label="ÁREA" name="area" icon={BookOpen} required={false} formData={formData} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
              <InputField label="DESCRIPCIÓN" name="descripcion" required={false} rows={4} formData={formData} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="FECHA APERTURA" name="fechaApertura" type="date" icon={Calendar} formData={formData} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
                <InputField label="FECHA CIERRE" name="fechaCierre" type="date" icon={Calendar} formData={formData} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="DURACIÓN" name="duracion" required={false} placeholder="Ej. 12 meses" formData={formData} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
                <InputField label="PLAZAS" name="plazasDisponibles" type="number" icon={Users} required={false} formData={formData} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="NIVEL ESTUDIO" name="nivelEstudio" options={nivelesEstudio} required={false} formData={formData} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
                <InputField label="IDIOMA" name="idiomaRequerido" options={idiomas} required={false} formData={formData} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="EDAD MÍNIMA" name="edadMinima" type="number" required={false} formData={formData} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
                <InputField label="EDAD MÁXIMA" name="edadMaxima" type="number" required={false} formData={formData} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
              </div>

              <InputField label="REQUISITOS" name="requisitos" required={false} rows={3} formData={formData} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
              <InputField label="ENLACE OFICIAL" name="linkOficial" icon={LinkIcon} type="url" required={false} formData={formData} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />

              <LogoUpload 
                logoPreview={formData.logoPreview}
                logoFile={formData.logoFile}
                onFileChange={handleFileChange}
                onRemove={handleRemoveLogo}
                errors={errors}
              />

              <div className="flex justify-end gap-6 mt-8 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => navigate('/dashboard/reportes')} className="text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-[#967292]">Cancelar</button>
                <button type="submit" disabled={loading} className="bg-gradient-to-r from-[#967292] to-[#9C7A98] text-white px-8 py-3 rounded-[25px] font-black uppercase text-[10px] tracking-[0.2em] shadow-lg disabled:opacity-50 flex items-center gap-2">
                  {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Guardar Cambios</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarBeca;
