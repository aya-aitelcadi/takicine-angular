import { Component, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { FilmService } from '../../services/film.service';
import { RouterLink } from '@angular/router';

declare var Chart: any;

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements AfterViewInit, OnDestroy {
  filmService = inject(FilmService);
  private charts: any[] = [];

  get stats() { return this.filmService.stats; }
  get films() { return this.filmService.films(); }

  ngAfterViewInit(): void {
    setTimeout(() => this.initCharts(), 100);
  }

  ngOnDestroy(): void {
    this.charts.forEach(c => c.destroy());
  }

  initCharts(): void {
    const films = this.films;

    // Chart 1 — Notes par film
    const ctx1 = (document.getElementById('chart-notes') as HTMLCanvasElement)?.getContext('2d');
    if (ctx1) {
      this.charts.push(new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: films.map(f => f.titre.length > 10 ? f.titre.substring(0, 10) + '…' : f.titre),
          datasets: [{
            label: 'Note',
            data: films.map(f => f.note),
            backgroundColor: 'rgba(245,197,24,0.6)',
            borderColor: '#F5C518',
            borderWidth: 2,
            borderRadius: 6,
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { min: 0, max: 5, ticks: { color: '#A09A90', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { ticks: { color: '#A09A90', font: { size: 9 }, maxRotation: 45 }, grid: { display: false } }
          }
        }
      }));
    }

    // Chart 2 — Par genre
    const genreCounts: Record<string, number> = {};
    films.forEach(f => { genreCounts[f.genre] = (genreCounts[f.genre] || 0) + 1; });
    const ctx2 = (document.getElementById('chart-genres') as HTMLCanvasElement)?.getContext('2d');
    if (ctx2) {
      this.charts.push(new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: Object.keys(genreCounts),
          datasets: [{
            data: Object.values(genreCounts),
            backgroundColor: ['#F5C518','#E63946','#4A90E2','#2DC653','#A855F7','#F97316','#06B6D4','#10B981','#EF4444','#8B5CF6'],
            borderColor: '#16161F',
            borderWidth: 3,
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: '#A09A90', font: { size: 10 } } } }
        }
      }));
    }

    // Chart 3 — Avis par film
    const ctx3 = (document.getElementById('chart-avis') as HTMLCanvasElement)?.getContext('2d');
    if (ctx3) {
      const withAvis = films.filter(f => (f.avis?.length || 0) > 0);
      this.charts.push(new Chart(ctx3, {
        type: 'bar',
        data: {
          labels: withAvis.map(f => f.titre.length > 10 ? f.titre.substring(0, 10) + '…' : f.titre),
          datasets: [{
            label: 'Avis',
            data: withAvis.map(f => f.avis?.length || 0),
            backgroundColor: 'rgba(74,144,226,0.6)',
            borderColor: '#4A90E2',
            borderWidth: 2,
            borderRadius: 6,
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { ticks: { color: '#A09A90', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { ticks: { color: '#A09A90', font: { size: 9 } }, grid: { display: false } }
          }
        }
      }));
    }
  }
}
