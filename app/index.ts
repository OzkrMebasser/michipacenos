import type { Story, Stat, DonationTier, HowToHelp } from './lib/types';

const CAT_IMGS = [
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=400&h=400&fit=crop',
];

export const STORIES: Story[] = [
  { id: '1', cat_name: 'Canela', adopter_name: 'Familia Ruiz', text: 'Canela llegó a nuestra vida cuando más la necesitábamos. Hoy duerme en la cama con nuestros hijos y llena la casa de amor. ¡Gracias Michi Paceños!', image_url: CAT_IMGS[2] },
  { id: '2', cat_name: 'Pelusa', adopter_name: 'Ana González', text: 'Adopté a Pelusa hace 6 meses y fue la mejor decisión de mi vida. Es mi compañera de home office y me llena de alegría cada día.', image_url: CAT_IMGS[4] },
  { id: '3', cat_name: 'Manchas', adopter_name: 'Carlos & Sofía', text: 'Manchas era tímido al principio, pero con paciencia y amor ahora es el rey de la casa. El proceso de adopción fue muy sencillo.', image_url: CAT_IMGS[0] },
];

export const STATS: Stat[] = [
  { icon: '🐱', value: '1,250+', label: 'Michis rescatados', color: 'text-green-600' },
  { icon: '❤️', value: '980+', label: 'Adopciones exitosas', color: 'text-pink-500' },
  { icon: '💉', value: '1,600+', label: 'Esterilizaciones', color: 'text-teal-500' },
  { icon: '🏥', value: '350+', label: 'Emergencias atendidas', color: 'text-green-700' },
];

export const DONATION_TIERS: DonationTier[] = [
  { amount: 150, title: 'Alimento', description: 'Para 1 michi por una semana', icon: '🍽️' },
  { amount: 300, title: 'Vacunas', description: 'Protección para 1 michi', icon: '💉' },
  { amount: 600, title: 'Esterilización', description: 'Ayuda a prevenir más abandono', icon: '🏥' },
  { amount: 1500, title: 'Emergencia', description: 'Atención médica que salva vidas', icon: '🚨' },
];

export const HOW_TO_HELP: HowToHelp[] = [
  { icon: '🏠', title: 'Hogar temporal', description: 'Brinda un espacio seguro mientras encuentran su hogar definitivo.' },
  { icon: '🚐', title: 'Transporte', description: 'Ayuda a trasladar michis a sus citas médicas u hogares temporales.' },
  { icon: '🤝', title: 'Voluntariado', description: 'Únete a nuestro equipo y sé parte del cambio.' },
  { icon: '🎁', title: 'Donaciones', description: 'Alimento, medicinas, arenas, transportadoras y más.' },
  { icon: '📢', title: 'Difunde', description: 'Comparte nuestros michis y publicaciones en tus redes.' },
  { icon: '📅', title: 'Eventos', description: 'Participa en nuestras ferias de adopción y actividades.' },
];