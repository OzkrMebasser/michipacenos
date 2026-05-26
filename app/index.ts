// ─── FAKE DATA ─────────────────────────────────────────────────────────────
// TODO: Replace each function with a real Supabase query, e.g.:
//   import { supabase } from '../lib/supabase'
//   export const getCats = () => supabase.from('cats').select('*').eq('status', 'available')

import type { Cat, Story, Stat, DonationTier, HowToHelp } from './mnt/user-data/outputs/michi-pacenos-src/src/types';

// Using Unsplash cat photos (free to use)
const CAT_IMGS = [
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=400&fit=crop',
];

export const CATS: Cat[] = [
  { id: '1', name: 'Luna', gender: 'hembra', age_months: 5, personalities: ['juguetona', 'cariñosa'], sterilized: true, vaccinated: true, image_url: CAT_IMGS[0], status: 'available', special_needs: false, created_at: '2024-01-10' },
  { id: '2', name: 'Toby', gender: 'macho', age_months: 12, personalities: ['tranquila', 'cariñosa'], sterilized: true, vaccinated: true, image_url: CAT_IMGS[1], status: 'available', special_needs: false, created_at: '2024-01-15' },
  { id: '3', name: 'Mía', gender: 'hembra', age_months: 8, personalities: ['cariñosa', 'curiosa'], sterilized: true, vaccinated: true, image_url: CAT_IMGS[2], status: 'available', special_needs: false, created_at: '2024-02-01' },
  { id: '4', name: 'Simba', gender: 'macho', age_months: 24, personalities: ['tranquila', 'independiente'], sterilized: true, vaccinated: true, image_url: CAT_IMGS[3], status: 'available', special_needs: false, created_at: '2024-02-10' },
  { id: '5', name: 'Nala', gender: 'hembra', age_months: 6, personalities: ['juguetona', 'sociable'], sterilized: true, vaccinated: true, image_url: CAT_IMGS[4], status: 'available', special_needs: false, created_at: '2024-02-20' },
  { id: '6', name: 'Félix', gender: 'macho', age_months: 3, personalities: ['juguetona', 'cariñosa'], sterilized: false, vaccinated: true, image_url: CAT_IMGS[5], status: 'available', special_needs: false, created_at: '2024-03-01' },
  { id: '7', name: 'Cleo', gender: 'hembra', age_months: 36, personalities: ['tranquila', 'especial'], sterilized: true, vaccinated: true, image_url: CAT_IMGS[6], status: 'available', special_needs: true, created_at: '2024-03-05' },
  { id: '8', name: 'Mochi', gender: 'hembra', age_months: 4, personalities: ['curiosa', 'sociable'], sterilized: false, vaccinated: true, image_url: CAT_IMGS[7], status: 'available', special_needs: false, created_at: '2024-03-10' },
];

export const STORIES: Story[] = [
  { id: '1', cat_name: 'Canela', adopter_name: 'Familia Ruiz', text: 'Canela llegó a nuestra vida cuando más la necesitábamos. Hoy duerme en la cama con nuestros hijos y llena la casa de amor. ¡Gracias Michi Paceños!', image_url: CAT_IMGS[2], created_at: '2024-01-20' },
  { id: '2', cat_name: 'Pelusa', adopter_name: 'Ana González', text: 'Adopté a Pelusa hace 6 meses y fue la mejor decisión de mi vida. Es mi compañera de home office y me llena de alegría cada día.', image_url: CAT_IMGS[4], created_at: '2024-02-05' },
  { id: '3', cat_name: 'Manchas', adopter_name: 'Carlos & Sofía', text: 'Manchas era tímido al principio, pero con paciencia y amor ahora es el rey de la casa. El proceso de adopción fue muy sencillo y el equipo siempre estuvo disponible.', image_url: CAT_IMGS[0], created_at: '2024-02-28' },
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

// ─── Supabase integration stubs ──────────────────────────────────────────────
// Uncomment and configure these when you connect Supabase:
//
// import { createClient } from '@supabase/supabase-js'
// export const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY
// )
//
// export async function getCats(filter?: string) {
//   let query = supabase.from('cats').select('*').eq('status', 'available')
//   if (filter && filter !== 'todos') query = query.eq('gender', filter)
//   return query
// }
