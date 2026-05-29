import type { Story, Stat, DonationTier, HowToHelp } from './types';

export const STORIES: Story[] = [
  {
    id: '1',
    cat_name: 'Michi',
    adopter_name: 'la familia García',
    image_url: 'https://images.pexels.com/photos/30239303/pexels-photo-30239303.jpeg',
    text: 'Michi llegó a nuestra vida y la transformó por completo. Es el rey de la casa y nos llena de alegría cada día.',
  },
  {
    id: '2',
    cat_name: 'Sombra',
    adopter_name: 'Paola',
    image_url: 'https://images.pexels.com/photos/5667644/pexels-photo-5667644.jpeg',
    text: 'Adopté a Sombra hace 6 meses y no me arrepiento nada. Es mi compañera de trabajo remoto favorita.',
  },
  {
    id: '3',
    cat_name: 'Pecas',
    adopter_name: 'Roberto y Ana',
    image_url: 'https://images.pexels.com/photos/34450706/pexels-photo-34450706.jpeg',
    text: 'No sabíamos que nos faltaba algo hasta que Pecas llegó. Ahora no imaginamos la vida sin ella.',
  },
];

export const STATS: Stat[] = [
  { icon: '🐱', value: '256+', label: 'Michis rescatados', color: 'text-green-600' },
  { icon: '🏠', value: '256+', label: 'Hogares encontrados', color: 'text-pink-500' },
  { icon: '✂️', value: '624+', label: 'Esterilizaciones', color: 'text-teal-500' },
  { icon: '📅', value: '39',   label: 'Campañas realizadas', color: 'text-red-500' },
];

export const DONATION_TIERS: DonationTier[] = [
  { amount: 100,  icon: '🪱', title: 'Desparasitación',        description: 'Cubre la desparasitación de un gato callejero.' },
  { amount: 200,  icon: '✂️', title: 'Esterilización',         description: 'Financia la esterilización de un gato/a callejero.' },
  { amount: 300,  icon: '🍽️', title: 'Alimento mensual',       description: 'Cubre la comida de un michi en hogar temporal por un mes.' },
  { amount: 500,  icon: '🏥', title: 'Atención de emergencia', description: 'Apoya la atención médica de un rescate urgente.' },
];

export const HOW_TO_HELP: HowToHelp[] = [
  { icon: '🏡', title: 'Hogar temporal',     description: 'Abre tu hogar a un michi mientras encuentra su familia permanente en La Paz, BCS.' },
  { icon: '📣', title: 'Difunde',            description: 'Comparte nuestras publicaciones y ayuda a que más michis encuentren hogar.' },
  { icon: '🛒', title: 'Donación en especie', description: 'Alimento para bebés o adultos, arena, medicamentos y artículos de higiene son bienvenidos.' },
  { icon: '🩺', title: 'Apoyo veterinario',  description: '¿Eres veterinario/a o estudiante? Tu conocimiento puede salvar vidas.' },
  { icon: '🤝', title: 'Voluntariado',       description: 'Únete a nuestro equipo y sé parte directa del rescate y las campañas de esterilización.' },
  { icon: '📸', title: 'Fotografía',         description: 'Buenas fotos aumentan las posibilidades de adopción. ¿Nos ayudas en las ferias?' },
];