import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  Camera,
  X
} from 'lucide-react';
import auxiliarService from '../services/auxiliarService';

// ============================================
// COMPONENTE INPUT FIELD (FUERA DEL PRINCIPAL)
// ============================================
const InputField = ({ 
  label, 
  name, 
  type = "text", 
  icon: Icon, 
  required = true, 
  placeholder,
  formData,
  errors,
  touched,
  handleChange,
  handleBlur,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword
}) => {
  const value = formData[name] || '';
  const error = errors[name];
  const isTouched = touched[name];
  
  const isPasswordField = type === 'password';
  const isPassword = name === 'password';
  const isConfirmPassword = name === 'confirmPassword';

  return (
    <div className="flex flex-col">
      <label className="text-[#967292] text-[10px] font-black uppercase mb-2 ml-1 tracking-[0.2em]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
        )}
        <input
          type={isPasswordField ? (isPassword && showPassword ? 'text' : isConfirmPassword && showConfirmPassword ? 'text' : 'password') : type}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full p-4 ${Icon ? 'pl-12' : 'pl-4'} pr-12 bg-[#F4F4F4] border-2 rounded-[20px] focus:border-[#967292] outline-none transition-all shadow-sm text-sm ${
            isTouched && error 
              ? 'border-red-300 bg-red-50' 
              : isTouched && !error && value
              ? 'border-green-300 bg-green-50'
              : 'border-gray-100'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#967292] transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        {isConfirmPassword && (
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#967292] transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        {isTouched && !error && value && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
        )}
      </div>
      <AnimatePresence>
        {isTouched && error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-[9px] font-bold mt-1 ml-2 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// COMPONENTE PHOTO UPLOAD (FUERA DEL PRINCIPAL)
// ============================================
const PhotoUpload = ({ 
  formData, 
  errors, 
  dragActive, 
  handleDragOver, 
  handleDragLeave, 
  handleDrop, 
  handleFileInput, 
  removePhoto, 
  fileInputRef 
}) => (
  <div className="flex flex-col">
    <label className="text-[#967292] text-[10px] font-black uppercase mb-2 ml-1 tracking-[0.2em]">
      FOTO DE PERFIL
    </label>
    
    <div
      className={`relative border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer ${
        dragActive 
          ? 'border-[#967292] bg-[#967292]/5' 
          : formData.fotoPreview 
          ? 'border-green-300 bg-green-50'
          : 'border-gray-200 hover:border-[#967292] hover:bg-gray-50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      {formData.fotoPreview ? (
        <div className="relative">
          <img
            src={formData.fotoPreview}
            alt="Preview"
            className="w-32 h-32 rounded-2xl object-cover mx-auto shadow-lg"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removePhoto();
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="text-center text-xs text-gray-500 mt-2">
            {formData.foto?.name}
          </p>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            Haz clic o arrastra una imagen
          </p>
          <p className="text-[10px] text-gray-400">
            JPG, PNG o WEBP (máx. 5MB)
          </p>
        </div>
      )}
    </div>
    
    <AnimatePresence>
      {errors.foto && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-500 text-[9px] font-bold mt-1 ml-2 flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" />
          {errors.foto}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const AgregarAuxiliar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'auxiliar',
    telefono: '',
    departamento: '',
    foto: null,
    fotoPreview: null
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Validaciones en tiempo real
  const validateField = (name, value) => {
    switch(name) {
      case 'nombre':
        if (!value) return 'El nombre es requerido';
        if (value.length < 3) return 'Mínimo 3 caracteres';
        if (!/^[a-zA-ZáéíóúñÑ\s]+$/.test(value)) return 'Solo letras y espacios';
        return '';
      case 'email':
        if (!value) return 'El email es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido';
        if (!value.endsWith('@aux.univalle.edu')) {
          return 'Debe ser un email institucional (@aux.univalle.edu)';
        }
        return '';
      case 'password':
        if (!value) return 'La contraseña es requerida';
        if (value.length < 6) return 'Mínimo 6 caracteres';
        if (!/(?=.*[A-Z])/.test(value)) return 'Al menos una mayúscula';
        if (!/(?=.*[0-9])/.test(value)) return 'Al menos un número';
        return '';
      case 'confirmPassword':
        if (!value) return 'Confirma la contraseña';
        if (value !== formData.password) return 'Las contraseñas no coinciden';
        return '';
      case 'telefono':
        if (value && !/^[0-9]{8,15}$/.test(value)) return 'Teléfono inválido (8-15 dígitos)';
        return '';
      default:
        return '';
    }
  };

  // Manejo de archivo de foto
  const handleFileChange = (file) => {
    if (!file) return;
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, foto: 'Solo se permiten imágenes (JPG, PNG, WEBP)' }));
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, foto: 'La imagen no debe superar los 5MB' }));
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        foto: file,
        fotoPreview: reader.result
      }));
      setErrors(prev => ({ ...prev, foto: '' }));
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

  const removePhoto = () => {
    setFormData(prev => ({
      ...prev,
      foto: null,
      fotoPreview: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // --- HANDLE SUBMIT CONECTADO A LA API ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!formData.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!formData.email) newErrors.email = 'El email es requerido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirma la contraseña';
    
    if (formData.email && !formData.email.endsWith('@aux.univalle.edu')) {
      newErrors.email = 'Debe ser un email @aux.univalle.edu';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }
    if (formData.password && !/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Al menos una mayúscula';
    }
    if (formData.password && !/(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Al menos un número';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        nombre: true,
        email: true,
        password: true,
        confirmPassword: true
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('telefono', formData.telefono || '');
      formDataToSend.append('departamento', formData.departamento || '');
      
      if (formData.foto) {
        formDataToSend.append('foto', formData.foto);
      }
      
      await auxiliarService.create(formDataToSend);
      
      setLoading(false);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error al registrar auxiliar:', error);
      alert(error.message || 'Error al registrar auxiliar');
      setLoading(false);
    }
  };

  // Animaciones
  const slideAnimation = {
    hidden: { opacity: 0, x: 300 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 15 }
    }
  };

  // Mensaje de éxito
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex items-center justify-center page-surface"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">¡Auxiliar Registrado!</h2>
          <p className="text-gray-500">Redirigiendo al dashboard...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen page-surface py-10 px-4 flex justify-center items-center"
    >
      <motion.div 
        variants={slideAnimation}
        className="w-full max-w-4xl bg-white rounded-[45px] shadow-[0_30px_80px_rgba(150,114,146,0.15)] overflow-hidden border border-white"
      >
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative bg-gradient-to-r from-[#967292] to-[#9C7A98] p-10 text-white text-center overflow-hidden"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
            }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear", delay: 2 }}
            className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full"
          />
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4"
            >
              <UserPlus className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Registrar Nuevo Auxiliar</h2>
            <p className="text-white/60 text-[10px] uppercase mt-2 tracking-[0.3em] font-bold">
              Complete todos los campos requeridos
            </p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="p-10 md:p-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Foto de perfil */}
            <div className="md:col-span-2">
              <PhotoUpload 
                formData={formData}
                errors={errors}
                dragActive={dragActive}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleDrop={handleDrop}
                handleFileInput={handleFileInput}
                removePhoto={removePhoto}
                fileInputRef={fileInputRef}
              />
            </div>

            {/* Nombre Completo */}
            <InputField
              label="NOMBRE COMPLETO"
              name="nombre"
              icon={User}
              placeholder="Ej. Carlos Valdivia"
              formData={formData}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              setShowPassword={setShowPassword}
              setShowConfirmPassword={setShowConfirmPassword}
            />

            {/* Email Institucional */}
            <InputField
              label="EMAIL INSTITUCIONAL"
              name="email"
              type="email"
              icon={Mail}
              placeholder="carlos@aux.univalle.edu"
              formData={formData}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              setShowPassword={setShowPassword}
              setShowConfirmPassword={setShowConfirmPassword}
            />

            {/* Teléfono (opcional) */}
            <InputField
              label="TELÉFONO (OPCIONAL)"
              name="telefono"
              type="tel"
              icon={User}
              required={false}
              placeholder="Ej. 59171234567"
              formData={formData}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              setShowPassword={setShowPassword}
              setShowConfirmPassword={setShowConfirmPassword}
            />

            {/* Departamento */}
            <motion.div variants={inputVariants} className="flex flex-col">
              <label className="text-[#967292] text-[10px] font-black uppercase mb-2 ml-1 tracking-[0.2em]">
                DEPARTAMENTO
              </label>
              <select
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-4 bg-[#F4F4F4] border-2 border-gray-100 rounded-[20px] focus:border-[#967292] outline-none transition-all shadow-sm text-sm"
              >
                <option value="">Seleccionar departamento</option>
                <option value="admisiones">Admisiones</option>
                <option value="academico">Académico</option>
                <option value="finanzas">Finanzas</option>
                <option value="becas">Becas</option>
                <option value="internacional">Internacional</option>
              </select>
            </motion.div>

            {/* Contraseña */}
            <InputField
              label="CONTRASEÑA TEMPORAL"
              name="password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              formData={formData}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              setShowPassword={setShowPassword}
              setShowConfirmPassword={setShowConfirmPassword}
            />

            {/* Confirmar Contraseña */}
            <InputField
              label="CONFIRMAR CONTRASEÑA"
              name="confirmPassword"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              formData={formData}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              setShowPassword={setShowPassword}
              setShowConfirmPassword={setShowConfirmPassword}
            />
          </div>

          {/* Requisitos de contraseña */}
          <motion.div 
            variants={inputVariants}
            className="mt-6 p-4 bg-gray-50 rounded-2xl"
          >
            <p className="text-[9px] font-bold text-gray-600 mb-2">🔒 Requisitos de seguridad:</p>
            <div className="grid grid-cols-2 gap-2 text-[8px]">
              <div className={`flex items-center gap-1 ${formData.password.length >= 6 ? 'text-green-500' : 'text-gray-400'}`}>
                {formData.password.length >= 6 ? '✅' : '⬜'} Mínimo 6 caracteres
              </div>
              <div className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`}>
                {/[A-Z]/.test(formData.password) ? '✅' : '⬜'} Al menos una mayúscula
              </div>
              <div className={`flex items-center gap-1 ${/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`}>
                {/[0-9]/.test(formData.password) ? '✅' : '⬜'} Al menos un número
              </div>
            </div>
          </motion.div>

          {/* Botones */}
          <motion.div 
            variants={inputVariants}
            className="flex justify-end gap-6 mt-10 pt-6 border-t border-gray-100"
          >
            <motion.button
              type="button"
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-[#967292] transition-colors"
            >
              Cancelar
            </motion.button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative bg-gradient-to-r from-[#967292] to-[#9C7A98] text-white px-12 py-4 rounded-[25px] font-black uppercase text-[10px] tracking-[0.2em] shadow-lg hover:shadow-xl transition-all disabled:opacity-50 overflow-hidden group"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                />
              ) : (
                <span className="relative z-10 flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Registrar Auxiliar
                </span>
              )}
              <motion.div
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-white/20"
              />
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AgregarAuxiliar;
