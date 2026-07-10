import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import fotoLogin from '../assets/login.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Verificar si ya está logueado
  React.useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      console.log('Login exitoso:', response.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      {/* Lado izquierdo con animación */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex md:w-1/2 bg-white relative"
      >
        <img 
          src={fotoLogin} 
          alt="Estudiantes Univalle" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Lado derecho */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full md:w-1/2 bg-[#9C7A98] flex items-center justify-center p-6 lg:p-16"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="bg-white w-full max-w-md p-10 rounded-[40px] shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.h2 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-black text-gray-800 mb-2 text-center"
            >
              Iniciar Sesión
            </motion.h2>
            <p className="text-center text-gray-500 text-sm mb-6">
              Use su correo institucional
              <br />
              
            </p>
            
            <div>
              <label className="block text-gray-700 font-bold mb-2 ml-1">Correo</label>
              <motion.input 
                whileFocus={{ scale: 1.02 }}
                type="email" 
                placeholder="ejemplo@univalle.edu"
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#AF93AC] outline-none transition-all bg-gray-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 ml-1">Contraseña</label>
              <motion.input 
                whileFocus={{ scale: 1.02 }}
                type="password" 
                placeholder="••••••••"
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#AF93AC] outline-none transition-all bg-gray-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#2d2d2d] hover:bg-black text-white font-black py-4 rounded-2xl text-xl transition-all shadow-lg active:scale-95 uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto"
                />
              ) : (
                'Ingresar'
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
