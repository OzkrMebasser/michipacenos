export type Gender = 'hembra' | 'macho';

export type Personality =
  | 'tranquila'
  | 'juguetona'
  | 'cariñosa'
  | 'independiente'
  | 'tímida'
  | 'sociable'
  | 'curiosa'
  | 'activa';

export interface Cat {
  id: string;
  name: string;
  age_months: number;
  gender: Gender;
  personalities: Personality[];
  image_url: string;
  sterilized: boolean;
  vaccinated: boolean;
  special_needs: boolean;
  description?: string;
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
  | 'cachorro'
  | 'adulto'
  | 'tranquila'
  | 'juguetona'
  | 'especial';