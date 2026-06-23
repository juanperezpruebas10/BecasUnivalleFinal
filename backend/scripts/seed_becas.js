require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const pool = require('../src/config/database');

const becas = [
  // ── ENERO–ABRIL 2026 (actualizar existentes + nuevas) ──────────────────────
  {
    titulo: 'Thailand International Postgraduate Programme (TIPP)',
    tipo: 'beca', institucion: 'Thailand International Cooperation Agency (TICA)',
    pais: 'Tailandia', area: 'Posgrado',
    descripcion: 'Becas para cursar programas de posgrado en Tailandia ofrecidas por TICA a estudiantes internacionales.',
    link_oficial: 'https://tica-thaigov.mfa.go.th/en/page/tipp'
  },
  {
    titulo: 'Remote Sensing & GIS - China Scholarship Council (CSC)',
    tipo: 'beca', institucion: 'China Scholarship Council (CSC) - RCSSTEAP',
    pais: 'China', area: 'Tecnología',
    descripcion: 'Becas en áreas de Remote Sensing, GIS, GNSS, Space Project Management y Micro-satellite Technology.',
    link_oficial: 'https://www.campuschina.org/content/details3_74776.html'
  },
  {
    titulo: 'Becas de Movilidad CUMex – AUIP (Segundo Plazo)',
    tipo: 'beca', institucion: 'CUMex – AUIP',
    pais: 'México', area: 'Posgrado',
    descripcion: 'Programa de movilidad académica para estudios de posgrado en universidades mexicanas miembros de CUMex.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=3a7aa98baf&e=60ad82fd0a'
  },
  {
    titulo: 'Programa Colaborativo Iberoamericano de Formación Doctoral en IA 2026',
    tipo: 'beca', institucion: 'Universidad de Granada – AUIP',
    pais: 'España', area: 'Tecnología',
    descripcion: 'Becas para realizar el Programa Colaborativo Iberoamericano de Formación Doctoral en Inteligencia Artificial 2026.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=3a05ec0d0c&e=60ad82fd0a'
  },
  {
    titulo: 'Becas Postgrado ITESO México 2026',
    tipo: 'beca', institucion: 'ITESO',
    pais: 'México', area: 'Posgrado',
    descripcion: 'Becas para cursar programas de Postgrado en el Instituto Tecnológico y de Estudios Superiores de Occidente (ITESO), México 2026.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=6f37197669&e=60ad82fd0a'
  },
  {
    titulo: 'Doctorado en Ciencias de la Salud 2026 – UAM AUIP',
    tipo: 'beca', institucion: 'Universidad Autónoma de Manizales – AUIP',
    pais: 'Colombia', area: 'Salud',
    descripcion: 'Becas para cursar el Programa de Doctorado en Ciencias de la Salud 2026 en la Universidad Autónoma de Manizales.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=cec5524f17&e=60ad82fd0a'
  },
  {
    titulo: 'Programa de Becas de Maestría – USC 2026',
    tipo: 'beca', institucion: 'Universidade de Santiago de Compostela – AUIP',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Programa de Becas de Maestría en la Universidad de Santiago de Compostela para el año 2026.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=c4f1ef3050&e=60ad82fd0a'
  },
  {
    titulo: 'Ayudas Máster Universitario – UPV 2026',
    tipo: 'beca', institucion: 'Universitat Politècnica de València – AUIP',
    pais: 'España', area: 'Ingeniería',
    descripcion: 'Ayudas para la realización de Máster Universitario en la Universitat Politècnica de València 2026.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=f655d0da2a&e=60ad82fd0a'
  },
  {
    titulo: 'Ayudas Máster Universitario – URJC 2026',
    tipo: 'beca', institucion: 'Universidad Rey Juan Carlos – AUIP',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Ayudas para la realización de Máster Universitario en la Universidad Rey Juan Carlos 2026.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=19acfd2ec6&e=60ad82fd0a'
  },
  {
    titulo: 'Becas Máster Universitario – UAH 2026',
    tipo: 'beca', institucion: 'Universidad de Alcalá – AUIP',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Becas para cursar Máster Universitario en la Universidad de Alcalá 2026.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=08cec58258&e=60ad82fd0a'
  },
  {
    titulo: 'Programa de Becas de Postgrado de Andalucía "Federico García Lorca" 2026',
    tipo: 'beca', institucion: 'AUIP – Universidades Públicas de Andalucía',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Becas para cursar maestrías en Universidades Públicas de Andalucía. Programa Federico García Lorca 2026.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=d58e26c091&e=60ad82fd0a'
  },
  {
    titulo: 'Becas Maestrías – Universidad Carlos III de Madrid',
    tipo: 'beca', institucion: 'AUIP – U. Carlos III Madrid',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Becas para cursar Maestrías en la Universidad Carlos III de Madrid a través del programa AUIP.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=ee963d2637&e=60ad82fd0a'
  },
  {
    titulo: 'Becas ICETEX para Cursos de Posgrado',
    tipo: 'beca', institucion: 'ICETEX',
    pais: 'Colombia', area: 'Posgrado',
    descripcion: 'Programa de becas del ICETEX para cursar programas de posgrado en Colombia para estudiantes extranjeros.',
    link_oficial: 'https://web.icetex.gov.co/becas/beca-colombia-extranjeros'
  },
  {
    titulo: 'Becas de Posgrado – Universidad de Valencia AUIP',
    tipo: 'beca', institucion: 'AUIP – Universidad de Valencia',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Becas para cursar programas de Posgrado en la Universidad de Valencia a través de AUIP.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=75ab7ad6d2&e=60ad82fd0a'
  },
  {
    titulo: 'Diplomado de Estudios Latinoamericanos (DELA) 2026-2027',
    tipo: 'curso', institucion: 'Institut des Hautes Études de l\'Amérique Latine (IHEAL) – Sorbonne Nouvelle',
    pais: 'Francia', area: 'Ciencias Sociales',
    descripcion: 'Diplomado de Estudios Latinoamericanos (DELA) ciclo 2026-2027, ofrecido por la Université Sorbonne Nouvelle en modalidad a distancia.',
    link_oficial: 'https://www.sorbonne-nouvelle.fr/diplome-d-etudes-latino-americaines-dela-a-distance-38655.kjsp'
  },
  {
    titulo: 'Becas Másteres Universitarios – UPNA 2026',
    tipo: 'beca', institucion: 'Universidad Pública de Navarra',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Becas para cursar Másteres Universitarios en la Universidad Pública de Navarra 2026.',
    link_oficial: 'https://www.unavarra.es/tramitacion-academica/becas-ayudas-y-premios/todas-las-becas?contentId=234291'
  },
  {
    titulo: 'Programa Magallanes de Movilidad Académica Internacional 2026',
    tipo: 'beca', institucion: 'AUIP',
    pais: 'España', area: 'Movilidad Académica',
    descripcion: 'Programa Magallanes de Movilidad Académica Internacional 2026 para profesores, investigadores y estudiantes.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=75ae2b1602&e=60ad82fd0a'
  },
  {
    titulo: 'Becas de Doctorado – Universidad de Murcia',
    tipo: 'beca', institucion: 'AUIP – Universidad de Murcia',
    pais: 'España', area: 'Doctorado',
    descripcion: 'Becas de Doctorado en la Universidad de Murcia a través del programa AUIP.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=48fd1b8802&e=60ad82fd0a'
  },
  {
    titulo: 'Boletín INDESGUA Abril 2026 – Ofertas Internacionales',
    tipo: 'beca', institucion: 'INDESGUA',
    pais: 'Guatemala', area: 'Oferta Global',
    descripcion: 'Boletín INDESGUA Abril 2026 con oferta global de becas internacionales para latinoamericanos.',
    link_oficial: 'https://indesgua.org.gt/wp-content/plugins/download-attachments/includes/download.php?id=21924'
  },
  {
    titulo: 'Programa de Estudantes-Convênio de Pre-Graduação (PEC-G)',
    tipo: 'beca', institucion: 'Ministerio de Relaciones Exteriores de Brasil',
    pais: 'Brasil', area: 'Pregrado',
    descripcion: 'Programa de becas del gobierno de Brasil para estudiantes de pregrado de países en desarrollo.',
    link_oficial: 'https://www.gov.br/mre/pt-br/assuntos/cultura-e-educacao/temas-educacionais/programas-de-estudo-para-estrangeiros/pec-g/'
  },
  // ── ENERO–DICIEMBRE 2025 (nuevas) ──────────────────────────────────────────
  {
    titulo: 'Government of Ireland International Education Scholarships',
    tipo: 'beca', institucion: 'Gobierno de Irlanda',
    pais: 'Irlanda', area: 'Posgrado',
    descripcion: 'Becas del Gobierno de Irlanda para cursar maestrías, diplomas de posgrado o PhD en universidades irlandesas.',
    link_oficial: 'https://hea.ie/policy/internationalisation/goi-ies/'
  },
  {
    titulo: 'Fulbright Scholar-in-Residence – Profesionales de la Salud',
    tipo: 'beca', institucion: 'Fulbright',
    pais: 'Estados Unidos', area: 'Salud',
    descripcion: 'Beca completa Fulbright Scholar-in-Residence para profesionales de la salud en Estados Unidos.',
    link_oficial: 'https://foreign.fulbrightonline.org/apply'
  },
  {
    titulo: 'Becas KOICA – Ministerio de Educación Corea',
    tipo: 'beca', institucion: 'Ministerio de Educación de Corea – KOICA',
    pais: 'Corea del Sur', area: 'Posgrado',
    descripcion: 'Becas KOICA del Gobierno de Corea del Sur para estudiantes internacionales.',
    link_oficial: 'https://www.studyinkorea.go.kr/es/sub/gks/allnew_invite.do'
  },
  {
    titulo: 'Brunei Darussalam Scholarship',
    tipo: 'beca', institucion: 'Ministerio de Educación de Brunéi',
    pais: 'Brunéi', area: 'Posgrado',
    descripcion: 'Beca del gobierno de Brunéi Darussalam para estudiantes internacionales a nivel de pregrado y posgrado.',
    link_oficial: 'https://www.mfa.gov.bn/Pages/online-bdgs.aspx'
  },
  {
    titulo: 'Becas Fundación Carolina – Postgrado 2025',
    tipo: 'beca', institucion: 'Fundación Carolina',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Becas de la Fundación Carolina para realizar estudios de postgrado en universidades españolas.',
    link_oficial: 'https://www.fundacioncarolina.es/formacion/presentacion/'
  },
  {
    titulo: 'Becas Türkiye – Programa de Posgrado',
    tipo: 'beca', institucion: 'Ministerio de Educación de Turquía',
    pais: 'Turquía', area: 'Posgrado',
    descripcion: 'Programa de becas del gobierno de Turquía para estudiantes internacionales de posgrado.',
    link_oficial: 'https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-programs'
  },
  {
    titulo: 'Programa de Becas de Maestría – USC 2025',
    tipo: 'beca', institucion: 'Universidade de Santiago de Compostela – AUIP',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Programa de Becas de Maestría en la Universidad de Santiago de Compostela 2025.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=9fda4fc94e&e=60ad82fd0a'
  },
  {
    titulo: 'Becas GKS – Corea del Sur 2025',
    tipo: 'beca', institucion: 'Ministerio de Educación de Corea',
    pais: 'Corea del Sur', area: 'Posgrado',
    descripcion: 'Programa de Becas de Maestría del Gobierno de Corea (GKS) para estudiantes internacionales 2025.',
    link_oficial: 'https://www.studyinkorea.go.kr/es/main.do'
  },
  {
    titulo: 'Ayudas Máster Universitario – UPV 2025',
    tipo: 'beca', institucion: 'Universitat Politècnica de València – AUIP',
    pais: 'España', area: 'Ingeniería',
    descripcion: 'Ayudas para la realización de Máster Universitario en la Universitat Politècnica de València 2025.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=326de89a38&e=60ad82fd0a'
  },
  {
    titulo: 'Becas Gobierno de Rumanía – Posgrado 2025',
    tipo: 'beca', institucion: 'Ministerio de Asuntos Exteriores de Rumanía',
    pais: 'Rumania', area: 'Posgrado',
    descripcion: 'Becas del gobierno de Rumanía para estudiantes internacionales de posgrado 2025-2026.',
    link_oficial: 'https://scholarships.studyinromania.gov.ro/'
  },
  {
    titulo: 'Scholarships for International Students – Italia 2025/26',
    tipo: 'beca', institucion: 'Gobierno de Italia',
    pais: 'Italia', area: 'Posgrado',
    descripcion: 'Becas del gobierno italiano para estudiantes internacionales para el año académico 2025/26.',
    link_oficial: 'https://studyinitaly.esteri.it/en'
  },
  {
    titulo: 'Women in STEM Scholarship – British Council',
    tipo: 'beca', institucion: 'British Council',
    pais: 'Reino Unido', area: 'STEM',
    descripcion: 'Becas para mujeres en carreras de Ciencia, Tecnología, Ingeniería y Matemáticas en el Reino Unido.',
    link_oficial: 'https://www.britishcouncil.org/study-work-abroad/in-uk/scholarship-women-stem'
  },
  {
    titulo: 'Máster en Banca y Mercados Financieros – Fundación UCEIF 2025',
    tipo: 'beca', institucion: 'Fundación UCEIF – AUIP',
    pais: 'España', area: 'Finanzas',
    descripcion: 'Becas para cursar el Máster en Banca y Mercados Financieros en España a través de Fundación UCEIF y AUIP.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=c3e4f0f75a&e=60ad82fd0a'
  },
  {
    titulo: 'Programa de Doctorado Interdisciplinario – BREATH',
    tipo: 'beca', institucion: 'BREATH – Université d\'Angers',
    pais: 'Francia', area: 'Doctorado',
    descripcion: 'Programa de Doctorado Interdisciplinario BREATH en la Universidad de Angers, Francia.',
    link_oficial: 'https://breath.univ-angers.fr/en/about-breath/presentation.html'
  },
  {
    titulo: 'Becas OEA – Organización de Estados Americanos',
    tipo: 'beca', institucion: 'Organización de Estados Americanos (OEA)',
    pais: 'Estados Unidos', area: 'Posgrado',
    descripcion: 'Programa de becas académicas de la OEA para cursar programas de posgrado en países miembros.',
    link_oficial: 'https://www.oas.org/es/becas/'
  },
  {
    titulo: 'Becas Másteres Universitarios – UPNA 2025',
    tipo: 'beca', institucion: 'Universidad Pública de Navarra',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Becas para cursar Másteres Universitarios en la Universidad Pública de Navarra 2025.',
    link_oficial: 'https://www.unavarra.es/tramitacion-academica/becas-ayudas-y-premios/todas-las-becas?contentId=234291'
  },
  {
    titulo: 'Becas de Maestría – Azerbaiyán',
    tipo: 'beca', institucion: 'Ministerio de Educación de Azerbaiyán',
    pais: 'Azerbaiyán', area: 'Posgrado',
    descripcion: 'Programa de becas del gobierno de Azerbaiyán para estudiantes internacionales de maestría.',
    link_oficial: 'https://studyinazerbaijan.edu.az/'
  },
  {
    titulo: 'Becas de Posgrado – Universidad de Valencia 2025',
    tipo: 'beca', institucion: 'AUIP – Universidad de Valencia',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Becas para cursar programas de Posgrado en la Universidad de Valencia 2025 a través de AUIP.',
    link_oficial: 'https://www.uv.es/uvweb/universidad/es/estudios-postgrado/masteres-oficiales/becas-ayudas/universidad-valencia/becas-uv-auip-1285978856967.html'
  },
  {
    titulo: 'ETH Zurich – Excellence Scholarship & Opportunity Programme (ESOP)',
    tipo: 'beca', institucion: 'ETH Zurich',
    pais: 'Suiza', area: 'Ingeniería',
    descripcion: 'Programa Excellence Scholarship & Opportunity Programme (ESOP) de ETH Zurich para estudiantes de maestría.',
    link_oficial: 'https://ethz.ch/students/en/studies/financial/scholarships/excellencescholarship.html'
  },
  {
    titulo: 'Programa de Estudantes-Convênio de Pós-Graduação (PEC-PG)',
    tipo: 'beca', institucion: 'Gobierno de Brasil – CAPES/CNPq',
    pais: 'Brasil', area: 'Doctorado',
    descripcion: 'Programa de becas para estudiantes de doctorado y maestría de países en desarrollo en Brasil.',
    link_oficial: 'https://www.gov.br/capes/pt-br/acesso-a-informacao/acoes-e-programas/bolsas/bolsas-e-auxilios-internacionais/encontre-aqui/paises/multinacional/programa-de-estudantes-convenio-de-pos-graduacao-pec-pg'
  },
  {
    titulo: 'Becas Vanier – Canadá',
    tipo: 'beca', institucion: 'Gobierno de Canadá',
    pais: 'Canadá', area: 'Doctorado',
    descripcion: 'Programa de becas Vanier del gobierno de Canadá para estudiantes de doctorado de alto rendimiento.',
    link_oficial: 'https://vanier.gc.ca/en/eligibility-admissibilite.html'
  },
  {
    titulo: 'Oxford Optiver Foundation Scholarship 2026',
    tipo: 'beca', institucion: 'University of Oxford – Optiver Foundation',
    pais: 'Reino Unido', area: 'Posgrado',
    descripcion: 'Beca de la Fundación Optiver para estudios de posgrado en la Universidad de Oxford 2026.',
    link_oficial: 'https://scholarshipunion.com/oxford-optiver-foundation-scholarship-2026-in-uk/'
  },
  {
    titulo: 'GCUB Programa de Movilidad Internacional – 4ta Edición 2025',
    tipo: 'beca', institucion: 'Grupo Coimbra de Universidades Brasileras (GCUB)',
    pais: 'Brasil', area: 'Movilidad Académica',
    descripcion: 'Cuarta edición del Programa de Movilidad Internacional GCUB-Mob para estudiantes de posgrado.',
    link_oficial: 'https://www.gcub.org.br/programas/ativos/fourth-edition-of-the-gcub-international-mobility-program-gcub-mob-gcub-mob-call-for-applications-no-001-2025/'
  },
  {
    titulo: 'AUIP–CRISCOS Movilidad Internacional de Profesores e Investigadores',
    tipo: 'intercambio', institucion: 'AUIP – CRISCOS',
    pais: 'España', area: 'Movilidad Académica',
    descripcion: 'Programa de movilidad internacional para profesores, investigadores y alumnos a través de AUIP y CRISCOS.',
    link_oficial: 'https://auip.org/es/becas-auip/2944-becas-auip310'
  },
  {
    titulo: 'Becas AGCID Chile – Cooperación Sur Sur 2026',
    tipo: 'beca', institucion: 'Agencia Chilena de Cooperación Internacional (AGCID)',
    pais: 'Chile', area: 'Posgrado',
    descripcion: 'Programa de Becas de Cooperación Sur Sur de la República de Chile, Convocatoria 2026.',
    link_oficial: 'https://www.agci.cl/index.php/becas/becas-para-extranjeros/105-encuentra-tu-beca/1694-infobecaextr-4/?tipo=2&idNew=314'
  },
];

async function seedBecas() {
  console.log(`\n🌱 Iniciando carga de ${becas.length} becas...\n`);
  let actualizadas = 0;
  let insertadas = 0;
  let errores = 0;

  for (const beca of becas) {
    try {
      // Buscar si ya existe una beca con ese título
      const [existing] = await pool.execute(
        'SELECT id FROM becas WHERE titulo = ? AND activo = 1 LIMIT 1',
        [beca.titulo]
      );

      if (existing.length > 0) {
        // Actualizar registro existente
        await pool.execute(
          `UPDATE becas SET
            institucion = ?, pais = ?, area = ?,
            descripcion = ?, link_oficial = ?
           WHERE id = ?`,
          [beca.institucion, beca.pais, beca.area, beca.descripcion, beca.link_oficial, existing[0].id]
        );
        console.log(`  ✅ Actualizada: ${beca.titulo}`);
        actualizadas++;
      } else {
        // Insertar nueva
        await pool.execute(
          `INSERT INTO becas (tipo, titulo, institucion, pais, area, descripcion, link_oficial, creado_por, activo)
           VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)`,
          [beca.tipo, beca.titulo, beca.institucion, beca.pais, beca.area, beca.descripcion, beca.link_oficial]
        );
        console.log(`  ➕ Insertada: ${beca.titulo}`);
        insertadas++;
      }
    } catch (err) {
      console.error(`  ❌ Error en "${beca.titulo}": ${err.message}`);
      errores++;
    }
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   ✅ Actualizadas: ${actualizadas}`);
  console.log(`   ➕ Insertadas:   ${insertadas}`);
  console.log(`   ❌ Errores:      ${errores}`);
  process.exit(0);
}

seedBecas().catch(err => { console.error(err); process.exit(1); });
