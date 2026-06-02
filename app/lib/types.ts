export type Gender = "hembra" | "macho";
export type AdoptionStatus = "disponible" | "en_recuperacion" | "adoptado";

export interface Cat {
  id: string;
  name: string;
  age: string;
  gender: Gender;
  color: string;
  description: string;
  status: AdoptionStatus;
  image_url: string | null;
  photos: string[];
  created_at: string;
  sterilized: boolean;
  sterilization_date: string | null;
  sterilization_reserved_date: string | null;
  deleted_at?: string | null;
  ficha: string | null;
}

export interface Story {
  id: string;
  cat_name: string;
  adopter_name: string;
  image_url: string;
  text: string;
  created_at?: string;
}

export interface Stat {
  icon: string;
  value: string;
  label: string;
  color: string;
}

export interface DonationTier {
  amount: number;
  icon: string;
  title: string;
  description: string;
}

export interface HowToHelp {
  icon: string;
  title: string;
  description: string;
}

export interface Campaign {
  id: string;
  title: string;
  subtitle?: string;
  month?: string;
  date_label?: string;
  place?: string;
  price?: string;
  contact?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  sponsor_logos?: string[];
  facebook_url?: string;
}

export interface Adoption {
  id: string;
  cat_id: string | null;
  adopter_name: string;
  adopter_email?: string;
  adopter_phone?: string;
  adopter_address?: string;
  adoption_date: string;
  adoption_place?: string;
  notes?: string;
  created_at: string;
  follow_ups?: FollowUp[];
  cat?: {
    name: string;
    image_url: string | null;
    sterilized: boolean;
    sterilization_date: string | null;
    sterilization_reserved_date: string | null;
    photos: string[];
  };
  ficha?: string | null;
  
}

export type AdoptionInsert = Omit<Adoption, "id" | "created_at" | "cat">;

export interface FollowUp {
  date: string;
  note: string;
  created_by?: string;
}

export type FilterKey =
  | "todos"
  | "hembra"
  | "macho"
  | "disponible"
  | "en_recuperacion"
  | "adoptado";
