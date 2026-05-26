import type { Cat, Story, Stat, DonationTier, HowToHelp } from './types';

export const CATS: Cat[] = [
  {
    id: '1',
    name: 'Luna',
    age_months: 8,
    gender: 'hembra',
    personalities: ['juguetona', 'cariñosa'],
    image_url: 'https://res.cloudinary.com/dmtehcd5t/image/upload/v1779422759/michi-cute_ovgwxi.webp',
    sterilized: true,
    vaccinated: true,
    special_needs: false,
  },
  {
    id: '2',
    name: 'Tigre',
    age_months: 24,
    gender: 'macho',
    personalities: ['tranquila', 'independiente'],
    image_url: 'https://res.cloudinary.com/dmtehcd5t/image/upload/v1779422759/michi-cute_ovgwxi.webp',
    sterilized: true,
    vaccinated: true,
    special_needs: false,
  },
  {
    id: '3',
    name: 'Nube',
    age_months: 4,
    gender: 'hembra',
    personalities: ['curiosa', 'activa'],
    image_url: 'https://res.cloudinary.com/dmtehcd5t/image/upload/v1779422759/michi-cute_ovgwxi.webp',
    sterilized: false,
    vaccinated: true,
    special_needs: false,
  },
  {
    id: '4',
    name: 'Mango',
    age_months: 36,
    gender: 'macho',
    personalities: ['sociable', 'cariñosa'],
    image_url: 'https://res.cloudinary.com/dmtehcd5t/image/upload/v1779422759/michi-cute_ovgwxi.webp',
    sterilized: true,
    vaccinated: false,
    special_needs: true,
  },
  {
    id: '5',
    name: 'Perlita',
    age_months: 6,
    gender: 'hembra',
    personalities: ['tímida', 'tranquila'],
    image_url: 'https://res.cloudinary.com/dmtehcd5t/image/upload/v1779422759/michi-cute_ovgwxi.webp',
    sterilized: false,
    vaccinated: true,
    special_needs: false,
  },
  {
    id: '6',
    name: 'Canelo',
    age_months: 18,
    gender: 'macho',
    personalities: ['juguetona', 'activa'],
    image_url: 'https://res.cloudinary.com/dmtehcd5t/image/upload/v1779422759/michi-cute_ovgwxi.webp',
    sterilized: true,
    vaccinated: true,
    special_needs: false,
  },
  {
    id: '7',
    name: 'Oreo',
    age_months: 12,
    gender: 'macho',
    personalities: ['curiosa', 'sociable'],
    image_url: 'https://res.cloudinary.com/dmtehcd5t/image/upload/v1779422759/michi-cute_ovgwxi.webp',
    sterilized: true,
    vaccinated: true,
    special_needs: false,
  },
  {
    id: '8',
    name: 'Canela',
    age_months: 48,
    gender: 'hembra',
    personalities: ['tranquila', 'cariñosa'],
    image_url: 'https://res.cloudinary.com/dmtehcd5t/image/upload/v1779422759/michi-cute_ovgwxi.webp',
    sterilized: true,
    vaccinated: true,
    special_needs: true,
  },
];

export const STORIES: Story[] = [
  {
    id: '1',
    cat_name: 'Michi',
    adopter_name: 'la familia García',
    image_url: 'https://res.cloudinary.com/dmtehcd5t/image/upload/v1779422759/michi-cute_ovgwxi.webp',
    text: 'Michi llegó a nuestra vida y la transformó por completo. Es el rey de la casa y nos llena de alegría cada día.',
  },
  {
    id: '2',
    cat_name: 'Sombra',
    adopter_name: 'Paola',
    image_url: 'https://res.cloudinary.com/dmtehcd5t/image/upload/v1779422759/michi-cute_ovgwxi.webp',
    text: 'Adopté a Sombra hace 6 meses y no me arrepiento nada. Es mi compañera de trabajo remoto favorita.',
  },
  {
    id: '3',
    cat_name: 'Pecas',
    adopter_name: 'Roberto y Ana',
    image_url: 'https://res.cloudinary.com/dmtehcd5t/image/upload/v1779422759/michi-cute_ovgwxi.webp',
    text: 'No sabíamos que nos faltaba algo hasta que Pecas llegó. Ahora no imaginamos la vida sin ella.',
  },
];

export const STATS: Stat[] = [
  { icon: '🐱', value: '256+', label: 'Michis rescatados', color: 'text-green-600' },
  { icon: '🏠', value: '180+', label: 'Hogares encontrados', color: 'text-pink-500' },
  { icon: '💉', value: '624⚠+', label: 'Esterilizados', color: 'text-teal-500' },
  { icon: '❤️', value: '4 años', label: 'Ayudando en La Paz', color: 'text-red-500' },
];

export const DONATION_TIERS: DonationTier[] = [
  { amount: 100, icon: '🍽️', title: 'Alimenta a un michi', description: 'Cubre la comida de un gato por una semana.' },
  { amount: 250, icon: '💊', title: 'Medicamentos', description: 'Ayuda con medicamentos básicos de un rescate.' },
  { amount: 500, icon: '💉', title: 'Vacunación completa', description: 'Cubre el esquema completo de vacunas de un michi.' },
  { amount: 1000, icon: '🏥', title: 'Cirugía de esterilización', description: 'Financia la esterilización de un gato callejero.' },
];

export const HOW_TO_HELP: HowToHelp[] = [
  { icon: '🏡', title: 'Hogar temporal', description: 'Abre tu hogar temporalmente a un michi mientras encuentra su familia permanente.' },
  { icon: '📣', title: 'Difunde', description: 'Comparte nuestras publicaciones y ayuda a que más michis encuentren hogar.' },
  { icon: '🛒', title: 'Donación en especie', description: 'Alimento, arena, medicamentos y artículos de higiene siempre son bienvenidos.' },
  { icon: '🩺', title: 'Apoyo veterinario', description: '¿Eres veterinario/a o estudiante? Tu conocimiento puede salvar vidas.' },
  { icon: '🤝', title: 'Voluntariado', description: 'Únete a nuestro equipo de voluntarios y sé parte directa del rescate.' },
  { icon: '📸', title: 'Fotografía', description: 'Buenas fotos aumentan las posibilidades de adopción. ¿Nos ayudas?' },
];