import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  X
} from 'lucide-react';
import becaService from '../services/becaService';

// ============================================
// LISTA DE PAÍSES COMPLETA
// ============================================
const paisesLista = [
  { value: 'Afganistán', label: '🇦🇫 Afganistán' }, { value: 'Albania', label: '🇦🇱 Albania' },
  { value: 'Alemania', label: '🇩🇪 Alemania' }, { value: 'Andorra', label: '🇦🇩 Andorra' },
  { value: 'Angola', label: '🇦🇴 Angola' }, { value: 'Arabia Saudita', label: '🇸🇦 Arabia Saudita' },
  { value: 'Argelia', label: '🇩🇿 Argelia' }, { value: 'Argentina', label: '🇦🇷 Argentina' },
  { value: 'Armenia', label: '🇦🇲 Armenia' }, { value: 'Australia', label: '🇦🇺 Australia' },
  { value: 'Austria', label: '🇦🇹 Austria' }, { value: 'Azerbaiyán', label: '🇦🇿 Azerbaiyán' },
  { value: 'Bahamas', label: '🇧🇸 Bahamas' }, { value: 'Bangladés', label: '🇧🇩 Bangladés' },
  { value: 'Barbados', label: '🇧🇧 Barbados' }, { value: 'Bélgica', label: '🇧🇪 Bélgica' },
  { value: 'Belice', label: '🇧🇿 Belice' }, { value: 'Benín', label: '🇧🇯 Benín' },
  { value: 'Bielorrusia', label: '🇧🇾 Bielorrusia' }, { value: 'Birmania', label: '🇲🇲 Birmania' },
  { value: 'Bolivia', label: '🇧🇴 Bolivia' }, { value: 'Bosnia y Herzegovina', label: '🇧🇦 Bosnia y Herzegovina' },
  { value: 'Botsuana', label: '🇧🇼 Botsuana' }, { value: 'Brasil', label: '🇧🇷 Brasil' },
  { value: 'Brunéi', label: '🇧🇳 Brunéi' }, { value: 'Bulgaria', label: '🇧🇬 Bulgaria' },
  { value: 'Burkina Faso', label: '🇧🇫 Burkina Faso' }, { value: 'Burundi', label: '🇧🇮 Burundi' },
  { value: 'Bután', label: '🇧🇹 Bután' }, { value: 'Cabo Verde', label: '🇨🇻 Cabo Verde' },
  { value: 'Camboya', label: '🇰🇭 Camboya' }, { value: 'Camerún', label: '🇨🇲 Camerún' },
  { value: 'Canadá', label: '🇨🇦 Canadá' }, { value: 'Catar', label: '🇶🇦 Catar' },
  { value: 'Chad', label: '🇹🇩 Chad' }, { value: 'Chile', label: '🇨🇱 Chile' },
  { value: 'China', label: '🇨🇳 China' }, { value: 'Chipre', label: '🇨🇾 Chipre' },
  { value: 'Ciudad del Vaticano', label: '🇻🇦 Ciudad del Vaticano' }, { value: 'Colombia', label: '🇨🇴 Colombia' },
  { value: 'Comoras', label: '🇰🇲 Comoras' }, { value: 'Corea del Norte', label: '🇰🇵 Corea del Norte' },
  { value: 'Corea del Sur', label: '🇰🇷 Corea del Sur' }, { value: 'Costa de Marfil', label: '🇨🇮 Costa de Marfil' },
  { value: 'Costa Rica', label: '🇨🇷 Costa Rica' }, { value: 'Croacia', label: '🇭🇷 Croacia' },
  { value: 'Cuba', label: '🇨🇺 Cuba' }, { value: 'Dinamarca', label: '🇩🇰 Dinamarca' },
  { value: 'Dominica', label: '🇩🇲 Dominica' }, { value: 'Ecuador', label: '🇪🇨 Ecuador' },
  { value: 'Egipto', label: '🇪🇬 Egipto' }, { value: 'El Salvador', label: '🇸🇻 El Salvador' },
  { value: 'Emiratos Árabes Unidos', label: '🇦🇪 Emiratos Árabes Unidos' }, { value: 'Eritrea', label: '🇪🇷 Eritrea' },
  { value: 'Eslovaquia', label: '🇸🇰 Eslovaquia' }, { value: 'Eslovenia', label: '🇸🇮 Eslovenia' },
  { value: 'España', label: '🇪🇸 España' }, { value: 'Estados Unidos', label: '🇺🇸 Estados Unidos' },
  { value: 'Estonia', label: '🇪🇪 Estonia' }, { value: 'Etiopía', label: '🇪🇹 Etiopía' },
  { value: 'Filipinas', label: '🇵🇭 Filipinas' }, { value: 'Finlandia', label: '🇫🇮 Finlandia' },
  { value: 'Fiyi', label: '🇫🇯 Fiyi' }, { value: 'Francia', label: '🇫🇷 Francia' },
  { value: 'Gabón', label: '🇬🇦 Gabón' }, { value: 'Gambia', label: '🇬🇲 Gambia' },
  { value: 'Georgia', label: '🇬🇪 Georgia' }, { value: 'Ghana', label: '🇬🇭 Ghana' },
  { value: 'Granada', label: '🇬🇩 Granada' }, { value: 'Grecia', label: '🇬🇷 Grecia' },
  { value: 'Guatemala', label: '🇬🇹 Guatemala' }, { value: 'Guyana', label: '🇬🇾 Guyana' },
  { value: 'Guinea', label: '🇬🇳 Guinea' }, { value: 'Guinea-Bisáu', label: '🇬🇼 Guinea-Bisáu' },
  { value: 'Guinea Ecuatorial', label: '🇬🇶 Guinea Ecuatorial' }, { value: 'Haití', label: '🇭🇹 Haití' },
  { value: 'Honduras', label: '🇭🇳 Honduras' }, { value: 'Hungría', label: '🇭🇺 Hungría' },
  { value: 'India', label: '🇮🇳 India' }, { value: 'Indonesia', label: '🇮🇩 Indonesia' },
  { value: 'Irak', label: '🇮🇶 Irak' }, { value: 'Irán', label: '🇮🇷 Irán' },
  { value: 'Irlanda', label: '🇮🇪 Irlanda' }, { value: 'Islandia', label: '🇮🇸 Islandia' },
  { value: 'Islas Marshall', label: '🇲🇭 Islas Marshall' }, { value: 'Islas Salomón', label: '🇸🇧 Islas Salomón' },
  { value: 'Israel', label: '🇮🇱 Israel' }, { value: 'Italia', label: '🇮🇹 Italia' },
  { value: 'Jamaica', label: '🇯🇲 Jamaica' }, { value: 'Japón', label: '🇯🇵 Japón' },
  { value: 'Jordania', label: '🇯🇴 Jordania' }, { value: 'Kazajistán', label: '🇰🇿 Kazajistán' },
  { value: 'Kenia', label: '🇰🇪 Kenia' }, { value: 'Kirguistán', label: '🇰🇬 Kirguistán' },
  { value: 'Kiribati', label: '🇰🇮 Kiribati' }, { value: 'Kuwait', label: '🇰🇼 Kuwait' },
  { value: 'Laos', label: '🇱🇦 Laos' }, { value: 'Lesoto', label: '🇱🇸 Lesoto' },
  { value: 'Letonia', label: '🇱🇻 Letonia' }, { value: 'Líbano', label: '🇱🇧 Líbano' },
  { value: 'Liberia', label: '🇱🇷 Liberia' }, { value: 'Libia', label: '🇱🇾 Libia' },
  { value: 'Liechtenstein', label: '🇱🇮 Liechtenstein' }, { value: 'Lituania', label: '🇱🇹 Lituania' },
  { value: 'Luxemburgo', label: '🇱🇺 Luxemburgo' }, { value: 'Macedonia del Norte', label: '🇲🇰 Macedonia del Norte' },
  { value: 'Madagascar', label: '🇲🇬 Madagascar' }, { value: 'Malasia', label: '🇲🇾 Malasia' },
  { value: 'Malaui', label: '🇲🇼 Malaui' }, { value: 'Maldivas', label: '🇲🇻 Maldivas' },
  { value: 'Malí', label: '🇲🇱 Malí' }, { value: 'Malta', label: '🇲🇹 Malta' },
  { value: 'Marruecos', label: '🇲🇦 Marruecos' }, { value: 'Mauricio', label: '🇲🇺 Mauricio' },
  { value: 'Mauritania', label: '🇲🇷 Mauritania' }, { value: 'México', label: '🇲🇽 México' },
  { value: 'Micronesia', label: '🇫🇲 Micronesia' }, { value: 'Moldavia', label: '🇲🇩 Moldavia' },
  { value: 'Mónaco', label: '🇲🇨 Mónaco' }, { value: 'Mongolia', label: '🇲🇳 Mongolia' },
  { value: 'Montenegro', label: '🇲🇪 Montenegro' }, { value: 'Mozambique', label: '🇲🇿 Mozambique' },
  { value: 'Namibia', label: '🇳🇦 Namibia' }, { value: 'Nauru', label: '🇳🇷 Nauru' },
  { value: 'Nepal', label: '🇳🇵 Nepal' }, { value: 'Nicaragua', label: '🇳🇮 Nicaragua' },
  { value: 'Níger', label: '🇳🇪 Níger' }, { value: 'Nigeria', label: '🇳🇬 Nigeria' },
  { value: 'Noruega', label: '🇳🇴 Noruega' }, { value: 'Nueva Zelanda', label: '🇳🇿 Nueva Zelanda' },
  { value: 'Omán', label: '🇴🇲 Omán' }, { value: 'Países Bajos', label: '🇳🇱 Países Bajos' },
  { value: 'Pakistán', label: '🇵🇰 Pakistán' }, { value: 'Palaos', label: '🇵🇼 Palaos' },
  { value: 'Palestina', label: '🇵🇸 Palestina' }, { value: 'Panamá', label: '🇵🇦 Panamá' },
  { value: 'Papúa Nueva Guinea', label: '🇵🇬 Papúa Nueva Guinea' }, { value: 'Paraguay', label: '🇵🇾 Paraguay' },
  { value: 'Perú', label: '🇵🇪 Perú' }, { value: 'Polonia', label: '🇵🇱 Polonia' },
  { value: 'Portugal', label: '🇵🇹 Portugal' }, { value: 'Reino Unido', label: '🇬🇧 Reino Unido' },
  { value: 'República Centroafricana', label: '🇨🇫 República Centroafricana' }, { value: 'República Checa', label: '🇨🇿 República Checa' },
  { value: 'República del Congo', label: '🇨🇬 República del Congo' }, { value: 'República Democrática del Congo', label: '🇨🇩 República Democrática del Congo' },
  { value: 'República Dominicana', label: '🇩🇴 República Dominicana' }, { value: 'Ruanda', label: '🇷🇼 Ruanda' },
  { value: 'Rumania', label: '🇷🇴 Rumania' }, { value: 'Rusia', label: '🇷🇺 Rusia' },
  { value: 'Samoa', label: '🇼🇸 Samoa' }, { value: 'San Cristóbal y Nieves', label: '🇰🇳 San Cristóbal y Nieves' },
  { value: 'San Marino', label: '🇸🇲 San Marino' }, { value: 'San Vicente y las Granadinas', label: '🇻🇨 San Vicente y las Granadinas' },
  { value: 'Santa Lucía', label: '🇱🇨 Santa Lucía' }, { value: 'Santo Tomé y Príncipe', label: '🇸🇹 Santo Tomé y Príncipe' },
  { value: 'Senegal', label: '🇸🇳 Senegal' }, { value: 'Serbia', label: '🇷🇸 Serbia' },
  { value: 'Seychelles', label: '🇸🇨 Seychelles' }, { value: 'Sierra Leona', label: '🇸🇱 Sierra Leona' },
  { value: 'Singapur', label: '🇸🇬 Singapur' }, { value: 'Siria', label: '🇸🇾 Siria' },
  { value: 'Somalia', label: '🇸🇴 Somalia' }, { value: 'Sri Lanka', label: '🇱🇰 Sri Lanka' },
  { value: 'Suazilandia', label: '🇸🇿 Suazilandia' }, { value: 'Sudáfrica', label: '🇿🇦 Sudáfrica' },
  { value: 'Sudán', label: '🇸🇩 Sudán' }, { value: 'Sudán del Sur', label: '🇸🇸 Sudán del Sur' },
  { value: 'Suecia', label: '🇸🇪 Suecia' }, { value: 'Suiza', label: '🇨🇭 Suiza' },
  { value: 'Surinam', label: '🇸🇷 Surinam' }, { value: 'Tailandia', label: '🇹🇭 Tailandia' },
  { value: 'Tanzania', label: '🇹🇿 Tanzania' }, { value: 'Tayikistán', label: '🇹🇯 Tayikistán' },
  { value: 'Timor Oriental', label: '🇹🇱 Timor Oriental' }, { value: 'Togo', label: '🇹🇬 Togo' },
  { value: 'Tonga', label: '🇹🇴 Tonga' }, { value: 'Trinidad y Tobago', label: '🇹🇹 Trinidad y Tobago' },
  { value: 'Túnez', label: '🇹🇳 Túnez' }, { value: 'Turkmenistán', label: '🇹🇲 Turkmenistán' },
  { value: 'Turquía', label: '🇹🇷 Turquía' }, { value: 'Tuvalu', label: '🇹🇻 Tuvalu' },
  { value: 'Ucrania', label: '🇺🇦 Ucrania' }, { value: 'Uganda', label: '🇺🇬 Uganda' },
  { value: 'Uruguay', label: '🇺🇾 Uruguay' }, { value: 'Uzbekistán', label: '🇺🇿 Uzbekistán' },
  { value: 'Vanuatu', label: '🇻🇺 Vanuatu' }, { value: 'Venezuela', label: '🇻🇪 Venezuela' },
  { value: 'Vietnam', label: '🇻🇳 Vietnam' }, { value: 'Yemen', label: '🇾🇪 Yemen' },
  { value: 'Yibuti', label: '🇩🇯 Yibuti' }, { value: 'Zambia', label: '🇿🇲 Zambia' },
  { value: 'Zimbabue', label: '🇿🇼 Zimbabue' },
];

