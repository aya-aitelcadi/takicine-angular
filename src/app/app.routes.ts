import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'movies',
    loadComponent: () => import('./pages/movies/movies.component').then(m => m.MoviesComponent)
  },
  {
    path: 'film/:id',
    loadComponent: () => import('./pages/film-detail/film-detail.component').then(m => m.FilmDetailComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: 'inscription',
    loadComponent: () => import('./pages/inscription/inscription.component').then(m => m.InscriptionComponent)
  },
  {
    path: 'profil',
    loadComponent: () => import('./pages/profil/profil.component').then(m => m.ProfilComponent)
  },
  { path: '**', redirectTo: '' }
];
