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
  aiQuery = signal('');
  aiSearching = signal(false);
  useAiSearch = signal(false);
  aiResults = signal<Film[]>([]);
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
    // Si mode IA activé : on affiche les résultats IA
    if (this.useAiSearch()) {
      return this.aiResults();
    }

    // Sinon : recherche normale actuelle
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

  disableAiSearch(): void {
    this.useAiSearch.set(false);
    this.aiResults.set([]);
    this.aiQuery.set('');
  }

  async aiSearch(): Promise<void> {
    const q = this.aiQuery().trim();
    if (!q) {
      this.toast.show('warning', 'Tape une recherche IA.', '⚠️');
      return;
    }

  this.aiSearching.set(true);
  this.useAiSearch.set(true);

  try {
    const catalog = this.filmService.films().map(f => ({
      id: f.id,
      titre: f.titre,
      genre: f.genre,
      realisateur: f.realisateur,
      date: f.date,
      note: f.note,
      synopsis: f.synopsis,
      classification: f.classification,
      duree: f.duree
    }));

    const r = await fetch('http://localhost:3000/api/ai-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q, catalog })
    });

    const data = await r.json();
    if (!r.ok) throw new Error(data?.error || 'AI_SEARCH_ERROR');

    const ids: number[] = data.ids || [];
    const results = ids
      .map(id => this.filmService.getById(id))
      .filter(Boolean) as Film[];

    this.aiResults.set(results);

    if (results.length === 0) {
      this.toast.show('info', 'Aucun résultat IA. Essaie une autre requête.', '🤖');
    }
  } catch (e) {
    console.error(e);
    this.toast.show('warning', 'Recherche IA indisponible. Retour à la recherche normale.', '⚠️');
    this.disableAiSearch();
  } finally {
    this.aiSearching.set(false);
  }
}

}
