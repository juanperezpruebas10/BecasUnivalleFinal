import React, { useEffect, useState } from 'react';
import { Trophy, BookOpen, Users, Link as LinkIcon, ImageOff } from 'lucide-react';
import API_URL from '../config/api';
import premioService from '../services/premioService';

const API_BASE = API_URL.replace('/api', '');

const PremiosCarousel = ({ ambito, refreshKey }) => {
  const [premios, setPremios] = useState([]);
  const [loading, setLoading] = useState(true);

  const titulo = ambito === 'internacional' ? 'Premios Internacionales' : 'Premios Nacionales';
  const subtitulo =
    ambito === 'internacional'
      ? 'Reconocimientos obtenidos a nivel internacional'
      : 'Reconocimientos obtenidos a nivel nacional';

  useEffect(() => {
    load();
  }, [refreshKey]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await premioService.getAll();
      setPremios(data.filter((p) => p.ambito === ambito));
    } catch {
      setPremios([]);
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

  if (!premios.length) {
    return (
      <section className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
        <ImageOff className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="text-[#967292] font-black uppercase tracking-widest text-[11px] mb-2">{titulo}</h3>
        <p className="text-sm text-gray-400">Aún no hay premios registrados.</p>
      </section>
    );
  }

  const items = premios.length > 1 ? [...premios, ...premios] : premios;

  return (
    <section className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 overflow-hidden">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h3 className="text-[#967292] font-black uppercase italic tracking-widest text-[11px] mb-1">
            {titulo}
          </h3>
          <p className="text-gray-400 text-[10px]">{subtitulo}</p>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className={`flex gap-5 ${premios.length > 1 ? 'animate-practicas-carousel' : ''}`}>
          {items.map((premio, index) => {
            const card = (
              <article
                key={`${premio.id}-${index}`}
                className={`min-w-[260px] sm:min-w-[320px] lg:min-w-[360px] bg-[#F4F4F4] rounded-2xl overflow-hidden border border-gray-100 flex flex-col ${
                  premio.link ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
                }`}
              >
                {premio.imagen ? (
                  <img
                    src={`${API_BASE}${premio.imagen}`}
                    alt={premio.titulo}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-[#967292]/20 to-[#614B59]/20 flex items-center justify-center">
                    <Trophy size={48} className="text-[#967292]/40" strokeWidth={1} />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col gap-1">
                  <p className="text-sm font-black text-gray-800 leading-snug line-clamp-2">{premio.titulo}</p>
                  <p className="text-[11px] text-[#967292] font-bold">{premio.premio}</p>
                  <p className="text-[10px] text-gray-400 line-clamp-1">
                    <BookOpen size={9} className="inline mr-1" />{premio.carrera}
                  </p>
                  <p className="text-[10px] text-gray-400 line-clamp-1">
                    <Users size={9} className="inline mr-1" />{premio.miembros}
                  </p>
                  {premio.link && (
                    <span className="mt-1 text-[9px] text-[#967292] font-black uppercase flex items-center gap-1">
                      <LinkIcon size={9} /> Ver más
                    </span>
                  )}
                </div>
              </article>
            );

            return premio.link ? (
              <a
                key={`link-${premio.id}-${index}`}
                href={premio.link}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                {card}
              </a>
            ) : (
              <React.Fragment key={`frag-${premio.id}-${index}`}>{card}</React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PremiosCarousel;
