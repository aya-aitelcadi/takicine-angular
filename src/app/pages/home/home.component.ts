import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FilmService } from '../../services/film.service';
import { Film, Genre } from '../../models/film.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  filmService = inject(FilmService);
  router = inject(Router);

  searchQuery = signal('');
  searchResults = signal<Film[]>([]);
  showSearch = signal(false);
  carouselOffset = signal(0);
  aiQuery = signal('');
  aiSearching = signal(false);
  aiResults = signal<Film[]>([]);
  useAiSearch = signal(false);

  // Load more per genre
  genreVisible: Record<string, number> = {};

  readonly allGenres: Genre[] = [
    'Comédie', 'Action', 'Romance', 'Fantastique', 'Thriller',
    'Science-fiction', 'Drame', 'Jeunesse', 'Aventure', 'Documentaire',
    'TV', 'Historique', 'Animation', 'Western', 'Art'
  ];

  readonly genreIcons: Record<string, string> = {
    'Comédie': '😂', 'Action': '💥', 'Romance': '❤️', 'Fantastique': '✨',
    'Thriller': '😱', 'Science-fiction': '🚀', 'Drame': '🎭', 'Jeunesse': '🌟',
    'Aventure': '🗺️', 'Documentaire': '📽️', 'TV': '📺', 'Historique': '🏛️',
    'Animation': '🎨', 'Western': '🤠', 'Art': '🖼️'
  };

  onSearch(query: string): void {
    this.searchQuery.set(query);
    if (query.length > 1) {
      this.searchResults.set(this.filmService.searchFilms(query));
      this.showSearch.set(true);
    } else {
      this.showSearch.set(false);
      this.searchResults.set([]);
    }
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.showSearch.set(false);
    this.searchResults.set([]);
  }

  goToFilm(id: number): void {
    this.clearSearch();
    this.router.navigate(['/film', id]);
  }

  carouselPrev(): void {
    this.carouselOffset.update(v => Math.max(0, v - 1));
  }

  carouselNext(): void {
    const max = Math.max(0, this.filmService.topFilms().length - 5);
    this.carouselOffset.update(v => Math.min(max, v + 1));
  }

  filmsByGenre(genre: Genre): Film[] {
    return this.filmService.filmsByGenre(genre);
  }

  visibleCount(genre: string): number {
    return this.genreVisible[genre] || 4;
  }

  loadMore(genre: string): void {
    this.genreVisible[genre] = (this.genreVisible[genre] || 4) + 4;
  }

  hasMore(genre: string): boolean {
    return this.filmsByGenre(genre as Genre).length > this.visibleCount(genre);
  }

  renderStars(note: number): boolean[] {
    return [1,2,3,4,5].map(i => i <= Math.round(note));
  }

  formatDuration(min: number): string {
    return `${Math.floor(min/60)}h${(min%60).toString().padStart(2,'0')}`;
  }




  async aiSearch(): Promise<void> {
    const q = this.aiQuery().trim();
    if (!q) return;

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
        synopsis: f.synopsis
      }));

      const r = await fetch('http://localhost:3000/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, catalog })
      });

      const data = await r.json();

      const ids: number[] = data.ids || [];
      const results = ids
        .map(id => this.filmService.getById(id))
        .filter(Boolean) as Film[];

      this.aiResults.set(results);

    } catch (e) {
      console.error(e);
    } finally {
      this.aiSearching.set(false);
    }
  }
  disableAiSearch(): void {
    this.useAiSearch.set(false);
    this.aiResults.set([]);
  }


  

}