// ============================================
// COMPONENTE INPUT FIELD
// ============================================
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
      <label className="text-[#8B0D32] text-[10px] font-black uppercase mb-2 ml-1 tracking-[0.2em]">
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
            className={`w-full p-4 bg-[#fffcfc] border-2 rounded-[20px] focus:border-[#8B0D32] outline-none transition-all shadow-sm text-sm resize-none ${
              isTouched && error ? 'border-red-300 bg-red-50' : 'border-gray-100'
            }`}
          />
        ) : options ? (
          <select
            name={name} value={value} onChange={handleChange} onBlur={handleBlur}
            className={`w-full p-4 bg-[#fffcfc] border-2 rounded-[20px] focus:border-[#8B0D32] outline-none transition-all shadow-sm text-sm appearance-none ${
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
            className={`w-full p-4 ${Icon ? 'pl-12' : 'pl-4'} pr-12 bg-[#fffcfc] border-2 rounded-[20px] focus:border-[#8B0D32] outline-none transition-all shadow-sm text-sm ${
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

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const RegistroBeca = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState({
    tipo: '', titulo: '', institucion: '', pais: '', area: '',
    descripcion: '', fechaApertura: '', fechaCierre: '', duracion: '',
    requisitos: '', nivelEstudio: '', idiomaRequerido: '',
    edadMinima: '', edadMaxima: '', linkOficial: '',
    logoPreview: null, logoFile: null, plazasDisponibles: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const tiposOportunidad = [
    { value: 'beca', label: '🎓 Beca', icon: GraduationCap, color: 'from-blue-500 to-blue-600' },
    { value: 'curso', label: '📚 Curso', icon: BookOpen, color: 'from-green-500 to-green-600' },
    { value: 'pasantia', label: '💼 Pasantía', icon: Briefcase, color: 'from-purple-500 to-purple-600' },
    { value: 'intercambio', label: '🌍 Intercambio', icon: Globe, color: 'from-cyan-500 to-cyan-600' },
    { value: 'webinar', label: '🎥 Webinar', icon: Video, color: 'from-orange-500 to-orange-600' },
    { value: 'concurso', label: '🏆 Concurso', icon: Trophy, color: 'from-yellow-500 to-yellow-600' }
  ];

  const nivelesEstudio = ['Pregrado', 'Postgrado', 'Maestría', 'Doctorado', 'Técnico', 'Todos'];
  const idiomas = ['Español', 'Inglés', 'Portugués', 'Francés', 'Alemán', 'Chino', 'Italiano', 'No requiere'];

  // --- VALIDACIONES POR PASO ---
  const validateStep = (step) => {
    const newErrors = {};
    const newTouched = { ...touched };

    if (step === 1) {
      if (!formData.tipo) newErrors.tipo = 'Seleccione un tipo de oportunidad';
      if (!formData.titulo.trim()) newErrors.titulo = 'El título es requerido';
      if (!formData.institucion.trim()) newErrors.institucion = 'La institución es requerida';
      if (!formData.pais) newErrors.pais = 'El país es requerido';
      ['tipo', 'titulo', 'institucion', 'pais'].forEach(f => newTouched[f] = true);
    } else if (step === 2) {
      if (!formData.fechaApertura) newErrors.fechaApertura = 'Fecha de apertura requerida';
      if (!formData.fechaCierre) newErrors.fechaCierre = 'Fecha de cierre requerida';
      if (formData.fechaApertura && formData.fechaCierre && formData.fechaCierre < formData.fechaApertura) {
        newErrors.fechaCierre = 'No puede ser anterior a la apertura';
      }
      if (formData.plazasDisponibles && formData.plazasDisponibles < 0) newErrors.plazasDisponibles = 'Inválido';
      ['fechaApertura', 'fechaCierre'].forEach(f => newTouched[f] = true);
    } else if (step === 3) {
      if (formData.linkOficial && !/^https?:\/\/.+/.test(formData.linkOficial)) {
        newErrors.linkOficial = 'URL inválida (iniciar con http:// o https://)';
      }
      newTouched.linkOficial = true;
    }

    setErrors(newErrors);
    setTouched(newTouched);
    return Object.keys(newErrors).length === 0;
  };

  // --- MANEJADORES ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => setTouched(prev => ({ ...prev, [e.target.name]: true }));

  // ============================================
  // MANEJO DE ARCHIVO - SOLO PNG
  // ============================================
  const handleFileChange = (file) => {
    if (!file) return;
    
    // ✅ SOLO PERMITIR PNG
    if (file.type !== 'image/png') {
      setErrors(prev => ({ ...prev, logo: 'Solo se permiten archivos PNG' }));
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, logo: 'La imagen no debe superar los 5MB' }));
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, logoFile: file, logoPreview: reader.result }));
      setErrors(prev => ({ ...prev, logo: '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logoFile: null, logoPreview: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ============================================
  // COMPONENTE LOGO UPLOAD
  // ============================================
  const LogoUpload = () => (
    <div className="flex flex-col">
      <label className="text-[#8B0D32] text-[10px] font-black uppercase mb-2 tracking-widest">
        LOGO DE LA INSTITUCIÓN (SOLO PNG)
      </label>
      <div 
        onClick={() => fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-[30px] p-12 transition-all cursor-pointer text-center ${dragActive ? 'border-[#8B0D32] bg-red-50' : 'border-gray-200'}`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/png"
          onChange={handleFileInput} 
        />
        {formData.logoPreview ? (
          <div className="relative inline-block">
            <img src={formData.logoPreview} alt="Preview" className="h-32 w-32 object-contain bg-white p-2 rounded-2xl shadow-md" />
            <button type="button" onClick={(e) => { e.stopPropagation(); removeLogo(); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={14}/></button>
          </div>
        ) : (
          <div className="text-gray-400">
            <Building className="mx-auto mb-4 opacity-20" size={48} />
            <p className="text-[10px] font-black uppercase tracking-widest">Haz clic o arrastra el logo</p>
            <p className="text-[8px] text-gray-300 mt-1">Solo archivos PNG (máx. 5MB)</p>
          </div>
        )}
      </div>
      <AnimatePresence>
        {errors.logo && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-[9px] font-bold mt-1 ml-2 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {errors.logo}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  // --- HANDLE SUBMIT CONECTADO A LA API ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('tipo', formData.tipo);
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('institucion', formData.institucion);
      formDataToSend.append('pais', formData.pais);
      formDataToSend.append('area', formData.area || '');
      formDataToSend.append('descripcion', formData.descripcion || '');
      formDataToSend.append('fechaApertura', formData.fechaApertura);
      formDataToSend.append('fechaCierre', formData.fechaCierre);
      formDataToSend.append('duracion', formData.duracion || '');
      formDataToSend.append('nivelEstudio', formData.nivelEstudio || '');
      formDataToSend.append('idiomaRequerido', formData.idiomaRequerido || '');
      formDataToSend.append('edadMinima', formData.edadMinima || '');
      formDataToSend.append('edadMaxima', formData.edadMaxima || '');
      formDataToSend.append('requisitos', formData.requisitos || '');
      formDataToSend.append('linkOficial', formData.linkOficial || '');
      formDataToSend.append('plazasDisponibles', formData.plazasDisponibles || '');
      
      if (formData.logoFile) {
        formDataToSend.append('logo', formData.logoFile);
      }
      
      await becaService.create(formDataToSend);
      
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Error al registrar:', error);
      alert(error.message || 'Error al registrar la beca');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff5f5]">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-800 uppercase italic">¡Oportunidad Registrada!</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] to-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black italic text-[#8B0D32] mb-2 uppercase">Registrar Oportunidad</h1>
          <div className="flex justify-center gap-4 mt-6">
            {[1, 2, 3].map(num => (
              <div key={num} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all ${currentStep >= num ? 'bg-[#8B0D32] text-white shadow-lg' : 'bg-gray-200 text-gray-400'}`}>
                  {currentStep > num ? <CheckCircle size={16}/> : num}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[45px] shadow-[0_30px_80px_rgba(139,13,50,0.1)] overflow-hidden">
          <form onSubmit={handleSubmit} className="p-10 md:p-14">
            
            {/* PASO 1: INFORMACIÓN BÁSICA */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div>
                  <label className="text-[#8B0D32] text-[10px] font-black uppercase mb-4 block tracking-widest">Tipo de Oportunidad *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {tiposOportunidad.map(tipo => (
                      <button key={tipo.value} type="button" 
                        onClick={() => { setFormData(p => ({ ...p, tipo: tipo.value })); setErrors(e => ({ ...e, tipo: '' })); }}
                        className={`p-4 rounded-2xl border-2 transition-all text-left ${formData.tipo === tipo.value ? `border-[#8B0D32] bg-gradient-to-r ${tipo.color} text-white shadow-lg` : 'border-gray-100 bg-white hover:border-[#8B0D32]'}`}
                      >
                        <tipo.icon className={`w-6 h-6 mb-2 ${formData.tipo === tipo.value ? 'text-white' : 'text-[#8B0D32]'}`} />
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
                    <label className="text-[#8B0D32] text-[10px] font-black uppercase mb-2 ml-1 tracking-[0.2em]">PAÍS *</label>
                    <Select options={paisesLista} placeholder="Buscar país..." onChange={(opt) => setFormData(p => ({ ...p, pais: opt?.value }))}
                      styles={{ control: (b) => ({ ...b, borderRadius: '20px', border: `2px solid ${touched.pais && errors.pais ? '#fca5a5' : '#f3f4f6'}`, padding: '6px' }) }}
                    />
                    {touched.pais && errors.pais && <p className="text-red-500 text-[9px] font-bold mt-1 ml-2">{errors.pais}</p>}
                  </div>
                </div>
                <InputField label="ÁREA" name="area" icon={BookOpen} required={false} formData={formData} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
                <InputField label="DESCRIPCIÓN" name="descripcion" required={false} rows={4} formData={formData} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
              </motion.div>
            )}

            {/* PASO 2: FECHAS Y REQUISITOS */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
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
              </motion.div>
            )}

            {/* PASO 3: ENLACES Y LOGO */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <InputField label="ENLACE OFICIAL" name="linkOficial" icon={LinkIcon} type="url" required={false} formData={formData} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
                
                <LogoUpload />

                <div className="bg-[#8B0D32]/5 p-6 rounded-3xl border border-[#8B0D32]/10">
                  <h3 className="text-[#8B0D32] font-black text-[10px] uppercase mb-3">Resumen de Registro</h3>
                  <div className="text-[11px] font-bold text-gray-600 grid grid-cols-2 gap-2">
                    <p>TIPO: {formData.tipo || '—'}</p>
                    <p>PAÍS: {formData.pais || '—'}</p>
                    <p className="col-span-2">PROGRAMA: {formData.titulo || '—'}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* BOTONES DE NAVEGACIÓN */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
              {currentStep > 1 ? (
                <button type="button" onClick={() => setCurrentStep(s => s - 1)} className="text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-[#8B0D32]">← Anterior</button>
              ) : <div />}
              
              <button type="button" 
                onClick={() => {
                  if (currentStep < 3) {
                    if (validateStep(currentStep)) setCurrentStep(s => s + 1);
                  } else {
                    handleSubmit({ preventDefault: () => {} });
                  }
                }}
                className={`px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all ${currentStep === 3 ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-[#8B0D32] text-white hover:scale-105'}`}
              >
                {loading ? 'Registrando...' : currentStep === 3 ? '✅ Finalizar' : 'Siguiente →'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroBeca;