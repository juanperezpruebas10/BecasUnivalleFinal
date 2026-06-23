require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const pool = require('../src/config/database');

const becas = [
  // ── ENERO–ABRIL 2026 ────────────────────────────────────────────────────────
  { titulo: 'Thailand International Postgraduate Programme (TIPP)',
    tipo: 'beca', institucion: 'Thailand International Cooperation Agency (TICA)',
    pais: 'Tailandia', area: 'Posgrado',
    descripcion: 'Becas para cursar programas de posgrado en universidades tailandesas. TICA ofrece financiamiento completo para estudiantes internacionales seleccionados.',
    link_oficial: 'https://tica-thaigov.mfa.go.th/en/page/tipp', logo: '/uploads/beca_tica.png' },

  { titulo: 'Remote Sensing & GIS – China Scholarship Council (CSC)',
    tipo: 'beca', institucion: 'China Scholarship Council (CSC) – RCSSTEAP',
    pais: 'China', area: 'Tecnología',
    descripcion: 'Becas en áreas de Remote Sensing, GIS, GNSS, Space Project Management y Micro-satellite Technology en el Regional Centre for Space Science.',
    link_oficial: 'https://www.campuschina.org/content/details3_74776.html', logo: '/uploads/beca_csc_china.png' },

  { titulo: 'Becas de Movilidad CUMex – AUIP (Segundo Plazo)',
    tipo: 'beca', institucion: 'CUMex – AUIP',
    pais: 'México', area: 'Posgrado',
    descripcion: 'Programa de movilidad académica para estudios de posgrado en universidades mexicanas del Consorcio de Universidades Mexicanas (CUMex).',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=3a7aa98baf&e=60ad82fd0a', logo: '/uploads/beca_cumex_auip.png' },

  { titulo: 'Programa Colaborativo Iberoamericano de Formación Doctoral en IA 2026',
    tipo: 'beca', institucion: 'Universidad de Granada – AUIP',
    pais: 'España', area: 'Tecnología',
    descripcion: 'Becas para realizar el Programa Colaborativo Iberoamericano de Formación Doctoral en Inteligencia Artificial 2026, ofrecido por la Universidad de Granada y AUIP.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=3a05ec0d0c&e=60ad82fd0a', logo: '/uploads/beca_granada_ia.png' },

  { titulo: 'Becas Postgrado ITESO México 2026',
    tipo: 'beca', institucion: 'ITESO',
    pais: 'México', area: 'Posgrado',
    descripcion: 'Becas para cursar programas de Postgrado en el Instituto Tecnológico y de Estudios Superiores de Occidente (ITESO), México 2026.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=6f37197669&e=60ad82fd0a', logo: '/uploads/beca_iteso.png' },

  { titulo: 'Doctorado en Ciencias de la Salud 2026 – UAM AUIP',
    tipo: 'beca', institucion: 'Universidad Autónoma de Manizales – AUIP',
    pais: 'Colombia', area: 'Salud',
    descripcion: 'Becas para cursar el Programa de Doctorado en Ciencias de la Salud 2026 en la Universidad Autónoma de Manizales, Colombia.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=cec5524f17&e=60ad82fd0a', logo: '/uploads/beca_manizales.png' },

  { titulo: 'Programa de Becas de Maestría – USC 2026',
    tipo: 'beca', institucion: 'Universidade de Santiago de Compostela – AUIP',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Programa de Becas de Maestría en la Universidad de Santiago de Compostela para el año 2026, en convenio con AUIP.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=c4f1ef3050&e=60ad82fd0a', logo: '/uploads/beca_usc.png' },

  { titulo: 'Ayudas Máster Universitario – UPV 2026',
    tipo: 'beca', institucion: 'Universitat Politècnica de València – AUIP',
    pais: 'España', area: 'Ingeniería',
    descripcion: 'Ayudas para la realización de Máster Universitario en la Universitat Politècnica de València 2026, en convenio con AUIP.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=f655d0da2a&e=60ad82fd0a', logo: '/uploads/beca_upv_2026.png' },

  { titulo: 'Ayudas Máster Universitario – URJC 2026',
    tipo: 'beca', institucion: 'Universidad Rey Juan Carlos – AUIP',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Ayudas para la realización de Máster Universitario en la Universidad Rey Juan Carlos 2026, en convenio con AUIP.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=19acfd2ec6&e=60ad82fd0a', logo: '/uploads/beca_urjc.png' },

  { titulo: 'Becas Máster Universitario – UAH 2026',
    tipo: 'beca', institucion: 'Universidad de Alcalá – AUIP',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Becas para cursar Máster Universitario en la Universidad de Alcalá 2026, en convenio con AUIP.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=08cec58258&e=60ad82fd0a', logo: '/uploads/beca_alcala_2026.png' },

  { titulo: 'Programa de Becas de Postgrado de Andalucía "Federico García Lorca" 2026',
    tipo: 'beca', institucion: 'AUIP – Universidades Públicas de Andalucía',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Becas para cursar maestrías en Universidades Públicas de Andalucía. Programa Federico García Lorca 2026 financiado por la Junta de Andalucía.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=d58e26c091&e=60ad82fd0a', logo: '/uploads/beca_garcia_lorca_2026.png' },

  { titulo: 'Becas Maestrías – Universidad Carlos III de Madrid 2026',
    tipo: 'beca', institucion: 'AUIP – U. Carlos III Madrid',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Becas para cursar Maestrías en la Universidad Carlos III de Madrid a través del programa AUIP 2026.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=ee963d2637&e=60ad82fd0a', logo: '/uploads/beca_carlos3_2026.png' },

  { titulo: 'Becas ICETEX para Cursos de Posgrado',
    tipo: 'beca', institucion: 'ICETEX',
    pais: 'Colombia', area: 'Posgrado',
    descripcion: 'Programa de becas del ICETEX para estudiantes extranjeros que deseen cursar programas de posgrado en Colombia.',
    link_oficial: 'https://web.icetex.gov.co/becas/beca-colombia-extranjeros', logo: '/uploads/beca_icetex.png' },

  { titulo: 'Becas de Posgrado – Universidad de Valencia AUIP 2026',
    tipo: 'beca', institucion: 'AUIP – Universidad de Valencia',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Becas para cursar programas de Posgrado en la Universidad de Valencia a través de la Asociación Universitaria Iberoamericana de Posgrado (AUIP) 2026.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=75ab7ad6d2&e=60ad82fd0a', logo: '/uploads/beca_valencia_auip_2026.png' },

  { titulo: 'Diplomado de Estudios Latinoamericanos (DELA) 2026-2027',
    tipo: 'curso', institucion: 'IHEAL – Université Sorbonne Nouvelle',
    pais: 'Francia', area: 'Ciencias Sociales',
    descripcion: 'Diplomado de Estudios Latinoamericanos (DELA) ciclo 2026-2027, ofrecido por el Instituto de Altos Estudios de América Latina en modalidad a distancia.',
    link_oficial: 'https://www.sorbonne-nouvelle.fr/diplome-d-etudes-latino-americaines-dela-a-distance-38655.kjsp', logo: '/uploads/beca_dela.png' },

  { titulo: 'Becas Másteres Universitarios – UPNA 2026',
    tipo: 'beca', institucion: 'Universidad Pública de Navarra',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Becas para cursar Másteres Universitarios en la Universidad Pública de Navarra durante el curso 2026.',
    link_oficial: 'https://www.unavarra.es/tramitacion-academica/becas-ayudas-y-premios/todas-las-becas?contentId=234291', logo: '/uploads/beca_upna_2026.png' },

  { titulo: 'Programa Magallanes de Movilidad Académica Internacional 2026',
    tipo: 'beca', institucion: 'AUIP',
    pais: 'España', area: 'Movilidad Académica',
    descripcion: 'Programa Magallanes de Movilidad Académica Internacional 2026 para profesores, investigadores y estudiantes iberoamericanos.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=75ae2b1602&e=60ad82fd0a', logo: '/uploads/beca_magallanes.png' },

  { titulo: 'Becas de Doctorado – Universidad de Murcia',
    tipo: 'beca', institucion: 'AUIP – Universidad de Murcia',
    pais: 'España', area: 'Doctorado',
    descripcion: 'Becas de Doctorado en la Universidad de Murcia a través del programa AUIP para estudiantes iberoamericanos.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=48fd1b8802&e=60ad82fd0a', logo: '/uploads/beca_murcia.png' },

  { titulo: 'Boletín INDESGUA Abril 2026 – Ofertas Internacionales',
    tipo: 'beca', institucion: 'INDESGUA',
    pais: 'Guatemala', area: 'Oferta Global',
    descripcion: 'Boletín INDESGUA Abril 2026 con oferta global de becas internacionales para latinoamericanos.',
    link_oficial: 'https://indesgua.org.gt/wp-content/plugins/download-attachments/includes/download.php?id=21924', logo: '/uploads/beca_indesgua.png' },

  { titulo: 'Programa de Estudantes-Convênio de Pre-Graduação (PEC-G)',
    tipo: 'beca', institucion: 'Ministerio de Relaciones Exteriores de Brasil',
    pais: 'Brasil', area: 'Pregrado',
    descripcion: 'Programa del gobierno de Brasil que ofrece oportunidades de formación a nivel de pregrado a ciudadanos de países en desarrollo.',
    link_oficial: 'https://www.gov.br/mre/pt-br/assuntos/cultura-e-educacao/temas-educacionais/programas-de-estudo-para-estrangeiros/pec-g/', logo: '/uploads/beca_pecg.png' },

  // ── ENERO–DICIEMBRE 2025 ────────────────────────────────────────────────────
  { titulo: 'Government of Ireland International Education Scholarships',
    tipo: 'beca', institucion: 'Gobierno de Irlanda',
    pais: 'Irlanda', area: 'Posgrado',
    descripcion: 'Becas del Gobierno de Irlanda para cursar maestrías, diplomas de posgrado o PhD en universidades irlandesas de excelencia.',
    link_oficial: 'https://hea.ie/policy/internationalisation/goi-ies/', logo: '/uploads/beca_ireland.png' },

  { titulo: 'Fulbright Scholar-in-Residence – Profesionales de la Salud',
    tipo: 'beca', institucion: 'Fulbright',
    pais: 'Estados Unidos', area: 'Salud',
    descripcion: 'Beca completa Fulbright Scholar-in-Residence para profesionales de la salud. Incluye financiamiento total para estancia en universidades de EE.UU.',
    link_oficial: 'https://foreign.fulbrightonline.org/apply', logo: '/uploads/beca_fulbright.png' },

  { titulo: 'Becas KOICA – Ministerio de Educación Corea',
    tipo: 'beca', institucion: 'Ministerio de Educación de Corea – KOICA',
    pais: 'Corea del Sur', area: 'Posgrado',
    descripcion: 'Becas KOICA del Gobierno de Corea del Sur para estudiantes internacionales de países en desarrollo.',
    link_oficial: 'https://www.studyinkorea.go.kr/es/sub/gks/allnew_invite.do', logo: '/uploads/beca_koica.png' },

  { titulo: 'Brunei Darussalam Scholarship',
    tipo: 'beca', institucion: 'Ministerio de Educación de Brunéi',
    pais: 'Brunéi', area: 'Posgrado',
    descripcion: 'Beca del gobierno de Brunéi Darussalam para estudiantes internacionales a nivel de pregrado y posgrado en universidades del país.',
    link_oficial: 'https://www.mfa.gov.bn/Pages/online-bdgs.aspx', logo: '/uploads/beca_brunei.png' },

  { titulo: 'Becas Fundación Carolina – Postgrado 2025',
    tipo: 'beca', institucion: 'Fundación Carolina',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Becas de la Fundación Carolina para realizar estudios de postgrado y doctorado en universidades y centros superiores de investigación españoles.',
    link_oficial: 'https://www.fundacioncarolina.es/formacion/presentacion/', logo: '/uploads/beca_carolina.png' },

  { titulo: 'Becas Türkiye – Programa de Posgrado',
    tipo: 'beca', institucion: 'Ministerio de Educación de Turquía',
    pais: 'Turquía', area: 'Posgrado',
    descripcion: 'Programa de becas del gobierno de Turquía (Türkiye Scholarships) para estudiantes internacionales de pregrado, maestría y doctorado.',
    link_oficial: 'https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-programs', logo: '/uploads/beca_turkiye.png' },

  { titulo: 'Programa de Becas de Maestría – USC 2025',
    tipo: 'beca', institucion: 'Universidade de Santiago de Compostela – AUIP',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Programa de Becas de Maestría en la Universidad de Santiago de Compostela 2025, en convenio con AUIP.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=9fda4fc94e&e=60ad82fd0a', logo: '/uploads/beca_usc.png' },

  { titulo: 'Becas GKS – Corea del Sur 2025',
    tipo: 'beca', institucion: 'Ministerio de Educación de Corea',
    pais: 'Corea del Sur', area: 'Posgrado',
    descripcion: 'Programa de Becas del Gobierno de Corea (GKS) para cursar maestrías en universidades coreanas de primer nivel.',
    link_oficial: 'https://www.studyinkorea.go.kr/es/main.do', logo: '/uploads/beca_gks_korea.png' },

  { titulo: 'Ayudas Máster Universitario – UPV 2025',
    tipo: 'beca', institucion: 'Universitat Politècnica de València – AUIP',
    pais: 'España', area: 'Ingeniería',
    descripcion: 'Ayudas para la realización de Máster Universitario en la Universitat Politècnica de València 2025, en convenio con AUIP.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=326de89a38&e=60ad82fd0a', logo: '/uploads/beca_upv_2025.png' },

  { titulo: 'Becas Gobierno de Rumanía – Posgrado 2025',
    tipo: 'beca', institucion: 'Ministerio de Asuntos Exteriores de Rumanía',
    pais: 'Rumania', area: 'Posgrado',
    descripcion: 'Becas del gobierno de Rumanía para estudiantes internacionales de posgrado para el año académico 2025-2026.',
    link_oficial: 'https://scholarships.studyinromania.gov.ro/', logo: '/uploads/beca_rumania.png' },

  { titulo: 'Scholarships for International Students – Italia 2025/26',
    tipo: 'beca', institucion: 'Gobierno de Italia',
    pais: 'Italia', area: 'Posgrado',
    descripcion: 'Becas del gobierno italiano para estudiantes internacionales en universidades italianas para el año académico 2025/26.',
    link_oficial: 'https://studyinitaly.esteri.it/en', logo: '/uploads/beca_italia_2025.png' },

  { titulo: 'Women in STEM Scholarship – British Council',
    tipo: 'beca', institucion: 'British Council',
    pais: 'Reino Unido', area: 'STEM',
    descripcion: 'Becas del British Council para mujeres que deseen estudiar carreras de Ciencia, Tecnología, Ingeniería y Matemáticas en el Reino Unido.',
    link_oficial: 'https://www.britishcouncil.org/study-work-abroad/in-uk/scholarship-women-stem', logo: '/uploads/beca_women_stem.png' },

  { titulo: 'Máster en Banca y Mercados Financieros – Fundación UCEIF 2025',
    tipo: 'beca', institucion: 'Fundación UCEIF – AUIP',
    pais: 'España', area: 'Finanzas',
    descripcion: 'Becas para cursar el Máster en Banca y Mercados Financieros en España a través de Fundación UCEIF y AUIP 2025.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=c3e4f0f75a&e=60ad82fd0a', logo: '/uploads/beca_uceif.png' },

  { titulo: 'Programa de Doctorado Interdisciplinario – BREATH',
    tipo: 'beca', institucion: 'BREATH – Université d\'Angers',
    pais: 'Francia', area: 'Doctorado',
    descripcion: 'Programa de Doctorado Interdisciplinario BREATH en la Universidad de Angers, Francia, enfocado en investigación avanzada.',
    link_oficial: 'https://breath.univ-angers.fr/en/about-breath/presentation.html', logo: '/uploads/beca_breath.png' },

  { titulo: 'Portal SNP – Sistema Nacional de Posgrados México',
    tipo: 'beca', institucion: 'CONAHCYT – SNP',
    pais: 'México', area: 'Posgrado',
    descripcion: 'Portal de consultas del Sistema Nacional de Posgrados (SNP) de México con oferta de programas de posgrado financiados.',
    link_oficial: 'https://secihti.mx/consultas-snp/', logo: '/uploads/beca_snp_mexico.png' },

  { titulo: 'Becas OEA – Organización de Estados Americanos',
    tipo: 'beca', institucion: 'Organización de Estados Americanos (OEA)',
    pais: 'Estados Unidos', area: 'Posgrado',
    descripcion: 'Programa de becas académicas de la OEA para cursar programas de posgrado en países miembros de la organización.',
    link_oficial: 'https://www.oas.org/es/becas/', logo: '/uploads/beca_oea.png' },

  { titulo: 'Becas de Maestría – Azerbaiyán',
    tipo: 'beca', institucion: 'Ministerio de Educación de Azerbaiyán',
    pais: 'Azerbaiyán', area: 'Posgrado',
    descripcion: 'Programa de becas del gobierno de Azerbaiyán para estudiantes internacionales de maestría.',
    link_oficial: 'https://studyinazerbaijan.edu.az/', logo: '/uploads/beca_azerbaijan.png' },

  { titulo: 'Becas de Posgrado – Universidad de Valencia 2025',
    tipo: 'beca', institucion: 'AUIP – Universidad de Valencia',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Becas para cursar programas de Posgrado en la Universidad de Valencia 2025 a través de AUIP.',
    link_oficial: 'https://www.uv.es/uvweb/universidad/es/estudios-postgrado/masteres-oficiales/becas-ayudas/universidad-valencia/becas-uv-auip-1285978856967.html', logo: '/uploads/beca_valencia_2025.png' },

  { titulo: 'Programa Becas Postgrado Andalucía 2025 – Federico García Lorca',
    tipo: 'beca', institucion: 'AUIP – Universidades Públicas de Andalucía',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Becas del Programa Federico García Lorca 2025 para realizar másteres en Universidades Públicas de Andalucía.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=c3e4f0f75a&e=60ad82fd0a', logo: '/uploads/beca_andalucia_2025.png' },

  { titulo: 'Becas Postdoctorales – Universidad de La Sorbona',
    tipo: 'beca', institucion: 'Université Sorbonne',
    pais: 'Francia', area: 'Doctorado',
    descripcion: 'Becas postdoctorales de la Universidad de La Sorbona para investigadores internacionales en diversas áreas del conocimiento.',
    link_oficial: 'https://www.sorbonne-universite.fr/en/news/msca-postdoctoral-fellowships-sorbonne-universite-and-its-alliance-2025', logo: '/uploads/beca_sorbonne.png' },

  { titulo: 'Becas ICETEX Colombia – Extranjeros 2025',
    tipo: 'beca', institucion: 'ICETEX',
    pais: 'Colombia', area: 'Posgrado',
    descripcion: 'Programa de reciprocidad del ICETEX para estudiantes extranjeros que deseen cursar programas de posgrado en Colombia 2025.',
    link_oficial: 'https://web.icetex.gov.co/becas/programa-de-reciprocidad-para-extranjeros-en-colombia', logo: '/uploads/beca_icetex_2025.png' },

  { titulo: 'DAAD – Base de Datos de Becas Alemania',
    tipo: 'beca', institucion: 'DAAD',
    pais: 'Alemania', area: 'Posgrado',
    descripcion: 'Base de datos del DAAD con todas las becas disponibles para estudiar en Alemania, desde pregrado hasta doctorado.',
    link_oficial: 'https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/', logo: '/uploads/beca_daad.png' },

  { titulo: 'Grants Italian Government 2025-26',
    tipo: 'beca', institucion: 'Ministerio de Relaciones Exteriores de Italia',
    pais: 'Italia', area: 'Posgrado',
    descripcion: 'Becas del Ministerio de Relaciones Exteriores de Italia (MAECI) para estudiantes extranjeros en universidades italianas 2025-26.',
    link_oficial: 'https://studyinitaly.esteri.it/en/call-for-procedure', logo: '/uploads/beca_italia_gov.png' },

  { titulo: 'Becas DAAD EPOS – Posgrado en Desarrollo Sostenible',
    tipo: 'beca', institucion: 'DAAD',
    pais: 'Alemania', area: 'Desarrollo Sostenible',
    descripcion: 'Becas EPOS del DAAD para cursar posgrado en desarrollo sostenible en universidades alemanas de alto prestigio.',
    link_oficial: 'https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50026397', logo: '/uploads/beca_daad_epos.png' },

  { titulo: 'Becas Máster Universitario – Universidad de Alcalá 2025',
    tipo: 'beca', institucion: 'AUIP – Universidad de Alcalá',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Becas para cursar Máster Universitario en la Universidad de Alcalá 2025, en convenio con AUIP.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=91767e1ba4&e=60ad82fd0a', logo: '/uploads/beca_alcala_2025.png' },

  { titulo: 'Becas Máster – Universidad de Cantabria AUIP',
    tipo: 'beca', institucion: 'AUIP – Universidad de Cantabria',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Becas para cursar Másteres Universitarios en la Universidad de Cantabria a través del programa AUIP.',
    link_oficial: 'https://www.mastergted.unican.es/', logo: '/uploads/beca_cantabria.png' },

  { titulo: 'Becas de Maestría – Universidad de Melbourne',
    tipo: 'beca', institucion: 'Universidad de Melbourne',
    pais: 'Australia', area: 'Posgrado',
    descripcion: 'Becas para cursar programas de maestría en la Universidad de Melbourne, una de las mejores universidades del mundo.',
    link_oficial: 'https://scholarships.unimelb.edu.au/awards/graduate-research-scholarships', logo: '/uploads/beca_melbourne.png' },

  { titulo: 'Becas Maestrías – McGill University Canadá',
    tipo: 'beca', institucion: 'McGill University',
    pais: 'Canadá', area: 'Posgrado',
    descripcion: 'Becas para cursar maestrías y programas profesionales en la McGill University de Montreal, Canadá.',
    link_oficial: 'https://www.mcgill.ca/gradapplicants/programs', logo: '/uploads/beca_mcgill.png' },

  { titulo: 'Programa Colaborativo Doctoral en TIC 2025 – Universidad de Jaén',
    tipo: 'beca', institucion: 'AUIP – Universidad de Jaén',
    pais: 'España', area: 'Tecnología',
    descripcion: 'Becas para realizar el Programa Colaborativo Iberoamericano de Formación Doctoral en Tecnologías de la Información y la Comunicación 2025.',
    link_oficial: 'https://www.ujaen.es/internacional/estudiante-internacional/becas-y-ayudas-de-estudio', logo: '/uploads/beca_jaen.png' },

  { titulo: 'Becas Maestrías – Universidad Carlos III de Madrid 2025',
    tipo: 'beca', institucion: 'AUIP – U. Carlos III Madrid',
    pais: 'España', area: 'Posgrado',
    descripcion: 'Becas para cursar Maestrías en la Universidad Carlos III de Madrid a través del programa AUIP 2025.',
    link_oficial: 'https://auip.us16.list-manage.com/track/click?u=42c792ba41f28932c7ac4a618&id=ba633c69c3&e=60ad82fd0a', logo: '/uploads/beca_carlos3_2025.png' },

  { titulo: 'GCUB Programa de Movilidad Internacional – 4ta Edición 2025',
    tipo: 'beca', institucion: 'Grupo Coimbra de Universidades Brasileras (GCUB)',
    pais: 'Brasil', area: 'Movilidad Académica',
    descripcion: 'Cuarta edición del Programa de Movilidad Internacional GCUB-Mob para estudiantes de posgrado de universidades latinoamericanas.',
    link_oficial: 'https://www.gcub.org.br/programas/ativos/fourth-edition-of-the-gcub-international-mobility-program-gcub-mob-gcub-mob-call-for-applications-no-001-2025/', logo: '/uploads/beca_gcub.png' },

  { titulo: 'Becas Maestría – Italia Posgrado 2025',
    tipo: 'beca', institucion: 'Universidades Italianas',
    pais: 'Italia', area: 'Posgrado',
    descripcion: 'Becas para estudiar maestrías en diversas universidades italianas con financiamiento del gobierno y fundaciones privadas.',
    link_oficial: 'https://studyinitaly.esteri.it/ListaBandi', logo: '/uploads/beca_italia_maestrias.png' },

  { titulo: 'ETH Zurich – Excellence Scholarship & Opportunity Programme (ESOP)',
    tipo: 'beca', institucion: 'ETH Zurich',
    pais: 'Suiza', area: 'Ingeniería',
    descripcion: 'El Excellence Scholarship & Opportunity Programme (ESOP) de ETH Zurich financia estudios de maestría a los mejores estudiantes internacionales.',
    link_oficial: 'https://ethz.ch/students/en/studies/financial/scholarships/excellencescholarship.html', logo: '/uploads/beca_eth.png' },

  { titulo: 'AUIP–CRISCOS Movilidad Internacional de Profesores e Investigadores',
    tipo: 'intercambio', institucion: 'AUIP – CRISCOS',
    pais: 'España', area: 'Movilidad Académica',
    descripcion: 'Programa de movilidad internacional para profesores, investigadores y estudiantes a través de AUIP y el Consejo de Rectores para la Integración de la Subregión Centro Oeste de Sudamérica (CRISCOS).',
    link_oficial: 'https://auip.org/es/becas-auip/2944-becas-auip310', logo: '/uploads/beca_criscos.png' },

  { titulo: 'Becas AGCID Chile – Cooperación Sur Sur 2026',
    tipo: 'beca', institucion: 'Agencia Chilena de Cooperación Internacional (AGCID)',
    pais: 'Chile', area: 'Posgrado',
    descripcion: 'Programa de Becas de la Cooperación Sur Sur de la República de Chile, Convocatoria 2026. Financiamiento para estudios en universidades chilenas.',
    link_oficial: 'https://www.agci.cl/index.php/becas/becas-para-extranjeros/105-encuentra-tu-beca/1694-infobecaextr-4/?tipo=2&idNew=314', logo: '/uploads/beca_agcid.png' },

  { titulo: 'Programa de Estudantes-Convênio de Pós-Graduação (PEC-PG)',
    tipo: 'beca', institucion: 'Gobierno de Brasil – CAPES/CNPq',
    pais: 'Brasil', area: 'Doctorado',
    descripcion: 'Programa PEC-PG del gobierno de Brasil para estudiantes de doctorado y maestría de países en desarrollo con financiamiento completo.',
    link_oficial: 'https://www.gov.br/capes/pt-br/acesso-a-informacao/acoes-e-programas/bolsas/bolsas-e-auxilios-internacionais/encontre-aqui/paises/multinacional/programa-de-estudantes-convenio-de-pos-graduacao-pec-pg', logo: '/uploads/beca_pecpg.png' },
];

async function seed() {
  console.log(`\n🌱 Insertando ${becas.length} becas con imágenes y links reales...\n`);
  let ok = 0, err = 0;
  for (const b of becas) {
    try {
      await pool.execute(
        `INSERT INTO becas (tipo, titulo, institucion, pais, area, descripcion, link_oficial, logo, creado_por, activo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1)`,
        [b.tipo, b.titulo, b.institucion, b.pais, b.area, b.descripcion, b.link_oficial, b.logo]
      );
      console.log(`  ✅ ${b.titulo}`);
      ok++;
    } catch (e) {
      console.error(`  ❌ ${b.titulo}: ${e.message}`);
      err++;
    }
  }
  console.log(`\n📊 Insertadas: ${ok} | Errores: ${err}`);
  process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });
