import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Globe,
  Trophy,
  Video
} from 'lucide-react';

export const OPPORTUNITY_TYPES = [
  {
    value: 'beca',
    label: 'Beca',
    iconLabel: '🎓 Beca',
    emoji: '🎓',
    icon: GraduationCap,
    chartColor: '#2563EB',
    gradient: 'from-[#2563EB] to-[#60A5FA]',
    badge: 'bg-[#DBEAFE] text-[#1D4ED8]'
  },
  {
    value: 'curso',
    label: 'Curso',
    iconLabel: '📚 Curso',
    emoji: '📚',
    icon: BookOpen,
    chartColor: '#16A34A',
    gradient: 'from-[#16A34A] to-[#86EFAC]',
    badge: 'bg-[#DCFCE7] text-[#15803D]'
  },
  {
    value: 'pasantia',
    label: 'Pasantía',
    iconLabel: '💼 Pasantía',
    emoji: '💼',
    icon: Briefcase,
    chartColor: '#F97316',
    gradient: 'from-[#F97316] to-[#FDBA74]',
    badge: 'bg-[#FFEDD5] text-[#C2410C]'
  },
  {
    value: 'intercambio',
    label: 'Intercambio',
    iconLabel: '🌍 Intercambio',
    emoji: '🌍',
    icon: Globe,
    chartColor: '#7C3AED',
    gradient: 'from-[#7C3AED] to-[#C4B5FD]',
    badge: 'bg-[#EDE9FE] text-[#6D28D9]'
  },
  {
    value: 'webinar',
    label: 'Webinar',
    iconLabel: '🎥 Webinar',
    emoji: '🎥',
    icon: Video,
    chartColor: '#0891B2',
    gradient: 'from-[#0891B2] to-[#67E8F9]',
    badge: 'bg-[#CFFAFE] text-[#0E7490]'
  },
  {
    value: 'concurso',
    label: 'Concurso',
    iconLabel: '🏆 Concurso',
    emoji: '🏆',
    icon: Trophy,
    chartColor: '#DC2626',
    gradient: 'from-[#DC2626] to-[#FCA5A5]',
    badge: 'bg-[#FEE2E2] text-[#B91C1C]'
  },
  {
    value: 'postgrado',
    label: 'Postgrado',
    iconLabel: '🎓 Postgrado',
    emoji: '🎓',
    icon: GraduationCap,
    chartColor: '#CA8A04',
    gradient: 'from-[#CA8A04] to-[#FDE047]',
    badge: 'bg-[#FEF9C3] text-[#A16207]'
  }
];

export const getOpportunityType = (value) => {
  return OPPORTUNITY_TYPES.find((type) => type.value === value) || {
    value,
    label: value || 'Oportunidad',
    iconLabel: value || 'Oportunidad',
    emoji: '📌',
    icon: GraduationCap,
    chartColor: '#64748B',
    gradient: 'from-[#64748B] to-[#CBD5E1]',
    badge: 'bg-gray-100 text-gray-600'
  };
};

export const getOpportunityOptions = () => OPPORTUNITY_TYPES.map((type) => ({
  value: type.value,
  label: type.iconLabel,
  icon: type.icon,
  color: type.gradient
}));

export const opportunityChartColors = OPPORTUNITY_TYPES.map((type) => type.chartColor);
