import { createClient } from '@supabase/supabase-js';

export type Database = {
  public: {
    Tables: {
      cats: {
        Row: {
          id: string;
          name: string;
          age: string;
          gender: 'macho' | 'hembra';
          color: string;
          description: string;
          status: 'disponible' | 'en_proceso' | 'adoptado';
          image_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cats']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['cats']['Insert']>;
      };
    };
  };
};

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);