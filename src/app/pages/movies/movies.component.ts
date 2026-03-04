import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { FilmService } from '../../services/film.service';
import { ToastService } from '../../services/toast.service';
import { Film, Genre, Classification } from '../../models/film.model';
import { RouterLink } from '@angular/router';

function titreUppercaseValidator(control: AbstractControl) {
  const v: string = control.value || '';
  if (v && v !== v.toUpperCase()) return { notUppercase: true };
  return null;
}

function realisateurFormatValidator(control: AbstractControl) {
  const v: string = (control.value || '').trim();
  if (v && !/^[A-ZÀ-Ÿa-zà-ÿ'\- ]+ [A-ZÀ-Ÿa-zà-ÿ'\- ]+$/.test(v)) return { badFormat: true };
  return null;
}

function pastDateValidator(control: AbstractControl) {
  const v: string = control.value || '';
  if (v && new Date(v) >= new Date()) return { notPast: true };
  return null;
}

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent {
  filmService = inject(FilmService);
  toast = inject(ToastService);
  fb = inject(FormBuilder);

  searchQuery = signal('');
  showModal = signal(false);
  showDeleteModal = signal(false);
  editingId = signal<number | null>(null);
  deleteTarget = signal<number | null>(null);

  readonly genres: Genre[] = [
    'Comédie', 'Action', 'Romance', 'Fantastique', 'Thriller',
    'Science-fiction', 'Drame', 'Jeunesse', 'Aventure', 'Documentaire',
    'TV', 'Historique', 'Animation', 'Western', 'Art'
  ];

  readonly classifications: Classification[] = ['Tout public', '+6', '+10', '+12', '+16', '+18'];

  filmForm: FormGroup = this.fb.group({
    titre: ['', [Validators.required, titreUppercaseValidator]],
    realisateur: ['', [Validators.required, realisateurFormatValidator]],
    date: ['', [Validators.required, pastDateValidator]],
    note: [0, [Validators.min(0), Validators.max(5)]],
    genre: ['Action', Validators.required],
    duree: [90, [Validators.required, Validators.min(1)]],
    classification: ['Tout public', Validators.required],
    image: [''],
    synopsis: ['', [Validators.required, Validators.minLength(30)]]
  });

  get filteredFilms(): Film[] {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.filmService.films();
    return this.filmService.searchFilms(q);
  }

  f(name: string) { return this.filmForm.get(name); }

  openAdd(): void {
    this.editingId.set(null);
    this.filmForm.reset({ genre: 'Action', classification: 'Tout public', note: 0, duree: 90 });
    this.showModal.set(true);
  }

  openEdit(film: Film): void {
    this.editingId.set(film.id);
    this.filmForm.patchValue(film);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.filmForm.markAsUntouched();
  }

  submit(): void {
    this.filmForm.markAllAsTouched();
    if (this.filmForm.invalid) {
      this.toast.show('warning', 'Veuillez corriger les erreurs.', '⚠️');
      return;
    }
    const val = this.filmForm.value;
    if (this.editingId()) {
      this.filmService.updateFilm(this.editingId()!, val);
      this.toast.show('success', 'Film mis à jour !', '✅');
    } else {
      this.filmService.addFilm(val);
      this.toast.show('success', 'Nouveau film ajouté !', '🎬');
    }
    this.closeModal();
  }

  openDelete(id: number): void {
    this.deleteTarget.set(id);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    if (this.deleteTarget()) {
      this.filmService.deleteFilm(this.deleteTarget()!);
      this.toast.show('error', 'Film supprimé !', '🗑️');
    }
    this.showDeleteModal.set(false);
    this.deleteTarget.set(null);
  }

  formatDate(d: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR');
  }

  formatDuration(min: number): string {
    return `${Math.floor(min/60)}h${(min%60).toString().padStart(2,'0')}`;
  }
}
