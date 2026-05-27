export type Gender = 'hembra' | 'macho';
export type AdoptionStatus = 'disponible' | 'en_proceso' | 'adoptado';

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
}
export interface Story {
  id: string;
  cat_name: string;
  adopter_name: string;
  image_url: string;
  text: string;
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

export type FilterKey =
  | 'todos'
  | 'hembra'
  | 'macho'
  | 'disponible'
  | 'en_proceso'
  | 'adoptado';