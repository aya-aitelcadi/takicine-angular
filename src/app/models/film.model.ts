export type Genre =
  | 'Comédie' | 'Action' | 'Romance' | 'Fantastique'
  | 'Thriller' | 'Science-fiction' | 'Drame' | 'Jeunesse'
  | 'Aventure' | 'Documentaire' | 'TV' | 'Historique'
  | 'Animation' | 'Western' | 'Art';

export type Classification = 'Tout public' | '+6' | '+10' | '+12' | '+16' | '+18';

export interface Film {
  id: number;
  titre: string;
  realisateur: string;
  date: string;
  note: number;
  synopsis: string;
  image: string;
  genre: Genre;
  duree: number;       // minutes
  classification: Classification;
  avis?: Avis[];
}

export interface Avis {
  id: number;
  auteur: string;
  note: number;
  commentaire: string;
  date: string;
}

export interface User {
  prenom: string;
  nom: string;
  age: number | null;
  email: string;
  points: number;
}
