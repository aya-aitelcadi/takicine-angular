import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilmService } from '../../services/film.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Film, Avis } from '../../models/film.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-film-detail',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.scss']
})
export class FilmDetailComponent implements OnInit {
  filmService = inject(FilmService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);

  film = signal<Film | undefined>(undefined);
  similarFilms = signal<Film[]>([]);
  editingAvisId = signal<number | null>(null);
  aiLoading = signal(false);
  aiResult = signal('');

  formatAiResult(text: string | null | undefined): string {
    if (!text) return '';
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  aiMode = signal<'synopsis' | 'recommande' | 'critique' | ''>('');
  hoveredStar = signal(0);
  selectedStar = signal(0);

  avisForm: FormGroup = this.fb.group({
    commentaire: ['', [Validators.required, Validators.minLength(10)]],
    note: [5, [Validators.required, Validators.min(1), Validators.max(5)]]
  });

  editForm: FormGroup = this.fb.group({
    commentaire: ['', [Validators.required, Validators.minLength(10)]],
    note: [5]
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      const f = this.filmService.getById(id);
      if (!f) { this.router.navigate(['/']); return; }
      this.film.set(f);
      this.similarFilms.set(
        this.filmService.filmsByGenre(f.genre)
          .filter(x => x.id !== id)
          .slice(0, 6)
      );
      this.aiResult.set('');
      this.aiMode.set('');
    });
  }

  get film$() { return this.film()!; }

  formatDuration(min: number): string {
    return `${Math.floor(min/60)}h${(min%60).toString().padStart(2,'0')}`;
  }

  renderStarsArr(note: number): number[] {
    return [1,2,3,4,5];
  }

  isFilled(star: number, note: number): boolean {
    return star <= Math.round(note);
  }

  submitAvis(): void {
    if (!this.auth.isLoggedIn) {
      this.toast.show('warning', 'Connectez-vous pour laisser un avis.', '🔒');
      this.router.navigate(['/inscription']);
      return;
    }
    if (this.avisForm.invalid || this.selectedStar() === 0) {
      this.toast.show('warning', 'Remplissez tous les champs.', '⚠️');
      return;
    }
    const u = this.auth.user()!;
    this.filmService.addAvis(this.film$!.id, {
      auteur: `${u.prenom} ${u.nom}`.trim(),
      note: this.selectedStar(),
      commentaire: this.avisForm.value.commentaire,
      date: new Date().toISOString().split('T')[0]
    });
    this.auth.addPoints(10);
    this.avisForm.reset({ commentaire: '', note: 5 });
    this.selectedStar.set(0);
    this.film.set(this.filmService.getById(this.film$!.id));
    this.toast.show('success', 'Avis ajouté ! +10 points fidélité 🎉', '✅');
  }

  startEdit(avis: Avis): void {
    this.editingAvisId.set(avis.id);
    this.editForm.setValue({ commentaire: avis.commentaire, note: avis.note });
  }

  saveEdit(filmId: number): void {
    const id = this.editingAvisId();
    if (!id) return;
    this.filmService.updateAvis(filmId, id, {
      commentaire: this.editForm.value.commentaire,
      note: this.editForm.value.note,
    });
    this.editingAvisId.set(null);
    this.film.set(this.filmService.getById(filmId));
    this.toast.show('success', 'Avis modifié !', '✅');
  }

  cancelEdit(): void {
    this.editingAvisId.set(null);
  }

  deleteAvis(filmId: number, avisId: number): void {
    this.filmService.deleteAvis(filmId, avisId);
    this.film.set(this.filmService.getById(filmId));
    this.toast.show('info', 'Avis supprimé.', '🗑️');
  }

  isMyAvis(avis: Avis): boolean {
    const u = this.auth.user();
    if (!u) return false;
    return avis.auteur === `${u.prenom} ${u.nom}`.trim();
  }

  // ── AI TOOLS ──
  async askAI(mode: 'synopsis' | 'recommande' | 'critique'): Promise<void> {
    if (!this.film()) return;
    this.aiMode.set(mode);
    this.aiLoading.set(true);
    this.aiResult.set('');

    const f = this.film()!;
    const prompts: Record<string, string> = {
      synopsis: `Tu es un expert en cinéma. Rédige une analyse approfondie et enthousiaste du film "${f.titre}" réalisé par ${f.realisateur} (${f.date.substring(0,4)}), genre: ${f.genre}. Mentionne ses thèmes, son style visuel, et pourquoi il mérite d'être vu. Réponds en français, 3-4 paragraphes.`,
      recommande: `Tu es un conseiller cinéma passionné. Le spectateur a aimé le film "${f.titre}" (${f.genre}). Recommande-lui 5 autres films similaires (pas dans la liste : ${f.titre}), avec pour chacun une courte explication en 1 phrase pourquoi il lui plaira. Format: "🎬 **Titre** — raison". Réponds en français.`,
      critique: `Tu es un critique de cinéma professionnel. Écris une critique courte mais percutante du film "${f.titre}" de ${f.realisateur} (note: ${f.note}/5). Analyse les points forts, les points faibles, et conclus avec une note justifiée. Réponds en français, style magazine.`
    };

    try {
      const response = await fetch('http://localhost:3000/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompts[mode] })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('AI error:', data);
        throw new Error(data?.error || 'AI_ERROR');
      }

      this.aiResult.set(data.text || 'Erreur lors de la génération.');
    } catch (e) {
        this.aiResult.set('Impossible de contacter l’IA. Vérifiez que le serveur IA tourne (node index.js).');
        console.error(e);
    }finally {
      this.aiLoading.set(false);
    }
  }

  aiModeLabel(): string {
    const labels: Record<string, string> = {
      synopsis: '🎬 Analyse du film',
      recommande: '💡 Recommandations IA',
      critique: '✍️ Critique IA'
    };
    return labels[this.aiMode()] || '';
  }
}