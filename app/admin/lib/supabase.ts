import { createClient } from '@supabase/supabase-js';

type CatRow = {
  id: string;
  name: string;
  age: string;
  gender: 'macho' | 'hembra';
  color: string;
  description: string;
  status: 'disponible' | 'en_recuperacion' | 'adoptado';
  image_url: string | null;
  photos: string[];
  created_at: string;
   sterilized: boolean;
  sterilization_date: string | null;
  sterilization_reserved_date: string | null;
  deleted_at: string | null;
};

export type CatInsert = Omit<CatRow, 'id' | 'created_at'>;
export type CatUpdate = Partial<CatInsert>;

// Cliente sin genérico — evita el problema de tipos never
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);