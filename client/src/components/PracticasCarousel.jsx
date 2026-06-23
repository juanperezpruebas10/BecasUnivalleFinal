import React, { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';
import API_URL from '../config/api';
import practicaService from '../services/practicaService';

const API_BASE = API_URL.replace('/api', '');

const PracticasCarousel = () => {
  const [practicas, setPracticas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPracticas();
  }, []);

  const loadPracticas = async () => {
    try {
      const data = await practicaService.getAll();
      setPracticas(data);
    } catch (error) {
      console.error('Error cargando prácticas internacionales:', error);
      setPracticas([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
        <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
      </section>
    );
  }

  if (!practicas.length) {
    return (
      <section className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
        <ImageOff className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="text-[#967292] font-black uppercase tracking-widest text-[11px] mb-2">
          Prácticas Internacionales
        </h3>
        <p className="text-sm text-gray-400">Aún no hay experiencias registradas.</p>
      </section>
    );
  }

  const carouselItems = practicas.length > 1 ? [...practicas, ...practicas] : practicas;

  return (
    <section className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 overflow-hidden">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h3 className="text-[#967292] font-black uppercase italic tracking-widest text-[11px] mb-1">
            Prácticas Internacionales
          </h3>
          <p className="text-gray-400 text-[10px]">Experiencias registradas por el equipo académico</p>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className={`flex gap-5 ${practicas.length > 1 ? 'animate-practicas-carousel' : ''}`}>
          {carouselItems.map((practica, index) => (
            <article
              key={`${practica.id}-${index}`}
              className="min-w-[260px] sm:min-w-[320px] lg:min-w-[360px] bg-[#F4F4F4] rounded-2xl overflow-hidden border border-gray-100"
            >
              <img
                src={`${API_BASE}${practica.imagen}`}
                alt="Práctica internacional"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-700 font-semibold leading-relaxed line-clamp-3">
                  {practica.texto}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PracticasCarousel;
