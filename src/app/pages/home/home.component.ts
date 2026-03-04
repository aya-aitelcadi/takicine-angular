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
}
