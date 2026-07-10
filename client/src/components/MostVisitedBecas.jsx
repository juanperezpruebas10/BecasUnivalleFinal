import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import becaService from '../services/becaService';
import authService from '../services/authService';
import { getOpportunityType } from '../config/opportunityTypes';

const MostVisitedBecas = ({ becas: becasProp }) => {
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = authService.getCurrentUser();
    setUser(userData);
    loadBecas();
  }, [becasProp]);

  const loadBecas = async () => {
    try {
      let masVisitadas = [];
      
      // Si se pasan props, usarlas
      if (becasProp && becasProp.length > 0) {
        masVisitadas = becasProp;
      } else {
        // Si no hay props, obtener datos de la API
        const graficos = await becaService.getGraficos();
        masVisitadas = graficos.masVisitadas || [];
      }
      
      // Ordenar por visitas (mayor a menor)
      const sorted = [...masVisitadas].sort((a, b) => (b.visitas || 0) - (a.visitas || 0));
      
      const formattedBecas = sorted.map((beca, index) => ({
        id: beca.id,
        nombre: beca.titulo,
        visitas: beca.visitas || 0,
        crecimiento: calcularCrecimiento(beca.visitas, index),
        pais: beca.pais,
        tipo: beca.tipo,
        link_oficial: beca.link_oficial
      }));
      setBecas(formattedBecas);
    } catch (error) {
      console.error('Error cargando becas más visitadas:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularCrecimiento = (visitas, index) => {
    // Simular crecimiento basado en posición y visitas
    if (index === 0) return Math.floor(Math.random() * 30) + 20;
    if (index === 1) return Math.floor(Math.random() * 20) + 10;
    if (index === 2) return Math.floor(Math.random() * 15) + 5;
    return Math.floor(Math.random() * 10) - 5;
  };

  const maxVisitas = Math.max(...becas.map(b => b.visitas), 1);
  const getIconByTipo = (tipo) => getOpportunityType(tipo).emoji;
  const getColorByTipo = (tipo) => getOpportunityType(tipo).gradient;

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#967292]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-[#967292] font-black uppercase italic tracking-widest text-[11px] mb-1">
            🔥 Becas más visitadas
          </h3>
          <p className="text-gray-400 text-[10px]">
            Ranking de popularidad {user?.rol === 'estudiante' ? '(contador activo)' : '(solo visualización)'}
          </p>
        </div>
      </div>

      {becas.length > 0 ? (
        <div className="space-y-4">
          {becas.map((beca, index) => {
            const porcentaje = (beca.visitas / maxVisitas) * 100;
            
            return (
              <motion.div
                key={beca.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
                onClick={async () => {
                  // Al hacer clic en el ranking, abrir la beca si tiene enlace
                  if (!beca.link_oficial) return;

                  if (user?.rol === 'estudiante') {
                    // Actualización optimista: sumamos +1 en pantalla al instante
                    setBecas(prev =>
                      prev.map(b =>
                        b.id === beca.id ? { ...b, visitas: (b.visitas || 0) + 1 } : b
                      )
                    );

                    try {
                      await becaService.getById(beca.id);
                    } catch (error) {
                      console.error('Error registrando visita:', error);
                      // Si falló, revertimos el +1 optimista
                      setBecas(prev =>
                        prev.map(b =>
                          b.id === beca.id ? { ...b, visitas: Math.max((b.visitas || 1) - 1, 0) } : b
                        )
                      );
                    }
                  }

                  window.open(beca.link_oficial, '_blank');
                }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${
                    index === 0 ? 'bg-[#FACC15] text-[#454545]' :
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    index === 2 ? 'bg-[#FDBA74] text-[#454545]' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    #{index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getIconByTipo(beca.tipo)}</span>
                      <h4 className="font-black text-sm text-gray-800 group-hover:text-[#967292] transition-colors line-clamp-1">
                        {beca.nombre}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[9px] text-gray-400 flex items-center gap-1">
                        📍 {beca.pais}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-black text-gray-800">
                      {beca.visitas.toLocaleString()}
                    </p>
                    <div className={`flex items-center gap-1 text-[9px] font-bold ${
                      beca.crecimiento > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {beca.crecimiento > 0 ? '↑' : '↓'} {Math.abs(beca.crecimiento)}%
                    </div>
                  </div>
                </div>
                
                <div className="ml-11">
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${porcentaje}%` }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                      className={`h-full rounded-full bg-gradient-to-r ${getColorByTipo(beca.tipo)}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-400 text-sm">No hay datos de visitas disponibles</p>
          <p className="text-gray-300 text-[10px] mt-1">Las visitas solo se registran cuando estudiantes acceden a las becas</p>
        </div>
      )}
    </div>
  );
};

export default MostVisitedBecas;
