import { createClient } from '@supabase/supabase-js';

type CatRow = {
  id: string;
  name: string;
  age: string;
  gender: 'macho' | 'hembra';
  color: string;
  description: string;
  status: 'disponible' | 'en_proceso' | 'adoptado';
  image_url: string | null;
  photos: string[];
  created_at: string;
};

export type CatInsert = Omit<CatRow, 'id' | 'created_at'>;
export type CatUpdate = Partial<CatInsert>;

// Cliente sin genérico — evita el problema de tipos never
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);